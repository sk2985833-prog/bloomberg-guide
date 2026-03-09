import { useState } from "react";
import { MarketIndex } from "@/hooks/useMarketData";
import AssetChart from "./AssetChart";

interface IndexViewProps {
  indices: MarketIndex[];
}

const IndexView = ({ indices }: IndexViewProps) => {
  const [selectedIndex, setSelectedIndex] = useState<MarketIndex>(indices[0]);
  const [region, setRegion] = useState("ALL");

  const regions = ["ALL", ...Array.from(new Set(indices.map(i => i.region)))];
  const filtered = region === "ALL" ? indices : indices.filter(i => i.region === region);
  const updated = indices.find(i => i.name === selectedIndex.name) || indices[0];

  return (
    <div className="h-full flex flex-col">
      <div className="bb-panel-header flex items-center gap-2">
        <span className="text-terminal-amber">WORLD EQUITY INDICES</span>
        <span className="text-muted-foreground">─</span>
        <span className="text-muted-foreground">GLOBAL MARKETS</span>
      </div>

      {/* Region tabs */}
      <div className="flex items-center border-b border-border px-1 py-0.5 gap-0 flex-shrink-0">
        {regions.map(r => (
          <button key={r} onClick={() => setRegion(r)}
            className={`px-2 py-0.5 text-[9px] font-mono-terminal transition-colors ${region === r ? "text-terminal-cyan bg-terminal-cyan/10" : "text-muted-foreground hover:text-foreground"}`}>
            {r}
          </button>
        ))}
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden" style={{ gap: '1px', background: 'hsl(222, 16%, 10%)' }}>
        {/* Index list */}
        <div className="w-[300px] flex-shrink-0 bg-card overflow-auto">
          <table className="w-full font-mono-terminal">
            <thead className="sticky top-0 z-10" style={{ background: 'hsl(222, 20%, 7%)' }}>
              <tr className="text-[9px] text-muted-foreground uppercase border-b border-border">
                <th className="py-1 px-2 text-left">Index</th>
                <th className="py-1 px-2 text-right">Value</th>
                <th className="py-1 px-2 text-right">%Chg</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(idx => {
                const pos = idx.change >= 0;
                const sel = idx.name === updated.name;
                return (
                  <tr key={idx.name} onClick={() => setSelectedIndex(idx)}
                    className={`cursor-pointer bb-row-hover border-b border-border/20 ${sel ? "bg-terminal-amber/8" : ""}`}
                    style={sel ? { background: 'hsl(33, 100%, 50%, 0.06)' } : undefined}>
                    <td className="py-[3px] px-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-terminal-cyan font-semibold">{idx.name}</span>
                        <span className="text-[8px] text-muted-foreground">{idx.region}</span>
                      </div>
                    </td>
                    <td className="py-[3px] px-2 text-right text-[10px] tabular-nums text-foreground">
                      {idx.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className={`py-[3px] px-2 text-right text-[10px] tabular-nums font-semibold ${pos ? "text-terminal-green" : "text-terminal-red"}`}>
                      {pos ? "+" : ""}{idx.changePercent.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Chart */}
        <div className="flex-1 bg-card p-3 flex flex-col">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-terminal-cyan font-mono-terminal font-bold text-[12px]">{updated.name}</span>
            <span className="text-xl font-mono-terminal font-bold tabular-nums text-foreground">
              {updated.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
            <span className={`text-sm font-mono-terminal font-bold ${updated.change >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
              {updated.change >= 0 ? "▲" : "▼"} {Math.abs(updated.change).toFixed(2)} ({updated.change >= 0 ? "+" : ""}{updated.changePercent.toFixed(2)}%)
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <AssetChart history={updated.history} label={updated.name} currentValue={updated.value} positive={updated.change >= 0} width={500} height={200} />
          </div>
          <div className="flex gap-4 mt-2 font-mono-terminal text-[9px]">
            <span className="text-muted-foreground">Region <span className="text-foreground">{updated.region}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexView;
