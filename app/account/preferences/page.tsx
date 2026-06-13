"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/data";
import { Label } from "@/components/ui";

export default function PreferencesPage() {
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data: profile } = await supabase
        .from("profiles")
        .select("active_categories")
        .eq("id", user.id)
        .single();
      setActiveCategories(profile?.active_categories ?? CATEGORIES.map((c) => c.id));
      setLoading(false);
    }
    load();
  }, []);

  async function toggleCategory(id: string) {
    if (!userId) return;

    const isActive = activeCategories.includes(id);

    // Require at least 1 active
    if (isActive && activeCategories.length === 1) return;

    const updated = isActive
      ? activeCategories.filter((c) => c !== id)
      : [...activeCategories, id];

    // Optimistic update
    setActiveCategories(updated);
    setSaving(true);
    setSaveState("idle");

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: userId, active_categories: updated });

      if (error) throw error;
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      // Rollback
      setActiveCategories(activeCategories);
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 3500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <Label>Practice</Label>
        <h1 className="text-2xl font-medium" style={{ color: "var(--text-primary)" }}>Preferences</h1>
        <p className="text-[13px] mt-1" style={{ color: "var(--text-tertiary)" }}>
          Choose which areas you want Muhāsabah to cover each session.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl p-5 space-y-2.5" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 rounded-lg animate-pulse" style={{ background: "var(--surface-card-alt)" }} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
          {/* Header row */}
          <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2">
              <Label>Categories</Label>
              <span
                className="text-[11px] px-2 py-0.5 rounded-full"
                style={{ background: "var(--accent-light)", color: "var(--accent)", border: "1px solid var(--accent)" }}
              >
                {activeCategories.length} of {CATEGORIES.length} active
              </span>
            </div>

            {/* Save feedback */}
            {saveState === "saved" && (
              <span className="text-[11px] font-medium" style={{ color: "var(--accent)" }}>Saved ✓</span>
            )}
            {saveState === "error" && (
              <span className="text-[11px] font-medium" style={{ color: "#ef4444" }}>Couldn&apos;t save — try again</span>
            )}
            {saving && (
              <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Saving…</span>
            )}
          </div>

          {/* Category rows */}
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategories.includes(cat.id);
              const isLastActive = isActive && activeCategories.length === 1;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  disabled={isLastActive}
                  aria-pressed={isActive}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors"
                  style={{
                    background: isActive ? "color-mix(in srgb, var(--accent) 5%, transparent)" : "transparent",
                    cursor: isLastActive ? "not-allowed" : "pointer",
                    opacity: isLastActive ? 0.5 : 1,
                  }}
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-[13px] font-medium" style={{ color: isActive ? "var(--text-primary)" : "var(--text-secondary)" }}>
                      {cat.name}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{cat.sub}</p>
                  </div>

                  {/* Toggle pill */}
                  <div
                    className="flex-shrink-0 w-9 h-5 rounded-full transition-colors duration-200 relative"
                    style={{
                      background: isActive ? "var(--accent)" : "var(--surface-card-alt)",
                      border: isActive ? "none" : "1px solid var(--border-mid)",
                    }}
                  >
                    <div
                      className="absolute top-0.5 w-4 h-4 rounded-full transition-transform duration-200"
                      style={{
                        background: isActive ? "var(--surface-bg)" : "var(--text-tertiary)",
                        transform: isActive ? "translateX(18px)" : "translateX(2px)",
                        opacity: isActive ? 1 : 0.5,
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer hint */}
          <div className="px-5 py-3" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
              Changes apply to your next session. At least one category must remain active.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
