import localFont from "next/font/local";

/**
 * Homepage-only fonts, self-hosted (subset WOFF2, ~100 KB total). Scoped to the
 * homepage wrapper via CSS variables so the LMS's own fonts are untouched.
 *
 * - Archivo (variable: weight 100 to 900, width 62 to 125%), display + body.
 * - Silkscreen: pixel labels (letters).
 * - Pixel digits: a digits-only subset of Press Start 2P. Listed FIRST in the
 *   pixel stack so numbers render with clear 1s and 4s while letters fall
 *   through to Silkscreen.
 */
export const archivo = localFont({
  src: "./fonts/archivo-var.woff2",
  variable: "--home-font-sans",
  weight: "100 900",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

export const pixel = localFont({
  src: [
    { path: "./fonts/silkscreen-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/silkscreen-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--home-font-pixel",
  display: "swap",
  adjustFontFallback: false,
});

export const pixelDigits = localFont({
  src: "./fonts/pix-digits.woff2",
  variable: "--home-font-digits",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "size-adjust", value: "84%" }],
});
