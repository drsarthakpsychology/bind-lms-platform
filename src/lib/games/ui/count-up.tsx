"use client";

import * as React from "react";
import { animate, useReducedMotion } from "motion/react";

/**
 * A number that counts up to `value` when it changes. The server (and
 * reduced-motion users) render the final value; the effect animates text
 * content only, so nothing re-renders per frame.
 */
export function CountUp({ value, duration = 0.8, className }: { value: number; duration?: number; className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const from = React.useRef(0);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || reduce !== false) {
      from.current = value;
      return;
    }
    const controls = animate(from.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = String(Math.round(v));
      },
    });
    from.current = value;
    return () => controls.stop();
  }, [value, duration, reduce]);
  return (
    <span ref={ref} className={className} aria-live="polite">
      {value}
    </span>
  );
}
