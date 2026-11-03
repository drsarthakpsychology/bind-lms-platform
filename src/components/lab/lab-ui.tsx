"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Shared Lab building blocks, in the Neo-Brutalist Pastel world. */

export type LabResult = {
  /** Headline numbers saved to the student's record. */
  numbers: Record<string, number>;
  /** The student's own data, drawn. */
  view: React.ReactNode;
  /** One sentence comparing their data with the classic finding. */
  verdict: string;
};

export type RunnerProps = { onDone: (r: LabResult) => void };

export function LabButton({ className, tone = "primary", ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "primary" | "plain" | "ink" }) {
  return (
    <button
      type="button"
      {...p}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-foreground px-5 py-2 text-sm font-bold transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
        tone === "primary" && "bg-primary text-primary-foreground hard-shadow-sm",
        tone === "plain" && "bg-card text-foreground",
        tone === "ink" && "bg-foreground text-background",
        className,
      )}
    />
  );
}

export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border-2 border-foreground bg-card p-4 sm:p-6", className)}>{children}</div>;
}

/** Round counter, e.g. "Round 3 of 8", with a thin progress bar. */
export function RoundBar({ at, of, label = "Round" }: { at: number; of: number; label?: string }) {
  const pct = Math.round((Math.min(at, of) / of) * 100);
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold tabular-nums text-muted-foreground" aria-live="polite">
        {label} {Math.min(at, of)} of {of}
      </p>
      <div className="h-2 overflow-hidden rounded-full border-2 border-foreground bg-background" aria-hidden>
        <div className="h-full bg-primary transition-[width] duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/**
 * Line chart for small series (0..1 or raw values). Plain SVG, scales to its
 * container, readable in both themes because it draws with currentColor.
 */
export function LineChart({
  series,
  labels,
  max,
  height = 180,
  yLabel,
  xLabel,
  ariaLabel,
  marks,
  xCount,
}: {
  series: { name: string; values: number[]; dashed?: boolean }[];
  labels?: string[];
  max?: number;
  height?: number;
  yLabel?: string;
  xLabel?: string;
  ariaLabel: string;
  /** x positions (index) to tick, e.g. reward times. */
  marks?: number[];
  /** Fix the x axis to this many points, so a series that grows draws left to right. */
  xCount?: number;
}) {
  const W = 600;
  const H = height;
  const pad = { l: 36, r: 12, t: 12, b: 28 };
  const n = Math.max(xCount ?? 0, ...series.map((s) => s.values.length), 2);
  const top = max ?? Math.max(1, ...series.flatMap((s) => s.values));
  const x = (i: number) => pad.l + (i / (n - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => H - pad.b - (v / top) * (H - pad.t - pad.b);
  return (
    <figure className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full text-foreground" role="img" aria-label={ariaLabel}>
        <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke="currentColor" strokeWidth={2} />
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} stroke="currentColor" strokeWidth={2} />
        <text x={pad.l - 6} y={pad.t + 8} textAnchor="end" fontSize={12} fill="currentColor">
          {max === 1 ? "100%" : Math.round(top)}
        </text>
        <text x={pad.l - 6} y={H - pad.b} textAnchor="end" fontSize={12} fill="currentColor">
          0
        </text>
        {(marks ?? []).map((m, i) => (
          <line key={i} x1={x(m)} x2={x(m)} y1={H - pad.b} y2={H - pad.b + 7} stroke="var(--link)" strokeWidth={2} />
        ))}
        {series.map((s, si) => (
          <g key={s.name}>
            <polyline
              fill="none"
              stroke={si === 0 ? "var(--link)" : "currentColor"}
              strokeWidth={3}
              strokeDasharray={s.dashed ? "6 5" : undefined}
              strokeLinejoin="round"
              points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
            />
            {s.values.length <= 20 &&
              s.values.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={4} fill={si === 0 ? "var(--primary)" : "var(--card)"} stroke="currentColor" strokeWidth={2} />)}
          </g>
        ))}
        {labels &&
          labels.map((l, i) =>
            labels.length <= 14 || i % Math.ceil(labels.length / 10) === 0 ? (
              <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize={12} fill="currentColor">
                {l}
              </text>
            ) : null,
          )}
      </svg>
      {(yLabel || xLabel || series.length > 1) && (
        <figcaption className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {series.length > 1 &&
            series.map((s, si) => (
              <span key={s.name} className="inline-flex items-center gap-1.5">
                <span className={cn("inline-block h-0.5 w-5", si === 0 ? "bg-link" : "bg-foreground")} style={s.dashed ? { backgroundImage: "none", borderTop: "2px dashed currentColor", height: 0 } : undefined} aria-hidden />
                {s.name}
              </span>
            ))}
          {yLabel && <span>Up: {yLabel}</span>}
          {xLabel && <span>Across: {xLabel}</span>}
        </figcaption>
      )}
    </figure>
  );
}

/** Two or more bars, labelled with their values. */
export function Bars({ items, unit = "", ariaLabel }: { items: { label: string; value: number; highlight?: boolean }[]; unit?: string; ariaLabel: string }) {
  const top = Math.max(1, ...items.map((i) => Math.abs(i.value)));
  return (
    <ul className="space-y-2" aria-label={ariaLabel}>
      {items.map((it) => (
        <li key={it.label} className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] items-center gap-3">
          <span className="truncate text-sm font-semibold">{it.label}</span>
          <span className="flex items-center gap-2">
            <span className={cn("h-6 rounded-md border-2 border-foreground", it.highlight ? "bg-primary" : "bg-background")} style={{ width: `${Math.max(4, (Math.abs(it.value) / top) * 85)}%` }} aria-hidden />
            <span className="shrink-0 text-sm font-bold tabular-nums">
              {unit === "%" && it.value > 0 ? "+" : ""}
              {it.value}
              {unit}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Wait helper for runners (cancellable via the returned token). */
export function useTimers() {
  const ids = React.useRef<number[]>([]);
  React.useEffect(() => () => ids.current.forEach((i) => window.clearTimeout(i)), []);
  return React.useCallback((fn: () => void, ms: number) => {
    ids.current.push(window.setTimeout(fn, ms));
  }, []);
}
