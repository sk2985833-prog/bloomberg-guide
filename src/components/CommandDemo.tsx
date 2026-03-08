import { motion } from "framer-motion";
import { useState } from "react";

const commands = [
  { cmd: "AAPL <Equity> <GO>", desc: "Apple stock data" },
  { cmd: "WEI <GO>", desc: "World equity indexes" },
  { cmd: "TOP <GO>", desc: "Top market news" },
  { cmd: "ECO <GO>", desc: "Economic calendar" },
  { cmd: "FA <GO>", desc: "Company financial analysis" },
  { cmd: "GP <GO>", desc: "Price chart" },
];

const CommandDemo = () => {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      <div className="bg-background border border-border rounded p-4 font-mono-terminal">
        <div className="text-xs text-muted-foreground mb-2">BLOOMBERG TERMINAL {'>'}</div>
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-terminal-green text-lg glow-green"
        >
          {commands[active].cmd}
          <span className="animate-blink">█</span>
        </motion.div>
        <div className="text-xs text-terminal-dim mt-2">→ {commands[active].desc}</div>
      </div>
      <div className="flex flex-wrap gap-2">
        {commands.map((c, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`font-mono-terminal text-xs px-3 py-1.5 rounded-sm border transition-all ${
              i === active
                ? "border-terminal-green bg-muted text-terminal-green"
                : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground"
            }`}
          >
            {c.cmd.split(" ")[0]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CommandDemo;
