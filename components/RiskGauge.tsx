"use client";

import { useEffect, useState } from "react";

type Props = {
  yuzde: number;
  renk: string;
  seviye: string;
};

export default function RiskGauge({ yuzde, renk, seviye }: Props) {
  const [animatedYuzde, setAnimatedYuzde] = useState(0);
  const [displayYuzde, setDisplayYuzde] = useState(0);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedYuzde / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedYuzde(yuzde);
    }, 300);

    let start = 0;
    const step = yuzde / 60;
    const counter = setInterval(() => {
      start += step;
      if (start >= yuzde) {
        setDisplayYuzde(yuzde);
        clearInterval(counter);
      } else {
        setDisplayYuzde(Math.floor(start));
      }
    }, 25);

    return () => {
      clearTimeout(timer);
      clearInterval(counter);
    };
  }, [yuzde]);

  const getGradientId = () => `gauge-gradient-${yuzde}`;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 220, height: 220 }}>
        <svg width={220} height={220} style={{ transform: "rotate(-90deg)" }}>
          <defs>
            <linearGradient id={getGradientId()} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={renk} stopOpacity="0.6" />
              <stop offset="100%" stopColor={renk} stopOpacity="1" />
            </linearGradient>
          </defs>

          <circle
            cx={110}
            cy={110}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={18}
          />

          <circle
            cx={110}
            cy={110}
            r={radius}
            fill="none"
            stroke={`url(#${getGradientId()})`}
            strokeWidth={18}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="gauge-ring"
            style={{
              filter: `drop-shadow(0 0 12px ${renk}80)`,
            }}
          />
        </svg>

        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ transform: "rotate(0deg)" }}
        >
          <span
            className="text-5xl font-bold tabular-nums"
            style={{ color: renk, textShadow: `0 0 20px ${renk}60` }}
          >
            {displayYuzde}
          </span>
          <span className="text-slate-400 text-sm font-medium mt-1">% Risk</span>
        </div>
      </div>

      <div
        className="mt-4 px-6 py-2 rounded-full text-sm font-semibold"
        style={{
          background: `${renk}20`,
          border: `1px solid ${renk}40`,
          color: renk,
        }}
      >
        {seviye} Risk
      </div>
    </div>
  );
}
