"use client";
import type { Category } from "@/types";
import { AyahBox, PrimaryButton, GhostButton } from "@/components/ui";

interface QuestionScreenProps {
  category: Category; index: number; total: number;
  answer: string; onAnswer: (val: string) => void;
  onNext: () => void; onBack: () => void; onSkip: () => void;
}

export default function QuestionScreen({
  category, index, total, answer, onAnswer, onNext, onBack, onSkip,
}: QuestionScreenProps) {
  const isLast = index === total - 1;

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1.5" role="progressbar" aria-valuenow={index + 1} aria-valuemax={total}>
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                height: 6,
                width: i === index ? 20 : 6,
                background: i <= index ? "var(--accent)" : "var(--border-mid)",
              }}
            />
          ))}
        </div>
        <span className="text-[11px] tabular-nums" style={{ color: "var(--text-tertiary)" }}>
          {index + 1} / {total}
        </span>
      </div>

      {/* Category label */}
      <p className="text-[10px] uppercase tracking-widest mb-1 font-medium" style={{ color: "var(--text-tertiary)" }}>
        {category.sub}
      </p>
      <h2 className="text-xl font-medium mb-5" style={{ color: "var(--text-primary)" }}>{category.name}</h2>

      <AyahBox text={category.ayah} />

      <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{category.prompt}</p>

      <textarea
        id="qa-textarea"
        value={answer}
        onChange={(e) => onAnswer(e.target.value)}
        placeholder="Share honestly, even a few words..."
        className="w-full min-h-[110px] rounded-lg px-3 py-2.5 text-sm resize-y leading-relaxed"
        style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border-mid)", color: "var(--text-primary)" }}
        aria-label={`Your reflection on ${category.name}`}
      />

      <div className="flex justify-between items-center mt-4">
        <GhostButton onClick={onBack}>{index === 0 ? "Cancel" : "Back"}</GhostButton>
        <div className="flex items-center gap-3">
          <button
            onClick={onSkip}
            className="text-[12px] transition-opacity hover:opacity-70"
            style={{ color: "var(--text-tertiary)" }}
            aria-label={`Skip ${category.name} for today`}
          >
            Not today
          </button>
          <PrimaryButton onClick={onNext}>{isLast ? "Complete session" : "Next"}</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
