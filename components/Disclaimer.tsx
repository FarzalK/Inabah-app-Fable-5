// Required by the "Clear disclaimer" functional requirement: must appear on
// the auth screens and inside the app (Settings → About Inābah).
export default function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p className={className} style={{ color: "var(--text-tertiary)" }}>
      Inābah is a companion for personal spiritual practice. It is not a
      substitute for a qualified shaykh, not a source of fatwa, and not therapy
      or professional care.
    </p>
  );
}
