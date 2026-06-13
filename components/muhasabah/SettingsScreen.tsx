"use client";
import { CATEGORIES } from "@/lib/data";
import { Label, PrimaryButton, GhostButton } from "@/components/ui";

interface SettingsScreenProps {
  activeIds: string[]; onToggle: (id: string) => void;
  onStart: () => void; onBack: () => void;
}

export default function SettingsScreen({ activeIds, onToggle, onStart, onBack }: SettingsScreenProps) {
  return (
    <div>
      <Label>Session categories</Label>
      <h2 className="text-xl font-medium mb-1" style={{ color: "var(--text-primary)" }}>Choose what to reflect on</h2>
      <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        All six are active by default. Toggle any off for today&apos;s session.
      </p>
      <div className="rounded-xl mb-5 overflow-hidden" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
        {CATEGORIES.map((cat, i) => {
          const checked = activeIds.includes(cat.id);
          return (
            <button key={cat.id} type="button" onClick={() => onToggle(cat.id)}
              className="w-full flex items-center gap-3 py-3 px-4 text-left transition-opacity hover:opacity-80"
              style={{ borderBottom: i < CATEGORIES.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div className="w-[18px] h-[18px] rounded flex items-center justify-center flex-shrink-0 transition-colors"
                style={{ background: checked ? "var(--accent)" : "transparent", border: checked ? "none" : "1.5px solid var(--border-mid)" }}>
                {checked && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="var(--surface-bg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{cat.name}</p>
                <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>{cat.sub}</p>
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex gap-3">
        <PrimaryButton onClick={onStart}>Start with these</PrimaryButton>
        <GhostButton onClick={onBack}>Back</GhostButton>
      </div>
    </div>
  );
}
