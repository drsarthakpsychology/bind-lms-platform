"use client";

import * as React from "react";
import { startHowTo } from "@/components/help/how-to";

import { emptyState, finishLesson, istToday, type LearnState, type Payout } from "@/lib/learn/engine";
import { SCENARIOS, type Choice, type Scenario } from "@/lib/learn/scenarios";
import { initLearnStore, setLearnState, useLearnState } from "@/lib/learn/store";
import { haptic } from "@/lib/haptics";
import { historyFor, noteAnswer, pickRoundFor, useHistoryPrefetch } from "@/lib/history/client";
import { freshRound } from "@/lib/cases/fresh";
import { fromRows, mergeHistory } from "@/lib/history/order";
import type { CaseContext } from "@/lib/cases/server";
import { clearCaseProgress, saveCaseProgress, useCaseProgress } from "@/lib/cases/progress-client";
import { RecycleNote } from "@/components/cases/case-mark";
import { cn } from "@/lib/utils";
import { Chai } from "./chai";
import { Summary } from "./player";
import s from "./learn.module.css";
import { useReaction } from "@/components/reactions/use-reaction";
import { HalftoneCorner } from "@/components/reactions/graphics";
import { moodForScore } from "@/lib/reactions/stickers";

/** The finish sticker: happy for a good round, sad for a poor one. */
function roundMood(answers: { correct: boolean }[]) {
  return moodForScore(answers.filter((a) => a.correct).length, answers.length);
}

const EMPTY = emptyState();
function roll() {
  return Math.random();
}
function shuffle<T>(a: readonly T[]): T[] {
  return [...a].sort(() => roll() - 0.5);
}

const BADGE: Record<Choice["outcome"], { label: string; cls: string; mood: "cheer" | "think" | "sad" }> = {
  best: { label: "Best response", cls: "bg-primary text-primary-foreground", mood: "cheer" },
  ok: { label: "Okay, but…", cls: "bg-brand text-brand-foreground", mood: "think" },
  harm: { label: "Risky choice", cls: "bg-foreground text-background", mood: "sad" },
};

/* ======================================================= What would you do? */
/** A round left half way: the patients, and the step reached (saved progress, src/lib/cases). */
type SavedRound = { deck: string[]; si: number; bi: number; answers: { id: string; correct: boolean }[]; recycled?: boolean };

export function ScenarioGame({ serverState, save, noteId, ctx }: { serverState: LearnState | null; save: (s: LearnState) => Promise<unknown>; noteId?: string; ctx?: CaseContext }) {
  initLearnStore(serverState, save);
  const state = useLearnState(serverState ?? EMPTY);
  const [deck, setDeck] = React.useState<Scenario[] | null>(null);
  const [si, setSi] = React.useState(0);
  const [bi, setBi] = React.useState(0);
  const [picked, setPicked] = React.useState<Choice | null>(null);
  const [answers, setAnswers] = React.useState<{ id: string; correct: boolean }[]>([]);
  const [result, setResult] = React.useState<Payout | null>(null);
  const [recycled, setRecycled] = React.useState(false);
  const reaction = useReaction();
  useHistoryPrefetch("wwyd");
  const progress = useCaseProgress("wwyd", ctx?.progress);
  const slot = noteId ? `note:${noteId}` : "round";
  const saved = progress.get<SavedRound>(slot);
  const savedDeck = saved && Array.isArray(saved.deck) ? saved.deck.map((id) => SCENARIOS.find((x) => x.id === id)).filter((x): x is Scenario => !!x) : [];
  const resumable = saved && savedDeck.length === saved.deck.length && savedDeck.length > 0 && saved.si < savedDeck.length && savedDeck[saved.si] && saved.bi < savedDeck[saved.si].beats.length ? saved : null;

  // Keep the round's place saved while it is open (the step is saved before its answer is shown).
  React.useEffect(() => {
    if (!deck || result) return;
    saveCaseProgress("wwyd", slot, { deck: deck.map((x) => x.id), si, bi, answers, recycled } satisfies SavedRound);
  }, [deck, result, slot, si, bi, answers, recycled]);

  function start() {
    startHowTo("what-would-you-do");
    const pool = noteId ? SCENARIOS.filter((x) => x.noteId === noteId) : SCENARIOS;
    // Fresh cases (src/lib/cases/fresh.ts): only patients never played while any are left, new this week first.
    const history = mergeHistory(fromRows(ctx?.history ?? []), historyFor("wwyd"));
    const r = ctx ? freshRound(pool, (x) => x.id, 5, { history, now: Date.now(), student: ctx.student, rng: roll }) : { round: pickRoundFor("wwyd", pool, (x) => x.id, 5, roll), recycled: false };
    setDeck(r.round);
    setRecycled(r.recycled);
    reaction.reset();
    setSi(0);
    setBi(0);
    setPicked(null);
    setAnswers([]);
    setResult(null);
  }

  function resume(s: SavedRound) {
    startHowTo("what-would-you-do");
    setDeck(savedDeck);
    setRecycled(!!s.recycled);
    reaction.reset();
    setSi(s.si);
    setBi(s.bi);
    setPicked(null);
    setAnswers(Array.isArray(s.answers) ? s.answers : []);
    setResult(null);
  }

  if (result) return <Summary result={result} state={state} confetti={[]} title="What would you do?" mood={roundMood(answers)} onAgain={start} />;
  if (!deck) {
    return (
      <div className="mx-auto max-w-xl space-y-6 py-8 text-center">
        <Chai mood="think" size={130} />
        <h1 className="text-h1">What would you do?</h1>
        {resumable ? (
          <button type="button" onClick={() => resume(resumable)} className="btn-sweep h-14 w-full rounded-2xl border-2 border-foreground bg-foreground text-lg font-bold text-background hard-shadow-md">
            Carry on
          </button>
        ) : null}
        <button type="button" onClick={start} className="btn-sweep h-14 w-full rounded-2xl border-2 border-foreground bg-primary text-lg font-bold text-primary-foreground hard-shadow-md">
          {resumable ? "New patients" : "Start"}
        </button>
      </div>
    );
  }

  const sc = deck[si];
  const beat = sc.beats[bi];

  function choose(c: Choice) {
    if (picked) return;
    setPicked(c);
    haptic(c.outcome === "best" ? "success" : "warning");
    const id = `${sc.id}-${bi}`;
    // A fast double tap must not count the same answer twice.
    setAnswers((a) => (a.some((x) => x.id === id) ? a : [...a, { id, correct: c.outcome === "best" }]));
    // "Okay, but" is a near miss; a risky choice is wrong.
    reaction.onAnswer(c.outcome === "best", { partial: c.outcome === "ok" });
  }
  function next() {
    setPicked(null);
    if (bi + 1 < sc.beats.length) return setBi(bi + 1);
    // A scenario counts as right when every step took the best response.
    const mine = [...answers.filter((a) => a.id.startsWith(`${sc.id}-`))];
    noteAnswer("wwyd", sc.id, mine.length > 0 && mine.every((a) => a.correct));
    if (si + 1 < deck!.length) {
      setSi(si + 1);
      setBi(0);
      return;
    }
    const { state: done, payout } = finishLesson(state, { lessonId: "scenarios", kind: "coach", answers, maxCombo: 0 }, istToday(), roll());
    setLearnState(done);
    setResult(payout);
    clearCaseProgress("wwyd", slot);
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-var(--top-h)-4.5rem)] max-w-2xl flex-col gap-4">
      {recycled && si === 0 && bi === 0 && !picked ? <RecycleNote /> : null}
      <div className="flex items-center gap-3">
        <p className="flex-1 font-bold">
          {sc.topic} · <span className="text-muted-foreground">{sc.who}</span>
        </p>
        <span className="font-pix text-xs">
          {si + 1}
        </span>
      </div>
      <Options key={`${sc.id}-${bi}`} beat={beat} picked={picked} onChoose={choose} />
      {picked ? (
        <div className={cn("rounded-3xl border-2 border-foreground p-4 hard-shadow-md", BADGE[picked.outcome].cls, s.rise)}>
          <div className="flex items-start gap-3">
            <Chai mood={BADGE[picked.outcome].mood} size={60} className="shrink-0" />
            <div>
              <p className="text-lg font-bold">{BADGE[picked.outcome].label}</p>
              <p className="text-sm font-semibold">What happens: {picked.consequence}</p>
              {picked.outcome !== "best" ? <p className="mt-2 text-sm">Best: {beat.choices.find((c) => c.outcome === "best")!.text}</p> : null}
            </div>
          </div>
          <button type="button" autoFocus onClick={next} className="mt-3 h-12 w-full rounded-2xl border-2 border-foreground bg-background font-bold text-foreground">
            {bi + 1 < sc.beats.length ? "What happens next →" : si + 1 < deck.length ? "Next patient" : "Finish"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Options({ beat, picked, onChoose }: { beat: Scenario["beats"][number]; picked: Choice | null; onChoose: (c: Choice) => void }) {
  // Shuffled once per step (not on every render).
  const [order] = React.useState(() => shuffle(beat.choices));
  return (
    <div className={cn("space-y-3", s.rise)}>
      {beat.context ? <p className="rounded-xl border-2 border-dashed border-foreground/40 px-3 py-2 text-sm">{beat.context}</p> : null}
      <p className="relative isolate overflow-hidden rounded-3xl border-2 border-foreground bg-card p-4 text-lg font-bold leading-snug hard-shadow-sm">
        <HalftoneCorner />
        {beat.says}
      </p>
      <p className="text-eyebrow text-link">Your response</p>
      {order.map((c) => (
        <button
          key={c.text}
          type="button"
          disabled={Boolean(picked)}
          onClick={() => onChoose(c)}
          className={cn(
            "w-full rounded-2xl border-2 border-foreground px-4 py-3 text-left font-semibold hard-shadow-sm transition-transform active:translate-y-0.5",
            picked ? (c === picked ? BADGE[c.outcome].cls : c.outcome === "best" ? "bg-primary/40" : "bg-card opacity-60") : "bg-card",
          )}
        >
          {c.text}
        </button>
      ))}
    </div>
  );
}

// "Say it clinically" lives in ./terms-game.tsx: its bank stays on the server.
