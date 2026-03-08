interface KeyboardKeyProps {
  label: string;
  color: "green" | "red" | "amber" | "default";
  sublabel?: string;
}

const colorMap = {
  green: "bg-terminal-green text-primary-foreground shadow-[0_0_8px_hsl(140_70%_45%/0.4)]",
  red: "bg-terminal-red text-destructive-foreground shadow-[0_0_8px_hsl(0_70%_55%/0.4)]",
  amber: "bg-terminal-amber text-secondary-foreground shadow-[0_0_8px_hsl(35_90%_55%/0.4)]",
  default: "bg-muted text-foreground",
};

const KeyboardKey = ({ label, color, sublabel }: KeyboardKeyProps) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`${colorMap[color]} font-mono-terminal text-xs font-bold px-3 py-2 rounded-sm min-w-[48px] text-center border border-border/50`}
      >
        {label}
      </div>
      {sublabel && (
        <span className="text-[10px] text-muted-foreground font-mono-terminal">{sublabel}</span>
      )}
    </div>
  );
};

export default KeyboardKey;
