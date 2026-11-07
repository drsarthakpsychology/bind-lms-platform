/**
 * Study: the course. Every module is a deep, textbook-style chapter written in
 * a small Markdown dialect (see parse.ts) and read one section at a time.
 */

export type Inline = string; // **bold**, *italic* and `term` are handled by the renderer

export type ListItem = { text: Inline; children?: ListItem[] };

export type BoxKind =
  | "define" // the formal definition, learn verbatim
  | "word" // how to word it in a case sheet
  | "trap" // exam trap / common error
  | "mnemonic" // memory hook
  | "example" // clinical example / vignette
  | "sounds" // how patients actually say it
  | "analogy" // the picture that makes it stick
  | "note" // side note
  | "safety"; // red-flag / safety

export type Mcq = { q: Inline; options: Inline[]; answer: number; why?: Inline };
export type Card = { q: Inline; a: Inline };

export type Block =
  | { t: "h3"; text: Inline }
  | { t: "p"; text: Inline }
  | { t: "ul"; items: ListItem[] }
  | { t: "ol"; items: ListItem[] }
  | { t: "table"; head: Inline[]; rows: Inline[][] }
  | { t: "box"; kind: BoxKind; title?: Inline; blocks: Block[] }
  | { t: "recall"; items: Card[] }
  | { t: "mcq"; items: Mcq[] }
  | { t: "viva"; items: Card[] }
  /** Shown only in one reading view (the Student / Clinician switch). */
  | { t: "view"; view: "student" | "clinician"; blocks: Block[] }
  /** An interactive piece (guess, decide, sort, build, moodline, worked, synapse). Data is JSON in the source. */
  | { t: "widget"; kind: WidgetKind; data: WidgetData }
  /** A question with a fully developed answer (Q&A bank). The answer is ordinary blocks. */
  | { t: "qa"; q: Inline; level?: Level; blocks: Block[] };

/** Starting → Beginner → Advanced. Each level opens when the previous level check is passed. */
export type Level = "starting" | "beginner" | "advanced";
export const LEVELS: Level[] = ["starting", "beginner", "advanced"];

export type WidgetKind = "guess" | "decide" | "sort" | "build" | "moodline" | "worked" | "synapse" | "reveal" | "flow" | "curve" | "layers" | "brainmap" | "journey" | "neuron" | "pathways" | "receptor" | "conditioning" | "memoryflow" | "stress" | "timeline" | "compare";

export type GuessData = { prompt: Inline; min: number; max: number; step?: number; unit: string; answer: [number, number]; reveal: Inline; clinician?: Inline };
export type DecideData = {
  scene: Inline;
  ask: Inline;
  choices: { label: Inline; verdict: "best" | "ok" | "harm"; outcome: Inline; why: Inline }[];
};
export type SortData = { prompt: Inline; buckets: Inline[]; items: { text: Inline; bucket: number; why?: Inline }[] };
export type BuildData = {
  vignette: Inline;
  rule: Inline;
  symptoms: { label: Inline; present: boolean; core?: boolean; why?: Inline }[];
  need: number;
  needCore: boolean;
  verdict: Inline;
};
export type MoodlineData = { prompt: Inline; series: number[]; labels?: string[]; options: Inline[]; answer: number; why: Inline };
export type WorkedData = { title: Inline; steps: { q: Inline; a: Inline }[]; yourTurn?: { q: Inline; a: Inline }[] };
export type SynapseData = { drug: "ssri" | "snri" | "maoi" | "none"; caption: Inline };
export type RevealData = { prompt: Inline; answer: Inline };
/** Flowchart / process / cycle / hierarchy. chain = nodes in order; cycle = nodes round a loop; tree = nodes with `parent`. Tap a node for its detail; Play steps through. */
export type FlowData = {
  title?: Inline;
  layout: "chain" | "cycle" | "tree";
  nodes: { id: string; label: Inline; detail?: Inline; parent?: string }[];
  /** Labels on the arrows between consecutive nodes (chain/cycle), keyed "from>to". */
  edgeLabels?: Record<string, Inline>;
  caption?: Inline;
};
/** Interactive curve explorers with sliders. */
export type CurveData = {
  kind: "normal" | "sdt" | "forgetting" | "inverted-u" | "dose-response" | "half-life";
  title?: Inline;
  caption?: Inline;
};
/** Layered models: pyramid (layers[0] = top), rings (layers[0] = centre), stack (layers[0] = top), iceberg (layers[0] = above water). */
export type LayersData = { title?: Inline; shape: "pyramid" | "rings" | "stack" | "iceberg"; layers: { label: Inline; detail: Inline }[]; caption?: Inline };
/** Schematic brain (side view + deep structures). Region ids: frontal, parietal, temporal, occipital, motor, sensory, broca, wernicke, prefrontal, cerebellum, brainstem, thalamus, hypothalamus, amygdala, hippocampus, basal-ganglia, corpus-callosum. */
export type BrainMapData = { title?: Inline; focus?: string[]; notes?: Record<string, Inline>; caption?: Inline };
/** A medicine's journey: swallowed (or IV / nasal / depot) → gut → liver first pass → blood → blood-brain barrier → brain target → elimination. Notes override the default text per stage id (mouth, gut, liver, blood, bbb, target, out, vein, nose, muscle, slow). */
export type JourneyData = { drug: string; target: string; route?: "oral" | "iv" | "nasal" | "depot"; routes?: ("oral" | "iv" | "nasal" | "depot")[]; notes?: Record<string, Inline>; title?: Inline; caption?: Inline };
/** Action potential: threshold slider, all-or-none firing, myelin on/off (saltatory conduction), voltage trace. */
export type NeuronData = { title?: Inline; myelinated?: boolean; caption?: Inline };
/** The four dopamine pathways, with a D2-blocker toggle and a serotonin 2A (second-generation) toggle. */
export type PathwaysData = { system: "dopamine"; title?: Inline; caption?: Inline };
/** Ligand types at one receptor: full agonist, partial agonist, antagonist, inverse agonist, with a live signal bar. */
export type ReceptorData = { receptor?: string; title?: Inline; caption?: Inline };
/** Classical (bell, food, drool) or operant (lever, food, press rate) conditioning, played step by step. */
export type ConditioningData = { kind: "classical" | "operant"; title?: Inline; caption?: Inline };
/** Sensory store, working memory and long-term memory with rehearsal, encoding, retrieval and forgetting. */
export type MemoryFlowData = { title?: Inline; caption?: Inline };
/** Stress response: amygdala, hypothalamus, pituitary, adrenal; heart rate and cortisol rise and settle. */
export type StressData = { title?: Inline; caption?: Inline };
/** Put events in order. List the events in the correct order; the widget shuffles them. */
export type TimelineData = { prompt: Inline; events: { label: Inline; when?: string }[]; why?: Inline };
/** Two states compared with a slider (healthy vs ill, before vs after, novice vs expert). */
export type CompareData = { title?: Inline; a: { label: Inline; points: Inline[]; summary: Inline }; b: { label: Inline; points: Inline[]; summary: Inline }; caption?: Inline };
export type WidgetData = ConditioningData | MemoryFlowData | StressData | TimelineData | CompareData | JourneyData | NeuronData | PathwaysData | ReceptorData | GuessData | DecideData | SortData | BuildData | MoodlineData | WorkedData | SynapseData | RevealData | FlowData | CurveData | LayersData | BrainMapData;

export type Section = {
  /** Stable id, e.g. "2-3" for "2.3". */
  id: string;
  /** Display number, e.g. "2.3". */
  num: string;
  title: string;
  /** core = expected in every exam; extra = depth for distinction answers. */
  tag?: "core" | "extra";
  /** Level within the module (interactive modules). */
  level?: Level;
  /** This section is the check that opens the next level. */
  levelCheck?: Level;
  /** The part of the module this section belongs to (e.g. "Part II · The MSE"). */
  part?: string;
  blocks: Block[];
  words: number;
  /** Section is the module test (has MCQs). */
  isTest: boolean;
};

export type Activity = {
  id: string;
  title: string;
  why: string;
  href: string;
  kind: "coach" | "lesson" | "detective" | "scenarios" | "terms" | "consult" | "notes";
};

export type ModuleMeta = {
  id: string;
  num: number;
  title: string;
  emoji: string;
  tagline: string;
  /** Curriculum place, e.g. "Weeks 1 to 2". */
  when: string;
  /** What you should be able to do by the end. */
  outcomes: string[];
  /** Write-it-out task for pass 3 (done on paper). */
  writeTask: string;
  activities: Activity[];
  /** Id of the one-page revision note, if any. */
  noteId?: string;
};

export type StudyModule = ModuleMeta & {
  sections: Section[];
  /** Estimated focused study time, in minutes (reading + recall). */
  minutes: number;
};
