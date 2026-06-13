import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CATEGORIES } from "@/lib/data";
import { checkRateLimit } from "@/lib/rate-limit";
import { callClaude, ClaudeError } from "@/lib/anthropic";

const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as [string, ...string[]];

const RequestSchema = z.object({
  sliderValues: z.record(z.string(), z.number().int().min(1).max(5)),
  activeCategories: z.array(z.enum(CATEGORY_IDS)).min(1).max(CATEGORIES.length),
});

const SYSTEM_PROMPT = `You are a compassionate Islamic spiritual guide writing a personal direction letter to a Muslim who has just completed an honest self-assessment. Your tone is warm, direct, and grounded in mercy — like a wise mentor who knows them personally. Not generic, not preachy.

When quoting the Quran, use ONLY The Clear Quran translation by Dr. Mustafa Khattab. Cite as: Surah Name X:Y — do NOT include any translation name or attribution in the output text.

Write 3–4 short paragraphs (under 220 words total):
1. Acknowledge where they are honestly but with mercy — name their consistency level without judgment
2. Briefly explain the significance of their selected focus areas as a unified direction, not a list
3. One concrete, specific action they can start with today that ties the areas together
4. Close with a single relevant Quranic ayah or authentic hadith as encouragement

Do not use bullet points. Do not list each category separately. Write as flowing, personal prose.`;

export async function POST(req: NextRequest) {
  try {
    const rateLimit = await checkRateLimit("/api/onboarding-plan");
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
    const { sliderValues, activeCategories } = parsed.data;

    const disciplineScore = sliderValues["discipline"] ?? 3;
    const disciplineLabel =
      disciplineScore <= 1 ? "very little routine right now" :
      disciplineScore === 2 ? "some inconsistency in their practices" :
      disciplineScore === 3 ? "moderate consistency" :
      disciplineScore === 4 ? "fairly consistent practices" :
      "strong consistency in their practices";

    const focusCats = CATEGORIES.filter((c) => activeCategories.includes(c.id));
    const categoryLines = focusCats.map((cat) => {
      const score = sliderValues[cat.id] ?? 3;
      const needLabel =
        score <= 1 ? "significant struggle" :
        score === 2 ? "notable difficulty" :
        score === 3 ? "room for growth" :
        "some room to improve";
      return `- ${cat.name} (${cat.sub}): ${needLabel}`;
    }).join("\n");

    const userMsg = `The person has ${disciplineLabel}.

Their selected focus areas for daily Muhāsabah are:\n${categoryLines}

Write their personal direction and action plan.`;

    const plan = (
      await callClaude({ system: SYSTEM_PROMPT, userMessage: userMsg, maxTokens: 400 })
    ).trim();

    return NextResponse.json({ plan });
  } catch (error) {
    if (error instanceof ClaudeError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Onboarding plan error:", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}
