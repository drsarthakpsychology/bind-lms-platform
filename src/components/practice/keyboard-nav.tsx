"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { haptic } from "@/lib/haptics";

/**
 * Keyboard navigation for the practice browse view (B5 micro-details).
 * j/k move between cards, Enter opens the focused card, "/" shows the hint.
 * The focus pill shows which card is selected.
 */
export function PracticeKeyboardNav({ links }: { links: Array<{ href: string; title: string }> }) {
  const router = useRouter();
  const idxRef = React.useRef(0);
  const [hint, setHint] = React.useState<string | null>(null);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Don't hijack typing in inputs/textareas.
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;

      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        haptic("tap");
        idxRef.current = (idxRef.current + 1) % links.length;
        setHint(links[idxRef.current]?.title ?? "");
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        haptic("tap");
        idxRef.current = (idxRef.current - 1 + links.length) % links.length;
        setHint(links[idxRef.current]?.title ?? "");
      } else if (e.key === "Enter") {
        const href = links[idxRef.current]?.href;
        if (href) {
          e.preventDefault();
          haptic("success");
          router.push(href);
        }
      } else if (e.key === "/") {
        e.preventDefault();
        haptic("tap");
        setHint("j/k to move · Enter to open");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [links, router]);

  if (!hint) return null;
  return (
    <p className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border-2 border-border bg-card px-3 py-1 text-caption font-medium text-muted-foreground hard-shadow-sm" aria-live="polite">
      <span className="text-link">▶</span> {hint}
    </p>
  );
}
