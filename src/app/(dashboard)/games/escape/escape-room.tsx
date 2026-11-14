"use client";

import * as React from "react";
import { startHowTo } from "@/components/help/how-to";
import { ArrowDown, ArrowRight, ArrowUp, Check, DoorOpen, FileText, Flag, Lightbulb, Lock, LockOpen, MapPin, Play, Timer, Trophy, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LearnLink } from "@/lib/games/ui/learn-link";
import { clock } from "@/lib/games-sims/common";
import { escapeXp, HINT_AFTER, PENALTY_S, teamTime, type EscState, type RaceRow } from "@/lib/games-sims/escape/engine";
import { STAGE_LABEL, type OpenedDoor, type PublicDoor, type RoomCard, type RoomView } from "@/lib/games-sims/escape/types";
import { TEAM_LIMITS } from "@/lib/games-sims/teams";
import { Btn, buzz, Kbd, motionCss as m, Panel, Pill, Stat, useHotkeys } from "@/lib/games-sims/ui/kit";
import { ThumbBar } from "@/components/mobile/thumb-bar";
import { JoinBox, Members, TeamCode, usePoll } from "@/lib/games-sims/ui/team";
import type { EscapeView, PracticeResult } from "./actions";
import { creditServerPlay } from "@/lib/learn/credit-play";
import { useReaction } from "@/components/reactions/use-reaction";
import { EndReaction } from "@/components/reactions/graphics";
import { arrangeCases, nextCase, type CaseMark } from "@/lib/cases/fresh";
import type { CaseContext } from "@/lib/cases/server";
import { clearCaseProgress, saveCaseProgress, useCaseProgress } from "@/lib/cases/progress-client";
import { noteAnswer, useToolHistory } from "@/lib/history/client";
import { CaseMarkTag, RecycleNote } from "@/components/cases/case-mark";

type Actions = {
  createEscapeTeam: (room: string) => Promise<{ ok: true; teamId: string } | { ok: false; reason: string }>;
  joinEscapeTeam: (code: string) => Promise<{ ok: true; teamId: string } | { ok: false; reason: string }>;
  escapeView: (teamId: string) => Promise<EscapeView | null>;
  startEscapeTeam: (teamId: string) => Promise<EscapeView | null>;
  answerEscape: (x: { teamId: string; stage: number; answer: string }) => Promise<{ view: EscapeView | null; ok: boolean }>;
  startEscapePractice: (room: string) => Promise<PracticeResult>;
  answerEscapePractice: (x: { token: string; stage: number; answer: string }) => Promise<PracticeResult>;
  resumeEscapePractice: (token: string) => Promise<PracticeResult>;
};
/** A practice run left half-way (saved progress, src/lib/cases): its signed run from the server. */
type SavedRun = { token: string };
const validRun = (s: unknown): s is SavedRun => !!s && typeof (s as SavedRun).token === "string";
type TeamItem = { id: string; name: string; room: string; title: string; status: string };
type Started = Extract<PracticeResult, { ok: true }>;
type Mode = { kind: "pick" } | { kind: "practice"; room: string; run: number; start: Started; startedAt: number } | { kind: "team"; teamId: string };

const FAIL = "That didn't load. Try again.";

const LETTERS = ["a", "b", "c", "d", "e", "f"];

export function EscapeRoom({ rooms, cases, teamsOn, openTeam, teams, actions }: { rooms: RoomCard[]; cases: CaseContext; teamsOn: boolean; openTeam: string | null; teams: TeamItem[]; actions: Actions }) {
  const [mode, setMode] = React.useState<Mode>(openTeam ? { kind: "team", teamId: openTeam } : { kind: "pick" });
  const [startErr, setStartErr] = React.useState<string | null>(null);
  // Rooms in fresh-case order (src/lib/cases/fresh.ts): half done, new this week, new, done last.
  const history = useToolHistory("escape", cases.history);
  const progress = useCaseProgress("escape", cases.progress);
  const started = new Set([...progress.started].filter((id) => validRun(progress.get(id))));
  const opts = { history, now: cases.now, student: cases.student, started, level: (r: RoomCard) => r.doors };
  const arranged = arrangeCases(rooms, (r) => r.id, opts);
  function go(next: Mode) {
    if (next.kind !== "pick") startHowTo("team-escape-room");
    try {
      window.history.replaceState(null, "", next.kind === "team" ? `/games/escape?team=${next.teamId}` : "/games/escape");
    } catch {
      /* ignore */
    }
    setMode(next);
  }
  /** The server deals the run; the browser gets the first door only. */
  async function fresh(room: string): Promise<string | null> {
    const r = await actions.startEscapePractice(room).catch(() => null);
    if (!r || !r.ok) return r?.error ?? FAIL;
    go({ kind: "practice", room, run: mode.kind === "practice" ? mode.run + 1 : 0, start: r, startedAt: Date.now() });
    return null;
  }
  /** Open a room: back at the door it was left on (the server reopens the saved run), else a new run. */
  async function practice(room: string): Promise<string | null> {
    const saved = progress.get<SavedRun>(room);
    if (validRun(saved)) {
      const r = await actions.resumeEscapePractice(saved.token).catch(() => null);
      if (r && r.ok) {
        go({ kind: "practice", room, run: mode.kind === "practice" ? mode.run + 1 : 0, start: r, startedAt: Date.now() - (r.elapsed ?? 0) });
        return null;
      }
      // A saved run that can't be reopened (finished, or from another account) is dropped.
      if (r) clearCaseProgress("escape", room);
    }
    return fresh(room);
  }
  const fail = async (e: string | null) => {
    if (e) {
      setStartErr(e);
      go({ kind: "pick" });
    }
  };
  if (mode.kind === "practice") {
    const nextId = nextCase(rooms, (r) => r.id, { ...opts, current: mode.room })?.item.id;
    return (
      <Practice
        key={mode.run}
        room={mode.room}
        start={mode.start}
        startedAt={mode.startedAt}
        actions={actions}
        onExit={() => go({ kind: "pick" })}
        onAgain={async () => fail(await fresh(mode.room))}
        onNext={nextId && nextId !== mode.room ? async () => fail(await practice(nextId)) : undefined}
      />
    );
  }
  if (mode.kind === "team") return <TeamRun teamId={mode.teamId} actions={actions} onExit={() => go({ kind: "pick" })} />;
  return (
    <Pick
      arranged={arranged}
      startErr={startErr}
      teamsOn={teamsOn}
      teams={teams}
      onPractice={practice}
      onCreate={async (room) => {
        const r = await actions.createEscapeTeam(room);
        if (r.ok) go({ kind: "team", teamId: r.teamId });
        return r.ok ? null : r.reason;
      }}
      onJoin={async (code) => {
        const r = await actions.joinEscapeTeam(code);
        if (r.ok) go({ kind: "team", teamId: r.teamId });
        return r.ok ? null : r.reason;
      }}
      onOpen={(teamId) => go({ kind: "team", teamId })}
    />
  );
}

/* ------------------------------------------------------------------ pick */
function Pick({ arranged, startErr, teamsOn, teams, onPractice, onCreate, onJoin, onOpen }: { arranged: { list: { item: RoomCard; id: string; mark: CaseMark }[]; recycled: boolean }; startErr: string | null; teamsOn: boolean; teams: TeamItem[]; onPractice: (room: string) => Promise<string | null>; onCreate: (room: string) => Promise<string | null>; onJoin: (code: string) => Promise<string | null>; onOpen: (id: string) => void }) {
  const [err, setErr] = React.useState<string | null>(startErr);
  const [busy, setBusy] = React.useState<string | null>(null);
  const resume = arranged.list.filter((x) => x.mark === "started");
  async function open(id: string) {
    if (busy) return;
    setBusy(`practice:${id}`);
    setErr(null);
    const e = await onPractice(id).catch(() => FAIL);
    setBusy(null);
    if (e) setErr(e);
  }
  return (
    <div className={cn("mx-auto max-w-3xl space-y-6", m.rise)}>
      <h1 className="text-h3">Pick a room</h1>
      {resume.map((x) => (
        <Panel key={x.id} className="flex flex-wrap items-center gap-3 bg-status-info-bg">
          <DoorOpen className="size-5" aria-hidden />
          <p className="min-w-0 flex-1 text-body">
            You left <span className="font-semibold">{x.item.title}</span> at a locked door.
          </p>
          <Btn variant="ink" disabled={busy !== null} onClick={() => void open(x.id)}>
            <Play aria-hidden /> Carry on
          </Btn>
        </Panel>
      ))}
      {arranged.recycled ? <RecycleNote /> : null}
      <ul className={cn("grid gap-4 md:grid-cols-3", m.stagger)}>
        {arranged.list.map(({ item: r, mark }, i) => (
          <li key={r.id} className={cn("flex min-w-0 flex-col rounded-xl border-2 border-foreground bg-card p-4 hard-shadow-sm", mark === "done" && !arranged.recycled && "border-foreground/40 shadow-none", m.rise)} style={{ "--i": i } as React.CSSProperties}>
            <div className="flex items-start justify-between gap-2">
              <p className="flex min-w-0 items-center gap-1.5 text-caption text-muted-foreground">
                <MapPin className="size-3.5 shrink-0" aria-hidden /> <span className="truncate">{r.place}</span>
              </p>
              <CaseMarkTag mark={mark} />
            </div>
            <h2 className="mt-1 text-h3">{r.title}</h2>
            <p className="text-small font-semibold">{r.patient}</p>
            <p className="mt-2 flex-1 text-small">{r.intro}</p>
            <div className="mt-3 grid gap-2">
              {teamsOn ? (
                <Btn
                  variant="primary"
                  disabled={busy !== null}
                  onClick={async () => {
                    setBusy(r.id);
                    setErr(null);
                    const e = await onCreate(r.id).catch(() => "Couldn't start a team. Try again.");
                    setBusy(null);
                    if (e) setErr(e);
                  }}
                >
                  <Users aria-hidden /> {busy === r.id ? "Starting…" : "Start a team"}
                </Btn>
              ) : null}
              <Btn variant={teamsOn || mark === "done" ? "outline" : "primary"} disabled={busy !== null} onClick={() => void open(r.id)}>
                <Play aria-hidden /> {busy === `practice:${r.id}` ? "Starting…" : mark === "started" ? "Carry on alone" : mark === "done" ? "Play again alone" : "Practice alone"}
              </Btn>
            </div>
          </li>
        ))}
      </ul>
      {err ? (
        <p className="text-small text-destructive" role="alert">
          {err}
        </p>
      ) : null}
      {teamsOn ? (
        <Panel className="space-y-4">
          <JoinBox onJoin={onJoin} label="Got a code from a teammate?" />
          {teams.length ? (
            <div className="space-y-2">
              <p className="text-small font-semibold">Your teams</p>
              <ul className="space-y-2">
                {teams.map((t) => (
                  <li key={t.id}>
                    <Btn className="w-full justify-between" onClick={() => onOpen(t.id)}>
                      <span className="truncate">
                        {t.name} · {t.title} · {t.status === "lobby" ? "waiting to start" : "inside"}
                      </span>
                      <ArrowRight aria-hidden />
                    </Btn>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Panel>
      ) : (
        <p className="text-small text-muted-foreground">Team play is not open yet. Practise alone for now.</p>
      )}
    </div>
  );
}

/* ----------------------------------------------------------- the clock */
function useTicker(on: boolean) {
  const [now, setNow] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (!on) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [on]);
  return now;
}

function Clock({ ms, wrong }: { ms: number; wrong: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border-2 border-foreground bg-foreground px-2.5 py-1 font-pix text-h3 tabular-nums text-background" role="timer" aria-label={`Time ${clock(ms)}`}>
      <Timer className="size-4" aria-hidden /> {clock(ms)}
      {wrong ? <span className="text-caption font-sans font-normal opacity-80">incl. +{wrong * PENALTY_S}s</span> : null}
    </span>
  );
}

/* ------------------------------------------------------------- the room */
type Feedback = { stage: number; ok: boolean; by?: string } | null;

function Doors({ room, st, feedback }: { room: RoomView; st: EscState; feedback: Feedback }) {
  const open = st.done ? room.doors : st.stage;
  return (
    <ol className="grid grid-cols-7 gap-1.5 sm:gap-2" aria-label="Doors">
      {room.stages.map((stage, i) => {
        const isOpen = i < open;
        const now = !st.done && i === st.stage;
        const justOpened = feedback?.ok && feedback.stage === i;
        return (
          <li key={i} className="min-w-0 text-center">
            <div key={`${i}-${isOpen}`} className={cn("mx-auto grid size-9 place-items-center rounded-md border-2 border-foreground sm:size-11", isOpen ? "bg-foreground text-background" : now ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground", justOpened && m.unlock, now && feedback && !feedback.ok && feedback.stage === i && m.shake)}>
              {isOpen ? <LockOpen className="size-4 sm:size-5" aria-hidden /> : <Lock className="size-4 sm:size-5" aria-hidden />}
            </div>
            <span className="mt-1 block truncate text-caption">{STAGE_LABEL[stage]}</span>
            <span className="sr-only">{isOpen ? "open" : now ? "current" : "locked"}</span>
          </li>
        );
      })}
    </ol>
  );
}

function CaseFile({ room }: { room: RoomView }) {
  const pages = [room.intro, ...room.opened.map((p) => p.unlock)];
  return (
    <Panel className="h-fit space-y-2 p-3 lg:sticky lg:top-[calc(var(--top-h)+1rem)]">
      <p className="flex items-center gap-1.5 text-caption font-semibold uppercase">
        <FileText className="size-3.5" aria-hidden /> Case file
      </p>
      <p className="text-small font-semibold">{room.patient}</p>
      <ol className="space-y-1.5">
        {pages.map((t, i) => (
          <li key={i} className={cn("rounded-md border-2 border-dashed border-foreground/40 p-2 text-small", i === pages.length - 1 && i > 0 && m.rise)}>
            <span className="mr-1 font-mono text-caption">{String(i + 1).padStart(2, "0")}</span>
            {t}
          </li>
        ))}
      </ol>
    </Panel>
  );
}

/** One door: the puzzle with tap controls for every kind; `locked` after a right answer while the next loads. */
function Door({ p, hint, tries, feedback, disabled, onSubmit }: { p: PublicDoor; hint: string | null; tries: number; feedback: Feedback; disabled: boolean; onSubmit: (raw: string) => void }) {
  const [picked, setPicked] = React.useState<number[]>([]);
  // An order door's items arrive shuffled by the server; the answer is the shown positions in the chosen order.
  const [order, setOrder] = React.useState<number[]>(() => (p.kind === "order" ? p.items.map((_, i) => i) : []));
  const [num, setNum] = React.useState<number>(() => (p.kind === "number" ? p.min : 0));

  const keys: Record<string, () => void> = {};
  if (p.kind === "pick" && !disabled) p.options.forEach((_, i) => (keys[LETTERS[i]] = () => onSubmit(String(i))));
  useHotkeys(keys);

  function toggle(i: number) {
    setPicked((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
  }
  function move(from: number, dir: -1 | 1) {
    setOrder((o) => {
      const to = from + dir;
      if (to < 0 || to >= o.length) return o;
      const n = [...o];
      [n[from], n[to]] = [n[to], n[from]];
      return n;
    });
  }

  return (
    <Panel className={cn("space-y-3 bg-muted/40", feedback && !feedback.ok && feedback.stage >= 0 && m.shake)} aria-live="polite" key={`${p.id}-${tries}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone="info">{STAGE_LABEL[p.stage]}</Pill>
        {tries ? (
          <span className="text-caption text-muted-foreground">
            {tries} wrong {tries === 1 ? "try" : "tries"}
          </span>
        ) : null}
        {!hint && tries < HINT_AFTER ? (
          <span className="ml-auto inline-flex items-center gap-1 text-caption text-muted-foreground">
            <Lightbulb className="size-3.5" aria-hidden /> Hint after {HINT_AFTER} misses
          </span>
        ) : null}
      </div>
      {hint ? (
        <p className={cn("flex items-start gap-2 rounded-md border-2 border-foreground bg-status-pending-bg p-2 text-small text-status-pending-fg", m.rise)} role="status">
          <Lightbulb className="mt-0.5 size-4 shrink-0" aria-hidden /> <span className="min-w-0">{hint}</span>
        </p>
      ) : null}
      <p className="text-body-strong">{p.prompt}</p>

      {p.kind === "pick" ? (
        <div className="grid gap-2">
          {p.options.map((o, i) => (
            <Btn key={o} disabled={disabled} className="h-auto justify-start py-2.5 text-left font-normal" onClick={() => onSubmit(String(i))}>
              <span className="font-mono text-caption font-semibold uppercase opacity-70" aria-hidden>
                {LETTERS[i]}
              </span>
              <span className="min-w-0 flex-1">{o}</span>
            </Btn>
          ))}
        </div>
      ) : null}

      {p.kind === "multi" ? (
        <>
          <div className="grid gap-2" role="group" aria-label="Tick all that apply">
            {p.options.map((o, i) => {
              const on = picked.includes(i);
              return (
                <Btn key={o} disabled={disabled} aria-pressed={on} className={cn("h-auto justify-start py-2.5 text-left font-normal", on && "bg-primary text-primary-foreground")} onClick={() => toggle(i)}>
                  <span className={cn("grid size-5 shrink-0 place-items-center rounded border-2 border-current")} aria-hidden>
                    {on ? <Check className="size-3.5" /> : null}
                  </span>
                  <span className="min-w-0 flex-1">{o}</span>
                </Btn>
              );
            })}
          </div>
          <Btn variant="primary" size="lg" className="w-full" disabled={disabled || !picked.length} onClick={() => onSubmit([...picked].sort((a, b) => a - b).join(","))}>
            Unlock with {picked.length} ticked <ArrowRight aria-hidden />
          </Btn>
        </>
      ) : null}

      {p.kind === "order" ? (
        <>
          <ol className="space-y-2" aria-label="Put in order">
            {order.map((itemIdx, pos) => (
              <li key={itemIdx} className="flex items-center gap-2 rounded-md border-2 border-foreground bg-card p-2">
                <span className="font-mono text-caption font-semibold">{pos + 1}</span>
                <span className="min-w-0 flex-1 text-small">{p.items[itemIdx]}</span>
                <span className="flex flex-col gap-0.5 sm:flex-row">
                  <Btn variant="ghost" className="min-h-9 min-w-9 px-1" disabled={disabled || pos === 0} onClick={() => move(pos, -1)} aria-label={`Move up: ${p.items[itemIdx]}`}>
                    <ArrowUp aria-hidden />
                  </Btn>
                  <Btn variant="ghost" className="min-h-9 min-w-9 px-1" disabled={disabled || pos === order.length - 1} onClick={() => move(pos, 1)} aria-label={`Move down: ${p.items[itemIdx]}`}>
                    <ArrowDown aria-hidden />
                  </Btn>
                </span>
              </li>
            ))}
          </ol>
          <Btn variant="primary" size="lg" className="w-full" disabled={disabled} onClick={() => onSubmit(order.join(","))}>
            Unlock in this order <ArrowRight aria-hidden />
          </Btn>
        </>
      ) : null}

      {p.kind === "number" ? (
        <>
          <div className="flex items-center gap-3">
            <Btn disabled={disabled || num <= p.min} onClick={() => setNum((n) => Math.max(p.min, n - 1))} aria-label="One fewer">
              <span aria-hidden>-</span>
            </Btn>
            <output className="min-w-16 text-center font-pix text-h2 tabular-nums" aria-live="polite">
              {num}
            </output>
            <Btn disabled={disabled || num >= p.max} onClick={() => setNum((n) => Math.min(p.max, n + 1))} aria-label="One more">
              <span aria-hidden>+</span>
            </Btn>
            <input type="range" min={p.min} max={p.max} value={num} onChange={(e) => setNum(Number(e.target.value))} disabled={disabled} aria-label={p.unit ?? "Number"} className="min-h-11 flex-1 accent-[var(--primary)]" />
          </div>
          <Btn variant="primary" size="lg" className="w-full" disabled={disabled} onClick={() => onSubmit(String(num))}>
            Unlock with {num} {p.unit ?? ""} <ArrowRight aria-hidden />
          </Btn>
        </>
      ) : null}
    </Panel>
  );
}

function OpenedCard({ p, by, onNext, nextLabel }: { p: OpenedDoor; by?: string; onNext: () => void; nextLabel: string }) {
  useHotkeys({ Enter: onNext, " ": onNext });
  return (
    <Panel className={cn("space-y-3", m.pop)} aria-live="polite">
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone="good">Door open</Pill>
        {by ? <span className="text-small">{by} got it.</span> : null}
      </div>
      <p className="text-body">{p.why}</p>
      <p className={cn("rounded-md border-2 border-dashed border-foreground/40 p-2 text-small", m.rise)}>
        <span className="mr-1 inline-flex items-center gap-1 font-semibold">
          <FileText className="size-3.5" aria-hidden /> New page:
        </span>
        {p.unlock}
      </p>
      {p.skill ? <LearnLink topic={STAGE_LABEL[p.stage]} href={`/study/${p.skill.split(":")[0]}`} newTab /> : null}
      {/* Phones: Next sits low, in thumb reach. */}
      <ThumbBar label="Next step">
        <Btn variant="primary" size="lg" className="w-full" onClick={onNext} autoFocus>
          {nextLabel} <ArrowRight aria-hidden /> <Kbd>Enter</Kbd>
        </Btn>
      </ThumbBar>
    </Panel>
  );
}

function Header({ room, onExit, right }: { room: { title: string }; onExit: () => void; right: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 font-semibold">
        <DoorOpen className="size-5" aria-hidden /> {room.title}
      </span>
      {right}
      <Btn variant="ghost" className="ml-auto" onClick={onExit}>
        Leave
      </Btn>
    </div>
  );
}

/* -------------------------------------------------------------- practice */
function Practice({ room: roomId, start, startedAt, actions, onExit, onAgain, onNext }: { room: string; start: Started; startedAt: number; actions: Actions; onExit: () => void; onAgain: () => void; onNext?: () => void }) {
  const [token, setToken] = React.useState(start.token);
  const [room, setRoom] = React.useState<RoomView>(start.view);
  const [st, setSt] = React.useState<EscState>(start.state);
  const [feedback, setFeedback] = React.useState<Feedback>(null);
  const [opened, setOpened] = React.useState<number | null>(null);
  const [finishedAt, setFinishedAt] = React.useState<number | null>(null);
  const [serverMs, setServerMs] = React.useState<number | null>(null);
  const [xp, setXp] = React.useState<number | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [lost, setLost] = React.useState<string | null>(null);
  /** One answer in flight at a time, so a double tap counts once. */
  const inflight = React.useRef(false);
  const now = useTicker(finishedAt === null);
  const ms = serverMs ?? teamTime(new Date(startedAt).toISOString(), finishedAt ?? now ?? startedAt, st.wrong);
  const reaction = useReaction();

  async function submit(raw: string) {
    if (inflight.current || opened !== null || st.done) return;
    inflight.current = true;
    setBusy(true);
    const stage = st.stage;
    const first = (st.tries[stage] ?? 0) === 0;
    const r = await actions.answerEscapePractice({ token, stage, answer: raw }).catch(() => null);
    inflight.current = false;
    setBusy(false);
    // No connection is not a wrong answer: no penalty shown, no "wrong" sticker.
    setLost(!r ? "Connection lost. Your answer was not sent. Try again." : r.ok ? null : r.error);
    if (!r || !r.ok) return;
    setToken(r.token);
    setRoom(r.view);
    setSt(r.state);
    // Saved progress (src/lib/cases): the signed run, here and on the server, so the room reopens at this door.
    if (!r.state.done) saveCaseProgress("escape", roomId, { token: r.token } satisfies SavedRun);
    else {
      clearCaseProgress("escape", roomId);
      // Done on this device straight away; the server records it too.
      noteAnswer("escape", roomId, r.view.doors / (r.view.doors + r.state.wrong) >= 0.6, { server: false });
    }
    if (r.right === undefined) return;
    const ok = r.right;
    buzz(ok);
    // The last door opens straight onto the escape screen, which has its own sticker.
    if (!r.state.done) reaction.onAnswer(ok, { partial: ok && !first });
    setFeedback({ stage, ok });
    if (ok) {
      setOpened(stage);
      if (r.state.done) {
        setFinishedAt(Date.now());
        setServerMs(r.ms ?? null);
        setXp(r.xp ?? 0);
        if (r.xp) creditServerPlay(r.xp);
      }
    }
  }

  if (st.done && opened === null) return <Escaped room={room} ms={ms} wrong={st.wrong} xp={xp} onExit={onExit} onAgain={onAgain} onNext={onNext} />;

  const shown = opened !== null ? room.opened[opened] : null;
  const door = room.door;
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Header room={room} onExit={onExit} right={<Clock ms={ms} wrong={st.wrong} />} />
      <Doors room={room} st={st} feedback={feedback} />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0 space-y-4">
          {shown ? (
            <OpenedCard p={shown} onNext={() => setOpened(null)} nextLabel={st.done ? "Out!" : "Next door"} />
          ) : door ? (
            <Door key={door.id} p={door} hint={room.hint} tries={st.tries[st.stage] ?? 0} feedback={feedback?.stage === st.stage ? feedback : null} disabled={busy} onSubmit={submit} />
          ) : null}
          {lost ? (
            <p className="text-small font-semibold" role="status">
              {lost}
            </p>
          ) : feedback && !feedback.ok && opened === null ? (
            <p className="flex items-center gap-1.5 text-small font-semibold" role="status">
              <X className="size-4" aria-hidden /> Not that. +{PENALTY_S} seconds. Try again.
            </p>
          ) : null}
        </div>
        <CaseFile room={room} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ team */
function TeamRun({ teamId, actions, onExit }: { teamId: string; actions: Actions; onExit: () => void }) {
  const [view, setView] = React.useState<EscapeView | null>(null);
  const [missing, setMissing] = React.useState(false);
  const [skew, setSkew] = React.useState(0);
  const [feedback, setFeedback] = React.useState<Feedback>(null);
  const [seenStage, setSeenStage] = React.useState<number | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [lost, setLost] = React.useState(false);
  const reaction = useReaction();

  function apply(v: EscapeView | null) {
    if (!v) {
      setMissing(true);
      return;
    }
    setMissing(false);
    setSkew(v.now - Date.now());
    if (view && (view.state.stage !== v.state.stage || view.state.done !== v.state.done) && !feedback) {
      // A teammate opened the door: show what it revealed.
      const last = [...v.state.log].reverse().find((l) => l.ok);
      if (last) setFeedback({ stage: last.stage, ok: true, by: last.name });
    }
    setView(v);
    setSeenStage((s) => (s === null ? v.state.stage : s));
  }
  const live = !!view && view.status !== "done";
  usePoll(!view || live, 2000, () => actions.escapeView(teamId), apply);
  const now = useTicker(live);

  if (missing && !view)
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <h1 className="text-h2">Team not found</h1>
        <p className="text-body">You may not be in this team, or team play is not open yet.</p>
        <Btn variant="primary" onClick={onExit}>
          Back to the rooms
        </Btn>
      </div>
    );
  if (!view) return <p className="px-4 py-8 text-body text-muted-foreground">Loading your team…</p>;
  const room = view.view;
  const st = view.state;
  const ms = teamTime(view.startedAt, view.finishedAt ?? (now !== null ? now + skew : view.now), st.wrong);

  const header = (
    <div className="space-y-2">
      <TeamCode code={view.code} name={view.name} message={`Join my VIBHA escape room (${room.title}).`} />
      <Members members={view.members} max={TEAM_LIMITS.escape.max} />
    </div>
  );

  if (view.status === "lobby") {
    const enough = view.members.length >= TEAM_LIMITS.escape.min;
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Header room={room} onExit={onExit} right={<Pill tone="part">Waiting to start</Pill>} />
        {header}
        <Panel className="space-y-3">
          <p className="text-body">{room.intro}</p>
          <p className="text-small text-muted-foreground">{enough ? "Everyone in? Any of you can start the clock." : `Need at least ${TEAM_LIMITS.escape.min} players. Share the code.`}</p>
          <Btn
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!enough || busy}
            onClick={async () => {
              setBusy(true);
              const v = await actions.startEscapeTeam(teamId).catch(() => null);
              setBusy(false);
              apply(v);
            }}
          >
            <Play aria-hidden /> Start the clock
          </Btn>
        </Panel>
        <RaceBoard rows={view.race} />
      </div>
    );
  }

  const showOpened = feedback?.ok && feedback.stage < (st.done ? room.doors : st.stage);
  if (st.done && !showOpened) return <Escaped room={room} ms={ms} wrong={st.wrong} xp={view.xp} onExit={onExit} race={view.race} teamLine={`${view.name}: ${view.members.map((x) => x.name).join(", ")}`} />;

  const stage = showOpened ? feedback!.stage : st.stage;
  const shown = showOpened ? room.opened[stage] : null;
  const door = room.door;

  async function submit(raw: string) {
    if (busy || !view) return;
    setBusy(true);
    const r = await actions.answerEscape({ teamId, stage: view.state.stage, answer: raw }).catch(() => null);
    setBusy(false);
    // No connection is not a wrong answer: no penalty shown, no "wrong" sticker.
    setLost(r === null);
    if (!r) return;
    buzz(r.ok);
    if (!r.view?.state.done) reaction.onAnswer(r.ok);
    setFeedback({ stage: view.state.stage, ok: r.ok, by: r.ok ? "You" : undefined });
    if (r.view) {
      setSkew(r.view.now - Date.now());
      setView(r.view);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Header room={room} onExit={onExit} right={<Clock ms={ms} wrong={st.wrong} />} />
      {header}
      <Doors room={room} st={st} feedback={feedback} />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0 space-y-4">
          {shown ? (
            <OpenedCard
              p={shown}
              by={feedback!.by}
              onNext={() => {
                setFeedback(null);
                setSeenStage(st.stage);
              }}
              nextLabel={st.done ? "Out!" : "Next door"}
            />
          ) : door ? (
            <Door key={`${door.id}-${seenStage}`} p={door} hint={room.hint} tries={st.tries[stage] ?? 0} feedback={feedback?.stage === stage ? feedback : null} disabled={busy} onSubmit={submit} />
          ) : null}
          {lost ? (
            <p className="text-small font-semibold" role="status">
              Connection lost. Your answer was not sent. Try again.
            </p>
          ) : feedback && !feedback.ok && !showOpened ? (
            <p className="flex items-center gap-1.5 text-small font-semibold" role="status">
              <X className="size-4" aria-hidden /> Not that. +{PENALTY_S} seconds for the team. Try again.
            </p>
          ) : null}
          <RecentTries log={st.log} />
        </div>
        <div className="space-y-4">
          <CaseFile room={room} />
          <RaceBoard rows={view.race} />
        </div>
      </div>
    </div>
  );
}

function RecentTries({ log }: { log: EscState["log"] }) {
  const last = log.slice(-4).reverse();
  if (!last.length) return null;
  return (
    <ul className="space-y-1" aria-label="Recent tries">
      {last.map((l, i) => (
        <li key={`${l.at}-${i}`} className="flex items-center gap-1.5 text-caption text-muted-foreground">
          {l.ok ? <Check className="size-3.5" aria-hidden /> : <X className="size-3.5" aria-hidden />}
          {l.name} {l.ok ? "opened" : "tried"} door {l.stage + 1}
        </li>
      ))}
    </ul>
  );
}

function RaceBoard({ rows }: { rows: RaceRow[] }) {
  if (!rows.length) return null;
  return (
    <Panel className="p-0">
      <div className="flex items-center gap-2 border-b-2 border-foreground px-3 py-2">
        <Trophy className="size-4" aria-hidden />
        <h2 className="text-small font-semibold">The race this week</h2>
      </div>
      <ol className="divide-y-2 divide-foreground/10">
        {rows.map((r, i) => (
          <li key={r.id} className={cn("flex items-center gap-2 px-3 py-1.5 text-small", r.me && "bg-status-success-bg")}>
            <span className="w-5 font-pix tabular-nums">{i + 1}</span>
            <span className="min-w-0 flex-1 truncate font-semibold">
              {r.name}
              {r.me ? " (you)" : ""}
            </span>
            {r.done ? (
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Flag className="size-3.5" aria-hidden /> {clock(r.ms)}
              </span>
            ) : (
              <span className="text-caption text-muted-foreground">door {r.stage + 1}</span>
            )}
          </li>
        ))}
      </ol>
    </Panel>
  );
}

function Escaped({ room, ms, wrong, xp, onExit, onAgain, onNext, race, teamLine }: { room: RoomView; ms: number; wrong: number; xp: number | null; onExit: () => void; onAgain?: () => void; onNext?: () => void; race?: RaceRow[]; teamLine?: string }) {
  const primary = onNext ?? onAgain;
  useHotkeys(primary ? { Enter: primary } : {});
  const n = room.doors;
  return (
    <div className={cn("mx-auto max-w-3xl space-y-5", m.rise)}>
      <div className="flex flex-wrap items-end gap-3">
        <h1 className="text-h1">The doors open.</h1>
        <Pill tone="good" className={m.stamp}>
          Out in {clock(ms)}
        </Pill>
      </div>
      {teamLine ? <p className="text-small font-semibold">{teamLine}</p> : null}
      <EndReaction mood={wrong === 0 ? "streak" : wrong <= 2 ? "right" : "near"} seed={`${room.id}:${ms}`} />
      <p className="text-body">{room.outro}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Time" value={clock(ms)} />
        <Stat label="Doors" value={n} />
        <Stat label="Wrong tries" value={wrong} />
        <Stat label="XP earned" value={xp === null ? "…" : `+${xp}`} />
      </div>
      {xp === 0 ? <p className="text-caption text-muted-foreground">XP couldn&apos;t be saved this time (it would have been {escapeXp(ms, wrong)}).</p> : null}
      <section className="space-y-2">
        <h2 className="text-body-strong">The case, door by door</h2>
        <ol className={cn("space-y-2", m.stagger)}>
          {room.opened.map((p, i) => (
            <li key={i} className={cn("rounded-lg border-2 border-foreground/25 bg-card p-3", m.rise)} style={{ "--i": i } as React.CSSProperties}>
              <p className="flex items-center gap-2 text-caption font-semibold uppercase">
                <LockOpen className="size-3.5" aria-hidden /> {i + 1}. {STAGE_LABEL[p.stage]}
              </p>
              <p className="mt-1 text-small">{p.why}</p>
            </li>
          ))}
        </ol>
      </section>
      {race ? <RaceBoard rows={race} /> : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {onNext ? (
          <Btn variant="primary" size="lg" className="sm:col-span-2" onClick={onNext}>
            Next room <ArrowRight aria-hidden /> <Kbd>Enter</Kbd>
          </Btn>
        ) : null}
        {onAgain ? (
          <Btn variant={onNext ? "outline" : "primary"} size="lg" onClick={onAgain}>
            Play again {onNext ? null : <Kbd>Enter</Kbd>}
          </Btn>
        ) : null}
        <Btn size="lg" onClick={onExit}>
          Pick another room
        </Btn>
      </div>
    </div>
  );
}

