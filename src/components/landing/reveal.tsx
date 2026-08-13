"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Scroll-reveal wrapper. One gentle fade + 8px rise per section. With
 * prefers-reduced-motion the element renders in place (initial=false), so the
 * page is fully readable with animation disabled. Never merely functional.
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
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
