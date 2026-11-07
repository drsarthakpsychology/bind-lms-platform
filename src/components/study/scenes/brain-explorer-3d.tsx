"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { CameraRig, Pulse, Stage, Tube, segs, useLitPaths, useQuality, type Quality } from "./three-kit";
import type { V3 } from "./kit";
import { BLOBS, BPATHS, CEREBELLUM, CORTEX, EAR, EYES, HEMI, NIGRA, PITUITARY, PONS, REGION_COLOR, TUBES, regionAt, to3, type RegionId } from "./brain-explorer-data";
import type { BrainViewProps } from "./brain-explorer";

/**
 * The brain in 3D. Each hemisphere is one folded surface cut into regions,
 * so every lobe is its own tappable mesh. Peeling lifts the left hemisphere
 * away to show the deep structures, which are simple ellipsoids and tubes.
 */
export default function BrainExplorer3D(p: BrainViewProps) {
  const views: { pos: V3; target: V3 }[] = [
    { pos: [0.2, 0.25, 5.0], target: [0, -0.1, 0] },
    { pos: [1.2, 0.7, 4.3], target: [0, -0.15, 0] },
    { pos: [2.4, 1.1, 3.6], target: [0, -0.2, 0] },
  ];
  const guided: Record<Exclude<BrainViewProps["view"], "free">, { pos: V3; target: V3 }> = {
    lateral: { pos: [0.2, 0.25, 5.0], target: [0, -0.1, 0] },
    medial: { pos: [0.1, -0.05, 4.7], target: [0, -0.15, 0] },
    inferior: { pos: [0.25, -4.7, 1.2], target: [0, -0.25, 0] },
    coronal: { pos: [-4.8, 0.45, 0.9], target: [0, -0.1, 0] },
  };
  const v = p.view !== "free" ? guided[p.view] : views[p.layer] ?? views[0];
  return (
    <Stage className="h-full w-full" camera={views[0].pos} inView={p.inView} active={p.journey.moving} wakeKey={`${p.view}-${p.layer}-${p.sel}-${p.damage}-${p.journey.run}`} onReady={p.onReady} minDistance={2.2} maxDistance={8}>
      <CameraRig flyKey={p.view !== "free" ? `view-${p.view}` : `layer-${p.layer}`} pos={v.pos} target={v.target} fitAspect={1.5} />
      <BrainScene {...p} />
    </Stage>
  );
}

const sstep = (e0: number, e1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/** One hemisphere as region meshes. left = the side facing the student (positive z). */
export function buildHemisphere(left: boolean, q: Quality): Map<RegionId, THREE.BufferGeometry> {
  // about 19 000 triangles per side at full quality, 4 000 at low
  const g = new THREE.SphereGeometry(1, segs(120, q), segs(80, q));
  const pos = g.attributes.position as THREE.BufferAttribute;
  const ay: [number, number, number][] = [];
  for (let i = 0; i < pos.count; i++) {
    const ux = pos.getX(i), uy = pos.getY(i), uz = pos.getZ(i);
    // sphere x is the front-back axis (a), z points out to the side
    const a = ux * HEMI.a;
    const bottom = a < -0.9 ? 0.62 + 0.38 * sstep(-1.5, -0.9, a) : a > 0.95 ? 0.6 + 0.4 * sstep(1.5, 0.95, a) : 1;
    let y = uy >= 0 ? uy * HEMI.up : uy * HEMI.down * bottom;
    const narrow = 1 - 0.22 * sstep(0.6, 1.5, a) - 0.12 * sstep(-0.8, -1.5, a);
    let w = uz >= 0 ? uz : uz * 0.14;
    w *= narrow;
    // folds: ridges and grooves, deeper along the side groove and the central groove
    const lat = Math.max(0, uz);
    const syl = y - (-0.05 + (0.55 - a) * 0.286);
    const cen = a - (0.3 - (y - 0.05) * 0.37);
    let dent = 0.032 * Math.sin(a * 9 + y * 13 + 1.3) * Math.sin(y * 11 - a * 5 + uz * 7) + 0.016 * Math.sin(a * 23 - y * 17) * Math.sin(y * 19 + a * 4);
    if (Math.abs(syl) < 0.05 && a < 0.8 && a > -0.7) dent -= 0.06 * lat * (1 - Math.abs(syl) / 0.05);
    if (Math.abs(cen) < 0.035 && y > 0.05) dent -= 0.04 * (1 - Math.abs(cen) / 0.035);
    if (uz < 0) dent *= 0.3;
    const len = Math.hypot(ux, uy, uz) || 1;
    const k = 1 + dent;
    const x3 = -a * k;
    y *= 1 + dent * (Math.abs(uy) / len);
    const z3 = HEMI.gap + (0.14 + w) * HEMI.z * (1 + dent * 0.5);
    pos.setXYZ(i, x3, y, left ? z3 : -z3);
    ay.push([a, uy >= 0 ? uy * HEMI.up : uy * HEMI.down, uz]);
  }
  g.computeVertexNormals();
  const flat = g.toNonIndexed();
  const fp = flat.attributes.position as THREE.BufferAttribute;
  const fn = flat.attributes.normal as THREE.BufferAttribute;
  // map each non-indexed vertex back to its source vertex for the region test
  const index = g.index!;
  const buckets = new Map<RegionId, { p: number[]; n: number[] }>();
  for (let t = 0; t < index.count; t += 3) {
    const ids = [index.getX(t), index.getX(t + 1), index.getX(t + 2)];
    const ca = (ay[ids[0]][0] + ay[ids[1]][0] + ay[ids[2]][0]) / 3;
    const cy = (ay[ids[0]][1] + ay[ids[1]][1] + ay[ids[2]][1]) / 3;
    const cw = (ay[ids[0]][2] + ay[ids[1]][2] + ay[ids[2]][2]) / 3;
    const r = regionAt(ca, cy, cw, left);
    if (!buckets.has(r)) buckets.set(r, { p: [], n: [] });
    const b = buckets.get(r)!;
    // the left side is mirrored once (x = -a), which turns the triangles inside out; the right
    // side is mirrored twice (x and z), which does not. Flip the left back.
    const order = left ? [0, 2, 1] : [0, 1, 2];
    for (const o of order) {
      const vi = t + o;
      b.p.push(fp.getX(vi), fp.getY(vi), fp.getZ(vi));
      const sg = left ? -1 : 1;
      b.n.push(fn.getX(vi) * sg, fn.getY(vi) * sg, fn.getZ(vi) * sg);
    }
  }
  g.dispose();
  flat.dispose();
  const out = new Map<RegionId, THREE.BufferGeometry>();
  buckets.forEach((b, r) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(b.p, 3));
    geo.setAttribute("normal", new THREE.Float32BufferAttribute(b.n, 3));
    geo.computeBoundingSphere();
    out.set(r, geo);
  });
  return out;
}

export function buildCerebellum(q: Quality) {
  const g = new THREE.SphereGeometry(1, segs(48, q), segs(32, q));
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const k = 1 + 0.035 * Math.sin(y * 42) - (Math.abs(z) < 0.08 ? 0.05 : 0);
    pos.setXYZ(i, x * CEREBELLUM.r[0] * k, y * CEREBELLUM.r[1] * k, z * CEREBELLUM.r[2] * k);
  }
  g.computeVertexNormals();
  return g;
}

const pickHandler = (fn: () => void) => (e: ThreeEvent<MouseEvent>) => {
  if (e.delta > 8) return;
  e.stopPropagation();
  fn();
};

/** A region's material: glows when selected, turns grey and flickers red when damaged. */
/** The coronal cut: everything in front of this plane is clipped away. */
const CUT = [new THREE.Plane(new THREE.Vector3(1, 0, 0), 0.05)];

function RegionMat({ id, sel, damage, opacity, cut = false }: { id: RegionId; sel: boolean; damage: boolean; opacity: number; cut?: boolean }) {
  const ref = React.useRef<THREE.MeshStandardMaterial>(null);
  const base = React.useMemo(() => new THREE.Color(REGION_COLOR[id]), [id]);
  const hurt = React.useMemo(() => new THREE.Color("#7d7272"), []);
  const op = React.useRef(opacity);
  const compiled = React.useRef<boolean | null>(null);
  React.useLayoutEffect(() => {
    compiled.current = null; // a new material after the cut changes
  }, [cut]);
  useFrame((s, dt) => {
    const m = ref.current;
    if (!m) return;
    op.current += (opacity - op.current) * Math.min(1, dt * 5);
    m.opacity = op.current;
    // switching transparency needs a shader rebuild (opaque shaders force alpha to 1)
    const tr = op.current < 0.99;
    if (compiled.current !== tr) {
      compiled.current = tr;
      m.transparent = tr;
      m.needsUpdate = true;
    }
    m.depthWrite = op.current > 0.6;
    const t = s.clock.elapsedTime;
    m.color.copy(sel && damage ? hurt : base);
    if (sel) {
      m.emissive.set(damage ? "#c4271b" : "#ffffff");
      m.emissiveIntensity = damage ? 0.35 + 0.25 * Math.sin(t * 9) * Math.sin(t * 3.1) : 0.22 + 0.12 * Math.sin(t * 4);
    } else m.emissiveIntensity = 0;
  });
  return <meshStandardMaterial key={cut ? "cut" : "whole"} ref={ref} color={REGION_COLOR[id]} roughness={0.62} metalness={0} clippingPlanes={cut ? CUT : null} side={cut ? THREE.DoubleSide : THREE.FrontSide} />;
}

function TubeMesh({ pts, r, scale, onClick, children }: { pts: V3[]; r: number; scale?: V3 | number; onClick?: (e: ThreeEvent<MouseEvent>) => void; children: React.ReactNode }) {
  const q = useQuality();
  const geo = React.useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), segs(32, q), r, q ? 10 : 6, false), [pts, r, q]);
  React.useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo} scale={scale ?? 1} onClick={onClick}>
      {children}
    </mesh>
  );
}

const mirrorPts = (pts: V3[], m: number) => pts.map((p) => to3([p[0], p[1], p[2] * m]));
const DEEP_TUBES = (Object.keys(TUBES) as RegionId[]).filter((id) => id !== "brainstem").flatMap((id) => TUBES[id]!.flatMap((tb, k) => [1, ...(tb.mirror ? [-1] : [])].map((m) => ({ key: `${id}-${k}-${m}`, id, pts: mirrorPts(tb.pts, m), r: tb.r }))));
const STEM = TUBES.brainstem!.map((t) => ({ pts: t.pts.map(to3), r: t.r }));

function Ellipsoid({ c, r, children, onClick }: { c: V3; r: V3; children: React.ReactNode; onClick?: (e: ThreeEvent<MouseEvent>) => void }) {
  return (
    <mesh position={c} scale={r} onClick={onClick}>
      <sphereGeometry args={[1, 20, 14]} />
      {children}
    </mesh>
  );
}

function BrainScene({ view, layer, sel, damage, journey, onPick, colors }: BrainViewProps) {
  const cut = view === "coronal";
  const q = useQuality();
  const leftGeo = React.useMemo(() => buildHemisphere(true, q), [q]);
  const rightGeo = React.useMemo(() => buildHemisphere(false, q), [q]);
  const cbGeo = React.useMemo(() => buildCerebellum(q), [q]);
  React.useEffect(() => () => {
    leftGeo.forEach((g) => g.dispose());
    rightGeo.forEach((g) => g.dispose());
    cbGeo.dispose();
  }, [leftGeo, rightGeo, cbGeo]);
  const leftGroup = React.useRef<THREE.Group>(null);
  const deep = React.useRef<THREE.Group>(null);
  const { lit, onProgress } = useLitPaths(journey);
  useFrame((_, dt) => {
    const g = leftGroup.current;
    if (g) {
      // lift the left hemisphere up and off, like opening a lid
      const k = Math.min(1, dt * 4);
      g.position.z += ((layer >= 1 ? 0.55 : 0) - g.position.z) * k;
      g.position.y += ((layer >= 1 ? 1.55 : 0) - g.position.y) * k;
      g.rotation.x += ((layer >= 1 ? -0.5 : 0) - g.rotation.x) * k;
    }
    const dg = deep.current;
    if (dg) {
      const s = dg.scale.x + ((layer >= 1 || cut ? 1 : 0.001) - dg.scale.x) * Math.min(1, dt * 5);
      dg.scale.setScalar(s);
      dg.visible = s > 0.01;
    }
  });
  const pickDeep = (id: RegionId) => pickHandler(() => (layer >= 1 || cut) && onPick(id));
  const leftOp = layer === 0 ? 1 : 0.18;
  const rightOp = layer === 2 ? 0.18 : 1;
  const sense = colors.brand;
  const motor = colors.danger;
  return (
    <group rotation={[0, 0, 0]}>
      {/* hemispheres */}
      <group ref={leftGroup}>
        {[...leftGeo.entries()].map(([id, geo]) => (
          <mesh key={`L-${id}`} geometry={geo} onClick={pickHandler(() => layer === 0 && onPick(id))} renderOrder={layer ? 2 : 0}>
            <RegionMat id={id} sel={sel === id} damage={damage} opacity={leftOp} cut={cut} />
          </mesh>
        ))}
      </group>
      {[...rightGeo.entries()].map(([id, geo]) => (
        <mesh key={`R-${id}`} geometry={geo} onClick={pickHandler(() => layer < 2 && CORTEX.includes(id) && onPick(id))} renderOrder={layer === 2 ? 2 : 0}>
          <RegionMat id={id} sel={sel === id} damage={damage} opacity={rightOp} cut={cut} />
        </mesh>
      ))}

      {/* cerebellum and brainstem are always there */}
      <mesh geometry={cbGeo} position={to3(CEREBELLUM.c)} onClick={pickHandler(() => onPick("cerebellum"))}>
        <RegionMat id="cerebellum" sel={sel === "cerebellum"} damage={damage} opacity={1} />
      </mesh>
      {STEM.map((t, k) => (
        <group key={k} onClick={pickHandler(() => onPick("brainstem"))}>
          <TubeMesh pts={t.pts} r={t.r}><RegionMat id="brainstem" sel={sel === "brainstem"} damage={damage} opacity={1} /></TubeMesh>
          <Ellipsoid c={to3(PONS)} r={[0.2, 0.2, 0.22]}><RegionMat id="brainstem" sel={sel === "brainstem"} damage={damage} opacity={1} /></Ellipsoid>
        </group>
      ))}

      {/* deep structures */}
      <group ref={deep} scale={0.001}>
        {(Object.keys(BLOBS) as RegionId[]).map((id) => BLOBS[id]!.flatMap((b, k) => [1, ...(b.mirror ? [-1] : [])].map((m) => (
          <Ellipsoid key={`${id}-${k}-${m}`} c={to3([b.c[0], b.c[1], b.c[2] * m])} r={b.r} onClick={pickDeep(id)}>
            <RegionMat id={id} sel={sel === id} damage={damage} opacity={1} />
          </Ellipsoid>
        ))))}
        {DEEP_TUBES.map((t) => (
          <TubeMesh key={t.key} pts={t.pts} r={t.r} scale={t.id === "corpus-callosum" ? [1, 0.6, 2.2] : 1} onClick={pickDeep(t.id)}>
            <RegionMat id={t.id} sel={sel === t.id} damage={damage} opacity={1} />
          </TubeMesh>
        ))}
        <Ellipsoid c={to3(PITUITARY)} r={[0.06, 0.06, 0.06]}><meshStandardMaterial color="#f0a35e" /></Ellipsoid>
        {[1, -1].map((m) => <Ellipsoid key={m} c={to3([NIGRA[0], NIGRA[1], NIGRA[2] * m])} r={[0.07, 0.035, 0.05]}><meshStandardMaterial color="#222222" /></Ellipsoid>)}
      </group>

      {/* eyes and an ear for the senses */}
      {cut ? null : EYES.map((e, k) => (
        <group key={k} position={to3(e)}>
          <mesh><sphereGeometry args={[0.13, 18, 14]} /><meshStandardMaterial color="#ffffff" roughness={0.3} /></mesh>
          <mesh position={[-0.12, 0, 0]} rotation={[0, -Math.PI / 2, 0]}><circleGeometry args={[0.055, 18]} /><meshBasicMaterial color="#1d2a44" /></mesh>
        </group>
      ))}
      <mesh position={to3(EAR)} rotation={[0, 0, 0]} visible={!cut}><torusGeometry args={[0.13, 0.04, 8, 20]} /><meshStandardMaterial color="#d8b49a" /></mesh>

      {/* the signal */}
      {Object.entries(lit).map(([k, f]) => (f > 0 && BPATHS[k] ? <Tube key={k} xray pts={BPATHS[k]} radius={0.018} color="#ffffff" opacity={0.01} lit={f} litColor={journey.legs.find((l) => l.path === k)?.tone === "motor" ? motor : sense} /> : null))}
      <Pulse journey={journey} paths={BPATHS} colorOf={(t) => (t === "motor" ? motor : sense)} size={0.06} onProgress={onProgress} xray />
    </group>
  );
}
