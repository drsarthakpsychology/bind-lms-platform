"use client";

import * as React from "react";
import { Arrow, C, Callout, Choice, E, Fact, Figure, Label, L, P, R, Say, Sheet } from "./ink";

/** What can sit in a receptor, and what each does to its signal. */
export const LIGANDS = [
  { id: "none", name: "Nothing bound", signal: 0.15, text: "Many receptors give a small background signal on their own." },
  { id: "full", name: "Full agonist", signal: 1, text: "Fits and switches the receptor fully on: the biggest signal. The body's own messenger usually acts like this." },
  { id: "partial", name: "Partial agonist", signal: 0.5, text: "Fits but switches the receptor only half on. When the natural messenger is low it raises the signal; when it is high it competes and lowers it." },
  { id: "antagonist", name: "Antagonist", signal: 0.15, text: "Sits in the slot without switching anything on, and keeps the natural messenger out. The signal stays at background." },
  { id: "inverse", name: "Inverse agonist", signal: 0.02, text: "Binds and pushes the receptor below its background level: the signal falls under baseline." },
] as const;
export type LigandId = (typeof LIGANDS)[number]["id"];

/** The word next to whatever sits in the receptor. */
const LIG_WORD: Record<Exclude<LigandId, "none">, string> = { full: "agonist", partial: "partial agonist", antagonist: "blocker", inverse: "inverse agonist" };

const PICK: Record<string, LigandId> = { "Full agonist": "full", "Partial agonist": "partial", Antagonist: "antagonist", "Inverse agonist": "inverse" };

/** A row of membrane fat molecules: round heads with two tails, skipping the receptor's place. */
function membrane() {
  const heads: string[] = [];
  const tails: string[] = [];
  for (let x = 10; x <= 262; x += 14) {
    if (x > 92 && x < 196) continue;
    for (const [hy, dir] of [[124, 1], [162, -1]] as const) {
      heads.push(`M${x - 5} ${hy} a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0`);
      tails.push(`M${x - 2} ${hy + dir * 5} q-2 ${dir * 6} 0 ${dir * 12} M${x + 2} ${hy + dir * 5} q2 ${dir * 6} 0 ${dir * 12}`);
    }
  }
  return { heads: heads.join(" "), tails: tails.join(" ") };
}
const MEM = membrane();

export function ReceptorSketch({ medName, receptor, pick, note }: { medName: string; receptor: string; pick: string; note: string }) {
  const own = PICK[pick] ?? "antagonist";
  const [id, setId] = React.useState<LigandId>(own);
  const lig = LIGANDS.find((x) => x.id === id)!;
  const on = lig.signal;
  const level = 196 - on * 150;
  const body = id === "full" ? C.lime : id === "partial" ? C.lime : C.blue;
  return (
    <Figure title={`${medName} at the ${receptor} receptor`}>
      <Sheet name="receptor" w={360} h={240} label={`${lig.name} at the ${receptor} receptor: signal ${Math.round(on * 100)} percent`}>
        <Label x={14} y={28}>outside the cell</Label>
        <Label x={14} y={208}>inside the cell</Label>
        {/* the cell membrane */}
        <P k="mem-tails" d={MEM.tails} stroke={C.soft} sw={1} single rough={0.5} />
        <P k="mem-heads" d={MEM.heads} stroke={C.ink} sw={1} fill={C.wash} fillStyle="solid" rough={0.6} />
        {/* the receptor protein, with its binding pocket on top */}
        <P
          k="rec-body"
          d="M104 98 C104 82 116 76 128 80 L132 104 Q146 114 160 104 L164 80 C176 76 188 82 188 98 L190 176 C190 194 170 200 146 200 C122 200 102 194 102 176 Z"
          stroke={C.ink}
          sw={2}
          fill={body}
          gap={id === "partial" ? 9 : id === "full" ? 4 : 7}
          fw={id === "full" ? 2 : 1}
        />
        <P k="rec-helix" d="M118 112 q8 14 0 28 q-8 14 0 28 M174 112 q8 14 0 28 q-8 14 0 28" stroke={C.ink} sw={1.2} single rough={0.6} />
        {/* what is bound */}
        {id === "full" ? <E k="lig-full" cx={146} cy={98} w={26} h={24} fill={C.lime} fillStyle="solid" sw={2} /> : null}
        {id === "partial" ? <E k="lig-part" cx={146} cy={98} w={26} h={24} fill={C.lime} gap={6} sw={2} /> : null}
        {id === "antagonist" || id === "inverse" ? (
          <R k={`lig-${id}`} x={128} y={70} w={36} h={30} fill={id === "inverse" ? C.red : C.soft} gap={4} sw={2} />
        ) : null}
        {id === "antagonist" || id === "inverse" ? (
          <>
            <E k="msg" cx={232} cy={58} w={20} h={18} fill={C.lime} fillStyle="solid" sw={1.6} />
            <Arrow k="msg-bounce" from={[220, 66]} to={[180, 78]} bend={-0.25} stroke={C.soft} sw={1.4} dash="4 4" />
            <P k="msg-x" d="M196 54 l10 10 M206 54 l-10 10" stroke={C.red} sw={2.2} single />
          </>
        ) : null}
        {/* the signal inside the cell */}
        {on > 0.2
          ? [-1, 0, 1].slice(0, on > 0.7 ? 3 : 2).map((s) => <L key={s} k={`spark${s}`} x1={146 + s * 16} y1={206} x2={146 + s * 22} y2={206 + 12 * on} stroke={C.blue} sw={2.4} />)
          : null}
        {/* what each thing is */}
        {id !== "none" ? (
          <Callout k={`l-lig-${id}`} x={14} y={id === "antagonist" || id === "inverse" ? 74 : 80} lines={[LIG_WORD[id]]} to={id === "antagonist" || id === "inverse" ? [126, 80] : [132, 96]} size={14} />
        ) : null}
        {id === "antagonist" || id === "inverse" ? <Label x={232} y={34} size={13} anchor="middle" bold={false}>messenger</Label> : null}
        {/* the signal meter */}
        <R k="meter" x={292} y={44} w={40} h={154} sw={2} />
        <R k={`meter-fill-${id}`} x={295} y={level} w={34} h={196 - level} fill={C.blue} stroke="none" gap={3.5} fw={1.6} />
        <L k="meter-base" x1={286} y1={173.5} x2={338} y2={173.5} sw={1.4} dash="5 4" single />
        <Label x={312} y={30} anchor="middle">signal</Label>
        <Label x={282} y={178} anchor="end" size={12} bold={false}>background</Label>
        <Label x={146} y={232} anchor="middle" size={receptor.length > 22 ? 12 : 14}>{receptor}</Label>
      </Sheet>
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
