'use client';

import { useMemo, useState, useEffect } from 'react';
import type { UsageDataPoint } from '@/types/customer';
import { clsx } from 'clsx';

interface UsageTrendsChartProps {
  data: UsageDataPoint[];
}

export function UsageTrendsChart({ data }: UsageTrendsChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const chartData = useMemo(() => {
    if (data.length === 0) return null;

    const maxActiveUsers = Math.max(...data.map(d => d.activeUsers));
    const maxSessions = Math.max(...data.map(d => d.sessions));

    return {
      points: data,
      maxActiveUsers,
      maxSessions,
    };
  }, [data]);

  if (!chartData) {
    return (
      <div className="h-32 bg-slate-50 flex items-center justify-center border-2 border-black">
        <p className="text-sm font-bold text-slate-500">No usage data available</p>
      </div>
    );
  }

  // Chart dimensions
  const width = 380;
  const height = 100;
  const padding = { top: 15, right: 15, bottom: 25, left: 35 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const xScale = (index: number) =>
    padding.left + (index / (chartData.points.length - 1)) * chartWidth;

  const yScaleUsers = (value: number) =>
    padding.top + chartHeight - (value / chartData.maxActiveUsers) * chartHeight;

  // Create smooth curve path using cubic bezier
  const createSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
      
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    
    return path;
  };

  const activeUsersPoints = chartData.points.map((point, i) => ({
    x: xScale(i),
    y: yScaleUsers(point.activeUsers),
  }));

  const adoptionPoints = chartData.points.map((point, i) => ({
    x: xScale(i),
    y: padding.top + chartHeight - (point.featureAdoption / 100) * chartHeight,
  }));

  const activeUsersPath = createSmoothPath(activeUsersPoints);
  const adoptionPath = createSmoothPath(adoptionPoints);

  // Area path for active users
  const areaPath = `${activeUsersPath} L ${xScale(chartData.points.length - 1)} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;

  const hoveredPoint = hoveredIndex !== null ? chartData.points[hoveredIndex] : null;

  return (
    <div 
      className="bg-white border-2 border-black shadow-brutal p-3 group/chart transition-all duration-300 hover:shadow-brutal-lg"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(10px)',
      }}
    >
      {/* Legend */}
      <div className="flex items-center gap-4 mb-2 text-[10px] font-bold uppercase">
        <div className="flex items-center gap-1 transition-colors duration-200 group-hover/chart:text-brand-500">
          <span className="h-2 w-2 border border-black bg-brand-500 transition-transform duration-200 group-hover/chart:scale-110" />
          <span className="text-black">Active Users</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 border border-black bg-black" />
          <span className="text-black">Adoption %</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
          aria-label="Usage trends chart"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Professional animations with CSS */}
          <style>
            {`
              .chart-line {
                stroke-dasharray: 1000;
                stroke-dashoffset: 1000;
                animation: drawLine 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
              }
              .chart-area {
                opacity: 0;
                animation: fadeInArea 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
              }
              .chart-point {
                opacity: 0;
                transform-origin: center;
                animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
              }
              @keyframes drawLine {
                to { stroke-dashoffset: 0; }
              }
              @keyframes fadeInArea {
                to { opacity: 0.12; }
              }
              @keyframes popIn {
                0% { opacity: 0; transform: scale(0); }
                50% { transform: scale(1.1); }
                100% { opacity: 1; transform: scale(1); }
              }
            `}
          </style>

          {/* Grid lines - subtle */}
          {[0, 0.5, 1].map((ratio) => (
            <line
              key={ratio}
              x1={padding.left}
              y1={padding.top + chartHeight * (1 - ratio)}
              x2={width - padding.right}
              y2={padding.top + chartHeight * (1 - ratio)}
              stroke="#000"
              strokeOpacity="0.06"
              strokeWidth="1"
              className="transition-opacity duration-300 group-hover/chart:stroke-opacity-10"
            />
          ))}

          {/* Area fill with smooth animation */}
          <path
            d={areaPath}
            fill="url(#areaGradient)"
            className="chart-area"
          />

          {/* Active users line - smooth draw */}
          <path
            d={activeUsersPath}
            fill="none"
            stroke="#F26522"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="chart-line transition-all duration-200 group-hover/chart:stroke-[3]"
          />

          {/* Feature adoption line - delayed animation */}
          <path
            d={adoptionPath}
            fill="none"
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="3 3"
            className="chart-line"
            style={{ animationDelay: '0.2s' }}
          />

          {/* Hover detection areas - invisible but interactive */}
          {chartData.points.map((point, i) => (
            <rect
              key={`hover-${i}`}
              x={xScale(i) - 8}
              y={padding.top}
              width="16"
              height={chartHeight}
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={() => setHoveredIndex(i)}
            />
          ))}

          {/* Data points with smooth hover */}
          {chartData.points.filter((_, i) => i % 5 === 0 || i === chartData.points.length - 1).map((point, idx) => {
            const i = chartData.points.indexOf(point);
            const isHovered = hoveredIndex === i;
            const pointX = xScale(i);
            const pointY = yScaleUsers(point.activeUsers);
            
            return (
              <g key={i}>
                <rect
                  x={pointX - (isHovered ? 5 : 3)}
                  y={pointY - (isHovered ? 5 : 3)}
                  width={isHovered ? 10 : 6}
                  height={isHovered ? 10 : 6}
                  fill="#F26522"
                  stroke="black"
                  strokeWidth={isHovered ? 2 : 1}
                  className="chart-point transition-all duration-200 ease-out"
                  style={{ 
                    animationDelay: `${0.8 + idx * 0.08}s`,
                    transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                  }}
                />
              </g>
            );
          })}

          {/* Hover indicator line - smooth appearance */}
          {hoveredIndex !== null && (
            <line
              x1={xScale(hoveredIndex)}
              y1={padding.top}
              x2={xScale(hoveredIndex)}
              y2={padding.top + chartHeight}
              stroke="#F26522"
              strokeWidth="1.5"
              strokeDasharray="2 2"
              className="transition-opacity duration-150"
              style={{ opacity: 0.6 }}
            />
          )}

          {/* Y-axis labels */}
          <text x={padding.left - 6} y={padding.top + 3} textAnchor="end" className="text-[9px] font-bold fill-black">
            {chartData.maxActiveUsers}
          </text>
          <text x={padding.left - 6} y={padding.top + chartHeight + 1} textAnchor="end" className="text-[9px] font-bold fill-black">
            0
          </text>

          {/* X-axis labels */}
          <text x={padding.left} y={height - 6} textAnchor="start" className="text-[9px] font-bold fill-slate-400">
            30d ago
          </text>
          <text x={width - padding.right} y={height - 6} textAnchor="end" className="text-[9px] font-bold fill-slate-400">
            Today
          </text>

          {/* Gradient definition */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F26522" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F26522" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Hover tooltip - smooth fade in */}
        {hoveredPoint && hoveredIndex !== null && (
          <div
            className="absolute pointer-events-none bg-black text-white text-[10px] font-bold px-2 py-1.5 border-2 border-black shadow-brutal-sm transition-all duration-150 ease-out z-10"
            style={{
              left: `${((xScale(hoveredIndex) - padding.left) / chartWidth) * 100}%`,
              top: '-12px',
              transform: 'translateX(-50%)',
              opacity: hoveredIndex !== null ? 1 : 0,
            }}
          >
            <div className="text-brand-500">{hoveredPoint.activeUsers} users</div>
            <div className="text-slate-300 text-[9px]">{hoveredPoint.featureAdoption}% adoption</div>
          </div>
        )}
      </div>

      {/* Summary stats - with hover effects */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center border-t-2 border-black pt-3">
        {[
          { label: 'Users', value: chartData.points[chartData.points.length - 1]?.activeUsers || 0 },
          { label: 'Sessions', value: chartData.points[chartData.points.length - 1]?.sessions || 0 },
          { label: 'Adoption', value: `${chartData.points[chartData.points.length - 1]?.featureAdoption || 0}%` },
        ].map((stat, index) => (
          <div 
            key={stat.label}
            className="group/stat cursor-default transition-all duration-200"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(5px)',
              transitionDelay: `${1 + index * 0.1}s`,
            }}
          >
            <p className="text-base font-black text-black group-hover/stat:text-brand-500 transition-colors duration-200">
              {stat.value}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
