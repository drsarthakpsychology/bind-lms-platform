"use client";

import * as React from "react";
import { startHowTo } from "@/components/help/how-to";
import { ArrowDown, ArrowRight, ArrowUp, Check, DoorOpen, FileText, Flag, Lightbulb, Lock, LockOpen, MapPin, Play, Timer, Trophy, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LearnLink } from "@/lib/games/ui/learn-link";
import { clock } from "@/lib/games-sims/common";
import { answer as applyAnswer, escapeXp, HINT_AFTER, PENALTY_S, shownOrder, startEscape, teamTime, type EscState, type RaceRow } from "@/lib/games-sims/escape/engine";
import { ROOMS, roomById, STAGE_LABEL, type Puzzle, type Room } from "@/lib/games-sims/escape/rooms";
import { TEAM_LIMITS } from "@/lib/games-sims/teams";
import { Btn, buzz, Kbd, motionCss as m, Panel, Pill, Stat, useHotkeys } from "@/lib/games-sims/ui/kit";
import { ThumbBar } from "@/components/mobile/thumb-bar";
import { JoinBox, Members, TeamCode, usePoll } from "@/lib/games-sims/ui/team";
import type { EscapeView } from "./actions";
import { creditServerPlay } from "@/lib/learn/credit-play";
import { useReaction } from "@/components/reactions/use-reaction";
import { EndReaction } from "@/components/reactions/graphics";
import { trySave } from "@/lib/save/client";
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
  gradeEscapePractice: (x: { room: string; stage: number; answer: string; first: boolean }) => Promise<{ ok: boolean }>;
  finishEscapePractice: (x: { room: string; run: string; answers: string[]; wrong: number; ms: number }) => Promise<{ ok: boolean; xp: number }>;
};
type TeamItem = { id: string; name: string; room: string; status: string };
/** A practice run left half-way: the doors so far and the clock (saved progress, src/lib/cases). */
type SavedRun = { st: EscState; answers: string[]; run: string; elapsed: number };
type Mode = { kind: "pick" } | { kind: "practice"; room: string; run: string; startedAt: number; saved?: SavedRun } | { kind: "team"; teamId: string };

function validRun(room: Room | undefined, s: SavedRun | null): s is SavedRun {
  return !!room && !!s && !!s.st && s.st.room === room.id && !s.st.done && Array.isArray(s.answers) && typeof s.run === "string" && typeof s.elapsed === "number" && Array.isArray(s.st.tries) && s.st.tries.length === room.puzzles.length;
}

const LETTERS = ["a", "b", "c", "d", "e", "f"];

export function EscapeRoom({ cases, teamsOn, openTeam, teams, actions }: { cases: CaseContext; teamsOn: boolean; openTeam: string | null; teams: TeamItem[]; actions: Actions }) {
  const [mode, setMode] = React.useState<Mode>(openTeam ? { kind: "team", teamId: openTeam } : { kind: "pick" });
  // Rooms in fresh-case order (src/lib/cases/fresh.ts): half done, new this week, new, done last.
  const history = useToolHistory("escape", cases.history);
  const progress = useCaseProgress("escape", cases.progress);
  const started = new Set([...progress.started].filter((id) => validRun(roomById(id), progress.get<SavedRun>(id))));
  const opts = { history, now: cases.now, student: cases.student, started, level: (r: Room) => r.puzzles.length };
  const arranged = arrangeCases(ROOMS, (r) => r.id, opts);
  function go(next: Mode) {
    if (next.kind !== "pick") startHowTo("team-escape-room");
    try {
      window.history.replaceState(null, "", next.kind === "team" ? `/games/escape?team=${next.teamId}` : "/games/escape");
    } catch {
      /* ignore */
    }
    setMode(next);
  }
  const fresh = (room: string) => go({ kind: "practice", room, run: `${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`, startedAt: Date.now() });
  /** Open a room: back at the door it was left on, else a new run. */
  const practice = (room: string) => {
    const saved = progress.get<SavedRun>(room);
    if (validRun(roomById(room), saved)) go({ kind: "practice", room, run: saved.run, startedAt: Date.now() - saved.elapsed, saved });
    else fresh(room);
  };
  if (mode.kind === "practice") {
    const nextId = nextCase(ROOMS, (r) => r.id, { ...opts, current: mode.room })?.item.id;
    return <Practice key={mode.run} room={roomById(mode.room)!} run={mode.run} startedAt={mode.startedAt} saved={mode.saved} actions={actions} onExit={() => go({ kind: "pick" })} onAgain={() => fresh(mode.room)} onNext={nextId && nextId !== mode.room ? () => practice(nextId) : undefined} />;
  }
  if (mode.kind === "team") return <TeamRun teamId={mode.teamId} actions={actions} onExit={() => go({ kind: "pick" })} />;
  return (
    <Pick
      teamsOn={teamsOn}
      teams={teams}
      arranged={arranged}
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
function Pick({ teamsOn, teams, arranged, onPractice, onCreate, onJoin, onOpen }: { teamsOn: boolean; teams: TeamItem[]; arranged: { list: { item: Room; id: string; mark: CaseMark }[]; recycled: boolean }; onPractice: (room: string) => void; onCreate: (room: string) => Promise<string | null>; onJoin: (code: string) => Promise<string | null>; onOpen: (id: string) => void }) {
  const [err, setErr] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);
  const resume = arranged.list.filter((x) => x.mark === "started");
  return (
    <div className={cn("mx-auto max-w-3xl space-y-6", m.rise)}>
      <h1 className="text-h3">Pick a room</h1>
      {resume.map((x) => (
        <Panel key={x.id} className="flex flex-wrap items-center gap-3 bg-status-info-bg">
          <DoorOpen className="size-5" aria-hidden />
          <p className="min-w-0 flex-1 text-body">
            You left <span className="font-semibold">{x.item.title}</span> at a locked door.
          </p>
          <Btn variant="ink" onClick={() => onPractice(x.id)}>
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
              <Btn variant={teamsOn || mark === "done" ? "outline" : "primary"} onClick={() => onPractice(r.id)}>
                <Play aria-hidden /> {mark === "started" ? "Carry on alone" : mark === "done" ? "Play again alone" : "Practice alone"}
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
                        {t.name} · {roomById(t.room)?.title ?? t.room} · {t.status === "lobby" ? "waiting to start" : "inside"}
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

function Doors({ room, st, feedback }: { room: Room; st: EscState; feedback: Feedback }) {
  const open = st.done ? room.puzzles.length : st.stage;
  return (
    <ol className="grid grid-cols-7 gap-1.5 sm:gap-2" aria-label="Doors">
      {room.puzzles.map((p, i) => {
        const isOpen = i < open;
        const now = !st.done && i === st.stage;
        const justOpened = feedback?.ok && feedback.stage === i;
        return (
          <li key={p.id} className="min-w-0 text-center">
            <div key={`${i}-${isOpen}`} className={cn("mx-auto grid size-9 place-items-center rounded-md border-2 border-foreground sm:size-11", isOpen ? "bg-foreground text-background" : now ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground", justOpened && m.unlock, now && feedback && !feedback.ok && feedback.stage === i && m.shake)}>
              {isOpen ? <LockOpen className="size-4 sm:size-5" aria-hidden /> : <Lock className="size-4 sm:size-5" aria-hidden />}
            </div>
            <span className="mt-1 block truncate text-caption">{STAGE_LABEL[p.stage]}</span>
            <span className="sr-only">{isOpen ? "open" : now ? "current" : "locked"}</span>
          </li>
        );
      })}
    </ol>
  );
}

function CaseFile({ room, st }: { room: Room; st: EscState }) {
  const open = st.done ? room.puzzles.length : st.stage;
  const pages = [room.intro, ...room.puzzles.slice(0, open).map((p) => p.unlock)];
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
function Door({ p, seed, tries, feedback, disabled, onSubmit }: { p: Puzzle; seed: string; tries: number; feedback: Feedback; disabled: boolean; onSubmit: (raw: string) => void }) {
  const [picked, setPicked] = React.useState<number[]>([]);
  const [order, setOrder] = React.useState<number[]>(() => shownOrder(p, seed));
  const [num, setNum] = React.useState<number>(() => (p.kind === "number" ? p.min : 0));
  // Help after wrong answers is free, so it simply shows once it opens.
  const hint = tries >= HINT_AFTER;

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
        {!hint ? (
          <span className="ml-auto inline-flex items-center gap-1 text-caption text-muted-foreground">
            <Lightbulb className="size-3.5" aria-hidden /> Hint after {HINT_AFTER} misses
          </span>
        ) : null}
      </div>
      {hint ? (
        <p className={cn("flex items-start gap-2 rounded-md border-2 border-foreground bg-status-pending-bg p-2 text-small text-status-pending-fg", m.rise)} role="status">
          <Lightbulb className="mt-0.5 size-4 shrink-0" aria-hidden /> <span className="min-w-0">{p.hint}</span>
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

function OpenedCard({ p, by, onNext, nextLabel }: { p: Puzzle; by?: string; onNext: () => void; nextLabel: string }) {
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

function Header({ room, onExit, right }: { room: Room; onExit: () => void; right: React.ReactNode }) {
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
function Practice({ room, run, startedAt, saved, actions, onExit, onAgain, onNext }: { room: Room; run: string; startedAt: number; saved?: SavedRun; actions: Actions; onExit: () => void; onAgain: () => void; onNext?: () => void }) {
  const [st, setSt] = React.useState<EscState>(() => saved?.st ?? startEscape(room));
  const [answers, setAnswers] = React.useState<string[]>(() => saved?.answers ?? []);
  const [feedback, setFeedback] = React.useState<Feedback>(null);
  const [opened, setOpened] = React.useState<number | null>(null);
  const [finishedAt, setFinishedAt] = React.useState<number | null>(null);
  const [xp, setXp] = React.useState<number | null>(null);
  const now = useTicker(finishedAt === null);
  const ms = teamTime(new Date(startedAt).toISOString(), finishedAt ?? now ?? startedAt, st.wrong);
  const reaction = useReaction();

  function submit(raw: string) {
    if (opened !== null || st.done) return;
    const first = (st.tries[st.stage] ?? 0) === 0;
    const res = applyAnswer(room, st, st.stage, raw, "You", new Date().toISOString());
    buzz(res.ok);
    // The last door opens straight onto the escape screen, which has its own sticker.
    if (!res.state.done) reaction.onAnswer(res.ok, { partial: res.ok && !first });
    void trySave(() => actions.gradeEscapePractice({ room: room.id, stage: st.stage, answer: raw, first }), "Escape answer");
    setFeedback({ stage: st.stage, ok: res.ok });
    const list = res.ok ? [...answers, raw] : answers;
    // Saved progress (src/lib/cases): the door reached and the clock, here and on the server.
    if (!res.state.done) saveCaseProgress("escape", room.id, { st: res.state, answers: list, run, elapsed: Date.now() - startedAt } satisfies SavedRun);
    if (res.ok) {
      setAnswers(list);
      setOpened(st.stage);
      if (res.state.done) {
        clearCaseProgress("escape", room.id);
        noteAnswer("escape", room.id, room.puzzles.length / (room.puzzles.length + res.state.wrong) >= 0.6, { server: false });
        const end = Date.now();
        setFinishedAt(end);
        void actions
          .finishEscapePractice({ room: room.id, run, answers: list, wrong: res.state.wrong, ms: end - startedAt })
          .then((r) => {
            setXp(r.ok ? r.xp : 0);
            if (r.ok) creditServerPlay(r.xp);
          })
          .catch(() => setXp(0));
      }
    }
    setSt(res.state);
  }

  if (st.done && opened === null) return <Escaped room={room} ms={ms} wrong={st.wrong} xp={xp} onExit={onExit} onAgain={onAgain} onNext={onNext} />;

  const p = room.puzzles[opened ?? st.stage];
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Header room={room} onExit={onExit} right={<Clock ms={ms} wrong={st.wrong} />} />
      <Doors room={room} st={st} feedback={feedback} />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0 space-y-4">
          {opened !== null ? (
            <OpenedCard p={p} onNext={() => setOpened(null)} nextLabel={st.done ? "Out!" : "Next door"} />
          ) : (
            <Door key={p.id} p={p} seed={run} tries={st.tries[st.stage] ?? 0} feedback={feedback?.stage === st.stage ? feedback : null} disabled={false} onSubmit={submit} />
          )}
          {feedback && !feedback.ok && opened === null ? (
            <p className="flex items-center gap-1.5 text-small font-semibold" role="status">
              <X className="size-4" aria-hidden /> Not that. +{PENALTY_S} seconds. Try again.
            </p>
          ) : null}
        </div>
        <CaseFile room={room} st={st} />
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
  const room = roomById(view.room);
  if (!room) return null;
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

  const showOpened = feedback?.ok && feedback.stage < (st.done ? room.puzzles.length : st.stage);
  if (st.done && !showOpened) return <Escaped room={room} ms={ms} wrong={st.wrong} xp={view.xp} onExit={onExit} race={view.race} teamLine={`${view.name}: ${view.members.map((x) => x.name).join(", ")}`} />;

  const stage = showOpened ? feedback!.stage : st.stage;
  const p = room.puzzles[stage];

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
          {showOpened ? (
            <OpenedCard
              p={p}
              by={feedback!.by}
              onNext={() => {
                setFeedback(null);
                setSeenStage(st.stage);
              }}
              nextLabel={st.done ? "Out!" : "Next door"}
            />
          ) : (
            <Door key={`${p.id}-${seenStage}`} p={p} seed={teamId} tries={st.tries[stage] ?? 0} feedback={feedback?.stage === stage ? feedback : null} disabled={busy} onSubmit={submit} />
          )}
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
          <CaseFile room={room} st={st} />
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

function Escaped({ room, ms, wrong, xp, onExit, onAgain, onNext, race, teamLine }: { room: Room; ms: number; wrong: number; xp: number | null; onExit: () => void; onAgain?: () => void; onNext?: () => void; race?: RaceRow[]; teamLine?: string }) {
  const primary = onNext ?? onAgain;
  useHotkeys(primary ? { Enter: primary } : {});
  const n = room.puzzles.length;
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
          {room.puzzles.map((p, i) => (
            <li key={p.id} className={cn("rounded-lg border-2 border-foreground/25 bg-card p-3", m.rise)} style={{ "--i": i } as React.CSSProperties}>
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

