import { useMemo, useState } from "react";
import AssetChart from "./AssetChart";
import type { Stock } from "@/hooks/useMarketData";

interface Position {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  sector: string;
}

interface PortfolioViewProps {
  stocks: Stock[];
}

const INITIAL_POSITIONS: Position[] = [
  { id: "1", symbol: "AAPL", name: "Apple Inc", shares: 250, avgCost: 175.40, sector: "Technology" },
  { id: "2", symbol: "MSFT", name: "Microsoft Corp", shares: 120, avgCost: 380.20, sector: "Technology" },
  { id: "3", symbol: "NVDA", name: "NVIDIA Corp", shares: 80, avgCost: 620.50, sector: "Technology" },
  { id: "4", symbol: "GOOGL", name: "Alphabet Inc", shares: 150, avgCost: 142.30, sector: "Technology" },
  { id: "5", symbol: "AMZN", name: "Amazon.com Inc", shares: 100, avgCost: 165.80, sector: "Consumer Disc" },
  { id: "6", symbol: "TSLA", name: "Tesla Inc", shares: 75, avgCost: 245.60, sector: "Consumer Disc" },
  { id: "7", symbol: "JPM", name: "JPMorgan Chase", shares: 200, avgCost: 195.30, sector: "Financials" },
  { id: "8", symbol: "XOM", name: "ExxonMobil", shares: 180, avgCost: 112.80, sector: "Energy" },
  { id: "9", symbol: "JNJ", name: "Johnson & Johnson", shares: 140, avgCost: 158.40, sector: "Healthcare" },
  { id: "10", symbol: "META", name: "Meta Platforms", shares: 60, avgCost: 480.20, sector: "Technology" },
];

const PortfolioView = ({ stocks }: PortfolioViewProps) => {
  const [positions, setPositions] = useState<Position[]>(INITIAL_POSITIONS);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_POSITIONS[0].id);
  const [newSymbol, setNewSymbol] = useState("");
  const [newShares, setNewShares] = useState("");
  const [newCost, setNewCost] = useState("");

  const enriched = useMemo(() => {
    return positions.map(p => {
      const stock = stocks.find(s => s.symbol === p.symbol);
      const price = stock?.price ?? p.avgCost;
      const marketValue = price * p.shares;
      const costBasis = p.avgCost * p.shares;
      const pnl = marketValue - costBasis;
      const pnlPct = (pnl / costBasis) * 100;
      const dayChange = (stock?.change ?? 0) * p.shares;
      return { ...p, price, marketValue, costBasis, pnl, pnlPct, dayChange, history: stock?.history ?? [] };
    });
  }, [positions, stocks]);

  const totals = useMemo(() => {
    const mv = enriched.reduce((s, p) => s + p.marketValue, 0);
    const cb = enriched.reduce((s, p) => s + p.costBasis, 0);
    const pnl = mv - cb;
    const dayChg = enriched.reduce((s, p) => s + p.dayChange, 0);
    return { mv, cb, pnl, pnlPct: cb ? (pnl / cb) * 100 : 0, dayChg, dayChgPct: mv ? (dayChg / (mv - dayChg)) * 100 : 0 };
  }, [enriched]);

  const allocation = useMemo(() => {
    const map = new Map<string, number>();
    enriched.forEach(p => map.set(p.sector, (map.get(p.sector) || 0) + p.marketValue));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [enriched]);

  const selected = enriched.find(p => p.id === selectedId) ?? enriched[0];

  const handleAdd = () => {
    if (!newSymbol || !newShares || !newCost) return;
    const stock = stocks.find(s => s.symbol === newSymbol.toUpperCase());
    setPositions([...positions, {
      id: Date.now().toString(),
      symbol: newSymbol.toUpperCase(),
      name: stock?.name ?? newSymbol.toUpperCase(),
      shares: parseFloat(newShares),
      avgCost: parseFloat(newCost),
      sector: stock?.sector ?? "Other",
    }]);
    setNewSymbol(""); setNewShares(""); setNewCost("");
  };

  const handleRemove = (id: string) => {
    setPositions(positions.filter(p => p.id !== id));
  };

  return (
    <div className="h-full flex flex-col text-[10px] font-mono-terminal">
      {/* Header */}
      <div className="bg-terminal-amber/20 border-b border-terminal-amber px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-terminal-amber font-bold text-[11px]">PORT &lt;F10&gt;</span>
          <span className="text-muted-foreground">PORTFOLIO MANAGER &amp; ANALYTICS</span>
        </div>
        <span className="text-muted-foreground">{positions.length} POSITIONS</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-px bg-border border-b border-border">
        {[
          { label: "MARKET VALUE", value: `$${totals.mv.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: "text-terminal-amber" },
          { label: "COST BASIS", value: `$${totals.cb.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: "text-muted-foreground" },
          { label: "TOTAL P&L", value: `${totals.pnl >= 0 ? "+" : ""}$${totals.pnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: totals.pnl >= 0 ? "text-terminal-green" : "text-terminal-red" },
          { label: "RETURN %", value: `${totals.pnlPct >= 0 ? "+" : ""}${totals.pnlPct.toFixed(2)}%`, color: totals.pnlPct >= 0 ? "text-terminal-green" : "text-terminal-red" },
          { label: "DAY P&L", value: `${totals.dayChg >= 0 ? "+" : ""}$${totals.dayChg.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: totals.dayChg >= 0 ? "text-terminal-green" : "text-terminal-red" },
        ].map(s => (
          <div key={s.label} className="bg-card px-3 py-2">
            <div className="text-muted-foreground text-[9px]">{s.label}</div>
            <div className={`${s.color} font-bold text-[14px]`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Add position */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border bg-muted/20">
        <span className="text-muted-foreground">ADD POSITION:</span>
        <input value={newSymbol} onChange={e => setNewSymbol(e.target.value)} placeholder="SYMBOL" className="bg-card border border-border text-terminal-amber px-1 py-0.5 text-[10px] w-20 uppercase" />
        <input value={newShares} onChange={e => setNewShares(e.target.value)} placeholder="SHARES" type="number" className="bg-card border border-border text-foreground px-1 py-0.5 text-[10px] w-20" />
        <input value={newCost} onChange={e => setNewCost(e.target.value)} placeholder="AVG COST" type="number" className="bg-card border border-border text-foreground px-1 py-0.5 text-[10px] w-24" />
        <button onClick={handleAdd} className="bg-terminal-amber/30 border border-terminal-amber text-terminal-amber px-2 py-0.5 hover:bg-terminal-amber/50">+ ADD</button>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Positions */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-muted/40 sticky top-0">
              <tr className="text-[9px] text-muted-foreground">
                <th className="px-2 py-1 text-left">SYMBOL</th>
                <th className="px-2 py-1 text-left">NAME</th>
                <th className="px-2 py-1 text-right">SHARES</th>
                <th className="px-2 py-1 text-right">AVG COST</th>
                <th className="px-2 py-1 text-right">LAST</th>
                <th className="px-2 py-1 text-right">MKT VALUE</th>
                <th className="px-2 py-1 text-right">P&L</th>
                <th className="px-2 py-1 text-right">RET %</th>
                <th className="px-2 py-1 text-right">% PORT</th>
                <th className="px-2 py-1"></th>
              </tr>
            </thead>
            <tbody>
              {enriched.map(p => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`cursor-pointer border-b border-border/40 hover:bg-muted/40 ${selectedId === p.id ? "bg-terminal-amber/10" : ""}`}
                >
                  <td className="px-2 py-1 text-terminal-amber font-bold">{p.symbol}</td>
                  <td className="px-2 py-1 text-muted-foreground truncate max-w-[160px]">{p.name}</td>
                  <td className="px-2 py-1 text-right text-foreground">{p.shares}</td>
                  <td className="px-2 py-1 text-right text-muted-foreground">${p.avgCost.toFixed(2)}</td>
                  <td className="px-2 py-1 text-right text-foreground">${p.price.toFixed(2)}</td>
                  <td className="px-2 py-1 text-right text-foreground">${p.marketValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  <td className={`px-2 py-1 text-right ${p.pnl >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                    {p.pnl >= 0 ? "+" : ""}{p.pnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className={`px-2 py-1 text-right ${p.pnlPct >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                    {p.pnlPct >= 0 ? "+" : ""}{p.pnlPct.toFixed(2)}%
                  </td>
                  <td className="px-2 py-1 text-right text-terminal-cyan">{((p.marketValue / totals.mv) * 100).toFixed(1)}%</td>
                  <td className="px-2 py-1 text-right">
                    <button onClick={e => { e.stopPropagation(); handleRemove(p.id); }} className="text-terminal-red hover:text-terminal-red/70">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail */}
        <div className="w-[320px] border-l border-border bg-card overflow-auto flex-shrink-0">
          {selected && (
            <>
              <div className="bg-terminal-amber/10 border-b border-border px-3 py-2">
                <div className="text-terminal-amber font-bold text-[11px]">{selected.symbol}</div>
                <div className="text-muted-foreground text-[9px]">{selected.name}</div>
              </div>
              <div className="p-3 space-y-3">
                {selected.history.length > 0 && (
                  <AssetChart
                    history={selected.history}
                    label={selected.symbol}
                    currentValue={selected.price}
                    positive={selected.pnl >= 0}
                    width={290}
                    height={100}
                  />
                )}
                <div className="grid grid-cols-2 gap-2">
                  <div><div className="text-[9px] text-muted-foreground">SHARES</div><div className="text-foreground font-bold">{selected.shares}</div></div>
                  <div><div className="text-[9px] text-muted-foreground">AVG COST</div><div className="text-foreground font-bold">${selected.avgCost.toFixed(2)}</div></div>
                  <div><div className="text-[9px] text-muted-foreground">LAST PRICE</div><div className="text-terminal-amber font-bold">${selected.price.toFixed(2)}</div></div>
                  <div><div className="text-[9px] text-muted-foreground">MKT VALUE</div><div className="text-foreground font-bold">${selected.marketValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div></div>
                  <div><div className="text-[9px] text-muted-foreground">UNREALIZED P&L</div><div className={`font-bold ${selected.pnl >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>${selected.pnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div></div>
                  <div><div className="text-[9px] text-muted-foreground">RETURN</div><div className={`font-bold ${selected.pnlPct >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>{selected.pnlPct.toFixed(2)}%</div></div>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="text-[9px] text-muted-foreground mb-1">SECTOR ALLOCATION</div>
                  <div className="space-y-1">
                    {allocation.map(([sec, val]) => (
                      <div key={sec}>
                        <div className="flex justify-between text-[9px]">
                          <span className="text-foreground">{sec}</span>
                          <span className="text-terminal-amber">{((val / totals.mv) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-1 bg-muted">
                          <div className="h-full bg-terminal-amber" style={{ width: `${(val / totals.mv) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioView;
