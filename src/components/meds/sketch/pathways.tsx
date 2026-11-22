"use client";

import * as React from "react";
import { DA_PATHS } from "@/components/study/animations";
import { Choice, Fact, Figure, Say } from "@/components/sketch/ink";
import { PathwaysArt, type PathId } from "@/components/sketch/pathways-art";

type Block = "none" | "d2" | "d2-2a" | "partial";

/** How much dopamine still gets through: 1 is normal flow. */
function flow(id: PathId, block: Block): number {
  if (block === "none") return 1;
  if (block === "partial") return 0.55;
  if (block === "d2-2a" && id !== "mesolimbic") return 0.6;
  return 0.2;
}

export function PathwaysSketch({ medName, caption, atypical, partial = false, focus }: { medName: string; caption?: string; atypical: boolean; partial?: boolean; focus?: PathId }) {
  const own: Block = partial ? "partial" : atypical ? "d2-2a" : "d2";
  // A medicine that is not itself a dopamine medicine (trihexyphenidyl, shown on the movement pathway) never has its name on a dopamine button.
  const mine = !focus;
  const [block, setBlock] = React.useState<Block>(own);
  const [pick, setPick] = React.useState<PathId>(focus ?? "mesolimbic");
  const sel = DA_PATHS.find((p) => p.id === pick)!;
  const blocks: { id: Block; name: string }[] = [
    { id: "none", name: "No medicine" },
    { id: "d2", name: "D2 blocked" },
    { id: "d2-2a", name: "D2 and serotonin 2A blocked" },
    ...(partial ? [{ id: "partial" as const, name: "D2 partly switched on" }] : []),
  ];
  return (
    <Figure title={mine ? `${medName} on the four dopamine pathways` : "What an antipsychotic does on the dopamine pathways"}>
      <PathwaysArt pick={pick} flow={(id) => flow(id, block)} block={block} label={`Brain cut down the middle, front to the left, with the four dopamine pathways; ${sel.name} picked`} />
      <Choice label="Pathway" value={pick} onChange={setPick} options={DA_PATHS.map((p) => ({ id: p.id, name: p.name }))} />
      <Choice label="Medicine" value={block} onChange={setBlock} options={blocks.map((b) => ({ ...b, name: mine && b.id === own ? `${b.name} (${medName.toLowerCase()})` : b.name }))} />
      <Say live>
        <p>
          <span className="font-semibold">{sel.name}: </span>
          {sel.role}. {block === "none" ? "Dopamine flows normally." : <span className="font-semibold">{block === "partial" ? sel.partial : block === "d2-2a" ? sel.rescued : sel.blocked}</span>}
        </p>
      </Say>
      {caption ? <Fact>{caption}</Fact> : null}
    </Figure>
  );
}
