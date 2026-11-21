import * as React from "react";
import { View } from "react-native";
import Svg, { Circle, Line, Polyline } from "react-native-svg";

import { Button, Chips, HintText, Label, OptionList, Slider, Stone, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { ProgressFill, Swap } from "@/motion";
import { layout, space, useTheme } from "@/theme";
import { ATTRIBUTION_CASES, BIAS_CASES, BIASES, CONS_ITEMS, CONS_REASONS, CONS_STAGES, CONS_TASK_TEXT, CORR_READINGS, CORR_SCENARIOS, type CorrScenario } from "./mock";
import { QuestionRun, type RunResult, type Step } from "./run";
import { ChangeDetection, DigitSpan, MullerLyer, SerialPosition, Stroop, type LabResult, type RunnerProps } from "./runners-a";
import { seeded, shuffle, simulateSchedule, type Schedule } from "./scoring";
import { attributionSummary, condResponse, condStart, condStep, correlatedPoints, designComplete, designScore, EMPTY_DESIGN, flukePoints, openThreats, restrictedRangePoints, rOf, roundR, rWords, thirdVariablePoints, THREATS, type CondState, type CondTrial, type DesignChoices, type Point } from "./scoring2";
import { PlayShell } from "./shell";

/** A small chart frame on white, the same in light and dark. */
function Plot({ children, label, h = 180 }: { children: React.ReactNode; label: string; h?: number }) {
  const c = useTheme();
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={label} style={{ borderRadius: layout.radiusLg, backgroundColor: c.paper, padding: space[3], alignItems: "center" }}>
      <Svg width="100%" height={h} viewBox={`0 0 300 ${h}`}>
        {children}
      </Svg>
    </View>
  );
}

/* --------------------------------------------------------- reward schedules */

const SCHEDULES: { id: Exclude<Schedule, "EXT">; name: string; say: string; value: number }[] = [
  { id: "FR", name: "Fixed ratio", say: "A reward after every 10 presses.", value: 10 },
  { id: "VR", name: "Variable ratio", say: "A reward after about 10 presses, never the same number.", value: 10 },
  { id: "FI", name: "Fixed interval", say: "A reward for the first press after 12 seconds.", value: 12 },
  { id: "VI", name: "Variable interval", say: "A reward for the first press after about 12 seconds.", value: 12 },
];

export function Schedules({ onDone, onClose }: RunnerProps) {
  const c = useTheme();
  const [id, setId] = React.useState<Exclude<Schedule, "EXT">>("FR");
  const [seen, setSeen] = React.useState<string[]>(["FR"]);
  const [ext, setExt] = React.useState(false);
  const s = SCHEDULES.find((x) => x.id === id)!;
  const run = React.useMemo(() => simulateSchedule({ schedule: s.id, value: s.value, seconds: 60 }), [s]);
  const after = React.useMemo(() => simulateSchedule({ schedule: "EXT", value: 0, seconds: 40, history: s.id === "VR" || s.id === "VI" ? "intermittent" : "continuous" }), [s]);
  const all = ext ? [...run.cumulative, ...after.cumulative.map((v) => v + run.total)] : run.cumulative;
  const maxY = Math.max(1, all[all.length - 1] ?? 1);
  const X = (t: number) => 10 + (t / (ext ? 100 : 60)) * 280;
  const Y = (v: number) => 165 - (v / maxY) * 150;
  const pick = (v: Exclude<Schedule, "EXT">) => {
    setId(v);
    setExt(false);
    setSeen((x) => (x.includes(v) ? x : [...x, v]));
  };
  const finish = () => {
    const rows = SCHEDULES.map((x) => ({ x, total: simulateSchedule({ schedule: x.id, value: x.value, seconds: 60 }).total }));
    const top = Math.max(...rows.map((r) => r.total));
    onDone({ headline: "Ratio schedules drove the most pressing. Fixed interval gave the scalloped curve.", lines: rows.map((r) => ({ label: r.x.name, value: `${r.total} presses in a minute` })), bars: rows.map((r) => ({ label: r.x.id, pct: (r.total / top) * 100 })), barsLabel: "Presses in one minute" });
  };
  return (
    <PlayShell testID="lab-run" title="Reward schedules" done={seen.length} total={SCHEDULES.length} onClose={onClose} footer={<Button label="See what it means" testID="lab-submit" disabled={seen.length < 2} onPress={finish} />}>
      <Chips label="Schedule" value={id} onChange={pick} options={SCHEDULES.map((x) => ({ id: x.id, name: x.name }))} />
      <T>{s.say}</T>
      <Plot label={`Total presses over time on a ${s.name} schedule${ext ? ", then with no rewards" : ""}`}>
        <Line x1={10} y1={165} x2={290} y2={165} stroke={c.paperLine} strokeWidth={1.5} />
        {ext ? <Line x1={X(60)} y1={10} x2={X(60)} y2={165} stroke={c.paperLine} strokeWidth={1.5} strokeDasharray="4 4" /> : null}
        {run.rewards.map((t, k) => (
          <Line key={k} x1={X(t)} y1={Y(run.cumulative[t - 1] ?? 0) - 2} x2={X(t) + 5} y2={Y(run.cumulative[t - 1] ?? 0) + 6} stroke={c.sk.blue} strokeWidth={2} />
        ))}
        <Polyline points={all.map((v, t) => `${X(t + 1)},${Y(v)}`).join(" ")} fill="none" stroke={c.onPaper} strokeWidth={2.5} strokeLinejoin="round" />
      </Plot>
      <T v="small" tone="muted">
        The line climbs with every press. A small blue tick is a reward. {ext ? "After the dashed line the rewards stop." : "A steeper line means faster pressing."}
      </T>
      <Button kind="quiet" label={ext ? "Hide what happens when rewards stop" : "Now stop the rewards"} testID="lab-ext" onPress={() => setExt(!ext)} />
    </PlayShell>
  );
}

/* ------------------------------------------------------------ Pavlov's bell */

const COND: { id: CondTrial; label: string }[] = [
  { id: "pair", label: "Bell with food" },
  { id: "tone", label: "Bell alone" },
  { id: "rest", label: "Rest a day" },
];

export function Pavlov({ onDone, onClose }: RunnerProps) {
  const c = useTheme();
  const [s, setS] = React.useState<CondState>(condStart);
  const [log, setLog] = React.useState<{ t: CondTrial; r: number }[]>([]);
  const now = Math.round(condResponse(s) * 100);
  const act = (t: CondTrial) => {
    haptic.select();
    setLog((l) => [...l, { t, r: condResponse(s) }].slice(-40));
    setS(condStep(s, t));
  };
  const peak = Math.round(Math.max(0, ...log.map((x) => x.r), condResponse(s)) * 100);
  const did = (t: CondTrial) => log.some((x) => x.t === t);
  const goals = [
    { ok: peak >= 80, text: "Teach it: ring the bell with food until the response is strong." },
    { ok: did("tone") && peak >= 80 && now <= 25, text: "Undo it: ring the bell alone until the response fades." },
    { ok: did("rest") && log.length > 0 && log[log.length - 1]!.t === "rest" && now > 25, text: "Rest a day after it fades, and see what comes back." },
  ];
  const finish = () => onDone({ headline: `The response reached ${peak}% and stands at ${now}% now.`, lines: [{ label: "Strongest response", value: `${peak}%` }, { label: "Response now", value: `${now}%` }, { label: "Trials you ran", value: `${log.length}` }], bars: log.slice(-16).map((x, i) => ({ label: String(i + 1), pct: x.r * 100 })), barsLabel: "Response on your last trials" });
  return (
    <PlayShell testID="lab-run" title="Pavlov's bell" done={goals.filter((g) => g.ok).length} total={goals.length} onClose={onClose} footer={<Button label="See what it means" testID="lab-submit" disabled={log.length < 6} onPress={finish} />}>
      <Stone pad={space[5]}>
        <View style={{ gap: space[2] }}>
          <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" }}>
            <T v="label" tone="muted">
              Salivating at the bell
            </T>
            <T v="h2" num testID="lab-response">{`${now}%`}</T>
          </View>
          <ProgressFill pct={now} height={12} track={c.bg} />
          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 3, height: 44 }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            {log.slice(-24).map((x, i) => (
              <View key={i} style={{ flex: 1, maxWidth: 10, height: 4 + x.r * 40, borderRadius: 3, backgroundColor: x.t === "pair" ? c.ink : x.t === "tone" ? c.muted : c.bg }} />
            ))}
          </View>
        </View>
      </Stone>
      <View style={{ gap: space[2] }}>
        {COND.map((x) => (
          <Button key={x.id} kind="quiet" label={x.label} testID={`lab-${x.id}`} onPress={() => act(x.id)} />
        ))}
      </View>
      <View style={{ gap: space[2] }}>
        <Label>Try these</Label>
        {goals.map((g) => (
          <T key={g.text} v="small" tone={g.ok ? "ink" : "muted"} style={{ paddingHorizontal: space[1] }}>
            {g.ok ? "Done. " : ""}
            {g.text}
          </T>
        ))}
      </View>
    </PlayShell>
  );
}

/* --------------------------------------------------------- design the study */

type Opt<K extends keyof DesignChoices> = { key: K; ask: string; options: { id: NonNullable<DesignChoices[K]>; label: string }[] };
const DESIGN: [Opt<"sample">, Opt<"size">, Opt<"control">, Opt<"assign">, Opt<"blind">, Opt<"measure">] = [
  { key: "sample", ask: "Who takes part?", options: [{ id: "volunteers", label: "Students who sign up because they like the idea" }, { id: "extreme", label: "The most anxious students from this week's screening" }, { id: "random", label: "A random sample of students from five colleges" }] },
  { key: "size", ask: "How many?", options: [{ id: "tiny", label: "10 students in total" }, { id: "medium", label: "20 students per group" }, { id: "large", label: "150 students per group" }] },
  { key: "control", ask: "Compared with what?", options: [{ id: "none", label: "No comparison: measure before and after the app" }, { id: "waitlist", label: "A group that gets nothing for now (waiting list)" }, { id: "active", label: "A group that gets a look-alike app with relaxing sounds" }] },
  { key: "assign", ask: "Who goes in which group?", options: [{ id: "choose", label: "Students choose their group" }, { id: "college", label: "One college gets the app, another the comparison" }, { id: "random", label: "Random assignment, like a coin toss" }] },
  { key: "blind", ask: "What are students told?", options: [{ id: "told", label: "That we expect the mindfulness app to work" }, { id: "masked", label: "That we are comparing two apps, not which one we expect to work" }] },
  { key: "measure", ask: "How is anxiety measured?", options: [{ id: "ask", label: "Ask at the end: did the app help?" }, { id: "after", label: "A validated anxiety questionnaire, at the end only" }, { id: "prepost", label: "The same validated questionnaire, before and after" }] },
];

export function DesignStudy({ onDone, onClose }: RunnerProps) {
  const [d, setD] = React.useState<DesignChoices>(EMPTY_DESIGN);
  const score = designScore(d);
  const open = openThreats(d);
  const hasControl = d.control === "waitlist" || d.control === "active";
  const set = (key: keyof DesignChoices, id: string) => setD((old) => ({ ...old, [key]: id, ...(key === "control" && id === "none" ? { assign: null } : null) }) as DesignChoices);
  const finish = () => onDone({ headline: `Your design closes ${score.closed} of ${score.of} ways a study can fool you.`, lines: THREATS.map((t) => ({ label: t.name, value: open.has(t.id) ? `Still open. ${t.fix}` : "Closed" })), bars: [{ label: "Closed", pct: score.percent }], barsLabel: "Threats closed" });
  return (
    <PlayShell testID="lab-run" title="Design the study" done={score.closed} total={score.of} onClose={onClose} footer={<Button label="Run my study" testID="lab-submit" disabled={!designComplete(d)} onPress={finish} />}>
      <Stone>
        <T v="reading">A new mindfulness app claims to lower exam anxiety in college students. Design the study that would show whether it does.</T>
      </Stone>
      {DESIGN.map((g, n) =>
        g.key === "assign" && !hasControl ? null : (
          <View key={g.key} style={{ gap: space[2] }}>
            <Label>{`${n + 1}. ${g.ask}`}</Label>
            <OptionList testID={`design-${g.key}`} options={g.options.map((o) => o.label)} picked={d[g.key] === null ? null : g.options.findIndex((o) => o.id === d[g.key])} onPick={(i) => set(g.key, g.options[i]!.id)} />
          </View>
        ),
      )}
      <T v="small" tone="muted">
        The bar at the top fills as your choices close each threat.
      </T>
    </PlayShell>
  );
}

/* -------------------------------------------------------- why did they do it */

export function Attribution({ onDone, onClose }: RunnerProps) {
  const [i, setI] = React.useState(0);
  const [stage, setStage] = React.useState<"before" | "after">("before");
  const [v, setV] = React.useState(50);
  const before = React.useRef(50);
  const rows = React.useRef<{ before: number; after: number }[]>([]);
  const k = ATTRIBUTION_CASES[i]!;
  const next = () => {
    if (stage === "before") {
      before.current = v;
      setStage("after");
      return;
    }
    rows.current.push({ before: before.current, after: v });
    if (i + 1 >= ATTRIBUTION_CASES.length) {
      const s = attributionSummary(rows.current);
      onDone({ headline: s.shift > 0 ? `Once you knew the situation, you blamed the person ${s.shift} points less.` : "Knowing the situation did not move your ratings much.", lines: [{ label: "Before the full story", value: `${s.before} of 100 on the person` }, { label: "After the full story", value: `${s.after} of 100 on the person` }, { label: "Shift", value: `${s.shift} points` }], bars: [{ label: "Before", pct: s.before }, { label: "After", pct: s.after }], barsLabel: "How much you put it on the person" });
      return;
    }
    setI(i + 1);
    setStage("before");
    setV(50);
  };
  return (
    <PlayShell testID="lab-run" title="Why did they do it?" done={i + (stage === "after" ? 0.5 : 0)} total={ATTRIBUTION_CASES.length} onClose={onClose} footer={<Button label={stage === "before" ? "Tell me more" : i + 1 < ATTRIBUTION_CASES.length ? "Next person" : "See my pattern"} testID="lab-submit" onPress={next} />}>
      <Swap k={`${i}-${stage}`} dir={1} style={{ gap: space[4] }}>
        <Stone>
          <T v="reading">{k.act}</T>
        </Stone>
        {stage === "after" ? (
          <View style={{ gap: space[2] }}>
            <Label>The rest of the story</Label>
            <HintText>{k.reveal}</HintText>
          </View>
        ) : null}
        <T v="h2" accessibilityRole="header">
          {stage === "before" ? "Why did they do it?" : "And now?"}
        </T>
        <View style={{ gap: space[1] }}>
          <Slider testID="lab-slider" label="From the situation to the kind of person they are" value={v} min={0} max={100} step={5} onChange={setV} format={(n) => `${n} of 100 on the person`} />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <T v="caption" tone="muted">
              The situation
            </T>
            <T v="caption" tone="muted">
              The kind of person
            </T>
          </View>
        </View>
      </Swap>
    </PlayShell>
  );
}

/* ------------------------------------------ the three "read, then choose" ones */

function scenarioPoints(sc: CorrScenario): Point[] {
  const rand = seeded(sc.id.length * 131 + sc.n);
  if (sc.kind === "third") return thirdVariablePoints(sc.n, rand);
  if (sc.kind === "fluke") return flukePoints(sc.n, 0.75, rand);
  if (sc.kind === "restricted") return restrictedRangePoints(sc.n, 0.6, 0.2, rand);
  return correlatedPoints(sc.n, 0.55, rand);
}

function Scatter({ sc }: { sc: CorrScenario }) {
  const c = useTheme();
  const pts = React.useMemo(() => scenarioPoints(sc).filter((p) => !p.hidden), [sc]);
  const r = roundR(rOf(pts));
  const px = (v: number) => 150 + Math.max(-2.6, Math.min(2.6, v)) * 50;
  const py = (v: number) => 90 - Math.max(-2.6, Math.min(2.6, v)) * 30;
  return (
    <View style={{ gap: space[1] }}>
      <Plot label={`Scatter plot of ${sc.y} against ${sc.x}. The link is ${rWords(r)}, r equals ${r}.`}>
        <Line x1={12} y1={170} x2={290} y2={170} stroke={c.paperLine} strokeWidth={1.5} />
        <Line x1={12} y1={8} x2={12} y2={170} stroke={c.paperLine} strokeWidth={1.5} />
        {pts.map((p, i) => (
          <Circle key={i} cx={px(p.x)} cy={py(p.y)} r={3.5} fill={p.z !== undefined && p.z < 0 ? c.paper : c.onPaper} stroke={c.onPaper} strokeWidth={1.5} />
        ))}
      </Plot>
      <T v="caption" tone="muted" num>{`${sc.x} (across) and ${sc.y} (up) · ${sc.n} people · r = ${r}, ${rWords(r)}`}</T>
    </View>
  );
}

function quizResult(noun: string, r: RunResult[]): LabResult {
  const got = r.filter((x) => x.right).length;
  return { headline: `You read ${got} of ${r.length} ${noun} correctly.`, lines: [{ label: "Right", value: `${got}` }, { label: "Missed", value: `${r.length - got}` }], bars: [{ label: "Right", pct: (got / Math.max(1, r.length)) * 100 }], barsLabel: "Your hit rate" };
}

function Quiz({ steps, title, noun, onDone, onClose }: RunnerProps & { steps: Step[]; title: string; noun: string }) {
  return <QuestionRun testID="lab-run" title={title} steps={steps} summary={false} calm onClose={onClose} onDone={(r) => onDone(quizResult(noun, r))} />;
}

export function CorrelationCause(p: RunnerProps) {
  const steps = React.useMemo<Step[]>(() => CORR_SCENARIOS.map((sc) => ({ id: sc.id, context: sc.headline, contextLabel: "Headline", art: <Scatter sc={sc} />, prompt: "What is the fairest reading?", options: CORR_READINGS.slice(0, 5), answer: Math.max(0, CORR_READINGS.indexOf(sc.answer)), why: `${sc.why} ${sc.behind}` })), []);
  return <Quiz {...p} steps={steps} title="Correlation or cause?" noun="headlines" />;
}

export function BiasSpotter(p: RunnerProps) {
  const steps = React.useMemo<Step[]>(() => {
    const rand = seeded(11);
    return BIAS_CASES.flatMap((b) => {
      const options = shuffle([b.bias, ...shuffle(BIASES.filter((x) => x !== b.bias), rand).slice(0, 3)], rand);
      return [
        { id: b.id, context: b.text, contextLabel: "On the ward", prompt: "Which thinking trap is this?", options, answer: options.indexOf(b.bias), why: b.why },
        { id: `${b.id}-fix`, context: b.text, contextLabel: b.bias, prompt: "What would have caught it?", options: b.fixes.slice(0, 5), answer: b.fix },
      ];
    });
  }, []);
  return <Quiz {...p} steps={steps} title="Bias spotter" noun="questions" />;
}

export function Conservation(p: RunnerProps) {
  const steps = React.useMemo<Step[]>(
    () =>
      CONS_ITEMS.flatMap((it) => {
        const task = CONS_TASK_TEXT[it.task];
        const scene = `${task?.before ?? ""} ${task?.after ?? ""}\n\n${it.child}, ${it.age}: "${it.says}"`;
        return [
          { id: it.id, context: scene, contextLabel: task?.title ?? "Task", prompt: "Which stage is this child showing?", options: CONS_STAGES, answer: Math.max(0, CONS_STAGES.indexOf(it.stage)), why: it.why },
          { id: `${it.id}-why`, context: `${it.child}, ${it.age}: "${it.says}"`, contextLabel: task?.title ?? "Task", prompt: "What is behind the answer?", options: CONS_REASONS, answer: Math.max(0, CONS_REASONS.indexOf(it.reason)), why: it.why },
        ];
      }),
    [],
  );
  return <Quiz {...p} steps={steps} title="Conservation tasks" noun="answers" />;
}

/** Every experiment the website runs has a runner here, by experiment id. */
export const RUNNERS: Record<string, React.ComponentType<RunnerProps>> = {
  "digit-span": DigitSpan,
  "serial-position": SerialPosition,
  stroop: Stroop,
  "change-detection": ChangeDetection,
  "muller-lyer": MullerLyer,
  schedules: Schedules,
  "bias-spotter": BiasSpotter,
  pavlov: Pavlov,
  "design-study": DesignStudy,
  "correlation-cause": CorrelationCause,
  conservation: Conservation,
  attribution: Attribution,
};
