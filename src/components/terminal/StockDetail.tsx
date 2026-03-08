import { StockData } from "@/hooks/useMarketData";

interface StockDetailProps {
  stock: StockData;
}

const StockDetail = ({ stock }: StockDetailProps) => {
  const positive = stock.change >= 0;
  const min = Math.min(...stock.history);
  const max = Math.max(...stock.history);
  const range = max - min || 1;
  const w = 400;
  const h = 120;

  // Create area chart
  const points = stock.history.map((v, i) => {
    const x = (i / (stock.history.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 10) - 5;
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${w} ${h} L 0 ${h} Z`;
  const color = positive ? "hsl(140, 70%, 45%)" : "hsl(0, 70%, 55%)";

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono-terminal text-terminal-amber font-bold">{stock.symbol}</span>
          <span className="text-[10px] font-mono-terminal text-muted-foreground">{stock.name}</span>
          <span className="text-[10px] font-mono-terminal text-muted-foreground px-1.5 py-0.5 bg-muted rounded border border-border">EQUITY</span>
        </div>
        <span className="text-[10px] font-mono-terminal text-muted-foreground">INTRADAY</span>
      </div>

      <div className="px-3 py-3 border-b border-border">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-mono-terminal font-bold tabular-nums">{stock.price.toFixed(2)}</span>
          <span className={`text-sm font-mono-terminal font-semibold tabular-nums ${positive ? "text-terminal-green" : "text-terminal-red"}`}>
            {positive ? "▲" : "▼"} {Math.abs(stock.change).toFixed(2)} ({positive ? "+" : ""}{stock.changePercent.toFixed(2)}%)
          </span>
        </div>
        <div className="flex gap-4 mt-2 font-mono-terminal text-[10px] text-muted-foreground">
          <span>O: <span className="text-foreground">{stock.open.toFixed(2)}</span></span>
          <span>H: <span className="text-terminal-green">{stock.high.toFixed(2)}</span></span>
          <span>L: <span className="text-terminal-red">{stock.low.toFixed(2)}</span></span>
          <span>Vol: <span className="text-foreground">{stock.volume}</span></span>
          <span>MCap: <span className="text-terminal-cyan">{stock.marketCap}</span></span>
        </div>
      </div>

      <div className="flex-1 p-3 flex items-center justify-center">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full max-h-[140px]">
          <defs>
            <linearGradient id={`grad-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map(p => (
            <line key={p} x1="0" y1={h * p} x2={w} y2={h * p} stroke="hsl(220, 15%, 12%)" strokeWidth="0.5" />
          ))}
          <path d={areaPath} fill={`url(#grad-${stock.symbol})`} />
          <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
          {/* Current price dot */}
          <circle cx={points[points.length - 1]?.x} cy={points[points.length - 1]?.y} r="3" fill={color} />
        </svg>
      </div>
    </div>
  );
};

export default StockDetail;
