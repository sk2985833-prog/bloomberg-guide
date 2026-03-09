import { StockData, MarketIndex, CryptoData, Commodity } from "@/hooks/useMarketData";
import AssetChart from "./AssetChart";

interface AnalyticsViewProps {
  stocks: StockData[];
  indices: MarketIndex[];
  crypto: CryptoData[];
  commodities: Commodity[];
}

const AnalyticsView = ({ stocks, indices, crypto, commodities }: AnalyticsViewProps) => {
  const topGainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 8);
  const topLosers = [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 8);

  const sectorPerf: Record<string, { total: number; count: number }> = {};
  stocks.forEach(s => {
    if (!sectorPerf[s.sector]) sectorPerf[s.sector] = { total: 0, count: 0 };
    sectorPerf[s.sector].total += s.changePercent;
    sectorPerf[s.sector].count++;
  });
  const sectors = Object.entries(sectorPerf).map(([name, data]) => ({
    name, avg: data.total / data.count,
  })).sort((a, b) => b.avg - a.avg);

  const exchangeStats: Record<string, { count: number; gainers: number; losers: number }> = {};
  stocks.forEach(s => {
    if (!exchangeStats[s.exchange]) exchangeStats[s.exchange] = { count: 0, gainers: 0, losers: 0 };
    exchangeStats[s.exchange].count++;
    if (s.changePercent >= 0) exchangeStats[s.exchange].gainers++;
    else exchangeStats[s.exchange].losers++;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="bb-panel-header flex items-center gap-2">
        <span className="text-terminal-amber">ANALYTICS</span>
        <span className="text-muted-foreground">─</span>
        <span className="text-muted-foreground">MARKET INTELLIGENCE</span>
      </div>

      <div className="flex-1 overflow-auto p-2">
        <div className="grid grid-cols-3 gap-1" style={{ minHeight: 0 }}>
          {/* Top Gainers */}
          <div className="bg-card border border-border p-2">
            <div className="text-[9px] font-mono-terminal text-terminal-green font-bold mb-1 uppercase tracking-widest">▲ Top Gainers</div>
            {topGainers.map(s => (
              <div key={s.symbol} className="flex justify-between items-center py-[2px]">
                <span className="text-[9px] font-mono-terminal text-terminal-amber">{s.symbol}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono-terminal tabular-nums text-foreground">
                    {s.price >= 1000 ? Math.round(s.price).toLocaleString() : s.price.toFixed(2)}
                  </span>
                  <span className="text-[9px] font-mono-terminal tabular-nums text-terminal-green font-bold w-[50px] text-right">
                    +{s.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Top Losers */}
          <div className="bg-card border border-border p-2">
            <div className="text-[9px] font-mono-terminal text-terminal-red font-bold mb-1 uppercase tracking-widest">▼ Top Losers</div>
            {topLosers.map(s => (
              <div key={s.symbol} className="flex justify-between items-center py-[2px]">
                <span className="text-[9px] font-mono-terminal text-terminal-amber">{s.symbol}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono-terminal tabular-nums text-foreground">
                    {s.price >= 1000 ? Math.round(s.price).toLocaleString() : s.price.toFixed(2)}
                  </span>
                  <span className="text-[9px] font-mono-terminal tabular-nums text-terminal-red font-bold w-[50px] text-right">
                    {s.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Sector Performance */}
          <div className="bg-card border border-border p-2">
            <div className="text-[9px] font-mono-terminal text-terminal-cyan font-bold mb-1 uppercase tracking-widest">Sector Performance</div>
            {sectors.map(s => (
              <div key={s.name} className="flex justify-between items-center py-[2px]">
                <span className="text-[9px] font-mono-terminal text-foreground">{s.name}</span>
                <div className="flex items-center gap-1">
                  <div className="w-[60px] h-[4px] rounded-full overflow-hidden" style={{ background: 'hsl(222, 16%, 14%)' }}>
                    <div
                      className={`h-full ${s.avg >= 0 ? "bg-terminal-green" : "bg-terminal-red"}`}
                      style={{ width: `${Math.min(Math.abs(s.avg) * 20, 100)}%` }}
                    />
                  </div>
                  <span className={`text-[9px] font-mono-terminal tabular-nums font-bold ${s.avg >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                    {s.avg >= 0 ? "+" : ""}{s.avg.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Market Breadth by Exchange */}
          <div className="bg-card border border-border p-2">
            <div className="text-[9px] font-mono-terminal text-terminal-amber font-bold mb-1 uppercase tracking-widest">Exchange Breadth</div>
            {Object.entries(exchangeStats).map(([ex, data]) => (
              <div key={ex} className="flex justify-between items-center py-[2px]">
                <span className="text-[9px] font-mono-terminal text-terminal-cyan">{ex}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono-terminal text-terminal-green">{data.gainers}▲</span>
                  <span className="text-[9px] font-mono-terminal text-terminal-red">{data.losers}▼</span>
                  <span className="text-[9px] font-mono-terminal text-muted-foreground">({data.count})</span>
                </div>
              </div>
            ))}
          </div>

          {/* Index Charts */}
          <div className="bg-card border border-border p-2">
            <div className="text-[9px] font-mono-terminal text-terminal-cyan font-bold mb-1 uppercase tracking-widest">Key Indices</div>
            {indices.slice(0, 6).map(idx => (
              <div key={idx.name} className="flex justify-between items-center py-[2px]">
                <span className="text-[9px] font-mono-terminal text-terminal-cyan">{idx.name}</span>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-mono-terminal tabular-nums text-foreground">
                    {idx.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                  <span className={`text-[9px] font-mono-terminal tabular-nums font-bold ${idx.change >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                    {idx.change >= 0 ? "+" : ""}{idx.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Crypto Overview */}
          <div className="bg-card border border-border p-2">
            <div className="text-[9px] font-mono-terminal text-terminal-yellow font-bold mb-1 uppercase tracking-widest">Crypto Summary</div>
            {crypto.slice(0, 6).map(c => (
              <div key={c.symbol} className="flex justify-between items-center py-[2px]">
                <span className="text-[9px] font-mono-terminal text-terminal-yellow">{c.symbol}</span>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-mono-terminal tabular-nums text-foreground">
                    ${c.price >= 1 ? c.price.toLocaleString(undefined, { maximumFractionDigits: 0 }) : c.price.toFixed(4)}
                  </span>
                  <span className={`text-[9px] font-mono-terminal tabular-nums font-bold ${c.changePercent >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                    {c.changePercent >= 0 ? "+" : ""}{c.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
