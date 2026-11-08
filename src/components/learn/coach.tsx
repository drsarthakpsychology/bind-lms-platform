"use client";

import * as React from "react";
import { BackLink } from "@/components/study/back";
import { ArrowRight, Flame, GraduationCap } from "lucide-react";
import { emptyState, finishLesson, istToday, type LearnState, type Payout } from "@/lib/learn/engine";
import { buildSession, distractors, domainMastery, formatFor, reasonFor, recordAnswer, similarConcepts, topConfusions, typedMatches, type Format } from "@/lib/learn/adaptive";
import { ALL_CONCEPTS, conceptById, DOMAINS, type Concept, type Domain } from "@/lib/learn/concepts";
import { initLearnStore, setLearnState, useLearnState } from "@/lib/learn/store";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { Chai, ChaiSays } from "./chai";
import { CheckButton } from "./items";
import { Summary } from "./player";
import { useExplainView, ViewToggle } from "./view-toggle";
import s from "./learn.module.css";

const EMPTY = emptyState();
const MAX_REPEATS = 2;

type Step =
  | { kind: "teach"; id: string; reason: string }
  | { kind: "ask"; id: string; format: Format; options: string[]; tfShown?: string; reason: string; repeat: number };

function roll() {
  return Math.random();
}

function shuffle<T>(a: T[]): T[] {
  return [...a].sort(() => Math.random() - 0.5);
}

function makeAsk(c: Concept, state: LearnState, reason: string, repeat: number, forceEasy = false): Step {
  const lvl = state.coach.concepts[c.id]?.lvl ?? 0;
  const format = forceEasy ? "pick-term" : formatFor(lvl, Math.random);
  const ds = distractors(c, state.coach, 3, Math.random);
  const options = shuffle([c.id, ...ds.map((d) => d.id)]);
  const tfShown = format === "tf" ? (Math.random() < 0.5 ? c.id : ds[0]?.id ?? c.id) : undefined;
  return { kind: "ask", id: c.id, format, options, tfShown, reason, repeat };
}

export function Coach({ serverState, save, domain }: { serverState: LearnState | null; save: (s: LearnState) => Promise<unknown>; domain: Domain | "all" }) {
  initLearnStore(serverState, save);
  const state = useLearnState(serverState ?? EMPTY);
  const view = useExplainView();
  const [steps, setSteps] = React.useState<Step[] | null>(null);
  const [i, setI] = React.useState(0);
  const [locked, setLocked] = React.useState(false);
  const [pick, setPick] = React.useState<string | null>(null);
  const [typed, setTyped] = React.useState("");
  const [fb, setFb] = React.useState<{ correct: boolean; picked?: string } | null>(null);
  const [firsts, setFirsts] = React.useState<{ id: string; correct: boolean }[]>([]);
  const [combo, setCombo] = React.useState(0);
  const [maxCombo, setMaxCombo] = React.useState(0);
  const [startLevels, setStartLevels] = React.useState<Record<string, number>>({});
  const [result, setResult] = React.useState<Payout | null>(null);
  const today = istToday();
  const title = domain === "all" ? "Mixed coaching" : DOMAINS.find((d) => d.id === domain)?.title ?? "Coach";

  function start() {
    const ids = buildSession(state.coach, domain, today, Math.random, 10);
    const levels: Record<string, number> = {};
    const list: Step[] = [];
    for (const id of ids) {
      const c = conceptById(id)!;
      const st = state.coach.concepts[id];
      levels[id] = st?.lvl ?? 0;
      const reason = reasonFor(id, state.coach, today);
      if (!st || st.teach) list.push({ kind: "teach", id, reason });
      list.push(makeAsk(c, state, reason, 0, !st));
    }
    setStartLevels(levels);
    setSteps(list);
    setI(0);
    setFirsts([]);
    setCombo(0);
    setMaxCombo(0);
    setResult(null);
  }

  if (result) {
    return (
      <div>
        <Summary result={result} state={state} confetti={[]} title={title} onAgain={start} />
        <CoachReport levels={startLevels} />
      </div>
    );
  }

  if (!steps) return <CoachIntro domain={domain} title={title} state={state} onStart={start} />;

  const step = steps[i];
  const c = conceptById(step.id)!;
  const progress = Math.round((i / steps.length) * 100);

  function answer(correct: boolean, picked?: string) {
    if (step.kind !== "ask") return;
    setLocked(true);
    setFb({ correct, picked });
    const isFirst = !firsts.some((f) => f.id === step.id);
    if (isFirst) setFirsts((f) => [...f, { id: step.id, correct }]);
    const coach = recordAnswer(state.coach, step.id, correct, today, correct ? undefined : picked);
    setLearnState({ ...state, coach });
    if (correct) {
      const cb = combo + 1;
      setCombo(cb);
      setMaxCombo((m) => Math.max(m, cb));
      haptic("success");
    } else {
      setCombo(0);
      haptic("warning");
      // Teach it again and ask again a few questions later, until it's right.
      if (step.repeat < MAX_REPEATS) {
        const nextState = { ...state, coach };
        const again: Step[] = [{ kind: "teach", id: step.id, reason: "Let's lock this one in" }, makeAsk(c, nextState, "Second chance", step.repeat + 1, true)];
        setSteps((list) => {
          const copy = [...(list ?? [])];
          copy.splice(Math.min(copy.length, i + 3), 0, ...again);
          return copy;
        });
      }
    }
  }

  function next() {
    setFb(null);
    setLocked(false);
    setPick(null);
    setTyped("");
    if (i + 1 < (steps?.length ?? 0)) {
      setI(i + 1);
      return;
    }
    const { state: done, payout } = finishLesson(state, { lessonId: `coach-${domain}`, kind: "coach", answers: firsts, maxCombo }, today, roll());
    setLearnState(done);
    setResult(payout);
  }

  const shownDef = (x: Concept) => (view === "clinician" ? x.clinician : x.student);

  return (
    <div className={cn("mx-auto flex min-h-[calc(100dvh-4rem)] max-w-2xl flex-col px-4 pt-4 pb-6")}>
      <div className="flex items-center gap-3">
        <div className="h-4 flex-1 overflow-hidden rounded-full border-2 border-foreground bg-muted">
          <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </div>
        <span className={cn("flex items-center gap-1 rounded-full border-2 border-foreground px-2.5 py-1 text-sm font-semibold", combo >= 3 ? "bg-foreground text-primary" : "bg-card")}>
          <Flame className={cn("size-4", combo >= 3 && s.flame)} aria-hidden /> {combo}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-eyebrow text-muted-foreground">{step.reason}</p>
        <ViewToggle />
      </div>

      <div key={`${step.kind}-${step.id}-${i}`} className={cn("mt-5 flex-1", s.rise)}>
        {step.kind === "teach" ? (
          <TeachCard concept={c} state={state} def={shownDef(c)} onNext={next} />
        ) : (
          <div className="space-y-4">
            {step.format === "pick-term" ? (
              <>
                <p className="text-eyebrow text-link">Which term is this?</p>
                <h2 className="text-xl font-bold leading-tight sm:text-2xl">“{c.student}”</h2>
              </>
            ) : step.format === "pick-meaning" ? (
              <>
                <p className="text-eyebrow text-link">What does this mean?</p>
                <h2 className="text-2xl font-black leading-tight sm:text-3xl">{c.term}</h2>
              </>
            ) : step.format === "tf" ? (
              <>
                <p className="text-eyebrow text-link">True or false?</p>
                <h2 className="text-xl font-bold leading-tight sm:text-2xl">
                  {c.term} means: “{conceptById(step.tfShown!)!.student}”
                </h2>
              </>
            ) : (
              <>
                <p className="text-eyebrow text-link">Type the term</p>
                <h2 className="text-xl font-bold leading-tight sm:text-2xl">“{c.student}”</h2>
              </>
            )}

            {step.format === "pick-term" || step.format === "pick-meaning" ? (
              <div className="grid gap-2.5">
                {step.options.map((oid, k) => {
                  const o = conceptById(oid)!;
                  const st = locked ? (oid === c.id ? "right" : pick === oid ? "wrong" : "idle") : pick === oid ? "picked" : "idle";
                  return (
                    <button
                      key={oid}
                      type="button"
                      disabled={locked}
                      onClick={() => {
                        haptic("tap");
                        setPick(oid);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl border-2 border-foreground bg-card px-4 py-3 text-left font-semibold hard-shadow-sm transition-transform active:translate-y-0.5",
                        st === "picked" && "bg-brand text-brand-foreground",
                        st === "right" && "bg-primary text-primary-foreground",
                        st === "wrong" && cn("bg-foreground text-background", s.shake),
                      )}
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-lg border-2 border-current font-pix text-[0.7rem]">{k + 1}</span>
                      <span className={step.format === "pick-term" ? "text-base font-bold" : "text-sm"}>{step.format === "pick-term" ? o.term : o.student}</span>
                    </button>
                  );
                })}
                {!locked ? <CheckButton disabled={!pick} onClick={() => answer(pick === c.id, pick ?? undefined)} /> : null}
              </div>
            ) : step.format === "tf" ? (
              <div className="grid grid-cols-2 gap-3">
                {[true, false].map((v) => {
                  const truth = step.tfShown === c.id;
                  const st = locked ? (v === truth ? "right" : pick === String(v) ? "wrong" : "idle") : "idle";
                  return (
                    <button
                      key={String(v)}
                      type="button"
                      disabled={locked}
                      onClick={() => {
                        setPick(String(v));
                        answer(v === truth, v === truth ? undefined : truth ? undefined : step.tfShown);
                      }}
                      className={cn(
                        "h-24 rounded-2xl border-2 border-foreground text-2xl font-bold hard-shadow-sm active:translate-y-1",
                        st === "right" ? "bg-primary text-primary-foreground" : st === "wrong" ? cn("bg-foreground text-background", s.shake) : "bg-card",
                      )}
                    >
                      {v ? "True" : "False"}
                    </button>
                  );
                })}
              </div>
            ) : (
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (locked || !typed.trim()) return;
                  const ok = typedMatches(typed, c.term);
                  const guess = ok ? undefined : ALL_CONCEPTS.find((x) => x.id !== c.id && typedMatches(typed, x.term))?.id;
                  answer(ok, guess);
                }}
              >
                <input
                  autoFocus
                  value={typed}
                  disabled={locked}
                  onChange={(e) => setTyped(e.target.value)}
                  placeholder="Type your answer…"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className="h-14 w-full rounded-2xl border-2 border-foreground bg-card px-4 text-lg font-bold outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
                />
                {!locked ? <CheckButton disabled={!typed.trim()} onClick={() => undefined} label="Check" /> : null}
              </form>
            )}
          </div>
        )}
      </div>

      {fb && step.kind === "ask" ? (
        <div
          role="status"
          className={cn(
            "sticky bottom-4 mt-5 rounded-3xl border-2 border-foreground p-4 hard-shadow-md",
            fb.correct ? "bg-primary text-primary-foreground" : "bg-foreground text-background",
            s.rise,
          )}
        >
          <div className="flex items-start gap-3">
            <Chai mood={fb.correct ? (combo >= 3 ? "cheer" : "happy") : "sad"} size={64} className="shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold">{fb.correct ? (combo >= 3 ? `${combo} in a row!` : "Got it!") : "Not quite. Here it is:"}</p>
              <p className="mt-1 text-sm font-bold">{c.term}</p>
              <p className="text-sm">{shownDef(c)}</p>
              {fb.correct ? (
                <p className="mt-1 text-caption font-bold">
                  Level {Math.min(5, (state.coach.concepts[c.id]?.lvl ?? 0))}/5
                </p>
              ) : null}
            </div>
          </div>
          {!fb.correct && fb.picked && conceptById(fb.picked) ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {[c, conceptById(fb.picked)!].map((x, k) => (
                <div key={x.id} className={cn("rounded-2xl border-2 p-3", k === 0 ? "border-primary bg-primary text-primary-foreground" : "border-background/40")}>
                  <p className="text-eyebrow">{k === 0 ? "Right answer" : "You picked"}</p>
                  <p className="font-bold">{x.term}</p>
                  <p className="text-sm">{x.student}</p>
                </div>
              ))}
              <p className="text-caption sm:col-span-2">Chai will mix these two into your next sessions until the difference sticks.</p>
            </div>
          ) : null}
          <button
            type="button"
            autoFocus
            onClick={next}
            className={cn("mt-3 h-12 w-full rounded-2xl border-2 border-foreground text-base font-bold hard-shadow-sm", fb.correct ? "bg-foreground text-primary" : "bg-primary text-primary-foreground")}
          >
            Continue
          </button>
        </div>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------------- teach */
function TeachCard({ concept, state, def, onNext }: { concept: Concept; state: LearnState; def: string; onNext: () => void }) {
  const confused = (state.coach.concepts[concept.id]?.miss ?? []).map(conceptById).filter(Boolean) as Concept[];
  const near = confused.length ? confused : similarConcepts(concept, 2);
  return (
    <div className="space-y-4">
      <ChaiSays mood="happy" size={64}>
        {confused.length ? "This one tripped you up. Let's look again." : "New one! Read it, then I'll ask you."}
      </ChaiSays>
      <div className={cn("rounded-3xl border-2 border-foreground bg-card p-5 hard-shadow-md", s.texture)}>
        <p className="text-eyebrow text-link">{DOMAINS.find((d) => d.id === concept.domain)?.title}</p>
        <h2 className="mt-1 text-3xl font-black leading-tight">{concept.term}</h2>
        <p className="mt-3 text-base font-semibold">{def}</p>
        {concept.hook ? <p className="mt-3 rounded-xl bg-primary px-3 py-2 text-sm font-bold text-primary-foreground">💡 {concept.hook}</p> : null}
      </div>
      {near.length ? (
        <div className="rounded-2xl border-2 border-dashed border-foreground/40 p-3">
          <p className="text-eyebrow text-muted-foreground">{confused.length ? "You mixed it up with" : "Don't confuse it with"}</p>
          <ul className="mt-2 grid gap-2">
            {near.map((n) => (
              <li key={n.id} className="text-sm">
                <b>{n.term}</b>: {n.student}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <CheckButton onClick={onNext} label="Got it, ask me" />
    </div>
  );
}

/* --------------------------------------------------------------- intro */
function CoachIntro({ domain, title, state, onStart }: { domain: Domain | "all"; title: string; state: LearnState; onStart: () => void }) {
  const m = domainMastery(state.coach, domain);
  const conf = topConfusions(state.coach, 3);
  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-8">
      <div className="text-center">
        <Chai mood="happy" size={130} />
        <h1 className="text-h1">{title}</h1>
      </div>
      <div className="rounded-2xl border-2 border-foreground bg-card p-4">
        <div className="flex items-baseline justify-between">
          <p className="font-bold">How well you know it</p>
          <p className="font-pix text-sm">{m.pct}%</p>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full border-2 border-foreground">
          <div className="h-full bg-primary" style={{ width: `${m.pct}%` }} />
        </div>
        <p className="mt-2 text-caption text-muted-foreground">
          {m.seen} of {m.total} concepts started · {m.mastered} mastered
        </p>
      </div>
      {conf.length ? (
        <div className="rounded-2xl border-2 border-foreground bg-foreground p-4 text-background">
          <p className="text-eyebrow text-primary">You often mix up</p>
          <ul className="mt-2 space-y-1 text-sm font-bold">
            {conf.map((x) => (
              <li key={x.a.id + x.b.id}>
                {x.a.term} ↔ {x.b.term} <span className="opacity-70">({x.times}×)</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-caption opacity-80">These will come up today, side by side.</p>
        </div>
      ) : null}
      <button type="button" onClick={onStart} className="btn-sweep flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-foreground bg-primary text-lg font-bold text-primary-foreground hard-shadow-md">
        <GraduationCap className="size-5" aria-hidden /> Start a 10-concept session
      </button>
      <BackLink className="block text-center text-sm font-bold underline-offset-4 hover:underline">
        Back
      </BackLink>
    </div>
  );
}

/* ------------------------------------------------------------- report */
function CoachReport({ levels }: { levels: Record<string, number> }) {
  const state = useLearnState(EMPTY);
  const rows = Object.entries(levels).map(([id, before]) => ({ c: conceptById(id)!, before, after: state.coach.concepts[id]?.lvl ?? 0 }));
  const missed = rows.filter((r) => (state.coach.concepts[r.c.id]?.teach ?? false));
  const suggest = Array.from(new Map(missed.flatMap((r) => similarConcepts(r.c, 2)).map((x) => [x.id, x])).values()).slice(0, 4);
  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 pb-10">
      <h2 className="text-h2">What changed</h2>
      <ul className="grid gap-2">
        {rows.map((r) => (
          <li key={r.c.id} className="flex items-center justify-between gap-3 rounded-2xl border-2 border-foreground bg-card px-4 py-2">
            <span className="min-w-0 truncate font-bold">{r.c.term}</span>
            <span className={cn("shrink-0 font-pix text-xs", r.after > r.before ? "text-link" : "")}>
              {r.before} → {r.after}/5
            </span>
          </li>
        ))}
      </ul>
      {suggest.length ? (
        <div className="rounded-2xl border-2 border-foreground bg-brand p-4 text-brand-foreground">
          <p className="text-eyebrow">Suggested next, based on what you missed</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {suggest.map((x) => (
              <li key={x.id} className="rounded-full border-2 border-current px-3 py-1 text-sm font-bold">
                {x.term}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-caption">They&apos;ll appear in your next session automatically.</p>
        </div>
      ) : null}
      <BackLink className="flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-foreground bg-card font-bold hard-shadow-sm">
        Back <ArrowRight className="size-4" aria-hidden />
      </BackLink>
    </div>
  );
}
