"use client";

import * as React from "react";
import { Choice, Fact, Figure, Say } from "@/components/sketch/ink";
import { ReceptorArt } from "@/components/sketch/receptor-art";

/** What can sit in a receptor, and what each does to its signal. */
export const LIGANDS = [
  { id: "none", name: "Nothing bound", signal: 0.15, text: "Many receptors give a small background signal on their own." },
  { id: "full", name: "Full agonist", signal: 1, text: "Fits and switches the receptor fully on: the biggest signal. The body's own messenger usually acts like this." },
  { id: "partial", name: "Partial agonist", signal: 0.5, text: "Fits but switches the receptor only half on. When the natural messenger is low it raises the signal; when it is high it competes and lowers it." },
  { id: "antagonist", name: "Antagonist", signal: 0.15, text: "Sits in the slot without switching anything on, and keeps the natural messenger out. The signal stays at background." },
  { id: "inverse", name: "Inverse agonist", signal: 0.02, text: "Binds and pushes the receptor below its background level: the signal falls under baseline." },
] as const;
export type LigandId = (typeof LIGANDS)[number]["id"];

const PICK: Record<string, LigandId> = { "Full agonist": "full", "Partial agonist": "partial", Antagonist: "antagonist", "Inverse agonist": "inverse" };

export function ReceptorSketch({ medName, receptor, pick, note }: { medName: string; receptor: string; pick: string; note: string }) {
  const own = PICK[pick] ?? "antagonist";
  const [id, setId] = React.useState<LigandId>(own);
  const lig = LIGANDS.find((x) => x.id === id)!;
  return (
    <Figure title={`${medName} at the ${receptor} receptor`}>
      <ReceptorArt id={id} receptor={receptor} label={`${lig.name} at the ${receptor} receptor: signal ${Math.round(lig.signal * 100)} percent`} />
      <Choice label="What is bound" value={id} onChange={setId} options={LIGANDS.map((x) => ({ id: x.id, name: x.id === own ? `${x.name} (${medName.toLowerCase()})` : x.name }))} />
      <Say live>
        <p>
          <span className="font-semibold">{lig.name}: </span>
          {lig.text}
        </p>
      </Say>
      {note ? <Fact>{note}</Fact> : null}
    </Figure>
  );
}
