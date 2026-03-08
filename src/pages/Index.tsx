import { useMarketData } from "@/hooks/useMarketData";
import TerminalClock from "@/components/terminal/TerminalClock";
import TickerBar from "@/components/terminal/TickerBar";
import WatchlistPanel from "@/components/terminal/WatchlistPanel";
import StockDetail from "@/components/terminal/StockDetail";
import NewsPanel from "@/components/terminal/NewsPanel";
import MarketOverview from "@/components/terminal/MarketOverview";
import CommandBar from "@/components/terminal/CommandBar";

const Index = () => {
  const { stocks, indices, forex, commodities, news, selectedStock, setSelectedStock } = useMarketData();

  const handleSelectBySymbol = (symbol: string) => {
    const stock = stocks.find(s => s.symbol === symbol);
    if (stock) setSelectedStock(stock);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-1.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold font-mono-terminal text-terminal-green glow-green tracking-tighter">
            BLOOMBERG<span className="text-terminal-amber">®</span>
          </h1>
          <span className="text-[10px] font-mono-terminal text-muted-foreground border border-border px-1.5 py-0.5 rounded-sm">TERMINAL</span>
        </div>
        <TerminalClock />
      </header>

      {/* Ticker */}
      <TickerBar stocks={stocks} />

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 grid-rows-2 gap-px bg-border overflow-hidden">
        {/* Watchlist - left column */}
        <div className="col-span-4 row-span-2 bg-card overflow-hidden">
          <WatchlistPanel stocks={stocks} selectedStock={selectedStock} onSelectStock={setSelectedStock} />
        </div>

        {/* Stock Detail - top middle */}
        <div className="col-span-5 row-span-1 bg-card overflow-hidden">
          <StockDetail stock={selectedStock} />
        </div>

        {/* Market Overview - top right */}
        <div className="col-span-3 row-span-2 bg-card overflow-hidden">
          <MarketOverview indices={indices} forex={forex} commodities={commodities} />
        </div>

        {/* News Feed - bottom middle */}
        <div className="col-span-5 row-span-1 bg-card overflow-hidden">
          <NewsPanel news={news} />
        </div>
      </div>

      {/* Command Bar */}
      <CommandBar onSelectStock={handleSelectBySymbol} stocks={stocks} />
    </div>
  );
};

export default Index;
