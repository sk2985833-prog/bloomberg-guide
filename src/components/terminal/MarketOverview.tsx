import { MarketIndex, ForexPair, Commodity } from "@/hooks/useMarketData";

interface MarketOverviewProps {
  indices: MarketIndex[];
  forex: ForexPair[];
  commodities: Commodity[];
}

const MarketOverview = ({ indices, forex, commodities }: MarketOverviewProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 border-b border-border bg-muted/30">
        <span className="text-xs font-mono-terminal text-terminal-cyan font-semibold uppercase tracking-wider">Market Overview</span>
      </div>
      <div className="flex-1 overflow-auto">
        {/* Indices */}
        <div className="px-3 py-2">
          <p className="text-[10px] font-mono-terminal text-muted-foreground uppercase tracking-wider mb-1.5">Indices</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {indices.map(idx => {
              const pos = idx.change >= 0;
              return (
                <div key={idx.name} className="flex justify-between items-center py-0.5">
                  <span className="text-[10px] font-mono-terminal text-terminal-amber truncate mr-2">{idx.name}</span>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-[10px] font-mono-terminal tabular-nums">{idx.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className={`text-[10px] font-mono-terminal tabular-nums ${pos ? "text-terminal-green" : "text-terminal-red"}`}>
                      {pos ? "+" : ""}{idx.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-border/50" />

        {/* Forex */}
        <div className="px-3 py-2">
          <p className="text-[10px] font-mono-terminal text-muted-foreground uppercase tracking-wider mb-1.5">Forex</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {forex.map(f => {
              const pos = f.change >= 0;
              return (
                <div key={f.pair} className="flex justify-between items-center py-0.5">
                  <span className="text-[10px] font-mono-terminal text-terminal-blue">{f.pair}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono-terminal tabular-nums">{f.rate.toFixed(4)}</span>
                    <span className={`text-[10px] font-mono-terminal ${pos ? "text-terminal-green" : "text-terminal-red"}`}>
                      {pos ? "▲" : "▼"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-border/50" />

        {/* Commodities */}
        <div className="px-3 py-2">
          <p className="text-[10px] font-mono-terminal text-muted-foreground uppercase tracking-wider mb-1.5">Commodities</p>
          <div className="space-y-1">
            {commodities.map(c => {
              const pos = c.change >= 0;
              return (
                <div key={c.name} className="flex justify-between items-center py-0.5">
                  <span className="text-[10px] font-mono-terminal text-terminal-amber">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono-terminal tabular-nums">{c.price.toFixed(2)}<span className="text-muted-foreground">{c.unit}</span></span>
                    <span className={`text-[10px] font-mono-terminal tabular-nums ${pos ? "text-terminal-green" : "text-terminal-red"}`}>
                      {pos ? "+" : ""}{c.change.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;
