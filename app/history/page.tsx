"use client";

import { useRouter } from "next/navigation";
import HistoryScreen from "@/components/muhasabah/HistoryScreen";

export default function HistoryPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen py-10">
      <div className="app-container-reading">
        <HistoryScreen onBack={() => router.push("/dashboard")} />
      </div>
    </main>
  );
}
