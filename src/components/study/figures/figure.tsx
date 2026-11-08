"use client";

import * as React from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import type { FigureData } from "@/lib/study/types";
import { FIGURES } from "./registry";
import { layoutLabels } from "./layout";
import s from "./figure.module.css";

const ZOOMS = [1, 1.6, 2.4, 3.2];
const safe = (v: string) => v.replace(/[^a-z0-9-]/gi, "");

/**
 * A labelled illustration, like a textbook figure. Labels sit in the margins
 * with leader lines to their parts and never overlap; on a narrow screen the
 * margins hold numbers only and the names are in the list below. Tap a label,
 * a list row or the part itself to light the part up and read what it does.
 * In quiz mode the names stay hidden until tapped. Zoom in and drag to pan.
 */
export function Figure({ d }: { d: FigureData }) {
  const f = FIGURES[d.id];
  const uid = safe(React.useId());
  const boxRef = React.useRef<HTMLDivElement>(null);
  const [boxPx, setBoxPx] = React.useState(0);
  const [zoom, setZoom] = React.useState(0);
  const [open, setOpen] = React.useState<string | null>(null);
  const [shown, setShown] = React.useState<Set<string>>(() => new Set());

  React.useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => setBoxPx(Math.round(entries[0].contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const art = React.useMemo(() => {
    if (!f) return null;
    return typeof f.art === "function" ? f.art((n) => `fg-${uid}-${n}`) : f.art;
  }, [f, uid]);

  if (!f) return null;
  const z = ZOOMS[zoom];
  const px = (boxPx || 360) * z;
  const L = layoutLabels(f.viewBox, f.labels, px);
  const byId = new Map(f.labels.map((l) => [l.id, l]));
  const focus = new Set(d.focus ?? []);
  const named = (id: string) => !d.quiz || shown.has(id);
  const cur = open ? byId.get(open) : undefined;

  const pick = (id: string) => {
    setOpen((o) => (o === id ? null : id));
    if (d.quiz) setShown((v) => new Set(v).add(id));
    // When zoomed in, bring the part into view.
    const box = boxRef.current;
    const lab = byId.get(id);
    if (box && lab && z > 1 && typeof box.scrollTo === "function") {
      const [vx, vy, vw, vh] = L.viewBox;
      const sx = ((lab.x - vx) / vw) * box.scrollWidth - box.clientWidth / 2;
      const sy = ((lab.y - vy) / vh) * box.scrollHeight - box.clientHeight / 2;
      box.scrollTo({ left: Math.max(0, sx), top: Math.max(0, sy), behavior: "smooth" });
    }
  };
  const onArt = (e: React.MouseEvent<SVGGElement>) => {
    const hit = (e.target as Element).closest("[data-part],[data-line]");
    const id = hit?.getAttribute("data-part") ?? hit?.getAttribute("data-line");
    if (id) pick(id.split(" ")[0]);
  };

  // Light up the tapped part (lime fill) and the focus parts (soft lime).
  const sel = `[data-fig="${uid}"]`;
  const rules: string[] = [];
  for (const id of focus) {
    const k = safe(id);
    rules.push(`${sel} [data-part~="${k}"]{fill:var(--f-hi-soft);fill-opacity:1}`, `${sel} [data-line~="${k}"]{stroke:var(--f-line)}`);
  }
  if (open) {
    const k = safe(open);
    rules.push(`${sel} [data-part~="${k}"]{fill:var(--f-hi);fill-opacity:1;stroke:var(--f-ink)}`, `${sel} [data-line~="${k}"]{stroke:var(--f-line);stroke-opacity:1}`);
  }

  const u = L.upp;
  const fs = 12.5 * u;
  const r = (L.wide ? 10 : 12) * u;
  const [vx, vy, vw, vh] = L.viewBox;

  return (
    <figure className={`${s.fig} my-4 rounded-2xl border-2 border-foreground bg-card p-3`}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <figcaption className="pt-2 font-bold">{d.title ?? f.title}</figcaption>
        <div className="flex shrink-0 gap-1" role="group" aria-label="Zoom">
          <button type="button" aria-label="Zoom out" disabled={zoom === 0} onClick={() => setZoom((v) => Math.max(0, v - 1))} className="grid size-11 place-items-center rounded-[10px] border-2 border-foreground bg-card disabled:opacity-40">
            <Minus className="size-4" aria-hidden />
          </button>
          <button type="button" aria-label="Zoom in" disabled={zoom === ZOOMS.length - 1} onClick={() => setZoom((v) => Math.min(ZOOMS.length - 1, v + 1))} className="grid size-11 place-items-center rounded-[10px] border-2 border-foreground bg-card disabled:opacity-40">
            <Plus className="size-4" aria-hidden />
          </button>
          {zoom > 0 ? (
            <button type="button" aria-label="Back to full size" onClick={() => setZoom(0)} className="grid size-11 place-items-center rounded-[10px] border-2 border-foreground bg-card">
              <RotateCcw className="size-4" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>
      <div ref={boxRef} className={`${s.scroller} rounded-xl`} style={z > 1 ? { maxHeight: "70vh" } : undefined}>
        <svg
          viewBox={`${vx} ${vy} ${vw} ${vh}`}
          data-fig={uid}
          className="block h-auto text-foreground"
          style={{ width: z > 1 ? `${px}px` : "100%", maxWidth: z > 1 ? "none" : undefined }}
          role="img"
          aria-label={f.summary}
        >
          {rules.length ? <style>{rules.join("")}</style> : null}
          <g onClick={onArt} className="cursor-pointer">
            {art}
          </g>
          {L.placed.map((p) => {
            const on = open === p.id;
            const hot = on || focus.has(p.id);
            const left = p.side === "left";
            const cx = left ? L.leftEdge - r : L.rightEdge + r;
            const lx = left ? cx + r : cx - r;
            return (
              <g key={p.id} onClick={() => pick(p.id)} className="cursor-pointer" data-label={p.id}>
                <line x1={lx} y1={p.y} x2={p.tx} y2={p.ty} stroke={on ? "var(--f-line)" : "var(--f-ink)"} strokeOpacity={on ? 1 : open ? 0.25 : 0.6} strokeWidth={(on ? 2.2 : 1.1) * u} />
                <circle cx={p.tx} cy={p.ty} r={(on ? 4 : 2.6) * u} fill={on ? "var(--f-line)" : "var(--f-ink)"} stroke="var(--f-paper)" strokeWidth={1 * u} />
                {/* Generous invisible hit area across the whole margin row. */}
                <rect x={left ? vx : L.rightEdge} y={p.y - L.row / 2} width={left ? L.leftEdge - vx : vx + vw - L.rightEdge} height={L.row} fill="transparent" />
                <circle cx={cx} cy={p.y} r={r} fill={hot ? "var(--f-hi)" : "var(--f-paper)"} stroke="var(--f-ink)" strokeWidth={1.6 * u} />
                <text x={cx} y={p.y + fs * 0.36} textAnchor="middle" fill={hot ? "var(--primary-foreground)" : "var(--f-ink)"} fontSize={fs * 0.86} fontWeight={700}>
                  {p.n}
                </text>
                {L.wide ? (
                  <text x={left ? cx - r - 6 * u : cx + r + 6 * u} y={p.y + fs * 0.36 - ((p.lines.length - 1) * fs * 1.1) / 2} textAnchor={left ? "end" : "start"} fill="var(--f-ink)" fontSize={fs} fontWeight={on ? 700 : 500}>
                    {named(p.id) ? p.lines.map((t, k) => (
                      <tspan key={k} x={left ? cx - r - 6 * u : cx + r + 6 * u} dy={k ? fs * 1.1 : 0}>
                        {t}
                      </tspan>
                    )) : "?"}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 min-h-11 text-sm empty:min-h-0" role="status" aria-live="polite">
        {cur ? (
          <>
            <b>{cur.name}.</b> {cur.about}
          </>
        ) : null}
      </p>
      <ol className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
        {f.labels.map((l, i) => (
          <li key={l.id}>
            <button
              type="button"
              aria-pressed={open === l.id}
              onClick={() => pick(l.id)}
              className={`min-h-11 w-full rounded-[10px] px-2 text-left ${open === l.id ? "bg-primary font-semibold text-primary-foreground" : focus.has(l.id) ? "bg-muted" : "hover:bg-accent"}`}
            >
              {i + 1}. {named(l.id) ? l.name : "Hidden"}
            </button>
          </li>
        ))}
      </ol>
      {d.caption ? <p className="mt-2 text-sm text-muted-foreground">{d.caption}</p> : null}
    </figure>
  );
}
