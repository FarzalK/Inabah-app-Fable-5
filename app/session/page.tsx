import { Suspense } from "react";
import SessionClient from "@/components/muhasabah/SessionClient";

export default function SessionPage() {
  return (
    <Suspense fallback={null}>
      <SessionClient />
    </Suspense>
  );
}
