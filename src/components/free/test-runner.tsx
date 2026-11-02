"use client";

import * as React from "react";
import Link from "next/link";
import { CrisisLine } from "./free-shell";
import { INSTRUMENTS, TRAITS, getInstrument, scoreInstrument, type Instrument, type Result } from "@/lib/free/tests";
import s from "./free.module.css";

type Stage = "intro" | "questions" | "extra" | "result";

/**
 * One questionnaire, one question at a time (tap an answer to move on, like
 * a typeform). Scored in the browser; answers are never stored or sent.
 */
export function TestRunner({ id }: { id: string }) {
  const inst = getInstrument(id) as Instrument;
  const [stage, setStage] = React.useState<Stage>("intro");
  const [i, setI] = React.useState(0);
  const [answers, setAnswers] = React.useState<(number | undefined)[]>(() => Array(inst.items.length).fill(undefined));
  const [extra, setExtra] = React.useState<number | null>(null);
  const [result, setResult] = React.useState<Result | null>(null);
  const headRef = React.useRef<HTMLHeadingElement>(null);
  const firstRender = React.useRef(true);

  // Move keyboard / screen-reader focus to each new question (not on page load).
  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headRef.current?.focus({ preventScroll: true });
  }, [stage, i]);

  function finish(final: (number | undefined)[]) {
    setResult(scoreInstrument(inst, final as number[]));
    setStage("result");
    window.scrollTo({ top: 0 });
  }

  function answer(value: number) {
    const next = answers.slice();
    next[i] = value;
    setAnswers(next);
    if (i < inst.items.length - 1) {
      setI(i + 1);
      return;
    }
    if (inst.extra && next.some((v) => (v ?? 0) > 0)) setStage("extra");
    else finish(next);
  }

  function restart() {
    setAnswers(Array(inst.items.length).fill(undefined));
    setExtra(null);
    setResult(null);
    setI(0);
    setStage("questions");
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (stage !== "questions") return;
    const n = Number(e.key);
    if (n >= 1 && n <= inst.options.length) answer(inst.options[n - 1].value);
    if (e.key === "Backspace" && i > 0) setI(i - 1);
  };

  if (stage === "intro") {
    return (
      <div className={s.runner}>
        <div className={s.runTop}>
          <span>{inst.name}</span>
          <span>
            {inst.items.length} questions · {inst.minutes} min
          </span>
        </div>
        <div className={s.runBody}>
          <h2 ref={headRef} tabIndex={-1} className={s.question}>
            {inst.measures}
          </h2>
          <p className={s.note} style={{ fontSize: "1rem", color: "inherit" }}>
            {inst.intro}
          </p>
          <ul className={`${s.ticks}`} style={{ marginTop: 14, display: "grid", gap: 6 }}>
            <li>For: {inst.forWhom}</li>
            <li>Answer for how things have really been, not how you&apos;d like them to be.</li>
            <li>Your answers stay on this device. Nothing is saved or sent.</li>
            <li>This is a screening tool, not a diagnosis.</li>
          </ul>
          <div className={s.runNav}>
            <button type="button" className={`${s.btn} ${s.btnLime}`} onClick={() => setStage("questions")}>
              Start <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "questions" || stage === "extra") {
    const isExtra = stage === "extra";
    const done = answers.filter((a) => a !== undefined).length;
    const pct = Math.round(((isExtra ? inst.items.length : i) / inst.items.length) * 100);
    const options = isExtra ? inst.extra!.options.map((label, v) => ({ label, value: v })) : inst.options;
    const current = isExtra ? extra : answers[i];
    return (
      <div className={s.runner} onKeyDown={onKey}>
        <div className={s.runTop}>
          <span>{inst.name}</span>
          <span>{isExtra ? "Last one" : `${i + 1} / ${inst.items.length}`}</span>
        </div>
        <div className={s.bar} aria-hidden>
          <div className={s.barFill} style={{ width: `${pct}%` }} />
        </div>
        <div className={s.runBody}>
          <p className={s.stem}>{isExtra ? "One more (not scored)" : inst.stem}</p>
          <h2 ref={headRef} tabIndex={-1} className={s.question} id="q-text">
            {isExtra ? inst.extra!.text : inst.items[i].text}
          </h2>
          <div role="radiogroup" aria-labelledby="q-text" className={s.opts}>
            {options.map((o, k) => (
              <button
                key={o.label}
                type="button"
                role="radio"
                aria-checked={current === o.value}
                className={s.opt}
                onClick={() => {
                  if (isExtra) {
                    setExtra(o.value);
                    finish(answers);
                  } else answer(o.value);
                }}
              >
                <span className={s.optKey} aria-hidden>
                  {k + 1}
                </span>
                {o.label}
              </button>
            ))}
          </div>
          <div className={s.runNav}>
            <button
              type="button"
              className={`${s.btn} ${s.btnWhite} ${s.btnSm}`}
              disabled={!isExtra && i === 0}
              onClick={() => (isExtra ? setStage("questions") : setI(i - 1))}
            >
              ← Back
            </button>
            {!isExtra && answers[i] !== undefined && i < inst.items.length - 1 ? (
              <button type="button" className={`${s.btn} ${s.btnWhite} ${s.btnSm}`} onClick={() => setI(i + 1)}>
                Next →
              </button>
            ) : null}
          </div>
          <p className={s.note}>
            Tip: press 1–{options.length} on a keyboard. {done} of {inst.items.length} answered.
          </p>
        </div>
      </div>
    );
  }

  return <ResultView inst={inst} result={result!} extra={extra} onRestart={restart} headRef={headRef} />;
}

function ScaleBar({ bands, score, max }: { bands: { min: number; max: number }[]; score: number; max: number }) {
  return (
    <div className={s.scale} aria-hidden>
      {bands.map((b) => (
        <span key={b.min} style={{ flex: b.max - b.min + 1 }} />
      ))}
      <i className={s.scaleMark} style={{ left: `${Math.min(100, (score / max) * 100)}%` }} />
    </div>
  );
}

function ResultView({
  inst,
  result,
  extra,
  onRestart,
  headRef,
}: {
  inst: Instrument;
  result: Result;
  extra: number | null;
  onRestart: () => void;
  headRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const urgent = result.flags.includes("self-harm");
  const others = INSTRUMENTS.filter((x) => x.id !== inst.id).slice(0, 3);
  let next: string[] = [];

  let headline: React.ReactNode = null;
  if (result.kind === "total" || result.kind === "who5") {
    const higherIsWorse = result.kind === "total" && inst.id !== "self-esteem";
    headline = (
      <div className={s.scoreCard} data-tone={result.band.tone}>
        <span className={s.label} style={{ color: "inherit" }}>
          Your {inst.name} score
        </span>
        <p className={s.scoreBig}>
          {result.score}
          <small> / {result.max}</small>
        </p>
        <p className={s.scoreLabel}>{result.band.label}</p>
        <ScaleBar bands={inst.bands!} score={result.score} max={result.max} />
        <p>{result.band.advice}</p>
        {result.kind === "who5" ? <p style={{ fontSize: "0.88rem" }}>(Raw score {result.raw} of 25, multiplied by 4. Higher is better.)</p> : null}
        {higherIsWorse ? <p style={{ fontSize: "0.88rem" }}>Higher scores mean more symptoms.</p> : null}
      </div>
    );
    next =
      result.band.tone === "ok"
        ? ["Keep doing what works for you: sleep, movement, people you trust.", "Check in again any time things change."]
        : result.band.tone === "mild"
          ? ["Try a calm exercise below, and take this again in 2 weeks.", "Tell someone you trust how you've been feeling.", "If it's getting worse or not easing, talk to a professional."]
          : [
              "Book a consultation with a clinical psychologist or psychiatrist. Show them this result.",
              "Tele-MANAS (14416) can talk it through with you today and point you to help nearby. It's free.",
              "You don't need to wait until it gets worse. Help works best early.",
            ];
  } else if (result.kind === "asrs") {
    headline = (
      <div className={s.scoreCard} data-tone={result.positive ? "moderate" : "ok"}>
        <span className={s.label} style={{ color: "inherit" }}>
          Adult ADHD screener
        </span>
        <p className={s.scoreBig}>
          {result.positives}
          <small> / 6 in the shaded range</small>
        </p>
        <p className={s.scoreLabel}>{result.positive ? "Screen positive" : "Screen negative"}</p>
        <p>
          {result.positive
            ? "4 or more answers in the shaded range means your symptoms are consistent with adult ADHD, and a full assessment by a psychiatrist or clinical psychologist is worth it."
            : "Fewer than 4 answers in the shaded range. This screener doesn't point to adult ADHD, but if attention problems are affecting your life, it's still worth talking to someone."}
        </p>
        <p style={{ fontSize: "0.88rem" }}>Questions 1–3 count from “Sometimes”; questions 4–6 count from “Often”.</p>
      </div>
    );
    next = result.positive
      ? ["Ask a psychiatrist or clinical psychologist for a full ADHD assessment.", "Low mood, anxiety, poor sleep and thyroid problems can look like ADHD, so a proper assessment checks for these too."]
      : ["If focus is still a struggle, sleep, stress and mood are worth checking first.", "The PHQ-9 and GAD-7 here take 2–3 minutes each."];
  } else {
    headline = (
      <div className={s.scoreCard} data-tone="ok">
        <span className={s.label} style={{ color: "inherit" }}>
          Your Big Five profile
        </span>
        <p className={s.scoreLabel}>Each trait scores from 4 to 20.</p>
        <p>There is no good or bad profile. Every trait has strengths at both ends.</p>
      </div>
    );
    next = ["Personality is fairly stable but not fixed. It shifts slowly with age and experience.", "For a fuller picture, the 50- and 120-item IPIP versions are free online."];
  }

  return (
    <div className={s.result}>
      {urgent ? <CrisisLine urgent /> : null}
      <h2 ref={headRef} tabIndex={-1} className={s.h2}>
        Your result
      </h2>
      {headline}

      {result.kind === "bigfive" ? (
        <ul className={s.traits}>
          {result.traits.map((t) => (
            <li key={t.key} className={s.trait}>
              <div className={s.traitHead}>
                {TRAITS[t.key].name}
                <span>
                  {t.score}/20 · {t.level}
                </span>
              </div>
              <div className={s.traitBar} aria-hidden>
                <i style={{ width: `${((t.score - 4) / 16) * 100}%` }} />
              </div>
              <p className={s.traitText}>
                {t.level === "high" ? TRAITS[t.key].high : t.level === "low" ? TRAITS[t.key].low : TRAITS[t.key].mid}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      {urgent ? (
        <div className={s.box}>
          <h3>About question 9</h3>
          <p>
            You said you&apos;ve had thoughts of being better off dead or of hurting yourself. Whatever your total score,
            that matters. Please tell someone you trust today, and call Tele-MANAS on 14416. If you might act on these
            thoughts, call 112 or go to the nearest hospital emergency.
          </p>
        </div>
      ) : null}

      <div className={s.box}>
        <h3>What to do next</h3>
        <ul className={s.ticks}>
          {next.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        {extra !== null && inst.extra ? <p>You said these problems made life “{inst.extra.options[extra].toLowerCase()}”.</p> : null}
      </div>

      <div className={s.box}>
        <h3>Good to know</h3>
        <p>
          A questionnaire can&apos;t diagnose anything. Only a qualified professional who talks with you can. Results can
          also change from week to week.
        </p>
        <p className={s.source}>Source: {inst.source}</p>
      </div>

      <div className={`${s.btnRow} ${s.noPrint}`}>
        <button type="button" className={`${s.btn} ${s.btnLime}`} onClick={() => window.print()}>
          Save or print this result
        </button>
        <button type="button" className={`${s.btn} ${s.btnWhite}`} onClick={onRestart}>
          Take it again
        </button>
        <Link href="/free#calm" className={`${s.btn} ${s.btnWhite}`}>
          Try a calm exercise
        </Link>
      </div>

      <div className={s.noPrint}>
        <p className={s.label} style={{ marginTop: 8 }}>
          Other self-checks
        </p>
        <ul className={s.cards}>
          {others.map((o) => (
            <li key={o.id} style={{ display: "flex" }}>
              <Link href={`/free/tests/${o.id}`} className={s.card} style={{ flex: 1 }}>
                <span className={s.cardMeta}>
                  {o.name} · {o.minutes} min
                </span>
                <span className={s.cardTitle}>{o.short}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {!urgent ? <CrisisLine /> : null}
    </div>
  );
}
