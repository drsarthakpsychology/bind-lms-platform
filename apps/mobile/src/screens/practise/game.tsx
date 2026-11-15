import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import { Pressable, View } from "react-native";

import type { GameResult, GameRound } from "@/api/extra";
import { useGame } from "@/api/queries";
import { api } from "@/auth";
import { Button, EmptyState, OptionRow, ProgressLine, Skeleton, T, VerdictBand } from "@/ds";
import { haptic } from "@/lib/haptics";
import { GameFrame } from "@/practise/frame";
import { Rich } from "@/study/rich";
import { shuffle } from "@/study/widgets/frame";
import { fonts, layout, space, useTheme } from "@/theme";

type Quickfire = Extract<GameRound, { kind: "quickfire" }>;
type Match = Extract<GameRound, { kind: "match" }>;

/** Quickfire: questions against a shrinking line. */
export function QuickfireGame({ round }: { round: Quickfire }) {
  const [i, setI] = React.useState(0);
  const [pick, setPick] = React.useState<number | null>(null);
  const [score, setScore] = React.useState(0);
  const [left, setLeft] = React.useState(round.seconds);
  const [best, setBest] = React.useState<number | null>(null);
  const started = React.useRef(0);
  React.useEffect(() => {
    started.current = Date.now();
  }, []);
  const q = round.questions[i];
  const over = !q;
  const timedOut = left <= 0 && pick === null;

  React.useEffect(() => {
    if (over || pick !== null) return;
    if (left <= 0) {
      haptic.warn();
      return;
    }
    const id = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [left, pick, over]);

  React.useEffect(() => {
    if (!over) return;
    haptic.success();
    void api
      .post<GameResult>(`/games/${encodeURIComponent(round.id)}/result`, { score, total: round.questions.length, ms: Date.now() - started.current })
      .then((r) => setBest(r.best))
      .catch(() => undefined);
  }, [over, round.id, round.questions.length, score]);

  const choose = (j: number) => {
    if (pick !== null || timedOut) return;
    setPick(j);
    if (q && j === q.answer) setScore((s) => s + 1);
  };
  const next = () => {
    setI((n) => n + 1);
    setPick(null);
    setLeft(round.seconds);
  };
  const again = () => {
    setI(0);
    setPick(null);
    setScore(0);
    setLeft(round.seconds);
    setBest(null);
    started.current = Date.now();
  };

  return (
    <GameFrame testID="game-quickfire" title={round.title} howTo={round.howTo} score={`${score}`} confirmLeave={!over && i > 0} thumb={over ? <Button label="Play again" onPress={again} testID="game-again" /> : <Button label={i === round.questions.length - 1 ? "See my score" : "Next question"} disabled={pick === null && !timedOut} onPress={next} testID="game-next" />}>
      {over ? (
        <View style={{ gap: space[4] }} testID="game-over">
          <T v="small" tone="muted">
            Round over
          </T>
          <T style={{ fontFamily: fonts.pixelDigits, fontSize: 56, lineHeight: 64 }} num maxFontSizeMultiplier={1.2}>
            {score}/{round.questions.length}
          </T>
          {best !== null ? (
            <T tone="muted" num>
              Your best: {best}
            </T>
          ) : null}
        </View>
      ) : (
        <>
          <View style={{ gap: space[2] }}>
            <ProgressLine value={(left / round.seconds) * 100} height={4} label={`${left} seconds left`} />
            <T v="small" tone="muted" num>
              Question {i + 1} of {round.questions.length} · {left}s
            </T>
          </View>
          <Rich text={q!.q} v="h2" />
          <View style={{ gap: space[3] }}>
            {q!.options.map((o, j) => (
              <OptionRow key={j} index={j} text={o} testID={`game-option-${j}`} disabled={pick !== null || timedOut} state={pick === null && !timedOut ? "idle" : j === q!.answer ? "right" : j === pick ? "wrong" : "dim"} onPress={() => choose(j)} />
            ))}
          </View>
          {pick !== null ? <VerdictBand right={pick === q!.answer} why={q!.why} seed={i} /> : timedOut ? <VerdictBand right={false} title="Time is up" why={`The answer was ${String.fromCharCode(65 + q!.answer)}.`} /> : null}
        </>
      )}
    </GameFrame>
  );
}

/** Match the term: tap a word, then its meaning. */
export function MatchGame({ round }: { round: Match }) {
  const c = useTheme();
  const rights = React.useMemo(() => shuffle(round.pairs.map((_, i) => i), 7), [round]);
  const [left, setLeft] = React.useState<number | null>(null);
  const [done, setDone] = React.useState<Set<number>>(new Set());
  const [tries, setTries] = React.useState(0);
  const [wrong, setWrong] = React.useState<number | null>(null);
  const finished = done.size === round.pairs.length;
  const tapRight = (r: number) => {
    if (left === null) return;
    setTries((t) => t + 1);
    if (r === left) {
      haptic.success();
      setDone((s) => new Set(s).add(r));
      setLeft(null);
    } else {
      haptic.warn();
      setWrong(r);
      setTimeout(() => setWrong(null), 600);
    }
  };
  const tile = (text: string, on: boolean, gone: boolean, bad: boolean, onPress: () => void, key: string) => (
    <Pressable key={key} accessibilityRole="button" accessibilityState={{ selected: on, disabled: gone }} disabled={gone} onPress={onPress} style={({ pressed }) => ({ minHeight: layout.row, justifyContent: "center", padding: space[3], borderRadius: layout.radius, borderWidth: on || bad ? 2 : 1.5, borderColor: bad ? c.danger : on ? c.ink : c.cardLine, backgroundColor: gone ? c.successBg : pressed ? c.tint : "transparent", opacity: gone ? 0.6 : 1 })}>
      <Rich text={text} v="small" />
    </Pressable>
  );
  return (
    <GameFrame testID="game-match" title={round.title} howTo={round.howTo} score={`${done.size}/${round.pairs.length}`} thumb={finished ? <Button label="Play again" onPress={() => { setDone(new Set()); setTries(0); }} /> : undefined}>
      {finished ? (
        <VerdictBand right title="Board cleared" why={`${tries} tries for ${round.pairs.length} pairs.`} />
      ) : (
        <T v="small" tone="muted">
          {left === null ? "Tap a word." : "Now tap what it means."}
        </T>
      )}
      <View style={{ flexDirection: "row", gap: space[3] }}>
        <View style={{ flex: 1, gap: space[2] }}>{round.pairs.map((p, i) => tile(p.left, left === i, done.has(i), false, () => { haptic.select(); setLeft(i); }, `l${i}`))}</View>
        <View style={{ flex: 1.4, gap: space[2] }}>{rights.map((r) => tile(round.pairs[r]!.right, false, done.has(r), wrong === r, () => tapRight(r), `r${r}`))}</View>
      </View>
    </GameFrame>
  );
}

export function GameScreen() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const q = useGame(String(id));
  if (q.data?.kind === "quickfire") return <QuickfireGame round={q.data} />;
  if (q.data?.kind === "match") return <MatchGame round={q.data} />;
  return (
    <GameFrame title="Game">
      {q.isError || q.data ? <EmptyState mood="sleepy" title="Coming in the next update" body="This game is ready on the website and arrives in the app soon." /> : <View style={{ gap: space[3] }}><Skeleton w="80%" h={26} />{[0, 1, 2, 3].map((k) => <Skeleton key={k} h={56} r={12} />)}</View>}
    </GameFrame>
  );
}
