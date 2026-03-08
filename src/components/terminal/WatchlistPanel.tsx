import { useState } from "react";
import { StockData } from "@/hooks/useMarketData";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  positive?: boolean;
}

const Sparkline = ({ data, width = 60, height = 16, positive }: SparklineProps) => {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 2) - 1;
    return `${x},${y}`;
  }).join(" ");

  const color = positive ? "hsl(120, 60%, 50%)" : "hsl(0, 72%, 55%)";

  return (
    <svg width={width} height={height} className="inline-block">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

interface WatchlistPanelProps {
  stocks: StockData[];
  selectedStock: StockData;
  onSelectStock: (stock: StockData) => void;
}

const WatchlistPanel = ({ stocks, selectedStock, onSelectStock }: WatchlistPanelProps) => {
  const [filter, setFilter] = useState<string>("ALL");
  const exchanges = ["ALL", ...Array.from(new Set(stocks.map(s => s.exchange)))];

  const filtered = filter === "ALL" ? stocks : stocks.filter(s => s.exchange === filter);

  return (
    <div className="h-full flex flex-col">
      <div className="bb-panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-terminal-amber">WATCHLIST</span>
          <span className="text-muted-foreground">─</span>
          <span className="text-muted-foreground">{filtered.length} Securities</span>
        </div>
      </div>

      {/* Exchange filter tabs */}
      <div className="flex items-center border-b border-border px-1 py-0.5 gap-0 overflow-x-auto flex-shrink-0">
        {exchanges.map(ex => (
          <button
            key={ex}
            onClick={() => setFilter(ex)}
            className={`px-1.5 py-0.5 text-[9px] font-mono-terminal transition-colors ${
              filter === ex ? "text-terminal-amber bg-terminal-amber/10" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {ex}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full font-mono-terminal">
          <thead className="sticky top-0 z-10" style={{ background: 'hsl(222, 20%, 7%)' }}>
            <tr className="text-[9px] text-muted-foreground uppercase tracking-wider border-b border-border">
              <th className="py-1 px-1.5 text-left font-medium">Symbol</th>
              <th className="py-1 px-1 text-right font-medium">Last</th>
              <th className="py-1 px-1 text-right font-medium">Chg</th>
              <th className="py-1 px-1 text-right font-medium">%Chg</th>
              <th className="py-1 px-1 text-right font-medium">Trend</th>
              <th className="py-1 px-1 text-right font-medium">Vol</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(stock => {
              const pos = stock.change >= 0;
              const isSelected = stock.symbol === selectedStock.symbol;
              return (
                <tr
                  key={stock.symbol}
                  onClick={() => onSelectStock(stock)}
                  className={`cursor-pointer bb-row-hover border-b border-border/20 ${
                    isSelected ? "bg-terminal-amber/8" : ""
                  }`}
                  style={isSelected ? { background: 'hsl(33, 100%, 50%, 0.06)' } : undefined}
                >
                  <td className="py-[3px] px-1.5">
                    <div className="flex flex-col">
                      <span className="text-terminal-amber font-semibold text-[10px]">{stock.symbol}</span>
                      <span className="text-[8px] text-muted-foreground truncate max-w-[80px]">{stock.exchange}</span>
                    </div>
                  </td>
                  <td className="py-[3px] px-1 text-right tabular-nums text-[10px] text-foreground font-medium">
                    {stock.price >= 1000 ? stock.price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : stock.price.toFixed(2)}
                  </td>
                  <td className={`py-[3px] px-1 text-right tabular-nums text-[10px] font-semibold ${pos ? "text-terminal-green" : "text-terminal-red"}`}>
                    {pos ? "+" : ""}{stock.change >= 1000 ? Math.round(stock.change) : stock.change.toFixed(2)}
                  </td>
                  <td className={`py-[3px] px-1 text-right tabular-nums text-[10px] font-semibold ${pos ? "text-terminal-green" : "text-terminal-red"}`}>
                    {pos ? "+" : ""}{stock.changePercent.toFixed(2)}%
                  </td>
                  <td className="py-[3px] px-1 text-right">
                    <Sparkline data={stock.history} positive={pos} width={48} height={14} />
                  </td>
                  <td className="py-[3px] px-1 text-right text-[9px] text-muted-foreground tabular-nums">
                    {stock.volume}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WatchlistPanel;
