import { CryptoData } from "@/hooks/useMarketData";

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
      </div>
      <div className="flex-1 overflow-auto px-1.5 py-1">
        {crypto.map(c => {
          const pos = c.changePercent >= 0;
          return (
            <div key={c.symbol} className="flex justify-between items-center py-[2px] bb-row-hover px-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono-terminal text-terminal-yellow font-semibold">{c.symbol}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono-terminal tabular-nums text-foreground font-medium">
                  {c.price >= 1 ? c.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : c.price.toFixed(4)}
                </span>
                <span className={`text-[9px] font-mono-terminal tabular-nums font-semibold ${pos ? "text-terminal-green" : "text-terminal-red"}`}>
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
