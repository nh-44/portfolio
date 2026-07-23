import React from 'react';

export default function TelemetryChart({ data = [] }) {
  const width = 300;
  const height = 80;
  const paddingX = 8;
  const paddingY = 12;

  if (data.length === 0) return null;

  const maxVal = Math.max(...data, 100);
  const minVal = Math.min(...data, 0);
  const range = maxVal - minVal || 1;

  // Convert raw values into SVG grid coordinates
  const points = data.map((val, idx) => {
    const x = paddingX + (idx / (data.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((val - minVal) / range) * (height - paddingY * 2);
    return { x, y };
  });

  // Generate smooth cubic bezier curves between points
  const linePath = points.reduce((path, p, idx) => {
    if (idx === 0) return `M ${p.x} ${p.y}`;
    const prev = points[idx - 1];
    const cpX1 = prev.x + (p.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (p.x - prev.x) / 2;
    const cpY2 = p.y;
    return `${path} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
  }, '');

  // Fill path closes the shape down to the bottom padding line
  const fillPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  return (
    <div className="w-full h-24 relative overflow-hidden bg-slate-950/40 rounded-xl border border-white/5 p-2 backdrop-blur-sm select-none">
      {/* Chart Title / HUD Details overlay */}
      <div className="absolute top-1.5 left-2 flex justify-between w-[92%] z-20 font-mono text-[8px] text-slate-500">
        <span>SYS_LATENCY_TRACKER</span>
        <span className="text-accent animate-pulse font-bold">
          {data[data.length - 1]?.toFixed(0)} ms
        </span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          {/* Subtle area gradient */}
          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent, #EAB308)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--accent, #EAB308)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Faint background grid lines */}
        <line x1="0" y1={paddingY} x2={width} y2={paddingY} stroke="rgba(255,255,255,0.03)" />
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
        <line x1="0" y1={height - paddingY} x2={width} y2={height - paddingY} stroke="rgba(255,255,255,0.05)" />

        {/* Area fill under curve */}
        {fillPath && (
          <path
            d={fillPath}
            fill="url(#chartGlow)"
            className="transition-all duration-300 ease-out"
          />
        )}

        {/* Dynamic line curve */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="var(--accent, #EAB308)"
            strokeWidth="1.2"
            className="transition-all duration-300 ease-out drop-shadow-[0_2px_4px_rgba(234,179,8,0.15)]"
          />
        )}

        {/* Floating marker on active/last coordinate */}
        {points.length > 0 && (
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="2.5"
            fill="var(--accent, #EAB308)"
            className="animate-ping origin-center"
            style={{ transformOrigin: `${points[points.length - 1].x}px ${points[points.length - 1].y}px` }}
          />
        )}
        {points.length > 0 && (
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="1.5"
            fill="var(--accent, #EAB308)"
          />
        )}
      </svg>
    </div>
  );
}
