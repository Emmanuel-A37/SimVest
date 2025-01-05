import { NextResponse } from "next/server";
import User from '@/app/lib/models/users';
import { connect } from '@/app/lib/db';


export const GET = async (req) => {
    try {
        await connect();
        
        const username = req.headers.get('X-Custom-Username');
        if (!username) {
        return NextResponse.json(
            { error: "User not authenticated" },
            { status: 401 }
        );
        }

        const user = await User.findOne({username : username})
        
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json((user), {status : 200});
        
    } catch (error) {
        return NextResponse.json({error : error}, {status : 500})
    }
}



export const POST = async (req) => {
  try {
    await connect();

    const body = await req.json();
    const { username, assetType, assetId, assetName, quantity, tradeType, pricePerUnit } = body;

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

   
    user.portfolio[assetType] = user.portfolio[assetType] || [];
    user.financialMetrics[assetType] = user.financialMetrics[assetType] || {
      totalPortfolioValue: 50000,
      investmentValue: 0,
      remainingFunds: 50000,
      roi: 0,
    };

    const portfolio = user.portfolio[assetType];
    const financialMetrics = user.financialMetrics[assetType];

    const existingAsset = portfolio.find((item) => item.assetId === assetId);

    if (tradeType === "buy") {
      if (financialMetrics.remainingFunds < quantity * pricePerUnit) {
        return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
      }

      if (existingAsset) {
        const totalCost = existingAsset.averageCost + quantity * pricePerUnit;
        const newQuantity = existingAsset.quantity + quantity;
        existingAsset.averageCost = totalCost;
        existingAsset.quantity = newQuantity;
        existingAsset.value = pricePerUnit;
        existingAsset.currentValue = newQuantity * pricePerUnit;
        existingAsset.change = ((existingAsset.currentValue / existingAsset.averageCost) - 1) * 100;
      } else {
        portfolio.push({
          assetId,
          assetName,
          quantity,
          value: pricePerUnit,
          averageCost: pricePerUnit * quantity,
          currentValue: pricePerUnit * quantity,
          change: 0,
        });
      }

      financialMetrics.remainingFunds -= quantity * pricePerUnit;
      financialMetrics.investmentValue += quantity * pricePerUnit;

    } else if (tradeType === "sell") {
      if (!existingAsset || existingAsset.quantity < quantity) {
        return NextResponse.json({ error: "Insufficient asset quantity" }, { status: 400 });
      }

      existingAsset.quantity -= quantity;
      if (existingAsset.quantity === 0) {
        portfolio.splice(portfolio.indexOf(existingAsset), 1);
      }

      financialMetrics.remainingFunds += quantity * pricePerUnit;
      financialMetrics.investmentValue -= quantity * pricePerUnit;
    }

    financialMetrics.totalPortfolioValue = financialMetrics.investmentValue + financialMetrics.remainingFunds;

    const totalCurrentValue = portfolio.reduce((sum, asset) => sum + (asset.currentValue || 0), 0);
    const totalInvestmentValue = portfolio.reduce((sum, asset) => sum + (asset.averageCost || 0), 0);

    financialMetrics.roi = totalInvestmentValue
      ? ((totalCurrentValue - totalInvestmentValue) / totalInvestmentValue) * 100
      : 0;

    await user.save();

    return NextResponse.json({ message: "Portfolio updated successfully", user }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
};


export const PATCH = async (req) => {
  try {
      await connect();

      const { username } = await req.json();
      if (!username) {
          return NextResponse.json(
              { message: "Username is required" },
              { status: 400 }
          );
      }

      const user = await User.findOne({ username });
      if (!user) {
          return NextResponse.json(
              { message: "User not found" },
              { status: 404 }
          );
      }

      const updatedPortfolioStocks = await Promise.all(
          user.portfolio.stocks.map(async (stock) => {
            const baseUrl = `https://api.polygon.io/v1/indicators/ema/`;
            const formattedTicker = stock.assetName;
            const params = `?timespan=day&adjusted=true&window=1&series_type=close&order=desc&limit=7&apiKey=WwOajxZs8KyFdedE_lNywWnMkLJbav3I`;
            const url = `${baseUrl}${formattedTicker}${params}`;
            const response = await fetch(url);

              if (!response.ok) {
                  throw new Error(`Failed to fetch data for ${stock.assetId}`);
              }

              const data = await response.json();
              const currentPrice = parseFloat(data.results.values[0].value.toFixed(2));

              const currentValue = stock.quantity * currentPrice;
              const change = ((existingAsset.currentValue / existingAsset.averageCost) - 1) * 100;

              return {
                  ...stock,
                  currentValue,
                  change,
              };
          })
      );

      const updatedPortfolioCrypto = await Promise.all(
          user.portfolio.crypto.map(async (crypto) => {
            const baseUrl = `https://api.polygon.io/v1/indicators/ema/`;
            const formattedTicker =  `X:${crypto.assetName}` ;
            const params = `?timespan=day&adjusted=true&window=1&series_type=close&order=desc&limit=7&apiKey=WwOajxZs8KyFdedE_lNywWnMkLJbav3I`;
            const url = `${baseUrl}${formattedTicker}${params}`;
              const response = await fetch(url);

              if (!response.ok) {
                  throw new Error(`Failed to fetch data for ${crypto.assetId}`);
              }

              const data = await response.json();
              const currentPrice = parseFloat(data.results.values[0].value.toFixed(2));

              const currentValue = crypto.quantity * currentPrice;
              const change = ((existingAsset.currentValue / existingAsset.averageCost) - 1) * 100;

              return {
                  ...crypto,
                  currentValue,
                  change,
              };
          })
      );

      user.portfolio.stocks = updatedPortfolioStocks;
      user.portfolio.crypto = updatedPortfolioCrypto;

      const totalStocksValue = updatedPortfolioStocks.reduce(
          (sum, stock) => sum + stock.currentValue,
          0
      );
      const totalCryptoValue = updatedPortfolioCrypto.reduce(
          (sum, crypto) => sum + crypto.currentValue,
          0
      );

      user.portfolioValueHistory.stocks.push({
          date: new Date(),
          totalValue: totalStocksValue,
      });
      user.portfolioValueHistory.crypto.push({
          date: new Date(),
          totalValue: totalCryptoValue,
      });

      
      await user.save();

      return NextResponse.json(
          {
              message: "Portfolio updated successfully",
              portfolio: user.portfolio,
              portfolioValueHistory: user.portfolioValueHistory,
          },
          { status: 200 }
      );
  } catch (error) {
      console.error("Error updating portfolio:", error);
      return NextResponse.json(
          { message: "Internal server error", error: error.message },
          { status: 500 }
      );
  }
};