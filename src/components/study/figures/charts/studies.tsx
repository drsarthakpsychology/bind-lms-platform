import type { FigureDef } from "../types";
import { Arrow, FILL, L, Line, P, T, callouts } from "./kit";

/* Apparatus and set-ups of the classic studies, drawn from published descriptions and photographs. */

const INK = "stroke-foreground";
const fillS = (t: keyof typeof FILL, w = 1.5) => ({ className: `${FILL[t]} ${INK}`, strokeWidth: w });

/** A simple standing or sitting person: head and body, facing right unless flipped. */
function Person({ x, y, h = 90, tone = "d" as keyof typeof FILL, sit }: { x: number; y: number; h?: number; tone?: keyof typeof FILL; sit?: boolean }) {
  const r = h * 0.11;
  const bodyH = sit ? h * 0.4 : h * 0.48;
  return (
    <g>
      <circle cx={x} cy={y + r} r={r} {...fillS(tone, 1.3)} />
      <rect x={x - h * 0.12} y={y + 2 * r + 2} width={h * 0.24} height={bodyH} rx={h * 0.08} {...fillS(tone, 1.3)} />
      {sit ? null : (
        <>
          <line x1={x - h * 0.06} y1={y + 2 * r + 2 + bodyH} x2={x - h * 0.07} y2={y + h} className={INK} strokeWidth={h * 0.06} strokeLinecap="round" />
          <line x1={x + h * 0.06} y1={y + 2 * r + 2 + bodyH} x2={x + h * 0.07} y2={y + h} className={INK} strokeWidth={h * 0.06} strokeLinecap="round" />
        </>
      )}
    </g>
  );
}
function Checker({ x, y, w, h, n, m }: { x: number; y: number; w: number; h: number; n: number; m: number }) {
  const cw = w / n;
  const ch = h / m;
  const cells = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) if ((i + j) % 2 === 0) cells.push(<rect key={`${i}-${j}`} x={x + i * cw} y={y + j * ch} width={cw} height={ch} className="fill-foreground" opacity={0.75} />);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} className="fill-card stroke-foreground" strokeWidth={1} />
      {cells}
    </g>
  );
}

/* ---------- 1. Pavlov's apparatus ---------- */
// Reference checked: dog stood in a harness on a stand; saliva led from a cheek fistula by a tube to a graduated measuring
// vessel; food powder delivered to a bowl; the metronome or bell as the neutral stimulus; the experimenter observed from
// behind a screen to avoid giving cues (Pavlov 1927 lectures, psychclassics archive; OpenStax Psychology 2e, 6.2).
const pavC = callouts(
  [
    { id: "met", name: "Metronome (neutral stimulus)", at: [40, 62], about: "A sound with no meaning for the dog at first. After pairing with food it becomes the conditioned stimulus." },
    { id: "harness", name: "Harness and frame", at: [110, 70], about: "The dog stood in a loose harness so it stayed in place for many trials." },
    { id: "food", name: "Food (unconditioned)", at: [236, 196], about: "Meat powder makes the dog salivate with no learning: the unconditioned stimulus and response." },
    { id: "fist", name: "Cheek tube for saliva", at: [212, 138], about: "A small operation led a salivary duct to the outside of the cheek, so every drop could be collected." },
  ],
  20, 262, 22,
);
const pavD = callouts(
  [
    { id: "meas", name: "Measuring tube", at: [276, 150], about: "Drops were counted in a graduated tube, giving an exact measure of the response." },
    { id: "screen", name: "Screen", at: [310, 100], about: "The experimenter worked from behind a wall so his movements could not act as cues." },
    { id: "obs", name: "Experimenter", at: [350, 110], about: "Pavlov's team recorded the amount of saliva on each trial: the conditioned response appeared after a few pairings." },
  ],
  230, 262, 22,
);
const pavlov: FigureDef = {
  id: "pavlov-apparatus",
  title: "Pavlov's conditioning set-up",
  viewBox: "0 0 420 340",
  summary: "A dog stands in a harness; a tube from its cheek carries saliva to a measuring tube, food arrives in a bowl, a metronome sounds, and the experimenter watches from behind a screen.",
  art: (
    <g>
      <rect x={40} y={202} width={200} height={10} {...fillS("d")} />
      <line x1={52} y1={212} x2={52} y2={248} className={INK} strokeWidth={4} />
      <line x1={228} y1={212} x2={228} y2={248} className={INK} strokeWidth={4} />
      <line x1={10} y1={248} x2={410} y2={248} className={INK} strokeWidth={2} />
      <line x1={60} y1={60} x2={60} y2={202} className={INK} strokeWidth={3} />
      <line x1={220} y1={60} x2={220} y2={202} className={INK} strokeWidth={3} />
      <line x1={56} y1={60} x2={224} y2={60} className={INK} strokeWidth={3} />
      <line x1={110} y1={60} x2={110} y2={128} className={INK} strokeWidth={1.5} />
      <line x1={170} y1={60} x2={170} y2={126} className={INK} strokeWidth={1.5} />
      {[[92, 172], [108, 175], [160, 175], [176, 172]].map(([x, y], i) => <line key={i} x1={x} y1={y} x2={x} y2={202} className={INK} strokeWidth={5} strokeLinecap="round" />)}
      <path d="M76,148 C70,130 74,124 70,112" className="fill-none stroke-foreground" strokeWidth={3} strokeLinecap="round" />
      <ellipse cx={135} cy={152} rx={64} ry={27} {...fillS("b")} />
      <path d="M182,140 C190,118 200,108 214,110 C228,112 236,122 240,130 C244,138 236,146 222,146 C210,146 196,152 186,160 Z" {...fillS("b")} />
      <path d="M204,112 C198,100 204,94 210,98 L212,112 Z" {...fillS("b", 1.2)} />
      <circle cx={222} cy={124} r={2} className="fill-foreground" />
      <rect x={100} y={124} width={80} height={8} rx={3} {...fillS("d", 1.2)} />
      <path d="M212,138 C240,150 250,120 276,130" className="fill-none stroke-foreground" strokeWidth={1.5} />
      <rect x={270} y={128} width={12} height={74} rx={3} {...fillS("n", 1.2)} />
      {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={270} y1={140 + i * 10} x2={276} y2={140 + i * 10} className={INK} strokeWidth={1} />)}
      <rect x={271} y={176} width={10} height={25} className="fill-chart-1" opacity={0.6} />
      <path d="M222,196 L250,196 L246,204 L226,204 Z" {...fillS("c", 1.2)} />
      <path d="M28,90 L36,52 L46,52 L54,90 Z" {...fillS("n", 1.2)} />
      <line x1={41} y1={84} x2={48} y2={56} className={INK} strokeWidth={1.5} />
      <rect x={306} y={40} width={8} height={208} {...fillS("d", 1.2)} />
      <rect x={306} y={92} width={8} height={20} className="fill-chart-1" opacity={0.5} />
      <Person x={352} y={96} h={150} sit />
      <rect x={326} y={176} width={60} height={8} {...fillS("d", 1.2)} />
      {pavC.art}
      {pavD.art}
    </g>
  ),
  labels: [...pavC.labels, ...pavD.labels],
};

/* ---------- 2. Skinner box ---------- */
// Reference checked: operant chamber with a response lever, a food magazine (dispenser) delivering pellets to a tray beside
// the lever, a signal light, a loudspeaker, an electrifiable grid floor, and a cumulative recorder outside (OpenStax
// Psychology 2e, 6.3; Wikipedia, operant conditioning chamber).
const skC = callouts(
  [
    { id: "speaker", name: "Loudspeaker", at: [44, 52], about: "Plays a tone that can signal when responses will pay off: a discriminative stimulus." },
    { id: "light", name: "Signal light", at: [196, 82], about: "A light above the lever can also signal that reinforcement is available." },
    { id: "disp", name: "Food dispenser", at: [226, 70], about: "Outside the box, it drops a food pellet down a chute when the program says so." },
    { id: "lever", name: "Lever", at: [196, 124], about: "The response. Each press closes a switch and is counted." },
    { id: "tray", name: "Food tray", at: [200, 162], about: "The pellet arrives here, right after the press: immediate positive reinforcement." },
    { id: "rat", name: "Rat", at: [128, 156], about: "A hungry rat explores, presses the lever by chance, gets food, and presses more and more: the law of effect in action." },
    { id: "grid", name: "Grid floor", at: [70, 186], about: "Metal bars that can deliver a mild shock, used to study punishment and escape or avoidance learning." },
    { id: "rec", name: "Cumulative recorder", at: [150, 258], about: "A pen steps up with every response on paper moving at a steady speed, so the slope shows the response rate." },
  ],
  262, 24, 32,
);
const skinner: FigureDef = {
  id: "skinner-box",
  title: "The Skinner box",
  viewBox: "0 0 420 300",
  summary: "An operant chamber: a rat presses a lever and food drops into a tray, with a light, a speaker and a grid floor inside, and a recorder outside counting every press.",
  art: (
    <g>
      <rect x={20} y={30} width={190} height={160} {...fillS("a", 2)} />
      {Array.from({ length: 19 }, (_, i) => <circle key={i} cx={28 + i * 10} cy={186} r={2.5} className="fill-foreground" />)}
      {[0, 1, 2].map((i) => <line key={i} x1={36 + i * 6} y1={46} x2={36 + i * 6} y2={60} className={INK} strokeWidth={2} />)}
      <circle cx={196} cy={82} r={7} {...fillS("b", 1.2)} />
      <rect x={176} y={120} width={34} height={7} rx={2} {...fillS("d", 1.2)} />
      <path d="M190,160 L210,160 L210,170 L190,170 Z" {...fillS("n", 1.2)} />
      <rect x={214} y={50} width={30} height={40} rx={4} {...fillS("d", 1.2)} />
      <path d="M229,90 L229,140 L210,162" className="fill-none stroke-foreground" strokeWidth={1.5} />
      <ellipse cx={128} cy={160} rx={34} ry={15} {...fillS("n")} />
      <path d="M156,152 C168,144 176,148 180,156 C176,162 166,166 158,166 Z" {...fillS("n", 1.2)} />
      <circle cx={162} cy={150} r={4} {...fillS("n", 1)} />
      <circle cx={172} cy={154} r={1.6} className="fill-foreground" />
      <path d="M94,162 C70,170 56,150 40,160" className="fill-none stroke-foreground" strokeWidth={1.5} />
      <path d="M193,127 C230,200 240,230 210,240" className="fill-none stroke-foreground" strokeWidth={1} strokeDasharray="3 2" />
      <rect x={20} y={216} width={190} height={70} rx={4} {...fillS("n", 1.5)} />
      <P d="M30,276 L50,276 L50,268 L64,268 L64,262 L80,262 L80,252 L96,252 L96,246 L120,246 L120,238 L134,238 L134,232 L150,232 L150,226 L190,226" w={1.5} tone="acc" />
      {skC.art}
    </g>
  ),
  labels: skC.labels,
};

/* ---------- 3. Strange Situation room ---------- */
// Reference checked: a 9 by 9 foot room with the floor marked in 16 squares, toys at one end, chairs for mother and stranger
// at the other, observed through a one-way mirror; 8 episodes of about 3 minutes (Ainsworth and colleagues 1978, as
// summarised by Simply Psychology, Mary Ainsworth).
const ssC = callouts(
  [
    { id: "obs", name: "Observers", at: [140, 22], about: "Trained observers code the baby's exploring, distress, stranger anxiety and above all behaviour at reunion." },
    { id: "mirror", name: "One-way mirror", at: [100, 50], about: "The baby cannot see the observers. Every episode is also usually video recorded." },
    { id: "mom", name: "Mother's chair", at: [70, 82], about: "The parent sits here and responds only if the baby approaches, then leaves twice and returns twice." },
    { id: "str", name: "Stranger's chair", at: [210, 82], about: "A friendly unfamiliar woman enters in episode 3, stays with the baby when the mother leaves, and comforts if needed." },
    { id: "baby", name: "Baby (12 to 18 months)", at: [140, 150], about: "Placed in the middle. A secure baby explores, is upset at separation and is quickly comforted on reunion." },
    { id: "toys", name: "Toys", at: [140, 220], about: "Attractive toys invite exploration from the mother as a secure base." },
    { id: "door", name: "Door", at: [240, 180], about: "Mother and stranger come and go here. Reunion behaviour as the mother returns defines secure, avoidant, resistant and disorganised patterns." },
    { id: "grid", name: "Floor in 16 squares", at: [60, 200], about: "Lines on the floor let observers record how far and how much the baby explores." },
  ],
  262, 22, 34,
);
const strange: FigureDef = {
  id: "strange-situation-room",
  title: "The Strange Situation room",
  viewBox: "0 0 420 270",
  summary: "Plan of the Strange Situation playroom: a square floor in 16 squares with toys at one end, chairs for the mother and the stranger at the other, a door, and observers behind a one-way mirror.",
  art: (
    <g>
      <rect x={40} y={6} width={200} height={34} {...fillS("d", 1.2)} />
      {[110, 140, 170].map((x) => <circle key={x} cx={x} cy={22} r={7} {...fillS("n", 1)} />)}
      <rect x={40} y={50} width={200} height={200} {...fillS("n", 2)} />
      {[1, 2, 3].map((i) => (
        <g key={i}>
          <line x1={40 + i * 50} y1={50} x2={40 + i * 50} y2={250} className="stroke-muted-foreground" strokeWidth={0.8} strokeDasharray="3 3" />
          <line x1={40} y1={50 + i * 50} x2={240} y2={50 + i * 50} className="stroke-muted-foreground" strokeWidth={0.8} strokeDasharray="3 3" />
        </g>
      ))}
      <line x1={90} y1={50} x2={190} y2={50} className="stroke-chart-1" strokeWidth={5} />
      <rect x={58} y={70} width={24} height={24} rx={4} {...fillS("e", 1.2)} />
      <rect x={198} y={70} width={24} height={24} rx={4} {...fillS("c", 1.2)} />
      <circle cx={140} cy={150} r={10} {...fillS("b", 1.5)} />
      <circle cx={140} cy={140} r={5} {...fillS("b", 1)} />
      {[[118, 222, "c"], [134, 228, "e"], [150, 218, "b"], [164, 230, "a"]].map(([x, y, t], i) => <rect key={i} x={x as number} y={y as number} width={12} height={12} rx={2} {...fillS(t as keyof typeof FILL, 1)} />)}
      <line x1={240} y1={160} x2={240} y2={200} className="stroke-card" strokeWidth={4} />
      <path d="M240,160 A40,40 0 0 1 200,200" className="fill-none stroke-muted-foreground" strokeWidth={1} strokeDasharray="3 2" />
      <line x1={240} y1={160} x2={200} y2={160} className={INK} strokeWidth={2} />
      {ssC.art}
    </g>
  ),
  labels: ssC.labels,
};

/* ---------- 4. visual cliff ---------- */
// Reference checked: Gibson and Walk (1960): a sheet of strong glass over a checkerboard; on the shallow side the pattern lies
// just under the glass, on the deep side about 4 feet (1.2 m) below; the infant starts on a centre board and the mother calls
// from either side; 36 infants of 6 to 14 months, most would not cross the deep side (Wikipedia, visual cliff).
const vcA = callouts(
  [
    { id: "glass", name: "Glass top", at: [330, 80], about: "Strong glass covers the whole table, so the deep side is safe to touch. Some babies patted it and still refused." },
    { id: "shallow", name: "Shallow side", at: [80, 88], about: "The checkerboard lies just under the glass, so it looks like solid floor." },
    { id: "board", name: "Centre board", at: [210, 72], about: "The baby is placed on this raised plank between the two sides." },
  ],
  20, 262, 22,
);
const vcB = callouts(
  [
    { id: "deep", name: "Deep side (1.2 m drop)", at: [320, 224], about: "The same pattern sits far below, so it looks like a cliff. Texture gradient and motion parallax signal the drop." },
    { id: "infant", name: "Crawling infant", at: [204, 52], about: "Most of 36 infants aged 6 to 14 months crawled to the mother over the shallow side but would not cross the deep side." },
    { id: "mother", name: "Mother calling", at: [392, 40], about: "The mother calls from the deep end, then from the shallow end. Later studies found babies also check the mother's face (social referencing)." },
  ],
  230, 262, 22,
);
const cliff: FigureDef = {
  id: "visual-cliff",
  title: "The visual cliff",
  viewBox: "0 0 420 340",
  summary: "Side view of the visual cliff: a glass table with a checkerboard just under the glass on one side and far below on the other; a baby on the centre board will not crawl over the apparent drop.",
  art: (
    <g>
      <Checker x={20} y={82} w={170} h={10} n={17} m={1} />
      <Checker x={230} y={216} w={150} h={12} n={15} m={1} />
      <rect x={190} y={70} width={40} height={10} {...fillS("d", 1.2)} />
      <line x1={20} y1={80} x2={380} y2={80} className="stroke-chart-1" strokeWidth={3} />
      <line x1={230} y1={92} x2={230} y2={228} className={INK} strokeWidth={1.5} />
      <line x1={380} y1={80} x2={380} y2={228} className={INK} strokeWidth={1.5} />
      <line x1={20} y1={92} x2={20} y2={228} className={INK} strokeWidth={1.5} />
      <line x1={190} y1={92} x2={190} y2={228} className={INK} strokeWidth={1.5} />
      <line x1={10} y1={230} x2={410} y2={230} className={INK} strokeWidth={2} />
      <Arrow x1={300} y1={88} x2={300} y2={212} both size={5} w={1} tone="grey" />
      <T x={306} y={154} size={9} anchor="start" muted>1.2 m</T>
      <ellipse cx={212} cy={60} rx={16} ry={8} {...fillS("b", 1.2)} />
      <circle cx={228} cy={54} r={7} {...fillS("b", 1.2)} />
      <Person x={392} y={22} h={58} />
      {vcA.art}
      {vcB.art}
    </g>
  ),
  labels: [...vcA.labels, ...vcB.labels],
};

/* ---------- 5. Bobo doll ---------- */
// Reference checked: Bandura, Ross and Ross (1961): 72 children aged 3 to 6; a child played at a small table in one corner while
// an adult model in another corner hit a 5 foot inflatable Bobo doll with a mallet, kicked it and shouted; children were later
// mildly frustrated and observed through a one-way mirror (Simply Psychology, Bobo doll experiment).
const bbA = callouts(
  [
    { id: "child", name: "Child at the table", at: [90, 170], about: "The child played with stickers and prints in one corner and could watch the adult for about 10 minutes." },
    { id: "model", name: "Adult model", at: [350, 120], about: "In the aggressive condition the adult hit, kicked and threw the doll and said things like 'Pow!'. Other children saw a calm model or none." },
    { id: "mallet", name: "Mallet", at: [312, 82], about: "The mallet and specific phrases let the researchers spot exact copies of the model's acts." },
  ],
  20, 262, 22,
);
const bbB = callouts(
  [
    { id: "bobo", name: "Bobo doll", at: [276, 160], about: "A 5 foot inflatable clown with a weighted base: knock it down and it bounces back up." },
    { id: "copy", name: "Imitated aggression", at: [276, 236], about: "Children who saw the aggressive model copied the acts, boys more than girls, especially after a same-sex model: learning by observation without reward." },
    { id: "mirror", name: "One-way mirror", at: [14, 120], about: "In the test room, observers counted each child's acts for 20 minutes through a one-way mirror." },
  ],
  230, 262, 22,
);
const bobo: FigureDef = {
  id: "bobo-doll",
  title: "Bandura's Bobo doll study",
  viewBox: "0 0 420 340",
  summary: "A child at a small table watches an adult hit a large inflatable Bobo doll with a mallet; later, alone with the doll, the child copies the same acts.",
  art: (
    <g>
      <line x1={10} y1={244} x2={410} y2={244} className={INK} strokeWidth={2} />
      <rect x={10} y={80} width={8} height={100} className="fill-chart-1" opacity={0.5} />
      <rect x={50} y={196} width={90} height={7} {...fillS("d", 1.2)} />
      <line x1={60} y1={203} x2={60} y2={244} className={INK} strokeWidth={3} />
      <line x1={130} y1={203} x2={130} y2={244} className={INK} strokeWidth={3} />
      <Person x={90} y={140} h={70} tone="b" sit />
      <path d="M252,236 C240,236 236,224 240,212 L252,120 C254,96 296,96 298,120 L310,212 C314,224 310,236 298,236 Z" {...fillS("c", 2)} />
      <circle cx={275} cy={112} r={18} {...fillS("n", 1.5)} />
      <circle cx={269} cy={108} r={2} className="fill-foreground" />
      <circle cx={281} cy={108} r={2} className="fill-foreground" />
      <circle cx={275} cy={115} r={4} className="fill-chart-5" />
      <path d="M266,122 Q275,128 284,122" className="fill-none stroke-foreground" strokeWidth={1.5} />
      <ellipse cx={275} cy={234} rx={36} ry={8} {...fillS("d", 1.5)} />
      <Person x={352} y={92} h={150} tone="a" />
      <line x1={340} y1={130} x2={316} y2={92} className={INK} strokeWidth={5} strokeLinecap="round" />
      <rect x={300} y={74} width={26} height={14} rx={3} transform="rotate(-30 313 81)" {...fillS("d", 1.5)} />
      {[[180, 236], [196, 240], [188, 230]].map(([x, y], i) => <line key={i} x1={x} y1={y} x2={x + 14} y2={y - 6} className={INK} strokeWidth={2.5} strokeLinecap="round" />)}
      {bbA.art}
      {bbB.art}
    </g>
  ),
  labels: [...bbA.labels, ...bbB.labels],
};

/* ---------- 6. Milgram ---------- */
// Reference checked: teacher (real participant) at a shock generator with 30 switches from 15 to 450 volts in 15 volt steps,
// grouped from 'Slight Shock' to 'Danger: Severe Shock' and 'XXX'; experimenter in a grey lab coat in the same room;
// learner (a confederate) strapped into a chair in the next room with an electrode on the wrist and an answer box; 65 percent
// went to 450 volts (Milgram 1963; Wikipedia, Milgram experiment).
const GROUPS = ["Slight", "Moderate", "Strong", "Very strong", "Intense", "Extreme", "Danger", "XXX"];
const SWX = (i: number) => 30 + i * 12.4;
const milA = callouts(
  [
    { id: "teacher", name: "Teacher (real participant)", at: [110, 74], about: "The volunteer believed he was helping a study of punishment and learning, and gave a shock for every wrong answer." },
    { id: "exp", name: "Experimenter", at: [180, 108], about: "In a grey lab coat beside the teacher. When the teacher hesitated he used four set prods, ending with 'You have no other choice, you must go on'." },
    { id: "gen", name: "Shock generator", at: [120, 44], about: "A realistic but fake machine. The teacher was given a real 45 volt sample shock first, so it seemed genuine." },
  ],
  20, 152, 22,
);
const milB = callouts(
  [
    { id: "wall", name: "Wall: heard, not seen", at: [250, 90], about: "The learner was in the next room. At 300 volts he pounded on the wall; after 315 volts he fell silent." },
    { id: "learner", name: "Learner (actor)", at: [330, 74], about: "A friendly 47 year old accountant, an actor. Strapped into a chair with an electrode on his wrist, he received no real shocks." },
    { id: "box", name: "Answer box", at: [376, 40], about: "The learner pressed one of four switches to answer the word pair test; wrong answers were planned." },
  ],
  230, 152, 22,
);
const milC = callouts(
  [
    { id: "s15", name: "15 V: slight shock", at: [SWX(0) + 4, 284], about: "The first switch. Each wrong answer moved the teacher up one switch, 15 volts at a time." },
    { id: "s300", name: "300 V: intense", at: [SWX(19) + 4, 284], about: "Every one of the 40 men went at least to 300 volts." },
    { id: "s450", name: "450 V: XXX", at: [SWX(29) + 4, 284], about: "26 of 40 men (65 percent) went to the last switch, far more than experts had predicted." },
  ],
  20, 312, 0,
);
const milLabels = [...milA.labels, ...milB.labels, L("s15", milC.labels[0].name, 20, 312, milC.labels[0].about), L("s300", milC.labels[1].name, 156, 312, milC.labels[1].about), L("s450", milC.labels[2].name, 290, 312, milC.labels[2].about)];
const milgram: FigureDef = {
  id: "milgram-setup",
  title: "Milgram's obedience study: the set-up",
  viewBox: "0 0 420 330",
  summary: "Plan of Milgram's study: the teacher sits at a 30-switch shock generator with the experimenter beside him, and the learner is strapped into a chair in the next room; below, the generator's switches from 15 to 450 volts.",
  art: (
    <g>
      <rect x={20} y={14} width={230} height={120} {...fillS("n", 2)} />
      <rect x={250} y={14} width={150} height={120} {...fillS("d", 2)} />
      <line x1={250} y1={14} x2={250} y2={134} className={INK} strokeWidth={5} />
      <rect x={60} y={34} width={120} height={20} rx={3} {...fillS("a", 1.5)} />
      <circle cx={110} cy={74} r={13} {...fillS("b", 1.5)} />
      <circle cx={180} cy={108} r={13} {...fillS("e", 1.5)} />
      <rect x={300} y={52} width={60} height={50} rx={6} {...fillS("c", 1.5)} />
      <circle cx={330} cy={74} r={13} {...fillS("b", 1.5)} />
      <rect x={366} y={30} width={20} height={20} rx={3} {...fillS("n", 1.2)} />
      <T x={210} y={28} size={8} muted>room 1</T>
      <T x={276} y={28} size={8} muted>room 2</T>
      <rect x={20} y={230} width={384} height={60} rx={4} {...fillS("a", 1.5)} />
      {Array.from({ length: 30 }, (_, i) => <rect key={i} x={SWX(i)} y={262} width={8} height={18} rx={1.5} {...fillS(i >= 28 ? "c" : "n", 1)} />)}
      {GROUPS.map((g, k) => <T key={g} x={SWX(k * 4) + (k === 7 ? 10 : 22)} y={250} size={7.5}>{g}</T>)}
      {Array.from({ length: 30 }, (_, i) => (i % 4 === 0 || i === 29 ? <T key={i} x={SWX(i) + 4} y={259} size={6} muted>{(i + 1) * 15}</T> : null))}
      <T x={212} y={224} size={8} muted>the shock generator panel (volts)</T>
      {milA.art}
      {milB.art}
      {milC.art}
    </g>
  ),
  labels: milLabels,
};

/* ---------- 7. Asch line cards ---------- */
// Reference checked: Asch (1951): one card with a standard line and one with three comparison lines A, B, C, one of which
// clearly matched; 7 confederates and 1 real participant, who answered last or next to last; 18 trials, 12 critical; about
// a third of answers on critical trials conformed and 75 percent conformed at least once (Wikipedia; Simply Psychology).
const aschC = callouts(
  [
    { id: "std", name: "Standard line", at: [53, 100], about: "The line to be matched, shown on its own card." },
    { id: "cmp", name: "Comparison lines", at: [130, 110], about: "Three lines labelled A, B and C. One clearly matched: alone, people erred less than 1 percent of the time." },
    { id: "right", name: "The correct match", at: [226, 100], about: "Here C matches. On 12 of 18 trials the confederates all chose the same wrong line." },
    { id: "conf", name: "Confederates", at: [58, 226], about: "Seven actors gave their answers aloud first, unanimously wrong on critical trials." },
    { id: "part", name: "Real participant", at: [198, 226], about: "Seated near the end so he heard most answers first. About a third of his answers went with the group, and 75 percent conformed at least once." },
    { id: "ally", name: "One ally breaks it", at: [218, 226], about: "In a later variation, a single partner who gave the right answer cut conformity to about a quarter of its level." },
  ],
  262, 40, 36,
);
const asch: FigureDef = {
  id: "asch-cards",
  title: "Asch's line judgement task",
  viewBox: "0 0 420 260",
  summary: "Asch's two cards, a standard line and three comparison lines, and the seating: seven confederates answer first and the real participant near the end.",
  art: (
    <g>
      <rect x={16} y={24} width={74} height={150} rx={4} {...fillS("n", 1.5)} />
      <line x1={53} y1={60} x2={53} y2={150} className={INK} strokeWidth={4} />
      <rect x={104} y={24} width={140} height={150} rx={4} {...fillS("n", 1.5)} />
      <line x1={130} y1={80} x2={130} y2={150} className={INK} strokeWidth={4} />
      <line x1={176} y1={36} x2={176} y2={150} className={INK} strokeWidth={4} />
      <line x1={222} y1={60} x2={222} y2={150} className={INK} strokeWidth={4} />
      {["A", "B", "C"].map((t, i) => <T key={t} x={130 + i * 46} y={166} size={11} bold>{t}</T>)}
      <path d="M20,206 Q130,186 240,206" className="fill-none stroke-muted-foreground" strokeWidth={1} />
      {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={30 + i * 28} cy={226} r={9} {...fillS(i === 6 ? "c" : "d", 1.3)} />)}
      <T x={130} y={252} size={8} muted>answer order: left to right</T>
      {aschC.art}
    </g>
  ),
  labels: aschC.labels,
};

/* ---------- 8. Müller-Lyer ---------- */
// Reference checked: two equal shafts, one ending in outward pointing arrowheads and one in inward fins; the fins-out version
// looks longer; explanations include misapplied size constancy from carpentered corners (OpenStax Psychology 2e, 5.6).
const mlC = callouts(
  [
    { id: "short", name: "Arrowheads: shorter", at: [130, 60], about: "With arrowheads pointing outwards the line looks shorter, like the near outside corner of a building." },
    { id: "long", name: "Fins: longer", at: [130, 150], about: "With fins pointing outwards the line looks longer, like the far inside corner of a room, so the brain scales it up." },
    { id: "same", name: "Same length", at: [210, 105], about: "The dashed guides show both shafts are equal. Knowing this does not make the illusion go away." },
    { id: "culture", name: "Carpentered world", at: [50, 180], about: "People raised among straight walls and corners tend to see the illusion more strongly than people from rounded, open environments." },
  ],
  262, 50, 44,
);
const mullerLyer: FigureDef = {
  id: "muller-lyer",
  title: "The Müller-Lyer illusion",
  viewBox: "0 0 420 220",
  summary: "Two lines of the same length: the one with outward fins looks longer than the one with arrowheads.",
  art: (
    <g>
      <line x1={50} y1={60} x2={210} y2={60} className={INK} strokeWidth={3} />
      <P d="M70,40 L50,60 L70,80 M190,40 L210,60 L190,80" w={3} />
      <line x1={50} y1={150} x2={210} y2={150} className={INK} strokeWidth={3} />
      <P d="M30,130 L50,150 L30,170 M230,130 L210,150 L230,170" w={3} />
      <Line x1={50} y1={30} x2={50} y2={190} tone="grey" dash w={1} />
      <Line x1={210} y1={30} x2={210} y2={190} tone="grey" dash w={1} />
      {mlC.art}
    </g>
  ),
  labels: mlC.labels,
};

/* ---------- 9. Ponzo ---------- */
// Reference checked: two identical horizontal bars between converging lines like railway tracks; the upper bar looks longer
// because linear perspective makes it seem farther away (OpenStax Psychology 2e, 5.6).
const pzC = callouts(
  [
    { id: "rails", name: "Converging lines", at: [96, 90], about: "Lines that meet in the distance are a strong depth cue: linear perspective." },
    { id: "far", name: "Upper bar: looks longer", at: [160, 70], about: "Because it seems farther away, the brain scales it up, so it looks longer." },
    { id: "near", name: "Lower bar: looks shorter", at: [160, 190], about: "It seems nearer, so it is not scaled up. Both bars are exactly the same length." },
    { id: "sleepers", name: "Sleepers get closer", at: [176, 140], about: "Texture gradient: evenly spaced objects look packed closer together with distance, adding to the depth." },
  ],
  262, 50, 44,
);
const ponzo: FigureDef = {
  id: "ponzo",
  title: "The Ponzo illusion",
  viewBox: "0 0 420 240",
  summary: "Two equal bars placed between converging railway lines: the upper bar looks longer because it seems farther away.",
  art: (
    <g>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const y = 220 - i * 24 + i * i * 0.9;
        const half = 80 - i * 8.2;
        return <line key={i} x1={130 - half - 8} y1={y} x2={130 + half + 8} y2={y} className="stroke-muted-foreground" strokeWidth={2} />;
      })}
      <line x1={40} y1={230} x2={116} y2={14} className={INK} strokeWidth={3} />
      <line x1={220} y1={230} x2={144} y2={14} className={INK} strokeWidth={3} />
      <rect x={100} y={64} width={60} height={10} className="fill-chart-5" />
      <rect x={100} y={184} width={60} height={10} className="fill-chart-5" />
      {pzC.art}
    </g>
  ),
  labels: pzC.labels,
};

/* ---------- 10. Ames room ---------- */
// Reference checked: the Ames room is trapezoidal; its far left corner is about twice as far from the peephole as its far right
// corner, but walls, windows and floor are shaped so that from the peephole it looks rectangular; a person in the far corner
// looks tiny and one in the near corner looks huge (Wikipedia, Ames room).
const amC = callouts(
  [
    { id: "real", name: "Real back wall", at: [100, 74], about: "The back wall slants away: the left corner is about twice as far from the viewer as the right corner." },
    { id: "seen", name: "Wall as it looks", at: [180, 110], about: "Through the peephole the room looks like an ordinary rectangle, so both people seem to stand the same distance away." },
    { id: "far", name: "Person far away", at: [52, 52], about: "Truly farther away, so a smaller image on the eye. Since the room looks normal, the brain concludes this person is tiny." },
    { id: "near", name: "Person close by", at: [212, 138], about: "Nearer the viewer, so a larger image: this person looks like a giant. Swap them and they seem to shrink and grow." },
    { id: "peep", name: "Peephole, one eye", at: [130, 266], about: "Viewing with one eye from a fixed point removes binocular and motion cues that would reveal the real shape." },
    { id: "view", name: "What the viewer sees", at: [100, 330], about: "The familiar shape of a room beats our knowledge that people do not change size: a failure of size constancy." },
  ],
  262, 40, 50,
);
const ames: FigureDef = {
  id: "ames-room",
  title: "The Ames room from above, and through the peephole",
  viewBox: "0 0 420 380",
  summary: "Seen from above, the Ames room is a trapezoid with one back corner much farther away; through the peephole it looks rectangular, so a person in the far corner looks tiny and one in the near corner huge.",
  art: (
    <g>
      <path d="M40,40 L220,140 L220,240 L40,240 Z" {...fillS("a", 2)} />
      <line x1={40} y1={110} x2={220} y2={110} className="stroke-chart-5" strokeWidth={1.5} strokeDasharray="5 4" />
      <circle cx={52} cy={52} r={9} {...fillS("b", 1.5)} />
      <circle cx={212} cy={138} r={9} {...fillS("b", 1.5)} />
      <circle cx={130} cy={266} r={5} className="fill-foreground" />
      <line x1={130} y1={266} x2={52} y2={52} className="stroke-muted-foreground" strokeWidth={0.8} strokeDasharray="3 3" />
      <line x1={130} y1={266} x2={212} y2={138} className="stroke-muted-foreground" strokeWidth={0.8} strokeDasharray="3 3" />
      <T x={130} y={234} size={8} muted>front wall</T>
      <rect x={20} y={292} width={220} height={80} rx={4} {...fillS("n", 1.5)} />
      <rect x={50} y={300} width={160} height={50} {...fillS("a", 1)} />
      <path d="M20,372 L50,350 L210,350 L240,372" className="fill-none stroke-foreground" strokeWidth={1} />
      <rect x={70} y={330} width={12} height={20} rx={4} {...fillS("b", 1)} />
      <rect x={170} y={300} width={22} height={50} rx={6} {...fillS("b", 1)} />
      {amC.art}
    </g>
  ),
  labels: amC.labels,
};

/* ---------- 11. Harlow's surrogate mothers ---------- */
// Reference checked: Harlow (1958): infant rhesus monkeys with a bare wire mesh surrogate holding a feeding bottle and a
// terry cloth covered surrogate warmed by a light bulb; infants spent most of the day clinging to the cloth mother even when fed
// only by the wire one, and ran to it when frightened (OpenStax Psychology 2e, 9.2; Simply Psychology, Harlow).
const hwC = callouts(
  [
    { id: "wire", name: "Wire mother", at: [64, 170], about: "A bare wire mesh cylinder with a wooden head. For some infants it held the only bottle." },
    { id: "bottle", name: "Feeding bottle", at: [104, 150], about: "Food alone did not make the infants attached: they left the wire mother as soon as they had fed." },
    { id: "cloth", name: "Cloth mother", at: [186, 200], about: "Covered in soft terry cloth over foam and warmed by a bulb. Infants clung to her for most of the day: contact comfort, not food, drives attachment." },
    { id: "infant", name: "Infant monkey", at: [226, 166], about: "When frightened by a noisy toy, infants ran to the cloth mother, then used her as a secure base to explore." },
    { id: "head", name: "Face and head", at: [190, 76], about: "Both had simple faces. Infants raised alone with surrogates still grew up with serious social and parenting problems." },
  ],
  262, 40, 44,
);
const harlow: FigureDef = {
  id: "harlow-mothers",
  title: "Harlow's wire and cloth mothers",
  viewBox: "0 0 420 270",
  summary: "An infant monkey clings to a soft cloth surrogate mother rather than a bare wire one that holds the feeding bottle.",
  art: (
    <g>
      <line x1={10} y1={250} x2={250} y2={250} className={INK} strokeWidth={2} />
      <rect x={40} y={100} width={50} height={150} rx={6} className={`fill-none ${INK}`} strokeWidth={1.5} />
      {[0, 1, 2, 3, 4].map((i) => <line key={`v${i}`} x1={48 + i * 9} y1={100} x2={48 + i * 9} y2={250} className={INK} strokeWidth={0.8} />)}
      {Array.from({ length: 14 }, (_, i) => <line key={`h${i}`} x1={40} y1={110 + i * 10} x2={90} y2={110 + i * 10} className={INK} strokeWidth={0.8} />)}
      <rect x={45} y={64} width={40} height={36} rx={14} {...fillS("d", 1.5)} />
      <circle cx={57} cy={80} r={4} className="fill-foreground" /><circle cx={73} cy={80} r={4} className="fill-foreground" />
      <rect x={90} y={144} width={22} height={12} rx={3} {...fillS("n", 1.2)} />
      <path d="M112,147 L120,150 L112,153" {...fillS("c", 1)} />
      <path d="M160,250 L160,120 C160,100 216,100 216,120 L216,250 Z" {...fillS("b", 2)} />
      {Array.from({ length: 18 }, (_, i) => <circle key={i} cx={168 + (i % 4) * 14} cy={130 + Math.floor(i / 4) * 24} r={2} className="fill-muted-foreground" />)}
      <circle cx={188} cy={82} r={22} {...fillS("b", 1.5)} />
      <circle cx={180} cy={78} r={4} className="fill-foreground" /><circle cx={196} cy={78} r={4} className="fill-foreground" />
      <path d="M182,92 Q188,96 194,92" className="fill-none stroke-foreground" strokeWidth={1.5} />
      <circle cx={232} cy={140} r={10} className="fill-chart-2" opacity={0.6} />
      <ellipse cx={222} cy={176} rx={14} ry={22} {...fillS("d", 1.5)} />
      <circle cx={226} cy={150} r={10} {...fillS("d", 1.5)} />
      <path d="M212,168 C204,166 202,160 206,156 M214,190 C204,194 204,200 210,202" className="fill-none stroke-foreground" strokeWidth={3} strokeLinecap="round" />
      {hwC.art}
    </g>
  ),
  labels: hwC.labels,
};

/* ---------- 12. Little Albert ---------- */
// Reference checked: Watson and Rayner (1920): at 9 months Albert showed no fear of a white rat, rabbit, dog, masks or cotton
// wool; at 11 months the rat was paired with a loud noise made by striking a steel bar with a hammer behind his head; fear
// generalised to a rabbit, a dog, a fur coat and a Santa Claus mask (OpenStax Psychology 2e, 6.2; Simply Psychology).
const laA = callouts(
  [
    { id: "albert", name: "Albert, 11 months", at: [110, 150], about: "A calm baby who at 9 months showed no fear of furry animals or masks." },
    { id: "rat", name: "White rat (CS)", at: [176, 196], about: "Neutral at first: Albert reached for it. After pairings it became the conditioned stimulus." },
    { id: "bar", name: "Steel bar and hammer (UCS)", at: [58, 70], about: "Struck behind Albert's head each time he touched the rat: a loud noise that made him startle and cry without learning." },
  ],
  20, 262, 22,
);
const laB = callouts(
  [
    { id: "fear", name: "Fear: UCR then CR", at: [124, 128], about: "After 7 pairings Albert cried and crawled away at the sight of the rat alone: a conditioned emotional response." },
    { id: "gen", name: "Generalised fear", at: [300, 210], about: "Days later he also feared a rabbit, a dog, a fur coat, cotton wool and a Santa Claus mask: stimulus generalisation." },
    { id: "ethics", name: "Never undone", at: [356, 70], about: "Albert left before his fear could be extinguished. Today the study is a lesson in research ethics as much as in conditioning." },
  ],
  230, 262, 22,
);
const albert: FigureDef = {
  id: "little-albert",
  title: "The Little Albert study",
  viewBox: "0 0 420 340",
  summary: "Baby Albert sits on a mattress with a white rat in front of him while, behind him, an experimenter strikes a steel bar with a hammer; later Albert fears the rat and similar furry things.",
  art: (
    <g>
      <rect x={30} y={210} width={200} height={12} rx={4} {...fillS("d", 1.5)} />
      <line x1={40} y1={222} x2={40} y2={250} className={INK} strokeWidth={3} />
      <line x1={220} y1={222} x2={220} y2={250} className={INK} strokeWidth={3} />
      <ellipse cx={112} cy={188} rx={26} ry={22} {...fillS("b", 1.5)} />
      <circle cx={114} cy={150} r={18} {...fillS("b", 1.5)} />
      <path d="M118,156 Q124,162 128,156" className="fill-none stroke-foreground" strokeWidth={1.5} />
      <ellipse cx={178} cy={202} rx={14} ry={7} {...fillS("n", 1.2)} />
      <circle cx={192} cy={198} r={4} {...fillS("n", 1)} />
      <path d="M164,204 C150,210 146,198 138,206" className="fill-none stroke-foreground" strokeWidth={1} />
      <Person x={40} y={60} h={150} tone="a" />
      <rect x={56} y={60} width={6} height={60} {...fillS("d", 1.2)} />
      <line x1={66} y1={110} x2={76} y2={78} className={INK} strokeWidth={3} />
      <rect x={70} y={70} width={14} height={8} {...fillS("d", 1.2)} />
      <P d="M80,92 q6,-6 12,0 M84,100 q8,-8 16,0" tone="red" w={1.5} />
      <ellipse cx={278} cy={200} rx={14} ry={9} {...fillS("n", 1.2)} />
      <ellipse cx={272} cy={186} rx={3} ry={9} {...fillS("n", 1)} />
      <ellipse cx={280} cy={185} rx={3} ry={9} {...fillS("n", 1)} />
      <path d="M306,184 L332,184 L340,214 L298,214 Z" {...fillS("d", 1.2)} />
      <circle cx={370} cy={196} r={14} {...fillS("n", 1.2)} />
      <path d="M358,200 Q370,226 382,200" {...fillS("n", 1)} />
      <path d="M358,190 L370,170 L382,190" {...fillS("c", 1)} />
      <line x1={250} y1={174} x2={250} y2={222} className="stroke-muted-foreground" strokeDasharray="3 3" />
      <T x={330} y={236} size={8} muted>days later</T>
      {laA.art}
      {laB.art}
    </g>
  ),
  labels: [...laA.labels, ...laB.labels],
};

/* ---------- 13. Kanizsa triangle ---------- */
// Reference checked: Kanizsa (1955): three black discs with wedges cut out and three angles arranged so that a bright white
// triangle with sharp edges is seen where no edges are drawn (OpenStax Psychology 2e, 5.6 Gestalt principles).
const KC = { x: 130, y: 128 };
const KR = 82;
const pac = (a: number) => {
  const t = ((a - 90) * Math.PI) / 180;
  const cx = KC.x + KR * Math.cos(t);
  const cy = KC.y + KR * Math.sin(t);
  const towards = Math.atan2(KC.y - cy, KC.x - cx);
  const r = 24;
  const p1 = [cx + r * Math.cos(towards - Math.PI / 6), cy + r * Math.sin(towards - Math.PI / 6)];
  const p2 = [cx + r * Math.cos(towards + Math.PI / 6), cy + r * Math.sin(towards + Math.PI / 6)];
  return `M${cx.toFixed(1)},${cy.toFixed(1)} L${p1[0].toFixed(1)},${p1[1].toFixed(1)} A${r},${r} 0 1 0 ${p2[0].toFixed(1)},${p2[1].toFixed(1)} Z`;
};
const vee = (a: number) => {
  const t = ((a - 90) * Math.PI) / 180;
  const cx = KC.x + KR * 0.95 * Math.cos(t);
  const cy = KC.y + KR * 0.95 * Math.sin(t);
  const t1 = t + Math.PI + Math.PI / 6;
  const t2 = t + Math.PI - Math.PI / 6;
  return `M${(cx + 34 * Math.cos(t1)).toFixed(1)},${(cy + 34 * Math.sin(t1)).toFixed(1)} L${cx.toFixed(1)},${cy.toFixed(1)} L${(cx + 34 * Math.cos(t2)).toFixed(1)},${(cy + 34 * Math.sin(t2)).toFixed(1)}`;
};
const kzC = callouts(
  [
    { id: "pac", name: "Discs with a wedge cut", at: [KC.x, KC.y - KR - 18], about: "Three black discs, each with a slice missing, point their gaps inwards." },
    { id: "angles", name: "Three angles", at: [KC.x - KR * 0.95 + 4, KC.y + 52], about: "Three open corners suggest an outlined triangle partly hidden behind the white one." },
    { id: "illusory", name: "Illusory triangle", at: [KC.x, KC.y + 8], about: "We see a bright white triangle with sharp edges lying on top, though none of its edges is drawn: illusory contours." },
    { id: "closure", name: "Closure", at: [KC.x + 40, KC.y - 24], about: "The Gestalt principle of closure: the brain fills gaps to see a complete, simple shape. The missing edges even activate early visual cortex." },
  ],
  262, 50, 44,
);
const kanizsa: FigureDef = {
  id: "kanizsa-triangle",
  title: "The Kanizsa triangle",
  viewBox: "0 0 420 250",
  summary: "Three cut discs and three angles make us see a bright white triangle whose edges are not actually drawn.",
  art: (
    <g>
      {[0, 120, 240].map((a) => <path key={a} d={pac(a)} className="fill-foreground" />)}
      {[60, 180, 300].map((a) => <path key={a} d={vee(a)} className="fill-none stroke-foreground" strokeWidth={3} />)}
      {kzC.art}
    </g>
  ),
  labels: kzC.labels,
};

/* ---------- 14. Stroop card ---------- */
// Reference checked: Stroop (1935): naming the ink colour of colour words printed in a conflicting ink is slower than naming
// colour patches or matching words; reading is automatic and interferes (OpenStax Psychology 2e, 7.1).
// Fixed hues are part of the task itself; each is mid-toned so it reads on both light and dark cards.
const HUE = { red: "#e03131", blue: "#4c6ef5", green: "#2f9e44", purple: "#ae3ec9" };
type Hue = keyof typeof HUE;
const CONG: [string, Hue][] = [["RED", "red"], ["BLUE", "blue"], ["GREEN", "green"], ["PURPLE", "purple"], ["BLUE", "blue"]];
const INC: [string, Hue][] = [["RED", "blue"], ["BLUE", "green"], ["GREEN", "purple"], ["PURPLE", "red"], ["BLUE", "red"]];
const stroop: FigureDef = {
  id: "stroop-card",
  title: "The Stroop task",
  viewBox: "0 0 420 250",
  summary: "Two Stroop cards: on one each colour word is printed in its own colour, on the other in a different colour; naming the ink is much slower on the second.",
  art: (
    <g>
      {[CONG, INC].map((card, c) => (
        <g key={c}>
          <rect x={16 + c * 120} y={40} width={110} height={180} rx={6} {...fillS("n", 1.5)} />
          {card.map(([w, h], i) => (
            <text key={i} x={71 + c * 120} y={76 + i * 32} textAnchor="middle" fontSize={17} fontWeight={800} style={{ fill: HUE[h] }}>
              {w}
            </text>
          ))}
        </g>
      ))}
      <T x={71} y={236} size={9} muted>card 1</T>
      <T x={191} y={236} size={9} muted>card 2</T>
    </g>
  ),
  labels: [
    L("cong", "Matching card", 22, 22, "Each word is printed in the colour it names. Naming the ink colour is quick and easy."),
    L("inc", "Clashing card", 142, 22, "Each word names a different colour from its ink. Say the ink colour aloud: blue, green, purple, red, red."),
    L("auto", "Reading is automatic", 262, 80, "Skilled readers cannot help reading the word, and the word's meaning competes with the colour name."),
    L("int", "Interference", 262, 124, "The clash slows people down and causes errors: the Stroop effect, a measure of selective attention."),
    L("acc", "Frontal control", 262, 168, "The anterior cingulate and prefrontal cortex resolve the conflict. Slowing is greater in ADHD, frontal injury and dementia, so the test is used in neuropsychology."),
  ],
};

/* ---------- 15. three mountains task ---------- */
// Reference checked: Piaget and Inhelder (1956): a model of three mountains, one with snow, one with a hut, one with a red
// cross on top; the child sits on one side and a doll is placed at other positions; under about 7, children pick their own view
// (egocentrism) (Simply Psychology, Piaget's three mountains task).
const tmC = callouts(
  [
    { id: "snow", name: "Mountain with snow", at: [100, 64], about: "The largest mountain at the back, with a snow cap." },
    { id: "hut", name: "Mountain with a hut", at: [168, 108], about: "A middle mountain with a little house on top." },
    { id: "cross", name: "Mountain with a cross", at: [72, 120], about: "The smallest, with a red cross on top. Each landmark looks different from each side." },
    { id: "child", name: "Child's seat", at: [130, 224], about: "The child looks at the model from here and then picks, from pictures, what the doll would see." },
    { id: "doll", name: "Doll's position", at: [234, 150], about: "Moved round the table. Children under about 7 tend to pick their own view, not the doll's: egocentrism in the preoperational stage." },
  ],
  262, 50, 40,
);
const mountains: FigureDef = {
  id: "three-mountains",
  title: "Piaget's three mountains task",
  viewBox: "0 0 420 250",
  summary: "A table model of three mountains, with snow, a hut and a red cross; the child sits at one side and must say what a doll at another side would see.",
  art: (
    <g>
      <path d="M20,200 L80,150 L250,150 L190,200 Z" {...fillS("d", 1.5)} />
      <path d="M60,170 L104,56 L152,170 Z" {...fillS("a", 1.5)} />
      <path d="M92,82 L104,56 L116,82 Q104,90 92,82 Z" className="fill-card stroke-foreground" strokeWidth={1} />
      <path d="M130,182 L168,112 L208,182 Z" {...fillS("b", 1.5)} />
      <rect x={160} y={100} width={16} height={12} {...fillS("n", 1)} />
      <path d="M158,100 L168,92 L178,100 Z" {...fillS("c", 1)} />
      <path d="M44,190 L72,128 L104,190 Z" {...fillS("e", 1.5)} />
      <path d="M72,114 L72,128 M66,119 L78,119" className="stroke-chart-5" strokeWidth={3} />
      <circle cx={130} cy={224} r={10} {...fillS("b", 1.5)} />
      <Person x={234} y={128} h={36} tone="c" />
      {tmC.art}
    </g>
  ),
  labels: tmC.labels,
};

/* ---------- 16. conservation of liquid ---------- */
// Reference checked: Piaget's conservation of liquid: two identical glasses with equal water; one poured into a tall thin glass;
// the preoperational child says the tall glass has more (centration); the concrete operational child conserves using
// reversibility, identity and compensation (OpenStax Psychology 2e, 9.2).
const cvC = callouts(
  [
    { id: "same", name: "Two equal glasses", at: [60, 168], about: "The child agrees both short glasses hold the same amount of water." },
    { id: "pour", name: "Poured while watching", at: [190, 70], about: "One glass is poured into a tall thin glass in front of the child." },
    { id: "tall", name: "Tall glass: more?", at: [222, 100], about: "A child of about 4 or 5 says the tall glass has more, centring on height alone: centration." },
    { id: "rev", name: "Reversibility", at: [140, 120], about: "A child of about 7 or more knows you could pour it back, so it must be the same: a concrete operation." },
    { id: "comp", name: "Compensation", at: [222, 200], about: "The older child also sees that taller is matched by thinner. Conservation of number comes first, then mass, then volume." },
  ],
  262, 40, 42,
);
const conservation: FigureDef = {
  id: "conservation-liquid",
  title: "Conservation of liquid",
  viewBox: "0 0 420 240",
  summary: "Two identical glasses hold the same water; one is poured into a tall thin glass, and young children wrongly say it now holds more.",
  art: (
    <g>
      {[30, 110].map((x, i) => (
        <g key={x}>
          <rect x={x} y={150} width={60} height={50} className="fill-chart-1" opacity={0.35} />
          <path d={`M${x},110 L${x},200 L${x + 60},200 L${x + 60},110`} className="fill-none stroke-foreground" strokeWidth={2} />
          <T x={x + 30} y={218} size={9} muted>{i ? "B" : "A"}</T>
        </g>
      ))}
      <rect x={208} y={100} width={30} height={100} className="fill-chart-1" opacity={0.35} />
      <path d="M208,40 L208,200 L238,200 L238,40" className="fill-none stroke-foreground" strokeWidth={2} />
      <T x={223} y={218} size={9} muted>C</T>
      <Arrow x1={150} y1={100} x2={204} y2={60} cx={176} cy={50} />
      <Line x1={20} y1={150} x2={248} y2={150} tone="grey" dash w={1} />
      <Line x1={200} y1={100} x2={248} y2={100} tone="grey" dash w={1} />
      {cvC.art}
    </g>
  ),
  labels: cvC.labels,
};

export const STUDIES: FigureDef[] = [pavlov, skinner, strange, cliff, bobo, milgram, asch, mullerLyer, ponzo, ames, harlow, albert, kanizsa, stroop, mountains, conservation];
