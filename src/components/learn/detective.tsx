"use client";

import * as React from "react";
import { startHowTo } from "@/components/help/how-to";
import { Brain, LoaderCircle, Pill, Search, Shuffle, Trophy } from "lucide-react";
import { ChoiceCard } from "@/lib/games-sims/ui/kit";
import { emptyState, finishLesson, istToday, type LearnState, type Payout } from "@/lib/learn/engine";
import { noteAnswer, useHistoryPrefetch } from "@/lib/history/client";
import { CLUES, POINTS, ROUNDS, WRONG_PENALTY, type DealtRound, type Family } from "@/lib/learn/detective-rules";
import { dealDetective, detectiveAllClues, detectiveClue, detectiveGuess } from "@/app/(dashboard)/practice/detective/actions";
import { conceptById } from "@/lib/learn/concepts";
import { initLearnStore, setLearnState, useLearnState } from "@/lib/learn/store";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { LearnLink } from "@/lib/games/ui/learn-link";
import { Chai, ChaiSays } from "./chai";
import { Summary } from "./player";
import { useReaction } from "@/components/reactions/use-reaction";
import { moodForScore } from "@/lib/reactions/stickers";
import { useExplainView } from "./view-toggle";
import s from "./learn.module.css";
import { HintBar, useHintStatus } from "@/components/hints/hint-chip";
import { askHint } from "@/lib/hints/actions";
import { clueOpens, hintedPoints } from "@/lib/hints/rules";

const EMPTY = emptyState();
const FAIL = "Connection lost. Try again.";

function roll() {
  return Math.random();
}

type Deal = { token: string; run: string; rounds: DealtRound[] };

export function Detective({ serverState, save }: { serverState: LearnState | null; save: (s: LearnState) => Promise<unknown> }) {
  initLearnStore(serverState, save);
  const state = useLearnState(serverState ?? EMPTY);
  const view = useExplainView();
  const [game, setGame] = React.useState<Deal | null>(null);
  const [r, setR] = React.useState(0);
  /** The clues opened in this round (their text comes from the server one at a time). */
  const [opened, setOpened] = React.useState<string[]>([]);
  const [wrong, setWrong] = React.useState<string[]>([]);
  const [solved, setSolved] = React.useState<null | { gained: number; correct: boolean; answer: string }>(null);
  const [score, setScore] = React.useState(0);
  const [answers, setAnswers] = React.useState<{ id: string; correct: boolean }[]>([]);
  const [result, setResult] = React.useState<Payout | null>(null);
  const reaction = useReaction();
  const [family, setFamily] = React.useState<Family>("mixed");
  /** This round's hint: the options it ruled out (null = not used). */
  const [ruledOut, setRuledOut] = React.useState<string[] | null>(null);
  /** After a round ends: every clue, once the student asks to see the others. */
  const [rest, setRest] = React.useState<string[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [hints, setHints] = useHintStatus();
  useHistoryPrefetch("detective");
  /** One server call at a time, so a double tap can't count an answer twice. */
  const inflight = React.useRef(false);

  async function call<T>(fn: () => Promise<T>): Promise<T | null> {
    if (inflight.current) return null;
    inflight.current = true;
    setBusy(true);
    setError(null);
    try {
      return await fn();
    } catch {
      setError(FAIL);
      return null;
    } finally {
      inflight.current = false;
      setBusy(false);
    }
  }

  async function start(f = family) {
    startHowTo("clinic-detective");
    setFamily(f);
    const d = await call(() => dealDetective(f));
    if (!d) return;
    if (!d.ok) return setError(d.error);
    reaction.reset();
    setGame({ token: d.token, run: d.run, rounds: d.rounds });
    setR(0);
    setOpened([d.rounds[0].clue]);
    setWrong([]);
    setSolved(null);
    setRuledOut(null);
    setRest(null);
    setScore(0);
    setAnswers([]);
    setResult(null);
  }

  if (result) return <Summary result={result} state={state} confetti={[]} title={`Detective · ${score} points`} mood={moodForScore(score, POINTS[0] * (game?.rounds.length || ROUNDS))} onAgain={() => void start()} />;

  if (!game) {
    return (
      <div className="mx-auto max-w-xl space-y-5 px-4 py-4 lg:px-2">
        <div className="flex items-center gap-4">
          <Chai mood="think" size={88} />
          <div className="min-w-0 space-y-1">
            <h1 className="text-h3">Pick a case type</h1>
            {state.detectiveBest ? (
              <p className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-card px-2.5 py-0.5 text-sm font-bold tabular-nums">
                <Trophy className="size-4" aria-hidden /> Your best: {state.detectiveBest}
              </p>
            ) : null}
          </div>
        </div>
        <div className="grid gap-3">
          {(
            [
              ["mixed", "Mixed", "Disorders and medicines.", Shuffle],
              ["drug", "Medicines", "Name the medicine from its clues.", Pill],
              ["disorder", "Disorders", "Name the disorder from its clues.", Brain],
            ] as const
          ).map(([f, label, line, Icon]) => (
            <ChoiceCard
              key={f}
              icon={Icon}
              suggested={f === "mixed"}
              disabled={busy}
              aria-busy={busy && family === f}
              onClick={() => void start(f)}
              title={
                <span className="inline-flex items-center gap-2">
                  {label}
                  {busy && family === f ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : null}
                </span>
              }
              line={line}
            />
          ))}
        </div>
        {error ? (
          <p role="alert" className="rounded-md border-2 border-foreground bg-status-alert-bg px-3 py-2 text-sm font-semibold text-status-alert-fg">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  const deal = game;
  const round = deal.rounds[r];
  const clues = opened.length;
  const answer = solved ? conceptById(solved.answer) : undefined;

  async function nextClue() {
    if (clues >= CLUES || solved) return;
    const res = await call(() => detectiveClue(deal.token, r, clues + 1));
    if (!res) return;
    if (!res.ok) return setError(res.error);
    setOpened((o) => (o.length === clues ? [...o, res.clue] : o));
  }

  async function guess(id: string) {
    if (solved || wrong.includes(id)) return;
    const final = clues >= CLUES;
    const res = await call(() => detectiveGuess(deal.token, r, id, final));
    if (!res) return;
    if (!res.ok) return setError(res.error);
    if (res.right && res.answer) {
      // A hint halves this case's points.
      const gained = hintedPoints(Math.max(0, POINTS[clues - 1] - wrong.length * WRONG_PENALTY), ruledOut ? 1 : 0);
      haptic("success");
      setScore((x) => x + gained);
      setSolved({ gained, correct: true, answer: res.answer });
      setAnswers((a) => [...a, { id: res.answer!, correct: wrong.length === 0 && !ruledOut }]);
      noteAnswer("detective", res.answer, wrong.length === 0 && !ruledOut);
      // Solved after a wrong guess or a hint: right, but only partly.
      reaction.onAnswer(true, { partial: wrong.length > 0 || Boolean(ruledOut) });
      return;
    }
    haptic("warning");
    setWrong((w) => [...w, id]);
    if (!final) {
      // A wrong guess opens the next clue.
      const c = await call(() => detectiveClue(deal.token, r, clues + 1));
      if (c?.ok) setOpened((o) => (o.length === clues ? [...o, c.clue] : o));
      return;
    }
    if (!res.answer) return setError(FAIL);
    setSolved({ gained: 0, correct: false, answer: res.answer });
    setAnswers((a) => [...a, { id: res.answer!, correct: false }]);
    noteAnswer("detective", res.answer, false);
    reaction.onAnswer(false);
  }

  async function showRest() {
    if (rest) return setRest(null);
    const res = await call(() => detectiveAllClues(deal.token, r));
    if (!res) return;
    if (!res.ok) return setError(res.error);
    setRest(res.clues);
  }

  function nextRound() {
    if (r + 1 < deal.rounds.length) {
      setR(r + 1);
      setOpened([deal.rounds[r + 1].clue]);
      setWrong([]);
      setSolved(null);
      setRuledOut(null);
      setRest(null);
      return;
    }
    const { state: done, payout } = finishLesson(state, { lessonId: "detective", kind: "detective", answers, maxCombo: 0, bonusXp: score }, istToday(), roll());
    setLearnState(done);
    setResult(payout);
  }

  return (
    <div className={cn("mx-auto max-w-2xl space-y-5")}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-bold">
          <Search className="size-5" aria-hidden /> Case {r + 1}
        </span>
        <span className="rounded-full border-2 border-foreground bg-foreground px-3 py-1 font-pix text-sm text-primary">{score} pts</span>
      </div>

      <ol className="space-y-2" aria-label="Clues">
        {Array.from({ length: CLUES }, (_, k) => {
          const text = k < clues ? opened[k] : rest ? rest[k] : null;
          return (
            <li
              key={k}
              className={cn(
                "flex items-start gap-3 rounded-2xl border-2 p-3",
                k < clues ? cn("border-foreground bg-card", s.rise) : text ? "border-dashed border-foreground bg-background" : cn("border-dashed border-foreground/30 text-muted-foreground", s.stripes),
              )}
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-lg border-2 border-current font-pix text-[0.7rem]">{k + 1}</span>
              <span className="text-sm font-semibold">{text ?? `Clue ${k + 1} · worth ${POINTS[k]} points`}</span>
            </li>
          );
        })}
      </ol>
      {solved && clues < CLUES ? (
        <button type="button" disabled={busy} aria-expanded={rest !== null} onClick={() => void showRest()} className="min-h-11 w-full rounded-2xl border-2 border-dashed border-foreground/50 px-3 text-sm font-bold">
          {rest ? "Hide the other clues" : "Show the other clues"}
        </button>
      ) : null}
      {error ? (
        <p role="status" className="text-sm font-semibold">
          {error}
        </p>
      ) : null}

      {!solved ? (
        <>
          <p className="text-eyebrow text-link">Your guess ({hintedPoints(Math.max(0, POINTS[clues - 1] - wrong.length * WRONG_PENALTY), ruledOut ? 1 : 0)} points now)</p>
          <HintBar
            status={hints}
            onStatus={setHints}
            used={ruledOut !== null}
            ask={() => askHint({ game: "detective", run: deal.run, round: r, token: deal.token, options: round.options })}
            onGive={(g) => setRuledOut(g.remove)}
          />
          <div className="grid grid-cols-2 gap-2.5">
            {round.options.map((id) => {
              const o = conceptById(id)!;
              const isWrong = wrong.includes(id);
              const gone = ruledOut?.includes(id) ?? false;
              return (
                <button
                  key={id}
                  type="button"
                  disabled={isWrong || gone || busy}
                  aria-label={gone ? `${o.term} (ruled out)` : undefined}
                  onClick={() => void guess(id)}
                  className={cn(
                    "min-h-16 min-w-0 rounded-2xl border-2 border-foreground px-3 py-2 text-left text-sm font-semibold leading-tight [overflow-wrap:anywhere] hard-shadow-sm transition-transform active:translate-y-0.5 sm:text-base",
                    isWrong ? cn("bg-foreground text-background line-through opacity-60", s.shake) : gone ? "border-dashed bg-card text-muted-foreground line-through opacity-60 shadow-none" : "bg-card",
                  )}
                >
                  {o.term}
                </button>
              );
            })}
          </div>
          {clues < 4 && clueOpens(clues + 1, false) ? (
            <button type="button" disabled={busy} onClick={() => void nextClue()} className="min-h-11 w-full rounded-2xl border-2 border-dashed border-foreground/50 py-3 text-sm font-bold">
              Show next clue (minus 10 points)
            </button>
          ) : clues < 4 ? (
            <p className="text-center text-sm text-muted-foreground">Make a guess to open clue {clues + 1}.</p>
          ) : null}
        </>
      ) : (
        <div className={cn("rounded-3xl border-2 border-foreground p-4 hard-shadow-md", solved.correct ? "bg-primary text-primary-foreground" : "bg-foreground text-background", s.rise)}>
          <div className="flex items-start gap-3">
            <Chai mood={solved.correct ? (clues === 1 ? "cheer" : "happy") : "sad"} size={64} className="shrink-0" />
            <div>
              <p className="text-lg font-bold">{solved.correct ? (clues === 1 ? `First clue! +${solved.gained}` : `Solved! +${solved.gained}`) : "Case closed without you."}</p>
              <p className="font-bold">{answer?.term ?? solved.answer}</p>
              {answer ? <p className="text-sm">{view === "clinician" ? answer.clinician : answer.student}</p> : null}
              <LearnLink topic={answer?.term ?? solved.answer} className="text-current" />
            </div>
          </div>
          <button type="button" autoFocus onClick={nextRound} className={cn("mt-3 h-12 w-full rounded-2xl border-2 border-foreground font-bold", solved.correct ? "bg-foreground text-primary" : "bg-primary text-primary-foreground")}>
            {r + 1 < deal.rounds.length ? "Next case" : "See results"}
          </button>
        </div>
      )}

      {r === 0 && clues === 1 && !solved ? <ChaiSays mood="think" size={56}>Guess early for big points, or wait for more clues.</ChaiSays> : null}
    </div>
  );
}
