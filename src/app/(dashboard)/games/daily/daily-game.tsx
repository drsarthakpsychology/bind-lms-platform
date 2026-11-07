"use client";

import * as React from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Camera,
  Check,
  ClipboardList,
  Copy,
  Flag,
  Flame,
  FlaskConical,
  Lightbulb,
  LoaderCircle,
  MessageCircle,
  Search,
  Send,
  Shuffle,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { emptyState, type LearnState } from "@/lib/learn/engine";
import { initLearnStore, useLearnState } from "@/lib/learn/store";
import { trackLearn } from "@/lib/learn/track";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { searchDiagnoses, type Diagnosis } from "@/lib/games/diagnoses";
import { dailyStreak, MAX_CLUES, shareText, type Action, type PracticeRecord } from "@/lib/games/daily/engine";
import type { CaseView } from "@/lib/games/daily/view";
import type { InvestigationKind } from "@/lib/games/daily/types";
import { CountUp } from "@/lib/games/ui/count-up";
import { LearnLink } from "@/lib/games/ui/learn-link";
import { awardXp } from "@/lib/games/ui/xp";
import { copyText, readLocal, useLocalJson, writeLocal, writeLocalShared } from "@/lib/games/ui/copy";
import { btnInk, btnPrimary, btnSecondary, card, chip } from "@/lib/games/ui/styles";
import fx from "@/lib/games/ui/fx.module.css";
import { AI_CASE_LABEL, AI_CASE_NOTE } from "@/lib/ai-cases/types";
import { AI_TOPICS } from "@/lib/ai-cases/criteria";
import { dailyMove, flagAiCaseAction, nextAiCase, nextPractice, type DailyMeta, type MoveResult } from "./actions";
import { creditServerPlay } from "@/lib/learn/credit-play";

const EMPTY = emptyState();
type Save = (s: LearnState) => Promise<unknown>;
type Game = { view: CaseView; meta: DailyMeta; log: Action[] };
type Ok = Extract<MoveResult, { ok: true }>;
type Tab = "daily" | "practice" | "ai";
type AiChoice = { topic: string; setting: "mix" | "indian" | "global" };

const KIND_ICON: Record<InvestigationKind, typeof Brain> = { mse: Brain, collateral: Users, scale: ClipboardList, lab: FlaskConical };
const KIND_WORD: Record<InvestigationKind, string> = { mse: "Mental state", collateral: "Collateral", scale: "Rating scale", lab: "Test" };

const LOCAL_LOG = (mode: string, day: string, id: string) => `vibha-daily-log:${mode}:${day}:${id}`;
const LOCAL_DAYS = "vibha-daily-days";
const LOCAL_PRACTICE = "vibha-daily-practice";
const LOCAL_AI_SEEN = "vibha-ai-cases-seen";
const NO_DAYS: string[] = [];

function dayLabel(day: string) {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });
}

function worth(v: CaseView) {
  return Math.max(10, 100 - 15 * v.points);
}

export function DailyGame({ serverState, save, initial }: { serverState: LearnState | null; save: Save; initial: MoveResult }) {
  initLearnStore(serverState, save);
  const state = useLearnState(serverState ?? EMPTY);
  const [tab, setTab] = React.useState<Tab>("daily");
  const [daily, setDaily] = React.useState<Game | null>(initial.ok ? { view: initial.view, meta: initial.meta, log: initial.log } : null);
  const [practice, setPractice] = React.useState<Game | null>(null);
  const [aiGame, setAiGame] = React.useState<Game | null>(null);
  const [aiChoice, setAiChoice] = React.useState<AiChoice>({ topic: "", setting: "mix" });
  const [making, setMaking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(initial.ok ? null : initial.error);
  const [pending, startTransition] = React.useTransition();
  const [shake, setShake] = React.useState(0);
  const [gain, setGain] = React.useState<{ xp: number; key: number } | null>(null);
  const localDays = useLocalJson<string[]>(LOCAL_DAYS, NO_DAYS);

  // Results can't be saved on the server yet: restore today's game from this browser.
  const restored = React.useRef(false);
  React.useEffect(() => {
    if (restored.current || !initial.ok) return;
    restored.current = true;
    if (initial.meta.stored) return;
    const log = readLocal<Action[]>(LOCAL_LOG("daily", initial.meta.day, initial.view.caseId), []);
    if (!log.length) return;
    void dailyMove({ mode: "daily", log }).then((r) => {
      if (r.ok) setDaily({ view: r.view, meta: r.meta, log: r.log });
    });
  }, [initial]);

  const game = tab === "daily" ? daily : tab === "practice" ? practice : aiGame;

  function after(t: Tab, res: Ok, action?: Action) {
    const mode = t === "daily" ? "daily" : "practice";
    const g = { view: res.view, meta: res.meta, log: res.log };
    if (t === "daily") setDaily(g);
    else if (t === "practice") setPractice(g);
    else setAiGame(g);
    if (!res.meta.stored) writeLocal(LOCAL_LOG(mode, res.meta.day, res.view.caseId), res.log);
    if (action?.t === "guess") {
      const last = res.view.guesses[res.view.guesses.length - 1];
      if (last && !last.ok) {
        haptic("warning");
        setShake((k) => k + 1);
      } else if (last?.ok) haptic("success");
    }
    if (res.justFinished) {
      const reveal = res.view.reveal;
      if (reveal) {
        for (const gs of res.view.guesses) trackLearn({ type: "game", kind: "daily-case", ok: gs.ok, skill: `${reveal.topic}:${gs.ok ? "recognise" : "differentiate"}`, item: res.view.caseId, prompt: gs.name });
        if (!res.view.guesses.some((x) => x.ok)) trackLearn({ type: "game", kind: "daily-case", ok: false, skill: `${reveal.topic}:recognise`, item: res.view.caseId });
      }
      if (res.xp > 0) {
        if (!res.xpSaved) awardXp(res.xp, state);
        else creditServerPlay(res.xp);
        setGain((g) => ({ xp: res.xp, key: (g?.key ?? 0) + 1 }));
      }
      if (mode === "daily") {
        const days = [...new Set([...readLocal<string[]>(LOCAL_DAYS, []), res.meta.day])].slice(-400);
        writeLocalShared(LOCAL_DAYS, days);
      } else {
        const hist = readLocal<PracticeRecord[]>(LOCAL_PRACTICE, []);
        writeLocal(LOCAL_PRACTICE, [...hist, { id: res.view.caseId, score: res.view.score, difficulty: res.view.difficulty }].slice(-60));
      }
    }
  }

  function move(action?: Action) {
    const t = tab;
    const cur = t === "daily" ? daily : t === "practice" ? practice : aiGame;
    if (!cur) return;
    setError(null);
    startTransition(async () => {
      const res = await dailyMove({ mode: t === "daily" ? "daily" : "practice", caseId: cur.view.caseId, log: cur.log, action });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      after(t, res, action);
    });
  }

  function newAi(choice: AiChoice = aiChoice) {
    setError(null);
    setTab("ai");
    setMaking(true);
    startTransition(async () => {
      try {
        const seen = readLocal<string[]>(LOCAL_AI_SEEN, []);
        const pick = await nextAiCase({ topic: choice.topic || null, setting: choice.setting === "mix" ? null : choice.setting, exclude: seen });
        if (!pick.ok) {
          setError(pick.error);
          return;
        }
        writeLocal(LOCAL_AI_SEEN, [...seen.filter((x) => x !== pick.caseId), pick.caseId].slice(-100));
        const res = await dailyMove({ mode: "practice", caseId: pick.caseId, log: readLocal<Action[]>(LOCAL_LOG("practice", daily?.meta.day ?? "", pick.caseId), []) });
        if (!res.ok) {
          setError(res.error);
          return;
        }
        after("ai", res);
      } finally {
        setMaking(false);
      }
    });
  }

  function newPractice() {
    setError(null);
    setTab("practice");
    startTransition(async () => {
      const pick = await nextPractice(readLocal<PracticeRecord[]>(LOCAL_PRACTICE, []));
      if (!pick.ok) {
        setError(pick.error);
        return;
      }
      const res = await dailyMove({ mode: "practice", caseId: pick.caseId, log: readLocal<Action[]>(LOCAL_LOG("practice", daily?.meta.day ?? "", pick.caseId), []) });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      after("practice", res);
    });
  }

  function openTab(t: Tab) {
    setTab(t);
    if (t === "practice" && !practice) newPractice();
  }

  const streak = daily ? Math.max(daily.meta.streak, daily.meta.stored ? 0 : dailyStreak(localDays, daily.meta.day)) : 0;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 px-4 py-5 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Case type" className="inline-flex rounded-md border-2 border-foreground bg-card p-1">
          {(
            [
              ["daily", "Today's case"],
              ["practice", "Practice"],
              ["ai", AI_CASE_LABEL],
            ] as const
          ).map(([t, label]) => (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={tab === t}
              onClick={() => openTab(t)}
              className={cn("min-h-10 rounded-[6px] px-3 text-sm font-bold transition-colors", tab === t ? "bg-foreground text-background" : "text-foreground hover:bg-accent")}
            >
              {label}
            </button>
          ))}
        </div>
        {streak > 0 && (
          <span className={cn(chip, "bg-card")} title="Days in a row you've played the daily case">
            <Flame className="size-4" aria-hidden /> {streak}-day streak
          </span>
        )}
      </div>

      {error && (
        <p role="alert" className="rounded-md border-2 border-foreground bg-status-alert-bg px-3 py-2 text-sm font-semibold text-status-alert-fg">
          {error}
        </p>
      )}

      {tab === "ai" && (making || !aiGame) ? (
        <AiStart choice={aiChoice} onChoice={setAiChoice} making={making} onStart={() => newAi()} />
      ) : !game ? (
        <div className={cn(card, "flex min-h-40 items-center justify-center gap-2 p-6 text-muted-foreground")}>
          <LoaderCircle className="size-5 animate-spin" aria-hidden /> Finding a case at your level…
        </div>
      ) : (
        <CaseBoard
          key={`${tab}:${game.view.caseId}`}
          game={game}
          pending={pending}
          shake={shake}
          gain={gain}
          onMove={move}
          onNextPractice={tab === "ai" ? () => newAi() : newPractice}
          streak={streak}
        />
      )}
    </div>
  );
}

function CaseBoard({
  game,
  pending,
  shake,
  gain,
  onMove,
  onNextPractice,
  streak,
}: {
  game: Game;
  pending: boolean;
  shake: number;
  gain: { xp: number; key: number } | null;
  onMove: (a?: Action) => void;
  onNextPractice: () => void;
  streak: number;
}) {
  const { view: v, meta } = game;
  const playing = v.status === "playing";
  const last = v.guesses[v.guesses.length - 1];
  const reduce = useReducedMotion();
  const anim = (cls: string) => (reduce === false ? cls : undefined);
  const [showTests, setShowTests] = React.useState(false);
  const [confirmQuit, setConfirmQuit] = React.useState(false);
  const ordered = v.investigations.filter((x) => x.ordered);
  const canHint = playing && v.hints.used < 2;
  const hintLabel = meta.stored && meta.freeHintsLeft === 0 ? `Hint · ${meta.hintCost} XP` : `Hint${meta.stored ? ` · ${meta.freeHintsLeft} free today` : ""}`;

  return (
    <div className="space-y-4">
      <header className={cn(card, "p-4 hard-shadow-sm")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-eyebrow text-link">{v.mode === "daily" ? `Daily case #${meta.number} · ${dayLabel(meta.day)}` : v.ai ? "Practice" : "Practice case"}</p>
          <span className="text-sm font-semibold text-muted-foreground">
            Level {v.difficulty} of 3
          </span>
        </div>
        {v.ai && <AiBadge />}
        <p className="mt-1 text-sm text-muted-foreground">{v.setting}</p>
        <ClueMeter shown={v.cluesOpen} status={v.status} />
        {playing && (
          <p className="mt-2 text-sm">
            Solve now for <strong className="tabular-nums">{worth(v)} points</strong>. Each extra clue or test costs 15.
          </p>
        )}
      </header>

      <ol className="space-y-2" aria-label="Clues">
        {v.clues.map((c, i) => {
          const fresh = playing && i === v.clues.length - 1 && i > 0;
          const unopened = i >= v.cluesOpen;
          return (
            <li
              key={i}
              className={cn(card, "flex gap-3 p-3", unopened && "border-dashed bg-background text-muted-foreground", fresh && "hard-shadow-sm", fresh && anim(fx.reveal), unopened && anim(fx.stagger))}
              style={unopened ? ({ "--i": i - v.cluesOpen } as React.CSSProperties) : undefined}
            >
              <span key={fresh ? `n${i}` : i} className={cn("grid size-7 shrink-0 place-items-center rounded-md border-2 border-foreground font-pix text-sm", i < v.cluesOpen ? "bg-primary text-primary-foreground" : "bg-background", fresh && anim(fx.pop))}>
                {i + 1}
              </span>
              <p className="min-w-0 flex-1 leading-snug">
                {unopened && <span className="mr-1 font-semibold">Unopened:</span>}
                {c}
              </p>
              {fresh && <span className={cn(chip, "h-fit shrink-0 bg-card text-xs")}>New</span>}
            </li>
          );
        })}
      </ol>

      {ordered.length > 0 && (
        <section aria-label="Tests you ordered" className="space-y-2">
          {ordered.map((x) => {
            const Icon = KIND_ICON[x.kind];
            return (
              <div key={x.i} className={cn(card, "flex gap-3 border-dashed p-3", anim(fx.rise))}>
                <Icon className="mt-0.5 size-5 shrink-0" aria-hidden />
                <p className="leading-snug">
                  <span className="font-bold">
                    {KIND_WORD[x.kind]}: {x.label}.
                  </span>{" "}
                  {x.result}
                </p>
              </div>
            );
          })}
        </section>
      )}

      {(v.hints.chapter || v.hints.pointer) && playing && (
        <div className="rounded-lg border-2 border-foreground bg-status-info-bg p-3 text-status-info-fg">
          <p className="flex items-center gap-2 font-bold">
            <Lightbulb className="size-4" aria-hidden /> Hint
          </p>
          {v.hints.chapter && <p className="mt-1 text-sm">Chapter: {v.hints.chapter}.</p>}
          {v.hints.pointer && <p className="mt-1 text-sm">{v.hints.pointer}</p>}
        </div>
      )}

      {playing && last && !last.ok && (
        <div key={shake} className={cn("rounded-lg border-2 border-foreground p-3", last.sameChapter ? "bg-status-pending-bg" : "bg-status-alert-bg text-status-alert-fg", anim(fx.shake))} role="status">
          <p className="flex items-center gap-2 font-bold">
            <X className="size-5 shrink-0" aria-hidden /> Not {last.name}
            {last.sameChapter && <span className={cn(chip, "ml-auto bg-card text-xs text-foreground")}>Right chapter</span>}
          </p>
          <p className="mt-1 text-sm leading-snug">{last.reason}</p>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3">
            <p className="text-sm font-semibold">Clue {v.cluesOpen} is now open.</p>
            <LearnLink topic={last.name} newTab className="text-current" />
          </div>
        </div>
      )}

      {playing ? (
        <section className={cn(card, "space-y-3 p-4")} aria-label="Your move">
          <GuessBox disabled={pending} guessed={v.guesses.map((g) => g.dx)} onGuess={(dx) => onMove({ t: "guess", dx })} />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button type="button" className={btnSecondary} disabled={pending || v.clues.length >= MAX_CLUES} onClick={() => onMove({ t: "clue" })}>
              <ArrowRight className="size-4" aria-hidden /> Next clue
            </button>
            <button type="button" className={btnSecondary} aria-expanded={showTests} disabled={pending || v.investigations.every((x) => x.ordered)} onClick={() => setShowTests((s) => !s)}>
              <FlaskConical className="size-4" aria-hidden /> Order a test
            </button>
            <button type="button" className={btnSecondary} disabled={pending || !canHint} onClick={() => onMove({ t: "hint" })}>
              <Lightbulb className="size-4" aria-hidden /> <span className="truncate">{canHint ? hintLabel : "No hints left"}</span>
            </button>
            {confirmQuit ? (
              <button type="button" className={cn(btnInk)} disabled={pending} onClick={() => onMove({ t: "giveup" })}>
                <Flag className="size-4" aria-hidden /> Yes, show me
              </button>
            ) : (
              <button type="button" className={btnSecondary} disabled={pending} onClick={() => setConfirmQuit(true)}>
                <Flag className="size-4" aria-hidden /> Give up
              </button>
            )}
          </div>
          {showTests && (
            <ul className="grid gap-2 sm:grid-cols-2" aria-label="Tests you can order (each costs one clue point)">
              {v.investigations
                .filter((x) => !x.ordered)
                .map((x) => {
                  const Icon = KIND_ICON[x.kind];
                  return (
                    <li key={x.i}>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => {
                          setShowTests(false);
                          onMove({ t: "inv", i: x.i });
                        }}
                        className="flex min-h-11 w-full items-center gap-2 rounded-md border-2 border-dashed border-foreground bg-background px-3 py-2 text-left text-sm font-semibold hover:bg-accent"
                      >
                        <Icon className="size-4 shrink-0" aria-hidden />
                        <span className="min-w-0 flex-1">
                          {KIND_WORD[x.kind]}: {x.label}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">−15</span>
                      </button>
                    </li>
                  );
                })}
            </ul>
          )}
          {pending && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
              <LoaderCircle className="size-4 animate-spin" aria-hidden /> Checking…
            </p>
          )}
        </section>
      ) : (
        <Result game={game} gain={gain} streak={streak} onNextPractice={onNextPractice} pending={pending} />
      )}

      {v.ai && <AiFlag caseId={v.caseId} />}

      {v.guesses.filter((g) => !g.ok).length > (playing ? 1 : 0) && (
        <details className={cn(card, "p-3")} open={!playing}>
          <summary className="cursor-pointer font-bold">Your wrong guesses ({v.guesses.filter((g) => !g.ok).length})</summary>
          <ul className="mt-2 space-y-2">
            {v.guesses
              .filter((g) => !g.ok)
              .map((g) => (
                <li key={g.dx} className="text-sm leading-snug">
                  <span className="font-bold">
                    <X className="mr-1 inline size-4" aria-hidden />
                    {g.name}
                    {g.sameChapter ? " (right chapter)" : ""}:
                  </span>{" "}
                  {g.reason}
                </li>
              ))}
          </ul>
        </details>
      )}
    </div>
  );
}

function ClueMeter({ shown, status }: { shown: number; status: CaseView["status"] }) {
  const reduce = useReducedMotion();
  return (
    <div className="mt-3 flex items-center gap-1.5" aria-label={`${shown} of 6 clues open`}>
      {Array.from({ length: MAX_CLUES }, (_, i) => (
        <span
          key={`${i}:${i < shown}`}
          className={cn(
            "h-3 flex-1 rounded-sm border-2 border-foreground transition-colors duration-300",
            i < shown ? (status === "solved" && i === shown - 1 ? "bg-brand" : "bg-primary") : "bg-background",
            i === shown - 1 && reduce === false && fx.fill,
          )}
        />
      ))}
      <span className="ml-1 font-pix text-sm tabular-nums">{shown}/6</span>
    </div>
  );
}

function GuessBox({ disabled, guessed, onGuess }: { disabled: boolean; guessed: string[]; onGuess: (dx: string) => void }) {
  const [q, setQ] = React.useState("");
  const [hi, setHi] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const results = React.useMemo(() => searchDiagnoses(q, 6).filter((d) => !guessed.includes(d.id)), [q, guessed]);
  const pick = React.useCallback(
    (d: Diagnosis | undefined) => {
      if (!d || disabled) return;
      onGuess(d.id);
      setQ("");
      setHi(0);
    },
    [disabled, onGuess],
  );

  // Desktop shortcuts: 1 to 4 highlight a result, Enter guesses it (outside the text box too).
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (n >= 1 && n <= 4 && results[n - 1]) {
        e.preventDefault();
        setHi(n - 1);
      } else if (e.key === "Enter" && results[hi] && t?.tagName !== "BUTTON") {
        e.preventDefault();
        pick(results[hi]);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [results, hi, pick]);

  const listId = "dx-results";
  return (
    <div>
      <label htmlFor="dx-search" className="font-bold">
        Your diagnosis
      </label>
      <div className="relative mt-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          id="dx-search"
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setHi(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHi((h) => Math.min(results.length - 1, h + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHi((h) => Math.max(0, h - 1));
            } else if (e.key === "Enter") {
              e.preventDefault();
              pick(results[hi]);
            } else if (e.key === "Escape") setQ("");
          }}
          placeholder="Type a diagnosis, e.g. panic"
          autoComplete="off"
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls={listId}
          aria-activedescendant={results[hi] ? `dx-opt-${results[hi].id}` : undefined}
          className="h-12 w-full rounded-md border-2 border-foreground bg-background pr-3 pl-9 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
          disabled={disabled}
        />
      </div>
      {results.length > 0 && (
        <ul id={listId} role="listbox" aria-label="Matching diagnoses" className="mt-2 space-y-1.5">
          {results.map((d, i) => (
            <li key={d.id} id={`dx-opt-${d.id}`} role="option" aria-selected={i === hi}>
              <button
                type="button"
                disabled={disabled}
                onMouseEnter={() => setHi(i)}
                onClick={() => pick(d)}
                className={cn(
                  "flex min-h-11 w-full items-center gap-3 rounded-md border-2 border-foreground px-3 py-2 text-left transition-transform active:translate-y-px",
                  i === hi ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent",
                )}
              >
                {i < 4 && <span className="hidden size-6 shrink-0 place-items-center rounded border-2 border-current font-pix text-xs lg:grid">{i + 1}</span>}
                <span className="min-w-0 flex-1 font-semibold leading-tight">{d.name}</span>
                <span className="shrink-0 text-sm font-bold">Guess</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {q && !results.length && <p className="mt-2 text-sm text-muted-foreground">Nothing matches. Try another name.</p>}
    </div>
  );
}

function Result({ game, gain, streak, onNextPractice, pending }: { game: Game; gain: { xp: number; key: number } | null; streak: number; onNextPractice: () => void; pending: boolean }) {
  const { view: v, meta } = game;
  const r = v.reveal!;
  const solved = v.status === "solved";
  const reduce = useReducedMotion();
  const anim = (cls: string) => (reduce === false ? cls : undefined);
  const [copied, setCopied] = React.useState<string | null>(null);

  function text(channel: "whatsapp" | "instagram", url?: string) {
    return shareText({ grid: v.grid, solved, clue: v.cluesOpen, score: v.score, dayLabel: dayLabel(meta.day), streak, url, channel });
  }
  const shareUrl = () => `${window.location.origin}/games/daily`;
  async function copy(channel: "whatsapp" | "instagram") {
    const ok = await copyText(text(channel, shareUrl()));
    setCopied(ok ? channel : null);
    if (ok) haptic("tap");
  }
  function sendWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(text("whatsapp", shareUrl()))}`, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="space-y-4" aria-label="Result">
      <div className={cn(card, "relative overflow-hidden p-5 text-center hard-shadow-md", solved ? "bg-status-success-bg" : "bg-card", anim(fx.land))}>
        <div className="relative mx-auto grid w-fit place-items-center">
          {solved && <span className={cn("absolute size-28 rounded-full border-4 border-foreground", reduce === false ? fx.ring : "hidden")} style={{ animationDelay: "180ms" }} aria-hidden />}
          <p className={cn("relative inline-flex items-center gap-2 rounded-md border-2 border-foreground px-3 py-1 font-pix text-lg uppercase hard-shadow-xs", solved ? "bg-primary text-primary-foreground" : "bg-foreground text-background", anim(fx.stamp))}>
            {solved ? <Check className="size-5" aria-hidden /> : <X className="size-5" aria-hidden />}
            {solved ? `Solved on clue ${v.cluesOpen}` : "Not this time"}
          </p>
        </div>
        {v.grid && (
          <p className="mt-3 flex justify-center gap-1 text-xl" aria-label="Your moves, in order">
            {Array.from(v.grid).map((sq, i) => (
              <span key={i} className={anim(fx.stagger)} style={{ "--i": i + 3 } as React.CSSProperties} aria-hidden>
                {sq}
              </span>
            ))}
          </p>
        )}
        <p className="mt-3 text-sm text-muted-foreground">The diagnosis</p>
        <h2 className="text-h2 leading-tight">{r.answer}</h2>
        <p className="text-sm text-muted-foreground">{r.chapter}</p>
        <LearnLink topic={r.answer} className="mt-1" />
        <div className="relative mt-4 flex items-end justify-center gap-4">
          <p>
            <CountUp value={v.score} duration={1} delay={0.3} className="font-pix text-5xl tabular-nums" />
            <span className="ml-1 text-sm font-bold">points</span>
          </p>
          {gain && gain.xp > 0 && (
            <span key={gain.key} className={cn(chip, "bg-primary text-primary-foreground", anim(fx.pop))}>
              +{gain.xp} XP
            </span>
          )}
        </div>
        {v.mode === "daily" && meta.cohort && meta.cohort.played > 0 && (
          <p className="mt-3 text-sm font-semibold">
            <Users className="mr-1 inline size-4" aria-hidden />
            {meta.cohort.pctWithin3}% of {meta.cohort.scope === "batch" ? "your batch" : "players today"} solved in 3 clues or fewer ({meta.cohort.played} played, average {meta.cohort.avgScore} points).
          </p>
        )}
      </div>

      {v.mode === "daily" && (
        <div className={cn(card, "p-4")}>
          <p className="font-bold">Share your result (no spoilers)</p>
          <pre className="mt-2 rounded-md border-2 border-dashed border-foreground bg-background p-3 font-sans text-sm whitespace-pre-wrap">{text("whatsapp")}</pre>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <button type="button" className={btnSecondary} onClick={() => copy("whatsapp")}>
              {copied === "whatsapp" ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />} {copied === "whatsapp" ? "Copied" : "Copy for WhatsApp"}
            </button>
            <button type="button" className={btnSecondary} onClick={() => copy("instagram")}>
              {copied === "instagram" ? <Check className="size-4" aria-hidden /> : <Camera className="size-4" aria-hidden />} {copied === "instagram" ? "Copied" : "Copy for Instagram"}
            </button>
            <button type="button" className={btnSecondary} onClick={sendWhatsApp}>
              <MessageCircle className="size-4" aria-hidden /> Send on WhatsApp
            </button>
          </div>
        </div>
      )}

      <div className={cn(card, "p-4")}>
        <h3 className="text-h3">What this was</h3>
        <p className="mt-2 leading-relaxed">{r.overview}</p>
      </div>

      <div className={cn(card, "p-4")}>
        <h3 className="text-h3">Why the look-alikes were wrong</h3>
        <ul className="mt-2 space-y-1">
          {r.lookAlikes.map((x, i) => (
            <li key={x.name} className={cn("leading-snug", anim(fx.stagger))} style={{ "--i": i } as React.CSSProperties}>
              <p>
                <span className="font-bold">{x.name}:</span> {x.whyNot}
              </p>
              <LearnLink topic={x.name} />
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Link href={`/study/${r.module}`} className={btnPrimary}>
          <BookOpen className="size-4" aria-hidden /> Study this topic
        </Link>
        <button type="button" className={btnSecondary} onClick={onNextPractice} disabled={pending}>
          <Shuffle className="size-4" aria-hidden /> {v.mode === "daily" ? "Practise another case" : v.ai ? "Next AI case" : "Next practice case"}
        </button>
      </div>

      {r.refs && (
        <details className="rounded-md border-2 border-dashed border-foreground p-3 text-sm">
          <summary className="cursor-pointer font-bold">Sources (admins only)</summary>
          <ul className="mt-2 list-disc pl-5">
            {r.refs.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

/** The "AI case" label. Icon + words, never colour alone. */
function AiBadge() {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <span className={cn(chip, "bg-status-info-bg text-status-info-fg")}>
        <Sparkles className="size-4" aria-hidden /> {AI_CASE_LABEL}
      </span>
      <span className="text-sm text-muted-foreground">{AI_CASE_NOTE}</span>
    </div>
  );
}

function AiStart({ choice, onChoice, making, onStart }: { choice: AiChoice; onChoice: (c: AiChoice) => void; making: boolean; onStart: () => void }) {
  const settings: [AiChoice["setting"], string][] = [
    ["mix", "Mix"],
    ["indian", "India"],
    ["global", "Other countries"],
  ];
  return (
    <section className={cn(card, "space-y-4 p-4 hard-shadow-sm")} aria-label="Make an AI case">
      <div>
        <span className={cn(chip, "bg-status-info-bg text-status-info-fg")}>
          <Sparkles className="size-4" aria-hidden /> {AI_CASE_LABEL}
        </span>
        <p className="mt-2 text-sm text-muted-foreground">{AI_CASE_NOTE}.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="font-bold">Topic</span>
          <select
            value={choice.topic}
            disabled={making}
            onChange={(e) => onChoice({ ...choice, topic: e.target.value })}
            className="mt-1 h-11 w-full rounded-md border-2 border-foreground bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Any topic</option>
            {AI_TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </label>
        <fieldset>
          <legend className="font-bold">Where</legend>
          <div className="mt-1 flex flex-wrap gap-2">
            {settings.map(([id, label]) => (
              <label
                key={id}
                className={cn(
                  "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border-2 border-foreground px-3 text-sm font-bold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                  choice.setting === id ? "bg-foreground text-background" : "bg-card hover:bg-accent",
                )}
              >
                <input type="radio" name="ai-setting" value={id} checked={choice.setting === id} disabled={making} onChange={() => onChoice({ ...choice, setting: id })} className="sr-only" />
                {choice.setting === id && <Check className="size-4" aria-hidden />}
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <button type="button" className={cn(btnPrimary, "w-full sm:w-auto")} disabled={making} onClick={onStart}>
        {making ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Sparkles className="size-4" aria-hidden />}
        {making ? "Making your case…" : "Get an AI case"}
      </button>
      {making && (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          A new case is written, then checked against the criteria. This can take up to 30 seconds.
        </p>
      )}
    </section>
  );
}

/** "This case looks wrong": the case leaves practice until an admin checks it. */
function AiFlag({ caseId }: { caseId: string }) {
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [msg, setMsg] = React.useState<{ ok: boolean; text: string } | null>(null);
  const [sending, startSending] = React.useTransition();
  if (msg?.ok) {
    return (
      <p className="flex items-center gap-2 rounded-md border-2 border-foreground bg-status-success-bg px-3 py-2 text-sm font-semibold text-status-success-fg" role="status">
        <Check className="size-4" aria-hidden /> {msg.text}
      </p>
    );
  }
  return (
    <div className={cn(card, "p-3")}>
      {!open ? (
        <button type="button" className={cn(btnSecondary, "w-full sm:w-auto")} onClick={() => setOpen(true)}>
          <Flag className="size-4" aria-hidden /> Something wrong with this case?
        </button>
      ) : (
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            startSending(async () => {
              const r = await flagAiCaseAction({ caseId, reason });
              setMsg({ ok: r.ok, text: r.message });
            });
          }}
        >
          <label htmlFor={`flag-${caseId}`} className="font-bold">
            What looks wrong?
          </label>
          <textarea
            id={`flag-${caseId}`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="e.g. the answer doesn't fit clue 4"
            className="w-full rounded-md border-2 border-foreground bg-background p-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="flex flex-wrap gap-2">
            <button type="submit" className={btnInk} disabled={sending}>
              {sending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />} Send report
            </button>
            <button type="button" className={btnSecondary} disabled={sending} onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
          {msg && !msg.ok && (
            <p role="alert" className="text-sm font-semibold text-status-alert-fg">
              {msg.text}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
