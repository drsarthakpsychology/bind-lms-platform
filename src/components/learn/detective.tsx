"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { emptyState, finishLesson, istToday, type LearnState, type Payout } from "@/lib/learn/engine";
import { CASES, POINTS, WRONG_PENALTY, type Case } from "@/lib/learn/detective";
import { conceptById } from "@/lib/learn/concepts";
import { initLearnStore, setLearnState, useLearnState } from "@/lib/learn/store";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { Chai, ChaiSays } from "./chai";
import { Summary } from "./player";
import { useExplainView } from "./view-toggle";
import s from "./learn.module.css";

const EMPTY = emptyState();
const ROUNDS = 8;

function roll() {
  return Math.random();
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

  function start(f = family) {
    setFamily(f);
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
        <p className="text-muted-foreground">
          Clues appear one by one. Name the medicine or disorder as early as you dare: 40 points on clue 1, down to 10 on clue 4. Wrong guesses cost {WRONG_PENALTY}.
        </p>
        {state.detectiveBest ? <p className="font-pix text-sm">Your best: {state.detectiveBest}</p> : null}
        <div className="grid gap-3 sm:grid-cols-3">
          {(
            [
              ["mixed", "Mixed"],
              ["drug", "Medicines"],
              ["disorder", "Disorders"],
            ] as const
          ).map(([f, label]) => (
            <button key={f} type="button" onClick={() => start(f)} className="btn-sweep h-14 rounded-2xl border-2 border-foreground bg-primary text-lg font-black text-primary-foreground hard-shadow-md">
              {label}
            </button>
          ))}
        </div>
        <Link href="/practice/learn" className="block text-sm font-bold underline-offset-4 hover:underline">
          Back to Learn
        </Link>
      </div>
    );
  }

  const round = rounds[r];
  const answer = conceptById(round.c.answer)!;

  function guess(id: string) {
    if (solved) return;
    if (id === round.c.answer) {
      const gained = Math.max(0, POINTS[clues - 1] - wrong.length * WRONG_PENALTY);
      haptic("success");
      setScore((x) => x + gained);
      setSolved({ gained, correct: true });
      setAnswers((a) => [...a, { id: round.c.answer, correct: wrong.length === 0 }]);
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
      return;
    }
    const { state: done, payout } = finishLesson(state, { lessonId: "detective", kind: "detective", answers, maxCombo: 0, bonusXp: score }, istToday(), roll());
    setLearnState(done);
    setResult(payout);
  }

  return (
    <div className={cn("mx-auto max-w-2xl space-y-5 px-4 py-5")}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-black">
          <Search className="size-5" aria-hidden /> Case {r + 1}/{rounds.length}
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
          <p className="text-eyebrow text-link">Your guess ({POINTS[clues - 1] - wrong.length * WRONG_PENALTY > 0 ? POINTS[clues - 1] - wrong.length * WRONG_PENALTY : 0} points now)</p>
          <div className="grid grid-cols-2 gap-2.5">
            {round.options.map((id) => {
              const o = conceptById(id)!;
              const isWrong = wrong.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  disabled={isWrong}
                  onClick={() => guess(id)}
                  className={cn(
                    "min-h-16 min-w-0 rounded-2xl border-2 border-foreground px-3 py-2 text-left text-sm font-black leading-tight [overflow-wrap:anywhere] hard-shadow-sm transition-transform active:translate-y-0.5 sm:text-base",
                    isWrong ? cn("bg-foreground text-background line-through opacity-60", s.shake) : "bg-card",
                  )}
                >
                  {o.term}
                </button>
              );
            })}
          </div>
          {clues < 4 ? (
            <button type="button" onClick={() => setClues(clues + 1)} className="w-full rounded-2xl border-2 border-dashed border-foreground/50 py-3 text-sm font-bold">
              Show next clue (−10 points)
            </button>
          ) : null}
        </>
      ) : (
        <div className={cn("rounded-3xl border-2 border-foreground p-4 hard-shadow-md", solved.correct ? "bg-primary text-primary-foreground" : "bg-foreground text-background", s.rise)}>
          <div className="flex items-start gap-3">
            <Chai mood={solved.correct ? (clues === 1 ? "cheer" : "happy") : "sad"} size={64} className="shrink-0" />
            <div>
              <p className="text-lg font-black">{solved.correct ? (clues === 1 ? `First clue! +${solved.gained}` : `Solved! +${solved.gained}`) : "Case closed without you."}</p>
              <p className="font-black">{answer.term}</p>
              <p className="text-sm">{view === "clinician" ? answer.clinician : answer.student}</p>
            </div>
          </div>
          <button type="button" autoFocus onClick={nextRound} className={cn("mt-3 h-12 w-full rounded-2xl border-2 border-foreground font-black", solved.correct ? "bg-foreground text-primary" : "bg-primary text-primary-foreground")}>
            {r + 1 < rounds.length ? "Next case" : "See results"}
          </button>
        </div>
      )}

      {r === 0 && clues === 1 && !solved ? <ChaiSays mood="think" size={56}>Guess early for big points, or wait for more clues.</ChaiSays> : null}
    </div>
  );
}
