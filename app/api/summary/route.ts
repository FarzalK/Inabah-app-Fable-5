import { NextRequest, NextResponse } from "next/server";
import type { SpiritualScore } from "@/lib/scoring";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const rateLimit = await checkRateLimit("/api/summary");
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { score, recentReflections } = body ?? {};
    if (!score || typeof score.nafsStation !== "string" || !Array.isArray(recentReflections)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const typedScore = score as SpiritualScore;

    const apiKey = process.env.ANTHROPIC_API_KEY || "";
    if (!apiKey || apiKey === "sk-ant-your-key-here") {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const systemPrompt = `You are a compassionate Islamic spiritual guide reflecting on a Muslim's spiritual progress based on their Muhāsabah session data.

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

    const userMsg = `Current nafs station: ${typedScore.nafsStation}
Overall score: ${typedScore.nafsScore.toFixed(2)} / 4
Streak: ${typedScore.streak} days
Sessions in last 30 days: ${typedScore.consistencyScore}% consistency
Trend: ${typedScore.trend}
Category averages (0-4 scale): ${JSON.stringify(typedScore.categoryAverages)}
Recent AI reflections from sessions: ${(recentReflections as string[]).slice(0, 3).join(" | ")}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 600,
        system: systemPrompt,
        messages: [{ role: "user", content: userMsg }],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json({ error: err.error?.message || "Anthropic API error" }, { status: response.status });
    }

    const data = await response.json();
    const text = data.content.map((b: { text?: string }) => b.text || "").join("");

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) throw new Error("No JSON in response");
    const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    return NextResponse.json(parsed);
  } catch (e) {
    console.error("Dashboard summary error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
