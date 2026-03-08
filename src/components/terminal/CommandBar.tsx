import { useState, useRef, useEffect } from "react";
import { StockData } from "@/hooks/useMarketData";

interface CommandBarProps {
  onSelectStock: (symbol: string) => void;
  stocks: StockData[];
}

const CommandBar = ({ onSelectStock, stocks }: CommandBarProps) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("Ready. Type ticker + ENTER │ Commands: TOP WEI ECO FA GP HELP │ Bloomberg Terminal ©2024");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toUpperCase();
    if (!cmd) return;

    setHistory(prev => [cmd, ...prev.slice(0, 49)]);
    setHistIdx(-1);

    const stock = stocks.find(s => s.symbol === cmd);
    if (stock) {
      onSelectStock(stock.symbol);
      setOutput(`${stock.symbol} ${stock.name} │ ${stock.exchange} │ Last: ${stock.price.toFixed(2)} │ Chg: ${stock.change >= 0 ? "+" : ""}${stock.change.toFixed(2)} (${stock.changePercent.toFixed(2)}%) │ Vol: ${stock.volume} │ MCap: ${stock.marketCap}`);
    } else if (cmd === "TOP") {
      setOutput("TOP │ Loading top market headlines... See News panel for real-time updates");
    } else if (cmd === "WEI") {
      setOutput("WEI │ WORLD EQUITY INDEXES │ S&P: 5,234 (+0.81%) │ NASDAQ: 16,429 (+1.22%) │ DAX: 18,492 (+0.85%) │ NIKKEI: 40,168 (-0.58%) │ SENSEX: 74,248 (+0.58%)");
    } else if (cmd === "ECO") {
      setOutput("ECO │ CALENDAR │ US CPI Mar-12 │ FOMC Mar-20 │ NFP Apr-05 │ EU GDP Apr-30 │ BOJ May-01 │ RBI Jun-07");
    } else if (cmd === "FA") {
      setOutput("FA │ Select a security first. Type ticker + ENTER for detailed fundamental analysis.");
    } else if (cmd === "GP") {
      setOutput("GP │ Chart displayed in detail panel. Toggle between Area/Line/Candle views.");
    } else if (cmd === "HELP") {
      setOutput("COMMANDS │ [TICKER] Load security │ TOP News │ WEI World indexes │ ECO Calendar │ FA Analysis │ GP Chart │ IB Messaging");
    } else if (cmd === "IB") {
      setOutput("IB │ Instant Bloomberg messaging system │ 184,322 users online │ Type IB <USER> to initiate chat");
    } else {
      setOutput(`"${cmd}" not found │ Type HELP for available commands`);
    }
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" && history.length > 0) {
      e.preventDefault();
      const newIdx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(newIdx);
      setInput(history[newIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIdx = histIdx - 1;
      if (newIdx < 0) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(newIdx);
        setInput(history[newIdx]);
      }
    }
  };

  return (
    <div className="border-t border-border bg-card flex-shrink-0">
      <div className="px-2 py-1">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="bg-terminal-amber px-1.5 py-0 flex items-center">
            <span className="text-[10px] font-mono-terminal font-bold" style={{ color: 'hsl(222, 22%, 5%)' }}>GO</span>
          </div>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="Enter command or ticker..."
            className="flex-1 bg-transparent font-mono-terminal text-[10px] text-terminal-amber outline-none placeholder:text-muted-foreground caret-terminal-amber"
            autoFocus
          />
          <div className="flex items-center gap-1">
            {["1)", "2)", "3)", "4)"].map(n => (
              <span key={n} className="text-[9px] font-mono-terminal text-muted-foreground">{n}</span>
            ))}
          </div>
        </form>
      </div>
      <div className="px-2 py-0.5 border-t border-border/50 bg-muted/20">
        <span className="text-[9px] font-mono-terminal text-terminal-dim truncate block">{output}</span>
      </div>
    </div>
  );
};

export default CommandBar;
