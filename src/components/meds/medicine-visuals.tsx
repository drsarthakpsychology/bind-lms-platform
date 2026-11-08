"use client";

import type { Med } from "@/lib/meds/types";
import type { Mechanism } from "@/lib/meds/mechanisms";
import type { MedVisual } from "@/lib/meds/visuals";
import { BrainMap, Curve } from "@/components/study/visuals";
import { Journey, Neuron, Pathways, Receptor } from "@/components/study/animations";
import { Compare } from "@/components/study/animations2";
import { Hypnogram, Release } from "@/components/study/animations4";
import { NervousSystem } from "@/components/study/scenes/nervous-system";
import { SynapseScene } from "@/components/study/scenes/synapse-scene";

/** One extra "how it works" picture for a medicine (see src/lib/meds/visuals.ts). */
export function MedicineVisual({ v }: { v: MedVisual }) {
  switch (v.kind) {
    case "release":
      return <Release d={v.data} />;
    case "curve":
      return <Curve d={v.data} />;
    case "pathways":
      return <Pathways d={v.data} />;
    case "compare":
      return <Compare d={v.data} />;
    case "synapse3d":
      return <SynapseScene d={v.data} />;
    case "neuron":
      return <Neuron d={v.data} />;
    case "nervoussystem":
      return <NervousSystem d={v.data} />;
    case "brainmap":
      return <BrainMap d={v.data} />;
    case "hypnogram":
      return <Hypnogram d={v.data} />;
  }
}

/** Every "how it works" picture for one medicine: the receptor, the journey through the body, then its own pictures. */
export function MedicineSketches({ med, mech, visuals }: { med: Med; mech?: Mechanism; visuals: MedVisual[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {mech ? <Receptor d={{ receptor: mech.receptor.name, title: `${med.name} at the ${mech.receptor.name} receptor`, caption: mech.receptor.note }} /> : null}
      {mech ? <Journey d={{ drug: med.name.toLowerCase(), target: mech.site, routes: mech.routes, notes: mech.notes }} /> : null}
      {visuals.map((v, k) => (
        <MedicineVisual key={`${v.kind}-${k}`} v={v} />
      ))}
    </div>
  );
}
