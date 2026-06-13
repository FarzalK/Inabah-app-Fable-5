"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLastResolution, getDraft } from "@/lib/storage";

interface WelcomeScreenProps {
  onStart: () => void;
  hasDraft: boolean;
  onResume: () => void;
}

type ResolutionAck = "kept" | "partial" | "struggled";

function formatDraftAge(dateStr: string): string {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 2)   return "just now";
  if (mins < 60)  return `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

export default function WelcomeScreen({ onStart, hasDraft, onResume }: WelcomeScreenProps) {
  const router = useRouter();
  const [lastResolution, setLastResolution] = useState<{ text: string; date: string } | null>(null);
  const [draftAge, setDraftAge] = useState<string | null>(null);
  const [ack, setAck] = useState<ResolutionAck | null>(null);

  useEffect(() => {
    setLastResolution(getLastResolution());

    const draft = getDraft();
    if (draft?.date) setDraftAge(formatDraftAge(draft.date));

    // Restore any existing ack from this browser session
    try {
      const stored = localStorage.getItem("muhasabah_resolution_ack") as ResolutionAck | null;
      if (stored) setAck(stored);
    } catch { /* noop */ }
  }, []);

  function handleAck(value: ResolutionAck) {
    setAck(value);
    try { localStorage.setItem("muhasabah_resolution_ack", value); } catch { /* noop */ }
  }

  const resolutionDate = lastResolution
    ? new Date(lastResolution.date).toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" })
    : null;

  const ACK_OPTIONS: { value: ResolutionAck; label: string; color: string }[] = [
    { value: "kept",      label: "I kept it",    color: "var(--accent)" },
    { value: "partial",   label: "Partially",    color: "var(--sand)" },
    { value: "struggled", label: "I struggled",  color: "var(--terracotta)" },
  ];

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-[480px] space-y-5">

        {/* Opening quote */}
        <div className="text-center mb-2">
          <p lang="ar" className="arabic text-3xl mb-3 leading-loose" style={{ color: "var(--text-secondary)" }}>
            حَاسِبُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُحَاسَبُوا
          </p>
          <p className="text-[12px] italic" style={{ color: "var(--text-tertiary)" }}>
            &ldquo;Account yourselves before you are held to account.&rdquo; — ʿUmar ibn al-Khaṭṭāb
          </p>
        </div>

        {/* Unfinished draft notice */}
        {hasDraft && (
          <div
            className="rounded-xl p-4"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
                Unfinished session
              </p>
              {draftAge && (
                <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                  Saved {draftAge}
                </p>
              )}
            </div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
              You left a session in progress. Would you like to continue where you left off?
            </p>
            <div className="flex gap-2">
              <button
                onClick={onResume}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
                style={{ background: "var(--accent)", color: "var(--surface-bg)" }}
              >
                Resume
              </button>
              <button
                onClick={onStart}
                className="px-4 py-2 rounded-lg text-sm transition-opacity hover:opacity-70"
                style={{ background: "var(--surface-card-alt)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
              >
                Start fresh
              </button>
            </div>
          </div>
        )}

        {/* Resolution check-in from last session */}
        {lastResolution && (
          <div
            className="rounded-xl p-5"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}
          >
            <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "var(--text-tertiary)" }}>
              Your resolution from {resolutionDate}
            </p>
            <p className="text-base italic leading-relaxed mb-4" style={{ color: "var(--text-primary)" }}>
              &ldquo;{lastResolution.text}&rdquo;
            </p>

            {ack ? (
              <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
                {ack === "kept"
                  ? "Alhamdulillah. May Allah increase you in steadfastness."
                  : ack === "partial"
                  ? "Effort counts. Bring it honestly to this session."
                  : "Struggling is part of the path. Bring it honestly to this session."}
              </p>
            ) : (
              <div>
                <p className="text-[12px] mb-3" style={{ color: "var(--text-tertiary)" }}>
                  How did you hold to this?
                </p>
                <div className="flex gap-2">
                  {ACK_OPTIONS.map(({ value, label, color }) => (
                    <button
                      key={value}
                      onClick={() => handleAck(value)}
                      className="flex-1 py-2 rounded-lg text-[12px] font-medium transition-opacity hover:opacity-80"
                      style={{
                        background: "var(--surface-card-alt)",
                        color,
                        border: `1px solid ${color}`,
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Begin button */}
        {!hasDraft && (
          <div className="space-y-2">
            <button
              onClick={onStart}
              className="w-full py-3.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
              style={{ background: "var(--accent)", color: "var(--surface-bg)" }}
            >
              Begin Muhāsabah
            </button>
            <p className="text-center text-[11px]" style={{ color: "var(--text-tertiary)" }}>
              Takes around 5 minutes
            </p>
          </div>
        )}

        {/* Back to hub */}
        <div className="text-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-[12px] transition-opacity hover:opacity-70"
            style={{ color: "var(--text-tertiary)" }}
          >
            ← Back to practices
          </button>
        </div>

      </div>
    </div>
  );
}
