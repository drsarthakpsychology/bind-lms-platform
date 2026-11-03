"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { CORR_READINGS, CORR_SCENARIOS, type CorrReading, type CorrScenario } from "@/lib/lab/experiments2";
import { seeded } from "@/lib/lab/scoring";
import {
  correlatedPoints,
  designComplete,
  designScore,
  EMPTY_DESIGN,
  flukePoints,
  openThreats,
  restrictedRangePoints,
  rOf,
  roundR,
  rWords,
  thirdVariablePoints,
  THREATS,
  type DesignChoices,
  type Point,
} from "@/lib/lab/scoring2";
import { cn } from "@/lib/utils";
import { Bars, LabButton, Panel, RoundBar, type RunnerProps } from "../lab-ui";
import { Choice, EndsSlider, Meter, RadioCards, Scatter } from "./batch2-ui";

/* ------------------------------------------------------------------ */
/* Design the study                                                    */
/* ------------------------------------------------------------------ */

type Opt<T extends string> = { id: T; label: string }[];

const SAMPLE: Opt<NonNullable<DesignChoices["sample"]>> = [
  { id: "volunteers", label: "Students who sign up because they like the idea" },
  { id: "extreme", label: "The most anxious students from this week's screening" },
  { id: "random", label: "A random sample of students from five colleges" },
];
const SIZE: Opt<NonNullable<DesignChoices["size"]>> = [
  { id: "tiny", label: "10 students in total" },
  { id: "medium", label: "20 students per group" },
  { id: "large", label: "150 students per group" },
];
const CONTROL: Opt<NonNullable<DesignChoices["control"]>> = [
  { id: "none", label: "No comparison: measure before and after the app" },
  { id: "waitlist", label: "A group that gets nothing for now (waiting list)" },
  { id: "active", label: "A group that gets a look-alike app with relaxing sounds" },
];
const ASSIGN: Opt<NonNullable<DesignChoices["assign"]>> = [
  { id: "choose", label: "Students choose their group" },
  { id: "college", label: "One college gets the app, another the comparison" },
  { id: "random", label: "Random assignment, like a coin toss" },
];
const BLIND: Opt<NonNullable<DesignChoices["blind"]>> = [
  { id: "told", label: "That we expect the mindfulness app to work" },
  { id: "masked", label: "That we are comparing two apps, not which one we expect to work" },
];
const MEASURE: Opt<NonNullable<DesignChoices["measure"]>> = [
  { id: "ask", label: "Ask at the end: \"Did the app help?\"" },
  { id: "after", label: "A validated anxiety questionnaire, at the end only" },
  { id: "prepost", label: "The same validated questionnaire, before and after" },
];

export function DesignStudyRunner({ onDone }: RunnerProps) {
  const [c, setC] = React.useState<DesignChoices>(EMPTY_DESIGN);
  const [first, setFirst] = React.useState<number | null>(null);
  const score = designScore(c);
  const open = openThreats(c);
  const complete = designComplete(c);
  const hasControl = c.control === "waitlist" || c.control === "active";

  function set<K extends keyof DesignChoices>(k: K, v: DesignChoices[K]) {
    setC((prev) => {
      const next = { ...prev, [k]: v };
      if (k === "control" && v === "none") next.assign = null;
      return next;
    });
  }

  function finish() {
    const still = THREATS.filter((t) => open.has(t.id)).map((t) => t.name.toLowerCase());
    onDone({
      numbers: { first: first ?? score.closed, final: score.closed, of: score.of },
      verdict:
        score.closed === score.of
          ? `Your final design closes all ${score.of} threats${first !== null && first < score.of ? ` (your first try closed ${first})` : ""}. That is the shape of a randomised controlled trial. It still needs ethics approval, a registered plan and replication.`
          : `Your design closes ${score.closed} of ${score.of} threats. Still open: ${still.join(", ")}. Real studies often accept some threats for cost or ethics, but they should say so.`,
      view: (
        <Bars
          ariaLabel="Threats closed"
          items={[
            { label: "First try", value: first ?? score.closed },
            { label: "Final", value: score.closed, highlight: true },
          ]}
        />
      ),
    });
  }

  return (
    <Panel className="space-y-5">
      <blockquote className="rounded-xl border-2 border-foreground bg-background p-4">
        <p className="text-eyebrow text-link">The claim</p>
        <p className="mt-1 text-lg font-semibold leading-snug">&ldquo;Our mindfulness app cuts exam anxiety in college students.&rdquo;</p>
        <p className="mt-1 text-sm text-muted-foreground">Fictional. Design a study that could test it.</p>
      </blockquote>

      <Meter label="How far you could trust the result" value={score.percent} valueText={`${score.closed} of ${score.of} threats closed`} />

      <RadioCards name="sample" legend="1 · Who takes part?" options={SAMPLE} value={c.sample} onChange={(v) => set("sample", v)} />
      <RadioCards name="size" legend="2 · How many?" options={SIZE} value={c.size} onChange={(v) => set("size", v)} />
      <RadioCards name="control" legend="3 · Compared with what?" options={CONTROL} value={c.control} onChange={(v) => set("control", v)} />
      <RadioCards
        name="assign"
        legend="4 · Who goes in which group?"
        options={ASSIGN}
        value={c.assign}
        onChange={(v) => set("assign", v)}
        disabled={!hasControl}
        note={!hasControl ? "Only needed when there is a comparison group." : undefined}
      />
      <RadioCards name="blind" legend="5 · What are students told?" options={BLIND} value={c.blind} onChange={(v) => set("blind", v)} />
      <RadioCards name="measure" legend="6 · How is anxiety measured?" options={MEASURE} value={c.measure} onChange={(v) => set("measure", v)} />

      {first === null ? (
        <div className="space-y-2 border-t-2 border-dashed border-foreground/30 pt-4">
          <LabButton onClick={() => setFirst(score.closed)} disabled={!complete}>
            Check my design
          </LabButton>
          {!complete && <p className="text-sm text-muted-foreground">Answer every question to check your design.</p>}
        </div>
      ) : (
        <div className="space-y-4 border-t-2 border-dashed border-foreground/30 pt-4">
          <p className="font-semibold" role="status">
            First try: {first} of {score.of} threats closed. Change any choice and watch the list update.
          </p>
          <ul className="space-y-2" aria-label="Threats to the study">
            {THREATS.map((t) => {
              const isOpen = open.has(t.id);
              return (
                <li key={t.id} className={cn("rounded-xl border-2 border-foreground p-3 text-sm", isOpen ? "bg-background" : "bg-card")}>
                  <p className="flex items-center gap-2 font-bold">
                    <span className={cn("grid size-6 shrink-0 place-items-center rounded-full border-2 border-foreground", isOpen ? "bg-foreground text-background" : "bg-primary text-primary-foreground")} aria-hidden>
                      {isOpen ? <X className="size-3.5" /> : <Check className="size-3.5" />}
                    </span>
                    {t.name}
                    <span className="sr-only">{isOpen ? ": still open" : ": closed"}</span>
                    <span className="ml-auto shrink-0 font-mono text-xs font-bold text-muted-foreground" aria-hidden>
                      {isOpen ? "open" : "closed"}
                    </span>
                  </p>
                  {isOpen && (
                    <>
                      <p className="mt-1.5">{t.open}</p>
                      <p className="mt-1">
                        <b>Fix:</b> {t.fix}
                      </p>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
          <LabButton tone="ink" onClick={finish} disabled={!complete}>
            Finish with this design
          </LabButton>
        </div>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Correlation or cause?                                               */
/* ------------------------------------------------------------------ */

function makeData(sc: CorrScenario, rand: () => number): Point[] {
  switch (sc.kind) {
    case "third":
      return thirdVariablePoints(sc.n, rand);
    case "reverse":
      return correlatedPoints(sc.n, 0.55, rand);
    case "fluke":
      return flukePoints(sc.n, 0.75, rand);
    case "restricted":
      return restrictedRangePoints(sc.n, 0.6, 0.2, rand);
    case "rct":
      return correlatedPoints(sc.n, 0.45, rand);
  }
}

type Answer = { guess: number; r: number; reading: CorrReading | null };

export function CorrelationRunner({ onDone }: RunnerProps) {
  const [data, setData] = React.useState<Point[][]>([]);
  const [i, setI] = React.useState(0);
  const [guess, setGuess] = React.useState(0);
  const [locked, setLocked] = React.useState(false);
  const [reading, setReading] = React.useState<CorrReading | null>(null);
  const [behind, setBehind] = React.useState(false);
  const [redraws, setRedraws] = React.useState<{ n: number; r: number }[]>([]);
  const answers = React.useRef<Answer[]>([]);

  if (!data.length)
    return (
      <Panel className="space-y-4">
        <p className="text-lg font-semibold">Six headlines, each with its data. Guess how strong the link is, then decide if the headline is fair.</p>
        <p className="text-sm text-muted-foreground">The computer makes new data each time, with a known structure behind it. About 6 minutes.</p>
        <LabButton
          onClick={() => {
            // Random data are made here, in the click, never during render.
            const rand = seeded(Math.floor(Math.random() * 1e9));
            setData(CORR_SCENARIOS.map((sc) => makeData(sc, rand)));
          }}
        >
          Start
        </LabButton>
      </Panel>
    );

  const sc = CORR_SCENARIOS[i];
  const pts = data[i];
  const r = roundR(rOf(pts));

  function lockGuess() {
    setLocked(true);
  }

  function pick(p: CorrReading) {
    if (reading) return;
    setReading(p);
    answers.current[i] = { guess: guess / 100, r, reading: p };
  }

  function redraw(n: number) {
    const rand = seeded(Math.floor(Math.random() * 1e9));
    setRedraws((d) => [...d.slice(-5), { n, r: roundR(rOf(correlatedPoints(n, 0, rand))) }]);
  }

  function next() {
    if (i + 1 >= CORR_SCENARIOS.length) {
      const a = answers.current;
      const right = a.filter((x, k) => x && x.reading === CORR_SCENARIOS[k].answer).length;
      const err = roundR(a.reduce((s, x) => s + Math.abs(x.guess - x.r), 0) / a.length);
      onDone({
        numbers: { right, of: CORR_SCENARIOS.length, rError: err },
        verdict: `You judged ${right} of ${CORR_SCENARIOS.length} headlines correctly, and your guesses of r were off by ${err.toFixed(2)} on average. ${err > 0.25 ? "Most people find r hard to judge by eye, especially in small samples." : "Good eye for r."} Only the randomised study supported its causal claim.`,
        view: (
          <ul className="space-y-2 text-sm" aria-label="Your answers">
            {CORR_SCENARIOS.map((s, k) => {
              const ok = a[k]?.reading === s.answer;
              return (
                <li key={s.id} className="flex items-start gap-2 rounded-xl border-2 border-foreground bg-background p-3">
                  <span className={cn("mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 border-foreground", ok ? "bg-primary text-primary-foreground" : "bg-foreground text-background")} aria-label={ok ? "Right" : "Missed"}>
                    {ok ? <Check className="size-3.5" aria-hidden /> : <X className="size-3.5" aria-hidden />}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold">{s.headline}</span>
                    <span className="block text-muted-foreground">
                      {s.answer} · r = {a[k]?.r.toFixed(2)} · your guess {a[k]?.guess.toFixed(2)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        ),
      });
      return;
    }
    setI(i + 1);
    setGuess(0);
    setLocked(false);
    setReading(null);
    setBehind(false);
    setRedraws([]);
  }

  return (
    <Panel className="space-y-5">
      <RoundBar at={i + 1} of={CORR_SCENARIOS.length} label="Headline" />
      <p className="rounded-xl border-2 border-foreground bg-background p-4 text-lg font-bold leading-snug">&ldquo;{sc.headline}&rdquo;</p>

      <div className="rounded-xl border-2 border-foreground bg-background p-3">
        <Scatter
          points={pts}
          xLabel={sc.x}
          yLabel={sc.y}
          ariaLabel={`Scatter plot of ${sc.y} against ${sc.x}, ${pts.filter((p) => !p.hidden).length} people${locked ? `, r = ${r}` : ""}`}
          showHidden={behind && sc.kind === "restricted"}
          byGroup={behind && sc.kind === "third"}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {pts.filter((p) => !p.hidden).length} {sc.kind === "third" && sc.z === "temperature" ? "days" : "people"}. Each dot is one {sc.kind === "third" && sc.z === "temperature" ? "day" : "person"}.
        </p>
      </div>

      <div className="space-y-3">
        <EndsSlider
          id={`guess-${sc.id}`}
          label={`1 · Guess r: ${(guess / 100).toFixed(2)}`}
          left="-1 (perfect down)"
          right="+1 (perfect up)"
          min={-100}
          max={100}
          value={guess}
          onChange={setGuess}
          disabled={locked}
          valueText={`r = ${(guess / 100).toFixed(2)}`}
        />
        {!locked ? (
          <LabButton onClick={lockGuess}>Lock my guess</LabButton>
        ) : (
          <p className="text-sm" role="status">
            Real r = <b className="font-mono">{r.toFixed(2)}</b> ({rWords(r)} link). You guessed {(guess / 100).toFixed(2)}, off by {Math.abs(guess / 100 - r).toFixed(2)}.
          </p>
        )}
      </div>

      {locked && (
        <fieldset className="space-y-2">
          <legend className="font-semibold">2 · What is the best reading of the headline?</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {CORR_READINGS.map((p) => (
              <Choice key={p} picked={reading === p} correct={p === sc.answer} revealed={!!reading} onClick={() => pick(p)}>
                {p}
              </Choice>
            ))}
          </div>
        </fieldset>
      )}

      {reading && (
        <div className="space-y-3" role="status">
          <p>
            <b>{reading === sc.answer ? "Right." : `It was: ${sc.answer.toLowerCase()}.`}</b> {sc.why}
          </p>
          {!behind ? (
            <LabButton tone="plain" onClick={() => setBehind(true)}>
              Look behind the data
            </LabButton>
          ) : (
            <div className="space-y-3 rounded-xl border-2 border-dashed border-foreground/50 p-3 text-sm">
              <p>{sc.behind}</p>
              {sc.kind === "restricted" && <p className="font-semibold">Everyone (admitted and not): r = {roundR(fullR(pts)).toFixed(2)}. Admitted only: r = {r.toFixed(2)}.</p>}
              {sc.kind === "fluke" && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <LabButton tone="plain" onClick={() => redraw(6)}>
                      Draw 6 new students
                    </LabButton>
                    <LabButton tone="plain" onClick={() => redraw(200)}>
                      Draw 200 students
                    </LabButton>
                  </div>
                  {redraws.length > 0 && (
                    <ul className="flex flex-wrap gap-2" aria-label="r in new samples">
                      {redraws.map((d, k) => (
                        <li key={k} className="rounded-full border-2 border-foreground bg-card px-2.5 py-0.5 font-mono text-xs font-bold">
                          n={d.n}: r={d.r.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
          <LabButton onClick={next}>{i + 1 >= CORR_SCENARIOS.length ? "See my result" : "Next headline"}</LabButton>
        </div>
      )}
    </Panel>
  );
}

function fullR(pts: Point[]): number {
  return rOf(pts.map((p) => ({ x: p.x, y: p.y })));
}
