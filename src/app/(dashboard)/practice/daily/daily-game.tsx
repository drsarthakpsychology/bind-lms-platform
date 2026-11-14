"use client";

import * as React from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarDays,
  Camera,
  Check,
  ClipboardList,
  CloudOff,
  Copy,
  Flag,
  Flame,
  FlaskConical,
  LoaderCircle,
  MessageCircle,
  RotateCw,
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
import type { CaseRest, CaseView } from "@/lib/games/daily/view";
import type { InvestigationKind } from "@/lib/games/daily/types";
import { CountUp } from "@/lib/games/ui/count-up";
import { LearnLink } from "@/lib/games/ui/learn-link";
import { awardXp } from "@/lib/games/ui/xp";
import { copyText, readLocal, useLocalJson, writeLocal, writeLocalShared } from "@/lib/games/ui/copy";
import { btnInk, btnPrimary, btnSecondary, card, chip } from "@/lib/games/ui/styles";
import fx from "@/lib/games/ui/fx.module.css";
import { AI_CASE_LABEL, AI_CASE_NOTE } from "@/lib/ai-cases/types";
import { AI_TOPICS } from "@/lib/ai-cases/criteria";
import { dailyMove, dailyRest, flagAiCaseAction, nextAiCase, nextPractice, type DailyMeta, type MoveResult } from "./actions";
import { creditServerPlay } from "@/lib/learn/credit-play";
import { HintButton, type HintUse } from "@/components/hints/hint-chip";
import { CASE_SCORE_PER_HINT } from "@/lib/hints/rules";
import type { HintStatus } from "@/lib/hints/engine";
import { useReaction } from "@/components/reactions/use-reaction";
import { EndReaction } from "@/components/reactions/graphics";

const EMPTY = emptyState();
type Save = (s: LearnState) => Promise<unknown>;
type Game = { view: CaseView; meta: DailyMeta; log: Action[] };
type Ok = Extract<MoveResult, { ok: true }>;
type Tab = "daily" | "practice" | "ai";
type AiChoice = { topic: string };

const KIND_ICON: Record<InvestigationKind, typeof Brain> = { mse: Brain, collateral: Users, scale: ClipboardList, lab: FlaskConical };
const KIND_WORD: Record<InvestigationKind, string> = { mse: "Mental state", collateral: "Collateral", scale: "Rating scale", lab: "Test" };

const LOCAL_LOG = (mode: string, day: string, id: string) => `vibha-daily-log:${mode}:${day}:${id}`;
const LOCAL_DAYS = "vibha-daily-days";
const LOCAL_PRACTICE = "vibha-daily-practice";
const LOCAL_AI_SEEN = "vibha-ai-cases-seen";
const NO_DAYS: string[] = [];
const AI_DOWN = "AI cases are coming soon. They will start working here once the AI service is switched on. Today's case and Practice work now.";
const LOAD_FAIL = "That didn't load.";

function dayLabel(day: string) {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });
}

function worth(v: CaseView) {
  return Math.max(0, Math.max(10, 100 - 15 * v.points) - CASE_SCORE_PER_HINT * v.hints.used);
}

export function DailyGame({ serverState, save, initial }: { serverState: LearnState | null; save: Save; initial: MoveResult }) {
  initLearnStore(serverState, save);
  const state = useLearnState(serverState ?? EMPTY);
  const [tab, setTab] = React.useState<Tab>("daily");
  const [daily, setDaily] = React.useState<Game | null>(initial.ok ? { view: initial.view, meta: initial.meta, log: initial.log } : null);
  const [practice, setPractice] = React.useState<Game | null>(null);
  const [aiGame, setAiGame] = React.useState<Game | null>(null);
  const [aiChoice, setAiChoice] = React.useState<AiChoice>({ topic: "" });
  const [making, setMaking] = React.useState(false);
  const [error, setErrorRaw] = React.useState<{ tab: Tab; text: string } | null>(initial.ok ? null : { tab: "daily", text: initial.error });
  const [pending, startTransition] = React.useTransition();
  const [shake, setShake] = React.useState(0);
  const [gain, setGain] = React.useState<{ xp: number; key: number } | null>(null);
  const localDays = useLocalJson<string[]>(LOCAL_DAYS, NO_DAYS);
  const reaction = useReaction();

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
  /** Errors belong to the tab they happened on, so switching tabs never shows a stale one. */
  const setError = (text: string | null, on: Tab = tab) => setErrorRaw(text ? { tab: on, text } : null);
  const shownError = error && error.tab === tab ? error.text : null;

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
      // The guess that ends the case gets its reaction on the result card, not as a pop-up.
      if (last && !res.justFinished) reaction.onAnswer(last.ok);
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
      const res = await dailyMove({ mode: t === "daily" ? "daily" : "practice", caseId: cur.view.caseId, log: cur.log, action }).catch(() => ({ ok: false as const, error: "Connection lost. Try that again." }));
      if (!res.ok) {
        setError(res.error, t);
        return;
      }
      after(t, res, action);
    });
  }

  /** One hint on the open case: the server charges it and sends the hint back in the view. */
  function takeHint(): Promise<HintUse> {
    const t = tab;
    const cur = t === "daily" ? daily : t === "practice" ? practice : aiGame;
    return new Promise((resolve) => {
      if (!cur) return resolve({ ok: false, error: LOAD_FAIL });
      setError(null);
      startTransition(async () => {
        const res = await dailyMove({ mode: t === "daily" ? "daily" : "practice", caseId: cur.view.caseId, log: cur.log, action: { t: "hint" } }).catch(() => null);
        if (!res) return resolve({ ok: false, error: "Couldn't get a hint. Try again." });
        if (!res.ok) return resolve({ ok: false, error: res.error });
        after(t, res, { t: "hint" });
        resolve({ ok: true, status: res.meta.hints });
      });
    });
  }

  /** A hint purchase changes the count shown on every tab. */
  function setHints(h: HintStatus) {
    const upd = (g: Game | null) => (g ? { ...g, meta: { ...g.meta, hints: h } } : g);
    setDaily(upd);
    setPractice(upd);
    setAiGame(upd);
  }

  function newAi(choice: AiChoice = aiChoice) {
    setError(null, "ai");
    setTab("ai");
    setAiGame(null);
    setMaking(true);
    startTransition(async () => {
      try {
        const seen = readLocal<string[]>(LOCAL_AI_SEEN, []);
        const pick = await nextAiCase({ topic: choice.topic || null, setting: null, exclude: seen }).catch(() => ({ ok: false as const, error: AI_DOWN }));
        if (!pick.ok) {
          setError(pick.error || AI_DOWN, "ai");
          return;
        }
        writeLocal(LOCAL_AI_SEEN, [...seen.filter((x) => x !== pick.caseId), pick.caseId].slice(-100));
        const res = await dailyMove({ mode: "practice", caseId: pick.caseId, log: readLocal<Action[]>(LOCAL_LOG("practice", daily?.meta.day ?? "", pick.caseId), []) }).catch(() => ({ ok: false as const, error: AI_DOWN }));
        if (!res.ok) {
          setError(res.error || AI_DOWN, "ai");
          return;
        }
        after("ai", res);
      } finally {
        setMaking(false);
      }
    });
  }

  function newPractice() {
    setError(null, "practice");
    setTab("practice");
    setPractice(null);
    startTransition(async () => {
      const pick = await nextPractice(readLocal<PracticeRecord[]>(LOCAL_PRACTICE, [])).catch(() => ({ ok: false as const, error: LOAD_FAIL }));
      if (!pick.ok) {
        setError(pick.error, "practice");
        return;
      }
      const res = await dailyMove({ mode: "practice", caseId: pick.caseId, log: readLocal<Action[]>(LOCAL_LOG("practice", daily?.meta.day ?? "", pick.caseId), []) }).catch(() => ({ ok: false as const, error: LOAD_FAIL }));
      if (!res.ok) {
        setError(res.error, "practice");
        return;
      }
      after("practice", res);
    });
  }

  function reloadDaily() {
    setError(null, "daily");
    startTransition(async () => {
      const res = await dailyMove({ mode: "daily" }).catch(() => ({ ok: false as const, error: LOAD_FAIL }));
      if (!res.ok) setError(res.error, "daily");
      else after("daily", res);
    });
  }

  function openTab(t: Tab) {
    setTab(t);
    if (t === "practice" && !practice && !pending) newPractice();
  }

  const streak = daily ? Math.max(daily.meta.streak, daily.meta.stored ? 0 : dailyStreak(localDays, daily.meta.day)) : 0;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <ModeSwitch tab={tab} onPick={openTab} />

      {tab === "ai" && (making || !aiGame) ? (
        <AiStart choice={aiChoice} onChoice={setAiChoice} making={making} error={shownError} onStart={() => newAi()} />
      ) : !game ? (
        shownError ? (
          <CalmLine text={shownError} onRetry={tab === "daily" ? reloadDaily : newPractice} busy={pending} />
        ) : (
          <div className={cn(card, "flex min-h-40 items-center justify-center gap-2 p-6 text-muted-foreground")}>
            <LoaderCircle className="size-5 animate-spin" aria-hidden /> Finding a case…
          </div>
        )
      ) : (
        <CaseBoard
          key={`${tab}:${game.view.caseId}`}
          error={shownError}
          game={game}
          pending={pending}
          shake={shake}
          gain={gain}
          onMove={move}
          onHint={takeHint}
          onHints={setHints}
          onNextPractice={tab === "ai" ? () => newAi() : newPractice}
          streak={streak}
        />
      )}
    </div>
  );
}

function CaseBoard({
  error,
  game,
  pending,
  shake,
  gain,
  onMove,
  onHint,
  onHints,
  onNextPractice,
  streak,
}: {
  error: string | null;
  game: Game;
  pending: boolean;
  shake: number;
  gain: { xp: number; key: number } | null;
  onMove: (a?: Action) => void;
  onHint: () => Promise<HintUse>;
  onHints: (h: HintStatus) => void;
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

  return (
    <div className="space-y-4">
      <header className={cn(card, "p-4 hard-shadow-sm")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-eyebrow text-link">{v.mode === "daily" ? `Case #${meta.number} · ${dayLabel(meta.day)}` : v.ai ? AI_CASE_LABEL : "Practice case"}</p>
          <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-foreground">
            {v.mode === "daily" && streak > 0 && (
              <span className={cn(chip, "bg-card text-foreground")} title="Days in a row">
                <Flame className="size-4" aria-hidden /> {streak}
              </span>
            )}
            Level {v.difficulty}/3
          </span>
        </div>
        {v.ai && <AiBadge />}
        <p className="mt-1 text-sm text-muted-foreground">{v.setting}</p>
        <ClueMeter shown={v.cluesOpen} status={v.status} />
        {playing && (
          <p className="mt-2 text-sm">
            Worth <strong className="tabular-nums">{worth(v)} points</strong> now. Each clue or test: minus 15. Each hint: minus {CASE_SCORE_PER_HINT}.
          </p>
        )}
      </header>

      {error && <CalmLine text={error} />}

      <ol className="space-y-2" aria-label="Clues">
        {v.clues.map((c, i) => {
          const fresh = playing && i === v.clues.length - 1 && i > 0;
          return (
            <li key={i} className={cn(card, "flex gap-3 p-3", fresh && "hard-shadow-sm", fresh && anim(fx.reveal))}>
              <span key={fresh ? `n${i}` : i} className={cn("grid size-7 shrink-0 place-items-center rounded-md border-2 border-foreground bg-primary font-pix text-sm text-primary-foreground", fresh && anim(fx.pop))}>
                {i + 1}
              </span>
              <p className="min-w-0 flex-1 leading-snug">{c}</p>
              {fresh && <span className={cn(chip, "h-fit shrink-0 bg-card text-xs")}>New</span>}
            </li>
          );
        })}
      </ol>

      {!playing && v.unopened > 0 && <OtherClues game={game} />}

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
          <HintButton
            status={meta.hints}
            onStatus={onHints}
            onUse={onHint}
            used={!canHint}
            disabled={pending}
            shown={
              v.hints.chapter || v.hints.pointer ? (
                <>
                  {v.hints.chapter && <p>Chapter: {v.hints.chapter}.</p>}
                  {v.hints.pointer && <p>{v.hints.pointer}</p>}
                </>
              ) : null
            }
          />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button type="button" className={btnSecondary} disabled={pending || !v.canClue} onClick={() => onMove({ t: "clue" })}>
              <ArrowRight className="size-4" aria-hidden /> Next clue
            </button>
            <button type="button" className={btnSecondary} aria-expanded={showTests} disabled={pending || v.investigations.every((x) => x.ordered)} onClick={() => setShowTests((s) => !s)}>
              <FlaskConical className="size-4" aria-hidden /> Order a test
            </button>
            {confirmQuit ? (
              <button type="button" className={cn(btnInk, "col-span-2 sm:col-span-1")} disabled={pending} onClick={() => onMove({ t: "giveup" })}>
                <Flag className="size-4" aria-hidden /> Yes, show me
              </button>
            ) : (
              <button type="button" className={cn(btnSecondary, "col-span-2 sm:col-span-1")} disabled={pending} onClick={() => setConfirmQuit(true)}>
                <Flag className="size-4" aria-hidden /> Give up
              </button>
            )}
          </div>
          {!v.canClue && v.cluesOpen < MAX_CLUES ? <p className="text-sm text-muted-foreground">Make a guess to open clue {v.cluesOpen + 1}.</p> : null}
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

/**
 * After the end: the clues and tests the student never opened stay on the
 * server until this one small control asks for them.
 */
function OtherClues({ game }: { game: Game }) {
  const { view: v } = game;
  const [rest, setRest] = React.useState<CaseRest | null>(null);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [pending, start] = React.useTransition();
  function toggle() {
    if (open) return setOpen(false);
    if (rest) return setOpen(true);
    setError(null);
    start(async () => {
      const r = await dailyRest({ mode: v.mode, caseId: v.caseId, log: game.log }).catch(() => null);
      if (!r || !r.ok) return setError(r?.error ?? LOAD_FAIL);
      setRest(r.rest);
      setOpen(true);
    });
  }
  return (
    <div className="space-y-2">
      <button type="button" className={cn(btnSecondary, "min-h-11 w-full sm:w-auto")} aria-expanded={open} disabled={pending} onClick={toggle}>
        {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Search className="size-4" aria-hidden />}
        {open ? "Hide the other clues" : "Show the other clues"}
      </button>
      {error && <p role="status" className="text-sm text-muted-foreground">{error}</p>}
      {open && rest && (
        <ul className="space-y-2" aria-label="Clues and tests you didn't open">
          {rest.clues.map((x) => (
            <li key={`c${x.n}`} className={cn(card, "flex gap-3 border-dashed bg-background p-3")}>
              <span className="grid size-7 shrink-0 place-items-center rounded-md border-2 border-foreground bg-background font-pix text-sm">{x.n}</span>
              <p className="min-w-0 flex-1 leading-snug">{x.text}</p>
            </li>
          ))}
          {rest.tests.map((x) => {
            const Icon = KIND_ICON[x.kind];
            return (
              <li key={`t${x.label}`} className={cn(card, "flex gap-3 border-dashed bg-background p-3")}>
                <Icon className="mt-0.5 size-5 shrink-0" aria-hidden />
                <p className="min-w-0 flex-1 leading-snug">
                  <span className="font-bold">
                    {KIND_WORD[x.kind]}: {x.label}.
                  </span>{" "}
                  {x.result}
                </p>
              </li>
            );
          })}
        </ul>
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
  const shareUrl = () => `${window.location.origin}/practice/daily`;
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
        <EndReaction mood={solved ? (v.cluesOpen <= 2 ? "streak" : "right") : "wrong"} seed={v.caseId} className="mx-auto mt-4 w-fit max-w-full justify-center" />
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
          <pre className="mt-2 rounded-lg border-2 border-dashed border-foreground bg-background p-3 font-sans text-sm whitespace-pre-wrap">{text("whatsapp")}</pre>
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

      {r.refs && r.refs.length > 0 && (
        <details className="rounded-md border-2 border-dashed border-foreground/40 p-3 text-sm text-muted-foreground">
          <summary className="cursor-pointer font-semibold">Sources</summary>
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

/** The AI case note under the header: icon + words, never colour alone. */
function AiBadge() {
  return (
    <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
      <Sparkles className="size-4 shrink-0" aria-hidden /> {AI_CASE_NOTE}
    </p>
  );
}

function AiStart({ choice, onChoice, making, error, onStart }: { choice: AiChoice; onChoice: (c: AiChoice) => void; making: boolean; error: string | null; onStart: () => void }) {
  return (
    <section className={cn(card, "space-y-3 p-4 hard-shadow-sm")} aria-label={AI_CASE_LABEL}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="block min-w-0 flex-1">
          <span className="text-sm font-bold">Topic</span>
          <select
            value={choice.topic}
            disabled={making}
            onChange={(e) => onChoice({ topic: e.target.value })}
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
        <button type="button" className={cn(btnPrimary, "min-h-11 sm:w-auto")} disabled={making} onClick={onStart}>
          {making ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Sparkles className="size-4" aria-hidden />}
          {making ? "Making your case…" : error ? "Try again" : "Start"}
        </button>
      </div>
      <p className="flex items-center gap-2 text-sm font-bold">
        <span className="rounded-full border-2 border-foreground bg-primary px-2 py-0.5 text-xs text-primary-foreground">Coming soon</span>
        <span className="text-muted-foreground">AI cases are being switched on. If one doesn&apos;t load yet, use Today&apos;s case or Practice.</span>
      </p>
      {error && !making ? (
        <p className="flex items-start gap-2 text-sm" role="status">
          <CloudOff className="mt-0.5 size-4 shrink-0" aria-hidden /> <span className="min-w-0">{error}</span>
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">{AI_CASE_NOTE}.</p>
      )}
    </section>
  );
}

/** The three ways to play, as one obvious switch. */
function ModeSwitch({ tab, onPick }: { tab: Tab; onPick: (t: Tab) => void }) {
  const modes: [Tab, string, typeof Brain][] = [
    ["daily", "Today's case", CalendarDays],
    ["practice", "Practice", Shuffle],
    ["ai", AI_CASE_LABEL, Sparkles],
  ];
  return (
    <div role="tablist" aria-label="Case type" className="grid grid-cols-3 gap-1 rounded-lg border-2 border-foreground bg-card p-1">
      {modes.map(([t, label, Icon]) => (
        <button
          key={t}
          role="tab"
          type="button"
          aria-selected={tab === t}
          onClick={() => onPick(t)}
          className={cn(
            "flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-md px-2 text-sm font-bold transition-colors duration-200",
            tab === t ? "bg-foreground text-background" : "text-foreground hover:bg-accent",
          )}
        >
          <Icon className="size-4 shrink-0" aria-hidden />
          <span className="truncate">{label}</span>
          {t === "ai" ? <span className="shrink-0 rounded-full border border-current px-1.5 text-[10px] font-bold uppercase leading-4">Soon</span> : null}
        </button>
      ))}
    </div>
  );
}

/** One quiet line when something can't load, with a retry when there is one. */
function CalmLine({ text, onRetry, busy = false }: { text: string; onRetry?: () => void; busy?: boolean }) {
  return (
    <div className={cn(card, "flex flex-wrap items-center gap-x-3 gap-y-2 p-3")} role="status">
      <p className="flex min-w-0 flex-1 items-start gap-2 text-sm font-semibold">
        <CloudOff className="mt-0.5 size-4 shrink-0" aria-hidden /> <span className="min-w-0">{text}</span>
      </p>
      {onRetry && (
        <button type="button" className={cn(btnSecondary, "min-h-10")} disabled={busy} onClick={onRetry}>
          {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <RotateCw className="size-4" aria-hidden />} Try again
        </button>
      )}
    </div>
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
              const r = await flagAiCaseAction({ caseId, reason }).catch(() => ({ ok: false, message: "Connection lost. Try again." }));
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
