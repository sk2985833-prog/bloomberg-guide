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
  history: number[];
}

export interface ForexPair {
  pair: string;
  rate: number;
  change: number;
  bid: number;
  ask: number;
  history: number[];
}

export interface Commodity {
  name: string;
  price: number;
  change: number;
  changePercent: number;
  unit: string;
  history: number[];
}

export interface BondData {
  name: string;
  yield: number;
  change: number;
  maturity: string;
  history: number[];
}

export interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  history: number[];
}

function genHistory(base: number, points: number = 20, volatility: number = 0.005): number[] {
  const h: number[] = [base * (1 - volatility * 5)];
  for (let i = 1; i < points; i++) {
    h.push(h[i - 1] * (1 + (Math.random() - 0.48) * volatility * 2));
  }
  // ensure last point is close to base
  h.push(base);
  return h.map(v => Math.round(v * 100) / 100);
}

// ═══════════════════ REALISTIC INITIAL DATA ═══════════════════

const initialStocks: StockData[] = [
  // US - NASDAQ
  { symbol: "AAPL", name: "Apple Inc.", price: 256.61, change: -0.85, changePercent: -0.33, high: 258.27, low: 253.50, open: 253.50, volume: "52.3M", marketCap: "3.92T", history: genHistory(256.61, 20, 0.004), sector: "Technology", exchange: "NASDAQ", pe: 32.1, eps: 7.99, dividend: 1.00, beta: 1.24 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 405.14, change: -3.82, changePercent: -0.93, high: 409.17, low: 402.95, open: 402.95, volume: "23.1M", marketCap: "3.01T", history: genHistory(405.14, 20, 0.004), sector: "Technology", exchange: "NASDAQ", pe: 34.8, eps: 11.64, dividend: 3.32, beta: 0.87 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 300.86, change: 2.34, changePercent: 0.78, high: 301.98, low: 291.91, open: 291.91, volume: "18.7M", marketCap: "1.85T", history: genHistory(300.86, 20, 0.005), sector: "Technology", exchange: "NASDAQ", pe: 24.2, eps: 12.43, dividend: 0, beta: 1.05 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 209.59, change: -3.62, changePercent: -1.70, high: 212.30, low: 207.11, open: 208.81, volume: "45.2M", marketCap: "2.21T", history: genHistory(209.59, 20, 0.005), sector: "Consumer", exchange: "NASDAQ", pe: 42.3, eps: 4.96, dividend: 0, beta: 1.16 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 179.45, change: 1.63, changePercent: 0.92, high: 180.91, low: 175.56, open: 175.72, volume: "38.9M", marketCap: "4.40T", history: genHistory(179.45, 20, 0.008), sector: "Technology", exchange: "NASDAQ", pe: 55.2, eps: 3.25, dividend: 0.04, beta: 1.72 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 389.06, change: -7.67, changePercent: -1.93, high: 392.99, low: 381.40, open: 389.76, volume: "89.4M", marketCap: "1.25T", history: genHistory(389.06, 20, 0.01), sector: "Automotive", exchange: "NASDAQ", pe: 118.5, eps: 3.28, dividend: 0, beta: 2.08 },
  { symbol: "META", name: "Meta Platforms", price: 634.01, change: -10.85, changePercent: -1.68, high: 638.25, low: 626.78, open: 634.99, volume: "14.6M", marketCap: "1.60T", history: genHistory(634.01, 20, 0.006), sector: "Technology", exchange: "NASDAQ", pe: 25.4, eps: 24.96, dividend: 2.00, beta: 1.18 },
  { symbol: "AVGO", name: "Broadcom Inc.", price: 1842.30, change: 22.50, changePercent: 1.24, high: 1855.00, low: 1820.00, open: 1825.00, volume: "3.2M", marketCap: "856B", history: genHistory(1842.30, 20, 0.006), sector: "Technology", exchange: "NASDAQ", pe: 38.5, eps: 47.85, dividend: 21.00, beta: 1.15 },
  { symbol: "COST", name: "Costco Wholesale", price: 912.45, change: 4.20, changePercent: 0.46, high: 918.00, low: 908.30, open: 910.00, volume: "1.8M", marketCap: "405B", history: genHistory(912.45, 20, 0.003), sector: "Consumer", exchange: "NASDAQ", pe: 52.1, eps: 17.51, dividend: 4.08, beta: 0.73 },
  { symbol: "NFLX", name: "Netflix Inc.", price: 875.20, change: 12.30, changePercent: 1.43, high: 880.00, low: 862.50, open: 865.00, volume: "4.5M", marketCap: "378B", history: genHistory(875.20, 20, 0.007), sector: "Media", exchange: "NASDAQ", pe: 45.8, eps: 19.11, dividend: 0, beta: 1.28 },
  { symbol: "AMD", name: "AMD Inc.", price: 178.90, change: 3.45, changePercent: 1.97, high: 180.50, low: 175.20, open: 176.00, volume: "42.1M", marketCap: "289B", history: genHistory(178.90, 20, 0.008), sector: "Technology", exchange: "NASDAQ", pe: 48.2, eps: 3.71, dividend: 0, beta: 1.68 },
  { symbol: "INTC", name: "Intel Corp.", price: 24.85, change: -0.42, changePercent: -1.66, high: 25.40, low: 24.60, open: 25.20, volume: "38.5M", marketCap: "106B", history: genHistory(24.85, 20, 0.006), sector: "Technology", exchange: "NASDAQ", pe: 0, eps: -0.74, dividend: 0.50, beta: 0.92 },
  // US - NYSE
  { symbol: "JPM", name: "JPMorgan Chase", price: 284.95, change: -4.53, changePercent: -1.56, high: 287.20, low: 280.45, open: 283.76, volume: "8.3M", marketCap: "820B", history: genHistory(284.95, 20, 0.005), sector: "Financials", exchange: "NYSE", pe: 13.2, eps: 21.59, dividend: 5.00, beta: 1.07 },
  { symbol: "V", name: "Visa Inc.", price: 312.03, change: -5.33, changePercent: -1.68, high: 315.38, low: 310.15, open: 312.54, volume: "5.7M", marketCap: "640B", history: genHistory(312.03, 20, 0.004), sector: "Financials", exchange: "NYSE", pe: 31.8, eps: 9.81, dividend: 2.36, beta: 0.92 },
  { symbol: "GS", name: "Goldman Sachs", price: 808.40, change: -13.02, changePercent: -1.59, high: 815.16, low: 795.00, open: 803.18, volume: "2.8M", marketCap: "268B", history: genHistory(808.40, 20, 0.006), sector: "Financials", exchange: "NYSE", pe: 16.5, eps: 48.99, dividend: 12.00, beta: 1.32 },
  { symbol: "BRK.B", name: "Berkshire Hath.", price: 528.40, change: 3.60, changePercent: 0.69, high: 531.00, low: 525.20, open: 525.80, volume: "3.1M", marketCap: "1.14T", history: genHistory(528.40, 20, 0.003), sector: "Financials", exchange: "NYSE", pe: 9.2, eps: 57.43, dividend: 0, beta: 0.52 },
  { symbol: "WMT", name: "Walmart Inc.", price: 94.82, change: -0.68, changePercent: -0.71, high: 96.00, low: 94.20, open: 95.40, volume: "6.2M", marketCap: "764B", history: genHistory(94.82, 20, 0.003), sector: "Consumer", exchange: "NYSE", pe: 38.2, eps: 2.48, dividend: 0.83, beta: 0.48 },
  { symbol: "UNH", name: "UnitedHealth Grp", price: 472.30, change: 5.40, changePercent: 1.16, high: 476.00, low: 467.40, open: 468.50, volume: "3.6M", marketCap: "436B", history: genHistory(472.30, 20, 0.004), sector: "Healthcare", exchange: "NYSE", pe: 19.8, eps: 23.86, dividend: 7.52, beta: 0.62 },
  { symbol: "XOM", name: "Exxon Mobil", price: 118.45, change: 1.82, changePercent: 1.56, high: 119.50, low: 116.80, open: 117.00, volume: "11.4M", marketCap: "472B", history: genHistory(118.45, 20, 0.005), sector: "Energy", exchange: "NYSE", pe: 14.2, eps: 8.34, dividend: 3.96, beta: 0.92 },
  { symbol: "BA", name: "Boeing Co.", price: 178.90, change: -2.40, changePercent: -1.32, high: 182.00, low: 177.50, open: 181.20, volume: "7.8M", marketCap: "108B", history: genHistory(178.90, 20, 0.007), sector: "Industrials", exchange: "NYSE", pe: 0, eps: -7.94, dividend: 0, beta: 1.52 },
  { symbol: "DIS", name: "Walt Disney", price: 112.50, change: 1.80, changePercent: 1.63, high: 113.80, low: 110.90, open: 111.00, volume: "8.4M", marketCap: "206B", history: genHistory(112.50, 20, 0.005), sector: "Media", exchange: "NYSE", pe: 72.5, eps: 1.55, dividend: 0, beta: 1.24 },
  { symbol: "KO", name: "Coca-Cola Co.", price: 62.40, change: 0.35, changePercent: 0.56, high: 62.80, low: 62.00, open: 62.10, volume: "12.1M", marketCap: "270B", history: genHistory(62.40, 20, 0.002), sector: "Consumer", exchange: "NYSE", pe: 24.8, eps: 2.52, dividend: 1.94, beta: 0.58 },
  { symbol: "PFE", name: "Pfizer Inc.", price: 27.85, change: -0.32, changePercent: -1.14, high: 28.30, low: 27.60, open: 28.15, volume: "28.4M", marketCap: "158B", history: genHistory(27.85, 20, 0.004), sector: "Healthcare", exchange: "NYSE", pe: 48.2, eps: 0.58, dividend: 1.68, beta: 0.65 },
  // Europe
  { symbol: "SHEL", name: "Shell PLC", price: 72.45, change: 0.82, changePercent: 1.15, high: 73.10, low: 71.60, open: 71.80, volume: "12.1M", marketCap: "232B", history: genHistory(72.45, 20, 0.004), sector: "Energy", exchange: "LSE", pe: 10.4, eps: 6.97, dividend: 2.80, beta: 0.58 },
  { symbol: "ASML", name: "ASML Holding", price: 720.50, change: 8.40, changePercent: 1.18, high: 725.00, low: 712.30, open: 714.00, volume: "1.8M", marketCap: "288B", history: genHistory(720.50, 20, 0.006), sector: "Technology", exchange: "EURONEXT", pe: 42.8, eps: 16.83, dividend: 7.20, beta: 1.14 },
  { symbol: "SAP", name: "SAP SE", price: 268.30, change: 3.40, changePercent: 1.28, high: 270.00, low: 265.20, open: 265.80, volume: "3.4M", marketCap: "328B", history: genHistory(268.30, 20, 0.004), sector: "Technology", exchange: "XETRA", pe: 45.1, eps: 5.95, dividend: 2.40, beta: 0.96 },
  { symbol: "NESN", name: "Nestlé SA", price: 82.15, change: -0.52, changePercent: -0.63, high: 83.00, low: 81.80, open: 82.60, volume: "4.2M", marketCap: "218B", history: genHistory(82.15, 20, 0.003), sector: "Consumer", exchange: "SIX", pe: 20.8, eps: 3.95, dividend: 3.05, beta: 0.48 },
  { symbol: "NOVO-B", name: "Novo Nordisk", price: 585.20, change: -8.40, changePercent: -1.42, high: 596.00, low: 582.50, open: 593.60, volume: "2.9M", marketCap: "268B", history: genHistory(585.20, 20, 0.006), sector: "Healthcare", exchange: "CPH", pe: 36.8, eps: 15.90, dividend: 8.80, beta: 0.64 },
  { symbol: "AZN", name: "AstraZeneca", price: 124.80, change: 1.20, changePercent: 0.97, high: 125.50, low: 123.80, open: 123.90, volume: "5.6M", marketCap: "195B", history: genHistory(124.80, 20, 0.004), sector: "Healthcare", exchange: "LSE", pe: 32.4, eps: 3.85, dividend: 2.90, beta: 0.42 },
  { symbol: "LVMH", name: "LVMH Moët", price: 742.80, change: -5.60, changePercent: -0.75, high: 750.00, low: 738.50, open: 748.00, volume: "1.2M", marketCap: "374B", history: genHistory(742.80, 20, 0.005), sector: "Luxury", exchange: "EURONEXT", pe: 22.5, eps: 33.01, dividend: 13.00, beta: 0.92 },
  { symbol: "HSBA", name: "HSBC Holdings", price: 7.42, change: 0.08, changePercent: 1.09, high: 7.48, low: 7.35, open: 7.36, volume: "32.5M", marketCap: "148B", history: genHistory(7.42, 20, 0.003), sector: "Financials", exchange: "LSE", pe: 7.2, eps: 1.03, dividend: 0.61, beta: 0.68 },
  { symbol: "SIE", name: "Siemens AG", price: 184.50, change: 2.30, changePercent: 1.26, high: 186.00, low: 182.40, open: 183.00, volume: "2.1M", marketCap: "148B", history: genHistory(184.50, 20, 0.004), sector: "Industrials", exchange: "XETRA", pe: 18.4, eps: 10.03, dividend: 4.70, beta: 1.08 },
  { symbol: "TTE", name: "TotalEnergies", price: 62.85, change: 0.72, changePercent: 1.16, high: 63.20, low: 62.20, open: 62.30, volume: "4.8M", marketCap: "152B", history: genHistory(62.85, 20, 0.004), sector: "Energy", exchange: "EURONEXT", pe: 8.2, eps: 7.66, dividend: 3.01, beta: 0.72 },
  // Asia - Japan
  { symbol: "7203", name: "Toyota Motor", price: 3485, change: 42, changePercent: 1.22, high: 3510, low: 3445, open: 3450, volume: "12.4M", marketCap: "458B", history: genHistory(3485, 20, 0.005), sector: "Automotive", exchange: "TSE", pe: 10.2, eps: 341.7, dividend: 72, beta: 0.68 },
  { symbol: "9984", name: "SoftBank Group", price: 9450, change: 142, changePercent: 1.53, high: 9520, low: 9310, open: 9340, volume: "8.2M", marketCap: "145B", history: genHistory(9450, 20, 0.006), sector: "Technology", exchange: "TSE", pe: 19.2, eps: 492, dividend: 48, beta: 1.38 },
  { symbol: "6758", name: "Sony Group", price: 13250, change: -180, changePercent: -1.34, high: 13480, low: 13200, open: 13420, volume: "5.6M", marketCap: "168B", history: genHistory(13250, 20, 0.005), sector: "Technology", exchange: "TSE", pe: 16.8, eps: 789, dividend: 65, beta: 0.82 },
  { symbol: "8306", name: "Mitsubishi UFJ", price: 1682, change: 18, changePercent: 1.08, high: 1698, low: 1665, open: 1668, volume: "28.4M", marketCap: "125B", history: genHistory(1682, 20, 0.004), sector: "Financials", exchange: "TSE", pe: 11.2, eps: 150.2, dividend: 41, beta: 0.92 },
  { symbol: "6861", name: "Keyence Corp", price: 68500, change: 850, changePercent: 1.26, high: 69200, low: 67800, open: 67900, volume: "0.8M", marketCap: "167B", history: genHistory(68500, 20, 0.005), sector: "Technology", exchange: "TSE", pe: 42.1, eps: 1627, dividend: 300, beta: 0.95 },
  // Asia - China/HK
  { symbol: "700", name: "Tencent Holdings", price: 442.80, change: -3.20, changePercent: -0.72, high: 448.00, low: 440.50, open: 446.00, volume: "14.5M", marketCap: "520B", history: genHistory(442.80, 20, 0.006), sector: "Technology", exchange: "HKEX", pe: 21.5, eps: 20.60, dividend: 3.60, beta: 0.74 },
  { symbol: "9988", name: "Alibaba Group", price: 82.45, change: 1.85, changePercent: 2.29, high: 83.20, low: 80.80, open: 81.00, volume: "22.8M", marketCap: "208B", history: genHistory(82.45, 20, 0.007), sector: "Technology", exchange: "HKEX", pe: 11.8, eps: 6.99, dividend: 1.28, beta: 0.85 },
  { symbol: "1299", name: "AIA Group", price: 58.90, change: 0.65, changePercent: 1.12, high: 59.30, low: 58.30, open: 58.40, volume: "8.4M", marketCap: "68B", history: genHistory(58.90, 20, 0.004), sector: "Insurance", exchange: "HKEX", pe: 14.8, eps: 3.98, dividend: 1.56, beta: 0.82 },
  { symbol: "3690", name: "Meituan", price: 128.50, change: 3.80, changePercent: 3.05, high: 130.00, low: 125.00, open: 125.50, volume: "16.2M", marketCap: "82B", history: genHistory(128.50, 20, 0.008), sector: "Technology", exchange: "HKEX", pe: 28.4, eps: 4.52, dividend: 0, beta: 1.12 },
  // Asia - India
  { symbol: "RELIANCE", name: "Reliance Ind.", price: 1285.60, change: 15.40, changePercent: 1.21, high: 1292.00, low: 1272.00, open: 1274.00, volume: "9.8M", marketCap: "218B", history: genHistory(1285.60, 20, 0.005), sector: "Energy", exchange: "NSE", pe: 26.8, eps: 47.97, dividend: 10, beta: 0.78 },
  { symbol: "TCS", name: "Tata Consultancy", price: 3842.50, change: 28.40, changePercent: 0.74, high: 3860.00, low: 3815.00, open: 3820.00, volume: "3.2M", marketCap: "140B", history: genHistory(3842.50, 20, 0.004), sector: "Technology", exchange: "NSE", pe: 28.5, eps: 134.8, dividend: 75, beta: 0.62 },
  { symbol: "INFY", name: "Infosys Ltd.", price: 1568.20, change: -12.40, changePercent: -0.78, high: 1585.00, low: 1560.00, open: 1580.00, volume: "8.5M", marketCap: "65B", history: genHistory(1568.20, 20, 0.005), sector: "Technology", exchange: "NSE", pe: 24.2, eps: 64.8, dividend: 34, beta: 0.72 },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1642.80, change: 18.60, changePercent: 1.15, high: 1658.00, low: 1628.00, open: 1630.00, volume: "6.8M", marketCap: "124B", history: genHistory(1642.80, 20, 0.004), sector: "Financials", exchange: "NSE", pe: 18.4, eps: 89.3, dividend: 19.5, beta: 0.85 },
  { symbol: "ICICIBANK", name: "ICICI Bank", price: 1124.50, change: 8.20, changePercent: 0.73, high: 1132.00, low: 1118.00, open: 1120.00, volume: "12.4M", marketCap: "78B", history: genHistory(1124.50, 20, 0.004), sector: "Financials", exchange: "NSE", pe: 16.8, eps: 66.9, dividend: 10, beta: 0.92 },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever", price: 2384.60, change: -14.20, changePercent: -0.59, high: 2405.00, low: 2378.00, open: 2398.00, volume: "2.1M", marketCap: "56B", history: genHistory(2384.60, 20, 0.003), sector: "Consumer", exchange: "NSE", pe: 58.2, eps: 40.97, dividend: 42, beta: 0.38 },
  // Asia - Korea/Taiwan
  { symbol: "TSM", name: "Taiwan Semi.", price: 192.40, change: 4.20, changePercent: 2.23, high: 194.00, low: 188.50, open: 189.00, volume: "16.8M", marketCap: "998B", history: genHistory(192.40, 20, 0.006), sector: "Technology", exchange: "TWSE", pe: 28.4, eps: 6.77, dividend: 4.00, beta: 1.12 },
  { symbol: "SAMSUNG", name: "Samsung Elec.", price: 58400, change: 650, changePercent: 1.13, high: 58800, low: 57750, open: 57800, volume: "15.2M", marketCap: "348B", history: genHistory(58400, 20, 0.005), sector: "Technology", exchange: "KRX", pe: 13.2, eps: 4424, dividend: 1444, beta: 1.15 },
  { symbol: "SKHYNIX", name: "SK Hynix", price: 178500, change: 4200, changePercent: 2.41, high: 180000, low: 174500, open: 175000, volume: "4.8M", marketCap: "130B", history: genHistory(178500, 20, 0.007), sector: "Technology", exchange: "KRX", pe: 8.5, eps: 21000, dividend: 1200, beta: 1.42 },
  // Australia
  { symbol: "BHP", name: "BHP Group", price: 42.80, change: 0.65, changePercent: 1.54, high: 43.10, low: 42.20, open: 42.30, volume: "18.5M", marketCap: "218B", history: genHistory(42.80, 20, 0.005), sector: "Mining", exchange: "ASX", pe: 12.8, eps: 3.34, dividend: 2.54, beta: 1.08 },
  { symbol: "CBA", name: "Commonwealth Bank", price: 128.45, change: 1.20, changePercent: 0.94, high: 129.20, low: 127.40, open: 127.60, volume: "4.2M", marketCap: "215B", history: genHistory(128.45, 20, 0.003), sector: "Financials", exchange: "ASX", pe: 22.4, eps: 5.73, dividend: 4.50, beta: 0.62 },
  // Brazil
  { symbol: "VALE3", name: "Vale SA", price: 62.50, change: -0.85, changePercent: -1.34, high: 63.80, low: 62.20, open: 63.40, volume: "28.4M", marketCap: "58B", history: genHistory(62.50, 20, 0.006), sector: "Mining", exchange: "B3", pe: 5.8, eps: 10.78, dividend: 5.42, beta: 1.18 },
  { symbol: "PETR4", name: "Petrobras", price: 38.42, change: 0.48, changePercent: 1.27, high: 38.80, low: 37.95, open: 38.00, volume: "42.1M", marketCap: "84B", history: genHistory(38.42, 20, 0.005), sector: "Energy", exchange: "B3", pe: 3.8, eps: 10.11, dividend: 8.24, beta: 1.25 },
  // Middle East
  { symbol: "2222", name: "Saudi Aramco", price: 28.45, change: 0.15, changePercent: 0.53, high: 28.60, low: 28.30, open: 28.35, volume: "18.2M", marketCap: "1.86T", history: genHistory(28.45, 20, 0.002), sector: "Energy", exchange: "TADAWUL", pe: 14.8, eps: 1.92, dividend: 0.78, beta: 0.42 },
];

const initialIndices: MarketIndex[] = [
  { name: "S&P 500", value: 5234.18, change: 42.30, changePercent: 0.81, region: "Americas", history: genHistory(5234.18, 20, 0.003) },
  { name: "DOW 30", value: 39512.84, change: 312.50, changePercent: 0.80, region: "Americas", history: genHistory(39512.84, 20, 0.003) },
  { name: "NASDAQ", value: 16428.82, change: 198.40, changePercent: 1.22, region: "Americas", history: genHistory(16428.82, 20, 0.004) },
  { name: "RUSSELL 2K", value: 2084.35, change: -12.80, changePercent: -0.61, region: "Americas", history: genHistory(2084.35, 20, 0.005) },
  { name: "S&P/TSX", value: 22184.60, change: 85.40, changePercent: 0.39, region: "Americas", history: genHistory(22184.60, 20, 0.003) },
  { name: "BOVESPA", value: 128432.50, change: -456.80, changePercent: -0.35, region: "Americas", history: genHistory(128432.50, 20, 0.005) },
  { name: "FTSE 100", value: 8164.12, change: 28.50, changePercent: 0.35, region: "Europe", history: genHistory(8164.12, 20, 0.003) },
  { name: "DAX", value: 18492.49, change: 156.30, changePercent: 0.85, region: "Europe", history: genHistory(18492.49, 20, 0.004) },
  { name: "CAC 40", value: 8184.75, change: 42.10, changePercent: 0.52, region: "Europe", history: genHistory(8184.75, 20, 0.003) },
  { name: "STOXX 600", value: 512.38, change: 3.24, changePercent: 0.64, region: "Europe", history: genHistory(512.38, 20, 0.003) },
  { name: "IBEX 35", value: 11084.20, change: -28.40, changePercent: -0.26, region: "Europe", history: genHistory(11084.20, 20, 0.004) },
  { name: "SMI", value: 11842.30, change: 62.80, changePercent: 0.53, region: "Europe", history: genHistory(11842.30, 20, 0.003) },
  { name: "FTSE MIB", value: 34285.40, change: 185.20, changePercent: 0.54, region: "Europe", history: genHistory(34285.40, 20, 0.004) },
  { name: "AEX", value: 882.45, change: 5.80, changePercent: 0.66, region: "Europe", history: genHistory(882.45, 20, 0.003) },
  { name: "NIKKEI 225", value: 40168.07, change: -234.20, changePercent: -0.58, region: "Asia-Pacific", history: genHistory(40168.07, 20, 0.005) },
  { name: "HANG SENG", value: 16725.86, change: 89.40, changePercent: 0.54, region: "Asia-Pacific", history: genHistory(16725.86, 20, 0.006) },
  { name: "SHANGHAI", value: 3078.42, change: 12.60, changePercent: 0.41, region: "Asia-Pacific", history: genHistory(3078.42, 20, 0.004) },
  { name: "SENSEX", value: 74248.22, change: 428.60, changePercent: 0.58, region: "Asia-Pacific", history: genHistory(74248.22, 20, 0.004) },
  { name: "NIFTY 50", value: 22584.30, change: 142.80, changePercent: 0.64, region: "Asia-Pacific", history: genHistory(22584.30, 20, 0.004) },
  { name: "KOSPI", value: 2684.35, change: -18.40, changePercent: -0.68, region: "Asia-Pacific", history: genHistory(2684.35, 20, 0.005) },
  { name: "ASX 200", value: 7852.40, change: 34.20, changePercent: 0.44, region: "Asia-Pacific", history: genHistory(7852.40, 20, 0.003) },
  { name: "STRAITS T", value: 3284.65, change: 8.40, changePercent: 0.26, region: "Asia-Pacific", history: genHistory(3284.65, 20, 0.003) },
  { name: "TAIEX", value: 20485.60, change: 156.80, changePercent: 0.77, region: "Asia-Pacific", history: genHistory(20485.60, 20, 0.005) },
  { name: "TADAWUL", value: 12184.50, change: -42.30, changePercent: -0.35, region: "Middle East", history: genHistory(12184.50, 20, 0.003) },
  { name: "DFM", value: 4285.80, change: 22.40, changePercent: 0.53, region: "Middle East", history: genHistory(4285.80, 20, 0.004) },
  { name: "JSE TOP40", value: 72845.20, change: 385.60, changePercent: 0.53, region: "Africa", history: genHistory(72845.20, 20, 0.004) },
];

const initialForex: ForexPair[] = [
  { pair: "EUR/USD", rate: 1.0842, change: 0.0012, bid: 1.0840, ask: 1.0844, history: genHistory(1.0842, 20, 0.001) },
  { pair: "GBP/USD", rate: 1.2678, change: -0.0008, bid: 1.2676, ask: 1.2680, history: genHistory(1.2678, 20, 0.001) },
  { pair: "USD/JPY", rate: 151.34, change: 0.42, bid: 151.32, ask: 151.36, history: genHistory(151.34, 20, 0.002) },
  { pair: "USD/CHF", rate: 0.8812, change: -0.0015, bid: 0.8810, ask: 0.8814, history: genHistory(0.8812, 20, 0.001) },
  { pair: "AUD/USD", rate: 0.6534, change: 0.0023, bid: 0.6532, ask: 0.6536, history: genHistory(0.6534, 20, 0.002) },
  { pair: "USD/CAD", rate: 1.3567, change: 0.0018, bid: 1.3565, ask: 1.3569, history: genHistory(1.3567, 20, 0.001) },
  { pair: "EUR/GBP", rate: 0.8553, change: 0.0008, bid: 0.8551, ask: 0.8555, history: genHistory(0.8553, 20, 0.001) },
  { pair: "USD/CNH", rate: 7.2485, change: -0.0124, bid: 7.2480, ask: 7.2490, history: genHistory(7.2485, 20, 0.001) },
  { pair: "USD/INR", rate: 83.12, change: 0.08, bid: 83.10, ask: 83.14, history: genHistory(83.12, 20, 0.001) },
  { pair: "NZD/USD", rate: 0.6012, change: -0.0018, bid: 0.6010, ask: 0.6014, history: genHistory(0.6012, 20, 0.002) },
  { pair: "EUR/JPY", rate: 164.08, change: 0.56, bid: 164.06, ask: 164.10, history: genHistory(164.08, 20, 0.002) },
  { pair: "GBP/JPY", rate: 191.82, change: 0.38, bid: 191.80, ask: 191.84, history: genHistory(191.82, 20, 0.002) },
  { pair: "USD/SGD", rate: 1.3428, change: 0.0008, bid: 1.3426, ask: 1.3430, history: genHistory(1.3428, 20, 0.001) },
  { pair: "USD/HKD", rate: 7.8124, change: 0.0002, bid: 7.8122, ask: 7.8126, history: genHistory(7.8124, 20, 0.0003) },
  { pair: "USD/KRW", rate: 1342.50, change: -2.80, bid: 1342.30, ask: 1342.70, history: genHistory(1342.50, 20, 0.002) },
  { pair: "USD/TRY", rate: 32.15, change: 0.08, bid: 32.13, ask: 32.17, history: genHistory(32.15, 20, 0.002) },
  { pair: "USD/BRL", rate: 4.97, change: -0.02, bid: 4.96, ask: 4.98, history: genHistory(4.97, 20, 0.003) },
  { pair: "USD/MXN", rate: 17.12, change: 0.04, bid: 17.10, ask: 17.14, history: genHistory(17.12, 20, 0.002) },
  { pair: "USD/ZAR", rate: 18.42, change: -0.08, bid: 18.40, ask: 18.44, history: genHistory(18.42, 20, 0.003) },
  { pair: "USD/SAR", rate: 3.7500, change: 0.0000, bid: 3.7498, ask: 3.7502, history: genHistory(3.7500, 20, 0.0002) },
];

const initialCommodities: Commodity[] = [
  { name: "Gold", price: 2342.50, change: 7.80, changePercent: 0.33, unit: "/oz", history: genHistory(2342.50, 20, 0.003) },
  { name: "Silver", price: 28.45, change: 0.32, changePercent: 1.14, unit: "/oz", history: genHistory(28.45, 20, 0.005) },
  { name: "WTI Crude", price: 78.34, change: -1.24, changePercent: -1.56, unit: "/bbl", history: genHistory(78.34, 20, 0.006) },
  { name: "Brent Crude", price: 82.18, change: -0.96, changePercent: -1.16, unit: "/bbl", history: genHistory(82.18, 20, 0.006) },
  { name: "Natural Gas", price: 1.78, change: 0.05, changePercent: 2.89, unit: "/MMBtu", history: genHistory(1.78, 20, 0.01) },
  { name: "Copper", price: 4.12, change: 0.08, changePercent: 1.98, unit: "/lb", history: genHistory(4.12, 20, 0.005) },
  { name: "Platinum", price: 942.30, change: -4.20, changePercent: -0.44, unit: "/oz", history: genHistory(942.30, 20, 0.004) },
  { name: "Palladium", price: 1024.50, change: 12.40, changePercent: 1.22, unit: "/oz", history: genHistory(1024.50, 20, 0.006) },
  { name: "Wheat", price: 584.25, change: -3.50, changePercent: -0.60, unit: "/bu", history: genHistory(584.25, 20, 0.005) },
  { name: "Corn", price: 442.75, change: 2.25, changePercent: 0.51, unit: "/bu", history: genHistory(442.75, 20, 0.004) },
  { name: "Soybeans", price: 1182.50, change: 8.40, changePercent: 0.72, unit: "/bu", history: genHistory(1182.50, 20, 0.004) },
  { name: "Iron Ore", price: 108.20, change: -1.80, changePercent: -1.64, unit: "/t", history: genHistory(108.20, 20, 0.007) },
  { name: "Aluminum", price: 2285.00, change: 18.50, changePercent: 0.82, unit: "/t", history: genHistory(2285.00, 20, 0.004) },
  { name: "Nickel", price: 16420.00, change: -285.00, changePercent: -1.71, unit: "/t", history: genHistory(16420.00, 20, 0.006) },
  { name: "Lithium", price: 13250.00, change: 180.00, changePercent: 1.38, unit: "/t", history: genHistory(13250.00, 20, 0.008) },
  { name: "Coffee", price: 228.40, change: 4.20, changePercent: 1.87, unit: "/lb", history: genHistory(228.40, 20, 0.006) },
];

const initialBonds: BondData[] = [
  { name: "US 2Y", yield: 4.72, change: -0.03, maturity: "2026", history: genHistory(4.72, 20, 0.005) },
  { name: "US 5Y", yield: 4.28, change: -0.05, maturity: "2029", history: genHistory(4.28, 20, 0.005) },
  { name: "US 10Y", yield: 4.21, change: -0.04, maturity: "2034", history: genHistory(4.21, 20, 0.005) },
  { name: "US 30Y", yield: 4.38, change: -0.02, maturity: "2054", history: genHistory(4.38, 20, 0.004) },
  { name: "DE 10Y", yield: 2.34, change: 0.02, maturity: "2034", history: genHistory(2.34, 20, 0.006) },
  { name: "UK 10Y", yield: 4.08, change: -0.03, maturity: "2034", history: genHistory(4.08, 20, 0.005) },
  { name: "JP 10Y", yield: 0.88, change: 0.01, maturity: "2034", history: genHistory(0.88, 20, 0.008) },
  { name: "CN 10Y", yield: 2.29, change: -0.01, maturity: "2034", history: genHistory(2.29, 20, 0.005) },
  { name: "IN 10Y", yield: 7.12, change: -0.02, maturity: "2034", history: genHistory(7.12, 20, 0.003) },
  { name: "BR 10Y", yield: 11.45, change: 0.08, maturity: "2034", history: genHistory(11.45, 20, 0.004) },
  { name: "AU 10Y", yield: 4.18, change: -0.03, maturity: "2034", history: genHistory(4.18, 20, 0.005) },
  { name: "FR 10Y", yield: 2.92, change: 0.01, maturity: "2034", history: genHistory(2.92, 20, 0.005) },
  { name: "IT 10Y", yield: 3.68, change: -0.04, maturity: "2034", history: genHistory(3.68, 20, 0.005) },
  { name: "KR 10Y", yield: 3.42, change: 0.02, maturity: "2034", history: genHistory(3.42, 20, 0.005) },
];

const initialCrypto: CryptoData[] = [
  { symbol: "BTC", name: "Bitcoin", price: 68705.18, change: 1599.27, changePercent: 2.38, marketCap: "1.36T", history: genHistory(68705.18, 20, 0.008) },
  { symbol: "ETH", name: "Ethereum", price: 2023.03, change: 82.54, changePercent: 4.25, marketCap: "243B", history: genHistory(2023.03, 20, 0.01) },
  { symbol: "SOL", name: "Solana", price: 84.99, change: 3.37, changePercent: 4.13, marketCap: "42B", history: genHistory(84.99, 20, 0.012) },
  { symbol: "BNB", name: "Binance Coin", price: 612.40, change: 8.60, changePercent: 1.42, marketCap: "91B", history: genHistory(612.40, 20, 0.008) },
  { symbol: "XRP", name: "Ripple", price: 2.1842, change: 0.0524, changePercent: 2.46, marketCap: "126B", history: genHistory(2.1842, 20, 0.01) },
  { symbol: "ADA", name: "Cardano", price: 0.7245, change: -0.0142, changePercent: -1.92, marketCap: "26B", history: genHistory(0.7245, 20, 0.012) },
  { symbol: "DOGE", name: "Dogecoin", price: 0.1724, change: 0.0068, changePercent: 4.11, marketCap: "25B", history: genHistory(0.1724, 20, 0.015) },
  { symbol: "DOT", name: "Polkadot", price: 4.52, change: -0.08, changePercent: -1.74, marketCap: "7B", history: genHistory(4.52, 20, 0.01) },
  { symbol: "AVAX", name: "Avalanche", price: 22.18, change: 0.84, changePercent: 3.94, marketCap: "9B", history: genHistory(22.18, 20, 0.012) },
  { symbol: "LINK", name: "Chainlink", price: 14.62, change: 0.38, changePercent: 2.67, marketCap: "9B", history: genHistory(14.62, 20, 0.01) },
  { symbol: "MATIC", name: "Polygon", price: 0.5824, change: 0.0142, changePercent: 2.50, marketCap: "5.4B", history: genHistory(0.5824, 20, 0.012) },
  { symbol: "UNI", name: "Uniswap", price: 7.85, change: 0.24, changePercent: 3.15, marketCap: "4.7B", history: genHistory(7.85, 20, 0.012) },
  { symbol: "ATOM", name: "Cosmos", price: 8.42, change: -0.18, changePercent: -2.09, marketCap: "3.2B", history: genHistory(8.42, 20, 0.01) },
  { symbol: "LTC", name: "Litecoin", price: 84.50, change: 1.20, changePercent: 1.44, marketCap: "6.3B", history: genHistory(84.50, 20, 0.008) },
  { symbol: "NEAR", name: "NEAR Protocol", price: 5.28, change: 0.22, changePercent: 4.35, marketCap: "5.8B", history: genHistory(5.28, 20, 0.014) },
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
  { headline: "FLASH: Nikkei 225 breaks above 40,000 for first time in history", source: "Nikkei", category: "breaking", priority: "flash" },
  { headline: "RBI holds repo rate at 6.5%, maintains accommodative stance for growth", source: "ET", category: "economy", priority: "medium" },
  { headline: "Lithium prices surge 15% on EV battery demand from China and Europe", source: "Bloomberg", category: "commodity", priority: "high" },
  { headline: "Tata Consultancy wins $2.5B digital transformation deal from European bank", source: "ET", category: "tech", priority: "medium" },
  { headline: "FLASH: Bank of England holds rates at 5.25%, signals August cut possible", source: "BBC", category: "breaking", priority: "flash" },
  { headline: "Saudi Aramco reports $121B profit for FY2023, maintains $31B dividend", source: "Reuters", category: "market", priority: "high" },
];

// ═══════════════════ FINNHUB API ═══════════════════

const finnhubStockSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "JPM", "V", "GS"];
const finnhubCryptoSymbols = [
  { symbol: "BTC", finnhub: "BINANCE:BTCUSDT" },
  { symbol: "ETH", finnhub: "BINANCE:ETHUSDT" },
  { symbol: "SOL", finnhub: "BINANCE:SOLUSDT" },
];

let rateLimitHit = false;
let rateLimitResetTime = 0;

async function finnhubCall(endpoint: string, params?: Record<string, string>) {
  if (rateLimitHit && Date.now() < rateLimitResetTime) return null;
  rateLimitHit = false;
  try {
    const { data, error } = await supabase.functions.invoke('finnhub-proxy', { body: { endpoint, params } });
    if (error) throw error;
    if (data?.error && typeof data.error === 'string' && data.error.includes('API limit')) {
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
        ...stock, price: data.c,
        change: Math.round((data.c - data.pc) * 100) / 100,
        changePercent: data.pc ? Math.round(((data.c - data.pc) / data.pc) * 10000) / 100 : 0,
        high: data.h || data.c, low: data.l || data.c, open: data.o || data.c,
        history: [...stock.history.slice(1), data.c],
      };
      return updated;
    });
    setIsLive(true);
  }, []);

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
        ...updated[idx], price: data.c,
        change: Math.round((data.c - data.pc) * 100) / 100,
        changePercent: data.pc ? Math.round(((data.c - data.pc) / data.pc) * 10000) / 100 : 0,
        history: [...updated[idx].history.slice(1), data.c],
      };
      return updated;
    });
  }, []);

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
      time: new Date(item.datetime * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
      category: categoryMap[item.category?.toLowerCase()] || "market",
      priority: item.headline?.includes('FLASH') || item.headline?.includes('BREAKING') ? "flash" : "medium",
      url: item.url, image: item.image,
    }));
    if (newsItems.length > 0) setNews(newsItems);
  }, []);

  // Initialize
  useEffect(() => {
    const initial: NewsItem[] = newsPool.slice(0, 15).map((n, i) => ({
      ...n, id: `news-${i}`,
      time: new Date(Date.now() - i * 120000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
    }));
    setNews(initial);
    fetchNews();
  }, []);

  // API fetching intervals
  useEffect(() => {
    const stockInterval = setInterval(fetchNextStock, 2000);
    const cryptoInterval = setInterval(fetchNextCrypto, 4000);
    const newsInterval = setInterval(fetchNews, 120000);
    return () => { clearInterval(stockInterval); clearInterval(cryptoInterval); clearInterval(newsInterval); };
  }, [fetchNextStock, fetchNextCrypto, fetchNews]);

  // Stock micro-fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        const newPrice = randomFluctuation(stock.price, 0.03);
        const prevClose = stock.price - stock.change;
        const newChange = Math.round((newPrice - prevClose) * 100) / 100;
        return {
          ...stock, price: newPrice, change: newChange,
          changePercent: prevClose ? Math.round((newChange / prevClose) * 10000) / 100 : 0,
          high: Math.max(stock.high, newPrice), low: Math.min(stock.low, newPrice),
          history: [...stock.history.slice(1), newPrice],
        };
      }));
    }, 1500);
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
        const newValue = randomFluctuation(idx.value, 0.04);
        const newChange = Math.round((newValue - (idx.value - idx.change)) * 100) / 100;
        return { ...idx, value: newValue, change: newChange, changePercent: Math.round((newChange / (newValue - newChange)) * 10000) / 100, history: [...idx.history.slice(1), newValue] };
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Forex micro-fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setForex(prev => prev.map(f => {
        const newRate = randomFluctuation(f.rate, 0.015);
        return { ...f, rate: newRate, bid: newRate - 0.0002, ask: newRate + 0.0002, change: Math.round((newRate - f.rate + f.change) * 10000) / 10000, history: [...f.history.slice(1), newRate] };
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Commodities
  useEffect(() => {
    const interval = setInterval(() => {
      setCommodities(prev => prev.map(c => {
        const newPrice = randomFluctuation(c.price, 0.08);
        const newChange = Math.round((newPrice - c.price + c.change) * 100) / 100;
        return { ...c, price: newPrice, change: newChange, changePercent: Math.round((newChange / (newPrice - newChange)) * 10000) / 100, history: [...c.history.slice(1), newPrice] };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Bonds
  useEffect(() => {
    const interval = setInterval(() => {
      setBonds(prev => prev.map(b => {
        const newYield = Math.round((b.yield + (Math.random() - 0.5) * 0.02) * 100) / 100;
        return { ...b, yield: newYield, change: Math.round((newYield - b.yield + b.change) * 100) / 100, history: [...b.history.slice(1), newYield] };
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Crypto
  useEffect(() => {
    const interval = setInterval(() => {
      setCrypto(prev => prev.map(c => {
        const newPrice = randomFluctuation(c.price, 0.08);
        const prevClose = c.price - c.change;
        return { ...c, price: newPrice, change: Math.round((newPrice - prevClose) * 100) / 100, changePercent: prevClose ? Math.round(((newPrice - prevClose) / prevClose) * 10000) / 100 : 0, history: [...c.history.slice(1), newPrice] };
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // News rotation - always rotate
  useEffect(() => {
    const interval = setInterval(() => {
      const idx = newsIndexRef.current % newsPool.length;
      const now = new Date();
      const newItem: NewsItem = {
        ...newsPool[idx], id: `news-${Date.now()}`,
        time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
      };
      setNews(prev => [newItem, ...prev.slice(0, 30)]);
      newsIndexRef.current++;
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return { stocks, indices, forex, commodities, bonds, crypto, news, selectedStock, setSelectedStock, isLive };
}
