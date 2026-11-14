"use client";

import * as React from "react";
import { startHowTo } from "@/components/help/how-to";
import { BackLink } from "@/components/study/back";
import { LoaderCircle, Search } from "lucide-react";
import { emptyState, finishLesson, istToday, type LearnState, type Payout } from "@/lib/learn/engine";
import { historyFor, noteAnswer, useHistoryPrefetch } from "@/lib/history/client";
import type { CaseMark } from "@/lib/cases/fresh";
import type { ProgressSnapshot } from "@/lib/cases/progress";
import { clearCaseProgress, saveCaseProgress, useCaseProgress } from "@/lib/cases/progress-client";
import { CaseMarkTag, RecycleNote } from "@/components/cases/case-mark";
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

type Deal = { token: string; run: string; rounds: DealtRound[]; marks?: CaseMark[]; recycled?: boolean };
/** A run left half-way: the case and the clue reached (saved progress, src/lib/cases). */
type SavedRun = { family: Family; game: Deal; r: number; opened: string[]; wrong: string[]; solved: null | { gained: number; correct: boolean; answer: string }; score: number; answers: { id: string; correct: boolean }[]; ruledOut: string[] | null };
const RUN = "run";

export function Detective({ serverState, save, progress: serverProgress }: { serverState: LearnState | null; save: (s: LearnState) => Promise<unknown>; progress?: ProgressSnapshot }) {
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
  const progress = useCaseProgress("detective", serverProgress);
  const saved = progress.get<SavedRun>(RUN);
  const resumable = saved && saved.game && Array.isArray(saved.game.rounds) && saved.game.rounds.length > 0 && Number.isInteger(saved.r) && saved.r < saved.game.rounds.length && Array.isArray(saved.opened) && saved.opened.length > 0 ? saved : null;
  // Keep the run's place saved while it is open.
  React.useEffect(() => {
    if (!game || result) return;
    saveCaseProgress("detective", RUN, { family, game, r, opened, wrong, solved, score, answers, ruledOut } satisfies SavedRun);
  }, [game, result, family, r, opened, wrong, solved, score, answers, ruledOut]);
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
    // This browser's copy of what was done goes with the request (it counts when the server has none).
    const d = await call(() => dealDetective(f, [...historyFor("detective").keys()].slice(0, 200)));
    if (!d) return;
    if (!d.ok) return setError(d.error);
    reaction.reset();
    setGame({ token: d.token, run: d.run, rounds: d.rounds, marks: d.marks, recycled: d.recycled });
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

  /** Carry on a run where it was left: the same case, the same clues open. */
  function resume(s: SavedRun) {
    startHowTo("clinic-detective");
    reaction.reset();
    setFamily(s.family);
    setGame(s.game);
    setR(s.r);
    setOpened(s.opened);
    setWrong(Array.isArray(s.wrong) ? s.wrong : []);
    setSolved(s.solved ?? null);
    setRuledOut(s.ruledOut ?? null);
    setRest(null);
    setScore(Number(s.score) || 0);
    setAnswers(Array.isArray(s.answers) ? s.answers : []);
    setResult(null);
  }

  if (result) return <Summary result={result} state={state} confetti={[]} title={`Detective · ${score} points`} mood={moodForScore(score, POINTS[0] * (game?.rounds.length || ROUNDS))} onAgain={() => void start()} />;

  if (!game) {
    return (
      <div className="mx-auto max-w-xl space-y-6 py-8 text-center">
        <Chai mood="think" size={130} />
        <h1 className="text-h1">Clinic detective</h1>
        {state.detectiveBest ? <p className="font-pix text-sm">Your best: {state.detectiveBest}</p> : null}
        {resumable ? (
          <button type="button" disabled={busy} onClick={() => resume(resumable)} className="btn-sweep inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-foreground bg-foreground text-lg font-bold text-background hard-shadow-md disabled:opacity-60">
            Carry on: case {resumable.r + 1}, clue {resumable.opened.length}
          </button>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-3">
          {(
            [
              ["mixed", "Mixed"],
              ["drug", "Medicines"],
              ["disorder", "Disorders"],
            ] as const
          ).map(([f, label]) => (
            <button key={f} type="button" disabled={busy} onClick={() => void start(f)} className="btn-sweep inline-flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-foreground bg-primary text-lg font-bold text-primary-foreground hard-shadow-md disabled:opacity-60">
              {busy && family === f ? <LoaderCircle className="size-5 animate-spin" aria-hidden /> : null}
              {label}
            </button>
          ))}
        </div>
        {error ? (
          <p role="status" className="text-sm font-semibold">
            {error}
          </p>
        ) : null}
        <BackLink className="inline-flex min-h-11 items-center text-sm font-bold underline-offset-4 hover:underline">
          Back
        </BackLink>
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
    clearCaseProgress("detective", RUN);
  }

  return (
    <div className={cn("mx-auto max-w-2xl space-y-5")}>
      {deal.recycled && r === 0 && clues === 1 && !solved ? <RecycleNote /> : null}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-bold">
          <Search className="size-5" aria-hidden /> Case {r + 1}
          {deal.marks?.[r] && deal.marks[r] !== "new" ? <CaseMarkTag mark={deal.marks[r]} /> : null}
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
