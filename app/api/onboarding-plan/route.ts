import { NextRequest, NextResponse } from "next/server";
import { CATEGORIES } from "@/lib/data";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const rateLimit = await checkRateLimit("/api/onboarding-plan");
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { sliderValues, activeCategories } = body ?? {};
    if (
      !sliderValues || typeof sliderValues !== "object" || Array.isArray(sliderValues) ||
      !Array.isArray(activeCategories)
    ) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const typedSliders = sliderValues as Record<string, number>;
    const typedCategories = activeCategories as string[];

    const apiKey = process.env.ANTHROPIC_API_KEY || "";
    if (!apiKey || apiKey === "sk-ant-your-key-here") {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const disciplineScore = typedSliders["discipline"] ?? 3;
    const disciplineLabel =
      disciplineScore <= 1 ? "very little routine right now" :
      disciplineScore === 2 ? "some inconsistency in their practices" :
      disciplineScore === 3 ? "moderate consistency" :
      disciplineScore === 4 ? "fairly consistent practices" :
      "strong consistency in their practices";

    const focusCats = CATEGORIES.filter((c) => typedCategories.includes(c.id));
    const categoryLines = focusCats.map((cat) => {
      const score = typedSliders[cat.id] ?? 3;
      const needLabel =
        score <= 1 ? "significant struggle" :
        score === 2 ? "notable difficulty" :
        score === 3 ? "room for growth" :
        "some room to improve";
      return `- ${cat.name} (${cat.sub}): ${needLabel}`;
    }).join("\n");

    const systemPrompt = `You are a compassionate Islamic spiritual guide writing a personal direction letter to a Muslim who has just completed an honest self-assessment. Your tone is warm, direct, and grounded in mercy — like a wise mentor who knows them personally. Not generic, not preachy.

When quoting the Quran, use ONLY The Clear Quran translation by Dr. Mustafa Khattab. Cite as: Surah Name X:Y — do NOT include any translation name or attribution in the output text.

Write 3–4 short paragraphs (under 220 words total):
1. Acknowledge where they are honestly but with mercy — name their consistency level without judgment
2. Briefly explain the significance of their selected focus areas as a unified direction, not a list
3. One concrete, specific action they can start with today that ties the areas together
4. Close with a single relevant Quranic ayah or authentic hadith as encouragement

Do not use bullet points. Do not list each category separately. Write as flowing, personal prose.`;

    const userMsg = `The person has ${disciplineLabel}.

Their selected focus areas for daily Muhāsabah are:\n${categoryLines}

Write their personal direction and action plan.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 400,
        system: systemPrompt,
        messages: [{ role: "user", content: userMsg }],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json(
        { error: err.error?.message || "Anthropic API error" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const plan = data.content.map((b: { text?: string }) => b.text || "").join("").trim();
    return NextResponse.json({ plan });
  } catch (e) {
    console.error("Onboarding plan error:", e);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}
