"use client";

import { motion, revealVariants } from "@/lib/motion";

/**
 * Entrance reveal for blocks of content. Server Components can drop this
 * around a section and get a fade-up on mount. Reduced-motion renders
 * statically (no animation).
 *
 *   <Reveal><section>…</section></Reveal>
 *
 * For a staggered list, pass `stagger` and give children `listItem` variants
 * via `Reveal.Item`.
 *
 * SSR-safety: the element renders at its VISIBLE target immediately
 * (`initial={false}`) on both the server and the first client render.
 * Previously this gated on `useReducedMotion()`, which returns `null` on the
 * server — so every Reveal block shipped `opacity:0` in the SSR HTML (blank
 * screen until hydration) and reduced-motion users got a genuine hydration
 * mismatch. That was the dashboard "flickering / loading repeatedly" flash.
 * With `initial={false}` the content is never hidden, so there is no invisible
 * SSR, no mismatch, and no re-animate-on-refresh flicker.
 */
export function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "li" | "span";
  delay?: number;
}) {
  const Comp = motion[as] as typeof motion.div;

  return (
    <Comp
      className={className}
      variants={revealVariants}
      initial={false}
      animate="show"
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Comp>
  );
}
