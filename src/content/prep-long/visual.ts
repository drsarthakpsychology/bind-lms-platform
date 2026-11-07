/**
 * Typed builders for the diagrams inside long answers. Each builder checks the
 * widget's data shape at compile time (tsc), so a long answer cannot ship a
 * diagram the Study widget cannot draw. The render test in this folder then
 * draws every one.
 */
import type { PrepVisual } from "@/lib/prep/types";
import type {
  BrainExplorerData,
  BrainMapData,
  BrainSlicerData,
  CompareData,
  CurveData,
  ExperimentData,
  FlowData,
  GenogramData,
  HpaLoopData,
  HypnogramData,
  JourneyData,
  LayersData,
  MemoryFlowData,
  PathwaysData,
  ReceptorData,
  ReleaseData,
  StressData,
  Synapse3dData,
  SynapseData,
  ThoughtRecordData,
  TimelineData,
  ActionPotentialData,
  NervousSystemData,
  ConditioningData,
} from "@/lib/study/types";

type DataByKind = {
  flow: FlowData;
  curve: CurveData;
  layers: LayersData;
  brainmap: BrainMapData;
  journey: JourneyData;
  pathways: PathwaysData;
  receptor: ReceptorData;
  release: ReleaseData;
  synapse: SynapseData;
  synapse3d: Synapse3dData;
  timeline: TimelineData;
  compare: CompareData;
  experiment: ExperimentData;
  thoughtrecord: ThoughtRecordData;
  hypnogram: HypnogramData;
  stress: StressData;
  hpaloop: HpaLoopData;
  genogram: GenogramData;
  brainslicer: BrainSlicerData;
  brainexplorer: BrainExplorerData;
  memoryflow: MemoryFlowData;
  actionpotential: ActionPotentialData;
  nervoussystem: NervousSystemData;
  conditioning: ConditioningData;
};

export function vis<K extends keyof DataByKind>(kind: K, data: DataByKind[K], caption?: string): PrepVisual {
  return caption ? { kind, data, caption } : { kind, data };
}

type Node = [label: string, detail?: string];

function flow(layout: FlowData["layout"], title: string, nodes: Node[], caption?: string): PrepVisual {
  return vis("flow", { title, layout, nodes: nodes.map(([label, detail], i) => ({ id: `n${i}`, label, ...(detail ? { detail } : {}) })) }, caption);
}

/** Steps in order, left to right. */
export const chain = (title: string, nodes: Node[], caption?: string) => flow("chain", title, nodes, caption);
/** A loop that feeds itself (maintenance cycles). */
export const cycle = (title: string, nodes: Node[], caption?: string) => flow("cycle", title, nodes, caption);

/** A classification tree: [label, detail, parent index] with -1 for the root. */
export function tree(title: string, nodes: [label: string, detail: string, parent: number][], caption?: string): PrepVisual {
  return vis(
    "flow",
    {
      title,
      layout: "tree",
      nodes: nodes.map(([label, detail, parent], i) => ({ id: `n${i}`, label, ...(detail ? { detail } : {}), ...(parent >= 0 ? { parent: `n${parent}` } : {}) })),
    },
    caption,
  );
}

/** Two states side by side: [label, points, summary]. */
export function compare(title: string, a: [string, string[], string], b: [string, string[], string], caption?: string): PrepVisual {
  return vis("compare", { title, a: { label: a[0], points: a[1], summary: a[2] }, b: { label: b[0], points: b[1], summary: b[2] } }, caption);
}

/** Events in the correct order: [label, when?]. */
export function timeline(prompt: string, events: [label: string, when?: string][], why?: string): PrepVisual {
  return vis("timeline", { prompt, events: events.map(([label, when]) => (when ? { label, when } : { label })), ...(why ? { why } : {}) });
}

/** Layered model: pyramid (first = top), rings (first = centre), stack (first = top), iceberg (first = above water). */
export function layers(title: string, shape: LayersData["shape"], items: [label: string, detail: string][], caption?: string): PrepVisual {
  return vis("layers", { title, shape, layers: items.map(([label, detail]) => ({ label, detail })) }, caption);
}

/** Brain regions lit up, with a note on each. */
export type Region =
  | "frontal" | "prefrontal" | "motor" | "sensory" | "parietal" | "occipital" | "temporal" | "broca" | "wernicke"
  | "cerebellum" | "brainstem" | "corpus-callosum" | "thalamus" | "hypothalamus" | "basal-ganglia" | "amygdala" | "hippocampus";

export function brain(title: string, notes: Partial<Record<Region, string>>, caption?: string): PrepVisual {
  return vis("brainmap", { title, focus: Object.keys(notes), notes: notes as Record<string, string> }, caption);
}

export const curve = (kind: CurveData["kind"], title: string, caption?: string) => vis("curve", { kind, title }, caption);
