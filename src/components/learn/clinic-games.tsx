"use client";

import * as React from "react";

import { emptyState, finishLesson, istToday, type LearnState, type Payout } from "@/lib/learn/engine";
import { SCENARIOS, WORDS, type Choice, type Scenario } from "@/lib/learn/scenarios";
import { ALL_TERMS } from "@/lib/learn/notes";
import { initLearnStore, setLearnState, useLearnState } from "@/lib/learn/store";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { Chai, ChaiSays } from "./chai";
import { Summary } from "./player";
import s from "./learn.module.css";

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
export function ScenarioGame({ serverState, save, noteId }: { serverState: LearnState | null; save: (s: LearnState) => Promise<unknown>; noteId?: string }) {
  initLearnStore(serverState, save);
  const state = useLearnState(serverState ?? EMPTY);
  const [deck, setDeck] = React.useState<Scenario[] | null>(null);
  const [si, setSi] = React.useState(0);
  const [bi, setBi] = React.useState(0);
  const [picked, setPicked] = React.useState<Choice | null>(null);
  const [answers, setAnswers] = React.useState<{ id: string; correct: boolean }[]>([]);
  const [result, setResult] = React.useState<Payout | null>(null);

  function start() {
    const pool = noteId ? SCENARIOS.filter((x) => x.noteId === noteId) : SCENARIOS;
    setDeck(shuffle(pool).slice(0, 5));
    setSi(0);
    setBi(0);
    setPicked(null);
    setAnswers([]);
    setResult(null);
  }

  if (result) return <Summary result={result} state={state} confetti={[]} title="What would you do?" onAgain={start} />;
  if (!deck) {
    return (
      <div className="mx-auto max-w-xl space-y-6 px-4 py-8 text-center">
        <Chai mood="think" size={130} />
        <h1 className="text-h1">What would you do?</h1>
        <button type="button" onClick={start} className="btn-sweep h-14 w-full rounded-2xl border-2 border-foreground bg-primary text-lg font-bold text-primary-foreground hard-shadow-md">
          Start
        </button>
      </div>
    );
  }

  const sc = deck[si];
  const beat = sc.beats[bi];
  const options = shuffle(beat.choices);

  function choose(c: Choice) {
    if (picked) return;
    setPicked(c);
    haptic(c.outcome === "best" ? "success" : "warning");
    setAnswers((a) => [...a, { id: `${sc.id}-${bi}`, correct: c.outcome === "best" }]);
  }
  function next() {
    setPicked(null);
    if (bi + 1 < sc.beats.length) return setBi(bi + 1);
    if (si + 1 < deck!.length) {
      setSi(si + 1);
      setBi(0);
      return;
    }
    const { state: done, payout } = finishLesson(state, { lessonId: "scenarios", kind: "coach", answers, maxCombo: 0 }, istToday(), roll());
    setLearnState(done);
    setResult(payout);
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-2xl flex-col gap-4 px-4 py-5">
      <div className="flex items-center gap-3">
        <p className="flex-1 font-bold">
          {sc.topic} · <span className="text-muted-foreground">{sc.who}</span>
        </p>
        <span className="font-pix text-xs">
          {si + 1}
        </span>
      </div>
      <Options key={`${sc.id}-${bi}`} beat={beat} options={options} picked={picked} onChoose={choose} />
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

function Options({ beat, options, picked, onChoose }: { beat: Scenario["beats"][number]; options: Choice[]; picked: Choice | null; onChoose: (c: Choice) => void }) {
  const [order] = React.useState(options);
  return (
    <div className={cn("space-y-3", s.rise)}>
      {beat.context ? <p className="rounded-xl border-2 border-dashed border-foreground/40 px-3 py-2 text-sm">{beat.context}</p> : null}
      <p className="rounded-3xl border-2 border-foreground bg-card p-4 text-lg font-bold leading-snug hard-shadow-sm">{beat.says}</p>
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

/* ============================================================ Say it clinically */
type Q = { prompt: string; answer: string; options: string[]; why: string; kind: "term" | "words" };

function buildRound(): Q[] {
  const terms = shuffle(ALL_TERMS).slice(0, 8).map((t) => {
    const others = shuffle(ALL_TERMS.filter((x) => x.term !== t.term)).slice(0, 3).map((x) => x.term);
    return { prompt: `They say: “${t.lay}”. You write:`, answer: t.term, options: shuffle([t.term, ...others]), why: `${t.topic}: “${t.lay}” → ${t.term}`, kind: "term" as const };
  });
  const words = shuffle(WORDS).slice(0, 4).map((w) => ({ prompt: "Which is the better way to say it?", answer: w.better, options: shuffle([w.better, w.worse]), why: w.why, kind: "words" as const }));
  return shuffle([...terms, ...words]);
}

export function TermsGame({ serverState, save }: { serverState: LearnState | null; save: (s: LearnState) => Promise<unknown> }) {
  initLearnStore(serverState, save);
  const state = useLearnState(serverState ?? EMPTY);
  const [round, setRound] = React.useState<Q[] | null>(null);
  const [i, setI] = React.useState(0);
  const [pick, setPick] = React.useState<string | null>(null);
  const [answers, setAnswers] = React.useState<{ id: string; correct: boolean }[]>([]);
  const [result, setResult] = React.useState<Payout | null>(null);

  if (result) return <Summary result={result} state={state} confetti={[]} title="Say it clinically" onAgain={() => { setRound(buildRound()); setI(0); setAnswers([]); setResult(null); }} />;
  if (!round) {
    return (
      <div className="mx-auto max-w-xl space-y-6 px-4 py-8 text-center">
        <Chai mood="happy" size={130} />
        <h1 className="text-h1">Say it clinically</h1>
        <button type="button" onClick={() => setRound(buildRound())} className="btn-sweep h-14 w-full rounded-2xl border-2 border-foreground bg-primary text-lg font-bold text-primary-foreground hard-shadow-md">
          Start
        </button>
      </div>
    );
  }
  const q = round[i];
  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-6">
      <div className="h-3 overflow-hidden rounded-full border-2 border-foreground">
        <div className="h-full bg-primary transition-[width]" style={{ width: `${(i / round.length) * 100}%` }} />
      </div>
      <p className="text-eyebrow text-link">{q.kind === "words" ? "Words matter" : "Case-sheet language"}</p>
      <h2 className="text-xl font-bold leading-tight">{q.prompt}</h2>
      <div className="grid gap-2.5">
        {q.options.map((o) => (
          <button
            key={o}
            type="button"
            disabled={Boolean(pick)}
            onClick={() => {
              setPick(o);
              haptic(o === q.answer ? "success" : "warning");
              setAnswers((a) => [...a, { id: `${q.kind}-${q.answer}`, correct: o === q.answer }]);
            }}
            className={cn(
              "rounded-2xl border-2 border-foreground px-4 py-3 text-left font-bold hard-shadow-sm",
              pick ? (o === q.answer ? "bg-primary text-primary-foreground" : o === pick ? cn("bg-foreground text-background", s.shake) : "bg-card opacity-60") : "bg-card",
            )}
          >
            {o}
          </button>
        ))}
      </div>
      {pick ? (
        <div className={s.rise}>
          <ChaiSays mood={pick === q.answer ? "cheer" : "sad"} size={56}>
            {q.why}
          </ChaiSays>
          <button
            type="button"
            autoFocus
            onClick={() => {
              setPick(null);
              if (i + 1 < round.length) return setI(i + 1);
              const { state: done, payout } = finishLesson(state, { lessonId: "terms", kind: "coach", answers, maxCombo: 0 }, istToday(), roll());
              setLearnState(done);
              setResult(payout);
            }}
            className="mt-3 h-12 w-full rounded-2xl border-2 border-foreground bg-primary font-bold text-primary-foreground"
          >
            {i + 1 < round.length ? "Next" : "Finish"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
