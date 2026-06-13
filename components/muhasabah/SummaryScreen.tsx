"use client";
import { useState } from "react";
import type { Category, SessionSummary } from "@/types";
import { Label, HeartRatingPill, NafsPill, ProgressBar, PrimaryButton, GhostButton, AyahBox } from "@/components/ui";
import { saveResolution, updateSessionResolution } from "@/lib/storage";

interface SummaryScreenProps {
  sessionId: string; categories: Category[]; summary: SessionSummary; onRestart: () => void;
}

export default function SummaryScreen({ sessionId, categories, summary, onRestart }: SummaryScreenProps) {
  const [resolution, setResolution] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    if (!resolution.trim()) return;
    saveResolution(resolution.trim());
    updateSessionResolution(sessionId, resolution.trim());
    setSaved(true);
  }

  return (
    <div>
      <ProgressBar pct={100} />
      <Label>Tonight&apos;s reckoning</Label>
      <h2 className="text-xl font-medium mb-1" style={{ color: "var(--text-primary)" }}>Your Muhāsabah</h2>
      <div className="flex items-center gap-2 mt-3 mb-5">
        <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>Overall station —</span>
        <NafsPill station={summary.nafsRating} />
      </div>

      {/* Category ratings */}
      <div className="rounded-xl p-4 mb-4" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
        <Label>By category</Label>
        {categories.map((cat, i) => {
          const rating = summary.categoryRatings[cat.id];
          return (
            <div key={cat.id} className="flex items-center justify-between py-2.5"
              style={{ borderBottom: i < categories.length - 1 ? "1px solid var(--border)" : "none" }}>
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{cat.name}</span>
              {rating ? <HeartRatingPill rating={rating} /> : <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>—</span>}
            </div>
          );
        })}
      </div>

      {/* Reflection */}
      <div className="rounded-xl p-4 mb-4" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
        <Label>Reflection</Label>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>{summary.reflection}</p>
        {summary.closingAyah && <AyahBox text={summary.closingAyah} />}
      </div>

      {/* Pattern */}
      <div className="rounded-xl p-4 mb-4" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
        <Label>Pattern noticed</Label>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{summary.pattern}</p>
      </div>

      {/* Resolution */}
      <div className="rounded-xl p-4 mb-6" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
        <Label>Your resolution for tomorrow</Label>
        <p className="text-[13px] mb-3" style={{ color: "var(--text-tertiary)" }}>What is one thing you will guard?</p>
        <textarea
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          disabled={saved}
          placeholder="e.g. I will guard my tongue in difficult conversations..."
          className="w-full min-h-[70px] rounded-lg px-3 py-2.5 text-sm resize-y leading-relaxed disabled:opacity-60"
          style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border-mid)", color: "var(--text-primary)" }}
        />
        {saved
          ? <p className="text-[13px] mt-2" style={{ color: "var(--accent)" }}>✓ Saved. May Allah grant you steadfastness tomorrow.</p>
          : <div className="mt-3"><PrimaryButton onClick={handleSave}>Save resolution</PrimaryButton></div>
        }
      </div>

      <div className="text-center pb-8">
        <GhostButton onClick={onRestart}>Return to dashboard</GhostButton>
      </div>
    </div>
  );
}
