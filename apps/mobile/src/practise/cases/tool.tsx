import { useLocalSearchParams } from "expo-router";
import { Check } from "lucide-react-native";
import * as React from "react";
import { AppState, Pressable, View } from "react-native";
import Animated, { FadeInRight, useReducedMotion } from "react-native-reanimated";

import { Button, EmptyState, Field, ProgressLine, Row, RowList, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { Rich } from "@/study/rich";
import { fonts, layout, motion, space, useTheme } from "@/theme";
import { noteAnswers, saveCase, sendRecord, useTool } from "../api";
import type { CaseMark, PractiseRecordKind } from "../contract";
import { formatDomainKey } from "../tools/mse";
import { API_TOOL, arrange, buildDefs, countsRight, grade, HISTORY_TOOL, PROGRESS_TOOL, recordsFor, type Def } from "../tools/engine";
import { Feel, Flip, Rise, Stagger } from "../fx";
import { caseTool } from "../catalog";
import { EndPanel, EndThumb, FrameError, FrameLoading, GameFrame, HudLine, StepStrip, Verdict } from "../frame";
import { Story, Tag, Tile, AnswerRow } from "../parts";
import { useReactions } from "../reactions";
import type { ToolId, ToolReveal, ToolStep } from "../types";

const HOW: Record<ToolId, string[]> = {
  wwyd: ["A patient says something hard. Choose what you would say or do.", "Each choice has a consequence. There is a best one, an acceptable one and one that harms."],
  "say-it": ["Read what the family or patient says in everyday words.", "Pick the word you would write in the case sheet."],
  judgment: ["You have a working diagnosis. A new fact arrives.", "Say how it changes the odds, from much less likely to much more likely. You are scored against a panel of clinicians."],
  ethics: ["A situation with a legal or ethical catch.", "Choose what to do, then read the law behind it."],
  landmark: ["Read a famous case: what was believed then, and what holds up now.", "Then answer a few questions about it."],
  osce: ["One task, out loud, against the clock. Start the clock and say it as if the patient is there.", "When the time is up, tick what you covered. The items worth two count most.", "Then give your overall call. It is saved for your own history."],
  "two-minute": ["A patient, a few lines, two minutes.", "Pick the most likely diagnosis before the clock runs out."],
  formulation: ["Sort each factor into the 5Ps: presenting, predisposing, precipitating, perpetuating, protective.", "Some factors belong nowhere: leave them out.", "Then write the story in your own words and compare it with the model."],
  "out-of-depth": ["A case that may be beyond your scope.", "Decide what to do first, and who else needs to know."],
  "weak-spots": ["Questions picked from what you miss most.", "One at a time; the why comes after each."],
  "mse-trainer": ["Level 1: describe what you see and hear, with no labels.", "Level 2: pick the words for each domain.", "Level 4: the full MSE of one case in ten minutes, scored per domain.", "The small things: moments novices miss. Say what it means, then reveal the read."],
};

/** Milliseconds since `t` (an event-time read, never during render). */
const since = (t: number) => Date.now() - t;

/** One shuffle seed per app session: a case keeps its option order while it is open. */
const SEED = String(Math.floor(Math.random() * 1e9));

/** A case tool: first its cases (Done, New, This week, Carry on), then one case in steps. */
export function ToolCaseScreen({ tool }: { tool: ToolId }) {
  const entry = caseTool(tool);
  const params = useLocalSearchParams<{ item?: string }>();
  const [item, setItem] = React.useState<string | null>(params.item ?? null);
  const [nonce, setNonce] = React.useState(0);
  const q = useTool(API_TOOL[tool]);
  const title = entry?.title ?? q.data?.title ?? "Practice";
  const list = React.useMemo(() => (q.data ? arrange(buildDefs(tool, q.data.data, SEED), q.data.cases) : null), [q.data, tool]);
  if (q.isError) return <FrameError title={title} error={q.error} onRetry={() => void q.refetch()} />;
  if (!list || !q.data) return <FrameLoading title={title} />;
  const howTo = q.data.howTo.length ? q.data.howTo : HOW[tool];
  const def = item ? list.find((x) => x.def.id === item)?.def : null;
  if (def) return <ToolRun key={`${def.id}-${nonce}`} tool={tool} def={def} howTo={howTo} records={q.data.records} back={() => setItem(null)} again={() => setNonce((n) => n + 1)} />;
  return <ToolPicker tool={tool} title={title} line={entry?.line ?? ""} howTo={howTo} list={list} recycleLine={q.data.cases?.recycleLine ?? null} onPick={setItem} />;
}

function ToolPicker({ tool, title, line, howTo, list, recycleLine, onPick }: { tool: ToolId; title: string; line: string; howTo: string[]; list: { def: Def; mark: CaseMark | null }[]; recycleLine: string | null; onPick: (id: string) => void }) {
  const first = list.find((i) => i.mark === "started") ?? list.find((i) => i.mark !== "done") ?? list[0];
  return (
    <GameFrame testID={`tool-${tool}`} title="" howTo={howTo} thumb={first ? <Button label={first.mark === "started" ? "Carry on" : list.length === 1 ? "Start" : "Start the next case"} onPress={() => onPick(first.def.id)} testID="tool-start" /> : undefined}>
      <View style={{ gap: space[2], paddingTop: space[4] }}>
        <T v={title.length > 22 ? "h1" : "display"}>{title}</T>
        <T tone="muted">{line}</T>
        {recycleLine ? (
          <T v="small" tone="link">
            {recycleLine}
          </T>
        ) : null}
      </View>
      {list.length ? (
        <Stagger>
          <RowList>
            {list.map(({ def, mark }) => (
              <Row key={def.id} testID={`tool-item-${def.id}`} title={def.title} meta={def.line ?? undefined} trailing={mark ? <Tag tag={mark} /> : undefined} onPress={() => onPick(def.id)} />
            ))}
          </RowList>
        </Stagger>
      ) : (
        <EmptyState mood="sleepy" title={tool === "weak-spots" ? "No weak spots yet" : "Nothing here yet"} body={tool === "weak-spots" ? "Do a practice interview first. Your drill is made from what you miss there." : "New cases are on their way."} testID="tool-empty" />
      )}
    </GameFrame>
  );
}

function ToolRun({ tool, def, howTo, records, back, again }: { tool: ToolId; def: Def; howTo: string[]; records: PractiseRecordKind[]; back: () => void; again: () => void }) {
  const reduce = useReducedMotion();
  const react = useReactions();
  const entry = caseTool(tool);
  const [at, setAt] = React.useState(def.start ?? 0);
  const [reveal, setReveal] = React.useState<ToolReveal | null>(null);
  const [marks, setMarks] = React.useState<("ok" | "miss" | null)[]>([]);
  const [scores, setScores] = React.useState<number[]>([]);
  const [picked, setPicked] = React.useState<unknown>(null);
  const [done, setDone] = React.useState(false);
  const answers = React.useRef<{ step: number; answer: unknown; ms: number }[]>([]);
  const shownAt = React.useRef(0);
  React.useEffect(() => {
    shownAt.current = Date.now();
  }, [at]);
  const title = entry?.title ?? "Practice";
  const key = def.steps[at];
  const total = def.steps.length;
  const graded = def.steps.filter((k) => k.pub.kind !== "read" && !k.selfCheck).length;
  const pct = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) : 100;

  if (done || !key) {
    return (
      <GameFrame testID="tool-end" title={def.title} thumb={<EndThumb again={back} againLabel="Choose another case" extra={{ label: "Do this one again", onPress: again }} />}>
        <EndPanel kicker="Case done" score={graded ? `${pct}%` : "Done"} right={graded ? pct : 1} total={graded ? 100 : 1}>
          <Story kicker="Take away">
            <Rich text={def.takeaway} v="reading" />
          </Story>
        </EndPanel>
      </GameFrame>
    );
  }
  const step = key.pub;

  const finish = () => {
    const ptool = PROGRESS_TOOL[tool];
    if (ptool) saveCase(ptool, def.id, null);
    if (def.id === "small-things") saveCase("mse-small", "walk", null);
    for (const r of recordsFor(tool, def, answers.current, records, Date.now())) sendRecord(r.kind, r.body);
    setDone(true);
  };
  const answer = (a: unknown) => {
    if (reveal) return;
    const r = grade(key, a);
    answers.current.push({ step: at, answer: a, ms: since(shownAt.current) });
    if (step.kind === "read") {
      next();
      return;
    }
    setPicked(a);
    setReveal(r);
    const right = countsRight(r);
    if (!r.selfCheck) {
      setScores((s) => [...s, r.score]);
      react.answer(r.score >= 0.75);
    } else haptic.select();
    setMarks((m) => [...m, r.selfCheck ? null : r.score >= 0.999 ? "ok" : r.score > 0 ? null : "miss"]);
    noteAnswers(HISTORY_TOOL[tool], [{ item: key.item ?? def.id, correct: right }]);
  };
  const next = () => {
    setReveal(null);
    setPicked(null);
    if (at + 1 >= total) finish();
    else {
      // The small things walk keeps its place, as the website's (saveCaseProgress("mse-small", "walk", { at })).
      const walk = def.steps[at + 1]?.raw?.walk;
      if (def.id === "small-things" && typeof walk === "string") saveCase("mse-small", "walk", { at: walk });
      setAt(at + 1);
    }
  };
  const hud = (
    <View style={{ gap: space[2] }}>
      <StepStrip at={at} total={total} marks={marks} />
      <HudLine left={total > 1 ? `${title} · step ${at + 1} of ${total}` : title} />
    </View>
  );
  return (
    <GameFrame testID={`tool-run-${tool}`} title={def.title} howTo={howTo} hud={hud} confirmLeave thumb={reveal ? <Button label={at + 1 < total ? (step.kind === "moment" ? "Next observation" : "Next") : "Finish the case"} onPress={next} testID="tool-next" /> : undefined}>
      {at === 0 ? (
        <Story kicker={def.setting ?? undefined}>
          <Rich text={def.intro} v="reading" />
        </Story>
      ) : null}
      <Animated.View key={at} entering={reduce ? undefined : FadeInRight.duration(motion.state)} style={{ gap: space[4] }}>
        <StepView step={step} reveal={reveal} picked={picked} disabled={false} onAnswer={answer} />
        {reveal ? <RevealBand step={step} reveal={reveal} seed={at} /> : null}
      </Animated.View>
    </GameFrame>
  );
}

function RevealBand({ step, reveal, seed }: { step: ToolStep; reveal: ToolReveal; seed: number }) {
  if (step.kind === "moment") {
    return (
      <View style={{ gap: space[3] }} testID="tool-moment-read">
        <Story kicker="What it means">
          <Rich text={reveal.why} v="reading" />
        </Story>
        {reveal.more ? (
          <Story kicker="The move">
            <Rich text={reveal.more} v="reading" />
          </Story>
        ) : null}
      </View>
    );
  }
  if (step.kind === "rate") {
    return (
      <Rise>
        <T v="bodyStrong" testID="tool-rated">
          {reveal.why}
        </T>
      </Rise>
    );
  }
  if (reveal.domains) return <Lights reveal={reveal} seed={seed} />;
  if (reveal.selfCheck) {
    return (
      <View style={{ gap: space[3] }} testID="tool-compare">
        {reveal.observe ? <ObserveLine o={reveal.observe} /> : null}
        <Story kicker="Compare with yours">
          <Rich text={reveal.why} v="reading" />
          {reveal.more ? <Rich text={reveal.more} v="small" /> : null}
        </Story>
        {reveal.diff ? <DiffWords diff={reveal.diff} /> : null}
      </View>
    );
  }
  const v = reveal.verdict;
  const title = v === "best" ? "Best choice" : v === "ok" ? "Acceptable, not best" : v === "harm" ? "This could harm" : step.kind === "scale" ? (reveal.score >= 1 ? "Same as the panel" : reveal.score > 0 ? "Close to the panel" : "Far from the panel") : undefined;
  const right = v ? v === "best" : reveal.score >= 0.75;
  const pct = step.kind === "buckets" || step.kind === "checklist" ? ` ${Math.round(reveal.score * 100)}% right.` : "";
  return (
    <View style={{ gap: space[3] }}>
      <Verdict right={right} partial={!right && reveal.score > 0} title={title ?? (pct ? `${Math.round(reveal.score * 100)}%` : undefined)} why={reveal.why} seed={seed} />
      {reveal.more ? (
        <Story kicker="The law">
          <Rich text={reveal.more} v="small" />
        </Story>
      ) : null}
    </View>
  );
}

function StepView({ step, reveal, picked, disabled, onAnswer }: { step: ToolStep; reveal: ToolReveal | null; picked: unknown; disabled: boolean; onAnswer: (a: unknown) => void }) {
  const c = useTheme();
  switch (step.kind) {
    case "pick":
      return (
        <View style={{ gap: space[3] }}>
          <Rich text={step.ask} v="h3" />
          {step.options.map((o, j) => (
            <View key={j} style={{ gap: space[1] }}>
              <AnswerRow index={j} text={o} testID={`tool-option-${j}`} disabled={!!reveal || disabled} state={!reveal ? "idle" : reveal.right.includes(j) ? "right" : j === picked ? "wrong" : "dim"} onPress={() => onAnswer(j)} />
              {reveal?.notes?.[j] && !reveal.right.includes(j) ? (
                <T v="small" tone="muted" style={{ paddingHorizontal: space[4] }}>
                  {reveal.notes[j]}
                </T>
              ) : null}
            </View>
          ))}
        </View>
      );
    case "multi":
    case "checklist":
      return <Ticks step={step} reveal={reveal} disabled={disabled} onAnswer={onAnswer} />;
    case "scale":
      return <Scale step={step} reveal={reveal} picked={picked as number | null} disabled={disabled} onAnswer={onAnswer} />;
    case "buckets":
      return <Buckets step={step} reveal={reveal} disabled={disabled} onAnswer={onAnswer} />;
    case "write":
      return <Write step={step} reveal={reveal} onAnswer={onAnswer} />;
    case "rate":
      return <Rate step={step} reveal={reveal} picked={picked as number | null} onAnswer={onAnswer} />;
    case "fullmse":
      return <FullMse step={step} reveal={reveal} onAnswer={onAnswer} />;
    case "moment":
      return (
        <View style={{ gap: space[3] }}>
          <T v="caption" tone="muted">
            {step.skill.toUpperCase()}
          </T>
          <Flip
            flipped={!!reveal}
            front={
              <View style={{ borderWidth: 2, borderColor: c.ink, borderRadius: layout.radius, padding: space[5], backgroundColor: c.card }}>
                <T v="h3">{`\u201c${step.moment}\u201d`}</T>
              </View>
            }
            back={
              <View style={{ borderWidth: 2, borderColor: c.ink, borderRadius: layout.radius, padding: space[5], backgroundColor: c.tint }}>
                <T v="h3">{`\u201c${step.moment}\u201d`}</T>
              </View>
            }
          />
          {!reveal ? <Button label="Reveal the read" onPress={() => onAnswer(null)} disabled={disabled} testID="tool-moment-reveal" /> : null}
        </View>
      );
    case "read":
      return (
        <View style={{ gap: space[3] }}>
          <T v="h3">{step.title}</T>
          {step.body.split("\n\n").map((p, k) => (
            <Rich key={k} text={p} v="reading" />
          ))}
          <Button label="Go to the questions" onPress={() => onAnswer(null)} disabled={disabled} testID="tool-read-on" />
        </View>
      );
  }
}

function Ticks({ step, reveal, disabled, onAnswer }: { step: Extract<ToolStep, { kind: "multi" | "checklist" }>; reveal: ToolReveal | null; disabled: boolean; onAnswer: (a: unknown) => void }) {
  const c = useTheme();
  const items = step.kind === "multi" ? step.options : step.items;
  const [on, setOn] = React.useState<number[]>([]);
  const [left, setLeft] = React.useState(step.kind === "checklist" ? step.seconds : 0);
  const [running, setRunning] = React.useState(false);
  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((l) => (l <= 1 ? (clearInterval(id), 0) : l - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);
  const total = step.kind === "checklist" ? Math.max(1, step.seconds || 0) : 1;
  return (
    <View style={{ gap: space[3] }}>
      <Rich text={step.ask} v="h3" />
      {step.kind === "checklist" ? (
        <View style={{ gap: space[2] }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <T style={{ fontFamily: fonts.pixelDigits, fontSize: 32, lineHeight: 40, color: c.ink }} num accessibilityLabel={`${left} seconds left`}>
              {`${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`}
            </T>
            {!reveal ? <Button kind="quiet" full={false} label={running ? "Pause" : left < total ? "Carry on" : "Start the clock"} onPress={() => setRunning((r) => !r)} testID="tool-clock" /> : null}
          </View>
          <ProgressLine value={(left / total) * 100} height={4} />
        </View>
      ) : null}
      {items.map((t, j) => {
        const ticked = on.includes(j);
        const fair = !!reveal?.notes?.[j];
        const st = !reveal ? (ticked ? "on" : "idle") : reveal.right.includes(j) ? (ticked ? "right" : "wrong") : fair ? (ticked ? "right" : "dim") : ticked ? "wrong" : "dim";
        return (
          <Tile key={j} testID={`tool-tick-${j}`} state={st} disabled={!!reveal || disabled} accessibilityLabel={`${t}${ticked ? ", ticked" : ""}`} onPress={() => setOn((o) => (o.includes(j) ? o.filter((x) => x !== j) : [...o, j]))}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
              <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: c.ink, backgroundColor: ticked ? c.ink : "transparent", alignItems: "center", justifyContent: "center" }}>{ticked ? <Check size={14} color={c.bg} strokeWidth={3} /> : null}</View>
              <T style={{ flex: 1 }}>{t}</T>
              {reveal?.notes?.[j] ? (
                <T v="caption" tone="link">
                  {reveal.notes[j]}
                </T>
              ) : null}
            </View>
          </Tile>
        );
      })}
      {!reveal ? <Button label={step.kind === "checklist" ? "I'm done" : "Check"} disabled={disabled || (step.kind === "multi" && !on.length)} onPress={() => { setRunning(false); onAnswer([...on].sort((a, b) => a - b)); }} testID="tool-submit" /> : null}
    </View>
  );
}

function Scale({ step, reveal, picked, disabled, onAnswer }: { step: Extract<ToolStep, { kind: "scale" }>; reveal: ToolReveal | null; picked: number | null; disabled: boolean; onAnswer: (a: unknown) => void }) {
  const c = useTheme();
  return (
    <View style={{ gap: space[4] }}>
      <View style={{ gap: space[1] }}>
        <T v="caption" tone="muted">
          IF YOU WERE THINKING
        </T>
        <T v="h3">{step.hypothesis}</T>
      </View>
      <View style={{ gap: space[1] }}>
        <T v="caption" tone="muted">
          AND THEN YOU LEARN
        </T>
        <T v="reading">{step.fact}</T>
      </View>
      <T v="bodyStrong">{step.ask}</T>
      <View style={{ flexDirection: "row", gap: space[1] }} accessibilityRole="radiogroup">
        {step.labels.map((l, j) => {
          const right = reveal?.right.includes(j);
          const mine = picked === j;
          return (
            <Pressable
              key={j}
              accessibilityRole="radio"
              accessibilityLabel={l}
              accessibilityState={{ selected: mine }}
              disabled={!!reveal || disabled}
              onPress={() => {
                haptic.select();
                onAnswer(j);
              }}
              testID={`tool-scale-${j}`}
              style={({ pressed }) => ({ flex: 1, minHeight: 88, padding: space[2], alignItems: "center", justifyContent: "center", gap: space[1], borderRadius: layout.radius, borderWidth: right || mine ? 2 : 1.5, borderColor: right ? (c.dark ? c.primary : c.ink) : mine && reveal ? c.danger : c.cardLine, backgroundColor: right ? c.successBg : mine && reveal ? c.alertBg : pressed ? c.tint : "transparent" })}
            >
              <T style={{ fontFamily: fonts.pixelDigits, fontSize: 18, lineHeight: 22, color: c.ink }}>{["-2", "-1", "0", "+1", "+2"][j]}</T>
              <T v="caption" center>
                {l}
              </T>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function Buckets({ step, reveal, disabled, onAnswer }: { step: Extract<ToolStep, { kind: "buckets" }>; reveal: ToolReveal | null; disabled: boolean; onAnswer: (a: unknown) => void }) {
  const c = useTheme();
  const [put, setPut] = React.useState<(number | null)[]>(() => step.items.map(() => null));
  const [at, setAt] = React.useState(0);
  const all = put.every((p) => p !== null);
  return (
    <View style={{ gap: space[3] }}>
      <T v="h3">{step.ask}</T>
      <T v="small" tone="muted" num>
        {put.filter((p) => p !== null).length} of {step.items.length} sorted
      </T>
      {step.items.map((t, i) => {
        const open = !reveal && at === i;
        const right = reveal?.right[i];
        const ok = reveal ? put[i] === right : null;
        return (
          <View key={i} style={{ gap: space[2], borderTopWidth: 1, borderColor: c.hairline, paddingTop: space[3] }}>
            <Pressable accessibilityRole="button" accessibilityLabel={`${t}. ${put[i] !== null ? step.buckets[put[i]!] : "Not sorted"}`} onPress={() => setAt(i)} disabled={!!reveal} testID={`tool-item-${i}`}>
              <T v="bodyStrong" tone={ok === false ? "danger" : "ink"}>
                {t}
              </T>
              <T v="small" tone={put[i] !== null ? "link" : "muted"}>
                {reveal ? (ok ? step.buckets[right!] : `${put[i] !== null ? step.buckets[put[i]!] : "Not sorted"}: it is ${step.buckets[right!]}`) : put[i] !== null ? step.buckets[put[i]!] : "Tap to sort"}
              </T>
            </Pressable>
            {open ? (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
                {step.buckets.map((b, k) => (
                  <Pressable
                    key={b}
                    accessibilityRole="button"
                    accessibilityLabel={b}
                    onPress={() => {
                      haptic.select();
                      const next = put.map((x, j) => (j === i ? k : x));
                      setPut(next);
                      const after = next.findIndex((x, j) => x === null && j > i);
                      setAt(after >= 0 ? after : next.findIndex((x) => x === null));
                    }}
                    testID={`tool-bucket-${i}-${k}`}
                    style={({ pressed }) => ({ minHeight: 40, paddingHorizontal: space[3], justifyContent: "center", borderRadius: 20, borderWidth: 1.5, borderColor: put[i] === k ? c.ink : c.cardLine, backgroundColor: put[i] === k ? c.ink : pressed ? c.tint : "transparent" })}
                  >
                    <T v="small" style={{ color: put[i] === k ? c.bg : c.ink }}>
                      {b}
                    </T>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        );
      })}
      {!reveal ? <Button label={all ? "Check my sort" : `Sort ${put.filter((p) => p === null).length} more`} disabled={!all || disabled} onPress={() => onAnswer(put)} testID="tool-submit" /> : null}
    </View>
  );
}

/** Free text against an optional clock, then the model answer to compare. */
function Write({ step, reveal, onAnswer }: { step: Extract<ToolStep, { kind: "write" }>; reveal: ToolReveal | null; onAnswer: (a: unknown) => void }) {
  const c = useTheme();
  const [text, setText] = React.useState<string[]>(() => step.fields.map(() => ""));
  const [left, setLeft] = React.useState(step.seconds ?? 0);
  const [running, setRunning] = React.useState(false);
  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((l) => (l <= 1 ? (clearInterval(id), 0) : l - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);
  const clock = step.seconds ? (
    <View style={{ gap: space[2] }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <T style={{ fontFamily: fonts.pixelDigits, fontSize: 32, lineHeight: 40, color: left === 0 ? c.danger : c.ink }} num accessibilityLabel={`${left} seconds left`}>
          {`${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`}
        </T>
        {!reveal && !running && left === step.seconds ? <Button kind="quiet" full={false} label="Start the clock" onPress={() => setRunning(true)} testID="tool-clock" /> : null}
      </View>
      <ProgressLine value={(left / step.seconds) * 100} height={4} />
    </View>
  ) : null;
  return (
    <View style={{ gap: space[3] }}>
      <Rich text={step.ask} v="h3" />
      {clock}
      {step.fields.map((f, i) => (
        <Field key={f} label={f} area value={text[i]} editable={!reveal} placeholder={step.placeholder} onChangeText={(v) => setText((t) => t.map((x, j) => (j === i ? v : x)))} testID={`tool-write-${i}`} hint={step.min && !reveal ? `${Math.max(0, step.min - text.join("").trim().length) || "Ready"}${text.join("").trim().length < step.min ? " more characters" : ""}` : undefined} />
      ))}
      {!reveal ? (
        <Button
          label="Compare with the answer"
          disabled={step.min ? text.join("").trim().length < step.min : !text.some((t) => t.trim())}
          onPress={() => {
            setRunning(false);
            onAnswer(text);
          }}
          testID="tool-submit"
        />
      ) : null}
    </View>
  );
}

/** OSCE: your overall call, one tap on 1 to max. */
function Rate({ step, reveal, picked, onAnswer }: { step: Extract<ToolStep, { kind: "rate" }>; reveal: ToolReveal | null; picked: number | null; onAnswer: (a: unknown) => void }) {
  const c = useTheme();
  return (
    <View style={{ gap: space[3] }}>
      <T v="h3">{step.ask}</T>
      <T v="small" tone="muted">
        {step.label}
      </T>
      <View style={{ flexDirection: "row", gap: space[2] }} accessibilityRole="radiogroup" accessibilityLabel={step.label}>
        {Array.from({ length: step.max }, (_, i) => {
          const on = picked === i + 1;
          return (
            <Feel key={i} state={on && reveal ? "right" : "idle"} style={{ flex: 1 }}>
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                accessibilityLabel={`${i + 1} of ${step.max}`}
                disabled={!!reveal}
                onPress={() => {
                  haptic.select();
                  onAnswer(i + 1);
                }}
                testID={`tool-rate-${i + 1}`}
                style={({ pressed }) => ({ minHeight: 64, alignItems: "center", justifyContent: "center", borderRadius: layout.radius, borderWidth: on ? 2 : 1.5, borderColor: on ? c.ink : c.cardLine, backgroundColor: on ? c.primary : pressed ? c.tint : "transparent", transform: [{ scale: pressed ? 0.96 : 1 }] })}
              >
                <T style={{ fontFamily: fonts.pixelDigits, fontSize: 22, lineHeight: 28, color: on ? c.onPrimary : c.ink }}>{String(i + 1)}</T>
              </Pressable>
            </Feel>
          );
        })}
      </View>
    </View>
  );
}

/** MSE Level 4: the case, then one line per domain under a ten-minute clock that keeps the meaning without motion. */
function FullMse({ step, reveal, onAnswer }: { step: Extract<ToolStep, { kind: "fullmse" }>; reveal: ToolReveal | null; onAnswer: (a: unknown) => void }) {
  const c = useTheme();
  const [text, setText] = React.useState<Record<string, string>>({});
  const total = Math.max(1, step.seconds || 0);
  const [left, setLeft] = React.useState(total);
  // The clock runs on the wall clock: a phone's timers stop while the app is
  // in the background, so counting ticks gave free minutes to anyone who
  // switched apps.
  React.useEffect(() => {
    if (reveal) return;
    const end = Date.now() + left * 1000;
    const tick = () => {
      const l = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setLeft(l);
      if (l === 0) clearInterval(id);
    };
    const id = setInterval(tick, 1000);
    const sub = AppState.addEventListener("change", (s) => s === "active" && tick());
    return () => {
      clearInterval(id);
      sub.remove();
    };
    // `left` is read once, when the clock starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reveal]);
  const filled = step.domains.filter((d) => (text[d] ?? "").trim()).length;
  const urgent = left < 120;
  return (
    <View style={{ gap: space[3] }}>
      <View style={{ gap: space[2] }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <T style={{ fontFamily: fonts.pixelDigits, fontSize: 32, lineHeight: 40, color: urgent ? c.danger : c.ink }} num accessibilityRole="timer" accessibilityLabel={`${Math.floor(left / 60)} minutes ${left % 60} seconds left`}>
            {`${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`}
          </T>
          <T v="small" tone="muted" num>{`${filled} of ${step.domains.length} domains`}</T>
        </View>
        <ProgressLine value={(left / total) * 100} height={4} />
      </View>
      <Story kicker={step.ask}>
        <T v="reading">{step.context}</T>
      </Story>
      {step.domains.map((d) => (
        <Field key={d} label={formatDomainKey(d)} value={text[d] ?? ""} editable={!reveal} placeholder="e.g. flat, congruent" onChangeText={(v) => setText((t) => ({ ...t, [d]: v }))} testID={`tool-mse-${d}`} />
      ))}
      {!reveal ? <Button label={left === 0 ? "Time's up: submit" : "Submit MSE"} disabled={!filled} onPress={() => onAnswer(text)} testID="tool-submit" /> : null}
    </View>
  );
}

const LIGHT_WORD = { green: "Matched", amber: "Fair", red: "Missed" } as const;

/** MSE Level 4 result: each domain in a word and a colour, your words next to the expert's. */
function Lights({ reveal, seed }: { reveal: ToolReveal; seed: number }) {
  const c = useTheme();
  const rows = reveal.domains ?? [];
  const green = rows.filter((r) => r.light === "green").length;
  const amber = rows.filter((r) => r.light === "amber").length;
  return (
    <View style={{ gap: space[3] }} testID="tool-lights">
      <Verdict right={reveal.score >= 0.6} partial={reveal.score > 0 && reveal.score < 0.6} title={`${green} of ${rows.length} domains matched${amber ? `, ${amber} fair` : ""}`} why={reveal.why} seed={seed} />
      <Stagger>
        <RowList still>
          {rows.map((r) => (
            <View key={r.domain} style={{ paddingVertical: space[3], gap: 2 }} accessible accessibilityLabel={`${r.domain}: ${LIGHT_WORD[r.light]}`}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: r.light === "green" ? c.successFg : r.light === "amber" ? c.link : c.danger }} />
                <T v="bodyStrong" style={{ flex: 1 }}>
                  {r.domain}
                </T>
                <T v="caption" style={{ color: r.light === "green" ? c.successFg : r.light === "amber" ? c.link : c.danger }}>
                  {LIGHT_WORD[r.light].toUpperCase()}
                </T>
              </View>
              <T v="small">{`You: ${r.you.length ? r.you.join(", ") : "(none)"}`}</T>
              <T v="small" tone="muted">{`Expert: ${r.expert.length ? r.expert.join(", ") : "no finding"}`}</T>
            </View>
          ))}
        </RowList>
      </Stagger>
    </View>
  );
}

/** Level 1: say plainly when a label slipped in. */
function ObserveLine({ o }: { o: { labels: string[]; observations: number; words: number } }) {
  return (
    <View style={{ gap: space[1] }} testID="tool-observe">
      {o.labels.length ? (
        <T v="bodyStrong" tone="danger">{`Labels slipped in: ${o.labels.join(", ")}. Describe the behaviour instead.`}</T>
      ) : (
        <T v="bodyStrong">{o.words >= 80 ? "No labels. A full description." : "No labels. Aim for about 100 words."}</T>
      )}
      <T v="small" tone="muted" num>{`${o.words} words · ${o.observations} observation words`}</T>
    </View>
  );
}

/** Formulation: the model's words you used and the ones you missed, as chips. A diff, not a grade. */
function DiffWords({ diff }: { diff: { missing: string[]; present: string[] } }) {
  const c = useTheme();
  const chip = (w: string, got: boolean) => (
    <View key={`${got}-${w}`} style={{ minHeight: 28, paddingHorizontal: space[2], borderRadius: 14, justifyContent: "center", borderWidth: 1.5, borderColor: got ? c.ink : c.cardLine, backgroundColor: got ? c.successBg : "transparent" }}>
      <T v="small" style={{ color: got ? c.successFg : c.muted }}>
        {w}
      </T>
    </View>
  );
  return (
    <View style={{ gap: space[3] }} testID="tool-diff">
      <View style={{ gap: space[1] }}>
        <T v="caption" tone="muted">
          WORDS YOU GOT
        </T>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[1] }}>{diff.present.length ? diff.present.map((w) => chip(w, true)) : <T v="small" tone="muted">(none yet)</T>}</View>
      </View>
      <View style={{ gap: space[1] }}>
        <T v="caption" tone="muted">
          WORDS YOU MISSED
        </T>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[1] }}>{diff.missing.length ? diff.missing.map((w) => chip(w, false)) : <T v="small" tone="muted">(none, excellent)</T>}</View>
      </View>
      <T v="small" tone="muted">
        This is a diff, not a grade. The structure is the skill.
      </T>
    </View>
  );
}
