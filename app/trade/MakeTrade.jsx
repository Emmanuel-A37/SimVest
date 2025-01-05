'use client';
import React, { useEffect, useState, useCallback } from 'react';
import useAssetStore from '../hooks/useAssetStore';
import useName from '../hooks/useNameStore';
import useTicker from '../hooks/useTickerStore';
import { tradeValue } from './symbols';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const MakeTrade = () => {
  const { asset } = useAssetStore();
  const { name } = useName();
  const { ticker } = useTicker();

  const [user, setUser] = useState({});
  const [tradeType, setTradeType] = useState('buy');
  const [quantity, setQuantity] = useState(0);
  const [portfolio, setPortfolio] = useState(null);
  const [financialMetrics, setFinancialMetrics] = useState(null);
  const [currentTradeValue, setCurrentTradeValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch('/api/user', { method: 'GET' });
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUser(data);

      const val = await tradeValue(asset, ticker);
      setCurrentTradeValue(val);
      setSuccessMessage('');
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching user data:', error);
      setErrorMessage('Failed to load user data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [asset, ticker]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (asset === 'crypto' && user.portfolio?.crypto) {
      const val = user.portfolio.crypto.find(
        (crypto) => crypto.assetId === `${ticker}-${name}`
      ) || null;
      setPortfolio(val);
      setFinancialMetrics(user.financialMetrics.crypto.remainingFunds);
    } else if (asset === 'stocks' && user.portfolio?.stocks) {
      const val = user.portfolio.stocks.find(
        (stock) => stock.assetId === `${ticker}-${name}`
      ) || null;
      setPortfolio(val);
      setFinancialMetrics(user.financialMetrics.stocks.remainingFunds);
    }
  }, [ticker, asset, user]);

  const handleTrade = async (e) => {
    e.preventDefault();

    if (!quantity || quantity <= 0) {
      setErrorMessage('Please enter a valid quantity.');
      return;
    }

    const tradeDetails = {
      username: user.username,
      assetType: asset,
      assetId: `${ticker}-${name}`,
      assetName: ticker,
      quantity: parseFloat(quantity),
      tradeType,
      pricePerUnit: currentTradeValue,
    };

    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tradeDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Trade failed.');
      }
      
      if(tradeType == "buy"){
        setSuccessMessage(`Trade successful: Bought ${quantity} ${ticker}`);
      }
      else if(tradeType == "sell"){
        setSuccessMessage(`Trade successful: Sold ${quantity} ${ticker}`);
      }
      
      fetchUserData(); 
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred while processing the trade.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!ticker || !name) {
    return <div></div>;
  }

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="lg:w-[50%] p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{name || 'Asset'} ({ticker || 'Ticker'})</CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Current price: {currentTradeValue ? `$${currentTradeValue}` : 'Loading...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-600">
                You own: {portfolio ? portfolio.quantity : 0} {ticker}
              </p>
              <p className="text-sm text-gray-600">
                Spendable: {financialMetrics ? `$${financialMetrics.toFixed(2)}` : 'N/A'}
              </p>
            </div>
          </div>

          <form onSubmit={handleTrade}>
            <div className="mb-4">
              <RadioGroup
                defaultValue="buy"
                onValueChange={(value) => setTradeType(value)}
                className="flex"
              >
                <div className="flex items-center">
                  <RadioGroupItem value="buy" id="buy" />
                  <Label htmlFor="buy" className="ml-2 text-lg">
                    Buy
                  </Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="sell" id="sell" />
                  <Label htmlFor="sell" className="ml-2 text-lg">
                    Sell
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center mb-4">
              <Input
                type="number"
                placeholder="Amount"
                value={quantity}
                required
                onChange={(e) => setQuantity(e.target.value)}
                className="flex-grow border rounded-md p-2 text-lg"
              />
              <Button
                type="submit"
                className="ml-4 px-6 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Place Order'}
              </Button>
            </div>

            {quantity && currentTradeValue !== null && (
              <p className="text-sm text-gray-600">
                Total cost: ${(parseFloat(quantity) * currentTradeValue).toFixed(2)}
              </p>
            )}
          </form>

          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default MakeTrade;
