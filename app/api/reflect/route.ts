import { NextRequest, NextResponse } from "next/server";
import { AI_SYSTEM_PROMPT } from "@/lib/data";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const rateLimit = await checkRateLimit("/api/reflect");
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { answerSummary, categoryIds } = body ?? {};
    if (typeof answerSummary !== "string" || !Array.isArray(categoryIds)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY || "";

    if (!apiKey || apiKey === "sk-ant-your-key-here") {
      console.error("ANTHROPIC_API_KEY is not set or is still the placeholder value");
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured in .env.local" },
        { status: 500 }
      );
    }

    const systemPrompt = AI_SYSTEM_PROMPT + `\nCategory IDs: ${categoryIds.join(", ")}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Here are my reflections for today:\n\n${answerSummary}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Anthropic API error:", err);
      return NextResponse.json(
        { error: err.error?.message || "Anthropic API error" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = data.content
      .map((b: { type: string; text?: string }) => b.text || "")
      .join("");

    // Robustly extract JSON — find the first { and last } to handle
    // any preamble, trailing text, or imperfect markdown fence stripping
    let parsed;
    try {
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      if (jsonStart === -1 || jsonEnd === -1) throw new Error("No JSON object found in response");
      const jsonStr = text.slice(jsonStart, jsonEnd + 1);
      parsed = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("JSON parse failed. Raw text was:", text);
      console.error("Parse error:", parseError);
      return NextResponse.json({ error: "Failed to parse AI response as JSON" }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Reflect API error:", error);
    return NextResponse.json({ error: "Failed to generate reflection" }, { status: 500 });
  }
}
