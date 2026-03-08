import { StockData, MarketIndex } from "@/hooks/useMarketData";

interface TickerBarProps {
  stocks: StockData[];
  indices: MarketIndex[];
}

const TickerBar = ({ stocks, indices }: TickerBarProps) => {
  const allItems = [
    ...indices.slice(0, 6).map(idx => ({
      symbol: idx.name,
      price: idx.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      change: idx.changePercent,
      isIndex: true,
    })),
    ...stocks.slice(0, 12).map(s => ({
      symbol: s.symbol,
      price: s.price.toFixed(2),
      change: s.changePercent,
      isIndex: false,
    })),
  ];

  return (
    <div className="overflow-hidden border-b border-border py-0.5 flex-shrink-0" style={{ background: 'hsl(222, 20%, 6%)' }}>
      <div className="flex animate-ticker whitespace-nowrap">
        {[0, 1].map(rep => (
          <div key={rep} className="flex gap-4 px-2">
            {allItems.map((item, i) => {
              const pos = item.change >= 0;
              return (
                <span key={`${rep}-${item.symbol}-${i}`} className="font-mono-terminal text-[10px] flex items-center gap-1">
                  <span className={item.isIndex ? "text-terminal-cyan font-semibold" : "text-terminal-amber font-semibold"}>
                    {item.symbol}
                  </span>
                  <span className="tabular-nums text-foreground">{item.price}</span>
                  <span className={`tabular-nums font-semibold ${pos ? "text-terminal-green" : "text-terminal-red"}`}>
                    {pos ? "+" : ""}{item.change.toFixed(2)}%
                  </span>
                </span>
              );
            })}
            <span className="text-muted-foreground px-1">║</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TickerBar;
