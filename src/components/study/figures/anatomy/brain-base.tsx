import type { FigureDef } from "../types";
import { C, Groove, Mirror, Note, Shade, Solid, sm } from "./kit";

/*
 * The base of the brain seen from below, front at the top, with the twelve
 * cranial nerves where they leave the brain.
 * References checked: OpenStax Anatomy and Physiology 2e, 13.4 "The Peripheral
 * Nervous System" (cranial nerves on the inferior brain); Gray's Anatomy 1918
 * plate of the base of the brain (public domain, Wikimedia Commons);
 * Kenhub "Cranial nerves" overview (exit points: III interpeduncular fossa,
 * IV dorsal midbrain wrapping the peduncle, V lateral pons, VI pontomedullary
 * junction, VII and VIII cerebellopontine angle, IX X XI behind the olive,
 * XII between pyramid and olive).
 */
const CX = 250;
const half = {
  cortex: sm([[250, 34], [190, 36], [120, 52], [70, 96], [46, 160], [48, 214], [68, 244], [52, 270], [46, 330], [58, 400], [86, 460], [130, 510], [190, 540], [250, 548]]) + " Z",
  temporal: sm([[150, 232], [118, 238], [80, 262], [64, 320], [72, 390], [100, 430], [150, 440], [190, 410], [205, 360], [205, 300], [190, 262], [170, 240]], true),
  gyrusRectus: sm([[236, 50], [222, 60], [218, 120], [220, 180], [228, 214], [246, 222]]),
  orbital: ["M150 120 C160 140 162 170 156 196", "M190 116 C186 140 186 170 192 196", "M152 156 C166 160 178 160 190 156"],
  bulb: sm([[216, 72], [226, 70], [230, 84], [228, 104], [218, 108], [212, 92]], true),
  tract: "M222 106 C220 140 218 172 212 204",
  opticNerve: "M200 176 C214 196 228 214 240 230",
  opticTract: "M232 246 C214 256 200 270 194 294",
  peduncle: sm([[236, 282], [222, 288], [204, 304], [196, 322], [222, 324], [238, 300]], true),
  pons: sm([[250, 318], [214, 320], [184, 334], [176, 360], [186, 384], [214, 394], [250, 396]]) + " Z",
  medulla: sm([[250, 394], [222, 396], [206, 410], [204, 440], [214, 470], [230, 488], [250, 490]]) + " Z",
  olive: sm([[214, 410], [222, 414], [224, 440], [216, 452], [208, 440], [208, 418]], true),
  pyramid: "M238 398 C236 430 238 460 244 486",
  cerebellum: sm([[244, 420], [214, 410], [170, 404], [120, 420], [92, 456], [102, 500], [150, 528], [210, 530], [244, 512]]) + " Z",
  flocculus: sm([[176, 400], [190, 396], [198, 404], [188, 412], [174, 410]], true),
  cn3: "M232 298 C224 280 214 262 204 246",
  cn4: "M200 316 C190 296 186 274 186 252",
  cn5: "M184 352 C168 348 152 340 136 330",
  cn6: "M240 396 C236 376 234 352 232 330",
  cn7: "M190 392 C172 390 156 384 140 378",
  cn8: "M188 398 C170 400 154 400 136 398",
  cn9: "M206 418 C190 416 176 414 160 414",
  cn10: ["M206 428 C190 428 174 430 158 432", "M206 436 C190 438 174 442 160 446"],
  cn11: "M204 450 C200 470 196 490 194 510 M204 450 C192 444 180 444 166 448",
  cn12: ["M228 420 C216 422 204 428 188 456", "M228 432 C216 436 204 442 192 462"],
  mammillary: sm([[236, 272], [246, 270], [248, 282], [240, 288], [232, 282]], true),
};

export const brainInferior: FigureDef = {
  id: "brain-inferior",
  title: "The brain from below, with the cranial nerves",
  viewBox: "30 20 440 540",
  summary: "The underside of the brain with the frontal and temporal lobes, the brainstem, the cerebellum and where each of the twelve cranial nerves leaves the brain.",
  art: (u) => (
    <g>
      <Shade u={u} />
      <Mirror cx={CX}>
        <Solid d={half.cortex} fill={C.t1} u={u} shade="none" />
        <Solid d={half.temporal} fill={C.t2} u={u} part="temporal" />
        <Groove d="M68 244 C110 238 140 232 160 236" w={2.4} />
        <Groove d={half.gyrusRectus} w={1.8} o={0.7} />
        {half.orbital.map((d) => (
          <Groove key={d} d={d} w={1.6} o={0.55} />
        ))}
        <Groove d="M110 300 C120 340 130 380 150 410" w={1.4} o={0.5} />
        <Groove d="M150 270 C160 310 170 350 186 380" w={1.4} o={0.5} />
        <Solid d={half.cerebellum} fill={C.t2} u={u} part="cerebellum" />
        {[0, 1, 2, 3].map((i) => (
          <Groove key={i} d={`M${236 - i * 4} ${430 + i * 22} C${190} ${420 + i * 26} ${140} ${430 + i * 22} ${108 + i * 6} ${462 + i * 14}`} w={1.2} o={0.45} />
        ))}
        <path d={half.flocculus} fill={C.t3} stroke={C.ink} strokeWidth={1.4} />
        <path d={half.peduncle} fill={C.t3} stroke={C.ink} strokeWidth={1.6} data-part="peduncle" />
        <Solid d={half.pons} fill={C.t3} u={u} shade="side" part="pons" />
        {[0, 1, 2, 3].map((i) => (
          <Groove key={i} d={`M${246} ${330 + i * 16} C${220} ${328 + i * 16} ${196} ${336 + i * 14} ${184} ${348 + i * 10}`} w={1} o={0.35} />
        ))}
        <Solid d={half.medulla} fill={C.t2} u={u} shade="side" part="medulla" />
        <Groove d={half.pyramid} w={1.6} o={0.7} />
        <path d={half.olive} fill={C.t3} stroke={C.ink} strokeWidth={1.4} data-part="olive" />
        <path d={half.mammillary} fill={C.t3} stroke={C.ink} strokeWidth={1.4} data-part="mammillary" />
        <path d={half.bulb} fill={C.hiSoft} stroke={C.ink} strokeWidth={1.6} data-part="cn1" />
        <path d={half.tract} fill="none" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
        <path d={half.tract} fill="none" stroke={C.hiSoft} strokeWidth={3} strokeLinecap="round" data-line="cn1" />
        <path d={half.opticNerve} fill="none" stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
        <path d={half.opticNerve} fill="none" stroke={C.paper} strokeWidth={7} strokeLinecap="round" data-line="cn2" />
        <path d={half.opticTract} fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
        <path d={half.opticTract} fill="none" stroke={C.paper} strokeWidth={5} strokeLinecap="round" />
        <g fill="none" strokeLinecap="round">
          {[
            ["cn3", half.cn3, 4],
            ["cn4", half.cn4, 2],
            ["cn5", half.cn5, 8],
            ["cn6", half.cn6, 2.6],
            ["cn7", half.cn7, 3.4],
            ["cn8", half.cn8, 4],
            ["cn9", half.cn9, 2.4],
            ["cn10", half.cn10[0], 2.4],
            ["cn10", half.cn10[1], 2.4],
            ["cn11", half.cn11, 2.2],
            ["cn12", half.cn12[0], 2.2],
            ["cn12", half.cn12[1], 2.2],
          ].map(([id, d, w], i) => (
            <g key={i}>
              <path d={d as string} stroke={C.ink} strokeWidth={(w as number) + 2} />
              <path d={d as string} stroke={C.blueSoft} strokeWidth={w as number} data-line={id as string} />
            </g>
          ))}
        </g>
      </Mirror>
      <path d="M232 228 C240 222 260 222 268 228 C266 240 258 246 250 246 C242 246 234 240 232 228 Z" fill={C.paper} stroke={C.ink} strokeWidth={1.8} data-part="chiasm" />
      <circle cx={250} cy={258} r={8} fill={C.t3} stroke={C.ink} strokeWidth={1.6} data-part="stalk" />
      <Groove d="M250 322 L250 394" w={1.4} o={0.6} />
      <Groove d="M250 398 L250 488" w={1.4} o={0.7} />
      <path d="M232 486 C236 500 244 514 250 520 C256 514 264 500 268 486 Z" fill={C.t2} stroke={C.ink} strokeWidth={1.4} />
      <Note x={250} y={30}>Front</Note>
    </g>
  ),
  labels: [
    { id: "cn1", name: "I Olfactory", x: 222, y: 88, about: "Carries smell from the nose to the olfactory bulb under the frontal lobe. Loss of smell can follow head injury and is an early sign of Parkinson's and Alzheimer's disease." },
    { id: "cn2", name: "II Optic nerve", x: 214, y: 196, about: "Carries vision from the eye. It is really a tract of the brain, and swelling of its head (papilloedema) signals raised pressure inside the skull." },
    { id: "chiasm", name: "Optic chiasm", x: 250, y: 236, about: "Where fibres from the inner half of each retina cross, so each side of the brain sees the opposite half of the world." },
    { id: "stalk", name: "Pituitary stalk", x: 250, y: 258, about: "The stalk linking the hypothalamus to the pituitary gland, cut here where the gland has been removed." },
    { id: "cn3", name: "III Oculomotor", x: 222, y: 278, about: "Moves most eye muscles, lifts the eyelid and narrows the pupil. Pressure on it from a swelling brain gives a fixed, dilated pupil." },
    { id: "mammillary", name: "Mammillary bodies", x: 240, y: 280, about: "Paired memory relays behind the stalk, damaged in thiamine deficiency (Wernicke and Korsakoff)." },
    { id: "cn4", name: "IV Trochlear", x: 188, y: 270, about: "The thinnest nerve, the only one leaving the back of the brainstem; it wraps round the midbrain to move the eye down and in. Damage causes double vision on going downstairs." },
    { id: "cn5", name: "V Trigeminal", x: 150, y: 338, about: "The largest nerve, leaving the side of the pons. It carries feeling from the face and works the chewing muscles; trigeminal neuralgia causes stabbing facial pain." },
    { id: "pons", name: "Pons", x: 214, y: 360, about: "The bridge of the brainstem, carrying fibres to the cerebellum and holding centres for breathing and REM sleep." },
    { id: "cn6", name: "VI Abducens", x: 234, y: 352, about: "Moves the eye outwards. It has a long course, so raised pressure in the skull often weakens it first." },
    { id: "cn7", name: "VII Facial", x: 156, y: 384, about: "Moves the face, carries taste from the front of the tongue and drives tears and saliva. Bell's palsy weakens one whole side of the face." },
    { id: "cn8", name: "VIII Vestibulocochlear", x: 150, y: 400, about: "Carries hearing and balance from the inner ear. Problems cause deafness, tinnitus and vertigo." },
    { id: "olive", name: "Olive", x: 216, y: 432, about: "The oval bulge on the side of the medulla. Its nucleus sends climbing fibres to the cerebellum to help learn movements." },
    { id: "cn9", name: "IX Glossopharyngeal", x: 174, y: 414, about: "Carries taste and feeling from the back of the tongue and throat and the gag reflex sensation." },
    { id: "cn10", name: "X Vagus", x: 176, y: 432, about: "The wandering nerve that carries the parasympathetic supply to the heart, lungs and gut and carries body signals back to the brain. Vagus nerve stimulation is a treatment for resistant depression." },
    { id: "cn12", name: "XII Hypoglossal", x: 206, y: 440, about: "Leaves between the pyramid and the olive and moves the tongue. Damage makes the tongue point to the weak side." },
    { id: "cn11", name: "XI Accessory", x: 198, y: 486, about: "Its roots rise from the upper spinal cord to work the sternocleidomastoid and trapezius muscles that turn the head and shrug the shoulders." },
    { id: "medulla", name: "Medulla", x: 238, y: 460, about: "The lowest part of the brainstem, with the vital centres for breathing, heart rate and blood pressure. Opioid overdose depresses breathing here." },
    { id: "temporal", name: "Temporal lobe", x: 110, y: 330, about: "Seen from below, its inner edge holds the uncus and parahippocampal gyrus, the gateway to memory. A swelling brain can push the uncus against the third nerve." },
    { id: "cerebellum", name: "Cerebellum", x: 140, y: 480, about: "The two cerebellar hemispheres sit behind the brainstem and coordinate movement and balance." },
  ],
};
