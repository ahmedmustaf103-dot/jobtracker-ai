"use client";

import { cn } from "@/lib/utils";

type ScoreRingProps = {
  score: number;
  size?: number;
  className?: string;
};

function strokeColor(score: number) {
  if (score >= 80) return "#34d399";
  if (score >= 60) return "#a78bfa";
  if (score >= 40) return "#fbbf24";
  return "#f87171";
}

export function ScoreRing({ score, size = 120, className }: ScoreRingProps) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Resume score: ${score} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor(score)}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
        <span className="text-3xl font-bold tabular-nums text-zinc-50">
          {score}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">
          Score
        </span>
      </div>
    </div>
  );
}
