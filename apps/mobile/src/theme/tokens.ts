/**
 * Design tokens for the "Layers" look (docs/DESIGN.md). A deep blue field is
 * the place you are in (`field`); a soft white layer rises over it and holds
 * what you do now (`bg`); stone surfaces rest on the layer (`card`); lime is
 * the one live thing on screen (`primary`); ink is your current choice.
 * Everything visual in the app reads from here. The older names (`bg`, `card`,
 * `primary`, `link`...) still work and now carry the new colours.
 */
import { dur } from "@/motion/tokens";

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
  /** Small things on a layer: fields, options, chips, tints. */
  radius: 18,
  /** Stone cards and sheets. */
  radiusLg: 26,
  /** The top corners of a layer where it rises over the field. */
  radiusLayer: 30,
  /** Reading text never runs wider than this. */
  readingWidth: 620,
} as const;

/**
 * Motion timings in ms, kept for older screens. They now come from the one
 * source in src/motion/tokens.ts (`dur`); new code imports `dur` or `presets`
 * from `@/motion` instead (docs/MOTION.md, motion budget rule 1).
 * @deprecated use `dur` from `@/motion`.
 */
export const motion = {
  press: dur.press,
  state: dur.state,
  sheetIn: dur.sheetIn,
  sheetOut: dur.sheetOut,
  page: dur.state,
  fill: dur.fill,
  /** cubic-bezier(0.2, 0, 0, 1) and cubic-bezier(0.16, 1, 0.3, 1) */
  ease: [0.2, 0, 0, 1] as const,
  easeOut: [0.16, 1, 0.3, 1] as const,
} as const;

/**
 * Font files bundled with the app. Figtree is for everything read and tapped.
 * Bricolage Grotesque is for greetings, titles and questions. Archivo stays
 * for the VIBHA wordmark. Both new families are OFL (assets/fonts/*-OFL.txt).
 */
export const fonts = {
  body: "Figtree-400",
  medium: "Figtree-500",
  semibold: "Figtree-600",
  h3: "Figtree-700",
  bold: "Figtree-700",
  /** Greetings, titles, questions: Bricolage Grotesque. */
  h1: "Bricolage-600",
  display: "Bricolage-600",
  /** The big IN and OUT words. */
  big: "Bricolage-700",
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
  display: { fontFamily: fonts.display, fontSize: 32, lineHeight: 35, letterSpacing: -0.64 },
  h1: { fontFamily: fonts.h1, fontSize: 27, lineHeight: 31, letterSpacing: -0.54 },
  h2: { fontFamily: fonts.h1, fontSize: 21, lineHeight: 25, letterSpacing: -0.21 },
  h3: { fontFamily: fonts.h3, fontSize: 17, lineHeight: 23 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 24 },
  reading: { fontFamily: fonts.body, fontSize: 17, lineHeight: 27 },
  small: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, letterSpacing: 0.24 },
  button: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22 },
  score: { fontFamily: fonts.pixelDigits, fontSize: 20, lineHeight: 28 },
  /** A small quiet heading over a group on a layer ("Keep going", "Quick"). */
  label: { fontFamily: fonts.bold, fontSize: 13, lineHeight: 18 },
} as const;
export type TypeName = keyof typeof type;

/**
 * Colours that never change with the theme: the brand art (always blue, lime
 * and ink), and video, which is always shown on black. Use the palette for
 * everything else.
 */
export const fixed = {
  blue: "#1d44d8",
  lime: "#cdf24b",
  ink: "#111111",
  white: "#ffffff",
  black: "#000000",
  /** Video chrome: text and icons on video, the scrubber track, the control wash. */
  onVideo: "#ffffff",
  onVideoMuted: "rgba(255,255,255,0.8)",
  videoTrack: "rgba(255,255,255,0.3)",
  videoWash: "rgba(0,0,0,0.28)",
  videoButton: "rgba(17,17,17,0.45)",
  videoButtonPressed: "rgba(255,255,255,0.22)",
} as const;

/**
 * The five areas of the app. Each has one soft colour family (Gen Z minimal:
 * one accent family per screen, never loud). Home is VIBHA lime, Learn VIBHA
 * blue, Practise peach (blue's warm complement), Medicines mint (the anxiety
 * family's teal), Me lilac (the antipsychotic family's violet).
 */
export type Area = "home" | "learn" | "practise" | "library" | "me";

/**
 * One area's colours.
 *   wash   soft surface: the hero card, icon circles, the header glow, a track
 *   deep   foreground on wash, bg and card: icons, pixel labels, fills, rings
 *          (4.5:1 or more on wash, bg and card, both themes)
 *   onDeep text on a deep fill (a selected chip)
 */
export type Swatch = { wash: string; deep: string; onDeep: string };

export type Palette = {
  dark: boolean;
  /** The blue field behind everything: the place you are in. Never a surface for long text. */
  field: string;
  /** Text and icons on the field. */
  onField: string;
  onFieldMuted: string;
  /** A soft see-through patch on the field (the "now" pill, round buttons, a progress track). */
  fieldTint: string;
  /** The soft white layer that rises over the field (same as `bg`). */
  layer: string;
  /** Stone: a surface resting on a layer (same as `card`). */
  stone: string;
  /** Lime, the one live thing (same as `primary`). */
  lime: string;
  onLime: string;
  /** A wrong pick: warm, never alarming. */
  missBg: string;
  /** Area accents (one family per screen; see `Area`). */
  areas: Record<Area, Swatch>;
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
  /** A surface above a card: sheets, menus, a card inside a card. In dark, height is shown by a lighter surface, not a shadow. */
  raised: string;
  /** Third text tier: placeholders, footnotes, disabled labels (4.5:1 on bg and card). */
  faint: string;
  /** Blue that reads as a foreground on this theme (dots, rings, selected marks, icons): 6:1 or more on bg and card. */
  accent: string;
  /** Text on an accent fill. */
  onAccent: string;
  /** Outline of things you type in or tick (fields, radio rings, checkboxes, switch tracks): 3:1 on bg and card. */
  fieldLine: string;
  /** Selected row wash and the tab bar pill. */
  selected: string;
  pill: string;
  /** Switch track when on, and its thumb. */
  switchOn: string;
  switchThumb: string;
  /** The skeleton sweep highlight. */
  shimmer: string;
  /** Status colours for dots and small marks (3:1 or more), and the warning band. */
  ok: string;
  warn: string;
  warnBg: string;
  warnFg: string;
  /** A printed page (PDF, certificate preview): white in light, dimmed in dark so it does not glare. */
  paper: string;
  onPaper: string;
  paperLine: string;
  /** Hand-drawn diagram palette (the web's --sk-* values). */
  sk: { ink: string; soft: string; paper: string; blue: string; lime: string; red: string; wash: string };
};

export const light: Palette = {
  dark: false,
  field: "#1d44d8",
  onField: "#ffffff",
  onFieldMuted: "rgba(255,255,255,0.8)",
  fieldTint: "rgba(255,255,255,0.14)",
  layer: "#fbfaf6",
  stone: "#efede6",
  lime: "#cdf24b",
  onLime: "#12131a",
  missBg: "#ffd9c9",
  // Contrast, deep on wash / on bg: lime 6.1 / 6.2, blue 6.3 / 6.7, peach 5.2 / 5.5, mint 5.3 / 5.8, lilac 6.1 / 6.7.
  areas: {
    home: { wash: "#e9f3bd", deep: "#4a6400", onDeep: "#ffffff" },
    learn: { wash: "#e3e8fb", deep: "#1d44d8", onDeep: "#ffffff" },
    practise: { wash: "#fbe3d6", deep: "#a8431a", onDeep: "#ffffff" },
    library: { wash: "#d8eeea", deep: "#0b6b70", onDeep: "#ffffff" },
    me: { wash: "#e9e2fa", deep: "#6430d0", onDeep: "#ffffff" },
  },
  bg: "#fbfaf6",
  card: "#efede6",
  ink: "#12131a",
  muted: "#565864",
  primary: "#cdf24b",
  onPrimary: "#111111",
  brand: "#1d44d8",
  onBrand: "#ffffff",
  link: "#1d44d8",
  hairline: "rgba(18,19,26,0.11)",
  tint: "rgba(18,19,26,0.05)",
  cardLine: "rgba(18,19,26,0.22)",
  line: "#12131a",
  shadow: "#12131a",
  danger: "#c4271b",
  alertBg: "#fdecea",
  alertFg: "#b42318",
  successBg: "#eaf6b8",
  successFg: "#12131a",
  band: "#12131a",
  onBand: "#ffffff",
  scrim: "rgba(8,12,40,0.5)",
  skeleton: "rgba(18,19,26,0.08)",
  raised: "#ffffff",
  faint: "#666874",
  accent: "#1d44d8",
  onAccent: "#ffffff",
  fieldLine: "rgba(18,19,26,0.5)",
  selected: "rgba(29,68,216,0.07)",
  pill: "rgba(29,68,216,0.10)",
  switchOn: "#1d44d8",
  switchThumb: "#ffffff",
  shimmer: "rgba(255,255,255,0.75)",
  ok: "#1f7a35",
  warn: "#b25e00",
  warnBg: "#fdf1dc",
  warnFg: "#7a4a00",
  paper: "#ffffff",
  onPaper: "#111111",
  paperLine: "rgba(17,17,17,0.12)",
  sk: { ink: "#1a1a1a", soft: "#8a8a8a", paper: "#ffffff", blue: "#1d44d8", lime: "#cdf24b", red: "#c4271b", wash: "#e8edff" },
};

export const dark: Palette = {
  dark: true,
  field: "#17257a",
  onField: "#ffffff",
  onFieldMuted: "rgba(255,255,255,0.78)",
  fieldTint: "rgba(255,255,255,0.12)",
  layer: "#13151d",
  stone: "#21242f",
  lime: "#cdf24b",
  onLime: "#12131a",
  missBg: "#5c2a1a",
  // Contrast, deep on wash / on card: lime 11.7 / 13, blue 7.5 / 8.6, peach 8.9 / 9.9, mint 9.1 / 10, lilac 8.2 / 9.
  areas: {
    home: { wash: "#212a0b", deep: "#cdf24b", onDeep: "#111111" },
    learn: { wash: "#19214a", deep: "#9db1ff", onDeep: "#111111" },
    practise: { wash: "#2f1e12", deep: "#ffaf85", onDeep: "#111111" },
    library: { wash: "#0c2927", deep: "#6fd8cc", onDeep: "#111111" },
    me: { wash: "#231a3e", deep: "#c4abff", onDeep: "#111111" },
  },
  bg: "#13151d",
  card: "#21242f",
  ink: "#f2f3f7",
  muted: "#aeb2c0",
  primary: "#cdf24b",
  onPrimary: "#111111",
  brand: "#1d44d8",
  onBrand: "#ffffff",
  link: "#b9c6ff",
  hairline: "rgba(242,243,247,0.13)",
  tint: "rgba(242,243,247,0.06)",
  cardLine: "rgba(242,243,247,0.26)",
  line: "#f2f3f7",
  shadow: "#000000",
  danger: "#ff6b5e",
  alertBg: "#3b1513",
  alertFg: "#ff9a90",
  successBg: "#27300d",
  successFg: "#cdf24b",
  band: "#f2f3f7",
  onBand: "#12131a",
  scrim: "rgba(4,6,20,0.66)",
  skeleton: "rgba(242,243,247,0.1)",
  raised: "#2a2e3b",
  faint: "#8f93a3",
  accent: "#b9c6ff",
  onAccent: "#12131a",
  fieldLine: "rgba(242,243,247,0.42)",
  selected: "rgba(185,198,255,0.10)",
  pill: "rgba(185,198,255,0.16)",
  switchOn: "#cdf24b",
  switchThumb: "#111111",
  shimmer: "rgba(255,255,255,0.07)",
  ok: "#7bd88f",
  warn: "#f0a43a",
  warnBg: "#3a2a0c",
  warnFg: "#f5c46b",
  paper: "#e6e6e6",
  onPaper: "#111111",
  paperLine: "rgba(17,17,17,0.14)",
  sk: { ink: "#f2f2f2", soft: "#8f8f8f", paper: "#161616", blue: "#8fa6ff", lime: "#cdf24b", red: "#ff7b6e", wash: "#1d2547" },
};
