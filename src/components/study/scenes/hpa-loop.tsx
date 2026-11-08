"use client";

import * as React from "react";
import { Moon, Play, RotateCcw, Sun } from "lucide-react";
import type { HpaLoopData } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { trackLearn } from "@/lib/learn/track";
import { Missions, SceneCard, btn, chip, statusCls, useMissions, useReducedMotion } from "./kit";

/**
 * A day of stress, played. Events arrive (an exam, an argument, a
 * deadline, bedtime); adrenaline spikes within minutes and cortisol rises
 * over half an hour through the HPA axis. After each event the student
 * picks how to cope, and the curve changes. Chronic stress mode replays
 * five hard days and shows the cortisol feedback loop failing.
 * Time is in minutes after 7 am.
 */

export type Choice = "talk" | "exercise" | "rest" | "avoid";
type Ev = { at: number; m: number; title: string; scene: string };
const EVENTS: Ev[] = [
  { at: 120, m: 0.8, title: "9:00 · The exam", scene: "Your exam starts in an hour and two topics are still shaky. Your heart thumps and your hands go cold." },
  { at: 360, m: 0.6, title: "13:00 · An argument", scene: "At lunch a close friend accuses you of ignoring her. Voices rise and she walks off." },
  { at: 600, m: 0.7, title: "17:00 · A deadline", scene: "An assignment is due at midnight and you have barely started it." },
  { at: 900, m: 0.35, title: "22:00 · Bedtime", scene: "The day is over, but your mind keeps replaying it." },
];
const DAY_END = 960;
/** Minutes after each event when the choice appears: adrenaline has already spiked. */
const REACT = 6;
const CHOICES: { id: Choice; day: string; night: string }[] = [
  { id: "talk", day: "Talk to someone", night: "Talk it over, then sleep" },
  { id: "exercise", day: "Exercise: a brisk walk", night: "A late, hard workout" },
  { id: "rest", day: "Rest: slow breathing", night: "Sleep 8 hours" },
  { id: "avoid", day: "Avoid it: scroll the phone", night: "Avoid: scroll till 2 am" },
];
const EFFECT: Record<Choice, { tau: number; scale: number; say: string }> = {
  talk: { tau: 30, scale: 0.75, say: "Talking it through lowers the response. In laboratory stress tests, people supported by a friend show smaller cortisol rises, and the feeling of being understood helps the alarm switch off." },
  exercise: { tau: 45, scale: 0.9, say: "Exercise briefly raises adrenaline, then uses up the energy the stress response prepared, and the body settles faster. Regular exercise makes the stress response smaller over weeks." },
  rest: { tau: 50, scale: 0.9, say: "Slow breathing, with the out-breath longer than the in-breath, switches on the parasympathetic brake. The heart slows within minutes; cortisol follows more slowly." },
  avoid: { tau: 1e9, scale: 1, say: "Avoidance brings quick relief: adrenaline falls. But the problem is still there. Worry keeps cortisol up, and the next stressor will hit harder." },
};

const baseline = (t: number, flat = 0) => {
  // cortisol peaks about 30 to 45 minutes after waking, then falls through the day
  const car = 0.32 * Math.exp(-Math.pow((t - 40) / 45, 2));
  const fall = 0.5 * Math.exp(-t / 330);
  return 0.12 + (car + fall) * (1 - flat) + flat * 0.32;
};
const gammaPeak = (dt: number, tp: number) => (dt <= 0 ? 0 : (dt / tp) * Math.exp(1 - dt / tp));

export type DayState = { choices: Choice[]; feedback: number; extraBase: number };

/** Magnitude of each event after earlier avoidance made it worse. */
function magnitudes(choices: Choice[]) {
  let carry = 0;
  return EVENTS.map((e, i) => {
    const m = e.m + carry;
    carry = choices[i] === "avoid" ? 0.3 : 0;
    return m;
  });
}

export function hormones(t: number, s: DayState) {
  const ms = magnitudes(s.choices);
  const flat = 1 - s.feedback;
  let cort = baseline(t, flat * 0.8) + s.extraBase;
  let adr = 0.08;
  EVENTS.forEach((e, i) => {
    const dt = t - e.at;
    if (dt < 0) return;
    const c = s.choices[i];
    const tc = 10; // the choice acts 10 minutes after the event
    const ef = c ? EFFECT[c] : null;
    const after = ef && dt > tc ? Math.exp(-(dt - tc) / ef.tau) * ef.scale : 1;
    const tp = 25 / Math.max(0.25, s.feedback); // weaker feedback: slower, longer rise
    cort += ms[i] * 0.55 * gammaPeak(dt, tp) * (ef && dt > tc ? after : 1);
    adr += ms[i] * (1 - Math.exp(-dt / 1.5)) * Math.exp(-dt / 12) * (c === "avoid" && dt > tc ? 0.4 : ef && dt > tc ? after : 1);
    if (c === "exercise" && dt > tc && dt < tc + 25) adr += 0.18 * Math.sin(((dt - tc) / 25) * Math.PI);
    if (c === "avoid") {
      const next = EVENTS[i + 1]?.at ?? DAY_END;
      if (t > e.at + tc && t < next + 60) cort += 0.12 * Math.min(1, (t - e.at - tc) / 40);
    }
  });
  if (s.choices[3] === "avoid" && t > 900) {
    cort += 0.1;
    adr += 0.06;
  }
  return { cort: Math.min(1.4, cort), adr: Math.min(1.2, adr), base: baseline(t, flat * 0.8) + s.extraBase };
}

export function stressLoad(s: DayState, upTo = DAY_END) {
  let a = 0;
  for (let t = 0; t <= upTo; t += 5) {
    const h = hormones(t, s);
    a += Math.max(0, h.cort - h.base) * 5;
  }
  return a / 60; // in "hours above baseline"
}

const clock = (t: number) => {
  const h = Math.floor(7 + t / 60), m = Math.floor(t % 60);
  return `${h}:${String(m).padStart(2, "0")}`;
};

const CHRONIC = [
  "Day 1: the loop works. Each stressor raises cortisol, cortisol tells the hypothalamus and pituitary to stop, and levels fall back.",
  "Day 2: hard again, with no recovery in between. Cortisol stays a little higher through the evening and night.",
  "Day 3: with cortisol high for days, cortisol receptors in the hippocampus and hypothalamus become less sensitive. The off switch is weakening.",
  "Day 4: the feedback loop is failing. The system keeps running after each stressor ends, and the daily rhythm flattens: the morning peak shrinks and the evening stays high.",
  "Day 5: chronic stress. Sleep worsens, blood sugar and blood pressure rise, immunity weakens, and the hippocampus can shrink. The same failed feedback shows in severe depression: in about 40 to 60 percent of inpatients, a dexamethasone test does not switch cortisol off.",
];

export function HpaLoop({ d }: { d: HpaLoopData }) {
  const reduce = useReducedMotion();
  const [mode, setMode] = React.useState<"day" | "chronic">(d.start ?? "day");
  const [choices, setChoices] = React.useState<Choice[]>([]);
  const [now, setNow] = React.useState(0);
  // the day waits at 7:00 until the student starts it
  const [leg, setLeg] = React.useState({ from: 0, to: 0 });
  const waiting = leg.to === 0;
  const target = leg.to;
  const [last, setLast] = React.useState<Choice | null>(null);
  const [days, setDays] = React.useState(0); // chronic: days shown
  const ms = useMissions(["day", "green", "avoid", "chronic", "broken"] as const);
  const state: DayState = { choices, feedback: 1, extraBase: 0 };
  const step = choices.length;
  const moving = now < target;
  const atEvent = !moving && step < EVENTS.length && now >= EVENTS[step].at;
  const ended = step >= EVENTS.length && !moving;

  // time runs forward on animation frames between events (instantly under reduced motion)
  React.useEffect(() => {
    let raf = 0;
    let t0 = -1;
    const tick = (t: number) => {
      if (t0 < 0) t0 = t;
      const x = reduce ? leg.to : Math.min(leg.to, leg.from + (t - t0) * 0.12);
      setNow(x);
      if (x < leg.to) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [leg, reduce]);

  const choose = (c: Choice) => {
    const next = [...choices, c];
    setChoices(next);
    setLast(c);
    setLeg({ from: EVENTS[next.length - 1].at + REACT, to: next.length < EVENTS.length ? EVENTS[next.length].at + REACT : DAY_END });
    if (c === "avoid") ms.mark("avoid");
    trackLearn({ type: "widget", kind: "hpaloop", item: c });
    if (next.length === EVENTS.length) {
      ms.mark("day");
      const load = stressLoad({ choices: next, feedback: 1, extraBase: 0 });
      if (load < GREEN) ms.mark("green");
      trackLearn({ type: "widget", kind: "hpaloop", score: Math.max(0, 1 - load / 3) });
    }
  };
  const restart = () => {
    setChoices([]);
    setNow(0);
    setLeg({ from: 0, to: 0 });
    setLast(null);
  };
  const startDay = () => {
    setLeg({ from: 0, to: EVENTS[0].at + REACT });
    trackLearn({ type: "widget", kind: "hpaloop", item: "start" });
  };
  const nextDay = () => {
    const k = Math.min(5, days + 1);
    setDays(k);
    ms.mark("chronic");
    if (k >= 4) ms.mark("broken");
  };

  const h = hormones(now, state);
  const load = stressLoad(state, now);
  const ev = step < EVENTS.length ? EVENTS[step] : null;
  const fbChronic = days ? [1, 0.8, 0.6, 0.42, 0.3][days - 1] : 1;
  const status = (() => {
    if (mode === "chronic") {
      return days === 0 ? "Chronic stress mode: the same hard day, five days running, with no recovery. Press Next day and watch the off switch." : CHRONIC[days - 1];
    }
    if (waiting) return "7:00. Press Start the day: the clock runs to the first event, then waits for your choice.";
    if (ended) return null;
    if (moving && now < 1) return null;
    if (atEvent && ev) return `${ev.title}: ${ev.scene} Adrenaline spikes within seconds through the sympathetic nerves; cortisol takes 20 to 30 minutes to peak, because it needs the slower chain: hypothalamus (CRH), pituitary (ACTH), adrenal cortex (cortisol). How do you cope?`;
    return `${clock(now)}. ${last ? EFFECT[last].say : ""}`;
  })();
  const grade = load < GREEN ? "green: you recovered well between stressors" : load < AMBER ? "amber: recovery was partial" : "red: the stress kept piling up";

  return (
    <SceneCard title={d.title ?? "A day of stress, played"} goal="Get through the day: pick how to cope after each event and keep your stress load in the green. Then run chronic stress and watch the loop fail." caption={d.caption}>
      <div className="mt-3 grid grid-cols-2 gap-1.5" role="group" aria-label="Mode">
        <button type="button" aria-pressed={mode === "day"} className={chip(mode === "day", "text-center")} onClick={() => setMode("day")}><Sun className="mr-1 inline size-4" aria-hidden />One day</button>
        <button type="button" aria-pressed={mode === "chronic"} className={chip(mode === "chronic", "text-center")} onClick={() => setMode("chronic")}><Moon className="mr-1 inline size-4" aria-hidden />Chronic stress</button>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_9.5rem]">
        {mode === "day" ? <DayChart state={state} now={now} /> : <ChronicChart days={days} />}
        <div className="grid grid-cols-[1fr_1fr] gap-2 sm:grid-cols-1">
          <Axis active={mode === "day" ? h.cort - h.base > 0.08 : days > 0} feedback={mode === "day" ? 1 : fbChronic} reduce={reduce} />
          <div className="space-y-2">
            <Meter label="Adrenaline" v={mode === "day" ? h.adr / 1.2 : 0.2 + days * 0.08} cls="bg-[var(--destructive)]" />
            <Meter label="Cortisol" v={mode === "day" ? h.cort / 1.4 : 0.3 + days * 0.11} cls="bg-[var(--brand)]" />
          </div>
        </div>
      </div>

      {mode === "day" ? (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-md border-2 border-foreground px-2 py-1 font-bold tabular-nums">{clock(now)}</span>
            <span className="font-semibold">Stress load: {load.toFixed(1)}</span>
            <span className="text-muted-foreground">(green below {GREEN})</span>
          </div>
          {waiting ? (
            <button type="button" className={cn(btn, "mt-3 min-h-12 bg-primary px-5 text-primary-foreground hover:-translate-y-0.5")} onClick={startDay}><Play className="size-4" aria-hidden /> Start the day</button>
          ) : null}
          {atEvent && ev ? (
            <div className="vibha-pop mt-3 rounded-xl border-2 border-foreground bg-[var(--status-pending-bg)] p-3">
              <p className="font-bold">{ev.title}</p>
              <p className="mt-1 text-[0.95rem]">{ev.scene}</p>
              <div className="mt-2 grid grid-cols-2 gap-1.5" role="group" aria-label="How do you cope?">
                {CHOICES.map((c) => (
                  <button key={c.id} type="button" className={cn(btn, "min-h-12 justify-start bg-card px-3 text-left text-sm hover:-translate-y-0.5")} onClick={() => choose(c.id)}>
                    {step === 3 ? c.night : c.day}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          {ended ? (
            <div className="vibha-pop mt-3 rounded-xl border-2 border-foreground p-3">
              <p className="font-bold">End of the day: stress load {stressLoad(state).toFixed(1)}, {grade}.</p>
              <p className="mt-1 text-[0.95rem]">
                {choices[3] === "rest" || choices[3] === "talk"
                  ? "A full night's sleep resets the system: tomorrow's cortisol will rise normally after waking and fall through the day."
                  : choices[3] === "avoid"
                    ? "Short sleep raises the next evening's cortisol and makes tomorrow's stress response stronger. One night will not harm you; many nights in a row will."
                    : "Hard exercise late at night keeps arousal up and delays sleep; earlier in the day it would have helped more."}
              </p>
              <button type="button" className={cn(btn, "mt-2 bg-card text-sm")} onClick={restart}><RotateCcw className="size-4" aria-hidden /> Play the day again</button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className={cn(btn, "bg-foreground text-background")} onClick={nextDay} disabled={days >= 5}><Play className="size-4" aria-hidden /> {days === 0 ? "Start day 1" : days >= 5 ? "Day 5 reached" : `Next day (${days + 1} of 5)`}</button>
          <button type="button" className={cn(btn, "bg-card text-sm")} onClick={() => setDays(0)}><RotateCcw className="size-4" aria-hidden /> Start over</button>
        </div>
      )}
      <div className={statusCls} role="status" aria-live="polite">
        {status ? <p>{status}</p> : null}
        {mode === "day" ? (
          <p className={status ? "mt-1" : undefined}>
            Now: adrenaline {level(h.adr / 1.2)}, cortisol {level(h.cort / 1.4)}{h.cort - h.base > 0.08 ? ", above its normal level for this time of day" : ", near its normal daily rhythm"}.
            {now === 0 ? " The day starts at 7:00: cortisol is already rising, as it does every morning in the half hour after waking." : ""}
          </p>
        ) : (
          <p className="mt-1">Feedback strength: {Math.round(fbChronic * 100)} percent{days >= 4 ? " (failing)" : ""}.</p>
        )}
      </div>
      <Missions
        doneText="All missions done: you have seen a stress response switch off, and what happens when it cannot."
        items={[
          { id: "day", label: "Get through the whole day", done: ms.done("day") },
          { id: "green", label: "Finish with the stress load in the green", done: ms.done("green") },
          { id: "avoid", label: "Try avoidance and watch the problem come back", done: ms.done("avoid") },
          { id: "chronic", label: "Run chronic stress mode", done: ms.done("chronic") },
          { id: "broken", label: "Watch the feedback loop fail (day 4)", done: ms.done("broken") },
        ]}
      />
    </SceneCard>
  );
}

export const GREEN = 0.8, AMBER = 1.6;
const level = (v: number) => (v > 0.6 ? "high" : v > 0.3 ? "raised" : "low");

function Meter({ label, v, cls }: { label: string; v: number; cls: string }) {
  const k = Math.max(0, Math.min(1, v));
  return (
    <div>
      <p className="flex justify-between text-xs font-semibold"><span>{label}</span><span>{level(k)}</span></p>
      <div className="mt-1 h-3 overflow-hidden rounded-full border-2 border-foreground bg-background" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(k * 100)}>
        <div className={cn("h-full origin-left", cls)} style={{ transform: `scaleX(${k})` }} />
      </div>
    </div>
  );
}

const CX = (t: number) => 34 + (t / DAY_END) * 262;
const CY = (v: number) => 128 - (v / 1.4) * 112;
function DayChart({ state, now }: { state: DayState; now: number }) {
  const pts: { c: string; a: string; b: string } = { c: "", a: "", b: "" };
  for (let t = 0; t <= DAY_END; t += 5) {
    const h = hormones(t, state);
    pts.b += `${CX(t).toFixed(1)},${CY(h.base).toFixed(1)} `;
    if (t <= now) {
      pts.c += `${CX(t).toFixed(1)},${CY(h.cort).toFixed(1)} `;
      pts.a += `${CX(t).toFixed(1)},${CY(h.adr).toFixed(1)} `;
    }
  }
  const h = hormones(now, state);
  return (
    <svg viewBox="0 0 320 166" className="w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={`Hormone levels through the day up to ${clock(now)}. Cortisol is the solid line, adrenaline the dashed line, the dotted line is the normal daily cortisol rhythm.`}>
      {[0, 240, 480, 720, 960].map((t) => (
        <g key={t}>
          <line x1={CX(t)} x2={CX(t)} y1="14" y2="128" className="stroke-foreground/10" />
          <text x={CX(t)} y="142" textAnchor="middle" className="fill-muted-foreground text-[10px]">{clock(t)}</text>
        </g>
      ))}
      {EVENTS.map((e) => (
        <g key={e.at}>
          <line x1={CX(e.at)} x2={CX(e.at)} y1="14" y2="128" className="stroke-foreground/40" strokeDasharray="2 3" />
          <text x={CX(e.at) + 2} y="12" className="fill-foreground text-[9px] font-semibold">{e.title.split(" · ")[1].replace("The ", "").replace("An ", "").replace("A ", "")}</text>
        </g>
      ))}
      <polyline points={pts.b} fill="none" className="stroke-foreground/40" strokeWidth="1.5" strokeDasharray="1 3" strokeLinecap="round" />
      <polyline points={pts.a} fill="none" className="stroke-[var(--destructive)]" strokeWidth="2" strokeDasharray="5 3" />
      <polyline points={pts.c} fill="none" className="stroke-[var(--brand)]" strokeWidth="2.75" strokeLinejoin="round" />
      <circle cx={CX(now)} cy={CY(h.cort)} r="4" className="fill-[var(--brand)] stroke-background" strokeWidth="1.5" />
      <text x="4" y={CY(1.2) + 3} className="fill-muted-foreground text-[9px]">high</text>
      <text x="4" y={CY(0.1) + 3} className="fill-muted-foreground text-[9px]">low</text>
      <line x1="34" x2="48" y1="157" y2="157" className="stroke-[var(--brand)]" strokeWidth="2.75" />
      <text x="52" y="160" className="fill-[var(--brand)] text-[10px] font-semibold">cortisol</text>
      <line x1="104" x2="118" y1="157" y2="157" className="stroke-[var(--destructive)]" strokeWidth="2" strokeDasharray="5 3" />
      <text x="122" y="160" className="fill-[var(--destructive)] text-[10px] font-semibold">adrenaline</text>
      <line x1="186" x2="200" y1="157" y2="157" className="stroke-foreground/40" strokeWidth="1.5" strokeDasharray="1 3" strokeLinecap="round" />
      <text x="204" y="160" className="fill-muted-foreground text-[10px]">normal rhythm</text>
    </svg>
  );
}

function ChronicChart({ days }: { days: number }) {
  const fb = [1, 0.8, 0.6, 0.42, 0.3];
  const lines = Array.from({ length: days }, (_, k) => {
    const s: DayState = { choices: ["avoid", "avoid", "avoid", "avoid"], feedback: fb[k], extraBase: k * 0.06 };
    let p = "";
    for (let t = 0; t <= DAY_END; t += 8) p += `${CX(t).toFixed(1)},${CY(hormones(t, s).cort).toFixed(1)} `;
    return p;
  });
  return (
    <svg viewBox="0 0 320 150" className="w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={`Cortisol through the day for ${days} days of chronic stress. Each day's line sits higher and flatter than the last.`}>
      {[0, 240, 480, 720, 960].map((t) => <text key={t} x={CX(t)} y="142" textAnchor="middle" className="fill-muted-foreground text-[10px]">{clock(t)}</text>)}
      {lines.map((p, k) => <polyline key={k} points={p} fill="none" className="stroke-[var(--brand)]" strokeWidth={k === days - 1 ? 3 : 1.5} style={{ opacity: 0.25 + (k + 1) / (days + 1) * 0.75 }} />)}
      {lines.map((_, k) => (k === 0 || k === days - 1) && <text key={k} x="314" y={CY(hormones(DAY_END, { choices: ["avoid", "avoid", "avoid", "avoid"], feedback: fb[k], extraBase: k * 0.06 }).cort) + 3} textAnchor="end" className="fill-foreground text-[9px] font-bold">Day {k + 1}</text>)}
      <text x="34" y="12" className="fill-muted-foreground text-[10px]">cortisol through each day</text>
      {days === 0 ? <text x="160" y="76" textAnchor="middle" className="fill-muted-foreground text-[11px]">Press Start day 1</text> : null}
    </svg>
  );
}

/** The HPA chain with negative feedback. */
function Axis({ active, feedback, reduce }: { active: boolean; feedback: number; reduce: boolean }) {
  const broken = feedback < 0.5;
  return (
    <svg viewBox="0 0 150 150" className="w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={`The HPA axis: hypothalamus, pituitary, adrenal cortex, with cortisol feeding back. ${active ? "Active now." : "Quiet."} ${broken ? "The feedback is failing." : "The feedback works."}`}>
      <style>{`@keyframes hpa-down { from { transform: translateY(0); opacity: 1 } to { transform: translateY(36px); opacity: 0 } } @keyframes hpa-up { from { transform: translateY(0); opacity: 1 } to { transform: translateY(-96px); opacity: 0 } }`}</style>
      {[["Hypothalamus", 22, "CRH"], ["Pituitary", 70, "ACTH"], ["Adrenal cortex", 118, "cortisol"]].map(([n, y, h]) => (
        <g key={n as string}>
          <rect x="8" y={(y as number) - 12} width="92" height="24" rx="6" className={cn("stroke-foreground", active ? "fill-[var(--status-success-bg)]" : "fill-card")} strokeWidth="1.5" />
          <text x="54" y={(y as number) + 4} textAnchor="middle" className="fill-foreground text-[9.5px] font-semibold">{n as string}</text>
          <text x="54" y={(y as number) + 26} textAnchor="middle" className="fill-muted-foreground text-[8px]">{h as string}{n === "Adrenal cortex" ? "" : " ↓"}</text>
        </g>
      ))}
      {active && !reduce ? [0, 1].map((k) => <circle key={k} cx="54" cy={36 + k * 48} r="3" className="fill-[var(--brand)]" style={{ animation: `hpa-down 900ms ${k * 300}ms linear infinite` }} />) : null}
      <path d="M100 118 H 128 V 22 H 104 M128 70 H 104" fill="none" className="stroke-[var(--destructive)]" strokeWidth="2" strokeDasharray={broken ? "3 4" : undefined} style={{ opacity: 0.25 + feedback * 0.75 }} />
      <path d="M108 18 l -5 4 l 5 4 M108 66 l -5 4 l 5 4" fill="none" className="stroke-[var(--destructive)]" strokeWidth="2" style={{ opacity: 0.25 + feedback * 0.75 }} />
      <text x="140" y="74" textAnchor="middle" className="fill-[var(--destructive)] text-[8px] font-bold" transform="rotate(90 140 74)">off switch</text>
      {active && !reduce && !broken ? <circle cx="128" cy="116" r="3" className="fill-[var(--destructive)]" style={{ animation: "hpa-up 1200ms linear infinite" }} /> : null}
      {broken ? <text x="128" y="50" textAnchor="middle" className="fill-[var(--destructive)] text-[16px] font-black">✕</text> : null}
    </svg>
  );
}
