"use client";

import { useEffect, useState } from "react";
import type { SpiritualScore } from "@/lib/scoring";
import type { SavedSession } from "@/types";
import { getSummaryCache, setSummaryCache, type SummaryCache } from "@/lib/storage";
import { Spinner } from "@/components/ui";

interface AISummaryCardProps {
  score: SpiritualScore;
  sessions: SavedSession[];
}

export default function AISummaryCard({ score, sessions }: AISummaryCardProps) {
  const [data, setData] = useState<SummaryCache | null>(null);
  const [loading, setLoading] = useState(true);

  // Re-run when the most recent session changes (i.e. after a new session is saved
  // and the cache has been cleared). Using sessions[0]?.id avoids re-firing on
  // unrelated parent re-renders while still picking up new completions.
  const latestSessionId = sessions[0]?.id ?? "";

  useEffect(() => {
    if (sessions.length === 0) { setLoading(false); return; }
    const cached = getSummaryCache();
    if (cached) { setData(cached); setLoading(false); return; }

    setLoading(true);
    const recentReflections = sessions.slice(0, 3).map((s) => s.summary.reflection).filter(Boolean);
    fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, recentReflections }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) {
          const cache: SummaryCache = { summary: d.summary, focus: d.focus, scholarQuote: d.scholarQuote, generatedAfterSessionId: latestSessionId };
          setSummaryCache(cache);
          setData(cache);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [latestSessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="rounded-xl p-5" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-1.5 mb-4">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--sand)" }} />
        <p className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--sand)" }}>
          Where you are
        </p>
      </div>

      {loading ? (
        <div className="py-4">
          <Spinner />
          <p className="text-[13px] text-center mt-3" style={{ color: "var(--text-tertiary)" }}>
            Reflecting on your journey...
          </p>
        </div>
      ) : !data || sessions.length === 0 ? (
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Complete your first Muhāsabah session to receive a personal reflection on your spiritual journey.
        </p>
      ) : (
        <>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-primary)" }}>
            {data.summary}
          </p>
          <div className="rounded-lg p-4 mb-4" style={{ background: "var(--accent-light)" }}>
            <p className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: "var(--accent)" }}>
              Focus for now
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
              {data.focus}
            </p>
          </div>
          {data.scholarQuote && (
            <div className="border-l-2 pl-4 py-1" style={{ borderColor: "var(--accent)" }}>
              <p className="text-[13px] italic leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {data.scholarQuote}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
