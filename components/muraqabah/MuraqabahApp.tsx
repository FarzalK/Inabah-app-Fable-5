"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AsmaEntry } from "@/lib/asma";
import { ASMA_AL_HUSNA, getNameSuggestions, type NameSuggestion } from "@/lib/asma";
import type { HeartState, MuraqabahSession } from "@/lib/muraqabah-storage";
import { saveMuraqabahSession, setActiveName, getMuraqabahSessions } from "@/lib/muraqabah-storage";
import { getSessions } from "@/lib/storage";
import { generateMuraqabahSession } from "@/lib/simulation";

import NameSelectScreen from "./NameSelectScreen";
import ContemplationScreen from "./ContemplationScreen";
import SessionScreen from "./SessionScreen";
import ReflectionScreen from "./ReflectionScreen";

type Screen = "select" | "contemplate" | "session" | "reflection" | "complete" | "simulated";

interface MuraqabahAppProps {
  simulate?: boolean;
}

export default function MuraqabahApp({ simulate }: MuraqabahAppProps) {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("select");
  const [visible, setVisible] = useState(true);
  const [selectedName, setSelectedName] = useState<AsmaEntry | null>(null);
  const [simulatedSession, setSimulatedSession] = useState<MuraqabahSession | null>(null);
  const [duration, setDuration] = useState(10);
  const [breathingEnabled, setBreathingEnabled] = useState(false);
  const [suggestions, setSuggestions] = useState<NameSuggestion[]>([]);
  const [completedSessionCount, setCompletedSessionCount] = useState(0);

  useEffect(() => {
    async function init() {
      if (simulate) {
        const session = generateMuraqabahSession();
        await saveMuraqabahSession(session);
        setSimulatedSession(session);
        const name = ASMA_AL_HUSNA.find((a) => a.number === session.nameNumber) ?? ASMA_AL_HUSNA[0];
        setSelectedName(name);
        setDuration(session.durationMinutes);
        setScreen("simulated");
        return;
      }
      const sessions = await getSessions();
      const pattern = sessions[0]?.summary?.pattern ?? "";
      setSuggestions(getNameSuggestions(pattern, 3));
    }
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function transitionTo(next: Screen) {
    setVisible(false);
    setTimeout(() => {
      setScreen(next);
      setVisible(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 250);
  }

  function handleNameSelect(name: AsmaEntry) {
    setSelectedName(name);
    transitionTo("contemplate");
  }

  function handleBeginSession(durationMinutes: number, breathing: boolean) {
    setDuration(durationMinutes);
    setBreathingEnabled(breathing);
    if (selectedName) setActiveName(selectedName.number);
    transitionTo("session");
  }

  function handleSessionComplete() {
    transitionTo("reflection");
  }

  async function handleReflectionComplete(heartState: HeartState, note: string) {
    if (!selectedName) return;
    await saveMuraqabahSession({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      nameNumber: selectedName.number,
      nameTransliteration: selectedName.transliteration,
      durationMinutes: duration,
      heartState,
      note: note || undefined,
      breathingUsed: breathingEnabled,
    });
    // Get updated count for the closing screen
    const allSessions = await getMuraqabahSessions();
    setCompletedSessionCount(allSessions.length);
    transitionTo("complete");
  }

  return (
    <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.25s ease" }}>
      {screen === "select" && (
        <NameSelectScreen suggestions={suggestions} onSelect={handleNameSelect} />
      )}
      {screen === "contemplate" && selectedName && (
        <ContemplationScreen name={selectedName} onBegin={handleBeginSession} onBack={() => transitionTo("select")} />
      )}
      {screen === "session" && selectedName && (
        <SessionScreen name={selectedName} durationMinutes={duration} breathingEnabled={breathingEnabled} onComplete={handleSessionComplete} />
      )}
      {screen === "reflection" && selectedName && (
        <ReflectionScreen name={selectedName} durationMinutes={duration} onComplete={handleReflectionComplete} />
      )}
      {screen === "complete" && selectedName && (
        <CompleteScreen
          name={selectedName}
          durationMinutes={duration}
          sessionCount={completedSessionCount}
          onDone={() => router.push("/dashboard")}
        />
      )}
      {screen === "simulated" && selectedName && simulatedSession && (
        <SimulatedMuraqabahSummary session={simulatedSession} name={selectedName} onDone={() => router.push("/dashboard")} />
      )}
    </div>
  );
}

// ── Closing screen ────────────────────────────────────────────────────────────

function CompleteScreen({
  name, durationMinutes, sessionCount, onDone,
}: { name: AsmaEntry; durationMinutes: number; sessionCount: number; onDone: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-10 text-center">
      <p lang="ar" className="arabic mb-3" style={{ fontSize: "60px", color: "var(--terracotta)", lineHeight: 1.3 }}>
        {name.arabic}
      </p>
      <p className="text-base font-medium mb-1" style={{ color: "var(--text-primary)" }}>
        {name.transliteration}
      </p>
      <p className="text-sm mb-8" style={{ color: "var(--text-tertiary)" }}>
        {durationMinutes} minutes · Session {sessionCount}
      </p>

      <div
        className="max-w-[320px] mx-auto mb-8 px-5 py-4 rounded-xl"
        style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}
      >
        <p className="text-[13px] italic leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          &ldquo;Verily, in the remembrance of Allah do hearts find rest.&rdquo;
        </p>
        <p className="text-[11px] mt-2" style={{ color: "var(--text-tertiary)" }}>— Ar-Raʿd 13:28</p>
      </div>

      <button
        onClick={onDone}
        className="px-8 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
        style={{ background: "var(--terracotta)", color: "var(--surface-bg)" }}
      >
        Return to practices
      </button>
    </div>
  );
}

// ── Simulated summary card ────────────────────────────────────────────────────
import { ASMA_AL_HUSNA as ASMA } from "@/lib/asma";

function SimulatedMuraqabahSummary({
  session, name, onDone,
}: { session: MuraqabahSession; name: AsmaEntry; onDone: () => void }) {
  return (
    <div>
      <div className="text-center mb-6">
        <p lang="ar" className="arabic text-4xl mb-1" style={{ color: "var(--terracotta)" }}>{name.arabic}</p>
        <p className="text-base font-medium" style={{ color: "var(--text-primary)" }}>{name.transliteration}</p>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>{name.meaning}</p>
      </div>

      <div className="rounded-xl p-5 mb-4 space-y-3" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--text-tertiary)" }}>Simulated session</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{session.durationMinutes} minutes · {session.breathingUsed ? "with breathing guide" : "no breathing guide"}</p>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full font-medium"
            style={{ background: "color-mix(in srgb, var(--terracotta) 12%, transparent)", color: "var(--terracotta)" }}>
            {session.heartState}
          </span>
        </div>

        <div className="border-l-2 pl-4 py-2 rounded-r text-[13px] italic leading-relaxed"
          style={{ borderColor: "var(--terracotta)", background: "var(--terracotta-light)", color: "var(--text-secondary)" }}>
          &ldquo;{name.ayah}&rdquo; — {name.ayahRef}
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--text-tertiary)" }}>Scholarly note</p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{name.scholarlyNote}</p>
        </div>

        {session.note && (
          <div className="rounded-lg px-3 py-2" style={{ background: "var(--surface-card-alt)", borderLeft: "2px solid var(--terracotta)" }}>
            <p className="text-[10px] mb-0.5" style={{ color: "var(--text-tertiary)" }}>Simulated note</p>
            <p className="text-sm italic leading-relaxed" style={{ color: "var(--text-secondary)" }}>&ldquo;{session.note}&rdquo;</p>
          </div>
        )}
      </div>

      <button onClick={onDone} className="w-full py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
        style={{ background: "var(--terracotta)", color: "var(--surface-bg)" }}>
        Return to dashboard
      </button>
    </div>
  );
}

// Keep ASMA import used in SimulatedMuraqabahSummary (suppresses lint warning)
void ASMA;
