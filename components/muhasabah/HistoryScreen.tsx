"use client";

import { useState, useEffect } from "react";
import type { SavedSession } from "@/types";
import { getSessions } from "@/lib/storage";
import { getMuraqabahSessions, type MuraqabahSession } from "@/lib/muraqabah-storage";
import { Label, HeartRatingPill, NafsPill, GhostButton } from "@/components/ui";
import { ASMA_AL_HUSNA } from "@/lib/asma";

interface HistoryScreenProps { onBack: () => void; }
type Tab = "muhasabah" | "muraqabah";

function Card({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <div
      className={`rounded-xl p-4 ${onClick ? "cursor-pointer" : ""}`}
      style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      className={`transition-transform ${open ? "rotate-180" : ""}`}
      style={{ color: "var(--text-tertiary)" }}>
      <polyline points="3,6 8,11 13,6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function HistoryScreen({ onBack }: HistoryScreenProps) {
  const [tab, setTab] = useState<Tab>("muhasabah");
  const [muhasabahSessions, setMuhasabahSessions] = useState<SavedSession[]>([]);
  const [muraqabahSessions, setMuraqabahSessions] = useState<MuraqabahSession[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setMuhasabahSessions(await getSessions());
      setMuraqabahSessions(await getMuraqabahSessions());
    }
    load();
  }, []);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <Label>Session history</Label>
          <h2 className="text-xl font-medium" style={{ color: "var(--text-primary)" }}>Past sessions</h2>
        </div>
        <GhostButton onClick={onBack}>Back</GhostButton>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(["muhasabah", "muraqabah"] as Tab[]).map((t) => (
          <button key={t} onClick={() => { setTab(t); setExpanded(null); }}
            className="px-4 py-1.5 rounded-full text-[13px] transition-opacity hover:opacity-80"
            style={{
              background: tab === t ? "var(--accent)" : "var(--surface-card-alt)",
              color: tab === t ? "var(--surface-bg)" : "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}>
            {t === "muhasabah" ? `Muhāsabah (${muhasabahSessions.length})` : `Murāqabah (${muraqabahSessions.length})`}
          </button>
        ))}
      </div>

      {/* Muhasabah */}
      {tab === "muhasabah" && (
        muhasabahSessions.length === 0
          ? <p className="text-sm py-6 text-center" style={{ color: "var(--text-tertiary)" }}>No Muhāsabah sessions yet.</p>
          : <div className="space-y-3 pb-8">
              {muhasabahSessions.map((session) => {
                const isOpen = expanded === session.id;
                return (
                  <Card key={session.id} onClick={() => setExpanded(isOpen ? null : session.id)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{formatDate(session.date)}</p>
                        <div className="mt-1"><NafsPill station={session.summary.nafsRating} /></div>
                      </div>
                      <Chevron open={isOpen} />
                    </div>
                    {isOpen && (
                      <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                        <Label>Categories</Label>
                        <div className="space-y-2 mb-4">
                          {session.categories.map((catId) => {
                            const rating = session.summary.categoryRatings[catId];
                            return (
                              <div key={catId} className="flex items-center justify-between">
                                <span className="text-sm capitalize" style={{ color: "var(--text-secondary)" }}>{catId}</span>
                                {rating ? <HeartRatingPill rating={rating} /> : <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>—</span>}
                              </div>
                            );
                          })}
                        </div>
                        <Label>Reflection</Label>
                        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>{session.summary.reflection}</p>
                        <Label>Pattern</Label>
                        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>{session.summary.pattern}</p>
                        {session.summary.closingAyah && (
                          <div className="border-l-2 pl-3 py-1.5 text-[13px] italic rounded-r mb-3"
                            style={{ borderColor: "var(--accent)", background: "var(--accent-light)", color: "var(--text-secondary)" }}>
                            {session.summary.closingAyah}
                          </div>
                        )}
                        {session.resolution && (
                          <>
                            <Label>Resolution</Label>
                            <p className="text-sm italic leading-relaxed" style={{ color: "var(--text-secondary)" }}>"{session.resolution}"</p>
                          </>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
      )}

      {/* Muraqabah */}
      {tab === "muraqabah" && (
        muraqabahSessions.length === 0
          ? <p className="text-sm py-6 text-center" style={{ color: "var(--text-tertiary)" }}>No Murāqabah sessions yet.</p>
          : <div className="space-y-3 pb-8">
              {muraqabahSessions.map((session) => {
                const isOpen = expanded === session.id;
                const nameEntry = ASMA_AL_HUSNA.find((a) => a.number === session.nameNumber);
                return (
                  <Card key={session.id} onClick={() => setExpanded(isOpen ? null : session.id)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{formatDate(session.date)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{session.durationMinutes} min</span>
                          <span style={{ color: "var(--border-mid)" }}>·</span>
                          <span className="text-sm font-medium" style={{ color: "var(--terracotta)" }}>{session.nameTransliteration}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                            style={{ background: "var(--terracotta-light)", color: "var(--terracotta)" }}>
                            {session.heartState}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {nameEntry && <span lang="ar" className="arabic text-xl" style={{ color: "var(--border-mid)" }}>{nameEntry.arabic}</span>}
                        <Chevron open={isOpen} />
                      </div>
                    </div>
                    {isOpen && (
                      <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                        {nameEntry && (
                          <>
                            <Label>Name contemplated</Label>
                            <div className="flex items-baseline gap-3 mb-4">
                              <span lang="ar" className="arabic text-2xl" style={{ color: "var(--terracotta)" }}>{nameEntry.arabic}</span>
                              <div>
                                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{nameEntry.transliteration}</p>
                                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{nameEntry.meaning}</p>
                              </div>
                            </div>
                            <div className="border-l-2 pl-3 py-1.5 text-[13px] italic rounded-r mb-4"
                              style={{ borderColor: "var(--terracotta)", background: "var(--terracotta-light)", color: "var(--text-secondary)" }}>
                              "{nameEntry.ayah}" — {nameEntry.ayahRef}
                            </div>
                          </>
                        )}
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div>
                            <Label>Duration</Label>
                            <p className="text-sm" style={{ color: "var(--text-primary)" }}>{session.durationMinutes} min</p>
                          </div>
                          <div>
                            <Label>Heart state</Label>
                            <span className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                              style={{ background: "var(--terracotta-light)", color: "var(--terracotta)" }}>
                              {session.heartState}
                            </span>
                          </div>
                          <div>
                            <Label>Breathing</Label>
                            <p className="text-sm" style={{ color: "var(--text-primary)" }}>{session.breathingUsed ? "Used" : "Not used"}</p>
                          </div>
                        </div>
                        {session.note && (
                          <>
                            <Label>Note</Label>
                            <p className="text-sm italic leading-relaxed" style={{ color: "var(--text-secondary)" }}>"{session.note}"</p>
                          </>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
      )}
    </div>
  );
}
