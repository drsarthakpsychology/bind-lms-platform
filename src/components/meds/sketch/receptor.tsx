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

/** "Serotonin" reads "serotonin" inside a sentence; "GABA" stays "GABA". */
const inLine = (name: string) => (name === name.toUpperCase() ? name : name.toLowerCase());

/**
 * The receptor explainer. With `medName` the medicine itself binds the receptor and the
 * picture starts on what the medicine does there. With `messenger` the medicine does not
 * bind it: the picture shows the body's own messenger (the full agonist), and the
 * medicine's name appears nowhere on it.
 */
export function ReceptorSketch({ medName, messenger, receptor, pick, note }: { medName?: string; messenger?: string; receptor: string; pick: string; note: string }) {
  const own = messenger ? "full" : (PICK[pick] ?? "antagonist");
  const who = messenger ?? medName ?? "";
  const [id, setId] = React.useState<LigandId>(own);
  const lig = LIGANDS.find((x) => x.id === id)!;
  const title = messenger ? `${messenger}, the body's own messenger, at the ${receptor} receptor` : `${medName} at the ${receptor} receptor`;
  return (
    <Figure title={title}>
      <ReceptorArt id={id} receptor={receptor} label={`${lig.name} at the ${receptor} receptor: signal ${Math.round(lig.signal * 100)} percent`} />
      <Choice label="What is bound" value={id} onChange={setId} options={LIGANDS.map((x) => ({ id: x.id, name: x.id === own && who ? `${x.name} (${inLine(who)})` : x.name }))} />
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

/** What the medicine itself does at its main target, in one box (always shown first). */
export function MainTarget({ medName, target, action, effect }: { medName: string; target: string; action: string; effect: string }) {
  return (
    <div className="rounded-lg border-2 border-foreground/80 bg-card p-4 lg:col-span-2" data-testid="med-main-target">
      <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">Main target</p>
      <p className="mt-1 text-[1.0625rem] font-bold">{target}</p>
      <p className="mt-1 text-[0.95rem]">
        <span className="font-semibold">What {medName.toLowerCase()} does there: </span>
        {action.charAt(0).toLowerCase() + action.slice(1)}.
      </p>
      <p className="mt-1 text-[0.95rem] text-muted-foreground">{effect}.</p>
    </div>
  );
}
