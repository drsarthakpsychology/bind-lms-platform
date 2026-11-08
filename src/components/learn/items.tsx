"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import type { Item, MatchItem, McqItem, OrderItem, SortItem, TfItem } from "@/lib/learn/types";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import s from "./learn.module.css";
import { AnswerStamp, HalftoneCorner } from "@/components/reactions/graphics";

/** Same order on server and phone, different for every question. */
export function seeded<T>(list: readonly T[], seed: string): T[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    const j = Math.abs(h) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type Done = (correct: boolean, answerText: string) => void;

const optionBase =
  "relative flex w-full items-center gap-3 rounded-2xl border-2 border-foreground bg-card px-4 py-3 text-left text-base font-semibold hard-shadow-sm transition-transform duration-fast active:translate-y-0.5 disabled:cursor-default";
const keyBox = "grid size-7 shrink-0 place-items-center rounded-lg border-2 border-current font-pix text-[0.7rem]";

export function CheckButton({ disabled, onClick, label = "Check" }: { disabled?: boolean; onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="btn-sweep h-14 w-full rounded-2xl border-2 border-foreground bg-primary text-lg font-bold text-primary-foreground hard-shadow-md transition-transform active:translate-y-1 disabled:opacity-40 disabled:shadow-none"
    >
      {label}
    </button>
  );
}

/* ----------------------------------------------------------------- MCQ */
function Mcq({ item, locked, onDone }: { item: McqItem; locked: boolean; onDone: Done }) {
  const order = React.useMemo(() => seeded(item.options.map((o, i) => ({ o, i })), item.id), [item]);
  const [pick, setPick] = React.useState<number | null>(null);
  return (
    <div className="space-y-4">
      {item.vignette ? <p className="rounded-2xl border-2 border-dashed border-foreground/40 bg-muted px-4 py-3 text-sm">{item.vignette}</p> : null}
      <div className="relative isolate">
        <HalftoneCorner className="-top-3 size-24" />
        <h2 className="relative text-xl font-bold leading-tight sm:text-2xl">{item.prompt}</h2>
      </div>
      <div role="radiogroup" className="grid gap-2.5">
        {order.map(({ o, i }, k) => {
          const isAnswer = i === item.answer;
          const state = locked ? (isAnswer ? "right" : pick === i ? "wrong" : "idle") : pick === i ? "picked" : "idle";
          return (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={pick === i}
              disabled={locked}
              onClick={() => {
                haptic("tap");
                setPick(i);
              }}
              className={cn(
                optionBase,
                state === "picked" && "bg-brand text-brand-foreground",
                state === "right" && "bg-primary text-primary-foreground",
                state === "wrong" && cn("bg-foreground text-background", s.shake),
              )}
            >
              {locked && pick === i ? <AnswerStamp ok={isAnswer} /> : null}
              <span className={keyBox}>{state === "right" ? <Check className="size-4" /> : state === "wrong" ? <X className="size-4" /> : k + 1}</span>
              {o}
            </button>
          );
        })}
      </div>
      {!locked ? <CheckButton disabled={pick === null} onClick={() => onDone(pick === item.answer, item.options[item.answer])} /> : null}
    </div>
  );
}

/* ------------------------------------------------------------ True/false */
function TrueFalse({ item, locked, onDone }: { item: TfItem; locked: boolean; onDone: Done }) {
  const [pick, setPick] = React.useState<boolean | null>(null);
  return (
    <div className="space-y-5">
      <div className="relative isolate space-y-5">
        <HalftoneCorner className="-top-3 size-24" />
        <p className="relative text-eyebrow text-link">True or false?</p>
        <h2 className="relative text-xl font-bold leading-tight sm:text-2xl">{item.statement}</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[true, false].map((v) => {
          const state = locked ? (v === item.answer ? "right" : pick === v ? "wrong" : "idle") : "idle";
          return (
            <button
              key={String(v)}
              type="button"
              disabled={locked}
              onClick={() => {
                setPick(v);
                onDone(v === item.answer, item.answer ? "True" : "False");
              }}
              className={cn(
                "relative h-24 rounded-2xl border-2 border-foreground text-2xl font-bold hard-shadow-sm transition-transform active:translate-y-1",
                state === "right" ? "bg-primary text-primary-foreground" : state === "wrong" ? cn("bg-foreground text-background", s.shake) : "bg-card",
              )}
            >
              {locked && pick === v ? <AnswerStamp ok={v === item.answer} /> : null}
              {v ? "True" : "False"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- Match */
function Match({ item, locked, onDone }: { item: MatchItem; locked: boolean; onDone: Done }) {
  const right = React.useMemo(() => seeded(item.pairs.map((_, i) => i), item.id + "r"), [item]);
  const [pick, setPick] = React.useState<number | null>(null);
  const [done, setDone] = React.useState<number[]>([]);
  const [miss, setMiss] = React.useState<number | null>(null);
  const [mistakes, setMistakes] = React.useState(0);

  function chooseRight(i: number) {
    if (pick === null || locked || done.includes(i)) return;
    if (pick === i) {
      haptic("tap");
      const next = [...done, i];
      setDone(next);
      setPick(null);
      if (next.length === item.pairs.length) onDone(mistakes === 0, item.pairs.map((p) => `${p[0]} → ${p[1]}`).join(" · "));
    } else {
      haptic("warning");
      setMistakes((m) => m + 1);
      setMiss(i);
      setPick(null);
      setTimeout(() => setMiss(null), 450);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold leading-tight sm:text-2xl">{item.prompt}</h2>
      <p className="text-caption text-muted-foreground">Tap a term on the left, then its match. {mistakes ? `Mistakes: ${mistakes}` : ""}</p>
      <div lang="en" className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-2 sm:gap-2.5">
        <div className="grid gap-2.5">
          {item.pairs.map((p, i) => (
            <button
              key={p[0]}
              type="button"
              disabled={locked || done.includes(i)}
              aria-pressed={pick === i}
              onClick={() => setPick(pick === i ? null : i)}
              className={cn(
                "min-h-14 min-w-0 rounded-xl border-2 border-foreground px-2.5 py-2 text-left text-[0.8rem] leading-tight font-semibold [overflow-wrap:anywhere] hyphens-auto hard-shadow-sm transition-transform active:translate-y-0.5 sm:px-3 sm:text-sm",
                done.includes(i) ? "border-dashed bg-muted opacity-70 shadow-none" : pick === i ? "bg-brand text-brand-foreground" : "bg-primary text-primary-foreground",
              )}
            >
              {done.includes(i) ? "✓ " : ""}
              {p[0]}
            </button>
          ))}
        </div>
        <div className="grid gap-2.5">
          {right.map((i) => (
            <button
              key={item.pairs[i][1]}
              type="button"
              disabled={locked || done.includes(i)}
              onClick={() => chooseRight(i)}
              className={cn(
                "min-h-14 min-w-0 rounded-xl border-2 border-foreground bg-card px-2.5 py-2 text-left text-[0.8rem] leading-snug font-semibold [overflow-wrap:anywhere] hard-shadow-sm transition-transform active:translate-y-0.5 sm:px-3 sm:text-sm",
                done.includes(i) && "border-dashed bg-muted opacity-70 shadow-none",
                miss === i && cn("bg-foreground text-background", s.shake),
              )}
            >
              {item.pairs[i][1]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- Order */
function Order({ item, locked, onDone }: { item: OrderItem; locked: boolean; onDone: Done }) {
  const pool = React.useMemo(() => seeded(item.steps.map((t, i) => ({ t, i })), item.id), [item]);
  const [chosen, setChosen] = React.useState<number[]>([]);
  const full = chosen.length === item.steps.length;
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold leading-tight sm:text-2xl">{item.prompt}</h2>
      <ol className="grid gap-2">
        {chosen.map((i, k) => {
          const ok = locked ? i === k : null;
          return (
            <li key={i}>
              <button
                type="button"
                disabled={locked}
                onClick={() => setChosen(chosen.filter((x) => x !== i))}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border-2 border-foreground px-3 py-2.5 text-left text-sm font-bold",
                  ok === true ? "bg-primary text-primary-foreground" : ok === false ? "bg-foreground text-background" : "bg-brand text-brand-foreground",
                )}
              >
                <span className={keyBox}>{k + 1}</span>
                {item.steps[i]}
              </button>
            </li>
          );
        })}
        {!full
          ? Array.from({ length: item.steps.length - chosen.length }).map((_, k) => (
              <li key={`e${k}`} className="h-11 rounded-xl border-2 border-dashed border-foreground/30" aria-hidden />
            ))
          : null}
      </ol>
      {!locked ? (
        <div className="flex flex-wrap gap-2">
          {pool
            .filter(({ i }) => !chosen.includes(i))
            .map(({ t, i }) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  haptic("tap");
                  setChosen([...chosen, i]);
                }}
                className="rounded-xl border-2 border-foreground bg-card px-3 py-2 text-sm font-semibold hard-shadow-sm active:translate-y-0.5"
              >
                {t}
              </button>
            ))}
        </div>
      ) : null}
      {!locked ? (
        <CheckButton
          disabled={!full}
          onClick={() => onDone(chosen.every((v, k) => v === k), item.steps.map((t, k) => `${k + 1}. ${t}`).join("  "))}
        />
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ Sort */
function Sort({ item, locked, onDone }: { item: SortItem; locked: boolean; onDone: Done }) {
  const chips = React.useMemo(() => seeded(item.items.map(([t, b], i) => ({ t, b, i })), item.id), [item]);
  const [placed, setPlaced] = React.useState<Record<number, 0 | 1>>({});
  const full = Object.keys(placed).length === item.items.length;
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold leading-tight sm:text-2xl">{item.prompt}</h2>
      <ul className="grid gap-2">
        {chips.map(({ t, b, i }) => {
          const p = placed[i];
          const ok = locked ? p === b : null;
          return (
            <li key={t} className={cn("rounded-xl border-2 border-foreground bg-card p-2 pl-3", ok === false && s.shake)}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="min-w-0 flex-1 text-sm font-bold">
                  {ok === true ? "✓ " : ok === false ? "✗ " : ""}
                  {t}
                </span>
                {item.buckets.map((name, k) => (
                  <button
                    key={name}
                    type="button"
                    disabled={locked}
                    aria-pressed={p === k}
                    onClick={() => setPlaced({ ...placed, [i]: k as 0 | 1 })}
                    className={cn(
                      "rounded-full border-2 border-foreground px-3 py-1 text-xs font-bold transition-colors",
                      locked && b === k ? "bg-primary text-primary-foreground" : p === k ? (k ? "bg-foreground text-background" : "bg-brand text-brand-foreground") : "bg-background",
                    )}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
      {!locked ? (
        <CheckButton
          disabled={!full}
          onClick={() =>
            onDone(
              item.items.every(([, b], i) => placed[i] === b),
              item.buckets.map((name, k) => `${name}: ${item.items.filter((x) => x[1] === k).map((x) => x[0]).join(", ")}`).join(" · "),
            )
          }
        />
      ) : null}
    </div>
  );
}

export function ItemView({ item, locked, onDone }: { item: Item; locked: boolean; onDone: Done }) {
  switch (item.kind) {
    case "mcq":
      return <Mcq item={item} locked={locked} onDone={onDone} />;
    case "tf":
      return <TrueFalse item={item} locked={locked} onDone={onDone} />;
    case "match":
      return <Match item={item} locked={locked} onDone={onDone} />;
    case "order":
      return <Order item={item} locked={locked} onDone={onDone} />;
    case "sort":
      return <Sort item={item} locked={locked} onDone={onDone} />;
  }
}
