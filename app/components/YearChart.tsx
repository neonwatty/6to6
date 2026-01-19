'use client';

import { useMemo } from 'react';
import { calculateYearData, getDayOfYear, type YearDataPoint } from '../lib/temporal';

interface YearChartProps {
  latitude: number;
  longitude: number;
  currentDate?: Date;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_STARTS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

export default function YearChart({ latitude, longitude, currentDate = new Date() }: YearChartProps) {
  const yearData = useMemo(() => {
    return calculateYearData(latitude, longitude, currentDate.getFullYear());
  }, [latitude, longitude, currentDate]);

  const currentDayOfYear = getDayOfYear(currentDate);

  // Chart dimensions
  const width = 320;
  const height = 180;
  const padding = { top: 20, right: 15, bottom: 30, left: 35 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find min/max for scaling
  const allMinutes = yearData.flatMap(d => [d.dayHourMinutes, d.nightHourMinutes]);
  const minMinutes = Math.min(...allMinutes);
  const maxMinutes = Math.max(...allMinutes);
  const range = maxMinutes - minMinutes;

  // Scale functions
  const xScale = (dayOfYear: number) => (dayOfYear / 365) * chartWidth;
  const yScale = (minutes: number) => chartHeight - ((minutes - minMinutes) / range) * chartHeight;

  // Generate path data
  const dayPath = yearData
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.dayOfYear)} ${yScale(d.dayHourMinutes)}`)
    .join(' ');

  const nightPath = yearData
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.dayOfYear)} ${yScale(d.nightHourMinutes)}`)
    .join(' ');

  // 60-minute reference line
  const sixtyY = yScale(60);

  // Current day marker
  const currentX = xScale(currentDayOfYear);
  const currentDayData = yearData[currentDayOfYear] || yearData[0];

  return (
    <div className="w-full px-2 sm:px-0 sm:max-w-sm">
      <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2 text-center">
        Hour Length Throughout the Year
      </h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Background */}
        <rect x={padding.left} y={padding.top} width={chartWidth} height={chartHeight} fill="currentColor" className="text-amber-100/50 dark:text-slate-700/50" />

        {/* 60-minute reference line */}
        <line
          x1={padding.left}
          y1={padding.top + sixtyY}
          x2={padding.left + chartWidth}
          y2={padding.top + sixtyY}
          stroke="currentColor"
          strokeDasharray="4 4"
          className="text-amber-400/50 dark:text-amber-500/50"
        />
        <text
          x={padding.left - 4}
          y={padding.top + sixtyY}
          textAnchor="end"
          alignmentBaseline="middle"
          className="text-[10px] fill-amber-600 dark:fill-amber-400"
        >
          60m
        </text>

        {/* Y-axis labels */}
        <text
          x={padding.left - 4}
          y={padding.top}
          textAnchor="end"
          alignmentBaseline="hanging"
          className="text-[10px] fill-amber-600 dark:fill-amber-400"
        >
          {Math.round(maxMinutes)}m
        </text>
        <text
          x={padding.left - 4}
          y={padding.top + chartHeight}
          textAnchor="end"
          alignmentBaseline="baseline"
          className="text-[10px] fill-amber-600 dark:fill-amber-400"
        >
          {Math.round(minMinutes)}m
        </text>

        {/* Month labels */}
        {MONTHS.map((month, i) => (
          <text
            key={month}
            x={padding.left + xScale(MONTH_STARTS[i]) + (xScale(30) / 2)}
            y={height - 8}
            textAnchor="middle"
            className="text-[9px] fill-amber-600 dark:fill-amber-400"
          >
            {month}
          </text>
        ))}

        {/* Chart area group */}
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* Night hours line */}
          <path
            d={nightPath}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-indigo-400 dark:text-indigo-500"
          />

          {/* Day hours line */}
          <path
            d={dayPath}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-amber-500 dark:text-amber-400"
          />

          {/* Current day marker */}
          <line
            x1={currentX}
            y1={0}
            x2={currentX}
            y2={chartHeight}
            stroke="currentColor"
            strokeWidth="2"
            className="text-amber-700 dark:text-amber-300"
          />
          <circle
            cx={currentX}
            cy={yScale(currentDayData.dayHourMinutes)}
            r="4"
            fill="currentColor"
            className="text-amber-600 dark:text-amber-400"
          />
          <circle
            cx={currentX}
            cy={yScale(currentDayData.nightHourMinutes)}
            r="4"
            fill="currentColor"
            className="text-indigo-500 dark:text-indigo-400"
          />
        </g>
      </svg>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-amber-500 dark:bg-amber-400" />
          <span className="text-amber-700 dark:text-amber-300">Day hours</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-indigo-400 dark:bg-indigo-500" />
          <span className="text-amber-700 dark:text-amber-300">Night hours</span>
        </div>
      </div>
    </div>
  );
}
