-- ============================================================
-- Inabah — Initial schema cloned from Inabah Project (prod)
-- Consolidates original supabase/migration.sql + 3 prod-applied migrations:
--   20260513021417 add_focus_plan_to_profiles
--   20260516183809 create_api_rate_limits
--   20260516223303 add_first_last_name_to_profiles
-- This file's timestamp matches the migration recorded on the Inabah-app-test
-- remote (`hbddmjraibbenxoxelsd`) so `supabase migration list` shows alignment.
-- ============================================================

-- ── Profiles (extends auth.users) ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id                   UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  active_categories    TEXT[] DEFAULT ARRAY['salah','dhikr','speech','gaze','treatment','time'],
  discipline_level     INTEGER,
  focus_plan           TEXT,
  first_name           TEXT,
  last_name            TEXT
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Onboarding Responses ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.onboarding_responses (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id    TEXT NOT NULL,
  slider_value   INTEGER NOT NULL CHECK (slider_value BETWEEN 1 AND 5),
  text_response  TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own onboarding responses"
  ON public.onboarding_responses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── Muhasabah Sessions ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.muhasabah_sessions (
  id         TEXT PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date       TIMESTAMPTZ NOT NULL,
  categories TEXT[] NOT NULL,
  answers    JSONB NOT NULL DEFAULT '{}',
  summary    JSONB NOT NULL DEFAULT '{}',
  resolution TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.muhasabah_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own muhasabah sessions"
  ON public.muhasabah_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_muhasabah_sessions_user_date
  ON public.muhasabah_sessions(user_id, date DESC);

-- ── Muraqabah Sessions ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.muraqabah_sessions (
  id                   TEXT PRIMARY KEY,
  user_id              UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date                 TIMESTAMPTZ NOT NULL,
  name_id              INTEGER NOT NULL,
  name_transliteration TEXT,
  duration             INTEGER NOT NULL,
  heart_state          TEXT,
  note                 TEXT,
  breathing_used       BOOLEAN DEFAULT FALSE,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.muraqabah_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own muraqabah sessions"
  ON public.muraqabah_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_muraqabah_sessions_user_date
  ON public.muraqabah_sessions(user_id, date DESC);

-- ── API Rate Limits ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint     TEXT        NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  call_count   INTEGER     NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, endpoint, window_start)
);

ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own rate limit rows"
  ON public.api_rate_limits FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS api_rate_limits_window_start_idx
  ON public.api_rate_limits (window_start);
