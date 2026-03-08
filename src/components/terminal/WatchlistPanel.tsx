import { StockData } from "@/hooks/useMarketData";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  positive?: boolean;
}

const Sparkline = ({ data, width = 80, height = 24, positive }: SparklineProps) => {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  const color = positive ? "hsl(140, 70%, 45%)" : "hsl(0, 70%, 55%)";

  return (
    <svg width={width} height={height} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

interface StockRowProps {
  stock: StockData;
  isSelected: boolean;
  onClick: () => void;
}

const StockRow = ({ stock, isSelected, onClick }: StockRowProps) => {
  const positive = stock.change >= 0;

  return (
    <tr
      onClick={onClick}
      className={`cursor-pointer transition-colors border-b border-border/30 ${
        isSelected ? "bg-muted/60" : "hover:bg-muted/30"
      }`}
    >
      <td className="py-1.5 px-2">
        <span className="text-terminal-amber font-semibold text-xs">{stock.symbol}</span>
      </td>
      <td className="py-1.5 px-2 text-right tabular-nums text-xs">
        {stock.price.toFixed(2)}
      </td>
      <td className={`py-1.5 px-2 text-right tabular-nums text-xs font-medium ${positive ? "text-terminal-green" : "text-terminal-red"}`}>
        {positive ? "+" : ""}{stock.change.toFixed(2)}
      </td>
      <td className={`py-1.5 px-2 text-right tabular-nums text-xs ${positive ? "text-terminal-green" : "text-terminal-red"}`}>
        {positive ? "+" : ""}{stock.changePercent.toFixed(2)}%
      </td>
      <td className="py-1.5 px-2 text-right">
        <Sparkline data={stock.history} positive={positive} width={60} height={18} />
      </td>
      <td className="py-1.5 px-2 text-right text-xs text-muted-foreground tabular-nums">
        {stock.volume}
      </td>
    </tr>
  );
};

interface WatchlistPanelProps {
  stocks: StockData[];
  selectedStock: StockData;
  onSelectStock: (stock: StockData) => void;
}

const WatchlistPanel = ({ stocks, selectedStock, onSelectStock }: WatchlistPanelProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
        <span className="text-xs font-mono-terminal text-terminal-cyan font-semibold uppercase tracking-wider">Watchlist</span>
        <span className="text-[10px] font-mono-terminal text-muted-foreground">{stocks.length} securities</span>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full font-mono-terminal">
          <thead>
            <tr className="text-[10px] text-muted-foreground uppercase tracking-wider">
              <th className="py-1 px-2 text-left font-medium">Sym</th>
              <th className="py-1 px-2 text-right font-medium">Last</th>
              <th className="py-1 px-2 text-right font-medium">Chg</th>
              <th className="py-1 px-2 text-right font-medium">%</th>
              <th className="py-1 px-2 text-right font-medium">Chart</th>
              <th className="py-1 px-2 text-right font-medium">Vol</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(stock => (
              <StockRow
                key={stock.symbol}
                stock={stock}
                isSelected={stock.symbol === selectedStock.symbol}
                onClick={() => onSelectStock(stock)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WatchlistPanel;
