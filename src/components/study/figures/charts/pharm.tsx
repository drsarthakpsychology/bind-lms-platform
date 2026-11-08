import type { FigureDef } from "../types";
import { Arrow, Axes, Dot, Drug, FILL, L, Line, P, T, callouts, plot, polar } from "./kit";

/* ---------- shared synapse parts ---------- */
const TERM = "M95,0 L95,26 C35,34 22,126 52,140 L208,140 C238,126 225,34 165,26 L165,0 Z";
const POST = "M20,200 C20,193 25,188 32,188 L228,188 C235,188 240,193 240,200 L240,300 L20,300 Z";

function Terminal() {
  return <path d={TERM} className={`${FILL.a} stroke-foreground`} strokeWidth={1.5} />;
}
function Post() {
  return <path d={POST} className={`${FILL.b} stroke-foreground`} strokeWidth={1.5} />;
}
function Vesicle({ x, y, full }: { x: number; y: number; full?: boolean }) {
  const pts: [number, number][] = full ? [[-5, -4], [4, -5], [0, 1], [-5, 5], [5, 5]] : [[-4, -3], [4, -2], [0, 4]];
  return (
    <g>
      <circle cx={x} cy={y} r={12} className={`${FILL.n} stroke-foreground`} strokeWidth={1.2} />
      {pts.map(([dx, dy], i) => <Dot key={i} x={x + dx} y={y + dy} r={2} tone="acc" />)}
    </g>
  );
}
function Receptor({ x, bound }: { x: number; bound?: "t" | "drug" }) {
  return (
    <g>
      <path d={`M${x - 11},178 L${x - 11},196 L${x + 11},196 L${x + 11},178 L${x + 5},178 L${x + 5},188 L${x - 5},188 L${x - 5},178 Z`} className={`${FILL.e} stroke-foreground`} strokeWidth={1.2} />
      {bound === "t" ? <Dot x={x} y={182} r={2.6} tone="acc" /> : bound === "drug" ? <Drug x={x} y={180} s={5} /> : null}
    </g>
  );
}
function Auto({ x }: { x: number }) {
  return <path d={`M${x - 10},150 L${x - 10},134 L${x + 10},134 L${x + 10},150 L${x + 5},150 L${x + 5},142 L${x - 5},142 L${x - 5},150 Z`} className={`${FILL.e} stroke-foreground`} strokeWidth={1.2} />;
}
function Pump({ x }: { x: number }) {
  return (
    <g>
      <rect x={x - 8} y={127} width={16} height={26} rx={4} className={`${FILL.d} stroke-foreground`} strokeWidth={1.2} />
      <line x1={x} y1={130} x2={x} y2={150} className="stroke-foreground" strokeWidth={1} />
    </g>
  );
}
function Cleft({ pts }: { pts: [number, number][] }) {
  return <g>{pts.map(([x, y], i) => <Dot key={i} x={x} y={y} r={2} tone="acc" />)}</g>;
}
function Mito({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={24} ry={11} className={`${FILL.d} stroke-foreground`} strokeWidth={1.2} />
      <path d={`M${x - 18},${y} q4,-7 8,0 t8,0 t8,0 t8,0`} className="fill-none stroke-foreground" strokeWidth={0.8} />
    </g>
  );
}
function Scaffold() {
  return (
    <g>
      <T x={10} y={14} size={9} anchor="start" muted>sending neuron</T>
      <T x={30} y={292} size={9} anchor="start" muted>receiving neuron</T>
      <T x={226} y={166} size={9} muted>gap</T>
    </g>
  );
}
const FEW: [number, number][] = [[95, 160], [140, 170], [175, 158]];
const MANY: [number, number][] = [[70, 158], [88, 172], [104, 160], [122, 176], [138, 162], [152, 174], [166, 156], [182, 170], [112, 150], [196, 160]];

/* ---------- 1. receptor families ---------- */
const famIono = callouts(
  [
    { id: "site", name: "Transmitter binding site", at: [96, 42], about: "The transmitter docks on the outside of the channel protein. Examples of this family: GABA-A, NMDA and AMPA glutamate, nicotinic acetylcholine and 5-HT3 receptors." },
    { id: "sub", name: "Channel subunits", at: [146, 92], about: "Several protein subunits (usually five, or four for glutamate receptors) ring a central pore. Binding twists them so the pore opens." },
    { id: "ions", name: "Ions flow through", at: [120, 128], about: "Ions such as sodium, calcium or chloride rush through the open pore. The cell changes voltage within a millisecond or two, so this is fast signalling." },
  ],
);
const famG = callouts(
  [
    { id: "gpcr", name: "Seven-coil receptor", at: [70, 220], about: "A single protein that crosses the membrane seven times. Dopamine, most serotonin, noradrenaline, muscarinic, histamine, GABA-B and opioid receptors are of this kind." },
    { id: "gprot", name: "G protein", at: [118, 288], about: "Three linked units (alpha, beta, gamma) inside the cell. The activated receptor makes the alpha unit swap GDP for GTP and drift off to act." },
    { id: "eff", name: "Effector enzyme", at: [196, 250], about: "An enzyme in the membrane, such as adenylyl cyclase or phospholipase C, that the G protein switches up or down." },
    { id: "msg", name: "Second messenger", at: [196, 300], about: "Small molecules made by the effector, such as cAMP, IP3 and DAG, spread the signal inside the cell and amplify it many times." },
    { id: "pk", name: "Protein kinase", at: [196, 336], about: "Kinases such as PKA and PKC add phosphate to channels and proteins and can reach the nucleus to change genes. Effects take hundreds of milliseconds to days." },
  ],
);
const receptorFamilies: FigureDef = {
  id: "receptor-families",
  title: "Two families of receptor",
  viewBox: "0 0 252 370",
  summary: "An ion channel receptor opens a pore within milliseconds; a G protein coupled receptor works through a G protein, an enzyme and second messengers over much longer times.",
  art: (
    <g>
      <T x={10} y={16} size={11} anchor="start" bold>A. Ionotropic: the receptor is a channel</T>
      <rect x={10} y={66} width={230} height={30} className={FILL.d} />
      <line x1={10} y1={66} x2={240} y2={66} className="stroke-foreground" strokeWidth={1.5} />
      <line x1={10} y1={96} x2={240} y2={96} className="stroke-foreground" strokeWidth={1.5} />
      <rect x={84} y={44} width={26} height={76} rx={10} className={`${FILL.e} stroke-foreground`} strokeWidth={1.5} />
      <rect x={130} y={44} width={26} height={76} rx={10} className={`${FILL.e} stroke-foreground`} strokeWidth={1.5} />
      <Dot x={96} y={40} r={4} tone="acc" />
      <Arrow x1={120} y1={30} x2={120} y2={132} tone="acc" w={2} />
      <T x={20} y={60} size={9} anchor="start" muted>outside</T>
      <T x={20} y={112} size={9} anchor="start" muted>inside</T>
      <T x={170} y={150} size={9} muted>about 1 millisecond</T>
      <line x1={10} y1={170} x2={244} y2={170} className="stroke-line" strokeWidth={1} />
      <T x={10} y={190} size={11} anchor="start" bold>B. Metabotropic: G protein coupled</T>
      <rect x={10} y={228} width={230} height={30} className={FILL.d} />
      <line x1={10} y1={228} x2={240} y2={228} className="stroke-foreground" strokeWidth={1.5} />
      <line x1={10} y1={258} x2={240} y2={258} className="stroke-foreground" strokeWidth={1.5} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={30 + i * 11} y={220} width={9} height={46} rx={4} className={`${FILL.e} stroke-foreground`} strokeWidth={1} />
      ))}
      <Dot x={66} y={214} r={4} tone="acc" />
      <circle cx={112} cy={282} r={11} className={`${FILL.b} stroke-foreground`} strokeWidth={1.2} />
      <circle cx={130} cy={278} r={8} className={`${FILL.b} stroke-foreground`} strokeWidth={1.2} />
      <circle cx={143} cy={274} r={6} className={`${FILL.b} stroke-foreground`} strokeWidth={1.2} />
      <T x={112} y={285} size={8}>α</T>
      <rect x={180} y={222} width={32} height={42} rx={8} className={`${FILL.c} stroke-foreground`} strokeWidth={1.5} />
      <Arrow x1={124} y1={290} x2={182} y2={262} cx={160} cy={292} />
      <Arrow x1={196} y1={266} x2={196} y2={292} />
      <Dot x={188} y={300} r={3} tone="acc" />
      <Dot x={198} y={304} r={3} tone="acc" />
      <Dot x={206} y={298} r={3} tone="acc" />
      <Arrow x1={196} y1={310} x2={196} y2={326} />
      <rect x={176} y={328} width={40} height={18} rx={5} className={`${FILL.n} stroke-foreground`} strokeWidth={1.2} />
      <T x={60} y={356} size={9} muted>100 milliseconds to minutes</T>
    </g>
  ),
  labels: [...famIono.labels, ...famG.labels],
};

/* ---------- 3. SSRI ---------- */
const ssriC = callouts(
  [
    { id: "ves", name: "Serotonin vesicle", at: [118, 108], about: "Serotonin is made in the terminal from tryptophan and stored in small sacs called vesicles until a signal arrives." },
    { id: "auto", name: "Autoreceptor", at: [75, 140], about: "5-HT1B autoreceptors here and 5-HT1A on the cell body act as a brake. Extra serotonin first presses the brake; over weeks they become less sensitive and firing recovers, one reason the benefit is delayed." },
    { id: "sert", name: "SERT reuptake pump", at: [190, 132], about: "The serotonin transporter pumps serotonin back into the terminal, which normally ends the signal." },
    { id: "ssri", name: "SSRI blocks SERT", at: [190, 146], about: "The SSRI sits in the transporter so serotonin cannot be pumped back. The block happens within hours, yet mood usually improves only after 2 to 6 weeks." },
    { id: "cleft", name: "More serotonin in gap", at: [138, 162], about: "With reuptake blocked, serotonin stays longer in the gap and its level rises." },
    { id: "rec", name: "Postsynaptic receptor", at: [125, 192], about: "5-HT receptors on the receiving cell pass the message on and adapt over weeks. Stimulating 5-HT2 and 5-HT3 receptors explains early nausea, jitteriness and sexual side effects." },
  ],
);
const ssri: FigureDef = {
  id: "ssri-synapse",
  title: "How an SSRI works at the synapse",
  viewBox: "0 0 252 300",
  summary: "An SSRI blocks the serotonin reuptake pump so serotonin builds up in the gap between neurons.",
  art: (
    <g>
      <Terminal /><Post /><Scaffold />
      <Vesicle x={85} y={92} full /><Vesicle x={118} y={108} full /><Vesicle x={150} y={86} full /><Vesicle x={115} y={64} full />
      <Auto x={75} /><Pump x={190} /><Drug x={190} y={146} s={6} />
      <Cleft pts={MANY} />
      <Receptor x={70} bound="t" /><Receptor x={125} bound="t" /><Receptor x={180} bound="t" />
      <Arrow x1={212} y1={176} x2={198} y2={120} cx={222} cy={146} tone="grey" dash />
    </g>
  ),
  labels: ssriC.labels,
};

/* ---------- 4. MAOI ---------- */
const maoiC = callouts(
  [
    { id: "ves", name: "Fuller vesicles", at: [85, 92], about: "With breakdown blocked, more serotonin, noradrenaline and dopamine are packed into vesicles and more is released with each signal." },
    { id: "mito", name: "Mitochondrion", at: [168, 52], about: "Monoamine oxidase sits on the outer membrane of mitochondria inside the nerve terminal." },
    { id: "mao", name: "MAO enzyme", at: [180, 62], about: "MAO breaks down monoamines left free in the terminal. MAO-A prefers serotonin and noradrenaline; MAO-B prefers dopamine. MAO-A in the gut and liver also destroys tyramine from food." },
    { id: "maoi", name: "MAOI disables MAO", at: [196, 64], about: "Phenelzine and tranylcypromine block MAO for good, so recovery needs new enzyme over about 2 weeks. Moclobemide is reversible and blocks MAO-A only." },
    { id: "free", name: "Free amine survives", at: [150, 116], about: "Transmitter taken back up is no longer destroyed, so the store grows." },
    { id: "rec", name: "Postsynaptic receptor", at: [125, 192], about: "More transmitter reaches the receiving cell. Aged cheese, cured meat or soy sauce while on an irreversible MAOI can cause a dangerous rise in blood pressure (the cheese reaction)." },
  ],
);
const maoi: FigureDef = {
  id: "maoi-synapse",
  title: "How an MAOI works",
  viewBox: "0 0 252 300",
  summary: "An MAOI blocks the enzyme that breaks down monoamines inside the nerve terminal, so more transmitter is stored and released.",
  art: (
    <g>
      <Terminal /><Post /><Scaffold />
      <Mito x={170} y={60} />
      <circle cx={182} cy={66} r={5} className={`${FILL.c} stroke-foreground`} strokeWidth={1} />
      <Drug x={196} y={64} s={5} />
      <Vesicle x={85} y={92} full /><Vesicle x={118} y={108} full /><Vesicle x={80} y={60} full />
      <Dot x={150} y={116} r={2} tone="acc" /><Dot x={160} y={104} r={2} tone="acc" /><Dot x={142} y={98} r={2} tone="acc" /><Dot x={170} y={118} r={2} tone="acc" />
      <Pump x={190} />
      <Cleft pts={MANY.slice(0, 8)} />
      <Receptor x={70} bound="t" /><Receptor x={125} bound="t" /><Receptor x={180} bound="t" />
    </g>
  ),
  labels: maoiC.labels,
};

/* ---------- 5. TCA ---------- */
const tcaC = callouts(
  [
    { id: "sert", name: "SERT blocked", at: [68, 146], about: "Tricyclics such as clomipramine and amitriptyline block the serotonin transporter, raising serotonin in the gap." },
    { id: "net", name: "NET blocked", at: [190, 146], about: "They also block the noradrenaline transporter. Nortriptyline and desipramine are mainly noradrenaline blockers." },
    { id: "h1", name: "H1 block", at: [54, 244], about: "Blocking histamine H1 receptors causes sleepiness and weight gain." },
    { id: "m1", name: "M1 block", at: [100, 244], about: "Blocking muscarinic receptors causes dry mouth, constipation, blurred vision, urinary retention and confusion in older adults." },
    { id: "a1", name: "Alpha-1 block", at: [146, 244], about: "Blocking alpha-1 receptors on blood vessels causes dizziness and falls on standing up." },
    { id: "na", name: "Sodium channel block", at: [196, 244], about: "In overdose, sodium channel block in the heart widens the QRS complex and causes arrhythmias and seizures. This is why tricyclics are dangerous in overdose." },
  ],
);
const tca: FigureDef = {
  id: "tca-synapse",
  title: "Tricyclics: two pumps and many side doors",
  viewBox: "0 0 252 300",
  summary: "Tricyclic antidepressants block both serotonin and noradrenaline reuptake, and also block histamine, muscarinic, alpha-1 receptors and sodium channels, which explains their side effects.",
  art: (
    <g>
      <Terminal /><Post /><Scaffold />
      <Vesicle x={95} y={92} /><Vesicle x={130} y={108} /><Vesicle x={150} y={78} />
      <Pump x={68} /><Drug x={68} y={146} s={6} />
      <Pump x={190} /><Drug x={190} y={146} s={6} />
      <Cleft pts={MANY} />
      <Receptor x={100} bound="t" /><Receptor x={160} bound="t" />
      {[54, 100, 146].map((x) => (
        <g key={x}>
          <rect x={x - 12} y={236} width={24} height={18} rx={4} className={`${FILL.e} stroke-foreground`} strokeWidth={1.2} />
          <Drug x={x} y={236} s={5} />
        </g>
      ))}
      <rect x={184} y={236} width={10} height={18} rx={3} className={`${FILL.d} stroke-foreground`} strokeWidth={1.2} />
      <rect x={198} y={236} width={10} height={18} rx={3} className={`${FILL.d} stroke-foreground`} strokeWidth={1.2} />
      <Drug x={196} y={236} s={5} />
      <T x={54} y={268} size={9}>H1</T><T x={100} y={268} size={9}>M1</T><T x={146} y={268} size={9}>α1</T><T x={196} y={268} size={9}>Na⁺</T>
      <T x={130} y={226} size={9} muted>off-target sites</T>
    </g>
  ),
  labels: tcaC.labels,
};

/* ---------- 6. D2 block ---------- */
const d2C = callouts(
  [
    { id: "da", name: "Dopamine released", at: [118, 108], about: "In psychosis, too much dopamine is released in the mesolimbic pathway, which is linked to hallucinations and delusions." },
    { id: "ht2a", name: "5-HT2A block", at: [45, 110], about: "Newer antipsychotics such as risperidone, olanzapine and quetiapine also block 5-HT2A receptors. This lets a little more dopamine out in the movement and thinking pathways, so fewer movement side effects." },
    { id: "d2", name: "D2 receptor", at: [180, 192], about: "Dopamine D2 receptors on the receiving neuron. Every licensed antipsychotic blocks or partly stimulates them." },
    { id: "block", name: "Antipsychotic blocks D2", at: [70, 180], about: "The drug fills the receptor without switching it on. Haloperidol binds tightly; clozapine and quetiapine let go quickly, so they cause fewer movement side effects." },
    { id: "auto", name: "D2 autoreceptor", at: [205, 136], about: "D2 receptors on the sending terminal act as a brake. Blocking them briefly increases dopamine release at the start of treatment." },
  ],
);
const d2: FigureDef = {
  id: "antipsychotic-d2",
  title: "How an antipsychotic blocks dopamine",
  viewBox: "0 0 252 300",
  summary: "Antipsychotics occupy dopamine D2 receptors so released dopamine cannot act; many also block 5-HT2A receptors.",
  art: (
    <g>
      <Terminal /><Post /><Scaffold />
      <Vesicle x={85} y={92} /><Vesicle x={118} y={108} /><Vesicle x={150} y={86} />
      <path d="M33,98 L45,98 L45,122 L33,122" className={`${FILL.e} stroke-foreground`} strokeWidth={1.2} />
      <Drug x={45} y={110} s={5} />
      <path d="M195,150 L195,134 L215,128 L216,144 Z" className={`${FILL.e} stroke-foreground`} strokeWidth={1.2} />
      <Cleft pts={FEW.concat([[120, 150], [160, 175]])} />
      <Receptor x={70} bound="drug" /><Receptor x={125} bound="drug" /><Receptor x={180} bound="t" />
    </g>
  ),
  labels: d2C.labels,
};

/* ---------- 7. D2 occupancy ---------- */
// Reference checked: PET studies of striatal D2 occupancy: response from about 65 percent, prolactin rise above about 72,
// extrapyramidal effects above about 78 to 80 percent (NCBI Bookshelf, StatPearls: Antipsychotic medications).
const OX = (o: number) => 40 + o * 3.4;
const OY = (v: number) => 210 - v * 160;
const sig = (m: number, s: number) => (o: number) => 1 / (1 + Math.exp(-(o - m) / s));
const occC = callouts(
  [
    { id: "resp", name: "Antipsychotic response", at: [OX(56), OY(sig(58, 4)(56))], about: "Most patients improve once about 60 to 65 percent of striatal D2 receptors are blocked, as brain scans show." },
    { id: "win", name: "Window: 65 to 80%", at: [OX(72), 60], about: "The target range: enough block to treat psychosis, not so much that movement and hormone side effects take over." },
    { id: "prl", name: "Prolactin rises", at: [OX(80), 210 - sig(76, 5)(80) * 140], about: "Blocking D2 in the tuberoinfundibular pathway removes dopamine's brake on prolactin, causing breast changes, missed periods and sexual problems." },
    { id: "eps", name: "Movement side effects", at: [OX(86), 210 - sig(86, 3)(86) * 150], about: "Above about 80 percent, blocking the nigrostriatal pathway causes parkinsonism, akathisia and dystonia." },
  ],
);
const d2occ: FigureDef = {
  id: "d2-occupancy",
  title: "D2 occupancy: the therapeutic window",
  viewBox: "0 0 420 250",
  summary: "Response appears at about 60 to 65 percent D2 occupancy; above about 80 percent, movement side effects and prolactin rise.",
  art: (
    <g>
      <rect x={OX(65)} y={40} width={OX(80) - OX(65)} height={170} className={FILL.b} />
      <Axes x={40} y={210} w={350} h={180} xl="D2 receptors occupied (%)" yl="effect" />
      {[0, 20, 40, 60, 80, 100].map((o) => <T key={o} x={OX(o)} y={222} size={9} muted>{o}</T>)}
      <P d={plot(sig(58, 4), 0, 100, OX, OY)} tone="acc" w={2.5} />
      <P d={plot(sig(76, 5), 0, 100, OX, (v) => 210 - v * 140)} tone="grey" w={2} dash />
      <P d={plot(sig(86, 3), 0, 100, OX, (v) => 210 - v * 150)} tone="red" w={2.5} />
    </g>
  ),
  labels: occC.labels,
};

/* ---------- 8. partial agonist ---------- */
const CX = (c: number) => 40 + c * 22; // log concentration 0..10
const hill = (top: number) => (c: number) => top / (1 + Math.exp(-(c - 5) * 1.1));
const RY = (v: number) => 210 - v * 1.6;
const partC = callouts(
  [
    { id: "full", name: "Full agonist", at: [CX(7), RY(hill(100)(7))], about: "Dopamine itself, or a drug that switches the receptor fully on, gives the maximum signal (100 percent)." },
    { id: "high", name: "High dopamine tone", at: [CX(1), RY(80)], about: "In the mesolimbic pathway during psychosis, dopamine drives receptors hard. The partial agonist takes their place and brings the signal down to its own ceiling." },
    { id: "part", name: "Partial agonist", at: [CX(7), RY(hill(35)(7))], about: "Aripiprazole, brexpiprazole and cariprazine at D2, and buspirone at 5-HT1A, switch the receptor only part way on: a brake when transmitter is high and a boost when it is low." },
    { id: "low", name: "Low dopamine tone", at: [CX(1), RY(10)], about: "Where dopamine is low, as in the prefrontal cortex with negative symptoms, the partial agonist raises the signal to its ceiling." },
    { id: "ant", name: "Antagonist", at: [CX(3), RY(1.5)], about: "A pure blocker such as haloperidol fills the receptor and gives no signal at all, whatever the concentration." },
  ],
);
const partial: FigureDef = {
  id: "partial-agonist",
  title: "Full agonist, partial agonist and antagonist",
  viewBox: "0 0 280 250",
  summary: "A partial agonist can switch a receptor on only part of the way, so it lowers signalling when transmitter is high and raises it when transmitter is low.",
  art: (
    <g>
      <Axes x={40} y={210} w={232} h={190} xl="drug concentration (log scale)" yl="receptor signal" />
      {[0, 50, 100].map((v) => <T key={v} x={34} y={RY(v) + 3} size={9} anchor="end" muted>{v}</T>)}
      <Line x1={40} y1={RY(80)} x2={262} y2={RY(80)} tone="grey" dash w={1} />
      <Line x1={40} y1={RY(10)} x2={262} y2={RY(10)} tone="grey" dash w={1} />
      <P d={plot(hill(100), 0, 10, CX, RY)} tone="acc" w={2.5} />
      <P d={plot(hill(35), 0, 10, CX, RY)} tone="red" w={2.5} />
      <P d={plot(() => 1.5, 0, 10, CX, RY)} tone="ink" w={2.5} dash />
      <Arrow x1={250} y1={RY(80) + 4} x2={250} y2={RY(35) - 6} tone="red" w={1.2} size={5} />
      <Arrow x1={258} y1={RY(10) - 4} x2={258} y2={RY(35) + 6} tone="red" w={1.2} size={5} />
    </g>
  ),
  labels: partC.labels,
};

/* ---------- 9. benzodiazepine at GABA-A ---------- */
const GC = { x: 120, y: 125 };
const SUB = [
  { a: 0, k: "γ2", t: "a" as const },
  { a: 72, k: "β", t: "b" as const },
  { a: 144, k: "α", t: "e" as const },
  { a: 216, k: "β", t: "b" as const },
  { a: 288, k: "α", t: "e" as const },
];
const pulse = (x0: number, y: number, opens: [number, number][]) => {
  let d = `M${x0},${y}`;
  for (const [s, e] of opens) d += ` L${x0 + s},${y} L${x0 + s},${y - 14} L${x0 + e},${y - 14} L${x0 + e},${y}`;
  return d + ` L${x0 + 200},${y}`;
};
// Reference checked: GABA-A pentamer of two alpha, two beta and one gamma-2 subunit around a chloride pore; GABA binds at the
// beta and alpha interfaces, benzodiazepines at the alpha and gamma-2 interface; benzodiazepines raise opening frequency,
// barbiturates opening duration (NCBI Bookshelf, StatPearls: GABA receptor; Benzodiazepines).
const benzoC = callouts(
  [
    { id: "alpha", name: "Alpha subunit", at: polar(GC.x, GC.y, 64, 144), about: "Two alpha subunits. The alpha type matters: alpha-1 brings sedation and amnesia, alpha-2 and alpha-3 bring calm and muscle relaxation." },
    { id: "beta", name: "Beta subunit", at: polar(GC.x, GC.y, 64, 72), about: "Two beta subunits. Each beta and alpha pair forms a pocket where GABA binds." },
    { id: "gamma", name: "Gamma-2 subunit", at: polar(GC.x, GC.y, 64, 10), about: "One gamma-2 subunit. Without it there is no benzodiazepine site." },
    { id: "gaba", name: "GABA sites (two)", at: polar(GC.x, GC.y, 82, 108), about: "GABA binds at the two beta and alpha interfaces. Both must be filled to open the chloride pore." },
    { id: "bz", name: "Benzodiazepine site", at: polar(GC.x, GC.y, 82, 324), about: "Benzodiazepines and Z-drugs bind at the alpha and gamma-2 interface. They do nothing alone but boost GABA. Flumazenil blocks this site and reverses an overdose." },
    { id: "pore", name: "Chloride pore", at: [GC.x + 8, GC.y + 8], about: "Chloride ions flow in, the neuron becomes more negative and is less likely to fire." },
  ],
);
const benzo: FigureDef = {
  id: "benzo-gabaa",
  title: "Benzodiazepines at the GABA-A receptor",
  viewBox: "0 0 240 400",
  summary: "The GABA-A receptor is a ring of five subunits around a chloride pore; GABA binds between beta and alpha, and benzodiazepines bind between alpha and gamma-2, making the pore open more often.",
  art: (
    <g>
      <T x={10} y={16} size={10} anchor="start" muted>seen from the gap, looking down on the receptor</T>
      {SUB.map((s, i) => {
        const [x, y] = polar(GC.x, GC.y, 56, s.a);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={32} className={`${FILL[s.t]} stroke-foreground`} strokeWidth={1.5} />
            <T x={x} y={y + 4} size={12} bold>{s.k}</T>
          </g>
        );
      })}
      <circle cx={GC.x} cy={GC.y} r={18} className={`${FILL.n} stroke-foreground`} strokeWidth={1.5} />
      <T x={GC.x} y={GC.y + 4} size={10} bold>Cl⁻</T>
      {[108, 252].map((a) => {
        const [x, y] = polar(GC.x, GC.y, 82, a);
        return <circle key={a} cx={x} cy={y} r={6} className="fill-chart-1 stroke-foreground" strokeWidth={1} />;
      })}
      {(() => {
        const [x, y] = polar(GC.x, GC.y, 82, 324);
        return <Drug x={x} y={y} s={7} />;
      })()}
      <line x1={10} y1={232} x2={232} y2={232} className="stroke-line" />
      <T x={10} y={250} size={10} anchor="start" muted>chloride channel openings over time</T>
      <P d={pulse(30, 290, [[30, 44], [120, 132]])} w={1.5} />
      <P d={pulse(30, 330, [[18, 30], [52, 64], [90, 102], [128, 140], [166, 178]])} tone="acc" w={1.5} />
      <P d={pulse(30, 370, [[30, 120]])} tone="red" w={1.5} />
    </g>
  ),
  labels: benzoC.labels.concat([
    L("t-gaba", "GABA alone", 67, 276, "With GABA alone the channel opens now and then."),
    L("t-bz", "Plus a benzodiazepine", 88, 316, "Benzodiazepines make openings more frequent, not longer, and have a ceiling, so they are safer alone in overdose."),
    L("t-barb", "Plus a barbiturate", 100, 356, "Barbiturates and alcohol keep the channel open longer and can open it without GABA, so mixing them with benzodiazepines can stop breathing."),
  ]),
};

/* ---------- 11. stimulants ---------- */
const stimC = callouts(
  [
    { id: "ves", name: "Dopamine vesicle", at: [118, 100], about: "Dopamine is stored in vesicles and released when the neuron fires." },
    { id: "vmat", name: "VMAT2 vesicle pump", at: [150, 74], about: "VMAT2 loads dopamine into vesicles. Amphetamine disrupts it, so dopamine leaks out into the terminal." },
    { id: "mph", name: "Methylphenidate", at: [68, 146], about: "Methylphenidate blocks the dopamine and noradrenaline transporters, like an SSRI for dopamine. It works only when the neuron fires." },
    { id: "amph", name: "Amphetamine enters", at: [168, 116], about: "Amphetamine is carried into the terminal by the transporter itself." },
    { id: "rev", name: "DAT runs in reverse", at: [190, 146], about: "Inside, amphetamine makes the transporter pump dopamine out, even without nerve firing. This is why it is a stronger releaser." },
    { id: "cleft", name: "Dopamine in the gap", at: [138, 162], about: "Raised dopamine and noradrenaline in prefrontal cortex improve attention in ADHD; in the reward pathway, fast large rises carry abuse risk." },
  ],
);
const stim: FigureDef = {
  id: "stimulant-synapse",
  title: "How stimulants raise dopamine",
  viewBox: "0 0 252 300",
  summary: "Methylphenidate blocks the dopamine transporter; amphetamine enters through it, empties vesicles and runs the transporter in reverse.",
  art: (
    <g>
      <Terminal /><Post /><Scaffold />
      <Vesicle x={85} y={92} /><Vesicle x={118} y={100} /><Vesicle x={140} y={72} />
      <rect x={146} y={68} width={8} height={10} rx={2} className={`${FILL.d} stroke-foreground`} strokeWidth={1} />
      <Pump x={68} /><Drug x={68} y={146} s={6} />
      <Pump x={190} />
      <Drug x={168} y={116} s={5} />
      <Arrow x1={190} y1={124} x2={190} y2={170} tone="acc" w={2} size={6} />
      <Cleft pts={MANY} />
      <Receptor x={90} bound="t" /><Receptor x={160} bound="t" />
    </g>
  ),
  labels: stimC.labels,
};

/* ---------- 12. single dose pharmacokinetics ---------- */
// Reference checked: oral one-compartment curve with absorption and elimination phases, Cmax, Tmax, half-life,
// therapeutic window between minimum effective and toxic concentrations (NCBI Bookshelf, StatPearls: Pharmacokinetics).
const ka = 1.2;
const ke = Math.log(2) / 6;
const conc = (t: number) => (t <= 0 ? 0 : (Math.exp(-ke * t) - Math.exp(-ka * t)) / 0.795);
const TX = (t: number) => 40 + t * 6.2;
const CY = (c: number) => 210 - c * 150;
const pkC = callouts(
  [
    { id: "tox", name: "Toxic threshold", at: [200, CY(1.15)], about: "Above this line harm outweighs benefit. Lithium has a narrow gap between the effective and toxic lines." },
    { id: "cmax", name: "Peak level (Cmax)", at: [TX(2.15), CY(1)], about: "The highest level reached. Side effects such as dizziness are often worst around the peak." },
    { id: "abs", name: "Absorption phase", at: [TX(0.8), CY(conc(0.8))], about: "The drug passes from the gut into the blood faster than it is removed, so the level climbs." },
    { id: "elim", name: "Elimination phase", at: [TX(7), CY(conc(7))], about: "Liver metabolism and the kidneys remove the drug. For most drugs a fixed fraction is lost each hour." },
    { id: "half", name: "Half-life", at: [TX(13), CY(conc(10))], about: "The time for the level to fall by half, here 6 hours. After about 5 half-lives the drug is almost gone." },
    { id: "mec", name: "Effective threshold", at: [200, CY(0.3)], about: "The minimum effective level: below this line the drug is too low to work." },
    { id: "tmax", name: "Time to peak (Tmax)", at: [TX(2.15), 206], about: "How long after the dose the peak comes, often 1 to 4 hours for tablets. Food can delay it." },
  ],
);
const pkSingle: FigureDef = {
  id: "pk-single-dose",
  title: "One dose: absorption, peak and half-life",
  viewBox: "0 0 290 250",
  summary: "After a tablet, blood level rises during absorption, peaks, then falls by half every half-life; the drug works while the level sits between the effective and toxic lines.",
  art: (
    <g>
      <rect x={40} y={CY(1.15)} width={TX(36) - 40} height={CY(0.3) - CY(1.15)} className={FILL.b} opacity={0.6} />
      <Line x1={40} y1={CY(1.15)} x2={TX(36)} y2={CY(1.15)} tone="red" dash w={1.2} />
      <Line x1={40} y1={CY(0.3)} x2={TX(36)} y2={CY(0.3)} tone="grey" dash w={1.2} />
      <path d={`${plot(conc, 0, 36, TX, CY)} L${TX(36)},210 L40,210 Z`} className={FILL.a} />
      <P d={plot(conc, 0, 36, TX, CY)} tone="acc" w={2.5} />
      <Axes x={40} y={210} w={236} h={190} xl="hours after one dose" yl="blood level" />
      {[0, 6, 12, 18, 24, 30, 36].map((t) => <T key={t} x={TX(t)} y={222} size={9} muted>{t}</T>)}
      <Line x1={TX(2.15)} y1={CY(1)} x2={TX(2.15)} y2={210} tone="ink" dash w={1} />
      <Line x1={TX(10)} y1={CY(conc(10))} x2={TX(16)} y2={CY(conc(10))} tone="ink" w={1} />
      <Line x1={TX(16)} y1={CY(conc(10))} x2={TX(16)} y2={CY(conc(16))} tone="ink" w={1} />
    </g>
  ),
  labels: pkC.labels,
};

/* ---------- 13. repeated dosing, steady state, loading ---------- */
const ka2 = 3;
const ke2 = Math.log(2);
const one = (t: number) => (t <= 0 ? 0 : Math.exp(-ke2 * t) - Math.exp(-ka2 * t));
const multi = (load: boolean) => (t: number) => {
  let c = 0;
  for (let n = 0; n < 6; n++) c += (n === 0 && load ? 2 : 1) * one(t - n);
  return c;
};
const SX2 = (t: number) => 40 + t * 28;
const SY2 = (c: number) => 210 - c * 72;
const ssC = callouts(
  [
    { id: "load", name: "Loading dose", at: [SX2(0.63), SY2(multi(true)(0.63))], about: "A larger first dose fills the body at once so the target level is reached immediately, as with valproate or IV phenytoin in emergencies." },
    { id: "ss", name: "Steady state", at: [SX2(5), SY2(2.05)], about: "After 4 to 5 half-lives, what goes in equals what comes out. Judge the full effect, and check blood levels, only after this. Fluoxetine, with a long half-life, takes weeks." },
    { id: "acc", name: "Build-up", at: [SX2(2.6), SY2(multi(false)(2.6))], about: "Each dose adds to what is left of the last: about 50, 75, 88 and 94 percent of the final level after 1, 2, 3 and 4 half-lives." },
    { id: "trough", name: "Trough level", at: [SX2(4.98), SY2(multi(false)(4.98))], about: "The lowest point, just before the next dose. Lithium and clozapine levels are taken near the trough, about 12 hours after the last dose." },
    { id: "wash", name: "Stopping: washout", at: [SX2(7), SY2(multi(false)(7))], about: "After the last dose, the level halves each half-life and is about 97 percent gone after 5 half-lives. This guides how long to wait when switching drugs." },
    { id: "dose", name: "Each dose", at: [SX2(3), 204], about: "One dose is taken every half-life (the small triangles)." },
  ],
);
const pkSteady: FigureDef = {
  id: "pk-steady-state",
  title: "Repeated doses, steady state and a loading dose",
  viewBox: "0 0 290 250",
  summary: "Taking a dose every half-life makes the level climb until intake equals removal, reached after about 4 to 5 half-lives; a loading dose gets there at once.",
  art: (
    <g>
      <rect x={SX2(4)} y={SY2(2.1)} width={SX2(6) - SX2(4)} height={SY2(1.05) - SY2(2.1)} className={FILL.b} opacity={0.7} />
      <P d={plot(multi(true), 0, 8, SX2, SY2, 240)} tone="red" w={1.8} dash />
      <P d={plot(multi(false), 0, 8, SX2, SY2, 240)} tone="acc" w={2.5} />
      <Axes x={40} y={210} w={240} h={190} xl="time, in half-lives" yl="blood level" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((t) => <T key={t} x={SX2(t)} y={222} size={9} muted>{t}</T>)}
      {[0, 1, 2, 3, 4, 5].map((t) => <path key={t} d={`M${SX2(t)},200 l-4,8 l8,0 Z`} className="fill-foreground" />)}
    </g>
  ),
  labels: ssC.labels,
};

/* ---------- GPCR scene ---------- */
// Reference checked: seven transmembrane helices, N terminus outside, C terminus inside, heterotrimeric G protein
// (alpha with GDP or GTP, beta, gamma lipid anchored), effector adenylyl cyclase (NCBI Bookshelf, Basic Neurochemistry: G proteins).
function Bilayer({ x0, x1, y0, y1 }: { x0: number; x1: number; y0: number; y1: number }) {
  const n = Math.floor((x1 - x0) / 8);
  return (
    <g>
      <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} className={FILL.d} />
      {Array.from({ length: n + 1 }, (_, i) => (
        <g key={i}>
          <circle cx={x0 + i * 8} cy={y0} r={3} className={`${FILL.n} stroke-muted-foreground`} strokeWidth={0.8} />
          <circle cx={x0 + i * 8} cy={y1} r={3} className={`${FILL.n} stroke-muted-foreground`} strokeWidth={0.8} />
        </g>
      ))}
    </g>
  );
}
const HX = (i: number) => 34 + i * 22;
const gpcrC = callouts(
  [
    { id: "nterm", name: "N terminus (outside)", at: [26, 58], about: "The start of the protein chain sits outside the cell, in the gap." },
    { id: "pocket", name: "Binding pocket", at: [100, 96], about: "The transmitter or drug slips into a pocket formed between the coils, part way into the membrane. Antipsychotics and many antidepressants bind here." },
    { id: "helix", name: "Seven membrane coils", at: [166, 126], about: "The chain crosses the membrane seven times as seven helices joined by loops. When the transmitter binds, the coils shift and the inner loops change shape." },
    { id: "loop", name: "Inner loop", at: [122, 170], about: "The third inner loop is where the G protein docks and where kinases tag the receptor to switch it off after strong use (desensitisation)." },
    { id: "galpha", name: "G alpha subunit", at: [118, 214], about: "On activation the alpha unit drops GDP, picks up GTP and leaves to act on an enzyme. It switches itself off by turning GTP back into GDP." },
    { id: "gbg", name: "G beta and gamma", at: [168, 200], about: "The beta and gamma pair stays anchored to the membrane by a lipid tail and can open potassium channels directly, as with D2 and GABA-B receptors." },
    { id: "ac", name: "Adenylyl cyclase", at: [222, 130], about: "Gs switches this enzyme on and Gi switches it off. It turns ATP into cyclic AMP." },
    { id: "camp", name: "cAMP (second messenger)", at: [222, 196], about: "cAMP spreads the message inside the cell and turns on protein kinase A, which tags channels and gene switches such as CREB." },
  ],
);
const gpcr: FigureDef = {
  id: "gpcr-scene",
  title: "A G protein coupled receptor at work",
  viewBox: "0 0 256 300",
  summary: "A receptor chain crosses the membrane seven times; transmitter binding makes it activate a G protein, whose alpha unit turns on an enzyme that makes the second messenger cAMP.",
  art: (
    <g>
      <T x={10} y={14} size={9} anchor="start" muted>outside the cell</T>
      <T x={10} y={290} size={9} anchor="start" muted>inside the cell</T>
      <Bilayer x0={10} x1={250} y0={104} y1={150} />
      <path d={`M${HX(0) + 7},96 C${HX(0)},70 20,64 26,40`} className="fill-none stroke-foreground" strokeWidth={2} />
      {[0, 2, 4].map((i) => <path key={`o${i}`} d={`M${HX(i) + 7},96 C${HX(i) + 7},74 ${HX(i + 1) + 7},74 ${HX(i + 1) + 7},96`} className="fill-none stroke-foreground" strokeWidth={2} />)}
      {[1, 3, 5].map((i) => <path key={`i${i}`} d={`M${HX(i) + 7},158 C${HX(i) + 7},${i === 3 ? 190 : 176} ${HX(i + 1) + 7},${i === 3 ? 190 : 176} ${HX(i + 1) + 7},158`} className="fill-none stroke-foreground" strokeWidth={2} />)}
      <path d={`M${HX(6) + 7},158 C${HX(6) + 7},180 200,186 196,240`} className="fill-none stroke-foreground" strokeWidth={2} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <g key={i}>
          <rect x={HX(i)} y={94} width={14} height={66} rx={7} className={`${FILL.e} stroke-foreground`} strokeWidth={1.2} />
          <T x={HX(i) + 7} y={131} size={8} bold>{i + 1}</T>
        </g>
      ))}
      <circle cx={100} cy={100} r={6} className="fill-chart-1 stroke-foreground" strokeWidth={1} />
      <ellipse cx={118} cy={214} rx={24} ry={17} className={`${FILL.b} stroke-foreground`} strokeWidth={1.5} />
      <T x={118} y={217} size={8}>GTP</T>
      <circle cx={156} cy={202} r={14} className={`${FILL.b} stroke-foreground`} strokeWidth={1.5} />
      <circle cx={172} cy={182} r={8} className={`${FILL.b} stroke-foreground`} strokeWidth={1.5} />
      <path d="M176,176 L184,152" className="stroke-foreground" strokeWidth={1.5} />
      <T x={156} y={205} size={8}>β</T><T x={172} y={185} size={7}>γ</T>
      <rect x={208} y={98} width={30} height={60} rx={9} className={`${FILL.c} stroke-foreground`} strokeWidth={1.5} />
      <Arrow x1={140} y1={222} x2={206} y2={160} cx={190} cy={228} tone="acc" />
      <Arrow x1={222} y1={160} x2={222} y2={186} />
      {[[214, 196], [226, 202], [218, 210], [232, 192]].map(([x, y], i) => <Dot key={i} x={x} y={y} r={3} tone="acc" />)}
    </g>
  ),
  labels: gpcrC.labels,
};

/* ---------- NMDA receptor with magnesium and ketamine ---------- */
// Reference checked: NMDA receptor is a GluN1 and GluN2 tetramer; glutamate binds GluN2, glycine or D-serine binds GluN1;
// Mg2+ blocks the pore at rest and leaves on depolarisation; ketamine, PCP and memantine bind inside the pore (NCBI Bookshelf, Neuroscience: Glutamate receptors).
const nmdaC = callouts(
  [
    { id: "glu", name: "Glutamate site", at: [150, 40], about: "Glutamate binds on the GluN2 subunit. It is the main excitatory transmitter of the brain." },
    { id: "gly", name: "Glycine site", at: [74, 40], about: "The channel also needs a co-agonist, glycine or D-serine, on the GluN1 subunit. Both keys are needed." },
    { id: "mg", name: "Magnesium plug", at: [112, 100], about: "At rest a magnesium ion sits in the pore. Only when the cell is already depolarised, usually by AMPA receptors, is the plug pushed out. This makes the NMDA receptor a coincidence detector for learning." },
    { id: "ket", name: "Ketamine in the pore", at: [112, 128], about: "Ketamine, PCP and memantine bind inside the open channel and block it. A single low dose of ketamine can lift depression within hours; esketamine is given as a nasal spray." },
    { id: "ca", name: "Calcium flows in", at: [112, 188], about: "When open, the channel lets calcium and sodium in. Calcium triggers the changes behind long-term potentiation; too much calcium kills cells (excitotoxicity)." },
  ],
);
const nmda: FigureDef = {
  id: "nmda-receptor",
  title: "The NMDA receptor: two keys and a plug",
  viewBox: "0 0 240 240",
  summary: "The NMDA glutamate receptor opens only with both glutamate and glycine bound and the magnesium plug removed; ketamine blocks it from inside the pore.",
  art: (
    <g>
      <T x={10} y={14} size={9} anchor="start" muted>outside</T>
      <T x={10} y={232} size={9} anchor="start" muted>inside</T>
      <Bilayer x0={10} x1={230} y0={76} y1={150} />
      <path d="M60,30 C50,30 46,40 48,60 L58,170 C60,182 92,182 96,170 L100,60 C100,40 92,30 80,30 Z" className={`${FILL.e} stroke-foreground`} strokeWidth={1.5} />
      <path d="M124,60 C124,40 132,30 144,30 C158,30 166,40 164,60 L156,170 C154,182 122,182 118,170 Z" className={`${FILL.b} stroke-foreground`} strokeWidth={1.5} />
      <T x={74} y={160} size={8}>GluN1</T><T x={142} y={160} size={8}>GluN2</T>
      <circle cx={74} cy={38} r={5} className="fill-chart-4 stroke-foreground" strokeWidth={1} />
      <circle cx={150} cy={38} r={6} className="fill-chart-1 stroke-foreground" strokeWidth={1} />
      <circle cx={112} cy={100} r={9} className={`${FILL.n} stroke-foreground`} strokeWidth={1.5} />
      <T x={112} y={103} size={7} bold>Mg</T>
      <Drug x={112} y={128} s={7} />
      <Arrow x1={112} y1={150} x2={112} y2={200} tone="acc" w={2} dash />
    </g>
  ),
  labels: nmdaC.labels,
};

/* ---------- lithium in a neuron ---------- */
// Reference checked: lithium enters neurons through voltage gated and epithelial sodium channels, is poorly pumped out by the
// sodium potassium pump, inhibits inositol monophosphatase and GSK-3 beta (NCBI Bookshelf StatPearls: Lithium; inositol depletion hypothesis).
const lithC = callouts(
  [
    { id: "nach", name: "Sodium channel", at: [86, 40], about: "Lithium is a small ion like sodium, so it slips into neurons through sodium channels." },
    { id: "li", name: "Lithium ions", at: [62, 18], about: "Li+ ions. In the blood the target is about 0.6 to 1.0 mmol/L, checked 12 hours after the last dose; above 1.5 toxicity becomes likely." },
    { id: "pump", name: "Sodium potassium pump", at: [234, 120], about: "The pump that throws sodium out handles lithium poorly, so lithium builds up a little inside cells." },
    { id: "impase", name: "IMPase blocked", at: [74, 128], about: "Lithium inhibits inositol monophosphatase, the enzyme that recycles inositol. Overactive neurons run short of inositol and their Gq signalling damps down: the inositol depletion idea." },
    { id: "gsk", name: "GSK-3 beta blocked", at: [180, 98], about: "Lithium inhibits glycogen synthase kinase 3 beta. This may protect neurons, raise BDNF and adjust the body clock." },
    { id: "nuc", name: "Protective genes", at: [140, 176], about: "Over weeks lithium raises protective proteins such as BDNF and bcl-2. People on long-term lithium have lower suicide rates." },
    { id: "axon", name: "Out to the kidney", at: [232, 236], about: "Lithium is never metabolised; the kidney clears it like sodium. Dehydration, NSAIDs, ACE inhibitors and thiazide diuretics raise levels." },
  ],
);
const lithium: FigureDef = {
  id: "lithium-neuron",
  title: "Lithium inside a neuron",
  viewBox: "0 0 264 270",
  summary: "Lithium enters through sodium channels and inside the neuron blocks inositol recycling and the enzyme GSK-3 beta; it is cleared unchanged by the kidney.",
  art: (
    <g>
      <path d="M40,60 C40,40 70,36 130,36 C200,36 236,46 238,90 L240,200 C240,236 200,250 130,250 C70,250 30,236 30,190 Z" className={`${FILL.a} stroke-foreground`} strokeWidth={2} />
      <rect x={78} y={30} width={7} height={18} rx={2} className={`${FILL.e} stroke-foreground`} strokeWidth={1} />
      <rect x={89} y={30} width={7} height={18} rx={2} className={`${FILL.e} stroke-foreground`} strokeWidth={1} />
      <rect x={166} y={30} width={7} height={18} rx={2} className={`${FILL.e} stroke-foreground`} strokeWidth={1} />
      <rect x={177} y={30} width={7} height={18} rx={2} className={`${FILL.e} stroke-foreground`} strokeWidth={1} />
      {[[52, 16], [70, 20], [87, 8], [175, 12], [196, 20], [120, 10]].map(([x, y], i) => (
        <g key={i}><circle cx={x} cy={y} r={8} className={`${FILL.b} stroke-foreground`} strokeWidth={1} /><T x={x} y={y + 3} size={8}>Li</T></g>
      ))}
      <Arrow x1={87} y1={44} x2={87} y2={70} tone="acc" size={5} />
      <Arrow x1={175} y1={44} x2={175} y2={70} tone="acc" size={5} />
      <rect x={228} y={108} width={20} height={26} rx={5} className={`${FILL.d} stroke-foreground`} strokeWidth={1.2} />
      <path d="M60,118 c0,-14 30,-14 30,0 c0,14 -30,14 -30,0 Z" className={`${FILL.c} stroke-foreground`} strokeWidth={1.2} />
      <circle cx={84} cy={112} r={4} className={`${FILL.b} stroke-foreground`} strokeWidth={1} />
      <path d="M164,92 c4,-14 32,-12 32,4 c0,14 -32,14 -32,-4 Z" className={`${FILL.c} stroke-foreground`} strokeWidth={1.2} />
      <circle cx={192} cy={90} r={4} className={`${FILL.b} stroke-foreground`} strokeWidth={1} />
      {[[100, 112], [104, 124], [110, 116]].map(([x, y], i) => <Dot key={i} x={x} y={y} r={2} tone="grey" />)}
      <circle cx={140} cy={180} r={34} className={`${FILL.d} stroke-foreground`} strokeWidth={1.5} />
      <path d="M118,176 q6,-10 12,0 t12,0 t12,0 t12,0" className="fill-none stroke-foreground" strokeWidth={1} />
      <path d="M118,188 q6,-10 12,0 t12,0 t12,0 t12,0" className="fill-none stroke-foreground" strokeWidth={1} />
      <path d="M220,236 C232,246 240,252 256,262" className="fill-none stroke-foreground" strokeWidth={6} strokeLinecap="round" />
    </g>
  ),
  labels: lithC.labels,
};

/* ---------- liver cell with CYP enzymes ---------- */
// Reference checked: hepatocyte between sinusoid (portal blood) and bile canaliculus; CYP enzymes are heme proteins in the
// smooth endoplasmic reticulum membrane (phase 1); UGT conjugation in ER (phase 2); induction acts via nuclear receptors
// such as AhR (smoking, 1A2) and PXR (carbamazepine, St John's wort, 3A4) (NCBI Bookshelf, LiverTox: drug metabolism).
const liverC = callouts(
  [
    { id: "sin", name: "Blood from the gut", at: [30, 60], about: "After a tablet is absorbed, the portal vein carries it straight to the liver. Much can be broken down before it ever reaches the brain: first pass metabolism." },
    { id: "in", name: "Drug enters the cell", at: [70, 92], about: "Fat-soluble drugs cross easily into the liver cell, which is why most psychiatric drugs must be changed before the kidney can remove them." },
    { id: "ser", name: "Smooth ER membrane", at: [112, 150], about: "The smooth endoplasmic reticulum is a folded membrane maze inside the cell. The CYP enzymes sit in it." },
    { id: "cyp", name: "CYP enzyme", at: [150, 140], about: "Iron-containing CYP enzymes add an oxygen to the drug (phase 1). CYP3A4, 2D6, 2C19 and 1A2 clear most psychiatric drugs; the product is more water-soluble and sometimes still active." },
    { id: "blocker", name: "Enzyme blocker", at: [196, 148], about: "Inhibitors such as fluvoxamine (1A2), fluoxetine and paroxetine (2D6) or clarithromycin (3A4) occupy the enzyme, so levels of other drugs rise within days." },
    { id: "ugt", name: "UGT adds a sugar tag", at: [150, 214], about: "Phase 2: glucuronidation attaches a large water-loving tag. Lorazepam, oxazepam, temazepam and lamotrigine go straight to this step." },
    { id: "nuc", name: "Nucleus: more enzyme", at: [178, 64], about: "Inducers such as tobacco smoke (1A2), carbamazepine and St John's wort (3A4) switch on the genes for more enzyme. It takes 1 to 2 weeks, and levels of other drugs fall." },
    { id: "bile", name: "Bile canaliculus", at: [244, 120], about: "Some tagged products leave into bile and the gut; most return to the blood and leave in urine." },
  ],
);
const liver: FigureDef = {
  id: "liver-cell-cyp",
  title: "A liver cell clearing a medicine",
  viewBox: "0 0 258 300",
  summary: "Blood from the gut brings the drug to a liver cell; CYP enzymes in the smooth ER add oxygen, UGT adds a tag, and the product leaves for the kidney or bile.",
  art: (
    <g>
      <rect x={8} y={10} width={44} height={280} rx={10} className={`${FILL.c} stroke-foreground`} strokeWidth={1.5} />
      {[40, 100, 170, 240].map((y) => <ellipse key={y} cx={30} cy={y} rx={10} ry={6} className="fill-chart-5 stroke-foreground" strokeWidth={0.8} opacity={0.75} />)}
      <rect x={60} y={14} width={178} height={272} rx={16} className={`${FILL.a} stroke-foreground`} strokeWidth={2} />
      <rect x={238} y={100} width={14} height={40} rx={5} className={`${FILL.b} stroke-foreground`} strokeWidth={1.5} />
      <circle cx={178} cy={64} r={30} className={`${FILL.d} stroke-foreground`} strokeWidth={1.5} />
      <circle cx={170} cy={58} r={7} className="fill-chart-4" />
      <ellipse cx={96} cy={248} rx={22} ry={10} className={`${FILL.d} stroke-foreground`} strokeWidth={1} />
      <path d="M78,248 q4,-6 8,0 t8,0 t8,0 t8,0" className="fill-none stroke-foreground" strokeWidth={0.8} />
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M80,${132 + k * 22} C100,${120 + k * 22} 120,${146 + k * 22} 140,${132 + k * 22} S180,${120 + k * 22} 222,${132 + k * 22}`} className="fill-none stroke-foreground" strokeWidth={5} opacity={0.35} />
      ))}
      {[[150, 140], [196, 148], [120, 168], [170, 162]].map(([x, y], i) => (
        <g key={i}><circle cx={x} cy={y} r={7} className={`${FILL.c} stroke-foreground`} strokeWidth={1.2} /><circle cx={x} cy={y} r={2} className="fill-foreground" /></g>
      ))}
      <path d="M196,140 l7,-4 l7,4 l0,8 l-7,4 l-7,-4 Z" className="fill-chart-4 stroke-foreground" strokeWidth={1} />
      <Drug x={30} y={60} s={6} />
      <Arrow x1={40} y1={70} x2={66} y2={90} />
      <Drug x={76} y={94} s={6} />
      <Arrow x1={84} y1={100} x2={140} y2={136} tone="grey" dash />
      <rect x={140} y={206} width={22} height={14} rx={3} className={`${FILL.b} stroke-foreground`} strokeWidth={1.2} />
      <Drug x={130} y={213} s={6} />
      <Arrow x1={162} y1={214} x2={236} y2={130} cx={220} cy={214} tone="grey" />
      <Arrow x1={128} y1={222} x2={50} y2={262} cx={96} cy={270} tone="grey" />
      <T x={30} y={296} size={8} muted>blood</T>
    </g>
  ),
  labels: liverC.labels,
};

export const PHARM: FigureDef[] = [receptorFamilies, gpcr, ssri, maoi, tca, d2, d2occ, partial, benzo, nmda, lithium, stim, pkSingle, pkSteady, liver];
