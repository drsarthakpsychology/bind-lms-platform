import { router } from "expo-router";
import * as React from "react";
import { View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";

import { Button, OptionRow, Row, RowList, Section, T } from "@/ds";
import { motion, space } from "@/theme";
import { play, useMove } from "../api";
import { EndPanel, EndThumb, GameFrame, HudLine, Lives, MoveError, StartScreen, StepStrip, Verdict } from "../frame";
import { Story } from "../parts";
import { useReactions } from "../reactions";
import { RX_LIVES, RX_STEPS, rxPoints, type RxAnswered, type RxCase, type RxDeal, type RxMode, type RxPick } from "../types";

const HOW = ["Each case is one medicine: name the chain, find the medicine from a story, spot a risky mix, or check a prescription.", "A chain has four steps: class, how it works, the side effect to remember, what to check.", "A case that is mostly wrong costs a life. Three lives.", "Every answer card links to the medicine's page, with **How it works** at the end."];
const MODES: { id: RxMode; name: string; line: string }[] = [
  { id: "mixed", name: "Mixed", line: "All four kinds of case" },
  { id: "chain", name: "Chains", line: "Class, mechanism, side effect, check" },
  { id: "mystery", name: "Which medicine?", line: "Find it from the story" },
  { id: "puzzle", name: "Risky mixes", line: "Two medicines together" },
  { id: "review", name: "Check the prescription", line: "Spot the problem" },
];

const howItWorks = (id: string) => router.push(`/medicine/${encodeURIComponent(id)}?section=how-it-works`);

/** Rx Detective: medicines, receptors and risky mixes. Each pick is checked on the server. */
export function RxGame() {
  const reduce = useReducedMotion();
  const mv = useMove();
  const react = useReactions();
  const [mode, setMode] = React.useState<RxMode>("mixed");
  const [run, setRun] = React.useState<{ token: string; cases: RxCase[] } | null>(null);
  const [i, setI] = React.useState(0);
  const [stepMarks, setStepMarks] = React.useState<{ chosen: string; right: boolean; correct: string }[]>([]);
  const [answered, setAnswered] = React.useState<RxAnswered | null>(null);
  const [lives, setLives] = React.useState(RX_LIVES);
  const [score, setScore] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [log, setLog] = React.useState<{ title: string; ok: boolean; page: { id: string; name: string } | null }[]>([]);
  const [over, setOver] = React.useState<{ xp: number } | null>(null);

  const start = async () => {
    mv.reset();
    react.reset();
    const r = await mv.run(() => play<RxDeal>("rx", "deal", mode));
    if (!r) return;
    setRun({ token: r.token, cases: r.cases });
    setI(0);
    setStepMarks([]);
    setAnswered(null);
    setLives(RX_LIVES);
    setScore(0);
    setStreak(0);
    setLog([]);
    setOver(null);
  };
  const finish = async (token: string) => {
    const r = await mv.run(() => play<{ ok: true; xp: number }>("rx", "finish", token));
    setOver({ xp: r?.xp ?? 0 });
  };

  if (!run) return <StartScreen testID="rx-start" title="Rx Detective" line="Medicines, receptors and risky mixes. Three lives." howTo={HOW} choiceLabel="Cases" choices={MODES} choice={mode} onChoice={setMode} onPlay={() => void start()} busy={mv.pending} error={mv.error} />;

  const cs = run.cases[i];
  if (over || !cs) {
    const right = log.filter((l) => l.ok).length;
    return (
      <GameFrame testID="game-rx" title="Rx Detective" thumb={<EndThumb again={() => void start()} />}>
        <EndPanel score={String(score)} line={lives > 0 ? "Every case done." : "Out of lives."} right={right} total={Math.max(1, log.length)} stats={[{ label: "Right", value: `${right}/${log.length}` }, { label: "XP", value: `+${over?.xp ?? 0}` }]}>
          <Section title="Look again">
            <RowList>
              {log.map((l, k) => (
                <Row key={k} title={l.title} meta={l.ok ? "Right" : l.page ? `Missed · How ${l.page.name} works` : "Missed"} onPress={l.page ? () => howItWorks(l.page!.id) : undefined} />
              ))}
            </RowList>
          </Section>
        </EndPanel>
      </GameFrame>
    );
  }

  const pick = async (value: string) => {
    if (answered || mv.pending) return;
    const r = await mv.run(() => play<RxPick>("rx", "pick", { token: run.token, value }));
    if (!r) return;
    setRun({ ...run, token: r.token });
    if (r.step) {
      setStepMarks((m) => [...m, { chosen: value, right: r.step!.right, correct: r.step!.correct }]);
      react.answer(r.step.right);
      return;
    }
    if (!r.answered) return;
    const a = r.answered;
    const s = a.graded.score;
    setAnswered(a);
    setScore((x) => x + rxPoints(s, streak));
    setStreak((x) => (s >= 0.999 ? x + 1 : 0));
    react.answer(s >= 0.5);
    if (cs.kind === "chain") setStepMarks((m) => [...m, { chosen: value, right: a.graded.parts.at(-1)?.ok ?? false, correct: a.graded.parts.at(-1)?.correct ?? "" }]);
    if (s < 0.5) setLives((l) => l - 1);
    setLog((l) => [...l, { title: cs.title === "Name the chain" && cs.kind === "chain" ? cs.name : cs.title, ok: s >= 0.5, page: a.pages[0] ?? null }]);
  };
  const next = () => {
    if (lives <= 0 || i + 1 >= run.cases.length) {
      void finish(run.token);
      return;
    }
    setI(i + 1);
    setStepMarks([]);
    setAnswered(null);
  };

  // The chain's current step: the answer to the last step is shown before the next one opens.
  const chainAt = cs.kind === "chain" ? stepMarks.length : 0;
  const options: { id: string; label: string }[] = cs.kind === "chain" ? (cs.steps[Math.min(chainAt, cs.steps.length - 1)] ?? []).map((o) => ({ id: o, label: o })) : cs.options;
  const stateOf = (id: string): "idle" | "right" | "wrong" | "dim" => {
    if (cs.kind === "chain") return "idle";
    if (!answered) return "idle";
    const part = answered.graded.parts[0];
    return id === part?.correct ? "right" : id === part?.chosen ? "wrong" : "dim";
  };
  const hud = (
    <View style={{ gap: space[2] }}>
      <StepStrip at={i} total={run.cases.length} marks={log.map((l) => (l.ok ? "ok" : "miss"))} />
      <HudLine left={`Case ${i + 1} of ${run.cases.length}`} right={<Lives left={lives} total={RX_LIVES} />} />
    </View>
  );
  const page = answered?.pages[0];
  return (
    <GameFrame testID="game-rx" title="Rx Detective" howTo={HOW} score={String(score)} hud={hud} confirmLeave thumb={answered ? <Button label={lives <= 0 || i + 1 >= run.cases.length ? "See my score" : "Next case"} onPress={next} testID="rx-next" /> : undefined}>
      <Animated.View key={i} entering={reduce ? undefined : FadeIn.duration(motion.state)} style={{ gap: space[4] }}>
        <T v="caption" tone="muted">
          {cs.title.toUpperCase()}
        </T>
        {cs.kind === "chain" ? (
          <View style={{ gap: space[1] }}>
            <T v="h1">{cs.name}</T>
            {cs.brands.length ? (
              <T v="small" tone="muted">
                Brands: {cs.brands.join(", ")}
              </T>
            ) : null}
          </View>
        ) : cs.kind === "mystery" ? (
          <Story kicker={cs.who}>
            <T v="reading">{cs.story}</T>
            {cs.clues.map((cl, k) => (
              <T key={k} v="small" tone="muted">
                · {cl}
              </T>
            ))}
          </Story>
        ) : cs.kind === "puzzle" ? (
          <Story kicker={`${cs.a} + ${cs.b}`}>
            <T v="reading">{cs.story}</T>
          </Story>
        ) : (
          <Story kicker={cs.who}>
            <T v="reading">{cs.story}</T>
            <View style={{ gap: 2, marginTop: space[2] }}>
              {cs.rx.map((x, k) => (
                <T key={k} v="bodyStrong">
                  Rx {x}
                </T>
              ))}
            </View>
          </Story>
        )}
        {cs.kind === "chain" ? (
          <View style={{ gap: space[3] }}>
            <StepStrip at={chainAt} total={RX_STEPS.length} marks={stepMarks.map((m) => (m.right ? "ok" : "miss"))} />
            {stepMarks.map((m, k) => (
              <View key={k} style={{ gap: 2 }}>
                <T v="caption" tone="muted">
                  {RX_STEPS[k]!.label.toUpperCase()}
                </T>
                <T v="bodyStrong" tone={m.right ? "ink" : "danger"}>
                  {m.right ? m.correct : `${m.chosen}: no. It is ${m.correct}.`}
                </T>
              </View>
            ))}
            {!answered ? <T v="h3">{RX_STEPS[Math.min(chainAt, 3)]!.ask}</T> : null}
          </View>
        ) : (
          <T v="h3">{cs.kind === "mystery" ? "Which medicine is it?" : cs.kind === "puzzle" ? "What is going on?" : "What is the main problem?"}</T>
        )}
        {cs.kind !== "chain" || !answered ? (
          <View style={{ gap: space[3] }}>
            {options.map((o, j) => (
              <OptionRow key={`${chainAt}-${o.id}`} index={j} text={o.label} testID={`rx-option-${j}`} disabled={!!answered || mv.pending} state={stateOf(o.id)} onPress={() => void pick(o.id)} />
            ))}
          </View>
        ) : null}
        <MoveError text={mv.error} />
        {answered ? (
          <Verdict
            right={answered.graded.score >= 0.5}
            partial={answered.graded.score > 0 && answered.graded.score < 1}
            title={answered.graded.score >= 0.999 ? undefined : answered.graded.score >= 0.5 ? "Partly right." : undefined}
            why={revealLine(answered)}
            seed={i}
            learn={page ? { label: answered.graded.score < 0.999 ? `See how ${page.name} works` : `Open ${page.name}`, onPress: () => howItWorks(page.id) } : null}
          />
        ) : null}
      </Animated.View>
    </GameFrame>
  );
}

function revealLine(a: RxAnswered): string {
  const r = a.reveal;
  switch (r.kind) {
    case "chain":
      return `${r.line} Dose: ${r.dose}.`;
    case "mystery":
      return `**${r.label}.** ${r.why}${r.not ? ` ${r.not}` : ""}`;
    case "puzzle":
      return `**${r.label}.** ${r.why}${r.not ? ` ${r.not}` : ""}`;
    case "review":
      return `**${r.answer}.** ${r.why} ${r.not}`;
  }
}
