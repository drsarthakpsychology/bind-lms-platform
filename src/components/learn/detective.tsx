"use client";

import * as React from "react";
import { BackLink } from "@/components/study/back";
import { Search } from "lucide-react";
import { emptyState, finishLesson, istToday, type LearnState, type Payout } from "@/lib/learn/engine";
import { CASES, POINTS, WRONG_PENALTY, type Case } from "@/lib/learn/detective";
import { conceptById } from "@/lib/learn/concepts";
import { initLearnStore, setLearnState, useLearnState } from "@/lib/learn/store";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { LearnLink } from "@/lib/games/ui/learn-link";
import { Chai, ChaiSays } from "./chai";
import { Summary } from "./player";
import { useExplainView } from "./view-toggle";
import s from "./learn.module.css";
import { HintBar, useHintStatus } from "@/components/hints/hint-chip";
import { askHint } from "@/lib/hints/actions";
import { clueOpens, hintedPoints } from "@/lib/hints/rules";

const EMPTY = emptyState();
const ROUNDS = 8;

function roll() {
  return Math.random();
}

/** A fresh id per game, so each game's hints are counted on their own. */
function newRunId() {
  return `${Date.now().toString(36)}${Math.floor(roll() * 1e6).toString(36)}`;
}

type Round = { c: Case; options: string[] };

function deal(family: "drug" | "disorder" | "mixed"): Round[] {
  const pool = CASES.filter((c) => family === "mixed" || c.family === family);
  const picked = [...pool].sort(() => roll() - 0.5).slice(0, ROUNDS);
  return picked.map((c) => {
    const others = CASES.filter((x) => x.family === c.family && x.answer !== c.answer)
      .sort(() => roll() - 0.5)
      .slice(0, 3)
      .map((x) => x.answer);
    return { c, options: [c.answer, ...others].sort(() => roll() - 0.5) };
  });
}

export function Detective({ serverState, save }: { serverState: LearnState | null; save: (s: LearnState) => Promise<unknown> }) {
  initLearnStore(serverState, save);
  const state = useLearnState(serverState ?? EMPTY);
  const view = useExplainView();
  const [rounds, setRounds] = React.useState<Round[] | null>(null);
  const [r, setR] = React.useState(0);
  const [clues, setClues] = React.useState(1);
  const [wrong, setWrong] = React.useState<string[]>([]);
  const [solved, setSolved] = React.useState<null | { gained: number; correct: boolean }>(null);
  const [score, setScore] = React.useState(0);
  const [answers, setAnswers] = React.useState<{ id: string; correct: boolean }[]>([]);
  const [result, setResult] = React.useState<Payout | null>(null);
  const [family, setFamily] = React.useState<"drug" | "disorder" | "mixed">("mixed");
  const [run, setRun] = React.useState("");
  /** This round's hint: the options it ruled out (null = not used). */
  const [ruledOut, setRuledOut] = React.useState<string[] | null>(null);
  const [hints, setHints] = useHintStatus();

  function start(f = family) {
    setFamily(f);
    setRun(newRunId());
    setRuledOut(null);
    setRounds(deal(f));
    setR(0);
    setClues(1);
    setWrong([]);
    setSolved(null);
    setScore(0);
    setAnswers([]);
    setResult(null);
  }

  if (result) return <Summary result={result} state={state} confetti={[]} title={`Detective · ${score} points`} onAgain={() => start()} />;

  if (!rounds) {
    return (
      <div className="mx-auto max-w-xl space-y-6 px-4 py-8 text-center">
        <Chai mood="think" size={130} />
        <h1 className="text-h1">Clinic detective</h1>
        {state.detectiveBest ? <p className="font-pix text-sm">Your best: {state.detectiveBest}</p> : null}
        <div className="grid gap-3 sm:grid-cols-3">
          {(
            [
              ["mixed", "Mixed"],
              ["drug", "Medicines"],
              ["disorder", "Disorders"],
            ] as const
          ).map(([f, label]) => (
            <button key={f} type="button" onClick={() => start(f)} className="btn-sweep h-14 rounded-2xl border-2 border-foreground bg-primary text-lg font-bold text-primary-foreground hard-shadow-md">
              {label}
            </button>
          ))}
        </div>
        <BackLink className="block text-sm font-bold underline-offset-4 hover:underline">
          Back
        </BackLink>
      </div>
    );
  }

  const round = rounds[r];
  const answer = conceptById(round.c.answer)!;

  function guess(id: string) {
    if (solved) return;
    if (id === round.c.answer) {
      // A hint halves this case's points.
      const gained = hintedPoints(Math.max(0, POINTS[clues - 1] - wrong.length * WRONG_PENALTY), ruledOut ? 1 : 0);
      haptic("success");
      setScore((x) => x + gained);
      setSolved({ gained, correct: true });
      setAnswers((a) => [...a, { id: round.c.answer, correct: wrong.length === 0 && !ruledOut }]);
    } else {
      haptic("warning");
      const w = [...wrong, id];
      setWrong(w);
      if (clues < 4) setClues(clues + 1);
      else {
        setSolved({ gained: 0, correct: false });
        setAnswers((a) => [...a, { id: round.c.answer, correct: false }]);
      }
    }
  }

  function nextRound() {
    if (r + 1 < rounds!.length) {
      setR(r + 1);
      setClues(1);
      setWrong([]);
      setSolved(null);
      setRuledOut(null);
      return;
    }
    const { state: done, payout } = finishLesson(state, { lessonId: "detective", kind: "detective", answers, maxCombo: 0, bonusXp: score }, istToday(), roll());
    setLearnState(done);
    setResult(payout);
  }

  return (
    <div className={cn("mx-auto max-w-2xl space-y-5 px-4 py-5")}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-bold">
          <Search className="size-5" aria-hidden /> Case {r + 1}
        </span>
        <span className="rounded-full border-2 border-foreground bg-foreground px-3 py-1 font-pix text-sm text-primary">{score} pts</span>
      </div>

      <ol className="space-y-2">
        {round.c.clues.map((clue, k) => (
          <li
            key={k}
            className={cn(
              "flex items-start gap-3 rounded-2xl border-2 p-3",
              k < clues || solved ? cn("border-foreground bg-card", s.rise) : cn("border-dashed border-foreground/30 text-muted-foreground", s.stripes),
            )}
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-lg border-2 border-current font-pix text-[0.7rem]">{k + 1}</span>
            <span className="text-sm font-semibold">{k < clues || solved ? clue : `Clue ${k + 1} · worth ${POINTS[k]} points`}</span>
          </li>
        ))}
      </ol>

      {!solved ? (
        <>
          <p className="text-eyebrow text-link">Your guess ({hintedPoints(Math.max(0, POINTS[clues - 1] - wrong.length * WRONG_PENALTY), ruledOut ? 1 : 0)} points now)</p>
          <HintBar
            status={hints}
            onStatus={setHints}
            used={ruledOut !== null}
            ask={() => askHint({ game: "detective", run, round: r, answer: round.c.answer, options: round.options })}
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
                  disabled={isWrong || gone}
                  aria-label={gone ? `${o.term} (ruled out)` : undefined}
                  onClick={() => guess(id)}
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
            <button type="button" onClick={() => setClues(clues + 1)} className="w-full rounded-2xl border-2 border-dashed border-foreground/50 py-3 text-sm font-bold">
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
              <p className="font-bold">{answer.term}</p>
              <p className="text-sm">{view === "clinician" ? answer.clinician : answer.student}</p>
              <LearnLink topic={answer.term} className="text-current" />
            </div>
          </div>
          <button type="button" autoFocus onClick={nextRound} className={cn("mt-3 h-12 w-full rounded-2xl border-2 border-foreground font-bold", solved.correct ? "bg-foreground text-primary" : "bg-primary text-primary-foreground")}>
            {r + 1 < rounds.length ? "Next case" : "See results"}
          </button>
        </div>
      )}

      {r === 0 && clues === 1 && !solved ? <ChaiSays mood="think" size={56}>Guess early for big points, or wait for more clues.</ChaiSays> : null}
    </div>
  );
}
