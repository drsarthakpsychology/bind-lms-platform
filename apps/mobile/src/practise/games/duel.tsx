import * as React from "react";
import { View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";

import { Button, OptionRow, ProgressLine, T } from "@/ds";
import { fonts, motion, space, useTheme } from "@/theme";
import { play, useMove } from "../api";
import { EndPanel, EndThumb, GameFrame, HudLine, MoveError, StartScreen, StepStrip, Verdict } from "../frame";
import { Story } from "../parts";
import { useReactions } from "../reactions";
import { DUEL_ROUND_MS, type DuelAnswer, type DuelRound, type DuelStart } from "../types";

const HOW = ["Five rounds against Dr Bot. Each round is one patient with four look-alike diagnoses.", "Pick the diagnosis (100 points), then the one feature that settles it (50 more).", "Twenty seconds a round. Dr Bot answers too; the higher total wins."];

/** Differential duel against the bot. Rounds are dealt and scored on the server. */
export function DuelGame() {
  const c = useTheme();
  const reduce = useReducedMotion();
  const mv = useMove();
  const react = useReactions();
  const [run, setRun] = React.useState<{ token: string; total: number; bot: string } | null>(null);
  const [round, setRound] = React.useState<DuelRound | null>(null);
  const [dx, setDx] = React.useState<number | null>(null);
  const [res, setRes] = React.useState<DuelAnswer | null>(null);
  const [score, setScore] = React.useState({ you: 0, bot: 0 });
  const [marks, setMarks] = React.useState<("ok" | "miss" | null)[]>([]);
  const [left, setLeft] = React.useState(DUEL_ROUND_MS);
  const [end, setEnd] = React.useState<DuelAnswer["end"]>(null);
  const until = React.useRef(0);

  const start = async () => {
    mv.reset();
    react.reset();
    const r = await mv.run(() => play<DuelStart>("duel", "start", 1));
    if (!r) return;
    setRun({ token: r.token, total: r.rounds, bot: r.bot.name });
    setRound(r.round);
    setDx(null);
    setRes(null);
    setScore({ you: 0, bot: 0 });
    setMarks([]);
    setEnd(null);
    until.current = Date.now() + DUEL_ROUND_MS;
  };

  const send = React.useCallback(
    async (d: number, f: number) => {
      if (!run || !round) return;
      const r = await mv.run(() => play<DuelAnswer>("duel", "answer", { token: run.token, round: round.n, dx: d, feature: f }));
      if (!r) return;
      setRun({ ...run, token: r.token });
      setRes(r);
      setScore(r.score);
      setMarks((m) => [...m, r.dxOk ? "ok" : "miss"]);
      react.answer(r.dxOk);
    },
    [run, round, mv, react],
  );

  React.useEffect(() => {
    if (!round || res) return;
    const id = setInterval(() => {
      const l = Math.max(0, until.current - Date.now());
      setLeft(l);
      if (l <= 0) {
        clearInterval(id);
        void send(dx ?? -1, -1);
      }
    }, 250);
    return () => clearInterval(id);
  }, [round, res, dx, send]);

  if (!run || !round) return <StartScreen testID="duel-start" title="Differential duel" line="Look-alike diagnoses, five rounds, against Dr Bot." howTo={HOW} onPlay={() => void start()} playLabel="Start the duel" busy={mv.pending} error={mv.error} />;

  if (end) {
    const won = end.won === true;
    return (
      <GameFrame testID="game-duel" title="Differential duel" thumb={<EndThumb again={() => void start()} againLabel="Duel again" />}>
        <EndPanel kicker={end.won === "draw" ? "A draw" : won ? "You won" : "Dr Bot won"} score={String(score.you)} scoreOf={`vs ${score.bot}`} outcome={end.won === "draw" ? "mixed" : won ? "won" : "lost"} stats={[{ label: "Diagnoses right", value: `${marks.filter((m) => m === "ok").length}/${run.total}` }, { label: "XP", value: `+${end.xp}` }]} />
      </GameFrame>
    );
  }

  const next = () => {
    if (!res) return;
    if (res.end) {
      setEnd(res.end);
      return;
    }
    setRound(res.next);
    setRes(null);
    setDx(null);
    until.current = Date.now() + DUEL_ROUND_MS;
    setLeft(DUEL_ROUND_MS);
  };
  const versus = (
    <T style={{ fontFamily: fonts.pixelDigits, fontSize: 16, lineHeight: 20, color: c.ink }} testID="duel-score">
      {`${score.you} : ${score.bot}`}
    </T>
  );
  const hud = (
    <View style={{ gap: space[2] }}>
      <StepStrip at={round.n} total={run.total} marks={marks} />
      {!res ? <ProgressLine value={(left / DUEL_ROUND_MS) * 100} height={4} label={`${Math.ceil(left / 1000)} seconds left`} /> : null}
      <HudLine left={`Round ${round.n + 1} of ${run.total} · You : ${run.bot}`} right={versus} />
    </View>
  );
  return (
    <GameFrame testID="game-duel" title="Differential duel" howTo={HOW} hud={hud} confirmLeave thumb={res ? <Button label={res.end ? "See who won" : "Next round"} onPress={next} testID="duel-next" /> : undefined}>
      <Animated.View key={round.n} entering={reduce ? undefined : FadeIn.duration(motion.state)} style={{ gap: space[4] }}>
        <Story kicker={round.topic}>
          <T v="reading">{round.vignette}</T>
        </Story>
        <T v="h3">{dx === null && !res ? "Which diagnosis?" : "Which feature settles it?"}</T>
        {dx === null && !res ? (
          <View style={{ gap: space[3] }}>
            {round.options.map((o, j) => (
              <OptionRow key={j} index={j} text={o} testID={`duel-dx-${j}`} onPress={() => setDx(j)} />
            ))}
          </View>
        ) : (
          <View style={{ gap: space[3] }}>
            {dx !== null || res ? (
              <T v="small" tone="muted">
                Your diagnosis: {dx !== null && dx >= 0 ? round.options[dx] : "none"}
                {res ? ` · The answer: ${round.options[res.answer.dx]}` : ""}
              </T>
            ) : null}
            {round.features.map((o, j) => (
              <OptionRow key={j} index={j} text={o} testID={`duel-feature-${j}`} disabled={!!res || mv.pending} state={!res ? "idle" : j === res.answer.feature ? "right" : "dim"} onPress={() => dx !== null && void send(dx, j)} />
            ))}
            {!res ? <Button kind="text" label="Change diagnosis" onPress={() => setDx(null)} /> : null}
          </View>
        )}
        <MoveError text={mv.error} />
        {res ? <Verdict right={res.dxOk} partial={res.dxOk && !res.featureOk} title={`You +${res.points} · ${run.bot} +${res.bot.points}`} why={res.why} seed={round.n} /> : null}
      </Animated.View>
    </GameFrame>
  );
}
