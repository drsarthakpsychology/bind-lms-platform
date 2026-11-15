import { ExternalLink } from "lucide-react-native";
import * as React from "react";
import { Linking } from "react-native";

import type { WidgetBlock, WidgetDataByKind, WidgetKind } from "@/api/contract";
import { Row, RowList } from "@/ds/parts";
import { config } from "@/lib/config";
import { useTheme } from "@/theme";
import { CurveWidget, FigureWidget, FlowWidget, LayersWidget, SynapseWidget } from "./diagrams";
import { ActionPotentialWidget, AmesRoomWidget, AttentionWidget, BrainExplorerWidget, BrainMapWidget, BrainSlicerWidget, ConditioningWidget, ConservationWidget, DissonanceWidget, GenogramWidget, HpaLoopWidget, HypnogramWidget, IllusionWidget, JourneyWidget, MemoryFlowWidget, NervousSystemWidget, NeuronWidget, PathwaysWidget, ReceptorWidget, ReleaseWidget, StrangeWidget, StressWidget, Synapse3dWidget } from "./scenes";
import { BuildWidget, CompareWidget, DecideWidget, ExperimentWidget, GuessWidget, MoodlineWidget, RevealWidget, SortWidget, ThoughtRecordWidget, TimelineWidget, WorkedWidget } from "./interactive";

/**
 * The native widget registry: the app's copy of the website's switch from
 * `kind` to component (src/components/study/widgets.tsx). Each entry knows
 * the highest data version it can draw. An unknown kind, or a newer version
 * than the app knows, becomes a plain "Open on the website" row and never a
 * crash (docs/app/API_CONTRACT.md, section 3.3).
 */

export type WidgetContext = { moduleId: string; sectionId: string };

type Entry<K extends WidgetKind> = { v: number; C: React.ComponentType<{ d: WidgetDataByKind[K] }> };
type Registry = { [K in WidgetKind]?: Entry<K> };

export const REGISTRY: Registry = {
  guess: { v: 1, C: GuessWidget },
  decide: { v: 1, C: DecideWidget },
  sort: { v: 1, C: SortWidget },
  build: { v: 1, C: BuildWidget },
  moodline: { v: 1, C: MoodlineWidget },
  worked: { v: 1, C: WorkedWidget },
  reveal: { v: 1, C: RevealWidget },
  flow: { v: 1, C: FlowWidget },
  layers: { v: 1, C: LayersWidget },
  timeline: { v: 1, C: TimelineWidget },
  compare: { v: 1, C: CompareWidget },
  experiment: { v: 1, C: ExperimentWidget },
  thoughtrecord: { v: 1, C: ThoughtRecordWidget },
  figure: { v: 1, C: FigureWidget },
  curve: { v: 1, C: CurveWidget },
  synapse: { v: 1, C: SynapseWidget },
  // The website's animated and 3D scenes, rebuilt as native step-throughs (scenes.tsx).
  brainmap: { v: 1, C: BrainMapWidget },
  journey: { v: 1, C: JourneyWidget },
  neuron: { v: 1, C: NeuronWidget },
  pathways: { v: 1, C: PathwaysWidget },
  receptor: { v: 1, C: ReceptorWidget },
  conditioning: { v: 1, C: ConditioningWidget },
  memoryflow: { v: 1, C: MemoryFlowWidget },
  stress: { v: 1, C: StressWidget },
  attention: { v: 1, C: AttentionWidget },
  dissonance: { v: 1, C: DissonanceWidget },
  conservation: { v: 1, C: ConservationWidget },
  release: { v: 1, C: ReleaseWidget },
  hypnogram: { v: 1, C: HypnogramWidget },
  strange: { v: 1, C: StrangeWidget },
  illusion: { v: 1, C: IllusionWidget },
  nervoussystem: { v: 1, C: NervousSystemWidget },
  brainexplorer: { v: 1, C: BrainExplorerWidget },
  actionpotential: { v: 1, C: ActionPotentialWidget },
  synapse3d: { v: 1, C: Synapse3dWidget },
  genogram: { v: 1, C: GenogramWidget },
  hpaloop: { v: 1, C: HpaLoopWidget },
  brainslicer: { v: 1, C: BrainSlicerWidget },
  amesroom: { v: 1, C: AmesRoomWidget },
};

/** Kinds the app draws today (the rest fall back to the website row). */
export const NATIVE_KINDS = Object.keys(REGISTRY) as WidgetKind[];

export function canDraw(b: { kind: string; v: number }): boolean {
  const e = (REGISTRY as Record<string, { v: number } | undefined>)[b.kind];
  return !!e && b.v <= e.v;
}

/** Catches a widget that throws on odd data, so one bad piece never breaks the reader. */
class Guard extends React.Component<{ fallback: React.ReactNode; children: React.ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function WebRow({ ctx }: { ctx: WidgetContext }) {
  const c = useTheme();
  return (
    <RowList>
      <Row testID="widget-web" title="An interactive piece" meta="Open it on the website for now. It arrives in the app soon." icon={<ExternalLink size={20} color={c.muted} />} onPress={() => void Linking.openURL(`${config.site}/study/${ctx.moduleId}/${ctx.sectionId}`)} />
    </RowList>
  );
}

export function WidgetView({ block, ctx }: { block: WidgetBlock; ctx: WidgetContext }) {
  const fallback = <WebRow ctx={ctx} />;
  if (!canDraw(block)) return fallback;
  const entry = REGISTRY[block.kind] as Entry<typeof block.kind> | undefined;
  if (!entry) return fallback;
  const C = entry.C as React.ComponentType<{ d: unknown }>;
  return (
    <Guard fallback={fallback}>
      <C d={block.data} />
    </Guard>
  );
}
