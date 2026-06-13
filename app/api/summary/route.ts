import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { NAFS_STATIONS } from "@/lib/data";
import { checkRateLimit } from "@/lib/rate-limit";
import { callClaude, parseJsonResponse, ClaudeError } from "@/lib/anthropic";
import type { NafsStation } from "@/types";

const RequestSchema = z.object({
  score: z.object({
    nafsStation: z.enum(NAFS_STATIONS as [NafsStation, ...NafsStation[]]),
    nafsScore: z.number().min(0).max(4),
    streak: z.number().int().min(0),
    consistencyScore: z.number().min(0).max(100),
    trend: z.enum(["improving", "steady", "declining"]),
    categoryAverages: z.record(z.string(), z.number()),
  }),
  recentReflections: z.array(z.string().max(2_000)).max(20),
});

const ResponseSchema = z.object({
  summary: z.string(),
  focus: z.string(),
  scholarQuote: z.string(),
});

const SYSTEM_PROMPT = `You are a compassionate Islamic spiritual guide reflecting on a Muslim's spiritual progress based on their Muhāsabah session data.

Your tone is honest but merciful. Do not be generic — speak directly to their station, patterns, and specific struggles.

SOURCE HIERARCHY — follow this strictly:
1. PRIMARY: Quran — cite specific ayaat with surah name and verse number. This is always the first source you reach for. IMPORTANT: Use ONLY The Clear Quran translation by Dr. Mustafa Khattab for all Quranic quotes. Cite as: Surah Name X:Y — do NOT include any translation name or attribution in the output text.
2. PRIMARY: Authentic hadith — cite with narrator and collection (Bukhari, Muslim, Tirmidhi, Abu Dawud, Ibn Majah, Ahmad). Only use well-known, authentic narrations. Never fabricate.
3. SECONDARY (only when Quran/hadith do not directly address the theme): al-Ghazali's Ihya, Ibn al-Qayyim's Madarij, Ibn Rajab al-Hanbali. Scholar quotes supplement but never replace primary sources.

The "scholarQuote" field should be: a Quranic ayah OR an authentic hadith first. Only use a scholar quote if no Quranic ayah or hadith speaks more directly to their current station. Label Quranic quotes as "— Surah Name X:Y" (no translation name). Label hadith as "— Narrated by [Companion], [Collection]". Label scholar quotes as "— Ibn al-Qayyim, Madarij al-Salikeen" etc.

Return ONLY valid JSON, no preamble or markdown:
{
  "summary": "3-4 sentence personal reflection grounded in at least one Quranic ayah or authentic hadith relevant to their station and patterns",
  "focus": "one specific practice or area to focus on — 1-2 sentences with a Quranic or hadith basis where possible",
  "scholarQuote": "A Quranic ayah or authentic hadith directly relevant to their current station, or a scholar quote only if more directly applicable"
}`;

export async function POST(req: NextRequest) {
  try {
    const rateLimit = await checkRateLimit("/api/summary");
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    const parsed = RequestSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const { score, recentReflections } = parsed.data;

    const userMsg = `Current nafs station: ${score.nafsStation}
Overall score: ${score.nafsScore.toFixed(2)} / 4
Streak: ${score.streak} days
Sessions in last 30 days: ${score.consistencyScore}% consistency
Trend: ${score.trend}
Category averages (0-4 scale): ${JSON.stringify(score.categoryAverages)}
Recent AI reflections from sessions: ${recentReflections.slice(0, 3).join(" | ")}`;

    const text = await callClaude({
      system: SYSTEM_PROMPT,
      userMessage: userMsg,
      maxTokens: 600,
    });

    const summary = ResponseSchema.safeParse(parseJsonResponse(text));
    if (!summary.success) {
      return NextResponse.json(
        { error: "AI response had an unexpected shape. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json(summary.data);
  } catch (error) {
    if (error instanceof ClaudeError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Dashboard summary error:", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
