import type { FigureLabel } from "./types";

/** Where one label sits in the margin, and the leader line back to its part. */
export type Placed = { id: string; n: number; side: "left" | "right"; y: number; tx: number; ty: number; lines: string[] };

export type Layout = {
  /** The widened viewBox (art plus label margins). */
  viewBox: [number, number, number, number];
  /** viewBox units per screen pixel. */
  upp: number;
  /** Names are shown in the margin (wide) or only numbers (compact). */
  wide: boolean;
  /** Inner edge of each margin, where the number circles sit. */
  leftEdge: number;
  rightEdge: number;
  row: number;
  placed: Placed[];
};

export function parseViewBox(vb: string): [number, number, number, number] {
  const [x, y, w, h] = vb.split(/[\s,]+/).map(Number);
  return [x, y, w, h];
}

/** Rough text width in pixels at the figure's label size. */
const textPx = (s: string) => s.length * 6.6;

/** Split a long name over two lines at the space nearest its middle. */
export function wrapName(name: string, max = 17): string[] {
  if (name.length <= max) return [name];
  let best = -1;
  for (let i = 0; i < name.length; i++) if (name[i] === " " && (best < 0 || Math.abs(i - name.length / 2) < Math.abs(best - name.length / 2))) best = i;
  return best < 0 ? [name] : [name.slice(0, best), name.slice(best + 1)];
}

/**
 * Lay labels out in a left and a right margin, sorted top to bottom so leader
 * lines rarely cross, and pushed apart so no two labels overlap.
 * `px` is the drawing's width on screen in pixels (already multiplied by zoom).
 */
export function layoutLabels(viewBox: string, labels: FigureLabel[], px: number): Layout {
  const [x0, y0, w, h] = parseViewBox(viewBox);
  const width = Math.max(px, 240);
  const mid = x0 + w / 2;
  // Split by which half the part is in, then even the two sides out.
  const sides: { left: FigureLabel[]; right: FigureLabel[] } = { left: [], right: [] };
  for (const l of labels) (l.x < mid ? sides.left : sides.right).push(l);
  const balance = () => {
    const [big, small] = sides.left.length > sides.right.length ? [sides.left, sides.right] : [sides.right, sides.left];
    while (big.length - small.length > 2) {
      big.sort((a, b) => Math.abs(b.x - mid) - Math.abs(a.x - mid));
      small.push(big.pop() as FigureLabel);
    }
  };
  balance();
  const nameIndex = new Map(labels.map((l, i) => [l.id, i + 1]));

  const marginPx = (list: FigureLabel[], wide: boolean) =>
    !list.length ? 10 : wide ? Math.min(220, Math.max(96, Math.max(...list.flatMap((l) => wrapName(l.name).map(textPx))) + 40)) : 34;
  const solve = (wide: boolean) => {
    const gl = marginPx(sides.left, wide);
    const gr = marginPx(sides.right, wide);
    const artPx = width - gl - gr;
    return { gl, gr, artPx };
  };
  let wide = width >= 560;
  let m = solve(wide);
  if (wide && m.artPx < Math.max(300, width * 0.48)) {
    wide = false;
    m = solve(false);
  }
  const upp = w / Math.max(m.artPx, 120);
  const GL = m.gl * upp;
  const GR = m.gr * upp;
  const twoLines = wide && labels.some((l) => wrapName(l.name).length > 1);
  const row = (wide ? (twoLines ? 34 : 24) : 30) * upp;

  const placed: Placed[] = [];
  let top = y0;
  let bottom = y0 + h;
  for (const side of ["left", "right"] as const) {
    const list = [...sides[side]].sort((a, b) => a.y - b.y);
    const ys = list.map((l) => l.y);
    // A column taller than the drawing is centred on it and spills evenly.
    const lo = Math.min(y0 + row / 2, y0 + h / 2 - ((ys.length - 1) * row) / 2);
    const hi = Math.max(y0 + h - row / 2, lo + (ys.length - 1) * row);
    // Forward pass: no overlaps, starting at the top.
    for (let i = 0; i < ys.length; i++) ys[i] = Math.max(ys[i], i ? ys[i - 1] + row : lo);
    // Backward pass: pull back inside the bottom edge.
    for (let i = ys.length - 1; i >= 0; i--) ys[i] = Math.min(ys[i], i < ys.length - 1 ? ys[i + 1] - row : hi);
    if (ys.length) {
      top = Math.min(top, ys[0] - row / 2);
      bottom = Math.max(bottom, ys[ys.length - 1] + row / 2);
    }
    list.forEach((l, i) => placed.push({ id: l.id, n: nameIndex.get(l.id) ?? 0, side, y: ys[i], tx: l.x, ty: l.y, lines: wrapName(l.name) }));
  }
  const vbTop = Math.min(y0, top);
  const vbBottom = Math.max(y0 + h, bottom);
  return {
    viewBox: [x0 - GL, vbTop, w + GL + GR, vbBottom - vbTop],
    upp,
    wide,
    leftEdge: x0 - 12 * upp,
    rightEdge: x0 + w + 12 * upp,
    row,
    placed,
  };
}
