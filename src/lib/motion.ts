"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

export { motion, useReducedMotion };

/**
 * Shared motion for the Neo-Brutalist design system.
 *
 * The identity is hard edges, offset shadows, ink borders — so the motion is
 * deliberately *snappy*, not floaty: short durations, a bouncy-but-tight
 * easing, and small translate distances. Nothing here introduces a new colour,
 * radius, or shadow; it only moves what already exists.
 */

/** Fast, characterful ease — a hint of overshoot without the float. */
export const EASE_BRUTAL = [0.22, 1, 0.36, 1] as const;

/** Entrance for a block: fades up from 10px, hard-snaps in. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_BRUTAL },
  },
};

/** Container for staggered children (used with a Reveal parent). */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

/** A single list-item variant for use inside staggerContainer. */
export const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE_BRUTAL },
  },
};

/**
 * Animated progress fill: from 0 to `value` on mount. Pure transform/width,
 * so it's cheap and respects the hard-sharp aesthetic.
 */
export function animateFill(value: number) {
  return {
    initial: { scaleX: 0 },
    animate: { scaleX: value / 100 },
    transition: { duration: 0.6, ease: EASE_BRUTAL },
    style: { transformOrigin: "left" },
  };
}

/**
 * Segmented control / tab active indicator: a layout-animated fill that slides
 * between segments. `layoutId` keeps it continuous across the whole control.
 */
export function segmentIndicator(layoutId: string) {
  return {
    layoutId,
    transition: { type: "spring" as const, stiffness: 420, damping: 34 },
  };
}

/**
 * Pop-in for a small element (badge, checkmark): scales from 0.9 with a slight
 * overshoot. Cheap, self-contained.
 */
export function popIn() {
  return {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.25, ease: EASE_BRUTAL },
  };
}
