import { useMemo, useState } from "react";

interface Deal {
  id: string;
  date: string;
  acquirer: string;
  acquirerTicker: string;
  target: string;
  targetTicker?: string;
  value: number; // USD billions
  type: "Cash" | "Stock" | "Cash & Stock";
  status: "Announced" | "Pending" | "Completed" | "Terminated";
  sector: string;
  region: string;
  premium: number; // %
}

const DEALS: Deal[] = [
  { id: "1", date: "2026-04-22", acquirer: "Microsoft Corp", acquirerTicker: "MSFT", target: "ServiceNow Cloud Div", value: 28.4, type: "Cash & Stock", status: "Announced", sector: "Technology", region: "Americas", premium: 32.1 },
  { id: "2", date: "2026-04-19", acquirer: "ExxonMobil", acquirerTicker: "XOM", target: "Pioneer Resources Permian", value: 19.7, type: "Stock", status: "Pending", sector: "Energy", region: "Americas", premium: 18.4 },
  { id: "3", date: "2026-04-17", acquirer: "Novartis AG", acquirerTicker: "NVS", target: "Replimune Group", targetTicker: "REPL", value: 6.2, type: "Cash", status: "Announced", sector: "Healthcare", region: "EMEA", premium: 45.8 },
  { id: "4", date: "2026-04-15", acquirer: "JPMorgan Chase", acquirerTicker: "JPM", target: "First Republic Wealth", value: 4.8, type: "Cash", status: "Completed", sector: "Financials", region: "Americas", premium: 12.3 },
  { id: "5", date: "2026-04-12", acquirer: "Tencent Holdings", acquirerTicker: "0700.HK", target: "Krafton Studios", value: 11.5, type: "Cash & Stock", status: "Pending", sector: "Technology", region: "APAC", premium: 28.7 },
  { id: "6", date: "2026-04-10", acquirer: "Shell plc", acquirerTicker: "SHEL", target: "Pavilion Energy", value: 3.2, type: "Cash", status: "Completed", sector: "Energy", region: "EMEA", premium: 22.1 },
  { id: "7", date: "2026-04-08", acquirer: "Pfizer Inc", acquirerTicker: "PFE", target: "Seagen Oncology", value: 43.0, type: "Cash", status: "Completed", sector: "Healthcare", region: "Americas", premium: 32.7 },
  { id: "8", date: "2026-04-05", acquirer: "BHP Group", acquirerTicker: "BHP", target: "Anglo American Copper", value: 39.4, type: "Stock", status: "Terminated", sector: "Materials", region: "EMEA", premium: 14.8 },
  { id: "9", date: "2026-04-03", acquirer: "Broadcom Inc", acquirerTicker: "AVGO", target: "VMware Edge", value: 7.8, type: "Cash & Stock", status: "Pending", sector: "Technology", region: "Americas", premium: 24.5 },
  { id: "10", date: "2026-04-01", acquirer: "Unilever PLC", acquirerTicker: "ULVR.L", target: "Yasso Holdings", value: 1.4, type: "Cash", status: "Completed", sector: "Consumer Staples", region: "EMEA", premium: 38.2 },
  { id: "11", date: "2026-03-28", acquirer: "Saudi Aramco", acquirerTicker: "2222.SR", target: "MidOcean Energy LNG", value: 8.6, type: "Cash", status: "Pending", sector: "Energy", region: "MEA", premium: 19.6 },
  { id: "12", date: "2026-03-25", acquirer: "Toyota Motor", acquirerTicker: "7203.T", target: "Hino Motors Stake", value: 2.9, type: "Stock", status: "Announced", sector: "Industrials", region: "APAC", premium: 16.4 },
  { id: "13", date: "2026-03-22", acquirer: "Berkshire Hathaway", acquirerTicker: "BRK.B", target: "Occidental Petroleum", value: 12.4, type: "Cash", status: "Pending", sector: "Energy", region: "Americas", premium: 21.8 },
  { id: "14", date: "2026-03-20", acquirer: "L'Oreal SA", acquirerTicker: "OR.PA", target: "Aesop Skincare", value: 2.5, type: "Cash", status: "Completed", sector: "Consumer Disc", region: "EMEA", premium: 41.2 },
  { id: "15", date: "2026-03-18", acquirer: "Reliance Industries", acquirerTicker: "RELIANCE.NS", target: "Future Retail Assets", value: 3.4, type: "Cash & Stock", status: "Completed", sector: "Consumer Staples", region: "APAC", premium: 28.4 },
  { id: "16", date: "2026-03-15", acquirer: "Cisco Systems", acquirerTicker: "CSCO", target: "Splunk Inc", targetTicker: "SPLK", value: 28.0, type: "Cash", status: "Completed", sector: "Technology", region: "Americas", premium: 31.0 },
  { id: "17", date: "2026-03-12", acquirer: "Glencore plc", acquirerTicker: "GLEN.L", target: "Teck Coal", value: 6.9, type: "Cash", status: "Pending", sector: "Materials", region: "EMEA", premium: 17.5 },
  { id: "18", date: "2026-03-10", acquirer: "Adobe Inc", acquirerTicker: "ADBE", target: "Figma Design", value: 20.0, type: "Cash & Stock", status: "Terminated", sector: "Technology", region: "Americas", premium: 88.0 },
  { id: "19", date: "2026-03-08", acquirer: "Alibaba Group", acquirerTicker: "BABA", target: "Lazada SE Asia", value: 5.5, type: "Stock", status: "Announced", sector: "Consumer Disc", region: "APAC", premium: 26.3 },
  { id: "20", date: "2026-03-05", acquirer: "Goldman Sachs", acquirerTicker: "GS", target: "GreenSky Inc", value: 1.7, type: "Cash", status: "Completed", sector: "Financials", region: "Americas", premium: 34.5 },
];

const STATUS_COLOR: Record<Deal["status"], string> = {
  Announced: "text-terminal-cyan",
  Pending: "text-terminal-yellow",
  Completed: "text-terminal-green",
  Terminated: "text-terminal-red",
};

const MAView = () => {
  const [region, setRegion] = useState<string>("ALL");
  const [status, setStatus] = useState<string>("ALL");
  const [sector, setSector] = useState<string>("ALL");
  const [selected, setSelected] = useState<Deal>(DEALS[0]);

  const filtered = useMemo(() => {
    return DEALS.filter(d =>
      (region === "ALL" || d.region === region) &&
      (status === "ALL" || d.status === status) &&
      (sector === "ALL" || d.sector === sector)
    );
  }, [region, status, sector]);

  const stats = useMemo(() => {
    const total = filtered.reduce((s, d) => s + d.value, 0);
    const avgPrem = filtered.length ? filtered.reduce((s, d) => s + d.premium, 0) / filtered.length : 0;
    const completed = filtered.filter(d => d.status === "Completed").length;
    const pending = filtered.filter(d => d.status === "Pending" || d.status === "Announced").length;
    return { total, avgPrem, completed, pending, count: filtered.length };
  }, [filtered]);

  const sectorBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(d => map.set(d.sector, (map.get(d.sector) || 0) + d.value));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  const maxSector = Math.max(...sectorBreakdown.map(s => s[1]), 1);

  return (
    <div className="h-full flex flex-col text-[10px] font-mono-terminal">
      {/* Header */}
      <div className="bg-terminal-amber/20 border-b border-terminal-amber px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-terminal-amber font-bold text-[11px]">M&A &lt;F8&gt;</span>
          <span className="text-muted-foreground">MERGERS &amp; ACQUISITIONS MONITOR</span>
        </div>
        <span className="text-terminal-green">● LIVE DEAL FLOW</span>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-5 gap-px bg-border border-b border-border">
        {[
          { label: "TOTAL DEALS", value: stats.count.toString(), color: "text-terminal-amber" },
          { label: "DEAL VALUE", value: `$${stats.total.toFixed(1)}B`, color: "text-terminal-green" },
          { label: "AVG PREMIUM", value: `${stats.avgPrem.toFixed(1)}%`, color: "text-terminal-cyan" },
          { label: "COMPLETED", value: stats.completed.toString(), color: "text-terminal-green" },
          { label: "PENDING", value: stats.pending.toString(), color: "text-terminal-yellow" },
        ].map(s => (
          <div key={s.label} className="bg-card px-3 py-2">
            <div className="text-muted-foreground text-[9px]">{s.label}</div>
            <div className={`${s.color} font-bold text-[14px]`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border bg-muted/20">
        <span className="text-muted-foreground">FILTERS:</span>
        {[
          { v: region, set: setRegion, opts: ["ALL", "Americas", "EMEA", "APAC", "MEA"], label: "REGION" },
          { v: status, set: setStatus, opts: ["ALL", "Announced", "Pending", "Completed", "Terminated"], label: "STATUS" },
          { v: sector, set: setSector, opts: ["ALL", "Technology", "Healthcare", "Energy", "Financials", "Materials", "Consumer Disc", "Consumer Staples", "Industrials"], label: "SECTOR" },
        ].map(f => (
          <div key={f.label} className="flex items-center gap-1">
            <span className="text-[9px] text-muted-foreground">{f.label}:</span>
            <select
              value={f.v}
              onChange={e => f.set(e.target.value)}
              className="bg-card border border-border text-terminal-amber px-1 py-0.5 text-[10px]"
            >
              {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Deal table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-muted/40 sticky top-0">
              <tr className="text-[9px] text-muted-foreground">
                <th className="px-2 py-1 text-left">DATE</th>
                <th className="px-2 py-1 text-left">ACQUIRER</th>
                <th className="px-2 py-1 text-left">TARGET</th>
                <th className="px-2 py-1 text-right">VALUE ($B)</th>
                <th className="px-2 py-1 text-right">PREM %</th>
                <th className="px-2 py-1 text-left">TYPE</th>
                <th className="px-2 py-1 text-left">SECTOR</th>
                <th className="px-2 py-1 text-left">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr
                  key={d.id}
                  onClick={() => setSelected(d)}
                  className={`cursor-pointer border-b border-border/40 hover:bg-muted/40 ${selected.id === d.id ? "bg-terminal-amber/10" : ""}`}
                >
                  <td className="px-2 py-1 text-muted-foreground">{d.date}</td>
                  <td className="px-2 py-1 text-terminal-amber">{d.acquirerTicker}</td>
                  <td className="px-2 py-1 text-foreground">{d.target}</td>
                  <td className="px-2 py-1 text-right text-terminal-green">{d.value.toFixed(1)}</td>
                  <td className="px-2 py-1 text-right text-terminal-cyan">{d.premium.toFixed(1)}</td>
                  <td className="px-2 py-1 text-muted-foreground">{d.type}</td>
                  <td className="px-2 py-1 text-muted-foreground">{d.sector}</td>
                  <td className={`px-2 py-1 ${STATUS_COLOR[d.status]}`}>● {d.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        <div className="w-[320px] border-l border-border bg-card overflow-auto flex-shrink-0">
          <div className="bg-terminal-amber/10 border-b border-border px-3 py-2">
            <div className="text-terminal-amber font-bold text-[11px]">DEAL DETAIL</div>
            <div className="text-muted-foreground text-[9px]">{selected.date}</div>
          </div>
          <div className="p-3 space-y-3">
            <div>
              <div className="text-[9px] text-muted-foreground">ACQUIRER</div>
              <div className="text-terminal-amber font-bold">{selected.acquirer}</div>
              <div className="text-[9px] text-muted-foreground">{selected.acquirerTicker}</div>
            </div>
            <div>
              <div className="text-[9px] text-muted-foreground">TARGET</div>
              <div className="text-foreground font-bold">{selected.target}</div>
              {selected.targetTicker && <div className="text-[9px] text-muted-foreground">{selected.targetTicker}</div>}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
              <div>
                <div className="text-[9px] text-muted-foreground">DEAL VALUE</div>
                <div className="text-terminal-green font-bold">${selected.value.toFixed(2)}B</div>
              </div>
              <div>
                <div className="text-[9px] text-muted-foreground">PREMIUM</div>
                <div className="text-terminal-cyan font-bold">{selected.premium.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-[9px] text-muted-foreground">STRUCTURE</div>
                <div className="text-foreground">{selected.type}</div>
              </div>
              <div>
                <div className="text-[9px] text-muted-foreground">STATUS</div>
                <div className={STATUS_COLOR[selected.status]}>● {selected.status}</div>
              </div>
              <div>
                <div className="text-[9px] text-muted-foreground">SECTOR</div>
                <div className="text-foreground">{selected.sector}</div>
              </div>
              <div>
                <div className="text-[9px] text-muted-foreground">REGION</div>
                <div className="text-foreground">{selected.region}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <div className="text-[9px] text-muted-foreground mb-1">SECTOR DEAL VOLUME ($B)</div>
              <div className="space-y-1">
                {sectorBreakdown.map(([sec, val]) => (
                  <div key={sec}>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-foreground">{sec}</span>
                      <span className="text-terminal-amber">${val.toFixed(1)}B</span>
                    </div>
                    <div className="h-1 bg-muted">
                      <div
                        className="h-full bg-terminal-amber"
                        style={{ width: `${(val / maxSector) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MAView;
