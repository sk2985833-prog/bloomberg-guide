import { useMemo } from "react";

interface AssetChartProps {
  history: number[];
  label: string;
  currentValue: number;
  positive: boolean;
  width?: number;
  height?: number;
}

const AssetChart = ({ history, label, currentValue, positive, width = 280, height = 80 }: AssetChartProps) => {
  const { linePath, areaPath, color, gridLines, priceLabels } = useMemo(() => {
    const mn = Math.min(...history);
    const mx = Math.max(...history);
    const rng = mx - mn || 1;
    const c = positive ? "hsl(120, 60%, 50%)" : "hsl(0, 72%, 55%)";

    const pts = history.map((v, i) => {
      const x = (i / (history.length - 1)) * width;
      const y = height - ((v - mn) / rng) * (height - 10) - 5;
      return { x, y, value: v };
    });

    const lp = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const ap = `${lp} L ${width} ${height} L 0 ${height} Z`;

    const gLines: number[] = [];
    const pLabels: { y: number; label: string }[] = [];
    for (let i = 0; i <= 3; i++) {
      const y = 5 + (i / 3) * (height - 10);
      const price = mx - (i / 3) * rng;
      gLines.push(y);
      pLabels.push({ y, label: price >= 1000 ? Math.round(price).toLocaleString() : price.toFixed(2) });
    }

    return { linePath: lp, areaPath: ap, color: c, gridLines: gLines, priceLabels: pLabels };
  }, [history, positive, width, height]);

  const formatVal = (v: number) => v >= 1000 ? v.toLocaleString(undefined, { maximumFractionDigits: 0 }) : v.toFixed(2);

  return (
    <div className="flex flex-col">
      <svg viewBox={`-40 0 ${width + 50} ${height + 5}`} className="w-full" style={{ height: `${height}px` }} preserveAspectRatio="xMidYMid meet">
        {gridLines.map((y, i) => (
          <g key={i}>
            <line x1="0" y1={y} x2={width} y2={y} stroke="hsl(222, 16%, 12%)" strokeWidth="0.5" />
            <text x="-4" y={y + 3} textAnchor="end" fill="hsl(222, 10%, 40%)" fontSize="6" fontFamily="IBM Plex Mono">
              {priceLabels[i]?.label}
            </text>
          </g>
        ))}
        <defs>
          <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#grad-${label})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export default AssetChart;
