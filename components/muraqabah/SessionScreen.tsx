"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import type { AsmaEntry } from "@/lib/asma";

const WHISPERS = [
  "He is closer to you than your jugular vein.",
  "Return to the Name. Allah is present.",
  "Let the heart be still.",
  "He sees what no one else sees.",
  "You are before the Most High.",
  "He hears the silent prayer of the heart.",
  "Nothing is hidden from Al-Baseer.",
  "Rest in His presence.",
  "He is Al-Latif — reaching you in ways you cannot perceive.",
  "Your breath is His gift. Receive it with awareness.",
  "He knows what you carry. Place it before Him.",
  "The heart that remembers Allah finds rest.",
];

interface SessionScreenProps {
  name: AsmaEntry; durationMinutes: number;
  breathingEnabled: boolean; onComplete: () => void;
}

export default function SessionScreen({ name, durationMinutes, breathingEnabled, onComplete }: SessionScreenProps) {
  const totalSeconds = durationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [whisper, setWhisper] = useState<string | null>(null);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathProgress, setBreathProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const whisperIndex = useRef(0);
  const whisperTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const breathTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    if (secondsLeft <= 0) { onComplete(); return; }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, paused, onComplete]);

  // Named function expression so the recursive self-reference resolves to the
  // function's own binding rather than the not-yet-declared const.
  const scheduleWhisper = useCallback(function schedule() {
    whisperTimer.current = setTimeout(() => {
      const w = WHISPERS[whisperIndex.current % WHISPERS.length];
      whisperIndex.current++;
      setWhisper(w);
      setTimeout(() => { setWhisper(null); schedule(); }, 8000);
    }, 150000);
  }, []);

  useEffect(() => {
    const first = setTimeout(() => {
      setWhisper(WHISPERS[0]);
      whisperIndex.current = 1;
      setTimeout(() => { setWhisper(null); scheduleWhisper(); }, 8000);
    }, 90000);
    return () => { clearTimeout(first); if (whisperTimer.current) clearTimeout(whisperTimer.current); };
  }, [scheduleWhisper]);

  useEffect(() => {
    if (!breathingEnabled) return;
    let phase: "inhale" | "hold" | "exhale" = "inhale";
    let phaseSeconds = 0;
    const PHASES: Record<string, number> = { inhale: 4, hold: 2, exhale: 6 };
    breathTimer.current = setInterval(() => {
      if (paused) return;
      phaseSeconds++;
      setBreathProgress(phaseSeconds / PHASES[phase]);
      if (phaseSeconds >= PHASES[phase]) {
        phaseSeconds = 0;
        phase = phase === "inhale" ? "hold" : phase === "hold" ? "exhale" : "inhale";
        setBreathPhase(phase);
        setBreathProgress(0);
      }
    }, 1000);
    return () => { if (breathTimer.current) clearInterval(breathTimer.current); };
  }, [breathingEnabled, paused]);

  const pct = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const BREATH_LABELS: Record<string, string> = { inhale: "Breathe in", hold: "Hold", exhale: "Breathe out" };

  return (
    <div className="flex flex-col items-center justify-between min-h-[70vh] py-8">
      {/* Progress bar */}
      <div className="w-full">
        <div className="h-[3px] rounded-full" style={{ background: "var(--border)" }}>
          <div className="h-[3px] rounded-full" style={{ width: `${pct}%`, background: "var(--accent)", transition: "width 1s linear" }}/>
        </div>
      </div>

      {/* Name */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-8">
        <p lang="ar" className="arabic mb-4" style={{ fontSize: "64px", color: "var(--accent)", lineHeight: 1.3 }}>{name.arabic}</p>
        <p className="text-base font-medium mb-1" style={{ color: "var(--text-secondary)" }}>{name.transliteration}</p>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>{name.meaning}</p>
        <div className="mt-8 max-w-xs" style={{ opacity: whisper ? 1 : 0, transition: "opacity 2s ease" }}>
          <p className="text-sm italic leading-relaxed" style={{ color: "var(--text-secondary)" }}>{whisper ?? "‎"}</p>
        </div>
      </div>

      {/* Breathing guide */}
      {breathingEnabled && (
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-16 h-16 mb-2">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="var(--border)" strokeWidth="2"/>
              <circle cx="32" cy="32" r="28" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - breathProgress)}`}
                transform="rotate(-90 32 32)" style={{ transition: "stroke-dashoffset 1s linear" }}/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full" style={{
                width: `${16 + breathProgress * 16}px`, height: `${16 + breathProgress * 16}px`,
                background: "var(--accent)", opacity: 0.3, transition: "all 1s ease",
              }}/>
            </div>
          </div>
          <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>{BREATH_LABELS[breathPhase]}</p>
        </div>
      )}

      {/* Timer + controls */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-2xl font-medium tabular-nums" style={{ color: "var(--text-secondary)" }}>
          {mins}:{secs.toString().padStart(2, "0")}
        </p>
        <div className="flex gap-3">
          {[{ label: paused ? "Resume" : "Pause", action: () => setPaused((p) => !p) },
            { label: "End session", action: onComplete }].map(({ label, action }) => (
            <button key={label} onClick={action} aria-label={label}
              className="px-5 py-2.5 rounded-lg text-[13px] transition-opacity hover:opacity-70"
              style={{ background: "var(--surface-card)", border: "1px solid var(--border-mid)", color: "var(--text-secondary)" }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
