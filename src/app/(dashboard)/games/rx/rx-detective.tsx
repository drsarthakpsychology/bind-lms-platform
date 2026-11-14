"use client";

import * as React from "react";
import { startHowTo } from "@/components/help/how-to";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, ClipboardList, Flame, FlaskConical, Heart, HeartCrack, Pill as PillIcon, Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LearnLink } from "@/lib/games/ui/learn-link";
import { DOSE_NOTE, pct } from "@/lib/games-sims/common";
import { costsLife, LIVES, nextStreak, pointsFor, rxXp, STEPS, type Answered, type LearnItem, type Mode, type Opt, type PublicCase, type Reveal } from "@/lib/games-sims/rx/rules";
import { AccuracyBoard, type AccuracyBoardData } from "@/lib/games-sims/ui/board";
import { Btn, buzz, ChoiceCard, Kbd, PickHeading, motionCss as m, Panel, Pill, Stat, toneFor, useHotkeys, Verdict } from "@/lib/games-sims/ui/kit";
import { ThumbBar } from "@/components/mobile/thumb-bar";
import { Journey, Receptor } from "@/components/study/animations";
import { creditServerPlay } from "@/lib/learn/credit-play";
import { HintBar, useHintStatus } from "@/components/hints/hint-chip";
import { askHint } from "@/lib/hints/actions";
import { hintedPoints } from "@/lib/hints/rules";
import { useReaction } from "@/components/reactions/use-reaction";
import { howItWorksHref } from "@/lib/meds/sections";
import { EndReaction } from "@/components/reactions/graphics";

import type { RxDeal, RxPick } from "./actions";

type Actions = {
  deal: (mode: Mode) => Promise<RxDeal>;
  pick: (x: { token: string; value: string }) => Promise<RxPick>;
  finish: (token: string) => Promise<{ ok: boolean; xp: number }>;
};
const FAIL = "That didn't load. Try again.";

const LETTERS = ["a", "b", "c", "d"];
const MODES: { id: Mode; label: string; line: string; Icon: typeof PillIcon }[] = [
  { id: "mixed", label: "Mixed", line: "All three, interleaved.", Icon: Search },
  { id: "chain", label: "Drug chains", line: "Class, how it works, side effect, checks.", Icon: PillIcon },
  { id: "mystery", label: "Side-effect mysteries", line: "Which receptor explains it?", Icon: FlaskConical },
  { id: "puzzle", label: "Dangerous mixes", line: "Two medicines together. What happens?", Icon: Plus },
  { id: "review", label: "Prescription check", line: "Spot the problem on the prescription.", Icon: ClipboardList },
];

type Run = {
  /** The signed run from the server: the browser never holds a case's answer before it is picked. */
  token: string;
  run: string;
  mode: Mode;
  cases: PublicCase[];
  idx: number;
  picks: string[];
  /** A chain's steps checked so far: right or not, and the right option. */
  steps: { ok: boolean; correct: string }[];
  /** The answer card, once the case is answered. */
  revealed: Answered | null;
  answers: { title: string; score: number }[];
  lives: number;
  streak: number;
  best: number;
  points: number;
  gained: number;
  lostLife: boolean;
  /** Hints used: question (or chain step) key → options ruled out. */
  ruled: Record<string, string[]>;
};

export function RxDetective({ board, actions }: { board: AccuracyBoardData; actions: Actions }) {
  const router = useRouter();
  const [run, setRun] = React.useState<Run | null>(null);
  const [done, setDone] = React.useState<{ run: Run; xp: number | null } | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function start(mode: Mode) {
    if (busy) return;
    startHowTo("rx-detective");
    setBusy(true);
    setError(null);
    // The server deals the run in answer history order (cases not seen yet first, then missed ones).
    const d = await actions.deal(mode).catch(() => null);
    setBusy(false);
    if (!d || !d.ok) {
      setDone(null);
      setError(d && !d.ok ? d.error : FAIL);
      return;
    }
    setDone(null);
    setRun({ token: d.token, run: d.run, mode, cases: d.cases, idx: 0, picks: [], steps: [], revealed: null, answers: [], lives: LIVES, streak: 0, best: 0, points: 0, gained: 0, lostLife: false, ruled: {} });
  }
  function end(r: Run) {
    setRun(null);
    setDone({ run: r, xp: null });
    void actions
      .finish(r.token)
      .then((x) => {
        setDone({ run: r, xp: x.ok ? x.xp : 0 });
        if (x.ok) creditServerPlay(x.xp);
      })
      .catch(() => setDone({ run: r, xp: 0 }))
      .finally(() => router.refresh());
  }

  if (done) return <Summary r={done.run} xp={done.xp} board={board} onAgain={() => void start(done.run.mode)} onModes={() => setDone(null)} />;
  if (!run) return <Intro board={board} busy={busy} error={error} onStart={(m) => void start(m)} />;
  return <Round r={run} setR={setRun} pickOnServer={actions.pick} onEnd={end} />;
}

function Intro({ board, busy, error, onStart }: { board: AccuracyBoardData; busy: boolean; error: string | null; onStart: (m: Mode) => void }) {
  useHotkeys({ "1": () => onStart("mixed"), "2": () => onStart("chain"), "3": () => onStart("mystery"), "4": () => onStart("puzzle"), "5": () => onStart("review") });
  return (
    <div className={cn("mx-auto max-w-2xl space-y-6", m.rise)}>
      <PickHeading>Pick a mode</PickHeading>
      <div className={cn("grid gap-3 sm:grid-cols-2", m.stagger)}>
        {MODES.map((x, i) => (
          <ChoiceCard key={x.id} icon={x.Icon} title={x.label} line={x.line} hotkey={String(i + 1)} suggested={i === 0} disabled={busy} className={m.rise} style={{ "--i": i } as React.CSSProperties} onClick={() => onStart(x.id)} />
        ))}
      </div>
      {error ? (
        <p className="text-small font-semibold" role="status">
          {error}
        </p>
      ) : null}
      <AccuracyBoard data={board} unit="answers" />
    </div>
  );
}

/* ----------------------------------------------------------------- round */
function Round({ r, setR, pickOnServer, onEnd }: { r: Run; setR: React.Dispatch<React.SetStateAction<Run | null>>; pickOnServer: Actions["pick"]; onEnd: (r: Run) => void }) {
  const q = r.cases[r.idx];
  const [hints, setHints] = useHintStatus();
  const reaction = useReaction();
  const [busy, setBusy] = React.useState(false);
  const [lost, setLost] = React.useState<string | null>(null);
  const at = Math.min(r.picks.length, STEPS.length - 1);
  const hintKey = q.kind === "chain" ? `${r.idx}.${at}` : `${r.idx}`;
  const gone = r.ruled[hintKey] ?? [];
  const hintedHere = Object.keys(r.ruled).some((k) => k === `${r.idx}` || k.startsWith(`${r.idx}.`));

  // One pick in flight at a time: a fast double tap must not send the same answer twice.
  const inflight = React.useRef(false);
  async function pick(value: string) {
    if (r.revealed || inflight.current) return;
    inflight.current = true;
    setBusy(true);
    const res = await pickOnServer({ token: r.token, value }).catch(() => null);
    inflight.current = false;
    setBusy(false);
    // No connection is not a wrong answer: nothing counted, try again.
    setLost(!res ? "Connection lost. Your answer was not sent. Try again." : res.ok ? null : res.error);
    if (!res || !res.ok) return;
    const picks = [...r.picks, value];
    if (res.step) {
      const step = { ok: res.step.right, correct: res.step.correct };
      buzz(step.ok);
      setR((x) => x && { ...x, token: res.token, picks, steps: [...x.steps, step] });
      return;
    }
    const a = res.answered;
    if (!a) return;
    const g = a.graded;
    buzz(g.score >= 1);
    reaction.onAnswer(g.score >= 1, { partial: (g.score > 0 && g.score < 1) || (g.score >= 1 && hintedHere) });
    const lostLife = costsLife(g.score);
    // A hint halves this question's points.
    const gained = hintedPoints(pointsFor(g.score, r.streak), hintedHere ? 1 : 0);
    const streak = nextStreak(r.streak, g.score);
    setR((x) => x && { ...x, token: res.token, picks, revealed: a, answers: [...x.answers, { title: q.title, score: g.score }], lives: x.lives - (lostLife ? 1 : 0), streak, best: Math.max(x.best, streak), points: x.points + gained, gained, lostLife });
  }
  function next() {
    if (!r.revealed) return;
    if (r.lives <= 0 || r.idx + 1 >= r.cases.length) {
      onEnd(r);
      return;
    }
    setR({ ...r, idx: r.idx + 1, picks: [], steps: [], revealed: null, lostLife: false });
  }

  const options = (q.kind === "chain" ? (q.steps[at] ?? []) : q.options.map((o) => o.id)).filter((o) => !gone.includes(o));
  const keys: Record<string, () => void> = {};
  if (!r.revealed) options.forEach((o, i) => (keys[LETTERS[i]] = () => void pick(o)));
  else {
    keys.Enter = next;
    keys[" "] = next;
  }
  useHotkeys(keys);

  const shown = r.revealed;
  const g = shown?.graded ?? null;
  const last = r.lives <= 0 || r.idx + 1 >= r.cases.length;
  const onPick = (v: string) => void pick(v);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold">
          Case {r.idx + 1}
        </span>
        <Lives n={r.lives} lost={r.lostLife} />
        <span className="ml-auto flex gap-2">
          <Stat
            label="Streak"
            value={
              <span key={r.streak} className={cn("inline-flex items-center gap-1", r.streak > 0 && !!r.revealed && m.bump)}>
                <Flame className="size-4" aria-hidden />
                {r.streak}
              </span>
            }
          />
          <Stat label="Points" value={r.points} />
        </span>
      </div>

      <div key={`${r.run}-${r.idx}`} className={m.slide}>
        {q.kind === "chain" ? <ChainCase q={q} picks={r.picks} steps={r.steps} graded={g} busy={busy} onPick={onPick} gone={gone} /> : null}
        {q.kind === "mystery" ? <MysteryCase q={q} options={options} pickVal={r.picks[0] ?? null} answer={shown?.answer ?? ""} revealed={!!shown} busy={busy} onPick={onPick} /> : null}
        {q.kind === "puzzle" ? <PuzzleCase q={q} options={options} pickVal={r.picks[0] ?? null} answer={shown?.answer ?? ""} revealed={!!shown} busy={busy} onPick={onPick} /> : null}
        {q.kind === "review" ? <ReviewCase q={q} options={options} pickVal={r.picks[0] ?? null} answer={shown?.answer ?? ""} revealed={!!shown} busy={busy} onPick={onPick} /> : null}
      </div>

      {lost ? (
        <p className="text-small font-semibold" role="status">
          {lost}
        </p>
      ) : null}

      {!r.revealed ? (
        <HintBar
          status={hints}
          onStatus={setHints}
          used={gone.length > 0}
          ask={() => askHint({ game: "rx", run: r.run, token: r.token, options: q.kind === "chain" ? (q.steps[at] ?? []) : q.options.map((o) => o.id) })}
          onGive={(h) => setR((x) => x && { ...x, ruled: { ...x.ruled, [hintKey]: h.remove } })}
        />
      ) : null}

      {g && shown ? (
        <Panel className={cn("space-y-3", g.score >= 1 ? m.pop : m.shake)} aria-live="polite">
          <Verdict score={g.score} points={r.gained}>
            {r.lostLife ? (
              <>
                <HeartCrack className="size-4" aria-hidden /> Life lost
              </>
            ) : null}
          </Verdict>
          <RevealBody v={shown.reveal} />
          {g.score < 1 ? <RxHowItWorks pages={shown.pages} /> : null}
          <RxLearn items={shown.learn} skip={g.score < 1 ? shown.pages.map((x) => x.id) : []} />
          {/* Phones: Next sits low, in thumb reach. */}
          <ThumbBar label="Next step">
            <Btn variant="primary" size="lg" className="w-full" onClick={next} autoFocus>
              {last ? "See results" : "Next case"} <ArrowRight aria-hidden /> <Kbd>Enter</Kbd>
            </Btn>
          </ThumbBar>
        </Panel>
      ) : null}
    </div>
  );
}

function Lives({ n, lost }: { n: number; lost: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5 rounded-md border-2 border-foreground bg-card px-2 py-0.5", lost && m.shake)} aria-label={`Lives: ${n} of ${LIVES}`} key={n}>
      {Array.from({ length: LIVES }, (_, i) => (i < n ? <Heart key={i} className="size-4 fill-current" aria-hidden /> : <HeartCrack key={i} className="size-4 opacity-40" aria-hidden />))}
      <span className="ml-1 text-caption font-semibold tabular-nums">{n}</span>
    </span>
  );
}

function Options({ options, label, chosen, correct, revealed, busy = false, onPick }: { options: string[]; label: (v: string) => string; chosen: string | null; correct: string; revealed: boolean; busy?: boolean; onPick: (v: string) => void }) {
  return (
    <div className="grid gap-2">
      {options.map((o, i) => {
        const isRight = revealed && o === correct;
        const isWrong = revealed && o === chosen && o !== correct;
        return (
          <Btn
            key={o}
            disabled={revealed || busy}
            onClick={() => onPick(o)}
            className={cn("h-auto justify-start py-2.5 text-left font-normal disabled:opacity-100", isRight && "bg-status-success-bg text-status-success-fg", isWrong && "bg-status-alert-bg text-status-alert-fg", revealed && !isRight && !isWrong && "opacity-60")}
          >
            <span className="font-mono text-caption font-semibold uppercase opacity-70" aria-hidden>
              {LETTERS[i]}
            </span>
            <span className="min-w-0 flex-1">{label(o)}</span>
            {isRight ? (
              <span className="inline-flex items-center gap-0.5 text-caption font-semibold">
                <Check className="size-4" aria-hidden /> Right
              </span>
            ) : null}
            {isWrong ? (
              <span className="inline-flex items-center gap-0.5 text-caption font-semibold">
                <X className="size-4" aria-hidden /> Your pick
              </span>
            ) : null}
          </Btn>
        );
      })}
    </div>
  );
}

function DrugCard({ d, className, style }: { d: { name: string; brands: string[] }; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn("rounded-xl border-2 border-foreground bg-card p-3 hard-shadow-sm", className)} style={style}>
      <p className="flex items-center gap-1.5 text-h3">
        <PillIcon className="size-5" aria-hidden /> {d.name}
      </p>
      <p className="text-caption text-muted-foreground">Sold in India as {d.brands.join(", ")}</p>
    </div>
  );
}

/* ----------------------------------------------------------------- chain */
type Q<K extends PublicCase["kind"]> = Extract<PublicCase, { kind: K }>;

function ChainCase({ q, picks, steps, graded, busy, onPick, gone = [] }: { q: Q<"chain">; picks: string[]; steps: { ok: boolean; correct: string }[]; graded: Answered["graded"] | null; busy: boolean; onPick: (v: string) => void; gone?: string[] }) {
  const revealed = !!graded;
  const at = Math.min(picks.length, STEPS.length - 1);
  return (
    <div className="space-y-3">
      <DrugCard d={q} />
      {/* The four steps as a progress track: a bar each, its name under it on one line. */}
      <ol className="grid grid-cols-4 gap-1.5" aria-label="Steps">
        {STEPS.map((s, i) => {
          const p = picks[i];
          const ok = p !== undefined && (graded ? graded.parts[i]?.ok : steps[i]?.ok) === true;
          const now = p === undefined && i === picks.length && !revealed;
          return (
            <li key={s.key} className="min-w-0" aria-current={now ? "step" : undefined}>
              <span
                aria-hidden
                className={cn(
                  "block h-2.5 rounded-full border-2",
                  p === undefined ? (now ? "border-foreground bg-brand" : "border-foreground/30 bg-card") : ok ? "border-foreground bg-primary" : "border-foreground bg-destructive",
                  p !== undefined && m.flip,
                )}
              />
              <span className={cn("mt-1 flex items-center justify-center gap-0.5 truncate text-[0.7rem] leading-tight font-semibold sm:text-caption", p === undefined && !now && "text-muted-foreground")}>
                {p !== undefined ? ok ? <Check className="size-3 shrink-0" aria-hidden /> : <X className="size-3 shrink-0" aria-hidden /> : null}
                <span className="truncate">{s.label}</span>
              </span>
              <span className="sr-only">{p === undefined ? (now ? "now" : "to do") : ok ? "right" : "not right"}</span>
            </li>
          );
        })}
      </ol>
      {picks.length > 0 && !revealed ? (
        <ul className="space-y-1">
          {picks.map((p, i) => {
            const step = steps[i];
            return (
              <li key={i} className={cn("rounded-md border-2 border-foreground/20 bg-card p-2 text-small", m.rise)}>
                <span className="font-semibold">{STEPS[i].label}: </span>
                {!step || step.ok ? (
                  p
                ) : (
                  <>
                    <span className="line-through">{p}</span> <span className="font-semibold">It is: {step.correct}</span>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}
      {!revealed ? (
        <Panel key={at} className={cn("space-y-3 bg-muted/40", m.rise)}>
          <p className="text-body-strong">{STEPS[at].ask}</p>
          <Options options={q.steps[at].filter((o) => !gone.includes(o))} label={(v) => v} chosen={null} correct="" revealed={false} busy={busy} onPick={onPick} />
        </Panel>
      ) : null}
    </div>
  );
}

/** The label shown for an option id. */
const labelOf = (opts: Opt[]) => (v: string) => opts.find((o) => o.id === v)?.label ?? v;

/* --------------------------------------------------------------- mystery */
type CaseProps<K extends PublicCase["kind"]> = { q: Q<K>; options: string[]; pickVal: string | null; answer: string; revealed: boolean; busy: boolean; onPick: (v: string) => void };

function MysteryCase({ q, options, pickVal, answer, revealed, busy, onPick }: CaseProps<"mystery">) {
  return (
    <div className="space-y-3">
      <Panel className="space-y-2">
        <p className="flex items-center gap-1.5 text-caption font-semibold uppercase">
          <FlaskConical className="size-3.5" aria-hidden /> Side-effect mystery
        </p>
        <p className="text-body-strong">{q.who}</p>
        <p className="text-body">{q.story}</p>
        <ul className={cn("flex flex-wrap gap-1.5", m.stagger)} aria-label="Clues">
          {q.clues.map((c, i) => (
            <li key={c} className={cn("rounded-full border-2 border-foreground bg-status-pending-bg px-2.5 py-0.5 text-caption font-semibold text-status-pending-fg", m.pop)} style={{ "--i": i } as React.CSSProperties}>
              {c}
            </li>
          ))}
        </ul>
        <p className="text-caption text-muted-foreground">
          On {q.drug} ({q.brand}).
        </p>
      </Panel>
      <Panel className="space-y-3 bg-muted/40">
        <p className="text-body-strong">Which action explains it?</p>
        <Options options={options} label={labelOf(q.options)} chosen={pickVal} correct={answer} revealed={revealed} busy={busy} onPick={onPick} />
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------- puzzle */
function PuzzleCase({ q, options, pickVal, answer, revealed, busy, onPick }: CaseProps<"puzzle">) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <MixCard name={q.a} brands={q.aBrands} className={m.playUp} />
        <span className={cn("grid size-11 place-items-center rounded-full border-2 border-foreground bg-primary text-primary-foreground", m.stamp)} aria-label="taken with">
          <Plus className="size-5" aria-hidden />
        </span>
        <MixCard name={q.b} brands={q.bBrands} className={m.playDown} />
      </div>
      <Panel className="space-y-1">
        <p className="text-caption font-semibold uppercase">Dangerous mix?</p>
        <p className="text-body">{q.story}</p>
      </Panel>
      <Panel className="space-y-3 bg-muted/40">
        <p className="text-body-strong">What is happening?</p>
        <Options options={options} label={labelOf(q.options)} chosen={pickVal} correct={answer} revealed={revealed} busy={busy} onPick={onPick} />
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------- review */
function ReviewCase({ q, options, pickVal, answer, revealed, busy, onPick }: CaseProps<"review">) {
  return (
    <div className="space-y-3">
      <Panel className="space-y-2">
        <p className="flex items-center gap-1.5 text-caption font-semibold uppercase">
          <ClipboardList className="size-3.5" aria-hidden /> Prescription check
        </p>
        <p className="text-body-strong">{q.who}</p>
        <p className="text-body">{q.story}</p>
      </Panel>
      <div className="rounded-xl border-2 border-foreground bg-card p-3 hard-shadow-sm">
        <p className="font-mono text-caption font-semibold uppercase">Rx</p>
        <ul className="mt-1 space-y-1 font-mono text-small" aria-label="Prescription">
          {q.rx.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
      <Panel className="space-y-3 bg-muted/40">
        <p className="text-body-strong">What is the problem?</p>
        <Options options={options} label={(v) => v} chosen={pickVal} correct={answer} revealed={revealed} busy={busy} onPick={onPick} />
      </Panel>
    </div>
  );
}

function MixCard({ name, brands, className }: { name: string; brands: string[] | null; className?: string }) {
  return (
    <div className={cn("min-w-0 rounded-xl border-2 border-foreground bg-card p-3 text-center hard-shadow-sm", className)}>
      <p className="truncate text-body-strong">{name}</p>
      {brands ? <p className="truncate text-caption text-muted-foreground">{brands.join(", ")}</p> : null}
    </div>
  );
}

/* ---------------------------------------------------------------- reveal */
/** "Learn this" for the medicine in the case: its Medicines page, or its Study module. */
function RxLearn({ items: all, skip = [] }: { items: LearnItem[]; skip?: readonly string[] }) {
  const items = all.filter((x) => !skip.includes(x.id));
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-x-4">
      {items.map((x) => (
        <LearnLink key={x.name} topic={x.name} show={items.length > 1} href={x.href} newTab />
      ))}
    </div>
  );
}

/**
 * After a wrong answer: "How olanzapine works", straight to that medicine's
 * How it works part. It opens in a new tab so the run in progress is kept.
 */
function RxHowItWorks({ pages }: { pages: { id: string; name: string }[] }) {
  if (!pages.length) return null;
  return (
    <div className="flex flex-wrap gap-x-4">
      {pages.map((p) => (
        <Link
          key={p.id}
          href={howItWorksHref(p.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-bold text-link underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          How {p.name.toLowerCase()} works <ArrowRight className="size-4 shrink-0" aria-hidden />
          <span className="sr-only"> (opens in a new tab)</span>
        </Link>
      ))}
    </div>
  );
}

function RevealBody({ v }: { v: Reveal }) {
  if (v.kind === "chain") {
    return (
      <div className="space-y-3">
        <dl className="grid gap-1.5 text-small">
          {STEPS.map((s, i) => (
            <div key={s.key} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-2">
              <dt className="font-semibold">{s.label}</dt>
              <dd>{v.values[i]}</dd>
            </div>
          ))}
        </dl>
        <DoseBox dose={v.dose} />
        <Receptor d={{ receptor: v.receptor, title: `${v.name} at ${v.receptor}`, caption: v.line }} />
      </div>
    );
  }
  if (v.kind === "mystery") {
    return (
      <div className="space-y-3">
        <p className="text-body-strong">{v.label}</p>
        <p className="text-body">{v.why}</p>
        {v.not ? <p className="text-small text-muted-foreground">{v.not}</p> : null}
        <Receptor d={{ receptor: v.receptor, title: `${v.drug}: what happens at ${v.receptor}` }} />
      </div>
    );
  }
  if (v.kind === "review") {
    return (
      <div className="space-y-3">
        <p className="text-body-strong">{v.answer}</p>
        <p className="text-body">{v.why}</p>
        <p className="text-small text-muted-foreground">{v.not}</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <p className="text-body-strong">{v.label}</p>
      <p className="text-body">{v.why}</p>
      {v.not ? <p className="text-small text-muted-foreground">{v.not}</p> : null}
      {v.journey ? <Journey d={{ ...v.journey, routes: ["oral"] }} /> : null}
      {v.receptor ? <Receptor d={{ receptor: v.receptor.receptor, caption: v.receptor.caption }} /> : null}
      {v.qt ? <QtStrip /> : null}
    </div>
  );
}

function DoseBox({ dose }: { dose: string }) {
  return (
    <div className="rounded-lg border-2 border-dashed border-foreground/50 bg-card p-3">
      <p className="text-caption font-semibold uppercase">Learning dose only</p>
      <p className="text-body-strong">{dose}</p>
      <p className="text-caption text-muted-foreground">Typical adult range. {DOSE_NOTE}</p>
    </div>
  );
}

/** A heartbeat trace: normal, then a stretched QT. The stretch grows in (transform only). */
function QtStrip() {
  const beat = "M0 40 L10 40 L14 36 L18 40 L22 40 L24 46 L27 8 L30 52 L33 40 L40 40 Q48 28 56 40 L70 40";
  return (
    <figure className="rounded-xl border-2 border-foreground bg-card p-3">
      <p className="text-caption font-semibold uppercase text-link">The QT interval, stretched</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {[
          { label: "Normal QT", scale: 1 },
          { label: "Long QT: two medicines add up", scale: 1.45 },
        ].map((x) => (
          <div key={x.label}>
            <svg viewBox="0 0 110 60" className="w-full rounded-md border-2 border-foreground bg-background" role="img" aria-label={x.label}>
              <g className={x.scale > 1 ? m.grow : undefined} style={{ transform: `scaleX(${x.scale * 0.95})`, transformOrigin: "22px 0", transformBox: "view-box" }}>
                <path d={beat} fill="none" className="stroke-foreground" strokeWidth="2" />
              </g>
              <line x1="22" x2={22 + 34 * x.scale * 0.95} y1="56" y2="56" className="stroke-[var(--destructive)]" strokeWidth="2.5" />
            </svg>
            <p className="mt-1 text-caption">{x.label}</p>
          </div>
        ))}
      </div>
      <figcaption className="mt-2 text-small text-muted-foreground">The red line runs from the start of the heart&apos;s contraction (Q) to the end of its recovery (T). When it stretches, the heart can fall into a dangerous rhythm.</figcaption>
    </figure>
  );
}

/* --------------------------------------------------------------- summary */
function Summary({ r, xp, board, onAgain, onModes }: { r: Run; xp: number | null; board: AccuracyBoardData; onAgain: () => void; onModes: () => void }) {
  useHotkeys({ Enter: onAgain });
  const scores = r.answers.map((a) => a.score);
  const acc = scores.length ? scores.reduce((a, s) => a + s, 0) / scores.length : 0;
  return (
    <div className={cn("mx-auto max-w-2xl space-y-5", m.rise)}>
      {r.lives > 0 ? null : <p className="text-eyebrow text-link">Out of lives</p>}
      <h1 className="text-h1">{acc >= 0.85 ? "Sharp detective." : acc >= 0.6 ? "Good work." : "The receptors will click with practice."}</h1>
      <EndReaction right={Math.round(acc * 100)} total={100} seed={r.run} />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Accuracy" value={`${pct(acc)}%`} />
        <Stat label="Points" value={r.points} />
        <Stat label="Best streak" value={r.best} />
        <Stat label="XP earned" value={xp === null ? "…" : `+${xp || 0}`} />
      </div>
      {xp === 0 ? <p className="text-caption text-muted-foreground">XP couldn&apos;t be saved this time (it would have been {rxXp(scores)}).</p> : null}
      <ol className={cn("space-y-1", m.stagger)}>
        {r.answers.map((a, i) => (
          <li key={i} className={cn("flex items-center justify-between gap-2 rounded-md border-2 border-foreground/20 px-3 py-2", m.rise)} style={{ "--i": i } as React.CSSProperties}>
            <span className="min-w-0 truncate">{a.title}</span>
            <Pill tone={toneFor(scores[i])}>{pct(scores[i])}%</Pill>
          </li>
        ))}
      </ol>
      <div className="grid gap-2 sm:grid-cols-2">
        <Btn variant="primary" size="lg" onClick={onAgain}>
          Play again <Kbd>Enter</Kbd>
        </Btn>
        <Btn size="lg" onClick={onModes}>
          Change mode
        </Btn>
      </div>
      <AccuracyBoard data={board} unit="answers" />
    </div>
  );
}
