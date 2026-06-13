import type { SavedSession, HeartRating, NafsStation } from "@/types";

// Heart rating numeric values
export const HEART_SCORES: Record<HeartRating, number> = {
  Heedless: 0,
  Struggling: 1,
  Striving: 2,
  Present: 3,
  Mindful: 4,
};

// Nafs station thresholds — Mutma'innah requires sustained excellence
// Score is 0-4. Thresholds are deliberately high for upper stations.
const NAFS_THRESHOLDS = [
  { station: "Ammārah" as NafsStation, min: 0, max: 0.8 },
  { station: "Lawwāmah" as NafsStation, min: 0.8, max: 1.8 },
  { station: "Mulhamah" as NafsStation, min: 1.8, max: 2.8 },
  { station: "Mutma'innah" as NafsStation, min: 2.8, max: 4 },
];

// How many recent sessions to weight heavily vs older ones
const RECENCY_WEIGHTS = [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.35, 0.3, 0.25];

export interface SpiritualScore {
  nafsStation: NafsStation;
  nafsScore: number; // 0-4
  nafsProgress: number; // 0-100 within current station
  categoryAverages: Record<string, number>; // 0-4 per category
  consistencyScore: number; // 0-100
  totalSessions: number;
  streak: number;
  trend: "improving" | "steady" | "declining";
  // Mutmainnah gate — extra requirement beyond score
  meetsConsistencyGate: boolean;
}

export function computeSpiritualScore(sessions: SavedSession[]): SpiritualScore {
  const totalSessions = sessions.length;

  if (totalSessions === 0) {
    return {
      nafsStation: "Ammārah",
      nafsScore: 0,
      nafsProgress: 0,
      categoryAverages: {},
      consistencyScore: 0,
      totalSessions: 0,
      streak: 0,
      trend: "steady",
      meetsConsistencyGate: false,
    };
  }

  // ── Weighted session score ──────────────────────────────────────────────────
  const recent = sessions.slice(0, 10);
  let weightedSum = 0;
  let totalWeight = 0;

  recent.forEach((session, i) => {
    const w = RECENCY_WEIGHTS[i] ?? 0.2;
    const ratings = Object.values(session.summary.categoryRatings) as HeartRating[];
    if (ratings.length === 0) return;
    const sessionAvg = ratings.reduce((acc, r) => acc + (HEART_SCORES[r] ?? 0), 0) / ratings.length;
    weightedSum += sessionAvg * w;
    totalWeight += w;
  });

  const rawScore = totalWeight > 0 ? weightedSum / totalWeight : 0;

  // ── Category averages ──────────────────────────────────────────────────────
  const categoryTotals: Record<string, { sum: number; count: number }> = {};
  sessions.slice(0, 20).forEach((session) => {
    Object.entries(session.summary.categoryRatings).forEach(([catId, rating]) => {
      if (!categoryTotals[catId]) categoryTotals[catId] = { sum: 0, count: 0 };
      categoryTotals[catId].sum += HEART_SCORES[rating as HeartRating] ?? 0;
      categoryTotals[catId].count += 1;
    });
  });
  const categoryAverages: Record<string, number> = {};
  Object.entries(categoryTotals).forEach(([catId, { sum, count }]) => {
    categoryAverages[catId] = sum / count;
  });

  // ── Streak ─────────────────────────────────────────────────────────────────
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sessions.length; i++) {
    const sessionDate = new Date(sessions[i].date);
    sessionDate.setHours(0, 0, 0, 0);
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    if (sessionDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  // ── Consistency score (sessions in last 30 days) ───────────────────────────
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentCount = sessions.filter(
    (s) => new Date(s.date) >= thirtyDaysAgo
  ).length;
  const consistencyScore = Math.min(100, Math.round((recentCount / 30) * 100));

  // ── Mutma'innah gate — requires BOTH high score AND consistency ────────────
  // Must have: score >= 2.8, at least 14 sessions in last 30 days, streak >= 7
  const meetsConsistencyGate =
    rawScore >= 2.8 && recentCount >= 14 && streak >= 7;

  // Effective score — cap at Mulhamah ceiling if consistency gate not met
  const effectiveScore = rawScore >= 2.8 && !meetsConsistencyGate
    ? Math.min(rawScore, 2.79)
    : rawScore;

  // ── Nafs station ───────────────────────────────────────────────────────────
  const threshold =
    NAFS_THRESHOLDS.find(
      (t) => effectiveScore >= t.min && effectiveScore < t.max
    ) ?? NAFS_THRESHOLDS[NAFS_THRESHOLDS.length - 1];

  const nafsStation = threshold.station;
  const range = threshold.max - threshold.min;
  const nafsProgress = Math.min(
    99,
    Math.round(((effectiveScore - threshold.min) / range) * 100)
  );

  // ── Trend (compare last 3 vs previous 3) ──────────────────────────────────
  let trend: "improving" | "steady" | "declining" = "steady";
  if (sessions.length >= 6) {
    const avgRecent = computeAvg(sessions.slice(0, 3));
    const avgPrev = computeAvg(sessions.slice(3, 6));
    if (avgRecent > avgPrev + 0.2) trend = "improving";
    else if (avgRecent < avgPrev - 0.2) trend = "declining";
  }

  return {
    nafsStation,
    nafsScore: effectiveScore,
    nafsProgress,
    categoryAverages,
    consistencyScore,
    totalSessions,
    streak,
    trend,
    meetsConsistencyGate,
  };
}

function computeAvg(sessions: SavedSession[]): number {
  const scores = sessions.flatMap((s) =>
    Object.values(s.summary.categoryRatings).map(
      (r) => HEART_SCORES[r as HeartRating] ?? 0
    )
  );
  if (scores.length === 0) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function getNafsDescription(station: NafsStation): string {
  const descriptions: Record<NafsStation, string> = {
    "Ammārah":
      "The commanding soul — inclined toward desires and away from Allah. This is the station of awareness: recognizing the pull of the nafs is the beginning of the journey.",
    "Lawwāmah":
      "The self-reproaching soul — you feel the weight of your shortcomings and your conscience is alive. Ibn al-Qayyim considers this a sign of faith: the soul that blames itself still cares.",
    "Mulhamah":
      "The inspired soul — you are receiving guidance, growing in awareness, and your heart is orienting toward Allah. Continue with patience and istiqamah.",
    "Mutma'innah":
      "The soul at rest — tranquil in the remembrance of Allah, aligned with His will. This station is not permanent; it must be renewed daily through Muhāsabah and Murāqabah.",
  };
  return descriptions[station];
}

export function getNafsGateMessage(score: SpiritualScore): string | null {
  if (score.nafsStation === "Mutma'innah") return null;
  if (score.nafsScore < 2.8) return null;
  // Score is high enough but gate not met
  const needed: string[] = [];
  if (score.streak < 7) needed.push(`${7 - score.streak} more consecutive days of sessions`);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  if (!score.meetsConsistencyGate) {
    needed.push("at least 14 sessions in the past 30 days");
  }
  if (needed.length === 0) return null;
  return `Your heart ratings reflect the Mutma'innah station, but sustained consistency is required. You need: ${needed.join(" and ")}.`;
}
