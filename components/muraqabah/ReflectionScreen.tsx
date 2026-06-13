"use client";
import { useState } from "react";
import type { AsmaEntry } from "@/lib/asma";
import type { HeartState } from "@/lib/muraqabah-storage";
import { Label, PrimaryButton } from "@/components/ui";

const HEART_STATES: { state: HeartState; emoji: string; desc: string }[] = [
  { state: "Present",    emoji: "🌿", desc: "I felt connected and aware" },
  { state: "Peaceful",   emoji: "🌊", desc: "A sense of calm and stillness" },
  { state: "Tearful",    emoji: "💧", desc: "Moved to emotion before Allah" },
  { state: "Distracted", emoji: "🌬️", desc: "My mind wandered frequently" },
  { state: "Restless",   emoji: "🔥", desc: "I found it hard to settle" },
  { state: "Numb",       emoji: "🪨", desc: "My heart felt closed or distant" },
];

interface ReflectionScreenProps {
  name: AsmaEntry; durationMinutes: number;
  onComplete: (heartState: HeartState, note: string) => void;
}

export default function ReflectionScreen({ name, durationMinutes, onComplete }: ReflectionScreenProps) {
  const [selected, setSelected] = useState<HeartState | null>(null);
  const [note, setNote] = useState("");

  return (
    <div>
      <div className="text-center mb-6">
        <p lang="ar" className="arabic text-3xl mb-1" style={{ color: "var(--accent)" }}>{name.arabic}</p>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>{durationMinutes} minutes with {name.transliteration}</p>
      </div>

      <Label>How was your heart?</Label>
      <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        Be honest. All states are valid before Allah — even distraction is something to bring to Him.
      </p>

      <div className="grid grid-cols-2 gap-2 mb-5">
        {HEART_STATES.map(({ state, emoji, desc }) => (
          <button key={state} type="button" onClick={() => setSelected(state)}
            className="p-3 rounded-xl text-left transition-all"
            style={{
              background: selected === state ? "var(--accent-light)" : "var(--surface-card)",
              border: selected === state ? "1px solid var(--accent)" : "1px solid var(--border)",
            }}>
            <span className="text-lg">{emoji}</span>
            <p className="text-sm font-medium mt-1" style={{ color: "var(--text-primary)" }}>{state}</p>
            <p className="text-[11px] leading-tight mt-0.5" style={{ color: "var(--text-tertiary)" }}>{desc}</p>
          </button>
        ))}
      </div>

      <Label>A note (optional)</Label>
      <textarea value={note} onChange={(e) => setNote(e.target.value)}
        placeholder="What came up during the session? A thought, a feeling, something you want to remember..."
        className="w-full min-h-[80px] rounded-lg px-3 py-2.5 text-sm resize-y leading-relaxed mb-5"
        style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border-mid)", color: "var(--text-primary)" }}
      />

      <PrimaryButton onClick={() => selected && onComplete(selected, note)} disabled={!selected} fullWidth>
        Complete session
      </PrimaryButton>
    </div>
  );
}
