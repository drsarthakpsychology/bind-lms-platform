"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { CameraRig, Stage, Tube, segs, useQuality } from "./three-kit";
import { sampleCurve, type V3 } from "./kit";
import { BLOBS, CEREBELLUM, REGION_COLOR, TUBES, to3, type RegionId } from "./brain-explorer-data";
import { buildCerebellum, buildHemisphere } from "./brain-explorer-3d";
import { DLPFC, ELECTRODES, HEAD, SGACC, onScalp, type SlicerViewProps } from "./brain-slicer";

/**
 * The slicer's 3D view: the brain cut at the current slice, with a glass
 * plane where the cut is; or a see-through head with an rTMS coil over the
 * left DLPFC, or ECT electrodes and their current path.
 */
function BrainSlicer3D(p: SlicerViewProps) {
  const cam: Record<string, { pos: V3; target: V3 }> = {
    slice: { pos: [2.6, 1.9, 4.2], target: [0, -0.1, 0] },
    tms: { pos: [-2.4, 2.4, 4.0], target: [0, 0.2, 0] },
    ect: { pos: [-3.6, 2.8, 2.6], target: [0, 0.2, 0] },
  };
  const v = cam[p.mode];
  return (
    <Stage className="h-full w-full" camera={v.pos} inView={p.inView} active={false} wakeKey={`${p.mode}-${p.plane}-${p.u}-${p.placement}-${p.firing}`} onReady={p.onReady} minDistance={2.2} maxDistance={9}>
      <CameraRig flyKey={p.mode} pos={v.pos} target={v.target} fitAspect={1.3} />
      <Scene {...p} />
    </Stage>
  );
}
export default React.memo(BrainSlicer3D);

/** The cut plane in 3D space (x = minus front, y up, z left). Keeps the part on the far side of the slice. */
function cutPlane(plane: SlicerViewProps["plane"], u: number) {
  if (plane === "axial") return new THREE.Plane(new THREE.Vector3(0, -1, 0), u); // keep below the slice
  if (plane === "coronal") return new THREE.Plane(new THREE.Vector3(1, 0, 0), u); // keep behind the slice (x = -a)
  return new THREE.Plane(new THREE.Vector3(0, 0, -1), u); // keep the right of the slice
}

function Mat({ color, clip, opacity = 1 }: { color: string; clip: THREE.Plane[] | null; opacity?: number }) {
  return <meshStandardMaterial key={`${clip ? "c" : "n"}-${opacity < 1}`} color={color} roughness={0.6} clippingPlanes={clip} side={clip ? THREE.DoubleSide : THREE.FrontSide} transparent={opacity < 1} opacity={opacity} depthWrite={opacity >= 1} />;
}

function Scene({ mode, plane, u, placement, firing, colors }: SlicerViewProps) {
  const q = useQuality();
  const left = React.useMemo(() => buildHemisphere(true, q), [q]);
  const right = React.useMemo(() => buildHemisphere(false, q), [q]);
  const cb = React.useMemo(() => buildCerebellum(q), [q]);
  React.useEffect(() => () => {
    left.forEach((g) => g.dispose());
    right.forEach((g) => g.dispose());
    cb.dispose();
  }, [left, right, cb]);
  const clip = React.useMemo(() => (mode === "slice" ? [cutPlane(plane, u)] : null), [mode, plane, u]);
  const cortexOp = mode === "slice" ? 1 : 0.9;
  const deepBlobs = React.useMemo(() => (Object.keys(BLOBS) as RegionId[]).flatMap((id) => BLOBS[id]!.flatMap((b) => (b.mirror ? [1, -1] : [1]).map((m) => ({ id, c: to3([b.c[0], b.c[1], b.c[2] * m]), r: b.r })))), []);
  const deepTubes = React.useMemo(() => (Object.keys(TUBES) as RegionId[]).flatMap((id) => TUBES[id]!.flatMap((t) => (t.mirror ? [1, -1] : [1]).map((m) => ({ id, pts: sampleCurve(t.pts.map((pt) => to3([pt[0], pt[1], pt[2] * m])), 6), r: t.r })))), []);
  return (
    <group>
      {[...left.entries(), ...right.entries()].map(([id, g], k) => (
        <mesh key={`${k}-${id}`} geometry={g}>
          <Mat color={REGION_COLOR[id]} clip={clip} opacity={cortexOp} />
        </mesh>
      ))}
      <mesh geometry={cb} position={to3(CEREBELLUM.c)}>
        <Mat color={REGION_COLOR.cerebellum} clip={clip} />
      </mesh>
      {deepBlobs.map((b, k) => (
        <mesh key={k} position={b.c} scale={b.r}>
          <sphereGeometry args={[1, segs(18, q), segs(12, q)]} />
          <Mat color={REGION_COLOR[b.id]} clip={clip} />
        </mesh>
      ))}
      {deepTubes.map((t, k) => (
        <group key={k} scale={t.id === "corpus-callosum" ? [1, 0.6, 2.2] : 1}>
          <Tube pts={t.pts} radius={t.r} color={REGION_COLOR[t.id]} segments={24} radial={8} clip={clip} />
        </group>
      ))}
      {mode === "slice" ? <SlicePlane plane={plane} u={u} color={colors.brand} /> : <HeadGlass />}
      {mode === "tms" ? <Coil firing={firing} color={colors.brand} glow={colors.primary} /> : null}
      {mode === "ect" ? <Electrodes placement={placement} color={colors.danger} /> : null}
    </group>
  );
}

function SlicePlane({ plane, u, color }: { plane: SlicerViewProps["plane"]; u: number; color: string }) {
  const rot: [number, number, number] = plane === "axial" ? [-Math.PI / 2, 0, 0] : plane === "coronal" ? [0, Math.PI / 2, 0] : [0, 0, 0];
  const pos: V3 = plane === "axial" ? [0, u, 0] : plane === "coronal" ? [-u, 0, 0] : [0, 0, u];
  const size: [number, number] = plane === "axial" ? [3.8, 2.4] : plane === "coronal" ? [2.4, 3.0] : [3.8, 3.0];
  return (
    <group position={pos} rotation={rot}>
      <mesh>
        <planeGeometry args={size} />
        <meshBasicMaterial color={color} transparent opacity={0.16} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(...size)]} />
        <lineBasicMaterial color={color} />
      </lineSegments>
    </group>
  );
}

function HeadGlass() {
  return (
    <mesh position={to3(HEAD.c)} scale={HEAD.r}>
      <sphereGeometry args={[1, 32, 24]} />
      <meshStandardMaterial color="#e9cdb4" transparent opacity={0.18} depthWrite={false} roughness={0.8} />
    </mesh>
  );
}

/** A figure-of-eight coil resting on the scalp over the left DLPFC, with pulses and the network it reaches. */
function Coil({ firing, color, glow }: { firing: number; color: string; glow: string }) {
  const at = React.useMemo(() => to3(onScalp(DLPFC, 1.06)), []);
  const quat = React.useMemo(() => {
    const n = new THREE.Vector3(...at).sub(new THREE.Vector3(...to3(HEAD.c))).normalize();
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
  }, [at]);
  const spot = React.useRef<THREE.MeshBasicMaterial>(null);
  const ring = React.useRef<THREE.Mesh>(null);
  const t0 = React.useRef({ id: -1, t: 0 });
  const link = React.useMemo(() => sampleCurve([to3(DLPFC), to3([0.85, 0.3, 0.3]), to3(SGACC)], 8), []);
  const invalidate = useThree((st) => st.invalidate);
  useFrame(() => {
    const now = performance.now();
    if (t0.current.id !== firing) t0.current = { id: firing, t: now };
    const k = firing ? (now - t0.current.t) / 1000 : 99;
    const live = k < 4;
    if (live) invalidate(); // keep drawing only while the pulse train runs
    if (spot.current) spot.current.opacity = live ? 0.45 + 0.4 * Math.abs(Math.sin(k * 10 * Math.PI)) : 0.25;
    if (ring.current) {
      ring.current.visible = live;
      const f = (k * 2) % 1;
      ring.current.scale.setScalar(0.4 + f * 1.2);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - f);
    }
  });
  return (
    <group>
      <group position={at} quaternion={quat}>
        {[-0.2, 0.2].map((x) => (
          <mesh key={x} position={[x, 0, 0]}>
            <torusGeometry args={[0.19, 0.045, 10, 32]} />
            <meshStandardMaterial color={color} roughness={0.4} />
          </mesh>
        ))}
        <mesh ref={ring} position={[0, 0, -0.1]} visible={false}>
          <ringGeometry args={[0.2, 0.3, 32]} />
          <meshBasicMaterial color={glow} transparent opacity={0.5} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>
      <mesh position={to3(DLPFC)}>
        <sphereGeometry args={[0.2, 16, 12]} />
        <meshBasicMaterial ref={spot} color={glow} transparent opacity={0.25} depthWrite={false} />
      </mesh>
      <Tube pts={link} radius={0.02} color={glow} opacity={0.01} lit={firing ? 1 : 0} litColor={glow} xray />
      <mesh position={to3(SGACC)}>
        <sphereGeometry args={[0.07, 12, 10]} />
        <meshBasicMaterial color={glow} />
      </mesh>
    </group>
  );
}

/** Two electrodes on the scalp, the current between them, and the seizure spreading through both hemispheres. */
function Electrodes({ placement, color }: { placement: SlicerViewProps["placement"]; color: string }) {
  const [e0, e1] = ELECTRODES[placement];
  const path = React.useMemo(() => {
    const mid: V3 = placement === "rul" ? [0.35, 0.55, -0.55] : placement === "bf" ? [1.25, 0.6, 0] : [0.65, 0.05, 0];
    return sampleCurve([to3(e0), to3(mid), to3(e1)], 12);
  }, [placement, e0, e1]);
  return (
    <group>
      {[e0, e1].map((e, k) => {
        const at = to3(onScalp(e, 1.02));
        const n = new THREE.Vector3(...at).sub(new THREE.Vector3(...to3(HEAD.c))).normalize();
        const qq = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
        return (
          <mesh key={k} position={at} quaternion={qq}>
            <cylinderGeometry args={[0.16, 0.16, 0.05, 24]} />
            <meshStandardMaterial color={color} roughness={0.35} metalness={0.3} />
          </mesh>
        );
      })}
      <Tube pts={path} radius={0.05} color={color} opacity={0.01} lit={1} litColor={color} xray />
      <mesh position={to3(placement === "rul" ? [0.2, 0.4, -0.5] : placement === "bf" ? [1.2, 0.45, 0] : [0.6, 0, 0])} scale={1}>
        <sphereGeometry args={[placement === "rul" ? 0.45 : 0.55, 20, 14]} />
        <meshBasicMaterial color={color} transparent opacity={0.16} depthWrite={false} />
      </mesh>
    </group>
  );
}
