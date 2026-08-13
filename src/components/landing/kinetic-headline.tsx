"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Word-by-word entrance for the hero headline. Each word rises out of a tight
 * mask in sequence, one structural beat on load. The full line is present in
 * the DOM from first paint, so the message never depends on the animation.
 * With prefers-reduced-motion the words simply render in place.
 *
 * Uses the motion system tokens mapped to JS: 600ms duration (--duration-slower)
 * and ease-out-expo (--ease-out-expo).
 */
export function KineticHeadline({
  children,
  delay = 0,
  stagger = 0.05,
  className,
}: {
  children: string;
  delay?: number;
  stagger?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const words = children.split(" ");

  if (reduce) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={className}>
      {words.map((word, i) => (
        <React.Fragment key={`${word}-${i}`}>
          <span className="-mb-[0.24em] inline-block overflow-hidden pb-[0.24em]">
            <motion.span
              className="inline-block will-change-transform"
              initial={{ opacity: 0, y: "0.9em" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: delay + i * stagger,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </span>
  );
}
