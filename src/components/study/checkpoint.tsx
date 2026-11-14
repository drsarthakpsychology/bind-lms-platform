"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ListChecks } from "lucide-react";
import { istToday, recordTest, type LearnState } from "@/lib/learn/engine";
import { getLearnState, initLearnStore, setLearnState, useLearnState } from "@/lib/learn/store";
import type { Card, Mcq } from "@/lib/study/types";
import { CardDeck, TestRunner, mcqKey } from "./interactive";
import { historyFor, useHistoryPrefetch } from "@/lib/history/client";
import { checkpointKnown, checkpointRound } from "@/lib/study/checkpoints";
import { backLinkClass } from "@/components/design-system/back-link";
import { EndReaction, ScoreDial } from "@/components/reactions/graphics";

/**
 * A checkpoint: case questions first (scored), then "say it out loud" cards.
 * Open any time; it works best after moving on from the sections it covers.
 */
export function CheckpointView({
  moduleId,
  moduleTitle,
  n,
  cpKey,
  covers,
  mcq,
  recall,
  then,
  serverState,
  save,
}: {
  moduleId: string;
  moduleNum: number;
  moduleTitle: string;
  n: number;
  cpKey: string;
  covers: string[];
  mcq: Mcq[];
  recall: Card[];
  then: string;
  serverState: LearnState | null;
  save: (s: LearnState) => Promise<unknown>;
}) {
  initLearnStore(serverState, save);
  const st = useLearnState(serverState ?? ({} as LearnState));
  const prev = st.study?.tests?.[cpKey];
  const [stage, setStage] = React.useState<"intro" | "mcq" | "cards" | "end">("intro");
  // Answer history (src/lib/history): a sitting asks questions not yet seen,
  // then missed ones, and never one already answered right.
  useHistoryPrefetch("study-check");
  const idOf = React.useCallback((m: Mcq) => mcqKey(cpKey, m), [cpKey]);
  const round = () => checkpointRound(mcq, idOf, historyFor("study-check"), Date.now(), Math.random);
  const [ordered, setOrdered] = React.useState(mcq);
  const [score, setScore] = React.useState<{ right: number; total: number } | null>(null);
  // Every case question is already right: straight to the cards, the score stays.
  const [allKnown, setAllKnown] = React.useState(false);
  const startMcq = () => {
    const next = round();
    if (!next.length) {
      const known = checkpointKnown(mcq, idOf, historyFor("study-check"));
      const s = getLearnState();
      // Answered right on another visit but never saved here: save it once.
      if (s && !s.study.tests[cpKey]) setLearnState(recordTest(s, cpKey, known.right, known.total, istToday()));
      setAllKnown(true);
      setScore(known);
      setStage(recall.length ? "cards" : "end");
      return;
    }
    setOrdered(next);
    setStage("mcq");
  };
  // The saved score is how many of ALL this checkpoint's questions are right now.
  const scoreOf = () => checkpointKnown(mcq, idOf, historyFor("study-check"));

  const startCards = () => (recall.length ? setStage("cards") : setStage("end"));
  const deckDone = (knew: number, total: number) => {
    // A checkpoint with no case questions is scored on the cards.
    if (!mcq.length) {
      const s = getLearnState();
      if (s) setLearnState(recordTest(s, cpKey, knew, total, istToday()));
      setScore({ right: knew, total });
    }
    setStage("end");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href={`/study/${moduleId}`} className={backLinkClass}>
        <ArrowLeft className="size-4" aria-hidden /> Back to the module
      </Link>
      <header>
        <p className="text-sm font-semibold text-link">
          {moduleTitle} · Checkpoint {n}
        </p>
        <h1 className="mt-1 text-h1">What stuck?</h1>
        <p className="mt-2 text-muted-foreground">Covers {covers.join(", ")}.</p>
      </header>

      {stage === "intro" ? (
        <section className="rounded-3xl border-2 border-foreground bg-card p-5 sm:p-6">
          <p className="flex items-center gap-2 text-2xl font-bold">
            <ListChecks className="size-6 shrink-0" aria-hidden />
            <span className="min-w-0">
              {mcq.length ? "Case questions" : ""}
              {mcq.length && recall.length ? ", then " : ""}
              {recall.length ? (mcq.length ? "say it aloud" : "Say it aloud") : ""}
            </span>
          </p>
          <p className="mt-2 text-[0.95rem] text-muted-foreground">From memory, no notes.</p>
          {prev ? <p className="mt-3 text-sm font-semibold">Your best so far: {prev.best} of {prev.total}</p> : null}
          <button
            type="button"
            onClick={() => (mcq.length ? startMcq() : startCards())}
            className="btn-sweep mt-5 inline-flex h-12 items-center gap-2 rounded-2xl border-2 border-foreground bg-primary px-6 font-bold text-primary-foreground hard-shadow-sm"
          >
            Start <ArrowRight className="size-5" aria-hidden />
          </button>
        </section>
      ) : null}

      {stage === "mcq" ? (
        <TestRunner
          items={ordered}
          moduleId={cpKey}
          historyTool="study-check"
          label={`Checkpoint ${n}`}
          autoStart
          retry={round}
          scoreOf={scoreOf}
          onDone={(right, total) => setScore({ right, total })}
        />
      ) : null}
      {stage === "mcq" && score ? (
        <button type="button" onClick={startCards} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-foreground bg-primary font-bold text-primary-foreground">
          {recall.length ? "Now say it out loud" : "Finish"} <ArrowRight className="size-5" aria-hidden />
        </button>
      ) : null}

      {stage === "cards" && allKnown ? <p className="text-sm font-semibold">Every case question here is right. Say these out loud.</p> : null}
      {stage === "cards" ? <CardDeck items={recall} kind="recall" title="Say it out loud" autoStart onDone={deckDone} /> : null}

      {stage === "end" ? (
        <section className="rounded-3xl border-2 border-foreground bg-foreground p-5 text-background" role="status">
          <p className="text-sm font-semibold text-primary">Checkpoint {n} done</p>
          {score ? (
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-4">
              <div className="text-foreground">
                <ScoreDial right={score.right} total={score.total} />
              </div>
              <EndReaction right={score.right} total={score.total} tone="dark" className="min-w-0 flex-1 basis-56" />
              <p className="sr-only">
                {score.right} / {score.total}
              </p>
            </div>
          ) : null}
          <p className="mt-1 text-sm opacity-90">
            {score && score.right / Math.max(1, score.total) < 0.7 ? "Look at those sections again later today." : "Good. On to new material."}
          </p>
          <Link href={then} className="mt-4 inline-flex h-12 items-center gap-2 rounded-2xl border-2 border-primary bg-primary px-5 font-bold text-primary-foreground">
            Continue <ArrowRight className="size-5" aria-hidden />
          </Link>
        </section>
      ) : null}
    </div>
  );
}
