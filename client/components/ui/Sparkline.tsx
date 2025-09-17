import React, { useRef, useState } from "react";

export default function Sparkline({
  data,
  color = "#06b6d4",
  width = 100,
  height = 24,
  strokeWidth = 1.5,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}) {
  if (!data || data.length === 0) return <svg width={width} height={height} />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1 || 1);
  const pointsArray = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * height;
    return { x, y, v };
  });
  const points = pointsArray.map((p) => `${p.x},${p.y}`).join(" ");

  // Area path
  const areaPath = `M0,${height} L${pointsArray[0].x},${pointsArray[0].y} ${points} L${width},${height} Z`;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    value: number;
  } | null>(null);

  function onMove(e: React.MouseEvent) {
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const idx = Math.round((x / width) * (data.length - 1));
    const clamped = Math.max(0, Math.min(data.length - 1, idx));
    const p = pointsArray[clamped];
    setTooltip({ x: p.x, y: p.y, value: p.v });
  }

  function onLeave() {
    setTooltip(null);
  }

  return (
    <div
      ref={wrapperRef}
      className="relative"
      style={{ width, height }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="block"
      >
        <defs>
          <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#g1)" />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {tooltip && (
          <g>
            <circle cx={tooltip.x} cy={tooltip.y} r={3} fill={color} />
          </g>
        )}
      </svg>
      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: Math.min(Math.max(0, tooltip.x - 30), width - 60),
            top: tooltip.y - 36,
          }}
          className="bg-white dark:bg-neutral-900 border border-white/10 text-xs rounded px-2 py-1 shadow"
        >
          {tooltip.value}
        </div>
      )}
    </div>
  );
}
