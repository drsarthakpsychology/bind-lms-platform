import { GLYPHS } from "./glyphs.generated";

/**
 * Text on the certificate is drawn from vector outlines (glyphs.generated.ts)
 * so the browser preview and the PDF are the same shapes, measured the same
 * way. Pure: runs in the browser, on the server and in tests.
 */

export type FontKey = "wordmark" | "sansWide" | "sans" | "sansBold" | "pixel" | "serif" | "serifItalic" | "serifDisplay";

/** Owner rule: no en or em dashes anywhere. Curly quotes are kept (the fonts have them). */
export function cleanText(s: string | null | undefined): string {
  return String(s ?? "")
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[\u00a0\u2000-\u200b]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Keep only characters the font can draw: accents fall back to the bare letter. */
export function drawable(text: string, font: FontKey): string {
  const g = GLYPHS[font].glyphs;
  let out = "";
  for (const ch of text) {
    if (g[ch]) out += ch;
    else {
      const bare = ch.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (bare && [...bare].every((c) => g[c])) out += bare;
      else if (ch === "\u2018" || ch === "\u2019") out += g["'"] ? "'" : "";
      else if (ch === "\u201c" || ch === "\u201d") out += g['"'] ? '"' : "";
    }
  }
  return out;
}

/** Width in points of `text` at `size`, with `tracking` points between letters. */
export function measure(text: string, font: FontKey, size: number, tracking = 0): number {
  const g = GLYPHS[font].glyphs;
  let units = 0;
  let n = 0;
  for (const ch of text) {
    units += g[ch]?.[0] ?? 0;
    n++;
  }
  return (units / 1000) * size + Math.max(0, n - 1) * tracking;
}

/** Greedy word wrap to `maxWidth`. Very long words are kept whole on their own line. */
export function wrap(text: string, font: FontKey, size: number, maxWidth: number, tracking = 0): string[] {
  const words = text.split(" ").filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (line && measure(next, font, size, tracking) > maxWidth) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** The largest size from `size` down to `min` at which the text fits on one line. */
export function fitSize(text: string, font: FontKey, size: number, maxWidth: number, min: number, tracking = 0): number {
  let s = size;
  while (s > min && measure(text, font, s, tracking) > maxWidth) s -= 0.5;
  return s;
}

const fmt = (v: number) => {
  const r = Math.round(v * 100) / 100;
  return Object.is(r, -0) ? "0" : String(r);
};

/**
 * Move and scale one glyph path (absolute M L H V Q C Z commands, as written
 * by fontTools' SVGPathPen) into page coordinates.
 */
export function placePath(d: string, dx: number, dy: number, scale: number): string {
  const tokens = d.match(/[MLHVQCZ]|-?\d+(?:\.\d+)?/g) ?? [];
  let out = "";
  let cmd = "";
  let axis = 0; // 0 = expecting x, 1 = expecting y (for pair commands)
  for (const t of tokens) {
    if (/^[A-Z]$/.test(t)) {
      cmd = t;
      axis = 0;
      out += t;
      continue;
    }
    const v = Number(t);
    let p: number;
    if (cmd === "H") p = v * scale + dx;
    else if (cmd === "V") p = v * scale + dy;
    else {
      p = axis === 0 ? v * scale + dx : v * scale + dy;
      axis = 1 - axis;
    }
    out += (out.endsWith(" ") || /[A-Z]$/.test(out) ? "" : " ") + fmt(p);
  }
  return out;
}

/** One line of text as a single path in page coordinates, baseline at y. */
export function textPath(text: string, font: FontKey, size: number, x: number, y: number, tracking = 0): string {
  const g = GLYPHS[font].glyphs;
  const s = size / 1000;
  let cx = x;
  let d = "";
  for (const ch of text) {
    const glyph = g[ch];
    if (!glyph) continue;
    if (glyph[1]) d += placePath(glyph[1], cx, y, s);
    cx += glyph[0] * s + tracking;
  }
  return d;
}
