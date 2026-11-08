"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import type { V3 } from "./kit";

/**
 * Cheap effects for the 3D scenes, loaded only with them:
 * - glow: one small radial texture, drawn as additive sprites and points
 *   (a soft bloom without a post-processing pass);
 * - particle flows along a path (signals, transmitter, current);
 * - tap ripples where the student touches the model;
 * - an outline (a slightly fattened back-face copy) for the selected part;
 * - a gentle idle sway that stops for good when the student touches.
 * Each one asks for frames only while it moves.
 */

/* ------------------------------------------------------------------ glow */

let glowTex: THREE.Texture | null = null;
let ringTex: THREE.Texture | null = null;

/** A soft white dot, made once on a 64 px canvas. */
export function glowTexture() {
  if (glowTex) return glowTex;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, "rgba(255,255,255,1)");
  r.addColorStop(0.25, "rgba(255,255,255,0.65)");
  r.addColorStop(0.6, "rgba(255,255,255,0.14)");
  r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 64, 64);
  glowTex = new THREE.CanvasTexture(c);
  glowTex.colorSpace = THREE.SRGBColorSpace;
  return glowTex;
}

/** A soft ring, for ripples. */
function ringTexture() {
  if (ringTex) return ringTex;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(32, 32, 14, 32, 32, 31);
  r.addColorStop(0, "rgba(255,255,255,0)");
  r.addColorStop(0.55, "rgba(255,255,255,0.9)");
  r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 64, 64);
  ringTex = new THREE.CanvasTexture(c);
  return ringTex;
}

/** An additive glow sprite: brighter where glows overlap, like light. */
export function Glow({ position = [0, 0, 0], color, size = 0.5, opacity = 0.85, xray = false, visible = true, ref }: { position?: V3; color: string; size?: number; opacity?: number; xray?: boolean; visible?: boolean; ref?: React.Ref<THREE.Sprite> }) {
  const map = React.useMemo(() => glowTexture(), []);
  return (
    <sprite ref={ref} position={position} scale={[size, size, 1]} visible={visible} renderOrder={xray ? 12 : 2}>
      <spriteMaterial map={map} color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={!xray} toneMapped={false} />
    </sprite>
  );
}

/* --------------------------------------------------------- particle flow */

const tmp = new THREE.Vector3();

/**
 * Particles streaming along a path, brightest mid-way and fading at both
 * ends. Draws (and asks for frames) only while `active`.
 */
export function ParticleFlow({ pts, color, count = 24, size = 0.09, speed = 0.4, spread = 0.03, active = true, xray = false, forMs = 0, runKey = "" }: { pts: V3[]; color: string; count?: number; size?: number; speed?: number; spread?: number; active?: boolean; xray?: boolean; /** run only this long after `runKey` changes (0: while active) */ forMs?: number; runKey?: string }) {
  const curve = React.useMemo(() => new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)), false, "centripetal"), [pts]);
  const geo = React.useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    return g;
  }, [count]);
  React.useEffect(() => () => geo.dispose(), [geo]);
  const base = React.useMemo(() => new THREE.Color(color), [color]);
  const map = React.useMemo(() => glowTexture(), []);
  const invalidate = useThree((s) => s.invalidate);
  const t0 = React.useRef(-1);
  const run = React.useRef({ key: "\u0000", at: 0 });
  const pts3 = React.useRef<THREE.Points>(null);
  useFrame(() => {
    const ms = performance.now();
    if (run.current.key !== runKey) run.current = { key: runKey, at: ms };
    const on = active && (!forMs || ms - run.current.at < forMs);
    if (pts3.current) pts3.current.visible = on;
    if (!on) {
      t0.current = -1;
      return;
    }
    const now = ms / 1000;
    if (t0.current < 0) t0.current = now;
    const t = now - t0.current;
    const pos = geo.getAttribute("position") as THREE.BufferAttribute;
    const col = geo.getAttribute("color") as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const seed = Math.sin(i * 12.9898) * 43758.5453;
      const j = seed - Math.floor(seed);
      const u = (i / count + j * 0.07 + t * speed * (0.8 + j * 0.4)) % 1;
      curve.getPointAt(u, tmp);
      const w = Math.sin(t * 3 + i);
      pos.setXYZ(i, tmp.x + w * spread, tmp.y + Math.cos(t * 2.3 + i * 1.7) * spread, tmp.z + Math.sin(t * 2.1 + i * 0.7) * spread);
      const f = Math.sin(Math.PI * u);
      col.setXYZ(i, base.r * f, base.g * f, base.b * f);
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
    invalidate();
  });
  return (
    <points ref={pts3} geometry={geo} visible={false} frustumCulled={false} renderOrder={xray ? 12 : 2}>
      <pointsMaterial map={map} size={size} sizeAttenuation vertexColors transparent depthWrite={false} depthTest={!xray} blending={THREE.AdditiveBlending} toneMapped={false} />
    </points>
  );
}

/* ---------------------------------------------------------------- ripples */

type Ripple = { p: THREE.Vector3; t0: number; color: string };
const RippleCtx = React.createContext<(p: THREE.Vector3, color?: string) => void>(() => {});
/** Call with a world point to send a ripple out from it (for taps handled in a scene). */
export const useRipple = () => React.useContext(RippleCtx);

/**
 * Tap feedback: a ring that spreads and fades from where the model was
 * touched. A press that turns into a drag (to rotate) makes no ripple.
 * Transparent shells hit by the ray (the glass body, the head) do count:
 * the ripple shows where the finger landed.
 */
export function TapRipples({ color, children }: { color: string; children: React.ReactNode }) {
  const [list, setList] = React.useState<Ripple[]>([]);
  const gl = useThree((s) => s.gl);
  const get = useThree((s) => s.get);
  const add = React.useCallback((p: THREE.Vector3, c?: string) => setList((l) => [...l.slice(-3), { p: p.clone(), t0: performance.now(), color: c ?? color }]), [color]);
  React.useEffect(() => {
    // plain DOM listeners and one raycast per tap: nothing is tested while the student drags
    const el = gl.domElement;
    let down: { x: number; y: number; t: number } | null = null;
    const ray = new THREE.Raycaster();
    const onDown = (e: PointerEvent) => {
      down = { x: e.clientX, y: e.clientY, t: performance.now() };
    };
    const onUp = (e: PointerEvent) => {
      const d = down;
      down = null;
      if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) >= 8 || performance.now() - d.t > 500) return;
      const r = el.getBoundingClientRect();
      const st = get();
      ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), st.camera);
      const hit = ray.intersectObjects(st.scene.children, true).find((h) => (h.object as THREE.Mesh).isMesh && h.object.visible && !(h.object.userData as { noTap?: boolean }).noTap);
      if (hit) add(hit.point);
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
    };
  }, [gl, get, add]);
  return (
    <RippleCtx.Provider value={add}>
      {children}
      {list.map((r) => (
        <RippleRing key={r.t0} r={r} onDone={() => setList((l) => l.filter((x) => x !== r))} />
      ))}
    </RippleCtx.Provider>
  );
}

function RippleRing({ r, onDone }: { r: Ripple; onDone: () => void }) {
  const sp = React.useRef<THREE.Sprite>(null);
  const halo = React.useRef<THREE.Sprite>(null);
  const map = React.useMemo(() => ringTexture(), []);
  const glow = React.useMemo(() => glowTexture(), []);
  const invalidate = useThree((s) => s.invalidate);
  const ended = React.useRef(false);
  useFrame(() => {
    const k = (performance.now() - r.t0) / 650;
    if (k >= 1) {
      if (!ended.current) {
        ended.current = true;
        onDone();
      }
      return;
    }
    const e = 1 - Math.pow(1 - k, 3);
    if (sp.current) {
      sp.current.scale.setScalar(0.1 + e * 0.75);
      (sp.current.material as THREE.SpriteMaterial).opacity = 0.9 * (1 - k);
    }
    if (halo.current) {
      halo.current.scale.setScalar(0.35 * (1 - k * 0.5));
      (halo.current.material as THREE.SpriteMaterial).opacity = 0.8 * (1 - k);
    }
    invalidate();
  });
  return (
    <group position={r.p}>
      <sprite ref={sp} renderOrder={20}>
        <spriteMaterial map={map} color={r.color} transparent depthTest={false} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <sprite ref={halo} renderOrder={20}>
        <spriteMaterial map={glow} color={r.color} transparent depthTest={false} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
    </group>
  );
}

/* ---------------------------------------------------------------- outline */

/** A highlight outline: the same shape pushed out along its normals, drawn from the inside, so only a rim shows. */
export function Outline({ geometry, color, width = 0.025, position, scale, pulse = true }: { geometry: THREE.BufferGeometry; color: string; width?: number; position?: V3; scale?: number | V3; pulse?: boolean }) {
  const fat = React.useMemo(() => {
    const g = geometry.clone();
    if (!g.getAttribute("normal")) g.computeVertexNormals();
    const pos = g.getAttribute("position") as THREE.BufferAttribute;
    const nor = g.getAttribute("normal") as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) pos.setXYZ(i, pos.getX(i) + nor.getX(i) * width, pos.getY(i) + nor.getY(i) * width, pos.getZ(i) + nor.getZ(i) * width);
    pos.needsUpdate = true;
    return g;
  }, [geometry, width]);
  React.useEffect(() => () => fat.dispose(), [fat]);
  const mat = React.useRef<THREE.MeshBasicMaterial>(null);
  const invalidate = useThree((s) => s.invalidate);
  const t0 = React.useRef(-1);
  useFrame(() => {
    if (!pulse || !mat.current) return;
    if (t0.current < 0) t0.current = performance.now();
    const k = (performance.now() - t0.current) / 1000;
    // a short, bright pulse when it appears, then a steady rim
    if (k < 1.2) {
      mat.current.opacity = 0.55 + 0.45 * Math.abs(Math.sin(k * Math.PI * 2.5)) * (1 - k / 1.2);
      invalidate();
    } else mat.current.opacity = 0.75;
  });
  return (
    <mesh geometry={fat} position={position} scale={scale} renderOrder={3}>
      <meshBasicMaterial ref={mat} color={color} side={THREE.BackSide} transparent opacity={0.9} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

/* ------------------------------------------------------------- idle sway */

/**
 * Ambient motion while nobody is touching: the model turns gently to and
 * fro. It runs for at most `maxMs` after the scene comes into view and stops
 * for good the moment the student touches the model or changes anything
 * (`stopKey`), easing back to the start.
 */
export function IdleSway({ on, stopKey, amount = 0.16, maxMs = 14000, phase = 0, children }: { on: boolean; stopKey: string; amount?: number; maxMs?: number; phase?: number; children: React.ReactNode }) {
  const g = React.useRef<THREE.Group>(null);
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  const st = React.useRef({ t0: -1, stopped: false, stopAt: 0, key: stopKey });
  React.useEffect(() => {
    const stop = () => {
      if (!st.current.stopped) st.current = { ...st.current, stopped: true, stopAt: performance.now() };
    };
    gl.domElement.addEventListener("pointerdown", stop);
    gl.domElement.addEventListener("wheel", stop, { passive: true });
    return () => {
      gl.domElement.removeEventListener("pointerdown", stop);
      gl.domElement.removeEventListener("wheel", stop);
    };
  }, [gl]);
  useFrame(() => {
    const s = st.current;
    const grp = g.current;
    if (!grp) return;
    const now = performance.now();
    if (s.key !== stopKey && !s.stopped) st.current = { ...s, stopped: true, stopAt: now, key: stopKey };
    if (!on) return;
    if (s.t0 < 0) s.t0 = now;
    const k = now - s.t0;
    if (!s.stopped && k > maxMs) st.current = { ...s, stopped: true, stopAt: now };
    if (!st.current.stopped) {
      grp.rotation.y = amount * Math.sin(k / 2600 + phase) * Math.min(1, k / 1500);
      invalidate();
    } else if (Math.abs(grp.rotation.y) > 0.0005) {
      grp.rotation.y *= 0.86; // ease back so turning starts from the usual view
      invalidate();
    } else grp.rotation.y = 0;
  });
  return <group ref={g}>{children}</group>;
}
