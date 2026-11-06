"use client";

import * as React from "react";
import { animate, useReducedMotion } from "motion/react";

/**
 * A number that counts up to `value` when it changes. The server (and
 * reduced-motion users) render the final value; the effect animates text
 * content only, so nothing re-renders per frame.
 */
export function CountUp({ value, from: start = 0, duration = 0.8, delay = 0, format = String, className }: { value: number; from?: number; duration?: number; delay?: number; format?: (n: number) => string; className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const from = React.useRef(start);
  const fmt = React.useRef(format);
  React.useEffect(() => {
    fmt.current = format;
  });
  React.useEffect(() => {
    const el = ref.current;
    if (!el || reduce !== false) {
      from.current = value;
      return;
    }
    el.textContent = fmt.current(Math.round(from.current));
    const controls = animate(from.current, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = fmt.current(Math.round(v));
      },
    });
    from.current = value;
    return () => controls.stop();
  }, [value, duration, delay, reduce]);
  return (
    <span ref={ref} className={className} aria-live="polite">
      {format(value)}
    </span>
  );
}
