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
  // ── US - NASDAQ ──
  { symbol: "AAPL", name: "Apple Inc.", price: 248.49, change: -0.47, changePercent: -0.19, high: 249.06, low: 246.61, open: 248.71, volume: "52.3M", marketCap: "3.92T", history: genHistory(248.49, 20, 0.004), sector: "Technology", exchange: "NASDAQ", pe: 32.1, eps: 7.99, dividend: 1.00, beta: 1.24 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 384.53, change: -4.49, changePercent: -1.15, high: 388.11, low: 382.26, open: 388.11, volume: "23.1M", marketCap: "3.01T", history: genHistory(384.53, 20, 0.004), sector: "Technology", exchange: "NASDAQ", pe: 34.8, eps: 11.64, dividend: 3.32, beta: 0.87 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 301.97, change: -5.16, changePercent: -1.68, high: 306.13, low: 300.82, open: 306.13, volume: "18.7M", marketCap: "1.85T", history: genHistory(301.97, 20, 0.005), sector: "Technology", exchange: "NASDAQ", pe: 24.2, eps: 12.43, dividend: 0, beta: 1.05 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 206.65, change: -2.11, changePercent: -1.01, high: 207.98, low: 205.15, open: 207.98, volume: "45.2M", marketCap: "2.21T", history: genHistory(206.65, 20, 0.005), sector: "Consumer", exchange: "NASDAQ", pe: 42.3, eps: 4.96, dividend: 0, beta: 1.16 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 175.60, change: -2.96, changePercent: -1.66, high: 178.37, low: 175.00, open: 178.37, volume: "38.9M", marketCap: "4.40T", history: genHistory(175.60, 20, 0.008), sector: "Technology", exchange: "NASDAQ", pe: 55.2, eps: 3.25, dividend: 0.04, beta: 1.72 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 375.27, change: -5.03, changePercent: -1.32, high: 380.93, low: 369.90, open: 380.93, volume: "89.4M", marketCap: "1.25T", history: genHistory(375.27, 20, 0.01), sector: "Automotive", exchange: "NASDAQ", pe: 118.5, eps: 3.28, dividend: 0, beta: 2.08 },
  { symbol: "META", name: "Meta Platforms", price: 594.75, change: -11.95, changePercent: -1.97, high: 605.02, low: 591.73, open: 605.02, volume: "14.6M", marketCap: "1.60T", history: genHistory(594.75, 20, 0.006), sector: "Technology", exchange: "NASDAQ", pe: 25.4, eps: 24.96, dividend: 2.00, beta: 1.18 },
  { symbol: "AVGO", name: "Broadcom Inc.", price: 1842.30, change: 22.50, changePercent: 1.24, high: 1855.00, low: 1820.00, open: 1825.00, volume: "3.2M", marketCap: "856B", history: genHistory(1842.30, 20, 0.006), sector: "Technology", exchange: "NASDAQ", pe: 38.5, eps: 47.85, dividend: 21.00, beta: 1.15 },
  { symbol: "COST", name: "Costco Wholesale", price: 912.45, change: 4.20, changePercent: 0.46, high: 918.00, low: 908.30, open: 910.00, volume: "1.8M", marketCap: "405B", history: genHistory(912.45, 20, 0.003), sector: "Consumer", exchange: "NASDAQ", pe: 52.1, eps: 17.51, dividend: 4.08, beta: 0.73 },
  { symbol: "NFLX", name: "Netflix Inc.", price: 875.20, change: 12.30, changePercent: 1.43, high: 880.00, low: 862.50, open: 865.00, volume: "4.5M", marketCap: "378B", history: genHistory(875.20, 20, 0.007), sector: "Media", exchange: "NASDAQ", pe: 45.8, eps: 19.11, dividend: 0, beta: 1.28 },
  { symbol: "AMD", name: "AMD Inc.", price: 178.90, change: 3.45, changePercent: 1.97, high: 180.50, low: 175.20, open: 176.00, volume: "42.1M", marketCap: "289B", history: genHistory(178.90, 20, 0.008), sector: "Technology", exchange: "NASDAQ", pe: 48.2, eps: 3.71, dividend: 0, beta: 1.68 },
  { symbol: "INTC", name: "Intel Corp.", price: 24.85, change: -0.42, changePercent: -1.66, high: 25.40, low: 24.60, open: 25.20, volume: "38.5M", marketCap: "106B", history: genHistory(24.85, 20, 0.006), sector: "Technology", exchange: "NASDAQ", pe: 0, eps: -0.74, dividend: 0.50, beta: 0.92 },
  { symbol: "QCOM", name: "Qualcomm Inc.", price: 168.45, change: 2.80, changePercent: 1.69, high: 170.00, low: 166.20, open: 166.50, volume: "6.8M", marketCap: "188B", history: genHistory(168.45, 20, 0.006), sector: "Technology", exchange: "NASDAQ", pe: 18.4, eps: 9.15, dividend: 3.40, beta: 1.32 },
  { symbol: "ADBE", name: "Adobe Inc.", price: 442.80, change: -5.20, changePercent: -1.16, high: 448.50, low: 440.30, open: 448.00, volume: "3.1M", marketCap: "196B", history: genHistory(442.80, 20, 0.005), sector: "Technology", exchange: "NASDAQ", pe: 34.2, eps: 12.95, dividend: 0, beta: 1.18 },
  { symbol: "CRM", name: "Salesforce Inc.", price: 262.40, change: -3.80, changePercent: -1.43, high: 266.50, low: 261.00, open: 266.00, volume: "5.2M", marketCap: "254B", history: genHistory(262.40, 20, 0.005), sector: "Technology", exchange: "NASDAQ", pe: 42.8, eps: 6.13, dividend: 0, beta: 1.15 },
  { symbol: "CSCO", name: "Cisco Systems", price: 48.92, change: -0.38, changePercent: -0.77, high: 49.40, low: 48.60, open: 49.30, volume: "15.4M", marketCap: "198B", history: genHistory(48.92, 20, 0.004), sector: "Technology", exchange: "NASDAQ", pe: 14.8, eps: 3.31, dividend: 1.60, beta: 0.85 },
  { symbol: "PYPL", name: "PayPal Holdings", price: 62.45, change: 1.20, changePercent: 1.96, high: 63.00, low: 61.30, open: 61.50, volume: "9.8M", marketCap: "67B", history: genHistory(62.45, 20, 0.007), sector: "Fintech", exchange: "NASDAQ", pe: 15.8, eps: 3.95, dividend: 0, beta: 1.42 },
  { symbol: "UBER", name: "Uber Technologies", price: 78.30, change: -1.45, changePercent: -1.82, high: 79.80, low: 77.90, open: 79.70, volume: "12.5M", marketCap: "163B", history: genHistory(78.30, 20, 0.006), sector: "Technology", exchange: "NASDAQ", pe: 72.5, eps: 1.08, dividend: 0, beta: 1.38 },
  { symbol: "MU", name: "Micron Technology", price: 98.45, change: 2.10, changePercent: 2.18, high: 99.20, low: 96.50, open: 96.80, volume: "18.2M", marketCap: "109B", history: genHistory(98.45, 20, 0.008), sector: "Technology", exchange: "NASDAQ", pe: 22.5, eps: 4.38, dividend: 0.46, beta: 1.28 },
  { symbol: "PANW", name: "Palo Alto Networks", price: 312.50, change: 4.80, changePercent: 1.56, high: 315.00, low: 308.40, open: 309.00, volume: "2.8M", marketCap: "102B", history: genHistory(312.50, 20, 0.006), sector: "Cybersecurity", exchange: "NASDAQ", pe: 48.2, eps: 6.48, dividend: 0, beta: 1.25 },
  // ── US - NYSE ──
  { symbol: "JPM", name: "JPMorgan Chase", price: 287.89, change: -0.08, changePercent: -0.03, high: 289.10, low: 286.08, open: 288.39, volume: "8.3M", marketCap: "820B", history: genHistory(287.89, 20, 0.005), sector: "Financials", exchange: "NYSE", pe: 13.2, eps: 21.59, dividend: 5.00, beta: 1.07 },
  { symbol: "V", name: "Visa Inc.", price: 302.23, change: 2.52, changePercent: 0.84, high: 302.50, low: 299.01, open: 300.16, volume: "5.7M", marketCap: "640B", history: genHistory(302.23, 20, 0.004), sector: "Financials", exchange: "NYSE", pe: 31.8, eps: 9.81, dividend: 2.36, beta: 0.92 },
  { symbol: "GS", name: "Goldman Sachs", price: 815.43, change: 5.93, changePercent: 0.73, high: 820.11, low: 804.93, open: 810.50, volume: "2.8M", marketCap: "268B", history: genHistory(815.43, 20, 0.006), sector: "Financials", exchange: "NYSE", pe: 16.5, eps: 48.99, dividend: 12.00, beta: 1.32 },
  { symbol: "BRK.B", name: "Berkshire Hath.", price: 528.40, change: 3.60, changePercent: 0.69, high: 531.00, low: 525.20, open: 525.80, volume: "3.1M", marketCap: "1.14T", history: genHistory(528.40, 20, 0.003), sector: "Financials", exchange: "NYSE", pe: 9.2, eps: 57.43, dividend: 0, beta: 0.52 },
  { symbol: "WMT", name: "Walmart Inc.", price: 94.82, change: -0.68, changePercent: -0.71, high: 96.00, low: 94.20, open: 95.40, volume: "6.2M", marketCap: "764B", history: genHistory(94.82, 20, 0.003), sector: "Consumer", exchange: "NYSE", pe: 38.2, eps: 2.48, dividend: 0.83, beta: 0.48 },
  { symbol: "UNH", name: "UnitedHealth Grp", price: 472.30, change: 5.40, changePercent: 1.16, high: 476.00, low: 467.40, open: 468.50, volume: "3.6M", marketCap: "436B", history: genHistory(472.30, 20, 0.004), sector: "Healthcare", exchange: "NYSE", pe: 19.8, eps: 23.86, dividend: 7.52, beta: 0.62 },
  { symbol: "XOM", name: "Exxon Mobil", price: 118.45, change: 1.82, changePercent: 1.56, high: 119.50, low: 116.80, open: 117.00, volume: "11.4M", marketCap: "472B", history: genHistory(118.45, 20, 0.005), sector: "Energy", exchange: "NYSE", pe: 14.2, eps: 8.34, dividend: 3.96, beta: 0.92 },
  { symbol: "BA", name: "Boeing Co.", price: 178.90, change: -2.40, changePercent: -1.32, high: 182.00, low: 177.50, open: 181.20, volume: "7.8M", marketCap: "108B", history: genHistory(178.90, 20, 0.007), sector: "Industrials", exchange: "NYSE", pe: 0, eps: -7.94, dividend: 0, beta: 1.52 },
  { symbol: "DIS", name: "Walt Disney", price: 112.50, change: 1.80, changePercent: 1.63, high: 113.80, low: 110.90, open: 111.00, volume: "8.4M", marketCap: "206B", history: genHistory(112.50, 20, 0.005), sector: "Media", exchange: "NYSE", pe: 72.5, eps: 1.55, dividend: 0, beta: 1.24 },
  { symbol: "KO", name: "Coca-Cola Co.", price: 62.40, change: 0.35, changePercent: 0.56, high: 62.80, low: 62.00, open: 62.10, volume: "12.1M", marketCap: "270B", history: genHistory(62.40, 20, 0.002), sector: "Consumer", exchange: "NYSE", pe: 24.8, eps: 2.52, dividend: 1.94, beta: 0.58 },
  { symbol: "PFE", name: "Pfizer Inc.", price: 27.85, change: -0.32, changePercent: -1.14, high: 28.30, low: 27.60, open: 28.15, volume: "28.4M", marketCap: "158B", history: genHistory(27.85, 20, 0.004), sector: "Healthcare", exchange: "NYSE", pe: 48.2, eps: 0.58, dividend: 1.68, beta: 0.65 },
  { symbol: "MS", name: "Morgan Stanley", price: 102.80, change: 1.45, changePercent: 1.43, high: 103.50, low: 101.40, open: 101.60, volume: "6.4M", marketCap: "168B", history: genHistory(102.80, 20, 0.005), sector: "Financials", exchange: "NYSE", pe: 15.2, eps: 6.76, dividend: 3.40, beta: 1.28 },
  { symbol: "C", name: "Citigroup Inc.", price: 62.45, change: -0.85, changePercent: -1.34, high: 63.40, low: 62.10, open: 63.20, volume: "11.8M", marketCap: "120B", history: genHistory(62.45, 20, 0.005), sector: "Financials", exchange: "NYSE", pe: 8.4, eps: 7.43, dividend: 2.12, beta: 1.35 },
  { symbol: "BAC", name: "Bank of America", price: 38.92, change: -0.48, changePercent: -1.22, high: 39.50, low: 38.75, open: 39.40, volume: "32.5M", marketCap: "308B", history: genHistory(38.92, 20, 0.004), sector: "Financials", exchange: "NYSE", pe: 12.1, eps: 3.22, dividend: 0.96, beta: 1.18 },
  { symbol: "CVX", name: "Chevron Corp.", price: 158.40, change: 2.30, changePercent: 1.47, high: 159.50, low: 156.20, open: 156.50, volume: "5.8M", marketCap: "296B", history: genHistory(158.40, 20, 0.005), sector: "Energy", exchange: "NYSE", pe: 12.8, eps: 12.38, dividend: 6.52, beta: 0.88 },
  { symbol: "MCD", name: "McDonald's Corp.", price: 284.60, change: 1.80, changePercent: 0.64, high: 286.00, low: 283.20, open: 283.50, volume: "3.2M", marketCap: "204B", history: genHistory(284.60, 20, 0.003), sector: "Consumer", exchange: "NYSE", pe: 24.2, eps: 11.76, dividend: 6.68, beta: 0.62 },
  { symbol: "PG", name: "Procter & Gamble", price: 162.80, change: 0.95, changePercent: 0.59, high: 163.50, low: 162.00, open: 162.10, volume: "5.4M", marketCap: "384B", history: genHistory(162.80, 20, 0.002), sector: "Consumer", exchange: "NYSE", pe: 26.8, eps: 6.07, dividend: 3.76, beta: 0.42 },
  { symbol: "NKE", name: "Nike Inc.", price: 78.45, change: -1.20, changePercent: -1.51, high: 79.80, low: 78.10, open: 79.60, volume: "8.2M", marketCap: "119B", history: genHistory(78.45, 20, 0.006), sector: "Consumer", exchange: "NYSE", pe: 28.4, eps: 2.76, dividend: 1.48, beta: 1.08 },
  { symbol: "CAT", name: "Caterpillar Inc.", price: 342.80, change: 4.50, changePercent: 1.33, high: 345.00, low: 338.50, open: 339.00, volume: "2.4M", marketCap: "168B", history: genHistory(342.80, 20, 0.005), sector: "Industrials", exchange: "NYSE", pe: 16.8, eps: 20.40, dividend: 5.20, beta: 1.05 },
  { symbol: "DE", name: "Deere & Co.", price: 398.50, change: -5.20, changePercent: -1.29, high: 404.00, low: 396.80, open: 403.50, volume: "1.6M", marketCap: "115B", history: genHistory(398.50, 20, 0.005), sector: "Industrials", exchange: "NYSE", pe: 14.2, eps: 28.06, dividend: 5.60, beta: 0.92 },
  // ── Europe ──
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
  { symbol: "ROG", name: "Roche Holding", price: 248.50, change: 1.80, changePercent: 0.73, high: 250.00, low: 247.00, open: 247.20, volume: "1.8M", marketCap: "198B", history: genHistory(248.50, 20, 0.003), sector: "Healthcare", exchange: "SIX", pe: 15.8, eps: 15.73, dividend: 9.60, beta: 0.38 },
  { symbol: "UL", name: "Unilever PLC", price: 48.20, change: 0.45, changePercent: 0.94, high: 48.60, low: 47.80, open: 47.90, volume: "5.4M", marketCap: "124B", history: genHistory(48.20, 20, 0.003), sector: "Consumer", exchange: "LSE", pe: 18.2, eps: 2.65, dividend: 1.74, beta: 0.48 },
  { symbol: "BARC", name: "Barclays PLC", price: 2.82, change: 0.04, changePercent: 1.44, high: 2.85, low: 2.78, open: 2.79, volume: "42.5M", marketCap: "45B", history: genHistory(2.82, 20, 0.005), sector: "Financials", exchange: "LSE", pe: 6.8, eps: 0.41, dividend: 0.08, beta: 1.28 },
  { symbol: "BAS", name: "BASF SE", price: 48.60, change: -0.35, changePercent: -0.72, high: 49.10, low: 48.30, open: 49.00, volume: "3.8M", marketCap: "42B", history: genHistory(48.60, 20, 0.004), sector: "Chemicals", exchange: "XETRA", pe: 12.4, eps: 3.92, dividend: 3.40, beta: 1.12 },
  { symbol: "SAN", name: "Banco Santander", price: 4.28, change: 0.06, changePercent: 1.42, high: 4.32, low: 4.22, open: 4.23, volume: "68.2M", marketCap: "72B", history: genHistory(4.28, 20, 0.004), sector: "Financials", exchange: "BME", pe: 6.2, eps: 0.69, dividend: 0.18, beta: 1.22 },
  { symbol: "ENI", name: "Eni SpA", price: 14.85, change: 0.18, changePercent: 1.23, high: 14.95, low: 14.68, open: 14.70, volume: "8.5M", marketCap: "52B", history: genHistory(14.85, 20, 0.004), sector: "Energy", exchange: "BIT", pe: 7.8, eps: 1.90, dividend: 0.94, beta: 0.82 },
  { symbol: "AIR", name: "Airbus SE", price: 156.40, change: -1.80, changePercent: -1.14, high: 158.50, low: 155.80, open: 158.20, volume: "2.2M", marketCap: "124B", history: genHistory(156.40, 20, 0.005), sector: "Aerospace", exchange: "EURONEXT", pe: 28.5, eps: 5.49, dividend: 1.80, beta: 1.15 },
  // ── Asia - Japan ──
  { symbol: "7203", name: "Toyota Motor", price: 3485, change: 42, changePercent: 1.22, high: 3510, low: 3445, open: 3450, volume: "12.4M", marketCap: "458B", history: genHistory(3485, 20, 0.005), sector: "Automotive", exchange: "TSE", pe: 10.2, eps: 341.7, dividend: 72, beta: 0.68 },
  { symbol: "9984", name: "SoftBank Group", price: 9450, change: 142, changePercent: 1.53, high: 9520, low: 9310, open: 9340, volume: "8.2M", marketCap: "145B", history: genHistory(9450, 20, 0.006), sector: "Technology", exchange: "TSE", pe: 19.2, eps: 492, dividend: 48, beta: 1.38 },
  { symbol: "6758", name: "Sony Group", price: 13250, change: -180, changePercent: -1.34, high: 13480, low: 13200, open: 13420, volume: "5.6M", marketCap: "168B", history: genHistory(13250, 20, 0.005), sector: "Technology", exchange: "TSE", pe: 16.8, eps: 789, dividend: 65, beta: 0.82 },
  { symbol: "8306", name: "Mitsubishi UFJ", price: 1682, change: 18, changePercent: 1.08, high: 1698, low: 1665, open: 1668, volume: "28.4M", marketCap: "125B", history: genHistory(1682, 20, 0.004), sector: "Financials", exchange: "TSE", pe: 11.2, eps: 150.2, dividend: 41, beta: 0.92 },
  { symbol: "6861", name: "Keyence Corp", price: 68500, change: 850, changePercent: 1.26, high: 69200, low: 67800, open: 67900, volume: "0.8M", marketCap: "167B", history: genHistory(68500, 20, 0.005), sector: "Technology", exchange: "TSE", pe: 42.1, eps: 1627, dividend: 300, beta: 0.95 },
  { symbol: "9432", name: "NTT Corp", price: 172.50, change: 0.80, changePercent: 0.47, high: 173.20, low: 171.80, open: 171.90, volume: "18.4M", marketCap: "148B", history: genHistory(172.50, 20, 0.003), sector: "Telecom", exchange: "TSE", pe: 12.4, eps: 13.91, dividend: 5.10, beta: 0.42 },
  { symbol: "4502", name: "Takeda Pharma", price: 4285, change: -42, changePercent: -0.97, high: 4340, low: 4270, open: 4325, volume: "5.2M", marketCap: "68B", history: genHistory(4285, 20, 0.004), sector: "Healthcare", exchange: "TSE", pe: 18.5, eps: 231.6, dividend: 188, beta: 0.55 },
  { symbol: "6902", name: "Denso Corp", price: 2148, change: 28, changePercent: 1.32, high: 2165, low: 2122, open: 2125, volume: "3.4M", marketCap: "32B", history: genHistory(2148, 20, 0.005), sector: "Automotive", exchange: "TSE", pe: 14.8, eps: 145.1, dividend: 50, beta: 0.78 },
  // ── Asia - China/HK ──
  { symbol: "700", name: "Tencent Holdings", price: 442.80, change: -3.20, changePercent: -0.72, high: 448.00, low: 440.50, open: 446.00, volume: "14.5M", marketCap: "520B", history: genHistory(442.80, 20, 0.006), sector: "Technology", exchange: "HKEX", pe: 21.5, eps: 20.60, dividend: 3.60, beta: 0.74 },
  { symbol: "9988", name: "Alibaba Group", price: 82.45, change: 1.85, changePercent: 2.29, high: 83.20, low: 80.80, open: 81.00, volume: "22.8M", marketCap: "208B", history: genHistory(82.45, 20, 0.007), sector: "Technology", exchange: "HKEX", pe: 11.8, eps: 6.99, dividend: 1.28, beta: 0.85 },
  { symbol: "1299", name: "AIA Group", price: 58.90, change: 0.65, changePercent: 1.12, high: 59.30, low: 58.30, open: 58.40, volume: "8.4M", marketCap: "68B", history: genHistory(58.90, 20, 0.004), sector: "Insurance", exchange: "HKEX", pe: 14.8, eps: 3.98, dividend: 1.56, beta: 0.82 },
  { symbol: "3690", name: "Meituan", price: 128.50, change: 3.80, changePercent: 3.05, high: 130.00, low: 125.00, open: 125.50, volume: "16.2M", marketCap: "82B", history: genHistory(128.50, 20, 0.008), sector: "Technology", exchange: "HKEX", pe: 28.4, eps: 4.52, dividend: 0, beta: 1.12 },
  { symbol: "941", name: "China Mobile", price: 72.80, change: 0.45, changePercent: 0.62, high: 73.20, low: 72.30, open: 72.40, volume: "12.8M", marketCap: "158B", history: genHistory(72.80, 20, 0.003), sector: "Telecom", exchange: "HKEX", pe: 10.2, eps: 7.14, dividend: 4.42, beta: 0.52 },
  { symbol: "2318", name: "Ping An Insurance", price: 38.45, change: -0.65, changePercent: -1.66, high: 39.20, low: 38.20, open: 39.10, volume: "28.4M", marketCap: "72B", history: genHistory(38.45, 20, 0.005), sector: "Insurance", exchange: "HKEX", pe: 6.8, eps: 5.65, dividend: 2.42, beta: 0.92 },
  { symbol: "1398", name: "ICBC", price: 4.85, change: 0.03, changePercent: 0.62, high: 4.88, low: 4.82, open: 4.83, volume: "85.4M", marketCap: "248B", history: genHistory(4.85, 20, 0.003), sector: "Financials", exchange: "HKEX", pe: 4.8, eps: 1.01, dividend: 0.30, beta: 0.62 },
  // ── Asia - India ──
  { symbol: "RELIANCE", name: "Reliance Ind.", price: 1285.60, change: 15.40, changePercent: 1.21, high: 1292.00, low: 1272.00, open: 1274.00, volume: "9.8M", marketCap: "218B", history: genHistory(1285.60, 20, 0.005), sector: "Energy", exchange: "NSE", pe: 26.8, eps: 47.97, dividend: 10, beta: 0.78 },
  { symbol: "TCS", name: "Tata Consultancy", price: 3842.50, change: 28.40, changePercent: 0.74, high: 3860.00, low: 3815.00, open: 3820.00, volume: "3.2M", marketCap: "140B", history: genHistory(3842.50, 20, 0.004), sector: "Technology", exchange: "NSE", pe: 28.5, eps: 134.8, dividend: 75, beta: 0.62 },
  { symbol: "INFY", name: "Infosys Ltd.", price: 1568.20, change: -12.40, changePercent: -0.78, high: 1585.00, low: 1560.00, open: 1580.00, volume: "8.5M", marketCap: "65B", history: genHistory(1568.20, 20, 0.005), sector: "Technology", exchange: "NSE", pe: 24.2, eps: 64.8, dividend: 34, beta: 0.72 },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1642.80, change: 18.60, changePercent: 1.15, high: 1658.00, low: 1628.00, open: 1630.00, volume: "6.8M", marketCap: "124B", history: genHistory(1642.80, 20, 0.004), sector: "Financials", exchange: "NSE", pe: 18.4, eps: 89.3, dividend: 19.5, beta: 0.85 },
  { symbol: "ICICIBANK", name: "ICICI Bank", price: 1124.50, change: 8.20, changePercent: 0.73, high: 1132.00, low: 1118.00, open: 1120.00, volume: "12.4M", marketCap: "78B", history: genHistory(1124.50, 20, 0.004), sector: "Financials", exchange: "NSE", pe: 16.8, eps: 66.9, dividend: 10, beta: 0.92 },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever", price: 2384.60, change: -14.20, changePercent: -0.59, high: 2405.00, low: 2378.00, open: 2398.00, volume: "2.1M", marketCap: "56B", history: genHistory(2384.60, 20, 0.003), sector: "Consumer", exchange: "NSE", pe: 58.2, eps: 40.97, dividend: 42, beta: 0.38 },
  { symbol: "WIPRO", name: "Wipro Ltd.", price: 452.30, change: 3.80, changePercent: 0.85, high: 456.00, low: 449.00, open: 449.50, volume: "5.8M", marketCap: "23B", history: genHistory(452.30, 20, 0.005), sector: "Technology", exchange: "NSE", pe: 22.4, eps: 20.19, dividend: 6, beta: 0.68 },
  { symbol: "SBIN", name: "State Bank India", price: 628.40, change: 8.50, changePercent: 1.37, high: 632.00, low: 620.50, open: 621.00, volume: "18.5M", marketCap: "56B", history: genHistory(628.40, 20, 0.005), sector: "Financials", exchange: "NSE", pe: 8.2, eps: 76.63, dividend: 11.3, beta: 1.12 },
  { symbol: "TATAMOTORS", name: "Tata Motors", price: 945.20, change: -12.80, changePercent: -1.34, high: 960.00, low: 942.00, open: 958.00, volume: "14.2M", marketCap: "35B", history: genHistory(945.20, 20, 0.006), sector: "Automotive", exchange: "NSE", pe: 8.4, eps: 112.5, dividend: 6, beta: 1.32 },
  { symbol: "BAJFINANCE", name: "Bajaj Finance", price: 6842.50, change: 85.40, changePercent: 1.26, high: 6880.00, low: 6760.00, open: 6780.00, volume: "2.4M", marketCap: "42B", history: genHistory(6842.50, 20, 0.005), sector: "Financials", exchange: "NSE", pe: 32.5, eps: 210.5, dividend: 30, beta: 1.18 },
  { symbol: "ITC", name: "ITC Limited", price: 442.80, change: 2.40, changePercent: 0.54, high: 445.00, low: 440.50, open: 441.00, volume: "8.2M", marketCap: "55B", history: genHistory(442.80, 20, 0.003), sector: "Consumer", exchange: "NSE", pe: 26.4, eps: 16.77, dividend: 13.25, beta: 0.45 },
  // ── Asia - Korea/Taiwan ──
  { symbol: "TSM", name: "Taiwan Semi.", price: 192.40, change: 4.20, changePercent: 2.23, high: 194.00, low: 188.50, open: 189.00, volume: "16.8M", marketCap: "998B", history: genHistory(192.40, 20, 0.006), sector: "Technology", exchange: "TWSE", pe: 28.4, eps: 6.77, dividend: 4.00, beta: 1.12 },
  { symbol: "SAMSUNG", name: "Samsung Elec.", price: 58400, change: 650, changePercent: 1.13, high: 58800, low: 57750, open: 57800, volume: "15.2M", marketCap: "348B", history: genHistory(58400, 20, 0.005), sector: "Technology", exchange: "KRX", pe: 13.2, eps: 4424, dividend: 1444, beta: 1.15 },
  { symbol: "SKHYNIX", name: "SK Hynix", price: 178500, change: 4200, changePercent: 2.41, high: 180000, low: 174500, open: 175000, volume: "4.8M", marketCap: "130B", history: genHistory(178500, 20, 0.007), sector: "Technology", exchange: "KRX", pe: 8.5, eps: 21000, dividend: 1200, beta: 1.42 },
  { symbol: "HYUNDAI", name: "Hyundai Motor", price: 248000, change: 3500, changePercent: 1.43, high: 250000, low: 245000, open: 245500, volume: "2.8M", marketCap: "52B", history: genHistory(248000, 20, 0.005), sector: "Automotive", exchange: "KRX", pe: 5.8, eps: 42759, dividend: 9000, beta: 0.92 },
  { symbol: "MEDIATEK", name: "MediaTek Inc.", price: 1245, change: 18, changePercent: 1.47, high: 1255, low: 1228, open: 1230, volume: "6.8M", marketCap: "58B", history: genHistory(1245, 20, 0.006), sector: "Technology", exchange: "TWSE", pe: 16.8, eps: 74.1, dividend: 42, beta: 1.08 },
  // ── Australia ──
  { symbol: "BHP", name: "BHP Group", price: 42.80, change: 0.65, changePercent: 1.54, high: 43.10, low: 42.20, open: 42.30, volume: "18.5M", marketCap: "218B", history: genHistory(42.80, 20, 0.005), sector: "Mining", exchange: "ASX", pe: 12.8, eps: 3.34, dividend: 2.54, beta: 1.08 },
  { symbol: "CBA", name: "Commonwealth Bank", price: 128.45, change: 1.20, changePercent: 0.94, high: 129.20, low: 127.40, open: 127.60, volume: "4.2M", marketCap: "215B", history: genHistory(128.45, 20, 0.003), sector: "Financials", exchange: "ASX", pe: 22.4, eps: 5.73, dividend: 4.50, beta: 0.62 },
  { symbol: "CSL", name: "CSL Limited", price: 284.50, change: 3.20, changePercent: 1.14, high: 286.00, low: 281.80, open: 282.00, volume: "1.8M", marketCap: "136B", history: genHistory(284.50, 20, 0.004), sector: "Healthcare", exchange: "ASX", pe: 38.4, eps: 7.41, dividend: 3.14, beta: 0.52 },
  { symbol: "WBC", name: "Westpac Banking", price: 25.80, change: 0.18, changePercent: 0.70, high: 26.00, low: 25.60, open: 25.65, volume: "8.4M", marketCap: "88B", history: genHistory(25.80, 20, 0.004), sector: "Financials", exchange: "ASX", pe: 14.8, eps: 1.74, dividend: 1.42, beta: 0.82 },
  // ── Brazil ──
  { symbol: "VALE3", name: "Vale SA", price: 62.50, change: -0.85, changePercent: -1.34, high: 63.80, low: 62.20, open: 63.40, volume: "28.4M", marketCap: "58B", history: genHistory(62.50, 20, 0.006), sector: "Mining", exchange: "B3", pe: 5.8, eps: 10.78, dividend: 5.42, beta: 1.18 },
  { symbol: "PETR4", name: "Petrobras", price: 38.42, change: 0.48, changePercent: 1.27, high: 38.80, low: 37.95, open: 38.00, volume: "42.1M", marketCap: "84B", history: genHistory(38.42, 20, 0.005), sector: "Energy", exchange: "B3", pe: 3.8, eps: 10.11, dividend: 8.24, beta: 1.25 },
  { symbol: "ITUB4", name: "Itaú Unibanco", price: 32.85, change: 0.42, changePercent: 1.30, high: 33.10, low: 32.45, open: 32.50, volume: "18.4M", marketCap: "64B", history: genHistory(32.85, 20, 0.004), sector: "Financials", exchange: "B3", pe: 8.2, eps: 4.01, dividend: 1.28, beta: 0.95 },
  // ── Middle East ──
  { symbol: "2222", name: "Saudi Aramco", price: 28.45, change: 0.15, changePercent: 0.53, high: 28.60, low: 28.30, open: 28.35, volume: "18.2M", marketCap: "1.86T", history: genHistory(28.45, 20, 0.002), sector: "Energy", exchange: "TADAWUL", pe: 14.8, eps: 1.92, dividend: 0.78, beta: 0.42 },
  { symbol: "2010", name: "SABIC", price: 78.40, change: -0.60, changePercent: -0.76, high: 79.20, low: 78.10, open: 79.00, volume: "4.2M", marketCap: "62B", history: genHistory(78.40, 20, 0.004), sector: "Chemicals", exchange: "TADAWUL", pe: 22.5, eps: 3.48, dividend: 4.00, beta: 0.78 },
  { symbol: "FAB", name: "First Abu Dhabi", price: 14.20, change: 0.12, changePercent: 0.85, high: 14.30, low: 14.08, open: 14.10, volume: "8.5M", marketCap: "78B", history: genHistory(14.20, 20, 0.003), sector: "Financials", exchange: "ADX", pe: 12.4, eps: 1.15, dividend: 0.72, beta: 0.62 },
  // ── Africa ──
  { symbol: "NPN", name: "Naspers Ltd.", price: 3485, change: 42, changePercent: 1.22, high: 3520, low: 3445, open: 3450, volume: "1.8M", marketCap: "42B", history: genHistory(3485, 20, 0.006), sector: "Technology", exchange: "JSE", pe: 18.4, eps: 189.4, dividend: 12, beta: 0.85 },
  { symbol: "AGL", name: "Anglo American", price: 482.50, change: 8.40, changePercent: 1.77, high: 486.00, low: 475.00, open: 476.00, volume: "3.2M", marketCap: "28B", history: genHistory(482.50, 20, 0.006), sector: "Mining", exchange: "JSE", pe: 8.2, eps: 58.84, dividend: 18.50, beta: 1.28 },
  // ── Canada ──
  { symbol: "RY", name: "Royal Bank Canada", price: 138.40, change: 1.20, changePercent: 0.87, high: 139.00, low: 137.30, open: 137.50, volume: "4.8M", marketCap: "196B", history: genHistory(138.40, 20, 0.003), sector: "Financials", exchange: "TSX", pe: 13.4, eps: 10.33, dividend: 5.52, beta: 0.72 },
  { symbol: "CNR", name: "Canadian National", price: 168.50, change: -1.40, changePercent: -0.82, high: 170.20, low: 168.00, open: 169.80, volume: "2.4M", marketCap: "72B", history: genHistory(168.50, 20, 0.004), sector: "Transport", exchange: "TSX", pe: 22.8, eps: 7.39, dividend: 3.16, beta: 0.68 },
  { symbol: "SHOP", name: "Shopify Inc.", price: 82.40, change: 2.80, changePercent: 3.52, high: 83.50, low: 79.80, open: 80.00, volume: "12.5M", marketCap: "106B", history: genHistory(82.40, 20, 0.008), sector: "Technology", exchange: "TSX", pe: 68.5, eps: 1.20, dividend: 0, beta: 1.85 },
  // ── Singapore ──
  { symbol: "D05", name: "DBS Group", price: 34.85, change: 0.28, changePercent: 0.81, high: 35.00, low: 34.58, open: 34.60, volume: "5.2M", marketCap: "92B", history: genHistory(34.85, 20, 0.003), sector: "Financials", exchange: "SGX", pe: 10.8, eps: 3.23, dividend: 2.16, beta: 0.72 },
  { symbol: "U11", name: "UOB Ltd.", price: 32.40, change: 0.15, changePercent: 0.46, high: 32.60, low: 32.25, open: 32.28, volume: "3.8M", marketCap: "54B", history: genHistory(32.40, 20, 0.003), sector: "Financials", exchange: "SGX", pe: 9.8, eps: 3.31, dividend: 1.70, beta: 0.68 },
];

const initialIndices: MarketIndex[] = [
  // Americas
  { name: "S&P 500", value: 5234.18, change: 42.30, changePercent: 0.81, region: "Americas", history: genHistory(5234.18, 20, 0.003) },
  { name: "DOW 30", value: 39512.84, change: 312.50, changePercent: 0.80, region: "Americas", history: genHistory(39512.84, 20, 0.003) },
  { name: "NASDAQ", value: 16428.82, change: 198.40, changePercent: 1.22, region: "Americas", history: genHistory(16428.82, 20, 0.004) },
  { name: "RUSSELL 2K", value: 2084.35, change: -12.80, changePercent: -0.61, region: "Americas", history: genHistory(2084.35, 20, 0.005) },
  { name: "S&P/TSX", value: 22184.60, change: 85.40, changePercent: 0.39, region: "Americas", history: genHistory(22184.60, 20, 0.003) },
  { name: "BOVESPA", value: 128432.50, change: -456.80, changePercent: -0.35, region: "Americas", history: genHistory(128432.50, 20, 0.005) },
  { name: "IPC MEXICO", value: 56842.30, change: 184.50, changePercent: 0.33, region: "Americas", history: genHistory(56842.30, 20, 0.004) },
  { name: "S&P MERVAL", value: 1284500, change: 18420, changePercent: 1.46, region: "Americas", history: genHistory(1284500, 20, 0.008) },
  // Europe
  { name: "FTSE 100", value: 8164.12, change: 28.50, changePercent: 0.35, region: "Europe", history: genHistory(8164.12, 20, 0.003) },
  { name: "DAX", value: 18492.49, change: 156.30, changePercent: 0.85, region: "Europe", history: genHistory(18492.49, 20, 0.004) },
  { name: "CAC 40", value: 8184.75, change: 42.10, changePercent: 0.52, region: "Europe", history: genHistory(8184.75, 20, 0.003) },
  { name: "STOXX 600", value: 512.38, change: 3.24, changePercent: 0.64, region: "Europe", history: genHistory(512.38, 20, 0.003) },
  { name: "IBEX 35", value: 11084.20, change: -28.40, changePercent: -0.26, region: "Europe", history: genHistory(11084.20, 20, 0.004) },
  { name: "SMI", value: 11842.30, change: 62.80, changePercent: 0.53, region: "Europe", history: genHistory(11842.30, 20, 0.003) },
  { name: "FTSE MIB", value: 34285.40, change: 185.20, changePercent: 0.54, region: "Europe", history: genHistory(34285.40, 20, 0.004) },
  { name: "AEX", value: 882.45, change: 5.80, changePercent: 0.66, region: "Europe", history: genHistory(882.45, 20, 0.003) },
  { name: "OMX STKH", value: 2485.30, change: 14.20, changePercent: 0.57, region: "Europe", history: genHistory(2485.30, 20, 0.004) },
  { name: "PSI 20", value: 6842.50, change: 28.40, changePercent: 0.42, region: "Europe", history: genHistory(6842.50, 20, 0.004) },
  { name: "ATX", value: 3542.80, change: -12.40, changePercent: -0.35, region: "Europe", history: genHistory(3542.80, 20, 0.004) },
  { name: "WIG 20", value: 2485.60, change: 18.40, changePercent: 0.75, region: "Europe", history: genHistory(2485.60, 20, 0.005) },
  { name: "BEL 20", value: 3842.50, change: 22.80, changePercent: 0.60, region: "Europe", history: genHistory(3842.50, 20, 0.003) },
  { name: "MOEX", value: 3284.50, change: -42.30, changePercent: -1.27, region: "Europe", history: genHistory(3284.50, 20, 0.006) },
  // Asia-Pacific
  { name: "NIKKEI 225", value: 40168.07, change: -234.20, changePercent: -0.58, region: "Asia-Pacific", history: genHistory(40168.07, 20, 0.005) },
  { name: "TOPIX", value: 2785.40, change: -12.80, changePercent: -0.46, region: "Asia-Pacific", history: genHistory(2785.40, 20, 0.004) },
  { name: "HANG SENG", value: 16725.86, change: 89.40, changePercent: 0.54, region: "Asia-Pacific", history: genHistory(16725.86, 20, 0.006) },
  { name: "SHANGHAI", value: 3078.42, change: 12.60, changePercent: 0.41, region: "Asia-Pacific", history: genHistory(3078.42, 20, 0.004) },
  { name: "CSI 300", value: 3542.80, change: 18.40, changePercent: 0.52, region: "Asia-Pacific", history: genHistory(3542.80, 20, 0.004) },
  { name: "SENSEX", value: 74248.22, change: 428.60, changePercent: 0.58, region: "Asia-Pacific", history: genHistory(74248.22, 20, 0.004) },
  { name: "NIFTY 50", value: 22584.30, change: 142.80, changePercent: 0.64, region: "Asia-Pacific", history: genHistory(22584.30, 20, 0.004) },
  { name: "NIFTY BANK", value: 48245.80, change: 285.40, changePercent: 0.59, region: "Asia-Pacific", history: genHistory(48245.80, 20, 0.005) },
  { name: "KOSPI", value: 2684.35, change: -18.40, changePercent: -0.68, region: "Asia-Pacific", history: genHistory(2684.35, 20, 0.005) },
  { name: "ASX 200", value: 7852.40, change: 34.20, changePercent: 0.44, region: "Asia-Pacific", history: genHistory(7852.40, 20, 0.003) },
  { name: "STRAITS T", value: 3284.65, change: 8.40, changePercent: 0.26, region: "Asia-Pacific", history: genHistory(3284.65, 20, 0.003) },
  { name: "TAIEX", value: 20485.60, change: 156.80, changePercent: 0.77, region: "Asia-Pacific", history: genHistory(20485.60, 20, 0.005) },
  { name: "SET INDEX", value: 1384.50, change: -4.20, changePercent: -0.30, region: "Asia-Pacific", history: genHistory(1384.50, 20, 0.004) },
  { name: "JAKARTA", value: 7245.80, change: 32.40, changePercent: 0.45, region: "Asia-Pacific", history: genHistory(7245.80, 20, 0.004) },
  { name: "KLCI", value: 1542.30, change: 4.80, changePercent: 0.31, region: "Asia-Pacific", history: genHistory(1542.30, 20, 0.003) },
  { name: "PSEI", value: 6842.50, change: -28.40, changePercent: -0.41, region: "Asia-Pacific", history: genHistory(6842.50, 20, 0.005) },
  { name: "NZX 50", value: 11842.30, change: 42.80, changePercent: 0.36, region: "Asia-Pacific", history: genHistory(11842.30, 20, 0.003) },
  { name: "KARACHI", value: 72485.60, change: 842.30, changePercent: 1.18, region: "Asia-Pacific", history: genHistory(72485.60, 20, 0.006) },
  { name: "COLOMBO", value: 12485.60, change: 62.40, changePercent: 0.50, region: "Asia-Pacific", history: genHistory(12485.60, 20, 0.004) },
  { name: "DHAKA", value: 5842.30, change: -18.40, changePercent: -0.31, region: "Asia-Pacific", history: genHistory(5842.30, 20, 0.005) },
  { name: "HO CHI MINH", value: 1284.50, change: 8.20, changePercent: 0.64, region: "Asia-Pacific", history: genHistory(1284.50, 20, 0.005) },
  // Middle East
  { name: "TADAWUL", value: 12184.50, change: -42.30, changePercent: -0.35, region: "Middle East", history: genHistory(12184.50, 20, 0.003) },
  { name: "DFM", value: 4285.80, change: 22.40, changePercent: 0.53, region: "Middle East", history: genHistory(4285.80, 20, 0.004) },
  { name: "ADX", value: 9845.20, change: 42.80, changePercent: 0.44, region: "Middle East", history: genHistory(9845.20, 20, 0.003) },
  { name: "QE INDEX", value: 10485.60, change: -28.40, changePercent: -0.27, region: "Middle East", history: genHistory(10485.60, 20, 0.004) },
  { name: "TASE 125", value: 2184.50, change: 12.40, changePercent: 0.57, region: "Middle East", history: genHistory(2184.50, 20, 0.004) },
  { name: "EGX 30", value: 28485.60, change: 185.40, changePercent: 0.66, region: "Middle East", history: genHistory(28485.60, 20, 0.005) },
  { name: "BIST 100", value: 9842.50, change: 82.40, changePercent: 0.84, region: "Middle East", history: genHistory(9842.50, 20, 0.006) },
  { name: "MUSCAT", value: 4685.20, change: 8.40, changePercent: 0.18, region: "Middle East", history: genHistory(4685.20, 20, 0.003) },
  // Africa
  { name: "JSE TOP40", value: 72845.20, change: 385.60, changePercent: 0.53, region: "Africa", history: genHistory(72845.20, 20, 0.004) },
  { name: "NSE NIGR", value: 98542.30, change: 642.80, changePercent: 0.66, region: "Africa", history: genHistory(98542.30, 20, 0.005) },
  { name: "NSE KENYA", value: 1842.50, change: -8.40, changePercent: -0.45, region: "Africa", history: genHistory(1842.50, 20, 0.005) },
  { name: "CASABLANCA", value: 12845.60, change: 42.80, changePercent: 0.33, region: "Africa", history: genHistory(12845.60, 20, 0.004) },
];

const initialForex: ForexPair[] = [
  // Major Pairs
  { pair: "EUR/USD", rate: 1.0842, change: 0.0012, bid: 1.0840, ask: 1.0844, history: genHistory(1.0842, 20, 0.001) },
  { pair: "GBP/USD", rate: 1.2678, change: -0.0008, bid: 1.2676, ask: 1.2680, history: genHistory(1.2678, 20, 0.001) },
  { pair: "USD/JPY", rate: 151.34, change: 0.42, bid: 151.32, ask: 151.36, history: genHistory(151.34, 20, 0.002) },
  { pair: "USD/CHF", rate: 0.8812, change: -0.0015, bid: 0.8810, ask: 0.8814, history: genHistory(0.8812, 20, 0.001) },
  { pair: "AUD/USD", rate: 0.6534, change: 0.0023, bid: 0.6532, ask: 0.6536, history: genHistory(0.6534, 20, 0.002) },
  { pair: "USD/CAD", rate: 1.3567, change: 0.0018, bid: 1.3565, ask: 1.3569, history: genHistory(1.3567, 20, 0.001) },
  { pair: "NZD/USD", rate: 0.6012, change: -0.0018, bid: 0.6010, ask: 0.6014, history: genHistory(0.6012, 20, 0.002) },
  // Cross Pairs
  { pair: "EUR/GBP", rate: 0.8553, change: 0.0008, bid: 0.8551, ask: 0.8555, history: genHistory(0.8553, 20, 0.001) },
  { pair: "EUR/JPY", rate: 164.08, change: 0.56, bid: 164.06, ask: 164.10, history: genHistory(164.08, 20, 0.002) },
  { pair: "GBP/JPY", rate: 191.82, change: 0.38, bid: 191.80, ask: 191.84, history: genHistory(191.82, 20, 0.002) },
  { pair: "EUR/CHF", rate: 0.9548, change: -0.0008, bid: 0.9546, ask: 0.9550, history: genHistory(0.9548, 20, 0.001) },
  { pair: "AUD/JPY", rate: 98.84, change: 0.28, bid: 98.82, ask: 98.86, history: genHistory(98.84, 20, 0.002) },
  { pair: "EUR/AUD", rate: 1.6592, change: -0.0024, bid: 1.6590, ask: 1.6594, history: genHistory(1.6592, 20, 0.001) },
  { pair: "GBP/AUD", rate: 1.9408, change: 0.0032, bid: 1.9406, ask: 1.9410, history: genHistory(1.9408, 20, 0.002) },
  { pair: "CAD/JPY", rate: 111.52, change: 0.18, bid: 111.50, ask: 111.54, history: genHistory(111.52, 20, 0.002) },
  { pair: "NZD/JPY", rate: 90.92, change: -0.12, bid: 90.90, ask: 90.94, history: genHistory(90.92, 20, 0.002) },
  // Emerging Market
  { pair: "USD/CNH", rate: 7.2485, change: -0.0124, bid: 7.2480, ask: 7.2490, history: genHistory(7.2485, 20, 0.001) },
  { pair: "USD/INR", rate: 83.12, change: 0.08, bid: 83.10, ask: 83.14, history: genHistory(83.12, 20, 0.001) },
  { pair: "USD/SGD", rate: 1.3428, change: 0.0008, bid: 1.3426, ask: 1.3430, history: genHistory(1.3428, 20, 0.001) },
  { pair: "USD/HKD", rate: 7.8124, change: 0.0002, bid: 7.8122, ask: 7.8126, history: genHistory(7.8124, 20, 0.0003) },
  { pair: "USD/KRW", rate: 1342.50, change: -2.80, bid: 1342.30, ask: 1342.70, history: genHistory(1342.50, 20, 0.002) },
  { pair: "USD/TRY", rate: 32.15, change: 0.08, bid: 32.13, ask: 32.17, history: genHistory(32.15, 20, 0.002) },
  { pair: "USD/BRL", rate: 4.97, change: -0.02, bid: 4.96, ask: 4.98, history: genHistory(4.97, 20, 0.003) },
  { pair: "USD/MXN", rate: 17.12, change: 0.04, bid: 17.10, ask: 17.14, history: genHistory(17.12, 20, 0.002) },
  { pair: "USD/ZAR", rate: 18.42, change: -0.08, bid: 18.40, ask: 18.44, history: genHistory(18.42, 20, 0.003) },
  { pair: "USD/SAR", rate: 3.7500, change: 0.0000, bid: 3.7498, ask: 3.7502, history: genHistory(3.7500, 20, 0.0002) },
  { pair: "USD/THB", rate: 35.42, change: 0.12, bid: 35.40, ask: 35.44, history: genHistory(35.42, 20, 0.002) },
  { pair: "USD/MYR", rate: 4.7250, change: -0.0080, bid: 4.7240, ask: 4.7260, history: genHistory(4.7250, 20, 0.002) },
  { pair: "USD/IDR", rate: 15842, change: 28, bid: 15838, ask: 15846, history: genHistory(15842, 20, 0.002) },
  { pair: "USD/PHP", rate: 56.42, change: 0.15, bid: 56.40, ask: 56.44, history: genHistory(56.42, 20, 0.002) },
  { pair: "USD/TWD", rate: 31.85, change: -0.08, bid: 31.83, ask: 31.87, history: genHistory(31.85, 20, 0.001) },
  { pair: "USD/CLP", rate: 942.50, change: 4.80, bid: 942.00, ask: 943.00, history: genHistory(942.50, 20, 0.003) },
  { pair: "USD/COP", rate: 3942.50, change: -18.40, bid: 3940.00, ask: 3945.00, history: genHistory(3942.50, 20, 0.003) },
  { pair: "USD/PEN", rate: 3.72, change: 0.01, bid: 3.71, ask: 3.73, history: genHistory(3.72, 20, 0.002) },
  { pair: "USD/EGP", rate: 48.85, change: 0.12, bid: 48.80, ask: 48.90, history: genHistory(48.85, 20, 0.002) },
  { pair: "USD/NGN", rate: 1542.50, change: 8.40, bid: 1540.00, ask: 1545.00, history: genHistory(1542.50, 20, 0.003) },
  { pair: "USD/PKR", rate: 278.50, change: 0.45, bid: 278.30, ask: 278.70, history: genHistory(278.50, 20, 0.002) },
  { pair: "USD/BDT", rate: 110.50, change: 0.08, bid: 110.40, ask: 110.60, history: genHistory(110.50, 20, 0.001) },
  { pair: "USD/LKR", rate: 312.50, change: -1.20, bid: 312.00, ask: 313.00, history: genHistory(312.50, 20, 0.002) },
  { pair: "USD/VND", rate: 25142, change: 28, bid: 25138, ask: 25146, history: genHistory(25142, 20, 0.001) },
  { pair: "USD/AED", rate: 3.6725, change: 0.0000, bid: 3.6723, ask: 3.6727, history: genHistory(3.6725, 20, 0.0002) },
  { pair: "USD/QAR", rate: 3.6400, change: 0.0000, bid: 3.6398, ask: 3.6402, history: genHistory(3.6400, 20, 0.0002) },
  { pair: "USD/KWD", rate: 0.3082, change: -0.0002, bid: 0.3080, ask: 0.3084, history: genHistory(0.3082, 20, 0.0005) },
  { pair: "EUR/NOK", rate: 11.54, change: 0.04, bid: 11.53, ask: 11.55, history: genHistory(11.54, 20, 0.002) },
  { pair: "EUR/SEK", rate: 11.32, change: -0.02, bid: 11.31, ask: 11.33, history: genHistory(11.32, 20, 0.002) },
  { pair: "EUR/PLN", rate: 4.32, change: 0.01, bid: 4.31, ask: 4.33, history: genHistory(4.32, 20, 0.002) },
  { pair: "EUR/CZK", rate: 25.18, change: -0.04, bid: 25.16, ask: 25.20, history: genHistory(25.18, 20, 0.001) },
  { pair: "EUR/HUF", rate: 394.50, change: 1.20, bid: 394.00, ask: 395.00, history: genHistory(394.50, 20, 0.002) },
  { pair: "USD/RUB", rate: 92.45, change: 0.42, bid: 92.40, ask: 92.50, history: genHistory(92.45, 20, 0.003) },
  { pair: "USD/ILS", rate: 3.72, change: 0.02, bid: 3.71, ask: 3.73, history: genHistory(3.72, 20, 0.002) },
  // Crypto vs Fiat
  { pair: "BTC/USD", rate: 69750, change: 370.39, bid: 69745, ask: 69755, history: genHistory(69750, 20, 0.008) },
  { pair: "ETH/USD", rate: 2130.84, change: 20.48, bid: 2130.50, ask: 2131.18, history: genHistory(2130.84, 20, 0.01) },
];

const initialCommodities: Commodity[] = [
  // Precious Metals
  { name: "Gold", price: 2342.50, change: 7.80, changePercent: 0.33, unit: "/oz", history: genHistory(2342.50, 20, 0.003) },
  { name: "Silver", price: 28.45, change: 0.32, changePercent: 1.14, unit: "/oz", history: genHistory(28.45, 20, 0.005) },
  { name: "Platinum", price: 942.30, change: -4.20, changePercent: -0.44, unit: "/oz", history: genHistory(942.30, 20, 0.004) },
  { name: "Palladium", price: 1024.50, change: 12.40, changePercent: 1.22, unit: "/oz", history: genHistory(1024.50, 20, 0.006) },
  // Energy
  { name: "WTI Crude", price: 78.34, change: -1.24, changePercent: -1.56, unit: "/bbl", history: genHistory(78.34, 20, 0.006) },
  { name: "Brent Crude", price: 82.18, change: -0.96, changePercent: -1.16, unit: "/bbl", history: genHistory(82.18, 20, 0.006) },
  { name: "Natural Gas", price: 1.78, change: 0.05, changePercent: 2.89, unit: "/MMBtu", history: genHistory(1.78, 20, 0.01) },
  { name: "Heating Oil", price: 2.58, change: -0.04, changePercent: -1.53, unit: "/gal", history: genHistory(2.58, 20, 0.005) },
  { name: "RBOB Gas", price: 2.42, change: 0.03, changePercent: 1.25, unit: "/gal", history: genHistory(2.42, 20, 0.005) },
  { name: "Coal", price: 142.50, change: -2.80, changePercent: -1.93, unit: "/t", history: genHistory(142.50, 20, 0.005) },
  { name: "Uranium", price: 84.20, change: 1.40, changePercent: 1.69, unit: "/lb", history: genHistory(84.20, 20, 0.006) },
  // Industrial Metals
  { name: "Copper", price: 4.12, change: 0.08, changePercent: 1.98, unit: "/lb", history: genHistory(4.12, 20, 0.005) },
  { name: "Aluminum", price: 2285.00, change: 18.50, changePercent: 0.82, unit: "/t", history: genHistory(2285.00, 20, 0.004) },
  { name: "Nickel", price: 16420.00, change: -285.00, changePercent: -1.71, unit: "/t", history: genHistory(16420.00, 20, 0.006) },
  { name: "Zinc", price: 2485.00, change: 22.40, changePercent: 0.91, unit: "/t", history: genHistory(2485.00, 20, 0.004) },
  { name: "Tin", price: 28450.00, change: 380.00, changePercent: 1.35, unit: "/t", history: genHistory(28450.00, 20, 0.005) },
  { name: "Lead", price: 2142.00, change: -18.00, changePercent: -0.83, unit: "/t", history: genHistory(2142.00, 20, 0.004) },
  { name: "Iron Ore", price: 108.20, change: -1.80, changePercent: -1.64, unit: "/t", history: genHistory(108.20, 20, 0.007) },
  { name: "Lithium", price: 13250.00, change: 180.00, changePercent: 1.38, unit: "/t", history: genHistory(13250.00, 20, 0.008) },
  { name: "Cobalt", price: 28450.00, change: -420.00, changePercent: -1.45, unit: "/t", history: genHistory(28450.00, 20, 0.006) },
  // Agriculture
  { name: "Wheat", price: 584.25, change: -3.50, changePercent: -0.60, unit: "/bu", history: genHistory(584.25, 20, 0.005) },
  { name: "Corn", price: 442.75, change: 2.25, changePercent: 0.51, unit: "/bu", history: genHistory(442.75, 20, 0.004) },
  { name: "Soybeans", price: 1182.50, change: 8.40, changePercent: 0.72, unit: "/bu", history: genHistory(1182.50, 20, 0.004) },
  { name: "Coffee", price: 228.40, change: 4.20, changePercent: 1.87, unit: "/lb", history: genHistory(228.40, 20, 0.006) },
  { name: "Sugar", price: 22.45, change: -0.18, changePercent: -0.80, unit: "/lb", history: genHistory(22.45, 20, 0.005) },
  { name: "Cotton", price: 82.40, change: 0.85, changePercent: 1.04, unit: "/lb", history: genHistory(82.40, 20, 0.005) },
  { name: "Cocoa", price: 8420.00, change: 185.00, changePercent: 2.25, unit: "/t", history: genHistory(8420.00, 20, 0.008) },
  { name: "Rice", price: 15.42, change: 0.08, changePercent: 0.52, unit: "/cwt", history: genHistory(15.42, 20, 0.004) },
  { name: "OJ Frozen", price: 412.50, change: -8.40, changePercent: -2.00, unit: "/lb", history: genHistory(412.50, 20, 0.006) },
  { name: "Palm Oil", price: 3842.00, change: 28.00, changePercent: 0.73, unit: "/t", history: genHistory(3842.00, 20, 0.005) },
  // Livestock
  { name: "Live Cattle", price: 184.50, change: 1.20, changePercent: 0.65, unit: "/lb", history: genHistory(184.50, 20, 0.004) },
  { name: "Lean Hogs", price: 82.45, change: -0.85, changePercent: -1.02, unit: "/lb", history: genHistory(82.45, 20, 0.005) },
  // Lumber
  { name: "Lumber", price: 542.80, change: 8.40, changePercent: 1.57, unit: "/MBF", history: genHistory(542.80, 20, 0.006) },
  { name: "Rubber", price: 168.50, change: 2.40, changePercent: 1.44, unit: "/kg", history: genHistory(168.50, 20, 0.005) },
];

const initialBonds: BondData[] = [
  // US Treasury
  { name: "US 1M", yield: 5.32, change: 0.00, maturity: "2026", history: genHistory(5.32, 20, 0.003) },
  { name: "US 3M", yield: 5.28, change: -0.01, maturity: "2026", history: genHistory(5.28, 20, 0.003) },
  { name: "US 6M", yield: 5.18, change: -0.02, maturity: "2026", history: genHistory(5.18, 20, 0.004) },
  { name: "US 1Y", yield: 5.02, change: -0.02, maturity: "2027", history: genHistory(5.02, 20, 0.004) },
  { name: "US 2Y", yield: 4.72, change: -0.03, maturity: "2028", history: genHistory(4.72, 20, 0.005) },
  { name: "US 5Y", yield: 4.28, change: -0.05, maturity: "2031", history: genHistory(4.28, 20, 0.005) },
  { name: "US 10Y", yield: 4.21, change: -0.04, maturity: "2036", history: genHistory(4.21, 20, 0.005) },
  { name: "US 20Y", yield: 4.48, change: -0.03, maturity: "2046", history: genHistory(4.48, 20, 0.004) },
  { name: "US 30Y", yield: 4.38, change: -0.02, maturity: "2056", history: genHistory(4.38, 20, 0.004) },
  // Europe
  { name: "DE 2Y", yield: 2.85, change: 0.01, maturity: "2028", history: genHistory(2.85, 20, 0.005) },
  { name: "DE 5Y", yield: 2.42, change: 0.02, maturity: "2031", history: genHistory(2.42, 20, 0.005) },
  { name: "DE 10Y", yield: 2.34, change: 0.02, maturity: "2036", history: genHistory(2.34, 20, 0.006) },
  { name: "DE 30Y", yield: 2.58, change: 0.01, maturity: "2056", history: genHistory(2.58, 20, 0.005) },
  { name: "UK 2Y", yield: 4.28, change: -0.02, maturity: "2028", history: genHistory(4.28, 20, 0.005) },
  { name: "UK 10Y", yield: 4.08, change: -0.03, maturity: "2036", history: genHistory(4.08, 20, 0.005) },
  { name: "UK 30Y", yield: 4.52, change: -0.01, maturity: "2056", history: genHistory(4.52, 20, 0.004) },
  { name: "FR 10Y", yield: 2.92, change: 0.01, maturity: "2036", history: genHistory(2.92, 20, 0.005) },
  { name: "IT 10Y", yield: 3.68, change: -0.04, maturity: "2036", history: genHistory(3.68, 20, 0.005) },
  { name: "ES 10Y", yield: 3.22, change: -0.02, maturity: "2036", history: genHistory(3.22, 20, 0.005) },
  { name: "PT 10Y", yield: 3.08, change: -0.01, maturity: "2036", history: genHistory(3.08, 20, 0.005) },
  { name: "GR 10Y", yield: 3.42, change: 0.02, maturity: "2036", history: genHistory(3.42, 20, 0.006) },
  { name: "NL 10Y", yield: 2.68, change: 0.01, maturity: "2036", history: genHistory(2.68, 20, 0.005) },
  { name: "BE 10Y", yield: 2.85, change: 0.00, maturity: "2036", history: genHistory(2.85, 20, 0.005) },
  { name: "AT 10Y", yield: 2.78, change: 0.01, maturity: "2036", history: genHistory(2.78, 20, 0.005) },
  { name: "SE 10Y", yield: 2.42, change: -0.02, maturity: "2036", history: genHistory(2.42, 20, 0.005) },
  { name: "NO 10Y", yield: 3.58, change: 0.02, maturity: "2036", history: genHistory(3.58, 20, 0.005) },
  { name: "CH 10Y", yield: 0.72, change: 0.01, maturity: "2036", history: genHistory(0.72, 20, 0.008) },
  { name: "PL 10Y", yield: 5.48, change: -0.04, maturity: "2036", history: genHistory(5.48, 20, 0.005) },
  // Asia-Pacific
  { name: "JP 2Y", yield: 0.15, change: 0.01, maturity: "2028", history: genHistory(0.15, 20, 0.015) },
  { name: "JP 10Y", yield: 0.88, change: 0.01, maturity: "2036", history: genHistory(0.88, 20, 0.008) },
  { name: "JP 30Y", yield: 1.82, change: 0.02, maturity: "2056", history: genHistory(1.82, 20, 0.006) },
  { name: "CN 2Y", yield: 1.92, change: -0.01, maturity: "2028", history: genHistory(1.92, 20, 0.005) },
  { name: "CN 10Y", yield: 2.29, change: -0.01, maturity: "2036", history: genHistory(2.29, 20, 0.005) },
  { name: "IN 2Y", yield: 6.85, change: -0.01, maturity: "2028", history: genHistory(6.85, 20, 0.003) },
  { name: "IN 10Y", yield: 7.12, change: -0.02, maturity: "2036", history: genHistory(7.12, 20, 0.003) },
  { name: "IN 30Y", yield: 7.45, change: -0.01, maturity: "2056", history: genHistory(7.45, 20, 0.003) },
  { name: "KR 10Y", yield: 3.42, change: 0.02, maturity: "2036", history: genHistory(3.42, 20, 0.005) },
  { name: "AU 2Y", yield: 3.92, change: -0.02, maturity: "2028", history: genHistory(3.92, 20, 0.005) },
  { name: "AU 10Y", yield: 4.18, change: -0.03, maturity: "2036", history: genHistory(4.18, 20, 0.005) },
  { name: "SG 10Y", yield: 3.12, change: 0.01, maturity: "2036", history: genHistory(3.12, 20, 0.004) },
  { name: "TH 10Y", yield: 2.68, change: -0.02, maturity: "2036", history: genHistory(2.68, 20, 0.005) },
  { name: "MY 10Y", yield: 3.85, change: 0.01, maturity: "2036", history: genHistory(3.85, 20, 0.004) },
  { name: "ID 10Y", yield: 6.72, change: -0.04, maturity: "2036", history: genHistory(6.72, 20, 0.004) },
  { name: "PH 10Y", yield: 6.28, change: 0.02, maturity: "2036", history: genHistory(6.28, 20, 0.005) },
  // Americas (ex-US)
  { name: "CA 10Y", yield: 3.42, change: -0.02, maturity: "2036", history: genHistory(3.42, 20, 0.005) },
  { name: "BR 2Y", yield: 10.82, change: 0.05, maturity: "2028", history: genHistory(10.82, 20, 0.004) },
  { name: "BR 10Y", yield: 11.45, change: 0.08, maturity: "2036", history: genHistory(11.45, 20, 0.004) },
  { name: "MX 10Y", yield: 9.42, change: -0.04, maturity: "2036", history: genHistory(9.42, 20, 0.004) },
  // Middle East/Africa
  { name: "SA 10Y", yield: 4.85, change: 0.01, maturity: "2036", history: genHistory(4.85, 20, 0.004) },
  { name: "AE 10Y", yield: 4.52, change: 0.00, maturity: "2036", history: genHistory(4.52, 20, 0.003) },
  { name: "TR 10Y", yield: 24.85, change: 0.18, maturity: "2036", history: genHistory(24.85, 20, 0.005) },
  { name: "ZA 10Y", yield: 10.42, change: -0.08, maturity: "2036", history: genHistory(10.42, 20, 0.005) },
  { name: "NG 10Y", yield: 18.45, change: 0.12, maturity: "2036", history: genHistory(18.45, 20, 0.005) },
  { name: "EG 10Y", yield: 22.85, change: -0.15, maturity: "2036", history: genHistory(22.85, 20, 0.004) },
];

const initialCrypto: CryptoData[] = [
  { symbol: "BTC", name: "Bitcoin", price: 69750, change: 370.39, changePercent: 0.53, marketCap: "1.36T", history: genHistory(69750, 20, 0.008) },
  { symbol: "ETH", name: "Ethereum", price: 2130.84, change: 20.48, changePercent: 0.97, marketCap: "243B", history: genHistory(2130.84, 20, 0.01) },
  { symbol: "SOL", name: "Solana", price: 88.80, change: 1.48, changePercent: 1.69, marketCap: "42B", history: genHistory(88.80, 20, 0.012) },
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
  { symbol: "TON", name: "Toncoin", price: 5.85, change: 0.12, changePercent: 2.09, marketCap: "14.2B", history: genHistory(5.85, 20, 0.01) },
  { symbol: "SHIB", name: "Shiba Inu", price: 0.0000242, change: 0.0000008, changePercent: 3.42, marketCap: "14.3B", history: genHistory(0.0000242, 20, 0.015) },
  { symbol: "TRX", name: "TRON", price: 0.1285, change: 0.0028, changePercent: 2.22, marketCap: "11.4B", history: genHistory(0.1285, 20, 0.008) },
  { symbol: "APT", name: "Aptos", price: 8.42, change: 0.34, changePercent: 4.20, marketCap: "3.8B", history: genHistory(8.42, 20, 0.012) },
  { symbol: "SUI", name: "Sui", price: 1.28, change: 0.08, changePercent: 6.67, marketCap: "3.2B", history: genHistory(1.28, 20, 0.015) },
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
