import type { FigureDef } from "../types";
import { C, LAT, LateralBrain, MED, MedialBrain, Mirror, Note, Shade, ell, sm } from "./kit";

/*
 * Maps on the cortex: Brodmann areas, language areas, prefrontal subregions,
 * arterial territories and the circle of Willis.
 * References checked: OpenStax Psychology 2e, 3.4 (Broca's and Wernicke's
 * areas, motor and sensory strips); OpenStax Anatomy and Physiology 2e, 13.2
 * (Brodmann areas figure) and 13.3 (circle of Willis and the territories of
 * the anterior, middle and posterior cerebral arteries); Kenhub "Brodmann
 * areas" (4 primary motor, 6 premotor and supplementary motor, 8 frontal eye
 * field, 9 and 46 dorsolateral prefrontal, 10 frontopolar, 11 and 47 orbital,
 * 44 and 45 Broca, 1 2 3 primary somatosensory, 5 and 7 superior parietal,
 * 39 angular, 40 supramarginal, 41 and 42 auditory, 22 superior temporal,
 * 21 middle temporal, 20 inferior temporal, 37 occipitotemporal, 17 primary
 * visual, 18 and 19 visual association); Kaplan and Sadock (local copy) for
 * the prefrontal syndromes and aphasias.
 */

type Area = { id: string; n: string; d: string; fill: string; tx: number; ty: number };
const AREAS: Area[] = [
  { id: "ba4", n: "4", d: LAT.precentralGyrus, fill: C.blueMid, tx: 300, ty: 100 },
  { id: "ba312", n: "3,1,2", d: LAT.postcentralGyrus, fill: C.hiSoft, tx: 340, ty: 92 },
  { id: "ba6", n: "6", d: sm([[292, 30], [292, 50], [284, 76], [272, 98], [270, 118], [268, 140], [254, 160], [250, 178], [246, 196], [238, 232], [226, 196], [232, 150], [236, 100], [244, 30]], true), fill: C.blueSoft, tx: 256, ty: 120 },
  { id: "ba8", n: "8", d: sm([[244, 30], [236, 100], [232, 150], [208, 150], [206, 100], [210, 40]], true), fill: C.t2, tx: 222, ty: 96 },
  { id: "ba946", n: "9, 46", d: sm([[210, 40], [206, 100], [208, 150], [226, 166], [150, 172], [118, 180], [112, 130], [150, 70]], true), fill: C.hiSoft, tx: 166, ty: 128 },
  { id: "ba10", n: "10", d: sm([[70, 140], [112, 130], [118, 180], [110, 226], [70, 230]], true), fill: C.t3, tx: 96, ty: 186 },
  { id: "ba44", n: "44", d: sm([[226, 166], [250, 178], [246, 196], [238, 232], [226, 246], [214, 238], [210, 200]], true), fill: C.blueMid, tx: 230, ty: 210 },
  { id: "ba45", n: "45", d: sm([[170, 176], [226, 166], [210, 200], [214, 238], [196, 248], [176, 232]], true), fill: C.blueSoft, tx: 196, ty: 208 },
  { id: "ba47", n: "47, 11", d: sm([[110, 226], [118, 180], [170, 176], [176, 232], [196, 248], [150, 258], [100, 250]], true), fill: C.t2, tx: 140, ty: 228 },
  { id: "ba40", n: "40", d: sm([[330, 216], [328, 208], [340, 180], [356, 146], [362, 124], [400, 122], [440, 132], [430, 170], [412, 200], [400, 182]], true), fill: C.t2, tx: 396, ty: 162 },
  { id: "ba39", n: "39", d: sm([[440, 132], [496, 150], [496, 210], [470, 230], [446, 214], [430, 170]], true), fill: C.hiSoft, tx: 466, ty: 182 },
  { id: "ba57", n: "5, 7", d: sm([[388, 30], [384, 54], [374, 82], [364, 102], [362, 124], [400, 122], [440, 132], [496, 150], [508, 90], [520, 30]], true), fill: C.t1, tx: 440, ty: 96 },
  { id: "ba22", n: "22", d: LAT.stg, fill: C.t3, tx: 300, ty: 248 },
  { id: "ba21", n: "21", d: sm([[210, 280], [260, 272], [320, 258], [380, 238], [410, 228], [432, 214], [446, 196], [470, 230], [470, 256], [420, 278], [360, 292], [290, 304], [232, 310]], true), fill: C.t2, tx: 330, ty: 278 },
  { id: "ba20", n: "20", d: sm([[232, 310], [290, 304], [360, 292], [420, 278], [440, 272], [430, 330], [300, 340], [220, 330]], true), fill: C.t1, tx: 330, ty: 312 },
  { id: "ba37", n: "37", d: sm([[440, 272], [470, 256], [470, 230], [496, 210], [490, 290], [440, 300]], true), fill: C.t3, tx: 470, ty: 268 },
  { id: "ba19", n: "19", d: sm([[508, 90], [496, 150], [496, 210], [490, 290], [520, 290], [530, 200], [532, 110]], true), fill: C.t2, tx: 512, ty: 200 },
  { id: "ba18", n: "18", d: sm([[532, 110], [530, 200], [520, 290], [540, 280], [552, 230], [556, 150]], true), fill: C.t3, tx: 536, ty: 180 },
  { id: "ba17", n: "17", d: sm([[548, 196], [560, 210], [556, 250], [540, 270], [540, 230]], true), fill: C.t4, tx: 548, ty: 236 },
];

export const brodmann: FigureDef = {
  id: "brodmann",
  title: "The main Brodmann areas",
  viewBox: "60 30 510 410",
  summary: "The side of the left hemisphere divided into its main Brodmann areas, numbered, from the primary motor and sensory strips to the prefrontal, language, auditory and visual areas.",
  art: (u) => (
    <LateralBrain
      u={u}
      over={
        <g pointerEvents="none">
          {AREAS.map((a) => (
            <text key={a.id} x={a.tx} y={a.ty} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.ink}>
              {a.n}
            </text>
          ))}
        </g>
      }
    >
      {AREAS.map((a) => (
        <path key={a.id} d={a.d} fill={a.fill} fillOpacity={0.85} stroke={C.ink} strokeOpacity={0.4} strokeWidth={1} data-part={a.id} />
      ))}
    </LateralBrain>
  ),
  labels: [
    { id: "ba4", name: "4: primary motor", x: 300, y: 110, about: "Sends the commands for voluntary movement of the opposite side." },
    { id: "ba6", name: "6: premotor", x: 256, y: 130, about: "Plans and sequences movements; its inner part, the supplementary motor area, starts self-generated actions." },
    { id: "ba8", name: "8: frontal eye field", x: 222, y: 106, about: "Moves the eyes voluntarily towards a target; eye tracking is abnormal in schizophrenia." },
    { id: "ba946", name: "9, 46: dorsolateral prefrontal", x: 166, y: 138, about: "Working memory, planning and flexible thinking; underactive in schizophrenia and the usual rTMS target in depression." },
    { id: "ba10", name: "10: frontopolar", x: 96, y: 196, about: "Juggling goals and thinking about one's own thinking." },
    { id: "ba44", name: "44, 45: Broca's area", x: 214, y: 214, about: "Speech production and grammar in the left hemisphere; damage causes slow, effortful, broken speech." },
    { id: "ba47", name: "47, 11: orbitofrontal", x: 140, y: 236, about: "Weighs rewards and punishments and restrains social behaviour; damage causes disinhibition, as in Phineas Gage." },
    { id: "ba312", name: "3, 1, 2: primary sensory", x: 344, y: 102, about: "Touch, pain, temperature and body position from the opposite side." },
    { id: "ba57", name: "5, 7: superior parietal", x: 440, y: 106, about: "Builds a map of the body and space to guide reaching." },
    { id: "ba40", name: "40: supramarginal", x: 396, y: 170, about: "Phonology and the sense of where the body is; part of the language network." },
    { id: "ba39", name: "39: angular", x: 466, y: 190, about: "Links words to their sounds and meanings, numbers and spatial orientation; left damage causes Gerstmann syndrome." },
    { id: "ba22", name: "22: superior temporal", x: 300, y: 254, about: "Hearing association area; its back part on the left is Wernicke's area, for understanding speech." },
    { id: "ba4142", name: "41, 42: auditory cortex", x: 330, y: 224, about: "The primary hearing cortex, mostly hidden on the upper surface of the temporal lobe inside the lateral sulcus." },
    { id: "ba21", name: "21: middle temporal", x: 330, y: 284, about: "Word meanings and recognising objects and motion." },
    { id: "ba20", name: "20: inferior temporal", x: 330, y: 316, about: "Recognising objects and their meaning." },
    { id: "ba37", name: "37: occipitotemporal", x: 470, y: 276, about: "Includes the fusiform area for faces and written words; damage causes face blindness (prosopagnosia)." },
    { id: "ba19", name: "18, 19: visual association", x: 518, y: 206, about: "Process shape, colour and movement; damage causes visual agnosia." },
    { id: "ba17", name: "17: primary visual", x: 548, y: 236, about: "The primary visual cortex, mostly on the inner surface around the calcarine sulcus; only its tip shows here." },
  ],
};

/*
 * Language areas and the arcuate fasciculus.
 */
export const languageAreas: FigureDef = {
  id: "language-areas",
  title: "The language areas and the arcuate fasciculus",
  viewBox: "60 30 510 410",
  summary: "The left hemisphere with Broca's area, Wernicke's area, the arcuate fasciculus joining them, the angular and supramarginal gyri, the hearing cortex, the face area of the motor strip and the visual cortex.",
  art: (u) => (
    <LateralBrain
      u={u}
      over={
        <g>
          <path d="M392 226 C420 214 440 190 430 164 C420 140 380 132 340 140 C300 150 270 170 246 196 C238 204 232 210 228 214" stroke={C.ink} strokeWidth={13} fill="none" strokeLinecap="round" opacity={0.85} />
          <path d="M392 226 C420 214 440 190 430 164 C420 140 380 132 340 140 C300 150 270 170 246 196 C238 204 232 210 228 214" stroke={C.blueMid} strokeWidth={9} fill="none" strokeLinecap="round" data-line="arcuate" />
          <path d="M392 226 C420 214 440 190 430 164 C420 140 380 132 340 140 C300 150 270 170 246 196 C238 204 232 210 228 214" stroke={C.paper} strokeWidth={1.4} strokeDasharray="4 6" fill="none" />
        </g>
      }
    >
      <path d={sm([[170, 176], [226, 166], [250, 178], [246, 196], [238, 232], [226, 246], [196, 248], [176, 232]], true)} fill={C.blueMid} fillOpacity={0.9} data-part="broca" />
      <path d={sm([[360, 210], [400, 186], [440, 196], [432, 216], [410, 230], [372, 240]], true)} fill={C.hi} fillOpacity={0.9} data-part="wernicke" />
      <path d={sm([[300, 228], [340, 214], [352, 220], [310, 236]], true)} fill={C.t4} data-part="auditory" />
      <path d={sm([[440, 132], [496, 150], [496, 210], [470, 230], [446, 214], [430, 170]], true)} fill={C.hiSoft} data-part="angular" />
      <path d={sm([[362, 124], [400, 122], [440, 132], [430, 170], [412, 196], [400, 182], [380, 172], [356, 150]], true)} fill={C.t2} data-part="smg" />
      <path d={sm([[270, 182], [292, 176], [284, 224], [262, 234]], true)} fill={C.blueSoft} data-part="face" />
      <path d={LAT.occipital} fill={C.t3} fillOpacity={0.8} data-part="visual" />
    </LateralBrain>
  ),
  labels: [
    { id: "broca", name: "Broca's area", x: 210, y: 212, about: "Forms speech and grammar. Damage gives Broca's (expressive) aphasia: slow, effortful, telegraphic speech with good understanding; patients know and are frustrated by their errors." },
    { id: "face", name: "Motor face area", x: 276, y: 206, about: "The lowest part of the motor strip, moving the lips, tongue and larynx to speak; damage causes slurred speech (dysarthria), not aphasia." },
    { id: "auditory", name: "Hearing cortex", x: 326, y: 226, about: "Heschl's gyrus, where heard speech first reaches the cortex." },
    { id: "wernicke", name: "Wernicke's area", x: 404, y: 210, about: "Understands spoken language. Damage gives Wernicke's (receptive) aphasia: fluent but empty speech full of wrong words, poor understanding and little awareness; it can be mistaken for psychotic word salad." },
    { id: "arcuate", name: "Arcuate fasciculus", x: 340, y: 140, about: "A curved white matter bundle linking Wernicke's to Broca's area. Damage gives conduction aphasia: understanding and fluency are kept but repeating words is very poor." },
    { id: "smg", name: "Supramarginal gyrus", x: 390, y: 150, about: "Holds speech sounds in mind for a moment; part of the route for repeating." },
    { id: "angular", name: "Angular gyrus", x: 466, y: 182, about: "Links written words to sounds and meanings; damage causes problems reading and writing (alexia with agraphia)." },
    { id: "visual", name: "Visual cortex", x: 526, y: 220, about: "Sees written words, which the angular gyrus then links to language." },
  ],
};

/*
 * Prefrontal subregions on the lateral and medial surfaces.
 * References checked: Kaplan and Sadock (local copy, grep "dorsolateral",
 * "orbitofrontal", "anterior cingulate"): dorsolateral (executive),
 * orbitofrontal (disinhibition), medial and anterior cingulate (apathy,
 * motivation); OpenStax Psychology 2e, 3.4 (prefrontal cortex).
 */
const S = 0.62;
const MX = 300;
export const prefrontal: FigureDef = {
  id: "prefrontal",
  title: "The parts of the prefrontal cortex",
  viewBox: "40 20 610 260",
  summary: "Two views of the frontal lobe: from the side with the dorsolateral, ventrolateral, frontopolar and lateral orbitofrontal regions, and from the midline with the dorsomedial, anterior cingulate, subgenual, ventromedial and medial orbitofrontal regions.",
  art: (u) => {
    const clipM = u("pfc-med");
    return (
      <g>
        <g transform={`scale(${S})`}>
          <LateralBrain u={u} gyri={false}>
            <path d={sm([[210, 40], [206, 100], [208, 150], [226, 166], [150, 172], [118, 180], [112, 130], [150, 70]], true)} fill={C.blueMid} fillOpacity={0.9} data-part="dlpfc" />
            <path d={sm([[118, 180], [226, 166], [250, 178], [238, 232], [196, 248], [150, 236], [116, 222]], true)} fill={C.hiSoft} data-part="vlpfc" />
            <path d={sm([[60, 140], [112, 130], [118, 180], [116, 222], [60, 230]], true)} fill={C.t3} data-part="fp" />
            <path d={sm([[100, 228], [150, 238], [196, 250], [170, 270], [90, 262]], true)} fill={C.t4} data-part="lofc" />
          </LateralBrain>
        </g>
        <g transform={`translate(${MX} 0) scale(${S})`}>
          <defs>
            <clipPath id={clipM}>
              <path d={MED.outer} />
            </clipPath>
          </defs>
          <MedialBrain u={u}>
            <g clipPath={`url(#${clipM})`}>
              <path d={sm([[150, 60], [290, 40], [300, 92], [210, 108], [160, 130], [110, 140]], true)} fill={C.blueSoft} data-part="dmpfc" />
              <path d="M214 214 C176 186 176 140 210 108 C240 98 270 94 290 92 L292 116 C250 118 214 130 200 150 C190 170 196 190 214 206 Z" fill={C.hiSoft} data-part="acc" />
              <path d={sm([[214, 206], [232, 210], [236, 230], [214, 236], [198, 222]], true)} fill={C.hi} data-part="sgacc" />
              <path d={sm([[110, 150], [176, 150], [196, 200], [196, 236], [130, 240], [90, 210]], true)} fill={C.blueMid} fillOpacity={0.8} data-part="vmpfc" />
              <path d={sm([[90, 236], [200, 240], [220, 256], [120, 262], [80, 250]], true)} fill={C.t4} data-part="mofc" />
            </g>
          </MedialBrain>
        </g>
        <Note x={190} y={276} size={14}>From the side</Note>
        <Note x={490} y={276} size={14}>From the middle</Note>
      </g>
    );
  },
  labels: [
    { id: "dlpfc", name: "Dorsolateral PFC", x: 166 * S, y: 128 * S, about: "Working memory, planning, switching and organising; damage or underactivity gives the dysexecutive syndrome and is linked to cognitive symptoms of schizophrenia. The usual target for rTMS in depression." },
    { id: "vlpfc", name: "Ventrolateral PFC", x: 180 * S, y: 206 * S, about: "Stopping an action, choosing between options and, on the left, language; part of reappraising emotions." },
    { id: "fp", name: "Frontopolar cortex", x: 86 * S, y: 186 * S, about: "Keeps a main goal in mind while working on sub-goals." },
    { id: "lofc", name: "Lateral orbitofrontal", x: 140 * S, y: 248 * S, about: "Learns when rewards change; damage causes impulsive, socially inappropriate behaviour." },
    { id: "dmpfc", name: "Dorsomedial PFC", x: MX + 220 * S, y: 72 * S, about: "Thinking about oneself and others (theory of mind) and starting actions; damage causes apathy and loss of initiative." },
    { id: "acc", name: "Anterior cingulate", x: MX + 196 * S, y: 140 * S, about: "Notices conflict, errors and pain and drives effort; overactive in OCD and anxiety, and a target of cingulotomy." },
    { id: "sgacc", name: "Subgenual cingulate", x: MX + 216 * S, y: 222 * S, about: "Below the knee of the corpus callosum; overactive in depression and a target of deep brain stimulation for treatment-resistant depression." },
    { id: "vmpfc", name: "Ventromedial PFC", x: MX + 140 * S, y: 200 * S, about: "Uses emotion to guide decisions and calms the amygdala; damage causes poor real-life decisions despite normal intelligence." },
    { id: "mofc", name: "Medial orbitofrontal", x: MX + 150 * S, y: 248 * S, about: "Values rewards; overactive loops through it and the striatum are linked to OCD." },
  ],
};

/*
 * Arterial territories, side and midline.
 */
export const arterialTerritories: FigureDef = {
  id: "arterial-territories",
  title: "The territories of the cerebral arteries",
  viewBox: "40 20 610 260",
  summary: "The side and midline surfaces of the hemisphere shaded by blood supply: the anterior cerebral artery along the top and the inner surface, the middle cerebral artery over most of the side, and the posterior cerebral artery at the back and underneath.",
  art: (u) => {
    const clipM = u("art-med");
    return (
      <g>
        <g transform={`scale(${S})`}>
          <LateralBrain u={u}>
            <path d={LAT.cerebrum} fill={C.hiSoft} data-part="mca" />
            <path d="M40 150 L140 40 L300 0 L460 20 L530 70 L506 112 L430 94 L300 74 L172 102 L106 156 Z" fill={C.blueSoft} data-part="aca" />
            <path d="M516 0 L600 0 L600 440 L300 440 L300 324 L380 306 L450 290 L478 250 L496 150 L506 92 Z" fill={C.t3} data-part="pca" />
          </LateralBrain>
        </g>
        <g transform={`translate(${MX} 0) scale(${S})`}>
          <defs>
            <clipPath id={clipM}>
              <path d={MED.outer} />
            </clipPath>
          </defs>
          <MedialBrain u={u}>
            <g clipPath={`url(#${clipM})`}>
              <rect x={0} y={0} width={600} height={440} fill={C.blueSoft} data-part="aca" />
              <path d="M472 60 L620 20 L620 460 L230 460 L240 300 L300 290 L380 290 L414 220 L430 160 L456 112 Z" fill={C.t3} data-part="pca" />
            </g>
          </MedialBrain>
        </g>
        <Note x={190} y={276} size={14}>From the side</Note>
        <Note x={490} y={276} size={14}>From the middle</Note>
      </g>
    );
  },
  labels: [
    { id: "aca", name: "Anterior cerebral artery", x: MX + 260 * S, y: 80 * S, about: "Supplies the inner surface of the frontal and parietal lobes and a strip along the top. A stroke here weakens the opposite leg more than the arm and can cause apathy, mutism and incontinence." },
    { id: "mca", name: "Middle cerebral artery", x: 300 * S, y: 200 * S, about: "Supplies most of the outer surface, the internal capsule and basal ganglia. The commonest stroke: it weakens the opposite face and arm more than the leg, with aphasia on the left or neglect on the right." },
    { id: "pca", name: "Posterior cerebral artery", x: 520 * S, y: 220 * S, about: "Supplies the occipital lobe, the underside of the temporal lobe and the thalamus. A stroke here causes loss of half the visual field and sometimes memory loss." },
    { id: "watershed", name: "Border zones", x: 470 * S, y: 120 * S, about: "Where territories meet the supply is weakest; a sudden drop in blood pressure causes watershed infarcts here." },
  ],
};

/*
 * The circle of Willis on the base of the brain.
 */
export const circleOfWillis: FigureDef = {
  id: "circle-of-willis",
  title: "The circle of Willis",
  viewBox: "60 80 380 460",
  summary: "The arteries on the base of the brain: the vertebral arteries joining to form the basilar artery, which divides into the posterior cerebral arteries, joined through the posterior communicating arteries to the internal carotids, which give the middle and anterior cerebral arteries, linked by the anterior communicating artery.",
  art: (u) => {
    const A = (d: string, w: number, part?: string) => (
      <g>
        <path d={d} stroke={C.ink} strokeWidth={w + 2.4} fill="none" strokeLinecap="round" />
        <path d={d} stroke={C.blueMid} strokeWidth={w} fill="none" strokeLinecap="round" data-line={part} />
      </g>
    );
    return (
      <g>
        <Shade u={u} />
        <g opacity={0.55}>
          <Mirror cx={250}>
            <path d={sm([[250, 90], [180, 96], [120, 130], [96, 200], [110, 236], [244, 236]]) + " Z"} fill={C.t1} stroke={C.ink} strokeWidth={1.4} />
            <path d={sm(ell(140, 330, 62, 100, 14))} fill={C.t1} stroke={C.ink} strokeWidth={1.4} />
            <path d={sm(ell(180, 480, 72, 52, 14))} fill={C.t2} stroke={C.ink} strokeWidth={1.4} />
          </Mirror>
          <path d={sm([[250, 290], [206, 296], [196, 340], [212, 380], [250, 392], [288, 380], [304, 340], [294, 296]], true)} fill={C.t2} stroke={C.ink} strokeWidth={1.4} />
          <path d="M226 392 C224 430 232 470 240 520 L260 520 C268 470 276 430 274 392 Z" fill={C.t2} stroke={C.ink} strokeWidth={1.4} />
          <path d={sm(ell(250, 232, 26, 9, 10))} fill={C.paper} stroke={C.ink} strokeWidth={1.2} />
        </g>
        <Mirror cx={250}>
          {A("M236 510 C232 480 234 450 250 412", 7, "vertebral")}
          {A("M234 470 C210 476 190 486 166 500", 3.4, "pica")}
          {A("M250 396 C226 398 204 400 176 404", 3, "aica")}
          {A("M250 306 C226 310 204 314 178 322", 3.4, "sca")}
          {A("M250 298 C232 292 218 290 210 292 C190 298 170 320 150 352", 6, "pca")}
          {A("M212 292 C212 276 212 262 212 252", 3, "pcomm")}
          {A("M212 252 C180 248 140 240 100 222", 7, "mca")}
          {A("M212 252 C222 234 232 222 244 210 C246 180 246 140 244 100", 5, "aca")}
          <circle cx={212} cy={252} r={8} fill={C.blueMid} stroke={C.ink} strokeWidth={1.6} data-part="ica" />
        </Mirror>
        {A("M250 412 L250 298", 8, "basilar")}
        {A("M244 210 L256 210", 4, "acomm")}
        <Note x={250} y={96} size={13}>Front</Note>
      </g>
    );
  },
  labels: [
    { id: "aca", name: "Anterior cerebral", x: 244, y: 150, about: "Runs forward between the hemispheres to supply their inner surfaces." },
    { id: "acomm", name: "Anterior communicating", x: 250, y: 210, about: "A short link between the two anterior cerebral arteries and the commonest site of berry aneurysms, whose rupture causes subarachnoid haemorrhage and a thunderclap headache." },
    { id: "mca", name: "Middle cerebral", x: 140, y: 238, about: "Runs out into the lateral sulcus to supply most of the outer brain." },
    { id: "ica", name: "Internal carotid", x: 212, y: 252, about: "Brings blood from the neck to the front of the circle; narrowing in the neck is a cause of stroke and transient attacks." },
    { id: "pcomm", name: "Posterior communicating", x: 212, y: 272, about: "Joins the carotid to the posterior circulation; an aneurysm here can press on the third nerve." },
    { id: "pca", name: "Posterior cerebral", x: 170, y: 326, about: "Supplies the occipital lobe, inner temporal lobe and thalamus." },
    { id: "sca", name: "Superior cerebellar", x: 196, y: 316, about: "Supplies the top of the cerebellum and upper brainstem." },
    { id: "basilar", name: "Basilar artery", x: 250, y: 350, about: "Runs up the front of the pons; blockage can cause locked-in syndrome or death." },
    { id: "aica", name: "Anterior inferior cerebellar", x: 200, y: 400, about: "Supplies the lower pons and front of the cerebellum, and the inner ear." },
    { id: "vertebral", name: "Vertebral artery", x: 236, y: 480, about: "Two arteries rising through the neck bones that join to form the basilar artery." },
    { id: "pica", name: "Posterior inferior cerebellar", x: 196, y: 484, about: "Supplies the side of the medulla and underside of the cerebellum; blockage causes lateral medullary syndrome with vertigo, swallowing problems and crossed sensory loss." },
  ],
};

