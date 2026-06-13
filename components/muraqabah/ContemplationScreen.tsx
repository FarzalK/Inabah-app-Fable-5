"use client";
import { useState } from "react";
import type { AsmaEntry } from "@/lib/asma";
import { Label, PrimaryButton, GhostButton } from "@/components/ui";

const DURATIONS = [5, 10, 15, 20];

interface ContemplationScreenProps {
  name: AsmaEntry; onBegin: (durationMinutes: number, breathingEnabled: boolean) => void; onBack: () => void;
}

export default function ContemplationScreen({ name, onBegin, onBack }: ContemplationScreenProps) {
  const [duration, setDuration] = useState(10);
  const [breathingEnabled, setBreathingEnabled] = useState(false);

  return (
    <div>
      <Label>Before you begin</Label>
      <div className="text-center py-6 mb-4">
        <p lang="ar" className="arabic text-5xl mb-2" style={{ color: "var(--accent)", lineHeight: 1.3 }}>{name.arabic}</p>
        <p className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>{name.transliteration}</p>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>{name.meaning}</p>
      </div>

      {/* Ayah */}
      <div className="border-l-2 pl-4 py-2 mb-5 rounded-r-lg text-[13px] italic leading-relaxed"
        style={{ borderColor: "var(--accent)", background: "var(--accent-light)", color: "var(--text-secondary)" }}>
        "{name.ayah}"
        <p className="text-[11px] mt-1 not-italic" style={{ color: "var(--text-tertiary)" }}>— {name.ayahRef}</p>
      </div>

      {/* Scholarly note */}
      <div className="rounded-xl p-4 mb-5" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
        <Label>Scholarly note</Label>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{name.scholarlyNote}</p>
      </div>

      {/* Contemplation */}
      <div className="rounded-xl p-4 mb-6" style={{ background: "var(--surface-card)", border: "1px solid var(--accent)", borderWidth: "1px" }}>
        <Label>Before you sit</Label>
        <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--text-primary)" }}>{name.contemplation}</p>
      </div>

      {/* Duration */}
      <div className="mb-5">
        <Label>Session duration</Label>
        <div className="flex gap-2 mt-1">
          {DURATIONS.map((d) => (
            <button key={d} onClick={() => setDuration(d)}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                background: duration === d ? "var(--accent)" : "var(--surface-card-alt)",
                color: duration === d ? "var(--surface-bg)" : "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}>
              {d} min
            </button>
          ))}
        </div>
      </div>

      {/* Breathing opt-in */}
      <button type="button" onClick={() => setBreathingEnabled(!breathingEnabled)}
        className="w-full flex items-center gap-3 p-4 rounded-xl mb-6 text-left transition-opacity hover:opacity-80"
        style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
        <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors"
          style={{ background: breathingEnabled ? "var(--accent)" : "transparent", border: breathingEnabled ? "none" : "1.5px solid var(--border-mid)" }}>
          {breathingEnabled && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="var(--surface-bg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Enable breathing guide</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>A gentle rhythm to anchor your presence</p>
        </div>
      </button>

      <div className="flex gap-3">
        <PrimaryButton onClick={() => onBegin(duration, breathingEnabled)}>Begin session</PrimaryButton>
        <GhostButton onClick={onBack}>Back</GhostButton>
      </div>
    </div>
  );
}
