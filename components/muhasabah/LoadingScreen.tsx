"use client";

function SkeletonLine({ w = "full", h = 3 }: { w?: string; h?: number }) {
  return (
    <div
      className={`w-${w} rounded-full animate-pulse`}
      style={{ height: `${h * 4}px`, background: "var(--border-mid)", opacity: 0.6 }}
    />
  );
}

export default function LoadingScreen() {
  return (
    <div className="space-y-4 py-2" aria-busy="true" aria-label="Generating your reflection…">

      {/* Header */}
      <div className="space-y-2 mb-6">
        <SkeletonLine w="1/3" h={2.5} />
        <SkeletonLine w="1/2" h={5} />
        <SkeletonLine w="1/4" h={7} />
      </div>

      {/* Category ratings card */}
      <div className="rounded-xl p-4" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
        <SkeletonLine w="1/4" h={2} />
        <div className="mt-3 space-y-0">
          {[80, 65, 72, 58].map((pct, i) => (
            <div key={i} className="flex items-center justify-between py-2.5"
              style={{ borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
              <div className="h-3 rounded-full animate-pulse" style={{ width: `${pct * 0.38}%`, background: "var(--border-mid)", opacity: 0.6 }} />
              <div className="h-5 w-16 rounded-full animate-pulse" style={{ background: "var(--border-mid)", opacity: 0.6 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Reflection card */}
      <div className="rounded-xl p-4 space-y-2.5" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
        <SkeletonLine w="1/5" h={2} />
        <SkeletonLine w="full" h={3} />
        <SkeletonLine w="5/6" h={3} />
        <SkeletonLine w="4/6" h={3} />
        <div className="mt-3 rounded-lg h-12 animate-pulse" style={{ background: "var(--accent-light)" }} />
      </div>

      {/* Pattern card */}
      <div className="rounded-xl p-4 space-y-2.5" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
        <SkeletonLine w="1/4" h={2} />
        <SkeletonLine w="full" h={3} />
        <SkeletonLine w="3/4" h={3} />
      </div>

      <p className="text-center text-[12px] pt-2" style={{ color: "var(--text-tertiary)" }}>
        Reflecting on your session…
      </p>
    </div>
  );
}
