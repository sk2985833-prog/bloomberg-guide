import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TerminalSectionProps {
  id: string;
  title: string;
  icon: string;
  children: ReactNode;
  delay?: number;
}

const TerminalSection = ({ id, title, icon, children, delay = 0 }: TerminalSectionProps) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="border border-border rounded bg-card overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b border-border">
        <span className="text-lg">{icon}</span>
        <h2 className="font-mono-terminal text-sm font-semibold text-terminal-amber glow-amber uppercase tracking-wider">
          {title}
        </h2>
        <div className="flex-1" />
        <span className="text-xs text-muted-foreground font-mono-terminal">[ {id.toUpperCase()} ]</span>
      </div>
      <div className="p-5">
        {children}
      </div>
    </motion.section>
  );
};

export default TerminalSection;
