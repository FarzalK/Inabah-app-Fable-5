import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AI_SYSTEM_PROMPT, CATEGORIES, HEART_RATINGS, NAFS_STATIONS } from "@/lib/data";
import { checkRateLimit } from "@/lib/rate-limit";
import { callClaude, parseJsonResponse, ClaudeError } from "@/lib/anthropic";
import type { HeartRating, NafsStation } from "@/types";

const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as [string, ...string[]];

const RequestSchema = z.object({
  answerSummary: z.string().min(1).max(20_000),
  categoryIds: z.array(z.enum(CATEGORY_IDS)).min(1).max(CATEGORIES.length),
});

const ResponseSchema = z.object({
  categoryRatings: z.record(
    z.string(),
    z.enum(HEART_RATINGS as [HeartRating, ...HeartRating[]])
  ),
  nafsRating: z.enum(NAFS_STATIONS as [NafsStation, ...NafsStation[]]),
  reflection: z.string(),
  pattern: z.string(),
  closingAyah: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const rateLimit = await checkRateLimit("/api/reflect");
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
    const { answerSummary, categoryIds } = parsed.data;

    const text = await callClaude({
      system: AI_SYSTEM_PROMPT + `\nCategory IDs: ${categoryIds.join(", ")}`,
      userMessage: `Here are my reflections for today:\n\n${answerSummary}`,
      maxTokens: 1000,
    });

    const summary = ResponseSchema.safeParse(parseJsonResponse(text));
    if (!summary.success) {
      // Shape mismatch from the model. Do not log the response itself —
      // it is derived from user content.
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
    console.error("Reflect API error:", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "Failed to generate reflection" }, { status: 500 });
  }
}
