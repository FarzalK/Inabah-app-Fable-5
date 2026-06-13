"use client";

import { useMemo, useState } from "react";
import type { SavedSession } from "@/types";
import { CATEGORIES, CAT_COLORS, HEART_RATINGS } from "@/lib/data";
import { HEART_SCORES } from "@/lib/scoring";

type ChartType = "line" | "bar" | "dot";

interface TooltipData {
  x: number; y: number; date: string; catName: string; rating: string;
}

export default function MuhasabahOverviewCard({ sessions }: { sessions: SavedSession[] }) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [chartType, setChartType] = useState<ChartType>("line");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (sessions.length === 0) {
    return (
      <div className="rounded-xl p-4 flex flex-col" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
        <Header chartType={chartType} dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} setChartType={setChartType} />
        <p className="text-[12px] leading-relaxed mt-3" style={{ color: "var(--text-tertiary)" }}>
          No sessions yet. Begin your first Muhāsabah.
        </p>
      </div>
    );
  }

  const last = sessions[0];
  const lastDate = new Date(last.date).toLocaleDateString("en-CA", { month: "short", day: "numeric" });

  // SVG layout constants — stable, no need to memoize
  const W = 260, H = 120;
  const PL = 52;
  const PR = 8;
  const PT = 8;
  const PB = 28;
  const chartW = W - PL - PR;
  const chartH = H - PT - PB;

  type Pt = { x: number; y: number; score: number; rating: string; date: string };

  const { catIds, catData, xLabelIndices, barGroupW, barW, chartSessions } = useMemo(() => {
    const ids = CATEGORIES.filter((c) =>
      sessions.some((s) => s.summary.categoryRatings[c.id] !== undefined)
    ).map((c) => c.id);

    const cs = sessions.slice(0, 12).reverse();
    const N = cs.length;

    function xPos(i: number) {
      if (N <= 1) return PL + chartW / 2;
      return PL + (i / (N - 1)) * chartW;
    }
    function yPos(v: number) {
      return PT + chartH - (v / 4) * chartH;
    }

    const data = ids.map((catId) => {
      const points: Pt[] = [];
      cs.forEach((session, i) => {
        const rating = session.summary.categoryRatings[catId];
        if (rating !== undefined) {
          points.push({
            x: xPos(i), y: yPos(HEART_SCORES[rating as keyof typeof HEART_SCORES] ?? 2),
            score: HEART_SCORES[rating as keyof typeof HEART_SCORES] ?? 2, rating,
            date: new Date(session.date).toLocaleDateString("en-CA", { month: "short", day: "numeric" }),
          });
        }
      });
      let pathD = "";
      points.forEach((p, i) => {
        if (i === 0) { pathD += `M ${p.x} ${p.y}`; return; }
        const prev = points[i - 1];
        const cpX = (prev.x + p.x) / 2;
        pathD += ` C ${cpX} ${prev.y} ${cpX} ${p.y} ${p.x} ${p.y}`;
      });
      return { catId, points, pathD };
    });

    const labelSet = new Set<number>();
    labelSet.add(0);
    if (N > 2) labelSet.add(Math.floor((N - 1) / 2));
    if (N > 1) labelSet.add(N - 1);

    const bgw = N > 1 ? (chartW / (N - 1)) * 0.7 : chartW * 0.5;
    const bw = Math.min(ids.length > 0 ? bgw / ids.length : 8, 12);

    return { catIds: ids, catData: data, xLabelIndices: labelSet, barGroupW: bgw, barW: bw, chartSessions: cs };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions]);

  const N = chartSessions.length;

  function xPos(i: number) {
    if (N <= 1) return PL + chartW / 2;
    return PL + (i / (N - 1)) * chartW;
  }
  function yPos(v: number) {
    return PT + chartH - (v / 4) * chartH;
  }

  function onDotEnter(e: React.MouseEvent<SVGCircleElement>, p: Pt, catId: string) {
    const rect = (e.target as SVGCircleElement).closest("svg")!.getBoundingClientRect();
    setTooltip({
      x: (p.x / W) * rect.width + rect.left,
      y: (p.y / H) * rect.height + rect.top,
      date: p.date,
      catName: CATEGORIES.find((c) => c.id === catId)?.name ?? catId,
      rating: p.rating,
    });
  }

  return (
    <div className="rounded-xl p-4 flex flex-col gap-3 h-full" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
      <Header chartType={chartType} dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} setChartType={(t) => { setChartType(t); setDropdownOpen(false); }} />

      {/* Last session */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] font-medium" style={{ color: "var(--text-secondary)" }}>Last session</p>
          <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{lastDate}</p>
        </div>
        <div className="space-y-1">
          {last.categories.map((catId) => {
            const rating = last.summary.categoryRatings[catId];
            const cat = CATEGORIES.find((c) => c.id === catId);
            const color = CAT_COLORS[catId] ?? "var(--accent)";
            if (!rating || !cat) return null;
            return (
              <div key={catId} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{cat.name}</span>
                </div>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                  style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}>
                  {rating}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--border)" }} />

      {/* Chart */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-medium" style={{ color: "var(--text-secondary)" }}>Progress over time</p>
          <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{Math.min(sessions.length, 12)} sessions</p>
        </div>

        <div className="relative" style={{ userSelect: "none" }} onMouseLeave={() => setTooltip(null)}>
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>

            {/* Y-axis label + gridlines */}
            {HEART_RATINGS.map((label, li) => {
              const y = yPos(li);
              return (
                <g key={label}>
                  {/* Horizontal gridline */}
                  <line x1={PL} y1={y} x2={W - PR} y2={y}
                    stroke="var(--border-mid)" strokeWidth={li === 0 ? 1 : 0.5}
                    strokeDasharray={li === 0 ? "none" : "3 3"} />
                  {/* Y label — right-aligned to left of chart area */}
                  <text x={PL - 4} y={y + 3.5} fontSize="8" textAnchor="end" fill="var(--text-tertiary)">{label}</text>
                </g>
              );
            })}

            {/* Vertical gridlines at each session */}
            {chartSessions.map((_, i) => (
              <line key={i} x1={xPos(i)} y1={PT} x2={xPos(i)} y2={PT + chartH}
                stroke="var(--border)" strokeWidth="0.4" strokeDasharray="2 3" />
            ))}

            {/* X-axis baseline */}
            <line x1={PL} y1={PT + chartH} x2={W - PR} y2={PT + chartH} stroke="var(--border-mid)" strokeWidth="1" />

            {/* X date labels */}
            {chartSessions.map((session, i) => {
              if (!xLabelIndices.has(i)) return null;
              return (
                <g key={i}>
                  <line x1={xPos(i)} y1={PT + chartH} x2={xPos(i)} y2={PT + chartH + 3} stroke="var(--border-mid)" strokeWidth="1" />
                  <text x={xPos(i)} y={PT + chartH + 13} fontSize="8" textAnchor="middle" fill="var(--text-tertiary)">
                    {new Date(session.date).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
                  </text>
                </g>
              );
            })}

            {/* ── Chart type rendering ── */}

            {chartType === "line" && catData.map(({ catId, pathD, points }) => {
              const color = CAT_COLORS[catId] ?? "var(--accent)";
              return (
                <g key={catId}>
                  {points.length > 1 && (
                    <path d={pathD} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
                  )}
                  {points.map((p, pi) => {
                    const isLatest = pi === points.length - 1;
                    return (
                      <circle key={pi} cx={p.x} cy={p.y} r={isLatest ? 4 : 2.5}
                        fill={isLatest ? color : "var(--surface-card)"}
                        stroke={color} strokeWidth={isLatest ? 0 : 1.5}
                        style={{ cursor: "pointer" }}
                        onMouseEnter={(e) => onDotEnter(e, p, catId)}
                      />
                    );
                  })}
                </g>
              );
            })}

            {chartType === "bar" && chartSessions.map((session, i) => {
              const groupX = xPos(i);
              const totalGroupW = barW * catIds.length;
              // Clamp group so it never overflows the chart area on either side
              const groupStart = Math.max(PL, Math.min(groupX - totalGroupW / 2, W - PR - totalGroupW));
              return (
                <g key={i}>
                  {catIds.map((catId, ci) => {
                    const rating = session.summary.categoryRatings[catId];
                    if (!rating) return null;
                    const score = HEART_SCORES[rating as keyof typeof HEART_SCORES] ?? 0;
                    const color = CAT_COLORS[catId] ?? "var(--accent)";
                    const barH = (score / 4) * chartH;
                    const bx = groupStart + ci * barW;
                    const by = yPos(score);
                    const p: Pt = {
                      x: bx + barW / 2, y: by, score, rating,
                      date: new Date(session.date).toLocaleDateString("en-CA", { month: "short", day: "numeric" }),
                    };
                    return (
                      <rect key={catId} x={bx + 0.5} y={by} width={Math.max(barW - 1, 1)} height={barH}
                        fill={color} opacity="0.8" rx="1.5" style={{ cursor: "pointer" }}
                        onMouseEnter={(e) => {
                          const rect2 = (e.target as SVGRectElement).closest("svg")!.getBoundingClientRect();
                          setTooltip({ x: (p.x / W) * rect2.width + rect2.left, y: (p.y / H) * rect2.height + rect2.top, date: p.date, catName: CATEGORIES.find((c) => c.id === catId)?.name ?? catId, rating });
                        }}
                      />
                    );
                  })}
                </g>
              );
            })}

            {chartType === "dot" && catData.map(({ catId, points }) => {
              const color = CAT_COLORS[catId] ?? "var(--accent)";
              return (
                <g key={catId}>
                  {points.map((p, pi) => (
                    <circle key={pi} cx={p.x} cy={p.y} r={4.5}
                      fill={color} opacity="0.75" style={{ cursor: "pointer" }}
                      onMouseEnter={(e) => onDotEnter(e, p, catId)}
                    />
                  ))}
                </g>
              );
            })}
          </svg>

          {tooltip && (
            <div className="fixed z-50 px-2 py-1.5 rounded-lg text-[10px] pointer-events-none shadow-md"
              style={{
                left: tooltip.x, top: tooltip.y - 40,
                background: "var(--surface-card)",
                border: "1px solid var(--border-mid)",
                color: "var(--text-primary)",
                transform: "translateX(-50%)",
                whiteSpace: "nowrap",
              }}>
              <p className="font-medium">{tooltip.catName}</p>
              <p style={{ color: "var(--text-tertiary)" }}>{tooltip.date} · {tooltip.rating}</p>
            </div>
          )}
        </div>

        {/* Legend — single line, scrollable if needed */}
        <div className="flex items-center gap-x-3 mt-1.5 overflow-hidden" style={{ flexWrap: "nowrap" }}>
          {catIds.map((catId) => {
            const cat = CATEGORIES.find((c) => c.id === catId);
            return (
              <div key={catId} className="flex items-center gap-1 flex-shrink-0">
                <div className="w-3 h-[2px] rounded" style={{ background: CAT_COLORS[catId] ?? "var(--accent)" }} />
                <span className="text-[9px] whitespace-nowrap" style={{ color: "var(--text-tertiary)" }}>{cat?.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Header with dropdown ──────────────────────────────────────────────────────

const CHART_OPTIONS: { type: ChartType; label: string; icon: string }[] = [
  { type: "line", label: "Line",  icon: "〜" },
  { type: "bar",  label: "Bar",   icon: "▮" },
  { type: "dot",  label: "Dot",   icon: "●" },
];

function Header({
  chartType, dropdownOpen, setDropdownOpen, setChartType,
}: {
  chartType: ChartType;
  dropdownOpen: boolean;
  setDropdownOpen: (v: boolean) => void;
  setChartType: (t: ChartType) => void;
}) {
  const current = CHART_OPTIONS.find((o) => o.type === chartType)!;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
        <p className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--accent)" }}>
          Muhāsabah
        </p>
      </div>

      {/* Chart type dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] transition-opacity hover:opacity-70"
          style={{
            background: "var(--surface-card-alt)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          <span>{current.icon}</span>
          <span>{current.label}</span>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" style={{ opacity: 0.5 }}>
            <path d="M1 2.5L4 5.5L7 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </button>

        {dropdownOpen && (
          <div
            className="absolute right-0 top-full mt-1 rounded-lg overflow-hidden z-40 shadow-md"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-mid)", minWidth: "90px" }}
          >
            {CHART_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => setChartType(opt.type)}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-left transition-opacity hover:opacity-70"
                style={{
                  color: chartType === opt.type ? "var(--accent)" : "var(--text-secondary)",
                  background: chartType === opt.type ? "var(--accent-light)" : "transparent",
                  fontWeight: chartType === opt.type ? 600 : 400,
                }}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
