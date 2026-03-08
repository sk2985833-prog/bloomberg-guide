import { useState } from "react";
import { MarketIndex, ForexPair, Commodity } from "@/hooks/useMarketData";

interface MarketOverviewProps {
  indices: MarketIndex[];
  forex: ForexPair[];
  commodities: Commodity[];
}

type Tab = "INDICES" | "FX" | "CMDTY";

const MarketOverview = ({ indices, forex, commodities }: MarketOverviewProps) => {
  const [tab, setTab] = useState<Tab>("INDICES");
  const [region, setRegion] = useState<string>("ALL");

  const regions = ["ALL", ...Array.from(new Set(indices.map(i => i.region)))];
  const filteredIndices = region === "ALL" ? indices : indices.filter(i => i.region === region);

  return (
    <div className="h-full flex flex-col">
      <div className="bb-panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-terminal-amber">MARKETS</span>
          <span className="text-muted-foreground">─</span>
          <span className="text-muted-foreground">GLOBAL</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-border px-1 py-0 flex-shrink-0">
        {(["INDICES", "FX", "CMDTY"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-2 py-0.5 text-[9px] font-mono-terminal font-semibold transition-colors ${
              tab === t ? "text-terminal-amber border-b border-terminal-amber" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {tab === "INDICES" && (
          <>
            {/* Region filter */}
            <div className="flex items-center px-1 py-0.5 border-b border-border/50 gap-0">
              {regions.map(r => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`px-1.5 py-0 text-[8px] font-mono-terminal transition-colors ${
                    region === r ? "text-terminal-cyan" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="px-1.5 py-1">
              {filteredIndices.map(idx => {
                const pos = idx.change >= 0;
                return (
                  <div key={idx.name} className="flex justify-between items-center py-[2px] bb-row-hover px-1">
                    <span className="text-[9px] font-mono-terminal text-terminal-cyan truncate mr-1 w-[80px]">{idx.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono-terminal tabular-nums text-foreground w-[70px] text-right">
                        {idx.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className={`text-[9px] font-mono-terminal tabular-nums font-semibold w-[50px] text-right ${pos ? "text-terminal-green" : "text-terminal-red"}`}>
                        {pos ? "+" : ""}{idx.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === "FX" && (
          <div className="px-1.5 py-1">
            <div className="grid grid-cols-1 gap-0">
              {forex.map(f => {
                const pos = f.change >= 0;
                return (
                  <div key={f.pair} className="flex justify-between items-center py-[2px] bb-row-hover px-1">
                    <span className="text-[9px] font-mono-terminal text-terminal-blue font-semibold">{f.pair}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono-terminal tabular-nums text-foreground">{f.rate.toFixed(4)}</span>
                      <span className="text-[8px] font-mono-terminal tabular-nums text-muted-foreground">{f.bid.toFixed(4)}</span>
                      <span className="text-[8px] font-mono-terminal tabular-nums text-muted-foreground">{f.ask.toFixed(4)}</span>
                      <span className={`text-[9px] font-mono-terminal font-semibold ${pos ? "text-terminal-green" : "text-terminal-red"}`}>
                        {pos ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "CMDTY" && (
          <div className="px-1.5 py-1">
            {commodities.map(c => {
              const pos = c.change >= 0;
              return (
                <div key={c.name} className="flex justify-between items-center py-[2px] bb-row-hover px-1">
                  <span className="text-[9px] font-mono-terminal text-terminal-amber">{c.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono-terminal tabular-nums text-foreground">
                      {c.price.toFixed(2)}<span className="text-muted-foreground text-[8px]">{c.unit}</span>
                    </span>
                    <span className={`text-[9px] font-mono-terminal tabular-nums font-semibold ${pos ? "text-terminal-green" : "text-terminal-red"}`}>
                      {pos ? "+" : ""}{c.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketOverview;
