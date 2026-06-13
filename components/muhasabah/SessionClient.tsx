"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MuhasabahApp from "@/components/muhasabah/MuhasabahApp";
import type { NafsStation } from "@/types";

const VALID_STATIONS: NafsStation[] = ["Ammārah", "Lawwāmah", "Mulhamah", "Mutma'innah"];

function SessionClientInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoStart = searchParams.get("autostart") === "1";
  const simulate = searchParams.get("simulate") === "1";
  const stationParam = searchParams.get("station") ?? "";
  const targetStation = VALID_STATIONS.find((s) => s === stationParam) ?? undefined;

  return (
    <main className="min-h-screen py-10 px-4" style={{ background: "var(--surface-bg)" }}>
      <div className="max-w-[620px] mx-auto">
        <MuhasabahApp
          autoStart={autoStart}
          simulate={simulate}
          targetStation={targetStation}
          onComplete={() => router.push("/dashboard")}
        />
      </div>
    </main>
  );
}

export default function SessionClient() {
  return (
    <Suspense fallback={null}>
      <SessionClientInner />
    </Suspense>
  );
}
