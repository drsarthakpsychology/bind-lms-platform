"use client";

import * as React from "react";
import { readingMs } from "../pacing";
import { Box, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { Rich } from "../rich";
import { SoundToggle } from "./sfx";

/**
 * Shared pieces for the explorable scenes: the card, mode tabs, live status, motion and WebGL detection, the 3D or flat view switch, and
 * small geometry helpers that the 3D views and the flat fallbacks both use
 * (so a nerve drawn in 3D and its flat drawing follow the same points).
 *
 * Nothing here imports three.js: the 3D views are loaded lazily, only when
 * WebGL is available and the student has not asked for reduced motion.
 */

export const card = "rounded-2xl border-2 border-foreground bg-card p-3 sm:p-5 shadow-[var(--shadow-hard-sm)]";
export const label = "text-xs font-semibold tracking-wide uppercase text-link";
export const btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border-2 border-foreground px-4 font-semibold transition-transform duration-fast active:translate-x-px active:translate-y-px";
export const statusCls = "mt-3 rounded-xl bg-muted p-3 text-[0.95rem] leading-relaxed empty:mt-0 empty:p-0";

export function chip(on: boolean, extra?: string) {
  return cn(
    "min-h-11 rounded-md border-2 border-foreground px-3 py-2 text-left text-sm font-semibold transition-[transform,background-color] duration-fast active:translate-x-px active:translate-y-px",
    on ? "bg-foreground text-background" : "bg-card hover:-translate-y-0.5",
    extra,
  );
}

/* ------------------------------------------------------------ environment */

const RM = "(prefers-reduced-motion: reduce)";
export function useReducedMotion(): boolean {
  return React.useSyncExternalStore(
    (cb) => {
      if (typeof window === "undefined" || !window.matchMedia) return () => {};
      const m = window.matchMedia(RM);
      m.addEventListener?.("change", cb);
      return () => m.removeEventListener?.("change", cb);
    },
    () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(RM).matches : false),
    () => false,
  );
}

let glCache: boolean | null = null;
/** True when the browser can draw WebGL. Never touches a canvas where WebGL is absent (jsdom). */
export function hasWebGL(): boolean {
  if (glCache !== null) return glCache;
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  if (!("WebGLRenderingContext" in window)) return (glCache = false);
  try {
    const c = document.createElement("canvas");
    glCache = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    glCache = false;
  }
  return glCache;
}
const noop = () => () => {};
export function useWebGL(): boolean {
  return React.useSyncExternalStore(noop, hasWebGL, () => false);
}

/** True while the element is on screen (or when the browser cannot tell). */
export function useInView<T extends Element>(ref: React.RefObject<T | null>): boolean {
  const [inView, setInView] = React.useState(true);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((es) => setInView(es.some((e) => e.isIntersecting)), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

/**
 * Which view to show: the 3D scene (WebGL, motion allowed, not switched to
 * flat by the student) or the flat drawing. Flat is also what the server and
 * the tests render.
 */
export function useSceneView(has3D = true) {
  const reduce = useReducedMotion();
  const gl = useWebGL();
  const [flat, setFlat] = React.useState(false);
  const can3D = has3D && gl && !reduce;
  return { reduce, can3D, use3D: can3D && !flat, flat, setFlat };
}

/**
 * Holds a lazily loaded 3D view. Until its first frame is drawn, the flat
 * view is shown and fully usable, so a slow connection never leaves a blank
 * box; then the 3D view fades in over it.
 */
export function Scene3DSlot({ flat, render }: { flat: React.ReactNode; render: (onReady: () => void) => React.ReactNode }) {
  const [ready, setReady] = React.useState(false);
  const onReady = React.useCallback(() => setReady(true), []);
  return (
    <div className="relative h-full w-full">
      {!ready ? <div className="absolute inset-0">{flat}</div> : null}
      <div className={cn("absolute inset-0 transition-opacity duration-slow", ready ? "opacity-100" : "pointer-events-none opacity-0")}>
        <React.Suspense fallback={null}>{render(onReady)}</React.Suspense>
      </div>
    </div>
  );
}

export function ViewSwitch({ v }: { v: ReturnType<typeof useSceneView> }) {
  if (!v.can3D) return null;
  return (
    <button type="button" className={cn(btn, "min-h-11 bg-card px-3 text-sm")} aria-pressed={!v.flat} onClick={() => v.setFlat(!v.flat)}>
      {v.flat ? <Box className="size-4" aria-hidden /> : <Square className="size-4" aria-hidden />} {v.flat ? "Show in 3D" : "Flat view"}
    </button>
  );
}

/* --------------------------------------------------------------- the card */

export function SceneCard({ title, children, caption, tools, sound = false }: { title: string; children: React.ReactNode; caption?: string; tools?: React.ReactNode; sound?: boolean }) {
  return (
    <figure className={cn(card, "overflow-hidden")}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={cn(label, "min-w-0 flex-1")}>{title}</p>
        {tools || sound ? (
          <div className={cn("flex flex-wrap items-center gap-1.5", sound ? "w-full sm:w-auto" : "")}>
            {sound ? <SoundToggle /> : null}
            {tools}
          </div>
        ) : null}
      </div>
      {children}
      {caption ? <figcaption className="mt-3 text-sm text-muted-foreground"><Rich text={caption} /></figcaption> : null}
    </figure>
  );
}

export function ModeTabs<T extends string>({ modes, value, onChange, name }: { modes: { id: T; label: string }[]; value: T; onChange: (m: T) => void; name: string }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap" role="group" aria-label={name}>
      {modes.map((m) => (
        <button key={m.id} type="button" aria-pressed={value === m.id} className={chip(value === m.id, "text-center sm:text-left")} onClick={() => onChange(m.id)}>
          {m.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- journey */

/** One stage of a signal's trip: the path it follows, how long it takes, and what is happening in words. */
export type Leg = { path: string; ms: number; say: string; tone: "sense" | "motor" | "symp" | "para" | "info" };

/**
 * A signal travelling leg by leg. Nothing moves until the student acts:
 * start() runs the legs in order, holding each for its animation or its
 * reading time, whichever is longer, then stops on the result (done). The
 * legs reached so far stay listed (JourneySteps), so no words are lost.
 */
type JourneyState = { legs: Leg[]; leg: number; run: number; key: string; playing: boolean; moving: boolean };
/** Move to a leg: its pulse plays once (moving), then the view rests until the student acts. */
const go = (x: JourneyState, leg: number, playing: boolean): JourneyState => ({ ...x, leg, run: x.run + 1, playing, moving: leg < x.legs.length });

export function useJourney() {
  const [s, setS] = React.useState<JourneyState>({ legs: [], leg: -1, run: 0, key: "", playing: false, moving: false });
  const curLeg = s.leg >= 0 && s.leg < s.legs.length ? s.legs[s.leg] : null;
  const hold = curLeg ? readingMs(curLeg.say, curLeg.ms) : 0;
  React.useEffect(() => {
    if (!s.playing || !hold) return;
    const t = setTimeout(() => setS((x) => (x.run === s.run ? go(x, x.leg + 1, x.leg + 1 < x.legs.length) : x)), hold);
    return () => clearTimeout(t);
  }, [s.playing, s.run, hold]);
  const legMs = curLeg?.ms ?? 0;
  React.useEffect(() => {
    if (!s.moving) return;
    const t = setTimeout(() => setS((x) => (x.run === s.run ? { ...x, moving: false } : x)), legMs + 120);
    return () => clearTimeout(t);
  }, [s.moving, s.run, legMs]);
  const start = React.useCallback((key: string, legs: Leg[]) => setS((x) => go({ ...x, legs, key }, 0, true)), []);
  const clear = React.useCallback(() => setS((x) => ({ legs: [], leg: -1, run: x.run + 1, key: "", playing: false, moving: false })), []);
  const done = s.leg >= s.legs.length && s.legs.length > 0;
  return { ...s, cur: curLeg, done, active: !!curLeg, start, clear };
}
export type Journey = ReturnType<typeof useJourney>;

/** The legs a journey has reached so far, in order, with the one playing now marked. */
export function JourneySteps({ journey }: { journey: Journey }) {
  if (!journey.legs.length) return null;
  const upTo = journey.done ? journey.legs.length : journey.leg + 1;
  return (
    <ol className="mt-2 space-y-1.5" aria-label="Signal path">
      {journey.legs.slice(0, upTo).map((l, k) => (
        <li key={`${journey.run}-${k}`} className={cn("vibha-pop flex gap-2 rounded-md border-2 px-2 py-0.5 text-[0.95rem] leading-snug", k === journey.leg ? "border-[var(--brand)] font-semibold" : "border-transparent")}>
          <span className="shrink-0 tabular-nums text-muted-foreground" aria-hidden>{k + 1}.</span>
          <span className="min-w-0"><span className="sr-only">{TONE_NAME[l.tone]}: </span>{l.say}</span>
        </li>
      ))}
    </ol>
  );
}

/** Progress (0 to 1) through the journey's current leg, driven by animation frames. */
export function useLegProgress(journey: Journey, reduce: boolean) {
  const [st, setSt] = React.useState({ id: "", t: 0 });
  const id = `${journey.run}-${journey.leg}`;
  const ms = journey.cur ? journey.cur.ms * 0.92 : 0;
  React.useEffect(() => {
    if (!ms) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = reduce ? 1 : Math.min(1, (now - t0) / ms);
      setSt({ id, t: k });
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [id, ms, reduce]);
  return st.id === id ? st.t : reduce ? 1 : 0;
}

/* --------------------------------------------------------------- geometry */

export type V3 = [number, number, number];

/** Catmull-Rom through the points, sampled evenly per segment. */
export function sampleCurve(pts: V3[], per = 12): V3[] {
  if (pts.length < 2) return pts.slice();
  const out: V3[] = [];
  const P = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, p1, p2, p3] = [P(i - 1), P(i), P(i + 1), P(i + 2)];
    for (let k = 0; k < per; k++) {
      const t = k / per, t2 = t * t, t3 = t2 * t;
      out.push([0, 1, 2].map((a) => 0.5 * (2 * p1[a] + (-p0[a] + p2[a]) * t + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t2 + (-p0[a] + 3 * p1[a] - 3 * p2[a] + p3[a]) * t3)) as V3);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/** The point a fraction t (0 to 1) of the way along a polyline, by length. */
export function along(pts: V3[], t: number): V3 {
  if (pts.length === 1) return pts[0];
  const seg: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]);
    seg.push(d);
    total += d;
  }
  let want = Math.max(0, Math.min(1, t)) * total;
  for (let i = 0; i < seg.length; i++) {
    if (want <= seg[i] || i === seg.length - 1) {
      const f = seg[i] ? Math.min(1, want / seg[i]) : 0;
      const a = pts[i], b = pts[i + 1];
      return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
    }
    want -= seg[i];
  }
  return pts[pts.length - 1];
}

/** A flat (front view) SVG path through 3D points: x right, y up becomes SVG y down. */
export function flatD(pts: V3[], sx: number, sy: number, ox: number, oy: number): string {
  return pts.map((p, i) => `${i ? "L" : "M"}${(ox + p[0] * sx).toFixed(1)} ${(oy - p[1] * sy).toFixed(1)}`).join(" ");
}

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** Colours read from the theme so the 3D scenes follow light and dark mode. */
export function useThemeColors(ref: React.RefObject<HTMLElement | null>) {
  const [c, setC] = React.useState({ fg: "#111111", bg: "#ffffff", brand: "#1d44d8", primary: "#cdf24b", danger: "#c4271b", muted: "#8c8c8c", card: "#ffffff" });
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const s = getComputedStyle(el);
      const g = (n: string, f: string) => s.getPropertyValue(n).trim() || f;
      setC({ fg: g("--foreground", "#111111"), bg: g("--background", "#ffffff"), brand: g("--brand", "#1d44d8"), primary: g("--primary", "#cdf24b"), danger: g("--destructive", "#c4271b"), muted: g("--chart-4", "#8c8c8c"), card: g("--card", "#ffffff") });
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme", "style"] });
    return () => mo.disconnect();
  }, [ref]);
  return c;
}
export type ThemeColors = ReturnType<typeof useThemeColors>;

/** Tone of a signal: colour plus a written name, so colour is never the only cue. */
export const TONE_NAME: Record<Leg["tone"], string> = { sense: "sensory (incoming)", motor: "motor (outgoing)", symp: "sympathetic", para: "parasympathetic", info: "processing" };
