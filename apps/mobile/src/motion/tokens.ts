import { Easing } from "react-native-reanimated";

/**
 * Motion tokens. Every animation in the app takes its numbers from here, so
 * the whole app moves with one voice. Read docs/MOTION.md before adding one.
 *
 * Sources: Screenrove motion guidelines (Emil Kowalski, Material 3, Vaul,
 * motion-primitives), interior.dev's tabs, skeleton swap and like burst.
 */

/** Springs (Reanimated withSpring configs). Mass is light so things react at once. */
export const springs = {
  /** Press feedback, chips, switches: quick off the mark, no bounce. */
  press: { stiffness: 620, damping: 42, mass: 0.35 },
  /** Things moving between two places on screen: the tab indicator, a toggle. */
  snappy: { stiffness: 460, damping: 38, mass: 0.8 },
  /** A small lively settle: icons popping on select, a badge appearing. About 7% overshoot. */
  bouncy: { stiffness: 520, damping: 22, mass: 0.6 },
  /** Calm entry for content and lists: no overshoot. */
  smooth: { stiffness: 260, damping: 34, mass: 0.8 },
  /** Bottom sheets: iOS-like, settles in about 450ms. */
  sheet: { stiffness: 380, damping: 40, mass: 0.9 },
  /** Rolling digits (motion-primitives sliding number). */
  digit: { stiffness: 280, damping: 18, mass: 0.3 },
} as const;

/** Durations in ms. Most UI stays under 300. Exits are faster than entries. */
export const dur = {
  /** Toggle, check, colour change. */
  micro: 100,
  press: 120,
  state: 180,
  enter: 260,
  exit: 180,
  /** Skeleton appears only if loading takes longer than this. */
  skeletonDelay: 120,
  /** A progress line or ring filling. */
  fill: 700,
  /** Confetti and bursts. Never blocks a task. */
  burst: 560,
  confetti: 1600,
  /** One sweep of the skeleton shimmer. */
  shimmer: 1300,
} as const;

/** Strong curves: ease-out for anything entering or leaving, ease-in-out for moves on screen. */
export const curves = {
  out: Easing.bezier(0.23, 1, 0.32, 1),
  inOut: Easing.bezier(0.77, 0, 0.175, 1),
  /** Material standard, for colour and opacity. */
  standard: Easing.bezier(0.2, 0, 0, 1),
  /** Vaul's drawer curve. */
  sheet: Easing.bezier(0.32, 0.72, 0, 1),
} as const;

/** List entry: 40ms between rows, capped so the whole list is in within ~360ms. */
export const stagger = { step: 40, max: 8, rise: 10 } as const;
