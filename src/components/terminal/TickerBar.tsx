import { StockData } from "@/hooks/useMarketData";

interface TickerBarProps {
  stocks: StockData[];
}

const TickerBar = ({ stocks }: TickerBarProps) => {
  return (
    <div className="overflow-hidden border-b border-border bg-muted/30 py-1">
      <div className="flex animate-ticker whitespace-nowrap">
        {[...Array(2)].map((_, rep) => (
          <div key={rep} className="flex gap-5 px-3">
            {stocks.map(stock => {
              const pos = stock.change >= 0;
              return (
                <span key={`${rep}-${stock.symbol}`} className="font-mono-terminal text-[11px] flex items-center gap-1.5">
                  <span className="text-terminal-amber font-semibold">{stock.symbol}</span>
                  <span className="tabular-nums">{stock.price.toFixed(2)}</span>
                  <span className={`tabular-nums ${pos ? "text-terminal-green" : "text-terminal-red"}`}>
                    {pos ? "▲" : "▼"}{Math.abs(stock.changePercent).toFixed(2)}%
                  </span>
                </span>
              );
            })}
            <span className="text-muted-foreground px-2">│</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TickerBar;
