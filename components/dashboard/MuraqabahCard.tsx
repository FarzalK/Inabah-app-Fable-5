"use client";

import { useEffect, useState } from "react";
import { getMuraqabahSessions, type MuraqabahSession } from "@/lib/muraqabah-storage";
import { ASMA_AL_HUSNA } from "@/lib/asma";
import { Label } from "@/components/ui";

export default function MuraqabahCard() {
  const [sessions, setSessions] = useState<MuraqabahSession[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { getMuraqabahSessions().then((s) => { setSessions(s); setMounted(true); }); }, []);
  if (!mounted) return null;

  if (sessions.length === 0) {
    return (
      <div className="rounded-xl p-5" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
        <Label>Murāqabah</Label>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Begin your first Murāqabah session to see your contemplation history here.
        </p>
      </div>
    );
  }

  const last = sessions[0];
  const lastDate = new Date(last.date).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
  const totalMinutes = sessions.reduce((a, s) => a + s.durationMinutes, 0);
  const nameCounts: Record<number, number> = {};
  sessions.forEach((s) => { nameCounts[s.nameNumber] = (nameCounts[s.nameNumber] ?? 0) + 1; });
  const topNameNum = Object.entries(nameCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topName = ASMA_AL_HUSNA.find((a) => a.number === Number(topNameNum));
  const lastNameEntry = ASMA_AL_HUSNA.find((a) => a.number === last.nameNumber);

  return (
    <div className="rounded-xl p-5" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between mb-3">
        <Label>Murāqabah</Label>
        <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{sessions.length} sessions</span>
      </div>
      <div className="flex items-center justify-between mb-3 pb-3" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2">
          {lastNameEntry && (
            <span lang="ar" className="arabic text-xl" style={{ color: "var(--terracotta)" }}>{lastNameEntry.arabic}</span>
          )}
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{last.nameTransliteration}</p>
            <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{lastDate} · {last.durationMinutes} min</p>
          </div>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full font-medium"
          style={{ background: "var(--terracotta-light)", color: "var(--terracotta)" }}>
          {last.heartState}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{totalMinutes}</p>
          <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>mins total</p>
        </div>
        <div>
          <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{topName?.transliteration ?? "—"}</p>
          <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>most used</p>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{sessions.length}</p>
          <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>total</p>
        </div>
      </div>
    </div>
  );
}
