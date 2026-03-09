import { BondData } from "@/hooks/useMarketData";
import AssetChart from "./AssetChart";
import { useState } from "react";

interface GovtBondsViewProps {
  bonds: BondData[];
}

const GovtBondsView = ({ bonds }: GovtBondsViewProps) => {
  const [selectedBond, setSelectedBond] = useState<BondData>(bonds[0]);

  const updated = bonds.find(b => b.name === selectedBond.name) || bonds[0];

  return (
    <div className="h-full flex flex-col">
      <div className="bb-panel-header flex items-center gap-2">
        <span className="text-terminal-amber">GOVT BONDS</span>
        <span className="text-muted-foreground">─</span>
        <span className="text-muted-foreground">SOVEREIGN YIELDS</span>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden" style={{ gap: '1px', background: 'hsl(222, 16%, 10%)' }}>
        {/* Bond list */}
        <div className="w-[280px] flex-shrink-0 bg-card overflow-auto">
          <table className="w-full font-mono-terminal">
            <thead className="sticky top-0 z-10" style={{ background: 'hsl(222, 20%, 7%)' }}>
              <tr className="text-[9px] text-muted-foreground uppercase border-b border-border">
                <th className="py-1 px-2 text-left">Bond</th>
                <th className="py-1 px-2 text-right">Yield</th>
                <th className="py-1 px-2 text-right">Chg</th>
                <th className="py-1 px-2 text-right">Mat</th>
              </tr>
            </thead>
            <tbody>
              {bonds.map(b => {
                const pos = b.change >= 0;
                const sel = b.name === updated.name;
                return (
                  <tr key={b.name} onClick={() => setSelectedBond(b)}
                    className={`cursor-pointer bb-row-hover border-b border-border/20 ${sel ? "bg-terminal-amber/8" : ""}`}
                    style={sel ? { background: 'hsl(33, 100%, 50%, 0.06)' } : undefined}>
                    <td className="py-[3px] px-2 text-[10px] text-terminal-magenta font-semibold">{b.name}</td>
                    <td className="py-[3px] px-2 text-right text-[10px] tabular-nums text-foreground">{b.yield.toFixed(2)}%</td>
                    <td className={`py-[3px] px-2 text-right text-[10px] tabular-nums font-semibold ${pos ? "text-terminal-red" : "text-terminal-green"}`}>
                      {pos ? "+" : ""}{b.change.toFixed(2)}
                    </td>
                    <td className="py-[3px] px-2 text-right text-[9px] text-muted-foreground">{b.maturity}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Chart */}
        <div className="flex-1 bg-card p-3 flex flex-col">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-terminal-magenta font-mono-terminal font-bold text-[12px]">{updated.name}</span>
            <span className="text-xl font-mono-terminal font-bold tabular-nums text-foreground">{updated.yield.toFixed(2)}%</span>
            <span className={`text-sm font-mono-terminal font-bold ${updated.change >= 0 ? "text-terminal-red" : "text-terminal-green"}`}>
              {updated.change >= 0 ? "▲" : "▼"} {Math.abs(updated.change).toFixed(2)} bps
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <AssetChart
              history={updated.history}
              label={updated.name}
              currentValue={updated.yield}
              positive={updated.change < 0}
              width={500}
              height={200}
            />
          </div>
          <div className="flex gap-4 mt-2 font-mono-terminal text-[9px]">
            <span className="text-muted-foreground">Maturity <span className="text-foreground">{updated.maturity}</span></span>
            <span className="text-muted-foreground">Duration <span className="text-terminal-cyan">{(parseFloat(updated.maturity) - 2024).toFixed(1)}Y</span></span>
            <span className="text-muted-foreground">Credit <span className="text-terminal-green">AAA</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovtBondsView;
