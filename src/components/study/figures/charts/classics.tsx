import type { ReactNode } from "react";
import type { FigureDef } from "../types";
import { Arrow, FILL, L, Line, T, callouts, polar } from "./kit";

/* Classic textbook figures that students are examined on, plus clinical drawing tests and a to-scale legal timeline. */

const INK = "stroke-foreground";
const fillS = (t: keyof typeof FILL, w = 1.5) => ({ className: `${FILL[t]} ${INK}`, strokeWidth: w });

/* ---------- 1. Maslow's hierarchy ---------- */
// Reference checked: Maslow (1943, 1954): physiological, safety, love and belonging, esteem, self-actualisation; the lower four
// are deficiency needs and self-actualisation a growth need (OpenStax Psychology 2e, 10.1 Motivation, Figure 10.5).
const MW = (y: number) => ((y - 20) / 230) * 120; // half width at height y; apex at y 20, base y 250
const MB = [250, 204, 160, 118, 78, 20];
const MT: (keyof typeof FILL)[] = ["d", "a", "e", "b", "c"];
const maslowC = callouts(
  [
    { id: "self", name: "Self-actualisation", at: [130, 60], about: "Becoming the most one can be: creativity, meaning, growth. Maslow thought few people fully reach it. Later he added self-transcendence above it." },
    { id: "esteem", name: "Esteem", at: [130, 98], about: "Respect from others and self-respect: achievement, recognition, confidence." },
    { id: "love", name: "Love and belonging", at: [130, 140], about: "Friendship, family, intimacy and acceptance by a group." },
    { id: "safety", name: "Safety", at: [130, 182], about: "Security, stable housing and income, health, freedom from fear and violence." },
    { id: "phys", name: "Physiological", at: [130, 228], about: "Food, water, warmth, sleep and air. Unmet, these dominate everything else." },
    { id: "deficit", name: "Deficiency needs", at: [24, 190], about: "The lower four levels motivate when they are missing and fade once met." },
    { id: "growth", name: "Growth need", at: [72, 58], about: "Self-actualisation motivates more as it is fed. Critics note that people often pursue higher needs while lower ones are unmet." },
  ],
);
const maslow: FigureDef = {
  id: "maslow-pyramid",
  title: "Maslow's hierarchy of needs",
  viewBox: "0 0 254 260",
  summary: "Maslow's pyramid: physiological needs at the base, then safety, love and belonging, esteem, and self-actualisation at the top.",
  art: (
    <g>
      {MT.map((t, i) => {
        const y0 = MB[i];
        const y1 = MB[i + 1];
        return <path key={i} d={`M${130 - MW(y0)},${y0} L${130 + MW(y0)},${y0} L${130 + MW(y1)},${y1} L${130 - MW(y1)},${y1} Z`} {...fillS(t)} />;
      })}
      <path d="M14,250 L8,250 L8,82 L14,82" className="fill-none stroke-foreground" strokeWidth={1.5} />
      <path d="M62,78 L56,78 L56,22 L62,22" className="fill-none stroke-foreground" strokeWidth={1.5} />
    </g>
  ),
  labels: maslowC.labels,
};

/* ---------- 2. Baddeley's working memory model ---------- */
// Reference checked: Baddeley and Hitch (1974), with the episodic buffer added by Baddeley (2000): central executive controlling
// the phonological loop (store plus articulatory rehearsal), the visuospatial sketchpad and the episodic buffer, linked to
// long-term knowledge (language, episodic long-term memory, visual semantics) (Simply Psychology, working memory model).
const wmC = callouts(
  [
    { id: "ce", name: "Central executive", at: [130, 40], about: "The supervisor: directs attention, switches between tasks and coordinates the other parts. It has no storage of its own and is linked to the frontal lobes." },
    { id: "vss", name: "Visuospatial sketchpad", at: [45, 135], about: "Holds what things look like and where they are, for example picturing the route to the clinic." },
    { id: "eb", name: "Episodic buffer", at: [122, 135], about: "Added in 2000: binds sound, sight and time into one episode and links working memory to long-term memory." },
    { id: "pl", name: "Phonological loop", at: [215, 122], about: "Holds speech sounds for about 2 seconds. Doing two verbal tasks at once overloads it, but a verbal and a visual task can run together." },
    { id: "art", name: "Inner voice rehearsal", at: [215, 150], about: "The articulatory rehearsal process repeats words silently to keep them alive, like repeating a phone number." },
    { id: "ltm", name: "Long-term knowledge", at: [130, 232], about: "The shaded base: visual semantics, episodic memory and language, which the working parts draw on." },
  ],
);
const workingMemory: FigureDef = {
  id: "working-memory-model",
  title: "The working memory model",
  viewBox: "0 0 256 260",
  summary: "Baddeley's working memory: a central executive directs the phonological loop, the visuospatial sketchpad and the episodic buffer, which draw on long-term knowledge.",
  art: (
    <g>
      <rect x={70} y={20} width={120} height={40} rx={8} {...fillS("e", 2)} />
      <rect x={10} y={112} width={70} height={50} rx={8} {...fillS("b")} />
      <rect x={95} y={112} width={70} height={50} rx={8} {...fillS("a")} />
      <rect x={180} y={112} width={70} height={50} rx={8} {...fillS("c")} />
      <path d="M200,150 A14,8 0 1 0 230,150" className="fill-none stroke-foreground" strokeWidth={1.2} />
      <Arrow x1={110} y1={60} x2={50} y2={110} both size={5} w={1.2} />
      <Arrow x1={130} y1={60} x2={130} y2={110} both size={5} w={1.2} />
      <Arrow x1={150} y1={60} x2={210} y2={110} both size={5} w={1.2} />
      <rect x={10} y={206} width={240} height={40} rx={6} {...fillS("d")} />
      <line x1={90} y1={206} x2={90} y2={246} className="stroke-muted-foreground" strokeWidth={1} />
      <line x1={170} y1={206} x2={170} y2={246} className="stroke-muted-foreground" strokeWidth={1} />
      <T x={50} y={242} size={8} muted>visual semantics</T>
      <T x={130} y={222} size={8} muted>episodic memory</T>
      <T x={210} y={242} size={8} muted>language</T>
      {[45, 130, 215].map((x) => <Arrow key={x} x1={x} y1={162} x2={x} y2={204} both size={5} w={1.2} tone="grey" />)}
    </g>
  ),
  labels: wmC.labels,
};

/* ---------- 3. Atkinson and Shiffrin's multi-store model ---------- */
// Reference checked: Atkinson and Shiffrin (1968): sensory register (iconic under 1 s, echoic 2 to 4 s), short-term store
// (about 7 plus or minus 2 items, about 18 to 30 s without rehearsal), long-term store; attention, rehearsal, encoding and
// retrieval (OpenStax Psychology 2e, 8.1, Figure 8.3).
const msC = callouts(
  [
    { id: "input", name: "Input from senses", at: [20, 70], about: "Sights, sounds and touches flood in all the time." },
    { id: "sr", name: "Sensory register", at: [70, 50], about: "Holds a brief, exact copy: under a second for vision (iconic), 2 to 4 seconds for sound (echoic). Unattended information is lost." },
    { id: "att", name: "Attention", at: [116, 62], about: "Only what we attend to passes on to short-term memory." },
    { id: "stm", name: "Short-term memory", at: [160, 50], about: "Holds about 7 plus or minus 2 chunks for about 20 to 30 seconds unless rehearsed." },
    { id: "reh", name: "Rehearsal loop", at: [160, 18], about: "Repeating keeps information in short-term memory; enough rehearsal moves it to long-term memory." },
    { id: "ltm", name: "Long-term memory", at: [230, 50], about: "Very large and lasting. Patient HM, after his hippocampi were removed, could not move new facts into it, which supported separate stores." },
    { id: "ret", name: "Retrieval", at: [194, 100], about: "Stored memories are brought back into short-term memory to be used." },
    { id: "loss", name: "Forgetting", at: [160, 130], about: "Lost by decay in the sensory register, by displacement or decay in short-term memory, and by interference or retrieval failure in long-term memory." },
  ],
);
const multiStore: FigureDef = {
  id: "multi-store-model",
  title: "The multi-store model of memory",
  viewBox: "0 0 262 160",
  summary: "Information passes from the senses to a brief sensory register, through attention into short-term memory, and with rehearsal into long-term memory, from which it can be retrieved.",
  art: (
    <g>
      <rect x={44} y={30} width={56} height={40} rx={6} {...fillS("d")} />
      <rect x={134} y={30} width={56} height={40} rx={6} {...fillS("a")} />
      <rect x={214} y={30} width={40} height={40} rx={6} {...fillS("b")} />
      <Arrow x1={8} y1={50} x2={42} y2={50} />
      <Arrow x1={100} y1={50} x2={132} y2={50} />
      <Arrow x1={190} y1={44} x2={212} y2={44} />
      <Arrow x1={212} y1={60} x2={192} y2={60} />
      <Arrow x1={150} y1={30} x2={172} y2={30} cx={162} cy={-4} size={5} />
      <path d="M194,100 L202,62" className="stroke-muted-foreground" strokeWidth={0.8} />
      {[72, 162, 234].map((x) => <Arrow key={x} x1={x} y1={70} x2={x} y2={120} tone="grey" dash size={5} />)}
      <line x1={60} y1={130} x2={250} y2={130} className="stroke-muted-foreground" strokeWidth={0.8} strokeDasharray="3 3" />
      <T x={72} y={146} size={8} muted>decay</T>
      <T x={162} y={146} size={8} muted>displacement</T>
      <T x={234} y={146} size={8} muted>interference</T>
    </g>
  ),
  labels: msC.labels,
};

/* ---------- 4. Eysenck's personality circle ---------- */
// Reference checked: Eysenck's two dimensions, introversion to extraversion and stability to neuroticism, with Galen's four
// temperaments in the quadrants and trait words around the circle (Eysenck 1965; Simply Psychology, Eysenck).
const EC = { x: 130, y: 132 };
const ER = 92;
const WORDS: [string, number][] = [
  ["moody", 290], ["anxious", 305], ["rigid", 320], ["pessimistic", 338],
  ["touchy", 22], ["restless", 38], ["aggressive", 55], ["impulsive", 72],
  ["sociable", 108], ["outgoing", 125], ["lively", 142], ["carefree", 158],
  ["passive", 200], ["careful", 218], ["thoughtful", 235], ["calm", 252],
];
const eysenck: FigureDef = {
  id: "eysenck-circle",
  title: "Eysenck's personality dimensions",
  viewBox: "0 0 266 260",
  summary: "Eysenck's two dimensions, introversion to extraversion and stable to unstable, crossed to give four quadrants matching the ancient temperaments.",
  art: (
    <g>
      <circle cx={EC.x} cy={EC.y} r={ER - 18} {...fillS("a")} />
      <line x1={EC.x - ER + 18} y1={EC.y} x2={EC.x + ER - 18} y2={EC.y} className={INK} strokeWidth={1.5} />
      <line x1={EC.x} y1={EC.y - ER + 18} x2={EC.x} y2={EC.y + ER - 18} className={INK} strokeWidth={1.5} />
      <T x={EC.x} y={EC.y - ER - 14} size={9} bold>unstable</T>
      <T x={EC.x} y={EC.y + ER + 24} size={9} bold>stable</T>
      <T x={EC.x - ER + 22} y={EC.y - 6} size={9} anchor="start" bold>introvert</T>
      <T x={EC.x + ER - 22} y={EC.y - 6} size={9} anchor="end" bold>extravert</T>
      <circle cx={EC.x} cy={EC.y} r={6} {...fillS("n", 1.5)} />
      <circle cx={EC.x} cy={EC.y} r={2} className="fill-foreground" />
      {WORDS.map(([w, a]) => {
        const [x, y] = polar(EC.x, EC.y, ER + 4, a);
        return <T key={w} x={x} y={y + 3} size={7.5} muted>{w}</T>;
      })}
    </g>
  ),
  labels: [
    L("mel", "Melancholic", 100, 102, "Unstable introvert: moody, anxious, rigid, pessimistic. Prone to anxiety and depression."),
    L("cho", "Choleric", 160, 102, "Unstable extravert: touchy, restless, aggressive, impulsive."),
    L("san", "Sanguine", 160, 162, "Stable extravert: sociable, outgoing, lively, carefree."),
    L("phl", "Phlegmatic", 100, 162, "Stable introvert: passive, careful, thoughtful, calm."),
    L("e", "Extraversion (E)", EC.x + 66, EC.y, "Linked to arousal in the reticular activating system: introverts are more easily aroused, so extraverts seek stimulation."),
    L("n", "Neuroticism (N)", EC.x, EC.y - 66, "Emotional instability, linked to a reactive limbic system. High N is a strong risk factor for anxiety and depression."),
    L("p", "Psychoticism (P)", EC.x, EC.y, "A third dimension added later: tough-minded, cold and impulsive. Measured with E and N by the Eysenck Personality Questionnaire."),
    L("galen", "Galen's temperaments", ...polar(EC.x, EC.y, ER - 18, 225), "The four quadrants match the four temperaments of ancient Greek medicine, which Eysenck used as names."),
  ],
};

/* ---------- 5. genogram symbols ---------- */
// Reference checked: standard genogram symbols (McGoldrick and Gerson): square male, circle female, double outline index
// person, X for death, solid line marriage, slashes for separation and divorce, dashed line for cohabitation, children hung
// from the couple line oldest on the left, joined lines for twins, triangle for pregnancy, zigzag for conflict.
const GX = [20, 110];
const GY = (r: number) => 22 + r * 44;
const SYM: [string, string, string, (x: number, y: number) => ReactNode][] = [
  ["male", "Male", "A square. Write the age inside and the name or year of birth above.", (x, y) => <rect x={x} y={y - 11} width={22} height={22} {...fillS("n")} />],
  ["female", "Female", "A circle, the same size as the square.", (x, y) => <circle cx={x + 11} cy={y} r={11} {...fillS("n")} />],
  ["index", "Index person (patient)", "The person the genogram is about: a double outline, sometimes with an arrow.", (x, y) => (
    <g><rect x={x} y={y - 11} width={22} height={22} {...fillS("b")} /><rect x={x + 3} y={y - 8} width={16} height={16} className="fill-none stroke-foreground" strokeWidth={1.2} /></g>
  )],
  ["dead", "Died", "An X through the symbol, with the age and cause of death if known.", (x, y) => (
    <g><circle cx={x + 11} cy={y} r={11} {...fillS("n")} /><path d={`M${x + 2},${y - 9} L${x + 20},${y + 9} M${x + 20},${y - 9} L${x + 2},${y + 9}`} className={INK} strokeWidth={1.5} /></g>
  )],
  ["married", "Married", "A solid line joins the partners, male usually on the left, with the year of marriage.", (x, y) => (
    <g><rect x={x} y={y - 16} width={14} height={14} {...fillS("n", 1.2)} /><circle cx={x + 48} cy={y - 9} r={7} {...fillS("n", 1.2)} /><path d={`M${x + 7},${y - 2} L${x + 7},${y + 8} L${x + 48},${y + 8} L${x + 48},${y - 2}`} className="fill-none stroke-foreground" strokeWidth={1.5} /></g>
  )],
  ["divorced", "Divorced", "One slash across the couple line for separation, two for divorce.", (x, y) => (
    <g><path d={`M${x},${y} L${x + 52},${y}`} className={INK} strokeWidth={1.5} /><path d={`M${x + 20},${y + 8} L${x + 26},${y - 8} M${x + 28},${y + 8} L${x + 34},${y - 8}`} className={INK} strokeWidth={1.5} /></g>
  )],
  ["cohab", "Living together", "A dashed couple line for partners who live together without marriage.", (x, y) => <path d={`M${x},${y} L${x + 52},${y}`} className={INK} strokeWidth={1.5} strokeDasharray="4 3" />],
  ["children", "Children in order", "Children hang from the couple line in birth order, oldest on the left.", (x, y) => (
    <g><path d={`M${x},${y - 12} L${x + 52},${y - 12} M${x + 8},${y - 12} L${x + 8},${y} M${x + 44},${y - 12} L${x + 44},${y}`} className="fill-none stroke-foreground" strokeWidth={1.5} /><rect x={x + 2} y={y} width={12} height={12} {...fillS("n", 1.2)} /><circle cx={x + 44} cy={y + 6} r={6} {...fillS("n", 1.2)} /></g>
  )],
  ["twins", "Twins", "Two lines from one point on the sibling line; a bar joining them marks identical twins.", (x, y) => (
    <g><path d={`M${x + 26},${y - 14} L${x + 10},${y + 2} M${x + 26},${y - 14} L${x + 42},${y + 2} M${x + 17},${y - 5} L${x + 35},${y - 5}`} className="fill-none stroke-foreground" strokeWidth={1.5} /><circle cx={x + 10} cy={y + 8} r={6} {...fillS("n", 1.2)} /><circle cx={x + 42} cy={y + 8} r={6} {...fillS("n", 1.2)} /></g>
  )],
  ["preg", "Pregnancy", "A triangle, with the expected date.", (x, y) => <path d={`M${x + 11},${y - 11} L${x + 22},${y + 9} L${x},${y + 9} Z`} {...fillS("n")} />],
  ["conflict", "Conflict", "A zigzag line between two people shows a hostile or conflicted relationship.", (x, y) => <path d={`M${x},${y} l6,-7 l6,14 l6,-14 l6,14 l6,-14 l6,14 l6,-7`} className="fill-none stroke-chart-5" strokeWidth={1.8} />],
  ["cutoff", "Cut off", "A line broken by a gap marks people who no longer have contact.", (x, y) => <path d={`M${x},${y} L${x + 20},${y} M${x + 32},${y} L${x + 52},${y} M${x + 20},${y - 8} L${x + 20},${y + 8} M${x + 32},${y - 8} L${x + 32},${y + 8}`} className="fill-none stroke-foreground" strokeWidth={1.8} />],
];
/** Symbols drawn as lines are pointed at their middle, the shapes at their centre. */
const LINEISH = new Set(["married", "divorced", "cohab", "children", "twins", "conflict", "cutoff"]);
const genogram: FigureDef = {
  id: "genogram-symbols",
  title: "Genogram symbols",
  viewBox: "0 0 184 280",
  summary: "The standard genogram symbols for people, couples, children and relationships.",
  art: (
    <g>
      {SYM.map(([id, , , draw], i) => <g key={id}>{draw(GX[i % 2], GY(Math.floor(i / 2)))}</g>)}
    </g>
  ),
  labels: SYM.map(([id, name, about], i) => L(id, name, GX[i % 2] + (LINEISH.has(id) ? 26 : 11), GY(Math.floor(i / 2)), about)),
};

/* ---------- 6. copying and clock drawing ---------- */
// Reference checked: the copying item of standard cognitive screens uses two intersecting pentagons, scored correct if both
// have five sides and the overlap forms a four-sided figure; the clock drawing test asks for a clock face with all numbers and
// hands set to ten past eleven (NCBI Bookshelf, StatPearls: Mini-Cog; Clock drawing test).
const pent = (cx: number, cy: number, r: number, rot: number) =>
  Array.from({ length: 5 }, (_, i) => {
    const a = ((rot + i * 72 - 90) * Math.PI) / 180;
    return `${i ? "L" : "M"}${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ") + " Z";
const clockNums = (cx: number, cy: number, r: number, squash = false) =>
  Array.from({ length: 12 }, (_, i) => {
    const a = squash ? 200 + i * 13 : (i + 1) * 30;
    const [x, y] = polar(cx, cy, r - 9, squash ? a - 180 : a);
    return <T key={i} x={x} y={y + 3} size={7.5}>{i + 1}</T>;
  });
const drawC = callouts(
  [
    { id: "pent", name: "Intersecting pentagons", at: [60, 40], about: "The person copies two overlapping five-sided shapes. A pass needs two pentagons with all corners present." },
    { id: "overlap", name: "Four-sided overlap", at: [92, 70], about: "The overlap must make a four-sided figure. Failure suggests visuospatial or parietal problems, common in dementia and delirium." },
    { id: "clock", name: "Normal clock", at: [62, 178], about: "Asked to draw a clock with all the numbers and set it to ten past eleven, the person plans the face, spaces the numbers and places both hands." },
    { id: "hands", name: "Hands at 11:10", at: [62, 166], about: "Setting the hands needs abstract thinking: a common error is pointing the minute hand at the 10 instead of the 2." },
    { id: "bunched", name: "Planning error", at: [198, 168], about: "Numbers crowded on one side or outside the circle and hands missing point to executive and visuospatial problems, as in Alzheimer's disease. Numbers only on the right half suggest neglect after a right parietal stroke." },
  ],
);
const clock: FigureDef = {
  id: "copy-and-clock",
  title: "Bedside drawing tests: pentagons and clock",
  viewBox: "0 0 246 250",
  summary: "Two drawing tasks from bedside cognitive screening: copying intersecting pentagons, and drawing a clock set to ten past eleven, shown done normally and with planning errors.",
  art: (
    <g>
      <path d={pent(70, 66, 34, 0)} className={`fill-none ${INK}`} strokeWidth={2} />
      <path d={pent(118, 74, 34, 36)} className={`fill-none ${INK}`} strokeWidth={2} />
      <circle cx={70} cy={180} r={50} {...fillS("n", 2)} />
      {clockNums(70, 180, 50)}
      <line x1={70} y1={180} x2={52} y2={164} className={INK} strokeWidth={3} strokeLinecap="round" />
      <line x1={70} y1={180} x2={106} y2={162} className={INK} strokeWidth={2} strokeLinecap="round" />
      <circle cx={190} cy={180} r={50} {...fillS("n", 2)} />
      {clockNums(190, 180, 50, true)}
      <line x1={190} y1={180} x2={212} y2={152} className={INK} strokeWidth={2} strokeLinecap="round" />
      <T x={70} y={244} size={8} muted>expected</T>
      <T x={190} y={244} size={8} muted>impaired</T>
    </g>
  ),
  labels: drawC.labels,
};

/* ---------- 7. Mental Healthcare Act 2017 time limits, to scale ---------- */
// Reference checked (Mental Healthcare Act 2017, bare act sections 86 to 94, advocatekhoj and the Himachal Pradesh State
// Mental Health Authority admission summary): s.88(3) 24 hour hold of an independent patient for assessment; s.87 minors:
// report to the Board within 72 hours, Board review within 7 days once admission passes 30 days; s.89 supported admission up
// to 30 days, report within 3 days for a woman or minor and 7 days for others; s.90 up to 90 days on two psychiatrists'
// assessment, report within 7 days, Board decides within 21 days, then 120 and 180 day extensions; s.94 emergency treatment up
// to 72 hours by any registered medical practitioner, no ECT.
const DX = (d: number) => 30 + d * 2.5;
const ROWY = [44, 92, 140, 188, 236];
function Bar({ row, days, tone, dash }: { row: number; days: number; tone: keyof typeof FILL; dash?: boolean }) {
  return <rect x={DX(0)} y={ROWY[row]} width={Math.max(DX(days) - DX(0), 3)} height={14} rx={3} {...fillS(tone, 1.2)} strokeDasharray={dash ? "4 3" : undefined} />;
}
function Tick({ row, day, text, above }: { row: number; day: number; text: string; above?: boolean }) {
  return (
    <g>
      <line x1={DX(day)} y1={ROWY[row] - 3} x2={DX(day)} y2={ROWY[row] + 17} className="stroke-chart-5" strokeWidth={2} />
      <T x={DX(day)} y={above ? ROWY[row] - 6 : ROWY[row] + 28} size={8} muted>{text}</T>
    </g>
  );
}
const mhca: FigureDef = {
  id: "mhca-time-limits",
  title: "Mental Healthcare Act 2017: time limits, to scale",
  viewBox: "0 0 290 290",
  summary: "The time limits of admission and emergency treatment under India's Mental Healthcare Act 2017, drawn to scale in days.",
  art: (
    <g>
      <rect x={DX(0)} y={ROWY[0]} width={DX(90) - DX(0)} height={14} rx={3} className="fill-none stroke-muted-foreground" strokeDasharray="4 3" />
      <Bar row={0} days={1} tone="c" />
      <T x={DX(45)} y={ROWY[0] + 11} size={8} muted>no fixed limit; leaves on request</T>
      <Bar row={1} days={3} tone="c" />
      <Bar row={2} days={30} tone="a" />
      <Tick row={2} day={3} text="3 d" />
      <Tick row={2} day={7} text="7 d" above />
      <Bar row={3} days={90} tone="e" />
      <Tick row={3} day={7} text="7 d" above />
      <Tick row={3} day={21} text="21 d" />
      <Arrow x1={DX(90)} y1={ROWY[3] + 7} x2={DX(90) + 24} y2={ROWY[3] + 7} tone="grey" dash size={5} />
      <Bar row={4} days={30} tone="b" />
      <Tick row={4} day={3} text="72 h" />
      <Arrow x1={DX(30)} y1={ROWY[4] + 7} x2={DX(37)} y2={ROWY[4] + 7} tone="grey" size={5} />
      <Line x1={DX(0)} y1={268} x2={DX(90)} y2={268} />
      {[0, 30, 60, 90].map((d) => (
        <g key={d}>
          <Line x1={DX(d)} y1={264} x2={DX(d)} y2={272} />
          <T x={DX(d)} y={284} size={8} muted>{`${d} d`}</T>
        </g>
      ))}
    </g>
  ),
  labels: [
    L("indep", "Independent admission: 24 h hold", DX(0.5), ROWY[0] + 7, "The person asks to come in and can leave on request. A mental health professional may hold them for up to 24 hours only to assess for supported admission (section 88)."),
    L("emerg", "Emergency treatment: 72 hours", DX(1.5), ROWY[1] + 7, "Any registered medical practitioner may treat for up to 72 hours to prevent death or serious harm, including transport to a hospital. ECT is not allowed (section 94)."),
    L("s89", "Supported admission: up to 30 days", DX(18), ROWY[2] + 7, "For severe illness with recent risk to self or others or inability to care for self, assessed by a psychiatrist and one other professional within 7 days. Report to the Mental Health Review Board within 3 days for a woman or minor, 7 days for others (section 89)."),
    L("s90", "Beyond 30 days: up to 90 days", DX(50), ROWY[3] + 7, "Needs two psychiatrists' assessments; report within 7 days and the Board decides within 21 days. Extensions are 120 days, then 180 days each time (section 90)."),
    L("minor", "Minors: Board told in 72 h", DX(18), ROWY[4] + 7, "A nominated representative applies; the Board is told within 72 hours and reviews within 7 days once the stay passes 30 days. A parent or attendant must stay throughout (section 87)."),
  ],
};

export const CLASSICS: FigureDef[] = [maslow, workingMemory, multiStore, eysenck, genogram, clock, mhca];
