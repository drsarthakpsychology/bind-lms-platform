"use client";

import { motion, useReducedMotion, revealVariants } from "@/lib/motion";

/**
 * Entrance reveal for blocks of content. Server Components can drop this
 * around a section and get a fade-up on mount. Reduced-motion renders
 * statically (no animation).
 *
 *   <Reveal><section>…</section></Reveal>
 *
 * For a staggered list, pass `stagger` and give children `listItem` variants
 * via `Reveal.Item`.
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
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;

  if (reduce) {
    return <Comp className={className}>{children}</Comp>;
  }

  return (
    <Comp
      className={className}
      variants={revealVariants}
      initial="hidden"
      animate="show"
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Comp>
  );
}
