"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Glow } from "./fx";
import { CameraRig, Stage, curveOf } from "./three-kit";
import { sampleCurve, type V3 } from "./kit";
import { NODES, REST, travelMs, type ApViewProps } from "./action-potential";

/**
 * The neuron in 3D: branching dendrites, a cell body that glows as it is
 * pushed towards threshold, an axon wrapped in myelin with gaps (nodes), and
 * terminals. Each action potential is a bright ring racing down the axon,
 * jumping node to node when the axon has myelin, with sodium ions drawn in
 * where it passes.
 */
function ActionPotential3D(p: ApViewProps) {
  return (
    <Stage className="h-full w-full" camera={[0.4, 1.4, 7.4]} inView={p.inView} active={p.active} wakeKey={`${p.myelin}`} onReady={p.onReady} minDistance={2.5} maxDistance={12} sway fog={3.4} bg={p.colors.bg} fx={p.colors.primary}>
      <CameraRig flyKey="neuron" pos={[0.4, 1.3, 6.8]} target={[0.4, 0, 0]} fitAspect={2.2} />
      <Neuron {...p} />
    </Stage>
  );
}

/** Re-renders only when its props change; the simulation itself is read per frame. */
export default React.memo(ActionPotential3D);

const AX0 = -1.9, AX1 = 3.6; // axon from the hillock to the terminals
const axonX = (f: number) => AX0 + (AX1 - AX0) * f;

/** A seeded branching tree of dendrites. */
function dendrites(): V3[][] {
  const out: V3[][] = [];
  const rnd = (i: number) => Math.sin(i * 91.7 + 3.1) * 0.5 + 0.5;
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2 + 0.4;
    const dir: V3 = [-Math.abs(Math.cos(ang)) - 0.3, Math.sin(ang), Math.cos(ang * 1.7) * 0.6];
    const base: V3 = [-2.6 + dir[0] * 0.3, dir[1] * 0.3, dir[2] * 0.3];
    const mid: V3 = [-2.6 + dir[0] * 1.0, dir[1] * 1.0 + (rnd(i) - 0.5) * 0.3, dir[2] * 1.0];
    const tip: V3 = [-2.6 + dir[0] * 1.6, dir[1] * 1.55, dir[2] * 1.5];
    out.push([base, mid, tip]);
    out.push([mid, [mid[0] - 0.4, mid[1] + 0.35 * Math.sign(dir[1] || 1), mid[2] + 0.3], [mid[0] - 0.7, mid[1] + 0.6 * Math.sign(dir[1] || 1), mid[2] + 0.2]]);
  }
  return out;
}
const TERMS: V3[][] = [0, 1, 2, 3].map((k) => {
  const a = (k / 4) * Math.PI * 2 + 0.5;
  return [[AX1, 0, 0], [AX1 + 0.35, Math.sin(a) * 0.3, Math.cos(a) * 0.3], [AX1 + 0.7, Math.sin(a) * 0.6, Math.cos(a) * 0.6]];
});

function TubeMesh({ pts, r, color }: { pts: V3[]; r: number; color: string }) {
  const geo = React.useMemo(() => new THREE.TubeGeometry(curveOf(sampleCurve(pts, 6)), 16, r, 6, false), [pts, r]);
  React.useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color={color} roughness={0.55} />
    </mesh>
  );
}

function Neuron({ simRef, myelin, colors, onStim }: ApViewProps) {
  const dend = React.useMemo(() => dendrites(), []);
  const soma = React.useRef<THREE.MeshStandardMaterial>(null);
  const ring = React.useRef<THREE.Mesh>(null);
  const halo = React.useRef<THREE.Sprite>(null);
  const somaGlow = React.useRef<THREE.Sprite>(null);
  const bulbGlow = React.useRef<(THREE.Sprite | null)[]>([]);
  const nodes = React.useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const bulbs = React.useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const ions = React.useRef<THREE.InstancedMesh>(null);
  const m4 = React.useMemo(() => new THREE.Matrix4(), []);
  const nodeX = React.useMemo(() => Array.from({ length: NODES + 1 }, (_, i) => axonX(i / NODES)), []);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const sim = simRef.current;
    const last = sim.fired[sim.fired.length - 1];
    const k = last ? (sim.t - last.at) / travelMs(last.myelin) : 2;
    const glow = Math.max(0, Math.min(1, (sim.v - REST) / 15));
    if (soma.current) soma.current.emissiveIntensity = 0.15 + glow * 1.1;
    if (somaGlow.current) {
      const sm = somaGlow.current.material as THREE.SpriteMaterial;
      sm.opacity = 0.15 + glow * 0.75;
      somaGlow.current.scale.setScalar(1.7 + glow * 0.9);
    }
    const live = !!last && k < 1;
    let f = Math.min(1, k);
    if (last?.myelin && live) f = Math.round(f * NODES) / NODES;
    const x = axonX(f);
    if (ring.current) {
      ring.current.visible = live;
      ring.current.position.x = x;
      ring.current.scale.setScalar(1 + 0.15 * Math.sin(t * 30));
    }
    if (halo.current) {
      halo.current.visible = live;
      halo.current.position.x = x;
      halo.current.scale.setScalar(1.3 + 0.2 * Math.sin(t * 25));
    }
    nodes.current.forEach((m, i) => {
      if (!m) return;
      const hit = live && last!.myelin && Math.abs(nodeX[i] - x) < 0.05;
      m.opacity = hit ? 1 : 0.25;
    });
    const rel = k >= 1 && k < 1.5 ? (1.5 - k) * 2 : 0;
    bulbs.current.forEach((m) => m && (m.emissiveIntensity = 1.2 * rel));
    bulbGlow.current.forEach((g) => {
      if (!g) return;
      g.visible = rel > 0;
      (g.material as THREE.SpriteMaterial).opacity = rel;
    });
    const im = ions.current;
    if (im) {
      im.visible = live;
      if (live) {
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * Math.PI * 2;
          const ph = (t * 3 + i * 0.37) % 1;
          const rad = 0.55 - ph * 0.42;
          m4.makeTranslation(x + Math.sin(i * 7.1) * 0.12, Math.cos(a) * rad, Math.sin(a) * rad);
          im.setMatrixAt(i, m4);
        }
        im.instanceMatrix.needsUpdate = true;
      }
    }
  });
  const tapSoma = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 8) return;
    e.stopPropagation();
    onStim();
  };
  const segLen = (AX1 - AX0) / NODES;
  return (
    <group position={[-0.4, 0, 0]}>
      {dend.map((pts, i) => <TubeMesh key={i} pts={pts} r={i % 2 ? 0.045 : 0.07} color="#9fb8e8" />)}
      <mesh position={[-2.6, 0, 0]} onClick={tapSoma}>
        <sphereGeometry args={[0.55, 28, 20]} />
        <meshStandardMaterial ref={soma} color="#9fb8e8" emissive={colors.brand} emissiveIntensity={0.15} roughness={0.45} />
      </mesh>
      <Glow ref={somaGlow} position={[-2.6, 0, 0]} color={colors.brand} size={1.7} opacity={0.15} />
      <mesh position={[-2.6, 0, 0.32]}>
        <sphereGeometry args={[0.18, 16, 12]} />
        <meshStandardMaterial color="#5b6fa8" roughness={0.5} />
      </mesh>
      <mesh position={[-2.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.22, 0.4, 16]} />
        <meshStandardMaterial color="#9fb8e8" roughness={0.5} />
      </mesh>
      {/* axon */}
      <mesh position={[(AX0 + AX1) / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, AX1 - AX0, 12]} />
        <meshStandardMaterial color="#9fb8e8" roughness={0.5} />
      </mesh>
      {myelin
        ? Array.from({ length: NODES }, (_, i) => (
            <mesh key={i} position={[axonX((i + 0.5) / NODES), 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <capsuleGeometry args={[0.17, segLen - 0.42, 6, 14]} />
              <meshStandardMaterial color="#f4efe4" roughness={0.7} />
            </mesh>
          ))
        : null}
      {myelin
        ? nodeX.map((x, i) => (
            <mesh key={i} position={[x, 0, 0]}>
              <sphereGeometry args={[0.13, 12, 10]} />
              <meshBasicMaterial ref={(m) => { nodes.current[i] = m; }} color={colors.primary} transparent opacity={0.25} />
            </mesh>
          ))
        : null}
      {TERMS.map((pts, i) => (
        <group key={i}>
          <TubeMesh pts={pts} r={0.045} color="#9fb8e8" />
          <mesh position={pts[2]}>
            <sphereGeometry args={[0.14, 14, 10]} />
            <meshStandardMaterial ref={(m) => { bulbs.current[i] = m; }} color="#cfd9f2" emissive={colors.primary} emissiveIntensity={0} />
          </mesh>
          <Glow ref={(g) => { bulbGlow.current[i] = g; }} position={pts[2]} color={colors.primary} size={0.8} visible={false} />
        </group>
      ))}
      {/* the impulse */}
      <mesh ref={ring} rotation={[0, Math.PI / 2, 0]} visible={false}>
        <torusGeometry args={[0.24, 0.06, 10, 28]} />
        <meshBasicMaterial color={colors.danger} />
      </mesh>
      <Glow ref={halo} color={colors.danger} size={1.3} opacity={0.95} visible={false} />
      <instancedMesh ref={ions} args={[undefined, undefined, 16]} frustumCulled={false} visible={false}>
        <sphereGeometry args={[0.035, 8, 6]} />
        <meshBasicMaterial color="#ffc85a" transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}
