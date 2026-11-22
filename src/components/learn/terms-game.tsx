"use client";

import * as React from "react";
import { startHowTo } from "@/components/help/how-to";
import { emptyState, finishLesson, istToday, type LearnState, type Payout } from "@/lib/learn/engine";
import { initLearnStore, setLearnState, useLearnState } from "@/lib/learn/store";
import type { TermsQuestion, TermsReveal } from "@/lib/learn/terms-round";
import { haptic } from "@/lib/haptics";
import { noteAnswer, useHistoryPrefetch } from "@/lib/history/client";
import { cn } from "@/lib/utils";
import { useReaction } from "@/components/reactions/use-reaction";
import { AnswerStamp, HalftoneCorner } from "@/components/reactions/graphics";
import { moodForScore } from "@/lib/reactions/stickers";
import { Chai, ChaiSays } from "./chai";
import { Summary } from "./player";
import s from "./learn.module.css";

export type TermsStartResult = { ok: true; token: string; total: number; question: TermsQuestion } | { ok: false; error: string };
export type TermsAnswerResult = { ok: true; reveal: TermsReveal; next: TermsQuestion | null } | { ok: false; error: string };

const EMPTY = emptyState();
const roll = () => Math.random();

/**
 * "Say it clinically". The round and every check happen on the server
 * (practice/terms/actions.ts): the browser holds one question at a time and
 * learns the answer only after picking.
 */
export function TermsGame({
  serverState,
  save,
  start,
  answer,
}: {
  serverState: LearnState | null;
  save: (s: LearnState) => Promise<unknown>;
  start: () => Promise<TermsStartResult>;
  answer: (input: { token: string; index: number; pick: string }) => Promise<TermsAnswerResult>;
}) {
  initLearnStore(serverState, save);
  const state = useLearnState(serverState ?? EMPTY);
  useHistoryPrefetch("say-it");
  const [round, setRound] = React.useState<{ token: string; total: number } | null>(null);
  const [q, setQ] = React.useState<TermsQuestion | null>(null);
  const [nextQ, setNextQ] = React.useState<TermsQuestion | null>(null);
  const [i, setI] = React.useState(0);
  const [pick, setPick] = React.useState<string | null>(null);
  const [reveal, setReveal] = React.useState<TermsReveal | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [answers, setAnswers] = React.useState<{ id: string; correct: boolean }[]>([]);
  const [result, setResult] = React.useState<Payout | null>(null);
  const reaction = useReaction();

  async function begin() {
    if (busy) return;
    setBusy(true);
    setError(null);
    let r: TermsStartResult;
    try {
      r = await start();
    } catch {
      r = { ok: false, error: "That didn't load. Try again." };
    }
    setBusy(false);
    if (!r.ok) return setError(r.error);
    reaction.reset();
    setRound({ token: r.token, total: r.total });
    setQ(r.question);
    setNextQ(null);
    setI(0);
    setPick(null);
    setReveal(null);
    setAnswers([]);
    setResult(null);
  }

  async function choose(o: string) {
    if (pick || busy || !round || !q) return;
    setPick(o);
    setBusy(true);
    setError(null);
    let r: TermsAnswerResult;
    try {
      r = await answer({ token: round.token, index: i, pick: o });
    } catch {
      r = { ok: false, error: "That didn't save. Tap your answer again." };
    }
    setBusy(false);
    if (!r.ok) {
      setPick(null);
      return setError(r.error);
    }
    const ok = r.reveal.correct;
    haptic(ok ? "success" : "warning");
    // A fast double tap must not count the same answer twice.
    setAnswers((a) => (a.some((x) => x.id === q.id) ? a : [...a, { id: q.id, correct: ok }]));
    // The server already wrote the answer history; this keeps the browser copy in step.
    noteAnswer("say-it", q.id, ok, { server: false });
    reaction.onAnswer(ok);
    setReveal(r.reveal);
    setNextQ(r.next);
  }

  function next() {
    if (!round) return;
    setPick(null);
    setReveal(null);
    if (nextQ) {
      setQ(nextQ);
      setNextQ(null);
      setI(i + 1);
      return;
    }
    const { state: done, payout } = finishLesson(state, { lessonId: "terms", kind: "coach", answers, maxCombo: 0 }, istToday(), roll());
    setLearnState(done);
    setResult(payout);
  }

  const errorLine = error ? (
    <p role="alert" className="rounded-xl border-2 border-foreground bg-card px-3 py-2 text-sm font-semibold">
      {error}
    </p>
  ) : null;

  if (result) return <Summary result={result} state={state} confetti={[]} title="Say it clinically" mood={moodForScore(answers.filter((a) => a.correct).length, answers.length)} onAgain={() => void begin()} />;
  if (!round || !q) {
    return (
      <div className="mx-auto max-w-xl space-y-6 py-8 text-center">
        <Chai mood="happy" size={130} />
        <h1 className="text-h1">Say it clinically</h1>
        {errorLine}
        <button
          type="button"
          disabled={busy}
          aria-busy={busy}
          onClick={() => {
            startHowTo("say-it-clinically");
            void begin();
          }}
          className="btn-sweep h-14 w-full rounded-2xl border-2 border-foreground bg-primary text-lg font-bold text-primary-foreground hard-shadow-md"
        >
          {busy ? "Loading..." : "Start"}
        </button>
      </div>
    );
  }
  const right = reveal?.answer ?? null;
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="h-3 overflow-hidden rounded-full border-2 border-foreground">
        <div className="h-full bg-primary transition-[width]" style={{ width: `${(i / round.total) * 100}%` }} />
      </div>
      <p className="text-eyebrow text-link">
        {q.kind === "words" ? "Words matter" : "Case-sheet language"}
        {q.language ? <span className="text-muted-foreground"> · {q.language}</span> : null}
      </p>
      <div className="relative isolate">
        <HalftoneCorner className="-top-3 size-24" />
        <h2 className="text-xl font-bold leading-tight">{q.prompt}</h2>
      </div>
      {errorLine}
      <div className="grid gap-2.5">
        {q.options.map((o) => (
          <button
            key={o}
            type="button"
            disabled={Boolean(pick)}
            onClick={() => void choose(o)}
            className={cn(
              "relative rounded-2xl border-2 border-foreground px-4 py-3 text-left font-bold hard-shadow-sm",
              reveal ? (o === right ? "bg-primary text-primary-foreground" : o === pick ? cn("bg-foreground text-background", s.shake) : "bg-card opacity-60") : pick === o ? "bg-card opacity-80" : "bg-card",
            )}
          >
            {reveal && pick === o ? <AnswerStamp ok={o === right} /> : null}
            {o}
          </button>
        ))}
      </div>
      {reveal ? (
        <div className={s.rise}>
          <ChaiSays mood={reveal.correct ? "cheer" : "sad"} size={56}>
            {reveal.meaning ? <span className="block font-semibold">{reveal.meaning}</span> : null}
            {reveal.why}
            {reveal.note ? <span className="mt-1 block text-sm">Also: {reveal.note}.</span> : null}
          </ChaiSays>
          <button type="button" autoFocus onClick={next} className="mt-3 h-12 w-full rounded-2xl border-2 border-foreground bg-primary font-bold text-primary-foreground">
            {nextQ ? "Next" : "Finish"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
