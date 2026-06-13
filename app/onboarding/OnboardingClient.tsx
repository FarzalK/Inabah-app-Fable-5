"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/data";

// ── Question definitions ──────────────────────────────────────────────────────

interface Question {
  id: string;
  categoryId?: string; // maps to a category — undefined = meta question
  text: string;
  lowLabel: string;
  highLabel: string;
  valueLabels: [string, string, string, string, string]; // labels for values 1–5
}

const QUESTIONS: Question[] = [
  {
    id: "discipline",
    text: "How consistent are you with daily spiritual practices right now?",
    lowLabel: "No routine",
    highLabel: "Very consistent",
    valueLabels: ["No routine", "Barely consistent", "Some consistency", "Fairly consistent", "Very consistent"],
  },
  {
    id: "salah",
    categoryId: "salah",
    text: "How often do you feel fully present and attentive during your prayers?",
    lowLabel: "Almost never",
    highLabel: "Almost always",
    valueLabels: ["Almost never", "Rarely", "Sometimes", "Usually", "Almost always"],
  },
  {
    id: "dhikr",
    categoryId: "dhikr",
    text: "How often does your heart turn to Allah's remembrance outside of salah?",
    lowLabel: "Almost never",
    highLabel: "Throughout the day",
    valueLabels: ["Almost never", "Rarely", "Occasionally", "Often", "Throughout the day"],
  },
  {
    id: "speech",
    categoryId: "speech",
    text: "How mindful are you of your words — avoiding backbiting, exaggeration, and idle talk?",
    lowLabel: "Not mindful",
    highLabel: "Very mindful",
    valueLabels: ["Not mindful", "Slightly mindful", "Somewhat mindful", "Mostly mindful", "Very mindful"],
  },
  {
    id: "gaze",
    categoryId: "gaze",
    text: "How much control do you have over what you watch, listen to, and consume?",
    lowLabel: "Very little control",
    highLabel: "Strong control",
    valueLabels: ["Very little control", "Some difficulty", "Moderate control", "Good control", "Strong control"],
  },
  {
    id: "treatment",
    categoryId: "treatment",
    text: "How would you honestly rate how you treat the people in your life?",
    lowLabel: "I fall short often",
    highLabel: "With care and patience",
    valueLabels: ["I fall short often", "Needs improvement", "Average", "Mostly good", "With care and patience"],
  },
  {
    id: "time",
    categoryId: "time",
    text: "How intentional are you with your time — spending it on what truly matters?",
    lowLabel: "Not intentional",
    highLabel: "Very intentional",
    valueLabels: ["Not intentional", "Rarely intentional", "Somewhat intentional", "Mostly intentional", "Very intentional"],
  },
];

// ── Category selection algorithm ─────────────────────────────────────────────

function selectCategories(responses: Record<string, number>): string[] {
  const disciplineScore = responses["discipline"] ?? 3;

  // How many categories to assign based on discipline level
  const maxCategories =
    disciplineScore <= 1 ? 2 :
    disciplineScore === 2 ? 3 :
    disciplineScore === 3 ? 4 :
    disciplineScore === 4 ? 5 : 6;

  // Rank category questions by score ascending (lower = greater need)
  const categoryScores = QUESTIONS
    .filter((q) => q.categoryId)
    .map((q) => ({ id: q.categoryId!, score: responses[q.id] ?? 3 }))
    .sort((a, b) => a.score - b.score);

  return categoryScores.slice(0, maxCategories).map((c) => c.id);
}

// ── Slider component ──────────────────────────────────────────────────────────

function SliderQuestion({
  question,
  value,
  text,
  onSliderChange,
  onTextChange,
}: {
  question: Question;
  value: number;
  text: string;
  onSliderChange: (v: number) => void;
  onTextChange: (v: string) => void;
}) {
  const currentLabel = question.valueLabels[value - 1];

  return (
    <div className="space-y-6">
      <p className="text-base leading-relaxed" style={{ color: "var(--text-primary)" }}>
        {question.text}
      </p>

      {/* Slider */}
      <div className="space-y-3">
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={value}
          onChange={(e) => onSliderChange(Number(e.target.value))}
          className="w-full cursor-pointer"
          style={{ accentColor: "var(--accent)" }}
          aria-valuemin={1}
          aria-valuemax={5}
          aria-valuenow={value}
          aria-valuetext={currentLabel}
        />
        {/* All 5 step labels — selected one highlighted */}
        <div className="grid grid-cols-5 gap-0.5">
          {question.valueLabels.map((label, i) => {
            const isSelected = i + 1 === value;
            return (
              <div key={i} className="flex flex-col items-center gap-1 text-center">
                <div
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: isSelected ? 8 : 5,
                    height: isSelected ? 8 : 5,
                    background: isSelected ? "var(--accent)" : "var(--border-mid)",
                  }}
                />
                <span style={{
                  fontSize: "9px",
                  lineHeight: 1.3,
                  color: isSelected ? "var(--accent)" : "var(--text-tertiary)",
                  fontWeight: isSelected ? 600 : 400,
                }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optional text */}
      <div>
        <label className="block text-xs mb-2" style={{ color: "var(--text-muted)" }}>
          Anything you&apos;d like to add? <span className="italic">(optional)</span>
        </label>
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          rows={2}
          placeholder="Share more if you'd like…"
          className="w-full rounded-lg px-4 py-2.5 text-sm outline-none resize-none"
          style={{
            background: "var(--bg-main)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
        />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type Screen = "intro" | "questions" | "confirm" | "saving" | "result";

export default function OnboardingClient() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderValues, setSliderValues] = useState<Record<string, number>>(
    Object.fromEntries(QUESTIONS.map((q) => [q.id, 3]))
  );
  const [textValues, setTextValues] = useState<Record<string, string>>(
    Object.fromEntries(QUESTIONS.map((q) => [q.id, ""]))
  );
  const [error, setError] = useState("");
  const [savedCategories, setSavedCategories] = useState<string[]>([]);
  const [pendingCategories, setPendingCategories] = useState<string[]>([]);
  const [focusPlan, setFocusPlan] = useState<string | null>(null);

  const currentQuestion = QUESTIONS[currentIndex];
  const isLast = currentIndex === QUESTIONS.length - 1;

  function handleNext() {
    if (isLast) {
      // Compute suggested categories, go to confirmation before saving
      const suggested = selectCategories(sliderValues);
      setPendingCategories(suggested);
      setScreen("confirm");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleBack() {
    if (currentIndex === 0) {
      setScreen("intro");
    } else {
      setCurrentIndex((i) => i - 1);
    }
  }

  const saveOnboarding = useCallback(async () => {
    setScreen("saving");
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const activeCategories = pendingCategories.length > 0
      ? pendingCategories
      : selectCategories(sliderValues);
    const disciplineLevel = sliderValues["discipline"] ?? 3;

    // Delete any existing responses first (clean retake)
    await supabase
      .from("onboarding_responses")
      .delete()
      .eq("user_id", user.id);

    // Insert fresh responses
    const responses = QUESTIONS.map((q) => ({
      user_id: user.id,
      question_id: q.id,
      slider_value: sliderValues[q.id] ?? 3,
      text_response: textValues[q.id] || null,
    }));

    const { error: responsesError } = await supabase
      .from("onboarding_responses")
      .insert(responses);

    if (responsesError) {
      setError("Something went wrong saving your responses. Please try again.");
      setScreen("questions");
      return;
    }

    // Upsert profile with new focus areas (upsert guards against missing row)
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        onboarding_completed: true,
        active_categories: activeCategories,
        discipline_level: disciplineLevel,
      });

    if (profileError) {
      setError("Something went wrong updating your profile. Please try again.");
      setScreen("questions");
      return;
    }

    // Generate AI focus plan (non-blocking — show result screen first, plan loads in)
    setSavedCategories(activeCategories);
    setScreen("result");

    try {
      const planRes = await fetch("/api/onboarding-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sliderValues, activeCategories }),
      });
      if (planRes.ok) {
        const { plan } = await planRes.json();

        // Persist plan to profile
        if (plan) {
          setFocusPlan(plan);
          await supabase
            .from("profiles")
            .upsert({ id: user.id, focus_plan: plan });
        }
      }
    } catch {
      // Plan generation failure is non-fatal — result screen still shows
    }
  }, [sliderValues, textValues, pendingCategories, router]);

  // ── Intro screen ─────────────────────────────────────────────────────────
  if (screen === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "var(--bg-main)" }}>
        <div className="w-full max-w-lg">
          <div className="rounded-2xl p-8 md:p-10 space-y-6" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>

            <div className="text-center space-y-1">
              <p className="text-2xl" style={{ color: "var(--accent)" }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>In the name of Allah, the Most Gracious, the Most Merciful</p>
            </div>

            <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <p>
                Before you begin, we will ask you a few honest questions about where you are right now in your spiritual life.
              </p>

              <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--bg-main)", borderLeft: "3px solid var(--accent)" }}>
                <p className="text-base font-medium" style={{ color: "var(--text-primary)" }}>
                  &ldquo;O believers! Be mindful of Allah and let every soul look to what ˹deeds˺ it has sent forth for tomorrow.&rdquo;
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>— Al-Hashr 59:18 · The Clear Quran (Dr. Mustafa Khattab)</p>
              </div>

              <p>
                The Prophet ﷺ said: <span className="italic">&ldquo;The intelligent person is the one who takes account of himself and works for what comes after death.&rdquo;</span>
                <span className="block mt-1 text-xs" style={{ color: "var(--text-muted)" }}>— Narrated by Shaddad ibn Aws, Tirmidhi</span>
              </p>

              <p>
                Al-Ghazālī wrote in the <span className="italic">Ihyāʾ</span>: <span className="italic">&ldquo;Muhāsabah requires that you be honest with yourself as you would be honest before Allah — for He sees what no one else does.&rdquo;</span>
              </p>

              <div className="rounded-xl p-4" style={{ background: "rgba(var(--accent-rgb, 138,158,106), 0.08)", border: "1px solid var(--border)" }}>
                <p className="font-medium text-sm mb-1" style={{ color: "var(--text-primary)" }}>These questions are personal.</p>
                <p>
                  No one will see your answers. Answer as honestly as you can — not how you wish things were, but how they truly are. This is how Inābah can serve you best.
                </p>
              </div>
            </div>

            <button
              onClick={() => setScreen("questions")}
              className="w-full py-3 rounded-xl text-sm font-medium"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              I&apos;m ready to be honest with myself
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Confirm screen ───────────────────────────────────────────────────────
  if (screen === "confirm") {
    const allCats = CATEGORIES;
    function toggleCategory(id: string) {
      setPendingCategories((prev) =>
        prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "var(--bg-main)" }}>
        <div className="w-full max-w-lg">
          <div className="rounded-2xl p-8 md:p-10 space-y-6" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--text-tertiary)" }}>
                Step 2 of 2
              </p>
              <h2 className="text-xl font-medium" style={{ color: "var(--text-primary)" }}>
                Review your focus areas
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Based on your answers, these are the areas where Muhāsabah can help you most.
                You can adjust them — add or remove as you see fit.
              </p>
            </div>

            <div className="space-y-2">
              {allCats.map((cat) => {
                const isActive = pendingCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className="w-full flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all"
                    style={{
                      background: isActive ? "var(--accent-light)" : "var(--bg-main)",
                      border: isActive ? "1px solid var(--accent)" : "1px solid var(--border)",
                    }}
                  >
                    <div>
                      <p className="text-sm font-medium" style={{ color: isActive ? "var(--accent)" : "var(--text-primary)" }}>
                        {cat.name}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{cat.sub}</p>
                    </div>
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        background: isActive ? "var(--accent)" : "transparent",
                        border: isActive ? "none" : "1.5px solid var(--border-mid)",
                      }}
                    >
                      {isActive && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                          <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {pendingCategories.length === 0 && (
              <p className="text-[12px] rounded-lg px-3 py-2" style={{ background: "rgba(220,38,38,0.08)", color: "#C0392B" }}>
                Please select at least one area to focus on.
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setScreen("questions")}
                className="flex-1 py-2.5 rounded-xl text-sm"
                style={{ background: "var(--bg-main)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
              >
                Back
              </button>
              <button
                onClick={saveOnboarding}
                disabled={pendingCategories.length === 0}
                className="flex-[2] py-2.5 rounded-xl text-sm font-medium disabled:opacity-40"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Confirm and continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Result screen ─────────────────────────────────────────────────────────
  if (screen === "result") {
    const focusCats = CATEGORIES.filter((c) => savedCategories.includes(c.id));
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "var(--bg-main)" }}>
        <div className="w-full max-w-lg">
          <div className="rounded-2xl p-8 md:p-10 space-y-6" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: "color-mix(in srgb, var(--accent) 15%, transparent)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 className="text-xl font-medium" style={{ color: "var(--text-primary)" }}>
                Your focus areas are set
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Based on your answers, Inābah will guide your daily Muhāsabah through these {focusCats.length} area{focusCats.length !== 1 ? "s" : ""}:
              </p>
            </div>

            <div className="space-y-2">
              {focusCats.map((cat, i) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: "var(--bg-main)", border: "1px solid var(--border)" }}
                >
                  <span className="text-sm font-medium w-5 text-center" style={{ color: "var(--text-tertiary)" }}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{cat.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{cat.sub}</p>
                  </div>
                  <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--accent)" }} />
                </div>
              ))}
            </div>

            {/* AI-generated focus plan */}
            <div
              className="rounded-xl p-4 space-y-2"
              style={{ background: "var(--bg-main)", border: "1px solid var(--border)" }}
            >
              <p className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--text-tertiary)" }}>
                Your personal direction
              </p>
              {focusPlan ? (
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {focusPlan}
                </p>
              ) : (
                <div className="flex items-center gap-3 py-1">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
                    style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
                  />
                  <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                    Preparing your personal plan…
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
              You can retake this assessment anytime from Preferences.
            </p>

            <button
              onClick={() => { router.push("/dashboard"); router.refresh(); }}
              className="w-full py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Go to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Saving screen ─────────────────────────────────────────────────────────
  if (screen === "saving") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-main)" }}>
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Preparing your personal plan…</p>
        </div>
      </div>
    );
  }

  // ── Questions screen ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "var(--bg-main)" }}>
      <div className="w-full max-w-lg">

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-2" style={{ color: "var(--text-muted)" }}>
            <span>Question {currentIndex + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(((currentIndex + 1) / QUESTIONS.length) * 100)}%</span>
          </div>
          <div className="h-1 rounded-full w-full" style={{ background: "var(--border)" }}>
            <div
              className="h-1 rounded-full transition-all duration-300"
              style={{ background: "var(--accent)", width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl p-8" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <SliderQuestion
            question={currentQuestion}
            value={sliderValues[currentQuestion.id]}
            text={textValues[currentQuestion.id]}
            onSliderChange={(v) => setSliderValues((prev) => ({ ...prev, [currentQuestion.id]: v }))}
            onTextChange={(v) => setTextValues((prev) => ({ ...prev, [currentQuestion.id]: v }))}
          />

          {error && (
            <p className="mt-4 text-sm rounded-lg px-3 py-2" style={{ background: "rgba(220,38,38,0.1)", color: "#ef4444" }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 mt-8">
            <button
              onClick={handleBack}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: "var(--bg-main)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex-[2] py-2.5 rounded-xl text-sm font-medium"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {isLast ? "Complete" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
