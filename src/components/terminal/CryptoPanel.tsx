import { CryptoData } from "@/hooks/useMarketData";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  positive?: boolean;
}

const Sparkline = ({ data, width = 40, height = 12, positive }: SparklineProps) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 2) - 1}`).join(" ");
  const color = positive ? "hsl(120, 60%, 50%)" : "hsl(0, 72%, 55%)";
  return (
    <svg width={width} height={height} className="inline-block">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
};

interface CryptoPanelProps {
  crypto: CryptoData[];
}

const CryptoPanel = ({ crypto }: CryptoPanelProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="bb-panel-header flex items-center gap-2">
        <span className="text-terminal-amber">CRYPTO</span>
        <span className="text-muted-foreground">─</span>
        <span className="text-muted-foreground">DIGITAL ASSETS</span>
        <div className="ml-auto flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse" />
          <span className="text-[8px] font-mono-terminal text-terminal-green">24H</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto px-1.5 py-1">
        {crypto.map(c => {
          const pos = c.changePercent >= 0;
          return (
            <div key={c.symbol} className="flex justify-between items-center py-[2px] bb-row-hover px-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono-terminal text-terminal-yellow font-semibold w-[40px]">{c.symbol}</span>
                <span className="text-[8px] font-mono-terminal text-muted-foreground truncate max-w-[50px]">{c.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkline data={c.history} width={36} height={10} positive={pos} />
                <span className="text-[9px] font-mono-terminal tabular-nums text-foreground font-medium w-[65px] text-right">
                  {c.price >= 1 ? c.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : c.price.toFixed(4)}
                </span>
                <span className={`text-[9px] font-mono-terminal tabular-nums font-semibold w-[48px] text-right ${pos ? "text-terminal-green" : "text-terminal-red"}`}>
                  {pos ? "+" : ""}{c.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CryptoPanel;
