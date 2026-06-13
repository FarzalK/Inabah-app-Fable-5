import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types/database";
import { clearSummaryCache } from "@/lib/storage";
import type { MuraqabahSession, HeartState } from "@/types";

export type { MuraqabahSession, HeartState };

// ── Supabase-backed session storage ───────────────────────────────────────────

export async function getMuraqabahSessions(): Promise<MuraqabahSession[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("muraqabah_sessions")
    .select("*")
    .order("date", { ascending: false })
    .limit(60);

  if (error || !data) return [];

  return data.map((row: Tables<"muraqabah_sessions">) => ({
    id: row.id,
    date: row.date,
    nameNumber: row.name_id,
    nameTransliteration: row.name_transliteration ?? "",
    durationMinutes: row.duration,
    heartState: row.heart_state as HeartState,
    note: row.note ?? undefined,
    breathingUsed: row.breathing_used ?? false,
  }));
}

export async function saveMuraqabahSession(session: MuraqabahSession): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("muraqabah_sessions").insert({
    id: session.id,
    user_id: user.id,
    date: session.date,
    name_id: session.nameNumber,
    name_transliteration: session.nameTransliteration,
    duration: session.durationMinutes,
    heart_state: session.heartState,
    note: session.note ?? null,
    breathing_used: session.breathingUsed,
  });

  // Invalidate AI summary cache
  clearSummaryCache();
  clearActiveName();
}

// ── Active name (localStorage — ephemeral) ────────────────────────────────────

const ACTIVE_NAME_KEY = "muraqabah_active_name";

export interface ActiveName {
  nameNumber: number;
  setAt: string;
}

export function setActiveName(nameNumber: number): void {
  localStorage.setItem(ACTIVE_NAME_KEY, JSON.stringify({ nameNumber, setAt: new Date().toISOString() }));
}

export function getActiveName(): ActiveName | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ACTIVE_NAME_KEY);
    if (!raw) return null;
    const parsed: ActiveName = JSON.parse(raw);
    const ageHours = (Date.now() - new Date(parsed.setAt).getTime()) / (1000 * 60 * 60);
    if (ageHours > 24) {
      localStorage.removeItem(ACTIVE_NAME_KEY);
      return null;
    }
    return parsed;
  } catch { return null; }
}

export function clearActiveName(): void {
  localStorage.removeItem(ACTIVE_NAME_KEY);
}
