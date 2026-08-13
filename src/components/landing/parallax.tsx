"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Subtle scroll parallax moves a decorative element a few pixels against the
 * scroll direction. Disabled entirely under prefers-reduced-motion. Defaults
 * travel ±12px from the resting position (24px total) — small enough that it
 * can't cause nausea or overlap.
 */
export function Parallax({
  children,
  from = 12,
  to = -12,
  className,
}: {
  children: React.ReactNode;
  /** translateY range in px as the element scrolls through the viewport. */
  from?: number;
  to?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [from, to]);
  return (
    <motion.div ref={ref} style={reduce ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  );
}
