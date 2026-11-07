"use client";

import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { along, type Journey, type Leg, type ThemeColors, type V3 } from "./kit";

/**
 * Shared 3D pieces, loaded only with the 3D views: the stage (camera, light,
 * touch controls), a camera that flies to a target, nerve tubes that light up
 * as a signal passes, and the travelling pulse. Low poly, pixel ratio capped
 * at 2, and the render loop stops when the scene is off screen.
 */

type OrbitLike = { target: THREE.Vector3; update: () => void; enabled: boolean };

export function Stage({
  children,
  camera,
  inView,
  minDistance = 2,
  maxDistance = 12,
  className,
  onMiss,
}: {
  children: React.ReactNode;
  camera: V3;
  inView: boolean;
  minDistance?: number;
  maxDistance?: number;
  className?: string;
  onMiss?: () => void;
}) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 2]}
        frameloop={inView ? "always" : "never"}
        camera={{ position: camera, fov: 38, near: 0.05, far: 80 }}
        gl={{ antialias: true, alpha: true, powerPreference: "default" }}
        onPointerMissed={onMiss}
        style={{ touchAction: "none" }}
      >
        <ambientLight intensity={0.75} />
        <hemisphereLight args={["#ffffff", "#9aa3b5", 0.6]} />
        <directionalLight position={[3, 6, 5]} intensity={1.2} />
        <directionalLight position={[-4, 2, -3]} intensity={0.35} />
        {children}
        <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.12} minDistance={minDistance} maxDistance={maxDistance} rotateSpeed={0.8} zoomSpeed={0.8} />
      </Canvas>
    </div>
  );
}

/** Flies the camera to a new view whenever `flyKey` changes, then hands control back to the student. */
export function CameraRig({ flyKey, pos: rawPos, target, ms = 900, fitAspect = 0 }: { flyKey: string; pos: V3; target: V3; ms?: number; fitAspect?: number }) {
  const { camera, controls, size } = useThree() as unknown as { camera: THREE.PerspectiveCamera; controls: OrbitLike | null; size: { width: number; height: number } };
  // on narrow screens, step back so a wide subject still fits
  const k = fitAspect ? Math.max(1, fitAspect / (size.width / Math.max(1, size.height))) : 1;
  const pos: V3 = [target[0] + (rawPos[0] - target[0]) * k, target[1] + (rawPos[1] - target[1]) * k, target[2] + (rawPos[2] - target[2]) * k];
  const st = React.useRef<{ key: string; t0: number; from: THREE.Vector3; fromT: THREE.Vector3 } | null>(null);
  const fk = `${flyKey}-${k.toFixed(2)}`;
  useFrame((state) => {
    const now = state.clock.elapsedTime * 1000;
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
    if (f > 1) return;
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
  const geo = React.useMemo(() => new THREE.TubeGeometry(curveOf(pts), segments, radius, radial, false), [pts, segments, radius, radial]);
  const litGeo = React.useMemo(() => new THREE.TubeGeometry(curveOf(pts), segments, radius * 1.6, radial, false), [pts, segments, radius, radial]);
  React.useEffect(() => () => (geo.dispose(), litGeo.dispose()), [geo, litGeo]);
  React.useLayoutEffect(() => {
    // draw range along the tube: the index runs segment by segment from start to end
    const count = litGeo.index ? litGeo.index.count : 0;
    litGeo.setDrawRange(0, Math.floor((count * Math.max(0, Math.min(1, lit))) / (radial * 6)) * radial * 6);
  }, [litGeo, lit, radial]);
  return (
    <group>
      <mesh geometry={geo} name={name} onClick={onTap ? (e: ThreeEvent<MouseEvent>) => { if (e.delta < 8) { e.stopPropagation(); onTap(); } } : undefined}>
        <meshStandardMaterial key={opacity < 1 ? "see-through" : "solid"} color={color} transparent={opacity < 1} opacity={opacity} depthWrite={opacity >= 1} roughness={0.6} />
      </mesh>
      {lit > 0 ? (
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
  useFrame((state) => {
    const now = state.clock.elapsedTime * 1000;
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
