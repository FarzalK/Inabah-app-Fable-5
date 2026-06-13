export default function FoundationsPage() {
  return (
    <main className="min-h-screen py-16" style={{ background: "var(--surface-bg)" }}>
      <div className="app-container-reading text-center">

        <div className="flex items-center justify-center gap-1.5 mb-6">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--sand)" }} />
          <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--sand)" }}>
            Foundations
          </span>
        </div>

        <p lang="ar" className="arabic text-4xl mb-6 leading-loose" style={{ color: "var(--text-tertiary)" }}>
          مُحَاسَبَة
        </p>

        <h1 className="text-xl font-medium mb-3" style={{ color: "var(--text-primary)" }}>
          Coming soon
        </h1>
        <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: "var(--text-tertiary)" }}>
          This section will cover the roots of Muhāsabah — what it means, where it comes from in
          the Quran and Sunnah, how the scholars understood it, and how to deepen the practice in
          your daily life.
        </p>

      </div>
    </main>
  );
}
