import { useEffect, useState } from "react";

const TerminalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const nyHour = new Date(time.toLocaleString("en-US", { timeZone: "America/New_York" })).getHours();
  const marketOpen = nyHour >= 9 && nyHour < 16;

  return (
    <div className="flex items-center gap-2 font-mono-terminal text-[10px]">
      <div className="flex items-center gap-1">
        <span className={`w-1.5 h-1.5 rounded-full ${marketOpen ? "bg-terminal-green animate-pulse" : "bg-terminal-red"}`} />
        <span className={`font-semibold ${marketOpen ? "text-terminal-green" : "text-terminal-red"}`}>
          {marketOpen ? "NYSE OPEN" : "NYSE CLOSED"}
        </span>
      </div>
      <span className="text-muted-foreground">│</span>
      <span className="text-terminal-amber tabular-nums font-semibold">
        {time.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </span>
      <span className="text-muted-foreground tabular-nums">
        {time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" }).toUpperCase()}
      </span>
    </div>
  );
};

export default TerminalClock;
