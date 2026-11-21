import * as React from "react";
import { View } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";
import Svg, { Line } from "react-native-svg";

import { Button, Field, Label, Slider, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { Press, presets } from "@/motion";
import { fonts, layout, space, useTheme } from "@/theme";
import { cowanK, curveRegions, digitSequence, illusionBias, mean, parseRecall, recalledPositions, seeded, serialCurve, shuffle, spanCorrect, spanFromTrials, spanShouldStop, STROOP_COLOURS, stroopEffect, stroopTrials, WORD_POOL, type ChangeTrial, type StroopResponse } from "./scoring";
import { PlayShell } from "./shell";

/** What a finished experiment hands back: the student's own numbers, in words. */
export type LabResult = { headline: string; lines: { label: string; value: string }[]; bars?: { label: string; pct: number }[]; barsLabel?: string };
export type RunnerProps = { onDone: (r: LabResult) => void; onClose: () => void };

/** The white card a stimulus sits on, so its colours read the same in light and dark. */
function Stage({ children, h = 220 }: { children?: React.ReactNode; h?: number }) {
  const c = useTheme();
  return <View style={{ height: h, borderRadius: layout.radiusLg, backgroundColor: c.paper, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>{children}</View>;
}

/** A quiet word on the stage between trials. */
function StageWord({ children }: { children: React.ReactNode }) {
  const c = useTheme();
  return (
    <T v="h2" style={{ color: c.onPaper }}>
      {children}
    </T>
  );
}

/** One big thing arriving on the stage (a digit, a word). Pops in; simply there with Reduce Motion. */
function Flash({ k, children, color }: { k: string | number; children: string; color?: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  return (
    <Animated.View key={k} entering={reduce ? undefined : presets.pop(0)}>
      <T maxFontSizeMultiplier={1.1} accessibilityLiveRegion="assertive" style={{ fontFamily: fonts.big, fontSize: children.length > 2 ? 44 : 96, lineHeight: children.length > 2 ? 52 : 100, letterSpacing: -1, color: color ?? c.onPaper }}>
        {children}
      </T>
    </Animated.View>
  );
}

/* ------------------------------------------------------------- digit span */

export function DigitSpan({ onDone, onClose }: RunnerProps) {
  const [backward, setBackward] = React.useState(false);
  const [length, setLength] = React.useState(3);
  const [trials, setTrials] = React.useState<{ length: number; correct: boolean }[]>([]);
  const [fwd, setFwd] = React.useState(0);
  const [seq, setSeq] = React.useState<number[]>(() => digitSequence(3));
  const [at, setAt] = React.useState(-1); // -1 ready, 0..n-1 showing, n typing
  const [typed, setTyped] = React.useState("");
  const [last, setLast] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    if (at < 0 || at >= seq.length) return;
    const id = setTimeout(() => setAt(at + 1), 900);
    return () => clearTimeout(id);
  }, [at, seq.length]);
  const typing = at >= seq.length;
  const submit = () => {
    const correct = spanCorrect(seq, typed, backward);
    if (correct) haptic.success();
    else haptic.warn();
    const all = [...trials, { length, correct }];
    setLast(correct);
    setTyped("");
    const stop = spanShouldStop(all, length) || (correct && length >= 9);
    if (stop && !backward) {
      setFwd(spanFromTrials(all));
      setBackward(true);
      setTrials([]);
      setLength(2);
      setSeq(digitSequence(2));
      setAt(-1);
      return;
    }
    if (stop) {
      const back = spanFromTrials(all);
      onDone({ headline: `You held ${fwd} digits forwards and ${back} backwards.`, lines: [{ label: "Forwards", value: `${fwd} digits` }, { label: "Backwards", value: `${back} digits` }, { label: "The gap", value: `${Math.max(0, fwd - back)}` }], bars: [{ label: "Forwards", pct: (fwd / 9) * 100 }, { label: "Backwards", pct: (back / 9) * 100 }], barsLabel: "Out of 9 digits" });
      return;
    }
    const next = correct ? length + 1 : length;
    setTrials(all);
    setLength(next);
    setSeq(digitSequence(next));
    setAt(-1);
  };
  return (
    <PlayShell testID="lab-run" title={backward ? "Digit span, backwards" : "Digit span, forwards"} onClose={onClose} footer={typing ? <Button label="Check" testID="lab-submit" disabled={typed.replace(/\D/g, "").length < 1} onPress={submit} /> : at < 0 ? <Button label={`Show ${length} digits`} testID="lab-go" onPress={() => { setLast(null); setAt(0); }} /> : undefined}>
      <Stage>{at >= 0 && !typing ? <Flash k={at}>{String(seq[at])}</Flash> : <StageWord>{typing ? "Your turn" : last === null ? "Ready?" : last ? "Right" : "Not that time"}</StageWord>}</Stage>
      {typing ? (
        <Field label={backward ? "Type them backwards, last digit first" : "Type the digits in order"} value={typed} onChangeText={setTyped} keyboardType="number-pad" autoFocus maxLength={12} returnKeyType="done" onSubmitEditing={submit} testID="lab-input" />
      ) : (
        <T tone="muted">{backward ? "Now the same, but you type them in reverse order." : "Watch the digits, one at a time. Then type them back. Two tries at each length."}</T>
      )}
    </PlayShell>
  );
}

/* -------------------------------------------------------- serial position */

const LISTS = 2;
const LIST_LEN = 12;

export function SerialPosition({ onDone, onClose }: RunnerProps) {
  const lists = React.useMemo(() => {
    const pool = shuffle(WORD_POOL);
    return Array.from({ length: LISTS }, (_, i) => pool.slice(i * LIST_LEN, (i + 1) * LIST_LEN));
  }, []);
  const [n, setN] = React.useState(0);
  const [at, setAt] = React.useState(-1);
  const [text, setText] = React.useState("");
  const [got, setGot] = React.useState<boolean[][]>([]);
  const list = lists[n]!;
  React.useEffect(() => {
    if (at < 0 || at >= list.length) return;
    const id = setTimeout(() => setAt(at + 1), 1100);
    return () => clearTimeout(id);
  }, [at, list.length]);
  const recalling = at >= list.length;
  const submit = () => {
    const all = [...got, recalledPositions(list, parseRecall(text))];
    setText("");
    if (n + 1 < LISTS) {
      setGot(all);
      setN(n + 1);
      setAt(-1);
      return;
    }
    const curve = serialCurve(all);
    const r = curveRegions(curve);
    const pc = (x: number) => `${Math.round(x * 100)}%`;
    onDone({ headline: `You remembered ${pc(r.primacy)} of the first words, ${pc(r.middle)} of the middle and ${pc(r.recency)} of the last.`, lines: [{ label: "First three", value: pc(r.primacy) }, { label: "Middle six", value: pc(r.middle) }, { label: "Last three", value: pc(r.recency) }], bars: curve.map((v, i) => ({ label: String(i + 1), pct: v * 100 })), barsLabel: "Recall by place in the list" });
  };
  return (
    <PlayShell testID="lab-run" title="Serial position" done={n + (recalling ? 0.5 : 0)} total={LISTS} onClose={onClose} footer={recalling ? <Button label={n + 1 < LISTS ? "Next list" : "See my curve"} testID="lab-submit" onPress={submit} /> : at < 0 ? <Button label={`Show list ${n + 1}`} testID="lab-go" onPress={() => setAt(0)} /> : undefined}>
      <Stage>{at >= 0 && !recalling ? <Flash k={at}>{list[at]!}</Flash> : <StageWord>{recalling ? "Now recall" : "Ready?"}</StageWord>}</Stage>
      {recalling ? <Field label="Type every word you remember, in any order" area value={text} onChangeText={setText} autoFocus autoCapitalize="none" autoCorrect={false} testID="lab-input" /> : <T tone="muted">Twelve words, one at a time. Just read them. Then write down all you can.</T>}
    </PlayShell>
  );
}

/* ------------------------------------------------------------------ stroop */

const STROOP_N = 16;

export function Stroop({ onDone, onClose }: RunnerProps) {
  const c = useTheme();
  const trials = React.useMemo(() => stroopTrials(STROOP_N), []);
  const [i, setI] = React.useState(-1);
  const [gap, setGap] = React.useState(false);
  const shownAt = React.useRef(0);
  const out = React.useRef<StroopResponse[]>([]);
  const trial = trials[i];
  React.useEffect(() => {
    if (!gap) {
      shownAt.current = Date.now();
      return;
    }
    const id = setTimeout(() => setGap(false), 350);
    return () => clearTimeout(id);
  }, [gap, i]);
  const answer = (name: string) => {
    if (!trial || gap) return;
    out.current.push({ ...trial, answer: name, rt: Date.now() - shownAt.current });
    if (i + 1 >= trials.length) {
      const e = stroopEffect(out.current);
      onDone({
        headline: e.usable ? `Naming the ink took you ${Math.abs(e.effectMs)} ms ${e.effectMs >= 0 ? "longer" : "less"} when the word disagreed with it.` : "Too few clean answers to measure the effect this time. Try it once more.",
        lines: [{ label: "Word and ink agree", value: `${e.congruentMs} ms` }, { label: "Word and ink disagree", value: `${e.incongruentMs} ms` }, { label: "Slips", value: `${e.congruentErrors + e.incongruentErrors}` }],
        bars: e.usable ? [{ label: "Agree", pct: Math.min(100, e.congruentMs / 15) }, { label: "Disagree", pct: Math.min(100, e.incongruentMs / 15) }] : undefined,
        barsLabel: "Time to answer",
      });
      return;
    }
    setI(i + 1);
    setGap(true);
  };
  const ink = trial ? STROOP_COLOURS.find((x) => x.name === trial.ink)?.css : undefined;
  return (
    <PlayShell testID="lab-run" title="Stroop" done={Math.max(0, i)} total={STROOP_N} onClose={onClose} scroll={false} footer={i < 0 ? <Button label="Start" testID="lab-go" onPress={() => setI(0)} /> : undefined}>
      <Stage>{trial && !gap ? <Flash k={i} color={ink}>{trial.word}</Flash> : i < 0 ? <StageWord>Ready?</StageWord> : null}</Stage>
      {i < 0 ? (
        <T tone="muted">Tap the colour of the ink, not the word. Be quick, but be right.</T>
      ) : (
        <View accessibilityRole="radiogroup" accessibilityLabel="Colour of the ink" style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
          {STROOP_COLOURS.map((x) => (
            <Press key={x.name} testID={`ink-${x.name}`} accessibilityRole="button" accessibilityLabel={x.name} onPress={() => answer(x.name)} scale={0.95} style={{ width: "48%", flexGrow: 1 }} innerStyle={{ minHeight: 64, borderRadius: layout.radius, backgroundColor: c.card, alignItems: "center", justifyContent: "center" }}>
              <T v="button">{x.name}</T>
            </Press>
          ))}
        </View>
      )}
    </PlayShell>
  );
}

/* ---------------------------------------------------------- spot the change */

const SIZES = [2, 4, 6, 2, 4, 6, 4, 6, 2, 6, 4, 2];

export function ChangeDetection({ onDone, onClose }: RunnerProps) {
  const c = useTheme();
  const palette = React.useMemo(() => [...STROOP_COLOURS.map((x) => x.css), c.sk.lime, c.onPaper], [c.sk.lime, c.onPaper]);
  const plan = React.useMemo(() => {
    const rand = seeded(Date.now() % 100000);
    return SIZES.map((n, k) => {
      const cells = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8], rand).slice(0, n);
      const colours = cells.map(() => Math.floor(rand() * palette.length));
      const changed = k % 2 === 0 ? rand() > 0.35 : rand() > 0.65;
      const which = Math.floor(rand() * n);
      const after = colours.map((col, j) => (changed && j === which ? (col + 1 + Math.floor(rand() * (palette.length - 1))) % palette.length : col));
      return { n, cells, colours, after, changed };
    });
  }, [palette.length]);
  const [i, setI] = React.useState(-1);
  const [phase, setPhase] = React.useState<"study" | "blank" | "test">("study");
  const out = React.useRef<ChangeTrial[]>([]);
  React.useEffect(() => {
    if (i < 0 || phase === "test") return;
    const id = setTimeout(() => setPhase(phase === "study" ? "blank" : "test"), phase === "study" ? 1000 : 900);
    return () => clearTimeout(id);
  }, [i, phase]);
  const t = plan[i];
  const say = (saidChanged: boolean) => {
    if (!t) return;
    out.current.push({ setSize: t.n, changed: t.changed, saidChanged });
    if (i + 1 >= plan.length) {
      const k = cowanK(out.current);
      const best = k.reduce((a, x) => Math.max(a, x.k), 0);
      onDone({ headline: `You held about ${best} coloured squares in mind at once.`, lines: k.map((x) => ({ label: `${x.setSize} squares`, value: `about ${x.k} held` })), bars: k.map((x) => ({ label: `${x.setSize}`, pct: (x.k / 6) * 100 })), barsLabel: "Squares held, by how many were shown" });
      return;
    }
    setI(i + 1);
    setPhase("study");
  };
  const show = t && phase !== "blank" ? (phase === "study" ? t.colours : t.after) : null;
  return (
    <PlayShell testID="lab-run" title="Spot the change" done={Math.max(0, i)} total={plan.length} onClose={onClose} scroll={false} footer={i < 0 ? <Button label="Start" testID="lab-go" onPress={() => setI(0)} /> : undefined}>
      <Stage h={252}>
        {t && show ? (
          <View style={{ width: 204, height: 204, flexDirection: "row", flexWrap: "wrap" }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((cell) => {
              const j = t.cells.indexOf(cell);
              return <View key={cell} style={{ width: 68, height: 68, padding: 9 }}>{j >= 0 ? <View style={{ flex: 1, borderRadius: 10, backgroundColor: palette[show[j]!] }} /> : null}</View>;
            })}
          </View>
        ) : i < 0 ? (
          <StageWord>Ready?</StageWord>
        ) : null}
      </Stage>
      {i < 0 ? (
        <T tone="muted">Some squares appear, vanish, and come back. Did one change colour?</T>
      ) : (
        <View style={{ flexDirection: "row", gap: space[2], opacity: phase === "test" ? 1 : 0.4 }}>
          <Button kind="quiet" full={false} label="Same" testID="lab-same" disabled={phase !== "test"} onPress={() => say(false)} style={{ flex: 1 }} />
          <Button kind="quiet" full={false} label="Changed" testID="lab-changed" disabled={phase !== "test"} onPress={() => say(true)} style={{ flex: 1 }} />
        </View>
      )}
    </PlayShell>
  );
}

/* ------------------------------------------------------------ Müller-Lyer */

const ML = [{ len: 150, out: false }, { len: 120, out: true }, { len: 170, out: false }, { len: 135, out: true }];

export function MullerLyer({ onDone, onClose }: RunnerProps) {
  const [i, setI] = React.useState(0);
  const [v, setV] = React.useState(90);
  const res = React.useRef<{ bias: number; out: boolean }[]>([]);
  const t = ML[i]!;
  const next = () => {
    res.current.push({ bias: illusionBias(t.len, v), out: t.out });
    if (i + 1 >= ML.length) {
      const inward = mean(res.current.filter((r) => !r.out).map((r) => r.bias));
      const outward = mean(res.current.filter((r) => r.out).map((r) => r.bias));
      const pc = (x: number) => `${x > 0 ? "+" : ""}${Math.round(x)}%`;
      onDone({ headline: `Lines with tails looked ${Math.abs(Math.round(inward))}% ${inward >= 0 ? "longer" : "shorter"} to you than they are.`, lines: [{ label: "Tails pointing out", value: pc(inward) }, { label: "Arrow heads", value: pc(outward) }], bars: [{ label: "Tails", pct: Math.min(100, 50 + inward * 2) }, { label: "Arrows", pct: Math.max(0, Math.min(100, 50 + outward * 2)) }], barsLabel: "How long each looked (the middle is true length)" });
      return;
    }
    setI(i + 1);
    setV(90);
  };
  const W = 300;
  const x1 = (W - t.len) / 2;
  const x2 = x1 + t.len;
  const f = t.out ? 14 : -14;
  const ink = useTheme().onPaper;
  return (
    <PlayShell testID="lab-run" title="Müller-Lyer" done={i} total={ML.length} onClose={onClose} footer={<Button label={i + 1 < ML.length ? "They match" : "They match. Show me"} testID="lab-submit" onPress={next} />}>
      <Stage h={200}>
        <Svg width={W} height={170} viewBox={`0 0 ${W} 170`} accessibilityLabel="Two lines. Make the lower one as long as the upper one.">
          <Line x1={x1} y1={50} x2={x2} y2={50} stroke={ink} strokeWidth={3} />
          {[x1, x2].map((x, k) => {
            const d = (k === 0 ? 1 : -1) * f;
            return (
              <React.Fragment key={k}>
                <Line x1={x} y1={50} x2={x + d} y2={36} stroke={ink} strokeWidth={3} strokeLinecap="round" />
                <Line x1={x} y1={50} x2={x + d} y2={64} stroke={ink} strokeWidth={3} strokeLinecap="round" />
              </React.Fragment>
            );
          })}
          <Line x1={(W - v) / 2} y1={125} x2={(W + v) / 2} y2={125} stroke={ink} strokeWidth={3} strokeLinecap="round" />
        </Svg>
      </Stage>
      <View style={{ gap: space[1] }}>
        <Label>Make the lower line as long as the upper one</Label>
        <Slider testID="lab-slider" label="Length of the lower line" value={v} min={60} max={240} step={2} onChange={setV} format={(n) => `${n}`} />
      </View>
      <T v="small" tone="muted">
        Judge the straight part only. Ignore the ends.
      </T>
    </PlayShell>
  );
}
