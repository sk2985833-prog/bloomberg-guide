interface DataTableProps {
  headers: string[];
  rows: string[][];
  highlightCol?: number;
}

const DataTable = ({ headers, rows, highlightCol }: DataTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full font-mono-terminal text-sm">
        <thead>
          <tr className="border-b border-border">
            {headers.map((h, i) => (
              <th key={i} className="text-left py-2 px-3 text-terminal-cyan text-xs font-medium uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`py-2 px-3 ${ci === highlightCol ? "text-terminal-green font-medium" : "text-foreground"}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
