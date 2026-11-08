import type { FigureDef } from "../types";
import { C, Mirror, Note, Shade, Solid, ell, sm, tube } from "./kit";
import { CORONAL } from "./sections";

/*
 * The senses: eye, visual pathway with field defects, ear, auditory pathway,
 * smell and taste.
 * References checked: OpenStax Anatomy and Physiology 2e, 14.1 "Sensory
 * Perception" (structure of the eye, ear, olfactory epithelium, tongue and
 * taste buds) and 14.2 "Central Processing" (visual pathway with crossing of
 * nasal retina fibres at the chiasm; auditory pathway cochlear nuclei,
 * superior olive, inferior colliculus, medial geniculate, auditory cortex;
 * taste to the solitary nucleus, thalamus and insula); OpenStax Psychology 2e,
 * 5.3 "Vision" and 5.4 "Hearing"; Atkinson and Hilgard sensation chapter
 * (local copy, grep "blind spot", "basilar membrane").
 */

export const eye: FigureDef = {
  id: "eye",
  title: "The eye cut across",
  viewBox: "60 40 500 340",
  summary: "A horizontal section of the eyeball with cornea, iris, pupil, lens, ciliary body, the chambers, sclera, choroid, retina, fovea, optic disc and optic nerve.",
  art: (u) => (
    <g>
      <Shade u={u} />
      <path d="M440 266 C470 290 500 300 556 304 L556 338 C500 334 462 324 430 298 Z" fill={C.t2} stroke={C.ink} strokeWidth={1.8} data-part="nerve" />
      <circle cx={310} cy={210} r={150} fill={C.paper} stroke={C.ink} strokeWidth={2.4} data-part="sclera" />
      <circle cx={310} cy={210} r={140} fill={C.t2} stroke={C.ink} strokeWidth={1} data-part="choroid" />
      <circle cx={310} cy={210} r={133} fill={C.hiSoft} stroke={C.ink} strokeWidth={1} data-part="retina" />
      <circle cx={310} cy={210} r={127} fill={C.blueSoft} fillOpacity={0.35} stroke="none" data-part="vitreous" />
      <path d="M196 128 C176 160 172 190 172 210 C172 230 176 260 196 292 Z" fill={C.paper} stroke="none" />
      <path d="M190 134 C150 150 136 184 136 210 C136 236 150 270 190 286" fill={C.blueSoft} fillOpacity={0.45} stroke={C.ink} strokeWidth={2.6} data-part="cornea" />
      <path d="M190 138 C158 154 146 186 146 210 C146 234 158 266 190 282 Z" fill={C.blueSoft} fillOpacity={0.3} stroke="none" data-part="chamber" />
      <path d="M186 128 L176 182 L184 182 L194 132 Z" fill={C.t4} stroke={C.ink} strokeWidth={1.4} data-part="iris" />
      <path d="M186 292 L176 238 L184 238 L194 288 Z" fill={C.t4} stroke={C.ink} strokeWidth={1.4} data-part="iris" />
      <path d={sm(ell(206, 210, 24, 60, 14))} fill={C.paper} stroke={C.ink} strokeWidth={2} data-part="lens" />
      <path d="M190 118 L214 124 L208 140 L192 134 Z" fill={C.t3} stroke={C.ink} strokeWidth={1.4} data-part="ciliary" />
      <path d="M190 302 L214 296 L208 280 L192 286 Z" fill={C.t3} stroke={C.ink} strokeWidth={1.4} data-part="ciliary" />
      {[0, 1, 2].map((i) => (
        <g key={i} stroke={C.ink} strokeOpacity={0.5} strokeWidth={1}>
          <path d={`M${206 + i * 3} 138 L${204 + i * 4} 156`} />
          <path d={`M${206 + i * 3} 282 L${204 + i * 4} 264`} />
        </g>
      ))}
      <path d="M440 200 C446 206 446 214 440 220" stroke={C.ink} strokeWidth={2} fill="none" />
      <circle cx={441} cy={210} r={5} fill={C.hi} stroke={C.ink} data-part="fovea" />
      <ellipse cx={428} cy={274} rx={7} ry={11} fill={C.paper} stroke={C.ink} strokeWidth={1.6} transform="rotate(-30 428 274)" data-part="disc" />
      <path d="M80 210 H440" stroke={C.ink} strokeWidth={1} strokeDasharray="6 5" strokeOpacity={0.6} />
      <Note x={84} y={200} anchor="start" size={13}>Light</Note>
    </g>
  ),
  labels: [
    { id: "cornea", name: "Cornea", x: 142, y: 180, about: "The clear front window that does most of the focusing of light." },
    { id: "chamber", name: "Anterior chamber", x: 164, y: 246, about: "Filled with watery aqueous humour. Blocked drainage raises the pressure (glaucoma); drugs with strong anticholinergic action can trigger acute angle-closure glaucoma." },
    { id: "iris", name: "Iris", x: 186, y: 150, about: "The coloured ring of muscle that sets the pupil size: parasympathetic nerves narrow it, sympathetic widen it." },
    { id: "pupil", name: "Pupil", x: 180, y: 210, about: "The opening in the iris. Pinpoint pupils suggest opioids; wide pupils suggest stimulants, anticholinergics or opioid withdrawal." },
    { id: "lens", name: "Lens", x: 210, y: 236, about: "Fine-tunes focus by changing shape. Some antipsychotics, such as quetiapine, carry a caution about cataracts, and lithium and steroids can affect the lens." },
    { id: "ciliary", name: "Ciliary body", x: 202, y: 128, about: "Muscle that changes the lens shape for near focus and makes the aqueous humour; anticholinergic drugs relax it, blurring near vision." },
    { id: "sclera", name: "Sclera", x: 330, y: 64, about: "The tough white outer coat of the eye." },
    { id: "choroid", name: "Choroid", x: 360, y: 74, about: "A layer of blood vessels that nourishes the retina." },
    { id: "retina", name: "Retina", x: 400, y: 100, about: "The light-sensing layer of rods and cones, really an outgrowth of the brain. Thioridazine at high doses could damage it." },
    { id: "vitreous", name: "Vitreous body", x: 320, y: 170, about: "The clear jelly filling the back of the eye." },
    { id: "fovea", name: "Fovea", x: 441, y: 210, about: "The small pit packed with cones, giving the sharpest central and colour vision." },
    { id: "disc", name: "Optic disc", x: 428, y: 274, about: "Where the nerve fibres leave the eye; it has no receptors, so it makes the blind spot. Swelling here (papilloedema) signals raised pressure in the skull." },
    { id: "nerve", name: "Optic nerve", x: 500, y: 314, about: "Carries signals from about a million ganglion cells to the brain." },
  ],
};

/* ---- Visual pathway seen from above, with field defects ---- */
const FIELDS: { key: string; y: number; black: (eye: "L" | "R") => string | null }[] = [
  { key: "A", y: 100, black: (e) => (e === "R" ? "full" : null) },
  { key: "B", y: 170, black: (e) => (e === "L" ? "left" : "right") },
  { key: "C", y: 240, black: () => "left" },
  { key: "D", y: 310, black: () => "leftUpper" },
  { key: "E", y: 380, black: () => "leftLower" },
  { key: "F", y: 450, black: () => "leftSpare" },
];

function FieldPair({ y, black }: { y: number; black: (eye: "L" | "R") => string | null }) {
  const one = (cx: number, e: "L" | "R") => {
    const kind = black(e);
    const r = 20;
    let d = "";
    if (kind === "full") d = `M${cx - r} ${y} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;
    if (kind === "left") d = `M${cx} ${y - r} A${r} ${r} 0 0 0 ${cx} ${y + r} Z`;
    if (kind === "right") d = `M${cx} ${y - r} A${r} ${r} 0 0 1 ${cx} ${y + r} Z`;
    if (kind === "leftUpper") d = `M${cx} ${y} L${cx} ${y - r} A${r} ${r} 0 0 0 ${cx - r} ${y} Z`;
    if (kind === "leftLower") d = `M${cx} ${y} L${cx - r} ${y} A${r} ${r} 0 0 0 ${cx} ${y + r} Z`;
    if (kind === "leftSpare") d = `M${cx} ${y - r} A${r} ${r} 0 0 0 ${cx} ${y + r} L${cx} ${y + 6} A6 6 0 0 1 ${cx} ${y - 6} Z`;
    return (
      <g key={e}>
        <circle cx={cx} cy={y} r={r} fill={C.paper} stroke={C.ink} strokeWidth={1.4} />
        {d ? <path d={d} fill={C.ink} fillOpacity={0.85} /> : null}
        <path d={`M${cx} ${y - r} V${y + r}`} stroke={C.ink} strokeOpacity={0.3} />
      </g>
    );
  };
  return (
    <g>
      {one(560, "L")}
      {one(608, "R")}
    </g>
  );
}

export const visualPathway: FigureDef = {
  id: "visual-pathway",
  title: "The visual pathway and field defects",
  viewBox: "40 20 600 520",
  summary: "The route from both eyes through the optic nerves, chiasm, tracts, lateral geniculate nuclei and optic radiations to the visual cortex, seen from above, with six lesion sites and the visual field loss each causes.",
  art: (u) => (
    <g>
      <Shade u={u} />
      <path d={sm([[260, 40], [150, 60], [80, 140], [64, 260], [80, 380], [130, 470], [200, 516], [260, 524], [320, 516], [390, 470], [440, 380], [456, 260], [440, 140], [370, 60]], true)} fill={C.t1} stroke={C.ink} strokeOpacity={0.4} strokeWidth={1.6} />
      <path d="M260 40 V524" stroke={C.ink} strokeOpacity={0.25} />
      <Mirror cx={260}>
        <path d="M170 112 C190 140 216 170 240 192" stroke={C.ink} strokeWidth={22} fill="none" strokeLinecap="round" />
        <path d="M170 112 C190 140 216 170 240 192" stroke={C.paper} strokeWidth={19} fill="none" strokeLinecap="round" data-line="nerve" />
        <circle cx={170} cy={80} r={36} fill={C.paper} stroke={C.ink} strokeWidth={2} data-part="eyes" />
        <path d={sm(ell(196, 300, 18, 13, 10))} fill={C.t3} stroke={C.ink} strokeWidth={1.6} data-part="lgn" />
        <path d={sm([[180, 460], [214, 470], [248, 476], [252, 506], [212, 504], [178, 490]], true)} fill={C.hiSoft} stroke={C.ink} strokeWidth={1.6} data-part="v1" />
      </Mirror>
      <path d="M200 60 A36 36 0 0 1 200 100" stroke={C.blue} strokeWidth={6} fill="none" />
      <path d="M140 60 A36 36 0 0 0 140 100" stroke={C.ink} strokeWidth={6} fill="none" />
      <path d="M380 60 A36 36 0 0 1 380 100" stroke={C.blue} strokeWidth={6} fill="none" />
      <path d="M320 60 A36 36 0 0 0 320 100" stroke={C.ink} strokeWidth={6} fill="none" />
      {/* Fibres carrying the LEFT visual field (blue) end in the RIGHT hemisphere (viewer's right) */}
      <g fill="none" strokeLinecap="round" strokeWidth={3.6}>
        <path d="M196 106 C214 140 240 172 260 196 C284 226 306 264 318 292" stroke={C.blue} data-line="tract" />
        <path d="M376 106 C356 150 300 178 286 200 C298 236 312 266 322 292" stroke={C.blue} data-line="tract" />
        <path d="M324 106 C306 140 280 172 260 196 C236 226 214 264 202 292" stroke={C.ink} />
        <path d="M144 106 C164 150 220 178 234 200 C222 236 208 266 198 292" stroke={C.ink} />
        <path d="M334 306 C392 300 414 360 392 420 C376 462 320 486 296 490" stroke={C.blue} data-line="radiation" />
        <path d="M330 314 C330 360 316 420 304 470" stroke={C.blue} data-line="parietal" />
        <path d="M186 306 C128 300 106 360 128 420 C144 462 200 486 224 490" stroke={C.ink} />
        <path d="M190 314 C190 360 204 420 216 470" stroke={C.ink} />
      </g>
      <path d="M232 186 C248 196 272 196 288 186 L280 206 C266 212 254 212 240 206 Z" fill={C.paper} stroke={C.ink} strokeWidth={1.6} data-part="chiasm" />
      {[["A", 315, 152], ["B", 260, 198], ["C", 304, 248], ["D", 406, 380], ["E", 322, 400], ["F", 290, 492]].map(([k, x, y]) => (
        <g key={k as string}>
          <path d={`M${(x as number) - 9} ${(y as number) - 9} l18 18 m0 -18 l-18 18`} stroke={C.ink} strokeWidth={4} />
          <text x={(x as number) + 12} y={(y as number) - 8} fontSize={15} fontWeight={700} fill={C.ink}>
            {k}
          </text>
        </g>
      ))}
      {FIELDS.map((f) => (
        <g key={f.key}>
          <text x={520} y={f.y + 5} fontSize={16} fontWeight={700} fill={C.ink}>
            {f.key}
          </text>
          <FieldPair y={f.y} black={f.black} />
        </g>
      ))}
      <Note x={584} y={58} size={13}>Left eye, right eye</Note>
      <Note x={260} y={34} size={13}>Front</Note>
    </g>
  ),
  labels: [
    { id: "eyes", name: "Retina", x: 170, y: 80, about: "Each retina sees the opposite half of the world on its other half: the nasal (inner) half sees the outer field." },
    { id: "nerve", name: "A: optic nerve", x: 315, y: 152, about: "Damage blinds that eye alone (for example optic neuritis or glaucoma)." },
    { id: "chiasm", name: "B: optic chiasm", x: 260, y: 198, about: "Only the fibres from the nasal halves cross here. A pituitary tumour pressing from below causes loss of both outer (temporal) fields, bitemporal hemianopia." },
    { id: "tract", name: "C: optic tract", x: 304, y: 248, about: "Each tract carries the opposite visual field from both eyes, so damage causes loss of the same half in both eyes (homonymous hemianopia)." },
    { id: "lgn", name: "Lateral geniculate nucleus", x: 324, y: 300, about: "The thalamic relay for vision, sending the signal on to the cortex." },
    { id: "radiation", name: "D: Meyer's loop", x: 406, y: 380, about: "Lower fibres loop forward through the temporal lobe; damage there (for example temporal lobe surgery) loses the opposite upper quarter, pie in the sky." },
    { id: "parietal", name: "E: parietal radiation", x: 322, y: 400, about: "Upper fibres run through the parietal lobe; damage loses the opposite lower quarter." },
    { id: "v1", name: "F: visual cortex (V1)", x: 290, y: 492, about: "Damage from a posterior cerebral artery stroke gives a homonymous hemianopia, often sparing central vision because the macula has a double blood supply." },
  ],
};

/* ---- The ear ---- */
export const ear: FigureDef = {
  id: "ear",
  title: "The ear: outer, middle and inner",
  viewBox: "20 40 600 340",
  summary: "A cut through the ear showing the pinna, ear canal, eardrum, the three ossicles in the middle ear, the Eustachian tube, and the cochlea, vestibule, semicircular canals and the eighth nerve in the inner ear.",
  art: (u) => (
    <g>
      <Shade u={u} />
      <path d="M250 60 L620 60 L620 380 L300 380 C280 330 260 290 250 240 Z" fill={C.t1} stroke="none" />
      <Solid d={sm([[110, 70], [70, 90], [46, 150], [50, 230], [70, 300], [100, 340], [124, 330], [120, 290], [104, 250], [112, 214], [124, 190], [130, 140], [126, 96]], true)} fill={C.t2} u={u} part="pinna" />
      <path d="M118 194 C170 190 220 196 262 186 L266 236 C220 230 170 226 118 222 Z" fill={C.paper} stroke={C.ink} strokeWidth={2} data-part="canal" />
      <path d="M262 180 L270 244" stroke={C.ink} strokeWidth={4} data-line="drum" />
      <path d={sm([[272, 150], [336, 140], [350, 200], [340, 270], [278, 268]], true)} fill={C.paper} stroke={C.ink} strokeWidth={1.6} data-part="middle" />
      <path d="M300 260 C320 300 350 340 390 370" stroke={C.ink} strokeWidth={14} fill="none" />
      <path d="M300 260 C320 300 350 340 390 370" stroke={C.paper} strokeWidth={10} fill="none" data-line="eustachian" />
      <path d="M272 214 L282 170 C286 160 296 160 298 170 L292 182" fill={C.t3} stroke={C.ink} strokeWidth={1.6} data-part="malleus" />
      <path d="M294 168 C304 160 316 164 316 176 L312 204 L304 204 L304 184 Z" fill={C.t3} stroke={C.ink} strokeWidth={1.6} data-part="incus" />
      <path d="M310 206 L330 200 L334 214 L330 228 L312 222 Z" fill={C.t3} stroke={C.ink} strokeWidth={1.6} data-part="stapes" />
      <path d={sm(ell(360, 200, 24, 30, 12))} fill={C.blueSoft} stroke={C.ink} strokeWidth={1.8} data-part="vestibule" />
      {[[390, 110, 34, 24, -0.4], [430, 150, 30, 36, 0.2], [400, 170, 40, 16, 0]].map(([x, y, rx, ry, rot], i) => (
        <path key={i} d={sm(ell(x, y, rx, ry, 14, rot))} fill="none" stroke={C.ink} strokeWidth={9} />
      ))}
      {[[390, 110, 34, 24, -0.4], [430, 150, 30, 36, 0.2], [400, 170, 40, 16, 0]].map(([x, y, rx, ry, rot], i) => (
        <path key={`b${i}`} d={sm(ell(x, y, rx, ry, 14, rot))} fill="none" stroke={C.blueSoft} strokeWidth={6} data-line="canals" />
      ))}
      <path d={(() => {
        let d = "";
        for (let i = 0; i <= 120; i++) {
          const a = (i / 120) * Math.PI * 5.2;
          const r = 46 - i * 0.32;
          d += `${i ? "L" : "M"}${(410 + Math.cos(a) * r).toFixed(1)} ${(272 + Math.sin(a) * r * 0.85).toFixed(1)} `;
        }
        return d;
      })()} stroke={C.ink} strokeWidth={13} fill="none" strokeLinecap="round" />
      <path d={(() => {
        let d = "";
        for (let i = 0; i <= 120; i++) {
          const a = (i / 120) * Math.PI * 5.2;
          const r = 46 - i * 0.32;
          d += `${i ? "L" : "M"}${(410 + Math.cos(a) * r).toFixed(1)} ${(272 + Math.sin(a) * r * 0.85).toFixed(1)} `;
        }
        return d;
      })()} stroke={C.hiSoft} strokeWidth={9} fill="none" strokeLinecap="round" data-line="cochlea" />
      <circle cx={338} cy={238} r={6} fill={C.paper} stroke={C.ink} strokeWidth={1.4} data-part="round" />
      <path d="M440 210 C490 196 540 190 600 188" stroke={C.ink} strokeWidth={12} fill="none" />
      <path d="M440 210 C490 196 540 190 600 188" stroke={C.t2} strokeWidth={9} fill="none" data-line="cn8" />
      <Note x={70} y={370} size={13}>Outer</Note>
      <Note x={300} y={130} size={13}>Middle</Note>
      <Note x={520} y={120} size={13}>Inner</Note>
    </g>
  ),
  labels: [
    { id: "pinna", name: "Pinna", x: 70, y: 150, about: "The outer ear, which funnels sound and helps tell whether it comes from in front or behind." },
    { id: "canal", name: "Ear canal", x: 190, y: 210, about: "Carries sound to the eardrum." },
    { id: "drum", name: "Eardrum", x: 266, y: 212, about: "Vibrates with sound and passes it to the ossicles." },
    { id: "malleus", name: "Malleus (hammer)", x: 284, y: 178, about: "The first ossicle, attached to the eardrum." },
    { id: "incus", name: "Incus (anvil)", x: 308, y: 176, about: "The middle of the three ossicles, linking the hammer to the stirrup." },
    { id: "stapes", name: "Stapes (stirrup)", x: 322, y: 214, about: "The smallest bone in the body, pushing on the oval window of the inner ear. The ossicles amplify the sound about twenty times." },
    { id: "middle", name: "Middle ear", x: 316, y: 248, about: "An air-filled space; fluid here (glue ear) causes conductive hearing loss in children." },
    { id: "eustachian", name: "Eustachian tube", x: 350, y: 334, about: "Links the middle ear to the throat and equalises pressure." },
    { id: "canals", name: "Semicircular canals", x: 418, y: 98, about: "Three fluid loops at right angles that sense head rotation; problems cause vertigo." },
    { id: "vestibule", name: "Vestibule", x: 360, y: 200, about: "Senses gravity and straight-line movement." },
    { id: "round", name: "Round window", x: 338, y: 238, about: "A membrane that bulges to let the cochlear fluid move." },
    { id: "cochlea", name: "Cochlea", x: 410, y: 272, about: "The snail-shaped hearing organ. Hair cells on the basilar membrane turn vibration into nerve signals, high pitches at the base and low at the tip." },
    { id: "cn8", name: "Vestibulocochlear nerve", x: 540, y: 192, about: "Carries hearing and balance to the brainstem. An acoustic neuroma on it causes one-sided deafness and tinnitus." },
  ],
};

/* ---- Auditory pathway on a coronal outline ---- */
export const auditoryPathway: FigureDef = {
  id: "auditory-pathway",
  title: "The auditory pathway",
  viewBox: "30 20 540 520",
  summary: "A front view of the brain and brainstem showing the hearing pathway from the cochlea to the cochlear nuclei, superior olive, lateral lemniscus, inferior colliculus, medial geniculate nucleus and auditory cortex, with crossing at every level.",
  art: (u) => (
    <g>
      <Shade u={u} />
      <g opacity={0.5}>
        <Mirror cx={300}>
          <path d={CORONAL.outer} fill={C.t2} stroke={C.ink} strokeWidth={1.4} />
          <path d={CORONAL.inner} fill={C.paper} stroke="none" />
          <path d={CORONAL.thalamus} fill={C.t2} stroke={C.ink} strokeWidth={1.2} />
        </Mirror>
      </g>
      <path d={tube([[300, 300], [300, 380], [300, 450], [300, 520]], [120, 140, 100, 70])} fill={C.t1} stroke={C.ink} strokeWidth={1.8} />
      <Mirror cx={300}>
        <path d={sm(ell(110, 258, 18, 9, 8, -0.2))} fill={C.hiSoft} stroke={C.ink} strokeWidth={1.6} data-part="a1" />
        <path d={sm(ell(244, 276, 12, 9, 8))} fill={C.t3} stroke={C.ink} strokeWidth={1.4} data-part="mgn" />
        <path d={sm(ell(282, 330, 13, 10, 8))} fill={C.t3} stroke={C.ink} strokeWidth={1.4} data-part="ic" />
        <path d={sm(ell(276, 410, 10, 7, 8))} fill={C.t3} stroke={C.ink} strokeWidth={1.4} data-part="soc" />
        <path d={sm(ell(250, 444, 12, 9, 8))} fill={C.t3} stroke={C.ink} strokeWidth={1.4} data-part="cn" />
        <path d={(() => {
          let d = "";
          for (let i = 0; i <= 60; i++) {
            const a = (i / 60) * Math.PI * 4.6;
            const r = 22 - i * 0.3;
            d += `${i ? "L" : "M"}${(120 + Math.cos(a) * r).toFixed(1)} ${(470 + Math.sin(a) * r).toFixed(1)} `;
          }
          return d;
        })()} stroke={C.ink} strokeWidth={7} fill="none" data-line="cochlea" />
      </Mirror>
      <g fill="none" strokeLinecap="round" strokeWidth={3.4}>
        <path d="M140 464 C180 456 220 448 240 446" stroke={C.line} markerEnd={`url(#${u("arrow")})`} data-line="cn8" />
        <path d="M258 438 C266 428 270 420 272 414" stroke={C.line} markerEnd={`url(#${u("arrow")})`} />
        <path d="M262 448 C290 440 310 420 324 412" stroke={C.line} markerEnd={`url(#${u("arrow")})`} data-line="trapezoid" />
        <path d="M328 404 C334 380 330 356 320 338" stroke={C.line} markerEnd={`url(#${u("arrow")})`} data-line="lemniscus" />
        <path d="M274 404 C272 380 276 356 280 342" stroke={C.line} strokeOpacity={0.6} markerEnd={`url(#${u("arrow")})`} data-line="lemniscus" />
        <path d="M322 320 C330 300 344 290 352 284" stroke={C.line} markerEnd={`url(#${u("arrow")})`} />
        <path d="M368 270 C420 262 460 258 480 258" stroke={C.line} markerEnd={`url(#${u("arrow")})`} data-line="radiation" />
        <path d="M232 270 C190 262 150 260 128 258" stroke={C.line} strokeOpacity={0.6} markerEnd={`url(#${u("arrow")})`} />
      </g>
      <Note x={120} y={514} size={13}>Right ear</Note>
    </g>
  ),
  labels: [
    { id: "cochlea", name: "Cochlea", x: 120, y: 470, about: "Hair cells turn sound into signals in the eighth nerve." },
    { id: "cn8", name: "Eighth nerve", x: 190, y: 456, about: "The cochlear part of the vestibulocochlear nerve." },
    { id: "cn", name: "Cochlear nuclei", x: 250, y: 444, about: "The first relay, on the same side as the ear. Damage here or in the nerve deafens that ear." },
    { id: "trapezoid", name: "Crossing fibres", x: 300, y: 428, about: "Many fibres cross to the other side here and at higher levels, so each ear is heard by both hemispheres; a stroke in one temporal lobe does not cause deafness." },
    { id: "soc", name: "Superior olive", x: 324, y: 410, about: "Compares the timing and loudness at the two ears to work out where a sound comes from." },
    { id: "lemniscus", name: "Lateral lemniscus", x: 330, y: 370, about: "The ascending bundle carrying hearing up through the pons." },
    { id: "ic", name: "Inferior colliculus", x: 318, y: 330, about: "The midbrain hearing centre that orients you to sounds and startles." },
    { id: "mgn", name: "Medial geniculate nucleus", x: 356, y: 276, about: "The thalamic relay for hearing." },
    { id: "radiation", name: "Auditory radiation", x: 430, y: 262, about: "Fibres from the thalamus to the cortex." },
    { id: "a1", name: "Primary auditory cortex", x: 490, y: 258, about: "On Heschl's gyrus, on the upper surface of the temporal lobe inside the lateral sulcus; it is active during auditory hallucinations in schizophrenia." },
  ],
};

/* ---- Smell ---- */
export const olfaction: FigureDef = {
  id: "olfaction",
  title: "The sense of smell",
  viewBox: "20 30 580 380",
  summary: "A side view of the nose and the underside of the front of the brain with the olfactory epithelium, receptor neurons passing through the cribriform plate, the olfactory bulb with glomeruli and mitral cells, the olfactory tract, and the cortex it reaches.",
  art: (u) => (
    <g>
      <Shade u={u} />
      <path d={sm([[236, 30], [180, 60], [140, 120], [140, 170], [130, 200], [96, 250], [62, 290], [70, 304], [96, 306], [110, 320], [104, 340], [116, 356], [140, 400], [380, 400], [380, 230], [330, 196]], true)} fill={C.t2} fillOpacity={0.55} stroke={C.ink} strokeWidth={2} />
      <path d={sm([[220, 60], [320, 40], [460, 50], [560, 90], [580, 160], [540, 190], [470, 186], [380, 176], [300, 168], [230, 160], [200, 120]], true)} fill={C.t1} stroke={C.ink} strokeWidth={2} data-part="frontal" />
      <path d={sm(ell(470, 214, 40, 24, 12, 0.1))} fill={C.t2} stroke={C.ink} strokeWidth={1.8} data-part="piriform" />
      <path d={sm(ell(518, 238, 16, 13, 10))} fill={C.t3} stroke={C.ink} strokeWidth={1.6} data-part="amygdala" />
      <path d={sm([[98, 298], [128, 236], [204, 200], [312, 200], [334, 254], [334, 330], [220, 340], [124, 324]], true)} fill={C.paper} stroke={C.ink} strokeWidth={1.6} data-part="cavity" />
      {[[150, 250], [176, 290], [200, 330]].map(([x, y], i) => (
        <path key={i} d={`M${x + 120} ${y - 16} C${x + 60} ${y - 34} ${x} ${y - 20} ${x - 20} ${y + 6} C${x + 30} ${y - 6} ${x + 80} ${y} ${x + 124} ${y + 4} Z`} fill={C.t2} stroke={C.ink} strokeWidth={1.6} data-part="conchae" />
      ))}
      <rect x={200} y={186} width={110} height={10} fill={C.t3} stroke={C.ink} strokeWidth={1.4} data-part="plate" />
      {[214, 232, 250, 268, 286].map((x) => (
        <rect key={x} x={x} y={186} width={6} height={10} fill={C.paper} />
      ))}
      <path d="M204 196 L306 196 L304 212 L206 212 Z" fill={C.hiSoft} stroke={C.ink} strokeWidth={1.2} data-part="epithelium" />
      {[216, 234, 252, 270, 288].map((x) => (
        <g key={x}>
          <path d={`M${x + 1} 210 V170`} stroke={C.blue} strokeWidth={2} data-line="receptors" />
          <circle cx={x + 1} cy={206} r={3} fill={C.blue} />
        </g>
      ))}
      <path d={sm(ell(256, 156, 60, 18, 14))} fill={C.t2} stroke={C.ink} strokeWidth={1.8} data-part="bulb" />
      {[216, 236, 256, 276, 296].map((x) => (
        <circle key={x} cx={x} cy={164} r={6} fill={C.paper} stroke={C.ink} strokeWidth={1} data-part="glomeruli" />
      ))}
      {[226, 256, 286].map((x) => (
        <path key={x} d={`M${x} 150 l-5 -6 h10 z`} fill={C.ink} data-part="mitral" />
      ))}
      <path d="M312 154 C360 160 410 176 440 200" stroke={C.ink} strokeWidth={9} fill="none" />
      <path d="M312 154 C360 160 410 176 440 200" stroke={C.t2} strokeWidth={6} fill="none" data-line="tract" />
      <path d="M300 160 C340 120 380 110 420 108" stroke={C.line} strokeWidth={2.6} fill="none" strokeDasharray="5 4" markerEnd={`url(#${u("arrow")})`} data-line="ofc" />
      <Note x={40} y={330} size={13}>Air in</Note>
      <path d="M40 310 C60 300 80 296 104 290" stroke={C.ink} strokeWidth={1.4} fill="none" markerEnd={`url(#${u("arrowInk")})`} />
    </g>
  ),
  labels: [
    { id: "cavity", name: "Nasal cavity", x: 110, y: 330, about: "Air carrying odour molecules swirls up towards the roof of the nose." },
    { id: "conchae", name: "Conchae", x: 220, y: 300, about: "Curled bony shelves that warm and moisten air and steer some of it upwards." },
    { id: "epithelium", name: "Olfactory epithelium", x: 250, y: 206, about: "A small patch in the roof of the nose holding millions of smell receptor neurons, renewed every few weeks." },
    { id: "receptors", name: "Receptor neurons", x: 288, y: 192, about: "Each expresses one of about 400 odour receptor types; their axons are the first cranial nerve." },
    { id: "plate", name: "Cribriform plate", x: 300, y: 190, about: "A sieve of bone the fibres pass through. A head injury that shears them causes loss of smell (anosmia)." },
    { id: "bulb", name: "Olfactory bulb", x: 220, y: 150, about: "The first relay. Loss of smell is an early sign of Parkinson's and Alzheimer's disease; in Kallmann syndrome the bulbs fail to form." },
    { id: "glomeruli", name: "Glomeruli", x: 276, y: 164, about: "Round knots where all receptors of one type meet, making an odour map." },
    { id: "mitral", name: "Mitral cells", x: 256, y: 146, about: "Output neurons of the bulb, sending the signal along the tract." },
    { id: "tract", name: "Olfactory tract", x: 380, y: 170, about: "Runs back under the frontal lobe; smell reaches the cortex without first stopping in the thalamus." },
    { id: "piriform", name: "Piriform cortex", x: 470, y: 214, about: "The primary smell cortex. Seizures starting near here cause brief smell hallucinations, often of burning." },
    { id: "amygdala", name: "Amygdala", x: 518, y: 238, about: "Receives smell directly, which is why smells trigger strong emotional memories." },
    { id: "ofc", name: "To orbitofrontal cortex", x: 380, y: 112, about: "Where smell is consciously identified and combined with taste into flavour." },
    { id: "frontal", name: "Frontal lobe (underside)", x: 480, y: 80, about: "The orbital surface of the frontal lobe lies just above the bulbs." },
  ],
};

/* ---- Taste ---- */
export const taste: FigureDef = {
  id: "taste",
  title: "Taste: the tongue and a taste bud",
  viewBox: "20 20 720 400",
  summary: "The upper surface of the tongue with its papillae and the nerves that carry taste from each part, and a single taste bud with its pore, receptor cells and nerve fibres.",
  art: (u) => (
    <g>
      <Shade u={u} />
      <path d={sm([[150, 44], [174, 36], [198, 44], [190, 64], [158, 64]], true)} fill={C.t2} stroke={C.ink} strokeWidth={1.6} data-part="epiglottis" />
      <Solid d={sm([[90, 80], [254, 80], [290, 160], [284, 260], [250, 340], [210, 386], [174, 396], [138, 386], [98, 340], [64, 260], [58, 160]], true)} fill={C.hiSoft} u={u} part="anterior" />
      <path d={sm([[90, 80], [254, 80], [282, 140], [174, 176], [66, 140]], true)} fill={C.t2} stroke={C.ink} strokeWidth={1.4} data-part="posterior" />
      <path d="M86 132 L174 176 L262 132" stroke={C.ink} strokeWidth={2} fill="none" data-line="terminalis" />
      {[[100, 140], [128, 154], [156, 166], [192, 166], [220, 154], [248, 140]].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r={9} fill={C.paper} stroke={C.ink} strokeWidth={1.6} data-part="vallate" />
          <circle cx={x} cy={y} r={4} fill={C.t2} />
        </g>
      ))}
      {[[110, 220], [150, 230], [200, 220], [240, 230], [130, 270], [180, 266], [222, 278], [120, 320], [170, 316], [214, 318], [150, 360], [196, 356], [96, 260], [256, 270]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={4.5} fill={C.paper} stroke={C.ink} strokeWidth={1.2} data-part="fungiform" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <path d={`M${64 + i * 2} ${150 + i * 12} l10 2`} stroke={C.ink} strokeWidth={2} data-line="foliate" />
          <path d={`M${284 - i * 2} ${150 + i * 12} l-10 2`} stroke={C.ink} strokeWidth={2} data-line="foliate" />
        </g>
      ))}
      <path d="M174 176 V380" stroke={C.ink} strokeOpacity={0.3} />
      {/* Taste bud close-up */}
      <path d="M380 140 H720 V380 H380 Z" fill={C.t1} stroke={C.ink} strokeWidth={1.6} />
      <path d="M380 140 H720" stroke={C.ink} strokeWidth={3} />
      <path d={sm([[550, 150], [600, 176], [620, 240], [604, 320], [550, 346], [496, 320], [480, 240], [500, 176]], true)} fill={C.paper} stroke={C.ink} strokeWidth={2} data-part="bud" />
      {[-48, -28, -8, 12, 32].map((dx, i) => (
        <path key={dx} d={`M${550 + dx * 0.4} 156 C${550 + dx} 200 ${550 + dx * 1.2} 280 ${550 + dx} 336`} stroke={C.ink} strokeWidth={1.4} fill="none" data-line={i % 2 ? "cells" : undefined} />
      ))}
      {[[524, 240], [546, 260], [566, 236], [584, 262], [536, 300], [570, 300]].map(([x, y]) => (
        <ellipse key={`${x}${y}`} cx={x} cy={y} rx={6} ry={9} fill={C.t3} stroke={C.ink} strokeWidth={1} data-part="cells" />
      ))}
      <path d="M538 140 L550 156 L562 140" fill={C.paper} stroke={C.ink} strokeWidth={1.6} data-part="pore" />
      {[544, 550, 556].map((x) => (
        <path key={x} d={`M${x} 156 V146`} stroke={C.ink} strokeWidth={1.2} />
      ))}
      {[[520, 346, 470, 390], [550, 346, 550, 400], [580, 346, 640, 392]].map(([a, b, c, d]) => (
        <path key={a} d={`M${a} ${b} C${a} ${b + 20} ${c} ${d - 20} ${c} ${d}`} stroke={C.blue} strokeWidth={3} fill="none" data-line="fibres" />
      ))}
      <path d="M560 330 l6 -8 l6 8" fill={C.t3} stroke={C.ink} data-part="basal" />
      <Note x={550} y={130} size={13}>One taste bud, much enlarged</Note>
    </g>
  ),
  labels: [
    { id: "epiglottis", name: "Epiglottis", x: 174, y: 52, about: "A few taste buds sit here and in the throat, carried by the vagus nerve (tenth cranial nerve)." },
    { id: "posterior", name: "Back third of tongue", x: 120, y: 110, about: "Taste here travels in the glossopharyngeal nerve (ninth cranial nerve)." },
    { id: "vallate", name: "Circumvallate papillae", x: 192, y: 166, about: "A V-shaped row of large papillae, each holding hundreds of taste buds in its trench." },
    { id: "terminalis", name: "Sulcus terminalis", x: 240, y: 144, about: "The V-shaped groove dividing the front two thirds from the back third." },
    { id: "foliate", name: "Foliate papillae", x: 70, y: 164, about: "Leaf-like folds on the back edges of the tongue with many taste buds." },
    { id: "anterior", name: "Front two thirds", x: 230, y: 300, about: "Taste here travels in the chorda tympani of the facial nerve (seventh cranial nerve). All five tastes are sensed all over the tongue; the old tongue map is a myth." },
    { id: "fungiform", name: "Fungiform papillae", x: 180, y: 266, about: "Mushroom-shaped papillae scattered over the front, each with a few taste buds." },
    { id: "pore", name: "Taste pore", x: 550, y: 148, about: "The opening where dissolved chemicals reach the taste cells' microvilli." },
    { id: "cells", name: "Taste receptor cells", x: 566, y: 236, about: "Detect sweet, sour, salty, bitter and umami and are replaced every one to two weeks. Lithium, clozapine and some other drugs can alter taste." },
    { id: "basal", name: "Basal cells", x: 566, y: 326, about: "Stem cells that replace the taste cells." },
    { id: "fibres", name: "Taste nerve fibres", x: 640, y: 380, about: "Carry taste to the solitary nucleus in the medulla, then to the thalamus and the gustatory cortex in the insula." },
    { id: "bud", name: "Taste bud", x: 500, y: 300, about: "An onion-shaped cluster of 50 to 100 cells; there are about 5,000 to 10,000 in the mouth." },
  ],
};
