import { useState, useEffect } from "react";
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
import GovtBondsView from "@/components/terminal/GovtBondsView";
import IndexView from "@/components/terminal/IndexView";
import CrncyView from "@/components/terminal/CrncyView";
import CmdtyView from "@/components/terminal/CmdtyView";
import CryptoView from "@/components/terminal/CryptoView";
import NewsView from "@/components/terminal/NewsView";
import AnalyticsView from "@/components/terminal/AnalyticsView";
import HelpView from "@/components/terminal/HelpView";

const Index = () => {
  const { stocks, indices, forex, commodities, bonds, crypto, news, selectedStock, setSelectedStock, isLive } = useMarketData();
  const [activeTab, setActiveTab] = useState<string>("EQUITY");

  const handleSelectBySymbol = (symbol: string) => {
    const stock = stocks.find(s => s.symbol === symbol);
    if (stock) {
      setSelectedStock(stock);
      setActiveTab("EQUITY");
    }
  };

  // F1-F12 keyboard shortcuts
  useEffect(() => {
    const fKeyMap: Record<string, string> = {
      F1: "HELP", F2: "GOVT", F3: "CORP", F4: "EQUITY",
      F5: "CMDTY", F6: "INDEX", F7: "CRNCY", F8: "M&A",
      F9: "TRADE", F10: "PORT", F11: "NEWS", F12: "MSG",
    };
    const handler = (e: KeyboardEvent) => {
      const tab = fKeyMap[e.key];
      if (tab) {
        e.preventDefault();
        setActiveTab(tab);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Determine if we should show a full-screen view
  const isFullScreenTab = !["EQUITY"].includes(activeTab);

  const renderFullView = () => {
    switch (activeTab) {
      case "HELP": return <HelpView />;
      case "GOVT": case "CORP": return <GovtBondsView bonds={bonds} />;
      case "INDEX": return <IndexView indices={indices} />;
      case "CRNCY": return <CrncyView forex={forex} />;
      case "CMDTY": return <CmdtyView commodities={commodities} />;
      case "M&A": return <CryptoView crypto={crypto} />; // placeholder
      case "TRADE": return <AnalyticsView stocks={stocks} indices={indices} crypto={crypto} commodities={commodities} />;
      case "PORT": return <AnalyticsView stocks={stocks} indices={indices} crypto={crypto} commodities={commodities} />;
      case "NEWS": return <NewsView news={news} />;
      case "MSG": return <HelpView />;
      default: return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden select-none">
      {/* Top Menu Bar */}
      <header className="border-b border-border bg-card flex items-center justify-between flex-shrink-0 h-7">
        <div className="flex items-center h-full">
          <div className="bg-terminal-amber px-2 h-full flex items-center">
            <span className="text-[9px] font-mono-terminal font-bold tracking-tight" style={{ color: 'hsl(222, 22%, 5%)' }}>
              BLOOMBERG
            </span>
          </div>
          <div className="flex items-center gap-0 h-full">
            {[
              { label: "MARKETS", tab: "EQUITY" },
              { label: "SECURITIES", tab: "EQUITY" },
              { label: "MONITOR", tab: "INDEX" },
              { label: "PORTFOLIO", tab: "PORT" },
              { label: "NEWS", tab: "NEWS" },
              { label: "ANALYTICS", tab: "TRADE" },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.tab)}
                className="px-2.5 h-full text-[10px] font-mono-terminal text-muted-foreground hover:text-terminal-amber hover:bg-muted/50 transition-colors tracking-wider"
              >
                {item.label}
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

      {/* Main Content */}
      {isFullScreenTab ? (
        <div className="flex-1 overflow-hidden bg-card">
          {renderFullView()}
        </div>
      ) : (
        /* Default EQUITY 4-panel layout */
        <div className="flex-1 flex overflow-hidden" style={{ gap: '1px', background: 'hsl(222, 16%, 10%)' }}>
          {/* Left Column - Watchlist */}
          <div className="w-[340px] flex-shrink-0 bg-card overflow-hidden flex flex-col">
            <WatchlistPanel stocks={stocks} selectedStock={selectedStock} onSelectStock={setSelectedStock} />
          </div>

          {/* Center Column */}
          <div className="flex-1 flex flex-col overflow-hidden" style={{ gap: '1px' }}>
            <div className="flex-1 bg-card overflow-hidden min-h-0">
              <StockDetail stock={selectedStock} />
            </div>
            <div className="h-[220px] flex-shrink-0 bg-card overflow-hidden">
              <NewsPanel news={news} />
            </div>
          </div>

          {/* Right Column - Market Data */}
          <div className="w-[320px] flex-shrink-0 flex flex-col overflow-hidden" style={{ gap: '1px' }}>
            <div className="flex-1 bg-card overflow-hidden min-h-0">
              <MarketOverview indices={indices} forex={forex} commodities={commodities} />
            </div>
            <div className="h-[110px] flex-shrink-0 bg-card overflow-hidden">
              <BondsPanel bonds={bonds} />
            </div>
            <div className="flex-1 min-h-[160px] bg-card overflow-hidden">
              <CryptoPanel crypto={crypto} />
            </div>
          </div>
        </div>
      )}

      {/* Command Bar */}
      <CommandBar onSelectStock={handleSelectBySymbol} stocks={stocks} />
    </div>
  );
};

export default Index;
