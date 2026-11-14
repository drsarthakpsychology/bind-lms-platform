"use client";

/**
 * Hand-drawn frames for diagrams made of words: flowcharts, layer lists and
 * side-by-side comparisons. The words stay real HTML (they wrap, never get cut
 * off and a screen reader reads them in order); one SVG laid over the top
 * draws the wobbly boxes, number dots, marker strokes and arrows around them
 * at their measured size. Until it is measured (the server, tests, no
 * ResizeObserver) each box keeps a plain border, so nothing is ever unframed.
 *
 * Mark the pieces inside a <SketchFrame> with `data-sk`:
 *   box   a hand-drawn box on paper (data-sk-tone: paper | plain | wash | lime | blue | dash)
 *   dot   a lime dot behind a number
 *   mark  a lime marker stroke behind a word
 * and give each a unique `data-sk-id` so arrows can name their ends.
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import { Arrow, C, E, Ink, P, R } from "./ink";

export type Link = {
  from: string;
  to: string;
  /** down: bottom of `from` to top of `to`, at the left; elbow: down the left rail, then right into `to`; loop: from the bottom of `from` back up to the top of `to`, round the right side. */
  kind?: "down" | "elbow" | "loop";
  /** Highlight this arrow. */
  hot?: boolean;
  /** elbow only: the sibling above, so the rail carries on from its arrow instead of being drawn twice. */
  after?: string;
};

type Box = { id: string; sk: string; tone: string; x: number; y: number; w: number; h: number };
type Measured = { w: number; h: number; boxes: Box[] };

function measure(el: HTMLElement): Measured {
  const o = el.getBoundingClientRect();
  const boxes: Box[] = [];
  el.querySelectorAll<HTMLElement>("[data-sk]").forEach((n, i) => {
    const r = n.getBoundingClientRect();
    if (!r.width || !r.height) return;
    boxes.push({ id: n.dataset.skId ?? `n${i}`, sk: n.dataset.sk ?? "box", tone: n.dataset.skTone ?? "paper", x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height });
  });
  return { w: Math.round(o.width), h: Math.round(o.height), boxes };
}

/** Measures the frame (and again whenever it changes size, as fonts load or the screen turns). */
function useMeasured(ref: React.RefObject<HTMLDivElement | null>): Measured | null {
  const [m, setM] = React.useState<Measured | null>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setM(measure(el)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return m;
}

const FILL: Record<string, { fill?: string; fillStyle?: "solid" | "hachure"; dash?: string; sw?: number }> = {
  plain: {},
  paper: { fill: C.paper, fillStyle: "solid" },
  wash: { fill: C.wash, fillStyle: "solid" },
  lime: { fill: C.lime, fillStyle: "hachure" },
  blue: { fill: C.blue, fillStyle: "hachure" },
  dash: { dash: "6 5", sw: 1.4 },
};

function Shapes({ m, links, salt }: { m: Measured; links: Link[]; salt: string }) {
  const by = new Map(m.boxes.map((b) => [b.id, b]));
  const k = (s: string) => `${salt}-${s}-${Math.round(m.w / 40)}`;
  return (
    <>
      {m.boxes.map((b) => {
        if (b.sk === "dot") return <E key={b.id} k={k(`dot-${b.id}`)} cx={b.x + b.w / 2} cy={b.y + b.h / 2} w={b.w + 4} h={b.h + 2} fill={C.lime} fillStyle="solid" sw={1.6} />;
        if (b.sk === "mark") return <Ink key={b.id} k={k(`mark-${b.id}`)} shape={{ t: "rect", x: b.x - 3, y: b.y + b.h * 0.12, w: b.w + 6, h: b.h * 0.86 }} o={{ stroke: "none", fill: C.lime, fillStyle: "solid", rough: 1.4 }} />;
        const f = FILL[b.tone] ?? FILL.plain;
        return (
          <g key={b.id}>
            {f.fill && f.fillStyle === "hachure" ? <R k={k(`fill-${b.id}`)} x={b.x + 4} y={b.y + 4} w={b.w - 8} h={b.h - 8} stroke="none" fill={f.fill} fillStyle="hachure" gap={7} fw={1.2} /> : null}
            <R k={k(`box-${b.id}`)} x={b.x + 1.5} y={b.y + 1.5} w={b.w - 3} h={b.h - 3} sw={f.sw ?? 1.8} dash={f.dash} fill={f.fillStyle === "solid" ? f.fill : undefined} fillStyle={f.fillStyle === "solid" ? "solid" : undefined} rough={1} bow={1} />
          </g>
        );
      })}
      {links.map((l) => {
        const a = by.get(l.from);
        const b = by.get(l.to);
        if (!a || !b) return null;
        const stroke = l.hot ? C.blue : C.ink;
        const kind = l.kind ?? "down";
        if (kind === "down") {
          const x = a.x + 22;
          const y1 = a.y + a.h + 2;
          const y2 = b.y - 3;
          if (y2 - y1 < 6) return null;
          return <Arrow key={`${l.from}>${l.to}`} k={k(`ar-${l.from}-${l.to}`)} from={[x, y1]} to={[x, y2]} stroke={stroke} sw={1.8} />;
        }
        if (kind === "elbow") {
          const x = a.x + 14;
          const y = b.y + Math.min(22, b.h / 2);
          const prev = l.after ? by.get(l.after) : undefined;
          const top = prev ? prev.y + Math.min(22, prev.h / 2) : a.y + a.h + 1;
          return (
            <g key={`${l.from}>${l.to}`}>
              <P k={k(`el-${l.from}-${l.to}`)} d={`M${x} ${top} L${x} ${y}`} stroke={C.ink} sw={1.5} single rough={0.5} />
              <Arrow k={k(`elh-${l.from}-${l.to}`)} from={[x, y]} to={[b.x - 3, y]} stroke={stroke} sw={1.5} />
            </g>
          );
        }
        // loop: out of the bottom of `from`, round the right edge, back into the top of `to`
        const right = Math.min(m.w - 6, Math.max(a.x + a.w, b.x + b.w) + 14);
        const y1 = a.y + a.h / 2;
        const y2 = b.y + Math.min(20, b.h / 2);
        return (
          <g key={`${l.from}>${l.to}`}>
            <P k={k(`lp-${l.from}-${l.to}`)} d={`M${a.x + a.w + 2} ${y1} Q${right} ${y1} ${right} ${y1 - 18} L${right} ${y2 + 18} Q${right} ${y2} ${b.x + b.w + 10} ${y2}`} stroke={stroke} sw={1.8} single rough={0.6} />
            <Arrow k={k(`lph-${l.from}-${l.to}`)} from={[b.x + b.w + 12, y2]} to={[b.x + b.w + 2, y2]} stroke={stroke} sw={1.8} />
          </g>
        );
      })}
    </>
  );
}

/**
 * The frame. Children are ordinary HTML; pieces marked with `data-sk` get
 * their hand-drawn outline. `pad` leaves room on the right for loop arrows.
 */
export function SketchFrame({ children, links = [], className, salt = "f" }: { children: React.ReactNode; links?: Link[]; className?: string; salt?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const m = useMeasured(ref);
  return (
    <div ref={ref} data-drawn={m ? "" : undefined} className={cn("sketch group relative", className)}>
      {m ? (
        <svg aria-hidden className="pointer-events-none absolute inset-0 overflow-visible" width={m.w} height={m.h} viewBox={`0 0 ${m.w} ${m.h}`}>
          <Shapes m={m} links={links} salt={salt} />
        </svg>
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}

/** The class for a box before it is drawn: a plain border that the drawing replaces. */
export const BOX = "rounded-md border-2 border-foreground group-data-drawn:border-transparent";
