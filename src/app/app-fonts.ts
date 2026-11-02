import localFont from "next/font/local";

/**
 * Platform fonts, self-hosted (same files as the homepage, so the whole site
 * speaks one type language).
 *
 * - Archivo (variable: weight 100–900, width 62–125%) — every heading and body.
 * - Pixel (Silkscreen letters + Press Start 2P digits) — small uppercase
 *   labels only (`text-eyebrow`), never paragraphs.
 */
export const appSans = localFont({
  src: "./fonts/archivo-var.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

export const appPixel = localFont({
  src: "./fonts/silkscreen-400.woff2",
  variable: "--font-pixel",
  weight: "400",
  display: "swap",
  adjustFontFallback: false,
});

export const appPixelDigits = localFont({
  src: "./fonts/pix-digits.woff2",
  variable: "--font-pixel-digits",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "size-adjust", value: "84%" }],
});
