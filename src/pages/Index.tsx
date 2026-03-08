import { useState } from "react";
import { useMarketData } from "@/hooks/useMarketData";
import TerminalClock from "@/components/terminal/TerminalClock";
import TickerBar from "@/components/terminal/TickerBar";
import WatchlistPanel from "@/components/terminal/WatchlistPanel";
import StockDetail from "@/components/terminal/StockDetail";
import NewsPanel from "@/components/terminal/NewsPanel";
import MarketOverview from "@/components/terminal/MarketOverview";
import CommandBar from "@/components/terminal/CommandBar";
import BondsPanel from "@/components/terminal/BondsPanel";
import CryptoPanel from "@/components/terminal/CryptoPanel";
import FunctionBar from "@/components/terminal/FunctionBar";

const Index = () => {
  const { stocks, indices, forex, commodities, bonds, crypto, news, selectedStock, setSelectedStock, isLive } = useMarketData();
  const [activeTab, setActiveTab] = useState<string>("EQUITY");

  const handleSelectBySymbol = (symbol: string) => {
    const stock = stocks.find(s => s.symbol === symbol);
    if (stock) setSelectedStock(stock);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden select-none">
      {/* Top Menu Bar */}
      <header className="border-b border-border bg-card flex items-center justify-between flex-shrink-0 h-7">
        <div className="flex items-center h-full">
          <div className="bg-terminal-amber px-3 h-full flex items-center">
            <span className="text-[11px] font-mono-terminal font-bold tracking-tight" style={{ color: 'hsl(222, 22%, 5%)' }}>
              BB
            </span>
          </div>
          <div className="flex items-center gap-0 h-full">
            {["MARKETS", "SECURITIES", "MONITOR", "PORTFOLIO", "NEWS", "ANALYTICS"].map(item => (
              <button
                key={item}
                className="px-2.5 h-full text-[10px] font-mono-terminal text-muted-foreground hover:text-terminal-amber hover:bg-muted/50 transition-colors tracking-wider"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 px-2">
          {isLive && (
            <div className="flex items-center gap-1 mr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse" />
              <span className="text-[9px] font-mono-terminal text-terminal-green">LIVE</span>
            </div>
          )}
          <TerminalClock />
        </div>
      </header>

      {/* Function Keys Bar */}
      <FunctionBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Ticker */}
      <TickerBar stocks={stocks} indices={indices} />

      {/* Main Grid - Bloomberg 4-panel layout */}
      <div className="flex-1 flex overflow-hidden" style={{ gap: '1px', background: 'hsl(222, 16%, 10%)' }}>
        {/* Left Column - Watchlist */}
        <div className="w-[340px] flex-shrink-0 bg-card overflow-hidden flex flex-col">
          <WatchlistPanel stocks={stocks} selectedStock={selectedStock} onSelectStock={setSelectedStock} />
        </div>

        {/* Center Column */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ gap: '1px' }}>
          {/* Top - Stock Detail / Chart */}
          <div className="flex-1 bg-card overflow-hidden min-h-0">
            <StockDetail stock={selectedStock} />
          </div>
          {/* Bottom - News */}
          <div className="h-[240px] flex-shrink-0 bg-card overflow-hidden">
            <NewsPanel news={news} />
          </div>
        </div>

        {/* Right Column - Market Data */}
        <div className="w-[320px] flex-shrink-0 flex flex-col overflow-hidden" style={{ gap: '1px' }}>
          <div className="flex-1 bg-card overflow-hidden min-h-0">
            <MarketOverview indices={indices} forex={forex} commodities={commodities} />
          </div>
          <div className="h-[120px] flex-shrink-0 bg-card overflow-hidden">
            <BondsPanel bonds={bonds} />
          </div>
          <div className="flex-1 min-h-[180px] bg-card overflow-hidden">
            <CryptoPanel crypto={crypto} />
          </div>
        </div>
      </div>

      {/* Command Bar */}
      <CommandBar onSelectStock={handleSelectBySymbol} stocks={stocks} />
    </div>
  );
};

export default Index;
