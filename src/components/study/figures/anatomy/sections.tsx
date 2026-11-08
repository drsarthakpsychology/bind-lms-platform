import type { ReactNode } from "react";
import type { FigureDef } from "../types";
import { C, Groove, LAT, LateralBrain, Mirror, Note, Shade, ell, folded, poly, sm, tube } from "./kit";
import type { FigureUid } from "../types";

/*
 * Brain sections: a coronal cut through the basal ganglia and thalamus.
 * References checked: Bear, Connors and Paradiso "guide to human neuroanatomy"
 * coronal sections (local copy); OpenStax Anatomy and Physiology 2e, 13.2
 * (basal nuclei figure: caudate, putamen, globus pallidus, internal capsule);
 * Radiopaedia "Internal capsule" and "Claustrum" articles (order from the
 * midline outwards: thalamus, internal capsule, globus pallidus, putamen,
 * external capsule, claustrum, extreme capsule, insula).
 */

const top = folded(
  [[296, 124], [296, 72], [291, 50], [278, 38], [250, 32], [190, 40], [130, 64], [84, 104], [56, 150], [48, 196], [56, 214]],
  { every: 36, depth: 26, thick: 13, side: 1 },
);
const bottom = folded(
  [[58, 258], [46, 296], [54, 336], [84, 370], [134, 388], [184, 382], [212, 362], [228, 338]],
  { every: 34, depth: 22, thick: 13, side: 1 },
);
const sulcusOuter = [[64, 222], [96, 226], [118, 228], [126, 240], [118, 250], [96, 252], [64, 254]];
const sulcusInner = [[112, 214], [134, 222], [138, 240], [134, 258], [112, 266]];
const closing = [[236, 316], [262, 306], [284, 312], [296, 314]];

/** One hemisphere of the coronal slice (left half; mirrored for the right). */
export const CORONAL = {
  outer: poly([...top.outer, ...sulcusOuter, ...bottom.outer, ...closing], true),
  inner: poly([...top.inner, ...sulcusInner, ...bottom.inner, [220, 320], [250, 300], [284, 304], [296, 300], [296, 150]], true),
  peduncle: sm([[262, 306], [270, 340], [284, 372], [300, 380]]) + " L300 306 Z",
  ventricle: tube([[294, 150], [270, 148], [248, 152], [230, 160]], [8, 12, 12, 8]),
  caudate: sm(ell(226, 170, 14, 11, 10, -0.4)),
  thalamus: sm([[292, 186], [292, 260], [270, 268], [238, 258], [220, 230], [226, 198], [252, 184]], true),
  pallidus: sm([[200, 196], [210, 232], [200, 270], [180, 250], [178, 216]], true),
  putamen: sm([[166, 178], [180, 214], [178, 262], [160, 292], [144, 262], [142, 214], [150, 186]], true),
  claustrum: tube([[128, 190], [124, 232], [124, 278]], 5),
  stn: sm(ell(240, 284, 15, 6, 10, 0.35)),
  nigra: sm(ell(262, 300, 16, 5, 10, 0.25)),
  horn: tube([[166, 306], [190, 300], [212, 306]], 7),
  hippocampus: sm(ell(194, 322, 20, 12, 10)),
  fornix: sm(ell(292, 180, 6, 5, 8)),
};

export const coronalSection: FigureDef = {
  id: "coronal-section",
  title: "A coronal slice through the basal ganglia and thalamus",
  viewBox: "30 20 540 390",
  summary: "A front-to-back cut through the middle of the brain showing grey and white matter, the corpus callosum, ventricles, thalamus, caudate, putamen, globus pallidus, internal capsule, insula and hippocampus.",
  art: (u) => (
    <g>
      <Shade u={u} />
      <Mirror cx={300}>
        <path d={CORONAL.outer} fill={C.t3} stroke={C.ink} strokeWidth={2} data-part="grey" />
        <path d={CORONAL.inner} fill={C.paper} stroke={C.ink} strokeOpacity={0.35} strokeWidth={1} data-part="white" />
        <path d={CORONAL.peduncle} fill={C.t2} stroke={C.ink} strokeWidth={1.6} />
        <path d={CORONAL.claustrum} fill={C.t3} stroke={C.ink} strokeWidth={1} data-part="claustrum" />
        <path d={CORONAL.putamen} fill={C.t3} stroke={C.ink} strokeWidth={1.6} data-part="putamen" />
        <path d={CORONAL.pallidus} fill={C.t2} stroke={C.ink} strokeWidth={1.6} data-part="pallidus" />
        <path d={CORONAL.thalamus} fill={C.t3} stroke={C.ink} strokeWidth={1.6} data-part="thalamus" />
        <path d={CORONAL.ventricle} fill={C.blueSoft} stroke={C.ink} strokeWidth={1.4} data-part="ventricle" />
        <path d={CORONAL.caudate} fill={C.t3} stroke={C.ink} strokeWidth={1.4} data-part="caudate" />
        <path d={CORONAL.stn} fill={C.t4} stroke={C.ink} strokeWidth={1.2} data-part="stn" />
        <path d={CORONAL.nigra} fill={C.ink} fillOpacity={0.7} stroke={C.ink} strokeWidth={1} data-part="nigra" />
        <path d={CORONAL.horn} fill={C.blueSoft} stroke={C.ink} strokeWidth={1.2} data-part="horn" />
        <path d={CORONAL.hippocampus} fill={C.t3} stroke={C.ink} strokeWidth={1.4} data-part="hippocampus" />
        <path d={CORONAL.fornix} fill={C.paper} stroke={C.ink} strokeWidth={1.2} data-part="fornix" />
      </Mirror>
      <path d={tube([[178, 168], [230, 142], [300, 132], [370, 142], [422, 168]], [10, 16, 18, 16, 10])} fill={C.paper} stroke={C.ink} strokeWidth={1.8} data-part="cc" />
      <path d="M297 150 L297 176 L303 176 L303 150 Z" fill={C.t2} stroke={C.ink} strokeWidth={1} />
      <path d="M296 192 C294 230 294 270 296 304 L304 304 C306 270 306 230 304 192 Z" fill={C.blueSoft} stroke={C.ink} strokeWidth={1.4} data-part="v3" />
      <Note x={300} y={404}>Left side of the brain on the right of the picture, as on a scan</Note>
    </g>
  ),
  labels: [
    { id: "grey", name: "Cortex (grey matter)", x: 120, y: 66, about: "The folded outer layer of nerve cell bodies, 2 to 4 millimetres thick. It thins in Alzheimer's disease and in some people with schizophrenia." },
    { id: "white", name: "White matter", x: 150, y: 120, about: "Bundles of myelinated axons linking regions. Damage from small vessel disease causes slowed thinking and late-life depression." },
    { id: "cc", name: "Corpus callosum", x: 300, y: 134, about: "The bridge of fibres joining the two hemispheres." },
    { id: "ventricle", name: "Lateral ventricle", x: 262, y: 150, about: "A fluid-filled space. Enlarged lateral ventricles are one of the most repeated findings in schizophrenia." },
    { id: "caudate", name: "Caudate nucleus", x: 226, y: 170, about: "Part of the striatum lying in the wall of the lateral ventricle. It shrinks early in Huntington's disease, and is overactive in OCD." },
    { id: "fornix", name: "Fornix", x: 292, y: 180, about: "The paired arch of fibres leaving the hippocampus, cut across under the septum." },
    { id: "thalamus", name: "Thalamus", x: 262, y: 226, about: "The relay for sensation and for loops from the basal ganglia and cerebellum back to the cortex." },
    { id: "v3", name: "Third ventricle", x: 300, y: 250, about: "The narrow midline fluid space between the two thalami, with the hypothalamus in its lower walls." },
    { id: "capsule", name: "Internal capsule", x: 214, y: 210, about: "The white matter between the thalamus and the lentiform nucleus, carrying motor and sensory fibres. A small stroke here weakens the whole opposite side." },
    { id: "pallidus", name: "Globus pallidus", x: 192, y: 234, about: "The pale inner part of the lentiform nucleus and the main output station of the basal ganglia." },
    { id: "putamen", name: "Putamen", x: 160, y: 236, about: "The outer part of the lentiform nucleus and of the striatum, receiving dopamine from the substantia nigra; it controls learned movements and habits." },
    { id: "claustrum", name: "Claustrum", x: 126, y: 210, about: "A thin sheet of grey matter between the putamen and the insula, richly linked with the whole cortex; its role in attention and awareness is still studied." },
    { id: "insula", name: "Insula", x: 124, y: 244, about: "Cortex hidden deep in the lateral sulcus that senses the body's inner state, taste, disgust and craving. It is active in anxiety and addiction." },
    { id: "stn", name: "Subthalamic nucleus", x: 240, y: 284, about: "A small nucleus below the thalamus that brakes movement through the basal ganglia; it is the usual target of deep brain stimulation for Parkinson's disease." },
    { id: "nigra", name: "Substantia nigra", x: 262, y: 300, about: "The dark band of dopamine neurons whose loss causes Parkinson's disease." },
    { id: "hippocampus", name: "Hippocampus", x: 194, y: 322, about: "Curls into the floor of the temporal horn and stores new memories; it shrinks in Alzheimer's disease and in long depression." },
    { id: "horn", name: "Temporal horn", x: 168, y: 306, about: "The part of the lateral ventricle inside the temporal lobe. It widens when the hippocampus shrinks." },
  ],
};

/*
 * Horizontal (axial) slice at the level of the internal capsule.
 * References checked: Radiopaedia "Internal capsule" (anterior limb between
 * caudate head and lentiform nucleus, genu at the foramen of Monro level,
 * posterior limb between thalamus and lentiform nucleus); OpenStax Anatomy and
 * Physiology 2e, 13.2 horizontal section of the basal nuclei.
 */
const hTop = folded([[246, 150], [246, 90], [242, 58], [228, 44], [190, 44], [130, 68], [90, 116], [70, 180], [64, 228]], { every: 36, depth: 24, thick: 13, side: 1 });
const hBottom = folded([[68, 336], [72, 400], [92, 460], [130, 516], [190, 552], [226, 558], [242, 546], [246, 500], [246, 440]], { every: 36, depth: 24, thick: 13, side: 1 });
const H = {
  outer: poly([...hTop.outer, [80, 236], [104, 244], [120, 262], [122, 300], [106, 322], [80, 330], ...hBottom.outer, [246, 150]], true),
  inner: poly([...hTop.inner, [124, 240], [140, 256], [142, 306], [124, 326], ...hBottom.inner, [246, 430], [246, 160]], true),
  horn: tube([[246, 172], [236, 196], [232, 222], [238, 250]], [10, 18, 18, 10]),
  caudate: sm(ell(212, 212, 17, 32, 12, 0.15)),
  putamen: sm([[160, 208], [178, 236], [186, 286], [178, 336], [158, 352], [146, 300], [146, 250]], true),
  pallidus: sm([[186, 244], [210, 270], [188, 322], [182, 286]], true),
  thalamus: sm([[244, 276], [244, 370], [226, 376], [208, 350], [206, 300], [222, 278]], true),
  claustrum: tube([[134, 222], [131, 286], [134, 350]], 5),
  atrium: tube([[226, 390], [214, 420], [218, 460], [228, 496]], [10, 18, 14, 8]),
};

export const horizontalSection: FigureDef = {
  id: "horizontal-section",
  title: "A horizontal slice at the level of the internal capsule",
  viewBox: "40 30 420 540",
  summary: "A slice across the brain seen from above, front at the top, showing the caudate, putamen, globus pallidus, thalamus, the three parts of the internal capsule, the ventricles and the corpus callosum.",
  art: (u) => (
    <g>
      <Shade u={u} />
      <Mirror cx={250}>
        <path d={H.outer} fill={C.t3} stroke={C.ink} strokeWidth={2} data-part="cortex" />
        <path d={H.inner} fill={C.paper} stroke={C.ink} strokeOpacity={0.35} strokeWidth={1} />
        <path d={H.claustrum} fill={C.t3} stroke={C.ink} strokeWidth={1} data-part="claustrum" />
        <path d={H.putamen} fill={C.t3} stroke={C.ink} strokeWidth={1.6} data-part="putamen" />
        <path d={H.pallidus} fill={C.t2} stroke={C.ink} strokeWidth={1.6} data-part="pallidus" />
        <path d={H.thalamus} fill={C.t3} stroke={C.ink} strokeWidth={1.6} data-part="thalamus" />
        <path d={H.caudate} fill={C.t3} stroke={C.ink} strokeWidth={1.6} data-part="caudate" />
        <path d={H.horn} fill={C.blueSoft} stroke={C.ink} strokeWidth={1.4} data-part="horn" />
        <path d={H.atrium} fill={C.blueSoft} stroke={C.ink} strokeWidth={1.4} data-part="atrium" />
      </Mirror>
      <path d={tube([[196, 196], [216, 170], [250, 160], [284, 170], [304, 196]], [10, 18, 20, 18, 10])} fill={C.paper} stroke={C.ink} strokeWidth={1.8} data-part="genu" />
      <path d={tube([[198, 410], [220, 436], [250, 444], [280, 436], [302, 410]], [12, 22, 24, 22, 12])} fill={C.paper} stroke={C.ink} strokeWidth={1.8} data-part="splenium" />
      <path d="M247 180 V250 H253 V180 Z" fill={C.t2} stroke={C.ink} strokeWidth={1} />
      <path d="M247 282 C246 310 246 340 247 368 L253 368 C254 340 254 310 253 282 Z" fill={C.blueSoft} stroke={C.ink} strokeWidth={1.2} data-part="v3" />
      <Note x={250} y={36}>Front</Note>
    </g>
  ),
  labels: [
    { id: "genu", name: "Genu of corpus callosum", x: 250, y: 162, about: "The bent front of the corpus callosum, linking the two frontal lobes." },
    { id: "horn", name: "Frontal horn", x: 236, y: 210, about: "The front part of the lateral ventricle. The caudate head bulges into its outer wall, and flattens in Huntington's disease." },
    { id: "caudate", name: "Head of caudate", x: 210, y: 214, about: "The large front end of the caudate nucleus, part of the striatum, linked with the prefrontal cortex in thinking and in OCD loops." },
    { id: "alic", name: "Anterior limb", x: 196, y: 238, about: "The front limb of the internal capsule, between caudate and lentiform nucleus, carrying frontal and thalamic fibres; it is a target of psychosurgery for severe OCD and depression." },
    { id: "genuic", name: "Genu of capsule", x: 214, y: 268, about: "The bend of the internal capsule, carrying motor fibres for the face." },
    { id: "plic", name: "Posterior limb", x: 198, y: 316, about: "Between thalamus and lentiform nucleus; it carries the motor fibres for the arm and leg and the body sensation fibres. A small stroke here causes a pure weakness of the opposite side." },
    { id: "putamen", name: "Putamen", x: 162, y: 290, about: "The outer part of the lentiform nucleus, the motor part of the striatum." },
    { id: "pallidus", name: "Globus pallidus", x: 192, y: 282, about: "The inner wedge of the lentiform nucleus, output of the basal ganglia." },
    { id: "claustrum", name: "Claustrum", x: 132, y: 270, about: "The thin grey sheet between the external and extreme capsules." },
    { id: "insula", name: "Insula", x: 118, y: 284, about: "Cortex in the depth of the lateral sulcus, for the body's inner state, taste and craving." },
    { id: "thalamus", name: "Thalamus", x: 226, y: 326, about: "The paired relay nuclei either side of the third ventricle." },
    { id: "v3", name: "Third ventricle", x: 250, y: 330, about: "The slit-like midline ventricle between the thalami." },
    { id: "splenium", name: "Splenium of corpus callosum", x: 250, y: 444, about: "The thick back end of the corpus callosum, linking the visual areas of both sides." },
    { id: "atrium", name: "Atrium and occipital horn", x: 218, y: 450, about: "The back of the lateral ventricle, where the choroid plexus often calcifies with age." },
  ],
};

/*
 * The basal ganglia seen from the side inside a see-through brain.
 * References checked: OpenStax Anatomy and Physiology 2e, 13.2 (basal nuclei,
 * lateral view of the C-shaped caudate with head, body and tail ending near
 * the amygdala); Kenhub "Basal ganglia" (nucleus accumbens where caudate head
 * and putamen meet below, striate cell bridges between them).
 */
const CAUD = [[196, 176], [222, 156], [262, 148], [310, 150], [358, 160], [394, 182], [410, 214], [400, 246], [372, 266], [332, 278], [292, 282], [266, 278]];

function ghost(u: FigureUid) {
  return (
    <g opacity={0.45}>
      <LateralBrain u={u} gyri={false} />
    </g>
  );
}

export const basalGanglia3d: FigureDef = {
  id: "basal-ganglia",
  title: "The basal ganglia seen through the side of the brain",
  viewBox: "60 30 510 410",
  summary: "The C-shaped caudate nucleus with head, body and tail, the putamen, globus pallidus, thalamus, nucleus accumbens, amygdala, subthalamic nucleus and substantia nigra inside a see-through brain.",
  art: (u) => (
    <g>
      {ghost(u)}
      <ellipse cx={334} cy={208} rx={50} ry={27} fill={C.t2} fillOpacity={0.6} stroke={C.ink} strokeWidth={1.6} strokeDasharray="6 4" data-part="thalamus" />
      <path d={sm(ell(278, 214, 64, 34, 16, -0.05))} fill={C.t3} stroke={C.ink} strokeWidth={2} data-part="putamen" />
      <path d={sm(ell(292, 218, 32, 20, 12))} fill={C.t2} fillOpacity={0.7} stroke={C.ink} strokeWidth={1.4} strokeDasharray="5 4" data-part="pallidus" />
      {[214, 226, 238, 250, 262].map((x) => (
        <path key={x} d={`M${x} ${182 - (x - 214) * 0.2} L${x + 2} 196`} stroke={C.ink} strokeWidth={3} strokeOpacity={0.6} />
      ))}
      <path d={tube(CAUD, [46, 44, 34, 26, 20, 16, 13, 11, 10, 10, 9, 9])} fill={C.hiSoft} stroke={C.ink} strokeWidth={2} data-part="caudate" />
      <path d={sm(ell(222, 232, 14, 10, 10))} fill={C.blueSoft} stroke={C.ink} strokeWidth={1.6} data-part="accumbens" />
      <path d={sm(ell(254, 282, 17, 13, 10))} fill={C.t3} stroke={C.ink} strokeWidth={1.8} data-part="amygdala" />
      <path d={sm(ell(336, 252, 13, 6, 8, 0.3))} fill={C.t4} stroke={C.ink} strokeWidth={1.4} data-part="stn" />
      <path d={sm(ell(352, 272, 22, 6, 10, 0.5))} fill={C.ink} fillOpacity={0.75} stroke={C.ink} strokeWidth={1} data-part="nigra" />
    </g>
  ),
  labels: [
    { id: "head", name: "Head of caudate", x: 210, y: 172, about: "The bulky front of the caudate, beside the frontal horn. It joins the thinking and emotional loops of the frontal lobe." },
    { id: "body", name: "Body of caudate", x: 330, y: 154, about: "Arches back over the thalamus in the wall of the lateral ventricle." },
    { id: "tail", name: "Tail of caudate", x: 340, y: 276, about: "Curves down and forward into the temporal lobe, ending near the amygdala; the whole nucleus is shaped like a C." },
    { id: "caudate", name: "Caudate nucleus", x: 396, y: 196, about: "With the putamen it forms the striatum, the input station of the basal ganglia. It wastes away in Huntington's disease." },
    { id: "putamen", name: "Putamen", x: 262, y: 222, about: "The large lens-shaped nucleus lateral to the globus pallidus; dopamine loss here causes the slowness and stiffness of Parkinson's disease." },
    { id: "pallidus", name: "Globus pallidus", x: 300, y: 222, about: "Lies medial to the putamen (dashed, hidden behind it) and sends the output of the basal ganglia to the thalamus." },
    { id: "thalamus", name: "Thalamus", x: 360, y: 204, about: "Deep in the middle, inside the curve of the caudate; it passes basal ganglia output back to the cortex." },
    { id: "accumbens", name: "Nucleus accumbens", x: 222, y: 232, about: "Where the caudate head and putamen meet underneath; the reward hub of the ventral striatum, central to addiction." },
    { id: "amygdala", name: "Amygdala", x: 254, y: 284, about: "The almond of fear and emotional memory, at the tip of the caudate tail." },
    { id: "stn", name: "Subthalamic nucleus", x: 336, y: 252, about: "Small nucleus below the thalamus, part of the indirect braking pathway and a deep brain stimulation target." },
    { id: "nigra", name: "Substantia nigra", x: 356, y: 274, about: "In the midbrain; its dopamine cells feed the striatum and die in Parkinson's disease." },
  ],
};

/*
 * The basal ganglia loop drawn on a real coronal slice.
 * References checked: Bear, Connors and Paradiso motor loop description (local
 * copy: cortex to striatum, globus pallidus internal segment to VL thalamus,
 * thalamus back to motor cortex; substantia nigra dopamine to the striatum);
 * Kaplan and Sadock basal ganglia circuitry section (local copy, grep "indirect
 * pathway").
 */
export const basalGangliaCircuit: FigureDef = {
  id: "basal-ganglia-circuit",
  title: "The basal ganglia loop on a coronal slice",
  viewBox: "40 40 290 330",
  summary: "One half of a coronal slice with the cortex, caudate, putamen, both parts of the globus pallidus, thalamus, subthalamic nucleus and substantia nigra, and the direct, indirect, dopamine and thalamus to cortex pathways drawn as arrows.",
  art: (u) => (
    <g>
      <Shade u={u} />
      <path d={CORONAL.outer} fill={C.t3} stroke={C.ink} strokeWidth={2} data-part="cortex" />
      <path d={CORONAL.inner} fill={C.paper} stroke={C.ink} strokeOpacity={0.35} strokeWidth={1} />
      <path d={CORONAL.putamen} fill={C.hiSoft} stroke={C.ink} strokeWidth={1.6} data-part="striatum" />
      <path d={sm([[188, 202], [194, 232], [186, 264], [176, 250], [176, 216]], true)} fill={C.t2} stroke={C.ink} strokeWidth={1.4} data-part="gpe" />
      <path d={sm([[196, 210], [208, 234], [198, 260], [192, 234]], true)} fill={C.t4} stroke={C.ink} strokeWidth={1.4} data-part="gpi" />
      <path d={CORONAL.thalamus} fill={C.t3} stroke={C.ink} strokeWidth={1.6} data-part="thalamus" />
      <path d={CORONAL.ventricle} fill={C.blueSoft} stroke={C.ink} strokeWidth={1.4} />
      <path d={CORONAL.caudate} fill={C.hiSoft} stroke={C.ink} strokeWidth={1.4} data-part="striatum" />
      <path d={CORONAL.stn} fill={C.t4} stroke={C.ink} strokeWidth={1.2} data-part="stn" />
      <path d={CORONAL.nigra} fill={C.ink} fillOpacity={0.7} data-part="snc" />
      <path d={CORONAL.peduncle} fill={C.t2} stroke={C.ink} strokeWidth={1.6} />
      <g fill="none" strokeLinecap="round">
        <path d="M120 84 C136 140 150 186 158 214" stroke={C.ink} strokeWidth={3} markerEnd={`url(#${u("arrowInk")})`} data-line="glu" />
        <path d="M168 226 C176 212 192 204 200 222" stroke={C.line} strokeWidth={3} markerEnd={`url(#${u("arrow")})`} data-line="direct" />
        <path d="M166 262 C170 276 180 274 182 260" stroke={C.line} strokeWidth={3} strokeDasharray="5 4" markerEnd={`url(#${u("arrow")})`} data-line="indirect" />
        <path d="M184 268 C196 292 214 298 228 290" stroke={C.line} strokeWidth={3} strokeDasharray="5 4" markerEnd={`url(#${u("arrow")})`} data-line="indirect" />
        <path d="M246 278 C238 262 222 254 208 250" stroke={C.ink} strokeWidth={2.4} markerEnd={`url(#${u("arrowInk")})`} data-line="stnout" />
        <path d="M206 214 C214 196 230 196 240 206" stroke={C.ink} strokeWidth={3} markerEnd={`url(#${u("arrowInk")})`} data-line="gpiout" />
        <path d="M262 200 C262 150 230 110 176 78" stroke={C.ink} strokeWidth={3} markerEnd={`url(#${u("arrowInk")})`} data-line="tc" />
        <path d="M256 300 C234 320 186 306 168 270" stroke={C.blue} strokeWidth={3.4} markerEnd={`url(#${u("arrow")})`} data-line="da" />
      </g>
    </g>
  ),
  labels: [
    { id: "cortex", name: "Motor cortex", x: 110, y: 74, about: "Sends a plan for movement down to the striatum with glutamate, and receives the loop's answer back from the thalamus." },
    { id: "glu", name: "Cortex to striatum", x: 140, y: 150, about: "Excitatory glutamate input that starts every loop." },
    { id: "striatum", name: "Striatum", x: 160, y: 236, about: "The caudate and putamen, the input station. Its neurons carry D1 receptors (direct pathway) or D2 receptors (indirect pathway)." },
    { id: "direct", name: "Direct pathway", x: 184, y: 210, about: "Striatum to the inner globus pallidus, which releases the thalamus from braking and lets the chosen movement go. Dopamine boosts it through D1 receptors." },
    { id: "gpe", name: "Globus pallidus external", x: 182, y: 240, about: "Relay of the indirect pathway, which normally brakes the subthalamic nucleus." },
    { id: "indirect", name: "Indirect pathway", x: 206, y: 294, about: "Striatum to outer pallidus to subthalamic nucleus, strengthening the brake on unwanted movements. Dopamine damps it through D2 receptors, so D2 blocking antipsychotics cause stiffness and slowness." },
    { id: "gpi", name: "Globus pallidus internal", x: 200, y: 236, about: "The output nucleus. It constantly inhibits the thalamus with GABA unless the direct pathway quiets it." },
    { id: "stn", name: "Subthalamic nucleus", x: 242, y: 284, about: "Excites the inner pallidus to brake movement. Deep brain stimulation here eases Parkinson's disease." },
    { id: "snc", name: "Substantia nigra", x: 264, y: 300, about: "Its compact part sends dopamine to the striatum (the nigrostriatal pathway). Losing it causes Parkinson's disease." },
    { id: "da", name: "Dopamine input", x: 210, y: 314, about: "The nigrostriatal dopamine supply that keeps the two pathways balanced." },
    { id: "thalamus", name: "Thalamus", x: 262, y: 230, about: "The ventral anterior and ventral lateral nuclei pass the loop's result back to the cortex." },
    { id: "tc", name: "Thalamus to cortex", x: 234, y: 130, about: "The return limb of the loop. Parallel loops through other parts of the frontal lobe handle thinking, motivation and emotion." },
  ],
};

/*
 * Motor and sensory homunculus on a coronal strip.
 * References checked: OpenStax Psychology 2e, 3.4 "The Brain and Spinal Cord"
 * (homunculus figure: large hands, lips, face and tongue); OpenStax Anatomy
 * and Physiology 2e, 14.2 (sensory homunculus with genitals on the medial
 * wall and intra-abdominal organs at the lateral end); Penfield's ordering as
 * described in the Bear, Connors and Paradiso somatic sensory chapter.
 */
type Seg = { id: string; parts: [string, number][] };
const MOTOR: Seg[] = [
  { id: "m-leg", parts: [["Toes", 12], ["Ankle", 12], ["Knee", 12], ["Hip", 12]] },
  { id: "m-trunk", parts: [["Trunk", 14], ["Shoulder", 12]] },
  { id: "m-arm", parts: [["Elbow", 12], ["Wrist", 14]] },
  { id: "m-hand", parts: [["Hand", 18], ["Little", 16], ["Ring", 16], ["Middle", 18], ["Index", 20], ["Thumb", 28]] },
  { id: "m-face", parts: [["Neck", 12], ["Brow", 14], ["Eye", 16], ["Face", 24]] },
  { id: "m-mouth", parts: [["Lips", 34], ["Jaw", 18], ["Tongue", 26], ["Swallow", 20]] },
];
const SENSE: Seg[] = [
  { id: "s-genitals", parts: [["Genitals", 14]] },
  { id: "s-leg", parts: [["Toes", 12], ["Foot", 14], ["Leg", 12], ["Hip", 12]] },
  { id: "s-trunk", parts: [["Trunk", 14], ["Neck", 10], ["Head", 10], ["Arm", 12], ["Elbow", 10], ["Forearm", 10]] },
  { id: "s-hand", parts: [["Hand", 18], ["Fingers", 26], ["Thumb", 24]] },
  { id: "s-face", parts: [["Eye", 14], ["Nose", 12], ["Face", 22], ["Lips", 32], ["Teeth", 16]] },
  { id: "s-mouth", parts: [["Tongue", 24], ["Throat", 14], ["Organs", 14]] },
];

/** Where the middle bar of one body-part group sits, for its label. */
function segPoint(segs: Seg[], id: string, mirror: boolean): [number, number] {
  const total = segs.reduce((a, s) => a + s.parts.reduce((b, p) => b + p[1] + 4, 0), 0);
  let acc = 0;
  for (const s of segs) {
    const w = s.parts.reduce((b, p) => b + p[1] + 4, 0);
    if (s.id === id) {
      const mid = 0.02 + ((acc + w / 2) / total) * (1.95 - 0.02);
      const big = Math.max(...s.parts.map((p) => p[1]));
      const x = 300 - (180 + 4 + big) * Math.sin(mid);
      const y = 300 - (196 + 4 + big) * Math.cos(mid);
      return [Math.round(mirror ? 620 - x : x), Math.round(y)];
    }
    acc += w;
  }
  return [300, 200];
}
const at = (segs: Seg[], id: string, mirror: boolean) => {
  const [x, y] = segPoint(segs, id, mirror);
  return { x, y };
};

function Strip({ segs, mirror, fill }: { segs: Seg[]; mirror: boolean; fill: string }) {
  // The precentral or postcentral gyrus cut across: an arc from the top of the
  // inner wall over the convexity to the lateral sulcus.
  const cx = 300;
  const cy = 300;
  const rx = 180;
  const ry = 196;
  const total = segs.reduce((a, s) => a + s.parts.reduce((b, p) => b + p[1] + 4, 0), 0);
  let acc = 0;
  const a0 = 0.02;
  const a1 = 1.95;
  const pt = (a: number, extra = 0) => [cx - (rx + extra) * Math.sin(a), cy - (ry + extra) * Math.cos(a)];
  const out: ReactNode[] = [];
  const texts: ReactNode[] = [];
  for (const s of segs) {
    for (const [name, size] of s.parts) {
      const mid = a0 + ((acc + (size + 4) / 2) / total) * (a1 - a0);
      acc += size + 4;
      const [x0, y0] = pt(mid, 4);
      const [x1, y1] = pt(mid, 4 + size * 2);
      const wid = ((size + 4) / total) * (a1 - a0) * rx * 0.86;
      const [tx, ty] = pt(mid, 10 + size * 2);
      const deg = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
      const sx = mirror ? 620 - tx : tx;
      const rot = mirror ? 180 - deg : deg + 180;
      texts.push(
        <text key={s.id + name + "t"} x={sx} y={ty} fontSize={12.5} fill={C.ink} transform={`rotate(${rot} ${sx} ${ty})`} textAnchor={mirror ? "start" : "end"} dominantBaseline="middle" pointerEvents="none">
          {name}
        </text>,
      );
      out.push(
        <g key={s.id + name}>
          <path d={`M${x0} ${y0} L${x1} ${y1}`} stroke={C.ink} strokeWidth={wid + 2.4} strokeLinecap="butt" />
          <path d={`M${x0} ${y0} L${x1} ${y1}`} stroke={fill} strokeWidth={wid} strokeLinecap="butt" data-line={s.id} />
        </g>,
      );
    }
  }
  const arc = Array.from({ length: 30 }, (_, i) => pt(a0 - 0.02 + (i / 29) * (a1 - a0 + 0.04)));
  const strip = (
    <g transform={mirror ? "translate(620 0) scale(-1 1)" : undefined}>
      <path d={`${sm(arc)} L${cx - (rx - 40) * Math.sin(a1)} ${cy - (ry - 40) * Math.cos(a1)} ${sm(Array.from({ length: 30 }, (_, i) => pt(a1 + 0.02 - (i / 29) * (a1 - a0 + 0.04), -40))).replace(/^M/, "L")} Z`} fill={C.t3} stroke={C.ink} strokeWidth={2} />
      <path d={`M${cx} ${cy - ry + 40} L${cx} ${cy + 20}`} stroke={C.ink} strokeWidth={2} />
      {out}
    </g>
  );
  return (
    <g>
      {strip}
      {texts}
    </g>
  );
}

export const homunculus: FigureDef = {
  id: "homunculus",
  title: "The motor and sensory homunculus",
  viewBox: "-30 -10 680 450",
  summary: "Two coronal strips of cortex: on the left the motor strip (precentral gyrus) and on the right the sensory strip (postcentral gyrus), with each body part drawn as a bar sized by how much cortex it gets.",
  art: (
    <g>
      <Strip segs={MOTOR} mirror={false} fill={C.blueSoft} />
      <Strip segs={SENSE} mirror fill={C.hiSoft} />
      <Note x={190} y={430}>Motor strip (precentral)</Note>
      <Note x={430} y={430}>Sensory strip (postcentral)</Note>
    </g>
  ),
  labels: [
    { id: "m-leg", name: "Motor: leg and foot", ...at(MOTOR, "m-leg", false), about: "The leg and foot are controlled from the top of the strip and the inner wall, supplied by the anterior cerebral artery; a stroke there weakens mainly the opposite leg." },
    { id: "m-trunk", name: "Motor: trunk", ...at(MOTOR, "m-trunk", false), about: "The trunk gets only a small share of the motor strip." },
    { id: "m-hand", name: "Motor: hand and thumb", ...at(MOTOR, "m-hand", false), about: "A huge area for the fingers and thumb, which is why fine hand skills are so precise. It lies on the side surface, supplied by the middle cerebral artery." },
    { id: "m-face", name: "Motor: face", ...at(MOTOR, "m-face", false), about: "Controls the face muscles. The upper face has input from both sides, so a cortical stroke spares the forehead." },
    { id: "m-mouth", name: "Motor: lips and tongue", ...at(MOTOR, "m-mouth", false), about: "Lips, jaw, tongue and swallowing sit lowest, next to Broca's area, so strokes here often affect speech too." },
    { id: "s-genitals", name: "Sensory: genitals", ...at(SENSE, "s-genitals", true), about: "Genital sensation is at the very top of the inner wall, below the foot area." },
    { id: "s-leg", name: "Sensory: foot and leg", ...at(SENSE, "s-leg", true), about: "Feeling from the foot and leg, on the inner wall and top of the strip." },
    { id: "s-hand", name: "Sensory: hand", ...at(SENSE, "s-hand", true), about: "A large area for the fingertips, which have the most touch receptors." },
    { id: "s-face", name: "Sensory: face and lips", ...at(SENSE, "s-face", true), about: "The lips and face get a very large area, so they are very sensitive." },
    { id: "s-mouth", name: "Sensory: tongue, throat, organs", ...at(SENSE, "s-mouth", true), about: "Tongue and throat sensation, then the inner organs, at the lowest end next to the insula." },
  ],
};

/*
 * The ventricles and the flow of cerebrospinal fluid, side view.
 * References checked: OpenStax Anatomy and Physiology 2e, 13.3 "Circulation
 * and the Central Nervous System" (ventricles, choroid plexus, interventricular
 * foramen, aqueduct, median and lateral apertures, arachnoid granulations into
 * the superior sagittal sinus); Kaplan and Sadock neuroimaging section on
 * ventricular enlargement (local copy).
 */
export const ventricles: FigureDef = {
  id: "ventricles",
  title: "The ventricles and the flow of cerebrospinal fluid",
  viewBox: "60 20 510 420",
  summary: "The ventricles inside a see-through brain from the side: the C-shaped lateral ventricle with its horns, the third ventricle, the aqueduct, the fourth ventricle and central canal, with arrows for the flow of fluid out to the sagittal sinus.",
  art: (u) => (
    <g>
      <g opacity={0.4}>
        <LateralBrain u={u} gyri={false} />
      </g>
      <path d="M150 64 C230 40 360 36 450 66" stroke={C.blue} strokeWidth={10} fill="none" strokeLinecap="round" data-line="sinus" />
      {[220, 300, 380].map((x) => (
        <path key={x} d={`M${x} ${x === 300 ? 50 : 54} q-6 10 0 16 q6 -6 0 -16`} fill={C.blueMid} stroke={C.ink} strokeWidth={1} data-part="granulation" />
      ))}
      <path d={tube([[214, 176], [240, 156], [290, 146], [350, 150], [394, 168], [414, 196], [404, 230], [380, 256], [340, 270], [296, 276], [262, 272]], [26, 30, 24, 22, 24, 34, 28, 20, 16, 14, 12])} fill={C.blueSoft} stroke={C.ink} strokeWidth={2} data-part="lateral" />
      <path d={tube([[410, 194], [446, 192], [474, 198]], [18, 12, 6])} fill={C.blueSoft} stroke={C.ink} strokeWidth={2} data-part="occipital" />
      <path d={sm([[262, 190], [300, 186], [326, 200], [334, 230], [322, 248], [292, 252], [272, 260], [262, 246], [268, 226], [258, 206]], true)} fill={C.blueMid} stroke={C.ink} strokeWidth={1.8} data-part="v3" />
      <path d="M326 236 C340 252 350 272 360 292" stroke={C.ink} strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d="M326 236 C340 252 350 272 360 292" stroke={C.blueMid} strokeWidth={5} fill="none" strokeLinecap="round" data-line="aqueduct" />
      <path d={sm([[356, 292], [404, 316], [366, 344], [352, 320]], true)} fill={C.blueMid} stroke={C.ink} strokeWidth={1.8} data-part="v4" />
      <path d="M366 344 C368 380 368 410 368 436" stroke={C.ink} strokeWidth={5} fill="none" />
      <path d="M366 344 C368 380 368 410 368 436" stroke={C.blueMid} strokeWidth={2.6} fill="none" data-line="canal" />
      <circle cx={266} cy={186} r={6} fill={C.paper} stroke={C.ink} strokeWidth={1.6} data-part="monro" />
      <path d="M300 160 C320 166 350 166 380 176" stroke={C.ink} strokeWidth={5} strokeDasharray="2 4" strokeLinecap="round" fill="none" data-line="choroid" />
      <g fill="none" strokeWidth={2.6}>
        <Groove d="M380 300 l0 0" />
        <path d="M404 316 C430 330 450 330 470 320" stroke={C.line} markerEnd={`url(#${u("arrow")})`} data-line="flow" />
        <path d="M480 300 C520 240 520 140 470 90" stroke={C.line} markerEnd={`url(#${u("arrow")})`} data-line="flow" />
        <path d="M300 182 C290 182 280 184 272 186" stroke={C.line} markerEnd={`url(#${u("arrow")})`} data-line="flow" />
      </g>
    </g>
  ),
  labels: [
    { id: "lateral", name: "Lateral ventricle", x: 300, y: 150, about: "The largest ventricle, one in each hemisphere, curving like a C with a frontal, occipital and temporal horn. Enlarged lateral ventricles are reported in schizophrenia and dementia." },
    { id: "choroid", name: "Choroid plexus", x: 340, y: 166, about: "Tufts of blood vessels lining the ventricles that make about 500 millilitres of fluid a day." },
    { id: "monro", name: "Interventricular foramen", x: 266, y: 186, about: "The hole through which each lateral ventricle drains into the third ventricle; a colloid cyst can block it and cause sudden headache." },
    { id: "occipital", name: "Occipital horn", x: 456, y: 194, about: "The back extension of the lateral ventricle." },
    { id: "temporal", name: "Temporal horn", x: 276, y: 274, about: "Curves down into the temporal lobe beside the hippocampus." },
    { id: "v3", name: "Third ventricle", x: 296, y: 222, about: "The midline slit between the two thalami; it widens in brain shrinkage." },
    { id: "aqueduct", name: "Cerebral aqueduct", x: 344, y: 266, about: "A narrow channel through the midbrain. Its narrowing is a common cause of blocked fluid flow and hydrocephalus." },
    { id: "v4", name: "Fourth ventricle", x: 372, y: 318, about: "Between the pons and the cerebellum; fluid leaves through its openings into the space round the brain." },
    { id: "canal", name: "Central canal", x: 368, y: 400, about: "The tiny channel continuing down the spinal cord." },
    { id: "flow", name: "Flow round the brain", x: 506, y: 200, about: "Fluid flows out over the surface of the brain and cord, cushioning them; normal pressure hydrocephalus causes the triad of wet, wobbly and wacky: incontinence, gait problems and dementia." },
    { id: "granulation", name: "Arachnoid granulations", x: 300, y: 58, about: "Small tufts that let the fluid drain back into the blood." },
    { id: "sinus", name: "Superior sagittal sinus", x: 420, y: 58, about: "The large vein along the top of the brain that collects the returning fluid." },
  ],
};

/*
 * The hippocampal formation in a coronal cut, with the trisynaptic circuit.
 * References checked: Bear, Connors and Paradiso memory chapter (local copy:
 * entorhinal cortex, dentate gyrus, CA3, CA1, subiculum; perforant path,
 * mossy fibres, Schaffer collaterals); Kenhub "Hippocampus" (interlocking C
 * shapes of the dentate gyrus and Ammon's horn, alveus and fimbria on the
 * ventricular surface, hippocampal sulcus between dentate gyrus and subiculum).
 */
const AMMON = [[118, 300], [176, 304], [244, 296], [310, 270], [346, 226], [346, 184], [318, 160], [290, 172], [272, 198]];
const DG = [[290, 158], [244, 156], [214, 194], [238, 236], [290, 240]];

export const hippocampus: FigureDef = {
  id: "hippocampus",
  title: "The hippocampus cut across",
  viewBox: "40 70 400 320",
  summary: "A coronal cut through the hippocampus with the dentate gyrus, the CA fields of Ammon's horn, subiculum, entorhinal cortex, fimbria, alveus and temporal horn, and the trisynaptic circuit drawn as arrows.",
  art: (u) => (
    <g>
      <Shade u={u} />
      <path d={sm([[160, 110], [240, 94], [340, 108], [400, 150], [410, 210], [384, 280], [370, 230], [376, 172], [340, 132], [270, 120], [200, 126]], true)} fill={C.blueSoft} stroke={C.ink} strokeWidth={1.6} data-part="horn" />
      <path d={sm([[48, 360], [70, 320], [118, 296], [180, 300], [250, 300], [320, 280], [370, 236], [380, 300], [330, 350], [250, 372], [150, 376]], true)} fill={C.t2} stroke={C.ink} strokeWidth={1.6} data-part="parahip" />
      <path d={sm([[352, 170], [376, 208], [366, 262], [330, 300], [270, 314], [300, 290], [334, 260], [344, 216], [330, 180]], true)} fill={C.paper} stroke={C.ink} strokeWidth={1.4} data-part="alveus" />
      <path d={tube(AMMON, [22, 22, 20, 18, 16, 18, 18, 16, 16])} fill={C.t3} stroke={C.ink} strokeWidth={1.8} data-part="ammon" />
      <path d={tube(DG, [14, 14, 14, 14, 14])} fill={C.hiSoft} stroke={C.ink} strokeWidth={1.8} data-part="dg" />
      <path d={sm(ell(266, 128, 26, 13, 10, -0.2))} fill={C.paper} stroke={C.ink} strokeWidth={1.8} data-part="fimbria" />
      <path d={sm([[226, 116], [244, 104], [262, 110], [252, 120], [236, 124]], true)} fill={C.blueMid} stroke={C.ink} strokeWidth={1.2} data-part="choroid" />
      <Groove d="M150 282 C180 270 210 262 238 252" w={2} part="fissure" />
      <g fill="none" strokeLinecap="round">
        <path d="M90 330 C130 300 170 256 214 222" stroke={C.line} strokeWidth={3} markerEnd={`url(#${u("arrow")})`} data-line="perforant" />
        <path d="M232 184 C250 176 268 176 284 186" stroke={C.line} strokeWidth={3} markerEnd={`url(#${u("arrow")})`} data-line="mossy" />
        <path d="M318 168 C330 200 316 240 290 262" stroke={C.line} strokeWidth={3} markerEnd={`url(#${u("arrow")})`} data-line="schaffer" />
        <path d="M230 294 C200 300 170 304 150 300" stroke={C.line} strokeWidth={3} markerEnd={`url(#${u("arrow")})`} data-line="output" />
      </g>
      <Note x={60} y={86} anchor="start">Medial</Note>
      <Note x={430} y={86} anchor="end">Lateral</Note>
    </g>
  ),
  labels: [
    { id: "dg", name: "Dentate gyrus", x: 228, y: 210, about: "A C-shaped strip of small granule cells, one of the few places where new neurons are born in adults. Stress slows this and antidepressants and exercise boost it." },
    { id: "ammon", name: "CA1 field", x: 250, y: 296, about: "The main output field of Ammon's horn, the most sensitive to lack of oxygen, so it is damaged first after cardiac arrest or hypoglycaemia." },
    { id: "ca3", name: "CA3 field", x: 342, y: 196, about: "Its cells link to each other richly, which helps complete a whole memory from a fragment." },
    { id: "subiculum", name: "Subiculum", x: 140, y: 302, about: "The main output of the hippocampus, sending memories back to the cortex and to the fornix." },
    { id: "parahip", name: "Entorhinal cortex", x: 110, y: 350, about: "The gateway between the cortex and the hippocampus, on the parahippocampal gyrus. Alzheimer tangles appear here first." },
    { id: "fissure", name: "Hippocampal sulcus", x: 196, y: 266, about: "The groove that separates the dentate gyrus from the subiculum." },
    { id: "alveus", name: "Alveus", x: 366, y: 236, about: "A thin white layer of output axons covering the ventricular surface of the hippocampus." },
    { id: "fimbria", name: "Fimbria", x: 266, y: 128, about: "The white band that gathers the output axons and becomes the fornix." },
    { id: "choroid", name: "Choroid plexus", x: 244, y: 112, about: "Fluid-making tissue in the choroid fissure beside the fimbria." },
    { id: "horn", name: "Temporal horn", x: 380, y: 160, about: "The ventricle above the hippocampus; it widens as the hippocampus shrinks." },
    { id: "perforant", name: "Perforant path", x: 152, y: 276, about: "The first link of the trisynaptic circuit, from entorhinal cortex to dentate gyrus." },
    { id: "mossy", name: "Mossy fibres", x: 258, y: 178, about: "The second link, from dentate granule cells to CA3." },
    { id: "schaffer", name: "Schaffer collaterals", x: 324, y: 218, about: "The third link, from CA3 to CA1. Long-term potentiation, the cell basis of memory, was first studied here." },
  ],
};
