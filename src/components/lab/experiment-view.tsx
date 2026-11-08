"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Check, FlaskConical, RotateCcw, ShieldAlert } from "lucide-react";
import { motion, useReducedMotion } from "@/lib/motion";
import { emptyState, istToday, recordLabCheck, recordLabReflection, recordLabRun, type LearnState } from "@/lib/learn/engine";
import { getLearnState, initLearnStore, setLearnState, useLearnState } from "@/lib/learn/store";
import type { LabExperiment } from "@/lib/lab/experiments";
import { cn } from "@/lib/utils";
import { LabButton, Panel, type LabResult } from "./lab-ui";
import { DigitSpanRunner, SerialPositionRunner } from "./runners/memory";
import { ChangeDetectionRunner, MullerLyerRunner, StroopRunner } from "./runners/attention";
import { BiasSpotterRunner, SchedulesRunner } from "./runners/thinking";
import { PavlovRunner } from "./runners/conditioning";
import { CorrelationRunner, DesignStudyRunner } from "./runners/methods";
import { ConservationRunner } from "./runners/development";
import { AttributionRunner } from "./runners/social";

const RUNNERS: Record<string, React.ComponentType<{ onDone: (r: LabResult) => void }>> = {
  "digit-span": DigitSpanRunner,
  "serial-position": SerialPositionRunner,
  stroop: StroopRunner,
  "change-detection": ChangeDetectionRunner,
  "muller-lyer": MullerLyerRunner,
  schedules: SchedulesRunner,
  "bias-spotter": BiasSpotterRunner,
  pavlov: PavlovRunner,
  "design-study": DesignStudyRunner,
  "correlation-cause": CorrelationRunner,
  conservation: ConservationRunner,
  attribution: AttributionRunner,
};

const STAGES = [
  { id: "run", label: "Do it" },
  { id: "result", label: "Your result" },
  { id: "why", label: "Why" },
  { id: "check", label: "Check" },
  { id: "reflect", label: "Reflect" },
] as const;
type Stage = (typeof STAGES)[number]["id"] | "done";

const EMPTY = emptyState();
const REFLECT_KEY = (id: string) => `vibha-lab-reflect-${id}`;

type Props = {
  exp: LabExperiment;
  moduleTitles: Record<string, string>;
  serverState: LearnState | null;
  save: (s: LearnState) => Promise<unknown>;
  recheck: boolean;
  isAdmin: boolean;
};

export function ExperimentView({ exp, moduleTitles, serverState, save, recheck, isAdmin }: Props) {
  initLearnStore(serverState, save);
  const st = useLearnState(serverState ?? EMPTY);
  const record = st.lab[exp.id];
  const reduce = useReducedMotion();
  const [stage, setStage] = React.useState<Stage>(recheck && record ? "check" : "run");
  const [result, setResult] = React.useState<LabResult | null>(null);
  const [runKey, setRunKey] = React.useState(0);
  // Animate stage changes only, never the first paint (keeps server and client HTML identical).
  const [moved, setMoved] = React.useState(false);
  const topRef = React.useRef<HTMLDivElement>(null);
  const Runner = RUNNERS[exp.id];

  function go(s: Stage) {
    setMoved(true);
    setStage(s);
    // Move focus to the stage heading so keyboard and screen-reader users land in the new content.
    window.setTimeout(() => {
      topRef.current?.focus({ preventScroll: true });
      topRef.current?.scrollIntoView({ block: "start", behavior: reduce === false ? "smooth" : "auto" });
    }, 0);
  }

  function done(r: LabResult) {
    setResult(r);
    const cur = getLearnState() ?? st;
    setLearnState(recordLabRun(cur, exp.id, r.numbers, istToday()));
    go("result");
  }

  const stageIndex = STAGES.findIndex((s) => s.id === stage);

  return (
    <div className="mx-auto w-full min-w-0 max-w-3xl space-y-6 px-4 py-6 sm:px-6 lg:py-10">
      <Link href="/games/lab" className="inline-flex min-h-11 items-center gap-1 rounded-full border-2 border-foreground bg-card px-3 py-1.5 text-sm font-bold">
        <ArrowLeft className="size-4" aria-hidden /> Back to the Lab
      </Link>

      <header className="space-y-2">
        <p className="text-eyebrow text-link">
          <span className="font-mono">{String(exp.num).padStart(2, "0")}</span> · {exp.area} · {exp.level}
        </p>
        <h1 className="text-h1">{exp.title}</h1>
        <p className="text-lg">
          <span className="font-serif italic">{exp.question}</span>
        </p>
      </header>

      {/* Sourcing and review notes are for admins only; students see the teaching. */}
      {isAdmin && (
        <aside className="rounded-2xl border-2 border-dashed border-foreground p-4 text-sm">
          <p className="flex items-center gap-2 font-bold">
            <ShieldAlert className="size-4" aria-hidden /> Admins only
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {exp.review.map((r) => (
              <li key={r}>{r}</li>
            ))}
            <li>Evidence: {exp.evidence.note}</li>
            <li>Original studies: {exp.refs.join("; ")}</li>
            <li>Textbook references: {exp.bookRefs.length ? exp.bookRefs.join("; ") : "not yet added."}</li>
          </ul>
        </aside>
      )}

      <nav aria-label="Steps" className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none]">
        <ol className="flex min-w-max gap-2">
          {STAGES.map((s, k) => {
            const reached = stage === "done" || k <= stageIndex;
            const canJump = !!record && s.id !== "run";
            return (
              <li key={s.id}>
                <button
                  type="button"
                  disabled={!canJump && s.id !== stage}
                  onClick={() => go(s.id)}
                  aria-current={stage === s.id ? "step" : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-bold",
                    stage === s.id ? "border-foreground bg-foreground text-background" : reached ? "border-foreground bg-card" : "border-foreground/30 text-muted-foreground",
                  )}
                >
                  <span className="font-mono">{k + 1}</span> {s.label}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div ref={topRef} tabIndex={-1} className="scroll-mt-24 outline-none">
        <motion.div key={stage + runKey} initial={moved && reduce === false ? { opacity: 0, y: 8 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {stage === "run" && (
            <div className="space-y-4">
              <ol className="grid gap-2 sm:grid-cols-3">
                {exp.steps.map((s, k) => (
                  <li key={s} className="flex gap-2 rounded-xl border-2 border-foreground/30 bg-background p-3 text-sm">
                    <span className="font-mono font-bold text-link">{k + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
              <Runner key={runKey} onDone={done} />
              {record && (
                <p className="text-sm text-muted-foreground">
                  You have done this {record.runs} time{record.runs === 1 ? "" : "s"}.{" "}
                  <button type="button" className="font-bold text-link underline" onClick={() => go("why")}>
                    Skip to the explanation
                  </button>
                </p>
              )}
            </div>
          )}

          {stage === "result" && (
            <div className="space-y-4">
              {result ? (
                <Panel className="space-y-4">
                  <h2 className="text-h2">Your data</h2>
                  {result.view}
                  <p className="text-lg font-semibold">{result.verdict}</p>
                </Panel>
              ) : (
                <Panel>
                  <p>Your last result: {Object.entries(record?.result ?? {}).map(([k, v]) => `${k} ${v}`).join(" · ") || "none yet"}.</p>
                </Panel>
              )}
              <Panel className="bg-background">
                <p className="text-eyebrow text-link">What usually happens</p>
                <p className="mt-1">{exp.finding}</p>
              </Panel>
              <div className="flex flex-wrap gap-2">
                <LabButton onClick={() => go("why")}>
                  Why does this happen? <ArrowRight className="size-4" aria-hidden />
                </LabButton>
                <LabButton
                  tone="plain"
                  onClick={() => {
                    setRunKey((k) => k + 1);
                    go("run");
                  }}
                >
                  <RotateCcw className="size-4" aria-hidden /> Run again
                </LabButton>
              </div>
            </div>
          )}

          {stage === "why" && <WhyStage exp={exp} moduleTitles={moduleTitles} onNext={() => go("check")} />}

          {stage === "check" && (
            <CheckStage
              exp={exp}
              recheck={recheck}
              onDone={(right) => {
                const cur = getLearnState() ?? st;
                setLearnState(recordLabCheck(cur, exp.id, right, exp.checks.length, istToday()));
                go("reflect");
              }}
            />
          )}

          {stage === "reflect" && (
            <ReflectStage
              exp={exp}
              onDone={(wrote) => {
                const cur = getLearnState() ?? st;
                if (wrote) setLearnState(recordLabReflection(cur, exp.id, istToday()));
                go("done");
              }}
            />
          )}

          {stage === "done" && (
            <Panel className="space-y-4 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full border-2 border-foreground bg-primary text-primary-foreground hard-shadow-sm">
                <Check className="size-7" aria-hidden />
              </span>
              <h2 className="text-h2">Experiment done</h2>
              <p className="text-muted-foreground">The questions come back in a few days.</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Link href="/games/lab" className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-foreground bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hard-shadow-sm">
                  <FlaskConical className="size-4" aria-hidden /> Back to the Lab
                </Link>
                {exp.related[0] && (
                  <Link href={`/study/${exp.related[0]}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-foreground bg-card px-5 py-2 text-sm font-bold">
                    <BookOpen className="size-4" aria-hidden /> Read: {moduleTitles[exp.related[0]]}
                  </Link>
                )}
              </div>
            </Panel>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function WhyStage({ exp, moduleTitles, onNext }: { exp: LabExperiment; moduleTitles: Record<string, string>; onNext: () => void }) {
  const tone = exp.evidence.status === "Well established" ? "bg-primary text-primary-foreground" : exp.evidence.status === "Debated" ? "bg-foreground text-background" : "bg-card";
  return (
    <div className="space-y-4">
      <Panel className="space-y-3">
        <h2 className="text-h2">Why it happens</h2>
        {exp.theory.map((p) => (
          <p key={p} className="leading-relaxed">
            {p}
          </p>
        ))}
      </Panel>
      <Panel className="space-y-3">
        <h2 className="text-h2">In the clinic</h2>
        <ul className="space-y-2">
          {exp.clinic.map((p) => (
            <li key={p} className="flex gap-2 leading-relaxed">
              <span className="mt-2 size-2 shrink-0 rounded-full bg-primary ring-2 ring-foreground" aria-hidden />
              {p}
            </li>
          ))}
        </ul>
      </Panel>
      <p className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold">How sure are we?</span>
        <span className={cn("rounded-full border-2 border-foreground px-3 py-0.5 text-xs font-bold", tone)}>{exp.evidence.status}</span>
      </p>
      {exp.related.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold">Connects to:</span>
          {exp.related.map((m) => (
            <Link key={m} href={`/study/${m}`} className="rounded-full border-2 border-foreground bg-card px-3 py-1 font-semibold hover:-translate-y-0.5">
              {moduleTitles[m] ?? m}
            </Link>
          ))}
        </div>
      )}
      <LabButton onClick={onNext}>
        Check yourself <ArrowRight className="size-4" aria-hidden />
      </LabButton>
    </div>
  );
}

function CheckStage({ exp, recheck, onDone }: { exp: LabExperiment; recheck: boolean; onDone: (right: number) => void }) {
  const [i, setI] = React.useState(0);
  const [picked, setPicked] = React.useState<number | null>(null);
  const [right, setRight] = React.useState(0);
  const c = exp.checks[i];
  return (
    <Panel className="space-y-4">
      <p className="text-sm font-semibold tabular-nums text-muted-foreground">
        {recheck ? "Re-check · " : ""}Question {i + 1} of {exp.checks.length}
      </p>
      <h2 className="text-xl font-bold leading-snug">{c.q}</h2>
      <div className="grid gap-2" role="group" aria-label="Answers">
        {c.options.map((o, k) => (
          <button
            key={o}
            type="button"
            aria-pressed={picked === k}
            onClick={() => {
              if (picked !== null) return;
              setPicked(k);
              if (k === c.answer) setRight((n) => n + 1);
            }}
            className={cn(
              "min-h-12 rounded-xl border-2 border-foreground px-4 py-2 text-left font-semibold",
              picked === null && "bg-card hover:-translate-y-0.5",
              picked !== null && k === c.answer && "bg-primary text-primary-foreground",
              picked === k && k !== c.answer && "bg-foreground text-background",
              picked !== null && k !== picked && k !== c.answer && "opacity-50",
            )}
          >
            {o}
          </button>
        ))}
      </div>
      {picked !== null && (
        <div className="space-y-3" role="status">
          <p>
            <b>{picked === c.answer ? "Right." : "Not quite."}</b> {c.why}
          </p>
          <LabButton
            onClick={() => {
              if (i + 1 >= exp.checks.length) return onDone(right);
              setI(i + 1);
              setPicked(null);
            }}
          >
            {i + 1 >= exp.checks.length ? `Done · ${right} of ${exp.checks.length}` : "Next"}
          </LabButton>
        </div>
      )}
    </Panel>
  );
}

function ReflectStage({ exp, onDone }: { exp: LabExperiment; onDone: (wrote: boolean) => void }) {
  // Only reached after the student acts, so this never runs during server render.
  const [text, setText] = React.useState(() => {
    try {
      return typeof window === "undefined" ? "" : (window.localStorage.getItem(REFLECT_KEY(exp.id)) ?? "");
    } catch {
      return "";
    }
  });
  function keep(v: string) {
    setText(v);
    try {
      window.localStorage.setItem(REFLECT_KEY(exp.id), v);
    } catch {
      /* storage blocked */
    }
  }
  return (
    <Panel className="space-y-4">
      <h2 className="text-h2">Reflect</h2>
      <label htmlFor="reflect" className="block text-lg">
        {exp.reflect}
      </label>
      <textarea id="reflect" rows={5} value={text} onChange={(e) => keep(e.target.value)} className="w-full rounded-md border-2 border-foreground bg-background p-3" />
      <p className="text-xs text-muted-foreground">Private. Saved on this device only.</p>
      <div className="flex flex-wrap gap-2">
        <LabButton onClick={() => onDone(true)} disabled={text.trim().length < 10}>
          Save and finish
        </LabButton>
        <LabButton tone="plain" onClick={() => onDone(false)}>
          Skip
        </LabButton>
      </div>
    </Panel>
  );
}
