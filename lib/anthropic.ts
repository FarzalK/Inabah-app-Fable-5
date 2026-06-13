// Shared server-side Claude API client for the AI routes.
//
// Privacy constraint (non-functional requirement): user-derived content —
// answers, reflections, AI responses built from them — must never reach
// server logs. Errors thrown from here carry only generic messages and
// upstream status codes.

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

export class ClaudeError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ClaudeError";
  }
}

interface ClaudeCallOptions {
  system: string;
  userMessage: string;
  maxTokens: number;
}

/** Calls Claude and returns the concatenated text of the response. */
export async function callClaude({ system, userMessage, maxTokens }: ClaudeCallOptions): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY || "";
  if (!apiKey || apiKey === "sk-ant-your-key-here") {
    throw new ClaudeError("ANTHROPIC_API_KEY is not configured", 500);
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    // Upstream error bodies are API metadata, not user content — but keep
    // logs to the status code anyway; the message goes back to the caller.
    let message = "Anthropic API error";
    try {
      const err = await response.json();
      message = err.error?.message || message;
    } catch {
      // Non-JSON error body; fall through with the generic message.
    }
    throw new ClaudeError(message, response.status);
  }

  const data = await response.json();
  return (data.content as Array<{ type: string; text?: string }>)
    .map((b) => b.text || "")
    .join("");
}

/**
 * Extracts and parses the first JSON object from a model response,
 * tolerating preamble, trailing text, or markdown fences.
 */
export function parseJsonResponse<T>(text: string): T {
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new ClaudeError("Model response contained no JSON object", 500);
  }
  try {
    return JSON.parse(text.slice(jsonStart, jsonEnd + 1)) as T;
  } catch {
    // Deliberately do not log the raw text — it is derived from user input.
    throw new ClaudeError("Failed to parse model response as JSON", 500);
  }
}
