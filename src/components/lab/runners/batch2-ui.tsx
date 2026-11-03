"use client";

import * as React from "react";
import type { Point } from "@/lib/lab/scoring2";
import { cn } from "@/lib/utils";

/** Small building blocks for Lab experiments 8 to 12 (kept apart from lab-ui). */

/** An answer button that shows right / wrong once the student has picked. */
export function Choice({
  picked,
  correct,
  revealed,
  className,
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { picked: boolean; correct: boolean; revealed: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={picked}
      {...p}
      className={cn(
        "min-h-11 rounded-xl border-2 border-foreground px-3 py-2 text-left text-sm font-bold transition-transform active:translate-y-px",
        !revealed && (picked ? "bg-foreground text-background" : "bg-card hover:-translate-y-0.5"),
        revealed && correct && "bg-primary text-primary-foreground",
        revealed && picked && !correct && "bg-foreground text-background line-through",
        revealed && !picked && !correct && "opacity-40",
        className,
      )}
    />
  );
}

/** A radio card group (keyboard: arrow keys move within the group). */
export function RadioCards<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  disabled,
  note,
}: {
  name: string;
  legend: string;
  options: { id: T; label: string }[];
  value: T | null;
  onChange: (v: T) => void;
  disabled?: boolean;
  note?: string;
}) {
  return (
    <fieldset className={cn("space-y-2", disabled && "opacity-50")} disabled={disabled}>
      <legend className="font-semibold">{legend}</legend>
      {note && <p className="text-sm text-muted-foreground">{note}</p>}
      <div className="grid gap-2">
        {options.map((o) => (
          <label
            key={o.id}
            className={cn(
              "flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border-2 border-foreground px-3 py-2 text-sm has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
              value === o.id ? "bg-primary font-bold text-primary-foreground" : "bg-background",
              disabled && "cursor-not-allowed",
            )}
          >
            <input type="radio" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} className="mt-0.5 size-4 shrink-0 accent-[var(--foreground)]" />
            <span className="min-w-0">{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** A 0 to 100 meter with a hard ink border. */
export function Meter({ value, label, valueText }: { value: number; label: string; valueText?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3 text-sm font-semibold">
        <span>{label}</span>
        <span className="font-mono tabular-nums text-link">{valueText ?? `${Math.round(v)}%`}</span>
      </div>
      <div role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v)} aria-valuetext={valueText} className="h-5 overflow-hidden rounded-md border-2 border-foreground bg-background">
        <div className="h-full bg-primary transition-[width] duration-200 motion-reduce:transition-none" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

/**
 * Scatter plot drawn with currentColor (both themes). Points with `hidden`
 * are drawn grey only when `showHidden`. With `byGroup`, z > 0 points are
 * filled and z < 0 hollow, so groups read without colour.
 */
export function Scatter({
  points,
  xLabel,
  yLabel,
  ariaLabel,
  showHidden = false,
  byGroup = false,
}: {
  points: Point[];
  xLabel: string;
  yLabel: string;
  ariaLabel: string;
  showHidden?: boolean;
  byGroup?: boolean;
}) {
  const W = 360;
  const H = 240;
  const pad = { l: 28, r: 10, t: 10, b: 28 };
  const all = showHidden ? points : points.filter((p) => !p.hidden);
  const xs = all.map((p) => p.x);
  const ys = all.map((p) => p.y);
  const [x0, x1] = [Math.min(...xs), Math.max(...xs)];
  const [y0, y1] = [Math.min(...ys), Math.max(...ys)];
  const sx = (v: number) => pad.l + 8 + ((v - x0) / (x1 - x0 || 1)) * (W - pad.l - pad.r - 16);
  const sy = (v: number) => H - pad.b - 8 - ((v - y0) / (y1 - y0 || 1)) * (H - pad.t - pad.b - 16);
  const r = points.length <= 12 ? 6 : points.length > 120 ? 3.5 : 4.5;
  return (
    <figure className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full text-foreground" role="img" aria-label={ariaLabel}>
        <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke="currentColor" strokeWidth={2} />
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} stroke="currentColor" strokeWidth={2} />
        <text x={(W + pad.l) / 2} y={H - 8} textAnchor="middle" fontSize={12} fill="currentColor">
          {xLabel} →
        </text>
        <text x={14} y={(H - pad.b + pad.t) / 2} textAnchor="middle" fontSize={12} fill="currentColor" transform={`rotate(-90 14 ${(H - pad.b + pad.t) / 2})`}>
          {yLabel} →
        </text>
        {points.map((p, i) => {
          if (p.hidden && !showHidden) return null;
          if (p.hidden) return <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={r - 1} fill="currentColor" opacity={0.18} />;
          const hollow = byGroup && (p.z ?? 0) < 0;
          return <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={r} fill={hollow ? "var(--card)" : byGroup ? "currentColor" : "var(--primary)"} stroke="currentColor" strokeWidth={1.5} />;
        })}
      </svg>
    </figure>
  );
}

/** Labelled slider with words at each end. */
export function EndsSlider({
  id,
  label,
  left,
  right,
  value,
  onChange,
  disabled,
  valueText,
  min = 0,
  max = 100,
  step = 5,
}: {
  id: string;
  label: string;
  left: string;
  right: string;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  valueText?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-valuetext={valueText}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--link)] disabled:opacity-60"
      />
      <div className="flex justify-between gap-3 text-xs font-semibold text-muted-foreground" aria-hidden>
        <span>{left}</span>
        <span className="text-right">{right}</span>
      </div>
    </div>
  );
}
