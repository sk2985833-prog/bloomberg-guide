import { useState, useMemo } from "react";
import { StockData } from "@/hooks/useMarketData";

interface StockDetailProps {
  stock: StockData;
}

const StockDetail = ({ stock }: StockDetailProps) => {
  const [chartType, setChartType] = useState<"area" | "candle" | "line">("area");
  const positive = stock.change >= 0;

  const { min, max, range, w, h, points, linePath, areaPath, color, gridLines, priceLabels } = useMemo(() => {
    const history = stock.history;
    const mn = Math.min(...history);
    const mx = Math.max(...history);
    const rng = mx - mn || 1;
    const chartW = 520;
    const chartH = 160;

    const pts = history.map((v, i) => {
      const x = (i / (history.length - 1)) * chartW;
      const y = chartH - ((v - mn) / rng) * (chartH - 20) - 10;
      return { x, y, value: v };
    });

    const lp = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const ap = `${lp} L ${chartW} ${chartH} L 0 ${chartH} Z`;
    const c = positive ? "hsl(120, 60%, 50%)" : "hsl(0, 72%, 55%)";

    // Grid lines and labels
    const numGridLines = 5;
    const gLines = [];
    const pLabels = [];
    for (let i = 0; i <= numGridLines; i++) {
      const y = 10 + (i / numGridLines) * (chartH - 20);
      const price = mx - (i / numGridLines) * rng;
      gLines.push(y);
      pLabels.push({ y, label: price >= 1000 ? Math.round(price).toLocaleString() : price.toFixed(2) });
    }

    return { min: mn, max: mx, range: rng, w: chartW, h: chartH, points: pts, linePath: lp, areaPath: ap, color: c, gridLines: gLines, priceLabels: pLabels };
  }, [stock.history, positive]);

  // Generate candle data from history
  const candles = useMemo(() => {
    const result = [];
    for (let i = 1; i < stock.history.length; i++) {
      const open = stock.history[i - 1];
      const close = stock.history[i];
      const high = Math.max(open, close) * (1 + Math.random() * 0.003);
      const low = Math.min(open, close) * (1 - Math.random() * 0.003);
      result.push({ open, close, high, low, bullish: close >= open });
    }
    return result;
  }, [stock.history]);

  const formatPrice = (p: number) => p >= 1000 ? p.toLocaleString(undefined, { minimumFractionDigits: 0 }) : p.toFixed(2);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bb-panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-terminal-amber font-bold text-[11px]">{stock.symbol}</span>
          <span className="text-muted-foreground">{stock.name}</span>
          <span className="text-muted-foreground px-1 py-0 border border-border rounded-sm text-[8px]">{stock.exchange}</span>
          <span className="text-muted-foreground px-1 py-0 border border-border rounded-sm text-[8px]">{stock.sector}</span>
        </div>
        <div className="flex items-center gap-1">
          {(["area", "line", "candle"] as const).map(t => (
            <button
              key={t}
              onClick={() => setChartType(t)}
              className={`px-1.5 py-0 text-[8px] font-mono-terminal uppercase transition-colors ${
                chartType === t ? "text-terminal-amber bg-terminal-amber/15" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Price Header */}
      <div className="px-3 py-2 border-b border-border">
        <div className="flex items-baseline gap-3">
          <span className="text-xl font-mono-terminal font-bold tabular-nums text-foreground">{formatPrice(stock.price)}</span>
          <span className={`text-sm font-mono-terminal font-bold tabular-nums ${positive ? "text-terminal-green" : "text-terminal-red"}`}>
            {positive ? "▲" : "▼"} {formatPrice(Math.abs(stock.change))} ({positive ? "+" : ""}{stock.changePercent.toFixed(2)}%)
          </span>
        </div>
        <div className="flex gap-3 mt-1.5 font-mono-terminal text-[9px]">
          <span className="text-muted-foreground">Open <span className="text-foreground">{formatPrice(stock.open)}</span></span>
          <span className="text-muted-foreground">High <span className="text-terminal-green">{formatPrice(stock.high)}</span></span>
          <span className="text-muted-foreground">Low <span className="text-terminal-red">{formatPrice(stock.low)}</span></span>
          <span className="text-muted-foreground">Vol <span className="text-foreground">{stock.volume}</span></span>
          <span className="text-muted-foreground">MCap <span className="text-terminal-cyan">{stock.marketCap}</span></span>
          {stock.pe && <span className="text-muted-foreground">P/E <span className="text-terminal-amber">{stock.pe.toFixed(1)}</span></span>}
          {stock.eps && <span className="text-muted-foreground">EPS <span className="text-foreground">{stock.eps.toFixed(2)}</span></span>}
          {stock.beta && <span className="text-muted-foreground">Beta <span className="text-terminal-blue">{stock.beta.toFixed(2)}</span></span>}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 flex p-2 min-h-0">
        <div className="flex-1 relative">
          <svg viewBox={`-50 0 ${w + 60} ${h + 5}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Grid */}
            {gridLines.map((y, i) => (
              <g key={i}>
                <line x1="0" y1={y} x2={w} y2={y} stroke="hsl(222, 16%, 12%)" strokeWidth="0.5" />
                <text x="-6" y={y + 3} textAnchor="end" fill="hsl(222, 10%, 40%)" fontSize="7" fontFamily="IBM Plex Mono">
                  {priceLabels[i]?.label}
                </text>
              </g>
            ))}

            {/* Vertical grid */}
            {Array.from({ length: 7 }, (_, i) => {
              const x = (i / 6) * w;
              return <line key={`v${i}`} x1={x} y1={10} x2={x} y2={h} stroke="hsl(222, 16%, 10%)" strokeWidth="0.3" />;
            })}

            {chartType === "candle" ? (
              /* Candlestick chart */
              candles.map((c, i) => {
                const x = ((i + 0.5) / candles.length) * w;
                const barWidth = Math.max(w / candles.length * 0.6, 4);
                const yOpen = h - ((c.open - min) / range) * (h - 20) - 10;
                const yClose = h - ((c.close - min) / range) * (h - 20) - 10;
                const yHigh = h - ((c.high - min) / range) * (h - 20) - 10;
                const yLow = h - ((c.low - min) / range) * (h - 20) - 10;
                const fillColor = c.bullish ? "hsl(120, 60%, 50%)" : "hsl(0, 72%, 55%)";
                return (
                  <g key={i}>
                    <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={fillColor} strokeWidth="1" />
                    <rect
                      x={x - barWidth / 2}
                      y={Math.min(yOpen, yClose)}
                      width={barWidth}
                      height={Math.max(Math.abs(yOpen - yClose), 1)}
                      fill={c.bullish ? fillColor : fillColor}
                      stroke={fillColor}
                      strokeWidth="0.5"
                      opacity={c.bullish ? 0.9 : 0.7}
                    />
                  </g>
                );
              })
            ) : (
              <>
                {chartType === "area" && (
                  <>
                    <defs>
                      <linearGradient id={`grad-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                        <stop offset="50%" stopColor={color} stopOpacity="0.08" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.01" />
                      </linearGradient>
                    </defs>
                    <path d={areaPath} fill={`url(#grad-${stock.symbol})`} />
                  </>
                )}
                <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                {/* Current price dot */}
                <circle cx={points[points.length - 1]?.x} cy={points[points.length - 1]?.y} r="2.5" fill={color} />
                {/* Price line extending to right */}
                <line
                  x1={points[points.length - 1]?.x}
                  y1={points[points.length - 1]?.y}
                  x2={w + 5}
                  y2={points[points.length - 1]?.y}
                  stroke={color}
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
                <rect
                  x={w + 6}
                  y={(points[points.length - 1]?.y || 0) - 6}
                  width="42"
                  height="12"
                  fill={color}
                  rx="1"
                />
                <text
                  x={w + 27}
                  y={(points[points.length - 1]?.y || 0) + 3}
                  textAnchor="middle"
                  fill="hsl(222, 22%, 5%)"
                  fontSize="7"
                  fontWeight="bold"
                  fontFamily="IBM Plex Mono"
                >
                  {formatPrice(stock.price)}
                </text>
              </>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
