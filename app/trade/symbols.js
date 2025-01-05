
const FINN_API_KEY = process.env.FINN_KEY;

 export const fetchStockSymbols = async (query) => {
    try {
        console.log(FINN_API_KEY)
        const response = await fetch(
            `https://finnhub.io/api/v1/search?q=${query}&token=ctsj6hhr01qin3bvtbl0ctsj6hhr01qin3bvtblg`
        );
        const data = await response.json();
        const res = data.result.map(({ description, displaySymbol }) => ({
            name: description,
            symbol: displaySymbol,
        })).slice(0, 5);

        return res
    } catch (error) {
        console.error('Error fetching stock symbols:', error);
        return [];
    }
};


 export const fetchCryptoSymbols = async (query) => {
    try {
        console.log(FINN_API_KEY)
        const cryptoUrl = "https://finnhub.io/api/v1/crypto/symbol?exchange=coinbase&token=ctsj6hhr01qin3bvtbl0ctsj6hhr01qin3bvtblg";

        const response = await fetch(cryptoUrl);
        const data = await response.json();

        const filteredData = data.filter(({ description, displaySymbol }) => {
            const searchTerm = query.toLowerCase();
            return (
                description.toLowerCase().includes(searchTerm) ||
                displaySymbol.toLowerCase().includes(searchTerm)
            );
        });

        const res = filteredData.map(({ displaySymbol, description }) => ({
            name: description,
            symbol: displaySymbol,
        })).slice(0, 5);
        
        return res
    } catch (error) {
        console.error('Error fetching crypto symbols:', error);
        return [];
    }
};


export const sevenDays = async (asset, ticker) => {
    try {
        const baseUrl = `https://api.polygon.io/v1/indicators/ema/`;
        const formattedTicker = asset === "crypto" ? `X:${ticker}` : ticker;
        console.log(formattedTicker);
        const params = `?timespan=day&adjusted=true&window=7&series_type=close&order=desc&limit=7&apiKey=WwOajxZs8KyFdedE_lNywWnMkLJbav3I`;
        const url = `${baseUrl}${formattedTicker}${params}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data?.results?.values) {
            const formattedData = data.results.values.map(({ timestamp, value }) => ({
                date: new Date(timestamp).toLocaleDateString(),
                value: value.toFixed(2), 
            }));
            console.log(formattedData)
            return formattedData;
        } else {
            console.error("No valid data returned from the API");
            return [];
        }
    } catch (error) {
        console.error("Error fetching EMA data:", error);
        return [];
    }
};
export const sevenWeeks = async (asset, ticker) => {
    try {
        const baseUrl = `https://api.polygon.io/v1/indicators/ema/`;
        const formattedTicker = asset === "crypto" ? `X:${ticker}` : ticker;
        console.log(formattedTicker);
        const params = `?timespan=week&adjusted=true&window=7&series_type=close&order=desc&limit=7&apiKey=WwOajxZs8KyFdedE_lNywWnMkLJbav3I`;
        const url = `${baseUrl}${formattedTicker}${params}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data?.results?.values) {
            const formattedData = data.results.values.map(({ timestamp, value }) => ({
                date: new Date(timestamp).toLocaleDateString(),
                value: value.toFixed(2), 
            }));
            console.log(formattedData)
            return formattedData;
        } else {
            console.error("No valid data returned from the API");
            return [];
        }
    } catch (error) {
        console.error("Error fetching EMA data:", error);
        return [];
    }
};

export const sevenMonths = async (asset, ticker) => {
    try {
        const baseUrl = `https://api.polygon.io/v1/indicators/ema/`;
        const formattedTicker = asset === "crypto" ? `X:${ticker}` : ticker;
        console.log(formattedTicker);
        const params = `?timespan=month&adjusted=true&window=7&series_type=close&order=desc&limit=7&apiKey=WwOajxZs8KyFdedE_lNywWnMkLJbav3I`;
        const url = `${baseUrl}${formattedTicker}${params}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data?.results?.values) {
            const formattedData = data.results.values.map(({ timestamp, value }) => ({
                date: new Date(timestamp).toLocaleDateString(),
                value: value.toFixed(2), 
            }));
            console.log(formattedData)
            return formattedData;
        } else {
            console.error("No valid data returned from the API");
            return [];
        }
    } catch (error) {
        console.error("Error fetching EMA data:", error);
        return [];
    }
};


export const tradeValue = async (asset, ticker) => {
    try {
        const baseUrl = `https://api.polygon.io/v1/indicators/ema/`;
        const formattedTicker = asset === "crypto" ? `X:${ticker}` : ticker;
        const params = `?timespan=day&adjusted=true&window=1&series_type=close&order=desc&limit=7&apiKey=WwOajxZs8KyFdedE_lNywWnMkLJbav3I`;
        const url = `${baseUrl}${formattedTicker}${params}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data?.results?.values && data.results.values.length > 0) {
            const latestValue = data.results.values[0].value.toFixed(2); 
            console.log(latestValue);
            return latestValue;
        } else {
            console.error("No valid data returned from the API");
            return null;  
        }
    } catch (error) {
        console.error("Error fetching EMA data:", error);
        return null;  
    }
};
