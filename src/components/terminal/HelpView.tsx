const HelpView = () => {
  const commands = [
    { key: "F1", label: "HELP", desc: "This help screen" },
    { key: "F2", label: "GOVT", desc: "Government bonds - sovereign yields, duration, risk" },
    { key: "F3", label: "CORP", desc: "Corporate bonds and credit markets" },
    { key: "F4", label: "EQUITY", desc: "Equity markets - stocks across 270+ exchanges" },
    { key: "F5", label: "CMDTY", desc: "Commodities - Oil, Gold, Silver, Agricultural" },
    { key: "F6", label: "INDEX", desc: "World equity indices - global market overview" },
    { key: "F7", label: "CRNCY", desc: "Foreign exchange - 170+ currency pairs" },
    { key: "F8", label: "M&A", desc: "Mergers & acquisitions activity" },
    { key: "F9", label: "TRADE", desc: "Trading desk and execution" },
    { key: "F10", label: "PORT", desc: "Portfolio analysis and management" },
    { key: "F11", label: "NEWS", desc: "Global financial news - real-time feed" },
    { key: "F12", label: "MSG", desc: "Instant Bloomberg messaging" },
  ];

  const cmdBarCommands = [
    { cmd: "[TICKER]", desc: "Load security detail (e.g. AAPL, MSFT)" },
    { cmd: "TOP", desc: "Top market headlines" },
    { cmd: "WEI", desc: "World equity indices" },
    { cmd: "ECO", desc: "Economic calendar" },
    { cmd: "FA", desc: "Fundamental analysis" },
    { cmd: "GP", desc: "Price chart" },
    { cmd: "IB", desc: "Instant Bloomberg messaging" },
    { cmd: "HELP", desc: "Command reference" },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="bb-panel-header flex items-center gap-2">
        <span className="text-terminal-amber">HELP</span>
        <span className="text-muted-foreground">─</span>
        <span className="text-terminal-green">BLOOMBERG TERMINAL GUIDE</span>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-terminal-amber font-mono-terminal text-[12px] font-bold mb-3">
            BLOOMBERG PROFESSIONAL® SERVICE
          </div>
          <p className="text-[10px] font-mono-terminal text-muted-foreground mb-4">
            The Bloomberg Terminal provides real-time financial data, trading tools, news, and analytics
            for financial professionals worldwide. Use the function keys or command bar to navigate.
          </p>

          <div className="text-terminal-cyan font-mono-terminal text-[10px] font-bold mb-2 uppercase tracking-widest">
            Function Keys
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-6">
            {commands.map(c => (
              <div key={c.key} className="flex items-center gap-2 py-[2px]">
                <span className="text-[9px] font-mono-terminal text-muted-foreground w-[24px]">{c.key}</span>
                <span className="text-[10px] font-mono-terminal text-terminal-yellow font-semibold w-[50px]">{c.label}</span>
                <span className="text-[9px] font-mono-terminal text-muted-foreground">{c.desc}</span>
              </div>
            ))}
          </div>

          <div className="text-terminal-cyan font-mono-terminal text-[10px] font-bold mb-2 uppercase tracking-widest">
            Command Bar
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-6">
            {cmdBarCommands.map(c => (
              <div key={c.cmd} className="flex items-center gap-2 py-[2px]">
                <span className="text-[10px] font-mono-terminal text-terminal-amber font-semibold w-[60px]">{c.cmd}</span>
                <span className="text-[9px] font-mono-terminal text-muted-foreground">{c.desc}</span>
              </div>
            ))}
          </div>

          <div className="text-terminal-cyan font-mono-terminal text-[10px] font-bold mb-2 uppercase tracking-widest">
            Coverage
          </div>
          <div className="grid grid-cols-3 gap-4 text-[9px] font-mono-terminal">
            <div>
              <span className="text-terminal-green">Stocks:</span>
              <span className="text-muted-foreground"> 90,000+ companies across 270+ exchanges</span>
            </div>
            <div>
              <span className="text-terminal-magenta">Bonds:</span>
              <span className="text-muted-foreground"> 2.5M+ fixed income securities globally</span>
            </div>
            <div>
              <span className="text-terminal-blue">Forex:</span>
              <span className="text-muted-foreground"> 170+ currencies, thousands of pairs</span>
            </div>
            <div>
              <span className="text-terminal-orange">Commodities:</span>
              <span className="text-muted-foreground"> Energy, metals, agriculture futures</span>
            </div>
            <div>
              <span className="text-terminal-cyan">Indices:</span>
              <span className="text-muted-foreground"> Major indices across all regions</span>
            </div>
            <div>
              <span className="text-terminal-yellow">Crypto:</span>
              <span className="text-muted-foreground"> Digital assets, DeFi, NFTs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpView;
