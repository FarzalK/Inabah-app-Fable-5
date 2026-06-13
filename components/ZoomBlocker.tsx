"use client";

import { useEffect } from "react";

/**
 * Best-effort prevention of user-initiated zoom on desktop. Mounts
 * capture-phase listeners on document that intercept the common zoom
 * triggers:
 *
 *   - Ctrl/Cmd + wheel (mouse wheel and trackpad pinch — both fire a
 *     wheel event with ctrlKey=true)
 *   - Ctrl/Cmd + +/=/-/_/0 (keyboard accelerators, including the
 *     shifted variants on US layouts)
 *
 * Cannot be blocked by any web page on any browser, and so is NOT
 * handled here — communicate the limitation if it ever comes up:
 *
 *   - Browser zoom menu (View → Zoom, three-dot/hamburger menu controls)
 *   - Browser default-zoom preference (Chrome / Edge / Safari settings)
 *   - iOS accessibility magnifier / Android system magnifier
 *   - Browser devtools zoom
 *
 * Mobile pinch-zoom is separately blocked via the viewport meta export
 * in app/layout.tsx (maximumScale=1, minimumScale=1, userScalable=false).
 *
 * Renders nothing.
 */
export default function ZoomBlocker() {
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      // Trackpad pinch-to-zoom fires a wheel event with ctrlKey=true even
      // though no key is pressed — same code path as Ctrl + scroll wheel.
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (!(e.ctrlKey || e.metaKey)) return;
      // "+" and "=" cover Ctrl + Plus (shifted on US layout)
      // "-" and "_" cover Ctrl + Minus (shifted on some layouts)
      // "0" covers Ctrl + 0 (reset zoom)
      if (e.key === "+" || e.key === "=" || e.key === "-" || e.key === "_" || e.key === "0") {
        e.preventDefault();
      }
    }

    // passive:false is required to allow preventDefault on wheel.
    // capture phase so we beat any inner handlers that might stopPropagation.
    document.addEventListener("wheel", onWheel, { passive: false, capture: true });
    document.addEventListener("keydown", onKeyDown, { capture: true });

    return () => {
      document.removeEventListener("wheel", onWheel, { capture: true });
      document.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, []);

  return null;
}
