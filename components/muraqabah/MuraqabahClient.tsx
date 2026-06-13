"use client";

import { useSearchParams } from "next/navigation";
import MuraqabahApp from "@/components/muraqabah/MuraqabahApp";

export default function MuraqabahClient() {
  const searchParams = useSearchParams();
  const simulate = searchParams.get("simulate") === "1";

  return (
    <main className="min-h-screen py-10 px-4" style={{ background: "var(--surface-bg)" }}>
      <div className="max-w-[620px] mx-auto">
        <MuraqabahApp simulate={simulate} />
      </div>
    </main>
  );
}
