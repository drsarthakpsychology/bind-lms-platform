/**
 * The website's scene widgets, rebuilt natively (the web versions live in
 * src/components/study/animations*.tsx, visuals.tsx and scenes/). Same data
 * shapes, same teaching steps, hand-drawn with the sketch kit. The web's 3D
 * scenes become 2D step-throughs here: the content and the order of ideas
 * are kept, the 3D camera is not.
 */
import * as React from "react";
import { View } from "react-native";
import Animated, { Easing, useAnimatedProps, useReducedMotion, useSharedValue, withTiming } from "react-native-reanimated";
import { Circle } from "react-native-svg";

import type {
  ActionPotentialData,
  AmesRoomData,
  AttentionData,
  BrainSlicerData,
  ConditioningData,
  ConservationData,
  DissonanceData,
  GenogramData,
  HpaLoopData,
  HypnogramData,
  IllusionData,
  JourneyData,
  MemoryFlowData,
  NervousSystemData,
  NeuronData,
  PathwaysData,
  ReceptorData,
  ReleaseData,
  StrangeData,
  StressData,
  Synapse3dData,
} from "@/api/contract";
import { Button } from "@/ds/button";
import { Chips } from "@/ds/parts";
import { Slider } from "@/ds/slider";
import { T } from "@/ds/text";
import { haptic } from "@/lib/haptics";
import { Arrow, C, Cv, E, L, Label, P, R, SketchSheet, plain } from "@/sketch/ink";
import { space, useTheme } from "@/theme";
import { JourneyArt } from "@/sketch/journey-art";
import { ReceptorArt, SIGNAL, type LigandId } from "@/sketch/receptor-art";
import { ChoiceScene, StepPicker, StepScene, StepText, type SceneDef, type Variant } from "./engine";
import { WidgetFrame } from "./frame";

const n = (id: string, label: string, x: number, y: number, extra: { w?: number; h?: number; round?: boolean } = {}) => ({ id, label, x, y, ...extra });

/* ---------------------------------------------------------------- journey */

type Route = NonNullable<JourneyData["route"]>;
const ROUTE_NAME: Record<Route, string> = { oral: "Tablet", iv: "Into a vein", nasal: "Nasal spray", depot: "Depot injection" };
const JOURNEY_NODES = {
  mouth: n("mouth", "Swallowed", 70, 30),
  nose: n("nose", "Nasal spray", 70, 30),
  vein: n("vein", "Into a vein", 70, 30),
  muscle: n("muscle", "Muscle injection", 70, 30),
  gut: n("gut", "Gut", 70, 100),
  slow: n("slow", "Slow release", 70, 100),
  liver: n("liver", "Liver (first pass)", 70, 170),
  blood: n("blood", "Bloodstream", 230, 170),
  bbb: n("bbb", "Blood-brain barrier", 230, 100),
  target: n("target", "Brain target", 230, 30, { round: true }),
  out: n("out", "Leaves the body", 160, 236),
};
const ROUTE_STEPS: Record<Route, { id: keyof typeof JOURNEY_NODES; name: string; text: string }[]> = {
  oral: [
    { id: "mouth", name: "Swallowed", text: "The tablet is swallowed. Nothing works yet: the medicine first has to reach the blood." },
    { id: "gut", name: "Gut", text: "The tablet dissolves and the medicine is absorbed through the wall of the small intestine. Food, gut speed and the tablet's coating change how fast this happens." },
    { id: "liver", name: "Liver (first pass)", text: "Blood from the gut goes to the liver first. Liver enzymes (the CYP family) break some of the medicine down before it ever reaches the body. This 'first-pass' loss is why oral doses are often higher than injected ones." },
    { id: "blood", name: "Bloodstream", text: "What survives travels in the blood. Much of it sticks to blood proteins; only the free part can leave the blood and act." },
    { id: "bbb", name: "Blood-brain barrier", text: "Brain blood vessels are tightly sealed. Only small, fat-soluble molecules (or ones carried by special transporters) get through. Medicines for the mind are designed to cross this barrier." },
    { id: "target", name: "Brain target", text: "" },
    { id: "out", name: "Leaves the body", text: "The liver changes the medicine into forms the kidneys can remove in urine. How fast this happens sets the half-life, and so how often a dose is needed." },
  ],
  iv: [
    { id: "vein", name: "Into a vein", text: "Given straight into a vein: no absorption step and no first-pass loss, so 100% reaches the blood at once." },
    { id: "blood", name: "Bloodstream", text: "It spreads round the body within a minute or two. Free (unbound) medicine can leave the blood and act." },
    { id: "bbb", name: "Blood-brain barrier", text: "Fat-soluble molecules cross quickly, which is why some IV medicines act within minutes." },
    { id: "target", name: "Brain target", text: "" },
    { id: "out", name: "Leaves the body", text: "Liver and kidneys clear it. The effect can be fast to start and fast to fade." },
  ],
  nasal: [
    { id: "nose", name: "Nasal spray", text: "Sprayed into the nose, the medicine is absorbed through the thin, blood-rich lining, skipping the gut and much of the liver's first pass." },
    { id: "blood", name: "Bloodstream", text: "It reaches the blood within minutes, so effects start quickly. This is why patients are observed for a while after a dose of nasal esketamine." },
    { id: "bbb", name: "Blood-brain barrier", text: "Small fat-soluble molecules cross into the brain quickly." },
    { id: "target", name: "Brain target", text: "" },
    { id: "out", name: "Leaves the body", text: "Cleared by the liver and kidneys." },
  ],
  depot: [
    { id: "muscle", name: "Muscle injection", text: "A long-acting ('depot') injection sits in the muscle as a reservoir." },
    { id: "slow", name: "Slow release", text: "The medicine seeps out of the muscle slowly, keeping levels steady for weeks without daily tablets. Useful when remembering tablets is hard." },
    { id: "blood", name: "Bloodstream", text: "Steady, low-variation levels in the blood." },
    { id: "bbb", name: "Blood-brain barrier", text: "It crosses into the brain like the tablet form does." },
    { id: "target", name: "Brain target", text: "" },
    { id: "out", name: "Leaves the body", text: "Because release is slow, the effect also fades slowly after the last injection." },
  ],
};

export function journeyVariant(d: JourneyData, route: Route): Variant {
  const stages = ROUTE_STEPS[route];
  const ids = stages.map((s) => s.id);
  const links: [string, string][] = [];
  for (let i = 0; i < ids.length - 1; i++) if (ids[i] !== "target") links.push([ids[i]!, ids[i + 1]!]);
  if (ids.includes("target")) links.push(["blood", "out"]);
  return {
    id: route,
    name: ROUTE_NAME[route],
    def: {
      w: 320,
      h: 266,
      nodes: ids.map((id) => JOURNEY_NODES[id]),
      links: links.filter(([a, b]) => !(a === "target" && b === "out")),
      steps: stages.map((s, i) => ({
        id: s.id,
        name: s.name,
        on: [s.id],
        flow: i ? [[ids[i - 1]!, s.id] as [string, string]] : [],
        text: d.notes?.[s.id] ?? (s.id === "target" ? `At last it reaches its target: ${d.target}. There it acts on receptors, and this is where the effect (and many side effects) begins.` : s.text),
      })),
    },
  };
}

/** The website's journey: the body drawing with the pill at its stop, the stages to step through. */
export function JourneyWidget({ d }: { d: JourneyData }) {
  const routes = (d.routes?.length ? d.routes : [d.route ?? "oral"]) as Route[];
  const [route, setRoute] = React.useState<Route>(d.route && routes.includes(d.route) ? d.route : routes[0]!);
  const [i, setI] = React.useState(0);
  const v = journeyVariant(d, route);
  const stagesList = v.def.steps;
  const cur = stagesList[Math.min(i, stagesList.length - 1)]!;
  return (
    <WidgetFrame label="A medicine's journey" title={d.title ?? `${d.drug} through the body`} caption={d.caption} testID="w-journey">
      {routes.length > 1 ? (
        <Chips
          label="Route"
          options={routes.map((r) => ({ id: r, name: ROUTE_NAME[r] }))}
          value={route}
          onChange={(r) => {
            setRoute(r as Route);
            setI(0);
          }}
        />
      ) : null}
      <JourneyArt stops={stagesList.map((s) => s.id)} i={i} route={route} label={`${d.drug}: ${cur.name}`} />
      <StepPicker steps={stagesList} i={Math.min(i, stagesList.length - 1)} onPick={setI} />
      <StepText text={cur.text} k={`${route}-${cur.id}`} />
    </WidgetFrame>
  );
}

/* ----------------------------------------------------------------- neuron */

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function Spark({ t: tv, from, to, color }: { t: { value: number }; from: number; to: number; color: string }) {
  const props = useAnimatedProps(() => ({ cx: from + (to - from) * tv.value, opacity: tv.value > 0 && tv.value < 1 ? 1 : 0.0001 }));
  return <AnimatedCircle cy={88} r={7} fill={color} stroke="#111111" strokeWidth={1.6} animatedProps={props} />;
}

export function NeuronWidget({ d }: { d: NeuronData }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const [myelin, setMyelin] = React.useState(d.myelinated ?? true);
  const [strength, setStrength] = React.useState(70);
  const [shot, setShot] = React.useState(0);
  const tv = useSharedValue(0);
  const fires = strength >= 50;
  const fire = () => {
    haptic.select();
    setShot((s) => s + 1);
    if (!fires) return;
    tv.set(0);
    tv.set(withTiming(1, { duration: reduce ? 0 : myelin ? 700 : 2200, easing: Easing.linear }));
  };
  const text =
    shot === 0
      ? "Set the strength, then fire."
      : fires
        ? `Threshold reached, so it is all or none: sodium rushes in (the spike up), then potassium flows out (the fall and a brief dip below resting). ${myelin ? "With myelin the signal leaps from gap to gap, many times faster." : "Without myelin it travels slowly; this is part of what goes wrong in multiple sclerosis."} At the end, the terminal releases its messengers.`
        : "Below threshold: a small blip that fades. No action potential, and nothing is released. A neuron never fires 'a little'; it fires fully or not at all.";
  return (
    <WidgetFrame label="How a neuron fires" title={d.title} caption={d.caption} testID="w-neuron">
      <SketchSheet name={`neuron-${myelin}`} w={380} h={150} label={fires ? "The signal travels down the axon" : "Too weak: no signal"}>
        <P k="n-dend" d="M60 74 L30 48 M30 48 L14 52 M30 48 L26 30 M56 104 L24 118 M24 118 L12 112 M24 118 L22 134 M52 66 L48 38" sw={1.8} single />
        <E k="n-soma" cx={70} cy={88} w={52} h={46} sw={2.2} fill={C.wash} fillStyle="solid" />
        <E k="n-nuc" cx={68} cy={88} w={16} h={14} sw={1.4} fill={C.blue} gap={3} />
        <L k="n-axon" x1={94} y1={88} x2={318} y2={88} sw={2.4} />
        {myelin ? [116, 160, 204, 248, 292].map((x) => <R key={x} k={`n-my${x}`} x={x} y={79} w={30} h={18} sw={1.6} fill={C.paper} fillStyle="solid" />) : null}
        <P k="n-term" d="M318 88 L344 68 M318 88 L350 88 M318 88 L344 110" sw={1.8} single />
        {[66, 88, 112].map((y) => <E key={y} k={`n-bout${y}`} cx={y === 88 ? 354 : 348} cy={y} w={11} h={11} sw={1.4} fill={C.lime} fillStyle="solid" />)}
        <Spark t={tv} from={100} to={340} color={c.sk.lime} />
        <Label x={10} y={20} size={14} bold={false}>
          {myelin ? "myelin: the signal jumps from gap to gap" : "no myelin: the signal creeps along"}
        </Label>
      </SketchSheet>
      <View style={{ gap: space[1] }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <T v="small">Stimulus strength</T>
          <T v="small" tone="muted">
            {fires ? "above threshold" : "below threshold"}
          </T>
        </View>
        <Slider value={strength} min={0} max={100} onChange={setStrength} label="Stimulus strength" format={(v) => (v >= 50 ? "above threshold" : "below threshold")} />
      </View>
      <View style={{ flexDirection: "row", gap: space[3] }}>
        <Button kind="quiet" full={false} label="Fire" onPress={fire} testID="neuron-fire" style={{ flex: 1 }} />
        <Button kind="quiet" full={false} label={myelin ? "Myelin on" : "Myelin off"} onPress={() => setMyelin((m) => !m)} style={{ flex: 1 }} />
      </View>
      <StepText text={text} k={`${shot}-${fires}-${myelin}`} />
    </WidgetFrame>
  );
}

/* --------------------------------------------------------------- pathways */

const DA_PATHS = [
  { id: "mesolimbic", name: "Mesolimbic", from: [196, 132], to: [150, 104], role: "reward and motivation; overactive in psychosis (hallucinations, delusions)", blocked: "Positive symptoms ease. This is the effect you want.", rescued: "Still blocked enough: positive symptoms stay controlled.", partial: "Where dopamine is too high, the partial agonist takes its place and gives a smaller signal: positive symptoms ease." },
  { id: "mesocortical", name: "Mesocortical", from: [196, 132], to: [76, 62], role: "thinking, planning and drive; underactive in negative and cognitive symptoms", blocked: "Can worsen apathy, flat mood and slowed thinking.", rescued: "One explanation: serotonin 2A block lets a little more dopamine through here, so negative symptoms worsen less.", partial: "Where dopamine is low, the partial agonist keeps some signal going, so negative symptoms are less likely to worsen." },
  { id: "nigrostriatal", name: "Nigrostriatal", from: [206, 128], to: [160, 78], role: "movement control", blocked: "Movement side effects: stiffness, tremor, restlessness (akathisia), and later tardive dyskinesia.", rescued: "Less blocked in practice: fewer movement side effects.", partial: "Partly switched on rather than blocked: stiffness is uncommon, but restlessness (akathisia) is common." },
  { id: "tuberoinfundibular", name: "Tuberoinfundibular", from: [168, 124], to: [166, 152], role: "dopamine here keeps prolactin low", blocked: "Prolactin rises: breast changes, missed periods, sexual problems.", rescued: "Prolactin rise is usually smaller (with exceptions such as risperidone).", partial: "Enough signal stays to keep prolactin low; prolactin often falls." },
] as const;

export function PathwaysWidget({ d }: { d: PathwaysData }) {
  const [pick, setPick] = React.useState<string>(DA_PATHS[0].id);
  const [block, setBlock] = React.useState<"none" | "d2" | "d2-2a" | "partial">(d.start ?? "none");
  const sel = DA_PATHS.find((p) => p.id === pick)!;
  const text = `**${sel.name}:** ${sel.role}. ${block === "none" ? "Dopamine flows normally." : block === "d2" ? sel.blocked : block === "partial" ? sel.partial : sel.rescued}`;
  return (
    <WidgetFrame label="Dopamine pathways" title={d.title ?? "The four dopamine pathways"} caption={d.caption} testID="w-pathways">
      <SketchSheet name="pathways" w={320} h={200} label={`Brain cut down the middle, front to the left, with the four dopamine pathways; ${sel.name} picked`}>
        <P k="pw-brain" d="M40 110 C30 50 110 14 190 22 C262 28 300 74 290 118 C282 150 250 160 220 150 C206 172 200 186 196 196 M220 150 C150 166 70 160 40 110 Z" fill={C.wash} fillStyle="solid" sw={2} />
        {DA_PATHS.map((p) => {
          const on = p.id === pick;
          const weak = block !== "none" && block !== "partial" && !(block === "d2-2a" && p.id !== "mesolimbic");
          return <Arrow key={p.id} k={`pw-${p.id}-${block === "partial" ? "p" : "n"}`} from={p.from as unknown as [number, number]} to={p.to as unknown as [number, number]} bend={0.15} stroke={on ? C.blue : C.soft} sw={on ? 3 : 1.8} dash={weak ? "5 5" : block === "partial" ? "9 4" : undefined} />;
        })}
        <E k="pw-vta" cx={198} cy={134} w={14} h={12} fill={C.lime} fillStyle="solid" sw={1.4} />
        <Label x={210} y={170} size={12} bold={false} color={C.soft}>
          midbrain
        </Label>
        <Label x={40} y={40} size={12} bold={false} color={C.soft}>
          front
        </Label>
      </SketchSheet>
      <Chips label="Pathway" options={DA_PATHS.map((p) => ({ id: p.id, name: p.name }))} value={pick} onChange={setPick} />
      <Chips
        label="Medicine"
        options={[
          { id: "none", name: "No medicine" },
          { id: "d2", name: "D2 blocker" },
          { id: "d2-2a", name: "D2 + serotonin 2A block" },
          ...(d.start === "partial" ? [{ id: "partial", name: "D2 partly switched on" }] : []),
        ]}
        value={block}
        onChange={(v) => setBlock(v as typeof block)}
      />
      <StepText text={text} k={`${pick}-${block}`} />
    </WidgetFrame>
  );
}

/* --------------------------------------------------------------- receptor */

const LIGANDS = [
  { id: "none", name: "Nothing bound", signal: 0.15, text: "Many receptors give a small background signal on their own (constitutive activity)." },
  { id: "full", name: "Full agonist", signal: 1, text: "Fits and switches the receptor fully on: maximum signal. The body's own neurotransmitter usually acts like this." },
  { id: "partial", name: "Partial agonist", signal: 0.5, text: "Fits but only half-switches the receptor on. When the natural messenger is low it raises the signal; when it is high it competes and lowers it. Aripiprazole works this way at dopamine D2 receptors." },
  { id: "antagonist", name: "Antagonist", signal: 0.15, text: "Sits in the slot without switching anything on, and blocks the natural messenger from getting in. The signal stays at background." },
  { id: "inverse", name: "Inverse agonist", signal: 0, text: "Binds and pushes the receptor below its background level: the signal falls under baseline. Some antihistamines and pimavanserin act like this." },
];

export function ReceptorWidget({ d }: { d: ReceptorData }) {
  const receptor = d.receptor ?? "receptor";
  return (
    <ChoiceScene
      name="receptor"
      label="At the receptor"
      title={d.title ?? `What binds to the ${receptor}?`}
      caption={d.caption}
      options={LIGANDS}
      art={(id) => <ReceptorArt id={id as LigandId} receptor={receptor} label={`${LIGANDS.find((x) => x.id === id)!.name} at the ${receptor}: signal ${Math.round(SIGNAL[id as LigandId] * 100)}%`} />}
    />
  );
}

/* ----------------------------------------------------------- conditioning */

const CLASSICAL = [
  { id: "before", name: "Before learning", on: ["food", "salivate"], flow: [["food", "salivate"]], text: "Food (an unconditioned stimulus) makes the dog salivate on its own. The bell means nothing yet: the dog just looks at it." },
  { id: "pair1", name: "Pairing", on: ["bell", "food"], flow: [["bell", "food"]], text: "The bell rings, and right after it the food arrives. Bell, then food. Bell, then food. The brain starts to link them." },
  { id: "pair2", name: "More pairings", on: ["bell", "food", "salivate"], flow: [["bell", "food"], ["food", "salivate"]], text: "After several pairings, salivation begins a little earlier each time, starting when the bell rings rather than when the food arrives." },
  { id: "after", name: "After learning", on: ["bell", "salivate"], flow: [["bell", "salivate"]], text: "Now the bell alone brings salivation. The bell has become a conditioned stimulus, and the salivation to it is a conditioned response." },
  { id: "extinction", name: "Extinction", on: ["bell"], flow: [], text: "Ring the bell many times with no food, and the response fades. It is not erased: it is held back by new learning, which is why it can return later (spontaneous recovery)." },
];
const OPERANT = [
  { id: "explore", name: "Trying things", on: ["rat"], flow: [], text: "The rat moves around the box, sniffing and pressing things by accident. Nothing happens yet." },
  { id: "press", name: "A lucky press", on: ["lever", "pellet"], flow: [["lever", "pellet"]], text: "It presses the lever and a food pellet drops. Something good followed the action." },
  { id: "repeat", name: "Pressing more", on: ["rat", "lever", "pellet"], flow: [["rat", "lever"], ["lever", "pellet"], ["pellet", "rat"]], text: "Presses that are followed by food become more frequent. This is positive reinforcement: adding something pleasant strengthens the behaviour." },
  { id: "schedule", name: "Not every time", on: ["lever"], flow: [["rat", "lever"]], text: "Food now arrives only after some presses, at unpredictable moments (a variable ratio). The rat presses faster and harder than before. This is the slot-machine pattern." },
  { id: "extinct", name: "Food stops", on: ["rat", "lever"], flow: [["rat", "lever"]], text: "No more food. Pressing bursts briefly (an extinction burst), then slowly fades. Behaviour learned on an unpredictable schedule fades the slowest." },
];
type RawStep = { id: string; name: string; on: string[]; flow: string[][]; text: string };
const steps = (s: RawStep[]) => s.map((x) => ({ ...x, flow: x.flow as [string, string][] }));

export function ConditioningWidget({ d }: { d: ConditioningData }) {
  const classical: SceneDef = { w: 320, h: 200, nodes: [n("bell", "Bell", 70, 50), n("food", "Food", 250, 50), n("salivate", "Salivation", 160, 160, { round: true, w: 130 })], links: [["bell", "food"], ["food", "salivate"], ["bell", "salivate"]], steps: steps(CLASSICAL) };
  const operant: SceneDef = { w: 320, h: 200, nodes: [n("rat", "The rat", 70, 100, { round: true }), n("lever", "Lever press", 240, 46), n("pellet", "Food pellet", 240, 156)], links: [["rat", "lever"], ["lever", "pellet"], ["pellet", "rat"]], steps: steps(OPERANT) };
  const variants: Variant[] = [
    { id: "classical", name: "Classical (Pavlov)", def: classical },
    { id: "operant", name: "Operant (Skinner)", def: operant },
  ];
  return <StepScene name="conditioning" label="Conditioning" title={d.title ?? (d.kind === "operant" ? "Learning from consequences" : "Learning by association")} caption={d.caption} variants={variants} start={d.kind} />;
}

/* ------------------------------------------------------------- memoryflow */

export function MemoryFlowWidget({ d }: { d: MemoryFlowData }) {
  const def: SceneDef = {
    w: 320,
    h: 190,
    nodes: [n("sensory", "Sensory register", 56, 70, { w: 96 }), n("working", "Working memory", 160, 70, { w: 96 }), n("long", "Long-term memory", 264, 70, { w: 96 }), n("lost", "Fades away", 108, 160, { w: 92 })],
    links: [["sensory", "working"], ["working", "long"], ["sensory", "lost"]],
    steps: steps([
      { id: "input", name: "Something happens", on: ["sensory"], flow: [], text: "A phone number is said aloud. Everything you sense enters the sensory register for a moment: a fraction of a second for sights, a few seconds for sounds." },
      { id: "attend", name: "Attention", on: ["working"], flow: [["sensory", "working"]], text: "You attend to it, so it moves into short-term (working) memory. Anything you did not attend to simply fades from the sensory register." },
      { id: "hold", name: "Holding it", on: ["working"], flow: [], text: "Working memory keeps about four chunks for around 15 to 30 seconds unless you keep repeating it. Say the number in your head and it stays; get distracted and it goes." },
      { id: "encode", name: "Making it stick", on: ["long"], flow: [["working", "long"]], text: "Repeating alone is weak. Linking it to meaning (a date you know, a pattern) encodes it into long-term memory, which has no known limit." },
      { id: "retrieve", name: "Recalling later", on: ["working", "long"], flow: [], text: "Tomorrow you bring it back from long-term memory into working memory to dial it. Each recall strengthens the trace, which is why testing yourself beats rereading." },
    ]),
  };
  return <StepScene name="memoryflow" label="How memory works" title={d.title ?? "From noticing to remembering"} caption={d.caption} variants={[{ id: "m", name: "Memory", def }]} />;
}

/* ----------------------------------------------------------------- stress */

const STRESS_NODES = [n("amygdala", "Amygdala", 70, 34), n("hypo", "Hypothalamus", 160, 90), n("symp", "Sympathetic nerves", 60, 150, { w: 100 }), n("adrenaline", "Adrenaline", 60, 220), n("pit", "Pituitary (ACTH)", 250, 150, { w: 100 }), n("cortisol", "Adrenal cortex: cortisol", 250, 220, { w: 110 }), n("hippo", "Hippocampus", 250, 34)];
const STRESS_LINKS: [string, string][] = [["amygdala", "hypo"], ["hypo", "symp"], ["symp", "adrenaline"], ["hypo", "pit"], ["pit", "cortisol"], ["cortisol", "hippo"], ["hippo", "hypo"]];

export function StressWidget({ d }: { d: StressData }) {
  const def: SceneDef = {
    w: 320,
    h: 254,
    nodes: STRESS_NODES,
    links: STRESS_LINKS,
    steps: steps([
      { id: "threat", name: "A threat appears", on: ["amygdala"], flow: [], text: "You see a snake, or a difficult exam paper. The amygdala tags it as a threat within a fraction of a second, before you have consciously thought about it." },
      { id: "fast", name: "The fast route", on: ["hypo", "symp", "adrenaline"], flow: [["amygdala", "hypo"], ["hypo", "symp"], ["symp", "adrenaline"]], text: "The amygdala signals the hypothalamus, which fires the sympathetic nervous system. The adrenal glands release adrenaline: heart races, breathing quickens, pupils widen, digestion pauses. All within seconds." },
      { id: "slow", name: "The slow route", on: ["hypo", "pit", "cortisol"], flow: [["hypo", "pit"], ["pit", "cortisol"]], text: "The hypothalamus also releases CRH. This tells the pituitary to release ACTH into the blood, which tells the adrenal cortex to release cortisol. This takes minutes, and cortisol keeps energy high for longer." },
      { id: "feedback", name: "Switching off", on: ["cortisol", "hippo", "hypo"], flow: [["cortisol", "hippo"], ["hippo", "hypo"]], text: "Cortisol feeds back to the hippocampus and hypothalamus, which lower CRH. The system brakes itself. The threat passes, and the parasympathetic system restores calm." },
      { id: "chronic", name: "When it never switches off", on: ["cortisol", "hippo"], flow: [["pit", "cortisol"]], text: "Under lasting stress the brake wears out. Cortisol stays high, the hippocampus can shrink, sleep and immunity suffer, and the stage is set for depression and anxiety. This is the link between life stress and biology." },
    ]),
  };
  return <StepScene name="stress" label="The stress response" title={d.title ?? "What stress does in the body"} caption={d.caption} variants={[{ id: "s", name: "Stress", def }]} />;
}

/* ---------------------------------------------------------------- hpaloop */

export function HpaLoopWidget({ d }: { d: HpaLoopData }) {
  const nodes = [n("hypo", "Hypothalamus (CRH)", 160, 36, { w: 120 }), n("pit", "Pituitary (ACTH)", 266, 130, { w: 100 }), n("adrenal", "Adrenal cortex (cortisol)", 160, 220, { w: 120 }), n("hippo", "Hippocampus", 54, 130, { w: 96 })];
  const links: [string, string][] = [["hypo", "pit"], ["pit", "adrenal"], ["adrenal", "hippo"], ["hippo", "hypo"]];
  const day: SceneDef = {
    w: 320,
    h: 254,
    nodes,
    links,
    steps: steps([
      { id: "wake", name: "Waking up", on: ["hypo", "pit", "adrenal"], flow: [["hypo", "pit"], ["pit", "adrenal"]], text: "Cortisol rises sharply in the first half hour after waking (the cortisol awakening response). It helps you get going: blood sugar up, alertness up." },
      { id: "brake", name: "The brake", on: ["adrenal", "hippo", "hypo"], flow: [["adrenal", "hippo"], ["hippo", "hypo"]], text: "Cortisol is sensed by the hippocampus and the hypothalamus, which turn CRH down. A healthy loop brakes itself." },
      { id: "evening", name: "Through the day", on: ["adrenal"], flow: [], text: "Levels fall through the day and are lowest around midnight, which lets sleep come. A short stress gives a short rise, then the brake brings it back." },
    ]),
  };
  const chronic: SceneDef = {
    w: 320,
    h: 254,
    nodes,
    links,
    steps: steps([
      { id: "push", name: "Stress keeps pushing", on: ["hypo", "pit"], flow: [["hypo", "pit"], ["pit", "adrenal"]], text: "Weeks of stress keep CRH and ACTH up, so cortisol stays high for most of the day instead of falling." },
      { id: "worn", name: "The brake wears out", on: ["hippo"], flow: [], text: "Long exposure to cortisol makes the hippocampus less sensitive to it (and can shrink it), so the feedback brake weakens. High cortisol then keeps itself going." },
      { id: "flat", name: "A flat curve", on: ["adrenal"], flow: [], text: "The daily rhythm flattens: a weak morning peak and high evening levels. Poor sleep, low mood, weight gain around the middle and lower immunity follow. This pattern is common in depression." },
    ]),
  };
  return (
    <StepScene
      name="hpaloop"
      label="The stress loop"
      title={d.title ?? "The HPA axis"}
      caption={d.caption}
      variants={[
        { id: "day", name: "A normal day", def: day },
        { id: "chronic", name: "Lasting stress", def: chronic },
      ]}
      start={d.start}
    />
  );
}

/* -------------------------------------------------------------- attention */

const ATT: { id: string; name: string; text: string; through: string }[] = [
  { id: "early", name: "Early filter (Broadbent)", through: "filter", text: "Broadbent's early filter: a filter picks one ear by physical features (which ear, which voice) before any meaning is worked out. The other message is blocked. You notice that a voice was there, and whether it was high or low, loud or soft, but not a single word." },
  { id: "attenuate", name: "Turned down (Treisman)", through: "meaning", text: "Treisman's attenuation: the other ear is turned down, not switched off, like a volume knob. The weak message still reaches your store of words, but most words are too faint to notice. Words that matter a lot to you (your name, 'fire', 'help') and words that fit what you expect next need very little signal, so they still get through." },
  { id: "late", name: "Late selection (Deutsch and Deutsch)", through: "aware", text: "Deutsch and Deutsch's late selection: both messages are fully understood, without you being aware of it. The choice happens late, just before awareness and response: only the message that matters most right now reaches you. The cost is a lot of processing for messages you never use." },
];

export function AttentionWidget({ d }: { d: AttentionData }) {
  const nodes = [n("left", "Left ear (attended)", 70, 36, { w: 110 }), n("right", "Right ear (other)", 250, 36, { w: 110 }), n("filter", "Filter", 160, 104), n("meaning", "Meaning", 160, 168), n("aware", "Awareness", 160, 232, { round: true })];
  const variants: Variant[] = ATT.map((a) => ({
    id: a.id,
    name: a.name.split(" (")[0]!,
    def: {
      w: 320,
      h: 264,
      nodes,
      links: [["left", "filter"], ["right", "filter"], ["filter", "meaning"], ["meaning", "aware"]],
      steps: [
        { id: "both", name: "Two messages", on: ["left", "right"], flow: [], text: "Two voices at once, one in each ear. You are told to follow the left ear and repeat it aloud (shadowing)." },
        { id: "where", name: "Where the choice happens", on: [a.through], flow: a.through === "filter" ? [["left", "filter"]] : [["left", "filter"], ["right", "filter"], ["filter", "meaning"]], text: a.text },
      ],
    },
  }));
  return <StepScene name="attention" label="Attention" title={d.title ?? "Where does attention choose?"} caption={d.caption} variants={variants} />;
}

/* ------------------------------------------------------------- dissonance */

export function DissonanceWidget({ d }: { d: DissonanceData }) {
  const belief = d.belief ? plain(d.belief) : "Smoking harms my health";
  const behaviour = d.behaviour ? plain(d.behaviour) : "I smoke every day";
  const def: SceneDef = {
    w: 320,
    h: 236,
    nodes: [n("belief", belief, 80, 40, { w: 130 }), n("act", behaviour, 240, 40, { w: 130 }), n("tension", "Discomfort (dissonance)", 160, 120, { round: true, w: 140 }), n("change", "Change the behaviour", 56, 204, { w: 96 }), n("belief2", "Change the belief", 160, 204, { w: 96 }), n("add", "Add excuses", 264, 204, { w: 96 })],
    links: [["belief", "tension"], ["act", "tension"], ["tension", "change"], ["tension", "belief2"], ["tension", "add"]],
    steps: steps([
      { id: "clash", name: "Two things that clash", on: ["belief", "act"], flow: [], text: `A person holds a belief ("${belief}") and acts against it ("${behaviour}"). On their own, each is fine. Together they clash.` },
      { id: "discomfort", name: "It feels bad", on: ["tension"], flow: [["belief", "tension"], ["act", "tension"]], text: "Festinger called the clash cognitive dissonance: an unpleasant tension, a bit like hunger, that pushes us to make it stop. The bigger the clash and the more it matters to us, the stronger the push." },
      { id: "act", name: "Way out 1: change what you do", on: ["change"], flow: [["tension", "change"]], text: "The most honest way out, and the hardest: change the behaviour so it fits the belief (stop smoking)." },
      { id: "belief", name: "Way out 2: change what you believe", on: ["belief2"], flow: [["tension", "belief2"]], text: "Easier: soften the belief so it fits the behaviour (\"the risks are exaggerated\")." },
      { id: "add", name: "Way out 3: add reasons", on: ["add"], flow: [["tension", "add"]], text: "Or add new thoughts that make the clash feel smaller (\"it helps my stress\", \"my grandfather smoked and lived to 90\"). In the clinic, noticing these moves helps you work with ambivalence instead of arguing." },
    ]),
  };
  return <StepScene name="dissonance" label="Cognitive dissonance" title={d.title} caption={d.caption} variants={[{ id: "d", name: "Dissonance", def }]} />;
}

/* ----------------------------------------------------------- conservation */

function ConservationArt({ liquid, after }: { liquid: boolean; after: boolean }) {
  const coins = (y: number, gap: number, k: string) => Array.from({ length: 6 }, (_, i) => <E key={`${k}${i}`} k={`${k}${i}`} cx={60 + i * gap} cy={y} w={18} h={18} fill={C.lime} fillStyle="solid" sw={1.4} />);
  return (
    <SketchSheet name={`conservation-${liquid}-${after}`} w={320} h={170} label={liquid ? (after ? "One glass poured into a tall thin glass" : "Two same glasses of water") : after ? "One row of coins spread out" : "Two rows of six coins lined up"}>
      {liquid ? (
        <>
          <R k="cv-g1" x={60} y={70} w={70} h={80} sw={1.8} />
          <R k="cv-w1" x={62} y={110} w={66} h={38} fill={C.blue} fillStyle="hachure" sw={1} />
          {after ? (
            <>
              <R k="cv-g3" x={210} y={20} w={34} h={130} sw={1.8} />
              <R k="cv-w3" x={212} y={70} w={30} h={78} fill={C.blue} fillStyle="hachure" sw={1} />
            </>
          ) : (
            <>
              <R k="cv-g2" x={190} y={70} w={70} h={80} sw={1.8} />
              <R k="cv-w2" x={192} y={110} w={66} h={38} fill={C.blue} fillStyle="hachure" sw={1} />
            </>
          )}
        </>
      ) : (
        <>
          {coins(50, 36, "cv-a")}
          {after ? Array.from({ length: 6 }, (_, i) => <E key={`cv-b${i}`} k={`cv-b${i}`} cx={22 + i * 55} cy={120} w={18} h={18} fill={C.lime} fillStyle="solid" sw={1.4} />) : coins(120, 36, "cv-b")}
        </>
      )}
    </SketchSheet>
  );
}

export function ConservationWidget({ d }: { d: ConservationData }) {
  const [kind, setKind] = React.useState<"liquid" | "number">(d.kind ?? "liquid");
  const [after, setAfter] = React.useState(false);
  const [stage, setStage] = React.useState<"pre" | "concrete">("pre");
  const liquid = kind === "liquid";
  const reasons =
    stage === "pre"
      ? ["**Centration:** the child fixes on one feature only (how high the water is, or how long the row is) and ignores the other (how wide, or how spread out).", "**Cannot reverse it:** the child cannot yet run the action backwards in their head, so they do not see that undoing it would give exactly what was there before.", "**Looks decide:** how it looks wins over how it is. Taller or longer looks like more, so to the child it is more."]
      : ["**Identity:** nothing was added and nothing was taken away, so it must be the same amount.", "**Reversibility:** undo the action (pour it back, or push the coins together) and it will look just as before.", liquid ? "**Compensation:** the water is taller, but it is also thinner. One change makes up for the other." : "**Compensation:** the row is longer, but the gaps between coins are bigger. One change makes up for the other."];
  const say = !after ? (liquid ? "Both short glasses hold the same amount. Ask: same, or different? Both children say the same." : "Two rows of 6 coins, lined up. Ask: same, or different? Both children say the same.") : stage === "pre" ? (liquid ? 'The younger child (preoperational, about 2 to 7 years) says: "The tall one has more, because it is higher."' : 'The younger child (preoperational, about 2 to 7 years) says: "This row has more, because it is longer."') : 'The older child (concrete operational, about 7 to 11 years) says: "They are the same."';
  return (
    <WidgetFrame label="Piaget's conservation task" title={d.title} caption={d.caption} testID="w-conservation">
      <Chips
        label="Task"
        options={[
          { id: "liquid", name: "Water" },
          { id: "number", name: "Coins" },
        ]}
        value={kind}
        onChange={(v) => {
          setKind(v as "liquid" | "number");
          setAfter(false);
        }}
      />
      <ConservationArt liquid={liquid} after={after} />
      <Button kind="quiet" label={after ? "Start again" : liquid ? "Pour one into the tall glass" : "Spread one row out"} onPress={() => setAfter((a) => !a)} testID="conservation-do" />
      {after ? (
        <Chips
          label="Child"
          options={[
            { id: "pre", name: "Younger child" },
            { id: "concrete", name: "Older child" },
          ]}
          value={stage}
          onChange={(v) => setStage(v as "pre" | "concrete")}
        />
      ) : null}
      <StepText text={say} k={`${kind}-${after}-${stage}`} />
      {after ? (
        <View style={{ gap: space[2] }}>
          {reasons.map((r, i) => (
            <StepText key={`${stage}-${i}`} text={r} k={`${stage}-${kind}-${i}`} />
          ))}
        </View>
      ) : null}
    </WidgetFrame>
  );
}

/* ---------------------------------------------------------------- release */

const RELEASE_STEPS = (tx: string) =>
  steps([
    { id: "signal", name: "Signal arrives", on: ["terminal"], flow: [], text: "An action potential reaches the end of the axon (the terminal)." },
    { id: "calcium", name: "Calcium enters", on: ["terminal", "vesicle"], flow: [], text: "The voltage change opens calcium channels. Calcium rushes in and tells the vesicles, little bags of messenger, to move to the membrane." },
    { id: "release", name: "Release", on: ["vesicle", "cleft"], flow: [["vesicle", "cleft"]], text: `The vesicles fuse with the membrane and empty ${tx} into the gap (the synaptic cleft).` },
    { id: "bind", name: "Binding", on: ["cleft", "receptor"], flow: [["cleft", "receptor"]], text: `${tx} drifts across the gap in under a millisecond and binds to receptors on the next cell, opening channels or starting signals inside it.` },
    { id: "clear", name: "Clearing up", on: ["cleft", "pump"], flow: [["cleft", "pump"]], text: "The messenger is pumped back into the first cell (reuptake) or broken down by enzymes, so the signal is short and crisp. Most psychiatric medicines act on one of these steps." },
  ]);
const RELEASE_DRUGS = [
  { id: "ssri", name: "SSRI (blocks reuptake)", text: "Blocks the serotonin pump. Serotonin stays in the gap longer and keeps binding." },
  { id: "maoi", name: "MAOI (blocks breakdown)", text: "Blocks monoamine oxidase, the enzyme that breaks the messenger down inside the terminal, so more is stored and released." },
  { id: "amph", name: "Amphetamine (pushes it out)", text: "Enters the terminal and pushes dopamine and noradrenaline out through the pumps, running them backwards." },
  { id: "botox", name: "Botulinum toxin (blocks release)", text: "Stops the vesicles fusing, so no acetylcholine is released at all: the muscle stays relaxed." },
  { id: "antag", name: "Receptor blocker (antagonist)", text: "Sits on the receptor without switching it on, so the messenger cannot bind. Antipsychotics block dopamine D2 receptors this way." },
];

function releaseDef(tx: string): SceneDef {
  return {
    w: 320,
    h: 230,
    nodes: [n("terminal", "Axon terminal", 160, 30, { w: 140 }), n("vesicle", "Vesicles", 90, 92), n("pump", "Reuptake pump", 240, 92), n("cleft", "Synaptic cleft", 160, 150, { round: true, w: 130 }), n("receptor", "Receptors", 160, 210, { w: 140 })],
    links: [["terminal", "vesicle"], ["vesicle", "cleft"], ["cleft", "receptor"], ["cleft", "pump"]],
    steps: RELEASE_STEPS(tx),
  };
}

export function ReleaseWidget({ d }: { d: ReleaseData }) {
  const tx = d.transmitter ?? "the neurotransmitter";
  return (
    <View style={{ gap: space[3] }}>
      <StepScene name="release" label="At the synapse" title={d.title ?? "How a messenger is released"} caption={d.caption} variants={[{ id: "r", name: "Release", def: releaseDef(tx) }]} />
      <ChoiceScene name="release-drugs" label="What medicines and toxins change" options={RELEASE_DRUGS} art={() => null} />
    </View>
  );
}

export function Synapse3dWidget({ d }: { d: Synapse3dData }) {
  return <StepScene name="synapse3d" label="Inside a synapse" title={d.title ?? "A synapse, step by step"} caption={d.caption} variants={[{ id: "s", name: "Synapse", def: releaseDef(d.transmitter ?? "the neurotransmitter") }]} />;
}

/* -------------------------------------------------------------- hypnogram */

const SLEEP: { stage: "W" | "REM" | "N1" | "N2" | "N3"; mins: number }[] = [
  { stage: "W", mins: 10 }, { stage: "N1", mins: 10 }, { stage: "N2", mins: 25 }, { stage: "N3", mins: 40 }, { stage: "N2", mins: 10 }, { stage: "REM", mins: 10 },
  { stage: "N2", mins: 25 }, { stage: "N3", mins: 30 }, { stage: "N2", mins: 15 }, { stage: "REM", mins: 20 },
  { stage: "N2", mins: 40 }, { stage: "N3", mins: 10 }, { stage: "N2", mins: 20 }, { stage: "REM", mins: 30 },
  { stage: "N2", mins: 45 }, { stage: "REM", mins: 40 }, { stage: "N1", mins: 10 }, { stage: "W", mins: 10 },
];
const STAGE_Y = { W: 20, REM: 46, N1: 72, N2: 98, N3: 124 } as const;
const STAGE_TEXT = {
  W: "Awake. Eyes open or just closed, fast mixed brain waves.",
  N1: "Stage N1: the doorway into sleep, a few minutes of drifting. Easy to wake; the sudden 'falling' jerk happens here.",
  N2: "Stage N2: light but real sleep, about half the night. Sleep spindles and K-complexes appear on the EEG; memories start to be filed.",
  N3: "Stage N3: deep, slow-wave sleep. Hardest to wake from; growth hormone is released and the body repairs. Most of it comes in the first half of the night. Sleepwalking and night terrors start here.",
  REM: "REM sleep: the brain is busy and vivid dreams happen, but the muscles are paralysed. REM periods get longer towards morning. Most antidepressants reduce REM; in depression REM comes early.",
} as const;

export function HypnogramWidget({ d }: { d: HypnogramData }) {
  const total = SLEEP.reduce((s, x) => s + x.mins, 0);
  const [at, setAt] = React.useState(60);
  const x = (m: number) => 40 + (m / total) * 270;
  let acc = 0;
  const pts: [number, number][] = [];
  SLEEP.forEach((s) => {
    pts.push([x(acc), STAGE_Y[s.stage]]);
    acc += s.mins;
    pts.push([x(acc), STAGE_Y[s.stage]]);
  });
  let cur: (typeof SLEEP)[number] = SLEEP[0]!;
  acc = 0;
  const minute = (at / 100) * total;
  for (const s of SLEEP) {
    if (minute >= acc) cur = s;
    acc += s.mins;
  }
  const hh = Math.floor(minute / 60);
  return (
    <WidgetFrame label="A night of sleep" title={d.title ?? "The stages of sleep through one night"} caption={d.caption} testID="w-hypnogram">
      <SketchSheet name="hypnogram" w={320} h={150} label={`A night's sleep stages. At ${hh} hours ${Math.round(minute % 60)} minutes: ${cur.stage}`}>
        {(Object.keys(STAGE_Y) as (keyof typeof STAGE_Y)[]).map((s) => (
          <Label key={s} x={4} y={STAGE_Y[s] + 4} size={12} bold={false} color={C.soft}>
            {s}
          </Label>
        ))}
        <P k="hy-line" d={pts.map(([px, py], i) => `${i ? "L" : "M"}${px} ${py}`).join(" ")} stroke={C.blue} sw={2} single rough={0.3} />
        <L k={`hy-now`} x1={x(minute)} y1={10} x2={x(minute)} y2={134} stroke={C.ink} sw={1.2} dash="4 4" single />
        <E k="hy-dot" cx={x(minute)} cy={STAGE_Y[cur.stage]} w={10} h={10} fill={C.lime} fillStyle="solid" sw={1.4} />
        <Label x={40} y={148} size={11} bold={false} color={C.soft}>
          bedtime
        </Label>
        <Label x={310} y={148} size={11} anchor="end" bold={false} color={C.soft}>
          morning
        </Label>
      </SketchSheet>
      <Slider value={at} min={0} max={100} onChange={setAt} label="Time of night" format={() => `${hh} h ${Math.round(minute % 60)} min after bedtime`} />
      <T v="small" tone="muted" num>
        {hh} h {Math.round(minute % 60)} min after bedtime
      </T>
      <StepText text={STAGE_TEXT[cur.stage]} k={cur.stage} />
    </WidgetFrame>
  );
}

/* ---------------------------------------------------------------- strange */

const STRANGE_STEPS = steps([
  { id: "together", name: "With caregiver", on: ["mother", "baby"], flow: [], text: "Mother and baby in an unfamiliar playroom. A secure baby uses her as a safe base: plays, explores, checks back." },
  { id: "stranger", name: "Stranger comes in", on: ["stranger", "baby"], flow: [["stranger", "baby"]], text: "A friendly stranger enters and talks with the mother, then approaches the baby. Watch the wariness of strangers (stranger anxiety)." },
  { id: "leaves", name: "Caregiver leaves", on: ["baby", "stranger"], flow: [], text: "The mother slips out. The baby is left with the stranger. Most babies protest: separation anxiety." },
  { id: "return", name: "Caregiver returns", on: ["mother", "baby"], flow: [["mother", "baby"]], text: "The reunion is the key moment. How the baby greets her and settles tells you the attachment pattern. Choose a pattern below to see it." },
]);
const ATTACH = [
  { id: "secure", name: "Secure", text: "Upset when she leaves, greets her warmly on return, is comforted quickly and goes back to play. Linked with a caregiver who notices and responds to the baby's signals warmly and reliably." },
  { id: "avoidant", name: "Avoidant", text: "Seems unbothered when she leaves and ignores or turns away on return. Inside, the heart rate shows stress. Linked with a caregiver who tends to discourage closeness or turn away when the baby is upset." },
  { id: "ambivalent", name: "Ambivalent (resistant)", text: "Very upset when she leaves; on return wants contact but also pushes away, angry and hard to settle. Linked with a caregiver who responds sometimes and not others, so the baby cannot rely on comfort." },
  { id: "disorganised", name: "Disorganised", text: "No clear strategy: freezes, approaches with the face turned away, rocks. Linked with a caregiver who is frightened or frightening, so the person who should comfort is also a source of fear." },
];

export function StrangeWidget({ d }: { d: StrangeData }) {
  const def: SceneDef = { w: 320, h: 170, nodes: [n("mother", "Caregiver", 70, 50, { round: true }), n("stranger", "Stranger", 250, 50, { round: true }), n("baby", "Baby", 160, 130, { round: true })], links: [["mother", "baby"], ["stranger", "baby"]], steps: STRANGE_STEPS };
  return (
    <View style={{ gap: space[3] }}>
      <StepScene name="strange" label="The Strange Situation" title={d.title ?? "Ainsworth's Strange Situation"} caption={d.caption} variants={[{ id: "s", name: "Episodes", def }]} />
      <ChoiceScene name="strange-types" label="Attachment patterns at reunion" options={ATTACH} art={() => null} />
    </View>
  );
}

/* --------------------------------------------------------------- illusion */

const ILLUSION_TEXT: Record<IllusionData["kind"], { name: string; see: string; truth: string }> = {
  "muller-lyer": { name: "Müller-Lyer", see: "The line with fins pointing out looks longer.", truth: "Both lines are exactly the same length. One idea: the brain reads the fins as corners of a room (far) or a building (near) and scales the line to make up for distance, even on flat paper." },
  ponzo: { name: "Ponzo", see: "The upper bar looks longer.", truth: "Both bars are the same. The converging lines look like rails going into the distance, so the brain treats the upper bar as further away and enlarges it." },
  ebbinghaus: { name: "Ebbinghaus", see: "The centre circle among small circles looks bigger.", truth: "Both centre circles are the same size. Size is judged against what is around it." },
  "figure-ground": { name: "Figure and ground", see: "A vase, or two faces?", truth: "The picture never changes; your brain decides which part is the object (figure) and which is the background (ground), and it can only hold one at a time." },
};

function IllusionArt({ kind, reveal }: { kind: IllusionData["kind"]; reveal: boolean }) {
  return (
    <SketchSheet name={`illusion-${kind}-${reveal}`} w={320} h={180} label={ILLUSION_TEXT[kind].see}>
      {kind === "muller-lyer" ? (
        <>
          <L k="ml1" x1={80} y1={60} x2={240} y2={60} sw={2.4} single />
          <P k="ml1f" d="M80 60 L64 44 M80 60 L64 76 M240 60 L256 44 M240 60 L256 76" sw={2} single />
          <L k="ml2" x1={80} y1={130} x2={240} y2={130} sw={2.4} single />
          <P k="ml2f" d="M80 130 L96 114 M80 130 L96 146 M240 130 L224 114 M240 130 L224 146" sw={2} single />
        </>
      ) : kind === "ponzo" ? (
        <>
          <L k="pz1" x1={110} y1={170} x2={150} y2={10} sw={1.8} single />
          <L k="pz2" x1={210} y1={170} x2={170} y2={10} sw={1.8} single />
          <L k="pz3" x1={130} y1={50} x2={190} y2={50} stroke={C.blue} sw={4} single />
          <L k="pz4" x1={130} y1={140} x2={190} y2={140} stroke={C.blue} sw={4} single />
        </>
      ) : kind === "ebbinghaus" ? (
        <>
          <E k="eb1" cx={80} cy={90} w={30} h={30} fill={C.blue} fillStyle="solid" sw={1.4} />
          {Array.from({ length: 6 }, (_, i) => <E key={i} k={`eb1s${i}`} cx={80 + 60 * Math.cos((i * Math.PI) / 3)} cy={90 + 60 * Math.sin((i * Math.PI) / 3)} w={56} h={56} sw={1.4} />)}
          <E k="eb2" cx={245} cy={90} w={30} h={30} fill={C.blue} fillStyle="solid" sw={1.4} />
          {Array.from({ length: 8 }, (_, i) => <E key={i} k={`eb2s${i}`} cx={245 + 28 * Math.cos((i * Math.PI) / 4)} cy={90 + 28 * Math.sin((i * Math.PI) / 4)} w={12} h={12} sw={1.2} />)}
        </>
      ) : (
        <>
          <R k="fg-bg" x={60} y={10} w={200} h={160} fill={C.ink} fillStyle="solid" sw={1} />
          <P k="fg-vase" d="M110 10 C150 40 120 70 140 90 C120 110 150 140 110 170 L210 170 C170 140 200 110 180 90 C200 70 170 40 210 10 Z" fill={C.paper} fillStyle="solid" sw={1.6} />
        </>
      )}
      {reveal && kind !== "figure-ground" ? (
        kind === "muller-lyer" ? (
          <>
            <L k="ml-r1" x1={80} y1={20} x2={80} y2={170} stroke={C.red} sw={1.4} dash="5 4" single />
            <L k="ml-r2" x1={240} y1={20} x2={240} y2={170} stroke={C.red} sw={1.4} dash="5 4" single />
          </>
        ) : kind === "ponzo" ? (
          <>
            <L k="pz-r1" x1={130} y1={20} x2={130} y2={170} stroke={C.red} sw={1.4} dash="5 4" single />
            <L k="pz-r2" x1={190} y1={20} x2={190} y2={170} stroke={C.red} sw={1.4} dash="5 4" single />
          </>
        ) : (
          <L k="eb-r" x1={60} y1={90} x2={265} y2={90} stroke={C.red} sw={1.4} dash="5 4" single />
        )
      ) : null}
    </SketchSheet>
  );
}

export function IllusionWidget({ d }: { d: IllusionData }) {
  const [reveal, setReveal] = React.useState(false);
  const x = ILLUSION_TEXT[d.kind] ?? ILLUSION_TEXT["muller-lyer"];
  return (
    <WidgetFrame label="Illusion" title={d.title ?? x.name} caption={d.caption} testID="w-illusion">
      <IllusionArt kind={d.kind} reveal={reveal} />
      <T v="bodyStrong">{x.see}</T>
      {reveal ? <StepText text={x.truth} k="truth" /> : null}
      <Button kind="quiet" label={reveal ? "Hide the check" : d.kind === "figure-ground" ? "What is going on?" : "Check with a ruler"} onPress={() => setReveal((r) => !r)} testID="illusion-reveal" />
    </WidgetFrame>
  );
}

/* --------------------------------------------------------- nervoussystem */

export function NervousSystemWidget({ d }: { d: NervousSystemData }) {
  const def: SceneDef = {
    w: 320,
    h: 250,
    nodes: [n("ns", "Nervous system", 160, 24, { w: 130 }), n("cns", "Central: brain and spinal cord", 80, 86, { w: 130 }), n("pns", "Peripheral: nerves", 240, 86, { w: 120 }), n("somatic", "Somatic (voluntary)", 180, 156, { w: 100 }), n("auto", "Autonomic (automatic)", 280, 156, { w: 80 }), n("symp", "Sympathetic", 200, 226, { w: 90 }), n("para", "Parasympathetic", 290, 226, { w: 60 })],
    links: [["ns", "cns"], ["ns", "pns"], ["pns", "somatic"], ["pns", "auto"], ["auto", "symp"], ["auto", "para"]],
    steps: steps([
      { id: "split", name: "Two parts", on: ["ns", "cns", "pns"], flow: [["ns", "cns"], ["ns", "pns"]], text: "The central nervous system (brain and spinal cord) decides; the peripheral nervous system (all the nerves outside) carries messages in and out." },
      { id: "signal", name: "A signal's route", on: ["cns", "somatic"], flow: [["pns", "somatic"]], text: "Touch a hot pan: sensory nerves carry the message to the spinal cord, which can pull your hand away (a reflex) before the brain has even felt the pain." },
      { id: "somatic", name: "Somatic", on: ["somatic"], flow: [["pns", "somatic"]], text: "The somatic system moves the muscles you control on purpose and carries what you feel from skin, muscles and joints." },
      { id: "auto", name: "Autonomic", on: ["auto"], flow: [["pns", "auto"]], text: "The autonomic system runs the body without asking you: heart, breathing, gut, sweat, pupils." },
      { id: "symp", name: "Fight or flight", on: ["symp"], flow: [["auto", "symp"]], text: "Sympathetic: speeds the heart, widens the airways and pupils, slows digestion. The body of panic is this system firing without a real danger." },
      { id: "para", name: "Rest and digest", on: ["para"], flow: [["auto", "para"]], text: "Parasympathetic: slows the heart and restarts digestion. Slow breathing out switches it on, which is why breathing exercises calm anxiety." },
    ]),
  };
  return <StepScene name="nervoussystem" label="The nervous system" title={d.title ?? "How the nervous system is organised"} caption={d.caption} variants={[{ id: "n", name: "Nervous system", def }]} />;
}

/* ------------------------------------------------------- actionpotential */

const AP_PHASES = [
  { id: "rest", name: "Resting", t: [0, 8], text: "At rest the inside of the neuron is about −70 mV compared with the outside, held there by the sodium-potassium pump." },
  { id: "rise", name: "Reaching threshold", t: [8, 10], text: "Incoming signals nudge the voltage up. At about −55 mV (threshold) voltage-gated sodium channels open." },
  { id: "depol", name: "Depolarisation", t: [10, 13], text: "Sodium rushes in and the inside swings positive, up to about +30 mV, in under a millisecond. All or none: a stronger push does not make a bigger spike, only more spikes." },
  { id: "repol", name: "Repolarisation", t: [13, 20], text: "Sodium channels close and potassium channels open. Potassium flows out and the voltage falls back." },
  { id: "hyper", name: "Undershoot", t: [20, 32], text: "Potassium channels close slowly, so the voltage dips below resting for a moment. During this refractory period another spike is hard or impossible, which keeps the signal moving one way." },
  { id: "back", name: "Back to rest", t: [32, 40], text: "The pump restores the balance. The neuron is ready to fire again." },
];
const TRACE: [number, number][] = [[0, -70], [8, -70], [10, -55], [13, 30], [16, 10], [20, -60], [24, -82], [32, -74], [40, -70]];

export function ActionPotentialWidget({ d }: { d: ActionPotentialData }) {
  const [i, setI] = React.useState(0);
  const X = (tt: number) => 40 + (tt / 40) * 270;
  const Y = (mv: number) => 20 + ((40 - mv) / 130) * 140;
  const ph = AP_PHASES[i]!;
  return (
    <WidgetFrame label="The action potential" title={d.title} caption={d.caption} testID="w-actionpotential">
      <SketchSheet name="ap" w={320} h={180} label={`Voltage over time. ${ph.name}`}>
        <L k="ap-thr" x1={36} y1={Y(-55)} x2={314} y2={Y(-55)} stroke={C.red} sw={1.2} dash="5 4" single />
        <Label x={312} y={Y(-55) - 5} size={11} anchor="end" color={C.red} bold={false}>
          threshold
        </Label>
        <R k={`ap-band-${ph.id}`} x={X(ph.t[0]!)} y={14} w={Math.max(4, X(ph.t[1]!) - X(ph.t[0]!))} h={150} fill={C.lime} fillStyle="solid" stroke="none" sw={0} />
        <P k="ap-trace" d={TRACE.map(([tt, v], k) => `${k ? "L" : "M"}${X(tt)} ${Y(v)}`).join(" ")} stroke={C.blue} sw={2.4} single rough={0.4} />
        <Label x={4} y={Y(30) + 4} size={11} bold={false}>
          +30
        </Label>
        <Label x={4} y={Y(-70) + 4} size={11} bold={false}>
          −70
        </Label>
      </SketchSheet>
      <StepPickerLite n={AP_PHASES.length} i={i} onPick={setI} names={AP_PHASES.map((p) => p.name)} />
      <StepText text={ph.text} k={ph.id} />
    </WidgetFrame>
  );
}

function StepPickerLite({ n: count, i, onPick, names }: { n: number; i: number; onPick: (i: number) => void; names: string[] }) {
  return <StepPicker steps={names.slice(0, count).map((name) => ({ name }))} i={i} onPick={onPick} />;
}

/* --------------------------------------------------------------- genogram */

type Person = { id: string; x: number; y: number; male: boolean; has?: boolean; dead?: boolean; note: string };

export function GenogramWidget({ d }: { d: GenogramData }) {
  const condition = d.condition ?? "depression";
  const people: Person[] = [
    { id: "gf", x: 70, y: 36, male: true, has: true, dead: true, note: `Grandfather: had ${condition}; died at 71. A cross through the shape means the person has died.` },
    { id: "gm", x: 130, y: 36, male: false, note: "Grandmother: no known illness." },
    { id: "father", x: 100, y: 110, male: true, note: "Father: no diagnosis, but drinks heavily. Note substance use too: it often travels with mood disorders." },
    { id: "mother", x: 220, y: 110, male: false, has: true, note: `Mother: treated for ${condition} after the client was born. A filled shape means the person has the condition.` },
    { id: "client", x: 130, y: 190, male: false, has: true, note: "The client (double outline). Two of three generations affected suggests a family loading, which raises risk but never decides it." },
    { id: "brother", x: 190, y: 190, male: true, note: "Younger brother: well." },
  ];
  const [on, setOn] = React.useState<string>("client");
  const p = people.find((x) => x.id === on)!;
  return (
    <WidgetFrame label="Genogram" title={d.title ?? "A family tree for the clinic"} caption={d.caption} testID="w-genogram">
      <SketchSheet name="genogram" w={320} h={230} label={`A three-generation genogram for ${condition}. ${p.note}`}>
        <L k="g-m1" x1={70} y1={36} x2={130} y2={36} sw={1.6} single />
        <L k="g-d1" x1={100} y1={36} x2={100} y2={92} sw={1.6} single />
        <L k="g-m2" x1={100} y1={110} x2={220} y2={110} sw={1.6} single />
        <L k="g-d2" x1={160} y1={110} x2={160} y2={150} sw={1.6} single />
        <L k="g-s" x1={130} y1={150} x2={190} y2={150} sw={1.6} single />
        <L k="g-c1" x1={130} y1={150} x2={130} y2={172} sw={1.6} single />
        <L k="g-c2" x1={190} y1={150} x2={190} y2={172} sw={1.6} single />
        {people.map((x) => {
          const fill = x.has ? C.blue : C.paper;
          const sel = x.id === on;
          return (
            <React.Fragment key={x.id}>
              {x.male ? <R k={`g-${x.id}`} x={x.x - 16} y={x.y - 16} w={32} h={32} fill={fill} fillStyle="solid" sw={sel ? 3 : 1.8} stroke={sel ? C.lime : C.ink} /> : <E k={`g-${x.id}`} cx={x.x} cy={x.y} w={34} h={34} fill={fill} fillStyle="solid" sw={sel ? 3 : 1.8} stroke={sel ? C.lime : C.ink} />}
              {x.id === "client" ? <E k="g-client2" cx={x.x} cy={x.y} w={44} h={44} sw={1.4} /> : null}
              {x.dead ? <L k={`g-x-${x.id}`} x1={x.x - 20} y1={x.y + 20} x2={x.x + 20} y2={x.y - 20} sw={1.6} single /> : null}
              <Circle cx={x.x} cy={x.y} r={22} fill="transparent" onPress={() => setOn(x.id)} />
            </React.Fragment>
          );
        })}
      </SketchSheet>
      <T v="small" tone="muted">
        Square: male. Circle: female. Filled: has {condition}. Tap a person.
      </T>
      <StepText text={p.note} k={p.id} />
    </WidgetFrame>
  );
}

/* ------------------------------------------------------------ brainslicer */

const PLANES = [
  { id: "sagittal", name: "Sagittal", text: "Cut from front to back down the middle: you see the corpus callosum, the brainstem and the cerebellum side by side. This is the view of most textbook brain drawings." },
  { id: "coronal", name: "Coronal", text: "Cut from ear to ear, like slicing bread: both halves side by side, the ventricles in the middle and the hippocampus low on each side. Used to look for hippocampal shrinking." },
  { id: "axial", name: "Axial", text: "Cut flat, as if looking down from above: the usual CT and MRI view. Left on the scan is often the patient's right." },
];
const TREAT = [
  { id: "tms", name: "TMS", text: "Transcranial magnetic stimulation: a coil on the scalp makes brief magnetic pulses that make the neurons just under it fire. For depression it is aimed at the left dorsolateral prefrontal cortex, daily for several weeks. Awake, no anaesthetic; a headache is the common side effect." },
  { id: "ect", name: "ECT", text: "Electroconvulsive therapy: under anaesthesia and a muscle relaxant, a brief current causes a controlled seizure, usually 6 to 12 sessions. The most effective treatment for severe or psychotic depression and catatonia. Short-term memory problems are the main side effect." },
];

export function BrainSlicerWidget({ d }: { d: BrainSlicerData }) {
  const [mode, setMode] = React.useState<"slice" | "treat">(d.start === "tms" || d.start === "ect" ? "treat" : "slice");
  const opts = mode === "slice" ? PLANES : TREAT;
  return (
    <View style={{ gap: space[3] }}>
      <Chips
        label="Show"
        options={[
          { id: "slice", name: "Slices" },
          { id: "treat", name: "Brain stimulation" },
        ]}
        value={mode}
        onChange={(v) => setMode(v as "slice" | "treat")}
      />
      <ChoiceScene
        key={mode}
        name="brainslicer"
        label={mode === "slice" ? "Ways to slice the brain" : "Treating through the skull"}
        title={d.title}
        caption={d.caption}
        options={opts}
        start={d.start === "ect" ? "ect" : undefined}
        art={(id) => (
          <SketchSheet name={`slicer-${id}`} w={320} h={180} label={opts.find((o) => o.id === id)?.name ?? id}>
            {id === "sagittal" || id === "tms" || id === "ect" ? (
              <P k="sl-side" d="M40 100 C30 46 110 14 180 18 C250 22 290 66 284 108 C280 140 252 156 220 152 C170 150 80 150 40 100 Z" fill={C.wash} fillStyle="solid" sw={2} />
            ) : (
              <E k={`sl-${id}`} cx={160} cy={92} w={id === "coronal" ? 200 : 180} h={id === "coronal" ? 150 : 160} fill={C.wash} fillStyle="solid" sw={2} />
            )}
            {id === "sagittal" ? <Cv k="sl-cc" pts={[[110, 80], [160, 66], [210, 80]]} stroke={C.blue} sw={3} /> : null}
            {id === "coronal" ? (
              <>
                <L k="sl-mid" x1={160} y1={20} x2={160} y2={164} sw={1.4} stroke={C.soft} single />
                <E k="sl-v1" cx={146} cy={84} w={14} h={30} fill={C.blue} fillStyle="solid" sw={1} />
                <E k="sl-v2" cx={174} cy={84} w={14} h={30} fill={C.blue} fillStyle="solid" sw={1} />
                <E k="sl-h1" cx={110} cy={130} w={24} h={14} fill={C.lime} fillStyle="solid" sw={1} />
                <E k="sl-h2" cx={210} cy={130} w={24} h={14} fill={C.lime} fillStyle="solid" sw={1} />
              </>
            ) : null}
            {id === "axial" ? <L k="sl-ax" x1={160} y1={14} x2={160} y2={170} sw={1.4} stroke={C.soft} single /> : null}
            {id === "tms" ? (
              <>
                <E k="tms-coil1" cx={92} cy={22} w={36} h={20} sw={2} stroke={C.blue} />
                <E k="tms-coil2" cx={126} cy={22} w={36} h={20} sw={2} stroke={C.blue} />
                <E k="tms-spot" cx={108} cy={56} w={24} h={16} fill={C.lime} fillStyle="solid" sw={1} />
              </>
            ) : null}
            {id === "ect" ? (
              <>
                <R k="ect-e1" x={44} y={60} w={14} h={22} fill={C.blue} fillStyle="solid" sw={1} />
                <R k="ect-e2" x={266} y={60} w={14} h={22} fill={C.blue} fillStyle="solid" sw={1} />
                <Arrow k="ect-cur" from={[64, 72]} to={[258, 72]} stroke={C.lime} dash="6 4" />
              </>
            ) : null}
          </SketchSheet>
        )}
      />
    </View>
  );
}

/* --------------------------------------------------------------- amesroom */

export function AmesRoomWidget({ d }: { d: AmesRoomData }) {
  const [i, setI] = React.useState(0);
  const stepsList = [
    { name: "What you see", text: "Through the peephole the room looks like an ordinary box. A person in the left corner looks like a giant next to a tiny person in the right corner." },
    { name: "The real shape", text: "From above, the room is a trapezoid: the left corner is twice as far from you as the right one, and the floor and ceiling slope to hide it." },
    { name: "Why the brain is fooled", text: "Your brain assumes rooms are rectangles. With that assumption, the only way to explain the images is that the people differ in size. Size constancy is overruled by what we expect of rooms." },
  ];
  const real = i >= 1;
  return (
    <WidgetFrame label="The Ames room" title={d.title} caption={d.caption} testID="w-amesroom">
      <SketchSheet name={`ames-${real}`} w={320} h={180} label={stepsList[i]!.name}>
        {real ? (
          <>
            <P k="ames-top" d="M40 40 L280 70 L280 150 L40 170 Z" fill={C.wash} fillStyle="solid" sw={2} />
            <E k="ames-eye" cx={160} cy={176} w={14} h={8} fill={C.ink} fillStyle="solid" sw={1} />
            <E k="ames-p1" cx={66} cy={60} w={18} h={18} fill={C.blue} fillStyle="solid" sw={1.4} />
            <E k="ames-p2" cx={256} cy={86} w={18} h={18} fill={C.lime} fillStyle="solid" sw={1.4} />
            <Label x={160} y={20} size={12} anchor="middle" bold={false} color={C.soft}>
              seen from above
            </Label>
          </>
        ) : (
          <>
            <R k="ames-room" x={40} y={20} w={240} h={150} fill={C.wash} fillStyle="solid" sw={2} />
            <R k="ames-win" x={140} y={40} w={40} h={40} sw={1.4} />
            <P k="ames-giant" d="M90 170 L90 70 M70 100 L110 100" sw={3} single stroke={C.blue} />
            <E k="ames-gh" cx={90} cy={58} w={22} h={22} fill={C.blue} fillStyle="solid" sw={1.4} />
            <P k="ames-small" d="M230 170 L230 136 M222 148 L238 148" sw={2.4} single stroke={C.ink} />
            <E k="ames-sh" cx={230} cy={130} w={10} h={10} fill={C.lime} fillStyle="solid" sw={1.2} />
          </>
        )}
      </SketchSheet>
      <StepPickerLite n={3} i={i} onPick={setI} names={stepsList.map((s) => s.name)} />
      <StepText text={stepsList[i]!.text} k={String(i)} />
    </WidgetFrame>
  );
}

