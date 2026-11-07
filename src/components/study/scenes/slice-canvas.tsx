"use client";

import * as React from "react";
import { REGION_COLOR, type RegionId } from "./brain-explorer-data";
import { EXTENT, hexToRgb, renderSlice, type Plane, type Slice } from "./brain-slice";

/**
 * A scan-like slice drawn on a canvas. Slices are cached, so scrolling back
 * and forth is instant after the first pass. The picture is decoration for
 * sighted students; the parts on the slice are always listed in words by
 * the scene that uses it.
 */

const cache = new Map<string, Slice>();
const colorOf = (id: RegionId) => hexToRgb(REGION_COLOR[id]);
export function getSlice(plane: Plane, u: number, tint: boolean, w = 160): Slice {
  const key = `${plane}|${u.toFixed(3)}|${tint}|${w}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const sl = renderSlice(plane, u, w, tint, colorOf);
  cache.set(key, sl);
  if (cache.size > 40) cache.delete(cache.keys().next().value as string);
  return sl;
}

const canDraw = () => typeof navigator !== "undefined" && !/jsdom/i.test(navigator.userAgent);

export function SliceCanvas({ plane, u, tint, className, children }: { plane: Plane; u: number; tint: boolean; className?: string; children?: React.ReactNode }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const ex = EXTENT[plane];
  const aspect = (ex.s[1] - ex.s[0]) / (ex.t[1] - ex.t[0]);
  React.useEffect(() => {
    const c = ref.current;
    if (!c || !canDraw()) return;
    // draw on the next frame, so a fast slider only paints the latest slice
    const raf = requestAnimationFrame(() => {
      const sl = getSlice(plane, u, tint);
      c.width = sl.w;
      c.height = sl.h;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.putImageData(new ImageData(sl.px, sl.w, sl.h), 0, 0);
    });
    return () => cancelAnimationFrame(raf);
  }, [plane, u, tint]);
  return (
    <div className={className} style={{ aspectRatio: String(aspect) }}>
      <div className="relative h-full w-full overflow-hidden rounded-lg bg-black">
        <canvas ref={ref} className="h-full w-full" aria-hidden />
        {plane !== "sagittal" ? (
          <>
            <span className="absolute left-1.5 top-1 text-xs font-bold text-white/85" aria-hidden>R</span>
            <span className="absolute right-1.5 top-1 text-xs font-bold text-white/85" aria-hidden>L</span>
          </>
        ) : (
          <>
            <span className="absolute left-1.5 top-1 text-xs font-bold text-white/85" aria-hidden>Front</span>
            <span className="absolute right-1.5 top-1 text-xs font-bold text-white/85" aria-hidden>Back</span>
          </>
        )}
        {children}
      </div>
    </div>
  );
}

/** Map a brain point to a percentage position on a slice image (for markers drawn over it). */
export function slicePct(plane: Plane, p: [number, number, number]): { left: number; top: number } {
  const ex = EXTENT[plane];
  const [s, t] = plane === "axial" ? [p[2], p[0]] : plane === "coronal" ? [p[2], p[1]] : [-p[0], p[1]];
  return { left: ((s - ex.s[0]) / (ex.s[1] - ex.s[0])) * 100, top: ((ex.t[1] - t) / (ex.t[1] - ex.t[0])) * 100 };
}
