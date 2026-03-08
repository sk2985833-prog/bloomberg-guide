import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  sector: string;
  exchange: string;
  pe?: number;
  eps?: number;
  dividend?: number;
  beta?: number;
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  time: string;
  category: "market" | "economy" | "tech" | "forex" | "commodity" | "breaking" | "bonds" | "crypto" | "geopolitics";
  priority: "high" | "medium" | "low" | "flash";
  url?: string;
  image?: string;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  region: string;
}

export interface ForexPair {
  pair: string;
  rate: number;
  change: number;
  bid: number;
  ask: number;
}

export interface Commodity {
  name: string;
  price: number;
  change: number;
  changePercent: number;
  unit: string;
}

export interface BondData {
  name: string;
  yield: number;
  change: number;
  maturity: string;
}

export interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
}

// ═══════════════════ STOCK DEFINITIONS ═══════════════════

const stockDefs = [
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology", exchange: "NASDAQ", marketCap: "2.95T" },
  { symbol: "MSFT", name: "Microsoft Corp.", sector: "Technology", exchange: "NASDAQ", marketCap: "2.81T" },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology", exchange: "NASDAQ", marketCap: "1.78T" },
  { symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer", exchange: "NASDAQ", marketCap: "1.85T" },
  { symbol: "NVDA", name: "NVIDIA Corp.", sector: "Technology", exchange: "NASDAQ", marketCap: "2.16T" },
  { symbol: "TSLA", name: "Tesla Inc.", sector: "Automotive", exchange: "NASDAQ", marketCap: "780B" },
  { symbol: "META", name: "Meta Platforms", sector: "Technology", exchange: "NASDAQ", marketCap: "1.29T" },
  { symbol: "JPM", name: "JPMorgan Chase", sector: "Financials", exchange: "NYSE", marketCap: "572B" },
  { symbol: "V", name: "Visa Inc.", sector: "Financials", exchange: "NYSE", marketCap: "573B" },
  { symbol: "GS", name: "Goldman Sachs", sector: "Financials", exchange: "NYSE", marketCap: "138B" },
  { symbol: "BRK.B", name: "Berkshire Hath.", sector: "Financials", exchange: "NYSE", marketCap: "900B" },
  { symbol: "WMT", name: "Walmart Inc.", sector: "Consumer", exchange: "NYSE", marketCap: "446B" },
  { symbol: "UNH", name: "UnitedHealth Grp", sector: "Healthcare", exchange: "NYSE", marketCap: "488B" },
  { symbol: "XOM", name: "Exxon Mobil", sector: "Energy", exchange: "NYSE", marketCap: "454B" },
  { symbol: "SHEL", name: "Shell PLC", sector: "Energy", exchange: "LSE", marketCap: "218B" },
  { symbol: "ASML", name: "ASML Holding", sector: "Technology", exchange: "EURONEXT", marketCap: "364B" },
  { symbol: "SAP", name: "SAP SE", sector: "Technology", exchange: "XETRA", marketCap: "226B" },
  { symbol: "TSM", name: "Taiwan Semi.", sector: "Technology", exchange: "TWSE", marketCap: "768B" },
  { symbol: "BABA", name: "Alibaba Group", sector: "Technology", exchange: "NYSE", marketCap: "198B" },
  { symbol: "NVO", name: "Novo Nordisk", sector: "Healthcare", exchange: "NYSE", marketCap: "398B" },
  { symbol: "AMD", name: "AMD Inc.", sector: "Technology", exchange: "NASDAQ", marketCap: "225B" },
  { symbol: "NFLX", name: "Netflix Inc.", sector: "Technology", exchange: "NASDAQ", marketCap: "270B" },
  { symbol: "DIS", name: "Walt Disney", sector: "Consumer", exchange: "NYSE", marketCap: "198B" },
  { symbol: "BA", name: "Boeing Co.", sector: "Industrial", exchange: "NYSE", marketCap: "112B" },
];

// Crypto symbols for Finnhub (BINANCE exchange)
const cryptoDefs = [
  { symbol: "BTC", finnhubSymbol: "BINANCE:BTCUSDT", name: "Bitcoin", marketCap: "1.34T" },
  { symbol: "ETH", finnhubSymbol: "BINANCE:ETHUSDT", name: "Ethereum", marketCap: "425B" },
  { symbol: "SOL", finnhubSymbol: "BINANCE:SOLUSDT", name: "Solana", marketCap: "66B" },
  { symbol: "BNB", finnhubSymbol: "BINANCE:BNBUSDT", name: "Binance Coin", marketCap: "87B" },
  { symbol: "XRP", finnhubSymbol: "BINANCE:XRPUSDT", name: "Ripple", marketCap: "29B" },
  { symbol: "ADA", finnhubSymbol: "BINANCE:ADAUSDT", name: "Cardano", marketCap: "17B" },
  { symbol: "DOGE", finnhubSymbol: "BINANCE:DOGEUSDT", name: "Dogecoin", marketCap: "12B" },
  { symbol: "DOT", finnhubSymbol: "BINANCE:DOTUSDT", name: "Polkadot", marketCap: "8.5B" },
  { symbol: "AVAX", finnhubSymbol: "BINANCE:AVAXUSDT", name: "Avalanche", marketCap: "14B" },
  { symbol: "LINK", finnhubSymbol: "BINANCE:LINKUSDT", name: "Chainlink", marketCap: "10B" },
];

// Forex pairs for Finnhub
const forexDefs = [
  { pair: "EUR/USD", finnhubSymbol: "OANDA:EUR_USD" },
  { pair: "GBP/USD", finnhubSymbol: "OANDA:GBP_USD" },
  { pair: "USD/JPY", finnhubSymbol: "OANDA:USD_JPY" },
  { pair: "USD/CHF", finnhubSymbol: "OANDA:USD_CHF" },
  { pair: "AUD/USD", finnhubSymbol: "OANDA:AUD_USD" },
  { pair: "USD/CAD", finnhubSymbol: "OANDA:USD_CAD" },
  { pair: "EUR/GBP", finnhubSymbol: "OANDA:EUR_GBP" },
  { pair: "USD/CNH", finnhubSymbol: "OANDA:USD_CNH" },
  { pair: "USD/INR", finnhubSymbol: "OANDA:USD_INR" },
  { pair: "NZD/USD", finnhubSymbol: "OANDA:NZD_USD" },
  { pair: "EUR/JPY", finnhubSymbol: "OANDA:EUR_JPY" },
  { pair: "GBP/JPY", finnhubSymbol: "OANDA:GBP_JPY" },
];

// ═══════════════════ INITIAL FALLBACK DATA ═══════════════════

const initialStocks: StockData[] = stockDefs.map(d => ({
  ...d, price: 100, change: 0, changePercent: 0, high: 100, low: 100, open: 100,
  volume: "0", history: Array(15).fill(100), pe: 0, eps: 0, dividend: 0, beta: 1,
}));

const initialIndices: MarketIndex[] = [
  { name: "S&P 500", value: 5234.18, change: 42.30, changePercent: 0.81, region: "Americas" },
  { name: "DOW 30", value: 39512.84, change: 312.50, changePercent: 0.80, region: "Americas" },
  { name: "NASDAQ", value: 16428.82, change: 198.40, changePercent: 1.22, region: "Americas" },
  { name: "RUSSELL 2K", value: 2084.35, change: -12.80, changePercent: -0.61, region: "Americas" },
  { name: "S&P/TSX", value: 22184.60, change: 85.40, changePercent: 0.39, region: "Americas" },
  { name: "BOVESPA", value: 128432.50, change: -456.80, changePercent: -0.35, region: "Americas" },
  { name: "FTSE 100", value: 8164.12, change: 28.50, changePercent: 0.35, region: "Europe" },
  { name: "DAX", value: 18492.49, change: 156.30, changePercent: 0.85, region: "Europe" },
  { name: "CAC 40", value: 8184.75, change: 42.10, changePercent: 0.52, region: "Europe" },
  { name: "STOXX 600", value: 512.38, change: 3.24, changePercent: 0.64, region: "Europe" },
  { name: "IBEX 35", value: 11084.20, change: -28.40, changePercent: -0.26, region: "Europe" },
  { name: "SMI", value: 11842.30, change: 62.80, changePercent: 0.53, region: "Europe" },
  { name: "NIKKEI 225", value: 40168.07, change: -234.20, changePercent: -0.58, region: "Asia-Pacific" },
  { name: "HANG SENG", value: 16725.86, change: 89.40, changePercent: 0.54, region: "Asia-Pacific" },
  { name: "SHANGHAI", value: 3078.42, change: 12.60, changePercent: 0.41, region: "Asia-Pacific" },
  { name: "SENSEX", value: 74248.22, change: 428.60, changePercent: 0.58, region: "Asia-Pacific" },
  { name: "KOSPI", value: 2684.35, change: -18.40, changePercent: -0.68, region: "Asia-Pacific" },
  { name: "ASX 200", value: 7852.40, change: 34.20, changePercent: 0.44, region: "Asia-Pacific" },
  { name: "NIFTY 50", value: 22584.30, change: 142.80, changePercent: 0.64, region: "Asia-Pacific" },
  { name: "STRAITS T", value: 3284.65, change: 8.40, changePercent: 0.26, region: "Asia-Pacific" },
];

const initialForex: ForexPair[] = forexDefs.map(d => ({
  pair: d.pair, rate: 1, change: 0, bid: 1, ask: 1,
}));

const initialCommodities: Commodity[] = [
  { name: "Gold", price: 2342.50, change: 7.80, changePercent: 0.33, unit: "/oz" },
  { name: "Silver", price: 28.45, change: 0.32, changePercent: 1.14, unit: "/oz" },
  { name: "WTI Crude", price: 78.34, change: -1.24, changePercent: -1.56, unit: "/bbl" },
  { name: "Brent Crude", price: 82.18, change: -0.96, changePercent: -1.16, unit: "/bbl" },
  { name: "Natural Gas", price: 1.78, change: 0.05, changePercent: 2.89, unit: "/MMBtu" },
  { name: "Copper", price: 4.12, change: 0.08, changePercent: 1.98, unit: "/lb" },
  { name: "Platinum", price: 942.30, change: -4.20, changePercent: -0.44, unit: "/oz" },
  { name: "Palladium", price: 1024.50, change: 12.40, changePercent: 1.22, unit: "/oz" },
  { name: "Wheat", price: 584.25, change: -3.50, changePercent: -0.60, unit: "/bu" },
  { name: "Corn", price: 442.75, change: 2.25, changePercent: 0.51, unit: "/bu" },
];

const initialBonds: BondData[] = [
  { name: "US 2Y", yield: 4.72, change: -0.03, maturity: "2026" },
  { name: "US 5Y", yield: 4.28, change: -0.05, maturity: "2029" },
  { name: "US 10Y", yield: 4.21, change: -0.04, maturity: "2034" },
  { name: "US 30Y", yield: 4.38, change: -0.02, maturity: "2054" },
  { name: "DE 10Y", yield: 2.34, change: 0.02, maturity: "2034" },
  { name: "UK 10Y", yield: 4.08, change: -0.03, maturity: "2034" },
  { name: "JP 10Y", yield: 0.88, change: 0.01, maturity: "2034" },
  { name: "CN 10Y", yield: 2.29, change: -0.01, maturity: "2034" },
];

const initialCrypto: CryptoData[] = cryptoDefs.map(d => ({
  symbol: d.symbol, name: d.name, price: 0, change: 0, changePercent: 0, marketCap: d.marketCap,
}));

// ═══════════════════ NEWS POOL (fallback) ═══════════════════

const newsPool: Omit<NewsItem, "id" | "time">[] = [
  { headline: "FLASH: Fed signals potential rate cuts in Q3 as inflation cools to 2.4%", source: "Bloomberg", category: "breaking", priority: "flash" },
  { headline: "NVIDIA surpasses $2T market cap on unprecedented AI chip demand surge", source: "Reuters", category: "tech", priority: "high" },
  { headline: "Treasury yields fall to 3-month low on dovish Fed minutes, 10Y at 4.21%", source: "Bloomberg", category: "bonds", priority: "high" },
  { headline: "Apple announces $110B stock buyback program, largest in US corporate history", source: "CNBC", category: "tech", priority: "high" },
  { headline: "ECB holds rates steady at 4.5%, signals June cut increasingly likely", source: "FT", category: "economy", priority: "medium" },
  { headline: "Brent crude drops 2.1% as OPEC+ production compliance concerns mount", source: "Bloomberg", category: "commodity", priority: "medium" },
  { headline: "JPMorgan reports record Q1 trading revenue of $9.8B, beats consensus by 14%", source: "Reuters", category: "market", priority: "medium" },
  { headline: "Bitcoin surges past $68K as spot ETF daily inflows hit record $1.2B", source: "CoinDesk", category: "crypto", priority: "high" },
  { headline: "China Q1 GDP growth beats expectations at 5.3%, property sector weak", source: "Bloomberg", category: "economy", priority: "high" },
  { headline: "FLASH: US Dollar index weakens 0.8% as rate cut expectations intensify", source: "FX Street", category: "forex", priority: "flash" },
  { headline: "Gold hits new all-time high above $2,350/oz on safe-haven demand", source: "Bloomberg", category: "commodity", priority: "high" },
  { headline: "Bank of Japan signals possible FX intervention as yen hits 34-year low", source: "Nikkei", category: "forex", priority: "high" },
];

// ═══════════════════ API HELPER ═══════════════════

async function finnhubCall(endpoint: string, params?: Record<string, string>) {
  try {
    const { data, error } = await supabase.functions.invoke('finnhub-proxy', {
      body: { endpoint, params },
    });
    if (error) throw error;
    return data;
  } catch (e) {
    console.warn('Finnhub API call failed:', endpoint, e);
    return null;
  }
}

function randomFluctuation(value: number, maxPercent: number): number {
  const change = value * (Math.random() * maxPercent * 2 - maxPercent) / 100;
  return Math.round((value + change) * 100) / 100;
}

// ═══════════════════ MAIN HOOK ═══════════════════

export function useMarketData() {
  const [stocks, setStocks] = useState<StockData[]>(initialStocks);
  const [indices, setIndices] = useState<MarketIndex[]>(initialIndices);
  const [forex, setForex] = useState<ForexPair[]>(initialForex);
  const [commodities, setCommodities] = useState<Commodity[]>(initialCommodities);
  const [bonds, setBonds] = useState<BondData[]>(initialBonds);
  const [crypto, setCrypto] = useState<CryptoData[]>(initialCrypto);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockData>(initialStocks[0]);
  const [isLive, setIsLive] = useState(false);
  const newsIndexRef = useRef(0);
  const previousPricesRef = useRef<Record<string, number>>({});

  // ─── Fetch real stock quotes from Finnhub ───
  const fetchStockQuotes = useCallback(async () => {
    const batchSize = 5; // fetch 5 at a time to respect rate limits
    for (let i = 0; i < stockDefs.length; i += batchSize) {
      const batch = stockDefs.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map(async (def) => {
          const data = await finnhubCall('/quote', { symbol: def.symbol });
          return { def, data };
        })
      );

      setStocks(prev => {
        const updated = [...prev];
        for (const { def, data } of results) {
          if (!data || data.c === 0) continue; // skip failed/empty
          const idx = updated.findIndex(s => s.symbol === def.symbol);
          if (idx === -1) continue;
          const prevPrice = previousPricesRef.current[def.symbol] || data.pc || data.c;
          const newHistory = [...updated[idx].history.slice(1), data.c];
          previousPricesRef.current[def.symbol] = data.c;
          updated[idx] = {
            ...updated[idx],
            price: data.c,
            change: Math.round((data.c - data.pc) * 100) / 100,
            changePercent: data.pc ? Math.round(((data.c - data.pc) / data.pc) * 10000) / 100 : 0,
            high: data.h || data.c,
            low: data.l || data.c,
            open: data.o || data.c,
            history: newHistory,
          };
        }
        return updated;
      });

      // Small delay between batches to respect 60 calls/min
      if (i + batchSize < stockDefs.length) {
        await new Promise(r => setTimeout(r, 1200));
      }
    }
    setIsLive(true);
  }, []);

  // ─── Fetch crypto quotes ───
  const fetchCryptoQuotes = useCallback(async () => {
    const results = await Promise.all(
      cryptoDefs.map(async (def) => {
        const data = await finnhubCall('/quote', { symbol: def.finnhubSymbol });
        return { def, data };
      })
    );

    setCrypto(prev => {
      const updated = [...prev];
      for (const { def, data } of results) {
        if (!data || data.c === 0) continue;
        const idx = updated.findIndex(c => c.symbol === def.symbol);
        if (idx === -1) continue;
        updated[idx] = {
          ...updated[idx],
          price: data.c,
          change: Math.round((data.c - data.pc) * 100) / 100,
          changePercent: data.pc ? Math.round(((data.c - data.pc) / data.pc) * 10000) / 100 : 0,
        };
      }
      return updated;
    });
  }, []);

  // ─── Fetch forex quotes ───
  const fetchForexQuotes = useCallback(async () => {
    const results = await Promise.all(
      forexDefs.map(async (def) => {
        const data = await finnhubCall('/quote', { symbol: def.finnhubSymbol });
        return { def, data };
      })
    );

    setForex(prev => {
      const updated = [...prev];
      for (const { def, data } of results) {
        if (!data || data.c === 0) continue;
        const idx = updated.findIndex(f => f.pair === def.pair);
        if (idx === -1) continue;
        const rate = data.c;
        updated[idx] = {
          ...updated[idx],
          rate,
          change: Math.round((rate - data.pc) * 10000) / 10000,
          bid: rate - 0.0002,
          ask: rate + 0.0002,
        };
      }
      return updated;
    });
  }, []);

  // ─── Fetch real news from Finnhub ───
  const fetchNews = useCallback(async () => {
    const data = await finnhubCall('/news', { category: 'general', minId: '0' });
    if (!data || !Array.isArray(data)) return;

    const categoryMap: Record<string, NewsItem["category"]> = {
      'technology': 'tech', 'business': 'market', 'economy': 'economy',
      'forex': 'forex', 'crypto': 'crypto', 'merger': 'market',
    };

    const newsItems: NewsItem[] = data.slice(0, 25).map((item: any) => ({
      id: `fn-${item.id}`,
      headline: item.headline,
      source: item.source,
      time: new Date(item.datetime * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
      }),
      category: categoryMap[item.category?.toLowerCase()] || "market",
      priority: item.headline?.includes('FLASH') || item.headline?.includes('BREAKING') ? "flash" : "medium",
      url: item.url,
      image: item.image,
    }));

    if (newsItems.length > 0) {
      setNews(newsItems);
    }
  }, []);

  // ─── Initial data fetch ───
  useEffect(() => {
    // Load fallback news immediately
    const initial: NewsItem[] = newsPool.slice(0, 12).map((n, i) => ({
      ...n, id: `news-${i}`,
      time: new Date(Date.now() - i * 180000).toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
      }),
    }));
    setNews(initial);

    // Fetch real data
    fetchStockQuotes();
    fetchCryptoQuotes();
    fetchForexQuotes();
    fetchNews();
  }, []);

  // ─── Periodic refresh: stocks every 30s, crypto every 15s, forex every 20s, news every 60s ───
  useEffect(() => {
    const stockInterval = setInterval(fetchStockQuotes, 30000);
    const cryptoInterval = setInterval(fetchCryptoQuotes, 15000);
    const forexInterval = setInterval(fetchForexQuotes, 20000);
    const newsInterval = setInterval(fetchNews, 60000);
    return () => {
      clearInterval(stockInterval);
      clearInterval(cryptoInterval);
      clearInterval(forexInterval);
      clearInterval(newsInterval);
    };
  }, [fetchStockQuotes, fetchCryptoQuotes, fetchForexQuotes, fetchNews]);

  // ─── Micro-fluctuations between API calls (simulate tick movement) ───
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        if (stock.price === 100 && stock.open === 100) return stock; // skip uninitialized
        const newPrice = randomFluctuation(stock.price, 0.05);
        const newChange = Math.round((newPrice - stock.open) * 100) / 100;
        const newChangePercent = stock.open ? Math.round((newChange / stock.open) * 10000) / 100 : 0;
        return {
          ...stock, price: newPrice, change: newChange, changePercent: newChangePercent,
          high: Math.max(stock.high, newPrice), low: Math.min(stock.low, newPrice),
          history: [...stock.history.slice(1), newPrice],
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

  // Micro-fluctuations for indices
  useEffect(() => {
    const interval = setInterval(() => {
      setIndices(prev => prev.map(idx => {
        const newValue = randomFluctuation(idx.value, 0.04);
        const newChange = Math.round((newValue - (idx.value - idx.change)) * 100) / 100;
        return { ...idx, value: newValue, change: newChange, changePercent: Math.round((newChange / (newValue - newChange)) * 10000) / 100 };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Micro-fluctuations for crypto between API calls
  useEffect(() => {
    const interval = setInterval(() => {
      setCrypto(prev => prev.map(c => {
        if (c.price === 0) return c; // skip uninitialized
        const newPrice = randomFluctuation(c.price, 0.15);
        const newChange = Math.round((newPrice - (c.price - c.change)) * 100) / 100;
        return { ...c, price: newPrice, change: newChange, changePercent: Math.round((newChange / (newPrice - newChange)) * 10000) / 100 };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Micro-fluctuations for commodities
  useEffect(() => {
    const interval = setInterval(() => {
      setCommodities(prev => prev.map(c => {
        const newPrice = randomFluctuation(c.price, 0.08);
        const newChange = Math.round((newPrice - c.price + c.change) * 100) / 100;
        return { ...c, price: newPrice, change: newChange, changePercent: Math.round((newChange / (newPrice - newChange)) * 10000) / 100 };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Micro-fluctuations for bonds
  useEffect(() => {
    const interval = setInterval(() => {
      setBonds(prev => prev.map(b => {
        const newYield = Math.round((b.yield + (Math.random() - 0.5) * 0.01) * 100) / 100;
        return { ...b, yield: newYield, change: Math.round((newYield - b.yield + b.change) * 100) / 100 };
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Micro-fluctuations for forex
  useEffect(() => {
    const interval = setInterval(() => {
      setForex(prev => prev.map(f => {
        if (f.rate === 1) return f; // skip uninitialized
        const newRate = randomFluctuation(f.rate, 0.015);
        return { ...f, rate: newRate, bid: newRate - 0.0002, ask: newRate + 0.0002 };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fallback news rotation if real news not available
  useEffect(() => {
    const interval = setInterval(() => {
      // Only add fallback news if we don't have real news
      if (news.length > 0 && news[0]?.id?.startsWith('fn-')) return;
      const idx = newsIndexRef.current % newsPool.length;
      const now = new Date();
      const newItem: NewsItem = {
        ...newsPool[idx], id: `news-${Date.now()}`,
        time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
      };
      setNews(prev => [newItem, ...prev.slice(0, 24)]);
      newsIndexRef.current++;
    }, 8000);
    return () => clearInterval(interval);
  }, [news]);

  return { stocks, indices, forex, commodities, bonds, crypto, news, selectedStock, setSelectedStock, isLive };
}
