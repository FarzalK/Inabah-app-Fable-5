"use client";
import { useState, useMemo } from "react";
import { ASMA_AL_HUSNA, type AsmaEntry, type NameSuggestion } from "@/lib/asma";
import { Label, PrimaryButton } from "@/components/ui";

interface NameSelectScreenProps {
  suggestions: NameSuggestion[];
  onSelect: (name: AsmaEntry) => void;
}

export default function NameSelectScreen({ suggestions, onSelect }: NameSelectScreenProps) {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"suggest" | "browse">("suggest");
  const [selected, setSelected] = useState<AsmaEntry | null>(suggestions[0]?.entry ?? null);

  const filtered = useMemo(() => {
    if (!search.trim()) return ASMA_AL_HUSNA;
    const q = search.toLowerCase();
    return ASMA_AL_HUSNA.filter(
      (a) => a.transliteration.toLowerCase().includes(q) || a.meaning.toLowerCase().includes(q) || a.arabic.includes(q)
    );
  }, [search]);

  return (
    <div>
      <Label>Murāqabah session</Label>
      <h2 className="text-xl font-medium mb-1" style={{ color: "var(--text-primary)" }}>Choose a Name of Allah</h2>
      <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        You will sit with this Name — contemplating its meaning and its claim on your heart.
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(["suggest", "browse"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className="px-4 py-1.5 rounded-full text-[13px] transition-opacity hover:opacity-80"
            style={{
              background: mode === m ? "var(--accent)" : "var(--surface-card-alt)",
              color: mode === m ? "var(--surface-bg)" : "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}>
            {m === "suggest" ? "Suggested for you" : "Browse all 99"}
          </button>
        ))}
      </div>

      {/* Suggested */}
      {mode === "suggest" && (
        <div className="space-y-2">
          {suggestions.length > 0 ? (
            <>
              {/* Shared reason label */}
              <p className="text-[11px] mb-3" style={{ color: "var(--text-tertiary)" }}>
                {suggestions[0].reason}
              </p>
              {suggestions.map(({ entry }) => (
                <NameCard
                  key={entry.number}
                  entry={entry}
                  isSelected={selected?.number === entry.number}
                  onSelect={() => setSelected(entry)}
                />
              ))}
            </>
          ) : (
            <p className="text-sm mb-4" style={{ color: "var(--text-tertiary)" }}>
              Complete a Muhāsabah session to receive a contextual suggestion.
            </p>
          )}
        </div>
      )}

      {/* Browse */}
      {mode === "browse" && (
        <div>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or meaning..."
            aria-label="Search names of Allah"
            className="w-full rounded-lg px-3 py-2.5 text-sm mb-4"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-mid)", color: "var(--text-primary)" }}
          />
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {filtered.map((entry) => (
              <NameCard key={entry.number} entry={entry}
                isSelected={selected?.number === entry.number}
                onSelect={() => setSelected(entry)} compact />
            ))}
          </div>
        </div>
      )}

      {/* Proceed */}
      {selected && (
        <div className="mt-6 pt-4 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{selected.transliteration}</p>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{selected.meaning}</p>
          </div>
          <PrimaryButton onClick={() => onSelect(selected)}>Begin with this Name →</PrimaryButton>
        </div>
      )}
    </div>
  );
}

function NameCard({ entry, isSelected, onSelect, compact = false }: {
  entry: AsmaEntry; isSelected: boolean; onSelect: () => void; compact?: boolean;
}) {
  return (
    <button type="button" onClick={onSelect}
      className="w-full text-left rounded-xl p-4 transition-all"
      style={{
        background: isSelected ? "var(--accent-light)" : "var(--surface-card)",
        border: isSelected ? "1px solid var(--accent)" : "1px solid var(--border)",
      }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{entry.number}.</span>
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{entry.transliteration}</span>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{entry.meaning}</span>
          </div>
          {!compact && (
            <p className="text-[13px] leading-relaxed mt-1" style={{ color: "var(--text-secondary)" }}>
              {entry.contemplation}
            </p>
          )}
        </div>
        <span lang="ar" className="arabic text-xl flex-shrink-0" style={{ color: "var(--text-tertiary)" }}>{entry.arabic}</span>
      </div>
    </button>
  );
}
