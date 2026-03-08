import { NewsItem } from "@/hooks/useMarketData";
import { motion, AnimatePresence } from "framer-motion";

const categoryColors: Record<string, string> = {
  market: "text-terminal-green",
  economy: "text-terminal-cyan",
  tech: "text-terminal-amber",
  forex: "text-terminal-blue",
  commodity: "text-terminal-amber",
  breaking: "text-terminal-red",
};

const priorityBadge: Record<string, string> = {
  high: "bg-terminal-red/20 text-terminal-red border-terminal-red/30",
  medium: "bg-terminal-amber/10 text-terminal-amber border-terminal-amber/20",
  low: "bg-muted text-muted-foreground border-border",
};

interface NewsPanelProps {
  news: NewsItem[];
}

const NewsPanel = ({ news }: NewsPanelProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
        <span className="text-xs font-mono-terminal text-terminal-cyan font-semibold uppercase tracking-wider">Live News Feed</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-terminal-red animate-pulse" />
          <span className="text-[10px] font-mono-terminal text-terminal-red">LIVE</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <AnimatePresence initial={false}>
          {news.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="border-b border-border/30 px-3 py-2 hover:bg-muted/20 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono-terminal leading-relaxed">
                    {item.priority === "high" && <span className="text-terminal-red mr-1">●</span>}
                    {item.headline}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-mono-terminal uppercase ${categoryColors[item.category] || "text-muted-foreground"}`}>
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono-terminal text-muted-foreground">│</span>
                    <span className="text-[10px] font-mono-terminal text-muted-foreground">{item.source}</span>
                    <span className="text-[10px] font-mono-terminal text-muted-foreground">│</span>
                    <span className="text-[10px] font-mono-terminal text-terminal-dim">{item.time}</span>
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

export default NewsPanel;
