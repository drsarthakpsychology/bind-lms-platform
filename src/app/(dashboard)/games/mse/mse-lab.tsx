"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, Flame, ScanEye, Undo2 } from "lucide-react";
import type { LearnState } from "@/lib/learn/engine";
import { cn } from "@/lib/utils";
import { LearnLink } from "@/lib/games/ui/learn-link";
import { hashString, makeRng, pct } from "@/lib/games-sims/common";
import { excerptById, type Excerpt } from "@/lib/games-sims/mse/excerpts";
import { gradeTag, nextLevel, nextStreak, optionsFor, pickExcerpt, pointsFor, ROUND_SIZE, segments, whyNot, type Level, type Tag, type TagResult } from "@/lib/games-sims/mse/grade";
import { DOMAINS, TERMS, domainLabel, termById, type Domain } from "@/lib/games-sims/mse/terms";
import { AccuracyBoard, type AccuracyBoardData } from "@/lib/games-sims/ui/board";
import { Btn, buzz, Kbd, motionCss as m, Panel, Pill, readLocal, Stat, toneFor, useGameXp, useHotkeys, verdictWord, writeLocal } from "@/lib/games-sims/ui/kit";

const LEVELS: { id: Level; label: string; line: string }[] = [
  { id: 1, label: "Starting", line: "Clear findings, one per part." },
  { id: 2, label: "Beginner", line: "Look-alikes: tangential or circumstantial?" },
  { id: 3, label: "Advanced", line: "Pseudo vs true, overvalued vs delusion." },
];
const LETTERS = ["a", "b", "c", "d", "e"];
const BEST_KEY = "vibha-mse-best-streak";

type Play = {
  seed: string;
  level: Level;
  seen: string[];
  excerpt: string;
  idx: number;
  tags: Tag[];
  results: TagResult[];
  pick: Domain | null;
  revealed: boolean;
  streak: number;
  best: number;
  points: number;
  scores: number[];
  tagsDone: number;
  tagsScore: number;
  gained: number;
};

type Submit = (x: { id: string; tags: Tag[]; streak: number; level: number }) => Promise<{ ok: boolean }>;

export function MseLab({ serverState, save, board, submit }: { serverState: LearnState | null; save: (s: LearnState) => Promise<unknown>; board: AccuracyBoardData; submit: Submit }) {
  const { award } = useGameXp(serverState, save);
  const router = useRouter();
  const [play, setPlay] = React.useState<Play | null>(null);
  const [done, setDone] = React.useState<Play | null>(null);
  const [bestEver, setBestEver] = React.useState<number | null>(null);

  function start(level: Level) {
    const seed = `${Date.now()}`;
    const rng = makeRng(hashString(seed));
    const e = pickExcerpt(level, new Set(), rng)!;
    setBestEver(readLocal(BEST_KEY, 0));
    setDone(null);
    setPlay({ seed, level, seen: [e.id], excerpt: e.id, idx: 0, tags: [], results: [], pick: null, revealed: false, streak: 0, best: 0, points: 0, scores: [], tagsDone: 0, tagsScore: 0, gained: 0 });
  }

  if (done) return <Summary p={done} bestEver={bestEver ?? 0} board={board} onAgain={() => start(done.level)} />;
  if (!play) return <Intro board={board} onStart={start} />;
  return (
    <Round
      play={play}
      setPlay={setPlay}
      onExcerptDone={(p, e) => {
        void submit({ id: e.id, tags: p.tags, streak: p.best, level: p.level }).catch(() => undefined);
      }}
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

function Intro({ board, onStart }: { board: AccuracyBoardData; onStart: (l: Level) => void }) {
  useHotkeys({ "1": () => onStart(1), "2": () => onStart(2), "3": () => onStart(3) });
  return (
    <div className={cn("mx-auto max-w-2xl space-y-6 px-4 py-6", m.rise)}>
      <h1 className="text-h2">Pick a level</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        {LEVELS.map((l) => (
          <Btn key={l.id} variant={l.id === 1 ? "primary" : "outline"} size="lg" className="h-auto flex-col items-start py-3 text-left" onClick={() => onStart(l.id)}>
            <span className="text-body-strong">
              {l.label}
              <Kbd>{l.id}</Kbd>
            </span>
            <span className="text-small font-normal">{l.line}</span>
          </Btn>
        ))}
      </div>
      <AccuracyBoard data={board} />
    </div>
  );
}

function Round({ play, setPlay, onExcerptDone, onFinish }: { play: Play; setPlay: (p: Play) => void; onExcerptDone: (p: Play, e: Excerpt) => void; onFinish: (p: Play) => void }) {
  const e = excerptById(play.excerpt)!;
  const f = e.findings[play.idx];
  const options = React.useMemo(() => optionsFor(f, makeRng(hashString(`${play.seed}:${e.id}:${play.idx}`))), [f, play.seed, e.id, play.idx]);
  const result = play.revealed ? play.results[play.idx] : null;
  const tag = play.tags[play.idx];
  const lastFinding = play.idx === e.findings.length - 1;
  const lastExcerpt = play.seen.length >= ROUND_SIZE;

  function pickDomain(d: Domain) {
    if (play.revealed) return;
    setPlay({ ...play, pick: d });
  }
  function pickTerm(t: string) {
    if (play.revealed || !play.pick) return;
    const tg = { domain: play.pick, term: t };
    const r = gradeTag(f, tg);
    buzz(r.score >= 1);
    const streak = nextStreak(play.streak, r);
    const tags = [...play.tags];
    tags[play.idx] = tg;
    const results = [...play.results];
    results[play.idx] = r;
    const gained = pointsFor(r.score, play.streak);
    setPlay({ ...play, tags, results, revealed: true, streak, gained, best: Math.max(play.best, streak), points: play.points + gained, tagsDone: play.tagsDone + 1, tagsScore: play.tagsScore + r.score });
  }
  function next() {
    if (!play.revealed) return;
    if (!lastFinding) {
      setPlay({ ...play, idx: play.idx + 1, pick: null, revealed: false });
      return;
    }
    const score = play.results.reduce((a, r) => a + r.score, 0) / e.findings.length;
    const scores = [...play.scores, score];
    const done = { ...play, scores };
    onExcerptDone(done, e);
    if (lastExcerpt) {
      onFinish(done);
      return;
    }
    const level = nextLevel(play.level, scores);
    const rng = makeRng(hashString(`${play.seed}:${play.seen.length}`));
    const nx = pickExcerpt(level, new Set(play.seen), rng);
    if (!nx) {
      onFinish(done);
      return;
    }
    setPlay({ ...done, level, seen: [...play.seen, nx.id], excerpt: nx.id, idx: 0, tags: [], results: [], pick: null, revealed: false });
  }

  const keys: Record<string, () => void> = {};
  if (!play.revealed) {
    DOMAINS.forEach((d, i) => (keys[String(i + 1)] = () => pickDomain(d.id)));
    if (play.pick) options.forEach((t, i) => (keys[LETTERS[i]] = () => pickTerm(t)));
    keys.Backspace = () => setPlay({ ...play, pick: null });
  } else {
    keys.Enter = next;
    keys[" "] = next;
  }
  useHotkeys(keys);

  const quotes = e.findings.map((x) => x.q);
  const levelLabel = LEVELS.find((l) => l.id === play.level)!.label;

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 font-semibold">
          <ScanEye className="size-5" aria-hidden /> Excerpt {play.seen.length}/{ROUND_SIZE}
        </span>
        <Pill tone="info">{levelLabel}</Pill>
        <span className="ml-auto flex gap-2">
          <Stat label="Streak" value={<span className={cn("inline-flex items-center gap-1", play.streak > 0 && result?.score === 1 && m.bump)} key={play.streak}><Flame className="size-4" aria-hidden />{play.streak}</span>} />
          <Stat label="Points" value={play.points} />
        </span>
      </div>

      <Panel className={cn("space-y-3", m.rise)} key={e.id}>
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
          Finding {play.idx + 1} of {e.findings.length}
        </p>
        <p className="border-l-4 border-primary pl-3 text-body-strong">“{f.q}”</p>

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
            <div className="grid gap-2 sm:grid-cols-2">
              {options.map((t, i) => (
                <Btn key={t} className="justify-start text-left" onClick={() => pickTerm(t)}>
                  <span className="font-mono text-caption uppercase opacity-70" aria-hidden>
                    {LETTERS[i]}
                  </span>
                  {TERMS[t as keyof typeof TERMS].label}
                </Btn>
              ))}
            </div>
            <Btn variant="ghost" className="mt-2" onClick={() => setPlay({ ...play, pick: null })}>
              <Undo2 aria-hidden /> Change part
            </Btn>
          </fieldset>
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
                {result.domainOk ? domainLabel(tag.domain!) : `You picked ${domainLabel(tag.domain!)}. It belongs under ${domainLabel(TERMS[f.a].domain)}.`}
              </li>
              <li>
                <Pill tone={result.termOk ? "good" : result.close ? "part" : "bad"} className="mr-1">
                  Word
                </Pill>
                {result.termOk ? TERMS[f.a].label : `${result.close ? "Close. " : ""}The word is ${TERMS[f.a].label}.`}
              </li>
            </ul>
            <p className="text-body">{f.why}</p>
            {!result.termOk && tag.term && termById(tag.term) ? <p className="rounded-md border-2 border-foreground/20 bg-card p-2 text-small">{whyNot(tag.term, f)}</p> : null}
            <LearnLink topic={TERMS[f.a].label} href="/study/mse-deep" newTab />
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
    <div className={cn("mx-auto max-w-2xl space-y-5 px-4 py-6", m.rise)}>
      <h1 className="text-h1">{acc >= 0.85 ? "Sharp eye." : acc >= 0.6 ? "Good tagging." : "Keep practising the look-alikes."}</h1>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Accuracy" value={`${pct(acc)}%`} />
        <Stat label="Points" value={p.points} />
        <Stat label="Best streak" value={p.best} />
        <Stat label="XP earned" value={`+${xp}`} />
      </div>
      {p.best >= bestEver && p.best > 0 ? <p className={cn("inline-block rounded-md border-2 border-foreground bg-primary px-3 py-1 font-semibold text-primary-foreground", m.stamp)}>New best streak: {p.best}</p> : <p className="text-small">Your best streak: {bestEver}</p>}
      <ol className="space-y-1">
        {p.seen.map((id, i) => {
          const e = excerptById(id)!;
          const s = p.scores[i] ?? 0;
          return (
            <li key={id} className="flex items-center justify-between gap-2 rounded-md border-2 border-foreground/20 px-3 py-2">
              <span className="min-w-0 truncate">{e.who}</span>
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
