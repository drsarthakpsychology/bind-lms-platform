import type { ReactNode } from "react";
import type { FigureDef, FigureUid } from "../types";
import { C, LateralBrain, Note, Shade, Solid, ell, sm } from "./kit";

/*
 * The head: EEG 10-20 electrode positions, rTMS coil placement, ECT electrode
 * placements, and the embryonic brain vesicles.
 * References checked: OpenStax Psychology 2e, 4.1 (EEG and sleep); the
 * international 10-20 system as described on the Wikipedia page "10-20 system
 * (EEG)" (nasion to inion and ear to ear divided into 10, 20, 20, 20, 20 and
 * 10 percent steps; odd numbers on the left, even on the right, z on the
 * midline; T3 and T4 are called T7 and T8 in the newer 10-10 naming);
 * Kaplan and Sadock ECT section (local copy, lines on electrode placement:
 * bifrontotemporal, bifrontal and right unilateral d'Elia with one electrode
 * at the right frontotemporal position and one just right of the vertex; right
 * unilateral needs about six times the seizure threshold); rTMS for depression
 * over the left dorsolateral prefrontal cortex, located 5 cm in front of the
 * motor hotspot or at F3 (Beam F3 method), as summarised in Kaplan and Sadock
 * (grep "transcranial magnetic"); OpenStax Anatomy and Physiology 2e, 13.1
 * "The Embryologic Perspective" (three and five vesicle stages and their adult
 * derivatives).
 */

const R = 200;
const HX = 260;
const HY = 270;
const P = (x: number, y: number) => [HX + x * R, HY + y * R] as const;
const E: [string, number, number][] = [
  ["Fp1", -0.247, -0.761], ["Fp2", 0.247, -0.761],
  ["F7", -0.647, -0.47], ["F3", -0.324, -0.435], ["Fz", 0, -0.4], ["F4", 0.324, -0.435], ["F8", 0.647, -0.47],
  ["T3", -0.8, 0], ["C3", -0.4, 0], ["Cz", 0, 0], ["C4", 0.4, 0], ["T4", 0.8, 0],
  ["T5", -0.647, 0.47], ["P3", -0.324, 0.435], ["Pz", 0, 0.4], ["P4", 0.324, 0.435], ["T6", 0.647, 0.47],
  ["O1", -0.247, 0.761], ["O2", 0.247, 0.761],
];
const at = (name: string) => {
  const e = E.find((x) => x[0] === name) as [string, number, number];
  const [x, y] = P(e[1], e[2]);
  return { x: Math.round(x), y: Math.round(y) + 16 };
};
const PART: Record<string, string> = { Fp1: "fp", Fp2: "fp", F7: "f", F3: "f3", Fz: "z", F4: "f", F8: "f", T3: "t", T4: "t", C3: "c", Cz: "z", C4: "c", T5: "t", T6: "t", P3: "p", Pz: "z", P4: "p", O1: "o", O2: "o" };

export const eeg1020: FigureDef = {
  id: "eeg-1020",
  title: "EEG electrode positions: the 10-20 system",
  viewBox: "20 30 480 480",
  summary: "The head seen from above, nose at the top, with the 19 standard EEG electrodes of the 10-20 system named by brain region and side, and the ear reference points.",
  art: (u) => (
    <g>
      <Shade u={u} />
      <path d={`M${HX - 26} ${HY - R + 6} L${HX} ${HY - R - 34} L${HX + 26} ${HY - R + 6} Z`} fill={C.t1} stroke={C.ink} strokeWidth={2} data-part="nasion" />
      <path d={sm(ell(HX - R - 8, HY, 16, 34, 10))} fill={C.t1} stroke={C.ink} strokeWidth={2} data-part="ear" />
      <path d={sm(ell(HX + R + 8, HY, 16, 34, 10))} fill={C.t1} stroke={C.ink} strokeWidth={2} data-part="ear" />
      <circle cx={HX} cy={HY} r={R} fill={C.t1} stroke={C.ink} strokeWidth={2.4} />
      <circle cx={HX} cy={HY} r={R} fill={`url(#${u("round")})`} />
      <circle cx={HX} cy={HY} r={R * 0.8} fill="none" stroke={C.ink} strokeOpacity={0.35} strokeDasharray="5 5" />
      <path d={`M${HX} ${HY - R} V${HY + R} M${HX - R} ${HY} H${HX + R}`} stroke={C.ink} strokeOpacity={0.35} strokeDasharray="5 5" data-line="steps" />
      {E.map(([n, x, y]) => {
        const [cx, cy] = P(x, y);
        return (
          <g key={n}>
            <circle cx={cx} cy={cy} r={19} fill={n === "F3" ? C.hiSoft : n.endsWith("z") ? C.blueSoft : C.paper} stroke={C.ink} strokeWidth={1.8} data-part={PART[n]} />
            <text x={cx} y={cy + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink} pointerEvents="none">
              {n}
            </text>
          </g>
        );
      })}
      {[["A1", HX - R - 8], ["A2", HX + R + 8]].map(([n, x]) => (
        <text key={n} x={x as number} y={HY + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink} pointerEvents="none">
          {n}
        </text>
      ))}
      <Note x={HX} y={HY + R + 26} size={14}>Inion (back of the head)</Note>
      <Note x={70} y={60} anchor="start" size={14}>Left</Note>
      <Note x={450} y={60} anchor="end" size={14}>Right</Note>
    </g>
  ),
  labels: [
    { id: "nasion", name: "Nasion", x: HX, y: HY - R - 12, about: "The dip between the eyes at the top of the nose, the front landmark for measuring." },
    { id: "steps", name: "10 and 20 per cent steps", x: HX, y: HY - R * 0.2, about: "The nasion to inion and ear to ear distances are split into steps of 10, 20, 20, 20, 20 and 10 per cent, so the electrodes fit any head size." },
    { id: "fp", name: "Fp: frontopolar", ...at("Fp1"), about: "Over the front of the frontal lobes; eye blinks and eye movements show up strongly here." },
    { id: "f", name: "F: frontal", ...at("F7"), about: "Over the frontal lobes; F7 and F8 sit over the front of the temporal lobes too." },
    { id: "f3", name: "F3: left frontal", ...at("F3"), about: "Over the left dorsolateral prefrontal cortex; used to place the rTMS coil for depression (the Beam F3 method)." },
    { id: "z", name: "z: midline", ...at("Cz"), about: "Electrodes on the midline end in z for zero. Cz, the vertex, is the centre point of the head." },
    { id: "c", name: "C: central", ...at("C3"), about: "Over the motor and sensory strips; sleep spindles and mu rhythm are seen here." },
    { id: "t", name: "T: temporal", ...at("T3"), about: "Over the temporal lobes (T3 and T4 are now often called T7 and T8). Temporal spikes suggest temporal lobe epilepsy." },
    { id: "p", name: "P: parietal", ...at("P3"), about: "Over the parietal lobes." },
    { id: "o", name: "O: occipital", ...at("O1"), about: "Over the visual cortex, where the alpha rhythm of relaxed waking with eyes closed is strongest." },
    { id: "ear", name: "A1, A2: ear references", x: HX - R - 8, y: HY + 26, about: "Electrodes on the ear lobes used as a reference. Odd numbers are always on the left, even numbers on the right." },
  ],
};

/* ---- A head from the left side, with the brain inside ---- */
const HEAD = sm([[330, 40], [430, 60], [510, 120], [540, 220], [520, 320], [480, 390], [440, 430], [430, 470], [300, 470], [290, 420], [230, 396], [180, 384], [150, 360], [138, 330], [128, 312], [120, 296], [114, 278], [94, 262], [92, 250], [118, 228], [124, 200], [130, 160], [170, 90], [240, 50]], true);
const BS = 0.62;
const bx = (x: number) => Math.round(150 + x * BS);
const by = (y: number) => Math.round(36 + y * BS);

function SideHead({ u }: { u: FigureUid }) {
  return (
    <g>
      <Solid d={HEAD} fill={C.t1} u={u} part="scalp" />
      <g transform={`translate(150 36) scale(${BS})`} opacity={0.9}>
        <LateralBrain u={u} />
      </g>
    </g>
  );
}

export const tms: FigureDef = {
  id: "tms",
  title: "rTMS for depression: where the coil goes",
  viewBox: "60 0 520 480",
  summary: "A head from the left side with the brain inside, the figure-of-eight coil over the left dorsolateral prefrontal cortex, the motor hotspot used to set the dose, the 5 cm rule, and the shallow field the coil induces in the cortex.",
  art: (u) => {
    const dl = { x: bx(166), y: by(128) };
    const mh = { x: bx(306), y: by(96) };
    return (
      <g>
        <SideHead u={u} />
        <path d={sm(ell(dl.x, dl.y + 6, 36, 22, 12, -0.5))} fill={C.hi} fillOpacity={0.55} stroke={C.ink} strokeWidth={1.4} data-part="dlpfc" />
        <path d={sm(ell(dl.x, dl.y + 4, 14, 9, 10, -0.5))} fill={C.line} fillOpacity={0.6} data-part="field" />
        <g transform={`translate(${dl.x - 30} ${dl.y - 60}) rotate(-32)`}>
          <ellipse cx={-26} cy={0} rx={30} ry={12} fill={C.blueSoft} stroke={C.ink} strokeWidth={2.4} data-part="coil" />
          <ellipse cx={26} cy={0} rx={30} ry={12} fill={C.blueSoft} stroke={C.ink} strokeWidth={2.4} data-part="coil" />
          <path d="M0 -6 L0 -40" stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
        </g>
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${dl.x - 40 + i * 6} ${dl.y - 44 + i * 4} C${dl.x - 30} ${dl.y - 10 + i * 6} ${dl.x + 10} ${dl.y - 10 + i * 6} ${dl.x + 20 - i * 6} ${dl.y - 44 + i * 4}`} stroke={C.line} strokeWidth={1.8} strokeDasharray="4 4" fill="none" data-line="field" />
        ))}
        <circle cx={mh.x} cy={mh.y} r={9} fill={C.blueMid} stroke={C.ink} strokeWidth={1.6} data-part="hotspot" />
        <path d={`M${mh.x} ${mh.y - 40} L${dl.x + 14} ${dl.y - 72}`} stroke={C.ink} strokeWidth={2} markerEnd={`url(#${u("arrowInk")})`} markerStart={`url(#${u("arrowInk")})`} data-line="rule" />
        <Note x={(mh.x + dl.x) / 2 + 20} y={(mh.y + dl.y) / 2 - 70} size={13}>5 cm</Note>
      </g>
    );
  },
  labels: [
    { id: "coil", name: "Figure-of-eight coil", x: bx(166) - 52, y: by(128) - 46, about: "Two loops carrying a strong, brief current side by side; the magnetic field is strongest under the centre where they meet." },
    { id: "field", name: "Induced current", x: bx(166), y: by(128) + 4, about: "The changing magnetic field passes painlessly through the skull and induces a small electric current in the cortex 2 to 3 centimetres deep, firing neurons there." },
    { id: "dlpfc", name: "Left dorsolateral PFC", x: bx(166) + 26, y: by(128) + 10, about: "The usual target for depression: high-frequency pulses here are thought to boost an underactive region and, through its links, to calm the overactive subgenual cingulate." },
    { id: "hotspot", name: "Motor hotspot", x: bx(306), y: by(96), about: "The spot over the motor cortex where a single pulse makes the right thumb twitch. The weakest pulse that does this (the motor threshold) sets the treatment dose." },
    { id: "rule", name: "5 cm rule or F3", x: bx(236), y: by(40), about: "The coil is moved about 5 centimetres forward from the motor hotspot, or placed at the F3 EEG position, which is more reliable for different head sizes." },
    { id: "scalp", name: "Scalp and skull", x: 470, y: 330, about: "The field passes without anaesthesia; the main side effects are scalp discomfort and headache, with a very small risk of seizure." },
  ],
};

/* ---- ECT placements, three top views ---- */
function TopHead({ cx, children }: { cx: number; children?: ReactNode }) {
  return (
    <g>
      <path d={`M${cx - 14} 52 L${cx} 30 L${cx + 14} 52 Z`} fill={C.t1} stroke={C.ink} strokeWidth={1.8} />
      <ellipse cx={cx - 98} cy={150} rx={9} ry={20} fill={C.t1} stroke={C.ink} strokeWidth={1.8} />
      <ellipse cx={cx + 98} cy={150} rx={9} ry={20} fill={C.t1} stroke={C.ink} strokeWidth={1.8} />
      <ellipse cx={cx} cy={150} rx={92} ry={104} fill={C.t1} stroke={C.ink} strokeWidth={2.2} />
      <path d={`M${cx} 46 V254`} stroke={C.ink} strokeOpacity={0.2} strokeDasharray="4 4" />
      {children}
    </g>
  );
}
const Pad = ({ x, y, part }: { x: number; y: number; part: string }) => <circle cx={x} cy={y} r={11} fill={C.hi} stroke={C.ink} strokeWidth={2} data-part={part} />;

export const ectPlacements: FigureDef = {
  id: "ect-placements",
  title: "ECT electrode placements",
  viewBox: "0 10 720 290",
  summary: "Three heads seen from above, nose at the top, showing bitemporal, bifrontal and right unilateral (d'Elia) ECT electrode positions and the main path of the current between them.",
  art: () => (
    <g>
      <TopHead cx={120}>
        <path d="M36 120 C80 100 160 100 204 120 C160 170 80 170 36 120 Z" fill={C.blueSoft} fillOpacity={0.8} data-part="btpath" />
        <Pad x={34} y={118} part="bt" />
        <Pad x={206} y={118} part="bt" />
      </TopHead>
      <TopHead cx={360}>
        <path d="M318 66 C340 90 380 90 402 66 C390 100 330 100 318 66 Z" fill={C.blueSoft} fillOpacity={0.8} data-part="bfpath" />
        <Pad x={316} y={66} part="bf" />
        <Pad x={404} y={66} part="bf" />
      </TopHead>
      <TopHead cx={600}>
        <path d="M688 118 C680 90 650 80 620 112 C640 130 670 136 688 118 Z" fill={C.blueSoft} fillOpacity={0.8} data-part="rulpath" />
        <Pad x={688} y={118} part="rultemp" />
        <Pad x={618} y={140} part="rulvertex" />
      </TopHead>
      <Note x={120} y={286} size={14}>Bitemporal</Note>
      <Note x={360} y={286} size={14}>Bifrontal</Note>
      <Note x={600} y={286} size={14}>Right unilateral</Note>
    </g>
  ),
  labels: [
    { id: "bt", name: "Bitemporal electrodes", x: 34, y: 118, about: "One on each temple, about 2.5 centimetres above the midpoint of a line from the outer corner of the eye to the ear. The fastest and most reliable placement, used when speed matters (severe suicidality, catatonia, not eating)." },
    { id: "btpath", name: "Bitemporal current path", x: 120, y: 132, about: "The current crosses both temporal lobes, so memory side effects are greatest with this placement." },
    { id: "bf", name: "Bifrontal electrodes", x: 404, y: 66, about: "About 5 centimetres above the outer corner of each eye socket. About as effective as bitemporal, with the current kept further from the temporal lobes." },
    { id: "bfpath", name: "Bifrontal current path", x: 360, y: 84, about: "The current runs mainly through the frontal lobes; the seizure threshold tends to be higher." },
    { id: "rultemp", name: "Right temple electrode", x: 688, y: 118, about: "For right unilateral (d'Elia) ECT one electrode sits at the same right temple position as bitemporal ECT." },
    { id: "rulvertex", name: "Right of the vertex", x: 618, y: 140, about: "The second electrode sits just to the right of the top of the head, keeping the current in the non-dominant hemisphere." },
    { id: "rulpath", name: "Right unilateral path", x: 656, y: 112, about: "Spares the language hemisphere, so causes the least memory loss, but needs a dose about six times the seizure threshold to work as well as bilateral ECT." },
  ],
};

/* ---- Embryonic brain vesicles ---- */
export const brainVesicles: FigureDef = {
  id: "brain-vesicles",
  title: "How the brain develops from the neural tube",
  viewBox: "40 20 520 420",
  summary: "The neural tube seen from the back at the three-vesicle stage (forebrain, midbrain, hindbrain) and the five-vesicle stage (telencephalon, diencephalon, mesencephalon, metencephalon, myelencephalon), with the fluid space inside that becomes the ventricles.",
  art: (u) => (
    <g>
      <Shade u={u} />
      {/* Three vesicles */}
      <path d="M136 300 L136 430 L164 430 L164 300 Z" fill={C.t2} stroke={C.ink} strokeWidth={1.8} data-part="tube" />
      <Solid d={sm(ell(150, 250, 44, 52, 14))} fill={C.t2} u={u} part="rhomb" />
      <Solid d={sm(ell(150, 172, 34, 30, 14))} fill={C.hiSoft} u={u} part="mes3" />
      <Solid d={sm(ell(150, 94, 50, 48, 14))} fill={C.blueSoft} u={u} part="pros" />
      <path d={`M150 70 C140 100 140 140 150 172 C142 210 140 250 150 300 L150 430`} stroke={C.blue} strokeWidth={6} fill="none" opacity={0.6} />
      <Note x={150} y={34} size={14}>3 vesicles</Note>
      {/* Arrow */}
      <path d="M220 230 H300" stroke={C.ink} strokeWidth={2} markerEnd={`url(#${u("arrowInk")})`} />
      {/* Five vesicles */}
      <path d="M386 340 L386 430 L414 430 L414 340 Z" fill={C.t2} stroke={C.ink} strokeWidth={1.8} />
      <Solid d={sm(ell(400, 312, 32, 30, 14))} fill={C.t2} u={u} part="myel" />
      <Solid d={sm(ell(400, 252, 42, 30, 14))} fill={C.t3} u={u} part="meten" />
      <Solid d={sm(ell(400, 192, 32, 26, 14))} fill={C.hiSoft} u={u} part="mes5" />
      <Solid d={sm(ell(400, 136, 34, 26, 14))} fill={C.blueMid} u={u} part="dien" />
      <Solid d={sm(ell(346, 132, 16, 12, 10))} fill={C.blueMid} u={u} part="optic" />
      <Solid d={sm(ell(454, 132, 16, 12, 10))} fill={C.blueMid} u={u} part="optic" />
      <Solid d={sm(ell(366, 80, 40, 36, 14, -0.3))} fill={C.blueSoft} u={u} part="telen" />
      <Solid d={sm(ell(434, 80, 40, 36, 14, 0.3))} fill={C.blueSoft} u={u} part="telen" />
      <g fill="none" stroke={C.blue} strokeWidth={6} opacity={0.6} strokeLinecap="round" data-line="lumen">
        <path d="M366 70 C380 100 396 120 400 136 C404 120 420 100 434 70" data-line="lumen" />
        <path d="M400 136 L400 192 C396 230 396 260 400 312 L400 430" data-line="lumen" />
      </g>
      <Note x={400} y={34} size={14}>5 vesicles</Note>
    </g>
  ),
  labels: [
    { id: "pros", name: "Prosencephalon (forebrain)", x: 150, y: 90, about: "The front vesicle, which splits into the telencephalon and diencephalon. Failure to divide into two halves causes holoprosencephaly." },
    { id: "mes3", name: "Mesencephalon (midbrain)", x: 150, y: 172, about: "Stays undivided and becomes the midbrain." },
    { id: "rhomb", name: "Rhombencephalon (hindbrain)", x: 150, y: 256, about: "Splits into the metencephalon and myelencephalon." },
    { id: "tube", name: "Neural tube", x: 150, y: 380, about: "Closes in the fourth week of pregnancy; failure causes spina bifida or anencephaly, made less likely by folic acid. Valproate in pregnancy raises the risk." },
    { id: "telen", name: "Telencephalon", x: 434, y: 76, about: "Becomes the cerebral hemispheres: cortex, basal ganglia, hippocampus and amygdala. Neurons migrate out to the cortex here; errors in migration and pruning are thought to set the stage for schizophrenia and autism." },
    { id: "optic", name: "Optic vesicle", x: 454, y: 132, about: "Grows out of the diencephalon to form the retina, which is why the retina is part of the brain." },
    { id: "dien", name: "Diencephalon", x: 400, y: 136, about: "Becomes the thalamus, hypothalamus, epithalamus with the pineal, and the posterior pituitary." },
    { id: "mes5", name: "Mesencephalon", x: 400, y: 192, about: "The midbrain, with the substantia nigra, ventral tegmental area and colliculi." },
    { id: "meten", name: "Metencephalon", x: 400, y: 252, about: "Becomes the pons and cerebellum." },
    { id: "myel", name: "Myelencephalon", x: 400, y: 314, about: "Becomes the medulla." },
    { id: "lumen", name: "Fluid space", x: 400, y: 380, about: "The hollow inside the tube becomes the ventricles: lateral ventricles in the hemispheres, third in the diencephalon, aqueduct in the midbrain, fourth in the hindbrain, and the central canal of the cord." },
  ],
};

