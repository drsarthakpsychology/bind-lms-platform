"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { CameraRig, Stage } from "./three-kit";
import { CA_CH, N_MOL, N_VES, RECEPTORS, STAGES, T, TRANSPORTER, moleculePos, response, rnd, vesiclePos, type SynViewProps } from "./synapse-scene";

/**
 * The synapse in 3D: a see-through nerve ending full of vesicles above a
 * receiving cell studded with receptors. Vesicles, transmitter molecules
 * and calcium ions are instanced, so one release is a handful of draw calls.
 */
export default function Synapse3D(p: SynViewProps) {
  return (
    <Stage className="h-full w-full" camera={[0.6, 0.9, 5.6]} inView={p.inView} minDistance={2.2} maxDistance={9}>
      <CameraRig flyKey="synapse" pos={[0.9, 1.3, 6.0]} target={[0, 0.7, 0]} fitAspect={1.4} />
      <Scene {...p} />
    </Stage>
  );
}

function bulbGeometry() {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const y = 3.4 - t * 3.0;
    const r = t < 0.25 ? 0.38 + t * 1.6 : 0.78 + Math.sin(Math.min(1, (t - 0.25) / 0.6) * Math.PI * 0.5) * 0.95;
    pts.push(new THREE.Vector2(t > 0.96 ? r * (1 - (t - 0.96) * 20) : r, y));
  }
  pts.push(new THREE.Vector2(0, 0.38));
  return new THREE.LatheGeometry(pts, 40);
}

function Scene({ fireAt, stage, reduce, drug, colors }: SynViewProps) {
  const bulb = React.useMemo(() => bulbGeometry(), []);
  React.useEffect(() => () => bulb.dispose(), [bulb]);
  const ves = React.useRef<THREE.InstancedMesh>(null);
  const mol = React.useRef<THREE.InstancedMesh>(null);
  const ca = React.useRef<THREE.InstancedMesh>(null);
  const recMats = React.useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const ap = React.useRef<THREE.Mesh>(null);
  const post = React.useRef<THREE.MeshStandardMaterial>(null);
  const m4 = React.useMemo(() => new THREE.Matrix4(), []);
  const q = React.useMemo(() => new THREE.Quaternion(), []);
  const sc = React.useMemo(() => new THREE.Vector3(), []);
  const pos = React.useMemo(() => new THREE.Vector3(), []);
  const bound = React.useMemo(() => new THREE.Color("#c4271b"), []);
  const freeC = React.useMemo(() => new THREE.Color("#f2b84b"), []);
  const recOn = React.useMemo(() => new THREE.Color(colors.brand), [colors.brand]);
  const recOff = React.useMemo(() => new THREE.Color("#d9d4ea"), []);
  // give every molecule a colour before the first draw, so the shader is built with instance colours
  React.useLayoutEffect(() => {
    const m = mol.current;
    if (!m) return;
    for (let i = 0; i < N_MOL; i++) m.setColorAt(i, freeC);
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [freeC]);
  useFrame(() => {
    const end = STAGES.slice(0, Math.max(0, stage) + 1).reduce((a, s) => a + s.ms, 0) - 1;
    const e = fireAt === null ? -1 : reduce ? end : performance.now() - fireAt;
    const t = performance.now() / 1000;
    const ee = Math.max(0, e);
    if (ves.current) {
      for (let k = 0; k < N_VES; k++) {
        const v = vesiclePos(k, fireAt === null ? 0 : ee, drug);
        pos.set(v.p[0], v.p[1] + (fireAt === null ? Math.sin(t + k) * 0.02 : 0), v.p[2]);
        sc.setScalar(Math.max(0.001, v.s));
        m4.compose(pos, q, sc);
        ves.current.setMatrixAt(k, m4);
      }
      ves.current.instanceMatrix.needsUpdate = true;
    }
    if (mol.current) {
      for (let i = 0; i < N_MOL; i++) {
        const m = fireAt === null ? moleculePos(i, 0, drug) : moleculePos(i, ee, drug);
        pos.set(...m.p);
        sc.setScalar(Math.max(0.001, m.s));
        m4.compose(pos, q, sc);
        mol.current.setMatrixAt(i, m4);
        mol.current.setColorAt(i, m.bound ? bound : freeC);
      }
      mol.current.instanceMatrix.needsUpdate = true;
      if (mol.current.instanceColor) mol.current.instanceColor.needsUpdate = true;
    }
    if (ca.current) {
      const on = e >= T.ca && e < T.dock + 400;
      ca.current.visible = on;
      if (on) {
        for (let i = 0; i < 16; i++) {
          const c = CA_CH[i % 2];
          const f = ((e - T.ca) / 700 + rnd(i, 11)) % 1;
          pos.set(c[0] + (rnd(i, 12) - 0.5) * 0.3, c[1] - 0.45 + f * 0.9, c[2] + (rnd(i, 13) - 0.5) * 0.3);
          sc.setScalar(1 - f * 0.5);
          m4.compose(pos, q, sc);
          ca.current.setMatrixAt(i, m4);
        }
        ca.current.instanceMatrix.needsUpdate = true;
      }
    }
    const r = response(e, drug);
    recMats.current.forEach((mm) => {
      if (!mm) return;
      mm.color.copy(recOff).lerp(recOn, r);
      mm.emissive.copy(recOn);
      mm.emissiveIntensity = r * 0.5;
    });
    if (post.current) post.current.emissiveIntensity = r * 0.25;
    if (ap.current) {
      const live = e >= 0 && e < T.ca;
      ap.current.visible = live;
      if (live) ap.current.position.y = 3.3 - (e / T.ca) * 2.0;
    }
  });
  return (
    <group>
      {/* nerve ending */}
      <mesh geometry={bulb}>
        <meshStandardMaterial color="#9fb8e8" transparent opacity={0.28} depthWrite={false} side={THREE.DoubleSide} roughness={0.5} />
      </mesh>
      <mesh ref={ap} visible={false} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.07, 10, 28]} />
        <meshBasicMaterial color={colors.danger} />
      </mesh>
      {CA_CH.map((c, k) => (
        <mesh key={k} position={c}>
          <cylinderGeometry args={[0.1, 0.1, 0.2, 12]} />
          <meshStandardMaterial color={colors.primary} />
        </mesh>
      ))}
      <mesh position={TRANSPORTER} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.12, 0.12, 0.24, 12]} />
        <meshStandardMaterial color={drug === "reuptake" ? "#555555" : "#7ba05b"} />
      </mesh>
      {drug === "reuptake" ? (
        <mesh position={[TRANSPORTER[0] + 0.05, TRANSPORTER[1] - 0.2, 0.05]}>
          <boxGeometry args={[0.18, 0.18, 0.18]} />
          <meshStandardMaterial color={colors.danger} />
        </mesh>
      ) : null}
      <instancedMesh ref={ves} args={[undefined, undefined, N_VES]} frustumCulled={false}>
        <sphereGeometry args={[0.2, 18, 14]} />
        <meshStandardMaterial color="#f4efe4" transparent opacity={0.55} depthWrite={false} roughness={0.3} />
      </instancedMesh>
      <instancedMesh ref={mol} args={[undefined, undefined, N_MOL]} frustumCulled={false}>
        <icosahedronGeometry args={[0.045, 1]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </instancedMesh>
      <instancedMesh ref={ca} args={[undefined, undefined, 16]} frustumCulled={false} visible={false}>
        <sphereGeometry args={[0.03, 8, 6]} />
        <meshBasicMaterial color={colors.primary} />
      </instancedMesh>
      {/* receiving cell */}
      <mesh position={[0, -0.85, 0]}>
        <boxGeometry args={[3.8, 1.0, 2.0]} />
        <meshStandardMaterial ref={post} color="#e6e0d2" emissive={colors.brand} emissiveIntensity={0} roughness={0.7} />
      </mesh>
      {RECEPTORS.map((r, k) => (
        <group key={k} position={[r[0], r[1] - 0.02, r[2]]}>
          <mesh position={[-0.06, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.05, 0.24, 8]} />
            <meshStandardMaterial ref={(m) => { recMats.current[k] = m; }} color="#d9d4ea" />
          </mesh>
          <mesh position={[0.06, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.05, 0.24, 8]} />
            <meshStandardMaterial color="#c9c3dd" />
          </mesh>
          {drug === "blocker" ? (
            <mesh position={[0, 0.16, 0]}>
              <boxGeometry args={[0.13, 0.09, 0.13]} />
              <meshStandardMaterial color="#222222" />
            </mesh>
          ) : null}
        </group>
      ))}
    </group>
  );
}
