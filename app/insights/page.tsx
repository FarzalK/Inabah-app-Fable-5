"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SavedSession, NafsStation } from "@/types";
import { getSessions } from "@/lib/storage";
import { getMuraqabahSessions, type MuraqabahSession } from "@/lib/muraqabah-storage";
import { computeSpiritualScore, getNafsDescription, getNafsGateMessage } from "@/lib/scoring";
import { ASMA_AL_HUSNA } from "@/lib/asma";
import { STATION_COLORS } from "@/lib/data";
import AISummaryCard from "@/components/dashboard/AISummaryCard";
import MuhasabahOverviewCard from "@/components/dashboard/MuhasabahOverviewCard";
import ErrorBoundary from "@/components/ErrorBoundary";

const HEART_STATE_COLORS: Record<string, string> = {
  Present: "var(--accent)", Peaceful: "#2E86AB",
  Tearful: "#5B8DB8", Distracted: "var(--sand)",
  Restless: "var(--terracotta)", Numb: "var(--text-tertiary)",
};
void HEART_STATE_COLORS; // referenced by future Muraqabah chart work

const NAFS_TOOLTIPS: Record<string, string> = {
  "Ammārah": "Al-Nafs al-Ammārah: the soul that commands toward evil, dominated by desires and heedlessness.",
  "Lawwāmah": "Al-Nafs al-Lawwāmah: the self-reproaching soul — aware of its wrongs and striving against them.",
  "Mulhamah": "Al-Nafs al-Mulhamah: the inspired soul, oriented toward goodness and guided by inner light.",
  "Mutma'innah": "Al-Nafs al-Mutma'innah: the tranquil soul, at rest in the remembrance and pleasure of Allah.",
};

export default function InsightsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [muraqabahSessions, setMuraqabahSessions] = useState<MuraqabahSession[]>([]);
  const [mounted, setMounted] = useState(false);
  const [stationTooltipOpen, setStationTooltipOpen] = useState(false);

  useEffect(() => {
    async function load() {
      setSessions(await getSessions());
      setMuraqabahSessions(await getMuraqabahSessions());
      setMounted(true);
    }
    load();
  }, []);

  const score = useMemo(() => computeSpiritualScore(sessions), [sessions]);

  const mStreak = useMemo(() => {
    let s = 0;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    for (let i = 0; i < muraqabahSessions.length; i++) {
      const d = new Date(muraqabahSessions[i].date); d.setHours(0, 0, 0, 0);
      const exp = new Date(today); exp.setDate(today.getDate() - i);
      if (d.getTime() === exp.getTime()) s++; else break;
    }
    return s;
  }, [muraqabahSessions]);

  const totalMuraqabahMins = useMemo(
    () => muraqabahSessions.reduce((a, s) => a + s.durationMinutes, 0),
    [muraqabahSessions]
  );

  if (!mounted) {
    return (
      <main className="min-h-screen py-5" style={{ background: "var(--surface-bg)" }}>
        <div className="app-container space-y-3">
          {/* Page header skeleton */}
          <div className="mb-2">
            <div className="h-3 w-16 rounded animate-pulse mb-2" style={{ background: "var(--surface-card-alt)" }} />
            <div className="h-7 w-32 rounded animate-pulse" style={{ background: "var(--surface-card-alt)" }} />
          </div>
          {/* Station card skeleton */}
          <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
            <div className="flex justify-between items-start">
              <div className="space-y-1.5">
                <div className="h-2.5 w-20 rounded animate-pulse" style={{ background: "var(--surface-card-alt)" }} />
                <div className="h-6 w-28 rounded animate-pulse" style={{ background: "var(--surface-card-alt)" }} />
              </div>
              <div className="flex gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-1 text-right">
                    <div className="h-6 w-10 rounded animate-pulse" style={{ background: "var(--surface-card-alt)" }} />
                    <div className="h-2 w-10 rounded animate-pulse" style={{ background: "var(--surface-card-alt)" }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="h-1.5 rounded-full animate-pulse" style={{ background: "var(--surface-card-alt)" }} />
            <div className="h-3 w-full rounded animate-pulse" style={{ background: "var(--surface-card-alt)" }} />
          </div>
          {/* Two-col skeleton */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-4 h-40 animate-pulse" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }} />
            <div className="rounded-xl p-4 h-40 animate-pulse" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }} />
          </div>
        </div>
      </main>
    );
  }

  const hasMuraqabah = muraqabahSessions.length > 0;
  const stationColor = STATION_COLORS[score.nafsStation] ?? "var(--accent)";
  const gateMsg = getNafsGateMessage(score);
  const trendIcon = score.trend === "improving" ? "↑" : score.trend === "declining" ? "↓" : "→";
  const trendColor = score.trend === "improving" ? "var(--accent)" : score.trend === "declining" ? "#C0392B" : "var(--text-tertiary)";

  // Empty state — fewer than 3 sessions means scores are not yet meaningful
  if (sessions.length < 3) {
    return (
      <main className="min-h-screen py-5" style={{ background: "var(--surface-bg)" }}>
        <div className="app-container">
          {/* Page header */}
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--text-tertiary)" }}>Your practice</p>
            <h1 className="text-2xl font-medium" style={{ color: "var(--text-primary)" }}>Insights</h1>
          </div>

          <div className="rounded-2xl p-8 text-center" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "var(--accent-light)" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Complete {3 - sessions.length} more session{3 - sessions.length === 1 ? "" : "s"} to unlock insights
            </h2>
            <p className="text-[13px] leading-relaxed max-w-[300px] mx-auto mb-6" style={{ color: "var(--text-secondary)" }}>
              Inābah builds a picture of your spiritual state over time. After three Muhāsabah sessions
              your nafs station, trends, and patterns will appear here.
            </p>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all"
                  style={{
                    width: i < sessions.length ? 24 : 8,
                    height: 8,
                    background: i < sessions.length ? "var(--accent)" : "var(--surface-card-alt)",
                    border: `1px solid ${i < sessions.length ? "var(--accent)" : "var(--border-mid)"}`,
                  }}
                />
              ))}
            </div>

            <a
              href="/session"
              className="inline-block px-6 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
              style={{ background: "var(--accent)", color: "var(--surface-bg)" }}
            >
              Begin a Muhāsabah session
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-5" style={{ background: "var(--surface-bg)" }}>
      <div className="app-container space-y-3">

        {/* ── Page header ── */}
        <div className="mb-1">
          <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--text-tertiary)" }}>Your practice</p>
          <h1 className="text-2xl font-medium" style={{ color: "var(--text-primary)" }}>Insights</h1>
        </div>

        {/* ── Row 1: Nafs station card ── */}
        <div className="rounded-xl p-4" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--text-tertiary)" }}>Nafs station</p>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xl font-semibold" style={{ color: stationColor }}>{score.nafsStation}</p>
                <span className="text-[12px]" style={{ color: trendColor }}>{trendIcon} {score.trend}</span>
                <button
                  onClick={() => setStationTooltipOpen((o) => !o)}
                  aria-expanded={stationTooltipOpen}
                  aria-label="About this station"
                  className="w-5 h-5 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
                  style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border-mid)" }}
                >
                  <span className="text-[10px] font-bold leading-none" style={{ color: "var(--text-tertiary)" }}>?</span>
                </button>
              </div>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{score.nafsProgress}% through this station</p>

              {stationTooltipOpen && (
                <div
                  className="mt-2 px-3 py-2.5 rounded-lg text-[12px] leading-relaxed"
                  style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                >
                  {NAFS_TOOLTIPS[score.nafsStation] ?? getNafsDescription(score.nafsStation)}
                </div>
              )}
            </div>
            <div className="flex gap-4 text-right">
              <div>
                <p className="text-lg font-semibold" style={{ color: "var(--accent)" }}>
                  {score.streak > 0 ? `${score.streak}d` : "—"}
                </p>
                <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Streak</p>
              </div>
              <div>
                <p className="text-lg font-semibold" style={{ color: "var(--terracotta)" }}>{score.totalSessions}</p>
                <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Sessions</p>
              </div>
              <div>
                <p className="text-lg font-semibold" style={{ color: "var(--sand)" }}>{score.consistencyScore}%</p>
                <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>30d</p>
              </div>
            </div>
          </div>

          <div className="h-1.5 rounded-full mb-2" style={{ background: "var(--surface-card-alt)" }}>
            <div className="h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${score.nafsProgress}%`, background: stationColor }} />
          </div>

          <div className="flex items-center justify-between">
            {(["Ammārah", "Lawwāmah", "Mulhamah", "Mutma'innah"] as const).map((station) => {
              const isActive = score.nafsStation === station;
              const isPast = ["Ammārah", "Lawwāmah", "Mulhamah", "Mutma'innah"].indexOf(station) <
                             ["Ammārah", "Lawwāmah", "Mulhamah", "Mutma'innah"].indexOf(score.nafsStation);
              return (
                <div key={station} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{
                    background: STATION_COLORS[station],
                    opacity: isActive || isPast ? 1 : 0.2,
                    transform: isActive ? "scale(1.4)" : "scale(1)",
                    transition: "all 0.2s",
                  }} />
                  <span className="text-[10px]" style={{ color: isActive ? stationColor : "var(--text-tertiary)", fontWeight: isActive ? 600 : 400 }}>
                    {station === "Mutma'innah" ? "Mutma'innah" : station.replace("ā", "a")}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] leading-relaxed mt-2" style={{ color: "var(--text-tertiary)" }}>
            {getNafsDescription(score.nafsStation)}
          </p>

          {gateMsg && (
            <div className="mt-2 px-3 py-2 rounded-lg text-[11px] leading-relaxed"
              style={{ background: "color-mix(in srgb, var(--sand) 15%, transparent)", color: "var(--terracotta)" }}>
              {gateMsg}
            </div>
          )}
        </div>

        {/* ── Row 2: Muhasabah overview + Muraqabah summary ── */}
        <div className="grid grid-cols-2 gap-3 items-stretch">
          <MuhasabahOverviewCard sessions={sessions} />

          <div className="rounded-xl p-4 flex flex-col" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--terracotta)" }} />
              <p className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--terracotta)" }}>Murāqabah</p>
            </div>

            {hasMuraqabah ? (() => {
              const lastSession = muraqabahSessions[0];
              const nameEntry = ASMA_AL_HUSNA.find((a) => a.number === lastSession.nameNumber);
              const sessionDate = new Date(lastSession.date).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
              return (
                <div className="flex flex-col flex-1 justify-between gap-2 mt-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{sessionDate} · {lastSession.durationMinutes} min</p>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                      style={{ background: "color-mix(in srgb, var(--terracotta) 12%, transparent)", color: "var(--terracotta)" }}>
                      {lastSession.heartState}
                    </span>
                  </div>

                  {nameEntry && (
                    <div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span lang="ar" className="arabic text-2xl" style={{ color: "var(--terracotta)" }}>{nameEntry.arabic}</span>
                        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{nameEntry.transliteration}</span>
                      </div>
                      <p className="text-[11px] font-medium mb-1" style={{ color: "var(--text-secondary)" }}>{nameEntry.meaning}</p>
                      <p className="text-[10px] leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                        {nameEntry.scholarlyNote.split(".")[0]}.
                      </p>
                    </div>
                  )}

                  {lastSession.note && (
                    <div className="rounded-lg px-3 py-2" style={{ background: "var(--surface-card-alt)", borderLeft: "2px solid var(--terracotta)" }}>
                      <p className="text-[10px] mb-0.5" style={{ color: "var(--text-tertiary)" }}>Your note</p>
                      <p className="text-[11px] italic leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        &ldquo;{lastSession.note.length > 90 ? lastSession.note.slice(0, 90) + "…" : lastSession.note}&rdquo;
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{totalMuraqabahMins}</p>
                      <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>mins total</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{mStreak > 0 ? `${mStreak}d` : "—"}</p>
                      <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>streak</p>
                    </div>
                  </div>
                </div>
              );
            })() : (
              <p className="text-[12px] leading-relaxed mt-3" style={{ color: "var(--text-tertiary)" }}>
                No sessions yet. Begin your first Murāqabah.
              </p>
            )}
          </div>
        </div>

        {/* ── Row 3: AI Reflection ── */}
        <ErrorBoundary silent>
          <AISummaryCard score={score} sessions={sessions} />
        </ErrorBoundary>

        {/* ── Dev simulation — stripped from production build ── */}
        {process.env.NODE_ENV === "development" && (
          <SimulateDropdown
            onSimulateMuhasabah={(station) => router.push(`/session?simulate=1&station=${encodeURIComponent(station)}`)}
            onSimulateMuraqabah={() => router.push("/muraqabah?simulate=1")}
          />
        )}
        <div className="pb-2" />
      </div>
    </main>
  );
}

// ── Simulate dropdown (dev only) ──────────────────────────────────────────────

const STATIONS: { station: NafsStation; color: string; desc: string }[] = [
  { station: "Ammārah",     color: "#C0392B", desc: "Commanding — dominated by desires" },
  { station: "Lawwāmah",    color: "#D4853A", desc: "Self-reproaching — conscience alive" },
  { station: "Mulhamah",    color: "#5B8DB8", desc: "Inspired — guided and orienting" },
  { station: "Mutma'innah", color: "#5C7A5C", desc: "At rest — tranquil in Allah's remembrance" },
];

function SimulateDropdown({
  onSimulateMuhasabah,
  onSimulateMuraqabah,
}: {
  onSimulateMuhasabah: (station: NafsStation) => void;
  onSimulateMuraqabah: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex-1 py-2 rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5 transition-opacity hover:opacity-70"
          style={{ background: "var(--surface-card-alt)", color: "var(--text-tertiary)", border: "1px dashed var(--border-mid)" }}
        >
          <span>⚡</span>
          Simulate Muhāsabah
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.5 }}>
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </button>
        <button
          onClick={onSimulateMuraqabah}
          className="flex-1 py-2 rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5 transition-opacity hover:opacity-70"
          style={{ background: "var(--surface-card-alt)", color: "var(--text-tertiary)", border: "1px dashed var(--border-mid)" }}
        >
          <span>⚡</span>
          Simulate Murāqabah
        </button>
      </div>

      {open && (
        <div
          className="absolute left-0 bottom-full mb-2 rounded-xl overflow-hidden shadow-lg z-50"
          style={{ background: "var(--surface-card)", border: "1px solid var(--border-mid)", width: "calc(50% - 4px)" }}
        >
          <div className="px-3 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
            <p className="text-[9px] uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
              Choose nafs station to simulate
            </p>
          </div>
          {STATIONS.map(({ station, color, desc }) => (
            <button
              key={station}
              type="button"
              onClick={() => { onSimulateMuhasabah(station); setOpen(false); }}
              className="w-full flex items-start gap-3 px-3 py-2.5 text-left transition-opacity hover:opacity-70"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div className="w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0" style={{ background: color }} />
              <div>
                <p className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>{station}</p>
                <p className="text-[10px] leading-tight mt-0.5" style={{ color: "var(--text-tertiary)" }}>{desc}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
