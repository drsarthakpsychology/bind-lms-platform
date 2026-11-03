"use client";

import * as React from "react";
import { curveRegions, digitSequence, parseRecall, recalledPositions, serialCurve, shuffle, spanCorrect, spanFromTrials, spanShouldStop, WORD_POOL } from "@/lib/lab/scoring";
import { Bars, LabButton, LineChart, Panel, RoundBar, useTimers, type RunnerProps } from "../lab-ui";

/* ------------------------------------------------------------------ */
/* Digit span                                                          */
/* ------------------------------------------------------------------ */

type SpanTrial = { length: number; correct: boolean };
const SPAN_MAX = 10;

export function DigitSpanRunner({ onDone }: RunnerProps) {
  const later = useTimers();
  const [dir, setDir] = React.useState<"forward" | "backward">("forward");
  const [phase, setPhase] = React.useState<"intro" | "show" | "answer" | "feedback">("intro");
  const [length, setLength] = React.useState(3);
  const [seq, setSeq] = React.useState<number[]>([]);
  const [shown, setShown] = React.useState<number | null>(null);
  const [typed, setTyped] = React.useState("");
  const [trials, setTrials] = React.useState<SpanTrial[]>([]);
  const [forwardSpan, setForwardSpan] = React.useState(0);
  const [last, setLast] = React.useState<boolean | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const play = React.useCallback(
    (len: number) => {
      const s = digitSequence(len);
      setSeq(s);
      setTyped("");
      setPhase("show");
      s.forEach((d, i) => {
        later(() => setShown(d), 600 + i * 1000);
        later(() => setShown(null), 600 + i * 1000 + 750);
      });
      later(() => {
        setPhase("answer");
        window.setTimeout(() => inputRef.current?.focus(), 0);
      }, 600 + s.length * 1000);
    },
    [later],
  );

  function finishDirection(all: SpanTrial[]) {
    const span = spanFromTrials(all);
    if (dir === "forward") {
      setForwardSpan(span);
      setDir("backward");
      setTrials([]);
      setLength(2);
      setPhase("intro");
      return;
    }
    const fwd = forwardSpan;
    onDone({
      numbers: { forward: fwd, backward: span },
      verdict:
        fwd >= 5 && fwd <= 8
          ? `Your forward span of ${fwd} is in the usual adult range. ${span < fwd ? `Backwards was ${fwd - span} shorter, which is the classic pattern.` : "Backwards matched it, which is less common: did you use a strategy?"}`
          : fwd < 5
            ? `Your forward span of ${fwd} is below the usual range. On a phone, with distractions, that is common. Try again somewhere quiet before reading anything into it.`
            : `A forward span of ${fwd} is above the usual range. Chunking (grouping digits) is the usual reason.`,
      view: <Bars ariaLabel="Your digit span" items={[{ label: "Forwards", value: fwd, highlight: true }, { label: "Backwards", value: span }, { label: "Typical adult", value: 7 }]} />,
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (phase !== "answer") return;
    const ok = spanCorrect(seq, typed, dir === "backward");
    const all = [...trials, { length, correct: ok }];
    setTrials(all);
    setLast(ok);
    setPhase("feedback");
    const atLen = all.filter((t) => t.length === length);
    later(() => {
      if (spanShouldStop(all, length) || (length >= SPAN_MAX && atLen.length >= 2)) return finishDirection(all);
      // Two tries per length; pass either to move up.
      const next = atLen.length >= 2 ? length + 1 : length;
      setLength(next);
      play(next);
    }, 900);
  }

  return (
    <Panel className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="rounded-full border-2 border-foreground bg-background px-3 py-1 text-sm font-bold">{dir === "forward" ? "Part 1 · Forwards" : "Part 2 · Backwards"}</p>
        <p className="text-sm font-semibold tabular-nums text-muted-foreground">{phase === "intro" ? "" : `${length} digits`}</p>
      </div>

      {phase === "intro" && (
        <div className="space-y-4">
          <p className="text-lg font-semibold">
            {dir === "forward" ? "Digits appear one at a time. Type them back in the same order." : "Now type them back in REVERSE order. 4 7 2 becomes 2 7 4."}
          </p>
          <p className="text-sm text-muted-foreground">Do not write them down. Somewhere quiet works best.</p>
          <LabButton onClick={() => play(length)}>Start</LabButton>
        </div>
      )}

      {phase === "show" && (
        <div className="grid h-40 place-items-center rounded-xl border-2 border-dashed border-foreground/40" aria-live="assertive" aria-atomic>
          <span className="text-7xl font-bold tabular-nums">{shown ?? ""}</span>
        </div>
      )}

      {(phase === "answer" || phase === "feedback") && (
        <form onSubmit={submit} className="space-y-3">
          <label htmlFor="span-input" className="block font-semibold">
            {dir === "forward" ? "Type the digits in order" : "Type the digits backwards"}
          </label>
          <input
            id="span-input"
            ref={inputRef}
            inputMode="numeric"
            autoComplete="off"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={phase === "feedback"}
            className="w-full rounded-md border-2 border-foreground bg-background px-4 py-3 text-2xl font-bold tracking-[0.3em] tabular-nums"
          />
          {phase === "feedback" ? (
            <p className="font-bold" role="status">
              {last ? "Correct" : `Not quite. It was ${(dir === "backward" ? [...seq].reverse() : seq).join(" ")}`}
            </p>
          ) : (
            <LabButton type="submit" disabled={!typed.trim()}>
              Check
            </LabButton>
          )}
        </form>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Serial position                                                     */
/* ------------------------------------------------------------------ */

const LISTS = 3;
const LIST_LEN = 12;

export function SerialPositionRunner({ onDone }: RunnerProps) {
  const later = useTimers();
  const lists = React.useMemo(() => {
    const words = shuffle(WORD_POOL);
    return Array.from({ length: LISTS }, (_, i) => words.slice(i * LIST_LEN, (i + 1) * LIST_LEN));
  }, []);
  const [li, setLi] = React.useState(0);
  const [phase, setPhase] = React.useState<"intro" | "show" | "recall" | "between">("intro");
  const [word, setWord] = React.useState<string | null>(null);
  const [text, setText] = React.useState("");
  const [trials, setTrials] = React.useState<boolean[][]>([]);
  const areaRef = React.useRef<HTMLTextAreaElement>(null);

  function show() {
    setPhase("show");
    setText("");
    lists[li].forEach((w, i) => {
      later(() => setWord(w), 500 + i * 1300);
      later(() => setWord(null), 500 + i * 1300 + 1000);
    });
    later(() => {
      setPhase("recall");
      window.setTimeout(() => areaRef.current?.focus(), 0);
    }, 500 + LIST_LEN * 1300);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const hit = recalledPositions(lists[li], parseRecall(text));
    const all = [...trials, hit];
    setTrials(all);
    if (all.length >= LISTS) {
      const curve = serialCurve(all);
      const r = curveRegions(curve);
      const pct = (v: number) => Math.round(v * 100);
      const u = r.primacy > r.middle && r.recency > r.middle;
      onDone({
        numbers: { primacy: pct(r.primacy), middle: pct(r.middle), recency: pct(r.recency) },
        verdict: u
          ? `Your curve is U-shaped: ${pct(r.primacy)}% at the start, ${pct(r.middle)}% in the middle and ${pct(r.recency)}% at the end. That is the classic pattern.`
          : `Your curve is not the classic U (start ${pct(r.primacy)}%, middle ${pct(r.middle)}%, end ${pct(r.recency)}%). With only three lists, one strategy (like a story) can change the shape. That is worth noticing.`,
        view: <LineChart ariaLabel="Your recall by list position" series={[{ name: "You", values: curve }]} labels={curve.map((_, i) => String(i + 1))} max={1} yLabel="share of lists you recalled the word" xLabel="position in the list" />,
      });
      return;
    }
    setLi(li + 1);
    setPhase("between");
  }

  return (
    <Panel className="space-y-5">
      <RoundBar at={li + 1} of={LISTS} label="List" />
      {phase === "intro" && (
        <div className="space-y-4">
          <p className="text-lg font-semibold">12 words will appear, one at a time. Then type every word you remember, in any order.</p>
          <LabButton onClick={show}>Show list 1</LabButton>
        </div>
      )}
      {phase === "show" && (
        <div className="grid h-40 place-items-center rounded-xl border-2 border-dashed border-foreground/40" aria-live="assertive" aria-atomic>
          <span className="text-5xl font-bold">{word ?? ""}</span>
        </div>
      )}
      {phase === "recall" && (
        <form onSubmit={submit} className="space-y-3">
          <label htmlFor="recall" className="block font-semibold">
            Type every word you remember
          </label>
          <textarea
            id="recall"
            ref={areaRef}
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoCapitalize="none"
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-md border-2 border-foreground bg-background p-3 text-lg"
            placeholder="One per line, or separated by commas"
          />
          <LabButton type="submit">Done</LabButton>
        </form>
      )}
      {phase === "between" && (
        <div className="space-y-4">
          <p className="font-semibold" role="status">
            You got {trials[trials.length - 1].filter(Boolean).length} of {LIST_LEN}. Next list.
          </p>
          <LabButton onClick={show}>Show list {li + 1}</LabButton>
        </div>
      )}
    </Panel>
  );
}
