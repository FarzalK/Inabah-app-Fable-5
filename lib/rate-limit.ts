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
 * Delegates to the `increment_rate_limit` Postgres function, which performs
 * the check-and-increment as a single atomic INSERT ... ON CONFLICT, so
 * concurrent requests cannot slip past the limit.
 */
export async function checkRateLimit(endpoint: string): Promise<RateLimitResult> {
  const limit = ENDPOINT_LIMITS[endpoint] ?? DEFAULT_LIMIT;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { allowed: false, remaining: 0, userId: null };
  }

  const { data: count, error } = await supabase.rpc("increment_rate_limit", {
    p_endpoint: endpoint,
    p_limit: limit,
  });

  // Fail closed on unexpected DB errors: an AI endpoint that cannot verify
  // its budget should not spend it.
  if (error || count === null || count === -1) {
    return { allowed: false, remaining: 0, userId: user.id };
  }

  return {
    allowed: true,
    remaining: Math.max(0, limit - count),
    userId: user.id,
  };
}
