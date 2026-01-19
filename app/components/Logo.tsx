'use client';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = '', size = 120 }: LogoProps) {
  // Generate unique ID for gradient to avoid conflicts if multiple logos on page
  const gradientId = 'sunGradient';

  return (
    <svg
      viewBox="0 0 120 45"
      width={size}
      height={size * (45 / 120)}
      className={className}
      aria-label="6 to 6 logo"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
      </defs>

      <text
        x="60"
        y="35"
        textAnchor="middle"
        style={{
          fontSize: '36px',
          fontWeight: 700,
          fontFamily: 'system-ui, sans-serif'
        }}
        fill={`url(#${gradientId})`}
      >
        6 to 6
      </text>
    </svg>
  );
}
