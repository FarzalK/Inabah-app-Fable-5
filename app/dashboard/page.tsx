"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SavedSession } from "@/types";
import { getSessions, getLastResolution, getSummaryCache } from "@/lib/storage";
import { getMuraqabahSessions, type MuraqabahSession } from "@/lib/muraqabah-storage";
import { computeSpiritualScore, getNafsDescription } from "@/lib/scoring";
import { ASMA_AL_HUSNA } from "@/lib/asma";
import { STATION_COLORS } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";

// ── Milestone definitions ──────────────────────────────────────────
const MILESTONES: { key: string; check: (s: number, streak: number) => boolean; title: string; message: string }[] = [
  { key: "first_session",  check: (s) => s === 1,   title: "First session complete",     message: "You've taken the first step. May Allah make it the beginning of a lasting practice." },
  { key: "session_10",     check: (s) => s === 10,  title: "10 sessions",                message: "Consistency is the beloved deed. Keep going." },
  { key: "streak_7",       check: (_, k) => k === 7,  title: "Seven days in a row",      message: "A full week of Muhāsabah. The angels record your effort." },
  { key: "streak_30",      check: (_, k) => k === 30, title: "Thirty days straight",     message: "SubhanAllah — thirty consecutive days of self-accounting." },
];

function getActiveMilestone(totalSessions: number, streak: number): typeof MILESTONES[0] | null {
  try {
    const seen: string[] = JSON.parse(localStorage.getItem("inabah_milestones_seen") ?? "[]");
    return MILESTONES.find((m) => m.check(totalSessions, streak) && !seen.includes(m.key)) ?? null;
  } catch { return null; }
}

function dismissMilestone(key: string) {
  try {
    const seen: string[] = JSON.parse(localStorage.getItem("inabah_milestones_seen") ?? "[]");
    localStorage.setItem("inabah_milestones_seen", JSON.stringify([...seen, key]));
  } catch { /* noop */ }
}

// ── Nafs station descriptions for tooltip ─────────────────────────
const NAFS_TOOLTIPS: Record<string, string> = {
  "Ammārah": "Al-Nafs al-Ammārah: the soul that commands toward evil, dominated by desires and heedlessness.",
  "Lawwāmah": "Al-Nafs al-Lawwāmah: the self-reproaching soul — aware of its wrongs and striving against them.",
  "Mulhamah": "Al-Nafs al-Mulhamah: the inspired soul, oriented toward goodness and guided by inner light.",
  "Mutma'innah": "Al-Nafs al-Mutma'innah: the tranquil soul, at rest in the remembrance and pleasure of Allah.",
};

export default function DashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [muraqabahSessions, setMuraqabahSessions] = useState<MuraqabahSession[]>([]);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [focusPlan, setFocusPlan] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [milestone, setMilestone] = useState<typeof MILESTONES[0] | null>(null);
  const [stationTooltipOpen, setStationTooltipOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [sessionsData, muraqabahData, { data: { user } }] = await Promise.all([
        getSessions(),
        getMuraqabahSessions(),
        supabase.auth.getUser(),
      ]);

      setSessions(sessionsData);
      setMuraqabahSessions(muraqabahData);

      // Milestone check belongs to the data load, not a separate effect —
      // it only changes when a new session list arrives.
      const loadedScore = computeSpiritualScore(sessionsData);
      setMilestone(getActiveMilestone(loadedScore.totalSessions, loadedScore.streak));

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, focus_plan")
          .eq("id", user.id)
          .single();
        setFirstName(profile?.first_name ?? null);
        setFocusPlan(profile?.focus_plan ?? null);
      }

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

  if (!mounted) {
    return (
      <main className="min-h-screen py-8" style={{ background: "var(--surface-bg)" }}>
        <div className="app-container">
          {/* Greeting skeleton */}
          <div className="mb-7 space-y-2">
            <div className="h-2.5 w-24 rounded animate-pulse" style={{ background: "var(--surface-card-alt)" }} />
            <div className="h-8 w-56 rounded animate-pulse" style={{ background: "var(--surface-card-alt)" }} />
          </div>
          {/* Tiles skeleton */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="rounded-2xl h-44 animate-pulse" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }} />
            <div className="rounded-2xl h-44 animate-pulse" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }} />
          </div>
          {/* Direction card skeleton */}
          <div className="rounded-2xl p-5 mb-3 space-y-3 animate-pulse" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
            <div className="h-2.5 w-16 rounded" style={{ background: "var(--surface-card-alt)" }} />
            <div className="h-4 w-40 rounded" style={{ background: "var(--surface-card-alt)" }} />
            <div className="h-16 rounded-lg" style={{ background: "var(--surface-card-alt)" }} />
          </div>
        </div>
      </main>
    );
  }

  const summaryCache = getSummaryCache();
  const focusText = summaryCache?.focus ?? null;
  const stationDesc = getNafsDescription(score.nafsStation);
  const trendIcon = score.trend === "improving" ? "↑" : score.trend === "declining" ? "↓" : "→";
  const trendColor = score.trend === "improving" ? "var(--accent)" : score.trend === "declining" ? "#C0392B" : "var(--text-tertiary)";

  const lastMuhasabah = sessions[0];
  const lastMuraqabah = muraqabahSessions[0];
  const lastMuraqabahName = lastMuraqabah
    ? ASMA_AL_HUSNA.find((a) => a.number === lastMuraqabah.nameNumber)
    : null;
  const lastResolution = getLastResolution();

  const stationColor = STATION_COLORS[score.nafsStation] ?? "var(--accent)";
  const hasAnySessions = score.totalSessions > 0;

  const todayStr = new Date().toLocaleDateString("en-CA", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <main className="min-h-screen py-8" style={{ background: "var(--surface-bg)" }}>
      <div className="app-container">

        {/* ── Milestone banner ── */}
        {milestone && (
          <div
            className="rounded-2xl p-4 mb-5 flex items-start justify-between gap-3 animate-fade-up"
            style={{ background: "var(--accent-light)", border: "1px solid var(--accent)" }}
          >
            <div>
              <p className="text-[13px] font-semibold mb-0.5" style={{ color: "var(--accent)" }}>
                {milestone.title}
              </p>
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {milestone.message}
              </p>
            </div>
            <button
              onClick={() => { dismissMilestone(milestone.key); setMilestone(null); }}
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-opacity hover:opacity-70"
              style={{ color: "var(--accent)" }}
              aria-label="Dismiss"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}

        {/* ── Greeting ── */}
        <div className="mb-7">
          <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: "var(--text-tertiary)" }}>
            {todayStr}
          </p>
          <h1 className="text-2xl font-medium" style={{ color: "var(--text-primary)" }}>
            {firstName ? `Assalamu Alaikum, ${firstName}` : "Assalamu Alaikum"}
          </h1>
        </div>

        {/* ── Practice tiles ── */}
        <div className="grid grid-cols-2 gap-3 mb-3">

          {/* Muhāsabah tile */}
          <button
            onClick={() => router.push("/session")}
            className="rounded-2xl p-5 text-left flex flex-col gap-3 hover:opacity-90 active:scale-[0.99]"
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border)",
              transition: "opacity 0.15s, transform 0.1s",
            }}
          >
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
                <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--accent)" }}>
                  Muhāsabah
                </span>
              </div>
              <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                Daily self-accounting
              </p>
            </div>

            {/* Station + streak or empty state */}
            <div className="flex-1 space-y-1.5">
              {hasAnySessions ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: stationColor }} />
                    <span className="text-[12px] font-medium" style={{ color: stationColor }}>
                      {score.nafsStation}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {score.streak > 0 && (
                      <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                        {score.streak}d streak
                      </span>
                    )}
                    {lastMuhasabah && (
                      <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                        Last {new Date(lastMuhasabah.date).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-1">
                  <p className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>
                    Begin your practice
                  </p>
                  <p className="text-[11px] leading-snug" style={{ color: "var(--text-tertiary)" }}>
                    A guided daily self-accounting. Around 5 minutes.
                  </p>
                </div>
              )}
            </div>

            {/* Last commitment */}
            {lastResolution && (
              <div
                className="rounded-lg px-3 py-2.5"
                style={{ background: "var(--surface-card-alt)", borderLeft: "2px solid var(--accent)" }}
              >
                <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: "var(--text-tertiary)" }}>
                  Your last commitment
                </p>
                <p className="text-[11px] italic leading-snug line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                  &ldquo;{lastResolution.text}&rdquo;
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid var(--border)" }}>
              <span className="text-[12px] font-medium" style={{ color: "var(--accent)" }}>
                Begin Muhāsabah
              </span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>

          {/* Murāqabah tile */}
          <button
            onClick={() => router.push("/muraqabah")}
            className="rounded-2xl p-5 text-left flex flex-col gap-3 hover:opacity-90 active:scale-[0.99]"
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border)",
              transition: "opacity 0.15s, transform 0.1s",
            }}
          >
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--terracotta)" }} />
                <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--terracotta)" }}>
                  Murāqabah
                </span>
              </div>
              <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                Contemplative remembrance
              </p>
            </div>

            <div className="flex-1 space-y-1.5">
              {lastMuraqabah ? (
                <>
                  {lastMuraqabahName && (
                    <div className="flex items-baseline gap-1.5">
                      <span lang="ar" className="arabic text-lg leading-none" style={{ color: "var(--terracotta)" }}>
                        {lastMuraqabahName.arabic}
                      </span>
                      <span className="text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>
                        {lastMuraqabahName.transliteration}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                      {lastMuraqabah.heartState}
                    </span>
                    {mStreak > 0 && (
                      <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                        {mStreak}d streak
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-1">
                  <p className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>
                    Sit with a name of Allah
                  </p>
                  <p className="text-[11px] leading-snug" style={{ color: "var(--text-tertiary)" }}>
                    A timed session of contemplative dhikr.
                  </p>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid var(--border)" }}>
              <span className="text-[12px] font-medium" style={{ color: "var(--terracotta)" }}>
                Begin Murāqabah
              </span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="var(--terracotta)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </div>

        {/* ── Direction card ── */}
        {(hasAnySessions || focusPlan) && (
          <div
            className="rounded-2xl p-5 mb-3"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}
          >
            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--sand)" }} />
                <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--sand)" }}>
                  Direction
                </span>
              </div>
              <button
                onClick={() => router.push("/insights")}
                className="text-[11px] transition-opacity hover:opacity-70"
                style={{ color: "var(--text-tertiary)" }}
                aria-label="View full insights"
              >
                Full insights →
              </button>
            </div>

            {/* Where you are */}
            {hasAnySessions && (
              <div className="mb-3">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: stationColor }} />
                  <span className="text-[13px] font-medium whitespace-nowrap" style={{ color: stationColor }}>
                    {score.nafsStation}
                  </span>
                  <span className="text-[12px] whitespace-nowrap" style={{ color: trendColor }}>
                    {trendIcon} {score.trend}
                  </span>
                  <span className="text-[11px] ml-1 whitespace-nowrap" style={{ color: "var(--text-tertiary)" }}>
                    · {stationDesc.split(" — ")[0]}
                  </span>
                  <button
                    onClick={() => setStationTooltipOpen((o) => !o)}
                    aria-expanded={stationTooltipOpen}
                    aria-label="About this station"
                    className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-opacity hover:opacity-70 ml-auto"
                    style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border-mid)" }}
                  >
                    <span className="text-[9px] font-bold leading-none" style={{ color: "var(--text-tertiary)" }}>?</span>
                  </button>
                </div>

                {stationTooltipOpen && (
                  <div
                    className="mt-2 px-3 py-2.5 rounded-lg text-[12px] leading-relaxed"
                    style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                  >
                    {NAFS_TOOLTIPS[score.nafsStation] ?? stationDesc}
                  </div>
                )}
              </div>
            )}

            {/* Focus for now */}
            {(focusText || focusPlan) && (
              <div className="rounded-lg px-3 py-2.5" style={{ background: "var(--accent-light)" }}>
                <p className="text-[9px] uppercase tracking-widest mb-1.5" style={{ color: "var(--accent)" }}>
                  Focus for now
                </p>
                <p className="text-[12px] leading-relaxed line-clamp-3" style={{ color: "var(--text-primary)" }}>
                  {focusText ?? focusPlan}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Foundations tile — coming soon, visually non-interactive ── */}
        <div
          className="w-full rounded-2xl p-5 mb-6"
          style={{
            background: "var(--surface-card)",
            border: "1px solid var(--border)",
            opacity: 0.55,
          }}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--sand)" }} />
            <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--sand)" }}>
              Foundations
            </span>
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wide"
              style={{ background: "color-mix(in srgb, var(--sand) 15%, transparent)", color: "var(--sand)" }}
            >
              Coming soon
            </span>
          </div>
          <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
            The roots of Muhāsabah — what it means, where it comes from, and how to deepen the practice.
          </p>
        </div>

      </div>
    </main>
  );
}
