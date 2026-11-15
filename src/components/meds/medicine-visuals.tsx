"use client";

/**
 * The "How it works" pictures on a medicine page, all hand-drawn
 * (src/components/meds/sketch). These are used only on medicine pages; the
 * Study modules keep their own widgets unchanged.
 */
import { OnceHint } from "@/components/help/once-hint";
import type { Med } from "@/lib/meds/types";
import type { Mechanism } from "@/lib/meds/mechanisms";
import type { MedVisual } from "@/lib/meds/visuals";
import { CompareSketch } from "./sketch/compare";
import { DoseSketch, HalfLifeSketch } from "./sketch/curves";
import { JourneySketch } from "./sketch/journey";
import { NeuronSketch } from "./sketch/neuron";
import { PathwaysSketch } from "./sketch/pathways";
import { BrainMapSketch, HypnogramSketch, NervousSketch } from "./sketch/places";
import { ReceptorSketch } from "./sketch/receptor";
import { SynapseSketch } from "./sketch/synapse";
import { medicineDiagrams, visualDiagram, type MedDiagram } from "@/lib/meds/diagrams";

export { blocks2A, doseShapeFor, synapseActionFor } from "@/lib/meds/diagrams";

/** One planned picture (src/lib/meds/diagrams.ts), drawn. */
export function MedicineDiagram({ d }: { d: MedDiagram }) {
  switch (d.kind) {
    case "note":
      return <p className="text-[0.95rem] leading-relaxed lg:col-span-2">{d.text}</p>;
    case "receptor":
      return <ReceptorSketch medName={d.medName} receptor={d.receptor} pick={d.pick} note={d.note} />;
    case "journey":
      return <JourneySketch medName={d.medName} target={d.target} routes={d.routes} notes={d.notes ?? undefined} />;
    case "synapse":
      return <SynapseSketch medName={d.medName} action={d.action} transmitter={d.transmitter} title={d.title} caption={d.caption ?? undefined} />;
    case "halfLife":
      return <HalfLifeSketch title={d.title} hl={d.hl} meaning={d.meaning} />;
    case "dose":
      return <DoseSketch title={d.title} shape={d.shape} caption={d.caption ?? undefined} />;
    case "pathways":
      return <PathwaysSketch medName={d.medName} caption={d.caption ?? undefined} atypical={d.atypical} focus={d.focus ?? undefined} />;
    case "compare":
      return <CompareSketch title={d.title} a={d.a} b={d.b} />;
    case "neuron":
      return <NeuronSketch medName={d.medName} title={d.title} caption={d.caption ?? undefined} />;
    case "nervous":
      return <NervousSketch medName={d.medName} title={d.title} caption={d.caption ?? undefined} />;
    case "brainmap":
      return <BrainMapSketch title={d.title} focus={d.focus} notes={d.notes} caption={d.caption ?? undefined} />;
    case "hypnogram":
      return <HypnogramSketch title={d.title} caption={d.caption ?? undefined} />;
  }
}

/** One extra picture for a medicine (see src/lib/meds/visuals.ts). */
export function MedicineVisual({ v, med, atypical = false }: { v: MedVisual; med: Pick<Med, "id" | "name">; atypical?: boolean }) {
  return <MedicineDiagram d={visualDiagram(v, med, atypical)} />;
}

/** Every "how it works" picture for one medicine: the receptor, the journey through the body, then its own pictures. */
export function MedicineSketches({ med, mech, visuals }: { med: Med; mech?: Mechanism; visuals: MedVisual[] }) {
  const plan = medicineDiagrams(med, mech, visuals);
  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <OnceHint id="meds-how-it-works" className="text-caption text-muted-foreground lg:col-span-2">
        Tap the buttons under a picture to change it.
      </OnceHint>
      {plan.map((d, k) => (
        <MedicineDiagram key={`${d.kind}-${k}`} d={d} />
      ))}
    </div>
  );
}
