"use client";

import * as React from "react";
import { RotateCcw, Ruler } from "lucide-react";
import type { AttentionData, ConservationData, DissonanceData, ExperimentData, IllusionData } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { Rich } from "./rich";
import { trackLearn } from "@/lib/learn/track";
import type { StepPlayer } from "./pacing";

/**
 * Third wave of animated explainers: selective attention, cognitive
 * dissonance, Piaget's conservation tasks, a classic study replay and
 * perception illusions. The shared pieces (card, buttons, step player) are
 * exported for animations4.tsx. Transform and opacity only, stops under
 * reduce-motion, and every state is written in words.
 */

export const card = "rounded-2xl border-2 border-foreground bg-card p-4 sm:p-5 shadow-[var(--shadow-hard-sm)]";
export const label = "text-xs font-semibold tracking-wide uppercase text-link";
export const btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border-2 border-foreground px-4 font-semibold";
export const statusCls = "vibha-pop mt-3 rounded-xl bg-muted p-3 text-[0.95rem] leading-relaxed";

/** A choice button: pressed state is shown by fill and by aria-pressed. */
export function choiceCls(on: boolean) {
  return cn(
    "min-h-11 rounded-md border-2 border-foreground px-3 py-2 text-left text-sm font-semibold transition-transform duration-fast active:translate-x-px active:translate-y-px",
    on ? "bg-foreground text-background" : "bg-card hover:-translate-y-0.5",
  );
}

export function StepList({ names, st }: { names: string[]; st: StepPlayer }) {
  return (
    <ol className="mt-3 flex flex-wrap gap-1.5" aria-label="Steps">
      {names.map((s, k) => (
        <li key={s}>
          <button type="button" onClick={() => st.setI(k)} aria-current={k === st.i ? "step" : undefined} className={cn("min-h-11 rounded-md border-2 px-2.5 text-xs font-semibold sm:text-sm", k === st.i ? "border-foreground bg-foreground text-background" : k < st.i ? "border-foreground bg-card" : "border-foreground/25 bg-card text-muted-foreground")}>
            {k + 1}. {s}
          </button>
        </li>
      ))}
    </ol>
  );
}

function Caption({ text }: { text?: string }) {
  return text ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={text} /></figcaption> : null;
}

/* ------------------------------------------------------------ attention */
type AttModel = "early" | "attenuation" | "late";
const VOICES = {
  left: "The train to Pune leaves at six from platform two. Please keep your tickets ready.",
  right: "Add two cups of flour, then stir slowly until the mixture is smooth.",
};
const NAME_LINE = "So I said, hey, YOUR NAME, come and sit with us.";
const ATT_MODELS: { id: AttModel; name: string; text: string; nameText: string; through: string; nameThrough: string; dim: number }[] = [
  {
    id: "early",
    name: "Early filter (Broadbent)",
    text: "Broadbent's early filter: a filter picks one ear by physical features (which ear, which voice) before any meaning is worked out. The other message is blocked. You notice that a voice was there, and whether it was high or low, loud or soft, but not a single word.",
    nameText: "A strict early filter says you should miss your name, because it is blocked before meaning. Yet about a third of people do hear their own name in the ignored ear. This is the main problem for Broadbent's idea.",
    through: "Gets through: a voice, its pitch and loudness. No words.",
    nameThrough: "Your name is blocked at the filter (the theory says).",
    dim: 0.45,
  },
  {
    id: "attenuation",
    name: "Turned down (Treisman)",
    text: "Treisman's attenuation: the other ear is turned down, not switched off, like a volume knob. The weak message still reaches your store of words, but most words are too faint to notice. Words that matter a lot to you (your name, 'fire', 'help') and words that fit what you expect next need very little signal, so they still get through.",
    nameText: "Your name needs only a tiny signal to be recognised, so even the turned-down message is enough. It breaks through and you suddenly notice the other conversation.",
    through: "Gets through: a faint signal. Only very important words are noticed.",
    nameThrough: "Your name broke through.",
    dim: 0.65,
  },
  {
    id: "late",
    name: "Late selection (Deutsch and Deutsch)",
    text: "Deutsch and Deutsch's late selection: both messages are fully understood, without you being aware of it. The choice happens late, just before awareness and response: only the message that matters most right now reaches you. The cost is a lot of processing for messages you never use.",
    nameText: "Your name was understood along with everything else. Because it matters so much to you, it wins the late choice and enters awareness.",
    through: "Gets through: the meaning is worked out, but you are not aware of it.",
    nameThrough: "Your name was chosen for awareness.",
    dim: 0.8,
  },
];

function Ticker({ text, dim }: { text: string; dim: number }) {
  return (
    <div className="mt-1 overflow-hidden whitespace-nowrap text-sm transition-opacity duration-base" style={{ opacity: dim }} aria-hidden>
      <span className="vibha-ticker inline-block">
        {text}
        {"    "}
        <span className="vibha-ticker-dup">{text}{"    "}</span>
      </span>
    </div>
  );
}

/** Cocktail party: two voices, one ear attended, three theories of where selection happens. */
export function Attention({ d }: { d: AttentionData }) {
  const [ear, setEar] = React.useState<"left" | "right">("left");
  const [model, setModel] = React.useState<AttModel>("early");
  const [nameKey, setNameKey] = React.useState(0);
  const m = ATT_MODELS.find((x) => x.id === model)!;
  const other = ear === "left" ? "right" : "left";
  const named = nameKey > 0;
  // pipeline geometry
  const SX = [34, 124, 204, 286];
  const laneY = { left: 46, right: 80 };
  const un = (seg: 1 | 2 | 3) => {
    if (seg === 1) return 1;
    if (seg === 2) return model === "early" ? 0.12 : model === "attenuation" ? 0.4 : 1;
    return model !== "early" && named ? 1 : 0.12;
  };
  const stop = model === "early" ? SX[1] : SX[3];
  return (
    <figure className={card}>
      <p className={label}>{d.title ? <Rich text={d.title} /> : "The cocktail party: what gets through?"}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {(["left", "right"] as const).map((side) => {
          const on = ear === side;
          const text = !on && named ? NAME_LINE : VOICES[side];
          return (
            <div key={side} className={cn("rounded-xl border-2 p-2.5", on ? "border-foreground bg-background shadow-[var(--shadow-hard-xs)]" : "border-dashed border-foreground/60 bg-card")}>
              <p className="text-xs font-bold tracking-wide uppercase">{side === "left" ? "Left ear" : "Right ear"}: {on ? "listening" : "ignored"}</p>
              <Ticker key={text} text={text} dim={on ? 1 : m.dim} />
              <p className="sr-only">This voice says: {text}</p>
              <p className="mt-1.5 text-xs leading-snug">{on ? "Gets through: every word and its meaning." : named ? m.nameThrough : m.through}</p>
            </div>
          );
        })}
      </div>
      <svg viewBox="0 0 320 104" className="mt-3 w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={`${m.name}. Listening to the ${ear} ear. ${m.through}`}>
        {["Ears", "Filter", "Meaning", "Awareness"].map((n, k) => (
          <g key={n}>
            <rect x={SX[k] - 24} y="22" width="48" height="76" rx="6" className={cn("stroke-foreground", (model === "early" && k === 1) || (model === "attenuation" && k === 1) || (model === "late" && k === 3) ? "fill-[var(--status-alert-bg)]" : "fill-card")} strokeWidth="1.5" />
            <text x={SX[k]} y="15" textAnchor="middle" className="fill-foreground text-[10px] font-semibold">{n}</text>
          </g>
        ))}
        <text x="10" y={laneY.left + 3} className="fill-foreground text-[8px] font-bold">L</text>
        <text x="10" y={laneY.right + 3} className="fill-foreground text-[8px] font-bold">R</text>
        {(["left", "right"] as const).map((side) => {
          const att = side === ear;
          const y = laneY[side];
          const op = (s: 1 | 2 | 3) => (att ? 1 : un(s));
          return (
            <g key={side}>
              {[1, 2, 3].map((s) => (
                <line key={s} x1={SX[s - 1] + (s === 1 ? 0 : 24)} x2={SX[s] - 24} y1={y} y2={y} className="stroke-foreground" strokeWidth={att ? 4 : 2.5} strokeDasharray={!att && s === 2 && model === "attenuation" ? "3 3" : undefined} style={{ opacity: op(s as 1 | 2 | 3), transition: "opacity 400ms" }} />
              ))}
              {/* flowing pulses */}
              {[0, 1, 2].map((k) => (
                <circle key={`${side}-${model}-${ear}-${k}`} cx={SX[0]} cy={y} r={att ? 3.5 : 2.5} className="vibha-flow fill-[var(--brand)]" style={{ "--tx": `${(att ? SX[3] : model === "early" ? SX[1] - 24 : model === "attenuation" ? SX[2] : SX[2] + 10) - SX[0]}px`, "--dl": `${k * 0.8}s` } as React.CSSProperties} />
              ))}
            </g>
          );
        })}
        {/* where the selection happens, on the ignored lane */}
        {model === "early" ? <text x={SX[1] + 24} y={laneY[other] + 4} textAnchor="middle" className="fill-[var(--destructive)] text-[12px] font-bold">✕</text> : null}
        {model === "attenuation" ? <text x={SX[1]} y={laneY[other] + 14} textAnchor="middle" className="fill-foreground text-[8px] font-semibold">turned down</text> : null}
        {model === "late" ? <text x={SX[3] - 24} y={laneY[other] + 4} textAnchor="middle" className="fill-[var(--destructive)] text-[12px] font-bold" style={{ opacity: named ? 0 : 1 }}>✕</text> : null}
        <text x={SX[1]} y={laneY[ear] - 7} textAnchor="middle" className="fill-foreground text-[8px]">chosen ear</text>
        {/* the name travelling */}
        {named ? (
          <g key={nameKey} className="vibha-travel" style={{ "--tx": `${stop - SX[0]}px`, transform: `translateX(${stop - SX[0]}px)` } as React.CSSProperties}>
            <rect x={SX[0] - 16} y={laneY[other] - 8} width="32" height="16" rx="8" className="fill-[var(--primary)] stroke-foreground" strokeWidth="1.5" />
            <text x={SX[0]} y={laneY[other] + 3} textAnchor="middle" className="fill-foreground text-[8px] font-bold">name</text>
          </g>
        ) : null}
      </svg>
      <p className="mt-1 text-xs text-muted-foreground">Thick line: the ear you chose. Faint or cut line: the ignored ear.</p>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Which ear to listen to">
        {(["left", "right"] as const).map((side) => (
          <button key={side} type="button" aria-pressed={ear === side} className={choiceCls(ear === side)} onClick={() => { setEar(side); setNameKey(0); }}>
            Listen to the {side} ear
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Theory">
        {ATT_MODELS.map((x) => (
          <button key={x.id} type="button" aria-pressed={model === x.id} className={choiceCls(model === x.id)} onClick={() => { setModel(x.id); setNameKey(0); }}>
            {x.name}
          </button>
        ))}
      </div>
      <button type="button" className={cn(btn, "mt-2 bg-[var(--primary)] text-primary-foreground")} onClick={() => { setNameKey((k) => k + 1); trackLearn({ type: "widget", kind: "attention", item: model }); }}>
        Say your name in the ignored ear
      </button>
      <p className={statusCls} key={`${model}-${ear}-${named}`} role="status" aria-live="polite">
        <span className="font-semibold">{m.name}: </span>{m.text}
        {named ? <span className="mt-2 block font-semibold">Your name: <span className="font-normal">{m.nameText}</span></span> : null}
      </p>
      <Caption text={d.caption} />
    </figure>
  );
}

/* ----------------------------------------------------------- dissonance */
const DEFAULT_BELIEF = "Smoking causes cancer, and I want to stay healthy.";
const DEFAULT_BEHAVIOUR = "I smoke a pack of cigarettes a day.";
const WAYS = [
  { id: "behaviour", name: "Change the behaviour", level: 10, text: "Act in line with the belief. This removes the clash at its root, so the tension falls the most. It is also the hardest, which is why people often try the other three first.", ex: "I am going to quit.", card: "behaviour" },
  { id: "belief", name: "Change the belief", level: 25, text: "Change the belief so it no longer clashes. The tension falls, but the belief is now less accurate.", ex: "The cancer risk is exaggerated. My grandfather smoked and lived to 90.", card: "belief" },
  { id: "justify", name: "Add a justifying thought", level: 40, text: "Add a new thought that supports the behaviour. The clash is still there, but it feels outweighed.", ex: "Smoking calms my stress and keeps my weight down.", card: "extra" },
  { id: "trivial", name: "Make it seem unimportant", level: 35, text: "Tell yourself the clash does not matter much (trivialising). The tension eases, though the facts have not changed.", ex: "Everyone dies of something. Life is for enjoying.", card: "extra" },
] as const;

const PAID = [
  { id: "one", name: "Paid $1", score: 1.35, text: "Paid $1 to tell the next person the dull task was fun. $1 is not enough reason to lie, so the clash between 'it was boring' and 'I said it was fun' stays. They reduced it by changing the belief: later they rated the task as more enjoyable than either other group did." },
  { id: "twenty", name: "Paid $20", score: -0.05, text: "Paid $20, a lot of money at the time. The money explains the lie, so there is little dissonance and no need to change the belief. They rated the task about as dull as people who told no lie." },
  { id: "control", name: "Told no lie", score: -0.45, text: "Did the same dull task but told no lie. Their rating shows how boring the task really was." },
] as const;

function Meter({ level }: { level: number }) {
  const word = level >= 70 ? "high" : level >= 30 ? "medium" : level > 0 ? "low" : "none";
  return (
    <svg viewBox="0 0 70 170" className="w-full" role="img" aria-label={`Tension ${word}, ${level} of 100`}>
      <rect x="20" y="10" width="30" height="130" rx="15" className="fill-card stroke-foreground" strokeWidth="2" />
      <rect x="24" y="14" width="22" height="122" rx="11" className="fill-[var(--destructive)]" style={{ transform: `scaleY(${level / 100})`, transformBox: "fill-box", transformOrigin: "50% 100%", transition: "transform 900ms var(--ease-out-expo)" }} />
      <text x="35" y="156" textAnchor="middle" className="fill-foreground text-[9px] font-bold">tension</text>
      <text x="35" y="167" textAnchor="middle" className="fill-foreground text-[9px] tabular-nums">{level} ({word})</text>
    </svg>
  );
}

/** Belief and behaviour clash, a tension meter rises; pick a way to reduce it. Plus the $1 or $20 study. */
export function Dissonance({ d }: { d: DissonanceData }) {
  const custom = !!(d.belief || d.behaviour);
  const belief = d.belief ?? DEFAULT_BELIEF;
  const behaviour = d.behaviour ?? DEFAULT_BEHAVIOUR;
  const [phase, setPhase] = React.useState(0);
  const [way, setWay] = React.useState<string | null>(null);
  const [paid, setPaid] = React.useState<string | null>(null);
  const w = WAYS.find((x) => x.id === way);
  const level = phase === 0 ? 0 : w ? w.level : 85;
  const p = PAID.find((x) => x.id === paid);
  const changed = (which: string) => w && w.card === which;
  const exText = (fallback: string) => (custom ? fallback : w?.ex ?? fallback);
  return (
    <figure className={card}>
      <p className={label}>{d.title ? <Rich text={d.title} /> : "Cognitive dissonance: feel the clash"}</p>
      <div className="mt-3 grid grid-cols-[1fr_4.5rem] items-center gap-3 sm:grid-cols-[1fr_5.5rem]">
        <div key={phase === 1 && !w ? "clash" : "calm"} className={cn("space-y-2", phase === 1 && !w ? "vibha-shake" : "")}>
          <div className="rounded-xl border-2 border-foreground bg-background p-3">
            <p className="text-xs font-bold tracking-wide uppercase">Belief</p>
            <p className={cn("mt-1 text-[0.95rem]", changed("belief") && "line-through opacity-60")}><Rich text={belief} /></p>
            {changed("belief") ? <p className="vibha-pop mt-1 text-[0.95rem] font-semibold">New belief: {exText("I change my belief so it fits what I do.")}</p> : null}
          </div>
          <div className="rounded-xl border-2 border-foreground bg-background p-3 transition-[opacity,transform] duration-slow" style={{ opacity: phase === 0 ? 0 : 1, transform: phase === 0 ? "translateY(-12px)" : "none" }} aria-hidden={phase === 0}>
            <p className="text-xs font-bold tracking-wide uppercase">Behaviour</p>
            <p className={cn("mt-1 text-[0.95rem]", changed("behaviour") && "line-through opacity-60")}><Rich text={behaviour} /></p>
            {changed("behaviour") ? <p className="vibha-pop mt-1 text-[0.95rem] font-semibold">New behaviour: {exText("I change what I do so it fits the belief.")}</p> : null}
          </div>
          {changed("extra") ? (
            <div className="vibha-pop rounded-xl border-2 border-dashed border-foreground bg-[var(--status-info-bg)] p-3">
              <p className="text-xs font-bold tracking-wide uppercase">{w!.id === "justify" ? "Added thought" : "Shrinking it"}</p>
              <p className="mt-1 text-[0.95rem]">{exText(w!.id === "justify" ? "I add a reason that makes the behaviour seem fine." : "I tell myself it does not really matter.")}</p>
            </div>
          ) : null}
        </div>
        <Meter level={level} />
      </div>
      {phase === 0 ? (
        <button type="button" className={cn(btn, "mt-3 bg-foreground text-background")} onClick={() => { setPhase(1); trackLearn({ type: "widget", kind: "dissonance" }); }}>Now add the behaviour</button>
      ) : (
        <div className="mt-3 grid gap-2 sm:grid-cols-2" role="group" aria-label="Ways to reduce the tension">
          {WAYS.map((x) => (
            <button key={x.id} type="button" aria-pressed={way === x.id} className={choiceCls(way === x.id)} onClick={() => setWay(x.id)}>{x.name}</button>
          ))}
        </div>
      )}
      {phase === 1 ? (
        <button type="button" className={cn(btn, "mt-2 bg-card")} onClick={() => { setPhase(0); setWay(null); }}><RotateCcw className="size-4" aria-hidden /> Start again</button>
      ) : null}
      <p className={statusCls} key={`${phase}-${way}`} role="status" aria-live="polite">
        {phase === 0 ? (
          <><span className="font-semibold">Just the belief: </span>No clash yet, so no tension. Add the behaviour to see what happens.</>
        ) : !w ? (
          <><span className="font-semibold">The clash: </span>What you do goes against what you believe. Holding both at once feels uncomfortable. Festinger called this cognitive dissonance, and people are driven to reduce it. Tension is high (85 of 100). Pick a way to reduce it.</>
        ) : (
          <><span className="font-semibold">{w.name}: </span>{w.text} Tension falls to {w.level} of 100.</>
        )}
      </p>
      <div className="mt-4 rounded-xl border-2 border-foreground bg-background p-3">
        <p className="text-sm font-bold">Festinger&apos;s $1 or $20 study</p>
        <p className="mt-1 text-sm">People did a very boring task, then were paid to tell the next person it was fun. Who later said they enjoyed it more?</p>
        <svg viewBox="0 0 320 52" className="mt-2 w-full" role="img" aria-label={p ? `${p.name}: rated about ${p.score > 0 ? "plus " : ""}${p.score.toFixed(1)} on a scale from minus 5 to plus 5` : "Enjoyment scale from minus 5 to plus 5"}>
          <line x1="20" x2="300" y1="30" y2="30" className="stroke-foreground" strokeWidth="2" />
          {[-5, 0, 5].map((v) => (
            <g key={v}>
              <line x1={160 + v * 28} x2={160 + v * 28} y1="25" y2="35" className="stroke-foreground" strokeWidth="1.5" />
              <text x={160 + v * 28} y="47" textAnchor={v === -5 ? "start" : v === 5 ? "end" : "middle"} className="fill-foreground text-[9px]">{v === -5 ? "-5 very boring" : v === 5 ? "+5 very enjoyable" : "0"}</text>
            </g>
          ))}
          {p ? (
            <g style={{ transform: `translateX(${p.score * 28}px)`, transition: "transform 700ms var(--ease-out-expo)" }}>
              <path d="M160 24 l-6 -10 h12 z" className="fill-[var(--primary)] stroke-foreground" strokeWidth="1.5" />
              <text x="160" y="9" textAnchor="middle" className="fill-foreground text-[8px] font-bold">{p.name}</text>
            </g>
          ) : null}
        </svg>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Which group">
          {PAID.map((x) => (
            <button key={x.id} type="button" aria-pressed={paid === x.id} className={choiceCls(paid === x.id)} onClick={() => setPaid(x.id)}>{x.name}</button>
          ))}
        </div>
        <p className={statusCls} key={paid ?? "none"} role="status" aria-live="polite">
          {p ? <><span className="font-semibold">{p.name}: </span>{p.text}</> : "Tap a group to see how much they later said they enjoyed the task."}
        </p>
      </div>
      <Caption text={d.caption} />
    </figure>
  );
}

/* --------------------------------------------------------- conservation */
const CONS_REASONS = {
  pre: [
    { id: "centration", name: "Centration", text: "Centration: the child fixes on one feature only (how high the water is, or how long the row is) and ignores the other (how wide, or how spread out)." },
    { id: "irreversible", name: "Cannot reverse it", text: "The child cannot yet run the action backwards in their head, so they do not see that undoing it would give exactly what was there before." },
    { id: "looks", name: "Looks decide", text: "How it looks wins over how it is. Taller or longer looks like more, so to the child it is more." },
  ],
  concrete: [
    { id: "identity", name: "Identity", text: "Identity: nothing was added and nothing was taken away, so it must be the same amount." },
    { id: "reversibility", name: "Reversibility", text: "Reversibility: undo the action (pour it back, or push the coins together) and it will look just as before." },
    { id: "compensation", name: "Compensation", text: "" },
  ],
};

/** Piaget's conservation of liquid (pour into a tall glass) or number (spread out a row of coins). */
export function Conservation({ d }: { d: ConservationData }) {
  const liquid = d.kind !== "number";
  const [done, setDone] = React.useState(false);
  const [stage, setStage] = React.useState<"pre" | "concrete">("pre");
  const [reason, setReason] = React.useState<string | null>(null);
  const [pourKey, setPourKey] = React.useState(0);
  const reasons = CONS_REASONS[stage].map((r) => (r.id === "compensation" ? { ...r, text: liquid ? "Compensation: the water is taller, but it is also thinner. One change makes up for the other." : "Compensation: the row is longer, but the gaps between coins are bigger. One change makes up for the other." } : r));
  const r = reasons.find((x) => x.id === reason);
  const answer = !done
    ? liquid
      ? "Both short glasses hold the same amount. Ask: same, or different? Both children say the same."
      : "Two rows of 6 coins, lined up. Ask: same, or different? Both children say the same."
    : stage === "pre"
      ? liquid
        ? "The younger child (preoperational, about 2 to 7 years) says: \"The tall one has more, because it is higher.\""
        : "The younger child (preoperational, about 2 to 7 years) says: \"The bottom row has more, because it is longer.\""
      : liquid
        ? "The older child (concrete operational, about 7 to 11 years) says: \"It is still the same. You only poured it.\""
        : "The older child (concrete operational, about 7 to 11 years) says: \"Still the same. You just spread them out.\"";
  const toggle = () => {
    setDone((x) => !x);
    setReason(null);
    setPourKey((k) => k + 1);
    trackLearn({ type: "widget", kind: "conservation", item: liquid ? "liquid" : "number" });
  };
  const water = "fill-[var(--status-info-fg)]";
  return (
    <figure className={card}>
      <p className={label}>{d.title ? <Rich text={d.title} /> : liquid ? "Piaget's water glasses" : "Piaget's row of coins"}</p>
      {liquid ? (
        <svg viewBox="0 -30 320 210" className="mt-3 w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={done ? "Glass B has been poured into a tall thin glass. The water is higher but the glass is thinner." : "Two identical short wide glasses, A and B, with the same amount of water, and an empty tall thin glass."}>
          {/* glass A */}
          <rect x="32" y="120" width="66" height="40" className={water} opacity="0.55" />
          <path d="M30 100 V160 H100 V100" fill="none" className="stroke-foreground" strokeWidth="2.5" />
          <text x="65" y="174" textAnchor="middle" className="fill-foreground text-[9px] font-bold">A</text>
          {/* glass B, poured */}
          <g style={{ transformBox: "view-box", transformOrigin: "190px 100px", transform: done ? "translate(46px,-60px) rotate(65deg)" : "none", transition: "transform 900ms var(--ease-out-expo)" }}>
            <rect x="122" y="120" width="66" height="40" className={water} opacity="0.55" style={{ transformBox: "fill-box", transformOrigin: "50% 100%", transform: done ? "scaleY(0)" : "none", transition: "transform 900ms var(--ease-out-expo) 250ms" }} />
            <path d="M120 100 V160 H190 V100" fill="none" className="stroke-foreground" strokeWidth="2.5" />
          </g>
          <text x="155" y="174" textAnchor="middle" className="fill-foreground text-[9px] font-bold" style={{ opacity: done ? 0 : 1, transition: "opacity 300ms" }}>B</text>
          {/* stream */}
          {pourKey > 0 && done ? <rect key={pourKey} x="241" y="40" width="4" height="118" className={cn(water, "vibha-stream")} /> : null}
          {/* tall glass */}
          <rect x="242" y="58.5" width="26" height="101.5" className={water} opacity="0.55" style={{ transformBox: "fill-box", transformOrigin: "50% 100%", transform: done ? "none" : "scaleY(0)", transition: "transform 900ms var(--ease-out-expo) 350ms" }} />
          <path d="M240 30 V160 H270 V30" fill="none" className="stroke-foreground" strokeWidth="2.5" />
          <text x="255" y="174" textAnchor="middle" className="fill-foreground text-[9px] font-bold">{done ? "B, now tall" : "tall glass"}</text>
        </svg>
      ) : (
        <svg viewBox="0 0 320 170" className="mt-3 w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={done ? "The bottom row of 6 coins has been spread out so it is longer. The top row still has 6 coins close together." : "Two rows of 6 coins, lined up one above the other."}>
          {[0, 1].map((row) =>
            Array.from({ length: 6 }, (_, k) => (
              <g key={`${row}-${k}`} style={{ transform: row === 1 && done ? `translateX(${(k - 2.5) * 22}px)` : "none", transition: `transform 800ms var(--ease-out-expo) ${k * 40}ms` }}>
                <circle cx={85 + k * 30} cy={row === 0 ? 55 : 120} r="11" className="fill-[var(--primary)] stroke-foreground" strokeWidth="2" />
              </g>
            )),
          )}
          <text x="20" y="58" className="fill-foreground text-[9px] font-bold">top</text>
          <text x="20" y="123" className="fill-foreground text-[9px] font-bold">bottom</text>
          <text x="160" y="160" textAnchor="middle" className="fill-muted-foreground text-[8px]">6 coins in each row</text>
        </svg>
      )}
      <button type="button" className={cn(btn, "mt-3 bg-foreground text-background")} onClick={toggle}>
        {liquid ? (done ? "Pour it back" : "Pour B into the tall glass") : done ? "Push them back together" : "Spread out the bottom row"}
      </button>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Which child">
        <button type="button" aria-pressed={stage === "pre"} className={choiceCls(stage === "pre")} onClick={() => { setStage("pre"); setReason(null); }}>Younger child (preoperational)</button>
        <button type="button" aria-pressed={stage === "concrete"} className={choiceCls(stage === "concrete")} onClick={() => { setStage("concrete"); setReason(null); }}>Older child (concrete operational)</button>
      </div>
      {done ? (
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="The thinking behind the answer">
          {reasons.map((x) => (
            <button key={x.id} type="button" aria-pressed={reason === x.id} className={choiceCls(reason === x.id)} onClick={() => setReason(x.id)}>{x.name}</button>
          ))}
        </div>
      ) : null}
      <p className={statusCls} key={`${done}-${stage}-${reason}`} role="status" aria-live="polite">
        {answer}
        {done && !r ? " Tap a reason to see the thinking." : null}
        {r ? <span className="mt-2 block">{r.text}</span> : null}
      </p>
      <Caption text={d.caption} />
    </figure>
  );
}

/* ----------------------------------------------------------- experiment */
/** Replay a classic study: predict each condition with a slider, then reveal the real result. */
export function Experiment({ d }: { d: ExperimentData }) {
  const max = d.max ?? (d.unit === "%" ? 100 : Math.ceil((Math.max(...d.conditions.map((c) => c.value)) * 1.3) / 10) * 10);
  const [guess, setGuess] = React.useState<number[]>(() => d.conditions.map(() => Math.round(max / 2)));
  const [shown, setShown] = React.useState(false);
  const err = d.conditions.reduce((a, c, i) => a + Math.abs(c.value - guess[i]), 0) / d.conditions.length;
  const rank = (xs: number[]) => xs.map((x) => xs.filter((y) => y > x).length).join(",");
  const pattern = rank(guess) === rank(d.conditions.map((c) => c.value));
  const fmt = (v: number) => `${Math.round(v)}${d.unit === "%" ? "%" : ` ${d.unit}`}`;
  const reveal = () => {
    setShown(true);
    trackLearn({ type: "widget", kind: "experiment", ok: pattern, score: Math.max(0, 1 - err / max), prompt: d.question });
  };
  return (
    <figure className={card}>
      <p className={label}><Rich text={d.title} /></p>
      <p className="mt-2 font-semibold"><Rich text={d.question} /></p>
      <p className="mt-1 text-sm text-muted-foreground">{shown ? "Your guess is the dashed line; the bar is what really happened." : "Drag each slider to your prediction, then reveal."}</p>
      <ul className="mt-3 space-y-3">
        {d.conditions.map((c, i) => (
          <li key={i} className="rounded-xl border-2 border-foreground bg-background p-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-semibold"><Rich text={c.label} /></span>
              <span className="text-sm tabular-nums">{shown ? <>You: {fmt(guess[i])}. <b>Real: {fmt(c.value)}</b></> : <>Your guess: {fmt(guess[i])}</>}</span>
            </div>
            {!shown ? (
              <input type="range" min={0} max={max} value={guess[i]} onChange={(e) => setGuess((g) => g.map((x, k) => (k === i ? Number(e.target.value) : x)))} className="mt-2 h-11 w-full accent-[var(--brand)]" aria-label={`Your guess for ${c.label}`} aria-valuetext={fmt(guess[i])} />
            ) : (
              <>
                <div className="relative mt-2 h-7 overflow-hidden rounded-md border-2 border-foreground bg-card" aria-hidden>
                  <div className="vibha-grow absolute inset-y-0 left-0 bg-[var(--brand)]" style={{ width: `${(c.value / max) * 100}%`, animationDelay: `${i * 150}ms` }} />
                  <div className="absolute inset-y-0 w-0 border-l-[3px] border-dashed border-foreground" style={{ left: `${(guess[i] / max) * 100}%` }} />
                </div>
                {c.note ? <p className="vibha-pop mt-1.5 text-sm"><Rich text={c.note} /></p> : null}
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-2">
        {!shown ? (
          <button type="button" className={cn(btn, "bg-foreground text-background")} onClick={reveal}>Reveal the real result</button>
        ) : (
          <button type="button" className={cn(btn, "bg-card")} onClick={() => setShown(false)}><RotateCcw className="size-4" aria-hidden /> Guess again</button>
        )}
      </div>
      <p className={statusCls} key={String(shown)} role="status" aria-live="polite">
        {!shown ? (
          "Set a guess for every condition, then reveal what the study found."
        ) : (
          <>
            <span className="font-semibold">{pattern ? "You got the pattern right. " : "The pattern was different from your guess. "}</span>
            On average you were {fmt(err)} away from the real result.{d.why ? <> <Rich text={d.why} /></> : null}
          </>
        )}
      </p>
    </figure>
  );
}

/* ------------------------------------------------------------- illusion */
type IllusionKind = IllusionData["kind"];
const ILLUSIONS: Record<IllusionKind, { title: string; ask: string; options: string[]; seen: number; result: string; why: string; measure: string }> = {
  "muller-lyer": {
    title: "The Muller-Lyer lines",
    ask: "Which line is longer?",
    options: ["The top line", "The bottom line", "They are the same"],
    seen: 0,
    result: "Measured: both lines are exactly the same length (140 units). Only the fins differ.",
    why: "Why: your brain reads the fins as depth cues. Fins pointing out look like the inside corner of a room, which is further away. Fins pointing in look like the outside corner of a building, which is nearer. A line that seems further away but makes the same size image on the eye must be bigger, so the brain stretches it. This is size constancy used where it does not belong. In some studies the illusion is weaker in people who grew up with few straight-edged buildings.",
    measure: "Measure the lines",
  },
  ponzo: {
    title: "The Ponzo rails",
    ask: "Which bar is longer?",
    options: ["The top bar", "The bottom bar", "They are the same"],
    seen: 0,
    result: "Measured: both bars are exactly the same length (80 units).",
    why: "Why: lines that come together read as a road or railway going into the distance (linear perspective). The top bar seems further away. Something far away that still makes the same size image on the eye must be bigger, so your brain enlarges it. Size constancy normally helps you: a person walking away does not seem to shrink.",
    measure: "Measure the bars",
  },
  ebbinghaus: {
    title: "The Ebbinghaus circles",
    ask: "Which orange centre circle is bigger?",
    options: ["The left one", "The right one", "They are the same"],
    seen: 1,
    result: "Measured: both centre circles are exactly the same size (28 units across).",
    why: "Why: the brain judges size by comparing with what is nearby, not by measuring. Next to big circles the centre looks small; next to small circles it looks big. Context changes what we see.",
    measure: "Measure the circles",
  },
  "figure-ground": {
    title: "Vase or faces?",
    ask: "What do you see first?",
    options: ["A vase", "Two faces", "Both at the same time"],
    seen: -1,
    result: "Flip it and watch: the same edge makes a vase when the middle is the figure, and two faces when the sides are the figure.",
    why: "Why: the brain splits every scene into a figure (the thing) and a ground (the background behind it). A shared edge can belong to only one side at a time, so you see the vase or the faces and flip between them, but never both at once. Gestalt psychologists described this as figure and ground.",
    measure: "Flip figure and ground",
  },
};

// right half of the vase edge (offset from the centre line), top to bottom
const VASE = [[58, 18], [46, 30], [40, 48], [40, 58], [30, 64], [20, 72], [30, 80], [26, 88], [30, 94], [24, 100], [34, 108], [24, 118], [32, 128], [42, 142], [60, 164]];
function smooth(pts: number[][]) {
  let s = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    s += ` Q${x} ${y} ${(x + nx) / 2} ${(y + ny) / 2}`;
  }
  const last = pts[pts.length - 1];
  return s + ` L${last[0]} ${last[1]}`;
}
const VASE_PATH = (() => {
  const right = VASE.map(([o, y]) => [160 + o, y]);
  const left = [...VASE].reverse().map(([o, y]) => [160 - o, y]);
  return smooth(right) + " L" + smooth(left).slice(1) + " Z";
})();

/** Perception illusions with a judge, then measure, step. */
export function Illusion({ d }: { d: IllusionData }) {
  const kind: IllusionKind = ILLUSIONS[d.kind] ? d.kind : "muller-lyer";
  const il = ILLUSIONS[kind];
  const [pick, setPick] = React.useState<number | null>(null);
  const [measured, setMeasured] = React.useState(false);
  const [flip, setFlip] = React.useState(0);
  const fg = kind === "figure-ground";
  const judge = (k: number) => {
    setPick(k);
    trackLearn({ type: "widget", kind: "illusion", item: kind, ok: fg ? k !== 2 : k === 2 });
  };
  const ruler = "fill-[var(--brand)]";
  const show = measured ? 1 : 0;
  const pickText = pick === null
    ? `${il.ask} Trust your eyes and pick one.`
    : fg
      ? pick === 2
        ? "Most people find they cannot hold both at once: one pops out and the other becomes background. Try flipping it."
        : `You saw ${pick === 0 ? "a vase" : "two faces"} first. Keep looking and it will flip.`
      : pick === il.seen
        ? `Most people see it the same way you did. Now measure.`
        : pick === 2
          ? "You said they are the same. Most people's eyes say otherwise, even when they know the trick. Now measure."
          : "Most people see it the other way round. Now measure.";
  return (
    <figure className={card}>
      <p className={label}>{d.title ? <Rich text={d.title} /> : il.title}</p>
      <svg viewBox="0 0 320 180" className="mt-3 w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={measured ? il.result : `${il.title}. ${il.ask}`}>
        {kind === "muller-lyer" ? (
          <g className="stroke-foreground" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M90 55 H230 M90 55 l-20 -16 M90 55 l-20 16 M230 55 l20 -16 M230 55 l20 16" />
            <path d="M90 125 H230 M90 125 l20 -16 M90 125 l20 16 M230 125 l-20 -16 M230 125 l-20 16" />
            <g style={{ opacity: show, transition: "opacity 400ms" }} strokeWidth="1.5" strokeDasharray="3 3">
              <line x1="90" x2="90" y1="30" y2="150" />
              <line x1="230" x2="230" y1="30" y2="150" />
            </g>
          </g>
        ) : null}
        {kind === "ponzo" ? (
          <>
            <path d="M120 10 L 40 172 M200 10 L 280 172" className="stroke-foreground" strokeWidth="3" fill="none" />
            {Array.from({ length: 7 }, (_, k) => {
              const y = 22 + k * 23;
              const half = 40 + (y - 10) * 0.494;
              return <line key={k} x1={160 - half + 6} x2={160 + half - 6} y1={y} y2={y} className="stroke-foreground/30" strokeWidth={1 + k * 0.3} />;
            })}
            <rect x="120" y="44" width="80" height="9" className="fill-[var(--primary)] stroke-foreground" strokeWidth="1.5" />
            <rect x="120" y="140" width="80" height="9" className="fill-[var(--primary)] stroke-foreground" strokeWidth="1.5" />
            <g style={{ opacity: show, transition: "opacity 400ms" }} className="stroke-foreground" strokeWidth="1.5" strokeDasharray="3 3">
              <line x1="120" x2="120" y1="36" y2="158" />
              <line x1="200" x2="200" y1="36" y2="158" />
            </g>
          </>
        ) : null}
        {kind === "ebbinghaus" ? (
          <>
            {Array.from({ length: 6 }, (_, k) => {
              const a = (k / 6) * Math.PI * 2;
              return <circle key={`b${k}`} cx={80 + Math.cos(a) * 46} cy={90 + Math.sin(a) * 46} r="21" className="fill-[var(--muted)] stroke-foreground" strokeWidth="1.5" />;
            })}
            {Array.from({ length: 8 }, (_, k) => {
              const a = (k / 8) * Math.PI * 2;
              return <circle key={`s${k}`} cx={240 + Math.cos(a) * 24} cy={90 + Math.sin(a) * 24} r="6" className="fill-[var(--muted)] stroke-foreground" strokeWidth="1.5" />;
            })}
            <circle cx="80" cy="90" r="14" className="fill-[var(--primary)] stroke-foreground" strokeWidth="2" />
            <circle cx="240" cy="90" r="14" className="fill-[var(--primary)] stroke-foreground" strokeWidth="2" />
            <g style={{ opacity: show, transition: "opacity 400ms" }} className="stroke-foreground" strokeWidth="1.5" strokeDasharray="3 3">
              <line x1="20" x2="300" y1="76" y2="76" />
              <line x1="20" x2="300" y1="104" y2="104" />
            </g>
          </>
        ) : null}
        {fg ? (
          <>
            <g style={{ opacity: flip % 2 === 0 ? 1 : 0, transition: "opacity 500ms" }}>
              <rect x="0" y="0" width="320" height="180" className="fill-background" />
              <path d={VASE_PATH} className="fill-foreground" />
            </g>
            <g style={{ opacity: flip % 2 === 1 ? 1 : 0, transition: "opacity 500ms" }}>
              <rect x="0" y="0" width="320" height="180" className="fill-foreground" />
              <path d={VASE_PATH} className="fill-background" />
            </g>
            <rect x="0" y="0" width="320" height="18" className="fill-background" />
            <rect x="0" y="164" width="320" height="16" className="fill-background" />
            <text x="160" y="176" textAnchor="middle" className="fill-foreground text-[8px] font-semibold">{measured ? (flip % 2 === 0 ? "figure: the vase (dark)" : "figure: two faces (dark)") : ""}</text>
          </>
        ) : null}
        {/* ruler overlay */}
        {!fg ? (
          <g style={{ opacity: show, transform: measured ? "none" : "translateY(6px)", transition: "opacity 400ms, transform 500ms var(--ease-out-expo)" }}>
            {kind === "muller-lyer" ? (
              <>
                <rect x="90" y="74" width="140" height="6" className={ruler} />
                <rect x="90" y="144" width="140" height="6" className={ruler} />
                <text x="160" y="94" textAnchor="middle" className="fill-foreground text-[9px] font-bold">140</text>
                <text x="160" y="164" textAnchor="middle" className="fill-foreground text-[9px] font-bold">140</text>
              </>
            ) : kind === "ponzo" ? (
              <>
                <rect x="120" y="58" width="80" height="5" className={ruler} />
                <rect x="120" y="154" width="80" height="5" className={ruler} />
                <text x="216" y="52" className="fill-foreground text-[9px] font-bold">80</text>
                <text x="216" y="150" className="fill-foreground text-[9px] font-bold">80</text>
              </>
            ) : (
              <>
                <rect x="66" y="162" width="28" height="4" className={ruler} />
                <rect x="226" y="162" width="28" height="4" className={ruler} />
                <text x="80" y="177" textAnchor="middle" className="fill-foreground text-[9px] font-bold">28</text>
                <text x="240" y="177" textAnchor="middle" className="fill-foreground text-[9px] font-bold">28</text>
              </>
            )}
          </g>
        ) : null}
        {kind === "muller-lyer" || kind === "ponzo" ? (
          <>
            <text x="12" y={kind === "ponzo" ? 52 : 59} className="fill-foreground text-[9px] font-bold">top</text>
            <text x="12" y={kind === "ponzo" ? 148 : 129} className="fill-foreground text-[9px] font-bold">bottom</text>
          </>
        ) : kind === "ebbinghaus" ? (
          <>
            <text x="80" y="16" textAnchor="middle" className="fill-foreground text-[9px] font-bold">left</text>
            <text x="240" y="16" textAnchor="middle" className="fill-foreground text-[9px] font-bold">right</text>
          </>
        ) : null}
      </svg>
      <p className="mt-3 font-semibold">{il.ask}</p>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label={il.ask}>
        {il.options.map((o, k) => (
          <button key={o} type="button" aria-pressed={pick === k} className={choiceCls(pick === k)} onClick={() => judge(k)}>{o}</button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pick === null}
          className={cn(btn, "bg-foreground text-background disabled:opacity-40")}
          onClick={() => {
            if (fg) setFlip((f) => f + 1);
            setMeasured(true);
          }}
        >
          <Ruler className="size-4" aria-hidden /> {il.measure}
        </button>
        {measured ? (
          <button type="button" className={cn(btn, "bg-card")} onClick={() => { setMeasured(false); setPick(null); setFlip(0); }}><RotateCcw className="size-4" aria-hidden /> Try again</button>
        ) : null}
      </div>
      <p className={statusCls} key={`${pick}-${measured}-${flip}`} role="status" aria-live="polite">
        {measured ? <><span className="font-semibold">{il.result} </span>{il.why}</> : pickText}
      </p>
      <Caption text={d.caption} />
    </figure>
  );
}
