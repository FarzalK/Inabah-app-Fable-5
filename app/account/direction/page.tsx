"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/data";
import { Label } from "@/components/ui";

export default function DirectionPage() {
  const router = useRouter();
  const [focusPlan, setFocusPlan] = useState<string | null>(null);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [retaking, setRetaking] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("focus_plan, active_categories")
        .eq("id", user.id)
        .single();

      setFocusPlan(profile?.focus_plan ?? null);
      setActiveCategories(profile?.active_categories ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleRetake() {
    setRetaking(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setRetaking(false); return; }

    await supabase
      .from("profiles")
      .upsert({ id: user.id, onboarding_completed: false, active_categories: [] });

    // Clear middleware onboarding cookie so the check re-runs
    document.cookie = "inabah_ob=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    router.push("/onboarding");
  }

  const activeCats = CATEGORIES.filter((c) => activeCategories.includes(c.id));

  return (
    <div className="space-y-5">
      <div>
        <Label>Your path</Label>
        <h1 className="text-2xl font-medium" style={{ color: "var(--text-primary)" }}>Direction</h1>
        <p className="text-[13px] mt-1" style={{ color: "var(--text-tertiary)" }}>
          Your personal focus areas and AI-generated direction from your last assessment.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl p-5" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Loading…</p>
        </div>
      ) : (
        <>
          {/* Focus areas */}
          <div className="rounded-xl p-5" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
            <Label>Active focus areas</Label>
            {activeCats.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>No focus areas set.</p>
            ) : (
              <div className="space-y-2">
                {activeCats.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5"
                    style={{ background: "var(--surface-card-alt)" }}
                  >
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{cat.name}</p>
                      <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{cat.sub}</p>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--accent)" }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI-generated direction letter */}
          {focusPlan && (
            <div className="rounded-xl p-5" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
              <Label>Your personal direction</Label>
              <p
                className="text-[13px] leading-relaxed whitespace-pre-wrap"
                style={{ color: "var(--text-secondary)" }}
              >
                {focusPlan}
              </p>
            </div>
          )}

          {/* Retake */}
          <div className="rounded-xl p-5" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
            <Label>Reassessment</Label>
            <p className="text-[13px] mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Your direction is set during the initial assessment. Retaking it will re-evaluate your
              focus areas and generate a fresh personal direction based on where you are today.
            </p>
            <button
              onClick={handleRetake}
              disabled={retaking}
              className="px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{
                background: "var(--surface-card-alt)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              {retaking ? "Redirecting…" : "Retake assessment"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
