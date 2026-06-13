import { Suspense } from "react";
import MuraqabahClient from "@/components/muraqabah/MuraqabahClient";

export default function MuraqabahPage() {
  return (
    <Suspense fallback={null}>
      <MuraqabahClient />
    </Suspense>
  );
}
