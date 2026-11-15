import { useLocalSearchParams } from "expo-router";
import { Check } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";

import { Button, OptionRow, ProgressLine, Row, RowList, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { Rich } from "@/study/rich";
import { fonts, layout, motion, space, useTheme } from "@/theme";
import { play, useLoad, useMove, usePlayQuery } from "../api";
import { caseTool } from "../catalog";
import { EndPanel, EndThumb, FrameError, FrameLoading, GameFrame, HudLine, MoveError, StepStrip, Verdict } from "../frame";
import { Story, Tag, Tile } from "../parts";
import { useReactions } from "../reactions";
import type { ToolAnswer, ToolCase, ToolDeal, ToolId, ToolList, ToolReveal, ToolStep } from "../types";

const HOW: Record<ToolId, string[]> = {
  wwyd: ["A patient says something hard. Choose what you would say or do.", "Each choice has a consequence. There is a best one, an acceptable one and one that harms."],
  "say-it": ["Read what the family or patient says in everyday words.", "Pick the word you would write in the case sheet."],
  judgment: ["You have a working diagnosis. A new fact arrives.", "Say how it changes the odds, from much less likely to much more likely. You are scored against a panel of clinicians."],
  ethics: ["A situation with a legal or ethical catch.", "Choose what to do, then read the law behind it."],
  landmark: ["Read a famous case: what was believed then, and what holds up now.", "Then answer a few questions about it."],
  osce: ["One task, out loud, against the clock. Start the clock and say it as if the patient is there.", "When the time is up, tick what you covered. The items worth two count most."],
  "two-minute": ["A patient, a few lines, two minutes.", "Pick the most likely diagnosis before the clock runs out."],
  formulation: ["Sort each factor into the 5Ps: presenting, predisposing, precipitating, perpetuating, protective.", "Some factors belong nowhere: leave them out."],
  "out-of-depth": ["A case that may be beyond your scope.", "Decide what to do first, and who else needs to know."],
  "weak-spots": ["Questions picked from what you miss most.", "One at a time; the why comes after each."],
  "mse-trainer": ["Read the quote from the interview.", "Pick the word for what you see. Describe first, label second."],
};

/** A case tool: first its cases (Done, New, This week, Carry on), then one case in steps. */
export function ToolCaseScreen({ tool }: { tool: ToolId }) {
  const entry = caseTool(tool);
  const params = useLocalSearchParams<{ item?: string }>();
  const [item, setItem] = React.useState<string | null>(params.item ?? null);
  const [nonce, setNonce] = React.useState(0);
  if (item) return <ToolRun key={`${item}-${nonce}`} tool={tool} item={item} back={() => setItem(null)} again={() => setNonce((n) => n + 1)} />;
  return <ToolPicker tool={tool} title={entry?.title ?? "Practice"} line={entry?.line ?? ""} onPick={setItem} />;
}

function ToolPicker({ tool, title, line, onPick }: { tool: ToolId; title: string; line: string; onPick: (id: string) => void }) {
  const q = usePlayQuery<ToolList>([tool], "tool", "list", tool);
  if (q.isError) return <FrameError title={title} error={q.error} onRetry={() => void q.refetch()} />;
  if (!q.data) return <FrameLoading title={title} />;
  const items = q.data.items;
  const first = items.find((i) => i.mark === "started") ?? items.find((i) => i.mark !== "done") ?? items[0];
  return (
    <GameFrame testID={`tool-${tool}`} title="" howTo={HOW[tool]} thumb={first ? <Button label={first.mark === "started" ? "Carry on" : "Start the next case"} onPress={() => onPick(first.id)} testID="tool-start" /> : undefined}>
      <View style={{ gap: space[2], paddingTop: space[4] }}>
        <T v={title.length > 22 ? "h1" : "display"}>{title}</T>
        <T tone="muted">{line}</T>
      </View>
      <RowList>
        {items.map((i) => (
          <Row key={i.id} testID={`tool-item-${i.id}`} title={i.title} meta={i.line ?? undefined} trailing={<Tag tag={i.mark} />} onPress={() => onPick(i.id)} />
        ))}
      </RowList>
    </GameFrame>
  );
}

function ToolRun({ tool, item, back, again }: { tool: ToolId; item: string; back: () => void; again: () => void }) {
  const reduce = useReducedMotion();
  const mv = useMove();
  const react = useReactions();
  const entry = caseTool(tool);
  const q = useLoad(() => play<ToolDeal>("tool", "deal", { tool, item }), `${tool}:${item}`);
  const [tokenNext, setToken] = React.useState<string | null>(null);
  const [stepNext, setStep] = React.useState<ToolStep | null>(null);
  const cs: ToolCase | null = q.data?.case ?? null;
  const token = tokenNext ?? q.data?.token ?? "";
  const step = stepNext ?? cs?.step ?? null;
  const [res, setRes] = React.useState<ToolAnswer | null>(null);
  const [marks, setMarks] = React.useState<("ok" | "miss" | null)[]>([]);
  const [picked, setPicked] = React.useState<unknown>(null);
  const [end, setEnd] = React.useState<ToolAnswer["end"]>(null);
  const title = entry?.title ?? "Practice";
  if (q.error) return <FrameError title={title} error={q.error} onRetry={q.retry} />;
  if (!cs || !step) return <FrameLoading title={title} />;

  if (end) {
    return (
      <GameFrame testID="tool-end" title={cs.title} thumb={<EndThumb again={back} againLabel="Choose another case" extra={{ label: "Do this one again", onPress: again }} />}>
        <EndPanel kicker="Case done" score={`${end.score}%`} right={end.score} total={100} stats={[{ label: "XP", value: `+${end.xp}` }]}>
          <Story kicker="Take away">
            <Rich text={end.takeaway} v="reading" />
          </Story>
        </EndPanel>
      </GameFrame>
    );
  }

  const answer = async (a: unknown) => {
    if (res || mv.pending) return;
    setPicked(a);
    const r = await mv.run(() => play<ToolAnswer>("tool", "answer", { token, step: step.n, answer: a }));
    if (!r) return;
    setToken(r.token);
    if (step.kind === "read") {
      // Nothing to mark on a reading step: straight on.
      advance(r);
      return;
    }
    setRes(r);
    setMarks((m) => [...m, r.reveal.score >= 0.999 ? "ok" : r.reveal.score > 0 ? null : "miss"]);
    react.answer(r.reveal.score >= 0.75);
  };
  const advance = (r: ToolAnswer) => {
    setRes(null);
    setPicked(null);
    if (r.next) setStep(r.next);
    else setEnd(r.end);
  };
  const hud = (
    <View style={{ gap: space[2] }}>
      <StepStrip at={step.n} total={cs.steps} marks={marks} />
      <HudLine left={`${title} · step ${step.n + 1} of ${cs.steps}`} />
    </View>
  );
  return (
    <GameFrame testID={`tool-run-${tool}`} title={cs.title} howTo={HOW[tool]} hud={hud} confirmLeave saves thumb={res ? <Button label={res.next ? "Next" : "Finish the case"} onPress={() => advance(res)} testID="tool-next" /> : undefined}>
      {step.n === 0 ? (
        <Story kicker={cs.setting ?? undefined}>
          <Rich text={cs.intro} v="reading" />
        </Story>
      ) : null}
      <Animated.View key={step.n} entering={reduce ? undefined : FadeIn.duration(motion.state)} style={{ gap: space[4] }}>
        <StepView step={step} reveal={res?.reveal ?? null} picked={picked} disabled={mv.pending} onAnswer={(a) => void answer(a)} />
        <MoveError text={mv.error} />
        {res ? <RevealBand step={step} reveal={res.reveal} seed={step.n} /> : null}
      </Animated.View>
    </GameFrame>
  );
}

function RevealBand({ step, reveal, seed }: { step: ToolStep; reveal: ToolReveal; seed: number }) {
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
  switch (step.kind) {
    case "pick":
      return (
        <View style={{ gap: space[3] }}>
          <Rich text={step.ask} v="h3" />
          {step.options.map((o, j) => (
            <View key={j} style={{ gap: space[1] }}>
              <OptionRow index={j} text={o} testID={`tool-option-${j}`} disabled={!!reveal || disabled} state={!reveal ? "idle" : reveal.right.includes(j) ? "right" : j === picked ? "wrong" : "dim"} onPress={() => onAnswer(j)} />
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
  const total = step.kind === "checklist" ? step.seconds : 1;
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
        const st = !reveal ? (ticked ? "on" : "idle") : reveal.right.includes(j) ? (ticked ? "right" : "wrong") : ticked ? "wrong" : "dim";
        return (
          <Tile key={j} testID={`tool-tick-${j}`} state={st} disabled={!!reveal || disabled} accessibilityLabel={`${t}${ticked ? ", ticked" : ""}`} onPress={() => setOn((o) => (o.includes(j) ? o.filter((x) => x !== j) : [...o, j]))}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
              <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: c.ink, backgroundColor: ticked ? c.ink : "transparent", alignItems: "center", justifyContent: "center" }}>{ticked ? <Check size={14} color={c.bg} strokeWidth={3} /> : null}</View>
              <T style={{ flex: 1 }}>{t}</T>
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
