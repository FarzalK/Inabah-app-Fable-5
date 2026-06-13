import type { SavedSession, SessionSummary } from "@/types";
import type { Json, Tables } from "@/types/database";
import { createClient } from "@/lib/supabase/client";

// ── Supabase-backed session storage ───────────────────────────────────────────

export async function getSessions(): Promise<SavedSession[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("muhasabah_sessions")
    .select("*")
    .order("date", { ascending: false })
    .limit(60);

  if (error || !data) return [];

  return data.map((row: Tables<"muhasabah_sessions">) => ({
    id: row.id,
    date: row.date,
    categories: row.categories,
    answers: row.answers as unknown as SavedSession["answers"],
    summary: row.summary as unknown as SessionSummary,
    resolution: row.resolution ?? undefined,
  }));
}

export async function saveSession(session: SavedSession): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("muhasabah_sessions").upsert({
    id: session.id,
    user_id: user.id,
    date: session.date,
    categories: session.categories,
    answers: session.answers as unknown as Json,
    summary: session.summary as unknown as Json,
    resolution: session.resolution ?? null,
  });

  // Invalidate AI summary cache
  localStorage.removeItem("inabah_summary_cache");
  clearDraft();
}

export async function updateSessionResolution(id: string, resolution: string): Promise<void> {
  const supabase = createClient();
  await supabase
    .from("muhasabah_sessions")
    .update({ resolution })
    .eq("id", id);
}

// ── Last resolution (localStorage — ephemeral UX prompt) ─────────────────────

const RESOLUTION_KEY = "muhasabah_resolution";

export function getLastResolution(): { text: string; date: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(RESOLUTION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveResolution(text: string): void {
  localStorage.setItem(RESOLUTION_KEY, JSON.stringify({ text, date: new Date().toISOString() }));
}

// ── Draft (localStorage — ephemeral, single-device) ──────────────────────────

const DRAFT_KEY = "muhasabah_draft";

export interface SessionDraft {
  sessionId: string;
  categoryIds: string[];
  answers: Record<string, string>;
  currentIndex: number;
  date: string;
}

export function saveDraft(draft: SessionDraft): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function getDraft(): SessionDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  localStorage.removeItem(DRAFT_KEY);
}

// ── AI Summary cache (localStorage — ephemeral) ───────────────────────────────

const SUMMARY_CACHE_KEY = "inabah_summary_cache";

export interface SummaryCache {
  summary: string;
  focus: string;
  scholarQuote: string;
  generatedAfterSessionId: string;
}

export function getSummaryCache(): SummaryCache | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SUMMARY_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setSummaryCache(cache: SummaryCache): void {
  localStorage.setItem(SUMMARY_CACHE_KEY, JSON.stringify(cache));
}

export function clearSummaryCache(): void {
  localStorage.removeItem(SUMMARY_CACHE_KEY);
}
