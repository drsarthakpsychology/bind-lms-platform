/**
 * Design tokens, ported from the website's v2 system
 * (docs/design/DESIGN_SYSTEM_2026_11.md and src/app/globals.css).
 * Everything visual in the app reads from here.
 */

/** The only spacing steps: 4, 8, 12, 16, 24, 32, 48, 64. */
export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48, 8: 64 } as const;

export const layout = {
  /** Phone side margin. */
  gutter: 20,
  /** Gap between sections. */
  section: 32,
  /** Rows are at least this tall. */
  row: 56,
  /** Smallest touch target (Android asks for 48). */
  target: 48,
  /** The primary button. */
  primary: 52,
  radius: 12,
  /** Reading text never runs wider than this. */
  readingWidth: 620,
} as const;

/** Motion timings in ms. */
export const motion = {
  press: 120,
  state: 180,
  sheetIn: 300,
  sheetOut: 200,
  page: 200,
  fill: 600,
  /** cubic-bezier(0.2, 0, 0, 1) and cubic-bezier(0.16, 1, 0.3, 1) */
  ease: [0.2, 0, 0, 1] as const,
  easeOut: [0.16, 1, 0.3, 1] as const,
} as const;

/** Font files bundled with the app (static cuts of the website's Archivo). */
export const fonts = {
  body: "Archivo-420",
  medium: "Archivo-500",
  semibold: "Archivo-600",
  h3: "Archivo-650",
  bold: "Archivo-700",
  h1: "Archivo-750",
  display: "Archivo-800",
  wordmark: "Archivo-Wordmark",
  /** Pixel accents: letters and digits. Scores and timers only. */
  pixel: "Silkscreen",
  pixelDigits: "PixDigits",
  /** Handwriting, only for labels inside hand-drawn diagrams. */
  hand: "Kalam-Regular",
  handBold: "Kalam-Bold",
} as const;

/** Type scale (phone column of the web table). size / line height, weight, tracking. */
export const type = {
  display: { fontFamily: fonts.display, fontSize: 34, lineHeight: 38, letterSpacing: -0.68 },
  h1: { fontFamily: fonts.h1, fontSize: 28, lineHeight: 34, letterSpacing: -0.42 },
  h2: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28, letterSpacing: -0.22 },
  h3: { fontFamily: fonts.h3, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 25 },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 25 },
  reading: { fontFamily: fonts.body, fontSize: 17, lineHeight: 28 },
  small: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, letterSpacing: 0.24 },
  button: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22 },
  score: { fontFamily: fonts.pixelDigits, fontSize: 20, lineHeight: 28 },
} as const;
export type TypeName = keyof typeof type;

export type Palette = {
  dark: boolean;
  /** App canvas. */
  bg: string;
  /** Bars and sheets. */
  card: string;
  /** Text. */
  ink: string;
  muted: string;
  /** Lime: the primary action and progress. Nothing else. */
  primary: string;
  onPrimary: string;
  /** Blue: the brand and the current place. */
  brand: string;
  onBrand: string;
  /** Links and the active tab: blue in light, lime in dark. */
  link: string;
  hairline: string;
  tint: string;
  cardLine: string;
  /** Outline of the primary button and its hard shadow. */
  line: string;
  shadow: string;
  danger: string;
  alertBg: string;
  alertFg: string;
  successBg: string;
  successFg: string;
  /** Verdict band and toasts. */
  band: string;
  onBand: string;
  scrim: string;
  skeleton: string;
  /** Hand-drawn diagram palette (the web's --sk-* values). */
  sk: { ink: string; soft: string; paper: string; blue: string; lime: string; red: string; wash: string };
};

export const light: Palette = {
  dark: false,
  bg: "#f5f5f5",
  card: "#ffffff",
  ink: "#111111",
  muted: "#4d4d4d",
  primary: "#cdf24b",
  onPrimary: "#111111",
  brand: "#1d44d8",
  onBrand: "#ffffff",
  link: "#1d44d8",
  hairline: "rgba(17,17,17,0.12)",
  tint: "rgba(17,17,17,0.05)",
  cardLine: "rgba(17,17,17,0.22)",
  line: "#111111",
  shadow: "#111111",
  danger: "#c4271b",
  alertBg: "#fdecea",
  alertFg: "#b42318",
  successBg: "#eefac4",
  successFg: "#111111",
  band: "#111111",
  onBand: "#ffffff",
  scrim: "rgba(17,17,17,0.45)",
  skeleton: "rgba(17,17,17,0.08)",
  sk: { ink: "#1a1a1a", soft: "#8a8a8a", paper: "#ffffff", blue: "#1d44d8", lime: "#cdf24b", red: "#c4271b", wash: "#e8edff" },
};

export const dark: Palette = {
  dark: true,
  bg: "#0d0d0d",
  card: "#181818",
  ink: "#ffffff",
  muted: "#b5b5b5",
  primary: "#cdf24b",
  onPrimary: "#111111",
  brand: "#1d44d8",
  onBrand: "#ffffff",
  link: "#cdf24b",
  hairline: "rgba(255,255,255,0.14)",
  tint: "rgba(255,255,255,0.06)",
  cardLine: "rgba(255,255,255,0.24)",
  line: "#ffffff",
  shadow: "#000000",
  danger: "#ff6b5e",
  alertBg: "#3b1513",
  alertFg: "#ff9a90",
  successBg: "#27300d",
  successFg: "#cdf24b",
  band: "#ffffff",
  onBand: "#111111",
  scrim: "rgba(0,0,0,0.6)",
  skeleton: "rgba(255,255,255,0.1)",
  sk: { ink: "#f2f2f2", soft: "#8f8f8f", paper: "#161616", blue: "#8fa6ff", lime: "#cdf24b", red: "#ff7b6e", wash: "#1d2547" },
};
