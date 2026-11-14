"use client";

import * as React from "react";
import { HowToButton, startHowTo } from "@/components/help/how-to";
import { ArrowLeft, ArrowRight, Check, Circle, Clock, Eraser, Flag, LayoutGrid, Send, TriangleAlert, X } from "lucide-react";
import { CELL_LABEL, WARN_MS, cellState, clock, clockWords, step, type CellState } from "@/lib/prep/exam";
import type { MockResultView } from "@/lib/prep/results";
import { cn } from "@/lib/utils";
import { startMock, submitMock, type MockPaperView } from "../actions";
import { KEYS_MOCK, KeysHint, Options, QuestionBody, useShortcuts } from "../question";
import { btnInk, btnPlain, btnPrimary, card } from "../ui";
import { MockResult } from "./result";
import { ThumbBar } from "@/components/mobile/thumb-bar";
import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";

type Phase = "intro" | "starting" | "exam" | "confirm" | "submitting" | "result";

const CELL_TONE: Record<CellState, string> = {
  answered: "bg-status-success-bg text-status-success-fg",
  "answered-marked": "bg-status-pending-bg text-status-pending-fg",
  marked: "bg-status-pending-bg text-status-pending-fg",
  "not-answered": "bg-status-alert-bg text-status-alert-fg",
  "not-visited": "border-dashed bg-card text-muted-foreground",
};

function CellIcon({ state, className }: { state: CellState; className?: string }) {
  const c = cn("size-3.5 shrink-0", className);
  if (state === "answered") return <Check className={c} aria-hidden />;
  if (state === "answered-marked")
    return (
      <span className="inline-flex" aria-hidden>
        <Flag className={c} />
        <Check className={c} />
      </span>
    );
  if (state === "marked") return <Flag className={c} aria-hidden />;
  if (state === "not-answered") return <X className={c} aria-hidden />;
  return <Circle className={c} aria-hidden />;
}

/**
 * The timed mock: intro → exam (timer, sections, palette, mark for review,
 * auto-submit at time-up) → results. Answers stay in the browser until
 * submit; scoring happens on the server.
 */
export function MockExam({ specId, title, intro, rules }: { specId: string; title: string; intro: React.ReactNode; /** The pattern and marking, for the how-to button during the paper. */ rules?: React.ReactNode }) {
  const [phase, setPhase] = React.useState<Phase>("intro");
  const [paper, setPaper] = React.useState<MockPaperView | null>(null);
  const [sec, setSec] = React.useState(0);
  const [pos, setPos] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, number | null>>({});
  const [marked, setMarked] = React.useState<Record<string, boolean>>({});
  const [visited, setVisited] = React.useState<Record<string, boolean>>({});
  const [now, setNow] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [auto, setAuto] = React.useState(false);
  const [result, setResult] = React.useState<MockResultView | null>(null);
  const [paletteOpen, setPaletteOpen] = React.useState(false);

  const offset = React.useRef(0);
  const times = React.useRef<Record<string, number>>({});
  const active = React.useRef<{ id: string; since: number } | null>(null);
  const sending = React.useRef(false);
  const heading = React.useRef<HTMLHeadingElement>(null);
  const autoTried = React.useRef(false);
  const submitRef = React.useRef<(auto: boolean) => void>(() => undefined);

  const sections = paper?.sections ?? [];
  const sizes = sections.map((s) => s.questions.length);
  const q = sections[sec]?.questions[pos];
  const all = sections.flatMap((s) => s.questions);
  const left = paper ? paper.deadline - now : 0;
  const counts = { answered: 0, marked: 0, notAnswered: 0, notVisited: 0 };
  for (const x of all) {
    const st = cellState(answers[x.id] != null, !!marked[x.id], !!visited[x.id]);
    if (st === "answered" || st === "answered-marked") counts.answered++;
    if (st === "marked" || st === "answered-marked") counts.marked++;
    if (st === "not-answered") counts.notAnswered++;
    if (st === "not-visited") counts.notVisited++;
  }

  /* ---------------------------------------------------------- time */

  function track(nextId: string | null) {
    const t = performance.now();
    const a = active.current;
    if (a) times.current[a.id] = (times.current[a.id] ?? 0) + (t - a.since);
    active.current = nextId ? { id: nextId, since: t } : null;
  }

  React.useEffect(() => {
    if (phase !== "exam" && phase !== "confirm") return;
    const timer = setInterval(() => {
      const t = Date.now() + offset.current;
      setNow(t);
      // Auto-submit once at time-up; if that fails, the student can press Try again.
      if (paper && t >= paper.deadline && !autoTried.current) {
        autoTried.current = true;
        submitRef.current(true);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, paper]);

  // Leaving mid-exam asks first (the browser shows its own message).
  React.useEffect(() => {
    if (phase !== "exam" && phase !== "confirm") return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [phase]);

  React.useEffect(() => {
    if (phase === "exam") heading.current?.focus({ preventScroll: true });
  }, [sec, pos, phase]);

  /* ---------------------------------------------------- start / end */

  async function begin() {
    startHowTo("prep-mock");
    setPhase("starting");
    setError(null);
    try {
      const r = await startMock(specId);
      if ("error" in r) {
        setError(r.error);
        setPhase("intro");
        return;
      }
      offset.current = r.serverNow - Date.now();
      setNow(r.serverNow);
      setPaper(r);
      const firstSec = Math.max(0, r.sections.findIndex((s) => s.questions.length));
      const first = r.sections[firstSec]?.questions[0];
      setSec(firstSec);
      setPos(0);
      if (first) {
        setVisited({ [first.id]: true });
        track(first.id);
      }
      setPhase("exam");
    } catch {
      setError("Couldn't start the mock. Check your connection and try again.");
      setPhase("intro");
    }
  }

  async function submit(isAuto: boolean) {
    if (!paper || sending.current) return;
    sending.current = true;
    track(null);
    setAuto(isAuto);
    setPhase("submitting");
    setError(null);
    try {
      const r = await submitMock({
        specId: paper.specId,
        attemptId: paper.attemptId,
        sections: paper.sections.map((s) => ({ title: s.title, ids: s.questions.map((x) => x.id) })),
        answers,
        marked: Object.keys(marked).filter((k) => marked[k]),
        times: Object.fromEntries(Object.entries(times.current).map(([k, v]) => [k, Math.round(v)])),
      });
      if ("error" in r) throw new Error(r.error);
      setResult(r);
      setPhase("result");
      window.scrollTo({ top: 0 });
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "Couldn't submit. Your answers are still here.");
      setPhase("confirm");
      sending.current = false;
    }
  }

  React.useEffect(() => {
    submitRef.current = (isAuto: boolean) => void submit(isAuto);
  });

  /* ------------------------------------------------------ moving */

  function go(s: number, p: number) {
    const target = sections[s]?.questions[p];
    if (!target) return;
    track(target.id);
    setSec(s);
    setPos(p);
    setVisited((v) => (v[target.id] ? v : { ...v, [target.id]: true }));
    setPaletteOpen(false);
  }
  const move = (dir: 1 | -1) => {
    const [s, p] = step(sizes, sec, pos, dir);
    go(s, p);
  };
  const pick = (i: number) => {
    startHowTo(KEYS_MOCK);
    if (q) setAnswers((a) => ({ ...a, [q.id]: i }));
  };
  const clear = () => q && setAnswers((a) => ({ ...a, [q.id]: null }));
  const toggleMark = () => q && setMarked((m) => ({ ...m, [q.id]: !m[q.id] }));

  useShortcuts({
    pick: (i) => phase === "exam" && pick(i),
    next: () => phase === "exam" && move(1),
    mark: () => phase === "exam" && toggleMark(),
  });

  /* ------------------------------------------------------- screens */

  if (phase === "result" && result) return <MockResult view={result} />;

  if (phase === "intro" || phase === "starting") {
    return (
      <div className="space-y-5">
        {intro}
        {error ? (
          <p role="alert" className="flex items-center gap-2 rounded-md border-2 border-foreground bg-status-alert-bg p-3 text-sm font-semibold text-status-alert-fg">
            <TriangleAlert className="size-4 shrink-0" aria-hidden /> {error}
          </p>
        ) : null}
        <button type="button" className={cn(btnPrimary, "w-full text-base")} disabled={phase === "starting"} onClick={() => void begin()}>
          {phase === "starting" ? "Preparing your paper…" : "Start the mock"} <ArrowRight className="size-4" aria-hidden />
        </button>
        <p className="text-center text-caption text-muted-foreground">The timer starts when you press Start. It submits on its own when time is up.</p>
      </div>
    );
  }

  if (!paper || !q) return null;
  const warn = left <= WARN_MS;
  const wanted = sections.reduce((a, s) => a + s.wanted, 0);
  const num = sizes.slice(0, sec).reduce((a, b) => a + b, 0) + pos + 1;

  const palette = (
    <nav aria-label="Question palette" className="space-y-4">
      {sections.map((s, si) =>
        s.questions.length ? (
          <div key={s.title} className="space-y-2">
            {sections.length > 1 ? <p className="text-sm font-semibold">{s.title}</p> : null}
            <ol className="grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-1.5">
              {s.questions.map((x, pi) => {
                const st = cellState(answers[x.id] != null, !!marked[x.id], !!visited[x.id]);
                const n = sizes.slice(0, si).reduce((a, b) => a + b, 0) + pi + 1;
                const here = si === sec && pi === pos;
                return (
                  <li key={x.id}>
                    <button
                      type="button"
                      onClick={() => go(si, pi)}
                      aria-current={here ? "step" : undefined}
                      aria-label={`Question ${n}: ${CELL_LABEL[st]}`}
                      className={cn(
                        "flex h-11 w-full flex-col items-center justify-center rounded-md border-2 border-foreground text-xs font-bold leading-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60",
                        CELL_TONE[st],
                        here && "ring-[3px] ring-foreground ring-offset-1 ring-offset-background",
                      )}
                    >
                      <span>{n}</span>
                      <CellIcon state={st} className="mt-0.5 size-3" />
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        ) : null,
      )}
      <ul className="grid gap-1 border-t-2 border-dashed border-foreground/40 pt-3 text-xs">
        {(
          [
            ["answered", counts.answered],
            ["marked", counts.marked],
            ["not-answered", counts.notAnswered],
            ["not-visited", counts.notVisited],
          ] as [CellState, number][]
        ).map(([st, n]) => (
          <li key={st} className="flex items-center gap-2">
            <span className={cn("grid size-6 place-items-center rounded-md border-2 border-foreground", CELL_TONE[st])}>
              <CellIcon state={st} />
            </span>
            {CELL_LABEL[st]}: <strong className="font-semibold">{n}</strong>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <div className="space-y-4">
      {/* Top bar: title, clock, palette (phones), submit */}
      <div className="sticky top-0 z-20 -mx-4 flex flex-wrap items-center gap-2 border-b-2 border-foreground bg-background px-4 py-2 sm:-mx-6 sm:px-6 md:top-[var(--top-h)]">
        <p className="hidden min-w-0 flex-1 truncate text-sm font-semibold sm:block">{title}</p>
        <p
          className={cn("mr-auto inline-flex sm:mr-0 min-h-11 items-center gap-1.5 rounded-md border-2 border-foreground px-3 font-mono text-base font-bold tabular-nums", warn ? "bg-status-alert-bg text-status-alert-fg" : "bg-card")}
          role="timer"
          aria-label={clockWords(left)}
        >
          {warn ? <TriangleAlert className="size-4" aria-hidden /> : <Clock className="size-4" aria-hidden />}
          {clock(left)}
          {warn ? <span className="font-sans text-xs font-semibold">left</span> : null}
        </p>
        {rules ? (
          <HowToButton id="prep-mock" label="How it works" intro="The clock keeps running.">
            {rules}
          </HowToButton>
        ) : null}
        <button type="button" className={cn(btnPlain, "px-3 lg:hidden")} aria-label="All questions" aria-haspopup="dialog" onClick={() => setPaletteOpen(true)}>
          <LayoutGrid className="size-4" aria-hidden /> <span className="hidden sm:inline">All</span>
        </button>
        <button type="button" className={cn(btnInk, "px-3 sm:px-4")} onClick={() => setPhase("confirm")} disabled={phase === "submitting"}>
          <Send className="hidden size-4 sm:block" aria-hidden /> Submit
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {Math.ceil(left / 60000) === 5 ? "5 minutes left" : Math.ceil(left / 60000) === 1 ? "1 minute left" : ""}
      </p>

      {/* Phones and tablets: every question in a bottom sheet, not pushed into the page. */}
      <MobileBottomSheet open={paletteOpen} onOpenChange={setPaletteOpen} title="All questions" className="lg:hidden">
        <div id="palette-phone">{palette}</div>
      </MobileBottomSheet>

      {sections.length > 1 ? (
        <div role="tablist" aria-label="Parts" className="-mx-4 chip-scroller gap-2 px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {sections.map((s, si) => {
            const done = s.questions.filter((x) => answers[x.id] != null).length;
            return (
              <button
                key={s.title}
                type="button"
                role="tab"
                aria-selected={si === sec}
                disabled={!s.questions.length}
                onClick={() => go(si, 0)}
                className={cn(btnPlain, "min-h-11 px-3", si === sec && "bg-brand text-brand-foreground")}
              >
                {s.title} <span className="font-mono text-xs">{done}/{s.questions.length}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      {wanted > all.length ? (
        <p className="rounded-md border-2 border-dashed border-foreground/50 p-3 text-sm text-muted-foreground">
          This mock has {all.length} of {wanted} questions while the bank fills. Your score is out of what&apos;s here.
        </p>
      ) : null}

      {phase === "confirm" || phase === "submitting" ? (
        <section aria-labelledby="confirm-h" className={cn(card, "space-y-4 hard-shadow-md")}>
          <h2 id="confirm-h" className="text-h2">
            {phase === "submitting" ? (auto ? "Time's up. Submitting…" : "Submitting…") : "Submit your paper?"}
          </h2>
          <ul className="grid gap-1.5 text-sm sm:grid-cols-3">
            <li className="flex items-center gap-2">
              <Check className="size-4" aria-hidden /> Answered: <strong>{counts.answered}</strong>
            </li>
            <li className="flex items-center gap-2">
              <X className="size-4" aria-hidden /> Not answered: <strong>{counts.notAnswered + counts.notVisited}</strong>
            </li>
            <li className="flex items-center gap-2">
              <Flag className="size-4" aria-hidden /> Marked: <strong>{counts.marked}</strong>
            </li>
          </ul>
          {error ? (
            <p role="alert" className="flex items-center gap-2 rounded-md border-2 border-foreground bg-status-alert-bg p-3 text-sm font-semibold text-status-alert-fg">
              <TriangleAlert className="size-4 shrink-0" aria-hidden /> {error}
            </p>
          ) : null}
          {phase === "confirm" ? (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {left > 0 ? (
                <button type="button" className={btnPlain} onClick={() => setPhase("exam")}>
                  <ArrowLeft className="size-4" aria-hidden /> Back to the paper
                </button>
              ) : null}
              <button type="button" className={btnPrimary} onClick={() => void submit(false)}>
                <Send className="size-4" aria-hidden /> {error ? "Try again" : "Submit now"}
              </button>
            </div>
          ) : null}
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-semibold">
                Question {num} of {all.length}
                {sections.length > 1 ? <span className="text-muted-foreground"> · {sections[sec].title}</span> : null}
              </span>
              <KeysHint mark />
            </div>
            <QuestionBody key={q.id} q={q} number={num} headingRef={heading} />
            <Options q={q} picked={answers[q.id] ?? null} onPick={pick} />
            {/* Phones: Clear sits under the answers; Back, Mark and Next sit low (ThumbBar). */}
            {answers[q.id] != null ? (
              <button type="button" className="inline-flex min-h-11 items-center gap-1.5 px-1 text-sm font-semibold text-muted-foreground hover:text-foreground hover:underline md:hidden" onClick={clear}>
                <Eraser className="size-4" aria-hidden /> Clear my answer
              </button>
            ) : null}
            <ThumbBar label="Move through the paper" inlineClassName="md:grid md:grid-cols-4 md:gap-2">
              <button type="button" className={cn(btnPlain, "min-h-12 shrink-0 px-3")} onClick={() => move(-1)} aria-label="Back">
                <ArrowLeft className="size-4" aria-hidden /> <span className="hidden md:inline">Back</span>
              </button>
              <button type="button" className={cn(btnPlain, "hidden md:inline-flex")} onClick={clear} disabled={answers[q.id] == null}>
                <Eraser className="size-4" aria-hidden /> Clear
              </button>
              <button type="button" className={cn(btnPlain, "min-h-12 shrink-0 px-3", marked[q.id] && "bg-status-pending-bg text-status-pending-fg")} aria-pressed={!!marked[q.id]} onClick={toggleMark}>
                <Flag className="size-4" aria-hidden /> {marked[q.id] ? "Marked" : "Mark"}
              </button>
              <button type="button" className={cn(btnPrimary, "min-h-12 min-w-0 flex-1 text-base md:text-sm")} onClick={() => move(1)}>
                Next <ArrowRight className="size-4" aria-hidden />
              </button>
            </ThumbBar>
          </div>
          <aside className={cn(card, "hidden self-start lg:sticky lg:top-20 lg:block lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto")}>{palette}</aside>
        </div>
      )}
    </div>
  );
}
