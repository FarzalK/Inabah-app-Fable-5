"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// ── User-scoped localStorage keys ──────────────────────────────────
// Anything tied to a specific user's session. Cleared whenever the
// signed-in user ID changes so a sign-out + sign-in (potentially as a
// different account on the same browser) cannot leak state.
//
// Deliberately NOT in this list:
//   - inabah_theme: browser-level UI preference, should persist across
//     accounts on the same device.
const USER_SCOPED_LS_KEYS = [
  "muhasabah_resolution",       // last commitment shown on dashboard
  "muhasabah_draft",            // in-progress session draft
  "muraqabah_active_name",      // currently-selected name for Murāqabah
  "inabah_summary_cache",       // cached AI summary card
  "inabah_milestones_seen",     // milestone-banner dismissals
] as const;

// Key we use to remember which user the localStorage was scoped to.
// Comparing this against the current session's user.id is what lets us
// detect a user transition without relying on the SIGNED_IN event,
// which fires inconsistently across supabase-js versions on page reload.
const SESSION_OWNER_KEY = "inabah_session_user_id";

function clearUserScopedLocalStorage(): void {
  for (const key of USER_SCOPED_LS_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      // localStorage may be unavailable (private browsing, quota). Ignore.
    }
  }
}

/**
 * Mount once near the root of the app (in layout.tsx). Subscribes to
 * Supabase auth state changes and wipes user-scoped localStorage any
 * time the session's user id stops matching the id we last saw.
 *
 * Renders nothing.
 */
export default function AuthListener() {
  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUserId = session?.user?.id ?? null;
      let storedUserId: string | null = null;
      try {
        storedUserId = localStorage.getItem(SESSION_OWNER_KEY);
      } catch {
        // Treat as null; nothing to clear if we can't read.
      }

      if (storedUserId !== currentUserId) {
        clearUserScopedLocalStorage();
        try {
          if (currentUserId) {
            localStorage.setItem(SESSION_OWNER_KEY, currentUserId);
          } else {
            localStorage.removeItem(SESSION_OWNER_KEY);
          }
        } catch {
          // Best-effort.
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
