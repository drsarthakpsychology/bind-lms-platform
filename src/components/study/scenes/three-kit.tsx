"use client";

import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { along, type Journey, type Leg, type ThemeColors, type V3 } from "./kit";

/**
 * Shared 3D pieces, loaded only with the 3D views: the stage (camera, light,
 * touch controls, adaptive quality), a camera that flies to a target, nerve
 * tubes that light up as a signal passes, and the travelling pulse. Low poly,
 * pixel ratio capped at 2; the render loop runs only while something moves
 * and stops when the scene is off screen.
 */

type OrbitLike = { target: THREE.Vector3; update: () => void; enabled: boolean };

/* ---------------------------------------------------------------- quality */

/** 2 full, 1 medium (lower pixel ratio, fewer segments), 0 low. Only ever steps down. */
export type Quality = 0 | 1 | 2;
const QualityCtx = React.createContext<Quality>(2);
export const useQuality = () => React.useContext(QualityCtx);
/** Scale a segment count for the current quality. */
export const segs = (n: number, q: Quality, min = 6) => Math.max(min, Math.round(n * [0.45, 0.7, 1][q]));
const DPR: Record<Quality, number> = { 2: 2, 1: 1.5, 0: 1 };

/** Start lower on devices that report little memory or few cores. */
function startQuality(): Quality {
  if (typeof navigator === "undefined") return 2;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency;
  if ((mem && mem <= 2) || (cores && cores <= 2)) return 0;
  if ((mem && mem <= 4) || (cores && cores <= 4)) return 1;
  return 2;
}

/**
 * Watches how fast frames are drawn whenever they are drawn back to back
 * (an animation, or the student turning the model). Two seconds of that
 * under 40 frames a second drop the quality one step: first the pixel
 * ratio, then the geometry detail. The first two seconds of drawing at each
 * level are skipped, because shaders compile then.
 */
function Governor({ level, onDrop }: { level: Quality; onDrop: () => void }) {
  const acc = React.useRef({ warm: 0, time: 0, n: 0, bad: 0 });
  useFrame((_, dt) => {
    const a = acc.current;
    if (level === 0 || dt > 0.25) return; // a gap: frames were not back to back
    if (a.warm < 2) {
      a.warm += dt;
      return;
    }
    a.time += dt;
    a.n++;
    if (a.time >= 1) {
      const fps = a.n / a.time;
      a.bad = fps < 40 ? a.bad + 1 : 0;
      a.time = 0;
      a.n = 0;
      if (a.bad >= 2) {
        acc.current = { warm: 0, time: 0, n: 0, bad: 0 };
        onDrop();
      }
    }
  });
  return null;
}

/** In on-demand mode, keeps drawing for a moment after something changes (fades, camera flights). */
function Waker({ wakeKey, ms = 1600 }: { wakeKey: string; ms?: number }) {
  const invalidate = useThree((st) => st.invalidate);
  const until = React.useRef(0);
  React.useEffect(() => {
    until.current = performance.now() + ms;
    invalidate();
  }, [wakeKey, ms, invalidate]);
  useFrame(() => {
    if (performance.now() < until.current) invalidate();
  });
  return null;
}

/**
 * The 3D stage. Draws every frame only while `active` (something is moving)
 * and on screen; otherwise it draws on demand (touch, or a change of
 * `wakeKey`), and not at all when off screen. Pixel ratio is capped at 2,
 * antialiasing is skipped on dense screens, and quality steps down by itself
 * when frames drop.
 */
export function Stage({
  children,
  camera,
  inView,
  active = true,
  wakeKey = "",
  minDistance = 2,
  maxDistance = 12,
  className,
  onMiss,
  onReady,
}: {
  children: React.ReactNode;
  camera: V3;
  inView: boolean;
  active?: boolean;
  wakeKey?: string;
  minDistance?: number;
  maxDistance?: number;
  className?: string;
  onMiss?: () => void;
  onReady?: () => void;
}) {
  const [ready, setReady] = React.useState(false);
  const [level, setLevel] = React.useState<Quality>(startQuality);
  // camera and renderer options are fixed at mount: a new options object on a
  // later render would make the renderer rebuild the camera and lose the view
  const [cam] = React.useState(() => ({ position: camera, fov: 38, near: 0.05, far: 80 }));
  const [gl] = React.useState(() => ({ antialias: typeof window === "undefined" || window.devicePixelRatio < 2, alpha: true, powerPreference: "default" as const }));
  const dpr = Math.min(DPR[level], typeof window === "undefined" ? 1 : window.devicePixelRatio || 1);
  return (
    <div className={className} aria-hidden data-scene-ready={ready ? "1" : undefined} data-quality={level}>
      <Canvas
        dpr={dpr}
        frameloop={!inView ? "never" : active ? "always" : "demand"}
        camera={cam}
        gl={gl}
        onPointerMissed={onMiss}
        onCreated={(st) => {
          // allow per-material cut planes (the brain's coronal cut); costs nothing without planes
          st.gl.localClippingEnabled = true;
        }}
        style={{ touchAction: "none" }}
      >
        <QualityCtx.Provider value={level}>
          <ambientLight intensity={0.75} />
          <hemisphereLight args={["#ffffff", "#9aa3b5", 0.6]} />
          <directionalLight position={[3, 6, 5]} intensity={1.2} />
          <directionalLight position={[-4, 2, -3]} intensity={0.35} />
          {children}
          <FirstFrame onReady={() => { setReady(true); onReady?.(); }} level={level} />
          <Governor level={level} onDrop={() => setLevel((l) => (l > 0 ? ((l - 1) as Quality) : l))} />
          <Waker wakeKey={`${wakeKey}|${level}`} />
          <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.12} minDistance={minDistance} maxDistance={maxDistance} rotateSpeed={0.8} zoomSpeed={0.8} />
        </QualityCtx.Provider>
      </Canvas>
    </div>
  );
}

/**
 * Marks the stage ready after its first drawn frame (data-scene-ready), and,
 * only when a measuring script has set window.__scenePerf to an array, logs
 * renderer counts and frame times once a second.
 */
function FirstFrame({ onReady, level }: { onReady: () => void; level: Quality }) {
  const done = React.useRef(false);
  const acc = React.useRef({ t0: 0, n: 0 });
  const gl = useThree((st) => st.gl);
  useFrame((st) => {
    if (!done.current) {
      done.current = true;
      onReady();
    }
    const w = window as unknown as { __scenePerf?: unknown[]; __sceneFrames?: number };
    const probe = w.__scenePerf;
    if (!probe) return;
    w.__sceneFrames = (w.__sceneFrames ?? 0) + 1;
    (w as unknown as { __sceneCam?: number[] }).__sceneCam = st.camera.position.toArray().map((x) => +x.toFixed(2));
    const now = st.clock.elapsedTime;
    acc.current.n++;
    if (now - acc.current.t0 >= 1) {
      probe.push({ fps: acc.current.n / (now - acc.current.t0), calls: gl.info.render.calls, triangles: gl.info.render.triangles, geometries: gl.info.memory.geometries, textures: gl.info.memory.textures, dpr: gl.getPixelRatio(), quality: level });
      acc.current = { t0: now, n: 0 };
    }
  });
  return null;
}

/** Flies the camera to a new view whenever `flyKey` changes, then hands control back to the student. */
export function CameraRig({ flyKey, pos: rawPos, target, ms = 900, fitAspect = 0 }: { flyKey: string; pos: V3; target: V3; ms?: number; fitAspect?: number }) {
  const { camera, controls, size, invalidate } = useThree() as unknown as { camera: THREE.PerspectiveCamera; controls: OrbitLike | null; size: { width: number; height: number }; invalidate: () => void };
  // on narrow screens, step back so a wide subject still fits
  const k = fitAspect ? Math.max(1, fitAspect / (size.width / Math.max(1, size.height))) : 1;
  const pos: V3 = [target[0] + (rawPos[0] - target[0]) * k, target[1] + (rawPos[1] - target[1]) * k, target[2] + (rawPos[2] - target[2]) * k];
  const st = React.useRef<{ key: string; t0: number; from: THREE.Vector3; fromT: THREE.Vector3 } | null>(null);
  const fk = `${flyKey}-${k.toFixed(2)}`;
  useFrame(() => {
    // wall-clock time: the renderer's own clock restarts when the frame loop
    // switches mode, which would throw a flight far off course
    const now = performance.now();
    if (!st.current || st.current.key !== fk) {
      if (st.current === null) {
        st.current = { key: fk, t0: -1e9, from: camera.position.clone(), fromT: new THREE.Vector3(...target) };
        camera.position.set(...pos);
        if (controls) {
          controls.target.set(...target);
          controls.update();
        } else camera.lookAt(...target);
        return;
      }
      st.current = { key: fk, t0: now, from: camera.position.clone(), fromT: controls ? controls.target.clone() : new THREE.Vector3(...target) };
    }
    const f = (now - st.current.t0) / ms;
    if (f > 1 || f < 0) return;
    invalidate();
    const e = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
    camera.position.lerpVectors(st.current.from, new THREE.Vector3(...pos), e);
    if (controls) {
      controls.target.lerpVectors(st.current.fromT, new THREE.Vector3(...target), e);
      controls.update();
    } else camera.lookAt(...target);
  });
  return null;
}

export function curveOf(pts: V3[]) {
  return new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)), false, "centripetal");
}

/** A nerve or tract as a tube. `lit` (0 to 1) lights it from the start up to that fraction. */
export function Tube({ pts, radius = 0.025, color, opacity = 1, lit = 0, litColor, segments = 48, radial = 6, onTap, name, xray = false }: { xray?: boolean; pts: V3[]; radius?: number; color: string; opacity?: number; lit?: number; litColor?: string; segments?: number; radial?: number; onTap?: () => void; name?: string }) {
  const q = useQuality();
  const seg = segs(segments, q, 8);
  const rad = q === 0 ? Math.min(radial, 4) : radial;
  const isLit = lit > 0;
  const geo = React.useMemo(() => new THREE.TubeGeometry(curveOf(pts), seg, radius, rad, false), [pts, seg, radius, rad]);
  // the glowing overlay is built only once a signal has reached this tube
  const litGeo = React.useMemo(() => (isLit ? new THREE.TubeGeometry(curveOf(pts), seg, radius * 1.6, rad, false) : null), [isLit, pts, seg, radius, rad]);
  React.useEffect(() => () => geo.dispose(), [geo]);
  React.useEffect(() => () => litGeo?.dispose(), [litGeo]);
  React.useLayoutEffect(() => {
    if (!litGeo) return;
    // draw range along the tube: the index runs segment by segment from start to end
    const count = litGeo.index ? litGeo.index.count : 0;
    litGeo.setDrawRange(0, Math.floor((count * Math.max(0, Math.min(1, lit))) / (rad * 6)) * rad * 6);
  }, [litGeo, lit, rad]);
  return (
    <group>
      <mesh geometry={geo} name={name} onClick={onTap ? (e: ThreeEvent<MouseEvent>) => { if (e.delta < 8) { e.stopPropagation(); onTap(); } } : undefined}>
        <meshStandardMaterial key={opacity < 1 ? "see-through" : "solid"} color={color} transparent={opacity < 1} opacity={opacity} depthWrite={opacity >= 1} roughness={0.6} />
      </mesh>
      {litGeo ? (
        <mesh geometry={litGeo} renderOrder={xray ? 10 : 0}>
          <meshBasicMaterial color={litColor ?? color} transparent opacity={xray ? 0.8 : 0.55} depthWrite={false} depthTest={!xray} />
        </mesh>
      ) : null}
    </group>
  );
}

/**
 * The travelling signal: a bright head with a short trail. It follows the
 * journey's current leg from the moment that leg begins. `onProgress` lets
 * a view light the nerve behind it.
 */
export function Pulse({ journey, paths, colorOf, size = 0.07, onProgress, xray = false }: { xray?: boolean; journey: Journey; paths: Record<string, V3[]>; colorOf: (tone: Leg["tone"]) => string; size?: number; onProgress?: (path: string, t: number) => void }) {
  const head = React.useRef<THREE.Mesh>(null);
  const trail = React.useRef<(THREE.Mesh | null)[]>([]);
  const halo = React.useRef<THREE.Mesh>(null);
  const st = React.useRef({ id: "", t0: 0 });
  const cur = journey.cur;
  const id = cur ? `${journey.run}-${journey.leg}` : "";
  useFrame(() => {
    const now = performance.now();
    if (st.current.id !== id) st.current = { id, t0: now };
    const show = !!cur && !!paths[cur.path];
    if (head.current) head.current.visible = show;
    if (halo.current) halo.current.visible = show;
    trail.current.forEach((m) => m && (m.visible = show));
    if (!show || !cur) return;
    const pts = paths[cur.path];
    const t = Math.min(1, (now - st.current.t0) / (cur.ms * 0.92));
    const p = along(pts, t);
    head.current!.position.set(...p);
    halo.current!.position.set(...p);
    const s = 1 + 0.25 * Math.sin(now / 70);
    halo.current!.scale.setScalar(s);
    trail.current.forEach((m, k) => {
      if (!m) return;
      m.position.set(...along(pts, Math.max(0, t - (k + 1) * 0.03)));
    });
    onProgress?.(cur.path, t);
  });
  const col = cur ? colorOf(cur.tone) : "#ffffff";
  return (
    <group>
      <mesh ref={halo}>
        <sphereGeometry args={[size * 1.9, 12, 10]} />
        <meshBasicMaterial color={col} transparent opacity={0.28} depthWrite={false} depthTest={!xray} />
      </mesh>
      <mesh ref={head} renderOrder={xray ? 11 : 0}>
        <sphereGeometry args={[size, 14, 12]} />
        <meshBasicMaterial color={col} depthTest={!xray} transparent={xray} />
      </mesh>
      {[0, 1, 2, 3].map((k) => (
        <mesh key={k} ref={(m) => { trail.current[k] = m; }}>
          <sphereGeometry args={[size * (0.8 - k * 0.15), 8, 6]} />
          <meshBasicMaterial color={col} transparent opacity={0.6 - k * 0.13} depthWrite={false} depthTest={!xray} />
        </mesh>
      ))}
    </group>
  );
}

/** Keeps a lit fraction per path for the current journey: paths already passed are fully lit. */
export function useLitPaths(journey: Journey) {
  const [lit, setLit] = React.useState<Record<string, number>>({});
  const runRef = React.useRef(-1);
  const onProgress = React.useCallback((path: string, t: number) => {
    setLit((m) => (Math.abs((m[path] ?? 0) - t) < 0.04 && t < 1 ? m : { ...m, [path]: t }));
  }, []);
  // reset when a new run begins (handled in a frame callback, not in render)
  useFrame(() => {
    if (runRef.current !== journey.run) {
      runRef.current = journey.run;
      const passed: Record<string, number> = {};
      setLit(passed);
    }
  });
  const passed = React.useMemo(() => {
    const m: Record<string, number> = {};
    journey.legs.forEach((l, i) => {
      if (i < journey.leg) m[l.path] = 1;
    });
    return m;
  }, [journey.legs, journey.leg]);
  return { lit: { ...lit, ...passed }, onProgress, fade: journey.done };
}

export function themeColor(c: string, fallback: string) {
  try {
    return new THREE.Color(c).getStyle() ? c : fallback;
  } catch {
    return fallback;
  }
}
export type { ThemeColors };
