"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Scroll-reveal wrapper. One gentle fade + 12px rise per section. With
 * prefers-reduced-motion the element renders in place (initial=false), so the
 * page is fully readable with animation disabled.
 *
 * `useReducedMotion()` returns `null` on the server and only resolves to a
 * boolean after hydration. Gating the hidden `initial` behind `reduce === false`
 * keeps the server-rendered HTML (and no-JS crawlers / slow hydration) visible
 * from first paint — the message never depends on the animation.
 *
 * Motion maps the system tokens: 400ms (--duration-slow) + ease-out-expo
 * ([0.16,1,0.3,1]) so section reveals share one language with KineticHeadline.
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
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce === false ? { opacity: 0, y: 12 } : false}
      whileInView={reduce === false ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
