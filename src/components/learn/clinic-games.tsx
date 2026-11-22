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
  /** Hints open on this step: the first is free, the second and third make a best answer count as a near miss. */
  const [hints, setHints] = React.useState(0);
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
    // Two or more hints: a best answer is a near miss, not full marks.
    const full = c.outcome === "best" && hints < 2;
    // A fast double tap must not count the same answer twice.
    setAnswers((a) => (a.some((x) => x.id === id) ? a : [...a, { id, correct: full }]));
    // "Okay, but" is a near miss; a risky choice is wrong.
    reaction.onAnswer(full, { partial: c.outcome === "ok" || (c.outcome === "best" && !full) });
  }
  function next() {
    setPicked(null);
    setHints(0);
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
      {bi === 0 && sc.opening ? <OpeningCard o={sc.opening} /> : null}
      <Options key={`${sc.id}-${bi}`} beat={beat} picked={picked} onChoose={choose} hideContext={bi === 0 && !!sc.opening?.lines.includes(beat.context ?? "")} />
      {beat.hints && !picked ? <StepHints hints={beat.hints} used={hints} onMore={() => setHints((h) => Math.min(3, h + 1))} /> : null}
      {beat.hints && picked && hints > 0 ? <StepHints hints={beat.hints} used={hints} locked /> : null}
      {picked ? (
        <div className={cn("rounded-3xl border-2 border-foreground p-4 hard-shadow-md", BADGE[picked.outcome].cls, s.rise)}>
          <div className="flex items-start gap-3">
            <Chai mood={BADGE[picked.outcome].mood} size={60} className="shrink-0" />
            <div>
              <p className="text-lg font-bold">{BADGE[picked.outcome].label}</p>
              <p className="text-sm font-semibold">What happens: {picked.consequence}</p>
              {picked.outcome !== "best" ? <p className="mt-2 text-sm">Best: {beat.choices.find((c) => c.outcome === "best")!.text}</p> : null}
              {picked.outcome === "best" && hints >= 2 ? <p className="mt-2 text-sm">Counted as a near miss, because you opened {hints} hints.</p> : null}
            </div>
          </div>
          <EveryChoice beat={beat} picked={picked} />
          {bi + 1 >= sc.beats.length && sc.learn ? <TakeAway learn={sc.learn} /> : null}
          <button type="button" autoFocus onClick={next} className="mt-3 h-12 w-full rounded-2xl border-2 border-foreground bg-background font-bold text-foreground">
            {bi + 1 < sc.beats.length ? "What happens next →" : si + 1 < deck.length ? "Next patient" : "Finish"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

/** The free starting picture: where you are and your role, then the story so far. */
function OpeningCard({ o }: { o: NonNullable<Scenario["opening"]> }) {
  return (
    <section aria-label="The case" className={cn("space-y-1 rounded-2xl border-2 border-foreground bg-card p-4 text-sm leading-snug", s.rise)}>
      <p className="font-bold">{o.setting}</p>
      {o.lines.map((l, i) => (
        <p key={i}>{l}</p>
      ))}
    </section>
  );
}

/** Up to three hints, opened one at a time. The cost of the next one is on the button. */
function StepHints({ hints, used, onMore, locked }: { hints: readonly string[]; used: number; onMore?: () => void; locked?: boolean }) {
  const cost = used === 0 ? "free" : "a best answer then counts as a near miss";
  return (
    <div className="space-y-2">
      {hints.slice(0, used).map((h, i) => (
        <p key={i} role="status" className="rounded-xl border-2 border-foreground bg-status-info-bg px-3 py-2 text-sm text-status-info-fg">
          <span className="font-bold">Hint {i + 1}. </span>
          {h}
        </p>
      ))}
      {!locked && used < hints.length ? (
        <button type="button" onClick={onMore} className="flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-foreground px-4 py-2 text-left text-sm font-semibold">
          <span>
            Hint {used + 1} of {hints.length}
          </span>
          <span className="font-normal text-muted-foreground">{cost}</span>
        </button>
      ) : null}
    </div>
  );
}

/** After an answer: every choice with what happens and why, the picked one first. */
function EveryChoice({ beat, picked }: { beat: Scenario["beats"][number]; picked: Choice }) {
  const rest = beat.choices.filter((c) => c !== picked);
  return (
    <ul className="mt-3 space-y-2 rounded-2xl bg-background p-3 text-sm text-foreground" aria-label="Every choice">
      {rest.map((c) => (
        <li key={c.text}>
          <span className="font-bold">{BADGE[c.outcome].label} </span>
          {c.text}. <span className="text-muted-foreground">{c.consequence}</span>
        </li>
      ))}
    </ul>
  );
}

function TakeAway({ learn }: { learn: NonNullable<Scenario["learn"]> }) {
  return (
    <div className="mt-3 space-y-1 rounded-2xl bg-background p-3 text-sm text-foreground">
      <p className="font-bold">{learn.concept}</p>
      <p>{learn.point}</p>
      {learn.errors.length ? (
        <ul className="list-disc pl-5">
          {learn.errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function Options({ beat, picked, onChoose, hideContext }: { beat: Scenario["beats"][number]; picked: Choice | null; onChoose: (c: Choice) => void; hideContext?: boolean }) {
  // Shuffled once per step (not on every render).
  const [order] = React.useState(() => shuffle(beat.choices));
  return (
    <div className={cn("space-y-3", s.rise)}>
      {beat.context && !hideContext ? <p className="rounded-xl border-2 border-dashed border-foreground/40 px-3 py-2 text-sm">{beat.context}</p> : null}
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
