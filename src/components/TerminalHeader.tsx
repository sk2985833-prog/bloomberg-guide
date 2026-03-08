import { motion } from "framer-motion";

const TerminalHeader = () => {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold font-mono-terminal text-terminal-green glow-green tracking-tighter"
          >
            BLOOMBERG<span className="text-terminal-amber">®</span>
          </motion.div>
          <span className="text-xs text-muted-foreground font-mono-terminal">TERMINAL</span>
        </div>
        <div className="flex items-center gap-4 font-mono-terminal text-xs">
          <span className="text-terminal-dim">SESSION: LEARN_001</span>
          <span className="text-terminal-green animate-blink">●</span>
          <span className="text-terminal-dim">
            {new Date().toLocaleTimeString("en-US", { hour12: false })}
          </span>
        </div>
      </div>
      {/* Ticker */}
      <div className="overflow-hidden border-t border-border bg-muted/50 py-1">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-6 px-4 font-mono-terminal text-xs">
              <span>AAPL <span className="text-terminal-green">+2.34%</span> 189.45</span>
              <span>MSFT <span className="text-terminal-green">+1.12%</span> 378.20</span>
              <span>GOOGL <span className="text-terminal-red">-0.45%</span> 141.80</span>
              <span>AMZN <span className="text-terminal-green">+3.01%</span> 178.92</span>
              <span>TSLA <span className="text-terminal-red">-1.78%</span> 245.30</span>
              <span>JPM <span className="text-terminal-green">+0.89%</span> 198.45</span>
              <span>GS <span className="text-terminal-green">+1.55%</span> 412.30</span>
              <span>USD/EUR <span className="text-terminal-cyan">1.0842</span></span>
              <span>BTC/USD <span className="text-terminal-amber">67,234</span></span>
              <span>GOLD <span className="text-terminal-green">+0.32%</span> 2,342.50</span>
              <span className="px-4">│</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default TerminalHeader;
