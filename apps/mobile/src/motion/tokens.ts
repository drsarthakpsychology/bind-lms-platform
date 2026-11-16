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
  /** A PIN dot settling after it pops (lively, visible wobble). */
  dot: { stiffness: 260, damping: 9, mass: 1 },
  /** The PIN success wave: each dot jumps and settles. */
  wave: { stiffness: 220, damping: 8, mass: 1 },
  /** A big piece of art arriving with a turn (PIN star, gate art). */
  art: { stiffness: 180, damping: 11, mass: 0.7 },
  /** The Welcome consultation room box landing. */
  room: { stiffness: 140, damping: 16, mass: 0.8 },
  /** A dragged card springing back to its place. */
  dropBack: { stiffness: 220, damping: 18, mass: 1 },
  /** A bar or switch filling on or off (strength meter, toggles). */
  toggle: { stiffness: 260, damping: 18, mass: 1 },
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
  /** Once a skeleton shows, it stays at least this long (no grey blink). */
  skeletonMin: 380,
  /** Keyed content swap: the old leaves quicker than the new arrives. */
  swapOut: 100,
  swapIn: 180,
  /** Bottom sheets (timing fallbacks; the sheet itself springs). */
  sheetIn: 300,
  sheetOut: 200,
  /** Toast in and out. */
  toastIn: 180,
  toastOut: 140,
  /** Tab switch, Material "fade through": out in the first 35%, in after. */
  tabOut: 70,
  tabIn: 150,
} as const;

/** Distances in px for the swap, toast and reveal moves. */
export const shift = {
  /** The old content lifts this far as it leaves. */
  swapOut: 6,
  /** The new content arrives from this far away, in the direction of travel. */
  swapIn: 8,
  /** Loaded content rises this far into place. */
  reveal: 6,
  toast: 12,
  tab: 8,
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

/**
 * The order of a celebration (ms after the result is shown), budget rule 5:
 * the result lands, then the haptic, then particles, then the sticker, then
 * the stats. `Celebrate` uses these, so every win keeps the same beat.
 */
export const beats = { result: 0, haptic: 280, particles: 320, sticker: 640, stats: 900 } as const;
