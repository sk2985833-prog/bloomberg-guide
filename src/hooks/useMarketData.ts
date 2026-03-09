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

// ═══════════════════ REALISTIC INITIAL DATA ═══════════════════

const initialStocks: StockData[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 256.61, change: -0.85, changePercent: -0.33, high: 258.27, low: 253.50, open: 253.50, volume: "52.3M", marketCap: "3.92T", history: [254, 255, 253.5, 256, 257, 255.5, 256.5, 257.5, 258, 256.8, 257.2, 256, 257, 256.5, 256.61], sector: "Technology", exchange: "NASDAQ", pe: 32.1, eps: 7.99, dividend: 1.00, beta: 1.24 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 405.14, change: -3.82, changePercent: -0.93, high: 409.17, low: 402.95, open: 402.95, volume: "23.1M", marketCap: "3.01T", history: [403, 405, 404, 407, 408, 406, 407, 408, 409, 406, 405, 406, 407, 405.5, 405.14], sector: "Technology", exchange: "NASDAQ", pe: 34.8, eps: 11.64, dividend: 3.32, beta: 0.87 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 300.86, change: 2.34, changePercent: 0.78, high: 301.98, low: 291.91, open: 291.91, volume: "18.7M", marketCap: "1.85T", history: [292, 294, 293, 296, 298, 297, 299, 300, 301, 300.5, 301, 300, 302, 301, 300.86], sector: "Technology", exchange: "NASDAQ", pe: 24.2, eps: 12.43, dividend: 0, beta: 1.05 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 209.59, change: -3.62, changePercent: -1.70, high: 212.30, low: 207.11, open: 208.81, volume: "45.2M", marketCap: "2.21T", history: [209, 210, 208, 211, 212, 210, 211, 210, 209, 208, 209, 210, 211, 209.5, 209.59], sector: "Consumer", exchange: "NASDAQ", pe: 42.3, eps: 4.96, dividend: 0, beta: 1.16 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 179.45, change: 1.63, changePercent: 0.92, high: 180.91, low: 175.56, open: 175.72, volume: "38.9M", marketCap: "4.40T", history: [176, 177, 176, 178, 179, 178, 180, 179, 180, 179.5, 180, 179, 181, 179.8, 179.45], sector: "Technology", exchange: "NASDAQ", pe: 55.2, eps: 3.25, dividend: 0.04, beta: 1.72 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 389.06, change: -7.67, changePercent: -1.93, high: 392.99, low: 381.40, open: 389.76, volume: "89.4M", marketCap: "1.25T", history: [390, 392, 389, 391, 393, 390, 388, 385, 383, 385, 387, 389, 391, 389, 389.06], sector: "Automotive", exchange: "NASDAQ", pe: 118.5, eps: 3.28, dividend: 0, beta: 2.08 },
  { symbol: "META", name: "Meta Platforms", price: 634.01, change: -10.85, changePercent: -1.68, high: 638.25, low: 626.78, open: 634.99, volume: "14.6M", marketCap: "1.60T", history: [635, 637, 634, 636, 638, 635, 633, 630, 628, 630, 632, 634, 636, 634, 634.01], sector: "Technology", exchange: "NASDAQ", pe: 25.4, eps: 24.96, dividend: 2.00, beta: 1.18 },
  { symbol: "JPM", name: "JPMorgan Chase", price: 284.95, change: -4.53, changePercent: -1.56, high: 287.20, low: 280.45, open: 283.76, volume: "8.3M", marketCap: "820B", history: [284, 286, 283, 285, 287, 285, 283, 282, 281, 282, 284, 285, 286, 285, 284.95], sector: "Financials", exchange: "NYSE", pe: 13.2, eps: 21.59, dividend: 5.00, beta: 1.07 },
  { symbol: "V", name: "Visa Inc.", price: 312.03, change: -5.33, changePercent: -1.68, high: 315.38, low: 310.15, open: 312.54, volume: "5.7M", marketCap: "640B", history: [313, 314, 312, 314, 315, 313, 312, 311, 310, 311, 312, 313, 314, 312, 312.03], sector: "Financials", exchange: "NYSE", pe: 31.8, eps: 9.81, dividend: 2.36, beta: 0.92 },
  { symbol: "GS", name: "Goldman Sachs", price: 808.40, change: -13.02, changePercent: -1.59, high: 815.16, low: 795.00, open: 803.18, volume: "2.8M", marketCap: "268B", history: [803, 808, 805, 810, 815, 810, 808, 800, 798, 800, 805, 808, 812, 808, 808.40], sector: "Financials", exchange: "NYSE", pe: 16.5, eps: 48.99, dividend: 12.00, beta: 1.32 },
  { symbol: "SHEL", name: "Shell PLC", price: 72.45, change: 0.82, changePercent: 1.15, high: 73.10, low: 71.60, open: 71.80, volume: "12.1M", marketCap: "232B", history: [72, 72.3, 71.8, 72.5, 72.8, 72.4, 72.6, 72.8, 73, 72.5, 72.7, 72.4, 73.1, 72.6, 72.45], sector: "Energy", exchange: "LSE", pe: 10.4, eps: 6.97, dividend: 2.80, beta: 0.58 },
  { symbol: "ASML", name: "ASML Holding", price: 720.50, change: 8.40, changePercent: 1.18, high: 725.00, low: 712.30, open: 714.00, volume: "1.8M", marketCap: "288B", history: [714, 716, 712, 718, 720, 718, 722, 720, 724, 720, 722, 720, 725, 721, 720.50], sector: "Technology", exchange: "EURONEXT", pe: 42.8, eps: 16.83, dividend: 7.20, beta: 1.14 },
  { symbol: "SAP", name: "SAP SE", price: 268.30, change: 3.40, changePercent: 1.28, high: 270.00, low: 265.20, open: 265.80, volume: "3.4M", marketCap: "328B", history: [266, 267, 265, 268, 269, 267, 269, 268, 270, 268.5, 269, 268, 270, 268.5, 268.30], sector: "Technology", exchange: "XETRA", pe: 45.1, eps: 5.95, dividend: 2.40, beta: 0.96 },
  { symbol: "NESN", name: "Nestlé SA", price: 82.15, change: -0.52, changePercent: -0.63, high: 83.00, low: 81.80, open: 82.60, volume: "4.2M", marketCap: "218B", history: [82.6, 82.4, 82.8, 82.2, 82.1, 82.4, 82, 82.2, 81.9, 82.1, 81.9, 82.2, 81.8, 82, 82.15], sector: "Consumer", exchange: "SIX", pe: 20.8, eps: 3.95, dividend: 3.05, beta: 0.48 },
  { symbol: "TSM", name: "Taiwan Semi.", price: 192.40, change: 4.20, changePercent: 2.23, high: 194.00, low: 188.50, open: 189.00, volume: "16.8M", marketCap: "998B", history: [189, 190, 188, 191, 192, 190, 193, 192, 194, 192.5, 193, 192, 194, 192.5, 192.40], sector: "Technology", exchange: "TWSE", pe: 28.4, eps: 6.77, dividend: 4.00, beta: 1.12 },
  { symbol: "9984", name: "SoftBank Group", price: 9450, change: 142, changePercent: 1.53, high: 9520, low: 9310, open: 9340, volume: "8.2M", marketCap: "145B", history: [9310, 9340, 9320, 9380, 9400, 9370, 9420, 9410, 9460, 9450, 9470, 9450, 9520, 9460, 9450], sector: "Technology", exchange: "TSE", pe: 19.2, eps: 492, dividend: 48, beta: 1.38 },
  { symbol: "700", name: "Tencent Holdings", price: 442.80, change: -3.20, changePercent: -0.72, high: 448.00, low: 440.50, open: 446.00, volume: "14.5M", marketCap: "520B", history: [446, 445, 447, 444, 443, 445, 442, 444, 443, 442.8, 442, 443, 440.5, 442.5, 442.80], sector: "Technology", exchange: "HKEX", pe: 21.5, eps: 20.60, dividend: 3.60, beta: 0.74 },
  { symbol: "RELIANCE", name: "Reliance Ind.", price: 1285.60, change: 15.40, changePercent: 1.21, high: 1292.00, low: 1272.00, open: 1274.00, volume: "9.8M", marketCap: "218B", history: [1274, 1278, 1272, 1280, 1284, 1280, 1286, 1284, 1290, 1285.6, 1288, 1285, 1292, 1286, 1285.60], sector: "Energy", exchange: "NSE", pe: 26.8, eps: 47.97, dividend: 10, beta: 0.78 },
  { symbol: "BRK.B", name: "Berkshire Hath.", price: 528.40, change: 3.60, changePercent: 0.69, high: 531.00, low: 525.20, open: 525.80, volume: "3.1M", marketCap: "1.14T", history: [526, 527, 525, 528, 529, 527, 530, 528, 531, 528.5, 529, 528, 531, 528.5, 528.40], sector: "Financials", exchange: "NYSE", pe: 9.2, eps: 57.43, dividend: 0, beta: 0.52 },
  { symbol: "WMT", name: "Walmart Inc.", price: 94.82, change: -0.68, changePercent: -0.71, high: 96.00, low: 94.20, open: 95.40, volume: "6.2M", marketCap: "764B", history: [95.4, 95.2, 95.6, 95, 94.8, 95.2, 94.6, 95, 94.8, 94.82, 94.6, 94.8, 94.2, 94.7, 94.82], sector: "Consumer", exchange: "NYSE", pe: 38.2, eps: 2.48, dividend: 0.83, beta: 0.48 },
  { symbol: "UNH", name: "UnitedHealth Grp", price: 472.30, change: 5.40, changePercent: 1.16, high: 476.00, low: 467.40, open: 468.50, volume: "3.6M", marketCap: "436B", history: [468, 470, 468, 472, 474, 472, 475, 473, 476, 472.5, 473, 472, 476, 473, 472.30], sector: "Healthcare", exchange: "NYSE", pe: 19.8, eps: 23.86, dividend: 7.52, beta: 0.62 },
  { symbol: "XOM", name: "Exxon Mobil", price: 118.45, change: 1.82, changePercent: 1.56, high: 119.50, low: 116.80, open: 117.00, volume: "11.4M", marketCap: "472B", history: [117, 117.5, 116.8, 118, 118.5, 118, 119, 118.5, 119.5, 118.5, 118.8, 118.4, 119.5, 118.6, 118.45], sector: "Energy", exchange: "NYSE", pe: 14.2, eps: 8.34, dividend: 3.96, beta: 0.92 },
  { symbol: "SAMSUNG", name: "Samsung Elec.", price: 58400, change: 650, changePercent: 1.13, high: 58800, low: 57750, open: 57800, volume: "15.2M", marketCap: "348B", history: [57800, 57900, 57750, 58100, 58300, 58100, 58400, 58200, 58600, 58400, 58500, 58400, 58800, 58500, 58400], sector: "Technology", exchange: "KRX", pe: 13.2, eps: 4424, dividend: 1444, beta: 1.15 },
  { symbol: "NOVO-B", name: "Novo Nordisk", price: 585.20, change: -8.40, changePercent: -1.42, high: 596.00, low: 582.50, open: 593.60, volume: "2.9M", marketCap: "268B", history: [594, 592, 596, 590, 588, 590, 586, 588, 584, 585.2, 584, 586, 582.5, 585, 585.20], sector: "Healthcare", exchange: "CPH", pe: 36.8, eps: 15.90, dividend: 8.80, beta: 0.64 },
];

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

const initialForex: ForexPair[] = [
  { pair: "EUR/USD", rate: 1.0842, change: 0.0012, bid: 1.0840, ask: 1.0844 },
  { pair: "GBP/USD", rate: 1.2678, change: -0.0008, bid: 1.2676, ask: 1.2680 },
  { pair: "USD/JPY", rate: 151.34, change: 0.42, bid: 151.32, ask: 151.36 },
  { pair: "USD/CHF", rate: 0.8812, change: -0.0015, bid: 0.8810, ask: 0.8814 },
  { pair: "AUD/USD", rate: 0.6534, change: 0.0023, bid: 0.6532, ask: 0.6536 },
  { pair: "USD/CAD", rate: 1.3567, change: 0.0018, bid: 1.3565, ask: 1.3569 },
  { pair: "EUR/GBP", rate: 0.8553, change: 0.0008, bid: 0.8551, ask: 0.8555 },
  { pair: "USD/CNH", rate: 7.2485, change: -0.0124, bid: 7.2480, ask: 7.2490 },
  { pair: "USD/INR", rate: 83.12, change: 0.08, bid: 83.10, ask: 83.14 },
  { pair: "NZD/USD", rate: 0.6012, change: -0.0018, bid: 0.6010, ask: 0.6014 },
  { pair: "EUR/JPY", rate: 164.08, change: 0.56, bid: 164.06, ask: 164.10 },
  { pair: "GBP/JPY", rate: 191.82, change: 0.38, bid: 191.80, ask: 191.84 },
];

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

const initialCrypto: CryptoData[] = [
  { symbol: "BTC", name: "Bitcoin", price: 68425.80, change: 1842.30, changePercent: 2.77, marketCap: "1.34T" },
  { symbol: "ETH", name: "Ethereum", price: 3542.15, change: 78.40, changePercent: 2.26, marketCap: "425B" },
  { symbol: "SOL", name: "Solana", price: 148.92, change: -3.28, changePercent: -2.16, marketCap: "66B" },
  { symbol: "BNB", name: "Binance Coin", price: 584.30, change: 12.80, changePercent: 2.24, marketCap: "87B" },
  { symbol: "XRP", name: "Ripple", price: 0.5284, change: 0.0124, changePercent: 2.40, marketCap: "29B" },
  { symbol: "ADA", name: "Cardano", price: 0.4812, change: -0.0086, changePercent: -1.76, marketCap: "17B" },
  { symbol: "DOGE", name: "Dogecoin", price: 0.1642, change: 0.0082, changePercent: 5.25, marketCap: "23B" },
  { symbol: "DOT", name: "Polkadot", price: 7.84, change: -0.12, changePercent: -1.51, marketCap: "10B" },
  { symbol: "AVAX", name: "Avalanche", price: 38.42, change: 1.24, changePercent: 3.33, marketCap: "14B" },
  { symbol: "LINK", name: "Chainlink", price: 15.28, change: 0.42, changePercent: 2.82, marketCap: "9B" },
];

// ═══════════════════ NEWS POOL ═══════════════════

const newsPool: Omit<NewsItem, "id" | "time">[] = [
  { headline: "FLASH: Fed signals potential rate cuts in Q3 as inflation cools to 2.4%", source: "Bloomberg", category: "breaking", priority: "flash" },
  { headline: "NVIDIA surpasses $2T market cap on unprecedented AI chip demand surge", source: "Reuters", category: "tech", priority: "high" },
  { headline: "Treasury yields fall to 3-month low on dovish Fed minutes, 10Y at 4.21%", source: "Bloomberg", category: "bonds", priority: "high" },
  { headline: "Apple announces $110B stock buyback program, largest in US corporate history", source: "CNBC", category: "tech", priority: "high" },
  { headline: "ECB holds rates steady at 4.5%, signals June cut increasingly likely amid softening data", source: "FT", category: "economy", priority: "medium" },
  { headline: "Brent crude drops 2.1% as OPEC+ production compliance concerns mount", source: "Bloomberg", category: "commodity", priority: "medium" },
  { headline: "JPMorgan Chase reports record Q1 trading revenue of $9.8B, beats consensus by 14%", source: "Reuters", category: "market", priority: "medium" },
  { headline: "Bitcoin surges past $68K as spot ETF daily inflows hit record $1.2B", source: "CoinDesk", category: "crypto", priority: "high" },
  { headline: "China Q1 GDP growth beats expectations at 5.3%, property sector remains weak", source: "Bloomberg", category: "economy", priority: "high" },
  { headline: "FLASH: US Dollar index weakens 0.8% as rate cut expectations intensify", source: "FX Street", category: "forex", priority: "flash" },
  { headline: "Amazon Web Services revenue jumps 17% YoY to $25.04B, margins expand to 37.6%", source: "TechCrunch", category: "tech", priority: "medium" },
  { headline: "Gold hits new all-time high above $2,350/oz on safe-haven demand, geopolitical tensions", source: "Bloomberg", category: "commodity", priority: "high" },
  { headline: "Bank of Japan signals possible FX intervention as yen hits 34-year low at 152", source: "Nikkei", category: "forex", priority: "high" },
  { headline: "Microsoft Azure AI revenue triples YoY, cloud operating margins expand 200bps", source: "Bloomberg", category: "tech", priority: "medium" },
  { headline: "US initial jobless claims fall to 6-month low at 207K, labor market remains tight", source: "Labor Dept", category: "economy", priority: "medium" },
  { headline: "Tesla cuts prices 5-8% across all models in China, Europe; margins under pressure", source: "Reuters", category: "tech", priority: "medium" },
  { headline: "S&P 500 approaches 5,300 level as Q1 earnings season beats expectations by 7.2%", source: "Bloomberg", category: "market", priority: "high" },
  { headline: "European natural gas TTF futures spike 12% on Norwegian maintenance concerns", source: "FT", category: "commodity", priority: "medium" },
  { headline: "Meta reports 27% ad revenue growth, Reality Labs losses narrow to $3.8B", source: "Bloomberg", category: "tech", priority: "medium" },
  { headline: "IMF raises global growth forecast to 3.2% for 2024, warns on fiscal sustainability", source: "IMF", category: "economy", priority: "high" },
  { headline: "Goldman Sachs upgrades global semiconductor sector to Overweight on AI capex cycle", source: "GS Research", category: "market", priority: "medium" },
  { headline: "FLASH: SEC approves new spot Ethereum ETF applications from major asset managers", source: "Bloomberg", category: "breaking", priority: "flash" },
  { headline: "Copper futures surge to 2-year high on AI data center power demand, supply deficit", source: "Bloomberg", category: "commodity", priority: "medium" },
  { headline: "UK CPI inflation falls to 3.2% in March, boosting BOE rate cut expectations for June", source: "BBC", category: "economy", priority: "medium" },
  { headline: "ASML orders beat by 40% as advanced chip demand accelerates globally", source: "Reuters", category: "tech", priority: "high" },
  { headline: "FLASH: Russia-Ukraine tensions escalate; Brent crude jumps 3% in after-hours", source: "Bloomberg", category: "geopolitics", priority: "flash" },
  { headline: "Indian markets hit record highs: Sensex crosses 74,000 on foreign fund inflows", source: "ET", category: "market", priority: "high" },
  { headline: "Samsung reports 10x jump in AI chip revenue, HBM3E production ramps", source: "Korea Herald", category: "tech", priority: "medium" },
  { headline: "Swiss National Bank surprises with 25bp rate cut to 1.50%, first major CB to ease", source: "Bloomberg", category: "economy", priority: "high" },
  { headline: "Novo Nordisk's Ozempic supply expansion plan boosts shares 3.2% in Copenhagen", source: "Reuters", category: "market", priority: "medium" },
];

// ═══════════════════ FINNHUB API (SEQUENTIAL) ═══════════════════

// Symbols that Finnhub free tier supports for quotes
const finnhubStockSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "JPM", "V", "GS"];
const finnhubCryptoSymbols = [
  { symbol: "BTC", finnhub: "BINANCE:BTCUSDT" },
  { symbol: "ETH", finnhub: "BINANCE:ETHUSDT" },
  { symbol: "SOL", finnhub: "BINANCE:SOLUSDT" },
];

let rateLimitHit = false;
let rateLimitResetTime = 0;

async function finnhubCall(endpoint: string, params?: Record<string, string>) {
  // If rate limited, wait until reset
  if (rateLimitHit && Date.now() < rateLimitResetTime) {
    return null;
  }
  rateLimitHit = false;

  try {
    const { data, error } = await supabase.functions.invoke('finnhub-proxy', {
      body: { endpoint, params },
    });
    if (error) throw error;
    
    // Check for rate limit error in response
    if (data?.error && typeof data.error === 'string' && data.error.includes('API limit')) {
      console.warn('Finnhub rate limit hit, backing off for 60s');
      rateLimitHit = true;
      rateLimitResetTime = Date.now() + 60000;
      return null;
    }
    
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
  const fetchIndexRef = useRef(0);

  // ─── Fetch ONE stock at a time sequentially (respects 60/min limit) ───
  const fetchNextStock = useCallback(async () => {
    if (rateLimitHit && Date.now() < rateLimitResetTime) return;
    
    const symbol = finnhubStockSymbols[fetchIndexRef.current % finnhubStockSymbols.length];
    fetchIndexRef.current++;
    
    const data = await finnhubCall('/quote', { symbol });
    if (!data || data.c === 0 || data.c === undefined) return;

    setStocks(prev => {
      const updated = [...prev];
      const idx = updated.findIndex(s => s.symbol === symbol);
      if (idx === -1) return prev;
      const stock = updated[idx];
      updated[idx] = {
        ...stock,
        price: data.c,
        change: Math.round((data.c - data.pc) * 100) / 100,
        changePercent: data.pc ? Math.round(((data.c - data.pc) / data.pc) * 10000) / 100 : 0,
        high: data.h || data.c,
        low: data.l || data.c,
        open: data.o || data.c,
        history: [...stock.history.slice(1), data.c],
      };
      return updated;
    });
    setIsLive(true);
  }, []);

  // ─── Fetch ONE crypto at a time ───
  const cryptoIndexRef = useRef(0);
  const fetchNextCrypto = useCallback(async () => {
    if (rateLimitHit && Date.now() < rateLimitResetTime) return;
    
    const def = finnhubCryptoSymbols[cryptoIndexRef.current % finnhubCryptoSymbols.length];
    cryptoIndexRef.current++;
    
    const data = await finnhubCall('/quote', { symbol: def.finnhub });
    if (!data || data.c === 0 || data.c === undefined) return;

    setCrypto(prev => {
      const updated = [...prev];
      const idx = updated.findIndex(c => c.symbol === def.symbol);
      if (idx === -1) return prev;
      updated[idx] = {
        ...updated[idx],
        price: data.c,
        change: Math.round((data.c - data.pc) * 100) / 100,
        changePercent: data.pc ? Math.round(((data.c - data.pc) / data.pc) * 10000) / 100 : 0,
      };
      return updated;
    });
  }, []);

  // ─── Fetch real news ───
  const fetchNews = useCallback(async () => {
    if (rateLimitHit && Date.now() < rateLimitResetTime) return;
    
    const data = await finnhubCall('/news', { category: 'general', minId: '0' });
    if (!data || !Array.isArray(data)) return;

    const categoryMap: Record<string, NewsItem["category"]> = {
      'technology': 'tech', 'business': 'market', 'economy': 'economy',
      'forex': 'forex', 'crypto': 'crypto', 'merger': 'market',
    };

    const newsItems: NewsItem[] = data.slice(0, 20).map((item: any) => ({
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

    if (newsItems.length > 0) setNews(newsItems);
  }, []);

  // ─── Initialize ───
  useEffect(() => {
    // Start with fallback news
    const initial: NewsItem[] = newsPool.slice(0, 12).map((n, i) => ({
      ...n, id: `news-${i}`,
      time: new Date(Date.now() - i * 180000).toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
      }),
    }));
    setNews(initial);

    // Fetch news (1 API call)
    fetchNews();
  }, []);

  // ─── Sequential API fetching: 1 stock every 2s, 1 crypto every 3s ───
  useEffect(() => {
    const stockInterval = setInterval(fetchNextStock, 2000); // ~30 calls/min for stocks
    const cryptoInterval = setInterval(fetchNextCrypto, 4000); // ~15 calls/min for crypto
    const newsInterval = setInterval(fetchNews, 120000); // news every 2 min
    return () => {
      clearInterval(stockInterval);
      clearInterval(cryptoInterval);
      clearInterval(newsInterval);
    };
  }, [fetchNextStock, fetchNextCrypto, fetchNews]);

  // ─── Micro-fluctuations for realistic real-time feel ───
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        const newPrice = randomFluctuation(stock.price, 0.12);
        const newChange = Math.round((newPrice - stock.open) * 100) / 100;
        const newChangePercent = stock.open ? Math.round((newChange / stock.open) * 10000) / 100 : 0;
        return {
          ...stock, price: newPrice, change: newChange, changePercent: newChangePercent,
          high: Math.max(stock.high, newPrice), low: Math.min(stock.low, newPrice),
          history: [...stock.history.slice(1), newPrice],
        };
      }));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Update selected stock
  useEffect(() => {
    const updated = stocks.find(s => s.symbol === selectedStock.symbol);
    if (updated) setSelectedStock(updated);
  }, [stocks, selectedStock.symbol]);

  // Indices micro-fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setIndices(prev => prev.map(idx => {
        const newValue = randomFluctuation(idx.value, 0.06);
        const newChange = Math.round((newValue - (idx.value - idx.change)) * 100) / 100;
        return { ...idx, value: newValue, change: newChange, changePercent: Math.round((newChange / (newValue - newChange)) * 10000) / 100 };
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Forex micro-fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setForex(prev => prev.map(f => {
        const newRate = randomFluctuation(f.rate, 0.02);
        return { ...f, rate: newRate, bid: newRate - 0.0002, ask: newRate + 0.0002, change: Math.round((newRate - f.rate + f.change) * 10000) / 10000 };
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Commodities micro-fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setCommodities(prev => prev.map(c => {
        const newPrice = randomFluctuation(c.price, 0.10);
        const newChange = Math.round((newPrice - c.price + c.change) * 100) / 100;
        return { ...c, price: newPrice, change: newChange, changePercent: Math.round((newChange / (newPrice - newChange)) * 10000) / 100 };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Bonds micro-fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setBonds(prev => prev.map(b => {
        const newYield = Math.round((b.yield + (Math.random() - 0.5) * 0.02) * 100) / 100;
        return { ...b, yield: newYield, change: Math.round((newYield - b.yield + b.change) * 100) / 100 };
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Crypto micro-fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setCrypto(prev => prev.map(c => {
        const newPrice = randomFluctuation(c.price, 0.3);
        const newChange = Math.round((newPrice - (c.price - c.change)) * 100) / 100;
        return { ...c, price: newPrice, change: newChange, changePercent: Math.round((newChange / (newPrice - newChange)) * 10000) / 100 };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // News rotation
  useEffect(() => {
    const interval = setInterval(() => {
      if (news.length > 0 && news[0]?.id?.startsWith('fn-')) return;
      const idx = newsIndexRef.current % newsPool.length;
      const now = new Date();
      const newItem: NewsItem = {
        ...newsPool[idx], id: `news-${Date.now()}`,
        time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
      };
      setNews(prev => [newItem, ...prev.slice(0, 24)]);
      newsIndexRef.current++;
    }, 6000);
    return () => clearInterval(interval);
  }, [news]);

  return { stocks, indices, forex, commodities, bonds, crypto, news, selectedStock, setSelectedStock, isLive };
}
