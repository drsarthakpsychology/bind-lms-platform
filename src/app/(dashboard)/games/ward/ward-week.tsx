"use client";

import * as React from "react";
import { startHowTo } from "@/components/help/how-to";
import { ArrowDown, ArrowRight, ArrowUp, BookOpen, Hospital, MapPin, Minus, Play, RotateCcw, Users, Vote } from "lucide-react";
import { cn } from "@/lib/utils";
import { LearnLink } from "@/lib/games/ui/learn-link";
import { hashString } from "@/lib/games-sims/common";
import { CAMPAIGNS, campaignById } from "@/lib/games-sims/ward/campaigns";
import {
  bestOption,
  choose,
  currentDecision,
  deltaSign,
  endingFor,
  findDecision,
  holds,
  KIND_LABEL,
  LOWER_IS_BETTER,
  outcomeScore,
  QUALITY_LABEL,
  replay,
  VAR_LABEL,
  type Campaign,
  type Decision,
  type Quality,
  type VarKey,
  type Vars,
  type WardOption,
  type WardState,
} from "@/lib/games-sims/ward/engine";
import { TEAM_LIMITS } from "@/lib/games-sims/teams";
import { Btn, buzz, Kbd, motionCss as m, Panel, Pill, readLocal, Stat, useHotkeys, writeLocal, type Tone } from "@/lib/games-sims/ui/kit";
import { ThumbBar } from "@/components/mobile/thumb-bar";
import { JoinBox, Members, TeamCode, usePoll } from "@/lib/games-sims/ui/team";
import type { WardTeamView } from "./actions";
import { creditServerPlay } from "@/lib/learn/credit-play";
import { HintBar, useHintStatus } from "@/components/hints/hint-chip";
import { askHint } from "@/lib/hints/actions";
import { useReaction } from "@/components/reactions/use-reaction";
import { EndReaction } from "@/components/reactions/graphics";

type Actions = {
  finishWardSolo: (x: { campaign: string; choices: string[]; run: string }) => Promise<{ ok: boolean; score: number; xp: number }>;
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

type Solo = { campaign: string; choices: string[]; run: string };
type Mode = { kind: "pick" } | { kind: "solo"; solo: Solo } | { kind: "team"; teamId: string };

/* ------------------------------------------------------------------ root */
export function WardWeek({ teamsOn, openTeam, teams, actions }: { teamsOn: boolean; openTeam: string | null; teams: TeamListItem[]; actions: Actions }) {
  const [mode, setMode] = React.useState<Mode>(openTeam ? { kind: "team", teamId: openTeam } : { kind: "pick" });

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

  if (mode.kind === "solo") return <SoloPlay solo={mode.solo} finish={actions.finishWardSolo} onExit={goPick} onAgain={(c) => setMode({ kind: "solo", solo: newSolo(c) })} />;
  if (mode.kind === "team") return <TeamPlay teamId={mode.teamId} actions={actions} onExit={goPick} />;
  return (
    <Pick
      teamsOn={teamsOn}
      teams={teams}
      onSolo={(c) => {
        startHowTo("ward-week");
        setMode({ kind: "solo", solo: newSolo(c) });
      }}
      onResume={(s) => {
        startHowTo("ward-week");
        setMode({ kind: "solo", solo: s });
      }}
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
    />
  );
}

function newSolo(campaign: string): Solo {
  const run = `${Date.now().toString(36)}${hashString(`${campaign}:${Date.now()}:${Math.random()}`).toString(36)}`;
  const s = { campaign, choices: [], run };
  writeLocal(SOLO_KEY, s);
  return s;
}

/** A solo campaign left half-way (read from this browser without an effect). */
function useSavedSolo(): Solo | null {
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
      const s = JSON.parse(raw) as Solo;
      const c = campaignById(s.campaign);
      if (!c || !Array.isArray(s.choices) || !s.choices.length) return null;
      return replay(c, s.choices).done ? null : s;
    } catch {
      return null;
    }
  }, [raw]);
}

/* ------------------------------------------------------------------ pick */
function Pick({
  teamsOn,
  teams,
  onSolo,
  onResume,
  onCreate,
  onJoin,
  onOpenTeam,
}: {
  teamsOn: boolean;
  teams: TeamListItem[];
  onSolo: (c: string) => void;
  onResume: (s: Solo) => void;
  onCreate: (c: string) => Promise<string | null>;
  onJoin: (code: string) => Promise<string | null>;
  onOpenTeam: (id: string) => void;
}) {
  const saved = useSavedSolo();
  const [err, setErr] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);
  useHotkeys(Object.fromEntries(CAMPAIGNS.slice(0, 9).map((c, k) => [String(k + 1), () => onSolo(c.id)])));
  const live = teams.filter((t) => t.status !== "done");
  return (
    <div className={cn("mx-auto max-w-3xl space-y-6", m.rise)}>
      <h1 className="text-h3">Pick a patient</h1>

      {saved ? (
        <Panel className="flex flex-wrap items-center gap-3 bg-status-info-bg">
          <BookOpen className="size-5" aria-hidden />
          <p className="min-w-0 flex-1 text-body">
            You left <span className="font-semibold">{campaignById(saved.campaign)!.title}</span> half-way.
          </p>
          <Btn variant="ink" onClick={() => onResume(saved)}>
            <Play aria-hidden /> Carry on
          </Btn>
        </Panel>
      ) : null}

      <ul className={cn("grid gap-4 md:grid-cols-3", m.stagger)}>
        {CAMPAIGNS.map((c, i) => (
          <li key={c.id} className={cn("flex flex-col rounded-xl border-2 border-foreground bg-card p-4 hard-shadow-sm", m.rise)} style={{ "--i": i } as React.CSSProperties}>
            <p className="flex items-center gap-1.5 text-caption text-muted-foreground">
              <MapPin className="size-3.5" aria-hidden />
              {c.place}
            </p>
            <h2 className="mt-1 text-h3">{c.title}</h2>
            <p className="text-small font-semibold">{c.patient}</p>
            <p className="mt-2 flex-1 text-small">{c.blurb}</p>
            <div className="mt-3 grid gap-2">
              <Btn variant="primary" onClick={() => onSolo(c.id)}>
                <Play aria-hidden /> Play solo {i < 9 ? <Kbd>{i + 1}</Kbd> : null}
              </Btn>
              {teamsOn ? (
                <Btn
                  disabled={busy !== null}
                  onClick={async () => {
                    setBusy(c.id);
                    setErr(null);
                    const e = await onCreate(c.id).catch(() => "Couldn't start a team. Try again.");
                    setBusy(null);
                    if (e) setErr(e);
                  }}
                >
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
                        {t.name} · {campaignById(t.campaign)?.title ?? t.campaign}
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
type Reveal = { decision: Decision; option: WardOption; before: Vars; flagsBefore: string[]; after: Vars; chapterBefore: number };

function SoloPlay({ solo, finish, onExit, onAgain }: { solo: Solo; finish: Actions["finishWardSolo"]; onExit: () => void; onAgain: (c: string) => void }) {
  const c = campaignById(solo.campaign)!;
  const [choices, setChoices] = React.useState<string[]>(solo.choices);
  const [reveal, setReveal] = React.useState<Reveal | null>(null);
  const [result, setResult] = React.useState<{ xp: number; saved: boolean } | null>(null);
  const st = React.useMemo(() => replay(c, choices), [c, choices]);
  const [hints, setHints] = useHintStatus();
  /** Hints used: decision id → options ruled out. */
  const [ruled, setRuled] = React.useState<Record<string, string[]>>({});
  const reaction = useReaction();
  const current = reveal ? null : currentDecision(c, st);

  function pick(optionId: string) {
    if (reveal) return;
    const d = currentDecision(c, st);
    const o = d?.options.find((x) => x.id === optionId);
    if (!d || !o) return;
    const next = choose(c, st, optionId);
    buzz(o.q === "best");
    // "Okay" is a near miss; poor and harmful choices are wrong.
    reaction.onAnswer(o.q === "best", { partial: o.q === "ok" || (o.q === "best" && (ruled[d.id] ?? []).length > 0) });
    const list = [...choices, optionId];
    setChoices(list);
    setReveal({ decision: d, option: o, before: st.vars, flagsBefore: st.flags, after: next.vars, chapterBefore: st.chapter });
    writeLocal(SOLO_KEY, { ...solo, choices: list });
    if (next.done) {
      writeLocal(SOLO_KEY, null);
      void finish({ campaign: c.id, choices: list, run: solo.run })
        .then((r) => {
          setResult({ xp: r.ok ? r.xp : 0, saved: r.ok });
          if (r.ok) creditServerPlay(r.xp);
        })
        .catch(() => setResult({ xp: 0, saved: false }));
    }
  }

  const showEnd = st.done && !reveal;
  if (showEnd) return <EndScreen c={c} st={st} xp={result ? result.xp : null} onAgain={() => onAgain(c.id)} onExit={onExit} />;

  const shownChapter = reveal ? reveal.chapterBefore : st.chapter;
  return (
    <Stage
      c={c}
      st={st}
      shownChapter={shownChapter}
      reveal={reveal}
      onPick={pick}
      onNext={() => setReveal(null)}
      nextLabel={st.done ? "See the ending" : st.chapter !== shownChapter ? "Next session" : "Next call"}
      onExit={onExit}
      hint={
        current
          ? {
              gone: ruled[current.id] ?? [],
              bar: (
                <HintBar
                  status={hints}
                  onStatus={setHints}
                  used={(ruled[current.id] ?? []).length > 0}
                  ask={() => askHint({ game: "ward", run: solo.run, campaign: c.id, decision: current.id, options: current.options.map((o) => o.id) })}
                  onGive={(h) => setRuled((r) => ({ ...r, [current.id]: h.remove }))}
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
  c,
  st,
  shownChapter,
  reveal,
  onPick,
  onNext,
  nextLabel,
  onExit,
  team,
  hint,
}: {
  c: Campaign;
  st: WardState;
  shownChapter: number;
  reveal: (Reveal & { teamLine?: string }) | null;
  onPick: (id: string) => void;
  onNext: () => void;
  nextLabel: string;
  onExit: () => void;
  team?: { myVote: string | null; waiting: React.ReactNode; header: React.ReactNode };
  /** Solo only: options a hint ruled out, and the hint chip and button. */
  hint?: { gone: string[]; bar: React.ReactNode };
}) {
  const d = reveal ? null : currentDecision(c, st);
  const shown = d ? d.options.filter((o) => !(hint?.gone ?? []).includes(o.id)) : [];
  const ch = c.chapters[shownChapter];
  const beatState = reveal ? { vars: reveal.before, flags: reveal.flagsBefore } : st;
  const beats = ch.beats.filter((b) => holds(b.when, beatState)).map((b) => b.text);
  const dials = reveal ? reveal.after : st.vars;
  const voted = team?.myVote ?? null;

  const keys: Record<string, () => void> = {};
  if (d && !voted) shown.forEach((o, i) => (keys[LETTERS[i]] = () => onPick(o.id)));
  if (reveal) {
    keys.Enter = onNext;
    keys[" "] = onNext;
  }
  useHotkeys(keys);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 font-semibold">
          <Hospital className="size-5" aria-hidden /> {c.title}
        </span>
        <span className="text-small text-muted-foreground">{c.patient}</span>
        <Btn variant="ghost" className="ml-auto" onClick={onExit}>
          Leave
        </Btn>
      </div>
      {team?.header}
      <ChapterTrack c={c} at={shownChapter} done={st.done && !reveal} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0 space-y-4">
          <Panel key={ch.id} className={cn("space-y-3", m.slide)}>
            <h2 className="text-h3">{ch.title}</h2>
            <div className={cn("space-y-2", m.stagger)}>
              {beats.map((b, i) => (
                <p key={i} className={cn("text-body", m.rise)} style={{ "--i": i } as React.CSSProperties}>
                  {b}
                </p>
              ))}
            </div>
          </Panel>

          {d ? (
            <Panel key={d.id} className={cn("space-y-3 bg-muted/40", m.rise)} aria-live="polite">
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
                        disabled={!!voted}
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
              {hint?.bar}
              {team?.waiting}
            </Panel>
          ) : null}

          {reveal ? <RevealCard r={reveal} onNext={onNext} nextLabel={nextLabel} /> : null}
        </div>
        <Dials vars={dials} before={reveal?.before ?? null} />
      </div>
      {c.note ? <p className="text-caption text-muted-foreground">{c.note}</p> : null}
    </div>
  );
}

function ChapterTrack({ c, at, done }: { c: Campaign; at: number; done: boolean }) {
  return (
    <ol className="flex gap-1.5" aria-label="Sessions">
      {c.chapters.map((ch, i) => {
        const past = done || i < at;
        const now = !done && i === at;
        return (
          <li key={ch.id} className="min-w-0 flex-1">
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

function RevealCard({ r, onNext, nextLabel }: { r: Reveal & { teamLine?: string }; onNext: () => void; nextLabel: string }) {
  const best = bestOption(r.decision);
  const good = r.option.q === "best";
  return (
    <Panel className={cn("space-y-3", good ? m.pop : m.shake)} aria-live="polite">
      {r.teamLine ? <p className="text-small font-semibold">{r.teamLine}</p> : null}
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone={Q_TONE[r.option.q]}>{QUALITY_LABEL[r.option.q]}</Pill>
        <span className="text-caption text-muted-foreground">{KIND_LABEL[r.decision.kind]}</span>
      </div>
      <p className="border-l-4 border-primary pl-3 text-body-strong">{r.option.text}</p>
      <p className="text-body">{r.option.why}</p>
      {r.decision.skill ? <LearnLink topic={KIND_LABEL[r.decision.kind]} href={`/study/${r.decision.skill.split(":")[0]}`} newTab /> : null}
      {!good ? (
        <div className={cn("rounded-lg border-2 border-foreground/30 bg-card p-3", m.rise)}>
          <p className="text-caption font-semibold uppercase">The strongest call</p>
          <p className="mt-1 text-small font-semibold">{best.text}</p>
          <p className="mt-1 text-small">{best.why}</p>
        </div>
      ) : null}
      {/* Phones: Next sits low, in thumb reach. */}
      <ThumbBar label="Next step">
        <Btn variant="primary" size="lg" className="w-full" onClick={onNext} autoFocus>
          {nextLabel} <ArrowRight aria-hidden /> <Kbd>Enter</Kbd>
        </Btn>
      </ThumbBar>
    </Panel>
  );
}

/* ------------------------------------------------------------------- end */
function EndScreen({ c, st, xp, onAgain, onExit, teamLine }: { c: Campaign; st: WardState; xp: number | null; onAgain?: () => void; onExit: () => void; teamLine?: string }) {
  const score = outcomeScore(st);
  const ending = endingFor(c, st);
  const tone: Tone = score >= 72 ? "good" : score >= 50 ? "part" : "bad";
  const strong = st.log.filter((l) => l.q === "best").length;
  useHotkeys(onAgain ? { Enter: onAgain } : {});
  return (
    <div className={cn("mx-auto max-w-3xl space-y-5", m.rise)}>
      <div className="flex flex-wrap items-end gap-3">
        <h1 className="text-h1">{ending.title}</h1>
        <Pill tone={tone} className={m.stamp}>
          {tone === "good" ? "Good outcome" : tone === "part" ? "Mixed outcome" : "Poor outcome"}
        </Pill>
      </div>
      {teamLine ? <p className="text-small font-semibold">{teamLine}</p> : null}
      <EndReaction mood={tone === "good" ? (score >= 90 ? "streak" : "right") : tone === "part" ? "near" : "wrong"} seed={c.id} />
      <p className="text-body">{ending.text}</p>

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
        <Stat label="Strong calls" value={`${strong}/${st.log.length}`} />
        <Stat label="Risk at the end" value={st.vars.risk} />
        <Stat label="Trust at the end" value={st.vars.trust} />
        <Stat label="XP earned" value={xp === null ? "…" : `+${xp}`} />
      </div>

      <section className="space-y-2">
        <h2 className="text-body-strong">Your calls, looking back</h2>
        <ol className={cn("space-y-2", m.stagger)}>
          {st.log.map((l, i) => {
            const f = findDecision(c, l.decision);
            const o = f?.decision.options.find((x) => x.id === l.option);
            if (!f || !o) return null;
            const best = bestOption(f.decision);
            return (
              <li key={i} className={cn("rounded-lg border-2 border-foreground/25 bg-card p-3", m.rise)} style={{ "--i": i } as React.CSSProperties}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-caption">S{f.chapter + 1}</span>
                  <span className="text-caption text-muted-foreground">{KIND_LABEL[f.decision.kind]}</span>
                  <Pill tone={Q_TONE[l.q]} className="ml-auto">
                    {QUALITY_LABEL[l.q]}
                  </Pill>
                </div>
                <p className="mt-1 text-small font-semibold">{f.decision.prompt}</p>
                <p className="text-small">{o.text}</p>
                {l.q !== "best" ? <p className="mt-1 text-small text-muted-foreground">Stronger: {best.text}</p> : null}
              </li>
            );
          })}
        </ol>
      </section>

      <div className="grid gap-2 sm:grid-cols-2">
        {onAgain ? (
          <Btn variant="primary" size="lg" onClick={onAgain}>
            <RotateCcw aria-hidden /> Play again <Kbd>Enter</Kbd>
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
    setSeen((s) => (s === null ? Math.min(readLocal(seenKey, v.state.log.length), v.state.log.length) : s));
  }
  usePoll(!view?.state.done, 4000, () => actions.wardTeamView(teamId), apply);

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

  const c = campaignById(view.campaign);
  if (!c) return null;
  const st = view.state;
  const pending = seen < st.log.length ? st.log[seen] : null;
  const markSeen = () => {
    const n = seen + 1;
    setSeen(n);
    writeLocal(seenKey, n);
  };

  const teamLine = `${view.name}: ${view.members.map((x) => x.name).join(", ")}`;
  if (st.done && !pending) return <EndScreen c={c} st={st} xp={view.xp} onExit={onExit} teamLine={teamLine} />;

  let reveal: (Reveal & { teamLine?: string }) | null = null;
  if (pending) {
    const before = replay(
      c,
      st.log.slice(0, seen).map((l) => l.option),
    );
    const after = choose(c, before, pending.option);
    const f = findDecision(c, pending.decision)!;
    reveal = {
      decision: f.decision,
      option: f.decision.options.find((o) => o.id === pending.option)!,
      before: before.vars,
      flagsBefore: before.flags,
      after: after.vars,
      chapterBefore: before.chapter,
      teamLine: `The team chose ${LETTERS[f.decision.options.findIndex((o) => o.id === pending.option)].toUpperCase()}${pending.voters ? ` (${pending.voters} vote${pending.voters === 1 ? "" : "s"} in)` : ""}.`,
    };
  }
  const shownState = pending ? replay(c, st.log.slice(0, seen + 1).map((l) => l.option)) : st;
  const nextAfter = seen + 1 < st.log.length ? "Next result" : shownState.done ? "See the ending" : reveal && shownState.chapter !== reveal.chapterBefore ? "Next session" : "Next call";

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
      c={c}
      st={shownState}
      shownChapter={reveal ? reveal.chapterBefore : st.chapter}
      reveal={reveal}
      onPick={async (choice) => {
        if (busy || view.myVote) return;
        setBusy(true);
        buzz(true);
        const v = await actions.castWardVote({ teamId, step: st.log.length, choice }).catch(() => null);
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
            <TeamCode code={view.code} name={view.name} message={`Join my Ward Week team on VIBHA (${c.title}).`} />
            <Members members={view.members.map((x) => ({ name: x.name, me: x.me, done: x.voted, doneWord: "Voted", waitWord: "Not yet" }))} max={TEAM_LIMITS.ward.max} />
          </div>
        ),
      }}
    />
  );
}
