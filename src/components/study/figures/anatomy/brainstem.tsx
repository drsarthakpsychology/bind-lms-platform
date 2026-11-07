import type { FigureDef } from "../types";
import { C, Groove, MedialBrain, Mirror, Note, Shade, Solid, ell, sm, tube } from "./kit";

/*
 * Brainstem cross-sections at three levels, the cerebellum, the spinal cord,
 * the knee-jerk reflex and the reticular activating system.
 * References checked: OpenStax Anatomy and Physiology 2e, 13.2 (brainstem:
 * midbrain tectum and tegmentum, pons, medulla; reticular formation) and 13.4
 * (spinal cord grey horns and white columns, ascending and descending tracts);
 * OpenStax Anatomy and Physiology 2e, 14.5 "Sensory-Motor Integration" (stretch
 * reflex); Kenhub "Midbrain", "Pons" and "Medulla oblongata" cross-section
 * pages (positions of red nucleus, substantia nigra, oculomotor nucleus,
 * locus coeruleus, median raphe, inferior olive, hypoglossal and dorsal vagal
 * nuclei, nucleus of the solitary tract); Kaplan and Sadock (local copy, grep
 * "locus coeruleus", "raphe") for clinical links.
 */

/* ---- Midbrain at the level of the superior colliculus (dorsal at the top) ---- */
const MID = {
  half: sm([[230, 46], [204, 36], [170, 40], [140, 58], [116, 96], [104, 150], [96, 200], [74, 236], [72, 286], [110, 322], [170, 316], [206, 288], [224, 270], [230, 266]]) + " Z",
  crus: sm([[100, 222], [80, 258], [86, 300], [124, 318], [176, 306], [206, 280], [196, 262], [150, 252]], true),
  nigra: tube([[96, 214], [130, 236], [170, 248], [204, 258]], [10, 16, 16, 10]),
  red: sm(ell(186, 192, 24, 22, 12)),
  pag: sm(ell(230, 112, 44, 40, 14)),
  aqueduct: sm([[230, 96], [240, 112], [230, 128], [220, 112]], true),
  colliculus: sm([[176, 46], [204, 40], [226, 52], [222, 74], [196, 78], [168, 68]], true),
  cn3: sm(ell(218, 162, 10, 8, 8)),
  vta: sm(ell(216, 238, 14, 10, 8)),
  lemniscus: tube([[120, 168], [146, 200], [160, 226]], 9),
  cn3fibres: "M218 170 C214 200 216 236 226 266",
};

export const midbrainSection: FigureDef = {
  id: "midbrain-section",
  title: "The midbrain cut across",
  viewBox: "50 20 360 320",
  summary: "A cross-section of the upper midbrain with the superior colliculi, aqueduct, periaqueductal grey, oculomotor nuclei, red nuclei, substantia nigra, ventral tegmental area and the cerebral peduncles.",
  art: (u) => (
    <g>
      <Shade u={u} />
      <Mirror cx={230}>
        <Solid d={MID.half} fill={C.t1} u={u} shade="none" />
        <path d={MID.crus} fill={C.paper} stroke={C.ink} strokeWidth={1.4} data-part="crus" />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${110 + i * 24} ${268 + i * 6} q10 8 20 0`} stroke={C.ink} strokeOpacity={0.3} fill="none" />
        ))}
        <path d={MID.nigra} fill={C.ink} fillOpacity={0.72} stroke={C.ink} strokeWidth={1.2} data-part="nigra" />
        <path d={MID.red} fill={C.t3} stroke={C.ink} strokeWidth={1.6} data-part="red" />
        <path d={MID.lemniscus} fill={C.t2} stroke={C.ink} strokeWidth={1} data-part="lemniscus" />
        <path d={MID.colliculus} fill={C.t2} stroke={C.ink} strokeWidth={1.4} data-part="colliculus" />
        <path d={MID.vta} fill={C.hiSoft} stroke={C.ink} strokeWidth={1.4} data-part="vta" />
        <path d={MID.cn3fibres} stroke={C.blue} strokeWidth={2.4} fill="none" data-line="cn3" />
        <path d={MID.cn3} fill={C.blueSoft} stroke={C.ink} strokeWidth={1.4} data-part="cn3" />
      </Mirror>
      <path d={MID.pag} fill={C.t2} stroke={C.ink} strokeWidth={1.4} data-part="pag" />
      <path d={MID.aqueduct} fill={C.blueSoft} stroke={C.ink} strokeWidth={1.4} data-part="aqueduct" />
      <circle cx={230} cy={146} r={5} fill={C.t4} stroke={C.ink} data-part="raphe" />
      <Note x={230} y={30}>Back</Note>
      <Note x={230} y={336}>Front</Note>
    </g>
  ),
  labels: [
    { id: "colliculus", name: "Superior colliculus", x: 196, y: 58, about: "A visual reflex centre that turns the eyes and head towards something that suddenly appears." },
    { id: "aqueduct", name: "Cerebral aqueduct", x: 230, y: 112, about: "The narrow channel for fluid running down the middle of the midbrain." },
    { id: "pag", name: "Periaqueductal grey", x: 254, y: 96, about: "Grey matter round the aqueduct that controls pain, freezing, fight or flight and defensive behaviour, and holds many opioid receptors." },
    { id: "raphe", name: "Dorsal raphe", x: 230, y: 146, about: "The midline cluster of serotonin neurons that supply the forebrain. SSRIs act on their target synapses." },
    { id: "cn3", name: "Oculomotor nucleus", x: 218, y: 162, about: "Controls most eye movements, the eyelid and the pupil through the third nerve." },
    { id: "red", name: "Red nucleus", x: 182, y: 194, about: "A motor relay between the cerebellum and the spinal cord; damage here gives a coarse tremor." },
    { id: "lemniscus", name: "Medial lemniscus", x: 140, y: 196, about: "The touch and position pathway on its way up to the thalamus." },
    { id: "vta", name: "Ventral tegmental area", x: 216, y: 238, about: "Dopamine neurons that start the mesolimbic and mesocortical pathways, the core of reward and of psychosis theories." },
    { id: "nigra", name: "Substantia nigra", x: 130, y: 236, about: "Dark dopamine neurons of the nigrostriatal pathway; their death causes Parkinson's disease." },
    { id: "cn3out", name: "Third nerve fibres", x: 222, y: 250, about: "The oculomotor fibres run forward through the tegmentum to leave between the peduncles." },
    { id: "crus", name: "Cerebral peduncle", x: 120, y: 290, about: "The big ventral bundle carrying the motor fibres from the cortex down to the brainstem and spinal cord." },
  ],
};

/* ---- Upper pons (dorsal at the top) ---- */
const PONS = {
  half: sm([[230, 40], [196, 42], [150, 54], [110, 80], [60, 118], [44, 160], [60, 200], [70, 250], [100, 300], [160, 334], [230, 342]]) + " Z",
  v4: "M150 52 C190 90 210 98 230 100 C250 98 270 90 310 52 Z",
  scp: sm(ell(150, 86, 24, 14, 10, 0.5)),
  lc: sm(ell(186, 104, 9, 6, 8, 0.5)),
  mlf: sm(ell(214, 120, 7, 9, 8)),
  lemniscus: tube([[130, 192], [170, 200], [216, 202]], 12),
  basilar: sm([[230, 210], [180, 212], [120, 224], [80, 250], [100, 300], [160, 332], [230, 340]]) + " Z",
  mcp: sm([[60, 118], [24, 150], [20, 200], [60, 230], [76, 210], [64, 170]], true),
};

export const ponsSection: FigureDef = {
  id: "pons-section",
  title: "The upper pons cut across",
  viewBox: "10 20 440 340",
  summary: "A cross-section of the upper pons with the fourth ventricle, locus coeruleus, raphe, reticular formation, medial longitudinal fasciculus, medial lemniscus, the basilar pons with its motor fibres, and the cerebellar peduncles.",
  art: (u) => (
    <g>
      <Shade u={u} />
      <Mirror cx={230}>
        <Solid d={PONS.mcp} fill={C.t2} u={u} part="mcp" />
        <Solid d={PONS.half} fill={C.t1} u={u} shade="none" />
        <path d={PONS.basilar} fill={C.t2} stroke={C.ink} strokeWidth={1.2} data-part="basilar" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M230 ${226 + i * 18} C190 ${226 + i * 18} 130 ${232 + i * 14} 96 ${250 + i * 10}`} stroke={C.ink} strokeOpacity={0.25} fill="none" data-line="transverse" />
        ))}
        {[[200, 246], [166, 262], [200, 286], [150, 296], [184, 312]].map(([x, y]) => (
          <path key={`${x}${y}`} d={sm(ell(x, y, 12, 9, 8))} fill={C.paper} stroke={C.ink} strokeWidth={1.2} data-part="cst" />
        ))}
        <path d={PONS.scp} fill={C.paper} stroke={C.ink} strokeWidth={1.4} data-part="scp" />
        <path d={PONS.lemniscus} fill={C.paper} stroke={C.ink} strokeWidth={1.2} data-part="lemniscus" />
        <path d={PONS.mlf} fill={C.paper} stroke={C.ink} strokeWidth={1.2} data-part="mlf" />
        <path d={PONS.lc} fill={C.blue} stroke={C.ink} strokeWidth={1.2} data-part="lc" />
        {[[160, 140], [180, 160], [150, 170], [196, 146], [170, 182], [140, 150]].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={2.6} fill={C.ink} fillOpacity={0.45} data-part="rf" />
        ))}
      </Mirror>
      <path d={PONS.v4} fill={C.blueSoft} stroke={C.ink} strokeWidth={1.6} data-part="v4" />
      {[124, 144, 164, 184].map((y) => (
        <circle key={y} cx={230} cy={y} r={4} fill={C.hi} stroke={C.ink} data-part="raphe" />
      ))}
      <Note x={230} y={32}>Back (towards the cerebellum)</Note>
    </g>
  ),
  labels: [
    { id: "v4", name: "Fourth ventricle", x: 230, y: 74, about: "The fluid space between the pons and the cerebellum." },
    { id: "lc", name: "Locus coeruleus", x: 186, y: 104, about: "A small blue spot of noradrenaline neurons that wires the whole brain for alertness and alarm. It fires hard in panic and opioid withdrawal, which clonidine and lofexidine calm." },
    { id: "scp", name: "Superior cerebellar peduncle", x: 150, y: 86, about: "The output cable from the cerebellum to the thalamus and red nucleus." },
    { id: "mlf", name: "Medial longitudinal fasciculus", x: 214, y: 120, about: "Links the eye movement nuclei so both eyes move together; damage causes internuclear ophthalmoplegia, as in multiple sclerosis." },
    { id: "raphe", name: "Median raphe", x: 230, y: 164, about: "Midline serotonin neurons supplying the hippocampus and forebrain; they help regulate mood, sleep and anxiety." },
    { id: "rf", name: "Reticular formation", x: 160, y: 160, about: "A net of neurons in the core of the brainstem that keeps the cortex awake and controls sleep, posture and breathing." },
    { id: "lemniscus", name: "Medial lemniscus", x: 170, y: 200, about: "Carries touch and position sense to the thalamus." },
    { id: "basilar", name: "Basilar pons", x: 120, y: 262, about: "The bulging front of the pons, full of pontine nuclei and fibres crossing to the cerebellum. A large stroke here can cause locked-in syndrome." },
    { id: "cst", name: "Corticospinal fibres", x: 200, y: 286, about: "Bundles of motor fibres from the cortex passing down through the pons to the spinal cord." },
    { id: "transverse", name: "Transverse pontine fibres", x: 112, y: 256, about: "Fibres from the pontine nuclei crossing to the opposite cerebellum, carrying the cortex's plans for movement." },
    { id: "mcp", name: "Middle cerebellar peduncle", x: 40, y: 176, about: "The largest cerebellar peduncle, carrying the crossing pontine fibres into the cerebellum." },
  ],
};

/* ---- Open medulla at the level of the olive (dorsal at the top) ---- */
const MEDU = {
  half: sm([[230, 66], [196, 50], [150, 40], [110, 56], [80, 96], [72, 150], [70, 200], [86, 250], [120, 286], [176, 310], [216, 318], [230, 314]]) + " Z",
  v4: "M120 50 C170 80 210 92 230 94 C250 92 290 80 340 50 Z",
  olive: "M110 214 C102 236 116 262 146 266 C176 268 186 248 180 228 C186 216 172 204 158 210 C150 200 132 198 124 210 C118 204 112 206 110 214 Z",
  pyramid: sm([[230, 260], [200, 262], [192, 290], [206, 312], [230, 316]]) + " Z",
  lemniscus: tube([[220, 160], [218, 210], [216, 254]], 14),
  xii: sm(ell(214, 110, 11, 9, 8)),
  dmnx: sm(ell(186, 106, 11, 8, 8)),
  nts: sm(ell(156, 104, 11, 10, 8)),
  vest: sm(ell(120, 92, 18, 12, 8)),
  icp: sm(ell(96, 128, 18, 22, 10)),
  sp5: sm(ell(86, 176, 13, 18, 10)),
  ambiguus: sm(ell(140, 186, 7, 7, 8)),
};

export const medullaSection: FigureDef = {
  id: "medulla-section",
  title: "The medulla cut across",
  viewBox: "50 30 360 300",
  summary: "A cross-section of the medulla at the level of the olive, with the floor of the fourth ventricle, the hypoglossal, dorsal vagal and solitary nuclei, vestibular nuclei, inferior cerebellar peduncle, nucleus ambiguus, olive, medial lemniscus and pyramids.",
  art: (u) => (
    <g>
      <Shade u={u} />
      <Mirror cx={230}>
        <Solid d={MEDU.half} fill={C.t1} u={u} shade="none" />
        <path d={MEDU.icp} fill={C.paper} stroke={C.ink} strokeWidth={1.2} data-part="icp" />
        <path d={MEDU.sp5} fill={C.t2} stroke={C.ink} strokeWidth={1.2} data-part="sp5" />
        <path d={MEDU.olive} fill={C.t2} stroke={C.ink} strokeWidth={2} data-part="olive" />
        <path d={MEDU.pyramid} fill={C.paper} stroke={C.ink} strokeWidth={1.4} data-part="pyramid" />
        <path d={MEDU.lemniscus} fill={C.paper} stroke={C.ink} strokeWidth={1.2} data-part="lemniscus" />
        <path d={MEDU.vest} fill={C.t2} stroke={C.ink} strokeWidth={1.2} data-part="vest" />
        <path d={MEDU.nts} fill={C.hiSoft} stroke={C.ink} strokeWidth={1.4} data-part="nts" />
        <path d={MEDU.dmnx} fill={C.blueSoft} stroke={C.ink} strokeWidth={1.4} data-part="dmnx" />
        <path d={MEDU.xii} fill={C.t3} stroke={C.ink} strokeWidth={1.4} data-part="xii" />
        <path d={MEDU.ambiguus} fill={C.t4} stroke={C.ink} strokeWidth={1.2} data-part="ambiguus" />
        <path d="M212 120 C204 180 196 240 192 290" stroke={C.ink} strokeWidth={1.6} strokeDasharray="4 3" fill="none" data-line="xiifibres" />
      </Mirror>
      <path d={MEDU.v4} fill={C.blueSoft} stroke={C.ink} strokeWidth={1.6} data-part="v4" />
      <Note x={230} y={44}>Back</Note>
    </g>
  ),
  labels: [
    { id: "v4", name: "Floor of fourth ventricle", x: 230, y: 74, about: "The open fourth ventricle lies over the back of the medulla; the vital nuclei sit just under its floor." },
    { id: "xii", name: "Hypoglossal nucleus", x: 214, y: 110, about: "Moves the tongue through the twelfth nerve." },
    { id: "dmnx", name: "Dorsal vagal nucleus", x: 186, y: 106, about: "The main parasympathetic output of the vagus to the heart, lungs and gut, slowing the heart and stirring digestion." },
    { id: "nts", name: "Solitary nucleus", x: 156, y: 104, about: "Receives taste and signals from the heart, lungs and gut. It relays the vagus nerve's messages to the brain and is a target of vagus nerve stimulation." },
    { id: "vest", name: "Vestibular nuclei", x: 120, y: 92, about: "Process balance signals from the inner ear; overactivity causes vertigo and nausea." },
    { id: "icp", name: "Inferior cerebellar peduncle", x: 96, y: 128, about: "Carries signals from the spinal cord and olive into the cerebellum." },
    { id: "sp5", name: "Spinal trigeminal nucleus", x: 86, y: 176, about: "Receives pain and temperature from the face." },
    { id: "ambiguus", name: "Nucleus ambiguus", x: 140, y: 186, about: "Moves the throat and voice box for swallowing and speech, and slows the heart." },
    { id: "lemniscus", name: "Medial lemniscus", x: 218, y: 210, about: "Fibres that have just crossed the midline carrying touch and position sense upwards." },
    { id: "olive", name: "Inferior olive", x: 120, y: 236, about: "The crinkled bag of neurons sending climbing fibres to the cerebellum for motor learning." },
    { id: "xiifibres", name: "Twelfth nerve fibres", x: 200, y: 230, about: "Hypoglossal fibres running forward to leave between the pyramid and the olive." },
    { id: "pyramid", name: "Pyramid", x: 212, y: 292, about: "The corticospinal tract; most fibres cross at the bottom of the medulla, so each side of the brain moves the opposite side of the body." },
  ],
};

/*
 * The cerebellum: a midline cut and a view from behind and below.
 * References checked: OpenStax Anatomy and Physiology 2e, 13.2 (cerebellum,
 * arbor vitae, vermis, peduncles); Kenhub "Cerebellum" (primary fissure
 * separating anterior and posterior lobes, flocculonodular lobe, tonsils,
 * dentate nucleus as the largest deep nucleus).
 */
export const cerebellum: FigureDef = {
  id: "cerebellum",
  title: "The cerebellum",
  viewBox: "0 20 760 320",
  summary: "The cerebellum cut down the middle with its tree-like white matter, primary fissure, lobes and nodulus, and seen from behind and below with the vermis, hemispheres, tonsils and the dentate nucleus.",
  art: (u) => (
    <g>
      <Shade u={u} />
      {/* A: midline cut */}
      <path d={tube([[150, 60], [160, 140], [170, 220], [176, 320]], [60, 70, 50, 34])} fill={C.t2} stroke={C.ink} strokeWidth={1.8} />
      <path d={sm([[190, 180], [214, 120], [270, 80], [340, 76], [392, 110], [404, 170], [386, 232], [330, 270], [260, 272], [214, 244]], true)} fill={C.t3} stroke={C.ink} strokeWidth={2} data-part="vermis" />
      <path d="M196 182 L232 168 L210 204 Z" fill={C.blueSoft} stroke={C.ink} strokeWidth={1.4} />
      <g fill="none" strokeLinecap="round">
        {[
          "M236 184 C270 170 300 160 340 150",
          "M260 176 C270 140 290 116 312 96",
          "M290 168 C310 130 340 112 370 112",
          "M320 156 C350 150 380 152 396 162",
          "M330 154 C360 176 380 196 390 214",
          "M300 166 C330 200 350 230 360 252",
          "M270 176 C290 210 300 240 300 266",
          "M250 182 C256 210 258 236 256 262",
        ].map((d) => (
          <g key={d}>
            <path d={d} stroke={C.paper} strokeWidth={7} data-line="arbor" />
          </g>
        ))}
      </g>
      <Groove d="M226 156 C260 110 300 92 330 84" w={2.4} part="primary" />
      <path d={sm(ell(232, 222, 10, 7, 8))} fill={C.t2} stroke={C.ink} strokeWidth={1.4} data-part="nodulus" />
      <Note x={290} y={318}>Midline cut</Note>
      {/* B: from behind and below */}
      <path d={sm([[580, 70], [520, 64], [460, 80], [430, 130], [440, 190], [480, 240], [540, 262], [580, 258]]) + " L580 70 Z"} fill={C.t2} stroke={C.ink} strokeWidth={2} data-part="hemisphere" />
      <path d={sm([[580, 70], [640, 64], [700, 80], [730, 130], [720, 190], [680, 240], [620, 262], [580, 258]]) + " L580 70 Z"} fill={C.t2} stroke={C.ink} strokeWidth={2} data-part="hemisphere" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <path d={`M574 ${90 + i * 28} C540 ${84 + i * 30} 480 ${92 + i * 28} ${450 + i * 2} ${120 + i * 26}`} stroke={C.ink} strokeOpacity={0.35} fill="none" />
          <path d={`M586 ${90 + i * 28} C620 ${84 + i * 30} 680 ${92 + i * 28} ${710 - i * 2} ${120 + i * 26}`} stroke={C.ink} strokeOpacity={0.35} fill="none" />
        </g>
      ))}
      <path d={tube([[580, 66], [580, 160], [580, 256]], [40, 34, 30])} fill={C.t3} stroke={C.ink} strokeWidth={1.6} data-part="vermis" />
      <path d={sm(ell(548, 236, 20, 26, 10))} fill={C.t3} stroke={C.ink} strokeWidth={1.6} data-part="tonsil" />
      <path d={sm(ell(612, 236, 20, 26, 10))} fill={C.t3} stroke={C.ink} strokeWidth={1.6} data-part="tonsil" />
      <path d="M500 160 c10 -20 30 -20 40 0 c-6 4 -4 10 2 14 c-14 18 -36 14 -42 -14 z" fill={C.hiSoft} stroke={C.ink} strokeWidth={1.4} strokeDasharray="4 3" data-part="dentate" />
      <path d="M660 160 c-10 -20 -30 -20 -40 0 c6 4 4 10 -2 14 c14 18 36 14 42 -14 z" fill={C.hiSoft} stroke={C.ink} strokeWidth={1.4} strokeDasharray="4 3" data-part="dentate" />
      <Note x={580} y={318}>From behind and below</Note>
    </g>
  ),
  labels: [
    { id: "arbor", name: "Arbor vitae", x: 300, y: 166, about: "The branching white matter inside, called the tree of life, carrying signals to and from the thin folded cortex." },
    { id: "primary", name: "Primary fissure", x: 280, y: 100, about: "The deep groove separating the anterior lobe from the posterior lobe." },
    { id: "vermis", name: "Vermis", x: 380, y: 140, about: "The narrow midline worm that controls posture, balance and walking. Alcohol damages it first, giving a wide, unsteady gait." },
    { id: "nodulus", name: "Nodulus", x: 232, y: 222, about: "With the flocculus it forms the flocculonodular lobe, which links with the vestibular system for balance and eye movement." },
    { id: "hemisphere", name: "Cerebellar hemisphere", x: 470, y: 120, about: "Coordinates the limbs on the same side of the body; damage causes clumsiness, overshooting and intention tremor on that side." },
    { id: "dentate", name: "Dentate nucleus", x: 520, y: 166, about: "The largest deep nucleus, sending the cerebellum's output via the thalamus to the motor and prefrontal cortex." },
    { id: "tonsil", name: "Cerebellar tonsil", x: 548, y: 240, about: "Rounded lobules above the foramen magnum; raised pressure can push them down (coning), compressing the medulla." },
    { id: "brainstem", name: "Brainstem", x: 164, y: 260, about: "The cerebellum is joined to the back of the brainstem by three pairs of peduncles." },
  ],
};

/*
 * Spinal cord cross-section with the main tracts.
 * References checked: OpenStax Anatomy and Physiology 2e, 13.2 "spinal cord"
 * (grey matter horns, white matter columns) and 14.3/14.5 (dorsal column,
 * spinothalamic and corticospinal pathways); Kenhub "Spinal cord tracts".
 * Ascending tracts are shown on the left half, descending on the right half,
 * as most textbooks do.
 */
const CORD = {
  outline: sm([[260, 64], [200, 60], [130, 76], [80, 120], [62, 190], [76, 260], [124, 312], [196, 340], [252, 344], [260, 330], [268, 344], [324, 340], [396, 312], [444, 260], [458, 190], [440, 120], [390, 76], [320, 60]], true),
  greyHalf: sm([[256, 170], [232, 160], [214, 130], [196, 96], [184, 80], [176, 92], [190, 132], [198, 176], [178, 196], [160, 210], [136, 240], [130, 278], [160, 292], [206, 270], [240, 240], [256, 236]]) + " Z",
  gracilis: sm([[258, 72], [240, 78], [232, 130], [246, 160], [258, 160]]) + " Z",
  cuneatus: sm([[236, 76], [206, 82], [212, 120], [230, 148], [234, 122]], true),
  spinothal: sm([[80, 236], [96, 278], [126, 306], [150, 300], [132, 278], [120, 246]], true),
  dscb: sm([[70, 146], [62, 190], [70, 222], [88, 212], [88, 168]], true),
  vscb: sm([[72, 232], [80, 262], [96, 286], [104, 270], [90, 240]], true),
  lcst: sm([[384, 140], [420, 140], [432, 190], [412, 218], [384, 198]], true),
  acst: sm([[264, 300], [280, 300], [288, 330], [272, 338], [266, 324]], true),
  rubro: sm(ell(392, 230, 14, 11, 8)),
  vest: sm(ell(330, 318, 16, 10, 8)),
};

export const spinalCord: FigureDef = {
  id: "spinal-cord",
  title: "The spinal cord cut across",
  viewBox: "20 30 480 350",
  summary: "A cross-section of the spinal cord with the H-shaped grey matter, dorsal and ventral roots, and the main tracts: dorsal columns, spinothalamic and spinocerebellar tracts going up on the left, corticospinal and other motor tracts coming down on the right.",
  art: (u) => (
    <g>
      <Shade u={u} />
      <path d="M176 84 C150 60 120 44 80 40" stroke={C.ink} strokeWidth={12} fill="none" />
      <path d="M176 84 C150 60 120 44 80 40" stroke={C.t2} strokeWidth={9} fill="none" data-line="droot" />
      <path d={sm(ell(110, 46, 24, 14, 10, -0.2))} fill={C.t2} stroke={C.ink} strokeWidth={1.6} data-part="drg" />
      <path d="M150 284 C120 310 90 330 60 340" stroke={C.ink} strokeWidth={12} fill="none" />
      <path d="M150 284 C120 310 90 330 60 340" stroke={C.t2} strokeWidth={9} fill="none" data-line="vroot" />
      <Solid d={CORD.outline} fill={C.paper} u={u} part="white" />
      <path d={CORD.gracilis} fill={C.blueSoft} stroke={C.ink} strokeWidth={1.2} data-part="gracilis" />
      <path d={CORD.cuneatus} fill={C.blueMid} fillOpacity={0.6} stroke={C.ink} strokeWidth={1.2} data-part="cuneatus" />
      <path d={CORD.spinothal} fill={C.blueSoft} stroke={C.ink} strokeWidth={1.2} data-part="spinothal" />
      <path d={CORD.dscb} fill={C.t2} stroke={C.ink} strokeWidth={1.2} data-part="scb" />
      <path d={CORD.vscb} fill={C.t2} stroke={C.ink} strokeWidth={1.2} data-part="scb" />
      <path d={CORD.lcst} fill={C.hiSoft} stroke={C.ink} strokeWidth={1.2} data-part="lcst" />
      <path d={CORD.acst} fill={C.hiSoft} stroke={C.ink} strokeWidth={1.2} data-part="acst" />
      <path d={CORD.rubro} fill={C.t2} stroke={C.ink} strokeWidth={1.2} data-part="rubro" />
      <path d={CORD.vest} fill={C.t2} stroke={C.ink} strokeWidth={1.2} data-part="vest" />
      <Mirror cx={260}>
        <path d={CORD.greyHalf} fill={C.t3} stroke={C.ink} strokeWidth={1.6} data-part="grey" />
      </Mirror>
      <path d="M156 200 l-16 -6 l4 18 z" fill={C.t3} stroke={C.ink} strokeWidth={1.2} data-part="lateralhorn" />
      <circle cx={260} cy={204} r={5} fill={C.blueSoft} stroke={C.ink} strokeWidth={1.2} data-part="canal" />
      <path d="M260 64 L260 160" stroke={C.ink} strokeWidth={1.4} />
      <path d="M260 344 L260 300" stroke={C.ink} strokeWidth={4} />
      <Note x={150} y={372}>Going up (sensory)</Note>
      <Note x={380} y={372}>Coming down (motor)</Note>
    </g>
  ),
  labels: [
    { id: "drg", name: "Dorsal root ganglion", x: 110, y: 46, about: "Holds the cell bodies of the sensory neurons; shingles virus lies dormant here." },
    { id: "droot", name: "Dorsal root", x: 150, y: 66, about: "Carries sensory fibres into the back of the cord." },
    { id: "vroot", name: "Ventral root", x: 104, y: 318, about: "Carries motor fibres out from the front of the cord to the muscles." },
    { id: "gracilis", name: "Fasciculus gracilis", x: 248, y: 110, about: "Dorsal column carrying fine touch, vibration and position sense from the legs. Vitamin B12 deficiency and syphilis damage the dorsal columns." },
    { id: "cuneatus", name: "Fasciculus cuneatus", x: 220, y: 110, about: "Dorsal column for touch and position from the arms and upper body." },
    { id: "grey", name: "Dorsal horn", x: 196, y: 120, about: "Grey matter where pain and temperature fibres end; pain signals can be turned up or down here, which is the gate in gate control theory." },
    { id: "lateralhorn", name: "Lateral horn", x: 146, y: 202, about: "Present from the first thoracic to upper lumbar levels; it holds the sympathetic neurons." },
    { id: "ventralhorn", name: "Ventral horn", x: 168, y: 260, about: "Holds the lower motor neurons that drive the muscles; they die in motor neurone disease and polio." },
    { id: "scb", name: "Spinocerebellar tracts", x: 74, y: 190, about: "Carry unconscious position sense to the cerebellum." },
    { id: "spinothal", name: "Spinothalamic tract", x: 110, y: 276, about: "Carries pain and temperature from the opposite side of the body; its fibres cross within a segment or two of entering." },
    { id: "canal", name: "Central canal", x: 260, y: 204, about: "The tiny fluid channel in the middle of the cord." },
    { id: "lcst", name: "Lateral corticospinal tract", x: 408, y: 178, about: "The main motor pathway from the cortex, already crossed in the medulla. Damage gives weakness, stiffness and brisk reflexes below the injury." },
    { id: "rubro", name: "Rubrospinal tract", x: 392, y: 230, about: "From the red nucleus, helping control the arm muscles." },
    { id: "vest", name: "Vestibulospinal tract", x: 330, y: 318, about: "From the vestibular nuclei, keeping the body upright." },
    { id: "acst", name: "Anterior corticospinal tract", x: 276, y: 318, about: "The uncrossed tenth of the motor fibres, controlling the trunk muscles." },
    { id: "white", name: "White matter", x: 420, y: 110, about: "The columns of myelinated tracts surrounding the grey matter." },
  ],
};

/*
 * The knee-jerk (patellar) stretch reflex.
 * References checked: OpenStax Anatomy and Physiology 2e, 14.5 (stretch reflex
 * with muscle spindle, monosynaptic connection to the alpha motor neuron and
 * reciprocal inhibition of the antagonist through an interneuron); OpenStax
 * Psychology 2e, 3.4 (reflex arc).
 */
export const reflexArc: FigureDef = {
  id: "reflex-arc",
  title: "The knee-jerk reflex arc",
  viewBox: "20 20 620 400",
  summary: "A tap on the patellar tendon stretches the quadriceps; the muscle spindle sends a signal through the dorsal root to the spinal cord, which fires the motor neuron back to the quadriceps while an interneuron relaxes the hamstrings.",
  art: (u) => (
    <g>
      <Shade u={u} />
      {/* Leg */}
      <Solid d={sm([[40, 180], [120, 160], [220, 166], [300, 190], [330, 230], [336, 290], [340, 380], [300, 384], [296, 300], [282, 258], [210, 250], [120, 250], [40, 240]], true)} fill={C.t1} u={u} shade="drop" part="leg" />
      <Solid d={sm([[70, 178], [140, 160], [220, 166], [284, 188], [300, 210], [240, 208], [150, 204], [80, 206]], true)} fill={C.hiSoft} u={u} shade="none" part="quadriceps" />
      <Solid d={sm([[80, 222], [150, 220], [230, 222], [280, 240], [270, 254], [200, 250], [120, 250], [80, 244]], true)} fill={C.t2} u={u} shade="none" part="hamstring" />
      <path d={sm(ell(314, 214, 13, 18, 10, 0.4))} fill={C.t3} stroke={C.ink} strokeWidth={1.6} data-part="patella" />
      <path d="M322 232 C328 248 330 262 330 276" stroke={C.ink} strokeWidth={6} fill="none" />
      <path d="M322 232 C328 248 330 262 330 276" stroke={C.paper} strokeWidth={3.4} fill="none" data-line="tendon" />
      <path d="M390 250 L346 262" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
      <rect x={384} y={232} width={26} height={30} rx={6} fill={C.t3} stroke={C.ink} strokeWidth={1.6} transform="rotate(-16 397 247)" data-part="hammer" />
      <path d={sm(ell(180, 186, 22, 7, 8, -0.05))} fill={C.blue} stroke={C.ink} strokeWidth={1.2} data-part="spindle" />
      {/* Spinal cord segment */}
      <path d={sm(ell(500, 120, 90, 64, 16))} fill={C.paper} stroke={C.ink} strokeWidth={2} data-part="cord" />
      <Mirror cx={500}>
        <path d="M500 104 C486 98 474 80 466 66 L460 72 C470 90 474 110 470 122 C456 132 444 146 444 160 C462 166 486 150 500 140 Z" fill={C.t3} stroke={C.ink} strokeWidth={1.4} />
      </Mirror>
      <path d={sm(ell(424, 64, 18, 11, 8, -0.3))} fill={C.t2} stroke={C.ink} strokeWidth={1.4} data-part="drg" />
      {/* Sensory neuron */}
      <path d="M200 186 C260 140 340 90 410 70 C440 62 456 70 470 96" stroke={C.blue} strokeWidth={3.2} fill="none" markerEnd={`url(#${u("arrow")})`} data-line="sensory" />
      {/* Synapse and motor neuron */}
      <circle cx={474} cy={146} r={8} fill={C.ink} data-part="motor" />
      <path d="M474 150 C460 190 420 200 360 196 C300 192 250 186 222 182" stroke={C.ink} strokeWidth={3.2} fill="none" markerEnd={`url(#${u("arrowInk")})`} data-line="motor" />
      {/* Interneuron to hamstring motor neuron */}
      <circle cx={486} cy={124} r={5} fill={C.hi} stroke={C.ink} data-part="inter" />
      <path d="M472 104 C480 110 484 116 486 120" stroke={C.blue} strokeWidth={2} fill="none" />
      <path d="M488 128 C492 140 494 150 492 160" stroke={C.ink} strokeWidth={2} fill="none" data-line="inter" />
      <circle cx={490} cy={164} r={6} fill={C.t4} stroke={C.ink} />
      <path d="M490 170 C480 230 420 250 330 246 C290 244 260 240 240 240" stroke={C.ink} strokeWidth={2.4} strokeDasharray="6 4" fill="none" markerEnd={`url(#${u("arrowInk")})`} data-line="inhibit" />
      <Note x={400} y={300}>The lower leg kicks forward</Note>
      <path d="M340 380 C370 370 392 350 404 320" stroke={C.ink} strokeWidth={1.6} fill="none" markerEnd={`url(#${u("arrowInk")})`} />
    </g>
  ),
  labels: [
    { id: "hammer", name: "Tendon tap", x: 396, y: 246, about: "A tap just below the kneecap suddenly stretches the quadriceps." },
    { id: "tendon", name: "Patellar tendon", x: 328, y: 258, about: "Joins the quadriceps over the kneecap to the shin." },
    { id: "spindle", name: "Muscle spindle", x: 180, y: 186, about: "A stretch sensor inside the muscle that fires when the muscle is pulled longer." },
    { id: "quadriceps", name: "Quadriceps", x: 120, y: 182, about: "The front thigh muscle that straightens the knee; it contracts and the leg kicks." },
    { id: "sensory", name: "Sensory neuron", x: 300, y: 112, about: "Carries the stretch signal into the cord through the dorsal root, in a fraction of a second." },
    { id: "drg", name: "Dorsal root ganglion", x: 424, y: 64, about: "Holds the sensory neuron's cell body." },
    { id: "motor", name: "Motor neuron", x: 474, y: 146, about: "The sensory fibre synapses directly on it (one synapse, so the reflex is very fast) and it fires the quadriceps. Brisk reflexes suggest damage above this level; absent ones suggest damage in the arc itself." },
    { id: "inter", name: "Inhibitory interneuron", x: 486, y: 124, about: "Quiets the motor neuron of the opposing muscle (reciprocal inhibition)." },
    { id: "inhibit", name: "Hamstring relaxes", x: 380, y: 244, about: "The back thigh muscles are told to relax so the knee can straighten smoothly." },
    { id: "hamstring", name: "Hamstrings", x: 150, y: 236, about: "The back thigh muscles that bend the knee." },
    { id: "cord", name: "Spinal cord (L2 to L4)", x: 548, y: 140, about: "The reflex is handled here without the brain, which only learns of it afterwards." },
  ],
};

/*
 * The reticular activating system on the midline brain.
 * References checked: OpenStax Anatomy and Physiology 2e, 13.2 (reticular
 * formation and consciousness); Kaplan and Sadock sleep chapter (local copy,
 * grep "reticular activating"): brainstem reticular core with cholinergic
 * pedunculopontine and laterodorsal tegmental nuclei, locus coeruleus and
 * raphe; a thalamic route through the intralaminar nuclei and an extrathalamic
 * route through the hypothalamus and basal forebrain to the cortex.
 */
export const ras: FigureDef = {
  id: "ras",
  title: "The reticular activating system",
  viewBox: "60 30 510 410",
  summary: "The midline brain with the reticular formation running up the core of the brainstem and its two routes to the cortex: through the thalamus and through the hypothalamus and basal forebrain.",
  art: (u) => (
    <MedialBrain
      u={u}
      over={
        <g>
          <path d={tube([[344, 420], [340, 380], [336, 340], [342, 300], [356, 262]], [16, 20, 24, 24, 20])} fill={C.hiSoft} fillOpacity={0.85} stroke={C.ink} strokeWidth={1.6} data-part="rf" />
          {[[340, 400], [336, 360], [344, 320], [338, 290], [352, 268]].map(([x, y]) => (
            <circle key={y} cx={x} cy={y} r={3} fill={C.ink} />
          ))}
          <circle cx={362} cy={286} r={6} fill={C.blue} stroke={C.ink} data-part="ppt" />
          <circle cx={370} cy={302} r={6} fill={C.blueMid} stroke={C.ink} data-part="lc" />
          <g fill="none" strokeLinecap="round">
            <path d="M352 260 C346 240 340 226 336 214" stroke={C.line} strokeWidth={4} markerEnd={`url(#${u("arrow")})`} data-line="thalamic" />
            {[[200, 90], [300, 70], [400, 80], [480, 140]].map(([x, y]) => (
              <path key={x} d={`M330 196 C${(330 + x) / 2} ${(196 + y) / 2 - 20} ${x} ${y + 20} ${x} ${y}`} stroke={C.line} strokeWidth={2.6} markerEnd={`url(#${u("arrow")})`} data-line="cortex" />
            ))}
            <path d="M342 262 C320 252 300 244 286 242" stroke={C.ink} strokeWidth={3.4} markerEnd={`url(#${u("arrowInk")})`} data-line="extra" />
            <path d="M270 236 C250 220 220 180 180 140" stroke={C.ink} strokeWidth={2.6} markerEnd={`url(#${u("arrowInk")})`} data-line="extra" />
            <path d="M262 232 C230 230 180 220 130 196" stroke={C.ink} strokeWidth={2.6} markerEnd={`url(#${u("arrowInk")})`} data-line="extra" />
          </g>
        </g>
      }
    />
  ),
  labels: [
    { id: "rf", name: "Reticular formation", x: 338, y: 350, about: "A web of neurons running through the core of the medulla, pons and midbrain. It keeps the cortex awake; damage to its upper part causes coma." },
    { id: "ppt", name: "PPT and LDT (acetylcholine)", x: 362, y: 286, about: "Cholinergic nuclei at the junction of pons and midbrain that drive wakefulness and REM sleep through the thalamus." },
    { id: "lc", name: "Locus coeruleus", x: 370, y: 302, about: "Noradrenaline neurons that add alertness and vigilance; they fall silent in REM sleep." },
    { id: "thalamic", name: "Route through the thalamus", x: 346, y: 236, about: "The upper route, through the intralaminar and other thalamic nuclei, which opens the gate for sensory signals to reach the cortex." },
    { id: "thalamus", name: "Thalamus", x: 326, y: 206, about: "The relay that spreads the arousal signal to the whole cortex." },
    { id: "extra", name: "Route through the hypothalamus", x: 300, y: 244, about: "The lower route, through the hypothalamus (histamine and orexin) and the basal forebrain (acetylcholine), straight to the cortex. Sedating antihistamines act on this route." },
    { id: "cortex", name: "Aroused cortex", x: 300, y: 92, about: "With both routes active the cortex is awake and attentive; the EEG shows fast, low-voltage activity." },
  ],
};
