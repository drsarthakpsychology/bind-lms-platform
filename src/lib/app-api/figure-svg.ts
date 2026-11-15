import "server-only";
import { createElement, type ReactNode } from "react";
import { FIGURES } from "@/components/study/figures/registry";
import type { Figure } from "./contract";

/**
 * A study figure as data for the app (GET /api/app/v1/study/figures/:id):
 * the same drawing the website shows (src/components/study/figures), with its
 * labels as data and the art as two standalone SVG documents whose colours
 * are already filled in (no stylesheet, no CSS variables), for
 * react-native-svg. The app draws the labels and leader lines itself.
 */

/** The theme tokens the figure palette is built from (src/app/globals.css). */
const THEME = {
  light: { foreground: "#111111", card: "#ffffff", primary: "#cdf24b", brand: "#1d44d8", link: "#1d44d8", primaryForeground: "#111111" },
  dark: { foreground: "#ffffff", card: "#181818", primary: "#cdf24b", brand: "#1d44d8", link: "#cdf24b", primaryForeground: "#111111" },
} as const;

// --- colour-mix(in oklab, a p%, b) --------------------------------------------
const toLin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toSrgb = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function hexToOklab(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => toLin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}

function oklabToHex([L, A, B]: [number, number, number]): string {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  return `#${rgb.map((c) => Math.round(Math.min(1, Math.max(0, toSrgb(c))) * 255).toString(16).padStart(2, "0")).join("")}`;
}

/** color-mix(in oklab, a pct%, b) */
export function mixOklab(a: string, pct: number, b: string): string {
  const x = hexToOklab(a);
  const y = hexToOklab(b);
  const t = pct / 100;
  return oklabToHex([x[0] * t + y[0] * (1 - t), x[1] * t + y[1] * (1 - t), x[2] * t + y[2] * (1 - t)]);
}

/** The figure palette of figure.module.css, resolved for one theme. */
export function figurePalette(theme: "light" | "dark"): Record<string, string> {
  const t = THEME[theme];
  const dark = theme === "dark";
  const blue = dark ? "#6f8cff" : t.brand;
  return {
    "--f-ink": t.foreground,
    "--f-paper": t.card,
    "--f-t1": mixOklab(t.foreground, dark ? 10 : 6, t.card),
    "--f-t2": mixOklab(t.foreground, dark ? 18 : 12, t.card),
    "--f-t3": mixOklab(t.foreground, dark ? 28 : 22, t.card),
    "--f-t4": mixOklab(t.foreground, dark ? 42 : 36, t.card),
    "--f-hi": t.primary,
    "--f-hi-soft": mixOklab(t.primary, 45, t.card),
    "--f-blue": blue,
    "--f-blue-soft": mixOklab(blue, dark ? 26 : 22, t.card),
    "--f-blue-mid": mixOklab(blue, dark ? 55 : 50, t.card),
    "--f-line": t.link,
    "--f-shade": dark ? "#000000" : t.foreground,
    "--foreground": t.foreground,
    "--card": t.card,
    "--primary": t.primary,
    "--primary-foreground": t.primaryForeground,
    "--brand": t.brand,
    "--link": t.link,
  };
}

/** Replace every var(--x) (with or without a fallback) by the palette colour. Unknown names fall back to ink. */
export function resolveVars(svg: string, palette: Record<string, string>): string {
  return svg.replace(/var\((--[a-z0-9-]+)(?:\s*,\s*[^)]*)?\)/gi, (_, name: string) => palette[name] ?? palette["--f-ink"]);
}

export async function figureData(id: string): Promise<Figure | null> {
  const f = FIGURES[id];
  if (!f) return null;
  const art = typeof f.art === "function" ? (f.art as (u: (n: string) => string) => ReactNode)((n) => `${f.id}-${n}`) : f.art;
  // Loaded at call time: Next.js refuses a static react-dom/server import in an App Route.
  const { renderToStaticMarkup } = await import("react-dom/server");
  const inner = renderToStaticMarkup(createElement("g", null, art));
  const doc = (theme: "light" | "dark") =>
    resolveVars(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${f.viewBox}">${inner}</svg>`, figurePalette(theme));
  return { v: 1, id: f.id, title: f.title, summary: f.summary, viewBox: f.viewBox, labels: f.labels.map((l) => ({ ...l })), svg: { light: doc("light"), dark: doc("dark") } };
}
