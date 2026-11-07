import { sampleCurve, type V3 } from "./kit";
import { BLOBS, CEREBELLUM, HEMI, NIGRA, PITUITARY, PONS, REGION, TUBES, regionAt, type RegionId } from "./brain-explorer-data";

/**
 * A scan-like slice through the code-built brain, in the same brain
 * coordinates as the explorer (a = front, y = up, z = out to the left).
 * Each pixel is classed as scalp, skull, fluid, grey matter, white matter or
 * a deep nucleus, and shaded like a T1 MRI (white matter light, grey
 * matter mid grey, fluid dark). Pure functions, no three.js.
 *
 * Image conventions follow radiology: on axial and coronal slices the
 * patient's right is on the viewer's left; axial slices put the front at the
 * top; sagittal slices put the front on the left.
 */

export type Plane = "axial" | "coronal" | "sagittal";
export const PLANE_NAME: Record<Plane, string> = { axial: "Axial (horizontal)", coronal: "Coronal (front to back)", sagittal: "Sagittal (side to side)" };
/** Range of the slice position in brain units, and the words for each end. */
export const RANGE: Record<Plane, { min: number; max: number; lo: string; hi: string }> = {
  axial: { min: -1.35, max: 1.0, lo: "bottom", hi: "top" },
  coronal: { min: -1.45, max: 1.5, lo: "back", hi: "front" },
  sagittal: { min: -1.05, max: 1.05, lo: "right side", hi: "left side" },
};
/** 2D extent of the image (s across, t up) in brain units. */
export const EXTENT: Record<Plane, { s: [number, number]; t: [number, number] }> = {
  axial: { s: [-1.45, 1.45], t: [-1.95, 1.95] },
  coronal: { s: [-1.45, 1.45], t: [-1.55, 1.35] },
  sagittal: { s: [-2.0, 2.0], t: [-1.55, 1.35] },
};

/** A point on the image (s across to the viewer's right, t up) at slice position u, in brain coordinates. */
export function to3D(plane: Plane, u: number, s: number, t: number): V3 {
  if (plane === "axial") return [t, u, s];
  if (plane === "coronal") return [u, t, s];
  return [-s, t, u];
}

export type Tissue = "out" | "scalp" | "skull" | "fluid" | "grey" | "white" | "soft";
export type Hit = { tissue: Tissue; region: RegionId | "ventricle" | null };

const sstep = (e0: number, e1: number, x: number) => {
  const k = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return k * k * (3 - 2 * k);
};

/** Tubes as sampled points with a radius, mirrored where needed. */
type Tube = { pts: V3[]; r: number; id: RegionId | "ventricle"; zScale?: number };
const LAT_VENT: V3[] = [[0.5, 0.25, 0.11], [0.2, 0.38, 0.12], [-0.3, 0.36, 0.14], [-0.6, 0.12, 0.22], [-0.45, -0.18, 0.34]];
export const TUBE_LIST: Tube[] = (() => {
  const out: Tube[] = [];
  (Object.keys(TUBES) as RegionId[]).forEach((id) => {
    TUBES[id]!.forEach((tb) => {
      const ms = tb.mirror ? [1, -1] : [1];
      ms.forEach((m) => out.push({ id, r: tb.r, pts: sampleCurve(tb.pts.map((p) => [p[0], p[1], p[2] * m] as V3), 10), zScale: id === "corpus-callosum" ? 4.5 : 1 }));
    });
  });
  [1, -1].forEach((m) => out.push({ id: "ventricle", r: 0.055, pts: sampleCurve(LAT_VENT.map((p) => [p[0], p[1], p[2] * m] as V3), 10) }));
  return out;
})();
type Blob = { c: V3; r: V3; id: RegionId };
export const BLOB_LIST: Blob[] = (() => {
  const out: Blob[] = [];
  (Object.keys(BLOBS) as RegionId[]).forEach((id) => BLOBS[id]!.forEach((b) => (b.mirror ? [1, -1] : [1]).forEach((m) => out.push({ id, r: b.r, c: [b.c[0], b.c[1], b.c[2] * m] }))));
  out.push({ id: "brainstem", c: PONS, r: [0.2, 0.2, 0.22] });
  out.push({ id: "hypothalamus", c: PITUITARY, r: [0.06, 0.06, 0.06] });
  [1, -1].forEach((m) => out.push({ id: "basal-ganglia", c: [NIGRA[0], NIGRA[1], NIGRA[2] * m], r: [0.07, 0.035, 0.05] }));
  return out;
})();

/** How far inside a hemisphere a point is: under 1 is inside (0 at the core). */
export function hemiDepth(a: number, y: number, z: number) {
  const zz = Math.abs(z);
  if (zz < HEMI.gap) return 9;
  const bottom = a < -0.9 ? 0.62 + 0.38 * sstep(-1.5, -0.9, a) : a > 0.95 ? 0.6 + 0.4 * sstep(1.5, 0.95, a) : 1;
  const narrow = 1 - 0.22 * sstep(0.6, 1.5, a) - 0.12 * sstep(-0.8, -1.5, a);
  const ux = a / HEMI.a;
  const uy = y >= 0 ? y / HEMI.up : y / (HEMI.down * bottom);
  const zh = (0.14 + narrow) * HEMI.z * 0.5;
  const zc = HEMI.gap + zh;
  const uz = (zz - zc) / zh;
  return ux * ux + uy * uy + uz * uz;
}

/** What is at a brain-coordinate point. Only `tubes` and `blobs` near the slice are passed in. */
export function classify(p: V3, tubes: Tube[], blobs: Blob[]): Hit {
  const [a, y, z] = p;
  // head: scalp and skull as shells of one ellipsoid around the brain
  const hx = (a + 0.05) / 1.92, hy = (y - 0.05) / 1.38, hz = z / 1.36;
  const hm = hx * hx + hy * hy + hz * hz;
  const neck = y < -0.75 && Math.abs(z) < 0.42 && a > -0.75 && a < 0.35;
  if (hm > 1 && !neck) return { tissue: "out", region: null };
  if (hm > 0.9 && !neck) return { tissue: hm > 0.955 ? "scalp" : "skull", region: null };
  // fluid spaces first, then nuclei, then the hemispheres
  for (const t of tubes) {
    for (const q of t.pts) {
      const dz = (z - q[2]) / (t.zScale ?? 1);
      const d2 = (a - q[0]) ** 2 + (y - q[1]) ** 2 + dz * dz;
      if (d2 < t.r * t.r) {
        if (t.id === "ventricle") return { tissue: "fluid", region: "ventricle" };
        return { tissue: t.id === "corpus-callosum" ? "white" : t.id === "brainstem" ? "white" : "grey", region: t.id };
      }
    }
  }
  if (Math.abs(z) < 0.022 && a > -0.25 && a < 0.3 && y > -0.2 && y < 0.2) return { tissue: "fluid", region: "ventricle" };
  for (const b of blobs) {
    const m = ((a - b.c[0]) / b.r[0]) ** 2 + ((y - b.c[1]) / b.r[1]) ** 2 + ((z - b.c[2]) / b.r[2]) ** 2;
    if (m < 1) return { tissue: b.id === "brainstem" ? "white" : "grey", region: b.id };
  }
  const cb = ((a - CEREBELLUM.c[0]) / CEREBELLUM.r[0]) ** 2 + ((y - CEREBELLUM.c[1]) / CEREBELLUM.r[1]) ** 2 + ((z - CEREBELLUM.c[2]) / CEREBELLUM.r[2]) ** 2;
  if (cb < 1) {
    const folia = Math.sin(y * 42 + Math.abs(z) * 6) > 0.55 && cb > 0.35;
    return { tissue: cb < 0.3 ? "white" : folia ? "fluid" : "grey", region: "cerebellum" };
  }
  const m = hemiDepth(a, y, z);
  if (m < 1) {
    const fold = Math.sin(a * 14 + y * 9 + Math.abs(z) * 7) * Math.sin(y * 12 - Math.abs(z) * 10 + a * 3);
    const greyEdge = 0.74 + 0.07 * fold;
    const left = z > 0;
    const w = Math.max(0, Math.min(1, (Math.abs(z) - HEMI.gap) / (HEMI.z * 1.1)));
    const region = regionAt(a, y, w, left);
    if (m > 0.9 && fold > 0.62) return { tissue: "fluid", region: null }; // a sulcus
    return { tissue: m > greyEdge ? "grey" : "white", region };
  }
  if (neck) return { tissue: "soft", region: null };
  return { tissue: "fluid", region: null }; // fluid between brain and skull
}

const GREY: Record<Tissue, number> = { out: 8, scalp: 215, skull: 28, fluid: 40, grey: 128, white: 205, soft: 95 };

export type Slice = { w: number; h: number; px: Uint8ClampedArray<ArrayBuffer>; counts: Map<string, number> };

const TISSUES: Tissue[] = ["out", "scalp", "skull", "fluid", "grey", "white", "soft"];
const TI = Object.fromEntries(TISSUES.map((t, k) => [t, k])) as Record<Tissue, number>;

/**
 * Render one slice into RGBA pixels. The head, hemispheres and cerebellum
 * are tested pixel by pixel; nuclei, tracts and ventricles are then stamped
 * on as their exact cross-sections (ellipses and circles), which keeps a
 * slice to a few tens of milliseconds. `tint` colours the named parts.
 */
export function renderSlice(plane: Plane, u: number, w: number, tint: boolean, colorOf?: (id: RegionId) => [number, number, number]): Slice {
  const ex = EXTENT[plane];
  const h = Math.round((w * (ex.t[1] - ex.t[0])) / (ex.s[1] - ex.s[0]));
  const tissue = new Uint8Array(w * h);
  const region: (string | null)[] = new Array(w * h).fill(null);
  const sx = (ex.s[1] - ex.s[0]) / w, ty = (ex.t[1] - ex.t[0]) / h;
  for (let j = 0; j < h; j++) {
    const t = ex.t[1] - (j + 0.5) * ty;
    for (let i = 0; i < w; i++) {
      const hit = classify(to3D(plane, u, ex.s[0] + (i + 0.5) * sx, t), [], []);
      tissue[j * w + i] = TI[hit.tissue];
      region[j * w + i] = hit.region;
    }
  }
  // 2D position of a brain point on this image, and which brain axis is the slice axis
  const axis = plane === "axial" ? 1 : plane === "coronal" ? 0 : 2;
  const st = (p: V3): [number, number] => (plane === "axial" ? [p[2], p[0]] : plane === "coronal" ? [p[2], p[1]] : [-p[0], p[1]]);
  const radii = (r: V3): [number, number] => (plane === "axial" ? [r[2], r[0]] : plane === "coronal" ? [r[2], r[1]] : [r[0], r[1]]);
  const stamp = (cs: number, ct: number, rs: number, rt: number, tis: Tissue, id: string) => {
    const i0 = Math.max(0, Math.floor((cs - rs - ex.s[0]) / sx)), i1 = Math.min(w - 1, Math.ceil((cs + rs - ex.s[0]) / sx));
    const j0 = Math.max(0, Math.floor((ex.t[1] - (ct + rt)) / ty)), j1 = Math.min(h - 1, Math.ceil((ex.t[1] - (ct - rt)) / ty));
    for (let j = j0; j <= j1; j++) {
      const t = ex.t[1] - (j + 0.5) * ty;
      for (let i = i0; i <= i1; i++) {
        const s2 = ex.s[0] + (i + 0.5) * sx;
        if (((s2 - cs) / rs) ** 2 + ((t - ct) / rt) ** 2 <= 1) {
          tissue[j * w + i] = TI[tis];
          region[j * w + i] = id;
        }
      }
    }
  };
  for (const b of BLOB_LIST) {
    const k = 1 - ((u - b.c[axis]) / b.r[axis]) ** 2;
    if (k <= 0) continue;
    const [cs, ct] = st(b.c);
    const [rs, rt] = radii(b.r);
    stamp(cs, ct, rs * Math.sqrt(k), rt * Math.sqrt(k), b.id === "brainstem" ? "white" : "grey", b.id);
  }
  const order = [...TUBE_LIST].sort((x, y) => (x.id === "ventricle" ? 1 : 0) - (y.id === "ventricle" ? 1 : 0));
  for (const tb of order) {
    const zs = tb.zScale ?? 1;
    const r3: V3 = [tb.r, tb.r, tb.r * zs];
    for (const q of tb.pts) {
      const k = 1 - ((u - q[axis]) / r3[axis]) ** 2;
      if (k <= 0) continue;
      const [cs, ct] = st(q);
      const [rs, rt] = radii(r3);
      const tis: Tissue = tb.id === "ventricle" ? "fluid" : tb.id === "corpus-callosum" || tb.id === "brainstem" ? "white" : "grey";
      stamp(cs, ct, rs * Math.sqrt(k), rt * Math.sqrt(k), tis, tb.id);
    }
  }
  const px = new Uint8ClampedArray(w * h * 4);
  const counts = new Map<string, number>();
  for (let n = 0; n < w * h; n++) {
    const g = GREY[TISSUES[tissue[n]]];
    let r = g, gg = g, b = g;
    const id = region[n];
    if (id) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
      if (tint && id !== "ventricle" && colorOf) {
        const c = colorOf(id as RegionId);
        r = r * 0.45 + c[0] * 0.55;
        gg = gg * 0.45 + c[1] * 0.55;
        b = b * 0.45 + c[2] * 0.55;
      }
    }
    px[n * 4] = r;
    px[n * 4 + 1] = gg;
    px[n * 4 + 2] = b;
    px[n * 4 + 3] = 255;
  }
  return { w, h, px, counts };
}

/** The parts visible on a slice, in words, biggest first. */
export function partsSeen(sl: Slice): string[] {
  const total = sl.w * sl.h;
  return [...sl.counts.entries()]
    .filter(([, n]) => n / total > 0.0025)
    .sort((x, y) => y[1] - x[1])
    .map(([id]) => (id === "ventricle" ? "ventricles (fluid spaces)" : REGION[id as RegionId].name.replace(/ \(.*\)$/, "")));
}

export function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "");
  return [parseInt(m.slice(0, 2), 16), parseInt(m.slice(2, 4), 16), parseInt(m.slice(4, 6), 16)];
}
