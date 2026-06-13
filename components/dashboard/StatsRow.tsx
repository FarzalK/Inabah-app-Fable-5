"use client";
import type { SpiritualScore } from "@/lib/scoring";

export default function StatsRow({ score }: { score: SpiritualScore }) {
  const stats = [
    { label: "Day streak", value: score.streak === 0 ? "—" : `${score.streak}`, sub: score.streak >= 7 ? "masha'Allah" : score.streak > 0 ? "keep going" : "start today" },
    { label: "Total sessions", value: `${score.totalSessions}`, sub: "completed" },
    { label: "Last 30 days", value: `${score.consistencyScore}%`, sub: "consistency" },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl p-4 text-center"
          style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
          <p className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
          <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: "var(--text-tertiary)" }}>{stat.label}</p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{stat.sub}</p>
        </div>
      ))}
    </div>
  );
}
