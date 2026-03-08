import { useEffect, useState } from "react";

const TerminalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const marketOpen = time.getHours() >= 9 && time.getHours() < 16;

  return (
    <div className="flex items-center gap-3 font-mono-terminal text-xs">
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${marketOpen ? "bg-terminal-green animate-pulse" : "bg-terminal-red"}`} />
        <span className={marketOpen ? "text-terminal-green" : "text-terminal-red"}>
          {marketOpen ? "MKT OPEN" : "MKT CLOSED"}
        </span>
      </div>
      <span className="text-muted-foreground">│</span>
      <span className="text-terminal-amber tabular-nums">
        {time.toLocaleTimeString("en-US", { hour12: false })}
      </span>
      <span className="text-muted-foreground">
        {time.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
      </span>
    </div>
  );
};

export default TerminalClock;
