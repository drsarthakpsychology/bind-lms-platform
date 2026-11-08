import type { FigureDef } from "../types";
import { C, Groove, LAT, LateralBrain, MED, MedialBrain, Note } from "./kit";

export const brainLateral: FigureDef = {
  id: "brain-lateral",
  title: "The brain from the side: lobes, gyri and sulci",
  viewBox: "60 30 510 410",
  summary: "The left side of the brain with the four lobes, the central and lateral sulci, the main gyri, the cerebellum and the brainstem.",
  art: (u) => (
    <LateralBrain
      u={u}
      lobes
      over={
        <g pointerEvents="none">
          <Groove d={LAT.poLine} w={1.6} o={0.6} dash="6 6" />
          <Groove d={LAT.tpLine} w={1.6} o={0.6} dash="6 6" />
          <Note x={92} y={60} anchor="start">Front</Note>
          <Note x={560} y={420} anchor="end">Back</Note>
        </g>
      }
    >
      <path d={LAT.precentralGyrus} fill={C.blueMid} fillOpacity={0.35} data-part="precentral" />
      <path d={LAT.postcentralGyrus} fill={C.hi} fillOpacity={0.35} data-part="postcentral" />
      <path d={LAT.stg} fill={C.t3} fillOpacity={0.5} data-part="stg" />
      <path d={LAT.ifg} fill={C.blueMid} fillOpacity={0.18} data-part="ifg" />
    </LateralBrain>
  ),
  labels: [
    { id: "frontal", name: "Frontal lobe", x: 160, y: 120, about: "Plans, decides, controls impulses and moves the body. Damage changes personality and judgement, as in frontal dementia or a frontal head injury." },
    { id: "sfg", name: "Superior frontal gyrus", x: 205, y: 82, about: "The top band of the frontal lobe, part of the planning and self-control network. It holds part of the supplementary motor area near the midline." },
    { id: "mfg", name: "Middle frontal gyrus", x: 140, y: 150, about: "Holds much of the dorsolateral prefrontal cortex, used for working memory and planning. It is the usual target for rTMS in depression." },
    { id: "ifg", name: "Inferior frontal gyrus", x: 170, y: 212, about: "The lowest frontal band. On the left side its back part is Broca's area, needed to produce fluent speech." },
    { id: "precentral", name: "Precentral gyrus", x: 292, y: 110, about: "The primary motor cortex, which sends the commands for voluntary movement. A stroke here weakens the opposite side of the body." },
    { id: "central", name: "Central sulcus", x: 318, y: 112, about: "The deep groove between the frontal and parietal lobes, separating movement in front from body sensation behind." },
    { id: "postcentral", name: "Postcentral gyrus", x: 345, y: 118, about: "The primary somatosensory cortex, which feels touch, pain, temperature and position from the opposite side of the body." },
    { id: "parietal", name: "Parietal lobe", x: 430, y: 108, about: "Joins touch, vision and space into a sense of where things and the body are. Right parietal damage can cause neglect of the left side." },
    { id: "supramarginal", name: "Supramarginal gyrus", x: 405, y: 196, about: "Curves around the end of the lateral sulcus. On the left it helps with phonology and repeating words; damage nearby gives conduction aphasia." },
    { id: "angular", name: "Angular gyrus", x: 460, y: 200, about: "Curves around the end of the superior temporal sulcus and links written words to their sounds and meanings. Left damage can cause problems with reading, writing and arithmetic." },
    { id: "lateral", name: "Lateral sulcus", x: 300, y: 228, about: "The deep sideways fissure that separates the temporal lobe below from the frontal and parietal lobes above. The insula lies hidden in its depth." },
    { id: "stg", name: "Superior temporal gyrus", x: 300, y: 252, about: "Holds the hearing cortex. On the left its back part is Wernicke's area, needed to understand speech." },
    { id: "temporal", name: "Temporal lobe", x: 320, y: 292, about: "Hearing, language understanding, memory and recognising objects and faces. Its inner part holds the hippocampus and amygdala." },
    { id: "occipital", name: "Occipital lobe", x: 525, y: 220, about: "The visual cortex. Damage causes loss of part of the field of vision or problems recognising what is seen." },
    { id: "cerebellum", name: "Cerebellum", x: 480, y: 345, about: "Coordinates movement, balance and timing, and helps some thinking. Damage gives an unsteady gait and clumsy hands, as in alcohol misuse." },
    { id: "brainstem", name: "Brainstem", x: 362, y: 400, about: "Connects the brain to the spinal cord and runs breathing, heart rate, sleep and wakefulness. Damage here can be life threatening." },
  ],
};

export const brainMedial: FigureDef = {
  id: "brain-medial",
  title: "The brain cut down the middle",
  viewBox: "60 30 510 410",
  summary: "The inside surface of one half of the brain, cut down the midline, with the corpus callosum, the deep structures, the brainstem and the cerebellum.",
  art: (u) => (
    <MedialBrain u={u} over={<g pointerEvents="none"><Note x={96} y={64} anchor="start">Front</Note></g>}>
      <path d={MED.cingulateSulcus + " L404 132 C380 118 330 112 290 114 C250 116 210 128 196 150 C186 172 196 196 214 214 Z"} fill={C.hiSoft} fillOpacity={0.5} data-part="cingulate" />
    </MedialBrain>
  ),
  labels: [
    { id: "cingulate", name: "Cingulate gyrus", x: 250, y: 112, about: "The belt of cortex above the corpus callosum, part of the limbic system. Its front part (the anterior cingulate) notices conflict, pain and errors and is overactive in some anxiety and OCD." },
    { id: "cc", name: "Corpus callosum", x: 320, y: 126, about: "The thick bridge of nerve fibres joining the left and right hemispheres. When it is cut, as in split brain surgery, each half can no longer share what it knows." },
    { id: "septum", name: "Septum pellucidum", x: 262, y: 160, about: "A thin sheet between the two lateral ventricles. An unusually wide cavity here is a minor developmental marker sometimes seen in schizophrenia and boxers." },
    { id: "fornix", name: "Fornix", x: 268, y: 184, about: "An arch of fibres carrying output from the hippocampus to the mammillary bodies. Damage to it causes memory loss like hippocampal damage." },
    { id: "thalamus", name: "Thalamus", x: 340, y: 210, about: "The relay station that passes almost all sensory signals except smell up to the cortex, and helps set alertness. Thalamic strokes can cause pain and memory problems." },
    { id: "hypothalamus", name: "Hypothalamus", x: 268, y: 238, about: "Controls hunger, thirst, temperature, sleep, sex drive and hormones through the pituitary. It drives the stress response." },
    { id: "chiasm", name: "Optic chiasm", x: 238, y: 258, about: "Where half the fibres of each optic nerve cross over. A pituitary tumour pressing here causes loss of the outer half of vision in both eyes." },
    { id: "pituitary", name: "Pituitary gland", x: 248, y: 298, about: "The master gland that hangs below the hypothalamus and releases hormones that control the thyroid, adrenals, growth, breast milk and the sex glands." },
    { id: "mammillary", name: "Mammillary body", x: 278, y: 266, about: "A small round relay in the memory circuit. It shrinks in thiamine deficiency, giving the memory loss of Korsakoff syndrome." },
    { id: "pineal", name: "Pineal gland", x: 400, y: 206, about: "Releases melatonin in darkness to signal night to the body. It often calcifies with age and shows on scans." },
    { id: "midbrain", name: "Midbrain", x: 360, y: 252, about: "The top of the brainstem. It holds the substantia nigra and ventral tegmental area, the sources of dopamine, and centres for eye movements." },
    { id: "pons", name: "Pons", x: 312, y: 316, about: "The bulge of the brainstem that relays signals to the cerebellum and helps control breathing and REM sleep." },
    { id: "v4", name: "Fourth ventricle", x: 384, y: 320, about: "A fluid space between the brainstem and cerebellum. A block here causes fluid to build up in the brain (hydrocephalus)." },
    { id: "cerebellum", name: "Cerebellum", x: 490, y: 340, about: "Fine tunes movement, balance and timing. The white branching pattern inside is called the tree of life." },
    { id: "calcarine", name: "Calcarine sulcus", x: 480, y: 214, about: "The groove where the primary visual cortex lies. Damage here causes loss of vision in the opposite half of the visual field." },
    { id: "po", name: "Parieto-occipital sulcus", x: 446, y: 140, about: "The groove on the inner surface that separates the parietal lobe in front from the occipital lobe behind." },
  ],
};
