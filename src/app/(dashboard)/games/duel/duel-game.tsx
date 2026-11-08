"use client";

import * as React from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { ArrowDown, ArrowLeft, ArrowUp, Bot, Check, Crown, Flag, LoaderCircle, Search, Shield, Swords, Timer, User, Users, X } from "lucide-react";
import { emptyState, type LearnState } from "@/lib/learn/engine";
import { initLearnStore, useLearnState } from "@/lib/learn/store";
import { trackLearn } from "@/lib/learn/track";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { canAnswer, matchState, ROUND_MS, WIN_XP, type AnswerRec, type MatchRec } from "@/lib/games/duel/engine";
import type { DuelItem } from "@/lib/games/duel/items";
import { pairWindow, tierFor } from "@/lib/games/duel/rating";
import { buildDuelView, type DuelView } from "@/lib/games/duel/view";
import type { DuelProfile } from "@/lib/games/duel/server";
import { CountUp } from "@/lib/games/ui/count-up";
import { LearnLink } from "@/lib/games/ui/learn-link";
import { awardXp } from "@/lib/games/ui/xp";
import { readLocal, writeLocal } from "@/lib/games/ui/copy";
import { btnPrimary, btnSecondary, card, chip } from "@/lib/games/ui/styles";
import fx from "@/lib/games/ui/fx.module.css";
import styles from "./duel.module.css";

const EMPTY = emptyState();
type Save = (s: LearnState) => Promise<unknown>;
type Api = { kind?: string; view?: DuelView; matchId?: string; waitedMs?: number; botReady?: boolean; rating?: number; error?: string | null };

async function api(body: object): Promise<Api> {
  try {
    const res = await fetch("/games/duel/live", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), cache: "no-store" });
    const j = (await res.json().catch(() => ({}))) as Api;
    if (!res.ok && !j.view) return { error: j.error ?? "Connection problem." };
    return j;
  } catch {
    return { error: "You're offline. Reconnecting…" };
  }
}

type Screen = { kind: "lobby" } | { kind: "queue"; matchId: string; since: number } | { kind: "match"; view: DuelView } | { kind: "local"; items: DuelItem[]; seed: number };

export function DuelGame({ serverState, save, profile, offlineItems }: { serverState: LearnState | null; save: Save; profile: DuelProfile; offlineItems: DuelItem[] | null }) {
  initLearnStore(serverState, save);
  const state = useLearnState(serverState ?? EMPTY);
  const [screen, setScreen] = React.useState<Screen>({ kind: "lobby" });
  const [prof, setProf] = React.useState(profile);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function findMatch() {
    setError(null);
    setBusy(true);
    const r = await api({ op: "join" });
    setBusy(false);
    if (r.error === "unavailable") return setError("Ranked duels are not open yet. Play the bot.");
    if (r.error) return setError(r.error);
    if (r.kind === "match" && r.view) setScreen({ kind: "match", view: r.view });
    else if (r.kind === "queued" && r.matchId) setScreen({ kind: "queue", matchId: r.matchId, since: r.waitedMs ?? 0 });
  }

  async function playBot() {
    setError(null);
    if (!prof.available && offlineItems) {
      setScreen({ kind: "local", items: offlineItems, seed: Math.floor(Math.random() * 2 ** 31) });
      return;
    }
    setBusy(true);
    const r = await api({ op: "bot" });
    setBusy(false);
    if (r.view) setScreen({ kind: "match", view: r.view });
    else if (offlineItems) setScreen({ kind: "local", items: offlineItems, seed: Math.floor(Math.random() * 2 ** 31) });
    else setError(r.error ?? "Couldn't start a practice match.");
  }

  async function rejoin(id: string) {
    const r = await api({ op: "poll", matchId: id });
    if (r.view) setScreen({ kind: "match", view: r.view });
  }

  function finished(v: DuelView) {
    // XP for effort: 3 per right diagnosis, 2 per right feature. Once per match.
    // A ranked win also pays WIN_XP, but on the server (the "duel:win" ledger row).
    const paid = readLocal<string[]>("vibha-duel-xp", []);
    if (paid.includes(v.matchId)) return;
    writeLocal("vibha-duel-xp", [...paid, v.matchId].slice(-100));
    let xp = 0;
    for (const r of v.closed) {
      xp += (r.you.dxOk ? 3 : 0) + (r.you.featureOk ? 2 : 0);
      trackLearn({ type: "game", kind: "duel", ok: r.you.dxOk, skill: `${r.topic}:differentiate`, item: `${v.matchId}:${r.round}`, prompt: r.correctDx, ms: r.you.ms ?? undefined });
    }
    awardXp(xp, state);
    if (v.result?.rating != null && v.result.delta != null) {
      const rating = v.result.rating;
      const delta = v.result.delta;
      const outcome = v.result.outcome;
      setProf((p) => ({ ...p, rating, games: p.games + (v.ranked ? 1 : 0), wins: p.wins + (outcome === "win" ? 1 : 0), losses: p.losses + (outcome === "loss" ? 1 : 0), history: [{ id: v.matchId, when: new Date().toISOString(), opp: v.opp.name, outcome, score: `${v.score.you} to ${v.score.opp}`, delta, ranked: v.ranked, forfeit: (v.result?.reason === "forfeit" ? (v.result.youForfeited ? "you" : "them") : null) as "you" | "them" | null }, ...p.history].slice(0, 10) }));
    }
  }

  if (screen.kind === "queue")
    return (
      <Queue
        matchId={screen.matchId}
        since={screen.since}
        rating={prof.rating}
        onMatch={(view) => setScreen({ kind: "match", view })}
        onCancel={() => setScreen({ kind: "lobby" })}
        onBot={async () => {
          await api({ op: "leave", matchId: screen.matchId });
          await playBot();
        }}
      />
    );
  if (screen.kind === "match") return <RemoteMatch initial={screen.view} onDone={finished} onBack={() => setScreen({ kind: "lobby" })} onAgain={findMatch} />;
  if (screen.kind === "local") return <LocalMatch items={screen.items} seed={screen.seed} onDone={finished} onBack={() => setScreen({ kind: "lobby" })} onAgain={playBot} />;

  // A first-timer (or anyone when ranked play is off) is pointed at the bot.
  const botFirst = !prof.available || prof.games === 0;
  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 px-4 py-5 sm:px-6">
      {error && (
        <p role="alert" className="rounded-md border-2 border-foreground bg-status-pending-bg px-3 py-2 text-sm font-semibold">
          {error}
        </p>
      )}

      {prof.liveMatchId && (
        <button type="button" className={cn(btnPrimary, "w-full")} onClick={() => rejoin(prof.liveMatchId!)}>
          <Swords className="size-5" aria-hidden /> Back to your live match
        </button>
      )}

      <section aria-labelledby="duel-who" className="space-y-2">
        <h2 id="duel-who" className="text-h3">
          Who do you want to play?
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <OpponentCard icon={Bot} title="Practice bot" line="Starts now. No rating." action="Play the bot" primary={botFirst} busy={busy} onClick={playBot} />
          <OpponentCard
            icon={Users}
            title="A classmate"
            line={prof.available ? "Ranked. Leaving counts as a loss." : "Ranked play opens soon."}
            action="Find a match"
            primary={!botFirst}
            busy={busy}
            disabled={!prof.available}
            onClick={findMatch}
          />
        </div>
      </section>

      <section className={cn(card, "flex flex-wrap items-center gap-x-4 gap-y-1 p-4")} aria-label="Your rating">
        <p className="font-pix text-3xl tabular-nums">{prof.rating}</p>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">
            Rating · {prof.tier}
          </p>
          <p className="text-sm text-muted-foreground">
            {prof.games ? `${prof.wins} won · ${prof.losses} lost${prof.draws ? ` · ${prof.draws} drawn` : ""}` : "Play a ranked match to move it."}
            {prof.percentile !== null ? ` · above ${prof.percentile}% of players` : ""}
          </p>
        </div>
      </section>

      {prof.history.length > 0 && (
        <section className={cn(card, "p-4")} aria-labelledby="history">
          <h2 id="history" className="font-bold">
            Recent matches
          </h2>
          <ul className="mt-2 divide-y-2 divide-foreground/10">
            {prof.history.map((h) => (
              <li key={h.id} className="flex items-center gap-3 py-2 text-sm">
                <span className={cn(chip, "w-16 justify-center text-xs", h.outcome === "win" ? "bg-primary text-primary-foreground" : h.outcome === "loss" ? "bg-foreground text-background" : "bg-card")}>
                  {h.outcome === "win" ? <Crown className="size-3" aria-hidden /> : h.outcome === "loss" ? <X className="size-3" aria-hidden /> : null}
                  {h.outcome === "win" ? "Win" : h.outcome === "loss" ? "Loss" : "Draw"}
                </span>
                <span className="min-w-0 flex-1 truncate">
                  vs {h.opp}
                  {h.forfeit && <span className="text-muted-foreground"> · {h.forfeit === "you" ? "you left" : "they left"}</span>}
                </span>
                <span className="tabular-nums">{h.score}</span>
                <span className="w-10 text-right font-bold tabular-nums">{h.delta === null ? "" : `${h.delta > 0 ? "+" : ""}${Math.round(h.delta)}`}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function OpponentCard({ icon: Icon, title, line, action, primary, busy, disabled = false, onClick }: { icon: typeof Bot; title: string; line: string; action: string; primary: boolean; busy: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <div className={cn(card, "flex flex-col gap-3 p-4", primary && "hard-shadow-md", disabled && "opacity-70")}>
      <div className="flex items-center gap-3">
        <span className={cn("grid size-12 shrink-0 place-items-center rounded-lg border-2 border-foreground", primary ? "bg-primary text-primary-foreground" : "bg-background")}>
          <Icon className="size-6" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="font-bold">{title}</p>
          <p className="text-sm text-muted-foreground">{line}</p>
        </div>
      </div>
      <button type="button" className={cn(primary ? btnPrimary : btnSecondary, "mt-auto min-h-12 w-full")} onClick={onClick} disabled={busy || disabled}>
        {busy ? <LoaderCircle className="size-5 animate-spin" aria-hidden /> : <Icon className="size-5" aria-hidden />} {action}
      </button>
    </div>
  );
}

function Queue({ matchId, since, rating, onMatch, onCancel, onBot }: { matchId: string; since: number; rating: number; onMatch: (v: DuelView) => void; onCancel: () => void; onBot: () => void }) {
  const [waited, setWaited] = React.useState(since);
  const [err, setErr] = React.useState<string | null>(null);
  const botStarted = React.useRef(false);
  const reduce = useReducedMotion();
  const cbs = React.useRef({ onMatch, onCancel, onBot });
  React.useEffect(() => {
    cbs.current = { onMatch, onCancel, onBot };
  });
  React.useEffect(() => {
    let alive = true;
    let busy = false;
    const id = setInterval(async () => {
      if (busy) return;
      busy = true;
      const r = await api({ op: "queue", matchId });
      busy = false;
      if (!alive) return;
      if (r.kind === "match" && r.view) {
        haptic("success");
        cbs.current.onMatch(r.view);
      } else if (r.kind === "queued") {
        setErr(null);
        setWaited(r.waitedMs ?? 0);
        if (r.botReady && !botStarted.current) {
          botStarted.current = true;
          cbs.current.onBot();
        }
      } else if (r.kind === "gone") cbs.current.onCancel();
      else if (r.error) setErr(r.error);
    }, 1000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [matchId]);
  const secs = Math.floor(waited / 1000);
  return (
    <div className="mx-auto w-full max-w-md space-y-5 px-4 py-10 text-center">
      <div className={cn("mx-auto grid size-24 place-items-center rounded-lg border-2 border-foreground bg-primary text-primary-foreground hard-shadow-md", reduce === false && fx.pulse)}>
        <Search className="size-10" aria-hidden />
      </div>
      <h2 className="text-h2">Finding an opponent</h2>
      <p className="font-pix text-3xl tabular-nums" aria-live="polite">
        0:{String(secs).padStart(2, "0")}
      </p>
      <p className="text-sm text-muted-foreground" title={`Rated ${Math.round(rating - pairWindow(waited))} to ${Math.round(rating + pairWindow(waited))}`}>
        No one free after 20 seconds? You play the bot instead.
      </p>
      {err && <p className="text-sm font-semibold">{err}</p>}
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          className={btnSecondary}
          onClick={async () => {
            await api({ op: "leave", matchId });
            onCancel();
          }}
        >
          <ArrowLeft className="size-4" aria-hidden /> Cancel
        </button>
        <button type="button" className={btnSecondary} onClick={onBot}>
          <Bot className="size-4" aria-hidden /> Play the bot now
        </button>
      </div>
    </div>
  );
}

/** Live match against the server: poll about once a second. */
function RemoteMatch({ initial, onDone, onBack, onAgain }: { initial: DuelView; onDone: (v: DuelView) => void; onBack: () => void; onAgain: () => void }) {
  const [view, setView] = React.useState(initial);
  const [clock, setClock] = React.useState(initial.serverNow);
  const [err, setErr] = React.useState<string | null>(null);
  const offset = React.useRef(0);
  const over = React.useRef(initial.phase === "over");
  const done = React.useRef(false);
  const onDoneRef = React.useRef(onDone);
  React.useEffect(() => {
    onDoneRef.current = onDone;
  });

  const accept = React.useCallback((v: DuelView) => {
    offset.current = v.serverNow - Date.now();
    over.current = v.phase === "over";
    setView(v);
    if (v.phase === "over" && !done.current) {
      done.current = true;
      haptic(v.result?.outcome === "win" ? "success" : "warning");
      onDoneRef.current(v);
    }
  }, []);

  React.useEffect(() => {
    offset.current = initial.serverNow - Date.now();
    if (initial.phase === "over" && !done.current) {
      done.current = true;
      onDoneRef.current(initial);
    }
  }, [initial]);

  React.useEffect(() => {
    let alive = true;
    let busy = false;
    const poll = setInterval(async () => {
      if (busy || over.current) return;
      busy = true;
      const r = await api({ op: "poll", matchId: initial.matchId });
      busy = false;
      if (!alive) return;
      if (r.view) {
        setErr(null);
        accept(r.view);
      } else if (r.error) setErr(r.error);
    }, 1000);
    const tick = setInterval(() => setClock(Date.now() + offset.current), 200);
    return () => {
      alive = false;
      clearInterval(poll);
      clearInterval(tick);
    };
  }, [initial.matchId, accept]);

  // Leaving the page mid-match is a loss: warn first.
  React.useEffect(() => {
    if (view.phase === "over") return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [view.phase]);

  async function answer(round: number, dx: number, feature: number) {
    const r = await api({ op: "answer", matchId: view.matchId, round, dx, feature });
    if (r.view) accept(r.view);
    if (r.error) setErr(r.error);
  }
  async function quit() {
    const r = await api({ op: "quit", matchId: view.matchId });
    if (r.view) accept(r.view);
  }

  return <Arena view={view} clock={clock} err={err} onAnswer={answer} onQuit={quit} onBack={onBack} onAgain={onAgain} />;
}

/** Practice against the bot entirely in the browser (used when the duel tables aren't set up). */
function LocalMatch({ items, seed, onDone, onBack, onAgain }: { items: DuelItem[]; seed: number; onDone: (v: DuelView) => void; onBack: () => void; onAgain: () => void }) {
  const [m, setM] = React.useState<MatchRec | null>(null);
  const [answers, setAnswers] = React.useState<AnswerRec[]>([]);
  const [clock, setClock] = React.useState(0);
  const done = React.useRef(false);
  const lookup = React.useCallback((id: string) => items.find((i) => i.id === id), [items]);

  React.useEffect(() => {
    const start = Date.now();
    const rec: MatchRec = { id: `local-${seed}`, p1: "me", p2: null, bot: true, ranked: false, status: "active", items: items.map((i) => i.id), seed, startedAt: start, p1Seen: start, p2Seen: null, forfeitBy: null };
    const t = setTimeout(() => {
      setM(rec);
      setClock(start);
    }, 0);
    const tick = setInterval(() => {
      setClock(Date.now());
      setM((cur) => (cur ? { ...cur, p1Seen: Date.now() } : cur));
    }, 200);
    return () => {
      clearTimeout(t);
      clearInterval(tick);
    };
  }, [items, seed]);

  const view = m ? buildDuelView(m, answers, clock, "me", lookup, { names: { you: "You", opp: "Practice bot" }, ratings: { you: null, opp: null } }) : null;

  React.useEffect(() => {
    if (view?.phase === "over" && !done.current) {
      done.current = true;
      onDone(view);
    }
  }, [view, onDone]);

  if (!m || !view) return null;
  return (
    <Arena
      view={view}
      clock={clock}
      err={null}
      onAnswer={(round, dx, feature) => {
        const at = Date.now();
        const s = matchState(m, answers, at);
        if (canAnswer(m, s, "me", round)) setAnswers((a) => [...a, { userId: "me", round, dx, feature, at }]);
      }}
      onQuit={() => setM({ ...m, forfeitBy: "me" })}
      onBack={onBack}
      onAgain={onAgain}
    />
  );
}

function Arena({ view: v, clock, err, onAnswer, onQuit, onBack, onAgain }: { view: DuelView; clock: number; err: string | null; onAnswer: (round: number, dx: number, feature: number) => void; onQuit: () => void; onBack: () => void; onAgain: () => void }) {
  const reduce = useReducedMotion();
  const anim = (cls: string) => (reduce === false ? cls : undefined);
  const left = v.until ? Math.max(0, v.until - clock) : 0;
  const [confirmQuit, setConfirmQuit] = React.useState(false);
  const last = v.closed[v.closed.length - 1];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-5 sm:px-6">
      <Scoreboard v={v} />
      {err && <p className="rounded-md border-2 border-foreground bg-status-pending-bg px-3 py-2 text-sm font-semibold">{err}</p>}

      {v.phase === "countdown" && (
        <div className={cn(card, "p-8 text-center")}>
          <p className="text-sm font-bold">
            You vs {v.opp.name}
            {v.bot ? " · practice" : " · ranked"}
          </p>
          <p key={Math.ceil(left / 1000)} className={cn("mt-2 font-pix text-7xl tabular-nums", anim(fx.pop))} aria-live="assertive">
            {Math.max(1, Math.ceil(left / 1000))}
          </p>
        </div>
      )}

      {v.phase === "round" && v.question && <RoundPlay key={v.round} v={v} left={left} onAnswer={onAnswer} />}

      {v.phase === "reveal" && last && (
        <div className={cn(card, "space-y-3 p-4", anim(fx.rise))} aria-live="polite">
          <p className="text-eyebrow text-link">Round {last.round + 1} answer</p>
          <div>
            <p className="text-h3 leading-tight">{last.correctDx}</p>
            <p className="mt-1 text-sm">
              <span className="font-bold">Tells it apart:</span> {last.correctFeature}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <PickCard who="You" r={last.you} />
            <PickCard who={v.opp.name} bot={v.bot} r={last.opp} />
          </div>
          <p className="text-sm text-muted-foreground">{last.why}</p>
          <p className="text-sm font-semibold">Next round in {Math.ceil(left / 1000)}…</p>
        </div>
      )}

      {v.phase === "over" && v.result && <Final v={v} onBack={onBack} onAgain={onAgain} />}

      {v.phase !== "over" && (
        <div className="flex justify-end">
          {confirmQuit ? (
            <div className="flex flex-wrap items-center gap-2 rounded-md border-2 border-foreground bg-status-alert-bg p-2 text-sm text-status-alert-fg">
              <span className="font-bold">{v.ranked ? "Quitting counts as a loss." : "Quit this match?"}</span>
              <button type="button" className={cn(btnSecondary, "min-h-10 text-sm")} onClick={onQuit}>
                <Flag className="size-4" aria-hidden /> Quit
              </button>
              <button type="button" className={cn(btnSecondary, "min-h-10 text-sm")} onClick={() => setConfirmQuit(false)}>
                Keep playing
              </button>
            </div>
          ) : (
            <button type="button" className="inline-flex min-h-11 items-center gap-1 rounded-md px-3 text-sm font-bold underline-offset-4 hover:underline" onClick={() => setConfirmQuit(true)}>
              <Flag className="size-4" aria-hidden /> Quit
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** You on the left, your opponent on the right, the live score under each, and what each of you is doing now. */
function Scoreboard({ v }: { v: DuelView }) {
  const last = v.closed[v.closed.length - 1];
  const gained = v.phase === "reveal" && last ? { you: last.you.points, opp: last.opp.points, key: last.round } : null;
  const inRound = v.phase === "round";
  return (
    <div className={cn(card, "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 p-3 hard-shadow-sm")} aria-label="Score">
      <PlayerSide name={v.you.name} icon={User} score={v.score.you} lead={v.score.you > v.score.opp} gained={gained ? { pts: gained.you, key: gained.key } : null} status={inRound ? (v.youAnswered ? "locked" : "turn") : null} />
      <div className="text-center">
        <p className="font-pix text-xs">VS</p>
        <p className="mt-1 text-xs font-bold whitespace-nowrap">
          Round {Math.min(v.totalRounds, v.round + 1)}/{v.totalRounds}
        </p>
        <div className="mt-1 flex justify-center gap-1" aria-hidden>
          {Array.from({ length: v.totalRounds }, (_, i) => {
            const r = v.closed.find((c) => c.round === i);
            return <span key={i} className={cn("size-2.5 rounded-sm border-2 border-foreground", r ? (r.you.points > r.opp.points ? "bg-primary" : r.you.points < r.opp.points ? "bg-foreground" : "bg-brand") : i === v.round && inRound ? "bg-accent" : "bg-background")} />;
          })}
        </div>
      </div>
      <PlayerSide right name={v.opp.name} icon={v.bot ? Bot : User} score={v.score.opp} lead={v.score.opp > v.score.you} gained={gained ? { pts: gained.opp, key: gained.key } : null} status={inRound ? (v.oppAnswered ? "locked" : "thinking") : null} />
    </div>
  );
}

function PlayerSide({ name, icon: Icon, score, lead, gained, status, right = false }: { name: string; icon: typeof Bot; score: number; lead: boolean; gained: { pts: number; key: number } | null; status: "turn" | "thinking" | "locked" | null; right?: boolean }) {
  const reduce = useReducedMotion();
  const anim = (cls: string) => (reduce === false ? cls : undefined);
  return (
    <div className={cn("flex min-w-0 items-center gap-2", right && "flex-row-reverse text-right")}>
      <span key={status === "locked" ? "locked" : "open"} className={cn("relative grid size-11 shrink-0 place-items-center rounded-lg border-2 border-foreground", lead ? "bg-primary text-primary-foreground" : "bg-background", status === "locked" && anim(styles.nod))}>
        <Icon className="size-5" aria-hidden />
        {lead && <Crown className="absolute -top-2.5 size-4 text-foreground" aria-label="In the lead" />}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold">{name}</p>
        <p className="relative">
          <CountUp value={score} className="font-pix text-2xl tabular-nums sm:text-3xl" />
          {gained && gained.pts > 0 && (
            <span key={gained.key} className={cn("absolute -top-1 font-pix text-sm text-link", right ? "right-full mr-1" : "left-full ml-1", reduce === false ? fx.burst : "hidden")} aria-hidden>
              +{gained.pts}
            </span>
          )}
        </p>
        {status && (
          <p className={cn("flex items-center gap-1 text-xs font-semibold", right && "justify-end")} aria-live="polite">
            {status === "locked" ? (
              <>
                <Check className="size-3.5" aria-hidden /> Locked in
              </>
            ) : status === "thinking" ? (
              <>
                Thinking
                <span className={styles.dots} aria-hidden>
                  <span />
                  <span />
                  <span />
                </span>
              </>
            ) : (
              "Your turn"
            )}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * One round: tap the diagnosis (+100), then tap what tells it apart (+50).
 * The second tap locks the answer in; there is no extra button.
 */
function RoundPlay({ v, left, onAnswer }: { v: DuelView; left: number; onAnswer: (round: number, dx: number, feature: number) => void }) {
  const q = v.question!;
  const [dx, setDx] = React.useState<number | null>(null);
  const [sent, setSent] = React.useState(false);
  const locked = sent || v.youAnswered;
  const reduce = useReducedMotion();

  const lockIn = React.useCallback(
    (feature: number) => {
      if (locked || dx === null) return;
      setSent(true);
      haptic("tap");
      onAnswer(v.round, dx, feature);
    },
    [locked, dx, onAnswer, v.round],
  );

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (locked || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      const n = Number(e.key);
      if (n >= 1 && n <= 4) {
        e.preventDefault();
        if (dx === null) setDx(n - 1);
        else lockIn(n - 1);
      } else if (e.key === "Backspace" && dx !== null) setDx(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [locked, dx, lockIn]);

  const pct = Math.max(0, Math.min(1, left / ROUND_MS));
  const urgent = left < 5000;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2" aria-label={`${Math.ceil(left / 1000)} seconds left`}>
        <Timer className={cn("size-5 shrink-0", urgent && reduce === false && fx.pulse)} aria-hidden />
        <div className="h-3 flex-1 overflow-hidden rounded-sm border-2 border-foreground bg-background">
          <div className={cn("h-full origin-left transition-transform duration-200 ease-linear", urgent ? "bg-destructive" : "bg-primary")} style={{ transform: `scaleX(${pct})` }} />
        </div>
        <span className="w-8 text-right font-pix tabular-nums">{Math.ceil(left / 1000)}</span>
      </div>
      <div className={cn(card, "p-4")}>
        <p className="leading-relaxed">{q.vignette}</p>
      </div>

      {!locked ? (
        <>
          <fieldset>
            <StepHead n={1} text="Which diagnosis?" pts="+100" done={dx !== null} />
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {q.options.map((o, i) => (
                <Choice key={o} n={i + 1} text={o} picked={dx === i} dim={dx !== null && dx !== i} onClick={() => setDx(i)} />
              ))}
            </div>
          </fieldset>
          <fieldset disabled={dx === null} className={cn(dx === null ? "opacity-50" : reduce === false && fx.rise)} key={dx === null ? "wait" : "go"}>
            <StepHead n={2} text="What tells it apart?" pts="+50" done={false} />
            {dx !== null && (
              <div className="mt-2 grid gap-2">
                {q.features.map((f, i) => (
                  <Choice key={f} n={i + 1} text={f} picked={false} dim={false} onClick={() => lockIn(i)} />
                ))}
              </div>
            )}
          </fieldset>
        </>
      ) : (
        <div className={cn(card, "flex items-center gap-3 p-4", reduce === false && fx.pop)} aria-live="polite">
          <Shield className="size-6 shrink-0" aria-hidden />
          <div>
            <p className="font-bold">Locked in.</p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {v.oppAnswered ? (
                `${v.opp.name} has locked in too.`
              ) : (
                <>
                  Waiting for {v.opp.name}
                  <span className={styles.dots} aria-hidden>
                    <span />
                    <span />
                    <span />
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function StepHead({ n, text, pts, done }: { n: number; text: string; pts: string; done: boolean }) {
  return (
    <legend className="flex w-full items-center gap-2 font-bold">
      <span className={cn("grid size-6 shrink-0 place-items-center rounded-md border-2 border-foreground font-pix text-xs", done ? "bg-primary text-primary-foreground" : "bg-background")}>{done ? <Check className="size-3.5" aria-hidden /> : n}</span>
      {text}
      <span className={cn(chip, "ml-auto bg-card font-pix text-xs tabular-nums")}>{pts}</span>
    </legend>
  );
}

function Choice({ n, text, picked, dim, onClick }: { n: number; text: string; picked: boolean; dim: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={picked}
      onClick={onClick}
      className={cn(
        "flex min-h-12 w-full items-center gap-3 rounded-md border-2 border-foreground px-3 py-2 text-left font-semibold leading-snug transition-transform duration-150 active:translate-y-px",
        picked ? "-translate-y-0.5 bg-brand text-brand-foreground hard-shadow-xs" : "bg-card hover:-translate-y-0.5",
        dim && "opacity-70",
      )}
    >
      <span className="hidden size-6 shrink-0 place-items-center rounded border-2 border-current font-pix text-xs lg:grid">{n}</span>
      {picked && <Check className="size-4 shrink-0 lg:hidden" aria-hidden />}
      <span className="min-w-0 flex-1">{text}</span>
    </button>
  );
}

type Pick = DuelView["closed"][number]["you"];

/** What one player picked this round, right or wrong, and the points it won. */
function PickCard({ who, r, bot = false }: { who: string; r: Pick; bot?: boolean }) {
  return (
    <div className={cn("min-w-0 rounded-md border-2 border-foreground p-2", r.dxOk ? "bg-status-success-bg" : "bg-background")}>
      <p className="flex items-center gap-1 truncate text-sm font-bold">
        {bot && <Bot className="size-4 shrink-0" aria-hidden />}
        <span className="truncate">{who}</span>
      </p>
      {r.dx === null ? (
        <p className="text-sm">No answer</p>
      ) : (
        <>
          <Mark ok={r.dxOk} text={r.dx} />
          <Mark ok={r.featureOk} text={r.featureOk ? "Right reason" : "Wrong reason"} />
        </>
      )}
      <p className="mt-1 font-pix tabular-nums">
        +{r.points}
        {r.ms !== null && <span className="ml-2 text-xs">{(r.ms / 1000).toFixed(1)}s</span>}
      </p>
    </div>
  );
}

function Mark({ ok, text }: { ok: boolean; text: string }) {
  return (
    <p className="flex items-start gap-1 text-sm leading-snug">
      {ok ? <Check className="mt-0.5 size-4 shrink-0" aria-label="right" /> : <X className="mt-0.5 size-4 shrink-0" aria-label="wrong" />}
      <span className="min-w-0 break-words">{text}</span>
    </p>
  );
}

function Final({ v, onBack, onAgain }: { v: DuelView; onBack: () => void; onAgain: () => void }) {
  const r = v.result!;
  const reduce = useReducedMotion();
  const anim = (cls: string) => (reduce === false ? cls : undefined);
  const word = r.outcome === "win" ? "You win" : r.outcome === "loss" ? `${v.opp.name} wins` : "Draw";
  const why =
    r.reason === "forfeit"
      ? r.youForfeited
        ? "You left the match, so it counts as a loss."
        : `${v.opp.name} left the match.`
      : r.reason === "speed"
        ? `${v.score.you} to ${v.score.opp}. Level on points, ${r.outcome === "win" ? "you were faster" : `${v.opp.name} was faster`}.`
        : `${v.score.you} to ${v.score.opp}.`;
  const rated = v.ranked && r.delta !== null && r.rating !== null;
  const dxRight = v.closed.filter((c) => c.you.dxOk).length;
  const whyRight = v.closed.filter((c) => c.you.featureOk).length;
  return (
    <section className="space-y-4" aria-label="Match result">
      <div className={cn(card, "p-6 text-center hard-shadow-md", r.outcome === "win" ? "bg-primary text-primary-foreground" : r.outcome === "loss" ? "bg-foreground text-background" : "bg-card", anim(fx.land))}>
        <p className={cn("inline-flex items-center gap-2 font-pix text-3xl uppercase sm:text-4xl", anim(fx.stamp))}>
          {r.outcome === "win" ? <Crown className="size-8" aria-hidden /> : r.outcome === "loss" ? <X className="size-8" aria-hidden /> : <Swords className="size-8" aria-hidden />}
          {word}
        </p>
        <p className="mt-2 font-semibold">{why}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <span className={cn(chip, "border-current bg-transparent")}>
            Diagnosis right {dxRight}/{v.totalRounds}
          </span>
          <span className={cn(chip, "border-current bg-transparent")}>
            Reason right {whyRight}/{v.totalRounds}
          </span>
        </div>
        {rated ? <RatingChange delta={r.delta!} rating={r.rating!} /> : v.ranked ? <p className="mt-3 text-sm">Rating updating…</p> : null}
        {v.ranked && !v.bot && r.outcome === "win" && <p className={cn(chip, "mt-3 border-current bg-transparent", anim(fx.pop))}>+{WIN_XP} league XP</p>}
      </div>
      <div className={cn(card, "p-4")}>
        <h3 className="font-bold">What you got right and wrong</h3>
        <ol className="mt-2 divide-y-2 divide-foreground/10">
          {v.closed.map((c, i) => (
            <li key={c.round} className={cn("space-y-1 py-3 text-sm", anim(fx.stagger))} style={{ "--i": i + 2 } as React.CSSProperties}>
              <p className="flex items-baseline justify-between gap-2">
                <span className="font-bold">
                  {c.round + 1}. {c.correctDx}
                </span>
                <span className="shrink-0 font-pix tabular-nums">
                  +{c.you.points} <span className="text-muted-foreground">vs +{c.opp.points}</span>
                </span>
              </p>
              {c.you.dx === null ? (
                <p className="flex items-center gap-1">
                  <X className="size-4 shrink-0" aria-label="wrong" /> No answer in time
                </p>
              ) : (
                <Mark ok={c.you.dxOk} text={`You said ${c.you.dx}`} />
              )}
              <Mark ok={c.you.featureOk} text={`Tells it apart: ${c.correctFeature}`} />
              {!c.you.dxOk && <LearnLink topic={c.correctDx} />}
            </li>
          ))}
        </ol>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <button type="button" className={btnPrimary} onClick={onAgain}>
          <Swords className="size-4" aria-hidden /> {v.bot ? "Play again" : "Next ranked match"}
        </button>
        <button type="button" className={btnSecondary} onClick={onBack}>
          <ArrowLeft className="size-4" aria-hidden /> Back
        </button>
        <Link href="/study" className={btnSecondary}>
          Study the look-alikes
        </Link>
      </div>
    </section>
  );
}

/** The rating ticks from the old number to the new one, the change counts up beside it, and a new tier is called out. */
function RatingChange({ delta, rating }: { delta: number; rating: number }) {
  const reduce = useReducedMotion();
  const d = Math.round(delta);
  const before = rating - d;
  const up = d > 0;
  const oldTier = tierFor(before);
  const newTier = tierFor(rating);
  const sign = (n: number) => `${up ? "+" : d < 0 ? "-" : ""}${Math.abs(n)}`;
  return (
    <div className="mt-4 flex flex-col items-center gap-2">
      <p className="text-xs font-bold uppercase tracking-wide opacity-80">Rating</p>
      <div className="flex items-center gap-3">
        <CountUp value={rating} from={before} duration={1.4} delay={0.5} className="font-pix text-5xl tabular-nums" />
        <span key={d} className={cn("inline-flex items-center gap-1 rounded-md border-2 border-current px-2 py-1 font-pix text-lg tabular-nums", reduce === false && fx.pop)} style={{ animationDelay: "500ms" }}>
          {up ? <ArrowUp className="size-4" aria-hidden /> : d < 0 ? <ArrowDown className="size-4" aria-hidden /> : null}
          <CountUp value={Math.abs(d)} duration={1.4} delay={0.5} format={sign} />
          <span className="sr-only">{up ? "points gained" : d < 0 ? "points lost" : "no change"}</span>
        </span>
      </div>
      <p className="text-sm font-semibold">
        {before} <span aria-hidden>→</span>
        <span className="sr-only">to</span> {rating}
        {newTier !== oldTier && (
          <span className={cn("ml-2 inline-flex items-center gap-1 rounded-md border-2 border-current px-2 py-0.5 text-xs font-bold uppercase", reduce === false && fx.stamp)} style={{ animationDelay: "1600ms" }}>
            {up ? "Up to" : "Down to"} {newTier}
          </span>
        )}
      </p>
    </div>
  );
}
