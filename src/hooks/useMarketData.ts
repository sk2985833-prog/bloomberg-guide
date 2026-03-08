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
  { symbol: "AAPL", name: "Apple Inc.", price: 189.84, change: 2.34, changePercent: 1.25, high: 191.20, low: 187.50, open: 188.10, volume: "52.3M", marketCap: "2.95T", history: [185, 186.5, 184, 187, 188, 186, 189, 188.5, 190, 189.84, 190.2, 189.5, 191, 190.3, 189.84], sector: "Technology", exchange: "NASDAQ", pe: 29.4, eps: 6.46, dividend: 0.96, beta: 1.28 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 378.91, change: 4.12, changePercent: 1.10, high: 380.50, low: 375.20, open: 376.00, volume: "23.1M", marketCap: "2.81T", history: [372, 374, 373, 376, 375, 377, 378, 376, 379, 378.91, 380, 379.5, 381, 379, 378.91], sector: "Technology", exchange: "NASDAQ", pe: 35.2, eps: 10.76, dividend: 3.00, beta: 0.89 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 141.80, change: -0.64, changePercent: -0.45, high: 143.20, low: 140.50, open: 142.30, volume: "18.7M", marketCap: "1.78T", history: [143, 142, 144, 143, 141, 142, 140, 141, 142, 141.80, 141, 142.5, 141, 140.8, 141.80], sector: "Technology", exchange: "NASDAQ", pe: 23.1, eps: 6.14, dividend: 0, beta: 1.06 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.92, change: 5.21, changePercent: 3.00, high: 179.80, low: 173.50, open: 174.00, volume: "45.2M", marketCap: "1.85T", history: [173, 174, 175, 174, 176, 177, 175, 178, 177, 178.92, 179, 178.5, 179.8, 178, 178.92], sector: "Consumer", exchange: "NASDAQ", pe: 58.7, eps: 3.05, dividend: 0, beta: 1.14 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 875.40, change: 18.60, changePercent: 2.17, high: 880.00, low: 858.30, open: 860.00, volume: "38.9M", marketCap: "2.16T", history: [858, 862, 860, 865, 868, 870, 872, 869, 876, 875.40, 878, 880, 876, 874, 875.40], sector: "Technology", exchange: "NASDAQ", pe: 64.3, eps: 13.61, dividend: 0.16, beta: 1.68 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 245.30, change: -4.40, changePercent: -1.76, high: 250.20, low: 243.10, open: 249.70, volume: "89.4M", marketCap: "780B", history: [250, 249, 251, 248, 247, 246, 248, 245, 246, 245.30, 244, 243, 245, 246, 245.30], sector: "Automotive", exchange: "NASDAQ", pe: 72.1, eps: 3.40, dividend: 0, beta: 2.05 },
  { symbol: "META", name: "Meta Platforms", price: 505.75, change: 8.30, changePercent: 1.67, high: 508.20, low: 498.00, open: 499.50, volume: "14.6M", marketCap: "1.29T", history: [498, 500, 499, 502, 501, 503, 504, 502, 506, 505.75, 507, 506, 508, 505, 505.75], sector: "Technology", exchange: "NASDAQ", pe: 26.8, eps: 18.87, dividend: 2.00, beta: 1.21 },
  { symbol: "JPM", name: "JPMorgan Chase", price: 198.45, change: 1.78, changePercent: 0.90, high: 199.80, low: 196.20, open: 197.00, volume: "8.3M", marketCap: "572B", history: [196, 197, 196, 198, 197, 198, 199, 198, 199, 198.45, 199, 198, 199, 198.5, 198.45], sector: "Financials", exchange: "NYSE", pe: 11.4, eps: 17.41, dividend: 4.60, beta: 1.09 },
  { symbol: "V", name: "Visa Inc.", price: 279.30, change: 3.15, changePercent: 1.14, high: 280.50, low: 276.10, open: 276.50, volume: "5.7M", marketCap: "573B", history: [276, 277, 276, 278, 277, 279, 278, 280, 279, 279.30, 280, 279, 280, 279, 279.30], sector: "Financials", exchange: "NYSE", pe: 30.5, eps: 9.16, dividend: 2.08, beta: 0.94 },
  { symbol: "GS", name: "Goldman Sachs", price: 412.30, change: 6.40, changePercent: 1.58, high: 414.50, low: 406.00, open: 407.20, volume: "2.8M", marketCap: "138B", history: [406, 408, 407, 409, 410, 408, 411, 410, 413, 412.30, 413, 411, 414, 412, 412.30], sector: "Financials", exchange: "NYSE", pe: 14.2, eps: 29.04, dividend: 11.00, beta: 1.35 },
  { symbol: "SHEL", name: "Shell PLC", price: 64.82, change: 0.54, changePercent: 0.84, high: 65.10, low: 64.20, open: 64.30, volume: "12.1M", marketCap: "218B", history: [64.2, 64.4, 64.1, 64.5, 64.6, 64.3, 64.8, 64.5, 64.9, 64.82, 65, 64.7, 65.1, 64.8, 64.82], sector: "Energy", exchange: "LSE", pe: 11.8, eps: 5.49, dividend: 2.68, beta: 0.62 },
  { symbol: "ASML", name: "ASML Holding", price: 912.40, change: 14.20, changePercent: 1.58, high: 916.00, low: 898.30, open: 900.50, volume: "1.8M", marketCap: "364B", history: [898, 902, 900, 905, 908, 906, 910, 908, 913, 912.40, 914, 912, 916, 913, 912.40], sector: "Technology", exchange: "EURONEXT", pe: 48.6, eps: 18.77, dividend: 6.40, beta: 1.12 },
  { symbol: "SAP", name: "SAP SE", price: 184.60, change: 2.80, changePercent: 1.54, high: 185.40, low: 181.90, open: 182.20, volume: "3.4M", marketCap: "226B", history: [182, 183, 182, 184, 183, 185, 184, 185, 184, 184.60, 185, 184, 185.4, 184.5, 184.60], sector: "Technology", exchange: "XETRA", pe: 38.2, eps: 4.83, dividend: 2.20, beta: 0.98 },
  { symbol: "NESN", name: "Nestlé SA", price: 98.42, change: -0.68, changePercent: -0.69, high: 99.30, low: 98.10, open: 99.10, volume: "4.2M", marketCap: "272B", history: [99.1, 99, 99.3, 98.8, 98.6, 98.9, 98.5, 98.7, 98.4, 98.42, 98.3, 98.5, 98.2, 98.4, 98.42], sector: "Consumer", exchange: "SIX", pe: 21.4, eps: 4.60, dividend: 3.00, beta: 0.52 },
  { symbol: "TSM", name: "Taiwan Semi.", price: 148.25, change: 3.80, changePercent: 2.63, high: 149.50, low: 144.80, open: 145.20, volume: "16.8M", marketCap: "768B", history: [145, 146, 145, 147, 146, 148, 147, 149, 148, 148.25, 149, 148, 149.5, 148.5, 148.25], sector: "Technology", exchange: "TWSE", pe: 25.6, eps: 5.79, dividend: 3.52, beta: 1.15 },
  { symbol: "9984", name: "SoftBank Group", price: 8234, change: 124, changePercent: 1.53, high: 8290, low: 8110, open: 8150, volume: "8.2M", marketCap: "126B", history: [8110, 8140, 8120, 8160, 8180, 8150, 8200, 8190, 8240, 8234, 8250, 8230, 8290, 8240, 8234], sector: "Technology", exchange: "TSE", pe: 18.3, eps: 449.9, dividend: 44, beta: 1.42 },
  { symbol: "700", name: "Tencent Holdings", price: 368.40, change: -2.60, changePercent: -0.70, high: 372.00, low: 366.50, open: 371.00, volume: "14.5M", marketCap: "432B", history: [371, 370, 372, 369, 368, 370, 367, 369, 368, 368.40, 367, 369, 366.5, 368, 368.40], sector: "Technology", exchange: "HKEX", pe: 22.8, eps: 16.16, dividend: 3.20, beta: 0.78 },
  { symbol: "RELIANCE", name: "Reliance Ind.", price: 2847.50, change: 34.20, changePercent: 1.22, high: 2862.00, low: 2815.00, open: 2820.00, volume: "9.8M", marketCap: "242B", history: [2815, 2825, 2820, 2835, 2830, 2840, 2838, 2845, 2842, 2847.50, 2850, 2845, 2862, 2848, 2847.50], sector: "Energy", exchange: "NSE", pe: 28.5, eps: 99.91, dividend: 10, beta: 0.82 },
  { symbol: "BRK.B", name: "Berkshire Hath.", price: 415.80, change: 2.90, changePercent: 0.70, high: 417.00, low: 413.20, open: 413.50, volume: "3.1M", marketCap: "900B", history: [413, 414, 413, 415, 414, 416, 415, 416, 415, 415.80, 416, 415, 417, 416, 415.80], sector: "Financials", exchange: "NYSE", pe: 8.9, eps: 46.72, dividend: 0, beta: 0.54 },
  { symbol: "WMT", name: "Walmart Inc.", price: 165.20, change: -1.10, changePercent: -0.66, high: 167.00, low: 164.50, open: 166.30, volume: "6.2M", marketCap: "446B", history: [167, 166, 167, 166, 165, 166, 165, 166, 165, 165.20, 165, 164.5, 165, 165.2, 165.20], sector: "Consumer", exchange: "NYSE", pe: 27.3, eps: 6.05, dividend: 2.28, beta: 0.51 },
  { symbol: "UNH", name: "UnitedHealth Grp", price: 527.30, change: 5.80, changePercent: 1.11, high: 530.00, low: 521.40, open: 522.50, volume: "3.6M", marketCap: "488B", history: [522, 524, 523, 525, 524, 526, 525, 528, 527, 527.30, 528, 527, 530, 528, 527.30], sector: "Healthcare", exchange: "NYSE", pe: 21.6, eps: 24.41, dividend: 7.52, beta: 0.64 },
  { symbol: "XOM", name: "Exxon Mobil", price: 113.85, change: -0.92, changePercent: -0.80, high: 115.10, low: 113.40, open: 114.70, volume: "11.4M", marketCap: "454B", history: [114.7, 114.3, 114.8, 114, 113.8, 114.2, 113.6, 114, 113.8, 113.85, 113.5, 113.8, 113.4, 113.7, 113.85], sector: "Energy", exchange: "NYSE", pe: 12.1, eps: 9.41, dividend: 3.80, beta: 0.88 },
  { symbol: "SAMSUNG", name: "Samsung Elec.", price: 71200, change: 800, changePercent: 1.14, high: 71600, low: 70400, open: 70500, volume: "15.2M", marketCap: "425B", history: [70400, 70600, 70500, 70800, 71000, 70800, 71200, 71000, 71300, 71200, 71400, 71200, 71600, 71300, 71200], sector: "Technology", exchange: "KRX", pe: 14.8, eps: 4811, dividend: 1444, beta: 1.18 },
  { symbol: "NOVO-B", name: "Novo Nordisk", price: 872.30, change: 12.40, changePercent: 1.44, high: 878.00, low: 860.50, open: 862.00, volume: "2.9M", marketCap: "398B", history: [860, 864, 862, 866, 868, 865, 870, 868, 873, 872.30, 875, 873, 878, 874, 872.30], sector: "Healthcare", exchange: "CPH", pe: 42.5, eps: 20.52, dividend: 9.40, beta: 0.68 },
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
