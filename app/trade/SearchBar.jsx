'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useAssetStore from "../hooks/useAssetStore";
import { useState, useEffect } from "react";
import { fetchCryptoSymbols, fetchStockSymbols } from "./symbols";
import { Button } from '@/components/ui/button';
import useTicker from '../hooks/useTickerStore';
import useNameStore from "../hooks/useNameStore";

const SearchBar = () => {
  const { asset } = useAssetStore();
  const { ticker, setTicker } = useTicker();
  const [value, setValue] = useState('');
  const { name, setName } = useNameStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      let data = [];
      if (asset === 'stocks') {
        data = await fetchStockSymbols(searchTerm);
      } else if (asset === 'crypto' && searchTerm) {
        data = await fetchCryptoSymbols(searchTerm);
      }
      setSuggestions(data || []);
    };

    if (searchTerm.trim()) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setTicker('');
      setValue('');
      setName('');
    }
  }, [searchTerm, asset]);

  const handleSearchClick = () => {
    if (ticker !== searchTerm) {
      setTicker(searchTerm);
    }
    if (name !== value) {
      setName(value);
    }
    setShowSuggestions(false);
  };

  const handleTermClick = (name, symbol) => {
    if (searchTerm !== symbol || value !== name) {
      setSearchTerm(symbol);
      setValue(name);
    }
  };

  const handleInputClick = () => {
    setShowSuggestions(true);
  };

  return (
    <div className="relative mt-5 mb-8 mx-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Trade {asset}</CardTitle>
          <CardDescription>Search for a {asset} to trade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row gap-3 items-center">
            <div className="relative w-[89%]">
              <input
                className="w-full px-4 py-2 border rounded-xl"
                placeholder="Search asset..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={handleInputClick}
              />
              {showSuggestions && suggestions.length > 0 && searchTerm.trim() && (
                <div className="absolute z-10 w-full bg-white border rounded-lg shadow-md mt-1">
                  {suggestions.map(({ name, symbol }) => (
                    <div
                      key={`${name} (${symbol})`}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleTermClick(name, symbol)} // Fixed this
                    >
                      {symbol} ({name})
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="outline"
              className="px-4 py-2 border border-transparent rounded-xl shadow-sm text-base font-medium bg-blue-600 text-white hover:bg-blue-900"
              onClick={handleSearchClick}
            >
              Search
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchBar;
