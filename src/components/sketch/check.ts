/**
 * Label checks for hand-drawn drawings, shared by the medicine and Study
 * tests: no two labels overlap and none runs off its drawing. Label boxes are
 * measured with the Kalam font's own widths (metrics.ts), so this works in
 * jsdom; the screenshot check measures the same in a real browser.
 */
import { kalamWidth } from "./metrics";

type Box = { t: string; left: number; right: number; top: number; bottom: number };

function labelBoxes(svg: SVGSVGElement): Box[] {
  return [...svg.querySelectorAll("text")]
    .filter((t) => t.textContent?.trim())
    .map((t) => {
      const size = Number(t.getAttribute("font-size"));
      const x = Number(t.getAttribute("x"));
      const y = Number(t.getAttribute("y"));
      const w = kalamWidth(t.textContent ?? "", t.getAttribute("font-weight") === "700") * size;
      const anchor = t.getAttribute("text-anchor");
      const left = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
      return { t: t.textContent!.trim(), left, right: left + w, top: y - 0.78 * size, bottom: y + 0.26 * size };
    });
}

/** Problems with the labels of one drawing: overlaps, labels cut off, labels inside a moved group (which this check could not measure). */
export function labelProblems(svg: SVGSVGElement): string[] {
  const name = svg.getAttribute("data-sketch");
  const [vx, vy, vw, vh] = (svg.getAttribute("viewBox") ?? "0 0 0 0").split(" ").map(Number);
  const out: string[] = [];
  for (const t of svg.querySelectorAll("text")) if (t.closest("[transform]")) out.push(`${name}: "${t.textContent}" sits in a moved group`);
  const boxes = labelBoxes(svg);
  for (const b of boxes) if (b.left < vx - 0.5 || b.top < vy - 0.5 || b.right > vx + vw + 0.5 || b.bottom > vy + vh + 0.5) out.push(`${name}: "${b.t}" is cut off`);
  for (let i = 0; i < boxes.length; i++)
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i];
      const b = boxes[j];
      const ix = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const iy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ix > 0.5 && iy > 0.5) out.push(`${name}: "${a.t}" overlaps "${b.t}"`);
    }
  return out;
}
