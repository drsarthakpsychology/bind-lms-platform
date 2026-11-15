import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Design system v2: the motion parts (docs/design/DESIGN_SYSTEM_2026_11.md,
 * section 14). Everything here is CSS or the browser's own View Transitions,
 * so it stays smooth while a new page loads, and it all switches to a plain
 * swap (or a short fade) with reduced motion. The classes live in
 * src/app/globals.css, "DS MOTION".
 *
 *   PageMotion   the page change: old page fades out, new one rises in;
 *                a Back link slides the other way. Also the skeleton to
 *                content hand-over, since loading.tsx is a Suspense fallback.
 *   CountUp      a number that counts up once when it first appears
 *   SuccessMark  a lime tick that draws itself (a "done" moment)
 *
 * Server-safe: no hooks, no client code.
 */

type VTProps = {
  children: React.ReactNode;
  enter?: string | Record<string, string>;
  exit?: string | Record<string, string>;
  default?: string;
};

/**
 * React's <ViewTransition> (in the React that Next ships). It is missing from
 * the plain React package the unit tests use; there the page simply renders.
 */
const ViewTransition = (React as unknown as { ViewTransition?: React.ComponentType<VTProps> }).ViewTransition;

/** True where the page change is done by View Transitions (so the CSS fade on `.ds-page` is not needed). */
export const HAS_VIEW_TRANSITION = Boolean(ViewTransition);

/** Link types for the direction of a page change (`<Link transitionTypes>`). */
export const NAV_FORWARD = ["nav-forward"];
export const NAV_BACK = ["nav-back"];

const PAGE_ENTER = { "nav-forward": "ds-vt-fwd-in", "nav-back": "ds-vt-back-in", default: "ds-vt-in" };
const PAGE_EXIT = { "nav-forward": "ds-vt-fwd-out", "nav-back": "ds-vt-back-out", default: "ds-vt-out" };

/**
 * Wrap a page's content (PageFrame does it for you). On a page change the old
 * page fades out in 120ms and the new one rises 6px and fades in (220ms).
 * Updates inside the same page (filters, saves, refresh) do not animate.
 */
export function PageMotion({ children }: { children: React.ReactNode }) {
  if (!ViewTransition) return <>{children}</>;
  return (
    <ViewTransition enter={PAGE_ENTER} exit={PAGE_EXIT} default="none">
      {children}
    </ViewTransition>
  );
}

/** Wrap a loading skeleton: it fades away as the real page rises in. */
export function SkeletonMotion({ children }: { children: React.ReactNode }) {
  if (!ViewTransition) return <>{children}</>;
  return (
    <ViewTransition enter="ds-vt-in" exit="ds-vt-skel-out" default="none">
      {children}
    </ViewTransition>
  );
}

/* ------------------------------------------------------------------ */
/* CountUp                                                             */
/* ------------------------------------------------------------------ */

/** Whole numbers up to 9999, alone or followed by "%". Anything else is shown as it is. */
function countable(value: React.ReactNode): { n: number; digits: number; suffix: string } | null {
  if (typeof value === "number") {
    if (!Number.isInteger(value) || value <= 0 || value > 9999) return null;
    return { n: value, digits: String(value).length, suffix: "" };
  }
  if (typeof value === "string") {
    const m = /^(\d{1,4})(%?)$/.exec(value);
    if (!m || Number(m[1]) === 0 || m[1].startsWith("0")) return null;
    return { n: Number(m[1]), digits: m[1].length, suffix: m[2] };
  }
  return null;
}

/**
 * A number that counts up from 0 once, when it first paints (700ms, fast at
 * the start). Pure CSS: the digits are a counter animated through a typed
 * custom property, so nothing re-renders and nothing waits for JavaScript.
 * The real number holds the width from the first frame (no shift) and is what
 * screen readers read; with reduced motion it is simply the number.
 */
export function CountUp({ value, className }: { value: React.ReactNode; className?: string }) {
  const c = countable(value);
  if (!c) return <>{value}</>;
  // The real digits stay in the page (read aloud, copied, and holding the exact
  // width) but are see-through; the counting digits are drawn over them.
  return (
    <span className={cn("ds-count-wrap", className)}>
      <span data-ds-count className="ds-count" style={{ ["--ds-to" as string]: c.n }}>
        <span className="ds-count-real">{c.n}</span>
      </span>
      {c.suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* SuccessMark                                                         */
/* ------------------------------------------------------------------ */

/** A lime disc whose tick draws itself in (the "done" moment). Decorative. */
export function SuccessMark({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <span aria-hidden className={cn("ds-success-mark", className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" width="60%" height="60%">
        <path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} />
      </svg>
    </span>
  );
}
