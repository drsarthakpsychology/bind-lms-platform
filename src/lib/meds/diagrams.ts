/**
 * The "How it works" pictures of a medicine page, as a plan: which hand-drawn
 * sketch comes next and exactly what it is drawn with. The website's
 * MedicineSketches (src/components/meds/medicine-visuals.tsx) draws this plan,
 * and the mobile app gets the same plan as data (GET /api/app/v1/library/
 * medicines/:id), so both always show the same pictures in the same order.
 * Pure, so it is tested.
 */
import type { Med } from "./types";
import type { Mechanism, Route } from "./mechanisms";
import type { MedVisual } from "./visuals";

export type SynapseAction = "reuptake" | "gaba" | "calcium" | "enzyme" | "nmda" | "glutamate";
export type DoseShape = "window" | "targets" | "ceiling";
export type ReceptorPick = Mechanism["receptor"]["pick"];
type Side = { label: string; points: string[]; summary: string };

export type MedDiagram =
  /** The medicine acts on a channel, an enzyme or inside the cell: one line instead of a receptor picture. */
  | { kind: "note"; text: string }
  | { kind: "receptor"; medName: string; receptor: string; pick: ReceptorPick; note: string }
  | { kind: "journey"; medName: string; target: string; routes: Route[]; notes: Record<string, string> | null }
  | { kind: "synapse"; medName: string; action: SynapseAction; transmitter: string; title: string; caption: string | null }
  | { kind: "halfLife"; title: string; hl: string; meaning: string }
  | { kind: "dose"; title: string; shape: DoseShape; caption: string | null }
  | { kind: "pathways"; medName: string; caption: string | null; atypical: boolean; focus: "nigrostriatal" | null }
  | { kind: "compare"; title: string; a: Side; b: Side }
  | { kind: "neuron"; medName: string; title: string; caption: string | null }
  | { kind: "nervous"; medName: string; title: string; caption: string | null }
  | { kind: "brainmap"; title: string; focus: string[]; notes: Record<string, string>; caption: string | null }
  | { kind: "hypnogram"; title: string; caption: string | null };

/** Which synapse picture fits each medicine that is not a reuptake blocker or a GABA medicine. */
const SYNAPSE: Record<string, SynapseAction> = { pregabalin: "calcium", donepezil: "enzyme", memantine: "nmda", acamprosate: "glutamate" };
/** Which dose-response shape each medicine's curve shows. */
const DOSE: Record<string, DoseShape> = { lithium: "window", trazodone: "targets", buprenorphine: "ceiling" };

export function synapseActionFor(medId: string, kind: "release" | "synapse3d", transmitter?: string): SynapseAction {
  if (kind === "release") return "reuptake";
  return SYNAPSE[medId] ?? (/gaba/i.test(transmitter ?? "") ? "gaba" : "glutamate");
}

export function doseShapeFor(medId: string): DoseShape {
  return DOSE[medId] ?? "window";
}

/** True when the medicine blocks serotonin 2A as well as D2 (second-generation antipsychotics). */
export function blocks2A(mech?: Mechanism | null): boolean {
  return Boolean(mech?.targets.some((t) => /5-HT2A/.test(t.target) && /antagonist|inverse/i.test(t.action)));
}

const str = (v: unknown): string | null => (typeof v === "string" ? v : null);

/** One extra picture for a medicine (one entry of src/lib/meds/visuals.ts). */
export function visualDiagram(v: MedVisual, med: Pick<Med, "id" | "name">, atypical = false): MedDiagram {
  switch (v.kind) {
    case "release":
    case "synapse3d":
      return { kind: "synapse", medName: med.name, action: synapseActionFor(med.id, v.kind, v.data.transmitter), transmitter: v.data.transmitter ?? "messenger", title: str(v.data.title) ?? `What ${med.name} changes at the synapse`, caption: str(v.data.caption) };
    case "curve":
      return v.half
        ? { kind: "halfLife", title: str(v.data.title) ?? `How long ${med.name} stays in the body`, hl: v.half.hl, meaning: v.half.meaning }
        : { kind: "dose", title: str(v.data.title) ?? med.name, shape: doseShapeFor(med.id), caption: str(v.data.caption) };
    case "pathways":
      return { kind: "pathways", medName: med.name, caption: str(v.data.caption), atypical, focus: med.id === "trihexyphenidyl" ? "nigrostriatal" : null };
    case "compare":
      return { kind: "compare", title: str(v.data.title) ?? "Compared", a: v.data.a, b: v.data.b };
    case "neuron":
      return { kind: "neuron", medName: med.name, title: str(v.data.title) ?? `What ${med.name} calms`, caption: str(v.data.caption) };
    case "nervoussystem":
      return { kind: "nervous", medName: med.name, title: str(v.data.title) ?? `What ${med.name} quietens`, caption: str(v.data.caption) };
    case "brainmap":
      return { kind: "brainmap", title: str(v.data.title) ?? `Where ${med.name} acts`, focus: [...(v.data.focus ?? [])], notes: { ...(v.data.notes ?? {}) }, caption: str(v.data.caption) };
    case "hypnogram":
      return { kind: "hypnogram", title: str(v.data.title) ?? "A night of sleep", caption: str(v.data.caption) };
  }
}

/** Every "how it works" picture for one medicine, in page order: the receptor, the journey through the body, then its own pictures. */
export function medicineDiagrams(med: Pick<Med, "id" | "name">, mech: Mechanism | null | undefined, visuals: readonly MedVisual[]): MedDiagram[] {
  const atypical = blocks2A(mech);
  // Some medicines act on a channel, an enzyme or inside the cell, not at a receptor: no receptor picture for them.
  const receptor = mech && mech.receptor.name !== "a receptor" ? mech.receptor : null;
  const out: MedDiagram[] = [];
  if (mech && !receptor) out.push({ kind: "note", text: mech.receptor.note });
  if (receptor) out.push({ kind: "receptor", medName: med.name, receptor: receptor.name, pick: receptor.pick, note: receptor.note });
  if (mech) out.push({ kind: "journey", medName: med.name, target: mech.site, routes: [...mech.routes], notes: mech.notes ? { ...mech.notes } : null });
  for (const v of visuals) out.push(visualDiagram(v, med, atypical));
  return out;
}
