"use client";

import * as React from "react";
import { cowanK, illusionBias, mean, seeded, shuffle, STROOP_COLOURS, stroopEffect, stroopTrials, type ChangeTrial, type StroopResponse } from "@/lib/lab/scoring";
import { Bars, LabButton, LineChart, Panel, RoundBar, useTimers, type RunnerProps } from "../lab-ui";

/* ------------------------------------------------------------------ */
/* Stroop                                                              */
/* ------------------------------------------------------------------ */

const STROOP_N = 40;
const PRACTICE = 4;

export function StroopRunner({ onDone }: RunnerProps) {
  const later = useTimers();
  const [trials, setTrials] = React.useState<ReturnType<typeof stroopTrials>>([]);
  const [i, setI] = React.useState(-1);
  const [visible, setVisible] = React.useState(false);
  const [flash, setFlash] = React.useState<"right" | "wrong" | null>(null);
  const shownAt = React.useRef(0);
  const responses = React.useRef<StroopResponse[]>([]);

  const next = React.useCallback(
    (to: number) => {
      setVisible(false);
      setI(to);
      later(() => {
        shownAt.current = performance.now();
        setVisible(true);
      }, 450);
    },
    [later],
  );

  const answer = React.useCallback(
    (name: string) => {
      if (!visible || i < 0) return;
      const rt = performance.now() - shownAt.current;
      const t = trials[i];
      if (i >= PRACTICE) responses.current.push({ ...t, answer: name, rt });
      setFlash(name === t.ink ? "right" : "wrong");
      later(() => setFlash(null), 250);
      if (i + 1 >= trials.length) {
        const e = stroopEffect(responses.current);
        onDone({
          numbers: { congruent: e.congruentMs, incongruent: e.incongruentMs, effect: e.effectMs, errors: e.incongruentErrors },
          verdict: !e.usable
            ? "Too many missed or very fast answers to measure an effect. Try again when you can focus for two minutes."
            : e.effectMs > 30
              ? `You were ${e.effectMs} ms slower when the word and ink disagreed${e.incongruentErrors > e.congruentErrors ? ", and made more mistakes" : ""}. That is the Stroop effect: reading got in the way.`
              : `Your gap was small (${e.effectMs} ms). That happens with practice, or if you blurred your eyes so you could not read the word. Did you?`,
          view: (
            <Bars
              ariaLabel="Your typical reaction times"
              unit=" ms"
              items={[
                { label: "Match", value: e.congruentMs },
                { label: "Clash", value: e.incongruentMs, highlight: true },
              ]}
            />
          ),
        });
        return;
      }
      next(i + 1);
    },
    [visible, i, trials, later, next, onDone],
  );

  React.useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      const c = STROOP_COLOURS.find((c) => c.key === ev.key.toLowerCase());
      if (c) answer(c.name);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer]);

  if (i < 0)
    return (
      <Panel className="space-y-4">
        <p className="text-lg font-semibold">Press the button for the INK colour. Ignore what the word says.</p>
        <p className="text-sm text-muted-foreground">
          Keyboard: {STROOP_COLOURS.map((c) => `${c.key.toUpperCase()} = ${c.name}`).join(", ")}. The first {PRACTICE} are practice. About two minutes.
        </p>
        <LabButton
          onClick={() => {
            setTrials(stroopTrials(STROOP_N + PRACTICE));
            next(0);
          }}
        >
          Start
        </LabButton>
      </Panel>
    );

  const t = trials[i];
  const ink = STROOP_COLOURS.find((c) => c.name === t.ink)!;
  return (
    <Panel className="space-y-5">
      {i < PRACTICE ? <p className="text-sm font-bold text-link">Practice {i + 1} of {PRACTICE}</p> : <RoundBar at={i - PRACTICE + 1} of={STROOP_N} />}
      <div className="relative grid h-40 place-items-center rounded-xl border-2 border-foreground bg-white" aria-live="off">
        {visible ? (
          <span className="text-6xl font-black uppercase tracking-wide" style={{ color: ink.css }}>
            {t.word}
          </span>
        ) : (
          <span className="text-4xl font-bold text-neutral-400" aria-hidden>
            +
          </span>
        )}
        {flash && <span className="sr-only">{flash === "right" ? "Correct" : "Wrong"}</span>}
        {flash === "wrong" && <span className="absolute right-3 top-2 text-sm font-bold text-[#b00020]">✕</span>}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STROOP_COLOURS.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => answer(c.name)}
            className="flex min-h-14 items-center gap-2 rounded-xl border-2 border-foreground bg-card px-3 font-bold capitalize transition-transform active:translate-y-px"
          >
            <span className="size-6 shrink-0 rounded-md border-2 border-foreground" style={{ background: c.css }} aria-hidden />
            {c.name}
            <kbd className="ml-auto hidden font-mono text-xs text-muted-foreground sm:inline">{c.key.toUpperCase()}</kbd>
          </button>
        ))}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Change detection                                                    */
/* ------------------------------------------------------------------ */

const CD_COLOURS = ["#d32f2f", "#1976d2", "#388e3c", "#fbc02d", "#7b1fa2", "#f57c00", "#212121", "#00acc1"];
const SIZES = [2, 4, 6, 8];
const PER_SIZE = 6;
const GRID = { cols: 6, rows: 4 };

type Display = { cells: number[]; colours: string[]; changed: boolean; changeAt: number; newColour: string; setSize: number };

function makeDisplays(rand: () => number): Display[] {
  const out: Display[] = [];
  for (const n of SIZES)
    for (let k = 0; k < PER_SIZE; k++) {
      const cells = shuffle(Array.from({ length: GRID.cols * GRID.rows }, (_, i) => i), rand).slice(0, n);
      const colours = shuffle(CD_COLOURS, rand).slice(0, n);
      const changeAt = Math.floor(rand() * n);
      const unused = CD_COLOURS.filter((c) => !colours.includes(c));
      out.push({ cells, colours, changed: k % 2 === 0, changeAt, newColour: unused[Math.floor(rand() * unused.length)], setSize: n });
    }
  return shuffle(out, rand);
}

export function ChangeDetectionRunner({ onDone }: RunnerProps) {
  const later = useTimers();
  const [displays, setDisplays] = React.useState<Display[]>([]);
  const [i, setI] = React.useState(-1);
  const [phase, setPhase] = React.useState<"study" | "blank" | "test">("study");
  const log = React.useRef<ChangeTrial[]>([]);

  const run = React.useCallback(
    (to: number) => {
      setI(to);
      setPhase("study");
      later(() => setPhase("blank"), 500);
      later(() => setPhase("test"), 1400);
    },
    [later],
  );

  const respond = React.useCallback(
    (said: boolean) => {
      if (phase !== "test" || i < 0) return;
      const d = displays[i];
      log.current.push({ setSize: d.setSize, changed: d.changed, saidChanged: said });
      if (i + 1 >= displays.length) {
        const ks = cowanK(log.current);
        const best = Math.max(...ks.map((k) => k.k));
        onDone({
          numbers: { k: best, ...Object.fromEntries(ks.map((k) => [`k${k.setSize}`, k.k])) },
          verdict:
            best >= 2.5 && best <= 4.5
              ? `Your best estimate is about ${best} squares, right in the classic 3 to 4 range.`
              : best < 2.5
                ? `Your estimate is ${best}. With only ${PER_SIZE} trials per size the number is rough; guessing or a lapse of focus pulls it down.`
                : `Your estimate is ${best}, above the usual 3 to 4. Some people use clever strategies, like naming colours by location.`,
          view: (
            <div className="space-y-3">
              <LineChart ariaLabel="Estimated squares held, by display size" series={[{ name: "You", values: ks.map((k) => k.k) }]} labels={ks.map((k) => String(k.setSize))} max={8} yLabel="squares held (K)" xLabel="squares on screen" />
              <p className="text-xs text-muted-foreground">If K kept rising with display size, you held everything. Where it flattens is your limit.</p>
            </div>
          ),
        });
        return;
      }
      run(i + 1);
    },
    [phase, i, displays, run, onDone],
  );

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "s") respond(false);
      if (e.key.toLowerCase() === "d") respond(true);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [respond]);

  if (i < 0)
    return (
      <Panel className="space-y-4">
        <p className="text-lg font-semibold">Coloured squares flash for half a second. When they come back, did one square change colour?</p>
        <p className="text-sm text-muted-foreground">Half the time nothing changes. Keyboard: S = same, D = different. {SIZES.length * PER_SIZE} rounds, about 3 minutes.</p>
        <LabButton
          onClick={() => {
            setDisplays(makeDisplays(seeded(Date.now() % 100000)));
            run(0);
          }}
        >
          Start
        </LabButton>
      </Panel>
    );

  const d = displays[i];
  return (
    <Panel className="space-y-5">
      <RoundBar at={i + 1} of={displays.length} />
      <div className="mx-auto grid aspect-[3/2] w-full max-w-md grid-cols-6 grid-rows-4 gap-2 rounded-xl border-2 border-foreground bg-neutral-200 p-3" aria-label={phase === "test" ? "Test display" : phase === "study" ? "Study display" : "Blank"}>
        {Array.from({ length: GRID.cols * GRID.rows }, (_, cell) => {
          const at = d.cells.indexOf(cell);
          if (at < 0 || phase === "blank") return <span key={cell} />;
          const colour = phase === "test" && d.changed && at === d.changeAt ? d.newColour : d.colours[at];
          return <span key={cell} className="rounded-sm" style={{ background: colour }} />;
        })}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <LabButton tone="plain" disabled={phase !== "test"} onClick={() => respond(false)}>
          Same <kbd className="hidden font-mono text-xs sm:inline">S</kbd>
        </LabButton>
        <LabButton tone="ink" disabled={phase !== "test"} onClick={() => respond(true)}>
          Changed <kbd className="hidden font-mono text-xs sm:inline">D</kbd>
        </LabButton>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Müller-Lyer                                                         */
/* ------------------------------------------------------------------ */

const ML_ROUNDS = 6;

function Fins({ x, y, dir }: { x: number; y: number; dir: 1 | -1 }) {
  // dir 1 = fins pointing outward from the end at x (open end, "longer" look)
  const f = 22;
  return <path d={`M ${x} ${y} l ${dir * f} ${-f} M ${x} ${y} l ${dir * f} ${f}`} stroke="currentColor" strokeWidth={3} fill="none" />;
}

type MlRound = { out: boolean; len: number; start: number };

function makeRounds(seed: number): MlRound[] {
  const r = seeded(seed);
  return Array.from({ length: ML_ROUNDS }, (_, k) => ({ out: k % 2 === 0, len: 150 + Math.round(r() * 60), start: 90 + Math.round(r() * 160) }));
}

export function MullerLyerRunner({ onDone }: RunnerProps) {
  const [rounds, setRounds] = React.useState<MlRound[]>([]);
  const [i, setI] = React.useState(0);
  const [val, setVal] = React.useState(0);
  const results = React.useRef<{ out: boolean; bias: number }[]>([]);
  const cx = 300;

  if (!rounds.length)
    return (
      <Panel className="space-y-4">
        <p className="text-lg font-semibold">You will see a line with fins, and a plain line below it. Stretch the plain line until the two look equal.</p>
        <p className="text-sm text-muted-foreground">Go by eye. Do not measure. {ML_ROUNDS} rounds, about 2 minutes.</p>
        <LabButton
          onClick={() => {
            const made = makeRounds(Date.now() % 100000);
            setRounds(made);
            setVal(made[0].start);
          }}
        >
          Start
        </LabButton>
      </Panel>
    );

  const r = rounds[i];

  function lock() {
    results.current.push({ out: r.out, bias: illusionBias(r.len, val) });
    if (i + 1 >= rounds.length) {
      const outB = Math.round(mean(results.current.filter((x) => x.out).map((x) => x.bias)) * 10) / 10;
      const inB = Math.round(mean(results.current.filter((x) => !x.out).map((x) => x.bias)) * 10) / 10;
      onDone({
        numbers: { finsOut: outB, finsIn: inB },
        verdict:
          outB > inB
            ? `Fins out, you set the line ${outB}% off; fins in, ${inB}%. The fins-out line looked longer to you, which is the classic illusion.`
            : `Your settings did not show the usual direction (fins out ${outB}%, fins in ${inB}%). Measuring carefully, or using the screen edge as a ruler, can cancel it. Did you?`,
        view: (
          <Bars
            ariaLabel="How far off you were"
            unit="%"
            items={[
              { label: "Fins out", value: outB, highlight: true },
              { label: "Fins in", value: inB },
            ]}
          />
        ),
      });
      return;
    }
    setI(i + 1);
    setVal(rounds[i + 1].start);
  }

  const half = r.len / 2;
  return (
    <Panel className="space-y-5">
      <RoundBar at={i + 1} of={rounds.length} />
      <p className="font-semibold">Make the bottom line look exactly as long as the top line (the shaft, not the fins).</p>
      <svg viewBox="0 0 600 200" className="h-auto w-full text-foreground" role="img" aria-label="Top line with fins; bottom plain line you can resize">
        <line x1={cx - half} y1={60} x2={cx + half} y2={60} stroke="currentColor" strokeWidth={3} />
        <Fins x={cx - half} y={60} dir={r.out ? -1 : 1} />
        <Fins x={cx + half} y={60} dir={r.out ? 1 : -1} />
        <line x1={cx - val / 2} y1={150} x2={cx + val / 2} y2={150} stroke="var(--link)" strokeWidth={3} />
        <line x1={cx - val / 2} y1={140} x2={cx - val / 2} y2={160} stroke="var(--link)" strokeWidth={3} />
        <line x1={cx + val / 2} y1={140} x2={cx + val / 2} y2={160} stroke="var(--link)" strokeWidth={3} />
      </svg>
      <label className="block space-y-2">
        <span className="text-sm font-semibold">Length of the bottom line (arrow keys for fine steps)</span>
        <input type="range" min={60} max={320} value={val} onChange={(e) => setVal(Number(e.target.value))} className="w-full accent-[var(--link)]" />
      </label>
      <LabButton onClick={lock}>They look the same</LabButton>
    </Panel>
  );
}

