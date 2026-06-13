import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { computeSpiritualScore, getNafsGateMessage, HEART_SCORES } from "@/lib/scoring";
import type { HeartRating, SavedSession } from "@/types";

// Frozen "today" so streak math is deterministic.
const TODAY = new Date("2026-06-12T20:00:00");

/** Builds a session dated `daysAgo` days before TODAY with uniform ratings. */
function makeSession(daysAgo: number, rating: HeartRating, id = `s-${daysAgo}`): SavedSession {
  const date = new Date(TODAY);
  date.setDate(date.getDate() - daysAgo);
  return {
    id,
    date: date.toISOString(),
    categories: ["salah", "dhikr"],
    answers: { salah: "...", dhikr: "..." },
    summary: {
      categoryRatings: { salah: rating, dhikr: rating },
      nafsRating: "Lawwāmah",
      reflection: "",
      pattern: "",
      closingAyah: "",
    },
  };
}

/** Sessions newest-first, one per day, `count` days deep, all `rating`. */
function dailySessions(count: number, rating: HeartRating): SavedSession[] {
  return Array.from({ length: count }, (_, i) => makeSession(i, rating, `s-${i}`));
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(TODAY);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("computeSpiritualScore", () => {
  it("returns the empty baseline for no sessions", () => {
    const score = computeSpiritualScore([]);
    expect(score.nafsStation).toBe("Ammārah");
    expect(score.nafsScore).toBe(0);
    expect(score.totalSessions).toBe(0);
    expect(score.streak).toBe(0);
    expect(score.trend).toBe("steady");
    expect(score.meetsConsistencyGate).toBe(false);
  });

  it("maps uniformly Heedless sessions to Ammārah", () => {
    const score = computeSpiritualScore(dailySessions(5, "Heedless"));
    expect(score.nafsScore).toBe(HEART_SCORES.Heedless);
    expect(score.nafsStation).toBe("Ammārah");
  });

  it("maps uniformly Striving sessions to Mulhamah", () => {
    const score = computeSpiritualScore(dailySessions(5, "Striving"));
    expect(score.nafsScore).toBe(HEART_SCORES.Striving);
    expect(score.nafsStation).toBe("Mulhamah");
  });

  it("counts consecutive daily sessions as a streak", () => {
    const score = computeSpiritualScore(dailySessions(7, "Present"));
    expect(score.streak).toBe(7);
  });

  it("breaks the streak on a missed day", () => {
    // Sessions today, yesterday, then a gap, then 3 days ago.
    const sessions = [makeSession(0, "Present"), makeSession(1, "Present"), makeSession(3, "Present")];
    const score = computeSpiritualScore(sessions);
    expect(score.streak).toBe(2);
  });

  it("withholds Mutma'innah when scores are high but consistency is not met", () => {
    // High ratings but only 5 sessions — fails both the 7-day streak
    // and the 14-in-30-days requirement.
    const score = computeSpiritualScore(dailySessions(5, "Mindful"));
    expect(score.meetsConsistencyGate).toBe(false);
    expect(score.nafsStation).toBe("Mulhamah");
    // Effective score is capped just below the Mutma'innah threshold.
    expect(score.nafsScore).toBeLessThan(2.8);
  });

  it("grants Mutma'innah with high scores AND sustained consistency", () => {
    // 14 consecutive daily sessions of Mindful: streak >= 7,
    // >= 14 sessions in 30 days, weighted score 4.0.
    const score = computeSpiritualScore(dailySessions(14, "Mindful"));
    expect(score.meetsConsistencyGate).toBe(true);
    expect(score.nafsStation).toBe("Mutma'innah");
  });

  it("detects an improving trend when recent sessions outscore older ones", () => {
    const sessions = [
      ...dailySessions(3, "Mindful"),
      ...Array.from({ length: 3 }, (_, i) => makeSession(i + 3, "Struggling", `old-${i}`)),
    ];
    const score = computeSpiritualScore(sessions);
    expect(score.trend).toBe("improving");
  });

  it("detects a declining trend when recent sessions fall behind", () => {
    const sessions = [
      ...dailySessions(3, "Struggling"),
      ...Array.from({ length: 3 }, (_, i) => makeSession(i + 3, "Mindful", `old-${i}`)),
    ];
    const score = computeSpiritualScore(sessions);
    expect(score.trend).toBe("declining");
  });

  it("averages per category across sessions", () => {
    const score = computeSpiritualScore(dailySessions(4, "Present"));
    expect(score.categoryAverages.salah).toBe(HEART_SCORES.Present);
    expect(score.categoryAverages.dhikr).toBe(HEART_SCORES.Present);
  });
});

describe("getNafsGateMessage", () => {
  it("is null when the score is below the Mutma'innah threshold", () => {
    const score = computeSpiritualScore(dailySessions(5, "Striving"));
    expect(getNafsGateMessage(score)).toBeNull();
  });

  it("is null once Mutma'innah is reached", () => {
    const score = computeSpiritualScore(dailySessions(14, "Mindful"));
    expect(getNafsGateMessage(score)).toBeNull();
  });

  it("explains what is missing when the score qualifies but consistency does not", () => {
    const score = computeSpiritualScore(dailySessions(5, "Mindful"));
    // Effective score got capped, so the public message only fires when the
    // raw score qualifies — reconstruct that case via the returned fields.
    const msg = getNafsGateMessage({ ...score, nafsScore: 3.5 });
    expect(msg).toMatch(/consecutive days|sessions in the past 30 days/);
  });
});
