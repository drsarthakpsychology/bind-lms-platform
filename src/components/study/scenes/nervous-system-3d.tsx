"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { CameraRig, Pulse, Stage, Tube, segs, useLitPaths, useQuality } from "./three-kit";
import { along, type V3 } from "./kit";
import { AUTO, BODY, CHAIN, LEVEL_VIEW, LIMBS, PARA, PARTS, PATHS, SOMATIC, SYMP, levelShows, type Part } from "./nervous-system-data";
import type { NsViewProps } from "./nervous-system";

/** The nervous system body in 3D: a glass body with brain, cord, nerves and organs that respond. */
export default React.memo(function NervousSystem3D(p: NsViewProps) {
  const view = p.mode === "map" ? LEVEL_VIEW[p.level] : p.mode === "auto" ? { pos: [1.0, 1.0, 3.7] as V3, target: [0, 0.8, 0] as V3 } : LEVEL_VIEW.all;
  return (
    <Stage className="h-full w-full" camera={LEVEL_VIEW.all.pos} inView={p.inView} active={p.mode === "auto" || p.journey.active} wakeKey={`${p.mode}-${p.level}-${p.auto}-${p.journey.run}-${p.journey.leg}`} onReady={p.onReady} minDistance={1.2} maxDistance={9}>
      <CameraRig flyKey={`${p.mode}-${p.mode === "map" ? p.level : ""}`} pos={view.pos} target={view.target} fitAspect={0.7} />
      <Scene {...p} />
    </Stage>
  );
});

const SKIN = "#c9a98f";
const tap = (fn: () => void) => (e: ThreeEvent<MouseEvent>) => {
  if (e.delta > 8) return;
  e.stopPropagation();
  fn();
};

function Limb({ a, b, r }: { a: V3; b: V3; r: number }) {
  const { pos, quat, len } = React.useMemo(() => {
    const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b);
    const dir = vb.clone().sub(va);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return { pos: va.clone().add(vb).multiplyScalar(0.5), quat: q, len: dir.length() };
  }, [a, b]);
  return (
    <mesh position={pos} quaternion={quat}>
      <capsuleGeometry args={[r, len, 4, 10]} />
      <meshStandardMaterial color={SKIN} transparent opacity={0.28} depthWrite={false} roughness={0.8} />
    </mesh>
  );
}

function Skin({ opacity = 0.28, children, ...rest }: { opacity?: number; children: React.ReactNode } & React.ComponentProps<"mesh">) {
  return (
    <mesh {...rest}>
      {children}
      <meshStandardMaterial color={SKIN} transparent opacity={opacity} depthWrite={false} roughness={0.8} />
    </mesh>
  );
}

/** Small glowing dots that stream along a set of paths (the autonomic outflow). */
function Stream({ paths, color, speed, on }: { paths: string[]; color: string; speed: number; on: boolean }) {
  const ref = React.useRef<THREE.InstancedMesh>(null);
  const per = 4;
  const n = paths.length * per;
  const m = React.useMemo(() => new THREE.Matrix4(), []);
  useFrame((s) => {
    const mesh = ref.current;
    if (!mesh) return;
    mesh.visible = on;
    if (!on) return;
    const t = s.clock.elapsedTime * speed;
    paths.forEach((k, i) => {
      for (let j = 0; j < per; j++) {
        const f = (t + j / per + i * 0.13) % 1;
        const pt = along(PATHS[k], f);
        m.makeTranslation(pt[0], pt[1], pt[2]);
        mesh.setMatrixAt(i * per + j, m);
      }
    });
    mesh.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, n]} frustumCulled={false}>
      <sphereGeometry args={[0.022, 8, 6]} />
      <meshBasicMaterial color={color} />
    </instancedMesh>
  );
}

/** Adrenaline: dots that drift out from the adrenal gland into the body. */
function Adrenaline({ on, color }: { on: boolean; color: string }) {
  const ref = React.useRef<THREE.InstancedMesh>(null);
  const n = 24;
  const seeds = React.useMemo(() => Array.from({ length: n }, (_, i) => [Math.sin(i * 12.9898) * 0.5 + 0.5, Math.sin(i * 78.233) * 0.5 + 0.5, Math.sin(i * 39.425) * 0.5 + 0.5]), []);
  const m = React.useMemo(() => new THREE.Matrix4(), []);
  useFrame((s) => {
    const mesh = ref.current;
    if (!mesh) return;
    mesh.visible = on;
    if (!on) return;
    const t = s.clock.elapsedTime;
    seeds.forEach(([a, b, c], i) => {
      const f = (t * 0.25 + a) % 1;
      const ang = b * Math.PI * 2 + t * 0.3;
      const rad = 0.05 + f * 0.45;
      m.makeTranslation(BODY.adrenal[0] + Math.cos(ang) * rad * 0.8, BODY.adrenal[1] + (c - 0.5) * f * 1.1, BODY.adrenal[2] + Math.sin(ang) * rad * 0.4 + 0.1);
      m.scale(new THREE.Vector3(1 - f * 0.7, 1 - f * 0.7, 1 - f * 0.7));
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, n]} frustumCulled={false}>
      <icosahedronGeometry args={[0.025, 0]} />
      <meshBasicMaterial color={color} />
    </instancedMesh>
  );
}

function Brain({ opacity, color }: { opacity: number; color: string }) {
  const q = useQuality();
  const geo = React.useMemo(() => {
    const g = new THREE.SphereGeometry(1, segs(40, q), segs(28, q));
    const pos = g.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const bump = 1 + 0.045 * Math.sin(v.x * 17 + v.y * 9) * Math.sin(v.z * 15 - v.y * 11) - (Math.abs(v.x) < 0.07 && v.y > 0 ? 0.08 : 0);
      v.multiplyScalar(bump);
      pos.setXYZ(i, v.x * BODY.brain.r[0], v.y * BODY.brain.r[1], v.z * BODY.brain.r[2]);
    }
    g.computeVertexNormals();
    return g;
  }, [q]);
  React.useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo} position={BODY.brain.c}>
      <meshStandardMaterial color={color} roughness={0.55} transparent opacity={opacity} />
    </mesh>
  );
}

function Scene({ mode, journey, auto, level, onPart, colors }: NsViewProps) {
  const q = useQuality();
  const a = AUTO[auto];
  const show = mode === "map" ? levelShows(level) : { brain: true, cord: true, somatic: mode === "signal", symp: mode === "auto", para: mode === "auto", organs: mode === "auto" };
  const symOn = mode === "auto" ? auto === "fight" : mode === "map" && show.symp;
  const paraOn = mode === "auto" ? auto === "rest" : mode === "map" && show.para;
  const { lit, onProgress } = useLitPaths(journey);
  const heart = React.useRef<THREE.Group>(null);
  const lungs = React.useRef<(THREE.Mesh | null)[]>([]);
  const pupils = React.useRef<(THREE.Mesh | null)[]>([]);
  const gut = React.useRef<THREE.Group>(null);
  const bladder = React.useRef<THREE.Mesh>(null);
  const markers = React.useRef<THREE.Group>(null);
  const pupilTarget = journey.cur?.path === "eye-back" || (journey.done && journey.key === "eye-reflex") ? 0.15 : mode === "auto" ? a.pupil : 0.5;
  const pupilNow = React.useRef(0.5);
  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    const beat = (t * a.bpm) / 60;
    const ph = beat % 1;
    const k = ph < 0.15 ? Math.sin((ph / 0.15) * Math.PI) * 0.22 : ph < 0.3 ? -Math.sin(((ph - 0.15) / 0.15) * Math.PI) * 0.05 : 0;
    heart.current?.scale.setScalar(1 + k);
    const br = 1 + 0.07 * Math.sin((t * a.breaths * Math.PI * 2) / 60);
    lungs.current.forEach((l) => l && l.scale.set(0.15 * a.airway * br, 0.26 * br, 0.14 * br));
    pupilNow.current += (pupilTarget - pupilNow.current) * Math.min(1, dt * 4);
    pupils.current.forEach((pp) => pp && pp.scale.setScalar(0.4 + pupilNow.current * 0.9));
    if (gut.current) gut.current.rotation.z = a.gut ? Math.sin(t * (1 + a.gut * 2)) * 0.06 * a.gut : 0;
    bladder.current?.scale.setScalar(0.075 * (0.85 + a.bladder * 0.35 + (auto === "rest" && mode === "auto" ? Math.sin(t * 2) * 0.03 : 0)));
    if (markers.current) markers.current.children.forEach((c, i) => c.scale.setScalar(1 + 0.18 * Math.sin(t * 3 + i)));
  });
  const nerve = colors.fg === "#ededed" || colors.bg.startsWith("#1") || colors.bg.startsWith("#0") ? "#d9b65a" : "#b8902f";
  const sense = colors.brand;
  const motor = colors.danger;
  return (
    <group>
      {/* the body */}
      <Skin position={BODY.head.c} scale={BODY.head.r} opacity={0.16}><sphereGeometry args={[1, segs(24, q), segs(18, q)]} /></Skin>
      <Skin position={[0, 1.27, -0.02]}><cylinderGeometry args={[0.09, 0.11, 0.22, 12]} /></Skin>
      <Skin position={[0, 0.62, 0]} scale={[1.18, 1, 0.62]}><capsuleGeometry args={[0.38, 0.62, q ? 6 : 3, segs(16, q)]} /></Skin>
      <Skin position={[0, -0.05, 0]} scale={[0.36, 0.2, 0.24]}><sphereGeometry args={[1, 16, 12]} /></Skin>
      {LIMBS.map((l) => (
        <group key={l.id}>
          <Limb a={l.pts[0]} b={l.pts[1]} r={l.r} />
          <Limb a={l.pts[1]} b={l.pts[2]} r={l.r * 0.85} />
        </group>
      ))}
      <Skin position={[-0.8, -0.2, 0.12]} scale={[0.07, 0.11, 0.05]} opacity={0.3}><sphereGeometry args={[1, 12, 10]} /></Skin>
      <Skin position={[0.8, -0.2, 0.12]} scale={[0.07, 0.11, 0.05]} opacity={0.3}><sphereGeometry args={[1, 12, 10]} /></Skin>
      {[-0.27, 0.27].map((x) => <Skin key={x} position={[x, -1.9, 0.08]} scale={[0.08, 0.05, 0.16]} opacity={0.3}><sphereGeometry args={[1, 12, 10]} /></Skin>)}

      {/* brain and spinal cord */}
      <Brain opacity={show.brain ? 1 : 0.25} color="#ee9fae" />
      <Tube pts={PATHS.cord} radius={0.032} color="#f4ead8" opacity={show.cord ? 1 : 0.25} segments={64} />
      {mode === "auto" || (mode === "map" && show.symp) ? CHAIN.map((c, i) => (
        <mesh key={i} position={c}>
          <sphereGeometry args={[0.022, 8, 6]} />
          <meshStandardMaterial color={motor} transparent opacity={symOn ? 1 : 0.35} />
        </mesh>
      )) : null}

      {/* nerves */}
      {SOMATIC.map((k) => (
        <Tube key={k} pts={PATHS[k]} radius={0.012} color={nerve} opacity={show.somatic ? 0.9 : 0.12} lit={lit[k] ?? 0} litColor={k.endsWith("out") ? motor : sense} />
      ))}
      {["up-c", "down-c", "up-l", "down-l", "decide", "eye-in", "eye-bs", "eye-back", "eye-decide", "inter-c", "inter-l"].map((k) =>
        lit[k] ? <Tube key={k} pts={PATHS[k]} radius={0.014} color={nerve} opacity={0.01} lit={lit[k]} litColor={journey.legs.find((l) => l.path === k)?.tone === "motor" ? motor : sense} /> : null,
      )}
      {SYMP.map((k) => <Tube key={k} pts={PATHS[k]} radius={0.01} color={motor} opacity={symOn ? 0.95 : show.symp && mode === "map" ? 0.7 : 0.12} />)}
      {PARA.map((k) => <Tube key={k} pts={PATHS[k]} radius={0.01} color={sense} opacity={paraOn ? 0.95 : show.para && mode === "map" ? 0.7 : 0.12} />)}
      <Stream paths={SYMP} color={motor} speed={0.9} on={symOn} />
      <Stream paths={PARA} color={sense} speed={0.45} on={paraOn} />
      <Adrenaline on={mode === "auto" && a.adrenaline} color={colors.primary} />

      {/* organs */}
      <group ref={heart} position={BODY.heart}>
        <mesh scale={[0.085, 0.1, 0.08]} rotation={[0, 0, -0.5]}>
          <sphereGeometry args={[1, 18, 14]} />
          <meshStandardMaterial color="#c4271b" roughness={0.45} emissive="#5a0a05" emissiveIntensity={mode === "auto" && auto === "fight" ? 0.8 : 0.2} />
        </mesh>
      </group>
      {BODY.lungs.map((pos, i) => (
        <mesh key={i} ref={(m) => { lungs.current[i] = m; }} position={pos} scale={[0.15, 0.26, 0.14]}>
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color="#9cc3ea" transparent opacity={show.organs || mode !== "map" ? 0.55 : 0.2} depthWrite={false} roughness={0.7} />
        </mesh>
      ))}
      <group ref={gut} position={BODY.stomach}>
        <mesh scale={[0.11, 0.07, 0.06]} rotation={[0, 0, 0.4]}>
          <sphereGeometry args={[1, 14, 10]} />
          <meshStandardMaterial color="#d79a5c" roughness={0.6} />
        </mesh>
        <mesh position={[-0.13, -0.17, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <torusKnotGeometry args={[0.1, 0.022, segs(48, q), q ? 6 : 4, 2, 5]} />
          <meshStandardMaterial color="#c98a4b" roughness={0.6} emissive="#5a3510" emissiveIntensity={mode === "auto" ? a.gut * 0.6 : 0} />
        </mesh>
      </group>
      <mesh ref={bladder} position={BODY.bladder} scale={0.075}>
        <sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial color="#e9d47a" roughness={0.6} />
      </mesh>
      <mesh position={BODY.adrenal} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.04, 0.06, 8]} />
        <meshStandardMaterial color={colors.primary} emissive={colors.primary} emissiveIntensity={mode === "auto" && a.adrenaline ? 0.9 : 0} />
      </mesh>
      {BODY.eyes.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <sphereGeometry args={[0.042, 14, 10]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
          <mesh ref={(m) => { pupils.current[i] = m; }} position={[0, 0, 0.041]}>
            <circleGeometry args={[0.02, 16]} />
            <meshBasicMaterial color="#111111" />
          </mesh>
        </group>
      ))}

      {/* tap targets */}
      <group ref={markers} visible={mode === "signal"}>
        {(Object.keys(PARTS) as Part[]).map((part) => (
          <mesh key={part} position={PARTS[part]} onClick={mode === "signal" ? tap(() => onPart(part)) : undefined}>
            <sphereGeometry args={[part === "eye" ? 0.07 : 0.12, 14, 10]} />
            <meshBasicMaterial color={sense} transparent opacity={0.22} depthWrite={false} />
          </mesh>
        ))}
      </group>

      <Pulse journey={journey} paths={PATHS} colorOf={(t) => (t === "motor" ? motor : sense)} size={0.06} onProgress={onProgress} />
    </group>
  );
}
