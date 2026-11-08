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
import { DoseSketch, HalfLifeSketch, type DoseShape } from "./sketch/curves";
import { JourneySketch } from "./sketch/journey";
import { NeuronSketch } from "./sketch/neuron";
import { PathwaysSketch } from "./sketch/pathways";
import { BrainMapSketch, HypnogramSketch, NervousSketch } from "./sketch/places";
import { ReceptorSketch } from "./sketch/receptor";
import { SynapseSketch, type SynapseAction } from "./sketch/synapse";

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

/** One extra picture for a medicine (see src/lib/meds/visuals.ts). */
export function MedicineVisual({ v, med, atypical = false }: { v: MedVisual; med: Pick<Med, "id" | "name">; atypical?: boolean }) {
  switch (v.kind) {
    case "release":
    case "synapse3d":
      return <SynapseSketch medName={med.name} action={synapseActionFor(med.id, v.kind, v.data.transmitter)} transmitter={v.data.transmitter ?? "messenger"} title={v.data.title ?? `What ${med.name} changes at the synapse`} caption={v.data.caption} />;
    case "curve":
      return v.half ? (
        <HalfLifeSketch title={v.data.title ?? `How long ${med.name} stays in the body`} hl={v.half.hl} meaning={v.half.meaning} />
      ) : (
        <DoseSketch title={v.data.title ?? med.name} shape={doseShapeFor(med.id)} caption={v.data.caption} />
      );
    case "pathways":
      return <PathwaysSketch medName={med.name} caption={v.data.caption} atypical={atypical} focus={med.id === "trihexyphenidyl" ? "nigrostriatal" : undefined} />;
    case "compare":
      return <CompareSketch title={v.data.title ?? "Compared"} a={v.data.a} b={v.data.b} />;
    case "neuron":
      return <NeuronSketch medName={med.name} title={v.data.title ?? `What ${med.name} calms`} caption={v.data.caption} />;
    case "nervoussystem":
      return <NervousSketch medName={med.name} title={v.data.title ?? `What ${med.name} quietens`} caption={v.data.caption} />;
    case "brainmap":
      return <BrainMapSketch title={v.data.title ?? `Where ${med.name} acts`} focus={v.data.focus ?? []} notes={v.data.notes ?? {}} caption={v.data.caption} />;
    case "hypnogram":
      return <HypnogramSketch title={v.data.title ?? "A night of sleep"} caption={v.data.caption} />;
  }
}

/** True when the medicine blocks serotonin 2A as well as D2 (second-generation antipsychotics). */
export function blocks2A(mech?: Mechanism): boolean {
  return Boolean(mech?.targets.some((t) => /5-HT2A/.test(t.target) && /antagonist|inverse/i.test(t.action)));
}

/** Every "how it works" picture for one medicine: the receptor, the journey through the body, then its own pictures. */
export function MedicineSketches({ med, mech, visuals }: { med: Med; mech?: Mechanism; visuals: MedVisual[] }) {
  const atypical = blocks2A(mech);
  // Some medicines act on a channel, an enzyme or inside the cell, not at a receptor: no receptor picture for them.
  const receptor = mech && mech.receptor.name !== "a receptor" ? mech.receptor : null;
  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <OnceHint id="meds-how-it-works" className="text-caption text-muted-foreground lg:col-span-2">
        Tap the buttons under a picture to change it.
      </OnceHint>
      {mech && !receptor ? <p className="text-[0.95rem] leading-relaxed lg:col-span-2">{mech.receptor.note}</p> : null}
      {receptor ? <ReceptorSketch medName={med.name} receptor={receptor.name} pick={receptor.pick} note={receptor.note} /> : null}
      {mech ? <JourneySketch medName={med.name} target={mech.site} routes={mech.routes} notes={mech.notes} /> : null}
      {visuals.map((v, k) => (
        <MedicineVisual key={`${v.kind}-${k}`} v={v} med={med} atypical={atypical} />
      ))}
    </div>
  );
}
