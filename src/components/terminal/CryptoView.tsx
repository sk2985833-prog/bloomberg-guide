import { useState } from "react";
import { CryptoData } from "@/hooks/useMarketData";
import AssetChart from "./AssetChart";

interface CryptoViewProps {
  crypto: CryptoData[];
}

const CryptoView = ({ crypto }: CryptoViewProps) => {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData>(crypto[0]);
  const updated = crypto.find(c => c.symbol === selectedCrypto.symbol) || crypto[0];

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

      <div className="flex flex-1 min-h-0 overflow-hidden" style={{ gap: '1px', background: 'hsl(222, 16%, 10%)' }}>
        <div className="w-[300px] flex-shrink-0 bg-card overflow-auto">
          <table className="w-full font-mono-terminal">
            <thead className="sticky top-0 z-10" style={{ background: 'hsl(222, 20%, 7%)' }}>
              <tr className="text-[9px] text-muted-foreground uppercase border-b border-border">
                <th className="py-1 px-2 text-left">Token</th>
                <th className="py-1 px-2 text-right">Price</th>
                <th className="py-1 px-2 text-right">%24H</th>
                <th className="py-1 px-2 text-right">MCap</th>
              </tr>
            </thead>
            <tbody>
              {crypto.map(c => {
                const pos = c.changePercent >= 0;
                const sel = c.symbol === updated.symbol;
                return (
                  <tr key={c.symbol} onClick={() => setSelectedCrypto(c)}
                    className={`cursor-pointer bb-row-hover border-b border-border/20 ${sel ? "bg-terminal-amber/8" : ""}`}
                    style={sel ? { background: 'hsl(33, 100%, 50%, 0.06)' } : undefined}>
                    <td className="py-[3px] px-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-terminal-yellow font-semibold">{c.symbol}</span>
                        <span className="text-[8px] text-muted-foreground">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-[3px] px-2 text-right text-[10px] tabular-nums text-foreground">
                      {c.price >= 1 ? c.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : c.price.toFixed(4)}
                    </td>
                    <td className={`py-[3px] px-2 text-right text-[10px] tabular-nums font-semibold ${pos ? "text-terminal-green" : "text-terminal-red"}`}>
                      {pos ? "+" : ""}{c.changePercent.toFixed(2)}%
                    </td>
                    <td className="py-[3px] px-2 text-right text-[9px] text-muted-foreground">{c.marketCap}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex-1 bg-card p-3 flex flex-col">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-terminal-yellow font-mono-terminal font-bold text-[12px]">{updated.symbol}</span>
            <span className="text-[10px] text-muted-foreground">{updated.name}</span>
            <span className="text-xl font-mono-terminal font-bold tabular-nums text-foreground">
              ${updated.price >= 1 ? updated.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : updated.price.toFixed(4)}
            </span>
            <span className={`text-sm font-mono-terminal font-bold ${updated.changePercent >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
              {updated.changePercent >= 0 ? "▲" : "▼"} {Math.abs(updated.changePercent).toFixed(2)}%
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <AssetChart history={updated.history} label={updated.symbol} currentValue={updated.price} positive={updated.changePercent >= 0} width={500} height={200} />
          </div>
          <div className="flex gap-4 mt-2 font-mono-terminal text-[9px]">
            <span className="text-muted-foreground">MCap <span className="text-terminal-cyan">{updated.marketCap}</span></span>
            <span className="text-muted-foreground">24H Chg <span className={updated.change >= 0 ? "text-terminal-green" : "text-terminal-red"}>
              {updated.change >= 0 ? "+" : ""}{updated.change >= 1 ? updated.change.toFixed(2) : updated.change.toFixed(4)}
            </span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoView;
