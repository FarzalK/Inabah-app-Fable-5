-- ============================================================
-- DB hygiene + atomic rate limiting
--
-- Addresses the known Supabase advisor findings carried over from
-- the original Inabah project:
--   1. RLS policies re-evaluated auth.uid() per row — wrap in a
--      scalar subquery so Postgres evaluates it once per statement.
--   2. Missing index on onboarding_responses.user_id (FK lookups
--      and RLS filtering both scan on this column).
--   3. handle_new_user() is SECURITY DEFINER but was executable by
--      anon/authenticated — revoke; only the auth trigger needs it.
--   4. Rate limiting used a non-atomic read-then-upsert — replace
--      with a single atomic INSERT ... ON CONFLICT function.
-- ============================================================

-- ── 1. RLS policies: evaluate auth.uid() once per statement ───

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can manage own onboarding responses" ON public.onboarding_responses;
CREATE POLICY "Users can manage own onboarding responses"
  ON public.onboarding_responses FOR ALL
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can manage own muhasabah sessions" ON public.muhasabah_sessions;
CREATE POLICY "Users can manage own muhasabah sessions"
  ON public.muhasabah_sessions FOR ALL
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can manage own muraqabah sessions" ON public.muraqabah_sessions;
CREATE POLICY "Users can manage own muraqabah sessions"
  ON public.muraqabah_sessions FOR ALL
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users manage own rate limit rows" ON public.api_rate_limits;
CREATE POLICY "Users manage own rate limit rows"
  ON public.api_rate_limits FOR ALL
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- ── 2. FK index ────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_onboarding_responses_user_id
  ON public.onboarding_responses(user_id);

-- ── 3. Lock down handle_new_user ───────────────────────────────
-- Only the on_auth_user_created trigger (which runs as the function
-- owner) needs to execute this; no client role should be able to.

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

-- ── 4. Atomic rate-limit increment ─────────────────────────────
-- Single statement replaces the racy read-then-upsert. Returns the
-- new call count for the current 1-minute window, or -1 when the
-- caller is unauthenticated or already at the limit. SECURITY
-- INVOKER: RLS on api_rate_limits keeps each user inside their own
-- rows.

CREATE OR REPLACE FUNCTION public.increment_rate_limit(
  p_endpoint TEXT,
  p_limit    INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user   UUID := (SELECT auth.uid());
  v_window TIMESTAMPTZ := date_trunc('minute', now());
  v_count  INTEGER;
BEGIN
  IF v_user IS NULL THEN
    RETURN -1;
  END IF;

  INSERT INTO public.api_rate_limits AS rl (user_id, endpoint, window_start, call_count)
  VALUES (v_user, p_endpoint, v_window, 1)
  ON CONFLICT (user_id, endpoint, window_start)
  DO UPDATE SET call_count = rl.call_count + 1
  WHERE rl.call_count < p_limit
  RETURNING call_count INTO v_count;

  -- No row returned: the ON CONFLICT update was filtered out, i.e.
  -- the window is already at the limit.
  IF v_count IS NULL THEN
    RETURN -1;
  END IF;

  -- Opportunistic cleanup of this user's expired windows so the
  -- table does not grow unboundedly.
  DELETE FROM public.api_rate_limits
  WHERE user_id = v_user AND window_start < now() - INTERVAL '1 hour';

  RETURN v_count;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.increment_rate_limit(TEXT, INTEGER) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.increment_rate_limit(TEXT, INTEGER) FROM anon;
GRANT  EXECUTE ON FUNCTION public.increment_rate_limit(TEXT, INTEGER) TO authenticated;
