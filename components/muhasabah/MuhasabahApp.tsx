"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { SessionSummary, NafsStation } from "@/types";
import { CATEGORIES } from "@/lib/data";
import { saveSession, saveDraft, clearDraft, getDraft } from "@/lib/storage";
import { generateMuhasabahSession } from "@/lib/simulation";
import { createClient } from "@/lib/supabase/client";

import WelcomeScreen from "./WelcomeScreen";
import QuestionScreen from "./QuestionScreen";
import LoadingScreen from "./LoadingScreen";
import SummaryScreen from "./SummaryScreen";

type Screen = "welcome" | "question" | "loading" | "summary";

const FALLBACK_SUMMARY: SessionSummary = {
  categoryRatings: {},
  nafsRating: "Lawwāmah",
  reflection:
    "Your session has been recorded. Continue to strive — Allah sees your effort and intention.",
  pattern:
    "Reflect quietly on what stood out most from today. The act of accounting itself is an act of worship.",
  closingAyah:
    '"And whoever relies upon Allah — then He is sufficient for him." — At-Talaq 65:3',
};

interface MuhasabahAppProps {
  onComplete?: () => void;
  autoStart?: boolean;
  simulate?: boolean;
  targetStation?: NafsStation;
}

export default function MuhasabahApp({ onComplete, autoStart, simulate, targetStation }: MuhasabahAppProps) {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("welcome");
  const [visible, setVisible] = useState(true);
  const [sessionCategories, setSessionCategories] = useState(CATEGORIES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [sessionId, setSessionId] = useState("");
  const [hasDraft, setHasDraft] = useState(false);
  const didAutoStart = useRef(false);

  // Load user's active categories from their profile, then check for draft / auto-start
  useEffect(() => {
    localStorage.removeItem("muhasabah_api_key");

    async function init() {
      // Load active categories from Supabase profile
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      let activeCategories = CATEGORIES;

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("active_categories")
          .eq("id", user.id)
          .single();

        if (profile?.active_categories?.length) {
          activeCategories = CATEGORIES.filter((c) =>
            profile.active_categories!.includes(c.id)
          );
        }
      }

      const draft = getDraft();

      if (simulate && !didAutoStart.current) {
        didAutoStart.current = true;
        const { session } = generateMuhasabahSession(targetStation);
        const cats = CATEGORIES.filter((c) => session.categories.includes(c.id));
        setSessionCategories(cats);
        setSessionId(session.id);
        setSummary(session.summary);
        await saveSession(session);
        setScreen("summary");
        setVisible(true);
        return;
      }

      if (autoStart && !didAutoStart.current) {
        didAutoStart.current = true;
        if (draft) {
          const cats = CATEGORIES.filter((c) => draft.categoryIds.includes(c.id));
          setSessionCategories(cats);
          setSessionId(draft.sessionId);
          setAnswers(draft.answers);
          setCurrentIndex(draft.currentIndex);
          setScreen("question");
        } else {
          const id = crypto.randomUUID();
          setSessionCategories(activeCategories);
          setSessionId(id);
          setScreen("question");
        }
      } else {
        setSessionCategories(activeCategories);
        setHasDraft(!!draft);
      }
    }

    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fade transition ──────────────────────────────────────────────────────
  function transitionTo(next: Screen) {
    setVisible(false);
    setTimeout(() => {
      setScreen(next);
      setVisible(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 250);
  }

  // ── Resume draft ─────────────────────────────────────────────────────────
  function resumeDraft() {
    const draft = getDraft();
    if (!draft) return;
    const cats = CATEGORIES.filter((c) => draft.categoryIds.includes(c.id));
    setSessionCategories(cats);
    setSessionId(draft.sessionId);
    setAnswers(draft.answers);
    setCurrentIndex(draft.currentIndex);
    transitionTo("question");
    setHasDraft(false);
  }

  // ── Session start ────────────────────────────────────────────────────────
  function startSession() {
    const id = crypto.randomUUID();
    setCurrentIndex(0);
    setAnswers({});
    setSummary(null);
    setSessionId(id);
    clearDraft();
    transitionTo("question");
  }

  // ── Auto-save draft on every answer ─────────────────────────────────────
  function persistDraft(updatedAnswers: Record<string, string>, index: number) {
    saveDraft({
      sessionId,
      categoryIds: sessionCategories.map((c) => c.id),
      answers: updatedAnswers,
      currentIndex: index,
      date: new Date().toISOString(),
    });
  }

  // ── Question navigation ──────────────────────────────────────────────────
  function handleAnswer(val: string) {
    const cat = sessionCategories[currentIndex];
    const updated = { ...answers, [cat.id]: val };
    setAnswers(updated);
    persistDraft(updated, currentIndex);
  }

  function advanceWith(updatedAnswers: Record<string, string>) {
    setAnswers(updatedAnswers);
    persistDraft(updatedAnswers, currentIndex + 1);
    if (currentIndex < sessionCategories.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      transitionTo("loading");
      runAI(updatedAnswers);
    }
  }

  function handleNext() {
    const cat = sessionCategories[currentIndex];
    advanceWith({ ...answers, [cat.id]: answers[cat.id] ?? "" });
  }

  function handleSkip() {
    const cat = sessionCategories[currentIndex];
    advanceWith({ ...answers, [cat.id]: "" });
  }

  function handleBack() {
    if (currentIndex === 0) {
      transitionTo("welcome");
    } else {
      setCurrentIndex((i) => i - 1);
    }
  }

  // ── AI call ──────────────────────────────────────────────────────────────
  const runAI = useCallback(
    async (finalAnswers: Record<string, string>) => {
      // Include resolution follow-through if the user acknowledged it
      let resolutionContext = "";
      try {
        const ack = localStorage.getItem("muhasabah_resolution_ack");
        const resolution = localStorage.getItem("muhasabah_resolution");
        if (ack && resolution) {
          const { text } = JSON.parse(resolution) as { text: string };
          const ackLabel = ack === "kept" ? "kept it" : ack === "partial" ? "partially kept it" : "struggled with it";
          resolutionContext = `The user's previous resolution was: "${text}". They said they ${ackLabel}.\n\n`;
        }
        localStorage.removeItem("muhasabah_resolution_ack");
      } catch { /* noop */ }

      const answerSummary = resolutionContext + sessionCategories
        .map(
          (c) =>
            `Category: ${c.name}\nQuestion: ${c.prompt}\nAnswer: "${finalAnswers[c.id] || "(skipped)"}"`
        )
        .join("\n\n");

      try {
        const res = await fetch("/api/reflect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answerSummary,
            categoryIds: sessionCategories.map((c) => c.id),
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          console.error("API error:", errData);
          throw new Error(errData.error || "API error");
        }

        const data: SessionSummary = await res.json();
        setSummary(data);

        await saveSession({
          id: sessionId,
          date: new Date().toISOString(),
          categories: sessionCategories.map((c) => c.id),
          answers: finalAnswers,
          summary: data,
        });

        transitionTo("summary");
      } catch (e) {
        console.error("Reflection failed:", e);
        setSummary(FALLBACK_SUMMARY);
        await saveSession({
          id: sessionId,
          date: new Date().toISOString(),
          categories: sessionCategories.map((c) => c.id),
          answers: finalAnswers,
          summary: FALLBACK_SUMMARY,
        });
        transitionTo("summary");
      }
    },
    [sessionCategories, sessionId]
  );

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.25s ease" }}>
      {screen === "welcome" && (
        <WelcomeScreen
          onStart={startSession}
          hasDraft={hasDraft}
          onResume={resumeDraft}
        />
      )}

      {screen === "question" && (
        <QuestionScreen
          category={sessionCategories[currentIndex]}
          index={currentIndex}
          total={sessionCategories.length}
          answer={answers[sessionCategories[currentIndex]?.id] ?? ""}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onBack={handleBack}
          onSkip={handleSkip}
        />
      )}

      {screen === "loading" && <LoadingScreen />}

      {screen === "summary" && summary && (
        <SummaryScreen
          sessionId={sessionId}
          categories={sessionCategories}
          summary={summary}
          onRestart={() => router.push("/dashboard")}
        />
      )}
    </div>
  );
}
