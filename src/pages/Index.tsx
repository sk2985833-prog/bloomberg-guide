import { motion } from "framer-motion";
import TerminalHeader from "@/components/TerminalHeader";
import TerminalSection from "@/components/TerminalSection";
import DataTable from "@/components/DataTable";
import KeyboardKey from "@/components/KeyboardKey";
import CommandDemo from "@/components/CommandDemo";
import SideNav from "@/components/SideNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background scanline">
      <TerminalHeader />
      <SideNav />

      <main className="max-w-4xl mx-auto px-4 py-8 lg:ml-52 space-y-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-mono-terminal text-terminal-green glow-green mb-4">
            BLOOMBERG
          </h1>
          <p className="text-xl font-mono-terminal text-terminal-amber glow-amber mb-2">
            & THE BLOOMBERG TERMINAL
          </p>
          <p className="text-3xl mb-6">💹🖥️</p>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto font-mono-terminal leading-relaxed">
            The definitive guide to the world's most powerful financial information system.
            Used by banks, hedge funds, and governments worldwide.
          </p>
        </motion.div>

        {/* 1. What is Bloomberg */}
        <TerminalSection id="overview" title="What is Bloomberg L.P.?" icon="🏢">
          <p className="text-sm text-foreground leading-relaxed mb-4">
            Bloomberg is a global financial information and media company founded in <span className="text-terminal-amber font-semibold">1981</span> by <span className="text-terminal-cyan">Michael Bloomberg</span>. It provides:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
            {[
              { icon: "📊", label: "Financial market data" },
              { icon: "📰", label: "Business & economic news" },
              { icon: "📈", label: "Analytics for investors" },
              { icon: "💻", label: "Software tools" },
              { icon: "🔬", label: "Trading research" },
              { icon: "🌐", label: "Global coverage" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-muted/50 rounded px-3 py-2 border border-border/50">
                <span>{item.icon}</span>
                <span className="text-xs font-mono-terminal">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="bg-background border border-border rounded p-4">
            <p className="text-xs text-terminal-cyan font-mono-terminal mb-2 uppercase tracking-wider">Major Organizations</p>
            <div className="flex flex-wrap gap-2">
              {["Investment Banks", "Hedge Funds", "Stock Traders", "Governments", "Large Corporations"].map((org) => (
                <span key={org} className="text-xs font-mono-terminal bg-muted px-3 py-1 rounded-sm border border-border text-foreground">
                  {org}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-terminal-dim font-mono-terminal mt-4 italic">
            Think of Bloomberg as a giant information engine for the financial world — instead of searching the internet, professionals open a Terminal and everything appears instantly.
          </p>
        </TerminalSection>

        {/* 2. What is the Terminal */}
        <TerminalSection id="terminal" title="What is the Bloomberg Terminal?" icon="🖥️">
          <p className="text-sm text-foreground leading-relaxed mb-4">
            The Bloomberg Terminal is a specialized computer system used by finance professionals to access <span className="text-terminal-green font-semibold">real-time financial information</span>.
          </p>
          <DataTable
            headers={["Example", "What It Shows"]}
            rows={[
              ["AAPL", "Apple stock price and analysis"],
              ["USD/INR", "Currency exchange rate"],
              ["GOVT bonds", "Government bond yields"],
              ["Economic data", "Inflation, GDP, etc."],
            ]}
            highlightCol={0}
          />
          <div className="mt-4 bg-muted/30 border border-border rounded p-3 flex items-center gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <p className="text-xs font-mono-terminal text-terminal-amber font-semibold">~$24,000 / year per terminal</p>
              <p className="text-xs text-muted-foreground font-mono-terminal">The cost reflects the speed and depth of data available</p>
            </div>
          </div>
        </TerminalSection>

        {/* 3. Keyboard */}
        <TerminalSection id="keyboard" title="The Bloomberg Terminal Keyboard" icon="⌨️">
          <p className="text-sm text-foreground leading-relaxed mb-5">
            The keyboard is different from a normal keyboard — it has <span className="text-terminal-amber font-semibold">color-coded keys</span> to make financial work faster.
          </p>

          <div className="space-y-5">
            <div>
              <p className="text-xs text-terminal-cyan font-mono-terminal mb-3 uppercase tracking-wider">Key Colors</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <KeyboardKey label="GO" color="green" />
                  <span className="text-xs text-muted-foreground font-mono-terminal">Action / Execute</span>
                </div>
                <div className="flex items-center gap-2">
                  <KeyboardKey label="STOP" color="red" />
                  <span className="text-xs text-muted-foreground font-mono-terminal">Cancel / Stop</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-terminal-cyan font-mono-terminal mb-3 uppercase tracking-wider">Yellow Market Sector Keys</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { key: "F2", label: "Govt Bonds" },
                  { key: "F3", label: "Corp Bonds" },
                  { key: "F4", label: "Equities" },
                  { key: "F5", label: "Commodities" },
                  { key: "F6", label: "Indexes" },
                  { key: "F7", label: "Currencies" },
                ].map((k) => (
                  <KeyboardKey key={k.key} label={k.key} color="amber" sublabel={k.label} />
                ))}
              </div>
            </div>

            <div className="bg-background border border-border rounded p-4">
              <p className="text-xs text-muted-foreground font-mono-terminal mb-2">EXAMPLE COMMAND:</p>
              <div className="flex items-center gap-2 flex-wrap">
                <KeyboardKey label="AAPL" color="default" />
                <span className="text-terminal-dim">+</span>
                <KeyboardKey label="Equity" color="amber" />
                <span className="text-terminal-dim">+</span>
                <KeyboardKey label="GO" color="green" />
                <span className="text-terminal-dim mx-2">→</span>
                <span className="text-xs font-mono-terminal text-terminal-green">Shows Apple stock data</span>
              </div>
            </div>
          </div>
        </TerminalSection>

        {/* 4. Features */}
        <TerminalSection id="features" title="What Can You Do With a Bloomberg Terminal?" icon="📊">
          <div className="grid md:grid-cols-2 gap-3 mb-5">
            {[
              { icon: "📈", title: "Stock Analysis", desc: "Check company profits, debt, valuation" },
              { icon: "💱", title: "Currency Trading", desc: "Track forex markets in real-time" },
              { icon: "📊", title: "Economic Research", desc: "Study inflation, GDP, interest rates" },
              { icon: "🧠", title: "Financial Modeling", desc: "Analyze investments and risk" },
              { icon: "📰", title: "Breaking News", desc: "Faster than most news websites" },
              { icon: "💬", title: "Bloomberg Chat (IB)", desc: "Communicate with traders worldwide" },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-muted/30 border border-border rounded p-3 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{f.icon}</span>
                  <h3 className="text-xs font-mono-terminal font-semibold text-terminal-amber">{f.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground font-mono-terminal">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-xs text-terminal-cyan font-mono-terminal mb-3 uppercase tracking-wider">Interactive Command Demo</p>
          <CommandDemo />
        </TerminalSection>

        {/* 5. How to Prepare */}
        <TerminalSection id="prepare" title="How to Prepare to Use Bloomberg Terminal" icon="📚">
          <div className="space-y-5">
            {[
              {
                step: "1",
                title: "Learn Finance Basics",
                content: (
                  <div className="flex flex-wrap gap-2">
                    {["Stock Market", "Bonds", "Derivatives", "Financial Statements", "Economics"].map((s) => (
                      <span key={s} className="text-xs font-mono-terminal bg-muted px-3 py-1 rounded-sm border border-border">{s}</span>
                    ))}
                  </div>
                ),
              },
              {
                step: "2",
                title: "Take Bloomberg Market Concepts (BMC)",
                content: (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-mono-terminal">Official beginner course covering:</p>
                    <div className="flex flex-wrap gap-2">
                      {["Economic Indicators", "Currencies", "Fixed Income", "Equity Markets"].map((s) => (
                        <span key={s} className="text-xs font-mono-terminal bg-muted px-3 py-1 rounded-sm border border-border">{s}</span>
                      ))}
                    </div>
                    <p className="text-xs text-terminal-dim font-mono-terminal">⏱ Duration: 8–10 hours → Bloomberg Certificate</p>
                  </div>
                ),
              },
              {
                step: "3",
                title: "Practice Terminal Commands",
                content: (
                  <DataTable
                    headers={["Command", "Function"]}
                    rows={[
                      ["WEI", "World equity indexes"],
                      ["TOP", "Top market news"],
                      ["ECO", "Economic calendar"],
                      ["FA", "Company financial analysis"],
                      ["GP", "Price chart"],
                    ]}
                    highlightCol={0}
                  />
                ),
              },
              {
                step: "4",
                title: "Learn Excel + Data Analysis",
                content: (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-mono-terminal">Bloomberg connects with Excel for data analysis.</p>
                    <div className="flex flex-wrap gap-2">
                      {["Excel Formulas", "Financial Modeling", "Data Analysis", "Bloomberg Add-in"].map((s) => (
                        <span key={s} className="text-xs font-mono-terminal bg-muted px-3 py-1 rounded-sm border border-border">{s}</span>
                      ))}
                    </div>
                  </div>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-muted border border-border flex items-center justify-center font-mono-terminal text-sm text-terminal-green font-bold">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-mono-terminal font-semibold text-terminal-amber mb-2">{item.title}</h3>
                  {item.content}
                </div>
              </div>
            ))}
          </div>
        </TerminalSection>

        {/* 6. Careers */}
        <TerminalSection id="careers" title="Careers That Use Bloomberg Terminal" icon="💼">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
            {[
              { icon: "💼", role: "Investment Banker" },
              { icon: "📊", role: "Financial Analyst" },
              { icon: "📈", role: "Stock Trader" },
              { icon: "🏦", role: "Asset Manager" },
              { icon: "📉", role: "Risk Analyst" },
              { icon: "🔍", role: "Research Analyst" },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-muted/30 border border-border rounded p-3 text-center hover:border-primary/30 transition-colors"
              >
                <span className="text-2xl block mb-1">{c.icon}</span>
                <p className="text-xs font-mono-terminal text-foreground font-medium">{c.role}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-background border border-border rounded p-4">
            <p className="text-xs text-terminal-cyan font-mono-terminal mb-2 uppercase tracking-wider">Top Firms Using Bloomberg</p>
            <div className="flex flex-wrap gap-2">
              {["Goldman Sachs", "JPMorgan Chase", "Morgan Stanley", "BlackRock", "Citadel", "Bridgewater"].map((firm) => (
                <span key={firm} className="text-xs font-mono-terminal bg-muted px-3 py-1.5 rounded-sm border border-border text-terminal-green font-medium">
                  {firm}
                </span>
              ))}
            </div>
          </div>
        </TerminalSection>

        {/* Footer */}
        <div className="text-center py-8 border-t border-border">
          <p className="text-xs font-mono-terminal text-terminal-dim">
            BLOOMBERG TERMINAL GUIDE © {new Date().getFullYear()} │ EDUCATIONAL PURPOSE ONLY
          </p>
          <p className="text-xs font-mono-terminal text-muted-foreground mt-1">
            Bloomberg® is a registered trademark of Bloomberg L.P.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
