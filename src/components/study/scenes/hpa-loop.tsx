"use client";

import * as React from "react";
import { Moon, Play, RotateCcw, Sun } from "lucide-react";
import type { HpaLoopData } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { trackLearn } from "@/lib/learn/track";
import { SceneCard, btn, chip, statusCls, useReducedMotion } from "./kit";
import { C, Cv, L, Label, P, R, Sheet, labelWidth } from "@/components/sketch/ink";

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
    trackLearn({ type: "widget", kind: "hpaloop", item: c });
    if (next.length === EVENTS.length) {
      const load = stressLoad({ choices: next, feedback: 1, extraBase: 0 });
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
  };

  const h = hormones(now, state);
  const load = stressLoad(state, now);
  const ev = step < EVENTS.length ? EVENTS[step] : null;
  const fbChronic = days ? [1, 0.8, 0.6, 0.42, 0.3][days - 1] : 1;
  const status = (() => {
    if (mode === "chronic") {
      return days === 0 ? "Chronic stress: the same hard day, again and again, with no recovery." : CHRONIC[days - 1];
    }
    if (waiting) return "7:00. A normal day is about to start.";
    if (ended) return null;
    if (moving && now < 1) return null;
    if (atEvent && ev) return `${ev.title}: ${ev.scene} Adrenaline spikes within seconds through the sympathetic nerves; cortisol takes 20 to 30 minutes to peak, because it needs the slower chain: hypothalamus (CRH), pituitary (ACTH), adrenal cortex (cortisol). How do you cope?`;
    return `${clock(now)}. ${last ? EFFECT[last].say : ""}`;
  })();
  const grade = load < GREEN ? "green: you recovered well between stressors" : load < AMBER ? "amber: recovery was partial" : "red: the stress kept piling up";

  return (
    <SceneCard title={d.title ?? "A day of stress, played"} caption={d.caption}>
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
          <button type="button" className={cn(btn, "bg-foreground text-background")} onClick={nextDay} disabled={days >= 5}><Play className="size-4" aria-hidden /> {days === 0 ? "Start day 1" : days >= 5 ? "Last day reached" : `Next day (day ${days + 1})`}</button>
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
const evName = (e: Ev) => e.title.split(" \u00b7 ")[1].replace("The ", "").replace("An ", "").replace("A ", "");

/** Hours, events, the scale and the key: drawn once, not every frame. */
const DayGrid = React.memo(function DayGrid() {
  return (
    <>
      {[0, 240, 480, 720, 960].map((t) => (
        <g key={t}>
          <L k={`hd-v${t}`} x1={CX(t)} x2={CX(t)} y1={18} y2={128} stroke={C.soft} sw={0.8} single rough={0.3} style={{ opacity: 0.4 }} />
          <Label x={CX(t)} y={143} size={12} anchor="middle" bold={false} color={C.soft}>{clock(t)}</Label>
        </g>
      ))}
      {EVENTS.map((e) => (
        <g key={e.at}>
          <L k={`hd-e${e.at}`} x1={CX(e.at)} x2={CX(e.at)} y1={18} y2={128} stroke={C.ink} sw={1} single dash="2 4" style={{ opacity: 0.6 }} />
          <Label x={Math.min(316 - labelWidth(evName(e), 12) / 2, CX(e.at))} y={13} size={12} anchor="middle">{evName(e)}</Label>
        </g>
      ))}
      <Label x={4} y={CY(1.2) + 4} size={11} bold={false} color={C.soft}>high</Label>
      <Label x={4} y={CY(0.1) + 4} size={11} bold={false} color={C.soft}>low</Label>
      <L k="hd-k1" x1={34} x2={48} y1={157} y2={157} stroke={C.blue} sw={2.6} single />
      <Label x={52} y={161} size={12} color={C.blue}>cortisol</Label>
      <L k="hd-k2" x1={108} x2={122} y1={157} y2={157} stroke={C.red} sw={2} single dash="5 3" />
      <Label x={126} y={161} size={12} color={C.red}>adrenaline</Label>
      <L k="hd-k3" x1={196} x2={210} y1={157} y2={157} stroke={C.soft} sw={1.5} single dash="1 3" />
      <Label x={214} y={161} size={12} bold={false} color={C.soft}>normal rhythm</Label>
    </>
  );
});

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
    <Sheet className="mx-auto max-w-[34rem]" name="hpa-day" w={320} h={168} label={`Hormone levels through the day up to ${clock(now)}. Cortisol is the solid line, adrenaline the dashed line, the dotted line is the normal daily cortisol rhythm.`}>
      <DayGrid />
      <polyline points={pts.b} fill="none" stroke={C.soft} strokeWidth={1.5} strokeDasharray="1 3" strokeLinecap="round" />
      <polyline points={pts.a} fill="none" stroke={C.red} strokeWidth={2} strokeDasharray="5 3" strokeLinejoin="round" />
      <polyline points={pts.c} fill="none" stroke={C.blue} strokeWidth={2.75} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={CX(now)} cy={CY(h.cort)} r="4" fill={C.lime} stroke={C.ink} strokeWidth={1.5} />
    </Sheet>
  );
}

function ChronicChart({ days }: { days: number }) {
  const fb = [1, 0.8, 0.6, 0.42, 0.3];
  const lines = Array.from({ length: days }, (_, k) => {
    const s: DayState = { choices: ["avoid", "avoid", "avoid", "avoid"], feedback: fb[k], extraBase: k * 0.06 };
    const p: [number, number][] = [];
    for (let t = 0; t <= DAY_END; t += 24) p.push([CX(t), CY(hormones(t, s).cort)]);
    return p;
  });
  const endY = (k: number) => CY(hormones(DAY_END, { choices: ["avoid", "avoid", "avoid", "avoid"], feedback: fb[k], extraBase: k * 0.06 }).cort) + 4;
  const ends = lines.map((_, k) => k).filter((k) => k === 0 || k === days - 1);
  return (
    <Sheet className="mx-auto max-w-[34rem]" name="hpa-chronic" w={320} h={150} label={`Cortisol through the day for ${days} days of chronic stress. Each day's line sits higher and flatter than the last.`}>
      {[0, 240, 480, 720, 960].map((t) => <Label key={t} x={CX(t)} y={143} size={12} anchor="middle" bold={false} color={C.soft}>{clock(t)}</Label>)}
      {lines.map((p, k) => <Cv key={k} k={`hc-${k}`} pts={p} stroke={C.blue} sw={k === days - 1 ? 2.8 : 1.4} single rough={0.4} style={{ opacity: 0.25 + ((k + 1) / (days + 1)) * 0.75 }} />)}
      {ends.map((k, j) => {
        // When the first and last day end close together, the first one's name moves above the last one's.
        const y = j === 0 && ends.length > 1 && Math.abs(endY(k) - endY(ends[1])) < 14 ? endY(ends[1]) + 14 : endY(k);
        return <Label key={k} x={316} y={y} size={12} anchor="end">{`Day ${k + 1}`}</Label>;
      })}
      <Label x={34} y={14} size={12} bold={false} color={C.soft}>cortisol through each day</Label>
    </Sheet>
  );
}

/** The HPA chain with negative feedback. */
const AxisStatic = React.memo(function AxisStatic({ active, feedback }: { active: boolean; feedback: number }) {
  const broken = feedback < 0.5;
  const op = 0.25 + feedback * 0.75;
  return (
    <>
      {([["Hypothalamus", 22, "CRH"], ["Pituitary", 70, "ACTH"], ["Adrenal cortex", 118, "cortisol"]] as const).map(([n, y, h]) => (
        <g key={n}>
          <R k={`ax-${n}-${active}`} x={6} y={y - 13} w={100} h={26} sw={1.6} fill={active ? C.lime : C.paper} fillStyle="solid" />
          <Label x={56} y={y + 5} size={12} anchor="middle" color={active ? "var(--sk-on-lime)" : C.ink}>{n}</Label>
          <Label x={56} y={y + 26} size={11} anchor="middle" bold={false} color={C.soft}>{`${h}${n === "Adrenal cortex" ? "" : " \u2193"}`}</Label>
        </g>
      ))}
      <P k={`ax-fb-${broken}`} d="M106 118 H 128 V 22 H 110 M128 70 H 110" stroke={C.red} sw={2} single dash={broken ? "3 4" : undefined} style={{ opacity: op }} />
      <P k="ax-fb-h" d="M114 17 l -5 5 l 5 5 M114 65 l -5 5 l 5 5" stroke={C.red} sw={2} single style={{ opacity: op }} />
      <Label x={134} y={90} size={11} color={C.red} lines={["off", "switch"]} />
      {broken ? <P k="ax-x" d="M122 44 l12 12 M134 44 l-12 12" stroke={C.red} sw={2.6} single /> : null}
    </>
  );
});

function Axis({ active, feedback, reduce }: { active: boolean; feedback: number; reduce: boolean }) {
  const broken = feedback < 0.5;
  return (
    <Sheet name="hpa-axis" w={170} h={150} label={`The HPA axis: hypothalamus, pituitary, adrenal cortex, with cortisol feeding back. ${active ? "Active now." : "Quiet."} ${broken ? "The feedback is failing." : "The feedback works."}`}>
      <style>{`@keyframes hpa-down { from { transform: translateY(0); opacity: 1 } to { transform: translateY(36px); opacity: 0 } } @keyframes hpa-up { from { transform: translateY(0); opacity: 1 } to { transform: translateY(-96px); opacity: 0 } }`}</style>
      <AxisStatic active={active} feedback={feedback} />
      {active && !reduce ? [0, 1].map((k) => <circle key={k} cx="56" cy={36 + k * 48} r="3" fill={C.blue} style={{ animation: `hpa-down 900ms ${k * 300}ms linear infinite` }} />) : null}
      {active && !reduce && !broken ? <circle cx="128" cy="116" r="3" fill={C.red} style={{ animation: "hpa-up 1200ms linear infinite" }} /> : null}
    </Sheet>
  );
}
