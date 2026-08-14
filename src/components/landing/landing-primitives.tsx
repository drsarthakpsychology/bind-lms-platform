"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Shared neo-brutalist primitives — the recurring marks that hold the public
 * surfaces (landing, /enquire) in one visual language. Extracted from the
 * landing page so the conversion surfaces reuse the same craft.
 */

/** A closed measure: a 2px ink score line ending in a peach square. */
export function Rule({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center gap-2", className)}>
      <span className="h-0.5 flex-1 bg-foreground" />
      <span className="size-2 shrink-0 bg-primary" />
    </div>
  );
}

/**
 * A rotated rubber-stamp. Double-ring outline, peach fill, ink text.
 * Lands once when it enters the viewport — a one-shot scale-settle with the
 * system's springy ease, mimicking a stamp coming down onto the document.
 * transform/opacity only; reduced-motion and no-JS render it in place.
 */
export function Stamp({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className={cn(
        "select-none rounded-md border-2 border-foreground bg-primary px-3 py-1 font-mono text-xs font-black uppercase tracking-[0.2em] text-primary-foreground outline-2 outline-offset-2 outline-foreground",
        className,
      )}
      initial={reduce === false ? { opacity: 0, scale: 1.35 } : false}
      whileInView={reduce === false ? { opacity: 1, scale: 1 } : undefined}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {children}
    </motion.span>
  );
}

/** Section eyebrow with a mono index numeral (editorial wayfinding). */
export function SectionEyebrow({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 text-eyebrow text-muted-foreground">
      <span aria-hidden className="font-mono text-sm font-black tracking-normal text-link">
        {index}
      </span>
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary" />
      {children}
    </p>
  );
}
