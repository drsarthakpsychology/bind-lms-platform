import { Check } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";

import type { BuildData, CompareData, DecideData, ExperimentData, GuessData, MoodlineData, RevealData, SortData, ThoughtRecordData, TimelineData, WorkedData } from "@/api/contract";
import { Button } from "@/ds/button";
import { TabRow } from "@/ds/parts";
import { OptionRow, VerdictBand } from "@/ds/quiz";
import { Slider } from "@/ds/slider";
import { T } from "@/ds/text";
import { haptic } from "@/lib/haptics";
import { seedOf } from "@/sketch/ink";
import { layout, space, useTheme } from "@/theme";
import { Rich } from "../rich";
import { WidgetFrame, shuffle } from "./frame";
import { Moodline } from "./diagrams";

/* ------------------------------------------------------------------ guess */

export function GuessWidget({ d }: { d: GuessData }) {
  const mid = Math.round((d.min + d.max) / 2 / (d.step ?? 1)) * (d.step ?? 1);
  const [v, setV] = React.useState(mid);
  const [shown, setShown] = React.useState(false);
  const inRange = v >= d.answer[0] && v <= d.answer[1];
  const range = d.answer[0] === d.answer[1] ? `${d.answer[0]} ${d.unit}` : `${d.answer[0]} to ${d.answer[1]} ${d.unit}`;
  return (
    <WidgetFrame label="Guess" testID="w-guess">
      <Rich text={d.prompt} v="bodyStrong" />
      <T v="h2" num center>
        {v} {d.unit}
      </T>
      <Slider value={v} min={d.min} max={d.max} step={d.step ?? 1} onChange={setV} label={`Your guess in ${d.unit}`} format={(x) => `${x} ${d.unit}`} disabled={shown} testID="guess-slider" />
      {shown ? (
        <>
          <VerdictBand right={inRange} title={inRange ? `Yes: ${range}` : `It is ${range}`} why={d.reveal} />
          {d.clinician ? <Rich text={d.clinician} v="small" tone="muted" /> : null}
        </>
      ) : (
        <Button kind="quiet" label="Check my guess" onPress={() => setShown(true)} testID="guess-check" />
      )}
    </WidgetFrame>
  );
}

/* ----------------------------------------------------------------- decide */

export function DecideWidget({ d }: { d: DecideData }) {
  const [pick, setPick] = React.useState<number | null>(null);
  const best = d.choices.findIndex((x) => x.verdict === "best");
  const chosen = pick === null ? null : d.choices[pick]!;
  return (
    <WidgetFrame label="What would you do?" testID="w-decide">
      <Rich text={d.scene} v="reading" />
      <Rich text={d.ask} v="bodyStrong" />
      <View style={{ gap: space[2] }}>
        {d.choices.map((ch, i) => (
          <OptionRow key={i} index={i} text={ch.label} testID={`decide-${i}`} disabled={pick !== null} state={pick === null ? "idle" : i === best ? "right" : i === pick ? "wrong" : "dim"} onPress={() => setPick(i)} />
        ))}
      </View>
      {chosen ? <VerdictBand right={chosen.verdict === "best"} title={chosen.verdict === "best" ? "Best choice" : chosen.verdict === "ok" ? "Not wrong, not best" : "This could harm"} why={`${chosen.outcome} ${chosen.why}`} /> : null}
      {pick !== null ? <Button kind="text" label="Try again" onPress={() => setPick(null)} /> : null}
    </WidgetFrame>
  );
}

/* ------------------------------------------------------------------- sort */

export function SortWidget({ d }: { d: SortData }) {
  const order = React.useMemo(() => shuffle(d.items.map((_, i) => i), seedOf(d.prompt)), [d]);
  const [at, setAt] = React.useState(0);
  const [placed, setPlaced] = React.useState<{ item: number; bucket: number }[]>([]);
  const [last, setLast] = React.useState<{ right: boolean; why?: string } | null>(null);
  const current = order[at];
  const right = placed.filter((p) => d.items[p.item]!.bucket === p.bucket).length;
  const put = (bucket: number) => {
    if (current === undefined) return;
    const item = d.items[current]!;
    setPlaced((p) => [...p, { item: current, bucket }]);
    setLast({ right: item.bucket === bucket, why: item.bucket === bucket ? item.why : `It goes in ${d.buckets[item.bucket]}. ${item.why ?? ""}` });
    setAt((a) => a + 1);
  };
  return (
    <WidgetFrame label="Sort" testID="w-sort">
      <Rich text={d.prompt} v="bodyStrong" />
      {current !== undefined ? (
        <>
          <T v="small" tone="muted" num>
            {at + 1} of {d.items.length}
          </T>
          <Rich text={d.items[current]!.text} v="h3" />
          <View style={{ gap: space[2] }}>
            {d.buckets.map((b, i) => (
              <Button key={i} kind="quiet" label={b.replace(/[*`]/g, "")} onPress={() => put(i)} testID={`sort-bucket-${i}`} />
            ))}
          </View>
        </>
      ) : (
        <T v="h3" num>
          {right} of {d.items.length} sorted right
        </T>
      )}
      {last ? <VerdictBand right={last.right} why={last.why} seed={at} /> : null}
      {current === undefined ? (
        <Button
          kind="text"
          label="Sort again"
          onPress={() => {
            setAt(0);
            setPlaced([]);
            setLast(null);
          }}
        />
      ) : null}
    </WidgetFrame>
  );
}

/* ------------------------------------------------------------------ build */

export function BuildWidget({ d }: { d: BuildData }) {
  const c = useTheme();
  const [ticked, setTicked] = React.useState<Set<number>>(new Set());
  const [checked, setChecked] = React.useState(false);
  const present = d.symptoms.map((s, i) => (s.present ? i : -1)).filter((i) => i >= 0);
  const allRight = present.every((i) => ticked.has(i)) && [...ticked].every((i) => d.symptoms[i]!.present);
  return (
    <WidgetFrame label="Build the diagnosis" testID="w-build">
      <Rich text={d.vignette} v="reading" />
      <Rich text={`Rule: ${d.rule}`} v="small" tone="muted" />
      <View>
        {d.symptoms.map((s, i) => {
          const on = ticked.has(i);
          const mark = checked ? (s.present ? (on ? "right" : "missed") : on ? "wrong" : null) : null;
          return (
            <Pressable
              key={i}
              testID={`build-${i}`}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on, disabled: checked }}
              disabled={checked}
              onPress={() => {
                haptic.select();
                setTicked((t) => {
                  const n = new Set(t);
                  if (n.has(i)) n.delete(i);
                  else n.add(i);
                  return n;
                });
              }}
              style={{ minHeight: layout.row, flexDirection: "row", alignItems: "center", gap: space[3], borderTopWidth: i ? 1 : 0, borderColor: c.hairline, paddingVertical: space[2] }}
            >
              <View style={{ width: 24, height: 24, borderRadius: 6, borderWidth: 1.5, borderColor: on ? c.ink : c.cardLine, backgroundColor: on ? c.ink : "transparent", alignItems: "center", justifyContent: "center" }}>{on ? <Check size={16} color={c.bg} strokeWidth={3} /> : null}</View>
              <View style={{ flex: 1, gap: 2 }}>
                <Rich text={s.label} v="bodyStrong" />
                {checked && s.why ? <Rich text={s.why} v="small" tone="muted" /> : null}
              </View>
              {mark ? (
                <T v="small" tone={mark === "right" ? "link" : "danger"}>
                  {mark === "right" ? "Yes" : mark === "missed" ? "Missed" : "Not present"}
                </T>
              ) : s.core && checked ? (
                <T v="small" tone="muted">
                  Core
                </T>
              ) : null}
            </Pressable>
          );
        })}
      </View>
      {checked ? <VerdictBand right={allRight} title={allRight ? "You found them all" : "Look again at the marks"} why={d.verdict} /> : <Button kind="quiet" label="Check" disabled={!ticked.size} onPress={() => setChecked(true)} testID="build-check" />}
    </WidgetFrame>
  );
}

/* --------------------------------------------------------------- moodline */

export function MoodlineWidget({ d }: { d: MoodlineData }) {
  const [pick, setPick] = React.useState<number | null>(null);
  return (
    <WidgetFrame label="Read the chart" testID="w-moodline">
      <Rich text={d.prompt} v="bodyStrong" />
      <Moodline series={d.series} labels={d.labels} />
      <View style={{ gap: space[2] }}>
        {d.options.map((o, i) => (
          <OptionRow key={i} index={i} text={o} disabled={pick !== null} state={pick === null ? "idle" : i === d.answer ? "right" : i === pick ? "wrong" : "dim"} onPress={() => setPick(i)} />
        ))}
      </View>
      {pick !== null ? <VerdictBand right={pick === d.answer} why={d.why} /> : null}
    </WidgetFrame>
  );
}

/* ----------------------------------------------------------------- worked */

export function WorkedWidget({ d }: { d: WorkedData }) {
  const c = useTheme();
  const [shown, setShown] = React.useState(0);
  const [mine, setMine] = React.useState(0);
  const steps = d.steps;
  const turn = d.yourTurn ?? [];
  return (
    <WidgetFrame label="Worked example" title={d.title} testID="w-worked">
      {steps.slice(0, shown + 1).map((s, i) => (
        <View key={i} style={{ gap: space[1], borderLeftWidth: 2, borderColor: c.cardLine, paddingLeft: space[3] }}>
          <Rich text={`${i + 1}. ${s.q}`} v="bodyStrong" />
          {i < shown || shown === steps.length ? <Rich text={s.a} v="reading" tone="muted" /> : null}
        </View>
      ))}
      {shown < steps.length ? <Button kind="quiet" label={shown === steps.length - 1 ? "Show the answer" : "Show this step"} onPress={() => setShown((n) => n + 1)} testID="worked-next" /> : null}
      {shown === steps.length && turn.length ? (
        <View style={{ gap: space[3] }}>
          <T v="h3">Your turn</T>
          {turn.map((s, i) => (
            <View key={i} style={{ gap: space[1] }}>
              <Rich text={s.q} v="bodyStrong" />
              {i < mine ? <Rich text={s.a} v="reading" tone="muted" /> : i === mine ? <Button kind="text" label="Show the answer" onPress={() => setMine((n) => n + 1)} /> : null}
            </View>
          ))}
        </View>
      ) : null}
    </WidgetFrame>
  );
}

/* ----------------------------------------------------------------- reveal */

export function RevealWidget({ d }: { d: RevealData }) {
  const [open, setOpen] = React.useState(false);
  return (
    <WidgetFrame label="Say it first" testID="w-reveal">
      <Rich text={d.prompt} v="bodyStrong" />
      {open ? <Rich text={d.answer} v="reading" /> : <Button kind="quiet" label="Show the answer" onPress={() => setOpen(true)} testID="reveal-show" />}
    </WidgetFrame>
  );
}

/* --------------------------------------------------------------- timeline */

export function TimelineWidget({ d }: { d: TimelineData }) {
  const order = React.useMemo(() => shuffle(d.events.map((_, i) => i), seedOf(d.prompt)), [d]);
  const [seq, setSeq] = React.useState<number[]>([]);
  const done = seq.length === d.events.length;
  const right = done && seq.every((v, i) => v === i);
  return (
    <WidgetFrame label="Put in order" testID="w-timeline">
      <Rich text={d.prompt} v="bodyStrong" />
      <T v="small" tone="muted">
        Tap them from first to last.
      </T>
      <View style={{ gap: space[2] }}>
        {order.map((i) => {
          const pos = seq.indexOf(i);
          return (
            <OptionRow
              key={i}
              index={pos >= 0 ? pos : 25}
              text={d.events[i]!.label + (done && d.events[i]!.when ? ` (${d.events[i]!.when})` : "")}
              state={done ? (seq[i] === i || pos === i ? "right" : "wrong") : pos >= 0 ? "picked" : "idle"}
              disabled={done || pos >= 0}
              onPress={() => setSeq((s) => [...s, i])}
            />
          );
        })}
      </View>
      {done ? <VerdictBand right={right} title={right ? "That is the order" : "Not quite in order"} why={d.why} /> : null}
      {seq.length ? <Button kind="text" label="Start again" onPress={() => setSeq([])} /> : null}
    </WidgetFrame>
  );
}

/* ---------------------------------------------------------------- compare */

export function CompareWidget({ d }: { d: CompareData }) {
  const [side, setSide] = React.useState<"a" | "b">("a");
  const s = d[side];
  return (
    <WidgetFrame label="Compare" title={d.title} caption={d.caption} testID="w-compare">
      <TabRow
        tabs={[
          { id: "a" as const, name: d.a.label.replace(/[*`]/g, "") },
          { id: "b" as const, name: d.b.label.replace(/[*`]/g, "") },
        ]}
        value={side}
        onChange={setSide}
      />
      <View style={{ gap: space[2] }}>
        {s.points.map((p, i) => (
          <View key={`${side}${i}`} style={{ flexDirection: "row", gap: space[3] }}>
            <T v="reading" tone="muted">
              •
            </T>
            <Rich text={p} v="reading" style={{ flex: 1 }} />
          </View>
        ))}
      </View>
      <Rich text={s.summary} v="bodyStrong" />
    </WidgetFrame>
  );
}

/* ------------------------------------------------------------- experiment */

export function ExperimentWidget({ d }: { d: ExperimentData }) {
  const c = useTheme();
  const max = d.max ?? Math.max(...d.conditions.map((x) => x.value)) * 1.25;
  const [guess, setGuess] = React.useState(d.conditions.map(() => Math.round(max / 2)));
  const [shown, setShown] = React.useState(false);
  return (
    <WidgetFrame label="Predict the result" title={d.title} testID="w-experiment">
      <Rich text={d.question} v="bodyStrong" />
      {d.conditions.map((x, i) => (
        <View key={i} style={{ gap: space[1] }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: space[3] }}>
            <Rich text={x.label} v="small" style={{ flex: 1 }} />
            <T v="small" num tone="muted">
              {shown ? `You: ${guess[i]} · Real: ${x.value}` : `${guess[i]} ${d.unit}`}
            </T>
          </View>
          {shown ? (
            <View style={{ height: 10, borderRadius: 5, backgroundColor: c.hairline }}>
              <View style={{ width: `${Math.min(100, (x.value / max) * 100)}%`, height: 10, borderRadius: 5, backgroundColor: c.dark ? c.primary : c.ink }} />
            </View>
          ) : (
            <Slider value={guess[i]!} min={0} max={Math.round(max)} onChange={(v) => setGuess((g) => g.map((old, j) => (j === i ? v : old)))} label={`Your prediction for ${x.label}`} />
          )}
          {shown && x.note ? <Rich text={x.note} v="small" tone="muted" /> : null}
        </View>
      ))}
      {shown ? d.why ? <Rich text={d.why} v="reading" /> : null : <Button kind="quiet" label="Show the real result" onPress={() => setShown(true)} />}
    </WidgetFrame>
  );
}

/* ---------------------------------------------------------- thoughtrecord */

export function ThoughtRecordWidget({ d }: { d: ThoughtRecordData }) {
  const [step, setStep] = React.useState(0);
  const [trap, setTrap] = React.useState<number | null>(null);
  const rows: [string, React.ReactNode][] = [
    ["Situation", <Rich key="s" text={d.situation} v="reading" />],
    ["Automatic thought", <Rich key="t" text={`"${d.thought}"`} v="reading" />],
    ["Feeling", <T key="e">{d.emotion}</T>],
  ];
  return (
    <WidgetFrame label="Thought record" testID="w-thoughtrecord">
      {rows.slice(0, Math.min(step + 1, rows.length)).map(([k, v]) => (
        <View key={k} style={{ gap: space[1] }}>
          <T v="caption" tone="muted">
            {k.toUpperCase()}
          </T>
          {v}
        </View>
      ))}
      {step < 2 ? <Button kind="quiet" label="Next" onPress={() => setStep((s) => s + 1)} /> : null}
      {step >= 2 ? (
        <View style={{ gap: space[2] }}>
          <T v="bodyStrong">Which thinking trap is this?</T>
          {d.traps.map((t, i) => (
            <OptionRow key={i} index={i} text={t.label} disabled={trap !== null} state={trap === null ? "idle" : t.right ? "right" : i === trap ? "wrong" : "dim"} onPress={() => setTrap(i)} />
          ))}
          {trap !== null ? <VerdictBand right={!!d.traps[trap]!.right} why={d.traps[trap]!.why} /> : null}
        </View>
      ) : null}
      {trap !== null && step === 2 ? <Button kind="quiet" label="Weigh the evidence" onPress={() => setStep(3)} /> : null}
      {step >= 3 ? (
        <>
          <View style={{ gap: space[1] }}>
            <T v="caption" tone="muted">
              EVIDENCE FOR
            </T>
            {d.forEvidence.map((e, i) => (
              <Rich key={i} text={`• ${e}`} v="reading" />
            ))}
          </View>
          <View style={{ gap: space[1] }}>
            <T v="caption" tone="muted">
              EVIDENCE AGAINST
            </T>
            {d.againstEvidence.map((e, i) => (
              <Rich key={i} text={`• ${e}`} v="reading" />
            ))}
          </View>
          {step === 3 ? <Button kind="quiet" label="A balanced thought" onPress={() => setStep(4)} /> : null}
        </>
      ) : null}
      {step >= 4 ? (
        <View style={{ gap: space[1] }}>
          <T v="caption" tone="link">
            BALANCED THOUGHT
          </T>
          <Rich text={d.balanced} v="reading" />
        </View>
      ) : null}
    </WidgetFrame>
  );
}

