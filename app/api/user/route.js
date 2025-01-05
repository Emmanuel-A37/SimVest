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


