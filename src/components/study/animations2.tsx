"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import type { CompareData, ConditioningData, MemoryFlowData, StressData, TimelineData } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { Rich } from "./rich";
import { trackLearn } from "@/lib/learn/track";
import { StepPicker } from "./pacing";
import { Arrow, C, E, HAND, Head, L, Label, P, R, Sheet, wrap } from "@/components/sketch/ink";
import { BOX, SketchFrame } from "@/components/sketch/frame";

/**
 * Animated explainers for core psychology processes: classical and operant
 * conditioning, the memory stores and the stress response (every step is
 * listed with its words; tapping one moves the picture), an order-the-events
 * task, and a side-by-side compare. Transform and opacity only, stops under
 * reduce-motion, and every state is written in words.
 */

const card = "rounded-2xl border-2 border-foreground bg-card p-4 sm:p-5 shadow-[var(--shadow-hard-sm)]";
const label = "text-xs font-semibold tracking-wide uppercase text-link";
const btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border-2 border-foreground px-4 font-semibold";

/* --------------------------------------------------------- conditioning */
const CLASSICAL = [
  { id: "before", name: "Before learning", text: "Food (an unconditioned stimulus) makes the dog salivate on its own. The bell means nothing yet: the dog just looks at it." },
  { id: "pair1", name: "Pairing", text: "The bell rings, and right after it the food arrives. Bell, then food. Bell, then food. The brain starts to link them." },
  { id: "pair2", name: "More pairings", text: "After several pairings, salivation begins a little earlier each time, starting when the bell rings rather than when the food arrives." },
  { id: "after", name: "After learning", text: "Now the bell alone brings salivation. The bell has become a conditioned stimulus, and the salivation to it is a conditioned response." },
  { id: "extinction", name: "Extinction", text: "Ring the bell many times with no food, and the response fades. It is not erased: it is held back by new learning, which is why it can return later (spontaneous recovery)." },
];

const OPERANT = [
  { id: "explore", name: "Trying things", text: "The rat moves around the box, sniffing and pressing things by accident. Nothing happens yet." },
  { id: "press", name: "A lucky press", text: "It presses the lever and a food pellet drops. Something good followed the action." },
  { id: "repeat", name: "Pressing more", text: "Presses that are followed by food become more frequent. This is positive reinforcement: adding something pleasant strengthens the behaviour." },
  { id: "schedule", name: "Not every time", text: "Food now arrives only after some presses, at unpredictable moments (a variable ratio). The rat presses faster and harder than before. This is the slot-machine pattern." },
  { id: "extinct", name: "Food stops", text: "No more food. Pressing bursts briefly (an extinction burst), then slowly fades. Behaviour learned on an unpredictable schedule fades the slowest." },
];

export function Conditioning({ d }: { d: ConditioningData }) {
  const classical = d.kind === "classical";
  const steps = classical ? CLASSICAL : OPERANT;
  const [i, setI] = React.useState(0);
  const cur = steps[i];
  const drool = classical ? [0, 0.15, 0.5, 1, 0.2][i] : 0;
  const pressRate = classical ? 0 : [0.1, 0.3, 0.7, 1, 0.25][i];
  return (
    <figure className={card}>
      <p className={label}>{d.title ? <Rich text={d.title} /> : classical ? "Classical conditioning" : "Operant conditioning"}</p>
      <Sheet name={classical ? "conditioning-classical" : "conditioning-operant"} w={380} h={210} label={`${cur.name}: ${cur.text}`} className="mx-auto mt-3 max-w-[32rem]">
        {classical ? (
          <>
            {/* bell */}
            <g key={i} style={{ transformOrigin: "62px 36px", animationIterationCount: 2 }} className={i >= 1 && i <= 4 ? "vibha-swing" : undefined}>
              <P k={`bell-${i >= 1}`} d="M44 74 C44 44 52 30 62 30 C72 30 80 44 80 74 Z" sw={2.2} fill={i >= 1 ? C.lime : C.paper} fillStyle={i >= 1 ? "hachure" : "solid"} gap={4} />
              <L k="bell-rim" x1={38} y1={74} x2={86} y2={74} sw={2.4} />
              <E k="bell-clapper" cx={62} cy={80} w={9} h={9} fill={C.ink} fillStyle="solid" sw={1} />
              <L k="bell-hang" x1={62} y1={30} x2={62} y2={20} sw={2} />
            </g>
            <Label x={62} y={106} size={15} anchor="middle">bell</Label>
            {/* food */}
            <g style={{ transform: `translateY(${i >= 1 && i <= 3 ? 0 : -40}px)`, opacity: i >= 1 && i <= 3 ? 1 : 0, transition: "transform 700ms var(--ease-out-expo), opacity 500ms" }}>
              <P k="bowl" d="M134 62 L190 62 C188 80 178 88 162 88 C146 88 136 80 134 62 Z" sw={2} fill={C.paper} fillStyle="solid" />
              <E k="food" cx={162} cy={60} w={50} h={14} fill={C.red} gap={3.5} sw={1.6} />
            </g>
            {i >= 1 && i <= 3 ? <Label x={162} y={108} size={15} anchor="middle">food</Label> : null}
            {/* dog */}
            <E k="dog-body" cx={292} cy={140} w={118} h={62} sw={2.2} fill={C.wash} fillStyle="solid" />
            <P k="dog-legs" d="M252 164 L250 192 M272 168 L272 194 M312 168 L314 194 M332 162 L336 190 M350 128 Q372 112 366 96" sw={2.2} single />
            <E k="dog-head" cx={244} cy={110} w={50} h={46} sw={2.2} fill={C.wash} fillStyle="solid" />
            <P k="dog-ear" d="M232 90 L222 66 L248 84" sw={2} fill={C.wash} fillStyle="solid" />
            <P k="dog-snout" d="M222 116 Q208 120 212 128 Q220 132 230 128" sw={1.8} single />
            <E k="dog-eye" cx={238} cy={104} w={5} h={5} fill={C.ink} fillStyle="solid" sw={1} />
            {[0, 1, 2].map((k) => (
              <ellipse key={k} cx={216 + k * 4} cy={140 + k * 14} rx={3.5} ry={4.5} fill={C.blue} style={{ opacity: drool > k / 3 ? 0.9 : 0, transform: `translateY(${drool > k / 3 ? 0 : -8}px)`, transition: "opacity 500ms, transform 500ms" }} />
            ))}
            <Label x={292} y={206} size={15} anchor="middle">{`salivation: ${Math.round(drool * 100)}%`}</Label>
          </>
        ) : (
          <>
            {/* the box */}
            <R k="box" x={20} y={40} w={240} h={140} sw={2.2} fill={C.wash} fillStyle="solid" />
            <g style={{ transform: `rotate(${pressRate > 0.2 ? -10 : 0}deg)`, transformOrigin: "40px 100px", transition: "transform 300ms" }}>
              <R k="lever" x={40} y={96} w={40} h={9} sw={1.6} fill={C.ink} fillStyle="solid" />
            </g>
            <Label x={60} y={128} size={14} anchor="middle">lever</Label>
            <R k="tray" x={40} y={146} w={44} h={22} sw={1.6} fill={C.paper} fillStyle="solid" />
            <ellipse cx={62} cy={157} rx={5} ry={5} fill={C.red} style={{ opacity: i >= 1 && i <= 3 ? 1 : 0, transition: "opacity 400ms" }} />
            <Label x={62} y={30} size={14} anchor="middle">food tray</Label>
            <L k="tray-lead" x1={62} y1={34} x2={62} y2={144} stroke={C.soft} sw={1} single dash="2 4" />
            {/* the rat */}
            <g style={{ transform: `translateX(${i === 0 ? 100 : 20}px)`, transition: "transform 900ms var(--ease-out-expo)" }}>
              <E k="rat-body" cx={120} cy={146} w={52} h={28} sw={2} fill={C.paper} fillStyle="solid" />
              <E k="rat-head" cx={96} cy={140} w={22} h={18} sw={2} fill={C.paper} fillStyle="solid" />
              <E k="rat-eye" cx={92} cy={137} w={3} h={3} fill={C.ink} fillStyle="solid" sw={1} />
              <P k="rat-tail" d="M146 148 Q170 136 180 154" sw={1.8} single />
            </g>
            {/* presses per minute */}
            {Array.from({ length: 10 }, (_, k) => {
              const h = Math.min(1, pressRate * (1 + (k % 3) * 0.15)) * 70;
              return <R key={`${k}-${i}`} k={`bar-${k}-${i}`} x={276 + k * 9.5} y={150 - h} w={7} h={Math.max(1, h)} stroke="none" fill={C.blue} gap={2.5} fw={1.6} style={{ opacity: k < pressRate * 10 + 1 ? 1 : 0.2 }} />;
            })}
            <L k="bars-base" x1={272} y1={150} x2={372} y2={150} sw={1.8} />
            <Label x={322} y={174} size={14} anchor="middle" lines={["presses", "per minute"]} />
          </>
        )}
      </Sheet>
      <StepPicker steps={steps} i={i} onPick={setI} kind="conditioning" />
      {d.caption ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={d.caption} /></figcaption> : null}
    </figure>
  );
}

/* ------------------------------------------------------------- memory */
const MEM_STEPS = [
  { id: "input", name: "Something happens", text: "A phone number is said aloud. Everything you sense enters the sensory register for a moment: a fraction of a second for sights, a few seconds for sounds." },
  { id: "attend", name: "Attention", text: "You attend to it, so it moves into short-term (working) memory. Anything you did not attend to simply fades from the sensory register." },
  { id: "hold", name: "Holding it", text: "Working memory keeps about four chunks for around 15 to 30 seconds unless you keep repeating it. Say the number in your head and it stays; get distracted and it goes." },
  { id: "encode", name: "Making it stick", text: "Repeating alone is weak. Linking it to meaning (a date you know, a pattern) encodes it into long-term memory, which has no known limit." },
  { id: "retrieve", name: "Recalling later", text: "Tomorrow you bring it back from long-term memory into working memory to dial it. Each recall strengthens the trace, which is why testing yourself beats rereading." },
];

export function MemoryFlow({ d }: { d: MemoryFlowData }) {
  const [i, setI] = React.useState(0);
  const cur = MEM_STEPS[i];
  const pos = [6, 150, 150, 300, 150][i];
  const boxes = [
    { x: 4, name: "Sensory register", sub: "under 1 to 4 s", on: i === 0 },
    { x: 155, name: "Working memory", sub: "about 4 chunks, 15 to 30 s", on: i === 1 || i === 2 || i === 4 },
    { x: 306, name: "Long-term memory", sub: "no known limit", on: i === 3 },
  ];
  return (
    <figure className={card}>
      <p className={label}>{d.title ? <Rich text={d.title} /> : "How a memory is stored"}</p>
      <Sheet name="memoryflow" w={400} h={194} label={`${cur.name}: ${cur.text}`} className="mx-auto mt-3 max-w-[32rem]">
        {boxes.map((b, k) => (
          <g key={b.name}>
            <R k={`mem-box-${k}-${b.on}`} x={b.x} y={40} w={90} h={96} sw={2} fill={b.on ? C.lime : C.paper} fillStyle="solid" />
            <Label x={b.x + 45} y={62} size={15} anchor="middle" lines={wrap(b.name, 82, 15)} color={b.on ? "var(--sk-on-lime)" : C.ink} />
            <Label x={b.x + 45} y={102} size={13} anchor="middle" bold={false} lines={wrap(b.sub, 82, 13, false)} color={b.on ? "var(--sk-on-lime)" : C.ink} />
          </g>
        ))}
        <Arrow k="m-att" from={[97, 92]} to={[152, 92]} />
        <Label x={125} y={84} size={13} anchor="middle" bold={false}>attention</Label>
        <Arrow k="m-enc" from={[248, 76]} to={[303, 76]} />
        <Label x={276} y={68} size={13} anchor="middle" bold={false}>encoding</Label>
        <Arrow k="m-ret" from={[303, 108]} to={[248, 108]} />
        <Label x={276} y={124} size={13} anchor="middle" bold={false}>retrieval</Label>
        <P k={`m-reh-${i === 2}`} d="M176 138 Q200 160 224 138" stroke={i === 2 ? C.blue : C.ink} sw={1.6} single dash="4 4" />
        <Head k="m-reh-h" x={176} y={138} a={-2.4} stroke={i === 2 ? C.blue : C.ink} size={7} sw={1.6} />
        <Label x={200} y={174} size={13} anchor="middle" bold={false}>rehearsal keeps it alive</Label>
        {[0, 1, 2].map((k) => (
          <ellipse key={k} cx={26 + k * 18} cy={146 + k * 5} rx={3.5} ry={3.5} fill={C.soft} style={{ opacity: i === 0 ? 1 - k * 0.3 : 0, transition: "opacity 700ms" }} />
        ))}
        {i === 0 ? <Label x={4} y={174} size={13} bold={false} color={C.soft} lines={["unattended", "items fade"]} /> : null}
        {/* the memory */}
        <g style={{ transform: `translate(${pos}px, 0px)`, transition: "transform 900ms var(--ease-out-expo)" }}>
          <R k="chip" x={14} y={8} w={52} h={22} sw={1.8} fill={C.lime} fillStyle="solid" />
          <text x={40} y={24} fontSize={13} fontWeight={700} textAnchor="middle" fill="var(--sk-on-lime)">98210</text>
        </g>
      </Sheet>
      <StepPicker steps={MEM_STEPS} i={i} onPick={setI} kind="memoryflow" />
      {d.caption ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={d.caption} /></figcaption> : null}
    </figure>
  );
}

/* -------------------------------------------------------------- stress */
const STRESS_STEPS = [
  { id: "threat", name: "A threat appears", text: "You see a snake, or a difficult exam paper. The amygdala tags it as a threat within a fraction of a second, before you have consciously thought about it." },
  { id: "fast", name: "The fast route", text: "The amygdala signals the hypothalamus, which fires the sympathetic nervous system. The adrenal glands release adrenaline: heart races, breathing quickens, pupils widen, digestion pauses. All within seconds." },
  { id: "slow", name: "The slow route", text: "The hypothalamus also releases CRH. This tells the pituitary to release ACTH into the blood, which tells the adrenal cortex to release cortisol. This takes minutes, and cortisol keeps energy high for longer." },
  { id: "feedback", name: "Switching off", text: "Cortisol feeds back to the hippocampus and hypothalamus, which lower CRH. The system brakes itself. The threat passes, and the parasympathetic system restores calm." },
  { id: "chronic", name: "When it never switches off", text: "Under lasting stress the brake wears out. Cortisol stays high, the hippocampus can shrink, sleep and immunity suffer, and the stage is set for depression and anxiety. This is the link between life stress and biology." },
];

export function StressResponse({ d }: { d: StressData }) {
  const [i, setI] = React.useState(0);
  const cur = STRESS_STEPS[i];
  const hr = [72, 125, 110, 80, 95][i];
  const cortisol = [0.1, 0.15, 0.8, 0.3, 0.9][i];
  const node = (name: string, x: number, y: number, w: number, on: boolean) => (
    <g key={name}>
      <R k={`s-node-${name}-${on}`} x={x} y={y} w={w} h={42} sw={2} fill={on ? C.lime : C.paper} fillStyle="solid" />
      <Label x={x + w / 2} y={y + 27} size={16} anchor="middle" color={on ? "var(--sk-on-lime)" : C.ink}>{name}</Label>
    </g>
  );
  return (
    <figure className={card}>
      <p className={label}>{d.title ? <Rich text={d.title} /> : "What stress does inside you"}</p>
      <Sheet name="stress" w={380} h={262} label={`${cur.name}: ${cur.text}`} className="mx-auto mt-3 max-w-[32rem]">
        {node("amygdala", 6, 14, 96, true)}
        {node("hypothalamus", 126, 14, 124, i >= 1)}
        {node("pituitary", 126, 108, 124, i >= 2)}
        {node("adrenal glands", 126, 202, 124, i >= 1)}
        <Arrow k={`s-a-h-${i >= 1}`} from={[104, 35]} to={[124, 35]} stroke={i >= 1 ? C.blue : C.ink} />
        <Arrow k={`s-h-p-${i >= 2}`} from={[188, 58]} to={[188, 106]} stroke={i >= 2 ? C.blue : C.ink} />
        <Label x={198} y={88} size={15}>CRH</Label>
        <Arrow k={`s-p-a-${i >= 2}`} from={[188, 152]} to={[188, 200]} stroke={i >= 2 ? C.blue : C.ink} />
        <Label x={198} y={182} size={15}>ACTH</Label>
        {/* the fast route: nerves to the adrenal glands and the heart */}
        <Arrow k={`s-symp-${i === 1}`} from={[252, 40]} to={[300, 62]} stroke={C.red} sw={i === 1 ? 2.4 : 1.6} dash="5 4" />
        <Label x={374} y={20} size={14} anchor="end" color={C.red} bold={false}>adrenaline</Label>
        {/* the brake */}
        <P k={`s-fb-${i === 3}`} d="M124 224 C88 224 84 160 92 118 C96 92 104 70 124 52" stroke={i >= 3 ? C.blue : C.soft} sw={i === 3 ? 2.2 : 1.4} single dash="4 4" style={{ opacity: i >= 3 ? 1 : 0.6 }} />
        <Head k="s-fb-h" x={124} y={52} a={-0.75} stroke={i >= 3 ? C.blue : C.soft} size={7} />
        <Label x={6} y={132} size={14} bold={false} lines={["cortisol", "feeds", "back"]} color={i >= 3 ? C.blue : C.soft} />
        {/* heart */}
        <g key={i} style={{ transformOrigin: "326px 80px", animationIterationCount: 3 }} className={hr > 90 ? "vibha-beat" : undefined}>
          <P k="heart" d="M326 104 C292 82 300 50 326 64 C352 50 360 82 326 104 Z" sw={2} fill={C.red} gap={4} />
        </g>
        <Label x={326} y={128} size={15} anchor="middle">{`${hr} beats/min`}</Label>
        {/* cortisol gauge */}
        <R k="gauge" x={306} y={146} w={40} h={80} sw={2} />
        <R k={`gauge-fill-${i}`} x={309} y={224 - cortisol * 74} w={34} h={cortisol * 74} stroke="none" fill={C.blue} gap={3.5} fw={1.6} />
        <Label x={326} y={250} size={15} anchor="middle">cortisol</Label>
      </Sheet>
      <StepPicker steps={STRESS_STEPS} i={i} onPick={setI} kind="stress" />
      {d.caption ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={d.caption} /></figcaption> : null}
    </figure>
  );
}

/* ------------------------------------------------------------- timeline */
/** A fixed shuffle of 0..n-1 that never comes out in the correct order (so there is always something to sort). */
export function shuffleOrder(n: number, seed: number): number[] {
  const out = Array.from({ length: n }, (_, i) => i).sort((a, b) => (((a + 1) * (seed | 1)) % 23) - (((b + 1) * (seed | 1)) % 23));
  if (n > 1 && out.every((v, i) => v === i)) out.push(out.shift()!);
  return out;
}
/** Place events in order (tap a card, then tap a slot), then check. Sorting is the learning, so this one stays a task. */
export function Timeline({ d }: { d: TimelineData }) {
  const seed = d.prompt.length;
  const order = React.useMemo(() => shuffleOrder(d.events.length, seed), [d.events.length, seed]);
  const [slots, setSlots] = React.useState<(number | null)[]>(() => d.events.map(() => null));
  const [held, setHeld] = React.useState<number | null>(null);
  const [checked, setChecked] = React.useState(false);
  const placed = new Set(slots.filter((x): x is number => x !== null));
  const right = slots.filter((v, i) => v === i).length;
  const place = (slot: number) => {
    if (held === null || checked) return;
    setSlots((s) => {
      const n = s.map((v) => (v === held ? null : v));
      n[slot] = held;
      return n;
    });
    setHeld(null);
  };
  return (
    <figure className={card}>
      <p className={label}>Put it in order</p>
      <p className="mt-2 font-semibold"><Rich text={d.prompt} /></p>
      <div className="mt-3 flex flex-wrap gap-2" aria-label="Cards">
        {order.filter((i) => !placed.has(i)).map((i) => (
          <button key={i} type="button" aria-pressed={held === i} onClick={() => setHeld(held === i ? null : i)} className={cn("min-h-11 rounded-md border-2 px-3 py-2 text-left text-[0.95rem] transition-transform duration-fast", held === i ? "-translate-y-0.5 border-foreground bg-primary text-primary-foreground shadow-[var(--shadow-hard-xs)]" : "border-foreground bg-card")}>
            <Rich text={d.events[i].label} />
          </button>
        ))}
      </div>
      <ol className="relative mt-5 space-y-2 border-l-4 border-foreground pl-4">
        {slots.map((v, k) => (
          <li key={k} className="relative">
            <span aria-hidden className={cn("absolute -left-[1.45rem] top-3 size-4 rounded-full border-2 border-foreground", v !== null ? "bg-brand" : "bg-card")} />
            <div
              role="button"
              tabIndex={0}
              onClick={() => place(k)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && place(k)}
              aria-label={`Slot ${k + 1}${d.events[k].when ? `, ${d.events[k].when}` : ""}`}
              className={cn("flex min-h-12 items-center gap-3 rounded-md border-2 border-dashed px-3 py-2", held !== null ? "border-foreground bg-muted" : "border-foreground/40", checked && v !== null && (v === k ? "border-solid border-status-success-fg bg-status-success-bg" : "border-solid border-status-alert-fg bg-status-alert-bg"))}
            >
              {d.events[k].when ? <span className="shrink-0 text-xs font-bold tabular-nums text-muted-foreground">{d.events[k].when}</span> : <span className="shrink-0 text-xs font-bold text-muted-foreground">{k + 1}.</span>}
              {v !== null ? (
                <button
                  type="button"
                  disabled={checked}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSlots((s) => s.map((x, i) => (i === k ? null : x)));
                  }}
                  className="text-left text-[0.95rem] font-semibold"
                >
                  <Rich text={d.events[v].label} />
                  {checked && v !== k ? <span className="block text-xs font-normal">Should be: <Rich text={d.events[k].label} /></span> : null}
                </button>
              ) : (
                <span className="text-sm text-muted-foreground">empty</span>
              )}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!checked ? (
          <button type="button" disabled={placed.size !== d.events.length} onClick={() => { setChecked(true); trackLearn({ type: "widget", kind: "timeline", ok: right === d.events.length, score: right / d.events.length, prompt: d.prompt }); }} className={cn(btn, "bg-foreground text-background disabled:opacity-40")}>Check the order</button>
        ) : (
          <>
            <p className="font-bold tabular-nums" role="status">{right} of {d.events.length} in the right place</p>
            <button type="button" onClick={() => { setSlots(d.events.map(() => null)); setChecked(false); }} className={cn(btn, "bg-card")}><RotateCcw className="size-4" aria-hidden /> Again</button>
          </>
        )}
      </div>
      {checked && d.why ? <p className="vibha-pop mt-3 rounded-xl bg-muted p-3 text-[0.95rem]"><Rich text={d.why} /></p> : null}
    </figure>
  );
}

/* -------------------------------------------------------------- compare */
/** Two states side by side: healthy vs depressed brain, before vs after treatment, novice vs expert. Hand-drawn boxes round real text. */
export function Compare({ d }: { d: CompareData }) {
  const side = (x: CompareData["a"], id: string) => (
    <div data-sk="box" data-sk-id={`cmp-${id}`} className={cn(BOX, "min-w-0 p-4")}>
      <p className="font-bold [overflow-wrap:anywhere]">
        <span data-sk="mark" data-sk-id={`cmp-mark-${id}`} data-sk-label="" className="text-[1.1rem] text-[var(--sk-ink)] group-data-drawn:text-[var(--sk-on-lime)]" style={{ fontFamily: HAND }}><Rich text={x.label} /></span>
      </p>
      <ul className="mt-2 space-y-1 text-[0.95rem]">
        {x.points.map((p, i) => (
          <li key={i} className="flex gap-2"><span aria-hidden className="font-bold text-[var(--sk-blue)]" style={{ fontFamily: HAND }}>-</span><span className="min-w-0 [overflow-wrap:anywhere]"><Rich text={p} /></span></li>
        ))}
      </ul>
      {x.summary ? <p data-sk="box" data-sk-id={`cmp-sum-${id}`} data-sk-tone="wash" className={cn(BOX, "mt-3 border-dashed p-2.5 text-[0.92rem] leading-relaxed")}><Rich text={x.summary} /></p> : null}
    </div>
  );
  return (
    <figure className={card}>
      {d.title ? <p className={label}><Rich text={d.title} /></p> : null}
      <SketchFrame salt={`cmp-${d.a.label.slice(0, 12)}`} className={d.title ? "mt-3" : undefined}>
        <div className="grid gap-3 sm:grid-cols-2">
          {side(d.a, "a")}
          {side(d.b, "b")}
        </div>
      </SketchFrame>
      {d.caption ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={d.caption} /></figcaption> : null}
    </figure>
  );
}
