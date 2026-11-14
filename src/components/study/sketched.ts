import type { WidgetKind } from "@/lib/study/types";

/**
 * Study widget kinds drawn with the hand-drawn sketch kit (src/components/sketch).
 * The label test checks every diagram of these kinds; see
 * docs/design/DIAGRAM_INVENTORY_2026_11.md for what each widget is and why
 * the others keep their own look.
 */
export const SKETCHED: readonly WidgetKind[] = ["flow", "layers", "curve", "brainmap", "journey", "receptor", "pathways", "neuron", "conditioning", "memoryflow", "stress", "synapse", "release", "hypnogram", "strange", "attention", "dissonance", "conservation"];
