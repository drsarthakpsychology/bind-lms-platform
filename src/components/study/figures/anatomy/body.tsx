import type { ReactNode } from "react";
import type { FigureDef, FigureUid } from "../types";
import { C, MedialBrain, Mirror, Note, Shade, Solid, ell, sm, tube } from "./kit";

/*
 * Body systems: the autonomic nervous system, the HPA axis, the endocrine
 * glands, the pituitary and its portal system, and the gut-brain axis.
 * References checked: OpenStax Anatomy and Physiology 2e, 15.1 "Divisions of
 * the Autonomic Nervous System" (thoracolumbar sympathetic outflow T1 to L2
 * with the chain ganglia; craniosacral parasympathetic outflow in cranial
 * nerves III, VII, IX, X and sacral S2 to S4; terminal ganglia near the
 * organs), 17.1 to 17.6 (endocrine glands and their positions; hypophyseal
 * portal system; posterior pituitary storing oxytocin and ADH made in the
 * supraoptic and paraventricular nuclei; adrenal cortex and medulla), and
 * 23.1 to 23.5 (digestive organs, enteric nervous system); Kaplan and Sadock
 * (local copy, grep "HPA", "gut microbiome") for the stress axis and gut-brain
 * links.
 */

/** Half of a standing body (viewer's left, the person's right), from neck to foot. */
const BODY_HALF = [[200, 124], [184, 126], [180, 142], [150, 152], [118, 164], [100, 192], [92, 250], [86, 320], [80, 390], [74, 430], [70, 456], [82, 466], [96, 440], [104, 400], [112, 330], [120, 262], [128, 232], [132, 280], [134, 340], [128, 400], [132, 440], [136, 520], [142, 620], [144, 680], [150, 700], [184, 700], [184, 680], [186, 620], [190, 520], [194, 470], [200, 462]];
const BODY = sm([...BODY_HALF, ...BODY_HALF.slice(0, -1).reverse().map(([x, y]) => [400 - x, y])], true, 0.8);

function Body({ u, children }: { u: FigureUid; children?: ReactNode }) {
  return (
    <g>
      <Solid d={BODY} fill={C.t1} u={u} shade="side" />
      <Solid d={sm(ell(200, 72, 44, 54, 16))} fill={C.t1} u={u} />
      {children}
    </g>
  );
}

const ORG = {
  brain: sm(ell(200, 62, 34, 28, 14)),
  lungL: sm([[176, 186], [190, 196], [192, 270], [168, 282], [142, 274], [144, 220]], true),
  heart: "M206 222 C214 208 236 210 238 226 C240 248 220 262 208 274 C198 262 186 250 190 232 C192 220 202 218 206 222 Z",
  liver: sm([[136, 286], [226, 280], [214, 306], [164, 322], [138, 310]], true),
  stomach: "M230 282 C250 280 262 294 258 312 C254 330 232 334 218 326 C228 320 238 312 236 300 C234 292 228 290 230 282 Z",
  pancreas: sm([[188, 322], [216, 316], [248, 312], [252, 320], [216, 326], [190, 330]], true),
  kidney: sm(ell(170, 344, 12, 20, 12)),
  adrenal: "M162 326 L170 312 L180 326 Z",
  gut: (() => {
    let d = "M164 364";
    for (let i = 0; i < 4; i++) d += ` C${150} ${372 + i * 14} ${250} ${372 + i * 14} ${236} ${364 + i * 14 + 14}`;
    return d;
  })(),
  colon: "M150 418 C146 390 148 370 160 360 L240 360 C252 370 254 390 250 418",
  bladder: sm(ell(200, 438, 14, 12, 10)),
};

/* ---------------------------------------------------------------- ANS ---- */
function Organ({ x, y, kind, part }: { x: number; y: number; kind: string; part?: string }) {
  const p = { stroke: C.ink, strokeWidth: 1.6, "data-part": part } as const;
  if (kind === "eye") return (<g><circle cx={x} cy={y} r={14} fill={C.paper} {...p} /><circle cx={x} cy={y} r={6} fill={C.t3} /><circle cx={x} cy={y} r={2.5} fill={C.ink} /></g>);
  if (kind === "gland") return <path d={sm(ell(x, y, 14, 9, 10))} fill={C.t2} {...p} />;
  if (kind === "heart") return <path d={`M${x} ${y - 6} C${x + 6} ${y - 16} ${x + 20} ${y - 12} ${x + 18} ${y} C${x + 16} ${y + 10} ${x + 6} ${y + 16} ${x} ${y + 20} C${x - 6} ${y + 16} ${x - 16} ${y + 10} ${x - 18} ${y} C${x - 20} ${y - 12} ${x - 6} ${y - 16} ${x} ${y - 6} Z`} fill={C.t3} {...p} />;
  if (kind === "lungs") return (<g><path d={sm(ell(x - 9, y, 8, 16, 10))} fill={C.t2} {...p} /><path d={sm(ell(x + 9, y, 8, 16, 10))} fill={C.t2} {...p} /></g>);
  if (kind === "stomach") return <path d={`M${x - 4} ${y - 16} C${x + 16} ${y - 18} ${x + 18} ${y + 8} ${x + 6} ${y + 14} C${x - 6} ${y + 18} ${x - 16} ${y + 10} ${x - 14} ${y + 4} C${x - 4} ${y + 6} ${x + 4} ${y} ${x - 4} ${y - 16} Z`} fill={C.t2} {...p} />;
  if (kind === "gut") return <path d={`M${x - 14} ${y - 10} C${x - 20} ${y} ${x + 20} ${y} ${x + 14} ${y - 10} M${x - 14} ${y} C${x - 20} ${y + 10} ${x + 20} ${y + 10} ${x + 14} ${y} M${x - 14} ${y + 10} C${x - 20} ${y + 20} ${x + 20} ${y + 20} ${x + 14} ${y + 10}`} fill="none" stroke={C.ink} strokeWidth={4} data-part={part} />;
  if (kind === "bladder") return <path d={sm(ell(x, y, 14, 12, 10))} fill={C.blueSoft} {...p} />;
  if (kind === "adrenal") return (<g><path d={sm(ell(x, y + 6, 9, 14, 10))} fill={C.t2} {...p} /><path d={`M${x - 8} ${y - 6} L${x} ${y - 18} L${x + 8} ${y - 6} Z`} fill={C.hiSoft} {...p} /></g>);
  if (kind === "genital") return <path d={sm(ell(x, y, 12, 8, 10))} fill={C.t2} {...p} />;
  return null;
}

const ORGANS: { kind: string; y: number; id: string }[] = [
  { kind: "eye", y: 70, id: "pupil" },
  { kind: "gland", y: 130, id: "saliva" },
  { kind: "heart", y: 196, id: "heart" },
  { kind: "lungs", y: 258, id: "airways" },
  { kind: "stomach", y: 320, id: "gut" },
  { kind: "adrenal", y: 382, id: "adrenal" },
  { kind: "gut", y: 438, id: "gut" },
  { kind: "bladder", y: 500, id: "bladder" },
  { kind: "genital", y: 560, id: "genital" },
];

export const autonomic: FigureDef = {
  id: "autonomic",
  title: "The autonomic nervous system",
  viewBox: "0 10 660 600",
  summary: "The brain and spinal cord in the middle, the parasympathetic outflow from the brainstem and sacral cord to the organs on the left, and the sympathetic outflow from the thoracic and lumbar cord through the chain ganglia to the organs on the right.",
  art: (u) => (
    <g>
      <Shade u={u} />
      <Solid d={sm(ell(330, 66, 74, 46, 16))} fill={C.t1} u={u} part="brain" />
      <path d={sm(ell(330, 92, 16, 9, 8))} fill={C.t3} stroke={C.ink} strokeWidth={1.2} data-part="hypo" />
      <path d={tube([[330, 100], [330, 160], [330, 300], [330, 460], [330, 580]], [30, 24, 20, 18, 12])} fill={C.t2} stroke={C.ink} strokeWidth={1.8} data-part="cord" />
      {[["Cervical", 140], ["Thoracic", 270], ["Lumbar", 450], ["Sacral", 540]].map(([t, y]) => (
        <text key={t} x={330} y={y as number} fontSize={11} textAnchor="middle" fill={C.ink} transform={`rotate(-90 330 ${y})`} pointerEvents="none">{t}</text>
      ))}
      {/* Sympathetic chain */}
      {Array.from({ length: 16 }, (_, i) => 150 + i * 24).map((y) => (
        <circle key={y} cx={384} cy={y} r={6} fill={C.hiSoft} stroke={C.ink} strokeWidth={1.2} data-part="chain" />
      ))}
      <path d="M384 150 V510" stroke={C.ink} strokeWidth={2} />
      {Array.from({ length: 13 }, (_, i) => 222 + i * 18).map((y) => (
        <path key={y} d={`M342 ${y} L378 ${y + 2}`} stroke={C.line} strokeWidth={2} data-line="symout" />
      ))}
      {ORGANS.map((o) => (
        <g key={o.kind}>
          <Organ x={560} y={o.y} kind={o.kind} part={o.id} />
          <Organ x={100} y={o.y} kind={o.kind} part={o.id} />
        </g>
      ))}
      {/* Sympathetic: short preganglionic to the chain, long postganglionic out */}
      <g fill="none" strokeWidth={2} stroke={C.line} strokeLinecap="round">
        {ORGANS.filter((o) => o.kind !== "adrenal").map((o, i) => (
          <path key={o.kind} d={`M390 ${[160, 180, 230, 260, 330, 400, 470, 490][i]} C450 ${[160, 180, 230, 260, 330, 400, 470, 490][i]} 500 ${o.y} 538 ${o.y}`} />
        ))}
        <path d="M342 330 C420 340 480 370 548 378" stroke={C.ink} strokeDasharray="5 4" data-line="adrenal" />
      </g>
      {/* Parasympathetic: long preganglionic from brainstem and sacral cord, ganglia near the organs */}
      <g fill="none" strokeWidth={2.4} stroke={C.ink} strokeLinecap="round">
        <path d="M300 92 C240 80 170 72 130 70" data-line="cn3" />
        <path d="M304 104 C240 120 170 128 130 130" />
        <path d="M312 112 C280 160 200 190 128 196 M300 140 C240 220 180 258 128 258 M300 150 C240 270 180 320 126 320 M300 160 C240 330 190 420 126 438" data-line="vagus" />
        <path d="M318 540 C240 530 190 510 128 500 M318 548 C240 560 190 562 128 560" data-line="sacral" />
      </g>
      {[[136, 70], [136, 130], [136, 196], [136, 258], [134, 320], [134, 438], [134, 500], [134, 560]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={4.5} fill={C.blueMid} stroke={C.ink} strokeWidth={1} />
      ))}
      <Note x={110} y={600} size={14}>Parasympathetic: rest and digest</Note>
      <Note x={550} y={600} size={14}>Sympathetic: fight or flight</Note>
    </g>
  ),
  labels: [
    { id: "hypo", name: "Hypothalamus", x: 330, y: 92, about: "The top controller of the autonomic system, linking emotion and stress to the body." },
    { id: "cn3", name: "Oculomotor (III)", x: 220, y: 78, about: "Parasympathetic fibres narrow the pupil; opioids cause pinpoint pupils by this route." },
    { id: "vagus", name: "Vagus nerve (X)", x: 230, y: 230, about: "Carries most parasympathetic outflow: slows the heart, narrows the airways and drives digestion. About four fifths of its fibres carry signals back from the body to the brain." },
    { id: "sacral", name: "Sacral outflow (S2 to S4)", x: 220, y: 540, about: "Parasympathetic supply to the bladder, lower bowel and genitals: empties the bladder and causes erection." },
    { id: "cord", name: "Spinal cord", x: 330, y: 330, about: "The sympathetic neurons sit in the lateral horn from the first thoracic to the second lumbar segment." },
    { id: "symout", name: "Thoracolumbar outflow", x: 360, y: 300, about: "Short sympathetic fibres leave the cord to the chain ganglia; most release acetylcholine onto the ganglion cells." },
    { id: "chain", name: "Sympathetic chain", x: 384, y: 246, about: "A string of ganglia beside the spine; long fibres from here release noradrenaline on the organs. Beta blockers and alpha blockers act at these endings." },
    { id: "adrenal", name: "Adrenal medulla", x: 560, y: 372, about: "Acts like a sympathetic ganglion and pours adrenaline into the blood in fight or flight." },
    { id: "pupil", name: "Pupil", x: 560, y: 70, about: "Sympathetic widens it, parasympathetic narrows it." },
    { id: "saliva", name: "Salivary glands", x: 560, y: 130, about: "Parasympathetic makes plenty of watery saliva; anticholinergic drugs cause a dry mouth, while clozapine paradoxically causes drooling." },
    { id: "heart", name: "Heart", x: 560, y: 196, about: "Sympathetic speeds it up and strengthens it (the pounding heart of panic); the vagus slows it." },
    { id: "airways", name: "Airways", x: 560, y: 258, about: "Sympathetic opens them; parasympathetic narrows them. Non-selective beta blockers can worsen asthma." },
    { id: "gut", name: "Stomach and gut", x: 100, y: 438, about: "Parasympathetic speeds digestion; sympathetic slows it. Anticholinergic drugs cause constipation, which with clozapine can become dangerous." },
    { id: "bladder", name: "Bladder", x: 100, y: 500, about: "Parasympathetic contracts it to pass urine; anticholinergic drugs can cause urinary retention." },
    { id: "genital", name: "Genitals", x: 100, y: 560, about: "Parasympathetic for erection, sympathetic for ejaculation; drugs that block alpha receptors can impair ejaculation." },
  ],
};

/* ---------------------------------------------------------------- HPA ---- */
const HS = 0.5;
const HX = 10;
const hb = (x: number, y: number) => ({ x: Math.round(HX + x * HS), y: Math.round(y * HS) });

export const hpaAxis: FigureDef = {
  id: "hpa-axis",
  title: "The HPA axis: the stress hormone system",
  viewBox: "0 0 560 480",
  summary: "The brain with the amygdala, hippocampus, hypothalamus and pituitary, and the torso with the kidneys and adrenal glands, showing CRH, ACTH and cortisol and the feedback loop that switches the system off.",
  art: (u) => (
    <g>
      <g transform={`translate(${HX} 0) scale(${HS})`}>
        <MedialBrain u={u} />
        <path d={sm(ell(276, 290, 16, 12, 10))} fill={C.hiSoft} stroke={C.ink} strokeWidth={2} strokeDasharray="5 4" data-part="amygdala" />
        <path d={tube([[288, 300], [320, 306], [356, 300], [384, 282], [398, 256]], [18, 18, 16, 14, 10])} fill={C.blueSoft} stroke={C.ink} strokeWidth={2} strokeDasharray="5 4" data-part="hippocampus" />
        <circle cx={262} cy={228} r={9} fill={C.blue} stroke={C.ink} strokeWidth={2} data-part="pvn" />
      </g>
      <Solid d={sm([[330, 190], [500, 190], [530, 260], [520, 400], [500, 470], [340, 470], [320, 400], [310, 260]], true)} fill={C.t1} u={u} shade="side" />
      {[390, 450].map((x) => (
        <g key={x}>
          <path d={sm(ell(x, 380, 18, 30, 12))} fill={C.t2} stroke={C.ink} strokeWidth={1.6} data-part="kidney" />
          <path d={`M${x - 16} 354 C${x - 12} 330 ${x + 12} 330 ${x + 16} 354 Z`} fill={C.hiSoft} stroke={C.ink} strokeWidth={1.6} data-part="adrenal" />
          <path d={`M${x - 8} 350 C${x - 6} 342 ${x + 6} 342 ${x + 8} 350 Z`} fill={C.t3} stroke={C.ink} strokeWidth={1} data-part="medulla" />
        </g>
      ))}
      <g fill="none" strokeLinecap="round" strokeWidth={3}>
        <path d={`M${hb(262, 236).x} ${hb(262, 236).y} L${hb(252, 280).x} ${hb(252, 280).y}`} stroke={C.ink} markerEnd={`url(#${u("arrowInk")})`} data-line="crh" />
        <path d={`M${hb(250, 304).x} ${hb(250, 304).y + 2} C180 260 300 300 382 336`} stroke={C.line} markerEnd={`url(#${u("arrow")})`} data-line="acth" />
        <path d="M420 330 C420 200 260 160 200 156" stroke={C.ink} strokeDasharray="7 5" markerEnd={`url(#${u("arrowInk")})`} data-line="feedback" />
        <path d="M430 330 C440 230 360 170 140 146" stroke={C.ink} strokeDasharray="7 5" markerEnd={`url(#${u("arrowInk")})`} data-line="feedback" />
        <path d={`M${hb(276, 284).x} ${hb(276, 284).y} C${hb(266, 260).x} ${hb(266, 260).y} ${hb(262, 250).x} ${hb(262, 250).y} ${hb(262, 240).x} ${hb(262, 240).y}`} stroke={C.line} markerEnd={`url(#${u("arrow")})`} data-line="drive" />
      </g>
      <Note x={430} y={210} size={13}>Body</Note>
    </g>
  ),
  labels: [
    { id: "amygdala", name: "Amygdala", ...hb(276, 290), about: "Senses threat and switches the stress axis on." },
    { id: "drive", name: "Amygdala drive", ...hb(268, 262), about: "Fear signals push the hypothalamus to start the cascade." },
    { id: "pvn", name: "Hypothalamus (PVN)", ...hb(262, 228), about: "The paraventricular nucleus releases corticotropin-releasing hormone (CRH) into the portal blood." },
    { id: "crh", name: "CRH", ...hb(258, 258), about: "Travels a few millimetres down the stalk to the pituitary." },
    { id: "pituitary", name: "Anterior pituitary", ...hb(246, 296), about: "Releases ACTH into the general blood in response to CRH." },
    { id: "acth", name: "ACTH in the blood", x: 290, y: 300, about: "Adrenocorticotropic hormone travels in the bloodstream to the adrenal glands." },
    { id: "adrenal", name: "Adrenal cortex", x: 390, y: 344, about: "Releases cortisol, which raises blood sugar, damps immunity and sharpens alertness. It peaks about 30 minutes after waking." },
    { id: "medulla", name: "Adrenal medulla", x: 450, y: 346, about: "Releases adrenaline within seconds through the sympathetic nerves, the fast arm of the stress response." },
    { id: "kidney", name: "Kidney", x: 450, y: 390, about: "The adrenal glands sit on top of the kidneys." },
    { id: "feedback", name: "Cortisol feedback", x: 330, y: 186, about: "Cortisol switches its own release off at the pituitary, hypothalamus and hippocampus. In depression this brake often fails, so cortisol stays high (the dexamethasone suppression test)." },
    { id: "hippocampus", name: "Hippocampus", ...hb(352, 300), about: "Rich in cortisol receptors and helps turn the axis off; long exposure to high cortisol shrinks it." },
  ],
};

/* ---------------------------------------------------------- Endocrine ---- */
export const endocrine: FigureDef = {
  id: "endocrine",
  title: "The endocrine glands",
  viewBox: "40 0 320 720",
  summary: "A body outline with the hypothalamus, pituitary and pineal in the head, the thyroid and parathyroids in the neck, the thymus, adrenal glands, pancreas, ovaries and testes.",
  art: (u) => (
    <Body u={u}>
      <path d={ORG.brain} fill={C.t2} stroke={C.ink} strokeWidth={1.4} />
      <circle cx={200} cy={74} r={6} fill={C.blueMid} stroke={C.ink} data-part="hypo" />
      <circle cx={200} cy={88} r={5} fill={C.hi} stroke={C.ink} data-part="pit" />
      <circle cx={214} cy={64} r={4} fill={C.t4} stroke={C.ink} data-part="pineal" />
      <g opacity={0.35}>
        <Mirror cx={200}>
          <path d={ORG.lungL} fill={C.t2} stroke={C.ink} />
        </Mirror>
        <path d={ORG.liver} fill={C.t2} stroke={C.ink} />
        <path d={ORG.stomach} fill={C.t2} stroke={C.ink} />
        <path d={ORG.gut} fill="none" stroke={C.ink} strokeWidth={3} />
      </g>
      <path d={ORG.heart} fill={C.t2} stroke={C.ink} strokeOpacity={0.4} opacity={0.5} />
      <Mirror cx={200}>
        <path d={sm(ell(190, 150, 7, 12, 10))} fill={C.hiSoft} stroke={C.ink} strokeWidth={1.4} data-part="thyroid" />
        <circle cx={186} cy={144} r={2.6} fill={C.blue} data-part="parathyroid" />
        <circle cx={186} cy={157} r={2.6} fill={C.blue} data-part="parathyroid" />
        <path d={ORG.kidney} fill={C.t2} stroke={C.ink} strokeWidth={1.2} />
        <path d={ORG.adrenal} fill={C.hi} stroke={C.ink} strokeWidth={1.4} data-part="adrenal" />
        <path d={sm(ell(178, 416, 8, 5, 8))} fill={C.blueSoft} stroke={C.ink} strokeWidth={1.4} data-part="ovary" />
        <path d={sm(ell(190, 486, 7, 10, 8))} fill={C.blueSoft} stroke={C.ink} strokeWidth={1.4} data-part="testis" />
      </Mirror>
      <rect x={196} y={146} width={8} height={6} fill={C.hiSoft} stroke={C.ink} strokeWidth={1} />
      <path d={sm(ell(200, 182, 14, 14, 10))} fill={C.t3} stroke={C.ink} strokeWidth={1.4} data-part="thymus" />
      <path d={ORG.pancreas} fill={C.hiSoft} stroke={C.ink} strokeWidth={1.4} data-part="pancreas" />
      <path d="M200 408 C190 408 186 418 192 428 L208 428 C214 418 210 408 200 408 Z" fill={C.t2} stroke={C.ink} strokeWidth={1.2} />
    </Body>
  ),
  labels: [
    { id: "hypo", name: "Hypothalamus", x: 200, y: 74, about: "Links the brain to the hormone system through the pituitary." },
    { id: "pineal", name: "Pineal gland", x: 214, y: 64, about: "Makes melatonin at night." },
    { id: "pit", name: "Pituitary gland", x: 200, y: 88, about: "The master gland. A prolactin-secreting tumour or antipsychotic-raised prolactin can stop periods and cause breast milk." },
    { id: "thyroid", name: "Thyroid", x: 190, y: 150, about: "Sets the body's pace: too little causes low mood, slowness and memory problems, too much causes anxiety and agitation. Lithium can make it underactive, so it is checked regularly." },
    { id: "parathyroid", name: "Parathyroids", x: 186, y: 157, about: "Four tiny glands controlling calcium; lithium can make them overactive, raising calcium and causing low mood and confusion." },
    { id: "thymus", name: "Thymus", x: 200, y: 182, about: "Trains immune T cells in childhood and shrinks after puberty." },
    { id: "adrenal", name: "Adrenal glands", x: 170, y: 320, about: "The cortex makes cortisol and aldosterone, the medulla adrenaline. Too much cortisol (Cushing's) can cause depression and psychosis; too little (Addison's) causes fatigue and low mood." },
    { id: "pancreas", name: "Pancreas", x: 220, y: 320, about: "Its islets make insulin and glucagon. Clozapine and olanzapine raise the risk of diabetes, so blood sugar is monitored." },
    { id: "ovary", name: "Ovaries", x: 178, y: 416, about: "Make oestrogen and progesterone; their swings are linked to premenstrual dysphoria and to depression after childbirth and around the menopause." },
    { id: "testis", name: "Testes", x: 190, y: 486, about: "Make testosterone; low levels can cause low mood and low sex drive, and anabolic steroid misuse can cause aggression and mood swings." },
  ],
};

/* ---------------------------------------------------------- Pituitary ---- */
export const pituitary: FigureDef = {
  id: "pituitary",
  title: "The pituitary and its links to the hypothalamus",
  viewBox: "60 20 420 450",
  summary: "A close-up side view of the hypothalamus, stalk and pituitary: nerve fibres from the supraoptic and paraventricular nuclei run to the posterior lobe, while hypothalamic releasing hormones travel in portal blood vessels to the anterior lobe.",
  art: (u) => (
    <g>
      <Shade u={u} />
      <path d={sm([[80, 40], [460, 40], [470, 160], [400, 220], [300, 236], [262, 244], [220, 236], [120, 220], [70, 150]], true)} fill={C.t1} stroke={C.ink} strokeWidth={2} />
      <path d="M254 40 L254 210 C256 226 258 236 262 244 C266 236 268 226 270 210 L270 40 Z" fill={C.blueSoft} stroke={C.ink} strokeWidth={1.4} />
      <path d={sm(ell(160, 228, 34, 14, 10))} fill={C.paper} stroke={C.ink} strokeWidth={1.6} data-part="chiasm" />
      <path d={sm(ell(380, 232, 22, 18, 10))} fill={C.t3} stroke={C.ink} strokeWidth={1.6} />
      <path d={sm(ell(220, 110, 26, 18, 10))} fill={C.blueMid} stroke={C.ink} strokeWidth={1.4} data-part="pvn" />
      <path d={sm(ell(182, 200, 24, 10, 10))} fill={C.blueMid} stroke={C.ink} strokeWidth={1.4} data-part="son" />
      {[[236, 196], [246, 184], [228, 176]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={5} fill={C.hi} stroke={C.ink} data-part="parvo" />
      ))}
      {/* Sella turcica */}
      <path d="M130 360 C140 470 380 470 400 360 L414 360 C400 490 120 490 116 360 Z" fill={C.t3} stroke={C.ink} strokeWidth={1.6} data-part="sella" />
      {/* Stalk */}
      <path d="M244 240 C250 280 258 310 262 340 L292 340 C286 300 280 270 280 240 Z" fill={C.t2} stroke={C.ink} strokeWidth={1.6} />
      <Solid d={sm([[150, 370], [200, 340], [262, 346], [276, 380], [262, 430], [200, 444], [156, 420]], true)} fill={C.hiSoft} u={u} part="anterior" />
      <Solid d={sm([[278, 344], [330, 346], [370, 380], [360, 430], [300, 436], [270, 410], [282, 380]], true)} fill={C.t2} u={u} part="posterior" />
      {[[190, 380], [214, 396], [236, 376], [200, 416], [228, 420]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={5} fill={C.paper} stroke={C.ink} strokeWidth={1} />
      ))}
      {/* Magnocellular axons */}
      <g fill="none" stroke={C.ink} strokeWidth={2} data-line="tract">
        <path d="M226 124 C250 200 280 300 312 380" data-line="tract" />
        <path d="M190 206 C240 240 270 300 300 396" data-line="tract" />
        <path d="M214 120 C244 220 270 320 326 410" data-line="tract" />
      </g>
      {/* Portal system */}
      <g fill="none" stroke={C.blue} strokeWidth={2.2}>
        <path d="M232 242 q8 -10 16 0 q8 -10 16 0" data-line="plexus" />
        <path d="M238 246 C240 290 236 320 226 352" data-line="portal" />
        <path d="M252 246 C254 290 250 330 240 360" data-line="portal" />
        <path d="M190 372 q10 -10 20 0 q10 -10 20 0 q10 -10 20 0 M180 400 q10 -10 20 0 q10 -10 20 0 q10 -10 20 0" strokeOpacity={0.7} />
      </g>
      <Note x={100} y={60} anchor="start" size={13}>Front</Note>
    </g>
  ),
  labels: [
    { id: "pvn", name: "Paraventricular nucleus", x: 220, y: 110, about: "Makes oxytocin and vasopressin (sent to the posterior lobe) and CRH for the stress axis (sent through the portal blood)." },
    { id: "son", name: "Supraoptic nucleus", x: 182, y: 200, about: "Makes mainly vasopressin (antidiuretic hormone), which tells the kidney to keep water." },
    { id: "parvo", name: "Releasing hormone cells", x: 236, y: 188, about: "Small neurons, including the arcuate nucleus, that release CRH, TRH, GnRH, GHRH, somatostatin and dopamine into the portal blood." },
    { id: "plexus", name: "Median eminence capillaries", x: 248, y: 240, about: "The first capillary bed, outside the blood-brain barrier, where releasing hormones enter the blood." },
    { id: "portal", name: "Portal vessels", x: 244, y: 300, about: "Carry the releasing hormones a short distance straight to the anterior pituitary." },
    { id: "anterior", name: "Anterior pituitary", x: 200, y: 400, about: "Glandular tissue releasing growth hormone, prolactin, ACTH, TSH, FSH and LH. Dopamine from the hypothalamus holds prolactin down, so dopamine blockers raise it." },
    { id: "tract", name: "Hypothalamo-hypophyseal tract", x: 290, y: 300, about: "Nerve fibres carrying oxytocin and vasopressin down the stalk to be stored in the posterior lobe." },
    { id: "posterior", name: "Posterior pituitary", x: 320, y: 396, about: "Neural tissue that releases oxytocin (birth, milk let-down, bonding) and vasopressin into the blood. Lithium blocks vasopressin's effect on the kidney (nephrogenic diabetes insipidus)." },
    { id: "chiasm", name: "Optic chiasm", x: 160, y: 228, about: "Lies just above the pituitary, so a growing tumour presses on it and narrows the outer visual fields." },
    { id: "sella", name: "Sella turcica", x: 300, y: 460, about: "The saddle of bone in the skull base holding the gland." },
  ],
};

/* ---------------------------------------------------------- Gut-brain ---- */
export const gutBrain: FigureDef = {
  id: "gut-brain",
  title: "The gut-brain axis",
  viewBox: "40 0 520 560",
  summary: "A body with the brain, brainstem, vagus nerve, stomach and intestines, and a close-up of the gut wall with bacteria, the lining cells, serotonin-making cells, immune cells and the gut's own nerve network.",
  art: (u) => (
    <g>
      <g transform="translate(0 0) scale(0.78)">
        <Body u={u}>
          <path d={ORG.brain} fill={C.t2} stroke={C.ink} strokeWidth={1.4} data-part="brain" />
          <path d="M196 90 L196 110 L204 110 L204 90 Z" fill={C.t3} stroke={C.ink} data-part="brainstem" />
          <path d={ORG.liver} fill={C.t2} stroke={C.ink} strokeOpacity={0.4} opacity={0.5} />
          <path d={ORG.stomach} fill={C.t2} stroke={C.ink} strokeWidth={1.4} />
          <path d={ORG.colon} fill="none" stroke={C.ink} strokeWidth={14} strokeLinecap="round" />
          <path d={ORG.colon} fill="none" stroke={C.hiSoft} strokeWidth={10} strokeLinecap="round" data-line="microbiota" />
          <path d={ORG.gut} fill="none" stroke={C.ink} strokeWidth={8} />
          <path d={ORG.gut} fill="none" stroke={C.t2} strokeWidth={5} data-line="gut" />
          <Mirror cx={200}>
            <path d="M196 106 C180 140 182 200 190 260 C196 300 190 340 180 380" stroke={C.blue} strokeWidth={3} fill="none" data-line="vagus" />
            <path d={ORG.adrenal} fill={C.hiSoft} stroke={C.ink} strokeWidth={1.4} data-part="adrenal" />
          </Mirror>
        </Body>
      </g>
      {/* Close-up of the gut wall */}
      <defs>
        <clipPath id={u("inset")}>
          <circle cx={420} cy={330} r={128} />
        </clipPath>
      </defs>
      <circle cx={420} cy={330} r={130} fill={C.paper} stroke={C.ink} strokeWidth={2} />
      <g clipPath={`url(#${u("inset")})`}>
      <path d="M170 300 L292 300" stroke={C.ink} strokeOpacity={0.3} strokeDasharray="4 4" />
      <path d="M296 300 C330 296 360 296 400 300 C440 304 480 304 546 300 L546 210 L296 210 Z" fill={C.hiSoft} fillOpacity={0.5} />
      {[[320, 240], [340, 266], [366, 232], [392, 256], [420, 236], [446, 262], [470, 240], [496, 260], [350, 218], [430, 216], [380, 280], [460, 282]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={7} ry={4} transform={`rotate(${i * 37} ${x} ${y})`} fill={C.t3} stroke={C.ink} strokeWidth={1} data-part="bacteria" />
      ))}
      {Array.from({ length: 10 }, (_, i) => 300 + i * 24).map((x, i) => (
        <rect key={x} x={x} y={300} width={22} height={40} rx={3} fill={i === 4 ? C.blueMid : C.t2} stroke={C.ink} strokeWidth={1.2} data-part={i === 4 ? "ec" : "lining"} />
      ))}
      {[[340, 362], [420, 370], [480, 360]].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r={9} fill={C.t3} stroke={C.ink} strokeWidth={1.2} data-part="immune" />
          <circle cx={x} cy={y} r={3} fill={C.ink} />
        </g>
      ))}
      <path d="M310 400 C340 390 360 410 390 400 C420 390 440 410 470 400 C500 390 520 404 534 400 M330 400 L340 420 M380 402 L384 424 M440 402 L436 424 M490 398 L496 418" stroke={C.ink} strokeWidth={2.2} fill="none" data-line="ens" />
      {[340, 384, 436, 494].map((x) => (
        <circle key={x} cx={x} cy={421} r={4} fill={C.t4} />
      ))}
      <path d="M396 336 C396 380 400 420 404 456" stroke={C.blue} strokeWidth={3} fill="none" data-line="vagus" />
      </g>
      <Note x={420} y={192} size={13}>The gut wall, close up</Note>
    </g>
  ),
  labels: [
    { id: "brain", name: "Brain", x: 156, y: 48, about: "Sends stress signals to the gut and receives signals back; anxiety and depression often come with gut symptoms such as irritable bowel syndrome." },
    { id: "brainstem", name: "Solitary nucleus", x: 156, y: 78, about: "In the brainstem, where the vagus delivers gut signals to the brain." },
    { id: "vagus", name: "Vagus nerve", x: 146, y: 180, about: "The main two-way link; most of its fibres carry information from the gut to the brain." },
    { id: "adrenal", name: "Stress hormones", x: 132, y: 252, about: "Cortisol and adrenaline from the stress system make the gut lining leakier and change the bacteria." },
    { id: "microbiota", name: "Gut bacteria", x: 120, y: 316, about: "Trillions of microbes in the colon that make short-chain fatty acids and transmitter building blocks and train the immune system. Altered gut bacteria are reported in depression and autism, but cause and effect are not settled." },
    { id: "bacteria", name: "Microbes in the gut", x: 392, y: 256, about: "Live in the gut contents next to the lining and digest fibre into short-chain fatty acids." },
    { id: "lining", name: "Gut lining", x: 330, y: 320, about: "A single layer of cells sealed by tight junctions; stress and inflammation can loosen it (a leaky gut)." },
    { id: "ec", name: "Serotonin-making cells", x: 407, y: 320, about: "Enterochromaffin cells make about nine tenths of the body's serotonin, which moves the gut. This is why SSRIs often cause nausea and diarrhoea at first." },
    { id: "immune", name: "Immune cells", x: 420, y: 370, about: "Release cytokines that can reach the brain and cause sickness behaviour such as fatigue and low mood." },
    { id: "ens", name: "Enteric nervous system", x: 470, y: 402, about: "The gut's own net of about half a billion neurons, which can run digestion by itself; sometimes called the second brain." },
  ],
};
