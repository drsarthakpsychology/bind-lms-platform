"use client";

import * as React from "react";
import type { FigureData } from "@/lib/study/types";
import { FIGURES } from "./registry";

/**
 * A labelled illustration. Tap a label to read what that part does; in quiz
 * mode the names are hidden until tapped. Every label is also listed in words.
 */
export function Figure({ d }: { d: FigureData }) {
  const f = FIGURES[d.id];
  const [open, setOpen] = React.useState<string | null>(null);
  const [shown, setShown] = React.useState<Set<string>>(() => new Set());
  if (!f) return null;
  const focus = new Set(d.focus ?? []);
  const pick = (id: string) => {
    setOpen(id);
    if (d.quiz) setShown((s) => new Set(s).add(id));
  };
  const cur = f.labels.find((l) => l.id === open);
  return (
    <figure className="my-4 rounded-2xl border-2 border-foreground bg-card p-3">
      <figcaption className="mb-2 font-bold">{d.title ?? f.title}</figcaption>
      <svg viewBox={f.viewBox} className="h-auto w-full text-foreground" role="img" aria-label={f.summary}>
        {f.art}
        {f.labels.map((l, i) => {
          const named = !d.quiz || shown.has(l.id);
          const on = open === l.id || focus.has(l.id);
          return (
            <g key={l.id} onClick={() => pick(l.id)} className="cursor-pointer">
              <circle cx={l.x} cy={l.y} r={on ? 9 : 7} className={on ? "fill-primary stroke-foreground" : "fill-card stroke-foreground"} strokeWidth={2} />
              <text x={l.x} y={l.y + 4} textAnchor="middle" className="fill-foreground text-[10px] font-bold">{i + 1}</text>
              {named ? <text x={l.x + 12} y={l.y + 4} className="fill-foreground text-[11px]">{l.name}</text> : null}
            </g>
          );
        })}
      </svg>
      <p className="mt-2 min-h-11 text-sm" role="status" aria-live="polite">
        {cur ? <><b>{cur.name}.</b> {cur.about}</> : d.quiz ? "Tap a number to reveal the part." : "Tap a number to see what that part does."}
      </p>
      <ol className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
        {f.labels.map((l, i) => (
          <li key={l.id}>
            <button type="button" onClick={() => pick(l.id)} className="min-h-11 w-full rounded-md px-2 text-left hover:bg-secondary">
              {i + 1}. {!d.quiz || shown.has(l.id) ? l.name : "Hidden"}
            </button>
          </li>
        ))}
      </ol>
      {d.caption ? <p className="mt-2 text-sm text-muted-foreground">{d.caption}</p> : null}
    </figure>
  );
}
