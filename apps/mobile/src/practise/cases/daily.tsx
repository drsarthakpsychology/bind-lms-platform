import { useLocalSearchParams } from "expo-router";
import { FlaskConical, Lightbulb } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";

import { Button, Row, RowList, Section, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { motion, space, useTheme } from "@/theme";
import { play, useLoad, useMove } from "../api";
import { EndPanel, FrameError, FrameLoading, GameFrame, HudLine, leave, MoveError, Verdict } from "../frame";
import { Story } from "../parts";
import { useReactions } from "../reactions";
import type { DailyAction, DailyMove, DailyView } from "../types";
import { GuessSheet } from "./guess";

const HOW = ["One new patient a day. The case opens on the first clue.", "Name the diagnosis. A wrong guess shows why it's wrong and opens the next clue.", "You may open a clue or order a test instead; each costs one clue point. From clue four, a guess comes first.", "100 points on clue one, 15 less for each point used. Hints cost 10."];
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
  const body = (
    <>
      <Section title="Clues">
        <View style={{ gap: space[3] }}>
          {v.clues.map((cl, k) => (
            <Animated.View key={k} entering={reduce || k < first.view.clues.length ? undefined : FadeInDown.duration(motion.state)} style={{ flexDirection: "row", gap: space[3] }}>
              <T v="score" style={{ width: 20 }} num>
                {k + 1}
              </T>
              <T v="reading" style={{ flex: 1 }}>
                {cl}
              </T>
            </Animated.View>
          ))}
        </View>
      </Section>
      {v.guesses.length ? (
        <Section title="Your guesses" quiet>
          <View style={{ gap: space[3] }}>
            {v.guesses.map((g, k) => (
              <View key={k} style={{ gap: 2 }}>
                <T v="bodyStrong" tone={g.ok ? "ink" : "danger"}>
                  {g.ok ? "✓" : "✗"} {g.name}
                </T>
                {g.reason ? (
                  <T v="small" tone="muted">
                    {g.reason}
                  </T>
                ) : null}
              </View>
            ))}
          </View>
        </Section>
      ) : null}
      <Section title="Tests you can order" quiet>
        <RowList>
          {v.investigations.map((x) => (
            <Row key={x.i} testID={`daily-inv-${x.i}`} icon={<FlaskConical size={18} color={c.muted} />} title={`${KIND[x.kind] ?? x.kind}: ${x.label}`} meta={x.result ?? (over ? undefined : "Costs one clue point")} onPress={x.ordered || over ? undefined : () => void act({ t: "inv", i: x.i })} chevron={false} trailing={x.ordered || over ? undefined : "Order"} />
          ))}
        </RowList>
      </Section>
      {v.hints.chapter || v.hints.pointer ? (
        <Story kicker="Hint">
          {v.hints.chapter ? <T>Chapter: {v.hints.chapter}</T> : null}
          {v.hints.pointer ? <T>{v.hints.pointer}</T> : null}
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
          <Section title="Why not the look-alikes">
            <RowList>
              {r.lookAlikes.map((l, k) => (
                <View key={k} style={{ paddingVertical: space[3], gap: 2 }}>
                  <T v="bodyStrong">{l.name}</T>
                  <T v="small" tone="muted">
                    {l.whyNot}
                  </T>
                </View>
              ))}
            </RowList>
          </Section>
          {rest ? (
            <Section title="What you did not open">
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
            </Section>
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
      score={String(Math.max(10, 100 - 15 * v.points))}
      scoreLabel="Points on the table"
      hud={hud}
      saves
      confirmLeave={v.cluesOpen > 1 || v.guesses.length > 0}
      thumb={
        <>
          <Button label="Name the diagnosis" onPress={() => setGuessing(true)} disabled={mv.pending} testID="daily-guess" />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Button kind="text" label={v.canClue ? "Next clue" : "Guess to open the next clue"} disabled={!v.canClue || mv.pending} onPress={() => void act({ t: "clue" })} testID="daily-clue" />
            <Button kind="text" label={v.hints.used >= 2 ? "No hints left" : "Hint"} disabled={v.hints.used >= 2 || mv.pending} onPress={() => void act({ t: "hint" })} icon={<Lightbulb size={16} color={c.link} />} testID="daily-hint" />
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
