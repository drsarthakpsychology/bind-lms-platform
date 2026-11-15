import * as React from "react";
import { View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";

import { api } from "@/auth";
import { Button, ProgressLine, T } from "@/ds";
import { fonts, motion, space, useTheme } from "@/theme";
import { moveError, useTool } from "../api";
import { diagnosisName } from "../data";
import { EndPanel, EndThumb, FrameError, FrameLoading, GameFrame, HudLine, MoveError, StartScreen, StepStrip, Verdict } from "../frame";
import { Bump } from "../fx";
import { AnswerRow, Story } from "../parts";
import { useReactions } from "../reactions";
import { shuffled } from "../tools/engine";

const ROUND_MS = 20_000;
const ROUNDS = 5;

/* The website's duel shapes (src/lib/games/duel/view.ts, items.ts). */
type Side = { dx: string | null; feature: string | null; points: number; ms: number | null; dxOk: boolean; featureOk: boolean };
type Closed = { round: number; topic: string; correctDx: string; correctFeature: string; why: string; you: Side; opp: Side };
type View_ = {
  matchId: string;
  bot: boolean;
  serverNow: number;
  phase: "countdown" | "round" | "reveal" | "over";
  until: number | null;
  round: number;
  totalRounds: number;
  question: null | { vignette: string; options: string[]; features: string[] };
  youAnswered: boolean;
  closed: Closed[];
  score: { you: number; opp: number };
  you: { name: string; rating: number | null };
  opp: { name: string; rating: number | null };
  result: null | { outcome: "win" | "loss" | "draw"; reason: string; delta: number | null; rating: number | null };
};
type Item = { id: string; topic: string; vignette: string; options: string[]; features: string[]; why: string };
type Profile = { available: boolean; rating: number; tier: string; games: number; wins: number };
type Answer = { kind: "match"; view: View_ | null; error?: string | null } | { kind: "queued" } | { kind: "left" };

/**
 * One round as the screen draws it, whichever way the duel runs: on the
 * server against Dr Bot (POST /practise/duel, polled), or, when duels are
 * not set up, the website's offline practice rounds played on the phone.
 */
type Round = { n: number; topic: string; vignette: string; options: string[]; features: string[] };
type Reveal = { dxOk: boolean; featureOk: boolean; points: number; dx: number; feature: number; why: string; opp: number };

const HOW_FALLBACK = ["Pick the diagnosis: +100.", "Then pick what tells it apart from its look-alike: +50.", "Same points? The faster player wins."];

/** Differential duel against the bot. */
export function DuelGame() {
  const tool = useTool("duel");
  if (tool.isError) return <FrameError title="Differential duel" error={tool.error} onRetry={() => void tool.refetch()} />;
  if (!tool.data) return <FrameLoading title="Differential duel" />;
  const d = tool.data.data as { profile: Profile; offlineItems: Item[] | null };
  const how = tool.data.howTo.length ? tool.data.howTo : HOW_FALLBACK;
  return d.profile.available || !d.offlineItems ? <LiveDuel how={how} profile={d.profile} /> : <LocalDuel how={how} items={d.offlineItems} />;
}

/* ------------------------------------------------------------- the board */

function Board({ how, round, total, marks, score, opp, left, reveal, waiting, busy, error, onAnswer, onNext, nextLabel }: { how: string[]; round: Round; total: number; marks: ("ok" | "miss" | null)[]; score: { you: number; opp: number }; opp: string; left: number; reveal: Reveal | null; waiting: boolean; busy: boolean; error: string | null; onAnswer: (dx: number, f: number) => void; onNext?: () => void; nextLabel?: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const [dx, setDx] = React.useState<number | null>(null);
  const hud = (
    <View style={{ gap: space[2] }}>
      <StepStrip at={round.n} total={total} marks={marks} />
      {!reveal ? <ProgressLine value={(left / ROUND_MS) * 100} height={4} label={`${Math.ceil(left / 1000)} seconds left`} /> : null}
      <HudLine
        left={`Round ${round.n + 1} of ${total} · You : ${opp}`}
        right={
          <Bump value={`${score.you}:${score.opp}`}>
            <T style={{ fontFamily: fonts.pixelDigits, fontSize: 16, lineHeight: 20, color: c.ink }} testID="duel-score">
              {`${score.you} : ${score.opp}`}
            </T>
          </Bump>
        }
      />
    </View>
  );
  const thumb = reveal ? (onNext ? <Button label={nextLabel ?? "Next round"} onPress={onNext} testID="duel-next" /> : <T v="small" tone="muted" center>The next round starts in a moment.</T>) : waiting ? <T v="small" tone="muted" center>Answer in. Waiting for {opp}.</T> : undefined;
  return (
    <GameFrame testID="game-duel" title="Differential duel" howTo={how} hud={hud} confirmLeave thumb={thumb}>
      <Animated.View key={round.n} entering={reduce ? undefined : FadeIn.duration(motion.state)} style={{ gap: space[4] }}>
        <Story kicker={round.topic}>
          <T v="reading">{round.vignette}</T>
        </Story>
        <T v="h3">{dx === null && !reveal ? "Which diagnosis?" : "What tells it apart?"}</T>
        {dx === null && !reveal ? (
          <View style={{ gap: space[3] }}>
            {round.options.map((o, j) => (
              <AnswerRow key={j} index={j} text={o} testID={`duel-dx-${j}`} disabled={waiting} onPress={() => setDx(j)} />
            ))}
          </View>
        ) : (
          <View style={{ gap: space[3] }}>
            <T v="small" tone="muted">
              Your diagnosis: {dx !== null && dx >= 0 ? round.options[dx] : "none"}
              {reveal ? ` · The answer: ${round.options[reveal.dx]}` : ""}
            </T>
            {round.features.map((o, j) => (
              <AnswerRow key={j} index={j} text={o} testID={`duel-feature-${j}`} disabled={!!reveal || busy || waiting} state={!reveal ? "idle" : j === reveal.feature ? "right" : "dim"} onPress={() => dx !== null && onAnswer(dx, j)} />
            ))}
            {!reveal && !waiting ? <Button kind="text" label="Change diagnosis" onPress={() => setDx(null)} /> : null}
          </View>
        )}
        <MoveError text={error} />
        {reveal ? <Verdict right={reveal.dxOk} partial={reveal.dxOk && !reveal.featureOk} title={`You +${reveal.points} · ${opp} +${reveal.opp}`} why={reveal.why} seed={round.n} /> : null}
      </Animated.View>
    </GameFrame>
  );
}

function End({ won, draw, you, opp, oppName, right, total, extra, again }: { won: boolean; draw: boolean; you: number; opp: number; oppName: string; right: number; total: number; extra?: { label: string; value: string }[]; again: () => void }) {
  return (
    <GameFrame testID="game-duel" title="Differential duel" thumb={<EndThumb again={again} againLabel="Duel again" />}>
      <EndPanel kicker={draw ? "A draw" : won ? "You won" : `${oppName} won`} score={String(you)} scoreOf={`vs ${opp}`} outcome={draw ? "mixed" : won ? "won" : "lost"} stats={[{ label: "Diagnoses right", value: `${right}/${total}` }, ...(extra ?? [])]} />
    </GameFrame>
  );
}

/* ------------------------------------------------- on the server, polled */

function LiveDuel({ how, profile }: { how: string[]; profile: Profile }) {
  const react = useReactions();
  const [view, setView] = React.useState<View_ | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [now, setNow] = React.useState(0);
  const skew = React.useRef(0);
  const seen = React.useRef(-1);
  const post = React.useCallback(async (body: Record<string, unknown>) => {
    const r = await api.post<Answer>("/practise/duel", body);
    if (r.kind === "match" && r.view) {
      skew.current = r.view.serverNow - Date.now();
      setView(r.view);
    }
    return r;
  }, []);
  const start = async () => {
    setBusy(true);
    setError(null);
    react.reset();
    seen.current = -1;
    try {
      await post({ op: "bot" });
    } catch (e) {
      setError(moveError(e));
    } finally {
      setBusy(false);
    }
  };
  // Poll about once a second while the match runs; the server owns the clock.
  const matchId = view?.matchId;
  const over = view?.phase === "over";
  React.useEffect(() => {
    if (!matchId || over) return;
    const id = setInterval(() => {
      setNow(Date.now() + skew.current);
      void post({ op: "poll", matchId }).catch(() => undefined);
    }, 900);
    return () => clearInterval(id);
  }, [matchId, over, post]);
  // A closed round: one reaction for it.
  const last = view?.closed[view.closed.length - 1];
  React.useEffect(() => {
    if (last && last.round > seen.current) {
      seen.current = last.round;
      react.answer(last.you.dxOk);
    }
  }, [last, react]);

  if (!view) {
    const note = profile.games ? `Rating ${profile.rating} · ${profile.tier}` : null;
    return <StartScreen testID="duel-start" title="Differential duel" line="Look-alike diagnoses against Dr Bot." note={note} howTo={how} onPlay={() => void start()} playLabel="Start the duel" busy={busy} error={error} />;
  }
  const marks: ("ok" | "miss")[] = view.closed.map((r) => (r.you.dxOk ? "ok" : "miss"));
  if (view.phase === "over") {
    const res = view.result;
    return <End won={res?.outcome === "win"} draw={res?.outcome === "draw"} you={view.score.you} opp={view.score.opp} oppName={view.opp.name} right={marks.filter((m) => m === "ok").length} total={view.totalRounds} extra={res?.delta != null ? [{ label: "Rating", value: `${res.delta >= 0 ? "+" : ""}${res.delta}` }] : undefined} again={() => setView(null)} />;
  }
  if (!view.question) return <FrameLoading title="Differential duel" />;
  const shownClosed = view.phase === "reveal" ? view.closed.find((r) => r.round === view.round) : undefined;
  const q = view.question;
  const reveal: Reveal | null = shownClosed ? { dxOk: shownClosed.you.dxOk, featureOk: shownClosed.you.featureOk, points: shownClosed.you.points, dx: Math.max(0, q.options.indexOf(shownClosed.correctDx)), feature: Math.max(0, q.features.indexOf(shownClosed.correctFeature)), why: shownClosed.why, opp: shownClosed.opp.points } : null;
  const left = view.until ? Math.max(0, view.until - (now || view.serverNow)) : ROUND_MS;
  const answer = async (dx: number, feature: number) => {
    setBusy(true);
    setError(null);
    try {
      await post({ op: "answer", matchId: view.matchId, round: view.round, dx, feature });
    } catch (e) {
      setError(moveError(e));
    } finally {
      setBusy(false);
    }
  };
  return <Board key={view.round} how={how} round={{ n: view.round, topic: shownClosed?.topic ?? "", vignette: q.vignette, options: q.options, features: q.features }} total={view.totalRounds} marks={marks} score={view.score} opp={view.opp.name} left={view.phase === "round" ? left : ROUND_MS} reveal={reveal} waiting={view.youAnswered && !reveal} busy={busy} error={error} onAnswer={(d, f) => void answer(d, f)} />;
}

/* ------------------------------------- offline practice, on the phone */

/** The website's offline practice bot: usually right, not always, and not instant. */
function botAnswer(seed: string): { dxOk: boolean; featureOk: boolean } {
  const h = [...seed].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
  return { dxOk: h % 10 < 7, featureOk: h % 7 < 4 };
}

function LocalDuel({ how, items }: { how: string[]; items: Item[] }) {
  const react = useReactions();
  const [game, setGame] = React.useState<{ seed: string; rounds: (Round & { dx: number; feature: number; why: string })[] } | null>(null);
  const [at, setAt] = React.useState(0);
  const [reveal, setReveal] = React.useState<Reveal | null>(null);
  const [score, setScore] = React.useState({ you: 0, opp: 0 });
  const [marks, setMarks] = React.useState<("ok" | "miss" | null)[]>([]);
  const [left, setLeft] = React.useState(ROUND_MS);
  const [done, setDone] = React.useState(false);
  const until = React.useRef(0);
  const start = () => {
    const seed = String(Math.floor(Math.random() * 1e9));
    const rounds = shuffled(items, seed)
      .slice(0, ROUNDS)
      .map((it, n) => {
        const opts = shuffled(it.options, `${seed}:d${n}`);
        const feats = shuffled(it.features, `${seed}:f${n}`);
        return { n, topic: it.topic, vignette: it.vignette, options: opts.map(diagnosisName), features: feats, dx: opts.indexOf(it.options[0]!), feature: feats.indexOf(it.features[0]!), why: it.why };
      });
    react.reset();
    setGame({ seed, rounds });
    setAt(0);
    setReveal(null);
    setScore({ you: 0, opp: 0 });
    setMarks([]);
    setDone(false);
    until.current = Date.now() + ROUND_MS;
    setLeft(ROUND_MS);
  };
  const round = game?.rounds[at];
  const answer = React.useCallback(
    (dx: number, f: number) => {
      if (!game || !round || reveal) return;
      const dxOk = dx === round.dx;
      const featureOk = dxOk && f === round.feature;
      const points = (dxOk ? 100 : 0) + (featureOk ? 50 : 0);
      const b = botAnswer(`${game.seed}:${at}`);
      const opp = (b.dxOk ? 100 : 0) + (b.dxOk && b.featureOk ? 50 : 0);
      setReveal({ dxOk, featureOk, points, dx: round.dx, feature: round.feature, why: round.why, opp });
      setScore((s) => ({ you: s.you + points, opp: s.opp + opp }));
      setMarks((m) => [...m, dxOk ? "ok" : "miss"]);
      react.answer(dxOk);
    },
    [game, round, reveal, at, react],
  );
  React.useEffect(() => {
    if (!round || reveal) return;
    const id = setInterval(() => {
      const l = Math.max(0, until.current - Date.now());
      setLeft(l);
      if (l <= 0) {
        clearInterval(id);
        answer(-1, -1);
      }
    }, 250);
    return () => clearInterval(id);
  }, [round, reveal, answer]);

  if (!game) return <StartScreen testID="duel-start" title="Differential duel" line="Look-alike diagnoses, five rounds, against Dr Bot." howTo={how} onPlay={start} playLabel="Start the duel" />;
  if (done || !round) return <End won={score.you > score.opp} draw={score.you === score.opp} you={score.you} opp={score.opp} oppName="Dr Bot" right={marks.filter((m) => m === "ok").length} total={game.rounds.length} again={start} />;
  const last = at + 1 >= game.rounds.length;
  return (
    <Board
      key={at}
      how={how}
      round={round}
      total={game.rounds.length}
      marks={marks}
      score={score}
      opp="Dr Bot"
      left={left}
      reveal={reveal}
      waiting={false}
      busy={false}
      error={null}
      onAnswer={answer}
      nextLabel={last ? "See who won" : "Next round"}
      onNext={() => {
        if (last) setDone(true);
        else {
          setAt(at + 1);
          setReveal(null);
          until.current = Date.now() + ROUND_MS;
          setLeft(ROUND_MS);
        }
      }}
    />
  );
}
