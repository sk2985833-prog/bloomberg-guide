import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import AssetChart from "./AssetChart";

interface EconomicEvent {
  country: string;
  countryCode: string;
  region: string;
  indicator: string;
  category: "GDP" | "CPI" | "UNEMPLOYMENT" | "INTEREST_RATE" | "PMI" | "TRADE" | "RETAIL" | "HOUSING" | "CONFIDENCE" | "OTHER";
  actual: number;
  forecast: number;
  previous: number;
  unit: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
  date: string;
  time: string;
  history: number[];
}

const regions = ["ALL", "AMERICAS", "EUROPE", "ASIA-PAC", "MIDDLE EAST", "AFRICA"];
const categories = ["ALL", "GDP", "CPI", "UNEMPLOYMENT", "INTEREST_RATE", "PMI", "TRADE", "RETAIL", "HOUSING", "CONFIDENCE"];
const impacts = ["ALL", "HIGH", "MEDIUM", "LOW"];

const generateHistory = (base: number, volatility: number): number[] => {
  const h: number[] = [];
  let v = base * (1 - volatility * 3);
  for (let i = 0; i < 24; i++) {
    v += (Math.random() - 0.45) * volatility * base;
    h.push(parseFloat(v.toFixed(2)));
  }
  return h;
};

const now = new Date();
const fmt = (d: number) => {
  const dt = new Date(now.getTime() + d * 86400000);
  return dt.toISOString().slice(0, 10);
};
const rTime = () => `${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${Math.random() > 0.5 ? "00" : "30"}`;

const economicEvents: EconomicEvent[] = [
  // AMERICAS
  { country: "United States", countryCode: "US", region: "AMERICAS", indicator: "GDP Growth Rate QoQ", category: "GDP", actual: 2.8, forecast: 2.5, previous: 2.1, unit: "%", impact: "HIGH", date: fmt(0), time: "08:30", history: generateHistory(2.5, 0.15) },
  { country: "United States", countryCode: "US", region: "AMERICAS", indicator: "CPI YoY", category: "CPI", actual: 3.2, forecast: 3.1, previous: 3.0, unit: "%", impact: "HIGH", date: fmt(0), time: "08:30", history: generateHistory(3.0, 0.1) },
  { country: "United States", countryCode: "US", region: "AMERICAS", indicator: "Unemployment Rate", category: "UNEMPLOYMENT", actual: 3.7, forecast: 3.8, previous: 3.8, unit: "%", impact: "HIGH", date: fmt(0), time: "08:30", history: generateHistory(3.8, 0.05) },
  { country: "United States", countryCode: "US", region: "AMERICAS", indicator: "Fed Interest Rate Decision", category: "INTEREST_RATE", actual: 5.50, forecast: 5.50, previous: 5.25, unit: "%", impact: "HIGH", date: fmt(1), time: "14:00", history: generateHistory(5.0, 0.05) },
  { country: "United States", countryCode: "US", region: "AMERICAS", indicator: "ISM Manufacturing PMI", category: "PMI", actual: 49.1, forecast: 48.5, previous: 47.8, unit: "", impact: "HIGH", date: fmt(1), time: "10:00", history: generateHistory(48.0, 0.04) },
  { country: "United States", countryCode: "US", region: "AMERICAS", indicator: "Retail Sales MoM", category: "RETAIL", actual: 0.6, forecast: 0.3, previous: 0.1, unit: "%", impact: "MEDIUM", date: fmt(2), time: "08:30", history: generateHistory(0.3, 0.5) },
  { country: "United States", countryCode: "US", region: "AMERICAS", indicator: "Trade Balance", category: "TRADE", actual: -64.2, forecast: -65.0, previous: -65.5, unit: "B USD", impact: "MEDIUM", date: fmt(3), time: "08:30", history: generateHistory(-65, 0.03) },
  { country: "United States", countryCode: "US", region: "AMERICAS", indicator: "Consumer Confidence", category: "CONFIDENCE", actual: 102.0, forecast: 100.5, previous: 99.1, unit: "", impact: "MEDIUM", date: fmt(2), time: "10:00", history: generateHistory(100, 0.04) },
  { country: "Canada", countryCode: "CA", region: "AMERICAS", indicator: "GDP Growth Rate QoQ", category: "GDP", actual: 1.1, forecast: 1.0, previous: 0.8, unit: "%", impact: "HIGH", date: fmt(1), time: "08:30", history: generateHistory(1.0, 0.2) },
  { country: "Canada", countryCode: "CA", region: "AMERICAS", indicator: "CPI YoY", category: "CPI", actual: 3.1, forecast: 3.0, previous: 2.8, unit: "%", impact: "HIGH", date: fmt(2), time: "08:30", history: generateHistory(3.0, 0.1) },
  { country: "Canada", countryCode: "CA", region: "AMERICAS", indicator: "BoC Interest Rate", category: "INTEREST_RATE", actual: 5.00, forecast: 5.00, previous: 4.75, unit: "%", impact: "HIGH", date: fmt(3), time: "10:00", history: generateHistory(4.5, 0.06) },
  { country: "Canada", countryCode: "CA", region: "AMERICAS", indicator: "Unemployment Rate", category: "UNEMPLOYMENT", actual: 5.8, forecast: 5.7, previous: 5.5, unit: "%", impact: "MEDIUM", date: fmt(1), time: "08:30", history: generateHistory(5.5, 0.05) },
  { country: "Brazil", countryCode: "BR", region: "AMERICAS", indicator: "GDP Growth Rate QoQ", category: "GDP", actual: 0.9, forecast: 0.7, previous: 0.5, unit: "%", impact: "HIGH", date: fmt(2), time: "09:00", history: generateHistory(0.7, 0.3) },
  { country: "Brazil", countryCode: "BR", region: "AMERICAS", indicator: "IPCA Inflation YoY", category: "CPI", actual: 4.62, forecast: 4.50, previous: 4.23, unit: "%", impact: "HIGH", date: fmt(1), time: "09:00", history: generateHistory(4.5, 0.08) },
  { country: "Brazil", countryCode: "BR", region: "AMERICAS", indicator: "Selic Rate Decision", category: "INTEREST_RATE", actual: 12.75, forecast: 12.75, previous: 13.25, unit: "%", impact: "HIGH", date: fmt(4), time: "18:30", history: generateHistory(13.0, 0.04) },
  { country: "Mexico", countryCode: "MX", region: "AMERICAS", indicator: "GDP Growth Rate YoY", category: "GDP", actual: 3.3, forecast: 3.1, previous: 3.6, unit: "%", impact: "HIGH", date: fmt(3), time: "09:00", history: generateHistory(3.2, 0.1) },
  { country: "Mexico", countryCode: "MX", region: "AMERICAS", indicator: "CPI YoY", category: "CPI", actual: 4.28, forecast: 4.30, previous: 4.65, unit: "%", impact: "MEDIUM", date: fmt(2), time: "09:00", history: generateHistory(4.4, 0.08) },
  { country: "Argentina", countryCode: "AR", region: "AMERICAS", indicator: "CPI YoY", category: "CPI", actual: 211.4, forecast: 200.0, previous: 142.7, unit: "%", impact: "HIGH", date: fmt(1), time: "16:00", history: generateHistory(180, 0.15) },
  { country: "Chile", countryCode: "CL", region: "AMERICAS", indicator: "Interest Rate Decision", category: "INTEREST_RATE", actual: 8.25, forecast: 8.25, previous: 9.50, unit: "%", impact: "MEDIUM", date: fmt(5), time: "18:00", history: generateHistory(9.0, 0.06) },
  { country: "Colombia", countryCode: "CO", region: "AMERICAS", indicator: "GDP Growth Rate YoY", category: "GDP", actual: 0.3, forecast: 0.5, previous: 0.6, unit: "%", impact: "MEDIUM", date: fmt(4), time: "11:00", history: generateHistory(0.5, 0.4) },
  // EUROPE
  { country: "Euro Area", countryCode: "EU", region: "EUROPE", indicator: "GDP Growth Rate QoQ", category: "GDP", actual: 0.1, forecast: 0.0, previous: -0.1, unit: "%", impact: "HIGH", date: fmt(0), time: "10:00", history: generateHistory(0.1, 0.8) },
  { country: "Euro Area", countryCode: "EU", region: "EUROPE", indicator: "HICP Inflation YoY", category: "CPI", actual: 2.9, forecast: 3.0, previous: 2.6, unit: "%", impact: "HIGH", date: fmt(0), time: "10:00", history: generateHistory(3.0, 0.1) },
  { country: "Euro Area", countryCode: "EU", region: "EUROPE", indicator: "ECB Interest Rate Decision", category: "INTEREST_RATE", actual: 4.50, forecast: 4.50, previous: 4.25, unit: "%", impact: "HIGH", date: fmt(2), time: "12:15", history: generateHistory(4.0, 0.06) },
  { country: "Euro Area", countryCode: "EU", region: "EUROPE", indicator: "Unemployment Rate", category: "UNEMPLOYMENT", actual: 6.4, forecast: 6.5, previous: 6.5, unit: "%", impact: "MEDIUM", date: fmt(1), time: "10:00", history: generateHistory(6.5, 0.03) },
  { country: "Euro Area", countryCode: "EU", region: "EUROPE", indicator: "Manufacturing PMI", category: "PMI", actual: 43.1, forecast: 43.5, previous: 42.7, unit: "", impact: "MEDIUM", date: fmt(3), time: "09:00", history: generateHistory(43, 0.04) },
  { country: "Germany", countryCode: "DE", region: "EUROPE", indicator: "GDP Growth Rate QoQ", category: "GDP", actual: -0.1, forecast: 0.0, previous: -0.3, unit: "%", impact: "HIGH", date: fmt(1), time: "08:00", history: generateHistory(0.0, 1.0) },
  { country: "Germany", countryCode: "DE", region: "EUROPE", indicator: "CPI YoY", category: "CPI", actual: 3.2, forecast: 3.3, previous: 3.0, unit: "%", impact: "HIGH", date: fmt(0), time: "08:00", history: generateHistory(3.1, 0.1) },
  { country: "Germany", countryCode: "DE", region: "EUROPE", indicator: "IFO Business Climate", category: "CONFIDENCE", actual: 86.9, forecast: 87.5, previous: 85.7, unit: "", impact: "HIGH", date: fmt(3), time: "09:00", history: generateHistory(87, 0.03) },
  { country: "United Kingdom", countryCode: "GB", region: "EUROPE", indicator: "GDP Growth Rate QoQ", category: "GDP", actual: 0.2, forecast: 0.1, previous: -0.1, unit: "%", impact: "HIGH", date: fmt(1), time: "07:00", history: generateHistory(0.1, 0.5) },
  { country: "United Kingdom", countryCode: "GB", region: "EUROPE", indicator: "CPI YoY", category: "CPI", actual: 4.0, forecast: 4.1, previous: 3.9, unit: "%", impact: "HIGH", date: fmt(0), time: "07:00", history: generateHistory(4.0, 0.08) },
  { country: "United Kingdom", countryCode: "GB", region: "EUROPE", indicator: "BoE Interest Rate", category: "INTEREST_RATE", actual: 5.25, forecast: 5.25, previous: 5.00, unit: "%", impact: "HIGH", date: fmt(2), time: "12:00", history: generateHistory(5.0, 0.05) },
  { country: "United Kingdom", countryCode: "GB", region: "EUROPE", indicator: "Unemployment Rate", category: "UNEMPLOYMENT", actual: 4.2, forecast: 4.3, previous: 4.3, unit: "%", impact: "MEDIUM", date: fmt(1), time: "07:00", history: generateHistory(4.2, 0.05) },
  { country: "France", countryCode: "FR", region: "EUROPE", indicator: "GDP Growth Rate QoQ", category: "GDP", actual: 0.1, forecast: 0.1, previous: 0.0, unit: "%", impact: "HIGH", date: fmt(2), time: "07:30", history: generateHistory(0.1, 0.6) },
  { country: "France", countryCode: "FR", region: "EUROPE", indicator: "CPI YoY", category: "CPI", actual: 3.5, forecast: 3.4, previous: 3.2, unit: "%", impact: "MEDIUM", date: fmt(1), time: "07:30", history: generateHistory(3.3, 0.1) },
  { country: "Italy", countryCode: "IT", region: "EUROPE", indicator: "GDP Growth Rate QoQ", category: "GDP", actual: 0.1, forecast: 0.0, previous: -0.4, unit: "%", impact: "MEDIUM", date: fmt(3), time: "09:00", history: generateHistory(0.0, 0.8) },
  { country: "Spain", countryCode: "ES", region: "EUROPE", indicator: "CPI YoY", category: "CPI", actual: 3.2, forecast: 3.3, previous: 3.1, unit: "%", impact: "MEDIUM", date: fmt(2), time: "08:00", history: generateHistory(3.2, 0.1) },
  { country: "Switzerland", countryCode: "CH", region: "EUROPE", indicator: "SNB Interest Rate", category: "INTEREST_RATE", actual: 1.75, forecast: 1.75, previous: 1.50, unit: "%", impact: "HIGH", date: fmt(4), time: "08:30", history: generateHistory(1.5, 0.1) },
  { country: "Sweden", countryCode: "SE", region: "EUROPE", indicator: "Riksbank Rate Decision", category: "INTEREST_RATE", actual: 4.00, forecast: 4.00, previous: 3.75, unit: "%", impact: "MEDIUM", date: fmt(5), time: "09:30", history: generateHistory(3.75, 0.06) },
  { country: "Norway", countryCode: "NO", region: "EUROPE", indicator: "GDP Growth Rate QoQ", category: "GDP", actual: 0.4, forecast: 0.3, previous: 0.1, unit: "%", impact: "MEDIUM", date: fmt(3), time: "08:00", history: generateHistory(0.3, 0.4) },
  { country: "Poland", countryCode: "PL", region: "EUROPE", indicator: "CPI YoY", category: "CPI", actual: 6.6, forecast: 6.5, previous: 6.2, unit: "%", impact: "MEDIUM", date: fmt(2), time: "10:00", history: generateHistory(6.4, 0.06) },
  { country: "Turkey", countryCode: "TR", region: "EUROPE", indicator: "TCMB Interest Rate", category: "INTEREST_RATE", actual: 40.00, forecast: 40.00, previous: 35.00, unit: "%", impact: "HIGH", date: fmt(1), time: "11:00", history: generateHistory(35, 0.08) },
  { country: "Russia", countryCode: "RU", region: "EUROPE", indicator: "CPI YoY", category: "CPI", actual: 7.5, forecast: 7.3, previous: 6.7, unit: "%", impact: "MEDIUM", date: fmt(4), time: "16:00", history: generateHistory(7.0, 0.08) },
  // ASIA-PAC
  { country: "China", countryCode: "CN", region: "ASIA-PAC", indicator: "GDP Growth Rate YoY", category: "GDP", actual: 4.9, forecast: 4.5, previous: 6.3, unit: "%", impact: "HIGH", date: fmt(0), time: "02:00", history: generateHistory(5.0, 0.1) },
  { country: "China", countryCode: "CN", region: "ASIA-PAC", indicator: "CPI YoY", category: "CPI", actual: -0.2, forecast: 0.0, previous: 0.1, unit: "%", impact: "HIGH", date: fmt(1), time: "01:30", history: generateHistory(0.0, 1.5) },
  { country: "China", countryCode: "CN", region: "ASIA-PAC", indicator: "PBoC LPR 1Y", category: "INTEREST_RATE", actual: 3.45, forecast: 3.45, previous: 3.55, unit: "%", impact: "HIGH", date: fmt(3), time: "01:15", history: generateHistory(3.5, 0.04) },
  { country: "China", countryCode: "CN", region: "ASIA-PAC", indicator: "Manufacturing PMI", category: "PMI", actual: 49.5, forecast: 49.8, previous: 49.0, unit: "", impact: "HIGH", date: fmt(2), time: "01:30", history: generateHistory(49.5, 0.03) },
  { country: "China", countryCode: "CN", region: "ASIA-PAC", indicator: "Trade Balance", category: "TRADE", actual: 68.4, forecast: 58.0, previous: 82.3, unit: "B USD", impact: "MEDIUM", date: fmt(4), time: "03:00", history: generateHistory(70, 0.15) },
  { country: "Japan", countryCode: "JP", region: "ASIA-PAC", indicator: "GDP Growth Rate QoQ", category: "GDP", actual: -0.5, forecast: -0.1, previous: 1.2, unit: "%", impact: "HIGH", date: fmt(0), time: "23:50", history: generateHistory(0.5, 0.5) },
  { country: "Japan", countryCode: "JP", region: "ASIA-PAC", indicator: "CPI YoY", category: "CPI", actual: 3.3, forecast: 3.0, previous: 3.2, unit: "%", impact: "HIGH", date: fmt(1), time: "23:30", history: generateHistory(3.1, 0.08) },
  { country: "Japan", countryCode: "JP", region: "ASIA-PAC", indicator: "BoJ Interest Rate", category: "INTEREST_RATE", actual: -0.10, forecast: -0.10, previous: -0.10, unit: "%", impact: "HIGH", date: fmt(3), time: "03:00", history: generateHistory(-0.1, 0.1) },
  { country: "Japan", countryCode: "JP", region: "ASIA-PAC", indicator: "Tankan Manufacturing", category: "CONFIDENCE", actual: 9, forecast: 7, previous: 5, unit: "", impact: "MEDIUM", date: fmt(5), time: "23:50", history: generateHistory(7, 0.2) },
  { country: "India", countryCode: "IN", region: "ASIA-PAC", indicator: "GDP Growth Rate YoY", category: "GDP", actual: 7.6, forecast: 6.5, previous: 7.8, unit: "%", impact: "HIGH", date: fmt(1), time: "12:00", history: generateHistory(7.0, 0.08) },
  { country: "India", countryCode: "IN", region: "ASIA-PAC", indicator: "CPI YoY", category: "CPI", actual: 5.02, forecast: 5.10, previous: 4.87, unit: "%", impact: "HIGH", date: fmt(0), time: "12:00", history: generateHistory(5.0, 0.06) },
  { country: "India", countryCode: "IN", region: "ASIA-PAC", indicator: "RBI Repo Rate", category: "INTEREST_RATE", actual: 6.50, forecast: 6.50, previous: 6.50, unit: "%", impact: "HIGH", date: fmt(2), time: "10:00", history: generateHistory(6.5, 0.03) },
  { country: "India", countryCode: "IN", region: "ASIA-PAC", indicator: "Manufacturing PMI", category: "PMI", actual: 56.0, forecast: 55.5, previous: 55.5, unit: "", impact: "MEDIUM", date: fmt(3), time: "05:30", history: generateHistory(55.5, 0.03) },
  { country: "South Korea", countryCode: "KR", region: "ASIA-PAC", indicator: "GDP Growth Rate QoQ", category: "GDP", actual: 0.6, forecast: 0.5, previous: 0.6, unit: "%", impact: "HIGH", date: fmt(2), time: "00:00", history: generateHistory(0.5, 0.3) },
  { country: "South Korea", countryCode: "KR", region: "ASIA-PAC", indicator: "BoK Interest Rate", category: "INTEREST_RATE", actual: 3.50, forecast: 3.50, previous: 3.50, unit: "%", impact: "HIGH", date: fmt(4), time: "01:00", history: generateHistory(3.5, 0.04) },
  { country: "Australia", countryCode: "AU", region: "ASIA-PAC", indicator: "GDP Growth Rate QoQ", category: "GDP", actual: 0.2, forecast: 0.4, previous: 0.4, unit: "%", impact: "HIGH", date: fmt(1), time: "00:30", history: generateHistory(0.3, 0.4) },
  { country: "Australia", countryCode: "AU", region: "ASIA-PAC", indicator: "CPI YoY", category: "CPI", actual: 5.4, forecast: 5.3, previous: 6.0, unit: "%", impact: "HIGH", date: fmt(0), time: "00:30", history: generateHistory(5.5, 0.07) },
  { country: "Australia", countryCode: "AU", region: "ASIA-PAC", indicator: "RBA Cash Rate", category: "INTEREST_RATE", actual: 4.35, forecast: 4.35, previous: 4.10, unit: "%", impact: "HIGH", date: fmt(3), time: "03:30", history: generateHistory(4.1, 0.05) },
  { country: "Australia", countryCode: "AU", region: "ASIA-PAC", indicator: "Unemployment Rate", category: "UNEMPLOYMENT", actual: 3.7, forecast: 3.7, previous: 3.6, unit: "%", impact: "MEDIUM", date: fmt(2), time: "00:30", history: generateHistory(3.6, 0.05) },
  { country: "New Zealand", countryCode: "NZ", region: "ASIA-PAC", indicator: "RBNZ Interest Rate", category: "INTEREST_RATE", actual: 5.50, forecast: 5.50, previous: 5.50, unit: "%", impact: "MEDIUM", date: fmt(5), time: "01:00", history: generateHistory(5.5, 0.03) },
  { country: "Indonesia", countryCode: "ID", region: "ASIA-PAC", indicator: "GDP Growth Rate YoY", category: "GDP", actual: 4.94, forecast: 5.00, previous: 5.17, unit: "%", impact: "MEDIUM", date: fmt(2), time: "04:00", history: generateHistory(5.0, 0.06) },
  { country: "Indonesia", countryCode: "ID", region: "ASIA-PAC", indicator: "BI Rate Decision", category: "INTEREST_RATE", actual: 6.00, forecast: 6.00, previous: 5.75, unit: "%", impact: "MEDIUM", date: fmt(4), time: "07:30", history: generateHistory(5.75, 0.05) },
  { country: "Thailand", countryCode: "TH", region: "ASIA-PAC", indicator: "GDP Growth Rate YoY", category: "GDP", actual: 1.5, forecast: 2.0, previous: 1.8, unit: "%", impact: "MEDIUM", date: fmt(3), time: "03:30", history: generateHistory(1.8, 0.15) },
  { country: "Singapore", countryCode: "SG", region: "ASIA-PAC", indicator: "GDP Growth Rate QoQ", category: "GDP", actual: 1.3, forecast: 0.7, previous: -0.7, unit: "%", impact: "MEDIUM", date: fmt(1), time: "00:00", history: generateHistory(0.5, 0.5) },
  { country: "Taiwan", countryCode: "TW", region: "ASIA-PAC", indicator: "GDP Growth Rate YoY", category: "GDP", actual: 2.32, forecast: 2.00, previous: 1.36, unit: "%", impact: "MEDIUM", date: fmt(4), time: "08:00", history: generateHistory(2.0, 0.15) },
  { country: "Philippines", countryCode: "PH", region: "ASIA-PAC", indicator: "BSP Interest Rate", category: "INTEREST_RATE", actual: 6.50, forecast: 6.50, previous: 6.25, unit: "%", impact: "MEDIUM", date: fmt(5), time: "08:00", history: generateHistory(6.25, 0.04) },
  { country: "Malaysia", countryCode: "MY", region: "ASIA-PAC", indicator: "GDP Growth Rate YoY", category: "GDP", actual: 3.3, forecast: 3.5, previous: 2.9, unit: "%", impact: "MEDIUM", date: fmt(3), time: "04:00", history: generateHistory(3.2, 0.1) },
  { country: "Vietnam", countryCode: "VN", region: "ASIA-PAC", indicator: "GDP Growth Rate YoY", category: "GDP", actual: 5.33, forecast: 5.50, previous: 3.72, unit: "%", impact: "LOW", date: fmt(4), time: "03:00", history: generateHistory(4.5, 0.12) },
  // MIDDLE EAST
  { country: "Saudi Arabia", countryCode: "SA", region: "MIDDLE EAST", indicator: "GDP Growth Rate YoY", category: "GDP", actual: -4.2, forecast: -3.5, previous: -0.1, unit: "%", impact: "HIGH", date: fmt(2), time: "09:00", history: generateHistory(-2.0, 0.4) },
  { country: "Saudi Arabia", countryCode: "SA", region: "MIDDLE EAST", indicator: "CPI YoY", category: "CPI", actual: 1.7, forecast: 1.6, previous: 1.5, unit: "%", impact: "MEDIUM", date: fmt(3), time: "09:00", history: generateHistory(1.6, 0.15) },
  { country: "UAE", countryCode: "AE", region: "MIDDLE EAST", indicator: "GDP Growth Rate YoY", category: "GDP", actual: 3.4, forecast: 3.5, previous: 3.8, unit: "%", impact: "MEDIUM", date: fmt(4), time: "08:00", history: generateHistory(3.5, 0.1) },
  { country: "Israel", countryCode: "IL", region: "MIDDLE EAST", indicator: "BoI Interest Rate", category: "INTEREST_RATE", actual: 4.75, forecast: 4.75, previous: 4.50, unit: "%", impact: "MEDIUM", date: fmt(3), time: "16:00", history: generateHistory(4.5, 0.06) },
  { country: "Qatar", countryCode: "QA", region: "MIDDLE EAST", indicator: "GDP Growth Rate YoY", category: "GDP", actual: 2.0, forecast: 2.5, previous: 1.1, unit: "%", impact: "LOW", date: fmt(5), time: "08:00", history: generateHistory(2.0, 0.2) },
  { country: "Egypt", countryCode: "EG", region: "MIDDLE EAST", indicator: "CPI YoY", category: "CPI", actual: 35.7, forecast: 36.0, previous: 38.0, unit: "%", impact: "HIGH", date: fmt(1), time: "10:00", history: generateHistory(36, 0.05) },
  { country: "Egypt", countryCode: "EG", region: "MIDDLE EAST", indicator: "CBE Interest Rate", category: "INTEREST_RATE", actual: 19.25, forecast: 19.25, previous: 18.25, unit: "%", impact: "HIGH", date: fmt(4), time: "15:00", history: generateHistory(18.5, 0.04) },
  // AFRICA
  { country: "South Africa", countryCode: "ZA", region: "AFRICA", indicator: "GDP Growth Rate QoQ", category: "GDP", actual: -0.2, forecast: 0.1, previous: 0.6, unit: "%", impact: "HIGH", date: fmt(1), time: "09:30", history: generateHistory(0.2, 0.6) },
  { country: "South Africa", countryCode: "ZA", region: "AFRICA", indicator: "CPI YoY", category: "CPI", actual: 5.4, forecast: 5.5, previous: 5.9, unit: "%", impact: "HIGH", date: fmt(0), time: "08:00", history: generateHistory(5.5, 0.07) },
  { country: "South Africa", countryCode: "ZA", region: "AFRICA", indicator: "SARB Interest Rate", category: "INTEREST_RATE", actual: 8.25, forecast: 8.25, previous: 8.25, unit: "%", impact: "HIGH", date: fmt(3), time: "13:00", history: generateHistory(8.25, 0.03) },
  { country: "Nigeria", countryCode: "NG", region: "AFRICA", indicator: "CPI YoY", category: "CPI", actual: 27.33, forecast: 26.50, previous: 25.80, unit: "%", impact: "MEDIUM", date: fmt(2), time: "09:00", history: generateHistory(26, 0.06) },
  { country: "Nigeria", countryCode: "NG", region: "AFRICA", indicator: "CBN Interest Rate", category: "INTEREST_RATE", actual: 18.75, forecast: 18.75, previous: 18.50, unit: "%", impact: "MEDIUM", date: fmt(5), time: "14:00", history: generateHistory(18.5, 0.03) },
  { country: "Kenya", countryCode: "KE", region: "AFRICA", indicator: "GDP Growth Rate YoY", category: "GDP", actual: 5.4, forecast: 5.0, previous: 4.8, unit: "%", impact: "LOW", date: fmt(4), time: "07:00", history: generateHistory(5.0, 0.1) },
  { country: "Morocco", countryCode: "MA", region: "AFRICA", indicator: "CPI YoY", category: "CPI", actual: 3.6, forecast: 3.5, previous: 3.1, unit: "%", impact: "LOW", date: fmt(3), time: "10:00", history: generateHistory(3.3, 0.1) },
  { country: "Ghana", countryCode: "GH", region: "AFRICA", indicator: "Interest Rate Decision", category: "INTEREST_RATE", actual: 30.00, forecast: 30.00, previous: 29.50, unit: "%", impact: "LOW", date: fmt(5), time: "12:00", history: generateHistory(29.5, 0.03) },
];

const categoryColors: Record<string, string> = {
  GDP: "text-terminal-green",
  CPI: "text-terminal-amber",
  UNEMPLOYMENT: "text-terminal-red",
  INTEREST_RATE: "text-terminal-cyan",
  PMI: "text-terminal-yellow",
  TRADE: "text-terminal-green",
  RETAIL: "text-terminal-amber",
  HOUSING: "text-terminal-cyan",
  CONFIDENCE: "text-terminal-yellow",
  OTHER: "text-muted-foreground",
};

const impactDots: Record<string, string> = {
  HIGH: "bg-terminal-red",
  MEDIUM: "bg-terminal-amber",
  LOW: "bg-terminal-green",
};

const EconomicCalendarView = () => {
  const [selectedRegion, setSelectedRegion] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedImpact, setSelectedImpact] = useState("ALL");
  const [selectedEvent, setSelectedEvent] = useState<EconomicEvent | null>(null);

  const filtered = useMemo(() => {
    return economicEvents.filter(e => {
      if (selectedRegion !== "ALL" && e.region !== selectedRegion) return false;
      if (selectedCategory !== "ALL" && e.category !== selectedCategory) return false;
      if (selectedImpact !== "ALL" && e.impact !== selectedImpact) return false;
      return true;
    }).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }, [selectedRegion, selectedCategory, selectedImpact]);

  const surprise = (e: EconomicEvent) => {
    if (e.forecast === 0) return e.actual;
    return ((e.actual - e.forecast) / Math.abs(e.forecast)) * 100;
  };

  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    regions.forEach(r => {
      counts[r] = r === "ALL" ? economicEvents.length : economicEvents.filter(e => e.region === r).length;
    });
    return counts;
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-3 py-1.5 flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono-terminal font-bold text-terminal-amber">ECONOMIC CALENDAR</span>
          <span className="text-[9px] font-mono-terminal text-muted-foreground">
            {filtered.length} EVENTS • {new Set(filtered.map(e => e.country)).size} COUNTRIES
          </span>
        </div>
        <span className="text-[9px] font-mono-terminal text-muted-foreground">
          200+ COUNTRIES • GDP / CPI / RATES / PMI / TRADE
        </span>
      </div>

      {/* Filters */}
      <div className="border-b border-border px-2 py-1 flex items-center gap-3 bg-muted/20 flex-shrink-0">
        <div className="flex items-center gap-1">
          <span className="text-[8px] font-mono-terminal text-muted-foreground mr-1">REGION:</span>
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={`px-1.5 py-0.5 text-[8px] font-mono-terminal rounded transition-colors ${
                selectedRegion === r
                  ? "bg-terminal-amber/20 text-terminal-amber border border-terminal-amber/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {r} ({regionCounts[r]})
            </button>
          ))}
        </div>
        <div className="w-px h-3 bg-border" />
        <div className="flex items-center gap-1">
          <span className="text-[8px] font-mono-terminal text-muted-foreground mr-1">IMPACT:</span>
          {impacts.map(i => (
            <button
              key={i}
              onClick={() => setSelectedImpact(i)}
              className={`px-1.5 py-0.5 text-[8px] font-mono-terminal rounded transition-colors flex items-center gap-1 ${
                selectedImpact === i
                  ? "bg-terminal-amber/20 text-terminal-amber border border-terminal-amber/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {i !== "ALL" && <span className={`w-1.5 h-1.5 rounded-full ${impactDots[i]}`} />}
              {i}
            </button>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div className="border-b border-border px-2 py-1 flex items-center gap-1 bg-muted/10 flex-shrink-0">
        <span className="text-[8px] font-mono-terminal text-muted-foreground mr-1">TYPE:</span>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-1.5 py-0.5 text-[8px] font-mono-terminal rounded transition-colors ${
              selectedCategory === c
                ? "bg-terminal-amber/20 text-terminal-amber border border-terminal-amber/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {c.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden" style={{ gap: "1px", background: "hsl(222, 16%, 10%)" }}>
        {/* Events table */}
        <div className="flex-1 bg-card flex flex-col overflow-hidden">
          <div className="grid grid-cols-[28px_90px_140px_1fr_65px_65px_65px_55px_50px] px-2 py-1 border-b border-border bg-muted/30 flex-shrink-0">
            {["", "DATE", "COUNTRY", "INDICATOR", "ACTUAL", "FCST", "PREV", "UNIT", "SURP"].map(h => (
              <span key={h} className="text-[8px] font-mono-terminal text-muted-foreground font-semibold">{h}</span>
            ))}
          </div>
          <ScrollArea className="flex-1">
            {filtered.map((ev, i) => {
              const s = surprise(ev);
              const isSelected = selectedEvent === ev;
              return (
                <div
                  key={i}
                  onClick={() => setSelectedEvent(ev)}
                  className={`grid grid-cols-[28px_90px_140px_1fr_65px_65px_65px_55px_50px] px-2 py-[3px] border-b border-border/30 cursor-pointer transition-colors ${
                    isSelected ? "bg-terminal-amber/10" : "hover:bg-muted/30"
                  }`}
                >
                  <span className="flex items-center">
                    <span className={`w-2 h-2 rounded-full ${impactDots[ev.impact]}`} />
                  </span>
                  <span className="text-[9px] font-mono-terminal text-muted-foreground">
                    {ev.date.slice(5)} {ev.time}
                  </span>
                  <span className="text-[9px] font-mono-terminal text-foreground truncate">
                    <span className="text-terminal-cyan">{ev.countryCode}</span>{" "}
                    {ev.country}
                  </span>
                  <span className={`text-[9px] font-mono-terminal truncate ${categoryColors[ev.category] || "text-foreground"}`}>
                    {ev.indicator}
                  </span>
                  <span className={`text-[9px] font-mono-terminal font-bold ${
                    ev.actual > ev.forecast ? "text-terminal-green" : ev.actual < ev.forecast ? "text-terminal-red" : "text-foreground"
                  }`}>
                    {ev.actual.toFixed(2)}
                  </span>
                  <span className="text-[9px] font-mono-terminal text-muted-foreground">{ev.forecast.toFixed(2)}</span>
                  <span className="text-[9px] font-mono-terminal text-muted-foreground">{ev.previous.toFixed(2)}</span>
                  <span className="text-[9px] font-mono-terminal text-muted-foreground">{ev.unit}</span>
                  <span className={`text-[9px] font-mono-terminal font-bold ${
                    s > 0 ? "text-terminal-green" : s < 0 ? "text-terminal-red" : "text-muted-foreground"
                  }`}>
                    {s > 0 ? "+" : ""}{s.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </ScrollArea>
        </div>

        {/* Detail panel */}
        <div className="w-[320px] flex-shrink-0 bg-card flex flex-col overflow-hidden">
          {selectedEvent ? (
            <>
              <div className="border-b border-border px-3 py-2 bg-muted/30">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${impactDots[selectedEvent.impact]}`} />
                  <span className="text-[10px] font-mono-terminal text-terminal-cyan font-bold">{selectedEvent.countryCode}</span>
                  <span className="text-[10px] font-mono-terminal text-foreground font-semibold">{selectedEvent.country}</span>
                </div>
                <p className={`text-[11px] font-mono-terminal mt-1 ${categoryColors[selectedEvent.category]}`}>
                  {selectedEvent.indicator}
                </p>
              </div>

              {/* Chart */}
              <div className="h-[140px] border-b border-border px-2 py-1">
                <div className="text-[8px] font-mono-terminal text-muted-foreground mb-1">HISTORICAL TREND (24 PERIODS)</div>
                <AssetChart data={selectedEvent.history} color="hsl(var(--terminal-amber))" height={110} />
              </div>

              {/* Data cards */}
              <div className="px-3 py-2 space-y-2 flex-1">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "ACTUAL", value: selectedEvent.actual, color: selectedEvent.actual > selectedEvent.forecast ? "text-terminal-green" : "text-terminal-red" },
                    { label: "FORECAST", value: selectedEvent.forecast, color: "text-terminal-amber" },
                    { label: "PREVIOUS", value: selectedEvent.previous, color: "text-muted-foreground" },
                  ].map(d => (
                    <div key={d.label} className="bg-muted/30 rounded p-2">
                      <div className="text-[7px] font-mono-terminal text-muted-foreground">{d.label}</div>
                      <div className={`text-[13px] font-mono-terminal font-bold ${d.color}`}>
                        {d.value.toFixed(2)}
                      </div>
                      {d.label === "ACTUAL" && <div className="text-[7px] font-mono-terminal text-muted-foreground">{selectedEvent.unit}</div>}
                    </div>
                  ))}
                </div>

                <div className="bg-muted/30 rounded p-2">
                  <div className="text-[7px] font-mono-terminal text-muted-foreground">SURPRISE</div>
                  {(() => {
                    const s = surprise(selectedEvent);
                    return (
                      <div className={`text-[15px] font-mono-terminal font-bold ${s > 0 ? "text-terminal-green" : s < 0 ? "text-terminal-red" : "text-foreground"}`}>
                        {s > 0 ? "+" : ""}{s.toFixed(2)}%
                      </div>
                    );
                  })()}
                  <div className="text-[7px] font-mono-terminal text-muted-foreground mt-0.5">
                    {selectedEvent.actual > selectedEvent.forecast ? "BEAT EXPECTATIONS" : selectedEvent.actual < selectedEvent.forecast ? "MISSED EXPECTATIONS" : "IN LINE"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted/30 rounded p-2">
                    <div className="text-[7px] font-mono-terminal text-muted-foreground">CATEGORY</div>
                    <div className={`text-[10px] font-mono-terminal font-bold ${categoryColors[selectedEvent.category]}`}>
                      {selectedEvent.category.replace("_", " ")}
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded p-2">
                    <div className="text-[7px] font-mono-terminal text-muted-foreground">IMPACT</div>
                    <div className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${impactDots[selectedEvent.impact]}`} />
                      <span className="text-[10px] font-mono-terminal font-bold text-foreground">{selectedEvent.impact}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 rounded p-2">
                  <div className="text-[7px] font-mono-terminal text-muted-foreground">RELEASE DATE</div>
                  <div className="text-[10px] font-mono-terminal text-foreground">{selectedEvent.date} at {selectedEvent.time} UTC</div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-[10px] font-mono-terminal text-muted-foreground">SELECT AN EVENT</div>
                <div className="text-[8px] font-mono-terminal text-muted-foreground/60 mt-1">Click any row to view details</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EconomicCalendarView;
