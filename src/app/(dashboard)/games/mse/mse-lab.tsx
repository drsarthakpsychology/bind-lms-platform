"use client";
import { RecycleNote } from "@/components/cases/case-mark";

import * as React from "react";
import { startHowTo } from "@/components/help/how-to";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, Flame, ScanEye, Undo2 } from "lucide-react";
import type { LearnState } from "@/lib/learn/engine";
import { cn } from "@/lib/utils";
import { LearnLink } from "@/lib/games/ui/learn-link";
import { pct } from "@/lib/games-sims/common";
import { nextStreak, pointsFor, segments, type FindingReveal, type Level, type PublicExcerpt, type Tag } from "@/lib/games-sims/mse/rules";
import { DOMAINS, TERMS, domainLabel, type Domain } from "@/lib/games-sims/mse/terms";
import { AccuracyBoard, type AccuracyBoardData } from "@/lib/games-sims/ui/board";
import { Btn, buzz, Kbd, motionCss as m, Panel, Pill, readLocal, Stat, toneFor, useGameXp, useHotkeys, verdictWord, writeLocal } from "@/lib/games-sims/ui/kit";
import { HintBar, useHintStatus } from "@/components/hints/hint-chip";
import { askHint } from "@/lib/hints/actions";
import { hintedPoints, POINTS_KEPT } from "@/lib/hints/rules";
import { useReaction } from "@/components/reactions/use-reaction";
import { EndReaction } from "@/components/reactions/graphics";

const LEVELS: { id: Level; label: string; line: string }[] = [
  { id: 1, label: "Starting", line: "Clear findings, one per part." },
  { id: 2, label: "Beginner", line: "Look-alikes: tangential or circumstantial?" },
  { id: 3, label: "Advanced", line: "Pseudo vs true, overvalued vs delusion." },
];
const LETTERS = ["a", "b", "c", "d", "e"];
const BEST_KEY = "vibha-mse-best-streak";
const FAIL = "That didn't load. Try again.";

type Play = {
  /** The signed round from the server: the browser never holds a finding's answer before it is tagged. */
  token: string;
  seed: string;
  level: Level;
  /** Excerpts done this round: who, and the score. */
  seen: { who: string; score: number }[];
  excerpt: PublicExcerpt;
  /** After an excerpt's last finding: the next excerpt (null: the round is over). */
  next: PublicExcerpt | null | undefined;
  idx: number;
  tags: Tag[];
  results: FindingReveal[];
  pick: Domain | null;
  revealed: boolean;
  streak: number;
  best: number;
  points: number;
  scores: number[];
  tagsDone: number;
  tagsScore: number;
  gained: number;
  /** Hints in this excerpt: finding index → words ruled out. */
  ruled: Record<number, string[]>;
};

import type { MseDeal, MseTag } from "./actions";

type Actions = {
  deal: (level: Level) => Promise<MseDeal>;
  tag: (x: { token: string; domain: string; term: string }) => Promise<MseTag>;
};

export function MseLab({ serverState, save, board, actions }: { serverState: LearnState | null; save: (s: LearnState) => Promise<unknown>; board: AccuracyBoardData; actions: Actions }) {
  const { award } = useGameXp(serverState, save);
  const router = useRouter();
  const [play, setPlay] = React.useState<Play | null>(null);
  const [done, setDone] = React.useState<Play | null>(null);
  const [bestEver, setBestEver] = React.useState<number | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function start(level: Level) {
    if (busy) return;
    startHowTo("mse-lab");
    setBusy(true);
    setError(null);
    // The server deals the round in answer history order (an excerpt not seen yet first, then a missed one).
    const d = await actions.deal(level).catch(() => null);
    setBusy(false);
    if (!d || !d.ok) {
      setDone(null);
      setError(d && !d.ok ? d.error : FAIL);
      return;
    }
    setBestEver(readLocal(BEST_KEY, 0));
    setDone(null);
    setPlay({ token: d.token, seed: d.run, level: d.excerpt.level, seen: [], excerpt: d.excerpt, next: undefined, idx: 0, tags: [], results: [], pick: null, revealed: false, streak: 0, best: 0, points: 0, scores: [], tagsDone: 0, tagsScore: 0, gained: 0, ruled: {} });
  }

  if (done) return <Summary p={done} bestEver={bestEver ?? 0} board={board} onAgain={() => void start(done.level)} />;
  if (!play) return <Intro board={board} busy={busy} error={error} onStart={(l) => void start(l)} />;
  return (
    <Round
      play={play}
      setPlay={setPlay}
      tagOnServer={actions.tag}
      onFinish={(p) => {
        const xp = Math.round(p.tagsScore * 5) + 10;
        award(xp);
        const prev = readLocal(BEST_KEY, 0);
        if (p.best > prev) writeLocal(BEST_KEY, p.best);
        setBestEver(Math.max(prev, p.best));
        setDone(p);
        setPlay(null);
        router.refresh();
      }}
    />
  );
}

function Intro({ board, busy, error, onStart }: { board: AccuracyBoardData; busy: boolean; error: string | null; onStart: (l: Level) => void }) {
  useHotkeys({ "1": () => onStart(1), "2": () => onStart(2), "3": () => onStart(3) });
  return (
    <div className={cn("mx-auto max-w-2xl space-y-6", m.rise)}>
      <h1 className="text-h2">Pick a level</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        {LEVELS.map((l) => (
          <Btn key={l.id} variant={l.id === 1 ? "primary" : "outline"} size="lg" disabled={busy} className="h-auto flex-col items-start py-3 text-left" onClick={() => onStart(l.id)}>
            <span className="text-body-strong">
              {l.label}
              <Kbd>{l.id}</Kbd>
            </span>
            <span className="text-small font-normal">{l.line}</span>
          </Btn>
        ))}
      </div>
      {error ? (
        <p className="text-small font-semibold" role="status">
          {error}
        </p>
      ) : null}
      <AccuracyBoard data={board} />
    </div>
  );
}

function Round({ play, setPlay, tagOnServer, onFinish }: { play: Play; setPlay: React.Dispatch<React.SetStateAction<Play | null>>; tagOnServer: Actions["tag"]; onFinish: (p: Play) => void }) {
  const e = play.excerpt;
  const quote = e.quotes[play.idx];
  const allOptions = e.options[play.idx] ?? [];
  const gone = play.ruled[play.idx] ?? [];
  const options = allOptions.filter((t) => !gone.includes(t));
  const hinted = gone.length > 0;
  const [hints, setHints] = useHintStatus();
  const reaction = useReaction();
  const [busy, setBusy] = React.useState(false);
  const [lost, setLost] = React.useState<string | null>(null);
  const result = play.revealed ? play.results[play.idx] : null;
  const tag = play.tags[play.idx];
  const lastFinding = play.idx === e.quotes.length - 1;
  const lastExcerpt = lastFinding && play.next === null;

  function pickDomain(d: Domain) {
    if (play.revealed) return;
    setPlay({ ...play, pick: d });
  }
  // One tag in flight at a time, so a double tap counts once.
  const inflight = React.useRef(false);
  async function pickTerm(t: string) {
    if (play.revealed || !play.pick || inflight.current) return;
    inflight.current = true;
    setBusy(true);
    const tg = { domain: play.pick, term: t };
    const res = await tagOnServer({ token: play.token, domain: tg.domain, term: t }).catch(() => null);
    inflight.current = false;
    setBusy(false);
    // No connection is not a wrong answer: nothing counted, try again.
    setLost(!res ? "Connection lost. Your answer was not sent. Try again." : res.ok ? null : res.error);
    if (!res || !res.ok) return;
    const r = res.reveal;
    buzz(r.score >= 1);
    reaction.onAnswer(r.score >= 1, { partial: (r.score > 0 && r.score < 1) || (r.score >= 1 && hinted) });
    const streak = nextStreak(play.streak, r);
    const tags = [...play.tags];
    tags[play.idx] = tg;
    const results = [...play.results];
    results[play.idx] = r;
    // A hint halves this finding's points (and its XP share).
    const gained = hintedPoints(pointsFor(r.score, play.streak), hinted ? 1 : 0);
    const counted = hinted ? r.score * POINTS_KEPT[1] : r.score;
    setPlay((p) => p && { ...p, token: res.token, next: res.next, tags, results, revealed: true, streak, gained, best: Math.max(p.best, streak), points: p.points + gained, tagsDone: p.tagsDone + 1, tagsScore: p.tagsScore + counted });
  }
  function next() {
    if (!play.revealed) return;
    if (!lastFinding) {
      setPlay({ ...play, idx: play.idx + 1, pick: null, revealed: false });
      return;
    }
    const score = play.results.reduce((a, r) => a + r.score, 0) / e.quotes.length;
    const scores = [...play.scores, score];
    const done = { ...play, scores, seen: [...play.seen, { who: e.who, score }] };
    if (!play.next) {
      onFinish(done);
      return;
    }
    setPlay({ ...done, level: play.next.level, excerpt: play.next, next: undefined, idx: 0, tags: [], results: [], pick: null, revealed: false, ruled: {} });
  }

  const keys: Record<string, () => void> = {};
  if (!play.revealed) {
    DOMAINS.forEach((d, i) => (keys[String(i + 1)] = () => pickDomain(d.id)));
    if (play.pick) options.forEach((t, i) => (keys[LETTERS[i]] = () => void pickTerm(t)));
    keys.Backspace = () => setPlay({ ...play, pick: null });
  } else {
    keys.Enter = next;
    keys[" "] = next;
  }
  useHotkeys(keys);

  const quotes = e.quotes;
  const levelLabel = LEVELS.find((l) => l.id === play.level)!.label;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 font-semibold">
          <ScanEye className="size-5" aria-hidden /> Excerpt {play.seen.length + 1}
        </span>
        <Pill tone="info">{levelLabel}</Pill>
        <span className="ml-auto flex gap-2">
          <Stat label="Streak" value={<span className={cn("inline-flex items-center gap-1", play.streak > 0 && result?.score === 1 && m.bump)} key={play.streak}><Flame className="size-4" aria-hidden />{play.streak}</span>} />
          <Stat label="Points" value={play.points} />
        </span>
      </div>

      {e.again && play.idx === 0 && !play.revealed ? <RecycleNote /> : null}
      <Panel className={cn("space-y-3", m.rise)} key={play.seen.length}>
        <div>
          <p className="text-body-strong">{e.who}</p>
          <p className="text-caption text-muted-foreground">{e.place}</p>
        </div>
        <dl className="space-y-2">
          {e.lines.map(([who, text], i) => (
            <div key={i} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
              <dt className="text-caption font-semibold text-muted-foreground uppercase">{who === "D" ? "Doctor" : who === "P" ? "Patient" : "Seen"}</dt>
              <dd className={cn("text-body", who === "R" && "italic")}>
                <Marked text={text} quotes={quotes} play={play} />
              </dd>
            </div>
          ))}
        </dl>
        <div className="rounded-md border-2 border-dashed border-foreground/40 p-3">
          <p className="mb-1 flex items-center gap-1.5 text-caption font-semibold uppercase">
            <Eye className="size-3.5" aria-hidden /> Observation note
          </p>
          <p className="text-body">
            <Marked text={e.note} quotes={quotes} play={play} />
          </p>
        </div>
      </Panel>

      <Panel className="space-y-3 bg-muted/40" aria-live="polite">
        <p className="text-caption font-semibold uppercase">
          Finding {play.idx + 1}
        </p>
        <p className="border-l-4 border-primary pl-3 text-body-strong">“{quote}”</p>

        {!play.revealed && !play.pick ? (
          <fieldset>
            <legend className="mb-2 text-small font-semibold">Which part of the MSE?</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {DOMAINS.map((d, i) => (
                <Btn key={d.id} className="justify-start text-left text-small" onClick={() => pickDomain(d.id)}>
                  <span className="font-mono text-caption opacity-70" aria-hidden>
                    {i + 1}
                  </span>
                  {d.label}
                </Btn>
              ))}
            </div>
          </fieldset>
        ) : null}

        {!play.revealed && play.pick ? (
          <fieldset className={m.rise}>
            <legend className="mb-2 flex w-full flex-wrap items-center gap-2 text-small font-semibold">
              <span>Part: {domainLabel(play.pick)}.</span> <span>Now the exact word.</span>
            </legend>
            <HintBar
              className="mb-2"
              status={hints}
              onStatus={setHints}
              used={hinted}
              ask={() => askHint({ game: "mse", run: play.seed, token: play.token, options: allOptions })}
              onGive={(h) => setPlay((p) => p && { ...p, ruled: { ...p.ruled, [p.idx]: h.remove } })}
            />
            <div className="grid gap-2 sm:grid-cols-2">
              {options.map((t, i) => (
                <Btn key={t} disabled={busy} className="justify-start text-left" onClick={() => void pickTerm(t)}>
                  <span className="font-mono text-caption uppercase opacity-70" aria-hidden>
                    {LETTERS[i]}
                  </span>
                  {label(t)}
                </Btn>
              ))}
            </div>
            <div className="mt-2">
              <Btn variant="ghost" onClick={() => setPlay({ ...play, pick: null })}>
                <Undo2 aria-hidden /> Change part
              </Btn>
            </div>
          </fieldset>
        ) : null}

        {lost ? (
          <p className="text-small font-semibold" role="status">
            {lost}
          </p>
        ) : null}

        {result && tag ? (
          <div className={cn("space-y-2", result.score >= 1 ? m.pop : m.shake)}>
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone={toneFor(result.score)}>{verdictWord(result.score)}</Pill>
              <span className="font-pix">+{play.gained}</span>
            </div>
            <ul className="space-y-1 text-small">
              <li>
                <Pill tone={result.domainOk ? "good" : "bad"} className="mr-1">
                  Part
                </Pill>
                {result.domainOk ? domainLabel(tag.domain!) : `You picked ${domainLabel(tag.domain!)}. It belongs under ${domainLabel(result.answerDomain)}.`}
              </li>
              <li>
                <Pill tone={result.termOk ? "good" : result.close ? "part" : "bad"} className="mr-1">
                  Word
                </Pill>
                {result.termOk ? label(result.answer) : `${result.close ? "Close. " : ""}The word is ${label(result.answer)}.`}
              </li>
            </ul>
            <p className="text-body">{result.why}</p>
            {result.whyNot ? <p className="rounded-md border-2 border-foreground/20 bg-card p-2 text-small">{result.whyNot}</p> : null}
            <LearnLink topic={label(result.answer)} href="/study/mse-deep" newTab />
            <Btn variant="primary" size="lg" className="w-full" onClick={next} autoFocus>
              {!lastFinding ? "Next finding" : lastExcerpt ? "See results" : "Next excerpt"} <ArrowRight aria-hidden />
              <Kbd>Enter</Kbd>
            </Btn>
          </div>
        ) : null}
      </Panel>
    </div>
  );
}

const label = (id: string) => (TERMS as Record<string, { label: string }>)[id]?.label ?? id;

function Marked({ text, quotes, play }: { text: string; quotes: string[]; play: Play }) {
  return (
    <>
      {segments(text, quotes).map((s, i) => {
        if (s.idx === null) return <React.Fragment key={i}>{s.text}</React.Fragment>;
        const active = s.idx === play.idx;
        const r = play.results[s.idx];
        const doneHere = s.idx < play.idx || (active && play.revealed);
        return (
          <mark
            key={i}
            className={cn(
              "rounded-sm px-0.5 text-foreground [box-decoration-break:clone]",
              active ? "bg-primary text-primary-foreground ring-2 ring-foreground" : doneHere ? "bg-muted underline decoration-2 underline-offset-4" : "bg-transparent underline decoration-dotted decoration-2 underline-offset-4",
            )}
          >
            <sup className="mr-0.5 font-mono text-caption">{s.idx + 1}</sup>
            {s.text}
            {doneHere && r ? <span className="sr-only"> ({verdictWord(r.score)})</span> : null}
          </mark>
        );
      })}
    </>
  );
}

function Summary({ p, bestEver, board, onAgain }: { p: Play; bestEver: number; board: AccuracyBoardData; onAgain: () => void }) {
  useHotkeys({ Enter: onAgain });
  const acc = p.tagsDone ? p.tagsScore / p.tagsDone : 0;
  const xp = Math.round(p.tagsScore * 5) + 10;
  return (
    <div className={cn("mx-auto max-w-2xl space-y-5", m.rise)}>
      <h1 className="text-h1">{acc >= 0.85 ? "Sharp eye." : acc >= 0.6 ? "Good tagging." : "Keep practising the look-alikes."}</h1>
      <EndReaction right={Math.round(acc * 100)} total={100} seed={p.seed} />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Accuracy" value={`${pct(acc)}%`} />
        <Stat label="Points" value={p.points} />
        <Stat label="Best streak" value={p.best} />
        <Stat label="XP earned" value={`+${xp}`} />
      </div>
      {p.best >= bestEver && p.best > 0 ? <p className={cn("inline-block rounded-md border-2 border-foreground bg-primary px-3 py-1 font-semibold text-primary-foreground", m.stamp)}>New best streak: {p.best}</p> : <p className="text-small">Your best streak: {bestEver}</p>}
      <ol className="space-y-1">
        {p.seen.map((x, i) => {
          const s = x.score;
          return (
            <li key={i} className="flex items-center justify-between gap-2 rounded-md border-2 border-foreground/20 px-3 py-2">
              <span className="min-w-0 truncate">{x.who}</span>
              <Pill tone={toneFor(s)}>{pct(s)}%</Pill>
            </li>
          );
        })}
      </ol>
      <Btn variant="primary" size="lg" className="w-full" onClick={onAgain}>
        Play again <Kbd>Enter</Kbd>
      </Btn>
      <AccuracyBoard data={board} />
    </div>
  );
}
