import { useState } from "react";
import { Commodity } from "@/hooks/useMarketData";
import AssetChart from "./AssetChart";

interface CmdtyViewProps {
  commodities: Commodity[];
}

const CmdtyView = ({ commodities }: CmdtyViewProps) => {
  const [selectedCmdty, setSelectedCmdty] = useState<Commodity>(commodities[0]);
  const updated = commodities.find(c => c.name === selectedCmdty.name) || commodities[0];

  return (
    <div className="h-full flex flex-col">
      <div className="bb-panel-header flex items-center gap-2">
        <span className="text-terminal-amber">COMMODITIES</span>
        <span className="text-muted-foreground">─</span>
        <span className="text-muted-foreground">FUTURES & SPOT</span>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden" style={{ gap: '1px', background: 'hsl(222, 16%, 10%)' }}>
        <div className="w-[300px] flex-shrink-0 bg-card overflow-auto">
          <table className="w-full font-mono-terminal">
            <thead className="sticky top-0 z-10" style={{ background: 'hsl(222, 20%, 7%)' }}>
              <tr className="text-[9px] text-muted-foreground uppercase border-b border-border">
                <th className="py-1 px-2 text-left">Commodity</th>
                <th className="py-1 px-2 text-right">Price</th>
                <th className="py-1 px-2 text-right">%Chg</th>
              </tr>
            </thead>
            <tbody>
              {commodities.map(c => {
                const pos = c.change >= 0;
                const sel = c.name === updated.name;
                return (
                  <tr key={c.name} onClick={() => setSelectedCmdty(c)}
                    className={`cursor-pointer bb-row-hover border-b border-border/20 ${sel ? "bg-terminal-amber/8" : ""}`}
                    style={sel ? { background: 'hsl(33, 100%, 50%, 0.06)' } : undefined}>
                    <td className="py-[3px] px-2 text-[10px] text-terminal-orange font-semibold">{c.name}</td>
                    <td className="py-[3px] px-2 text-right text-[10px] tabular-nums text-foreground">
                      {c.price.toFixed(2)}<span className="text-muted-foreground text-[8px]">{c.unit}</span>
                    </td>
                    <td className={`py-[3px] px-2 text-right text-[10px] tabular-nums font-semibold ${pos ? "text-terminal-green" : "text-terminal-red"}`}>
                      {pos ? "+" : ""}{c.changePercent.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex-1 bg-card p-3 flex flex-col">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-terminal-orange font-mono-terminal font-bold text-[12px]">{updated.name}</span>
            <span className="text-xl font-mono-terminal font-bold tabular-nums text-foreground">{updated.price.toFixed(2)}</span>
            <span className="text-muted-foreground text-sm">{updated.unit}</span>
            <span className={`text-sm font-mono-terminal font-bold ${updated.change >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
              {updated.change >= 0 ? "▲" : "▼"} {Math.abs(updated.change).toFixed(2)} ({updated.change >= 0 ? "+" : ""}{updated.changePercent.toFixed(2)}%)
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <AssetChart history={updated.history} label={updated.name} currentValue={updated.price} positive={updated.change >= 0} width={500} height={200} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmdtyView;
