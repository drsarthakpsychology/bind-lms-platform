import { useLocalSearchParams } from "expo-router";
import { FlaskConical, Lightbulb } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";

import { Button, Label, Row, RowList, Stone, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { motion, space, useTheme } from "@/theme";
import { play, useLoad, useMove } from "../api";
import { EndPanel, FrameError, FrameLoading, GameFrame, HudLine, leave, MoveError, Verdict } from "../frame";
import { Story } from "../parts";
import { useReactions } from "../reactions";
import type { DailyAction, DailyMove, DailyView } from "../types";
import { GuessSheet } from "./guess";

const HOW = ["One new patient a day. You start with who they are, what they say, how long, and what anyone would notice.", "Name the diagnosis. A wrong guess shows why it's wrong and opens the next clue.", "You may open a clue or order a test instead; each costs one clue point. From clue four, a guess comes first.", "100 points at the start, 15 less for each clue point. Up to 3 hints: the first is free, the next two cost 5 points each."];
const HINT_PTS = [0, 5, 5];
const hintLoss = (n: number) => HINT_PTS.slice(0, n).reduce((a, b) => a + b, 0);
const KIND: Record<string, string> = { mse: "Mental state", collateral: "Family", scale: "Rating scale", lab: "Tests" };

/** Daily case: name today's patient in as few clues as you can. Each move is checked on the server. */
export function DailyCase() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const [mode, setMode] = React.useState<"daily" | "practice">(params.mode === "practice" ? "practice" : "daily");
  const [caseId, setCaseId] = React.useState<string | undefined>(undefined);
  const q = useLoad(() => play<DailyMove>("daily", "move", { mode, caseId }), `${mode}:${caseId ?? ""}`);
  const [nextErr, setNextErr] = React.useState<unknown>(null);
  const another = async () => {
    try {
      const n = await play<{ ok: true; caseId: string }>("daily", "next", [], caseId ?? q.data?.view.caseId);
      setMode("practice");
      setCaseId(n.caseId);
    } catch (e) {
      setNextErr(e);
    }
  };
  if (q.error || nextErr) return <FrameError title="Daily case" error={q.error ?? nextErr} onRetry={() => { setNextErr(null); q.retry(); }} />;
  if (!q.data) return <FrameLoading title="Daily case" />;
  return <CaseBoard key={q.data.view.caseId} first={q.data} mode={mode} caseId={caseId} another={() => void another()} />;
}

function CaseBoard({ first, mode, caseId, another }: { first: DailyMove; mode: "daily" | "practice"; caseId?: string; another: () => void }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const mv = useMove();
  const react = useReactions();
  const [res, setRes] = React.useState(first);
  const [guessing, setGuessing] = React.useState(false);
  const [rest, setRest] = React.useState<{ clues: { n: number; text: string }[]; tests: { label: string; result: string }[] } | null>(null);
  const v: DailyView = res.view;
  const over = v.status !== "playing";

  const act = async (action: DailyAction) => {
    const r = await mv.run(() => play<DailyMove>("daily", "move", { mode, caseId: caseId ?? v.caseId, action }));
    if (!r) return;
    if (action.t === "guess") {
      const g = r.view.guesses[r.view.guesses.length - 1];
      if (g) react.answer(g.ok);
    } else haptic.select();
    setRes(r);
  };
  const showRest = async () => {
    const r = await mv.run(() => play<{ ok: true; rest: { clues: { n: number; text: string }[]; tests: { label: string; result: string }[] } }>("daily", "rest", { mode, caseId: caseId ?? v.caseId }));
    if (r) setRest(r.rest);
  };

  const title = mode === "daily" ? `Daily case #${res.meta.number}` : "Practice case";
  const hud = <HudLine left={v.setting} right={`Clue ${v.cluesOpen} of 6`} />;
  const o = v.opening;
  const steps = v.hints.steps ?? (v.hints.pointer ? [v.hints.pointer] : []);
  const maxHints = v.hints.max ?? 2;
  const next = v.hints.next === undefined ? (v.hints.used < maxHints ? { n: v.hints.used + 1, points: 10, usesHint: true } : null) : v.hints.next;
  const hintLabel = next ? `Hint ${next.n} of ${maxHints}: ${next.points ? `minus ${next.points}` : "free"}` : "No hints left";
  const body = (
    <>
      {o ? (
        <Story kicker="The patient">
          <View style={{ gap: space[2] }} testID="daily-opening">
            <T v="bodyStrong">{o.who}</T>
            <T v="reading">{`"${o.says}"`}</T>
            <T v="small">{`How long: ${o.since}`}</T>
            {o.seen.map((x, k) => (
              <T key={k} v="small" tone="muted">
                {`\u2022 ${x}`}
              </T>
            ))}
          </View>
        </Story>
      ) : null}
      <Story kicker={o ? "Clues" : "The patient"}>
        <View style={{ gap: space[3] }}>
          {v.clues.map((cl, k) => (
            <Animated.View key={k} entering={reduce || k < first.view.clues.length ? undefined : FadeInDown.duration(motion.state)} style={{ flexDirection: "row", gap: space[3] }}>
              <T v="bodyStrong" tone="muted" style={{ width: 20 }} num>
                {k + 1}
              </T>
              <T v="reading" style={{ flex: 1 }}>
                {cl}
              </T>
            </Animated.View>
          ))}
        </View>
      </Story>
      {v.guesses.length ? (
        <View style={{ gap: space[2] }}>
          <Label>Your guesses</Label>
          <View style={{ gap: space[2] }}>
            {v.guesses.map((g, k) => (
              <View key={k} style={{ gap: 2, borderRadius: 18, padding: space[3], backgroundColor: g.ok ? c.lime : c.missBg }}>
                <T v="bodyStrong" style={{ color: g.ok ? c.onLime : c.ink }}>
                  {g.ok ? "Right: " : "Not this: "}
                  {g.name}
                </T>
                {g.reason ? (
                  <T v="small" tone="muted">
                    {g.reason}
                  </T>
                ) : null}
              </View>
            ))}
          </View>
        </View>
      ) : null}
      <View style={{ gap: space[2] }}>
        <Label>Tests you can order</Label>
        <RowList>
          {v.investigations.map((x) => (
            <Row key={x.i} testID={`daily-inv-${x.i}`} icon={<FlaskConical size={18} color={c.muted} />} title={`${KIND[x.kind] ?? x.kind}: ${x.label}`} meta={x.result ?? (over ? undefined : "Costs one clue point")} onPress={x.ordered || over ? undefined : () => void act({ t: "inv", i: x.i })} chevron={false} trailing={x.ordered || over ? undefined : "Order"} />
          ))}
        </RowList>
      </View>
      {steps.length ? (
        <Story kicker="Hints">
          <View style={{ gap: space[2] }}>
            {steps.map((h, k) => (
              <T key={k} testID={`daily-hint-${k + 1}`}>
                {`${k + 1}. ${h}`}
              </T>
            ))}
          </View>
        </Story>
      ) : null}
    </>
  );

  if (over && v.reveal) {
    const r = v.reveal;
    return (
      <GameFrame testID="case-daily" title={title} thumb={<><Button label="Play a practice case" onPress={another} testID="daily-another" /><Button kind="text" label="Back to Practise" onPress={leave} /></>}>
        <EndPanel kicker={v.status === "solved" ? "Solved" : "The answer"} score={String(v.score)} line={r.answer} outcome={v.status === "solved" ? (v.points <= 1 ? "won" : "mixed") : "lost"} stats={[{ label: "Clue points", value: String(v.points) }, ...(res.xp ? [{ label: "XP", value: `+${res.xp}` }] : []), ...(mode === "daily" ? [{ label: "Days in a row", value: String(res.meta.streak) }] : [])]}>
          <T v="h1" accessibilityLabel={`Your round: ${v.grid}`}>
            {v.grid}
          </T>
          <T v="reading">{r.overview}</T>
          <View style={{ gap: space[2] }}>
            <Label>Why not the look-alikes</Label>
            {r.lookAlikes.map((l, k) => (
              <Stone key={k} style={{ gap: 2 }}>
                <T v="bodyStrong">{l.name}</T>
                <T v="small" tone="muted">
                  {l.whyNot}
                </T>
              </Stone>
            ))}
          </View>
          {rest ? (
            <View style={{ gap: space[2] }}>
              <Label>What you did not open</Label>
              {rest.clues.map((cl) => (
                <T key={cl.n} v="small">
                  {cl.n}. {cl.text}
                </T>
              ))}
              {rest.tests.map((t, k) => (
                <T key={k} v="small" tone="muted">
                  {t.label}: {t.result}
                </T>
              ))}
            </View>
          ) : v.unopened ? (
            <Button kind="text" label={`See the ${v.unopened} things you did not open`} onPress={() => void showRest()} testID="daily-rest" />
          ) : null}
        </EndPanel>
      </GameFrame>
    );
  }

  return (
    <GameFrame
      testID="case-daily"
      title={title}
      howTo={HOW}
      score={String(Math.max(0, Math.max(10, 100 - 15 * v.points) - hintLoss(v.hints.used)))}
      scoreLabel="Points on the table"
      hud={hud}
      saves
      confirmLeave={v.cluesOpen > 1 || v.guesses.length > 0}
      thumb={
        <>
          <Button label="Name the diagnosis" onPress={() => setGuessing(true)} disabled={mv.pending} testID="daily-guess" />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Button kind="text" label={v.canClue ? "Next clue" : "Guess to open the next clue"} disabled={!v.canClue || mv.pending} onPress={() => void act({ t: "clue" })} testID="daily-clue" />
            <Button kind="text" label={hintLabel} disabled={!next || mv.pending} onPress={() => void act({ t: "hint" })} icon={<Lightbulb size={16} color={c.link} />} testID="daily-hint" />
          </View>
        </>
      }
    >
      {body}
      <MoveError text={mv.error} />
      {v.guesses.length && !v.guesses[v.guesses.length - 1]!.ok ? <Verdict right={false} title="Not this one" why="The next clue is open." seed={v.guesses.length} /> : null}
      <Pressable accessibilityRole="button" onPress={() => void act({ t: "giveup" })} disabled={mv.pending} hitSlop={8} style={{ minHeight: 44, alignSelf: "center", justifyContent: "center", paddingHorizontal: space[3] }} testID="daily-giveup">
        <T v="small" tone="muted" style={{ textDecorationLine: "underline" }}>
          Give up and see the answer
        </T>
      </Pressable>
      <GuessSheet open={guessing} onClose={() => setGuessing(false)} tried={v.guesses.map((g) => g.dx)} onGuess={(dx) => { setGuessing(false); void act({ t: "guess", dx }); }} />
    </GameFrame>
  );
}
