import { router } from "expo-router";
import * as React from "react";
import { View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";

import { ProgressLine, RowList, Section, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { fonts, motion, space, useTheme } from "@/theme";
import { play, useMove } from "../api";
import { EndPanel, EndThumb, GameFrame, HudLine, MoveError, StartScreen } from "../frame";
import { Tile, AnswerRow } from "../parts";
import { useReactions } from "../reactions";
import { BLITZ_MS, multiplier, type BlitzAnswer, type BlitzFinish, type BlitzPrompt, type BlitzStart } from "../types";

const HOW = ["You have **60 seconds**. The clock is the server's: it does not pause.", "Tap the answer. The next question comes at once.", "Three right in a row doubles your points, six triples them, ten makes it four times.", "A wrong answer only resets the streak. Nothing is taken away."];
const HOLD_RIGHT = 420;
const HOLD_WRONG = 1100;

/** The phone's clock, only to draw the server's time left between replies. */
const clock = () => Date.now();

type Miss = { prompt: string; answer: string; why: string };
type Phase = { t: "start" } | { t: "count"; n: number } | { t: "run" } | { t: "end"; done: BlitzFinish | null };

/** Blitz: a 60-second fast-fact round. The server holds the clock and every answer. */
export function BlitzGame() {
  const c = useTheme();
  const reduce = useReducedMotion();
  const mv = useMove();
  const react = useReactions();
  const [phase, setPhase] = React.useState<Phase>({ t: "start" });
  const [q, setQ] = React.useState<BlitzPrompt | null>(null);
  const [run, setRun] = React.useState({ score: 0, combo: 0, correct: 0, answered: 0, best: 0 });
  const [reveal, setReveal] = React.useState<{ picked: number; answer: number } | null>(null);
  const [left, setLeft] = React.useState(BLITZ_MS);
  const [misses, setMisses] = React.useState<Miss[]>([]);
  const token = React.useRef<string | null>(null);
  const endAt = React.useRef(0);
  const finishing = React.useRef(false);

  const finish = React.useCallback(async () => {
    if (finishing.current) return;
    finishing.current = true;
    setLeft(0);
    const t = token.current;
    const done = t ? await play<BlitzFinish>("blitz", "finish", t).catch(() => null) : null;
    setPhase({ t: "end", done });
  }, []);

  // The clock: shown from the server's msLeft; when it runs out the round is sent to finish.
  React.useEffect(() => {
    if (phase.t !== "run") return;
    const id = setInterval(() => {
      const l = Math.max(0, endAt.current - clock());
      setLeft(l);
      if (l <= 0) {
        clearInterval(id);
        void finish();
      }
    }, 200);
    return () => clearInterval(id);
  }, [phase.t, finish]);

  // 3, 2, 1
  React.useEffect(() => {
    if (phase.t !== "count") return;
    haptic.select();
    const n = phase.n;
    const id = setTimeout(
      () => {
        if (n <= 1) {
          endAt.current = clock() + BLITZ_MS;
          setPhase({ t: "run" });
        } else setPhase({ t: "count", n: n - 1 });
      },
      reduce ? 300 : 650,
    );
    return () => clearTimeout(id);
  }, [phase, reduce]);

  const start = async () => {
    mv.reset();
    react.reset();
    finishing.current = false;
    const r = await mv.run(() => play<BlitzStart>("blitz", "start"));
    if (!r) return;
    token.current = r.token;
    setQ(r.question);
    setRun({ score: 0, combo: 0, correct: 0, answered: 0, best: 0 });
    setMisses([]);
    setReveal(null);
    setLeft(r.msLeft);
    setPhase({ t: "count", n: 3 });
  };

  const answer = async (choice: number) => {
    if (!q || reveal || phase.t !== "run") return;
    const asked = q;
    const r = await mv.run(() => play<BlitzAnswer>("blitz", "answer", token.current, asked.n, choice));
    if (!r) return;
    token.current = r.token;
    setReveal({ picked: choice, answer: r.answer });
    setRun({ ...r.state });
    react.answer(r.right);
    if (!r.right) {
      setMisses((m) => [...m, { prompt: asked.prompt, answer: asked.options[r.answer] ?? "", why: r.why }]);
    }
    endAt.current = clock() + r.msLeft;
    setTimeout(
      () => {
        setReveal(null);
        if (r.next) setQ(r.next);
        else void finish();
      },
      r.right ? HOLD_RIGHT : HOLD_WRONG,
    );
  };

  if (phase.t === "start") return <StartScreen testID="blitz-start" title="Blitz" line="Fast facts against the clock. Sixty seconds, as many as you can." howTo={HOW} onPlay={() => void start()} busy={mv.pending} error={mv.error} />;

  if (phase.t === "end") {
    const d = phase.done;
    const s = d?.state ?? run;
    return (
      <GameFrame testID="game-blitz" title="Blitz" thumb={<EndThumb again={() => void start()} extra={{ label: "This week's board", onPress: () => router.push("/game/leaderboard?game=blitz") }} />}>
        <EndPanel score={String(s.score)} line={d?.newBest ? "A new best." : d ? `Your best before today: ${d.bests.mine}` : "Saved when you are back online."} right={s.correct} total={Math.max(1, s.answered)} stats={[{ label: "Right", value: `${s.correct}/${s.answered}` }, { label: "Best streak", value: String(s.best) }, ...(d ? [{ label: "XP", value: `+${d.xp}` }] : [])]}>
          {d?.bests.cohort ? (
            <T v="small" tone="muted">
              Best in your batch this week: {d.bests.cohort.score} ({d.bests.cohort.you ? "you" : d.bests.cohort.name})
            </T>
          ) : null}
          {misses.length ? (
            <Section title="What you missed">
              <RowList>
                {misses.map((m, i) => (
                  <View key={i} style={{ paddingVertical: space[3], gap: space[1] }}>
                    <T v="small" tone="muted">
                      {m.prompt}
                    </T>
                    <T v="bodyStrong">{m.answer}</T>
                    <T v="small">{m.why}</T>
                  </View>
                ))}
              </RowList>
            </Section>
          ) : null}
        </EndPanel>
      </GameFrame>
    );
  }

  const mult = multiplier(run.combo);
  const secs = Math.ceil(left / 1000);
  const hud = (
    <View>
      <ProgressLine value={(left / BLITZ_MS) * 100} height={4} label={`${secs} seconds left`} />
      <HudLine left={`${run.correct} right · ${secs}s`} right={mult > 1 ? <T style={{ fontFamily: fonts.pixelDigits, color: c.link, fontSize: 16, lineHeight: 20 }} testID="blitz-mult">{`x${mult}`}</T> : undefined} />
    </View>
  );
  return (
    <GameFrame testID="game-blitz" title="Blitz" score={String(run.score)} hud={hud} hideHowTo confirmLeave>
      {phase.t === "count" ? (
        <Animated.View key={phase.n} entering={reduce ? undefined : FadeIn.duration(motion.state)} style={{ alignItems: "center", paddingVertical: space[8] }}>
          <T style={{ fontFamily: fonts.pixelDigits, fontSize: 96, lineHeight: 104, color: c.ink }} accessibilityLiveRegion="polite">
            {phase.n || "Go"}
          </T>
        </Animated.View>
      ) : q ? (
        <Animated.View key={q.n} entering={reduce ? undefined : FadeIn.duration(motion.press)} style={{ gap: space[5] }}>
          <T v="caption" tone="muted">
            {q.kind === "tf" ? "TRUE OR FALSE" : "PICK ONE"}
          </T>
          <T v="h2" testID="blitz-prompt">
            {q.prompt}
          </T>
          {q.kind === "tf" ? (
            <View style={{ flexDirection: "row", gap: space[3] }}>
              {q.options.map((o, j) => (
                <View key={j} style={{ flex: 1 }}>
                  <Tile text={o} testID={`blitz-option-${j}`} disabled={!!reveal || mv.pending} state={!reveal ? "idle" : j === reveal.answer ? "right" : j === reveal.picked ? "wrong" : "dim"} onPress={() => void answer(j)} />
                </View>
              ))}
            </View>
          ) : (
            <View style={{ gap: space[3] }}>
              {q.options.map((o, j) => (
                <AnswerRow key={j} index={j} text={o} testID={`blitz-option-${j}`} disabled={!!reveal || mv.pending} state={!reveal ? "idle" : j === reveal.answer ? "right" : j === reveal.picked ? "wrong" : "dim"} onPress={() => void answer(j)} />
              ))}
            </View>
          )}
          <MoveError text={mv.error} />
        </Animated.View>
      ) : null}
    </GameFrame>
  );
}
