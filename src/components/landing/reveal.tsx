"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * One-shot scroll reveal. Content rises 18px + fades in as it enters, then
 * stays — it does not re-trigger on scroll-up, does not scrub with scroll
 * position, does not scale or rotate (per the pass-3 motion brief).
 *
 * Implementation is a ~15-line IntersectionObserver, deliberately not a
 * motion library: threshold 0.15, a negative -12% bottom rootMargin so the
 * reveal starts just before the element reaches the viewport edge (which is
 * what stops the effect feeling like a delayed reaction), and `unobserve` the
 * moment it fires. `--delay` staggers siblings within a group (60–100ms
 * steps, max ~4–5 per group).
 *
 * The `.reveal` / `.is-in` CSS lives in globals.css. Reduced motion: the
 * observer is skipped entirely and `.is-in` is applied immediately, so all
 * content is visible at once with no transition. SSR note: elements start at
 * opacity 0 and are revealed by the observer — above-the-fold content fires
 * on first paint, and reduced-motion users never wait.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: everything visible immediately, no observer.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-in");
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      style={delay ? ({ "--delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
