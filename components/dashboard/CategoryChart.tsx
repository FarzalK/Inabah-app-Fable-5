"use client";

import { CATEGORIES, HEART_RATINGS } from "@/lib/data";

interface CategoryChartProps {
  categoryAverages: Record<string, number>;
  compact?: boolean;
}

export default function CategoryChart({ categoryAverages, compact = false }: CategoryChartProps) {
  const cats = CATEGORIES.filter((c) => categoryAverages[c.id] !== undefined);

  if (cats.length === 0) return null;

  const barColor = (avg: number) =>
    avg < 1 ? "#C0392B" : avg < 2 ? "#D4853A" : avg < 3 ? "#5C7A5C" : "#3D5C3D";

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-1.5 mb-3">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
        <p className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--accent)" }}>
          Category averages
        </p>
        <span className="text-[10px] ml-auto" style={{ color: "var(--text-tertiary)" }}>last 20 sessions</span>
      </div>
      <div className={`space-y-${compact ? "2" : "3"}`}>
        {cats.map((cat) => {
          const avg = categoryAverages[cat.id] ?? 0;
          const pct = (avg / 4) * 100;
          const label = HEART_RATINGS[Math.round(avg)] ?? "Striving";
          const color = barColor(avg);
          return (
            <div key={cat.id}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>{cat.name}</span>
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{ color, background: `color-mix(in srgb, ${color} 15%, transparent)` }}
                >
                  {label}
                </span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: "var(--surface-card-alt)" }}>
                <div className="h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: color }}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
