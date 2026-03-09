import { useState } from "react";
import { NewsItem } from "@/hooks/useMarketData";
import { motion, AnimatePresence } from "framer-motion";

const categoryColors: Record<string, string> = {
  market: "text-terminal-green",
  economy: "text-terminal-cyan",
  tech: "text-terminal-amber",
  forex: "text-terminal-blue",
  commodity: "text-terminal-orange",
  breaking: "text-terminal-red",
  bonds: "text-terminal-magenta",
  crypto: "text-terminal-yellow",
  geopolitics: "text-terminal-red",
};

interface NewsViewProps {
  news: NewsItem[];
}

const NewsView = ({ news }: NewsViewProps) => {
  const [filter, setFilter] = useState<string>("ALL");
  const categories = ["ALL", "BREAKING", "MARKET", "TECH", "ECONOMY", "FOREX", "COMMODITY", "CRYPTO", "BONDS", "GEOPOLITICS"];

  const filtered = filter === "ALL" ? news : news.filter(n => n.category.toUpperCase() === filter || (filter === "BREAKING" && (n.priority === "flash" || n.category === "breaking")));

  return (
    <div className="h-full flex flex-col">
      <div className="bb-panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-terminal-amber">NEWS</span>
          <span className="text-muted-foreground">─</span>
          <span className="text-muted-foreground">GLOBAL FINANCIAL NEWS</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-terminal-red animate-pulse" />
          <span className="text-terminal-red font-semibold">LIVE</span>
        </div>
      </div>

      <div className="flex items-center border-b border-border px-1 py-0.5 gap-0 flex-shrink-0 overflow-x-auto">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-2 py-0.5 text-[8px] font-mono-terminal transition-colors whitespace-nowrap ${filter === cat ? "text-terminal-amber bg-terminal-amber/10" : "text-muted-foreground hover:text-foreground"}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        <AnimatePresence initial={false}>
          {filtered.map(item => (
            <motion.div key={item.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.2 }}
              className="border-b border-border/20 px-3 py-1.5 bb-row-hover cursor-pointer">
              <div className="flex items-start gap-2">
                <span className="text-[9px] font-mono-terminal text-terminal-dim tabular-nums flex-shrink-0 mt-[1px]">{item.time}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono-terminal leading-snug text-foreground">
                    {item.priority === "flash" && <span className="bg-terminal-red text-primary-foreground px-1 py-0 text-[8px] font-bold mr-1 inline-block">FLASH</span>}
                    {item.priority === "high" && <span className="text-terminal-red mr-0.5">●</span>}
                    {item.headline}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[8px] font-mono-terminal uppercase font-semibold ${categoryColors[item.category] || "text-muted-foreground"}`}>{item.category}</span>
                    <span className="text-[8px] font-mono-terminal text-muted-foreground">{item.source}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NewsView;
