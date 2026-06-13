"use client";

import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import Disclaimer from "@/components/Disclaimer";
import { Label } from "@/components/ui";
import { getSessions } from "@/lib/storage";
import { getMuraqabahSessions } from "@/lib/muraqabah-storage";

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [exportState, setExportState] = useState<"idle" | "exporting" | "done">("idle");

  async function handleExport() {
    setExportState("exporting");
    try {
      const [muhasabah, muraqabah] = await Promise.all([getSessions(), getMuraqabahSessions()]);
      const payload = {
        exportedAt: new Date().toISOString(),
        muhasabah,
        muraqabah,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inabah-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExportState("done");
      setTimeout(() => setExportState("idle"), 3000);
    } catch {
      setExportState("idle");
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <Label>Configuration</Label>
        <h1 className="text-2xl font-medium" style={{ color: "var(--text-primary)" }}>Settings</h1>
      </div>

      {/* Appearance */}
      <div className="rounded-xl p-5" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
        <Label>Appearance</Label>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Theme</p>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
              {theme === "dark" ? "Dark mode is active" : "Light mode is active"}
            </p>
          </div>
          <div className="flex gap-2">
            {(["light", "dark"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { if (theme !== t) toggle(); }}
                className="px-4 py-1.5 rounded-full text-[13px] transition-opacity capitalize"
                style={{
                  background: theme === t ? "var(--accent)" : "var(--surface-card-alt)",
                  color: theme === t ? "var(--surface-bg)" : "var(--text-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Data */}
      <div className="rounded-xl p-5" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
        <Label>Your data</Label>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium mb-0.5" style={{ color: "var(--text-primary)" }}>Export journal data</p>
            <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
              Download all your Muhāsabah and Murāqabah sessions as a JSON file.
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={exportState === "exporting"}
            className="flex-shrink-0 px-4 py-2 rounded-lg text-[13px] font-medium transition-opacity disabled:opacity-60"
            style={{
              background: exportState === "done"
                ? "color-mix(in srgb, var(--accent) 15%, transparent)"
                : "var(--surface-card-alt)",
              color: exportState === "done" ? "var(--accent)" : "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            {exportState === "exporting" ? "Exporting…" : exportState === "done" ? "Downloaded ✓" : "Export"}
          </button>
        </div>
      </div>

      {/* Credits */}
      <div className="rounded-xl p-5" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
        <Label>Credits</Label>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-0.5" style={{ color: "var(--text-primary)" }}>Quranic Translation</p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              All Quranic translations used in Inābah are from{" "}
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>The Clear Quran</span>{" "}
              by Dr. Mustafa Khattab.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-0.5" style={{ color: "var(--text-primary)" }}>Scholarly Sources</p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Spiritual guidance draws on the works of Imam al-Ghazali (<span className="italic">Ihyāʾ ʿUlūm al-Dīn</span>),
              Ibn al-Qayyim al-Jawziyyah (<span className="italic">Madārij al-Sālikīn</span>),
              and Ibn Rajab al-Ḥanbalī.
            </p>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="rounded-xl p-5" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
        <Label>About Inābah</Label>
        <Disclaimer className="text-[13px] leading-relaxed" />
      </div>
    </div>
  );
}
