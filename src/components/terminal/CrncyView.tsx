import { useState } from "react";
import { ForexPair } from "@/hooks/useMarketData";
import AssetChart from "./AssetChart";

interface CrncyViewProps {
  forex: ForexPair[];
}

const CrncyView = ({ forex }: CrncyViewProps) => {
  const [selectedPair, setSelectedPair] = useState<ForexPair>(forex[0]);
  const updated = forex.find(f => f.pair === selectedPair.pair) || forex[0];

  return (
    <div className="h-full flex flex-col">
      <div className="bb-panel-header flex items-center gap-2">
        <span className="text-terminal-amber">FOREIGN EXCHANGE</span>
        <span className="text-muted-foreground">─</span>
        <span className="text-muted-foreground">CURRENCY PAIRS</span>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden" style={{ gap: '1px', background: 'hsl(222, 16%, 10%)' }}>
        <div className="w-[320px] flex-shrink-0 bg-card overflow-auto">
          <table className="w-full font-mono-terminal">
            <thead className="sticky top-0 z-10" style={{ background: 'hsl(222, 20%, 7%)' }}>
              <tr className="text-[9px] text-muted-foreground uppercase border-b border-border">
                <th className="py-1 px-2 text-left">Pair</th>
                <th className="py-1 px-2 text-right">Rate</th>
                <th className="py-1 px-2 text-right">Bid</th>
                <th className="py-1 px-2 text-right">Ask</th>
                <th className="py-1 px-2 text-right">Chg</th>
              </tr>
            </thead>
            <tbody>
              {forex.map(f => {
                const pos = f.change >= 0;
                const sel = f.pair === updated.pair;
                return (
                  <tr key={f.pair} onClick={() => setSelectedPair(f)}
                    className={`cursor-pointer bb-row-hover border-b border-border/20 ${sel ? "bg-terminal-amber/8" : ""}`}
                    style={sel ? { background: 'hsl(33, 100%, 50%, 0.06)' } : undefined}>
                    <td className="py-[3px] px-2 text-[10px] text-terminal-blue font-semibold">{f.pair}</td>
                    <td className="py-[3px] px-2 text-right text-[10px] tabular-nums text-foreground">{f.rate.toFixed(4)}</td>
                    <td className="py-[3px] px-2 text-right text-[9px] tabular-nums text-muted-foreground">{f.bid.toFixed(4)}</td>
                    <td className="py-[3px] px-2 text-right text-[9px] tabular-nums text-muted-foreground">{f.ask.toFixed(4)}</td>
                    <td className={`py-[3px] px-2 text-right text-[10px] tabular-nums font-semibold ${pos ? "text-terminal-green" : "text-terminal-red"}`}>
                      {pos ? "▲" : "▼"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex-1 bg-card p-3 flex flex-col">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-terminal-blue font-mono-terminal font-bold text-[12px]">{updated.pair}</span>
            <span className="text-xl font-mono-terminal font-bold tabular-nums text-foreground">{updated.rate.toFixed(4)}</span>
            <span className={`text-sm font-mono-terminal font-bold ${updated.change >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
              {updated.change >= 0 ? "+" : ""}{updated.change.toFixed(4)}
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <AssetChart history={updated.history} label={updated.pair} currentValue={updated.rate} positive={updated.change >= 0} width={500} height={200} />
          </div>
          <div className="flex gap-4 mt-2 font-mono-terminal text-[9px]">
            <span className="text-muted-foreground">Bid <span className="text-foreground">{updated.bid.toFixed(4)}</span></span>
            <span className="text-muted-foreground">Ask <span className="text-foreground">{updated.ask.toFixed(4)}</span></span>
            <span className="text-muted-foreground">Spread <span className="text-terminal-amber">{((updated.ask - updated.bid) * 10000).toFixed(1)} pips</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrncyView;
