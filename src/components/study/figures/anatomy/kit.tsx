import * as React from "react";
import type { FigureUid } from "../types";

/**
 * Shared drawing kit for the anatomy figures: the palette names, soft shading
 * gradients and the base outlines that several figures are drawn on (the
 * brain from the side and from the middle, the head from above, the body).
 * Every outline is hand-built for these figures.
 */
export const C = {
  ink: "var(--f-ink)",
  paper: "var(--f-paper)",
  t1: "var(--f-t1)",
  t2: "var(--f-t2)",
  t3: "var(--f-t3)",
  t4: "var(--f-t4)",
  hi: "var(--f-hi)",
  hiSoft: "var(--f-hi-soft)",
  blue: "var(--f-blue)",
  blueSoft: "var(--f-blue-soft)",
  blueMid: "var(--f-blue-mid)",
  line: "var(--f-line)",
  shade: "var(--f-shade)",
} as const;

const r1 = (v: number) => Math.round(v * 10) / 10;

/**
 * A smooth path through points (Catmull-Rom turned into cubic curves).
 * `closed` joins the last point back to the first. Points are [x, y] pairs.
 */
export function sm(pts: number[][], closed = false, tension = 1): string {
  const n = pts.length;
  const at = (i: number) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension;
    d += ` C${r1(c1x)} ${r1(c1y)} ${r1(c2x)} ${r1(c2y)} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return closed ? d + " Z" : d;
}

/** Points along an ellipse, for building rounded shapes with `sm`. */
export function ell(cx: number, cy: number, rx: number, ry: number, n = 12, rot = 0): number[][] {
  const out: number[][] = [];
  const cr = Math.cos(rot);
  const sr = Math.sin(rot);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const x = Math.cos(a) * rx;
    const y = Math.sin(a) * ry;
    out.push([cx + x * cr - y * sr, cy + x * sr + y * cr]);
  }
  return out;
}

/** Standard soft shading: `round` makes a shape look domed, `drop` darkens towards the bottom. */
export function Shade({ u }: { u: FigureUid }) {
  return (
    <defs>
      <radialGradient id={u("round")} cx="0.38" cy="0.3" r="0.8">
        <stop offset="0" stopColor={C.paper} stopOpacity={0.5} />
        <stop offset="0.55" stopColor={C.paper} stopOpacity={0} />
        <stop offset="1" stopColor={C.shade} stopOpacity={0.22} />
      </radialGradient>
      <linearGradient id={u("drop")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={C.paper} stopOpacity={0.25} />
        <stop offset="1" stopColor={C.shade} stopOpacity={0.18} />
      </linearGradient>
      <linearGradient id={u("side")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={C.shade} stopOpacity={0.16} />
        <stop offset="0.5" stopColor={C.paper} stopOpacity={0.2} />
        <stop offset="1" stopColor={C.shade} stopOpacity={0.16} />
      </linearGradient>
      <marker id={u("arrow")} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill={C.line} />
      </marker>
      <marker id={u("arrowInk")} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill={C.ink} />
      </marker>
    </defs>
  );
}

/** A filled outline with an ink edge and a shading overlay. */
export function Solid({ d, fill = C.t1, u, shade = "round", part, sw = 2, className }: { d: string; fill?: string; u?: FigureUid; shade?: "round" | "drop" | "side" | "none"; part?: string; sw?: number; className?: string }) {
  return (
    <g>
      <path d={d} fill={fill} stroke={C.ink} strokeWidth={sw} strokeLinejoin="round" data-part={part} className={className} />
      {u && shade !== "none" ? <path d={d} fill={`url(#${u(shade)})`} pointerEvents="none" /> : null}
    </g>
  );
}

/** A groove (sulcus) or fine line in the ink colour. */
export function Groove({ d, w = 2, o = 0.85, dash, part }: { d: string; w?: number; o?: number; dash?: string; part?: string }) {
  return <path d={d} fill="none" stroke={C.ink} strokeWidth={w} strokeOpacity={o} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} data-line={part} />;
}

/** A pathway with an arrowhead, drawn in the accent line colour. */
export function Path({ d, u, w = 4, part, ink, dash, o = 1 }: { d: string; u: FigureUid; w?: number; part?: string; ink?: boolean; dash?: string; o?: number }) {
  return <path d={d} fill="none" stroke={ink ? C.ink : C.line} strokeOpacity={o} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} markerEnd={`url(#${u(ink ? "arrowInk" : "arrow")})`} data-line={part} />;
}

/** Small caption text inside a drawing (for orientation words like "Front"). */
export function Note({ x, y, children, anchor = "middle", size = 16, o = 0.75 }: { x: number; y: number; children: React.ReactNode; anchor?: "start" | "middle" | "end"; size?: number; o?: number }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fill={C.ink} fillOpacity={o} fontStyle="italic" pointerEvents="none">
      {children}
    </text>
  );
}

/* ---------------------------------------------------------------------------
   The left hemisphere seen from the side (front of the head on the left).
   viewBox 0 0 600 440.
   ------------------------------------------------------------------------- */
export const LAT = {
  cerebrum:
    "M78 222 C62 168 92 104 162 74 C232 44 352 38 432 66 C500 90 552 148 552 210 C552 246 534 270 500 280 C470 290 440 300 400 312 C350 326 290 334 240 326 C205 320 182 304 176 286 C172 270 180 258 196 252 C170 252 140 254 112 248 C92 244 80 236 78 222 Z",
  cerebellum: "M386 318 C410 300 470 290 512 288 C548 290 562 318 550 342 C534 372 470 382 428 370 C400 362 382 340 386 318 Z",
  pons: sm([[338, 316], [322, 330], [318, 352], [330, 370], [346, 382], [352, 404], [355, 440], [385, 440], [387, 410], [393, 388], [402, 366], [399, 338], [390, 316]], true),
  lateral: "M198 252 C240 246 290 232 340 214 C365 205 385 196 400 180",
  lateralRami: ["M228 246 C226 236 224 228 220 220", "M214 249 C204 246 196 242 188 236"],
  central: "M338 44 C330 70 318 92 316 112 C314 132 300 150 296 168 C292 186 282 200 280 224",
  precentral: "M292 50 C284 76 272 98 270 118 C268 140 254 160 250 178 C246 196 240 212 238 232",
  postcentral: "M384 54 C374 82 364 102 360 124 C356 146 344 164 340 180 C337 192 332 200 328 208",
  sfs: "M270 104 C232 98 190 102 140 116",
  ifs: "M256 166 C220 164 176 170 126 186",
  sts: "M210 280 C260 272 320 258 380 238 C410 228 432 214 446 196",
  its: "M232 310 C290 304 360 292 420 278 C450 270 475 262 492 258",
  ips: "M362 118 C400 120 440 128 474 140 C495 148 510 160 520 176",
  occ: "M514 118 C522 140 528 160 530 182",
  poLine: "M506 92 L470 290",
  tpLine: "M400 180 L488 190",
  /** Lobe regions, to be clipped to the cerebrum. */
  frontal: "M0 0 L340 0 L338 44 C330 70 318 92 316 112 C314 132 300 150 296 168 C292 186 282 200 280 224 L280 236 C250 244 225 249 198 252 L160 256 L0 270 Z",
  parietal: "M338 0 L516 0 L506 92 L488 190 L400 180 C385 196 365 205 340 214 L280 236 L280 224 C282 200 292 186 296 168 C300 150 314 132 316 112 C318 92 330 70 338 44 Z",
  occipital: "M516 0 L600 0 L600 440 L466 440 L470 290 L506 92 Z",
  temporal: "M0 270 L160 256 L198 252 C225 249 250 244 280 236 L340 214 C365 205 385 196 400 180 L488 190 L470 290 L466 440 L0 440 Z",
  /** Gyrus bands (clipped to the cerebrum). */
  precentralGyrus: "M338 0 L338 44 C330 70 318 92 316 112 C314 132 300 150 296 168 C292 186 282 200 280 224 L280 236 L238 248 L238 232 C240 212 246 196 250 178 C254 160 268 140 270 118 C272 98 284 76 292 50 L294 0 Z",
  postcentralGyrus: "M338 0 L338 44 C330 70 318 92 316 112 C314 132 300 150 296 168 C292 186 282 200 280 224 L280 236 L330 216 L328 208 C332 200 337 192 340 180 C344 164 356 146 360 124 C364 102 374 82 384 54 L388 0 Z",
  stg: "M198 252 C240 246 290 232 340 214 C365 205 385 196 400 180 L446 196 C432 214 410 228 380 238 C320 258 260 272 210 280 L180 270 Z",
  ifg: "M256 166 C220 164 176 170 126 186 L100 240 L198 252 L238 248 L238 232 C240 212 246 196 250 178 Z",
  /** Minor grooves that give the surface its folded look. */
  minor: [
    [[104, 140], [120, 134], [136, 140], [152, 132], [170, 136]],
    [[150, 222], [164, 214], [178, 220], [196, 210], [212, 208]],
    [[176, 78], [190, 88], [208, 84], [222, 92], [244, 82], [258, 86]],
    [[100, 198], [114, 206], [124, 200], [138, 210], [150, 214]],
    [[200, 128], [212, 138], [228, 134], [240, 142]],
    [[214, 182], [222, 194], [236, 196], [240, 208]],
    [[150, 96], [166, 104], [172, 96]],
    [[410, 74], [424, 86], [442, 84], [458, 98], [476, 102]],
    [[396, 146], [408, 156], [404, 170], [414, 182]],
    [[444, 158], [458, 166], [462, 180], [474, 186], [470, 202]],
    [[520, 226], [530, 238], [526, 252], [516, 266]],
    [[484, 214], [494, 226], [490, 240], [496, 252]],
    [[262, 300], [290, 292], [318, 294], [350, 284], [384, 280], [404, 270]],
    [[440, 104], [456, 112], [470, 108], [490, 122]],
    [[300, 270], [318, 262], [334, 262]],
    [[360, 300], [378, 306], [398, 300]],
    [[538, 196], [530, 210], [540, 222]],
  ].map((p) => sm(p)),
};

/** The lateral brain, drawn. `lobes` colours the four lobes; `children` draws on top (clipped by nothing). */
export function LateralBrain({ u, lobes = false, gyri = true, fills, children, over }: { u: FigureUid; lobes?: boolean; gyri?: boolean; fills?: Partial<Record<"frontal" | "parietal" | "temporal" | "occipital", string>>; children?: React.ReactNode; over?: React.ReactNode }) {
  const clip = u("lat-clip");
  const lf = { frontal: C.blueSoft, parietal: C.hiSoft, temporal: C.t2, occipital: C.t3, ...fills };
  return (
    <g>
      <Shade u={u} />
      <defs>
        <clipPath id={clip}>
          <path d={LAT.cerebrum} />
        </clipPath>
      </defs>
      <Solid d={LAT.cerebellum} fill={C.t2} u={u} part="cerebellum" />
      {[0, 1, 2, 3, 4].map((i) => (
        <Groove key={i} d={`M${398 + i * 4} ${330 + i * 9} C${440} ${318 + i * 12} ${500} ${312 + i * 12} ${548 - i * 3} ${322 + i * 9}`} w={1.3} o={0.5} />
      ))}
      <Solid d={LAT.pons} fill={C.t3} u={u} shade="side" part="brainstem" />
      <Groove d="M334 372 C350 366 376 366 396 368" w={1.4} o={0.6} />
      <Solid d={LAT.cerebrum} fill={C.t1} part="cerebrum" />
      <g clipPath={`url(#${clip})`}>
        {lobes ? (
          <>
            <path d={LAT.frontal} fill={lf.frontal} data-part="frontal" />
            <path d={LAT.parietal} fill={lf.parietal} data-part="parietal" />
            <path d={LAT.temporal} fill={lf.temporal} data-part="temporal" />
            <path d={LAT.occipital} fill={lf.occipital} data-part="occipital" />
          </>
        ) : null}
        {children}
        <path d={LAT.cerebrum} fill={`url(#${u("round")})`} pointerEvents="none" />
      </g>
      <path d={LAT.cerebrum} fill="none" stroke={C.ink} strokeWidth={2.4} />
      {gyri ? (
        <g pointerEvents="none">
          {LAT.minor.map((d) => (
            <Groove key={d} d={d} w={1.4} o={0.4} />
          ))}
          <Groove d={LAT.sfs} w={2} o={0.7} />
          <Groove d={LAT.ifs} w={2} o={0.7} />
          <Groove d={LAT.precentral} w={2} o={0.75} />
          <Groove d={LAT.postcentral} w={2} o={0.75} />
          <Groove d={LAT.sts} w={2} o={0.7} />
          <Groove d={LAT.its} w={1.8} o={0.6} />
          <Groove d={LAT.ips} w={2} o={0.7} />
          <Groove d={LAT.occ} w={1.6} o={0.55} />
          {LAT.lateralRami.map((d) => (
            <Groove key={d} d={d} w={2} o={0.8} />
          ))}
        </g>
      ) : null}
      <g pointerEvents="visibleStroke">
        <Groove d={LAT.central} w={3.2} o={0.95} part="central" />
        <Groove d={LAT.lateral} w={3.6} o={0.95} part="lateral" />
      </g>
      {over}
    </g>
  );
}

/* ---------------------------------------------------------------------------
   The right hemisphere cut down the middle, seen from the inside (front on the
   left). viewBox 0 0 600 440.
   ------------------------------------------------------------------------- */
export const MED = {
  outer: sm([[80, 232], [76, 184], [96, 132], [140, 90], [204, 60], [280, 45], [360, 45], [432, 62], [492, 98], [532, 148], [548, 200], [542, 246], [522, 276], [480, 288], [430, 294], [398, 292], [370, 262], [330, 250], [290, 250], [250, 252], [212, 250], [160, 254], [116, 250]], true),
  temporal: sm([[226, 272], [244, 262], [270, 268], [290, 286], [292, 310], [276, 318], [258, 304], [238, 296]], true),
  cc: sm([[214, 198], [196, 184], [188, 160], [204, 138], [240, 122], [300, 114], [360, 116], [404, 130], [428, 154], [428, 178], [410, 190], [396, 180], [398, 164], [380, 148], [340, 138], [290, 138], [244, 146], [216, 162], [212, 180], [224, 196], [240, 204]], true),
  septum: sm([[216, 164], [244, 148], [290, 140], [330, 142], [318, 162], [282, 168], [256, 182], [246, 200], [226, 196], [214, 180]], true),
  fornix: sm([[404, 182], [380, 166], [340, 162], [300, 168], [270, 180], [254, 200], [254, 228], [262, 256]]),
  thalamus: sm(ell(326, 206, 52, 30, 14)),
  adhesion: sm(ell(322, 208, 10, 7, 8)),
  hypothalamus: sm([[252, 214], [276, 222], [300, 236], [298, 252], [282, 262], [256, 262], [244, 248], [244, 228]], true),
  ac: sm(ell(248, 210, 6, 6, 8)),
  chiasm: sm(ell(240, 258, 11, 6, 8)),
  stalk: "M258 262 C258 272 256 280 254 288",
  pitAnt: sm([[238, 288], [252, 284], [258, 292], [254, 304], [240, 304], [234, 296]], true),
  pitPost: sm([[256, 286], [266, 288], [270, 296], [264, 304], [255, 303], [258, 293]], true),
  mammillary: sm(ell(278, 266, 7, 6, 8)),
  pineal: sm([[388, 206], [400, 200], [414, 204], [404, 212]], true),
  brainstem: sm([[302, 248], [296, 268], [286, 290], [282, 318], [292, 340], [314, 352], [322, 380], [326, 440], [354, 440], [354, 400], [358, 372], [366, 352], [374, 332], [374, 304], [386, 284], [398, 266], [400, 244], [386, 234], [356, 236], [330, 240]], true),
  pons: sm([[296, 268], [286, 290], [282, 318], [292, 340], [314, 352], [334, 346], [340, 320], [336, 290], [322, 270]], true),
  colliculi: ["M384 236 C394 238 400 244 400 252", "M398 254 C404 260 402 268 396 272"],
  aqueduct: "M352 236 C366 252 374 268 378 290",
  v4: sm([[374, 296], [404, 318], [372, 344]], true),
  cerebellum: sm([[392, 298], [420, 284], [470, 278], [520, 292], [550, 322], [542, 356], [500, 378], [440, 380], [404, 362], [386, 336], [382, 316]], true),
  arbor: [
    "M404 320 C430 318 450 320 470 316",
    "M430 319 C440 306 456 300 470 296",
    "M450 318 C466 312 486 312 500 304",
    "M470 316 C490 322 510 326 526 322",
    "M440 320 C454 334 470 342 486 350",
    "M460 330 C474 344 490 356 504 362",
    "M430 322 C436 340 446 352 456 364",
  ],
  cingulateSulcus: sm([[214, 214], [176, 186], [176, 140], [210, 108], [270, 92], [340, 90], [396, 98], [418, 90], [424, 62], [428, 50]]),
  paracentral: "M300 46 C300 60 302 74 300 90",
  centralNotch: "M352 45 C352 56 356 62 360 68",
  po: sm([[472, 76], [460, 112], [440, 148], [420, 186], [414, 196]]),
  calcarine: sm([[414, 196], [446, 206], [480, 214], [512, 222], [540, 226]]),
  sfMinor: [sm([[110, 150], [130, 140], [150, 146], [168, 132]]), sm([[140, 230], [160, 220], [182, 226], [200, 216]]), sm([[456, 96], [470, 110], [484, 112]]), sm([[480, 250], [500, 258], [516, 254]]), sm([[456, 164], [472, 176], [494, 180]])],
};

/** The midline brain, drawn. `children` go on top of the cortex and below the deep parts; `over` goes on top of everything. */
export function MedialBrain({ u, children, over, deep = true, tones }: { u: FigureUid; children?: React.ReactNode; over?: React.ReactNode; deep?: boolean; tones?: Partial<Record<"cortex" | "cut" | "cc", string>> }) {
  const t = { cortex: C.t1, cut: C.t2, cc: C.paper, ...tones };
  return (
    <g>
      <Shade u={u} />
      <Solid d={MED.temporal} fill={C.t2} u={u} part="temporal-medial" />
      <Solid d={MED.cerebellum} fill={C.t2} u={u} part="cerebellum" />
      <g pointerEvents="none">
        {MED.arbor.map((d) => (
          <path key={d} d={d} fill="none" stroke={C.paper} strokeWidth={4} strokeLinecap="round" />
        ))}
      </g>
      <Solid d={MED.outer} fill={t.cortex} u={u} part="cortex" />
      <g pointerEvents="none">
        {MED.sfMinor.map((d) => (
          <Groove key={d} d={d} w={1.4} o={0.4} />
        ))}
        <Groove d={MED.cingulateSulcus} w={2.2} o={0.8} />
        <Groove d={MED.paracentral} w={1.8} o={0.6} />
        <Groove d={MED.centralNotch} w={2.4} o={0.8} />
      </g>
      <Groove d={MED.po} w={2.6} o={0.9} part="po" />
      <Groove d={MED.calcarine} w={2.6} o={0.9} part="calcarine" />
      {children}
      {deep ? (
        <g>
          <Solid d={MED.brainstem} fill={t.cut} u={u} shade="side" part="midbrain" />
          <path d={MED.pons} fill={C.t3} stroke={C.ink} strokeWidth={1.4} data-part="pons" />
          <path d={MED.v4} fill={C.paper} stroke={C.ink} strokeWidth={1.4} data-part="v4" />
          <path d={MED.aqueduct} fill="none" stroke={C.ink} strokeWidth={2} data-line="aqueduct" />
          {MED.colliculi.map((d) => (
            <Groove key={d} d={d} w={1.6} o={0.7} />
          ))}
          <Solid d={MED.septum} fill={C.t2} shade="none" part="septum" sw={1.2} />
          <Solid d={MED.thalamus} fill={C.t3} u={u} part="thalamus" />
          <path d={MED.adhesion} fill={C.t4} stroke={C.ink} strokeWidth={1} pointerEvents="none" />
          <Solid d={MED.hypothalamus} fill={C.t2} part="hypothalamus" sw={1.4} />
          <path d={MED.fornix} fill="none" stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
          <path d={MED.fornix} fill="none" stroke={C.t2} strokeWidth={6} strokeLinecap="round" data-line="fornix" />
          <Solid d={MED.cc} fill={t.cc} u={u} shade="drop" part="cc" sw={2.4} />
          <path d={MED.ac} fill={C.paper} stroke={C.ink} strokeWidth={1.4} data-part="ac" />
          <path d={MED.chiasm} fill={C.paper} stroke={C.ink} strokeWidth={1.4} data-part="chiasm" />
          <path d={MED.stalk} fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
          <path d={MED.pitAnt} fill={C.t3} stroke={C.ink} strokeWidth={1.4} data-part="pituitary" />
          <path d={MED.pitPost} fill={C.t1} stroke={C.ink} strokeWidth={1.4} data-part="pituitary" />
          <path d={MED.mammillary} fill={C.t3} stroke={C.ink} strokeWidth={1.4} data-part="mammillary" />
          <path d={MED.pineal} fill={C.t3} stroke={C.ink} strokeWidth={1.4} data-part="pineal" />
        </g>
      ) : null}
      {over}
    </g>
  );
}

/** Draws its children, and a mirror copy reflected about the vertical line x = cx. */
export function Mirror({ cx, children }: { cx: number; children: React.ReactNode }) {
  return (
    <g>
      {children}
      <g transform={`translate(${cx * 2} 0) scale(-1 1)`}>{children}</g>
    </g>
  );
}

/**
 * A branching tree of tapering lines (dendrites, astrocyte processes, axon
 * terminals). Deterministic: the same inputs always draw the same tree.
 */
export function tree(x: number, y: number, angle: number, len: number, depth: number, width: number, spread = 0.55, seed = 1): { d: string; w: number }[] {
  const out: { d: string; w: number }[] = [];
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const grow = (x0: number, y0: number, a: number, l: number, dpt: number, w: number) => {
    const bend = (rnd() - 0.5) * 0.5;
    const x1 = x0 + Math.cos(a) * l;
    const y1 = y0 + Math.sin(a) * l;
    const mx = x0 + Math.cos(a + bend) * l * 0.55;
    const my = y0 + Math.sin(a + bend) * l * 0.55;
    out.push({ d: `M${r1(x0)} ${r1(y0)} Q${r1(mx)} ${r1(my)} ${r1(x1)} ${r1(y1)}`, w });
    if (dpt <= 0) return;
    const k = 0.62 + rnd() * 0.18;
    grow(x1, y1, a - spread * (0.7 + rnd() * 0.6), l * k, dpt - 1, w * 0.62);
    grow(x1, y1, a + spread * (0.7 + rnd() * 0.6), l * k, dpt - 1, w * 0.62);
  };
  grow(x, y, angle, len, depth, width);
  return out;
}

/** Draws a `tree` with an ink outline and a tissue core. */
export function Branches({ t, fill = C.t2, part }: { t: { d: string; w: number }[]; fill?: string; part?: string }) {
  return (
    <g strokeLinecap="round" fill="none">
      {t.map((b, i) => (
        <path key={`o${i}`} d={b.d} stroke={C.ink} strokeWidth={b.w + 2.4} />
      ))}
      {t.map((b, i) => (
        <path key={`i${i}`} d={b.d} stroke={fill} strokeWidth={b.w} data-line={part} />
      ))}
    </g>
  );
}

/** Unit normal at each point of a polyline (left-hand side in screen coordinates). */
function normals(pts: number[][]): number[][] {
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const L = Math.hypot(dx, dy) || 1;
    return [dy / L, -dx / L];
  });
}

/**
 * A smooth tube around a centre line, for curved structures with thickness
 * (the caudate, the hippocampus, the fornix, a ventricle). `w` is the full
 * width at each point, or one width for all.
 */
export function tube(pts: number[][], w: number | number[]): string {
  const ns = normals(pts);
  const wid = (i: number) => (Array.isArray(w) ? w[i] : w) / 2;
  const left = pts.map((p, i) => [p[0] + ns[i][0] * wid(i), p[1] + ns[i][1] * wid(i)]);
  const right = pts.map((p, i) => [p[0] - ns[i][0] * wid(i), p[1] - ns[i][1] * wid(i)]).reverse();
  return sm([...left, ...right], true, 0.9);
}

/** Points every `step` units along a polyline. */
export function resample(pts: number[][], step: number): number[][] {
  const out: number[][] = [pts[0]];
  let carry = 0;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const L = Math.hypot(bx - ax, by - ay);
    let t = step - carry;
    while (t <= L) {
      out.push([ax + ((bx - ax) * t) / L, ay + ((by - ay) * t) / L]);
      t += step;
    }
    carry = L - (t - step);
  }
  const last = pts[pts.length - 1];
  if (Math.hypot(out[out.length - 1][0] - last[0], out[out.length - 1][1] - last[1]) > step * 0.3) out.push(last);
  return out;
}

/**
 * A folded cortical surface along a polyline: rounded gyri with narrow, deep
 * sulci between them. Returns the outer (pial) line and the inner grey-white
 * boundary as point lists. `side` is 1 when the tissue lies on the left of the
 * travel direction, -1 when it lies on the right. `every` is the gyrus width.
 */
export function folded(pts: number[][], { every = 30, depth = 18, thick = 11, side = 1, phase = 0.5 }: { every?: number; depth?: number; thick?: number; side?: number; phase?: number } = {}) {
  const res = resample(pts, 3);
  const ns = normals(res).map(([x, y]) => [x * side, y * side]);
  const outer: number[][] = [];
  const inner: number[][] = [];
  res.forEach((p, i) => {
    const s = i * 3 + phase * every;
    const m = ((s % every) + every) % every;
    const dist = Math.min(m, every - m);
    // Fade the folds out at both ends so separate stretches join smoothly.
    const edge = Math.min(1, i / 4, (res.length - 1 - i) / 4);
    const crown = 0.18 * depth * (1 - Math.sin((Math.PI * m) / every));
    const o = (depth * Math.exp(-((dist / 4.5) ** 2)) + crown) * edge;
    const t = thick + (depth * Math.exp(-((dist / (4.5 + thick * 0.95)) ** 2)) + crown) * edge;
    const [nx, ny] = ns[i];
    outer.push([p[0] + nx * o, p[1] + ny * o]);
    inner.push([p[0] + nx * t, p[1] + ny * t]);
  });
  return { outer, inner };
}

/** A straight-segment path through dense points (for `folded` outlines). */
export function poly(pts: number[][], closed = false): string {
  return pts.map((p, i) => `${i ? "L" : "M"}${r1(p[0])} ${r1(p[1])}`).join(" ") + (closed ? " Z" : "");
}
