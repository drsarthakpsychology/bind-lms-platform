"use client";

import * as React from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { BookOpen, Check, CircleDot, LayoutGrid, LoaderCircle, Shuffle, Undo2, Users, X } from "lucide-react";
import { emptyState, type LearnState } from "@/lib/learn/engine";
import { initLearnStore, useLearnState } from "@/lib/learn/store";
import { trackLearn } from "@/lib/learn/track";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { MAX_TRIES, type Tier } from "@/lib/games/sort/engine";
import { CountUp } from "@/lib/games/ui/count-up";
import { awardXp } from "@/lib/games/ui/xp";
import { btnPrimary, btnSecondary, card, chip } from "@/lib/games/ui/styles";
import fx from "@/lib/games/ui/fx.module.css";
import { checkSort, loadSort, type SortReveal, type SortView } from "./actions";

const EMPTY = emptyState();
type Save = (s: LearnState) => Promise<unknown>;

type Play = {
  view: SortView;
  placement: (number | null)[];
  picks: (string | null)[];
  locked: boolean[];
  oneAway: number[];
  thresholdWrong: number[];
  tries: number;
  done: SortReveal | null;
  message: string | null;
};

function fresh(view: SortView): Play {
  return { view, placement: Array(16).fill(null), picks: [null, null, null, null], locked: Array(4).fill(!!view.done?.solved), oneAway: [], thresholdWrong: [], tries: view.triesUsed, done: view.done, message: null };
}

export function SortGame({ serverState, save, initial }: { serverState: LearnState | null; save: Save; initial: { ok: true; view: SortView } | { ok: false; error: string } }) {
  initLearnStore(serverState, save);
  const state = useLearnState(serverState ?? EMPTY);
  const [play, setPlay] = React.useState<Play | null>(initial.ok ? fresh(initial.view) : null);
  const [error, setError] = React.useState<string | null>(initial.ok ? null : initial.error);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [pending, startTransition] = React.useTransition();
  const [shake, setShake] = React.useState(0);
  const [gain, setGain] = React.useState(0);
  const reduce = useReducedMotion();
  const anim = (cls: string) => (reduce === false ? cls : undefined);

  function load(mode: "daily" | "practice", tier: Tier) {
    setError(null);
    setSelected(null);
    startTransition(async () => {
      const r = await loadSort({ mode, tier });
      if (!r.ok) setError(r.error);
      else {
        setPlay(fresh(r.view));
        setGain(0);
      }
    });
  }

  const p = play;
  const v = p?.view;
  const allPlaced = !!p && p.placement.every((x) => x !== null);
  const picksDone = !!p && (!v?.thresholds || p.picks.every((x, g) => x !== null || p.locked[g]));

  const place = React.useCallback(
    (g: number) => {
      if (selected === null || !p || p.done || p.locked[g]) return;
      const count = p.placement.filter((x, i) => x === g && i !== selected).length;
      if (count >= 4) {
        setPlay({ ...p, message: "That group already has 4. Tap one of its tiles to move it out." });
        return;
      }
      const placement = [...p.placement];
      placement[selected] = g;
      setPlay({ ...p, placement, message: null, oneAway: [] });
      setSelected(null);
      haptic("tap");
    },
    [selected, p],
  );

  function unplace(i: number) {
    if (!p) return;
    const placement = [...p.placement];
    placement[i] = null;
    setPlay({ ...p, placement });
    setSelected(null);
  }

  const submit = React.useCallback(() => {
    if (!p || !v || p.done || !allPlaced || !picksDone || pending) return;
    setError(null);
    startTransition(async () => {
      const r = await checkSort({ mode: v.mode, tier: v.tier, boardId: v.boardId, placement: p.placement, picks: p.picks, tries: p.tries + 1 });
      if (!r.ok) {
        setError(r.error);
        return;
      }
      const newlyDone = r.groupsDone.filter((x, g) => x && !p.locked[g]).length;
      let message: string | null = null;
      if (!r.done) {
        const bits = [];
        if (newlyDone) bits.push(`${newlyDone} new group${newlyDone > 1 ? "s" : ""} right.`);
        if (r.oneAway.length) bits.push(`One away: ${r.oneAway.map((g) => v.groups[g]).join(", ")}.`);
        if (r.thresholdWrong.length) bits.push(`Tiles right, but check the time rule for ${r.thresholdWrong.map((g) => v.groups[g]).join(", ")}.`);
        if (!bits.length) bits.push("No group fully right yet.");
        message = `${bits.join(" ")} ${MAX_TRIES - r.triesUsed} ${MAX_TRIES - r.triesUsed === 1 ? "try" : "tries"} left.`;
        haptic(newlyDone ? "success" : "warning");
        if (!newlyDone) setShake((k) => k + 1);
      } else {
        haptic(r.done.solved ? "success" : "warning");
        for (let g = 0; g < 4; g++) trackLearn({ type: "game", kind: "criteria-sort", ok: r.groupsDone[g], skill: `${r.done.topic}:differentiate`, item: `${v.boardId}:${g}`, prompt: v.groups[g] });
        if (r.xp > 0) {
          if (!r.xpSaved) awardXp(r.xp, state);
          setGain(r.xp);
        }
      }
      setPlay({ ...p, locked: r.groupsDone, oneAway: r.oneAway, thresholdWrong: r.thresholdWrong, tries: r.triesUsed, done: r.done, message, view: { ...v, cohort: r.cohort ?? v.cohort } });
    });
  }, [p, v, allPlaced, picksDone, pending, state]);

  // Desktop shortcuts: 1–4 place the selected tile, Enter checks.
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (n >= 1 && n <= 4 && selected !== null) {
        e.preventDefault();
        place(n - 1);
      } else if (e.key === "Enter" && t?.tagName !== "BUTTON") {
        e.preventDefault();
        submit();
      } else if (e.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, place, submit]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4 px-4 py-5 sm:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented
          label="Board"
          value={v?.mode ?? "daily"}
          options={[
            ["daily", "Today's board"],
            ["practice", "Practice"],
          ]}
          onChange={(m) => load(m as "daily" | "practice", v?.tier ?? "basic")}
          disabled={pending}
        />
        <Segmented
          label="Level"
          value={v?.tier ?? "basic"}
          options={[
            ["basic", "Basic"],
            ["advanced", "Advanced"],
          ]}
          onChange={(t) => load(v?.mode ?? "daily", t as Tier)}
          disabled={pending}
        />
        {pending && <LoaderCircle className="size-5 animate-spin" aria-label="Loading" />}
      </div>

      {error && (
        <p role="alert" className="rounded-md border-2 border-foreground bg-status-alert-bg px-3 py-2 text-sm font-semibold text-status-alert-fg">
          {error}
        </p>
      )}

      {p && v && (
        <>
          <header className={cn(card, "flex flex-wrap items-center justify-between gap-3 p-4 hard-shadow-sm")}>
            <div className="min-w-0">
              <p className="text-eyebrow text-link">{v.mode === "daily" ? "Today's board" : "Practice board"} · {v.tier === "advanced" ? "Advanced" : "Basic"}</p>
              <h2 className="text-h3 leading-tight">{v.title}</h2>
              <p className="text-sm text-muted-foreground">{v.tier === "advanced" ? "Sort the 16 criteria into 4 disorders, and pick each one's time rule." : "Sort the 16 criteria into the 4 disorders."}</p>
            </div>
            <Tries used={p.tries} />
          </header>

          {p.done ? (
            <Done p={p} gain={gain} onPractice={() => load("practice", v.tier)} onAdvanced={() => load("daily", "advanced")} />
          ) : (
            <>
              <div key={shake} className={cn("grid gap-3 md:grid-cols-2 xl:grid-cols-4", shake > 0 && anim(fx.shake))}>
                {v.groups.map((name, g) => {
                  const here = p.placement.flatMap((x, i) => (x === g ? [i] : []));
                  return (
                    <section key={g} aria-label={name} className={cn(card, "flex flex-col p-3", p.locked[g] && "bg-status-success-bg", p.locked[g] && anim(fx.pop))}>
                      <button
                        type="button"
                        onClick={() => place(g)}
                        disabled={p.locked[g] || selected === null}
                        className={cn(
                          "flex min-h-11 w-full items-center gap-2 rounded-md border-2 border-foreground px-3 py-2 text-left font-bold transition-transform",
                          selected !== null && !p.locked[g] ? "bg-primary text-primary-foreground hover:-translate-y-0.5" : "bg-background",
                        )}
                      >
                        <span className="hidden size-6 shrink-0 place-items-center rounded border-2 border-current font-pix text-xs lg:grid">{g + 1}</span>
                        <span className="min-w-0 flex-1 leading-tight">{name}</span>
                        {p.locked[g] && <Check className="size-5 shrink-0" aria-label="Right" />}
                      </button>
                      {p.oneAway.includes(g) && !p.locked[g] && (
                        <p className={cn(chip, "mt-2 self-start bg-status-pending-bg text-xs")}>
                          <CircleDot className="size-3.5" aria-hidden /> One away
                        </p>
                      )}
                      {v.thresholds && (
                        <fieldset className="mt-2" disabled={p.locked[g]}>
                          <legend className="text-xs font-bold text-muted-foreground">Time rule{p.thresholdWrong.includes(g) ? " (not this one)" : ""}</legend>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {v.thresholds.map((t) => (
                              <button
                                key={t}
                                type="button"
                                aria-pressed={p.picks[g] === t}
                                onClick={() => {
                                  const picks = [...p.picks];
                                  picks[g] = picks[g] === t ? null : t;
                                  setPlay({ ...p, picks, thresholdWrong: p.thresholdWrong.filter((x) => x !== g) });
                                }}
                                className={cn("min-h-9 rounded-md border-2 border-foreground px-2 py-1 text-left text-xs font-semibold", p.picks[g] === t ? "bg-brand text-brand-foreground" : "bg-card hover:bg-accent")}
                              >
                                {p.picks[g] === t && <Check className="mr-1 inline size-3" aria-hidden />}
                                {t}
                              </button>
                            ))}
                          </div>
                        </fieldset>
                      )}
                      <ul className="mt-2 flex-1 space-y-1.5">
                        {here.map((i) => (
                          <li key={i}>
                            <button
                              type="button"
                              disabled={p.locked[g]}
                              onClick={() => setSelected(selected === i ? null : i)}
                              className={cn(
                                "min-h-11 w-full rounded-md border-2 border-foreground px-2.5 py-2 text-left text-sm leading-snug",
                                selected === i ? "-translate-y-0.5 bg-brand text-brand-foreground hard-shadow-xs" : "bg-card",
                                p.locked[g] && "border-dashed",
                              )}
                            >
                              {v.tiles[i]}
                            </button>
                          </li>
                        ))}
                        {Array.from({ length: Math.max(0, 4 - here.length) }, (_, k) => (
                          <li key={`e${k}`} className="flex min-h-11 items-center rounded-md border-2 border-dashed border-foreground/40 px-2.5 text-xs text-muted-foreground">
                            {k === 0 && selected !== null ? "Tap the name above to place here" : "Empty"}
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </div>

              {selected !== null && (
                <div className="sticky bottom-[calc(var(--nav-h)+0.5rem)] z-10 flex flex-wrap items-center gap-2 rounded-md border-2 border-foreground bg-foreground p-3 text-background hard-shadow-sm lg:bottom-4">
                  <span className="min-w-0 flex-1 text-sm">
                    <strong>Selected:</strong> {v.tiles[selected]} <span className="hidden opacity-80 lg:inline">· press 1–4 to place</span>
                  </span>
                  {p.placement[selected] !== null && (
                    <button type="button" onClick={() => unplace(selected)} className="inline-flex min-h-11 items-center gap-1 rounded-md border-2 border-background px-3 text-sm font-bold">
                      <Undo2 className="size-4" aria-hidden /> Back to tiles
                    </button>
                  )}
                  <button type="button" onClick={() => setSelected(null)} className="inline-flex min-h-11 items-center gap-1 rounded-md border-2 border-background px-3 text-sm font-bold">
                    <X className="size-4" aria-hidden /> Cancel
                  </button>
                </div>
              )}

              <section aria-label="Tiles to place" className="space-y-2">
                <h3 className="font-bold">
                  Tiles to place ({p.placement.filter((x) => x === null).length})
                  <span className="ml-2 text-sm font-normal text-muted-foreground">Tap a tile, then tap a disorder.</span>
                </h3>
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {v.tiles.map((t, i) =>
                    p.placement[i] === null ? (
                      <li key={i}>
                        <button
                          type="button"
                          aria-pressed={selected === i}
                          onClick={() => setSelected(selected === i ? null : i)}
                          className={cn(
                            "min-h-12 w-full rounded-md border-2 border-foreground px-3 py-2 text-left text-sm leading-snug font-semibold transition-transform active:translate-y-px",
                            selected === i ? "-translate-y-0.5 bg-brand text-brand-foreground hard-shadow-sm" : "bg-card hover:-translate-y-0.5 hard-shadow-xs",
                          )}
                        >
                          {t}
                        </button>
                      </li>
                    ) : null,
                  )}
                </ul>
              </section>

              {p.message && (
                <p role="status" className="rounded-md border-2 border-foreground bg-status-pending-bg px-3 py-2 text-sm font-semibold">
                  {p.message}
                </p>
              )}

              <button type="button" className={cn(btnPrimary, "w-full sm:w-auto")} disabled={!allPlaced || !picksDone || pending} onClick={submit}>
                {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <LayoutGrid className="size-4" aria-hidden />}
                {allPlaced ? (picksDone ? "Check my board" : "Pick every time rule") : `Place ${p.placement.filter((x) => x === null).length} more`}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

function Segmented({ label, value, options, onChange, disabled }: { label: string; value: string; options: [string, string][]; onChange: (v: string) => void; disabled: boolean }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-md border-2 border-foreground bg-card p-1">
      {options.map(([k, text]) => (
        <button
          key={k}
          type="button"
          role="radio"
          aria-checked={value === k}
          disabled={disabled}
          onClick={() => onChange(k)}
          className={cn("min-h-10 rounded-[6px] px-3 text-sm font-bold", value === k ? "bg-foreground text-background" : "hover:bg-accent")}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

function Tries({ used }: { used: number }) {
  const left = Math.max(0, MAX_TRIES - used);
  return (
    <div className="flex items-center gap-2" aria-label={`${left} of ${MAX_TRIES} tries left`}>
      <span className="text-sm font-bold">Tries</span>
      {Array.from({ length: MAX_TRIES }, (_, i) => (
        <span key={i} className={cn("size-4 rounded-sm border-2 border-foreground", i < left ? "bg-primary" : "bg-background")} />
      ))}
      <span className="text-sm tabular-nums">{left} left</span>
    </div>
  );
}

function Done({ p, gain, onPractice, onAdvanced }: { p: Play; gain: number; onPractice: () => void; onAdvanced: () => void }) {
  const d = p.done!;
  const v = p.view;
  const reduce = useReducedMotion();
  return (
    <section className="space-y-4" aria-label="Result">
      <div className={cn(card, "p-5 text-center hard-shadow-md", d.solved ? "bg-status-success-bg" : "bg-card")}>
        <p className={cn("mx-auto inline-flex items-center gap-2 rounded-md border-2 border-foreground px-3 py-1 font-pix text-lg uppercase", d.solved ? "bg-primary text-primary-foreground" : "bg-foreground text-background", reduce === false && fx.stamp)}>
          {d.solved ? <Check className="size-5" aria-hidden /> : <X className="size-5" aria-hidden />} {d.solved ? `Sorted in ${p.tries}` : "Out of tries"}
        </p>
        <p className="mt-3">
          <CountUp value={d.score} className="font-pix text-5xl tabular-nums" /> <span className="text-sm font-bold">points</span>
          {gain > 0 && <span className={cn(chip, "ml-3 bg-primary text-primary-foreground", reduce === false && fx.pop)}>+{gain} XP</span>}
        </p>
        {v.cohort && v.cohort.played > 0 && (
          <p className="mt-2 text-sm font-semibold">
            <Users className="mr-1 inline size-4" aria-hidden /> {v.cohort.solvedPct}% of {v.cohort.scope === "batch" ? "your batch" : "players today"} sorted this board ({v.cohort.played} played).
          </p>
        )}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {v.groups.map((name, g) => (
          <div key={g} className={cn(card, "p-4")}>
            <h3 className="flex items-center gap-2 font-bold">
              {p.locked[g] ? <Check className="size-4" aria-label="You got this group" /> : <X className="size-4" aria-label="You missed this group" />} {name}
            </h3>
            {d.thresholds[g] && <p className="text-sm text-muted-foreground">Time rule: {d.thresholds[g]}</p>}
            <ul className="mt-2 space-y-1.5 text-sm">
              {d.tiles
                .filter((t) => t.group === g)
                .map((t) => (
                  <li key={t.text}>
                    <span className="font-semibold">{t.text}.</span> {t.why}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <Link href={`/study/${d.module}`} className={btnPrimary}>
          <BookOpen className="size-4" aria-hidden /> Study this topic
        </Link>
        <button type="button" className={btnSecondary} onClick={onPractice}>
          <Shuffle className="size-4" aria-hidden /> Practice board
        </button>
        {v.tier === "basic" && (
          <button type="button" className={btnSecondary} onClick={onAdvanced}>
            <LayoutGrid className="size-4" aria-hidden /> Try advanced
          </button>
        )}
      </div>
    </section>
  );
}
