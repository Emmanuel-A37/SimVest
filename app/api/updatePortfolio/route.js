import { NextResponse } from "next/server";
import User from "@/app/lib/models/users";
import { connect } from "@/app/lib/db";

function polygonSymbol(assetType, assetName, assetId) {
  if (assetType === "crypto") {
    return `X:${assetName}`;
  }
  return  assetName;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const PATCH = async () => {
  try {
    await connect();

   
    const users = await User.find();
    if (!users.length) {
      return NextResponse.json(
        { message: "No users found to update" },
        { status: 404 }
      );
    }


    const updatedUsers = [];
      for (const user of users){
        try {
          const updatedPortfolioStocks = [];
          for (const stock of user.portfolio.stocks) {
              const baseUrl = `https://api.polygon.io/v1/indicators/ema/`;
              const formattedTicker = polygonSymbol("stocks", stock.assetName, stock.assetId);
              const params = `?timespan=day&adjusted=true&window=1&series_type=close&order=desc&limit=7&apiKey=WwOajxZs8KyFdedE_lNywWnMkLJbav3I`;
              const url = `${baseUrl}${formattedTicker}${params}`;
              const response = await fetch(url);

              if (!response.ok) {
                 const errorBody = await response.text();
                  console.error(`[${user.username}] Polygon fetch failed:`, {
                      assetId: stock.assetId,
                      assetName: stock.assetName,
                      formattedTicker,
                      url,
                      status: response.status,
                      errorBody
                  });
                throw new Error(`Failed to fetch data for ${stock.assetId}`);
              }

              const data = await response.json();
              const currentPrice = parseFloat(data.results.values[0].value.toFixed(2));
              const currentValue = stock.quantity * currentPrice;
              const change = ((currentValue / stock.averageCost) - 1) * 100;

                updatedPortfolioStocks.push({
                  ...stock,
                  currentValue,
                  change,
                });
                await sleep(12000);
          };

          const updatedPortfolioCrypto = [];
          for (const crypto of user.portfolio.crypto) {
              const baseUrl = `https://api.polygon.io/v1/indicators/ema/`;
              const formattedTicker = polygonSymbol("crypto", crypto.assetName, crypto.assetId);
              const params = `?timespan=day&adjusted=true&window=1&series_type=close&order=desc&limit=7&apiKey=WwOajxZs8KyFdedE_lNywWnMkLJbav3I`;
              const url = `${baseUrl}${formattedTicker}${params}`;
              const response = await fetch(url);

              if (!response.ok) {
                 const errorBody = await response.text();
                  console.error(`[${user.username}] Polygon fetch failed:`, {
                      assetId: crypto.assetId,
                      assetName: crypto.assetName,
                      formattedTicker,
                      url,
                      status: response.status,
                      errorBody
                  });
                throw new Error(`Failed to fetch data for ${crypto.assetId}`);
              }

              const data = await response.json();
              const currentPrice = parseFloat(data.results.values[0].value.toFixed(2));
              const currentValue = crypto.quantity * currentPrice;
              const change = ((currentValue / crypto.averageCost) - 1) * 100;

                updatedPortfolioCrypto.push({
                  ...crypto,
                  currentValue,
                  change,
                });

                await sleep(12000);
          };

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

          const currentDate = new Date();

          user.portfolioValueHistory.stocks.push({
            date: currentDate,
            totalValue: totalStocksValue,
          });
          user.portfolioValueHistory.crypto.push({
            date: currentDate,
            totalValue: totalCryptoValue,
          });

          await user.save();

           updatedUsers.push({ username: user.username, success: true });;
        } catch (err) {
          console.error(`Failed to update user ${user.username}:`, err);
           updatedUsers.push({ username: user.username, success: false, error: err.message });
        }
      }
    ;

    return NextResponse.json(
      {
        message: "Portfolio updates completed",
        results: updatedUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating portfolios:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
};
