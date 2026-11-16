/**
 * Guards for react-native-svg on Android. Some valid SVG makes its Java side
 * throw while drawing or setting props, which CLOSES THE APP (a native crash:
 * no JS error boundary or handler sees it). Found in react-native-svg 15.16:
 *  - <marker orient="auto-start-reverse">: MarkerView calls
 *    Double.parseDouble(orient) on anything but "auto" (NumberFormatException).
 *  - pointer-events="visibleStroke" (or any web value): RenderableViewManager
 *    calls PointerEvents.valueOf(...) (IllegalArgumentException).
 *  - path data the Android PathParser refuses (NaN, undefined, not starting
 *    with M, a number right after Z): IllegalArgumentException.
 *  - unknown alignment-baseline / dominant-baseline, font-style, fill-rule.
 * Every SVG string and every computed path goes through these first.
 */

const POINTER_OK = new Set(["auto", "none", "box-none", "box-only"]);
const BASELINE_OK = new Set(["baseline", "text-bottom", "alphabetic", "ideographic", "middle", "central", "mathematical", "text-top", "bottom", "center", "top", "text-before-edge", "text-after-edge", "before-edge", "after-edge", "hanging"]);
const FONT_STYLE_OK = new Set(["normal", "italic", "oblique"]);
const FILL_RULE_OK = new Set(["evenodd", "nonzero"]);

/** True when Android's PathParser accepts this path data (a cautious subset). */
export function isSafePath(d: string): boolean {
  const p = d.trim();
  if (p === "") return true;
  if (!/^[Mm]/.test(p)) return false;
  if (!/^[MmZzLlHhVvCcSsQqTtAa0-9eE.,+\-\s]*$/.test(p)) return false;
  // "ClosePath cannot be followed by a number."
  if (/[Zz][\s,]*[-+.0-9]/.test(p)) return false;
  return true;
}

/** A path that can always be drawn: an unsafe one becomes empty. */
export function safePath(d: string | null | undefined): string {
  if (typeof d !== "string") return "";
  return isSafePath(d) ? d : "";
}

/** A finite number, or the fallback (NaN, Infinity and non-numbers never reach the native side). */
export function finite(n: unknown, fallback = 0): number {
  return typeof n === "number" && Number.isFinite(n) ? n : fallback;
}

/** An SVG document made safe for react-native-svg's SvgXml on Android. */
export function safeSvgXml(xml: string | null | undefined): string {
  if (typeof xml !== "string" || !xml) return "";
  return (
    xml
      // Markers: only "auto" or a number is understood. auto-start-reverse only differs at a path's start.
      .replace(/\sorient="([^"]*)"/g, (_m, v: string) => (v === "auto" || /^-?\d+(\.\d+)?$/.test(v.trim()) ? ` orient="${v}"` : ' orient="auto"'))
      .replace(/\spointer-events="([^"]*)"/g, (m, v: string) => (POINTER_OK.has(v) ? m : ""))
      .replace(/\s(alignment-baseline|dominant-baseline)="([^"]*)"/g, (m, _a: string, v: string) => (BASELINE_OK.has(v) ? m : ""))
      .replace(/\sfont-style="([^"]*)"/g, (m, v: string) => (FONT_STYLE_OK.has(v) ? m : ""))
      .replace(/\s(fill-rule|clip-rule)="([^"]*)"/g, (m, _a: string, v: string) => (FILL_RULE_OK.has(v) ? m : ""))
      .replace(/\sd="([^"]*)"/g, (m, v: string) => (isSafePath(v) ? m : ' d=""'))
      // Any other number attribute that came out as NaN or Infinity.
      .replace(/="(-?Infinity|NaN|undefined)"/g, '="0"')
  );
}
