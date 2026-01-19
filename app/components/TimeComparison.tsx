'use client';

interface TimeComparisonProps {
  sunriseHour: number; // e.g., 6.5 for 6:30 AM
  sunsetHour: number;  // e.g., 17.5 for 5:30 PM
  dayHourMinutes: number; // e.g., 49.5 for winter, 70 for summer
}

export default function TimeComparison({ sunriseHour, sunsetHour, dayHourMinutes }: TimeComparisonProps) {
  // Visualization dimensions
  const width = 280;
  const height = 60;
  const padding = 10;
  const barHeight = 16;
  const barY = 25;

  // Convert hour to x position (showing 4am to 10pm range)
  const hourToX = (hour: number) => {
    const startHour = 4;
    const endHour = 22;
    return padding + ((hour - startHour) / (endHour - startHour)) * (width - 2 * padding);
  };

  // For Roman time, sunrise is always at "6" and sunset at "18"
  // But we position the markers based on where they fall in modern time
  const romanSunriseX = hourToX(sunriseHour);
  const romanSunsetX = hourToX(sunsetHour);

  // Convert Roman hour to modern hour position
  // Roman 6:00 = sunriseHour, each subsequent hour adds dayHourMinutes/60
  const romanHourToModernHour = (romanHour: number) => {
    const hoursAfterSunrise = romanHour - 6;
    return sunriseHour + (hoursAfterSunrise * dayHourMinutes / 60);
  };

  // For modern time, sunrise/sunset are at actual times
  const modernSunriseX = hourToX(sunriseHour);
  const modernSunsetX = hourToX(sunsetHour);

  return (
    <div className="w-full sm:max-w-sm bg-amber-50/50 dark:bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-amber-200 dark:border-slate-700">
      {/* Header */}
      <p className="text-sm font-medium text-amber-800 dark:text-amber-200 text-center mb-4">
        How Roman hours would work where you live
      </p>

      {/* Comparison visualizations */}
      <div className="space-y-4">
        {/* Roman Time */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-amber-700 dark:text-amber-300">☀️ Roman Time</span>
            <span className="text-xs text-amber-500 dark:text-amber-500">sunrise & sunset fixed</span>
          </div>
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            {/* Timeline bar */}
            <rect
              x={padding}
              y={barY}
              width={width - 2 * padding}
              height={barHeight}
              rx={barHeight / 2}
              className="fill-slate-200 dark:fill-slate-600"
            />

            {/* Daylight portion - always 6 to 18 */}
            <rect
              x={romanSunriseX}
              y={barY}
              width={romanSunsetX - romanSunriseX}
              height={barHeight}
              className="fill-amber-300 dark:fill-amber-500"
            />

            {/* Hour markers - positioned based on actual stretched/compressed Roman hours */}
            {[6, 9, 12, 15, 18].map((romanHour) => {
              const modernHour = romanHourToModernHour(romanHour);
              return (
                <g key={romanHour}>
                  <line
                    x1={hourToX(modernHour)}
                    y1={barY - 4}
                    x2={hourToX(modernHour)}
                    y2={barY + barHeight + 4}
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-amber-700 dark:text-amber-400"
                  />
                  <text
                    x={hourToX(modernHour)}
                    y={barY + barHeight + 14}
                    textAnchor="middle"
                    className="text-[9px] fill-amber-600 dark:fill-amber-400 font-medium"
                  >
                    {romanHour}:00
                  </text>
                </g>
              );
            })}

            {/* Sunrise/sunset labels */}
            <text
              x={romanSunriseX}
              y={barY - 8}
              textAnchor="middle"
              className="text-[8px] fill-amber-600 dark:fill-amber-400"
            >
              sunrise
            </text>
            <text
              x={romanSunsetX}
              y={barY - 8}
              textAnchor="middle"
              className="text-[8px] fill-amber-600 dark:fill-amber-400"
            >
              sunset
            </text>
          </svg>
        </div>

        {/* Modern Time */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-amber-700 dark:text-amber-300">🕐 Modern Time</span>
            <span className="text-xs text-amber-500 dark:text-amber-500">hours fixed, sun wanders</span>
          </div>
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            {/* Timeline bar */}
            <rect
              x={padding}
              y={barY}
              width={width - 2 * padding}
              height={barHeight}
              rx={barHeight / 2}
              className="fill-slate-200 dark:fill-slate-600"
            />

            {/* Daylight portion - at actual times */}
            <rect
              x={modernSunriseX}
              y={barY}
              width={modernSunsetX - modernSunriseX}
              height={barHeight}
              className="fill-amber-300 dark:fill-amber-500"
            />

            {/* Hour markers - evenly spaced */}
            {[6, 9, 12, 15, 18].map((hour) => (
              <g key={hour}>
                <line
                  x1={hourToX(hour)}
                  y1={barY - 4}
                  x2={hourToX(hour)}
                  y2={barY + barHeight + 4}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-slate-400 dark:text-slate-500"
                />
                <text
                  x={hourToX(hour)}
                  y={barY + barHeight + 14}
                  textAnchor="middle"
                  className="text-[9px] fill-slate-500 dark:fill-slate-400 font-medium"
                >
                  {hour}:00
                </text>
              </g>
            ))}

            {/* Sunrise marker */}
            <line
              x1={modernSunriseX}
              y1={barY - 6}
              x2={modernSunriseX}
              y2={barY + barHeight + 6}
              stroke="currentColor"
              strokeWidth="2"
              className="text-orange-500"
            />
            <text
              x={modernSunriseX}
              y={barY - 8}
              textAnchor="middle"
              className="text-[8px] fill-orange-600 dark:fill-orange-400 font-medium"
            >
              {Math.floor(sunriseHour)}:{String(Math.round((sunriseHour % 1) * 60)).padStart(2, '0')}
            </text>

            {/* Sunset marker */}
            <line
              x1={modernSunsetX}
              y1={barY - 6}
              x2={modernSunsetX}
              y2={barY + barHeight + 6}
              stroke="currentColor"
              strokeWidth="2"
              className="text-orange-500"
            />
            <text
              x={modernSunsetX}
              y={barY - 8}
              textAnchor="middle"
              className="text-[8px] fill-orange-600 dark:fill-orange-400 font-medium"
            >
              {Math.floor(sunsetHour)}:{String(Math.round((sunsetHour % 1) * 60)).padStart(2, '0')}
            </text>
          </svg>
        </div>
      </div>

      <p className="text-xs text-amber-600/70 dark:text-amber-400/70 text-center mt-3">
        Same sun. Different clocks.
      </p>
    </div>
  );
}
