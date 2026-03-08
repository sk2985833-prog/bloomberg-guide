import { BondData } from "@/hooks/useMarketData";

interface BondsPanelProps {
  bonds: BondData[];
}

const BondsPanel = ({ bonds }: BondsPanelProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="bb-panel-header flex items-center gap-2">
        <span className="text-terminal-amber">GOVT BONDS</span>
        <span className="text-muted-foreground">─</span>
        <span className="text-muted-foreground">YIELDS</span>
      </div>
      <div className="flex-1 overflow-auto px-1.5 py-1">
        {bonds.map(b => {
          const pos = b.change >= 0;
          return (
            <div key={b.name} className="flex justify-between items-center py-[2px] bb-row-hover px-1">
              <span className="text-[9px] font-mono-terminal text-terminal-magenta font-semibold">{b.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono-terminal tabular-nums text-foreground font-medium">{b.yield.toFixed(2)}%</span>
                <span className={`text-[9px] font-mono-terminal tabular-nums font-semibold ${pos ? "text-terminal-red" : "text-terminal-green"}`}>
                  {pos ? "+" : ""}{b.change.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BondsPanel;
