const sections = [
  { id: "overview", label: "1. OVERVIEW", icon: "🏢" },
  { id: "terminal", label: "2. TERMINAL", icon: "🖥️" },
  { id: "keyboard", label: "3. KEYBOARD", icon: "⌨️" },
  { id: "features", label: "4. FEATURES", icon: "📊" },
  { id: "prepare", label: "5. PREPARE", icon: "📚" },
  { id: "careers", label: "6. CAREERS", icon: "💼" },
];

const SideNav = () => {
  return (
    <nav className="hidden lg:block fixed left-0 top-24 w-48 p-3 space-y-1 z-40">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="flex items-center gap-2 px-3 py-1.5 rounded-sm font-mono-terminal text-[11px] text-muted-foreground hover:text-terminal-green hover:bg-muted/50 transition-colors"
        >
          <span>{s.icon}</span>
          {s.label}
        </a>
      ))}
    </nav>
  );
};

export default SideNav;
