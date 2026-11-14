"use client";

import * as React from "react";
import { startHowTo } from "@/components/help/how-to";
import { ArrowDown, ArrowRight, ArrowUp, BookOpen, Hospital, MapPin, Minus, Play, RotateCcw, Users, Vote } from "lucide-react";
import { cn } from "@/lib/utils";
import { LearnLink } from "@/lib/games/ui/learn-link";
import { deltaSign, KIND_LABEL, LOWER_IS_BETTER, QUALITY_LABEL, VAR_LABEL, type CampaignCard, type Quality, type Scene, type VarKey, type Vars, type WardEnd, type WardReveal } from "@/lib/games-sims/ward/rules";
import { TEAM_LIMITS } from "@/lib/games-sims/teams";
import { Btn, buzz, Kbd, motionCss as m, Panel, Pill, readLocal, Stat, useHotkeys, writeLocal, type Tone } from "@/lib/games-sims/ui/kit";
import { JoinBox, Members, TeamCode, usePoll } from "@/lib/games-sims/ui/team";
import type { WardSolo, WardTeamView } from "./actions";
import { creditServerPlay } from "@/lib/learn/credit-play";
import { HintBar, useHintStatus } from "@/components/hints/hint-chip";
import { askHint } from "@/lib/hints/actions";
import { useReaction } from "@/components/reactions/use-reaction";
import { EndReaction } from "@/components/reactions/graphics";
import { arrangeCases, nextCase, type CaseMark } from "@/lib/cases/fresh";
import type { CaseContext } from "@/lib/cases/server";
import { clearCaseProgress, saveCaseProgress, useCaseProgress } from "@/lib/cases/progress-client";
import { noteAnswer, useToolHistory } from "@/lib/history/client";
import { CaseMarkTag, RecycleNote } from "@/components/cases/case-mark";

type Actions = {
  startWardSolo: (campaign: string) => Promise<WardSolo>;
  resumeWardSolo: (x: { token?: string; campaign?: string; choices?: string[] }) => Promise<WardSolo>;
  pickWardSolo: (x: { token: string; option: string }) => Promise<WardSolo>;
  createWardTeam: (campaign: string) => Promise<{ ok: true; teamId: string } | { ok: false; reason: string }>;
  joinWardTeam: (code: string) => Promise<{ ok: true; teamId: string } | { ok: false; reason: string }>;
  wardTeamView: (teamId: string) => Promise<WardTeamView | null>;
  castWardVote: (x: { teamId: string; step: number; choice: string }) => Promise<WardTeamView | null>;
};
type TeamListItem = { id: string; name: string; campaign: string; status: string; code: string };

const LETTERS = ["a", "b", "c", "d"];
const VAR_ORDER: VarKey[] = ["risk", "trust", "insight", "family", "adherence"];
const Q_TONE: Record<Quality, Tone> = { best: "good", ok: "part", poor: "bad", harm: "bad" };
const SOLO_KEY = "vibha-ward-solo";

type Started = Extract<WardSolo, { ok: true }>;
/**
 * A solo game saved half-way, per patient (saved progress, src/lib/cases):
 * its signed game from the server, or, from before that, its choices.
 */
type Saved = { token?: string; choices?: string[] };
type Mode = { kind: "pick" } | { kind: "solo"; campaign: string; start: Started; n: number } | { kind: "team"; teamId: string };
const FAIL = "That didn't load. Try again.";

const savedOk = (s: Saved | null): s is Saved => !!s && (typeof s.token === "string" || (Array.isArray(s.choices) && s.choices.length > 0 && s.choices.every((x) => typeof x === "string")));

/** Campaigns in fresh-case order (src/lib/cases/fresh.ts): half done, new this week, new, done last. */
function useCampaigns(campaigns: CampaignCard[], cases: CaseContext) {
  const history = useToolHistory("ward", cases.history);
  const progress = useCaseProgress("ward", cases.progress);
  const legacy = useLegacySolo();
  const started = React.useMemo(() => {
    const set = new Set([...progress.started].filter((id) => campaigns.some((c) => c.id === id) && savedOk(progress.get<Saved>(id))));
    if (legacy && !progress.rows.has(legacy.campaign) && campaigns.some((c) => c.id === legacy.campaign)) set.add(legacy.campaign);
    return set;
  }, [progress, legacy, campaigns]);
  const opts = { history, now: cases.now, student: cases.student, started, level: (c: CampaignCard) => c.level };
  const arranged = arrangeCases(campaigns, (c) => c.id, opts);
  /** The saved game for a half-done campaign. */
  const savedFor = (id: string): Saved | null => {
    const s = progress.get<Saved>(id);
    if (savedOk(s)) return s;
    return legacy?.campaign === id ? { choices: legacy.choices } : null;
  };
  const next = (current?: string) => nextCase(campaigns, (c) => c.id, { ...opts, current })?.item.id ?? null;
  return { arranged, savedFor, next };
}

/* ------------------------------------------------------------------ root */
export function WardWeek({ campaigns, cases, teamsOn, openTeam, teams, actions }: { campaigns: CampaignCard[]; cases: CaseContext; teamsOn: boolean; openTeam: string | null; teams: TeamListItem[]; actions: Actions }) {
  const [mode, setMode] = React.useState<Mode>(openTeam ? { kind: "team", teamId: openTeam } : { kind: "pick" });
  const [startErr, setStartErr] = React.useState<string | null>(null);
  const camps = useCampaigns(campaigns, cases);
  const titleOf = (id: string) => campaigns.find((c) => c.id === id)?.title ?? id;

  function goTeam(teamId: string) {
    startHowTo("ward-week");
    try {
      window.history.replaceState(null, "", `/games/ward?team=${teamId}`);
    } catch {
      /* ignore */
    }
    setMode({ kind: "team", teamId });
  }
  function goPick() {
    try {
      window.history.replaceState(null, "", "/games/ward");
    } catch {
      /* ignore */
    }
    setMode({ kind: "pick" });
  }
  function show(campaign: string, r: Started) {
    startHowTo("ward-week");
    setMode((m) => ({ kind: "solo", campaign, start: r, n: m.kind === "solo" ? m.n + 1 : 0 }));
  }
  /** A new game, dealt by the server: the first session only. */
  async function fresh(campaign: string): Promise<string | null> {
    const r = await actions.startWardSolo(campaign).catch(() => null);
    if (!r || !r.ok) return r?.error ?? FAIL;
    show(campaign, r);
    return null;
  }
  /** Open a campaign: carry on where it was left (the server replays the saved game), else a new one. */
  async function open(campaign: string): Promise<string | null> {
    const saved = camps.savedFor(campaign);
    if (saved) {
      const r = await actions.resumeWardSolo(saved.token ? { token: saved.token } : { campaign, choices: saved.choices }).catch(() => null);
      if (r && r.ok) {
        if (!saved.token) writeLocal(SOLO_KEY, null);
        saveCaseProgress("ward", campaign, { token: r.token } satisfies Saved);
        show(campaign, r);
        return null;
      }
      // A saved game that can't be carried on (finished, or from another account) is dropped.
      if (r) {
        clearCaseProgress("ward", campaign);
        writeLocal(SOLO_KEY, null);
      }
    }
    return fresh(campaign);
  }
  const fail = (e: string | null) => {
    if (e) {
      setStartErr(e);
      goPick();
    }
  };

  if (mode.kind === "solo") {
    const nextId = camps.next(mode.campaign);
    return (
      <SoloPlay
        key={mode.n}
        start={mode.start}
        campaign={mode.campaign}
        pick={actions.pickWardSolo}
        onExit={goPick}
        onAgain={async () => fail(await fresh(mode.campaign))}
        onNext={nextId && nextId !== mode.campaign ? async () => fail(await open(nextId)) : undefined}
      />
    );
  }
  if (mode.kind === "team") return <TeamPlay teamId={mode.teamId} actions={actions} onExit={goPick} />;
  return (
    <Pick
      arranged={camps.arranged}
      startErr={startErr}
      teamsOn={teamsOn}
      teams={teams}
      onSolo={open}
      onCreate={async (c) => {
        const r = await actions.createWardTeam(c);
        if (r.ok) goTeam(r.teamId);
        return r.ok ? null : r.reason;
      }}
      onJoin={async (code) => {
        const r = await actions.joinWardTeam(code);
        if (r.ok) goTeam(r.teamId);
        return r.ok ? null : r.reason;
      }}
      onOpenTeam={goTeam}
      titleOf={titleOf}
    />
  );
}

/** A solo campaign left half-way under the old single-slot key (before saved progress per patient). */
function useLegacySolo(): { campaign: string; choices: string[] } | null {
  const raw = React.useSyncExternalStore(
    () => () => undefined,
    () => {
      try {
        return window.localStorage.getItem(SOLO_KEY);
      } catch {
        return null;
      }
    },
    () => null,
  );
  return React.useMemo(() => {
    if (!raw) return null;
    try {
      const s = JSON.parse(raw) as { campaign?: unknown; choices?: unknown };
      return typeof s.campaign === "string" && Array.isArray(s.choices) && s.choices.length && s.choices.every((x) => typeof x === "string") ? { campaign: s.campaign, choices: s.choices as string[] } : null;
    } catch {
      return null;
    }
  }, [raw]);
}

/* ------------------------------------------------------------------ pick */
function Pick({
  arranged,
  startErr,
  teamsOn,
  teams,
  onSolo,
  onCreate,
  onJoin,
  onOpenTeam,
  titleOf,
}: {
  arranged: { list: { item: CampaignCard; id: string; mark: CaseMark }[]; recycled: boolean };
  startErr: string | null;
  teamsOn: boolean;
  teams: TeamListItem[];
  onSolo: (c: string) => Promise<string | null>;
  onCreate: (c: string) => Promise<string | null>;
  onJoin: (code: string) => Promise<string | null>;
  onOpenTeam: (id: string) => void;
  titleOf: (id: string) => string;
}) {
  const [err, setErr] = React.useState<string | null>(startErr);
  const [busy, setBusy] = React.useState<string | null>(null);
  async function run(key: string, fn: () => Promise<string | null>) {
    if (busy) return;
    setBusy(key);
    setErr(null);
    const e = await fn().catch(() => FAIL);
    setBusy(null);
    if (e) setErr(e);
  }
  const list = arranged.list;
  useHotkeys(Object.fromEntries(list.slice(0, 9).map((x, k) => [String(k + 1), () => void run(`solo:${x.id}`, () => onSolo(x.id))])));
  const live = teams.filter((t) => t.status !== "done");
  const resume = list.filter((x) => x.mark === "started");
  return (
    <div className={cn("mx-auto max-w-3xl space-y-6", m.rise)}>
      <h1 className="text-h2">Pick a patient</h1>

      {resume.map((x) => (
        <Panel key={x.id} className="flex flex-wrap items-center gap-3 bg-status-info-bg">
          <BookOpen className="size-5" aria-hidden />
          <p className="min-w-0 flex-1 text-body">
            You left <span className="font-semibold">{x.item.title}</span> half-way.
          </p>
          <Btn variant="ink" disabled={busy !== null} onClick={() => void run(`resume:${x.id}`, () => onSolo(x.id))}>
            <Play aria-hidden /> {busy === `resume:${x.id}` ? "Opening…" : "Carry on"}
          </Btn>
        </Panel>
      ))}
      {arranged.recycled ? <RecycleNote /> : null}

      <ul className={cn("grid gap-4 md:grid-cols-3", m.stagger)}>
        {list.map(({ item: c, mark }, i) => (
          <li key={c.id} className={cn("flex min-w-0 flex-col rounded-xl border-2 border-foreground bg-card p-4 hard-shadow-sm", mark === "done" && !arranged.recycled && "border-foreground/40 shadow-none", m.rise)} style={{ "--i": i } as React.CSSProperties}>
            <div className="flex items-start justify-between gap-2">
              <p className="flex min-w-0 items-center gap-1.5 text-caption text-muted-foreground">
                <MapPin className="size-3.5 shrink-0" aria-hidden />
                <span className="truncate">{c.place}</span>
              </p>
              <CaseMarkTag mark={mark} />
            </div>
            <h2 className="mt-1 text-h3">{c.title}</h2>
            <p className="text-small font-semibold">{c.patient}</p>
            <p className="mt-2 flex-1 text-small">{c.blurb}</p>
            <div className="mt-3 grid gap-2">
              <Btn variant={mark === "done" ? "outline" : "primary"} disabled={busy !== null} onClick={() => void run(`solo:${c.id}`, () => onSolo(c.id))}>
                {mark === "done" ? <RotateCcw aria-hidden /> : <Play aria-hidden />} {busy === `solo:${c.id}` ? "Starting…" : mark === "started" ? "Carry on" : mark === "done" ? "Play again" : "Play solo"} {i < 9 ? <Kbd>{i + 1}</Kbd> : null}
              </Btn>
              {teamsOn ? (
                <Btn disabled={busy !== null} onClick={() => void run(c.id, () => onCreate(c.id).catch(() => "Couldn't start a team. Try again."))}>
                  <Users aria-hidden /> {busy === c.id ? "Starting…" : "Start a team of 3"}
                </Btn>
              ) : null}
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
          <div className="flex items-center gap-2">
            <Vote className="size-5" aria-hidden />
            <h2 className="text-body-strong">Team mode</h2>
          </div>
          <JoinBox onJoin={onJoin} label="Got a code from a classmate?" />
          {live.length ? (
            <div className="space-y-2">
              <p className="text-small font-semibold">Your teams</p>
              <ul className="space-y-2">
                {live.map((t) => (
                  <li key={t.id}>
                    <Btn className="w-full justify-between" onClick={() => onOpenTeam(t.id)}>
                      <span className="truncate">
                        {t.name} · {titleOf(t.campaign)}
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
        <p className="text-small text-muted-foreground">Team mode is not open yet. Play solo for now.</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ solo */
function SoloPlay({ start, campaign, pick: pickOnServer, onExit, onAgain, onNext }: { start: Started; campaign: string; pick: Actions["pickWardSolo"]; onExit: () => void; onAgain: () => void; onNext?: () => void }) {
  const [token, setToken] = React.useState(start.token);
  const [scene, setScene] = React.useState<Scene>(start.scene);
  const [reveal, setReveal] = React.useState<WardReveal | null>(null);
  const [end, setEnd] = React.useState<WardEnd | null>(null);
  const [result, setResult] = React.useState<{ xp: number; saved: boolean } | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [lost, setLost] = React.useState<string | null>(null);
  const [hints, setHints] = useHintStatus();
  /** Hints used: step → options ruled out. */
  const [ruled, setRuled] = React.useState<Record<number, string[]>>({});
  const reaction = useReaction();
  /** One choice in flight at a time, so a double tap counts once. */
  const inflight = React.useRef(false);
  const current = reveal ? null : scene.decision;

  async function pick(optionId: string) {
    if (reveal || inflight.current) return;
    inflight.current = true;
    setBusy(true);
    const r = await pickOnServer({ token, option: optionId }).catch(() => null);
    inflight.current = false;
    setBusy(false);
    // No connection is not a wrong answer: nothing counted, try again.
    setLost(!r ? "Connection lost. Your answer was not sent. Try again." : r.ok ? null : r.error);
    if (!r || !r.ok || !r.reveal) return;
    const q = r.reveal.q;
    buzz(q === "best");
    // "Okay" is a near miss; poor and harmful choices are wrong.
    reaction.onAnswer(q === "best", { partial: q === "ok" || (q === "best" && (ruled[scene.step] ?? []).length > 0) });
    setToken(r.token);
    setScene(r.scene);
    setReveal(r.reveal);
    if (r.scene.done) {
      writeLocal(SOLO_KEY, null);
      clearCaseProgress("ward", campaign);
      // Done on this device straight away; the server records it too.
      noteAnswer("ward", campaign, (r.end?.score ?? 0) >= 50, { server: false });
      setEnd(r.end ?? null);
      setResult({ xp: r.saved ? (r.xp ?? 0) : 0, saved: !!r.saved });
      if (r.saved && r.xp) creditServerPlay(r.xp);
    }
    // Saved progress (src/lib/cases): the signed game, this browser at once, the server shortly after.
    else saveCaseProgress("ward", campaign, { token: r.token } satisfies Saved);
  }

  if (scene.done && !reveal && end) return <EndScreen title={scene.title} end={end} xp={result ? result.xp : null} onAgain={onAgain} onNext={onNext} onExit={onExit} />;

  return (
    <Stage
      scene={scene}
      reveal={reveal}
      onPick={(o) => void pick(o)}
      busy={busy}
      lost={lost}
      onNext={() => setReveal(null)}
      nextLabel={scene.done ? "See the ending" : reveal && scene.chapter !== reveal.chapter ? "Next session" : "Next call"}
      onExit={onExit}
      hint={
        current
          ? {
              gone: ruled[scene.step] ?? [],
              bar: (
                <HintBar
                  status={hints}
                  onStatus={setHints}
                  used={(ruled[scene.step] ?? []).length > 0}
                  ask={() => askHint({ game: "ward", run: "solo", token, options: current.options.map((o) => o.id) })}
                  onGive={(h) => setRuled((r) => ({ ...r, [scene.step]: h.remove }))}
                />
              ),
            }
          : undefined
      }
    />
  );
}

/* ----------------------------------------------------------------- stage */
function Stage({
  scene,
  reveal,
  onPick,
  busy = false,
  lost = null,
  onNext,
  nextLabel,
  onExit,
  team,
  hint,
}: {
  scene: Scene;
  reveal: (WardReveal & { teamLine?: string }) | null;
  onPick: (id: string) => void;
  busy?: boolean;
  lost?: string | null;
  onNext: () => void;
  nextLabel: string;
  onExit: () => void;
  team?: { myVote: string | null; waiting: React.ReactNode; header: React.ReactNode };
  /** Solo only: options a hint ruled out, and the hint chip and button. */
  hint?: { gone: string[]; bar: React.ReactNode };
}) {
  const d = reveal ? null : scene.decision;
  const shown = d ? d.options.filter((o) => !(hint?.gone ?? []).includes(o.id)) : [];
  const chapter = reveal ? reveal.chapter : scene.chapter;
  const chapterTitle = reveal ? reveal.chapterTitle : scene.chapterTitle;
  const beats = reveal ? reveal.beats : scene.beats;
  const dials = reveal ? reveal.after : scene.vars;
  const voted = team?.myVote ?? null;

  const keys: Record<string, () => void> = {};
  if (d && !voted && !busy) shown.forEach((o, i) => (keys[LETTERS[i]] = () => onPick(o.id)));
  if (reveal) {
    keys.Enter = onNext;
    keys[" "] = onNext;
  }
  useHotkeys(keys);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 font-semibold">
          <Hospital className="size-5" aria-hidden /> {scene.title}
        </span>
        <span className="text-small text-muted-foreground">{scene.patient}</span>
        <Btn variant="ghost" className="ml-auto" onClick={onExit}>
          Leave
        </Btn>
      </div>
      {team?.header}
      <ChapterTrack sessions={scene.sessions} at={chapter} done={scene.done && !reveal} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0 space-y-4">
          <Panel key={chapter} className={cn("space-y-3", m.slide)}>
            <h2 className="text-h3">{chapterTitle}</h2>
            <div className={cn("space-y-2", m.stagger)}>
              {beats.map((b, i) => (
                <p key={i} className={cn("text-body", m.rise)} style={{ "--i": i } as React.CSSProperties}>
                  {b}
                </p>
              ))}
            </div>
          </Panel>

          {d ? (
            <Panel key={scene.step} className={cn("space-y-3 bg-muted/40", m.rise)} aria-live="polite">
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="info">{KIND_LABEL[d.kind]}</Pill>
              </div>
              <fieldset>
                <legend className="mb-3 text-body-strong">{d.prompt}</legend>
                <div className="grid gap-2">
                  {shown.map((o, i) => {
                    const mine = voted === o.id;
                    return (
                      <Btn
                        key={o.id}
                        disabled={!!voted || busy}
                        aria-pressed={mine}
                        className={cn("h-auto justify-start py-2.5 text-left font-normal", mine && "border-foreground bg-primary text-primary-foreground disabled:opacity-100")}
                        onClick={() => onPick(o.id)}
                      >
                        <span className="font-mono text-caption font-semibold uppercase opacity-70" aria-hidden>
                          {LETTERS[i]}
                        </span>
                        <span className="min-w-0 flex-1">{o.text}</span>
                        {mine ? <span className="text-caption font-semibold">Your vote</span> : null}
                      </Btn>
                    );
                  })}
                </div>
              </fieldset>
              {lost ? (
                <p className="text-small font-semibold" role="status">
                  {lost}
                </p>
              ) : null}
              {hint?.bar}
              {team?.waiting}
            </Panel>
          ) : null}

          {reveal ? <RevealCard r={reveal} onNext={onNext} nextLabel={nextLabel} /> : null}
        </div>
        <Dials vars={dials} before={reveal?.before ?? null} />
      </div>
      {scene.note ? <p className="text-caption text-muted-foreground">{scene.note}</p> : null}
    </div>
  );
}

function ChapterTrack({ sessions, at, done }: { sessions: number; at: number; done: boolean }) {
  return (
    <ol className="flex gap-1.5" aria-label="Sessions">
      {Array.from({ length: sessions }, (_, i) => {
        const past = done || i < at;
        const now = !done && i === at;
        return (
          <li key={i} className="min-w-0 flex-1">
            <div className={cn("h-2.5 rounded-full border-2 border-foreground", past ? "bg-foreground" : now ? "bg-primary" : "bg-card")} aria-hidden />
            <span className="sr-only">
              Session {i + 1}: {past ? "done" : now ? "now" : "to come"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Dials({ vars, before }: { vars: Vars; before: Vars | null }) {
  return (
    <Panel className="h-fit space-y-3 p-3 lg:sticky lg:top-[calc(var(--top-h)+1rem)]">
      <p className="text-caption font-semibold uppercase">The patient now</p>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-5 lg:grid-cols-1">
        {VAR_ORDER.map((k) => {
          const v = vars[k];
          const delta = before ? v - before[k] : 0;
          const sign = deltaSign(k, delta);
          return (
            <li key={k} className="min-w-0">
              <div className="flex items-baseline justify-between gap-1 text-caption font-semibold">
                <span className="truncate">
                  {VAR_LABEL[k]}
                  {LOWER_IS_BETTER.has(k) ? <span className="font-normal text-muted-foreground"> (low is good)</span> : null}
                </span>
                <span className="tabular-nums">{v}</span>
              </div>
              <div className="mt-1 h-3 overflow-hidden rounded-full border-2 border-foreground bg-muted" role="meter" aria-label={VAR_LABEL[k]} aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
                <div className={cn("h-full origin-left transition-transform duration-500", LOWER_IS_BETTER.has(k) ? "bg-destructive/70" : "bg-primary")} style={{ transform: `scaleX(${v / 100})` }} />
              </div>
              {delta ? (
                <span key={`${k}-${v}`} className={cn("mt-1 inline-flex items-center gap-0.5 rounded border-2 border-foreground px-1 text-caption font-semibold", sign > 0 ? "bg-status-success-bg text-status-success-fg" : "bg-status-alert-bg text-status-alert-fg", m.floatUp)}>
                  {delta > 0 ? <ArrowUp className="size-3" aria-hidden /> : <ArrowDown className="size-3" aria-hidden />}
                  {delta > 0 ? `+${delta}` : delta} {sign > 0 ? "better" : "worse"}
                </span>
              ) : before ? (
                <span className="mt-1 inline-flex items-center gap-0.5 text-caption text-muted-foreground">
                  <Minus className="size-3" aria-hidden /> no change
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function RevealCard({ r, onNext, nextLabel }: { r: WardReveal & { teamLine?: string }; onNext: () => void; nextLabel: string }) {
  const good = r.q === "best";
  return (
    <Panel className={cn("space-y-3", good ? m.pop : m.shake)} aria-live="polite">
      {r.teamLine ? <p className="text-small font-semibold">{r.teamLine}</p> : null}
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone={Q_TONE[r.q]}>{QUALITY_LABEL[r.q]}</Pill>
        <span className="text-caption text-muted-foreground">{KIND_LABEL[r.kind]}</span>
      </div>
      <p className="border-l-4 border-primary pl-3 text-body-strong">{r.text}</p>
      <p className="text-body">{r.why}</p>
      {r.skill ? <LearnLink topic={KIND_LABEL[r.kind]} href={`/study/${r.skill.split(":")[0]}`} newTab /> : null}
      {r.best ? (
        <div className={cn("rounded-lg border-2 border-foreground/30 bg-card p-3", m.rise)}>
          <p className="text-caption font-semibold uppercase">The strongest call</p>
          <p className="mt-1 text-small font-semibold">{r.best.text}</p>
          <p className="mt-1 text-small">{r.best.why}</p>
        </div>
      ) : null}
      <Btn variant="primary" size="lg" className="w-full" onClick={onNext} autoFocus>
        {nextLabel} <ArrowRight aria-hidden /> <Kbd>Enter</Kbd>
      </Btn>
    </Panel>
  );
}

/* ------------------------------------------------------------------- end */
function EndScreen({ title, end, xp, onAgain, onNext, onExit, teamLine }: { title: string; end: WardEnd; xp: number | null; onAgain?: () => void; onNext?: () => void; onExit: () => void; teamLine?: string }) {
  const score = end.score;
  const tone: Tone = score >= 72 ? "good" : score >= 50 ? "part" : "bad";
  const strong = end.log.filter((l) => l.q === "best").length;
  const primary = onNext ?? onAgain;
  useHotkeys(primary ? { Enter: primary } : {});
  return (
    <div className={cn("mx-auto max-w-3xl space-y-5", m.rise)}>
      <div className="flex flex-wrap items-end gap-3">
        <h1 className="text-h1">{end.title}</h1>
        <Pill tone={tone} className={m.stamp}>
          {tone === "good" ? "Good outcome" : tone === "part" ? "Mixed outcome" : "Poor outcome"}
        </Pill>
      </div>
      {teamLine ? <p className="text-small font-semibold">{teamLine}</p> : null}
      <EndReaction mood={tone === "good" ? (score >= 90 ? "streak" : "right") : tone === "part" ? "near" : "wrong"} seed={title} />
      <p className="text-body">{end.text}</p>

      <Panel className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-body-strong">Outcome score</span>
          <span className="font-pix text-h2 tabular-nums">{score}/100</span>
        </div>
        <div className="relative h-5 overflow-hidden rounded-md border-2 border-foreground bg-muted" role="meter" aria-label="Outcome score" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
          <div className={cn("h-full origin-left bg-primary", m.grow)} style={{ transform: `scaleX(${score / 100})` }} />
          <span className="absolute inset-y-0 border-l-2 border-dashed border-foreground" style={{ left: "50%" }} aria-hidden />
          <span className="absolute inset-y-0 border-l-2 border-dashed border-foreground" style={{ left: "72%" }} aria-hidden />
        </div>
        <p className="text-caption text-muted-foreground">Dashed lines: 50 steady, 72 a good outcome.</p>
      </Panel>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Strong calls" value={`${strong}/${end.log.length}`} />
        <Stat label="Risk at the end" value={end.vars.risk} />
        <Stat label="Trust at the end" value={end.vars.trust} />
        <Stat label="XP earned" value={xp === null ? "…" : `+${xp}`} />
      </div>

      <section className="space-y-2">
        <h2 className="text-body-strong">Your calls, looking back</h2>
        <ol className={cn("space-y-2", m.stagger)}>
          {end.log.map((l, i) => (
            <li key={i} className={cn("rounded-lg border-2 border-foreground/25 bg-card p-3", m.rise)} style={{ "--i": i } as React.CSSProperties}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-caption">S{l.chapter + 1}</span>
                <span className="text-caption text-muted-foreground">{KIND_LABEL[l.kind]}</span>
                <Pill tone={Q_TONE[l.q]} className="ml-auto">
                  {QUALITY_LABEL[l.q]}
                </Pill>
              </div>
              <p className="mt-1 text-small font-semibold">{l.prompt}</p>
              <p className="text-small">{l.text}</p>
              {l.best ? <p className="mt-1 text-small text-muted-foreground">Stronger: {l.best}</p> : null}
            </li>
          ))}
        </ol>
      </section>

      <div className="grid gap-2 sm:grid-cols-2">
        {onNext ? (
          <Btn variant="primary" size="lg" className="sm:col-span-2" onClick={onNext}>
            Next patient <ArrowRight aria-hidden /> <Kbd>Enter</Kbd>
          </Btn>
        ) : null}
        {onAgain ? (
          <Btn variant={onNext ? "outline" : "primary"} size="lg" onClick={onAgain}>
            <RotateCcw aria-hidden /> Play again {onNext ? null : <Kbd>Enter</Kbd>}
          </Btn>
        ) : null}
        <Btn size="lg" onClick={onExit}>
          Pick another patient
        </Btn>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ team */
function TeamPlay({ teamId, actions, onExit }: { teamId: string; actions: Actions; onExit: () => void }) {
  const [view, setView] = React.useState<WardTeamView | null>(null);
  const [missing, setMissing] = React.useState(false);
  const [seen, setSeen] = React.useState<number | null>(null);
  const [busy, setBusy] = React.useState(false);
  const seenKey = `vibha-ward-seen-${teamId}`;

  function apply(v: WardTeamView | null) {
    if (!v) {
      setMissing(true);
      return;
    }
    setMissing(false);
    setView(v);
    setSeen((s) => (s === null ? Math.min(readLocal(seenKey, v.reveals.length), v.reveals.length) : s));
  }
  usePoll(!view?.scene.done, 4000, () => actions.wardTeamView(teamId), apply);

  if (missing && !view)
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <h1 className="text-h2">Team not found</h1>
        <p className="text-body">You may not be in this team, or team play is not open yet.</p>
        <Btn variant="primary" onClick={onExit}>
          Back to Ward Week
        </Btn>
      </div>
    );
  if (!view || seen === null) return <p className="px-4 py-8 text-body text-muted-foreground">Loading your team…</p>;

  const scene = view.scene;
  const pending = seen < view.reveals.length ? view.reveals[seen] : null;
  const markSeen = () => {
    const n = seen + 1;
    setSeen(n);
    writeLocal(seenKey, n);
  };

  const teamLine = `${view.name}: ${view.members.map((x) => x.name).join(", ")}`;
  if (scene.done && !pending && view.end) return <EndScreen title={scene.title} end={view.end} xp={view.xp} onExit={onExit} teamLine={teamLine} />;

  const reveal: (WardReveal & { teamLine?: string }) | null = pending ? { ...pending, teamLine: `The team chose ${pending.letter}${pending.voters ? ` (${pending.voters} vote${pending.voters === 1 ? "" : "s"} in)` : ""}.` } : null;
  const nextAfter = seen + 1 < view.reveals.length ? "Next result" : scene.done ? "See the ending" : reveal && scene.chapter !== reveal.chapter ? "Next session" : "Next call";

  const need = Math.floor(Math.max(TEAM_LIMITS.ward.min, view.members.length) / 2) + 1;
  const waiting = view.myVote ? (
    <p className={cn("flex items-center gap-2 rounded-md border-2 border-dashed border-foreground/40 p-2 text-small", m.rise)} role="status">
      <Vote className="size-4" aria-hidden />
      Vote in. {view.votes} of {view.members.length} voted; {need} matching votes move the story on. Come back any time.
    </p>
  ) : (
    <p className="text-caption text-muted-foreground">Your own vote is graded for you. The team&apos;s choice decides the story.</p>
  );

  return (
    <Stage
      scene={scene}
      reveal={reveal}
      onPick={async (choice) => {
        if (busy || view.myVote) return;
        setBusy(true);
        buzz(true);
        const v = await actions.castWardVote({ teamId, step: scene.step, choice }).catch(() => null);
        setBusy(false);
        if (v) apply(v);
      }}
      onNext={markSeen}
      nextLabel={nextAfter}
      onExit={onExit}
      team={{
        myVote: view.myVote,
        waiting,
        header: (
          <div className="space-y-2">
            <TeamCode code={view.code} name={view.name} message={`Join my Ward Week team on VIBHA (${scene.title}).`} />
            <Members members={view.members.map((x) => ({ name: x.name, me: x.me, done: x.voted, doneWord: "Voted", waitWord: "Not yet" }))} max={TEAM_LIMITS.ward.max} />
          </div>
        ),
      }}
    />
  );
}
