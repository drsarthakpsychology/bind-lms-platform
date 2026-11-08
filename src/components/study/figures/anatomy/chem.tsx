import type { FigureDef, FigureUid } from "../types";
import { C, Groove, MedialBrain, Note, Shade, ell, sm, tube } from "./kit";

/*
 * Transmitter systems, sleep centres, the hypothalamus and the limbic system,
 * drawn on the midline brain (front on the left, viewBox 60 30 510 410).
 * References checked: Stahl's Essential Psychopharmacology (local copy) for
 * the four dopamine pathways (nigrostriatal, mesolimbic, mesocortical,
 * tuberoinfundibular), raphe and locus coeruleus projections, and cholinergic
 * projections from the basal forebrain and brainstem (grep "mesocortical",
 * "raphe", "locus coeruleus", "nucleus basalis"); Kaplan and Sadock sleep
 * chapter (local copy, grep "ventrolateral preoptic", "orexin") for the sleep
 * switch; OpenStax Psychology 2e, 3.4 (limbic system) and Bear, Connors and
 * Paradiso chapter on emotion (Papez circuit: hippocampus, fornix, mammillary
 * body, anterior thalamus, cingulate cortex, back to the hippocampus);
 * LeDoux's low and high road for fear as described in Kaplan and Sadock.
 * Lateral structures (striatum, amygdala, hippocampus) are drawn dashed, as
 * they lie to the side of the midline cut.
 */

/** Lateral structures projected onto the midline view, dashed. */
const GHOST = {
  striatum: sm([[214, 184], [236, 168], [276, 170], [300, 184], [296, 206], [262, 214], [230, 222], [212, 210]], true),
  accumbens: sm(ell(234, 228, 12, 9, 10)),
  amygdala: sm(ell(276, 290, 16, 12, 10)),
  hippocampus: tube([[288, 296], [320, 302], [356, 296], [384, 278], [398, 252]], [18, 18, 16, 14, 10]),
};

function Ghost({ k, part, fill = C.t2 }: { k: keyof typeof GHOST; part?: string; fill?: string }) {
  return <path d={GHOST[k]} fill={fill} fillOpacity={0.75} stroke={C.ink} strokeWidth={1.6} strokeDasharray="5 4" data-part={part ?? k} />;
}

const arrow = (u: FigureUid, ink = false) => `url(#${u(ink ? "arrowInk" : "arrow")})`;

export const dopaminePathways: FigureDef = {
  id: "dopamine-pathways",
  title: "The four dopamine pathways",
  viewBox: "60 30 510 410",
  summary: "The midline brain with the substantia nigra and ventral tegmental area and the four dopamine pathways: nigrostriatal, mesolimbic, mesocortical and tuberoinfundibular.",
  art: (u) => (
    <MedialBrain
      u={u}
      over={
        <g>
          <Ghost k="striatum" />
          <Ghost k="accumbens" fill={C.hiSoft} />
          <path d={sm(ell(344, 262, 12, 6, 8, 0.3))} fill={C.ink} fillOpacity={0.8} data-part="snc" />
          <path d={sm(ell(318, 262, 11, 7, 8))} fill={C.blue} stroke={C.ink} data-part="vta" />
          <circle cx={262} cy={252} r={6} fill={C.blueMid} stroke={C.ink} data-part="arcuate" />
          <g fill="none" strokeLinecap="round">
            <path d="M344 256 C340 230 310 214 280 200" stroke={C.ink} strokeWidth={4} markerEnd={arrow(u, true)} data-line="nigrostriatal" />
            <path d="M312 258 C290 250 260 240 244 232" stroke={C.line} strokeWidth={4} markerEnd={arrow(u)} data-line="mesolimbic" />
            <path d="M318 256 C300 230 270 190 230 160 C200 140 170 130 140 140" stroke={C.line} strokeWidth={4} strokeDasharray="8 5" markerEnd={arrow(u)} data-line="mesocortical" />
            <path d="M262 258 C260 268 258 276 256 284" stroke={C.ink} strokeWidth={3.4} markerEnd={arrow(u, true)} data-line="tuberoinfundibular" />
          </g>
          <Note x={140} y={120} size={13}>Prefrontal cortex</Note>
        </g>
      }
    />
  ),
  labels: [
    { id: "snc", name: "Substantia nigra", x: 344, y: 262, about: "Dopamine cell bodies in the midbrain that supply the striatum." },
    { id: "vta", name: "Ventral tegmental area", x: 318, y: 262, about: "Dopamine cell bodies for the reward and thinking pathways." },
    { id: "nigrostriatal", name: "Nigrostriatal pathway", x: 316, y: 220, about: "To the striatum, for movement. Blocking D2 receptors here causes parkinsonism, dystonia, akathisia and, over years, tardive dyskinesia." },
    { id: "striatum", name: "Striatum", x: 256, y: 190, about: "The caudate and putamen (lying to the side of the cut, dashed), the target of the nigrostriatal pathway." },
    { id: "mesolimbic", name: "Mesolimbic pathway", x: 278, y: 244, about: "To the nucleus accumbens, for reward and salience. Overactivity is linked to delusions and hallucinations, and blocking it is how antipsychotics treat them; drugs of misuse all raise dopamine here." },
    { id: "accumbens", name: "Nucleus accumbens", x: 234, y: 228, about: "The reward hub of the ventral striatum." },
    { id: "mesocortical", name: "Mesocortical pathway", x: 230, y: 160, about: "To the prefrontal cortex, for motivation, attention and working memory. Underactivity is linked to negative and cognitive symptoms, which D2 blockers can worsen." },
    { id: "arcuate", name: "Arcuate nucleus", x: 262, y: 252, about: "Hypothalamic dopamine neurons that start the tuberoinfundibular pathway." },
    { id: "tuberoinfundibular", name: "Tuberoinfundibular pathway", x: 258, y: 272, about: "To the pituitary, where dopamine holds prolactin down. Blocking it raises prolactin, causing breast milk, missed periods and sexual problems, especially with risperidone and amisulpride." },
  ],
};

export const serotoninProjections: FigureDef = {
  id: "serotonin-projections",
  title: "Serotonin projections from the raphe nuclei",
  viewBox: "60 30 510 410",
  summary: "The raphe nuclei along the midline of the brainstem and their serotonin projections to the cortex, basal ganglia, limbic system, hypothalamus, cerebellum and spinal cord.",
  art: (u) => (
    <MedialBrain
      u={u}
      over={
        <g>
          <Ghost k="striatum" />
          <Ghost k="hippocampus" />
          {[[352, 256, "dorsal"], [346, 282, "median"], [340, 330, "caudal"], [338, 372, "caudal"]].map(([x, y, id]) => (
            <circle key={`${x}${y}`} cx={x as number} cy={y as number} r={7} fill={C.hi} stroke={C.ink} strokeWidth={1.6} data-part={id as string} />
          ))}
          <g fill="none" strokeLinecap="round" strokeWidth={3}>
            {[[150, 120], [240, 80], [340, 70], [440, 100], [500, 180]].map(([x, y]) => (
              <path key={x} d={`M352 250 C${(352 + x) / 2} ${Math.min(y, 250) + 60} ${x + 10} ${y + 40} ${x} ${y}`} stroke={C.line} markerEnd={arrow(u)} data-line="cortex" />
            ))}
            <path d="M348 254 C320 230 290 214 270 204" stroke={C.line} markerEnd={arrow(u)} data-line="bg" />
            <path d="M346 288 C340 296 340 298 336 300" stroke={C.line} markerEnd={arrow(u)} data-line="limbic" />
            <path d="M344 276 C320 262 300 254 288 250" stroke={C.line} markerEnd={arrow(u)} data-line="hypo" />
            <path d="M350 320 C380 314 420 310 460 316" stroke={C.ink} markerEnd={arrow(u, true)} data-line="cerebellum" />
            <path d="M338 380 C340 400 340 420 340 438" stroke={C.ink} markerEnd={arrow(u, true)} data-line="spinal" />
          </g>
        </g>
      }
    />
  ),
  labels: [
    { id: "dorsal", name: "Dorsal raphe", x: 352, y: 256, about: "The largest serotonin nucleus, in the midbrain; it supplies the cortex and striatum and is a key site of SSRI action." },
    { id: "median", name: "Median raphe", x: 346, y: 282, about: "Supplies the hippocampus and septum; linked to anxiety and resilience to stress." },
    { id: "caudal", name: "Lower raphe nuclei", x: 340, y: 330, about: "In the pons and medulla; they project to the cerebellum and down the spinal cord to damp pain signals and drive motor neurons." },
    { id: "cortex", name: "To the cortex", x: 240, y: 120, about: "Serotonin in the prefrontal cortex shapes mood, impulse control and anxiety; 5-HT2A receptors here are where psychedelics act and where many atypical antipsychotics block." },
    { id: "bg", name: "To the basal ganglia", x: 300, y: 228, about: "Serotonin damps dopamine release in the striatum, one reason SSRIs can cause apathy or restlessness and 5-HT2A block eases parkinsonism." },
    { id: "limbic", name: "To the hippocampus", x: 330, y: 298, about: "Supports new nerve cell growth and stress coping, thought to contribute to the slow effect of antidepressants." },
    { id: "hypo", name: "To the hypothalamus", x: 300, y: 252, about: "Influences appetite, sleep, body temperature and sex drive; serotonin syndrome includes fever and agitation." },
    { id: "cerebellum", name: "To the cerebellum", x: 420, y: 312, about: "Part of the descending and cerebellar projections." },
    { id: "spinal", name: "To the spinal cord", x: 340, y: 420, about: "Damps pain signals and affects sexual reflexes, explaining why SNRIs help nerve pain and SSRIs delay orgasm." },
  ],
};

export const noradrenalineProjections: FigureDef = {
  id: "noradrenaline-projections",
  title: "Noradrenaline projections from the locus coeruleus",
  viewBox: "60 30 510 410",
  summary: "The locus coeruleus in the upper pons and its noradrenaline projections to the whole cortex, thalamus, hypothalamus, hippocampus and amygdala, cerebellum and spinal cord.",
  art: (u) => (
    <MedialBrain
      u={u}
      over={
        <g>
          <Ghost k="hippocampus" />
          <Ghost k="amygdala" />
          <path d={sm(ell(370, 300, 9, 6, 8, 0.6))} fill={C.blue} stroke={C.ink} strokeWidth={1.6} data-part="lc" />
          <g fill="none" strokeLinecap="round" strokeWidth={3}>
            <path d="M366 292 C360 250 350 220 340 180 C320 120 260 90 180 110" stroke={C.line} markerEnd={arrow(u)} data-line="cortex" />
            <path d="M350 200 C380 150 420 130 470 140" stroke={C.line} markerEnd={arrow(u)} data-line="cortex" />
            <path d="M340 190 C330 150 310 110 300 80" stroke={C.line} markerEnd={arrow(u)} data-line="cortex" />
            <path d="M364 294 C350 260 340 240 334 220" stroke={C.ink} markerEnd={arrow(u, true)} data-line="thalamus" />
            <path d="M362 300 C330 280 300 262 290 254" stroke={C.ink} markerEnd={arrow(u, true)} data-line="hypo" />
            <path d="M362 306 C330 310 310 304 292 296" stroke={C.ink} markerEnd={arrow(u, true)} data-line="limbic" />
            <path d="M378 304 C420 300 450 304 480 320" stroke={C.ink} markerEnd={arrow(u, true)} data-line="cerebellum" />
            <path d="M366 308 C350 340 344 390 342 436" stroke={C.ink} markerEnd={arrow(u, true)} data-line="spinal" />
          </g>
        </g>
      }
    />
  ),
  labels: [
    { id: "lc", name: "Locus coeruleus", x: 370, y: 300, about: "About 15,000 neurons on each side, yet they reach almost the whole brain. They fire in alarm and alertness, very fast in panic, PTSD and opioid withdrawal." },
    { id: "cortex", name: "To the cortex", x: 300, y: 100, about: "Sharpens attention and working memory in the prefrontal cortex through alpha 2A receptors, where guanfacine and clonidine act in ADHD; too much impairs it." },
    { id: "thalamus", name: "To the thalamus", x: 340, y: 232, about: "Helps keep the brain awake and alert; it falls silent during REM sleep." },
    { id: "hypo", name: "To the hypothalamus", x: 300, y: 256, about: "Drives the stress hormone response and the sympathetic body response." },
    { id: "limbic", name: "To amygdala and hippocampus", x: 300, y: 296, about: "Strengthens emotional memories of frightening events, which beta blockers such as propranolol can damp." },
    { id: "amygdala", name: "Amygdala", x: 276, y: 290, about: "Lies to the side of the cut (dashed); noradrenaline here boosts fear learning." },
    { id: "cerebellum", name: "To the cerebellum", x: 450, y: 306, about: "Noradrenaline also reaches the cerebellum." },
    { id: "spinal", name: "To the spinal cord", x: 344, y: 410, about: "Descending fibres damp pain, part of how SNRIs and tricyclics relieve nerve pain." },
  ],
};

export const cholinergicProjections: FigureDef = {
  id: "cholinergic-projections",
  title: "Acetylcholine pathways of the brain",
  viewBox: "60 30 510 410",
  summary: "The basal forebrain nucleus basalis and medial septum sending acetylcholine to the cortex and hippocampus, and the brainstem pedunculopontine and laterodorsal tegmental nuclei sending it to the thalamus.",
  art: (u) => (
    <MedialBrain
      u={u}
      over={
        <g>
          <Ghost k="hippocampus" />
          <Ghost k="striatum" />
          <circle cx={240} cy={236} r={8} fill={C.hi} stroke={C.ink} strokeWidth={1.6} data-part="nbm" />
          <circle cx={226} cy={200} r={7} fill={C.hi} stroke={C.ink} strokeWidth={1.6} data-part="septum-ach" />
          <circle cx={362} cy={286} r={8} fill={C.blue} stroke={C.ink} strokeWidth={1.6} data-part="ppt" />
          <g fill="none" strokeLinecap="round" strokeWidth={3}>
            {[[130, 160], [190, 80], [300, 64], [410, 80], [500, 170]].map(([x, y]) => (
              <path key={x} d={`M238 228 C${(238 + x) / 2 - 10} ${(228 + y) / 2 + 30} ${x} ${y + 40} ${x} ${y}`} stroke={C.line} markerEnd={arrow(u)} data-line="cortex" />
            ))}
            <path d="M224 206 C250 260 300 300 330 302" stroke={C.ink} markerEnd={arrow(u, true)} data-line="septohip" />
            <path d="M358 280 C350 260 342 240 336 224" stroke={C.ink} markerEnd={arrow(u, true)} data-line="ppt-thal" />
          </g>
        </g>
      }
    />
  ),
  labels: [
    { id: "nbm", name: "Nucleus basalis", x: 240, y: 236, about: "Basal forebrain neurons that bathe the whole cortex in acetylcholine for attention and memory. They are lost early in Alzheimer's disease, the reason for donepezil, rivastigmine and galantamine." },
    { id: "cortex", name: "To the cortex", x: 300, y: 104, about: "Acetylcholine sharpens attention and learning; anticholinergic drugs cause confusion and delirium, especially in older people." },
    { id: "septum-ach", name: "Medial septum", x: 226, y: 200, about: "Sends acetylcholine to the hippocampus, setting its theta rhythm for memory." },
    { id: "septohip", name: "To the hippocampus", x: 290, y: 288, about: "The septohippocampal pathway; its loss contributes to memory failure in dementia." },
    { id: "hippocampus", name: "Hippocampus", x: 356, y: 296, about: "Lies to the side of the cut (dashed)." },
    { id: "ppt", name: "PPT and LDT", x: 362, y: 286, about: "Brainstem cholinergic nuclei that drive wakefulness and REM sleep." },
    { id: "ppt-thal", name: "To the thalamus", x: 346, y: 254, about: "Opens the thalamic gate in waking and REM sleep, part of the arousal system." },
    { id: "striatum", name: "Striatal interneurons", x: 256, y: 190, about: "Local acetylcholine neurons in the striatum balance dopamine; anticholinergics such as procyclidine ease antipsychotic stiffness for this reason." },
  ],
};

export const sleepCentres: FigureDef = {
  id: "sleep-centres",
  title: "The brain's sleep and wake centres",
  viewBox: "60 30 510 410",
  summary: "The midline brain with the suprachiasmatic nucleus (body clock), the sleep-promoting ventrolateral preoptic nucleus, orexin neurons, the histamine, noradrenaline, serotonin and acetylcholine wake centres, and the pineal gland.",
  art: (u) => (
    <MedialBrain
      u={u}
      over={
        <g>
          <circle cx={246} cy={248} r={6} fill={C.hi} stroke={C.ink} strokeWidth={1.4} data-part="scn" />
          <circle cx={254} cy={232} r={6} fill={C.blueMid} stroke={C.ink} strokeWidth={1.4} data-part="vlpo" />
          <circle cx={282} cy={240} r={7} fill={C.blue} stroke={C.ink} strokeWidth={1.4} data-part="orexin" />
          <circle cx={290} cy={258} r={6} fill={C.t4} stroke={C.ink} strokeWidth={1.4} data-part="tmn" />
          <circle cx={352} cy={258} r={6} fill={C.hi} stroke={C.ink} strokeWidth={1.4} data-part="raphe" />
          <circle cx={362} cy={286} r={6} fill={C.t4} stroke={C.ink} strokeWidth={1.4} data-part="ppt" />
          <circle cx={370} cy={302} r={6} fill={C.blue} stroke={C.ink} strokeWidth={1.4} data-part="lc" />
          <g fill="none" strokeLinecap="round" strokeWidth={2.4}>
            <path d="M246 248 C320 220 380 210 398 206" stroke={C.ink} strokeDasharray="5 4" markerEnd={arrow(u, true)} data-line="melatonin" />
            <path d="M258 236 C290 250 320 270 350 280" stroke={C.line} strokeDasharray="3 4" markerEnd={arrow(u)} data-line="vlpo" />
          </g>
        </g>
      }
    />
  ),
  labels: [
    { id: "scn", name: "Suprachiasmatic nucleus", x: 246, y: 248, about: "The master body clock, just above the optic chiasm, set each day by light through the eyes. Shift work and jet lag put it out of step; disturbed rhythms are part of bipolar disorder." },
    { id: "vlpo", name: "VLPO (sleep switch)", x: 254, y: 232, about: "Sleep-promoting GABA neurons that switch off the wake centres; benzodiazepines and Z-drugs boost the same GABA brake." },
    { id: "orexin", name: "Orexin neurons", x: 282, y: 240, about: "In the lateral hypothalamus; they hold the wake state steady. Their loss causes narcolepsy, and suvorexant and lemborexant block orexin to aid sleep." },
    { id: "tmn", name: "Tuberomammillary nucleus", x: 290, y: 258, about: "Histamine wake neurons; blocking histamine H1 receptors (promethazine, mirtazapine, quetiapine) causes drowsiness." },
    { id: "raphe", name: "Raphe (serotonin)", x: 352, y: 258, about: "Active in waking, quieter in deep sleep and silent in REM sleep." },
    { id: "ppt", name: "PPT and LDT", x: 362, y: 286, about: "Acetylcholine neurons that switch on REM sleep and its dreaming." },
    { id: "lc", name: "Locus coeruleus", x: 370, y: 302, about: "Noradrenaline wake neurons, silent in REM sleep; prazosin calms them to reduce PTSD nightmares." },
    { id: "pineal", name: "Pineal gland", x: 404, y: 206, about: "Releases melatonin at night under the clock's control; melatonin given in the evening shifts the clock earlier." },
    { id: "melatonin", name: "Clock to pineal route", x: 330, y: 222, about: "The clock reaches the pineal by a long route through the spinal cord and sympathetic chain, drawn here as a short dashed line." },
  ],
};

/*
 * Hypothalamic nuclei on the wall of the third ventricle, close up.
 * References checked: Kenhub "Hypothalamus" (preoptic, supraoptic,
 * suprachiasmatic, paraventricular, anterior, dorsomedial, ventromedial,
 * arcuate, lateral, posterior, mammillary; tuberomammillary near the
 * mammillary body); OpenStax Anatomy and Physiology 2e, 17.3 (pituitary links).
 */
export const hypothalamus: FigureDef = {
  id: "hypothalamus",
  title: "The nuclei of the hypothalamus",
  viewBox: "20 20 520 400",
  summary: "A close-up of the hypothalamus on the wall of the third ventricle, front on the left, with its main nuclei, the optic chiasm, the pituitary stalk and gland and the mammillary body.",
  art: (u) => (
    <g>
      <Shade u={u} />
      <path d={sm([[80, 60], [260, 40], [460, 60], [500, 140], [470, 170], [320, 170], [150, 170], [90, 140]], true)} fill={C.t3} stroke={C.ink} strokeWidth={2} data-part="thalamus" />
      <path d={sm([[90, 170], [460, 170], [480, 230], [440, 300], [380, 320], [300, 330], [230, 340], [150, 320], [80, 270], [70, 210]], true)} fill={C.t1} stroke={C.ink} strokeWidth={2} />
      <Groove d="M90 172 C200 176 360 176 470 170" w={2} dash="6 5" part="sulcus" />
      <path d={sm(ell(96, 160, 16, 14, 10))} fill={C.paper} stroke={C.ink} strokeWidth={1.6} />
      <path d="M86 176 C80 220 84 270 100 310" stroke={C.ink} strokeWidth={2} fill="none" />
      <path d={sm(ell(126, 334, 34, 16, 12))} fill={C.paper} stroke={C.ink} strokeWidth={1.8} data-part="chiasm" />
      <path d="M236 338 C240 360 238 380 232 396" stroke={C.ink} strokeWidth={14} strokeLinecap="round" fill="none" />
      <path d="M236 338 C240 360 238 380 232 396" stroke={C.t2} strokeWidth={10} strokeLinecap="round" fill="none" data-line="stalk" />
      <path d={sm(ell(370, 318, 26, 22, 12))} fill={C.t3} stroke={C.ink} strokeWidth={1.8} data-part="mammillary" />
      {(
        [
          ["preoptic", 132, 230, 30, 24, C.t2],
          ["scn", 140, 304, 16, 11, C.hi],
          ["son", 182, 318, 26, 10, C.blueMid],
          ["pvn", 210, 208, 34, 22, C.blueSoft],
          ["anterior", 196, 262, 24, 20, C.t2],
          ["dmn", 290, 220, 30, 20, C.t2],
          ["vmn", 282, 276, 30, 24, C.hiSoft],
          ["arcuate", 248, 316, 22, 12, C.blueMid],
          ["lateral", 330, 250, 30, 24, C.t3],
          ["posterior", 400, 220, 34, 26, C.t2],
          ["tmn", 410, 286, 14, 10, C.t4],
        ] as const
      ).map(([id, x, y, rx, ry, f]) => (
        <path key={id} d={sm(ell(x, y, rx, ry, 12))} fill={f} stroke={C.ink} strokeWidth={1.4} strokeDasharray={id === "lateral" ? "5 4" : undefined} data-part={id} />
      ))}
      <Note x={96} y={130} size={13}>Anterior commissure</Note>
      <Note x={60} y={40} anchor="start" size={13}>Front</Note>
    </g>
  ),
  labels: [
    { id: "thalamus", name: "Thalamus", x: 280, y: 110, about: "Lies above the hypothalamic sulcus." },
    { id: "preoptic", name: "Preoptic area", x: 132, y: 230, about: "Holds the sleep switch (VLPO) and controls body temperature and sexual behaviour." },
    { id: "scn", name: "Suprachiasmatic nucleus", x: 140, y: 304, about: "The body clock, sitting on the optic chiasm to receive light signals." },
    { id: "son", name: "Supraoptic nucleus", x: 182, y: 318, about: "Makes vasopressin (antidiuretic hormone) for the posterior pituitary. Lithium blocks its action on the kidney, causing thirst and passing a lot of urine." },
    { id: "pvn", name: "Paraventricular nucleus", x: 210, y: 208, about: "Releases CRH to start the stress hormone (HPA) axis, and makes oxytocin and vasopressin." },
    { id: "anterior", name: "Anterior nucleus", x: 196, y: 262, about: "Helps cool the body and regulate sleep." },
    { id: "dmn", name: "Dorsomedial nucleus", x: 290, y: 220, about: "Links feeding, body clock and stress responses." },
    { id: "vmn", name: "Ventromedial nucleus", x: 282, y: 276, about: "The classic satiety centre; damage causes overeating and rage." },
    { id: "lateral", name: "Lateral hypothalamus", x: 330, y: 250, about: "The classic hunger centre (lying to the side, dashed), home of the orexin wake neurons." },
    { id: "arcuate", name: "Arcuate nucleus", x: 248, y: 316, about: "Senses leptin and insulin to control appetite, and its dopamine neurons hold prolactin down." },
    { id: "posterior", name: "Posterior nucleus", x: 400, y: 220, about: "Helps keep the body warm and awake." },
    { id: "tmn", name: "Tuberomammillary nucleus", x: 410, y: 286, about: "Histamine wake neurons; antihistamines sedate by blocking their signal." },
    { id: "mammillary", name: "Mammillary body", x: 370, y: 318, about: "Part of the memory circuit, damaged in Wernicke and Korsakoff syndrome." },
    { id: "chiasm", name: "Optic chiasm", x: 126, y: 334, about: "The crossing of the optic nerves under the front of the hypothalamus." },
    { id: "stalk", name: "Pituitary stalk", x: 238, y: 370, about: "Carries nerve fibres and portal blood vessels to the pituitary gland." },
  ],
};

export const limbicSystem: FigureDef = {
  id: "limbic-system",
  title: "The limbic system and the Papez circuit",
  viewBox: "60 30 510 410",
  summary: "The midline brain with the hippocampus, fornix, mammillary body, mammillothalamic tract, anterior thalamus, cingulate gyrus, parahippocampal gyrus and amygdala, and arrows round the Papez circuit.",
  art: (u) => (
    <MedialBrain
      u={u}
      over={
        <g>
          <path d="M214 214 C176 186 176 140 210 108 C270 92 340 90 396 98 L404 132 C380 118 330 112 290 114 C250 116 210 128 196 150 C186 172 196 196 214 214 Z" fill={C.hiSoft} fillOpacity={0.75} stroke={C.ink} strokeWidth={1.2} data-part="cingulate" />
          <path d={tube([[248, 300], [300, 312], [360, 312], [410, 296], [430, 270]], [22, 22, 20, 16, 12])} fill={C.t2} stroke={C.ink} strokeWidth={1.4} data-part="parahip" />
          <Ghost k="hippocampus" fill={C.blueSoft} />
          <Ghost k="amygdala" fill={C.hiSoft} />
          <path d="M280 262 C292 240 304 222 312 200" stroke={C.ink} strokeWidth={4} fill="none" data-line="mtt" />
          <circle cx={312} cy={196} r={8} fill={C.blue} stroke={C.ink} strokeWidth={1.4} data-part="anteriorthal" />
          <g fill="none" strokeLinecap="round" strokeWidth={3}>
            <path d="M398 250 C410 220 410 196 404 186" stroke={C.line} markerEnd={arrow(u)} />
            <path d="M262 236 C266 248 272 258 276 262" stroke={C.line} markerEnd={arrow(u)} />
            <path d="M316 188 C300 160 280 140 250 128" stroke={C.line} markerEnd={arrow(u)} />
            <path d="M400 118 C440 160 450 230 428 270" stroke={C.line} strokeDasharray="6 4" markerEnd={arrow(u)} data-line="cingulum" />
            <path d="M412 290 C400 296 390 298 380 298" stroke={C.line} markerEnd={arrow(u)} />
          </g>
        </g>
      }
    />
  ),
  labels: [
    { id: "hippocampus", name: "Hippocampus", x: 352, y: 296, about: "Lies in the medial temporal lobe (dashed, to the side of the cut). It forms new memories; damage on both sides, as in H.M., prevents new learning." },
    { id: "fornix", name: "Fornix", x: 300, y: 166, about: "Carries output from the hippocampus forward and down to the mammillary body." },
    { id: "mammillary", name: "Mammillary body", x: 278, y: 266, about: "A relay in the circuit, damaged by thiamine deficiency in Korsakoff syndrome." },
    { id: "mtt", name: "Mammillothalamic tract", x: 294, y: 232, about: "Links the mammillary body to the anterior thalamus." },
    { id: "anteriorthal", name: "Anterior thalamic nucleus", x: 312, y: 196, about: "The thalamic relay of the memory circuit; small strokes here cause sudden amnesia." },
    { id: "cingulate", name: "Cingulate gyrus", x: 250, y: 112, about: "Adds emotion and attention to memory; the anterior part is active in pain, conflict and low mood." },
    { id: "cingulum", name: "Cingulum bundle", x: 446, y: 200, about: "White matter running in the cingulate gyrus back round to the parahippocampal gyrus." },
    { id: "parahip", name: "Parahippocampal gyrus", x: 412, y: 296, about: "Holds the entorhinal cortex, the gateway into the hippocampus, where Alzheimer changes start." },
    { id: "amygdala", name: "Amygdala", x: 276, y: 290, about: "Not part of the original Papez circuit but central to the limbic system: it tags memories with emotion, especially fear." },
  ],
};

/*
 * Amygdala fear circuits, with a close-up of the amygdala's nuclei.
 * References checked: Kaplan and Sadock anxiety chapter (local copy, grep
 * "central nucleus", "LeDoux"): sensory thalamus to lateral amygdala directly
 * (low road) and through the cortex (high road); lateral and basal nuclei to
 * the central nucleus; outputs to the hypothalamus (HPA and sympathetic), the
 * periaqueductal grey (freezing) and the brainstem (startle, locus coeruleus);
 * ventromedial prefrontal cortex and hippocampus regulate it (extinction and
 * context).
 */
export const amygdalaFear: FigureDef = {
  id: "amygdala-fear",
  title: "The amygdala and the fear circuit",
  viewBox: "60 30 560 410",
  summary: "The midline brain with the amygdala, its fast route from the thalamus and slower route through the cortex, its outputs to the hypothalamus, periaqueductal grey and brainstem, and its regulation by the prefrontal cortex and hippocampus, with a close-up of its nuclei.",
  art: (u) => (
    <g>
      <MedialBrain u={u} />
      <path d="M200 140 C180 160 170 200 190 230 L210 220 C200 196 204 170 214 150 Z" fill={C.blueSoft} stroke={C.ink} strokeWidth={1.4} data-part="vmpfc" />
      <Ghost k="hippocampus" />
      <Ghost k="amygdala" fill={C.hiSoft} />
      <g fill="none" strokeLinecap="round" strokeWidth={3}>
        <path d="M318 222 C308 250 296 270 288 282" stroke={C.line} markerEnd={arrow(u)} data-line="low" />
        <path d="M330 186 C380 120 470 120 500 180 C510 240 420 300 296 292" stroke={C.line} strokeDasharray="8 5" markerEnd={arrow(u)} data-line="high" />
        <path d="M268 282 C262 266 262 256 266 248" stroke={C.ink} markerEnd={arrow(u, true)} data-line="tohypo" />
        <path d="M290 292 C320 290 340 276 350 262" stroke={C.ink} markerEnd={arrow(u, true)} data-line="topag" />
        <path d="M292 298 C320 320 334 340 340 360" stroke={C.ink} markerEnd={arrow(u, true)} data-line="tobrainstem" />
        <path d="M206 226 C230 250 250 270 262 282" stroke={C.blue} strokeWidth={3} markerEnd={arrow(u)} data-line="brake" />
      </g>
      {/* Close-up of the amygdala's nuclei */}
      <g>
        <circle cx={560} cy={110} r={58} fill={C.paper} stroke={C.ink} strokeWidth={1.6} />
        <path d="M276 290 L506 120" stroke={C.ink} strokeOpacity={0.3} strokeDasharray="3 4" />
        <path d={sm(ell(546, 84, 28, 18, 10, -0.3))} fill={C.hiSoft} stroke={C.ink} strokeWidth={1.4} data-part="la" />
        <path d={sm(ell(540, 128, 26, 18, 10, 0.2))} fill={C.t2} stroke={C.ink} strokeWidth={1.4} data-part="ba" />
        <path d={sm(ell(586, 108, 18, 26, 10))} fill={C.blueSoft} stroke={C.ink} strokeWidth={1.4} data-part="cea" />
        <path d="M562 96 L578 104 M556 126 L574 116" stroke={C.ink} strokeWidth={2} markerEnd={arrow(u, true)} />
      </g>
    </g>
  ),
  labels: [
    { id: "amygdala", name: "Amygdala", x: 276, y: 290, about: "The almond-shaped fear centre deep in the temporal lobe (dashed, to the side of the cut). It is overactive in anxiety disorders and PTSD." },
    { id: "low", name: "Low road (fast)", x: 304, y: 252, about: "Thalamus straight to amygdala: crude but fast, so you jump at a stick that looks like a snake before you know what it is." },
    { id: "high", name: "High road (slow)", x: 470, y: 160, about: "Thalamus to sensory cortex then to amygdala: slower but detailed, so you can tell it is only a stick." },
    { id: "la", name: "Lateral nucleus", x: 546, y: 84, about: "The input nucleus where the link between a cue and danger is learned, the cell basis of fear conditioning." },
    { id: "ba", name: "Basal nucleus", x: 540, y: 128, about: "Adds context and links with the prefrontal cortex and hippocampus." },
    { id: "cea", name: "Central nucleus", x: 586, y: 108, about: "The output nucleus that triggers the body's fear response." },
    { id: "tohypo", name: "To the hypothalamus", x: 264, y: 262, about: "Starts the stress hormones (HPA axis) and the racing heart and sweating of the sympathetic response." },
    { id: "topag", name: "To the periaqueductal grey", x: 330, y: 280, about: "Produces freezing and the defensive response." },
    { id: "tobrainstem", name: "To the brainstem", x: 330, y: 340, about: "Boosts startle and fires the locus coeruleus for alarm." },
    { id: "vmpfc", name: "Ventromedial prefrontal", x: 196, y: 190, about: "Brakes the amygdala and stores the memory that a cue is now safe (extinction), which exposure therapy builds; it is underactive in PTSD." },
    { id: "brake", name: "Prefrontal brake", x: 236, y: 256, about: "The calming route from the prefrontal cortex to the amygdala." },
    { id: "hippocampus", name: "Hippocampus", x: 352, y: 296, about: "Tells the amygdala the context: whether this place is dangerous or safe." },
  ],
};
