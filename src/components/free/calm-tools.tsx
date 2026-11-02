"use client";

import * as React from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import s from "./free.module.css";

/* ------------------------------------------------------------- breathing */
const PATTERNS = {
  box: { label: "Box breathing", note: "In 4 · hold 4 · out 4 · hold 4", phases: [["Breathe in", 4], ["Hold", 4], ["Breathe out", 4], ["Hold", 4]] },
  "478": { label: "4-7-8", note: "In 4 · hold 7 · out 8", phases: [["Breathe in", 4], ["Hold", 7], ["Breathe out", 8]] },
  slow: { label: "Slow breathing", note: "In 5 · out 5 (about 6 a minute)", phases: [["Breathe in", 5], ["Breathe out", 5]] },
} as const satisfies Record<string, { label: string; note: string; phases: readonly (readonly [string, number])[] }>;
type PatternId = keyof typeof PATTERNS;

function nowMs() {
  return Date.now();
}

export function Breathing() {
  const reduce = useReducedMotion();
  const [pattern, setPattern] = React.useState<PatternId>("box");
  const [minutes, setMinutes] = React.useState(3);
  const [running, setRunning] = React.useState(false);
  const [phase, setPhase] = React.useState(0);
  const [left, setLeft] = React.useState(0);
  const [elapsed, setElapsed] = React.useState(0);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (!running) return;
    const phases = PATTERNS[pattern].phases;
    const start = nowMs();
    const cycle = phases.reduce((a, p) => a + p[1], 0);
    const id = setInterval(() => {
      const t = (nowMs() - start) / 1000;
      if (t >= minutes * 60) {
        setRunning(false);
        setDone(true);
        return;
      }
      let within = t % cycle;
      let k = 0;
      while (within >= phases[k][1]) {
        within -= phases[k][1];
        k++;
      }
      setPhase(k);
      setLeft(Math.ceil(phases[k][1] - within));
      setElapsed(Math.floor(t));
    }, 200);
    return () => clearInterval(id);
  }, [running, pattern, minutes]);

  const phases = PATTERNS[pattern].phases;
  const [label, secs] = phases[phase] ?? phases[0];
  const big = label === "Breathe in" || (label === "Hold" && phases[phase - 1]?.[0] === "Breathe in");
  const scale = !running ? 0.75 : big ? 1.15 : 0.6;
  const remaining = minutes * 60 - elapsed;

  return (
    <div>
      <div className={s.calmStage} aria-live="polite">
        <div>
          <div
            className={s.orb}
            style={{
              transform: reduce ? undefined : `scale(${scale})`,
              transition: reduce ? undefined : `transform ${running && label !== "Hold" ? secs : 0.6}s ease-in-out`,
            }}
          >
            <span>
              <b>{running ? left : done ? "✓" : "Ready"}</b>
            </span>
          </div>
          <p className={s.phase}>{running ? label : done ? "Well done." : PATTERNS[pattern].note}</p>
          {running ? (
            <p className={s.stepCount} style={{ marginTop: 8 }}>
              {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")} left
            </p>
          ) : done ? (
            <p className={s.calmText}>Notice how your body feels now compared with when you started.</p>
          ) : null}
        </div>
      </div>
      <div className={s.controls}>
        <div>
          <p className={s.label}>Pattern</p>
          <div className={s.chips}>
            {(Object.keys(PATTERNS) as PatternId[]).map((p) => (
              <button key={p} type="button" className={s.chip} aria-pressed={pattern === p} disabled={running} onClick={() => setPattern(p)}>
                {PATTERNS[p].label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className={s.label}>How long</p>
          <div className={s.chips}>
            {[1, 3, 5].map((m) => (
              <button key={m} type="button" className={s.chip} aria-pressed={minutes === m} disabled={running} onClick={() => setMinutes(m)}>
                {m} min
              </button>
            ))}
          </div>
        </div>
        <div className={s.btnRow}>
          {running ? (
            <button type="button" className={`${s.btn} ${s.btnInk}`} onClick={() => setRunning(false)}>
              Stop
            </button>
          ) : (
            <button
              type="button"
              className={`${s.btn} ${s.btnLime}`}
              onClick={() => {
                setDone(false);
                setPhase(0);
                setLeft(phases[0][1]);
                setElapsed(0);
                setRunning(true);
              }}
            >
              {done ? "Go again" : "Start"}
            </button>
          )}
        </div>
        <p className={s.note}>
          Breathe through your nose if you can, and let your belly rise. If you feel light-headed, stop and breathe
          normally. 4-7-8 is best done sitting or lying down.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- grounding */
const SENSES = [
  { n: 5, verb: "see", prompt: "Look around. Name 5 things you can see. Small details count: a crack, a colour, a shadow." },
  { n: 4, verb: "feel", prompt: "Name 4 things you can feel. Your feet on the floor, the chair, your clothes, the air." },
  { n: 3, verb: "hear", prompt: "Listen. Name 3 things you can hear, near or far." },
  { n: 2, verb: "smell", prompt: "Name 2 things you can smell. If nothing, name 2 smells you like." },
  { n: 1, verb: "taste", prompt: "Name 1 thing you can taste, or take a sip of water and notice it." },
] as const;

export function Grounding() {
  const [step, setStep] = React.useState(0);
  const done = step >= SENSES.length;
  const sense = SENSES[Math.min(step, SENSES.length - 1)];
  return (
    <div>
      <div className={s.calmStage} aria-live="polite">
        {done ? (
          <div>
            <p className={s.bigNum}>✓</p>
            <p className={s.calmText}>You&apos;re here, in this room, right now. Take one slow breath before you carry on.</p>
          </div>
        ) : (
          <div>
            <p className={s.stepCount}>
              Step {step + 1} of 5
            </p>
            <p className={s.bigNum}>{sense.n}</p>
            <p className={s.phase} style={{ marginTop: 6 }}>
              things you can {sense.verb}
            </p>
            <p className={s.calmText}>{sense.prompt}</p>
          </div>
        )}
      </div>
      <div className={s.controls}>
        {!done ? (
          <label>
            <span className={s.label} style={{ display: "block" }}>
              Type them if it helps (optional, not saved)
            </span>
            <input key={step} className={s.input} placeholder={`${sense.n} things I can ${sense.verb}…`} />
          </label>
        ) : null}
        <div className={s.btnRow}>
          {done ? (
            <>
              <button type="button" className={`${s.btn} ${s.btnLime}`} onClick={() => setStep(0)}>
                Do it again
              </button>
              <Link href="/free/calm/breathing" className={`${s.btn} ${s.btnWhite}`}>
                Now try breathing
              </Link>
            </>
          ) : (
            <>
              <button type="button" className={`${s.btn} ${s.btnLime}`} onClick={() => setStep(step + 1)}>
                {step === SENSES.length - 1 ? "Finish" : "Next"} →
              </button>
              {step > 0 ? (
                <button type="button" className={`${s.btn} ${s.btnWhite}`} onClick={() => setStep(step - 1)}>
                  ← Back
                </button>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------- muscle relaxation (PMR) */
const GROUPS = [
  ["Hands", "Make tight fists with both hands."],
  ["Upper arms", "Bend your elbows and tighten your biceps."],
  ["Shoulders", "Lift your shoulders up towards your ears."],
  ["Forehead", "Raise your eyebrows as high as they go."],
  ["Eyes and cheeks", "Squeeze your eyes shut tightly."],
  ["Jaw", "Clench your teeth gently and pull the corners of your mouth back."],
  ["Neck", "Gently press your head back. Don't strain."],
  ["Chest and back", "Take a deep breath, hold it, and pull your shoulder blades together."],
  ["Stomach", "Tighten your stomach muscles as if bracing."],
  ["Thighs", "Press your knees together and tighten your thighs."],
  ["Calves", "Point your toes up towards your face."],
  ["Feet", "Curl your toes downwards."],
] as const;
const TENSE = 5;
const RELEASE = 15;

export function Muscles() {
  const [running, setRunning] = React.useState(false);
  const [t, setT] = React.useState(0);
  const total = GROUPS.length * (TENSE + RELEASE);

  React.useEffect(() => {
    if (!running) return;
    const start = nowMs() - t * 1000;
    const id = setInterval(() => {
      const now = Math.floor((nowMs() - start) / 1000);
      if (now >= total) {
        setRunning(false);
        setT(total);
      } else setT(now);
    }, 250);
    return () => clearInterval(id);
    // t is only read when (re)starting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, total]);

  const done = t >= total;
  const g = Math.min(Math.floor(t / (TENSE + RELEASE)), GROUPS.length - 1);
  const within = t - g * (TENSE + RELEASE);
  const tensing = within < TENSE;
  const left = tensing ? TENSE - within : TENSE + RELEASE - within;

  return (
    <div>
      <div className={s.calmStage} aria-live="polite">
        {done ? (
          <div>
            <p className={s.bigNum}>✓</p>
            <p className={s.calmText}>Your whole body, released. Stay still for a few breaths and notice the calm.</p>
          </div>
        ) : !running && t === 0 ? (
          <div>
            <p className={s.phase}>Sit or lie somewhere comfortable.</p>
            <p className={s.calmText}>
              12 muscle groups. For each one: tense for {TENSE} seconds, then let go completely for {RELEASE} seconds.
            </p>
          </div>
        ) : (
          <div>
            <p className={s.stepCount}>
              {g + 1} of {GROUPS.length} · {GROUPS[g][0]}
            </p>
            <p className={s.bigNum}>{left}</p>
            <p className={s.phase} style={{ marginTop: 6 }}>
              {tensing ? "Tense" : "Let go"}
            </p>
            <p className={s.calmText}>
              {tensing ? GROUPS[g][1] : "Release all at once. Feel the tension drain away. Notice the difference."}
            </p>
          </div>
        )}
      </div>
      <div className={s.controls}>
        <div className={s.btnRow}>
          {running ? (
            <button type="button" className={`${s.btn} ${s.btnInk}`} onClick={() => setRunning(false)}>
              Pause
            </button>
          ) : done ? (
            <button
              type="button"
              className={`${s.btn} ${s.btnLime}`}
              onClick={() => {
                setT(0);
                setRunning(true);
              }}
            >
              Start again
            </button>
          ) : (
            <button type="button" className={`${s.btn} ${s.btnLime}`} onClick={() => setRunning(true)}>
              {t === 0 ? "Start" : "Resume"}
            </button>
          )}
        </div>
        <p className={s.note}>
          Tense firmly but not painfully. Skip any area that is injured or sore, and ease off if you feel a cramp.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ worry sorter */
export function WorrySorter() {
  const [worry, setWorry] = React.useState("");
  const [stage, setStage] = React.useState<"write" | "sort" | "act" | "plan" | "release">("write");
  const [step, setStep] = React.useState("");
  const [when, setWhen] = React.useState("");

  const reset = () => {
    setWorry("");
    setStep("");
    setWhen("");
    setStage("write");
  };

  return (
    <div>
      <div className={s.calmStage} aria-live="polite">
        {stage === "write" ? (
          <div>
            <p className={s.phase}>What&apos;s on your mind?</p>
            <p className={s.calmText}>Write one worry below. Just one. Nothing you type is saved or sent.</p>
          </div>
        ) : stage === "sort" ? (
          <div>
            <p className={s.worryCard} style={{ margin: "0 auto" }}>
              {worry}
            </p>
            <p className={s.phase}>Can you do anything about this?</p>
          </div>
        ) : stage === "act" ? (
          <div>
            <p className={s.phase}>Good. Make it small.</p>
            <p className={s.calmText}>What is one small step you could take, and when?</p>
          </div>
        ) : stage === "plan" ? (
          <div>
            <p className={s.stepCount}>Your plan</p>
            <p className={s.worryCard} style={{ margin: "12px auto 0" }}>
              {step}
              {when ? ` · ${when}` : ""}
            </p>
            <p className={s.calmText}>That&apos;s all you need to do. Until then, you can put this worry down.</p>
          </div>
        ) : (
          <div>
            <p className={`${s.worryCard} ${s.floatAway}`} style={{ margin: "0 auto" }}>
              {worry}
            </p>
            <p className={s.phase}>Let it float away.</p>
            <p className={s.calmText}>
              This one is outside your control right now. Worrying more won&apos;t change it. Bring your attention back to
              what&apos;s in front of you.
            </p>
          </div>
        )}
      </div>
      <div className={s.controls}>
        {stage === "write" ? (
          <>
            <textarea
              className={s.textarea}
              value={worry}
              maxLength={240}
              onChange={(e) => setWorry(e.target.value)}
              placeholder="e.g. I'm not ready for my exam on Monday"
              aria-label="Your worry"
            />
            <div className={s.btnRow}>
              <button type="button" className={`${s.btn} ${s.btnLime}`} disabled={!worry.trim()} onClick={() => setStage("sort")}>
                Next →
              </button>
            </div>
          </>
        ) : stage === "sort" ? (
          <div className={s.btnRow}>
            <button type="button" className={`${s.btn} ${s.btnLime}`} onClick={() => setStage("act")}>
              Yes, I can do something
            </button>
            <button type="button" className={`${s.btn} ${s.btnWhite}`} onClick={() => setStage("release")}>
              No, it&apos;s out of my hands
            </button>
          </div>
        ) : stage === "act" ? (
          <>
            <input className={s.input} value={step} onChange={(e) => setStep(e.target.value)} placeholder="One small step, e.g. revise chapter 3 for 30 minutes" aria-label="One small step" />
            <input className={s.input} value={when} onChange={(e) => setWhen(e.target.value)} placeholder="When? e.g. tomorrow at 7 am" aria-label="When" />
            <div className={s.btnRow}>
              <button type="button" className={`${s.btn} ${s.btnLime}`} disabled={!step.trim()} onClick={() => setStage("plan")}>
                Make my plan
              </button>
            </div>
          </>
        ) : (
          <div className={s.btnRow}>
            <button type="button" className={`${s.btn} ${s.btnLime}`} onClick={reset}>
              Sort another worry
            </button>
            <Link href="/free/calm/grounding" className={`${s.btn} ${s.btnWhite}`}>
              Ground yourself
            </Link>
          </div>
        )}
        <p className={s.note}>If the same worry keeps coming back every day, or worry is stopping you living normally, the GAD-7 self-check is a good next step.</p>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- bubbles */
type Bubble = { id: number; x: number; size: number; dur: number; popped: boolean };

export function Bubbles() {
  const reduce = useReducedMotion();
  const stage = React.useRef<HTMLDivElement>(null);
  const [bubbles, setBubbles] = React.useState<Bubble[]>([]);
  const [h, setH] = React.useState(560);
  const nextId = React.useRef(0);

  React.useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setH(el.clientHeight + 140));
    ro.observe(el);
    const id = setInterval(
      () => {
        const b: Bubble = {
          id: nextId.current++,
          x: 4 + Math.random() * 84,
          size: 44 + Math.random() * 56,
          dur: reduce ? 30 : 9 + Math.random() * 7,
          popped: false,
        };
        setBubbles((list) => [...list.filter((x) => !x.popped).slice(-18), b]);
      },
      reduce ? 2400 : 900,
    );
    return () => {
      clearInterval(id);
      ro.disconnect();
    };
  }, [reduce]);

  return (
    <div>
      <div ref={stage} className={s.calmStage} style={{ minHeight: "clamp(380px, 62vh, 560px)" }}>
        <p className={s.calmText} style={{ position: "relative", zIndex: 0, opacity: 0.85 }}>
          Breathe slowly. Pop a bubble, or just watch them go.
        </p>
        <div className={s.bubbles} style={{ ["--h" as string]: `${h}px` }}>
          {bubbles.map((b) => (
            <span
              key={b.id}
              className={s.bubble}
              style={{ left: `${b.x}%`, width: b.size, height: b.size, animationDuration: `${b.dur}s` }}
              onAnimationEnd={(e) => {
                if (e.target === e.currentTarget) setBubbles((list) => list.filter((x) => x.id !== b.id));
              }}
            >
              <button
                type="button"
                className={s.bubbleIn}
                data-popped={b.popped}
                aria-label="Pop bubble"
                tabIndex={-1}
                onClick={() => setBubbles((list) => list.map((x) => (x.id === b.id ? { ...x, popped: true } : x)))}
              />
            </span>
          ))}
        </div>
      </div>
      <p className={s.note}>No score, no timer. Stay as long as you like.</p>
    </div>
  );
}
