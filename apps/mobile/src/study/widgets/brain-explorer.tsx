/**
 * The brain explorer, native. The website's version is a 3D scene
 * (src/components/study/scenes/brain-explorer.tsx); its words (what each part
 * does, a signal's path step by step, healthy and damaged, the classic case,
 * the "where is the damage?" clues) are copied as data into
 * brain-explorer-data.json, and the parts are drawn on the brain map art.
 */
import * as React from "react";
import { View } from "react-native";

import type { BrainExplorerData } from "@/api/contract";
import { Chips, TabRow } from "@/ds/parts";
import { VerdictBand } from "@/ds/quiz";
import { T } from "@/ds/text";
import { Button } from "@/ds/button";
import { space } from "@/theme";
import { Rich } from "../rich";
import { BrainMapArt } from "./brainmap";
import DATA from "./brain-explorer-data.json";
import { StepPicker, StepText } from "./engine";
import { WidgetFrame, shuffle } from "./frame";

type Info = { id: string; name: string; does: string; act: string[]; hurt: string[]; damage: string; example: string; clue: string; bubble?: { ok: string; hurt: string } };
export const EXPLORER: Info[] = DATA as Info[];

function Explore({ list }: { list: Info[] }) {
  const [id, setId] = React.useState(list[0]!.id);
  const [hurt, setHurt] = React.useState(false);
  const [i, setI] = React.useState(0);
  const r = list.find((x) => x.id === id) ?? list[0]!;
  const lines = hurt ? r.hurt : r.act;
  const step = Math.min(i, lines.length - 1);
  return (
    <>
      <BrainMapArt focus={list.map((x) => x.id)} pick={r.id} onPick={(x) => (setId(x), setI(0))} />
      <Chips scroll label="Part of the brain" options={list.map((x) => ({ id: x.id, name: x.name.split(" (")[0]! }))} value={r.id} onChange={(x) => (setId(x), setI(0))} />
      <Rich text={`**${r.name}.** ${r.does}`} v="reading" />
      <TabRow
        tabs={[
          { id: "ok", name: "Working" },
          { id: "hurt", name: "Damaged" },
        ]}
        value={hurt ? "hurt" : "ok"}
        onChange={(v) => (setHurt(v === "hurt"), setI(0))}
      />
      <StepPicker steps={lines.map((_, n) => ({ name: `${hurt ? "Damaged" : "Working"}: step ${n + 1}` }))} i={step} onPick={setI} />
      <StepText text={lines[step] ?? ""} k={`${r.id}-${hurt}-${step}`} />
      {r.bubble ? <T v="small" tone="muted">They say: "{hurt ? r.bubble.hurt : r.bubble.ok}"</T> : null}
      {hurt ? <StepText text={`${r.damage}\n\n*${r.example}*`} k={`${r.id}-dmg`} /> : null}
    </>
  );
}

function Challenge({ list }: { list: Info[] }) {
  const order = React.useMemo(() => shuffle(list.map((_, n) => n), 13), [list]);
  const [k, setK] = React.useState(0);
  const [pick, setPick] = React.useState<string | null>(null);
  const [score, setScore] = React.useState(0);
  const r = list[order[k % order.length]!]!;
  return (
    <>
      <T v="small" tone="muted" num>
        Case {(k % order.length) + 1} of {order.length} · {score} right
      </T>
      <Rich text={r.clue} v="reading" />
      <T v="bodyStrong">Where is the damage?</T>
      <Chips label="Part of the brain" options={list.map((x) => ({ id: x.id, name: x.name.split(" (")[0]! }))} value={pick ?? ""} onChange={(x) => {
        if (pick) return;
        setPick(x);
        if (x === r.id) setScore((s) => s + 1);
      }} />
      {pick ? <VerdictBand right={pick === r.id} title={pick === r.id ? `Yes: ${r.name}` : `It is the ${r.name.toLowerCase()}`} why={r.damage} seed={k} /> : null}
      {pick ? <Button kind="quiet" label="Next case" onPress={() => (setK(k + 1), setPick(null))} testID="explorer-next" /> : null}
    </>
  );
}

export function BrainExplorerWidget({ d }: { d: BrainExplorerData }) {
  const list = d.focus?.length ? EXPLORER.filter((r) => d.focus!.includes(r.id)) : EXPLORER;
  const [mode, setMode] = React.useState<"explore" | "find">("explore");
  const use = list.length ? list : EXPLORER;
  return (
    <WidgetFrame label="Explore the brain" title={d.title} caption={d.caption} testID="w-brainexplorer">
      <TabRow
        tabs={[
          { id: "explore" as const, name: "Explore" },
          { id: "find" as const, name: "Where is the damage?" },
        ]}
        value={mode}
        onChange={setMode}
      />
      <View style={{ gap: space[4] }}>{mode === "explore" ? <Explore list={use} /> : <Challenge list={use.length > 2 ? use : EXPLORER} />}</View>
    </WidgetFrame>
  );
}
