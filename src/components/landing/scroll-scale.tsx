"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Scroll-linked scale for a single decorative accent. The element scales from
 * `from` up to 1 as it crosses into the viewport. It never drives layout and
 * is disabled entirely under prefers-reduced-motion, so it is purely an
 * enhancement on top of content that reads fine without it.
 */
export function ScrollScale({
  children,
  from = 0.85,
  className,
}: {
  children: React.ReactNode;
  from?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [from, 1]);
  return (
    <motion.div ref={ref} style={reduce ? undefined : { scale }} className={className}>
      {children}
    </motion.div>
  );
}
