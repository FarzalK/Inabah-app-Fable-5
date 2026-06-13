import { createClient } from "@/lib/supabase/server";

// Per-user, per-minute call limits for each AI endpoint.
// Generous enough for normal use; protective against runaway loops or abuse.
const ENDPOINT_LIMITS: Record<string, number> = {
  "/api/reflect":          10,
  "/api/summary":           5,
  "/api/onboarding-plan":   3,
};

const DEFAULT_LIMIT = 10;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** userId, available so callers don't need a second auth lookup */
  userId: string | null;
}

/**
 * Checks and increments the per-user, per-minute call count for an endpoint.
 *
 * Uses a 1-minute tumbling window keyed on (user_id, endpoint, window_start).
 * Read-then-write is intentionally non-atomic — a small race is acceptable
 * for rate limiting; the worst case is a single extra request slipping through.
 */
export async function checkRateLimit(endpoint: string): Promise<RateLimitResult> {
  const limit = ENDPOINT_LIMITS[endpoint] ?? DEFAULT_LIMIT;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { allowed: false, remaining: 0, userId: null };
  }

  // Floor timestamp to the current minute
  const windowStart = new Date();
  windowStart.setSeconds(0, 0);
  const windowKey = windowStart.toISOString();

  // Read current count for this window
  const { data: existing } = await supabase
    .from("api_rate_limits")
    .select("call_count")
    .eq("user_id", user.id)
    .eq("endpoint", endpoint)
    .eq("window_start", windowKey)
    .single();

  const currentCount = existing?.call_count ?? 0;

  if (currentCount >= limit) {
    return { allowed: false, remaining: 0, userId: user.id };
  }

  // Increment (or insert if first call in this window)
  await supabase
    .from("api_rate_limits")
    .upsert(
      {
        user_id: user.id,
        endpoint,
        window_start: windowKey,
        call_count: currentCount + 1,
      },
      { onConflict: "user_id,endpoint,window_start" }
    );

  return {
    allowed: true,
    remaining: limit - (currentCount + 1),
    userId: user.id,
  };
}
