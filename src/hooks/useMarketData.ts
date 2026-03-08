import { useState, useEffect, useCallback, useRef } from "react";

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  volume: string;
  marketCap: string;
  history: number[];
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  time: string;
  category: "market" | "economy" | "tech" | "forex" | "commodity" | "breaking";
  priority: "high" | "medium" | "low";
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface ForexPair {
  pair: string;
  rate: number;
  change: number;
}

export interface Commodity {
  name: string;
  price: number;
  change: number;
  unit: string;
}

const initialStocks: StockData[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 189.84, change: 2.34, changePercent: 1.25, high: 191.20, low: 187.50, open: 188.10, volume: "52.3M", marketCap: "2.95T", history: [185, 186.5, 184, 187, 188, 186, 189, 188.5, 190, 189.84] },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 378.91, change: 4.12, changePercent: 1.10, high: 380.50, low: 375.20, open: 376.00, volume: "23.1M", marketCap: "2.81T", history: [372, 374, 373, 376, 375, 377, 378, 376, 379, 378.91] },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 141.80, change: -0.64, changePercent: -0.45, high: 143.20, low: 140.50, open: 142.30, volume: "18.7M", marketCap: "1.78T", history: [143, 142, 144, 143, 141, 142, 140, 141, 142, 141.80] },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.92, change: 5.21, changePercent: 3.00, high: 179.80, low: 173.50, open: 174.00, volume: "45.2M", marketCap: "1.85T", history: [173, 174, 175, 174, 176, 177, 175, 178, 177, 178.92] },
  { symbol: "TSLA", name: "Tesla Inc.", price: 245.30, change: -4.40, changePercent: -1.76, high: 250.20, low: 243.10, open: 249.70, volume: "89.4M", marketCap: "780B", history: [250, 249, 251, 248, 247, 246, 248, 245, 246, 245.30] },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 875.40, change: 18.60, changePercent: 2.17, high: 880.00, low: 858.30, open: 860.00, volume: "38.9M", marketCap: "2.16T", history: [858, 862, 860, 865, 868, 870, 872, 869, 876, 875.40] },
  { symbol: "META", name: "Meta Platforms", price: 505.75, change: 8.30, changePercent: 1.67, high: 508.20, low: 498.00, open: 499.50, volume: "14.6M", marketCap: "1.29T", history: [498, 500, 499, 502, 501, 503, 504, 502, 506, 505.75] },
  { symbol: "JPM", name: "JPMorgan Chase", price: 198.45, change: 1.78, changePercent: 0.90, high: 199.80, low: 196.20, open: 197.00, volume: "8.3M", marketCap: "572B", history: [196, 197, 196, 198, 197, 198, 199, 198, 199, 198.45] },
  { symbol: "V", name: "Visa Inc.", price: 279.30, change: 3.15, changePercent: 1.14, high: 280.50, low: 276.10, open: 276.50, volume: "5.7M", marketCap: "573B", history: [276, 277, 276, 278, 277, 279, 278, 280, 279, 279.30] },
  { symbol: "WMT", name: "Walmart Inc.", price: 165.20, change: -1.10, changePercent: -0.66, high: 167.00, low: 164.50, open: 166.30, volume: "6.2M", marketCap: "446B", history: [167, 166, 167, 166, 165, 166, 165, 166, 165, 165.20] },
  { symbol: "GS", name: "Goldman Sachs", price: 412.30, change: 6.40, changePercent: 1.58, high: 414.50, low: 406.00, open: 407.20, volume: "2.8M", marketCap: "138B", history: [406, 408, 407, 409, 410, 408, 411, 410, 413, 412.30] },
  { symbol: "BRK.B", name: "Berkshire Hath.", price: 415.80, change: 2.90, changePercent: 0.70, high: 417.00, low: 413.20, open: 413.50, volume: "3.1M", marketCap: "900B", history: [413, 414, 413, 415, 414, 416, 415, 416, 415, 415.80] },
];

const initialIndices: MarketIndex[] = [
  { name: "S&P 500", value: 5234.18, change: 42.30, changePercent: 0.81 },
  { name: "DOW 30", value: 39512.84, change: 312.50, changePercent: 0.80 },
  { name: "NASDAQ", value: 16428.82, change: 198.40, changePercent: 1.22 },
  { name: "RUSSELL 2K", value: 2084.35, change: -12.80, changePercent: -0.61 },
  { name: "FTSE 100", value: 8164.12, change: 28.50, changePercent: 0.35 },
  { name: "DAX", value: 18492.49, change: 156.30, changePercent: 0.85 },
  { name: "NIKKEI 225", value: 40168.07, change: -234.20, changePercent: -0.58 },
  { name: "HANG SENG", value: 16725.86, change: 89.40, changePercent: 0.54 },
];

const initialForex: ForexPair[] = [
  { pair: "EUR/USD", rate: 1.0842, change: 0.0012 },
  { pair: "GBP/USD", rate: 1.2678, change: -0.0008 },
  { pair: "USD/JPY", rate: 151.34, change: 0.42 },
  { pair: "USD/CHF", rate: 0.8812, change: -0.0015 },
  { pair: "AUD/USD", rate: 0.6534, change: 0.0023 },
  { pair: "USD/CAD", rate: 1.3567, change: 0.0018 },
];

const initialCommodities: Commodity[] = [
  { name: "Gold", price: 2342.50, change: 7.80, unit: "/oz" },
  { name: "Silver", price: 28.45, change: 0.32, unit: "/oz" },
  { name: "Crude Oil", price: 78.34, change: -1.24, unit: "/bbl" },
  { name: "Nat Gas", price: 1.78, change: 0.05, unit: "/MMBtu" },
  { name: "Copper", price: 4.12, change: 0.08, unit: "/lb" },
];

const newsPool: Omit<NewsItem, "id" | "time">[] = [
  { headline: "Fed signals potential rate cuts in Q3 as inflation cools to 2.4%", source: "Bloomberg", category: "economy", priority: "high" },
  { headline: "NVIDIA surpasses $2T market cap on AI chip demand surge", source: "Reuters", category: "tech", priority: "high" },
  { headline: "Treasury yields fall to 3-month low on dovish Fed minutes", source: "Bloomberg", category: "market", priority: "high" },
  { headline: "Apple announces $110B stock buyback, largest in US history", source: "CNBC", category: "tech", priority: "high" },
  { headline: "ECB holds rates steady, signals June cut increasingly likely", source: "FT", category: "economy", priority: "medium" },
  { headline: "Oil drops 2% as OPEC+ production concerns mount", source: "Bloomberg", category: "commodity", priority: "medium" },
  { headline: "JPMorgan reports record Q1 trading revenue of $9.8B", source: "Reuters", category: "market", priority: "medium" },
  { headline: "Bitcoin surges past $68K as ETF inflows hit $1.2B daily", source: "CoinDesk", category: "market", priority: "high" },
  { headline: "China GDP growth beats expectations at 5.3% in Q1", source: "Bloomberg", category: "economy", priority: "high" },
  { headline: "US Dollar weakens against major currencies on rate cut bets", source: "FX Street", category: "forex", priority: "medium" },
  { headline: "Amazon Web Services revenue jumps 17% YoY to $25.04B", source: "TechCrunch", category: "tech", priority: "medium" },
  { headline: "Gold hits new all-time high above $2,350 on safe-haven demand", source: "Bloomberg", category: "commodity", priority: "high" },
  { headline: "Bank of Japan signals possible intervention as yen hits 34-year low", source: "Nikkei", category: "forex", priority: "high" },
  { headline: "Microsoft Azure AI revenue triples, cloud margins expand", source: "Bloomberg", category: "tech", priority: "medium" },
  { headline: "US unemployment claims fall to 6-month low at 207K", source: "Labor Dept", category: "economy", priority: "medium" },
  { headline: "Tesla cuts prices across all models in key markets", source: "Reuters", category: "tech", priority: "medium" },
  { headline: "S&P 500 approaches 5,300 as earnings season beats expectations", source: "Bloomberg", category: "market", priority: "high" },
  { headline: "European natural gas prices spike on supply disruption fears", source: "FT", category: "commodity", priority: "medium" },
  { headline: "Meta reports 27% ad revenue growth, AI driving engagement", source: "Bloomberg", category: "tech", priority: "medium" },
  { headline: "IMF raises global growth forecast to 3.2% for 2024", source: "IMF", category: "economy", priority: "high" },
  { headline: "Goldman Sachs upgrades semiconductor sector to Overweight", source: "GS Research", category: "market", priority: "medium" },
  { headline: "BREAKING: SEC approves new ETF regulations for crypto assets", source: "Bloomberg", category: "breaking", priority: "high" },
  { headline: "Copper prices surge to 2-year high on AI data center demand", source: "Bloomberg", category: "commodity", priority: "medium" },
  { headline: "UK inflation falls to 3.2%, boosting rate cut expectations", source: "BBC", category: "economy", priority: "medium" },
  { headline: "Visa reports 8% payment volume growth in cross-border transactions", source: "Reuters", category: "market", priority: "low" },
];

function randomFluctuation(value: number, maxPercent: number): number {
  const change = value * (Math.random() * maxPercent * 2 - maxPercent) / 100;
  return Math.round((value + change) * 100) / 100;
}

export function useMarketData() {
  const [stocks, setStocks] = useState<StockData[]>(initialStocks);
  const [indices, setIndices] = useState<MarketIndex[]>(initialIndices);
  const [forex, setForex] = useState<ForexPair[]>(initialForex);
  const [commodities, setCommodities] = useState<Commodity[]>(initialCommodities);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockData>(initialStocks[0]);
  const newsIndexRef = useRef(0);

  // Initialize news
  useEffect(() => {
    const initial: NewsItem[] = newsPool.slice(0, 8).map((n, i) => ({
      ...n,
      id: `news-${i}`,
      time: `${Math.floor(Math.random() * 12)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")} ${Math.random() > 0.5 ? "AM" : "PM"}`,
    }));
    setNews(initial);
    newsIndexRef.current = 8;
  }, []);

  // Update stocks every 1.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        const newPrice = randomFluctuation(stock.price, 0.3);
        const newChange = Math.round((newPrice - stock.open) * 100) / 100;
        const newChangePercent = Math.round((newChange / stock.open) * 10000) / 100;
        const newHistory = [...stock.history.slice(1), newPrice];
        return {
          ...stock,
          price: newPrice,
          change: newChange,
          changePercent: newChangePercent,
          high: Math.max(stock.high, newPrice),
          low: Math.min(stock.low, newPrice),
          history: newHistory,
        };
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Update selected stock from stocks
  useEffect(() => {
    const updated = stocks.find(s => s.symbol === selectedStock.symbol);
    if (updated) setSelectedStock(updated);
  }, [stocks, selectedStock.symbol]);

  // Update indices every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndices(prev => prev.map(idx => {
        const newValue = randomFluctuation(idx.value, 0.1);
        const newChange = Math.round((newValue - (idx.value - idx.change)) * 100) / 100;
        return { ...idx, value: newValue, change: newChange, changePercent: Math.round((newChange / (newValue - newChange)) * 10000) / 100 };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Update forex every 2s
  useEffect(() => {
    const interval = setInterval(() => {
      setForex(prev => prev.map(f => {
        const newRate = randomFluctuation(f.rate, 0.05);
        return { ...f, rate: newRate, change: Math.round((newRate - f.rate + f.change) * 10000) / 10000 };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Update commodities every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCommodities(prev => prev.map(c => {
        const newPrice = randomFluctuation(c.price, 0.2);
        return { ...c, price: newPrice, change: Math.round((newPrice - c.price + c.change) * 100) / 100 };
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Add news every 8s
  useEffect(() => {
    const interval = setInterval(() => {
      const idx = newsIndexRef.current % newsPool.length;
      const now = new Date();
      const newItem: NewsItem = {
        ...newsPool[idx],
        id: `news-${Date.now()}`,
        time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      };
      setNews(prev => [newItem, ...prev.slice(0, 19)]);
      newsIndexRef.current++;
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return { stocks, indices, forex, commodities, news, selectedStock, setSelectedStock };
}
