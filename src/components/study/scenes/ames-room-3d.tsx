"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Glow, IdleSway } from "./fx";
import { CameraRig, Stage, segs, useQuality } from "./three-kit";
import type { V3 } from "./kit";
import { EYE, PERSON_H, ROOM, along, real, type AmesViewProps } from "./ames-room";

/**
 * The Ames room in 3D. Every vertex of an ordinary rectangular room is slid
 * along its line of sight from the peephole, so from the peephole the room
 * looks rectangular while really it is a skewed trapezoid. Two people of
 * the same height stand in the back corners.
 */
function AmesRoom3D(p: AmesViewProps) {
  const views: Record<AmesViewProps["stop"], { pos: V3; target: V3 }> = {
    peephole: { pos: EYE, target: [0, 1.3, 0.5] },
    side: { pos: [11, 5, 1.6], target: [-1, 1.5, 1.2] },
    // looking down with the long side of the floor across the screen
    above: { pos: [-1.8, 13, 1.1], target: [-1, 0, 1.1] },
  };
  const v = views[p.stop];
  return (
    <Stage className="h-full w-full" camera={EYE} inView={p.inView} active={p.swapping} wakeKey={p.stop} onReady={p.onReady} locked={p.stop === "peephole"} minDistance={3} maxDistance={28} fx={p.colors.brand}>
      <CameraRig flyKey={p.stop} pos={v.pos} target={v.target} ms={1200} fitAspect={p.stop === "peephole" ? 0 : 1.4} />
      <PeepholeLens on={p.stop === "peephole"} />
      <Room peephole={p.stop === "peephole"} />
      <Person t={p.swapT} color={p.colors.brand} idleKey={`${p.stop}-${p.swapping}`} phase={0} />
      <Person t={1 - p.swapT} color={p.colors.danger} idleKey={`${p.stop}-${p.swapping}`} phase={1.7} />
      {p.stop !== "peephole" ? <SightLines t={p.swapT} /> : null}
    </Stage>
  );
}
export default React.memo(AmesRoom3D);

/** At the peephole, widen the lens on narrow screens so the whole room fits (moving the eye would break the illusion). */
function PeepholeLens({ on }: { on: boolean }) {
  useFrame((state) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const aspect = state.size.width / Math.max(1, state.size.height);
    const want = on ? Math.min(70, Math.max(38, 62 / Math.max(0.6, aspect))) : 38;
    if (Math.abs(camera.fov - want) > 0.1) {
      camera.fov += (want - camera.fov) * 0.2;
      camera.updateProjectionMatrix();
      state.invalidate();
    }
  });
  return null;
}

/** A subdivided rectangle of the apparent room, moved to where it really is, with a colour per cell. */
function surface(a: V3, u: V3, w: V3, nu: number, nw: number, color: (i: number, j: number) => THREE.Color) {
  const pos: number[] = [];
  const col: number[] = [];
  const P = (i: number, j: number): V3 => real([a[0] + u[0] * (i / nu) + w[0] * (j / nw), a[1] + u[1] * (i / nu) + w[1] * (j / nw), a[2] + u[2] * (i / nu) + w[2] * (j / nw)]);
  for (let i = 0; i < nu; i++) for (let j = 0; j < nw; j++) {
    const c = color(i, j);
    const q = [P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)];
    for (const k of [0, 1, 2, 0, 2, 3]) {
      pos.push(...q[k]);
      col.push(c.r, c.g, c.b);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}

function Room({ peephole }: { peephole: boolean }) {
  const q = useQuality();
  const geos = React.useMemo(() => {
    const W = ROOM.w, H = ROOM.h, D = ROOM.d;
    const light = new THREE.Color("#f3e6d0"), side = new THREE.Color("#ead7bb"), dark = new THREE.Color("#2b2b2b"), tile = new THREE.Color("#f7f3ea"), glass = new THREE.Color("#b9d3ef");
    const n = q === 0 ? 1 : 2;
    const floor = surface([-W / 2, 0, 0], [W, 0, 0], [0, 0, D], 8 * n, 8 * n, (i, j) => ((Math.floor(i / n) + Math.floor(j / n)) % 2 ? dark : tile));
    const back = surface([-W / 2, 0, 0], [W, 0, 0], [0, H, 0], 8 * n, 6 * n, (i, j) => {
      const x = (i + 0.5) / (8 * n), y = (j + 0.5) / (6 * n);
      const win = y > 0.43 && y < 0.77 && ((x > 0.08 && x < 0.32) || (x > 0.68 && x < 0.92));
      return win ? glass : light;
    });
    const leftW = surface([-W / 2, 0, D], [0, 0, -D], [0, H, 0], 4 * n, 3 * n, () => side);
    const rightW = surface([W / 2, 0, 0], [0, 0, D], [0, H, 0], 4 * n, 3 * n, () => side);
    const ceiling = surface([-W / 2, H, 0], [0, 0, D], [W, 0, 0], 4, 4, () => new THREE.Color("#fbf6ee"));
    const edges = new THREE.BufferGeometry().setFromPoints(
      ([[[-W / 2, 0, 0], [W / 2, 0, 0]], [[-W / 2, H, 0], [W / 2, H, 0]], [[-W / 2, 0, 0], [-W / 2, H, 0]], [[W / 2, 0, 0], [W / 2, H, 0]], [[-W / 2, 0, 0], [-W / 2, 0, D]], [[W / 2, 0, 0], [W / 2, 0, D]], [[-W / 2, H, 0], [-W / 2, H, D]], [[W / 2, H, 0], [W / 2, H, D]]] as V3[][]).flatMap(([a, b]) => [new THREE.Vector3(...real(a)), new THREE.Vector3(...real(b))]),
    );
    return { floor, back, leftW, rightW, ceiling, edges };
  }, [q]);
  React.useEffect(() => () => Object.values(geos).forEach((g) => g.dispose()), [geos]);
  return (
    <group>
      <mesh geometry={geos.floor}>
        <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.85} />
      </mesh>
      {/* away from the peephole the walls turn to glass, so the people and the floor stay in sight */}
      {[geos.back, geos.leftW, geos.rightW].map((g, k) => (
        <mesh key={k} geometry={g} renderOrder={1}>
          <meshStandardMaterial key={peephole ? "solid" : "glass"} vertexColors side={THREE.DoubleSide} roughness={0.85} transparent={!peephole} opacity={peephole ? 1 : 0.42} depthWrite={peephole} />
        </mesh>
      ))}
      <mesh geometry={geos.ceiling} visible={peephole}>
        <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.9} />
      </mesh>
      <lineSegments geometry={geos.edges}>
        <lineBasicMaterial color="#5a4a3a" />
      </lineSegments>
      {/* the peephole itself, seen when you step away from it */}
      <mesh position={EYE} visible={!peephole}>
        <torusGeometry args={[0.12, 0.04, 8, 20]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <Glow position={EYE} color="#ffd27a" size={0.9} opacity={0.8} visible={!peephole} />
    </group>
  );
}

/** A simple illustrated person, 1.6 m tall, standing on the real floor at an apparent spot along the back wall. */
function Person({ t, color, idleKey, phase }: { t: number; color: string; idleKey: string; phase: number }) {
  const q = useQuality();
  const foot = real(along(t));
  const sg = segs(14, q);
  return (
    <group position={foot}>
      {/* while nobody touches, they shift their weight and look about a little */}
      <IdleSway on stopKey={idleKey} amount={0.35} maxMs={12000} phase={phase}>
      {[-0.09, 0.09].map((x) => (
        <mesh key={x} position={[x, 0.42, 0]}>
          <capsuleGeometry args={[0.07, 0.7, 3, sg]} />
          <meshStandardMaterial color="#3b3b4a" roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 1.08, 0]}>
        <capsuleGeometry args={[0.2, 0.42, 4, sg]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {[-0.27, 0.27].map((x) => (
        <mesh key={x} position={[x, 1.08, 0]} rotation={[0, 0, x > 0 ? 0.12 : -0.12]}>
          <capsuleGeometry args={[0.055, 0.5, 3, sg]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, PERSON_H - 0.13, 0]}>
        <sphereGeometry args={[0.13, sg, sg]} />
        <meshStandardMaterial color="#e2b48f" roughness={0.6} />
      </mesh>
      </IdleSway>
    </group>
  );
}

/** Lines from the peephole to each person's head: the same angle can mean a small near person or a large far one. */
function SightLines({ t }: { t: number }) {
  const geo = React.useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (const k of [t, 1 - t]) {
      const f = real(along(k));
      pts.push(new THREE.Vector3(...EYE), new THREE.Vector3(f[0], f[1] + PERSON_H, f[2]));
      pts.push(new THREE.Vector3(...EYE), new THREE.Vector3(...f));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [t]);
  React.useEffect(() => () => geo.dispose(), [geo]);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#d97706" transparent opacity={0.85} toneMapped={false} />
    </lineSegments>
  );
}
