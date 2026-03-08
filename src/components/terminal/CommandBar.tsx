import { useState } from "react";
import { StockData } from "@/hooks/useMarketData";

interface CommandBarProps {
  onSelectStock: (symbol: string) => void;
  stocks: StockData[];
}

const CommandBar = ({ onSelectStock, stocks }: CommandBarProps) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("Ready. Type a ticker symbol + ENTER or use commands: TOP, WEI, ECO, FA, GP");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toUpperCase();

    if (!cmd) return;

    const stock = stocks.find(s => s.symbol === cmd);
    if (stock) {
      onSelectStock(stock.symbol);
      setOutput(`Loading ${stock.symbol} - ${stock.name} | Last: ${stock.price.toFixed(2)} | Chg: ${stock.change >= 0 ? "+" : ""}${stock.change.toFixed(2)} (${stock.changePercent.toFixed(2)}%)`);
    } else if (cmd === "TOP") {
      setOutput("TOP NEWS > Loading top market headlines... [See News Feed panel]");
    } else if (cmd === "WEI") {
      setOutput("WORLD EQUITY INDEXES > S&P 500: 5,234.18 (+0.81%) | NASDAQ: 16,428.82 (+1.22%) | DOW: 39,512.84 (+0.80%)");
    } else if (cmd === "ECO") {
      setOutput("ECONOMIC CALENDAR > Next: US CPI (Mar 12) | FOMC Minutes (Mar 20) | NFP (Apr 5) | GDP Q1 (Apr 25)");
    } else if (cmd === "FA") {
      setOutput("FINANCIAL ANALYSIS > Select a security first. Type ticker + ENTER, then FA for detailed analysis.");
    } else if (cmd === "GP") {
      setOutput("PRICE CHART > Select a security from the watchlist. Chart displayed in detail panel.");
    } else if (cmd === "HELP") {
      setOutput("Commands: [TICKER] - Load stock | TOP - News | WEI - World indexes | ECO - Calendar | FA - Analysis | GP - Chart | HELP");
    } else {
      setOutput(`Security "${cmd}" not found. Type HELP for available commands.`);
    }

    setInput("");
  };

  return (
    <div className="border-t border-border bg-card px-3 py-2">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <span className="text-terminal-green font-mono-terminal text-xs font-bold">BLOOMBERG {'>'}</span>
        <input
          value={input}
          onChange={e => setInput(e.target.value.toUpperCase())}
          placeholder="Enter command or ticker..."
          className="flex-1 bg-transparent font-mono-terminal text-xs text-terminal-green outline-none placeholder:text-muted-foreground caret-terminal-green"
          autoFocus
        />
        <button type="submit" className="bg-terminal-green text-primary-foreground font-mono-terminal text-[10px] font-bold px-3 py-1 rounded-sm hover:opacity-90 transition-opacity">
          GO
        </button>
      </form>
      <div className="mt-1 text-[10px] font-mono-terminal text-terminal-dim truncate">{output}</div>
    </div>
  );
};

export default CommandBar;
