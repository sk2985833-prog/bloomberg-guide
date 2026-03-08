interface FunctionBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const functionKeys = [
  { key: "F1", label: "HELP", color: "text-terminal-green" },
  { key: "F2", label: "GOVT", color: "text-terminal-yellow" },
  { key: "F3", label: "CORP", color: "text-terminal-yellow" },
  { key: "F4", label: "EQUITY", color: "text-terminal-yellow" },
  { key: "F5", label: "CMDTY", color: "text-terminal-yellow" },
  { key: "F6", label: "INDEX", color: "text-terminal-yellow" },
  { key: "F7", label: "CRNCY", color: "text-terminal-yellow" },
  { key: "F8", label: "M&A", color: "text-terminal-yellow" },
  { key: "F9", label: "TRADE", color: "text-terminal-cyan" },
  { key: "F10", label: "PORT", color: "text-terminal-cyan" },
  { key: "F11", label: "NEWS", color: "text-terminal-cyan" },
  { key: "F12", label: "MSG", color: "text-terminal-cyan" },
];

const FunctionBar = ({ activeTab, onTabChange }: FunctionBarProps) => {
  return (
    <div className="flex items-center border-b border-border bg-muted/40 h-[22px] flex-shrink-0 px-1">
      {functionKeys.map(fk => {
        const isActive = fk.label === activeTab;
        return (
          <button
            key={fk.key}
            onClick={() => onTabChange(fk.label)}
            className={`flex items-center gap-1 px-1.5 h-full transition-colors ${
              isActive ? "bg-terminal-amber/20 border-b border-terminal-amber" : "hover:bg-muted/60"
            }`}
          >
            <span className="text-[9px] font-mono-terminal text-muted-foreground">{fk.key}</span>
            <span className={`text-[9px] font-mono-terminal font-semibold ${isActive ? "text-terminal-amber" : fk.color}`}>
              {fk.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FunctionBar;
