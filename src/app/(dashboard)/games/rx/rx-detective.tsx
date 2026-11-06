"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Flame, FlaskConical, Heart, HeartCrack, Pill as PillIcon, Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DOSE_NOTE, hashString, makeRng, pct } from "@/lib/games-sims/common";
import { drugById, effectById, MYSTERIES, outcomeById, PUZZLES, type Drug } from "@/lib/games-sims/rx/content";
import { buildRun, costsLife, grade, LIVES, nextStreak, pointsFor, rxXp, STEPS, type Answer, type Mode, type Question } from "@/lib/games-sims/rx/game";
import { AccuracyBoard, type AccuracyBoardData } from "@/lib/games-sims/ui/board";
import { Btn, buzz, Eyebrow, Kbd, motionCss as m, Panel, Pill, Stat, toneFor, useHotkeys, verdictWord } from "@/lib/games-sims/ui/kit";
import { Journey, Receptor } from "@/components/study/animations";

type Grade = (a: Answer) => Promise<{ ok: boolean }>;
type Finish = (x: { run: string; answers: Answer[] }) => Promise<{ ok: boolean; xp: number }>;

const LETTERS = ["a", "b", "c", "d"];
const MODES: { id: Mode; label: string; line: string; Icon: typeof PillIcon }[] = [
  { id: "mixed", label: "Mixed", line: "All three, interleaved.", Icon: Search },
  { id: "chain", label: "Drug chains", line: "Class, how it works, side effect, checks.", Icon: PillIcon },
  { id: "mystery", label: "Side-effect mysteries", line: "Which receptor explains it?", Icon: FlaskConical },
  { id: "puzzle", label: "Dangerous mixes", line: "Two medicines together. What happens?", Icon: Plus },
];

type Run = { run: string; mode: Mode; qs: Question[]; idx: number; answers: Answer[]; picks: string[]; revealed: boolean; lives: number; streak: number; best: number; points: number; gained: number; lostLife: boolean };

export function RxDetective({ board, grade: gradeOnServer, finish }: { board: AccuracyBoardData; grade: Grade; finish: Finish }) {
  const router = useRouter();
  const [run, setRun] = React.useState<Run | null>(null);
  const [done, setDone] = React.useState<{ run: Run; xp: number | null } | null>(null);

  function start(mode: Mode) {
    const id = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
    setDone(null);
    setRun({ run: id, mode, qs: buildRun(mode, makeRng(hashString(id))), idx: 0, answers: [], picks: [], revealed: false, lives: LIVES, streak: 0, best: 0, points: 0, gained: 0, lostLife: false });
  }
  function end(r: Run) {
    setRun(null);
    setDone({ run: r, xp: null });
    void finish({ run: r.run, answers: r.answers })
      .then((x) => setDone({ run: r, xp: x.ok ? x.xp : 0 }))
      .catch(() => setDone({ run: r, xp: 0 }))
      .finally(() => router.refresh());
  }

  if (done) return <Summary r={done.run} xp={done.xp} board={board} onAgain={() => start(done.run.mode)} onModes={() => setDone(null)} />;
  if (!run) return <Intro board={board} onStart={start} />;
  return <Round r={run} setR={setRun} onAnswered={(a) => void gradeOnServer(a).catch(() => undefined)} onEnd={end} />;
}

function Intro({ board, onStart }: { board: AccuracyBoardData; onStart: (m: Mode) => void }) {
  useHotkeys({ "1": () => onStart("mixed"), "2": () => onStart("chain"), "3": () => onStart("mystery"), "4": () => onStart("puzzle") });
  return (
    <div className={cn("mx-auto max-w-2xl space-y-6 px-4 py-6", m.rise)}>
      <div className="space-y-2">
        <Eyebrow index="01">Rx Detective</Eyebrow>
        <h1 className="text-h1">Follow the medicine</h1>
        <ul className="space-y-1 text-body">
          <li>Twelve cases. Three lives. A case under half right costs a life.</li>
          <li>Every answer opens the why, with the receptor or the body route animated.</li>
          <li>Doses shown are for learning only.</li>
        </ul>
      </div>
      <div className={cn("grid gap-3 sm:grid-cols-2", m.stagger)}>
        {MODES.map((x, i) => (
          <Btn key={x.id} variant={i === 0 ? "primary" : "outline"} size="lg" className={cn("h-auto flex-col items-start py-3 text-left", m.rise)} style={{ "--i": i } as React.CSSProperties} onClick={() => onStart(x.id)}>
            <span className="flex items-center gap-2 text-body-strong">
              <x.Icon aria-hidden /> {x.label}
              <Kbd>{i + 1}</Kbd>
            </span>
            <span className="text-small font-normal">{x.line}</span>
          </Btn>
        ))}
      </div>
      <AccuracyBoard data={board} unit="answers" />
    </div>
  );
}

/* ----------------------------------------------------------------- round */
function Round({ r, setR, onAnswered, onEnd }: { r: Run; setR: (r: Run) => void; onAnswered: (a: Answer) => void; onEnd: (r: Run) => void }) {
  const q = r.qs[r.idx];
  const needed = q.kind === "chain" ? STEPS.length : 1;
  const complete = r.picks.length >= needed;

  function pick(value: string) {
    if (r.revealed || complete) return;
    const picks = [...r.picks, value];
    if (picks.length < needed) {
      const d = drugById(q.id)!;
      buzz(value === d[STEPS[picks.length - 1].key]);
      setR({ ...r, picks });
      return;
    }
    const a: Answer = { kind: q.kind, id: q.id, picks };
    const g = grade(a)!;
    buzz(g.score >= 1);
    onAnswered(a);
    const lost = costsLife(g.score);
    const gained = pointsFor(g.score, r.streak);
    const streak = nextStreak(r.streak, g.score);
    setR({ ...r, picks, revealed: true, answers: [...r.answers, a], lives: r.lives - (lost ? 1 : 0), streak, best: Math.max(r.best, streak), points: r.points + gained, gained, lostLife: lost });
  }
  function next() {
    if (!r.revealed) return;
    if (r.lives <= 0 || r.idx + 1 >= r.qs.length) {
      onEnd(r);
      return;
    }
    setR({ ...r, idx: r.idx + 1, picks: [], revealed: false, lostLife: false });
  }

  const options = q.kind === "chain" ? (q.steps[Math.min(r.picks.length, STEPS.length - 1)] ?? []) : q.options;
  const keys: Record<string, () => void> = {};
  if (!r.revealed) options.forEach((o, i) => (keys[LETTERS[i]] = () => pick(o)));
  else {
    keys.Enter = next;
    keys[" "] = next;
  }
  useHotkeys(keys);

  const g = r.revealed ? grade(r.answers[r.answers.length - 1])! : null;
  const last = r.lives <= 0 || r.idx + 1 >= r.qs.length;

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold">
          Case {r.idx + 1}/{r.qs.length}
        </span>
        <Lives n={r.lives} lost={r.lostLife} />
        <span className="ml-auto flex gap-2">
          <Stat
            label="Streak"
            value={
              <span key={r.streak} className={cn("inline-flex items-center gap-1", r.streak > 0 && r.revealed && m.bump)}>
                <Flame className="size-4" aria-hidden />
                {r.streak}
              </span>
            }
          />
          <Stat label="Points" value={r.points} />
        </span>
      </div>

      <div key={`${r.run}-${r.idx}`} className={m.slide}>
        {q.kind === "chain" ? <ChainCase q={q} picks={r.picks} revealed={r.revealed} onPick={pick} /> : null}
        {q.kind === "mystery" ? <MysteryCase id={q.id} options={q.options} pickVal={r.picks[0] ?? null} revealed={r.revealed} onPick={pick} /> : null}
        {q.kind === "puzzle" ? <PuzzleCase id={q.id} options={q.options} pickVal={r.picks[0] ?? null} revealed={r.revealed} onPick={pick} /> : null}
      </div>

      {g ? (
        <Panel className={cn("space-y-3", g.score >= 1 ? m.pop : m.shake)} aria-live="polite">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={toneFor(g.score)}>{verdictWord(g.score)}</Pill>
            <span className="font-pix">+{r.gained}</span>
            {r.lostLife ? (
              <span className="inline-flex items-center gap-1 text-small font-semibold">
                <HeartCrack className="size-4" aria-hidden /> Life lost
              </span>
            ) : null}
          </div>
          <RevealBody q={q} />
          <Btn variant="primary" size="lg" className="w-full" onClick={next} autoFocus>
            {last ? "See results" : "Next case"} <ArrowRight aria-hidden /> <Kbd>Enter</Kbd>
          </Btn>
        </Panel>
      ) : null}
    </div>
  );
}

function Lives({ n, lost }: { n: number; lost: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5 rounded-md border-2 border-foreground bg-card px-2 py-0.5", lost && m.shake)} aria-label={`Lives: ${n} of ${LIVES}`} key={n}>
      {Array.from({ length: LIVES }, (_, i) => (i < n ? <Heart key={i} className="size-4 fill-current" aria-hidden /> : <HeartCrack key={i} className="size-4 opacity-40" aria-hidden />))}
      <span className="ml-1 text-caption font-semibold tabular-nums">{n}</span>
    </span>
  );
}

function Options({ options, label, chosen, correct, revealed, onPick }: { options: string[]; label: (v: string) => string; chosen: string | null; correct: string; revealed: boolean; onPick: (v: string) => void }) {
  return (
    <div className="grid gap-2">
      {options.map((o, i) => {
        const isRight = revealed && o === correct;
        const isWrong = revealed && o === chosen && o !== correct;
        return (
          <Btn
            key={o}
            disabled={revealed}
            onClick={() => onPick(o)}
            className={cn("h-auto justify-start py-2.5 text-left font-normal disabled:opacity-100", isRight && "bg-status-success-bg text-status-success-fg", isWrong && "bg-status-alert-bg text-status-alert-fg", revealed && !isRight && !isWrong && "opacity-60")}
          >
            <span className="font-mono text-caption font-semibold uppercase opacity-70" aria-hidden>
              {LETTERS[i]}
            </span>
            <span className="min-w-0 flex-1">{label(o)}</span>
            {isRight ? (
              <span className="inline-flex items-center gap-0.5 text-caption font-semibold">
                <Check className="size-4" aria-hidden /> Right
              </span>
            ) : null}
            {isWrong ? (
              <span className="inline-flex items-center gap-0.5 text-caption font-semibold">
                <X className="size-4" aria-hidden /> Your pick
              </span>
            ) : null}
          </Btn>
        );
      })}
    </div>
  );
}

function DrugCard({ d, className, style }: { d: Drug; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn("rounded-xl border-2 border-foreground bg-card p-3 hard-shadow-sm", className)} style={style}>
      <p className="flex items-center gap-1.5 text-h3">
        <PillIcon className="size-5" aria-hidden /> {d.name}
      </p>
      <p className="text-caption text-muted-foreground">Sold in India as {d.brands.join(", ")}</p>
    </div>
  );
}

/* ----------------------------------------------------------------- chain */
function ChainCase({ q, picks, revealed, onPick }: { q: Extract<Question, { kind: "chain" }>; picks: string[]; revealed: boolean; onPick: (v: string) => void }) {
  const d = drugById(q.id)!;
  const at = Math.min(picks.length, STEPS.length - 1);
  return (
    <div className="space-y-3">
      <DrugCard d={d} />
      <ol className="grid grid-cols-4 gap-1.5" aria-label="Steps">
        {STEPS.map((s, i) => {
          const p = picks[i];
          const ok = p !== undefined && p === d[s.key];
          return (
            <li key={s.key} className={cn("rounded-md border-2 px-1.5 py-1 text-center text-caption font-semibold", p === undefined ? (i === picks.length && !revealed ? "border-foreground bg-primary text-primary-foreground" : "border-foreground/30 bg-card") : ok ? "border-foreground bg-status-success-bg text-status-success-fg" : "border-foreground bg-status-alert-bg text-status-alert-fg", p !== undefined && m.flip)}>
              <span className="flex items-center justify-center gap-0.5">
                {p !== undefined ? ok ? <Check className="size-3.5" aria-hidden /> : <X className="size-3.5" aria-hidden /> : null}
                {s.label}
              </span>
              <span className="sr-only">{p === undefined ? "to do" : ok ? "right" : "not right"}</span>
            </li>
          );
        })}
      </ol>
      {picks.length > 0 && !revealed ? (
        <ul className="space-y-1">
          {picks.map((p, i) => {
            const ok = p === d[STEPS[i].key];
            return (
              <li key={i} className={cn("rounded-md border-2 border-foreground/20 bg-card p-2 text-small", m.rise)}>
                <span className="font-semibold">{STEPS[i].label}: </span>
                {ok ? (
                  p
                ) : (
                  <>
                    <span className="line-through">{p}</span> <span className="font-semibold">It is: {d[STEPS[i].key]}</span>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}
      {!revealed ? (
        <Panel key={at} className={cn("space-y-3 bg-muted/40", m.rise)}>
          <p className="text-body-strong">{STEPS[at].ask}</p>
          <Options options={q.steps[at]} label={(v) => v} chosen={null} correct="" revealed={false} onPick={onPick} />
        </Panel>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------------- mystery */
function MysteryCase({ id, options, pickVal, revealed, onPick }: { id: string; options: string[]; pickVal: string | null; revealed: boolean; onPick: (v: string) => void }) {
  const mys = MYSTERIES.find((x) => x.id === id)!;
  const d = drugById(mys.drug)!;
  return (
    <div className="space-y-3">
      <Panel className="space-y-2">
        <p className="flex items-center gap-1.5 text-caption font-semibold uppercase">
          <FlaskConical className="size-3.5" aria-hidden /> Side-effect mystery
        </p>
        <p className="text-body-strong">{mys.who}</p>
        <p className="text-body">{mys.story}</p>
        <ul className={cn("flex flex-wrap gap-1.5", m.stagger)} aria-label="Clues">
          {mys.clues.map((c, i) => (
            <li key={c} className={cn("rounded-full border-2 border-foreground bg-status-pending-bg px-2.5 py-0.5 text-caption font-semibold text-status-pending-fg", m.pop)} style={{ "--i": i } as React.CSSProperties}>
              {c}
            </li>
          ))}
        </ul>
        <p className="text-caption text-muted-foreground">
          On {d.name} ({d.brands[0]}).
        </p>
      </Panel>
      <Panel className="space-y-3 bg-muted/40">
        <p className="text-body-strong">Which action explains it?</p>
        <Options options={options} label={(v) => effectById(v)?.label ?? v} chosen={pickVal} correct={mys.answer} revealed={revealed} onPick={onPick} />
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------- puzzle */
function PuzzleCase({ id, options, pickVal, revealed, onPick }: { id: string; options: string[]; pickVal: string | null; revealed: boolean; onPick: (v: string) => void }) {
  const p = PUZZLES.find((x) => x.id === id)!;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <MixCard name={p.a} className={m.playUp} />
        <span className={cn("grid size-11 place-items-center rounded-full border-2 border-foreground bg-primary text-primary-foreground", m.stamp)} aria-label="taken with">
          <Plus className="size-5" aria-hidden />
        </span>
        <MixCard name={p.b} className={m.playDown} />
      </div>
      <Panel className="space-y-1">
        <p className="text-caption font-semibold uppercase">Dangerous mix?</p>
        <p className="text-body">{p.story}</p>
      </Panel>
      <Panel className="space-y-3 bg-muted/40">
        <p className="text-body-strong">What is happening?</p>
        <Options options={options} label={(v) => outcomeById(v)?.label ?? v} chosen={pickVal} correct={p.answer} revealed={revealed} onPick={onPick} />
      </Panel>
    </div>
  );
}

function MixCard({ name, className }: { name: string; className?: string }) {
  const d = drugByName(name);
  return (
    <div className={cn("min-w-0 rounded-xl border-2 border-foreground bg-card p-3 text-center hard-shadow-sm", className)}>
      <p className="truncate text-body-strong">{name}</p>
      {d ? <p className="truncate text-caption text-muted-foreground">{d.brands.join(", ")}</p> : null}
    </div>
  );
}

const drugByName = (name: string) => {
  const n = name.toLowerCase();
  return drugById(n) ?? drugById(n.replace("sodium ", ""));
};

/* ---------------------------------------------------------------- reveal */
function RevealBody({ q }: { q: Question }) {
  if (q.kind === "chain") {
    const d = drugById(q.id)!;
    return (
      <div className="space-y-3">
        <dl className="grid gap-1.5 text-small">
          {STEPS.map((s) => (
            <div key={s.key} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-2">
              <dt className="font-semibold">{s.label}</dt>
              <dd>{d[s.key]}</dd>
            </div>
          ))}
        </dl>
        <DoseBox d={d} />
        <Receptor d={{ receptor: d.target.receptor, title: `${d.name} at ${d.target.receptor}`, caption: d.target.line }} />
      </div>
    );
  }
  if (q.kind === "mystery") {
    const mys = MYSTERIES.find((x) => x.id === q.id)!;
    const e = effectById(mys.answer)!;
    const d = drugById(mys.drug)!;
    const verb = e.action === "partial" ? "Partial agonist" : e.action === "full" ? "Full agonist" : "Antagonist";
    return (
      <div className="space-y-3">
        <p className="text-body-strong">{e.label}</p>
        <p className="text-body">{mys.why}</p>
        <Receptor d={{ receptor: e.receptor, title: `${d.name}: what happens at ${e.receptor}`, caption: `Tap ${verb} to see what ${d.name.toLowerCase()} does to the signal here.` }} />
      </div>
    );
  }
  const p = PUZZLES.find((x) => x.id === q.id)!;
  return (
    <div className="space-y-3">
      <p className="text-body-strong">{outcomeById(p.answer)!.label}</p>
      <p className="text-body">{p.why}</p>
      {p.journey ? <Journey d={{ ...p.journey, routes: ["oral"] }} /> : null}
      {p.receptor ? <Receptor d={{ receptor: p.receptor.receptor, caption: p.receptor.caption }} /> : null}
      {p.answer === "qt" ? <QtStrip /> : null}
    </div>
  );
}

function DoseBox({ d }: { d: Drug }) {
  return (
    <div className="rounded-md border-2 border-dashed border-foreground/50 bg-card p-3">
      <p className="text-caption font-semibold uppercase">Learning dose only</p>
      <p className="text-body-strong">{d.dose}</p>
      <p className="text-caption text-muted-foreground">Typical adult range. {DOSE_NOTE}</p>
    </div>
  );
}

/** A heartbeat trace: normal, then a stretched QT. The stretch grows in (transform only). */
function QtStrip() {
  const beat = "M0 40 L10 40 L14 36 L18 40 L22 40 L24 46 L27 8 L30 52 L33 40 L40 40 Q48 28 56 40 L70 40";
  return (
    <figure className="rounded-xl border-2 border-foreground bg-card p-3">
      <p className="text-caption font-semibold uppercase text-link">The QT interval, stretched</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {[
          { label: "Normal QT", scale: 1 },
          { label: "Long QT: two medicines add up", scale: 1.45 },
        ].map((x) => (
          <div key={x.label}>
            <svg viewBox="0 0 110 60" className="w-full rounded-md border-2 border-foreground bg-background" role="img" aria-label={x.label}>
              <g className={x.scale > 1 ? m.grow : undefined} style={{ transform: `scaleX(${x.scale * 0.95})`, transformOrigin: "22px 0", transformBox: "view-box" }}>
                <path d={beat} fill="none" className="stroke-foreground" strokeWidth="2" />
              </g>
              <line x1="22" x2={22 + 34 * x.scale * 0.95} y1="56" y2="56" className="stroke-[var(--destructive)]" strokeWidth="2.5" />
            </svg>
            <p className="mt-1 text-caption">{x.label}</p>
          </div>
        ))}
      </div>
      <figcaption className="mt-2 text-small text-muted-foreground">The red line runs from the start of the heart&apos;s contraction (Q) to the end of its recovery (T). When it stretches, the heart can fall into a dangerous rhythm.</figcaption>
    </figure>
  );
}

/* --------------------------------------------------------------- summary */
function Summary({ r, xp, board, onAgain, onModes }: { r: Run; xp: number | null; board: AccuracyBoardData; onAgain: () => void; onModes: () => void }) {
  useHotkeys({ Enter: onAgain });
  const scores = r.answers.map((a) => grade(a)?.score ?? 0);
  const acc = scores.length ? scores.reduce((a, s) => a + s, 0) / scores.length : 0;
  return (
    <div className={cn("mx-auto max-w-2xl space-y-5 px-4 py-6", m.rise)}>
      <Eyebrow index="02">{r.lives > 0 ? "Run complete" : "Out of lives"}</Eyebrow>
      <h1 className="text-h1">{acc >= 0.85 ? "Sharp detective." : acc >= 0.6 ? "Good work." : "The receptors will click with practice."}</h1>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Accuracy" value={`${pct(acc)}%`} />
        <Stat label="Points" value={r.points} />
        <Stat label="Best streak" value={r.best} />
        <Stat label="XP earned" value={xp === null ? "…" : `+${xp || 0}`} />
      </div>
      {xp === 0 ? <p className="text-caption text-muted-foreground">XP couldn&apos;t be saved this time (it would have been {rxXp(scores)}).</p> : null}
      <ol className={cn("space-y-1", m.stagger)}>
        {r.answers.map((a, i) => (
          <li key={i} className={cn("flex items-center justify-between gap-2 rounded-md border-2 border-foreground/20 px-3 py-2", m.rise)} style={{ "--i": i } as React.CSSProperties}>
            <span className="min-w-0 truncate">{titleOf(a)}</span>
            <Pill tone={toneFor(scores[i])}>{pct(scores[i])}%</Pill>
          </li>
        ))}
      </ol>
      <div className="grid gap-2 sm:grid-cols-2">
        <Btn variant="primary" size="lg" onClick={onAgain}>
          Play again <Kbd>Enter</Kbd>
        </Btn>
        <Btn size="lg" onClick={onModes}>
          Change mode
        </Btn>
      </div>
      <AccuracyBoard data={board} unit="answers" />
    </div>
  );
}

function titleOf(a: Answer): string {
  if (a.kind === "chain") return `Chain: ${drugById(a.id)?.name ?? a.id}`;
  if (a.kind === "mystery") {
    const x = MYSTERIES.find((y) => y.id === a.id);
    return `Mystery: ${x ? drugById(x.drug)?.name : a.id}`;
  }
  const p = PUZZLES.find((y) => y.id === a.id);
  return p ? `Mix: ${p.a} + ${p.b}` : a.id;
}
