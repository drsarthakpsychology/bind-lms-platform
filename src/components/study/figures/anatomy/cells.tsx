import type { FigureDef } from "../types";
import { Branches, C, Groove, Note, Shade, Solid, ell, sm, tree } from "./kit";

/*
 * Nerve cells, myelin, glia and the synapse.
 * References checked: OpenStax Anatomy and Physiology 2e, 12.2 "Nervous Tissue"
 * (neuron parts, neuron shapes: multipolar, bipolar, unipolar; glial cells of
 * the CNS and PNS); OpenStax Psychology 2e, 3.2 "Cells of the Nervous System";
 * Bear, Connors and Paradiso chapter on neurons and glia (local copy) for the
 * axon hillock, nodes of Ranvier and Schwann cell versus oligodendrocyte.
 */

/** A myelin segment along a horizontal axon. */
function Sheath({ x, y, len, h = 22, part = "myelin", nucleus }: { x: number; y: number; len: number; h?: number; part?: string; nucleus?: boolean }) {
  return (
    <g>
      <rect x={x} y={y - h / 2} width={len} height={h} rx={h / 2} fill={C.paper} stroke={C.ink} strokeWidth={1.8} data-part={part} />
      <path d={`M${x + 8} ${y - h / 4} H${x + len - 8} M${x + 8} ${y + h / 4} H${x + len - 8}`} stroke={C.ink} strokeOpacity={0.3} strokeWidth={1} />
      {nucleus ? <ellipse cx={x + len / 2} cy={y - h / 2 - 4} rx={12} ry={5} fill={C.t3} stroke={C.ink} strokeWidth={1.4} data-part="schwann" /> : null}
    </g>
  );
}

const SOMA = sm([[110, 118], [140, 106], [170, 122], [188, 146], [174, 176], [146, 194], [114, 186], [98, 156]], true);

export const neuron: FigureDef = {
  id: "neuron",
  title: "A neuron and its parts",
  viewBox: "20 30 680 250",
  summary: "A typical motor-type neuron with dendrites, cell body, nucleus, axon hillock, myelinated axon with nodes, and axon terminals.",
  art: (u) => (
    <g>
      <Shade u={u} />
      {[
        [112, 122, -2.3, 1],
        [100, 160, 3.1, 2],
        [118, 186, 2.3, 3],
        [150, 108, -1.55, 4],
        [150, 192, 1.6, 5],
        [176, 122, -0.9, 6],
      ].map(([x, y, a, s]) => (
        <Branches key={s} t={tree(x, y, a, 34, 3, 9, 0.5, s)} part="dendrites" />
      ))}
      <path d="M176 134 L214 147 L214 153 L176 168 Z" fill={C.t2} stroke={C.ink} strokeWidth={1.8} data-part="hillock" />
      <Solid d={SOMA} fill={C.t2} u={u} part="soma" />
      {[[120, 130], [160, 132], [118, 170], [160, 172], [132, 182], [104, 150]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={2.4} fill={C.ink} fillOpacity={0.35} />
      ))}
      <circle cx={138} cy={150} r={17} fill={C.t3} stroke={C.ink} strokeWidth={1.6} data-part="nucleus" />
      <circle cx={142} cy={146} r={5} fill={C.t4} />
      <path d="M212 150 H604" stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
      <path d="M212 150 H604" stroke={C.t2} strokeWidth={5} strokeLinecap="round" data-line="axon" />
      {[250, 314, 378, 442, 506].map((x, i) => (
        <Sheath key={x} x={x} y={150} len={56} nucleus={i === 1} />
      ))}
      <g>
        {[
          "M602 150 Q620 120 650 104",
          "M602 150 Q630 140 664 136",
          "M602 150 Q630 164 664 172",
          "M602 150 Q618 182 646 204",
        ].map((d) => (
          <g key={d}>
            <path d={d} stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
            <path d={d} stroke={C.t2} strokeWidth={3.4} fill="none" strokeLinecap="round" data-line="terminals" />
          </g>
        ))}
        {[[654, 102], [669, 136], [669, 173], [650, 207]].map(([x, y]) => (
          <circle key={x + y} cx={x} cy={y} r={8} fill={C.hiSoft} stroke={C.ink} strokeWidth={1.8} data-part="bouton" />
        ))}
      </g>
      <Note x={420} y={210}>Signal travels this way</Note>
      <path d="M340 220 H500" stroke={C.ink} strokeWidth={1.6} markerEnd={`url(#${u("arrowInk")})`} />
    </g>
  ),
  labels: [
    { id: "dendrites", name: "Dendrites", x: 70, y: 96, about: "Branches that receive messages from other neurons. Their small spines are where most learning changes happen, and they are thinned in chronic stress and depression." },
    { id: "soma", name: "Cell body (soma)", x: 116, y: 180, about: "Holds the nucleus and the machinery that makes proteins and transmitters. It adds up the incoming signals." },
    { id: "nucleus", name: "Nucleus", x: 134, y: 154, about: "Holds the DNA. Genes switched on here, for example by antidepressants over weeks, change how the cell works." },
    { id: "hillock", name: "Axon hillock", x: 198, y: 150, about: "The cone where the axon begins. If the summed input reaches threshold here, the neuron fires an action potential." },
    { id: "axon", name: "Axon", x: 232, y: 150, about: "The long cable that carries the action potential away from the cell body, in some cells for up to a metre." },
    { id: "myelin", name: "Myelin sheath", x: 285, y: 160, about: "Fatty insulation wrapped round the axon that makes signals travel much faster. It is lost in multiple sclerosis." },
    { id: "node", name: "Node of Ranvier", x: 374, y: 150, about: "A short bare gap between sheaths, packed with sodium channels. The signal jumps from node to node (saltatory conduction)." },
    { id: "schwann", name: "Schwann cell nucleus", x: 342, y: 135, about: "In nerves outside the brain each sheath is one Schwann cell wrapped round the axon, which is why those nerves can regrow after injury." },
    { id: "terminals", name: "Axon terminals", x: 628, y: 160, about: "The end branches of the axon, which reach other neurons, muscles or glands." },
    { id: "bouton", name: "Synaptic bouton", x: 669, y: 173, about: "The swollen ending that stores transmitter in vesicles and releases it into the synapse." },
  ],
};

const MULTI = sm([[78, 98], [96, 88], [114, 100], [118, 120], [104, 134], [86, 134], [74, 118]], true);
const PYR = "M650 214 L665 170 L680 214 C674 222 656 222 650 214 Z";

export const neuronTypes: FigureDef = {
  id: "neuron-types",
  title: "Neuron shapes",
  viewBox: "0 20 760 320",
  summary: "Four neuron shapes side by side: multipolar, bipolar, pseudounipolar and pyramidal, each with its dendrites, cell body and axon.",
  art: (u) => (
    <g>
      <Shade u={u} />
      {/* Multipolar (motor neuron) */}
      {[[80, 100, -2.2, 11], [112, 98, -0.9, 12], [96, 88, -1.6, 13], [74, 120, 2.9, 14], [118, 122, 0.3, 15]].map(([x, y, a, s]) => (
        <Branches key={s} t={tree(x, y, a, 26, 3, 7, 0.5, s)} part="multi-dend" />
      ))}
      <path d="M96 134 V318" stroke={C.ink} strokeWidth={6.5} />
      <path d="M96 134 V318" stroke={C.t2} strokeWidth={4} data-line="multi-axon" />
      {[160, 204, 248].map((y) => (
        <rect key={y} x={88} y={y} width={16} height={38} rx={8} fill={C.paper} stroke={C.ink} strokeWidth={1.6} data-part="multi-axon" />
      ))}
      <Solid d={MULTI} fill={C.t2} u={u} part="multipolar" />
      <circle cx={96} cy={112} r={8} fill={C.t3} stroke={C.ink} strokeWidth={1.2} />
      <Note x={96} y={336}>Multipolar</Note>
      {/* Bipolar (retina) */}
      <Branches t={tree(286, 150, -1.57, 50, 2, 6, 0.45, 21)} part="bi-dend" />
      <Branches t={tree(286, 190, 1.57, 60, 2, 5, 0.4, 22)} part="bi-axon" />
      <Solid d={sm(ell(286, 170, 14, 22, 12))} fill={C.t2} u={u} part="bipolar" />
      <circle cx={286} cy={170} r={7} fill={C.t3} stroke={C.ink} strokeWidth={1.2} />
      <Note x={286} y={336}>Bipolar</Note>
      {/* Pseudounipolar (sensory neuron) */}
      <path d="M440 126 C452 140 466 150 476 168" stroke={C.ink} strokeWidth={6} fill="none" />
      <path d="M440 126 C452 140 466 150 476 168" stroke={C.t2} strokeWidth={3.6} fill="none" />
      <path d="M476 168 C500 120 520 80 540 48" stroke={C.ink} strokeWidth={6} fill="none" />
      <path d="M476 168 C500 120 520 80 540 48" stroke={C.t2} strokeWidth={3.6} fill="none" data-line="peripheral" />
      <Branches t={tree(540, 48, -1.2, 14, 2, 3, 0.6, 31)} part="peripheral" />
      <path d="M476 168 C478 220 478 270 476 304" stroke={C.ink} strokeWidth={6} fill="none" />
      <path d="M476 168 C478 220 478 270 476 304" stroke={C.t2} strokeWidth={3.6} fill="none" data-line="central" />
      <Branches t={tree(476, 304, 1.57, 12, 1, 3, 0.7, 32)} part="central" />
      <Solid d={sm(ell(432, 112, 20, 20, 12))} fill={C.t2} u={u} part="pseudo" />
      <circle cx={432} cy={112} r={8} fill={C.t3} stroke={C.ink} strokeWidth={1.2} />
      <Note x={460} y={336}>Pseudounipolar</Note>
      {/* Pyramidal (cortex) */}
      <Branches t={tree(665, 172, -1.57, 50, 3, 7, 0.32, 41)} part="apical" />
      {[[652, 214, 2.4, 42], [678, 214, 0.75, 43], [658, 218, 1.9, 44], [672, 218, 1.2, 45]].map(([x, y, a, s]) => (
        <Branches key={s} t={tree(x, y, a, 22, 2, 5, 0.5, s)} part="basal" />
      ))}
      <path d="M665 220 V318" stroke={C.ink} strokeWidth={5.5} />
      <path d="M665 220 V318" stroke={C.t2} strokeWidth={3.2} />
      <Solid d={PYR} fill={C.t2} u={u} part="pyramidal" />
      <circle cx={665} cy={202} r={6} fill={C.t3} stroke={C.ink} strokeWidth={1.2} />
      <Note x={665} y={336}>Pyramidal</Note>
    </g>
  ),
  labels: [
    { id: "multi-dend", name: "Many dendrites", x: 60, y: 70, about: "A multipolar neuron has many dendrites and one axon. It is the commonest shape in the brain and spinal cord, for example the motor neurons that move muscles." },
    { id: "multipolar", name: "Multipolar cell body", x: 96, y: 118, about: "The cell body sits among its dendrites. Motor neurons of this shape die in motor neurone disease." },
    { id: "multi-axon", name: "Myelinated axon", x: 96, y: 222, about: "The single axon leaves the cell body and carries the signal away, here wrapped in myelin." },
    { id: "bi-dend", name: "Bipolar: one dendrite", x: 286, y: 110, about: "A bipolar neuron has one dendrite and one axon on opposite poles. They are found in the retina, the inner ear and the smell lining of the nose." },
    { id: "bipolar", name: "Bipolar cell body", x: 286, y: 172, about: "The cell body sits between its two processes, passing a signal straight through, for example from rods and cones to ganglion cells." },
    { id: "pseudo", name: "Pseudounipolar cell body", x: 432, y: 112, about: "One short stalk leaves the cell body and splits in a T. These are the touch and pain neurons whose cell bodies sit in the dorsal root ganglia." },
    { id: "peripheral", name: "Peripheral branch", x: 520, y: 92, about: "Runs out to the skin, joints or organs and picks up touch, pain or position." },
    { id: "central", name: "Central branch", x: 477, y: 260, about: "Runs into the spinal cord to pass the message on. The signal skips the cell body on its way in." },
    { id: "apical", name: "Apical dendrite", x: 665, y: 110, about: "The long dendrite a pyramidal cell sends up towards the surface of the cortex." },
    { id: "pyramidal", name: "Pyramidal cell body", x: 665, y: 206, about: "The triangular main output neuron of the cortex and hippocampus. It uses glutamate, and loss of its dendritic spines is linked to schizophrenia and depression." },
    { id: "basal", name: "Basal dendrites", x: 700, y: 236, about: "Short dendrites spreading sideways from the base of a pyramidal cell, receiving input from nearby neurons." },
  ],
};

export const myelin: FigureDef = {
  id: "myelin",
  title: "Myelin, nodes and saltatory conduction",
  viewBox: "10 20 700 330",
  summary: "An axon wrapped by Schwann cells with nodes of Ranvier and the signal jumping node to node, a cross-section of the wrapped layers, and an oligodendrocyte myelinating several axons in the brain.",
  art: (u) => (
    <g>
      <Shade u={u} />
      <path d="M30 110 H690" stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
      <path d="M30 110 H690" stroke={C.t2} strokeWidth={6} strokeLinecap="round" data-line="axon" />
      {[50, 180, 310, 440, 570].map((x, i) => (
        <g key={x}>
          <rect x={x} y={92} width={118} height={36} rx={18} fill={C.paper} stroke={C.ink} strokeWidth={2} data-part="sheath" />
          <path d={`M${x + 12} 102 H${x + 106} M${x + 12} 110 H${x + 106} M${x + 12} 118 H${x + 106}`} stroke={C.ink} strokeOpacity={0.22} />
          <ellipse cx={x + 59} cy={90} rx={18} ry={6} fill={C.t3} stroke={C.ink} strokeWidth={1.4} data-part={i === 1 ? "schwann" : undefined} />
        </g>
      ))}
      {[174, 304, 434, 564].map((x, i) => (
        <g key={x}>
          <rect x={x - 5} y={103} width={10} height={14} fill={C.hi} stroke={C.ink} strokeWidth={1} data-part="node" />
          {i < 3 ? <path d={`M${x} 82 Q${x + 65} 32 ${x + 126} 80`} stroke={C.line} strokeWidth={2.6} fill="none" markerEnd={`url(#${u("arrow")})`} data-line="saltatory" /> : null}
        </g>
      ))}
      {/* Cross-section of a Schwann cell spiral */}
      <circle cx={170} cy={255} r={64} fill={C.t1} stroke={C.ink} strokeWidth={2} data-part="schwann" />
      <ellipse cx={170} cy={196} rx={20} ry={8} fill={C.t3} stroke={C.ink} strokeWidth={1.4} />
      <path d={(() => {
        let d = "";
        for (let i = 0; i <= 5 * 40; i++) {
          const a = (i / 40) * Math.PI * 2;
          const r = 22 + (i / 40) * 6.5;
          d += `${i ? "L" : "M"}${(170 + Math.cos(a) * r).toFixed(1)} ${(255 + Math.sin(a) * r).toFixed(1)} `;
        }
        return d;
      })()} fill="none" stroke={C.ink} strokeWidth={1.6} data-line="spiral" />
      <circle cx={170} cy={255} r={20} fill={C.t2} stroke={C.ink} strokeWidth={1.6} />
      <Note x={170} y={344}>Nerve outside the brain</Note>
      {/* Oligodendrocyte with several axons */}
      {[210, 262, 314].map((y) => (
        <g key={y}>
          <path d={`M380 ${y} H700`} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
          <path d={`M380 ${y} H700`} stroke={C.t2} strokeWidth={4.5} strokeLinecap="round" />
        </g>
      ))}
      {[[420, 210], [600, 210], [430, 262], [610, 262], [440, 314], [600, 314]].map(([x, y]) => (
        <rect key={`${x}${y}`} x={x - 34} y={y - 11} width={68} height={22} rx={11} fill={C.paper} stroke={C.ink} strokeWidth={1.6} data-part="cns-sheath" />
      ))}
      {[[420, 210], [600, 210], [430, 262], [610, 262], [440, 314], [600, 314]].map(([x, y]) => (
        <path key={`p${x}${y}`} d={`M515 262 Q${(515 + x) / 2} ${(262 + y) / 2 - 18} ${x} ${y - 10}`} stroke={C.ink} strokeWidth={4.5} fill="none" />
      ))}
      {[[420, 210], [600, 210], [430, 262], [610, 262], [440, 314], [600, 314]].map(([x, y]) => (
        <path key={`q${x}${y}`} d={`M515 262 Q${(515 + x) / 2} ${(262 + y) / 2 - 18} ${x} ${y - 10}`} stroke={C.t3} strokeWidth={2.4} fill="none" data-line="oligo" />
      ))}
      <Solid d={sm(ell(515, 262, 22, 18, 10))} fill={C.t3} u={u} part="oligo" />
      <Note x={545} y={344}>Inside the brain</Note>
    </g>
  ),
  labels: [
    { id: "axon", name: "Axon", x: 40, y: 110, about: "The nerve fibre that carries the signal. Wrapped axons conduct up to about 100 times faster than bare thin ones." },
    { id: "sheath", name: "Myelin sheath", x: 230, y: 118, about: "Many layers of cell membrane wrapped round the axon as insulation. The stretch of one sheath is called an internode." },
    { id: "node", name: "Node of Ranvier", x: 304, y: 110, about: "The gap between sheaths, where sodium channels cluster and the action potential is renewed." },
    { id: "saltatory", name: "Saltatory conduction", x: 369, y: 57, about: "The signal jumps from node to node instead of creeping along the whole membrane, which is fast and saves energy. Demyelination slows or blocks it." },
    { id: "schwann", name: "Schwann cell", x: 239, y: 88, about: "Outside the brain and spinal cord, one Schwann cell wraps one stretch of one axon. Guillain-Barre syndrome attacks this myelin." },
    { id: "spiral", name: "Wrapped layers", x: 210, y: 270, about: "Cut across, myelin is a tight spiral of the Schwann cell's membrane round the axon." },
    { id: "oligo", name: "Oligodendrocyte", x: 515, y: 262, about: "In the brain and spinal cord one oligodendrocyte sends arms to myelinate stretches of many axons. Multiple sclerosis damages this central myelin, and white matter changes are also reported in schizophrenia." },
    { id: "cns-sheath", name: "Central myelin", x: 600, y: 210, about: "Each arm of the oligodendrocyte forms one sheath on a different axon. Central myelin regrows poorly after damage." },
  ],
};

export const glia: FigureDef = {
  id: "glia",
  title: "Glial cells of the brain",
  viewBox: "0 20 720 350",
  summary: "The support cells of the brain: an astrocyte with end-feet on a capillary, an oligodendrocyte myelinating axons, a microglial cell, and ependymal cells lining a ventricle.",
  art: (u) => (
    <g>
      <Shade u={u} />
      {/* Capillary */}
      <path d="M10 296 H330" stroke={C.ink} strokeWidth={46} strokeLinecap="round" />
      <path d="M10 296 H330" stroke={C.blueSoft} strokeWidth={42} strokeLinecap="round" data-line="capillary" />
      {[40, 110, 180, 250].map((x) => (
        <ellipse key={x} cx={x} cy={296} rx={12} ry={7} fill={C.blueMid} stroke={C.ink} strokeWidth={1} />
      ))}
      {/* Neuron */}
      <Branches t={tree(330, 90, -2.4, 30, 2, 6, 0.5, 51)} />
      <Branches t={tree(350, 94, -0.8, 30, 2, 6, 0.5, 52)} />
      <path d="M340 128 V250" stroke={C.ink} strokeWidth={6} />
      <path d="M340 128 V250" stroke={C.t2} strokeWidth={3.6} />
      <Solid d={sm(ell(340, 108, 22, 22, 10))} fill={C.t2} u={u} part="neuron" />
      {/* Astrocyte */}
      {[-2.6, -1.9, -1.1, -0.4, 0.4, 2.8].map((a, i) => (
        <Branches key={a} t={tree(160 + Math.cos(a) * 16, 160 + Math.sin(a) * 16, a, 34, 2, 6, 0.45, 60 + i)} fill={C.hiSoft} part="astrocyte" />
      ))}
      {[[90, 274], [160, 274], [230, 274]].map(([x, y], i) => (
        <g key={x}>
          <path d={`M160 172 Q${(160 + x) / 2 + (i - 1) * 6} 220 ${x} ${y - 6}`} stroke={C.ink} strokeWidth={7} fill="none" />
          <path d={`M160 172 Q${(160 + x) / 2 + (i - 1) * 6} 220 ${x} ${y - 6}`} stroke={C.hiSoft} strokeWidth={4.4} fill="none" data-line="astrocyte" />
          <path d={`M${x - 18} ${y} Q${x} ${y - 14} ${x + 18} ${y} Z`} fill={C.hiSoft} stroke={C.ink} strokeWidth={1.6} data-part="endfeet" />
        </g>
      ))}
      <path d="M176 152 Q260 120 318 110" stroke={C.ink} strokeWidth={6} fill="none" />
      <path d="M176 152 Q260 120 318 110" stroke={C.hiSoft} strokeWidth={3.6} fill="none" data-line="astrocyte" />
      <Solid d={sm(ell(160, 160, 20, 18, 10))} fill={C.hiSoft} u={u} part="astrocyte" />
      {/* Oligodendrocyte */}
      {[60, 100, 140].map((y) => (
        <g key={y}>
          <path d={`M430 ${y} H700`} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
          <path d={`M430 ${y} H700`} stroke={C.t2} strokeWidth={4.4} strokeLinecap="round" />
        </g>
      ))}
      {[[480, 60], [640, 60], [610, 100], [490, 140], [650, 140]].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <path d={`M560 104 Q${(560 + x) / 2} ${(104 + y) / 2 + 14} ${x} ${y + 8}`} stroke={C.ink} strokeWidth={4.4} fill="none" />
          <path d={`M560 104 Q${(560 + x) / 2} ${(104 + y) / 2 + 14} ${x} ${y + 8}`} stroke={C.t3} strokeWidth={2.4} fill="none" data-line="oligo" />
          <rect x={x - 30} y={y - 10} width={60} height={20} rx={10} fill={C.paper} stroke={C.ink} strokeWidth={1.6} data-part="cns-myelin" />
        </g>
      ))}
      <Solid d={sm(ell(560, 104, 16, 13, 10))} fill={C.t3} u={u} part="oligo" />
      {/* Microglia */}
      {[-2.8, -1.6, -0.3, 0.9, 2.0].map((a, i) => (
        <Branches key={a} t={tree(470 + Math.cos(a) * 12, 236 + Math.sin(a) * 8, a, 22, 3, 3.2, 0.6, 70 + i)} fill={C.t3} part="microglia" />
      ))}
      <Solid d={sm([[452, 236], [464, 226], [484, 230], [490, 242], [474, 248], [458, 246]], true)} fill={C.t3} u={u} part="microglia" />
      {/* Ependyma lining a ventricle */}
      <rect x={560} y={330} width={160} height={30} fill={C.blueSoft} data-part="ventricle" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x={564 + i * 30} y={260} width={28} height={66} rx={4} fill={C.t2} stroke={C.ink} strokeWidth={1.6} data-part="ependyma" />
          <ellipse cx={578 + i * 30} cy={296} rx={7} ry={9} fill={C.t3} stroke={C.ink} strokeWidth={1} />
          {[0, 1, 2, 3].map((k) => (
            <path key={k} d={`M${568 + i * 30 + k * 6} 326 q2 6 0 12`} stroke={C.ink} strokeWidth={1.2} fill="none" />
          ))}
        </g>
      ))}
      <Note x={640} y={364} size={13}>Fluid (CSF)</Note>
    </g>
  ),
  labels: [
    { id: "astrocyte", name: "Astrocyte", x: 160, y: 160, about: "Star-shaped cells that feed neurons, mop up glutamate and potassium and help form scars after injury. Their loss and dysfunction are reported in depression." },
    { id: "endfeet", name: "Astrocyte end-feet", x: 160, y: 268, about: "The swollen ends that wrap capillaries and help keep the blood-brain barrier tight, so many drugs and toxins cannot reach the brain." },
    { id: "capillary", name: "Capillary", x: 300, y: 296, about: "A tiny blood vessel. Its tightly joined lining cells form the blood-brain barrier, which a medicine must cross to act on the brain." },
    { id: "neuron", name: "Neuron", x: 340, y: 108, about: "The signalling cell that glia support. Glia outnumber neurons in some brain regions." },
    { id: "oligo", name: "Oligodendrocyte", x: 560, y: 104, about: "Wraps myelin round stretches of many axons in the brain and spinal cord." },
    { id: "cns-myelin", name: "Myelin sheaths", x: 640, y: 60, about: "Each arm of the oligodendrocyte forms one sheath, speeding conduction." },
    { id: "microglia", name: "Microglia", x: 470, y: 238, about: "The brain's immune cells, which clear debris and prune unused synapses. Overactive microglia are linked to inflammation in depression and to dementia." },
    { id: "ependyma", name: "Ependymal cells", x: 638, y: 280, about: "Line the ventricles; their hair-like cilia stir the cerebrospinal fluid and, in the choroid plexus, related cells make it." },
    { id: "ventricle", name: "Ventricle", x: 700, y: 345, about: "A fluid-filled space inside the brain. The ventricles are enlarged in some people with schizophrenia and in brain shrinkage." },
  ],
};

export const synapse: FigureDef = {
  id: "synapse",
  title: "A chemical synapse up close",
  viewBox: "20 10 580 430",
  summary: "The ending of one neuron and a dendritic spine of the next, with vesicles, a fusing vesicle, calcium channels, the cleft, receptors, a reuptake transporter, an autoreceptor, a mitochondrion with MAO and a glial process.",
  art: (u) => (
    <g>
      <Shade u={u} />
      {/* Presynaptic terminal */}
      <Solid d="M250 10 C250 40 236 60 200 80 C140 112 112 160 120 200 C126 230 150 240 200 240 L420 240 C470 240 494 230 500 200 C508 160 480 112 420 80 C384 60 370 40 370 10 Z" fill={C.t1} u={u} part="terminal" />
      {/* Mitochondrion */}
      <ellipse cx={380} cy={130} rx={46} ry={20} fill={C.t3} stroke={C.ink} strokeWidth={1.8} data-part="mito" />
      <path d="M346 130 q8 -12 16 0 t16 0 t16 0 t16 0" stroke={C.ink} strokeWidth={1.4} fill="none" />
      {/* Vesicles */}
      {[[200, 150], [236, 140], [270, 156], [214, 186], [250, 182], [290, 190], [324, 176], [176, 196], [356, 206], [222, 216], [330, 216]].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <circle cx={x} cy={y} r={13} fill={C.paper} stroke={C.ink} strokeWidth={1.6} data-part="vesicle" />
          {[[-4, -3], [4, -2], [0, 4], [-5, 4], [5, 5]].map(([dx, dy]) => (
            <circle key={`${dx}${dy}`} cx={x + dx} cy={y + dy} r={1.8} fill={C.blue} />
          ))}
        </g>
      ))}
      {/* Fusing vesicle (omega figure) */}
      <path d="M278 240 C278 222 292 214 300 214 C308 214 322 222 322 240" fill={C.paper} stroke={C.ink} strokeWidth={1.6} data-part="fusion" />
      {[[296, 250], [304, 256], [290, 262], [310, 262], [300, 268], [284, 252], [316, 250], [262, 260], [338, 258]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={2.6} fill={C.blue} data-part="transmitter" />
      ))}
      {/* Calcium channels */}
      {[248, 352].map((x) => (
        <g key={x} data-part="cachannel">
          <rect x={x - 9} y={232} width={7} height={16} fill={C.t4} stroke={C.ink} strokeWidth={1} data-part="cachannel" />
          <rect x={x + 2} y={232} width={7} height={16} fill={C.t4} stroke={C.ink} strokeWidth={1} data-part="cachannel" />
        </g>
      ))}
      {/* Reuptake transporter on the side of the terminal */}
      <rect x={168} y={226} width={20} height={20} rx={4} fill={C.blueSoft} stroke={C.ink} strokeWidth={1.4} data-part="transporter" />
      <path d="M178 254 C178 248 178 244 178 238" stroke={C.ink} strokeWidth={1.4} markerEnd={`url(#${u("arrowInk")})`} />
      {/* Autoreceptor */}
      <path d="M420 240 v8 M414 254 l6 -6 l6 6" stroke={C.ink} strokeWidth={2.4} fill="none" data-line="autoreceptor" />
      {/* Postsynaptic spine */}
      <Solid d="M140 262 L460 262 C480 262 492 274 492 300 C492 340 440 360 380 368 C360 380 352 400 350 440 L270 440 C268 400 260 380 240 368 C180 360 128 340 128 300 C128 274 120 262 140 262 Z" fill={C.t2} u={u} part="spine" />
      <rect x={200} y={262} width={220} height={9} fill={C.t4} data-part="psd" />
      {[220, 262, 300, 340, 384].map((x) => (
        <g key={x}>
          <path d={`M${x - 7} 258 v14 h14 v-14`} fill={C.hiSoft} stroke={C.ink} strokeWidth={1.6} data-part="receptor" />
        </g>
      ))}
      {/* Glial process */}
      <Solid d="M480 270 C510 250 540 248 560 262 C574 280 570 330 540 350 C520 330 500 300 480 290 Z" fill={C.hiSoft} u={u} part="glia" />
      <Note x={310} y={30}>Signal arrives</Note>
      <path d="M310 40 V70" stroke={C.ink} strokeWidth={1.6} markerEnd={`url(#${u("arrowInk")})`} />
    </g>
  ),
  labels: [
    { id: "terminal", name: "Presynaptic terminal", x: 160, y: 120, about: "The swollen end of the sending neuron's axon, where the electrical signal is turned into a chemical one." },
    { id: "mito", name: "Mitochondrion with MAO", x: 400, y: 128, about: "Makes energy. Monoamine oxidase (MAO) on its outer membrane breaks down spare serotonin, noradrenaline and dopamine; MAO inhibitors block this." },
    { id: "vesicle", name: "Synaptic vesicles", x: 250, y: 182, about: "Little bubbles packed with transmitter, waiting at the release zone. Reserpine and some other drugs empty them." },
    { id: "cachannel", name: "Calcium channels", x: 352, y: 240, about: "Open when the action potential arrives. The calcium that rushes in makes vesicles fuse; gabapentin and pregabalin act on part of these channels." },
    { id: "fusion", name: "Vesicle releasing", x: 300, y: 222, about: "A vesicle fuses with the membrane and pours its transmitter into the cleft. Botulinum toxin stops this fusion." },
    { id: "transmitter", name: "Transmitter in cleft", x: 300, y: 256, about: "The chemical messenger crosses the 20 to 40 nanometre gap in well under a millisecond." },
    { id: "transporter", name: "Reuptake transporter", x: 178, y: 236, about: "Pumps transmitter back into the terminal to end the signal. SSRIs block the serotonin transporter; cocaine blocks the dopamine transporter." },
    { id: "autoreceptor", name: "Autoreceptor", x: 420, y: 248, about: "A receptor on the sending cell that senses its own transmitter and turns release down. Blocking the alpha 2 autoreceptor is how mirtazapine works." },
    { id: "receptor", name: "Postsynaptic receptors", x: 300, y: 264, about: "Proteins the transmitter binds to, opening ion channels or starting chemical signals in the receiving cell. Most psychiatric drugs act on these." },
    { id: "psd", name: "Postsynaptic density", x: 400, y: 268, about: "A dense protein scaffold that anchors receptors. Its proteins are altered in schizophrenia and autism." },
    { id: "spine", name: "Dendritic spine", x: 310, y: 330, about: "The small knob on a dendrite that receives the synapse. Spines grow with learning and shrink with chronic stress." },
    { id: "glia", name: "Astrocyte process", x: 530, y: 300, about: "A glial arm hugging the synapse that clears up glutamate and recycles it." },
  ],
};

export const nmj: FigureDef = {
  id: "nmj",
  title: "The neuromuscular junction",
  viewBox: "0 10 640 400",
  summary: "A motor nerve ending sitting in a groove on a muscle fibre, with acetylcholine vesicles, the cleft, junctional folds, nicotinic receptors and acetylcholinesterase.",
  art: (u) => (
    <g>
      <Shade u={u} />
      {/* Muscle fibre */}
      <Solid d="M20 230 C140 236 220 238 250 238 C268 300 372 300 390 238 C430 238 520 236 630 230 L630 400 L20 400 Z" fill={C.t2} u={u} shade="drop" part="muscle" />
      {Array.from({ length: 30 }, (_, i) => 30 + i * 20).filter((x) => x < 236 || x > 404).map((x) => (
        <path key={x} d={`M${x} 250 V398`} stroke={C.ink} strokeOpacity={0.25} strokeWidth={x % 40 === 10 ? 3 : 1.2} />
      ))}
      {[[90, 330], [540, 320]].map(([x, y]) => (
        <ellipse key={x} cx={x} cy={y} rx={20} ry={8} fill={C.t3} stroke={C.ink} strokeWidth={1.2} />
      ))}
      {/* Junctional folds */}
      <path d="M262 262 l8 30 l8 -26 l8 30 l8 -26 l8 30 l8 -26 l8 30 l8 -26 l8 30 l8 -26 l8 30 l8 -26 l8 30 l8 -26 l6 18" fill="none" stroke={C.ink} strokeWidth={1.8} data-line="folds" />
      {/* Axon */}
      <path d="M40 30 C120 50 220 80 300 140" stroke={C.ink} strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d="M40 30 C120 50 220 80 300 140" stroke={C.t2} strokeWidth={10} fill="none" strokeLinecap="round" data-line="axon" />
      <path d="M40 30 C90 42 140 56 190 74" stroke={C.ink} strokeWidth={30} fill="none" strokeLinecap="round" />
      <path d="M40 30 C90 42 140 56 190 74" stroke={C.paper} strokeWidth={26} fill="none" strokeLinecap="round" data-line="myelin" />
      {/* Schwann cell cap */}
      <Solid d="M232 150 C260 110 380 110 410 150 C420 170 412 200 398 214 C340 190 300 190 244 214 C228 196 224 170 232 150 Z" fill={C.hiSoft} u={u} part="cap" />
      {/* Terminal */}
      <Solid d="M252 236 C240 210 262 176 320 172 C378 176 400 210 388 236 C372 248 270 248 252 236 Z" fill={C.t1} u={u} part="terminal" />
      <ellipse cx={340} cy={196} rx={18} ry={8} fill={C.t3} stroke={C.ink} strokeWidth={1.2} />
      {[[280, 214], [300, 228], [322, 220], [346, 228], [366, 216], [290, 196], [310, 206]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={7} fill={C.paper} stroke={C.ink} strokeWidth={1.3} data-part="vesicles" />
      ))}
      {[[300, 244], [318, 248], [334, 244], [350, 250], [290, 250]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={2.4} fill={C.blue} data-part="cleft" />
      ))}
      {[266, 282, 298, 314, 330, 346, 362, 378].map((x) => (
        <rect key={x} x={x + 1} y={259} width={5} height={7} fill={C.hi} stroke={C.ink} strokeWidth={0.8} data-part="nachr" />
      ))}
      {[[276, 276], [324, 278], [356, 276]].map(([x, y]) => (
        <path key={x} d={`M${x - 5} ${y - 5} l10 10 m0 -10 l-10 10`} stroke={C.ink} strokeWidth={1.8} data-line="ache" />
      ))}
    </g>
  ),
  labels: [
    { id: "axon", name: "Motor neuron axon", x: 250, y: 106, about: "Brings the command to contract from a motor neuron in the spinal cord or brainstem." },
    { id: "myelin", name: "Myelin", x: 110, y: 50, about: "Insulates the axon until just before it ends, so the command arrives fast." },
    { id: "cap", name: "Schwann cell cap", x: 320, y: 132, about: "A Schwann cell covering the terminal, protecting it and helping repair after injury." },
    { id: "terminal", name: "Axon terminal", x: 260, y: 220, about: "The nerve ending, full of mitochondria and vesicles of acetylcholine." },
    { id: "vesicles", name: "Acetylcholine vesicles", x: 322, y: 220, about: "Each holds thousands of acetylcholine molecules. Botulinum toxin stops their release, causing paralysis." },
    { id: "cleft", name: "Synaptic cleft", x: 334, y: 246, about: "The narrow gap that acetylcholine crosses to reach the muscle." },
    { id: "nachr", name: "Nicotinic receptors", x: 346, y: 262, about: "Acetylcholine opens these channels and the muscle fires. Antibodies against them cause myasthenia gravis; suxamethonium, used to relax muscles during ECT, acts here." },
    { id: "ache", name: "Acetylcholinesterase", x: 324, y: 278, about: "The enzyme that breaks acetylcholine down within milliseconds. Drugs that block it help myasthenia gravis, and nerve agents poison by blocking it." },
    { id: "folds", name: "Junctional folds", x: 300, y: 282, about: "Deep pleats in the muscle membrane that add surface for receptors and channels." },
    { id: "muscle", name: "Muscle fibre", x: 520, y: 360, about: "A long striped skeletal muscle cell that contracts when its membrane fires." },
  ],
};
