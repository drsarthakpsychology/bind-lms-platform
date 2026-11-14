"use client";

import * as React from "react";
import { startHowTo } from "@/components/help/how-to";
import { useRouter } from "next/navigation";
import { Ban, Bot, Check, FlaskConical, Layers, RefreshCw, Shield, ShieldOff, Stethoscope, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LearnLink } from "@/lib/games/ui/learn-link";
import { CLEAR, dxById, ruleById, symptomById } from "@/lib/games-sims/comorbid/cards";
import { DIAGNOSES } from "@/lib/games-sims/comorbid/cards";
import { noteAnswer, orderFor, useHistoryPrefetch } from "@/lib/history/client";
import { apply, botMove, newGame, progress, runBots, type Card, type Event, type Game, type Level, type Move, type Seat, type Setup } from "@/lib/games-sims/comorbid/game";
import { AccuracyBoard, type AccuracyBoardData } from "@/lib/games-sims/ui/board";
import { Btn, buzz, ChoiceCard, Kbd, PickHeading, motionCss as m, Panel, Pill, Stat, useHotkeys } from "@/lib/games-sims/ui/kit";
import { creditServerPlay } from "@/lib/learn/credit-play";
import { HintBar, useHintStatus } from "@/components/hints/hint-chip";
import { askHint } from "@/lib/hints/actions";
import { useReaction } from "@/components/reactions/use-reaction";
import { EndReaction } from "@/components/reactions/graphics";

type Finish = (x: { seed: string; mode: Setup["mode"]; level: Level; moves: Move[]; prefer?: string }) => Promise<{ ok: boolean; xp: number }>;

const LEVELS: { id: Level; label: string; line: string }[] = [
  { id: 1, label: "Intern", line: "Often plays the wrong card." },
  { id: 2, label: "Registrar", line: "Sometimes slips." },
  { id: 3, label: "Consultant", line: "Never wastes a card." },
];
const BOT_MS = 900;

type Play = { setup: Setup; game: Game; moves: Move[]; handoff: boolean };

export function ComorbidGame({ board, finish }: { board: AccuracyBoardData; finish: Finish }) {
  const router = useRouter();
  const [play, setPlay] = React.useState<Play | null>(null);
  const [xp, setXp] = React.useState<number | null>(null);
  useHistoryPrefetch("comorbid");

  function start(mode: Setup["mode"], level: Level) {
    startHowTo("comorbid");
    const seed = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
    // Answer history: a diagnosis not played yet, then one lost, then the one won longest ago.
    const prefer = orderFor("comorbid", DIAGNOSES, (d) => d.id)[0]?.id;
    const setup: Setup = { seed, mode, level, names: mode === "bot" ? ["You", LEVELS[level - 1].label] : ["Player 1", "Player 2"], ...(prefer ? { prefer } : {}) };
    setXp(null);
    setPlay({ setup, game: runBots(newGame(setup)), moves: [], handoff: false });
  }

  if (!play) return <Intro board={board} onStart={start} />;
  return (
    <Table
      key={play.setup.seed}
      play={play}
      setPlay={setPlay}
      xp={xp}
      onDone={(p) => {
        // Browser copy of the answer history (the server records it too).
        noteAnswer("comorbid", p.game.seats[0].dx, p.game.winner === 0, { server: false });
        void finish({ seed: p.setup.seed, mode: p.setup.mode, level: p.setup.level, moves: p.moves, ...(p.setup.prefer ? { prefer: p.setup.prefer } : {}) })
          .then((r) => {
            setXp(r.ok ? r.xp : 0);
            if (r.ok) creditServerPlay(r.xp);
          })
          .catch(() => setXp(0))
          .finally(() => router.refresh());
      }}
      onAgain={() => start(play.setup.mode, play.setup.level)}
      onExit={() => setPlay(null)}
      board={board}
    />
  );
}

function Intro({ board, onStart }: { board: AccuracyBoardData; onStart: (mode: Setup["mode"], level: Level) => void }) {
  useHotkeys({ "1": () => onStart("bot", 1), "2": () => onStart("bot", 2), "3": () => onStart("bot", 3), p: () => onStart("pass", 2) });
  return (
    <div className={cn("mx-auto max-w-2xl space-y-6", m.rise)}>
      <section className="space-y-2">
        <PickHeading>Play the bot</PickHeading>
        <div className={cn("grid gap-3", m.stagger)}>
          {LEVELS.map((l, i) => (
            <ChoiceCard key={l.id} icon={Bot} title={l.label} line={l.line} hotkey={String(l.id)} suggested={l.id === 1} className={m.rise} style={{ "--i": i } as React.CSSProperties} onClick={() => onStart("bot", l.id)} />
          ))}
        </div>
      </section>
      <section className="space-y-2">
        <PickHeading>Or play a classmate</PickHeading>
        <ChoiceCard icon={Users} title="Pass and play" line="One phone, take turns." hotkey="P" onClick={() => onStart("pass", 2)} />
      </section>
      <AccuracyBoard data={board} unit="cards" />
    </div>
  );
}

/* ----------------------------------------------------------------- table */
function Table({ play, setPlay, xp, onDone, onAgain, onExit, board }: { play: Play; setPlay: (p: Play) => void; xp: number | null; onDone: (p: Play) => void; onAgain: () => void; onExit: () => void; board: AccuracyBoardData }) {
  const g = play.game;
  const pass = play.setup.mode === "pass";
  const me: 0 | 1 = pass ? g.turn : 0;
  const rival: 0 | 1 = me === 0 ? 1 : 0;
  const [sel, setSel] = React.useState<string | null>(null);
  const sent = React.useRef(false);
  const [hints, setHints] = useHintStatus();
  /** Hints are for you against the bot only: turn number → what the hint said. */
  const [hinted, setHinted] = React.useState<Record<number, string>>({});
  const reaction = useReaction();

  const botTurn = g.winner === null && !!g.seats[g.turn].bot;
  React.useEffect(() => {
    if (!botTurn) return;
    const t = setTimeout(() => {
      const mv = botMove(play.game);
      if (!mv) return;
      setPlay({ ...play, game: apply(play.game, mv) });
    }, BOT_MS);
    return () => clearTimeout(t);
  }, [botTurn, play, setPlay]);

  function commit(mv: Move) {
    if (g.winner !== null || botTurn || play.handoff) return;
    const next = apply(g, mv);
    if (next === g) return;
    const ev = next.log[next.log.length - 1];
    if (ev.action === "play") {
      buzz(ev.ok);
      reaction.onAnswer(ev.ok);
    }
    setSel(null);
    setPlay({ ...play, game: next, moves: [...play.moves, mv], handoff: pass && next.winner === null });
  }

  // Whoever made the last move (you or the bot), a finished game is sent once.
  React.useEffect(() => {
    if (play.game.winner !== null && !sent.current && play.moves.length) {
      sent.current = true;
      onDone(play);
    }
  }, [play, onDone]);

  const hand = g.seats[me].hand;
  const keys: Record<string, () => void> = {};
  if (!botTurn && g.winner === null && !play.handoff) {
    hand.forEach((c, i) => (keys[String(i + 1)] = () => setSel(c.uid)));
    if (sel) {
      keys.Enter = () => commit({ uid: sel, action: "play" });
      keys.s = () => commit({ uid: sel, action: "swap" });
    }
  }
  useHotkeys(keys);

  if (g.winner !== null) return <End play={play} xp={xp} onAgain={onAgain} onExit={onExit} board={board} />;

  const last = g.log[g.log.length - 1] ?? null;
  const selCard = hand.find((c) => c.uid === sel) ?? null;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 font-semibold">
          <Layers className="size-5" aria-hidden /> Comorbid
        </span>
        <Pill tone="info">{pass ? "Pass and play" : `vs ${g.seats[1].name}`}</Pill>
        <span className="text-caption text-muted-foreground">{g.deck.length} cards left</span>
        <Btn variant="ghost" className="ml-auto" onClick={onExit}>
          Leave
        </Btn>
      </div>

      <DxPanel seat={g.seats[rival]} label={pass ? g.seats[rival].name : `${g.seats[rival].name} (rival)`} rival />
      <div className="flex justify-center gap-1" aria-label={`${g.seats[rival].name} holds ${g.seats[rival].hand.length} cards`}>
        {g.seats[rival].hand.map((c) => (
          <span key={c.uid} className="h-10 w-7 rounded-md border-2 border-foreground bg-foreground/80 sm:h-12 sm:w-9" aria-hidden />
        ))}
      </div>

      <div className="grid min-h-28 place-items-center rounded-xl border-2 border-dashed border-foreground/40 p-3" aria-live="polite">
        {last ? <LastPlay key={g.log.length} ev={last} names={[g.seats[0].name, g.seats[1].name]} meSeat={me} /> : <p className="text-small text-muted-foreground">Play your first card.</p>}
      </div>

      <DxPanel seat={g.seats[me]} label={pass ? `${g.seats[me].name}, your diagnosis` : "Your diagnosis"} />

      {play.handoff ? (
        <Panel className={cn("space-y-3 text-center", m.pop)}>
          <p className="text-h3">Pass the phone to {g.seats[g.turn].name}</p>
          <p className="text-small text-muted-foreground">Their cards stay hidden until they tap.</p>
          <Btn variant="primary" size="lg" className="w-full" onClick={() => setPlay({ ...play, handoff: false })}>
            I&apos;m {g.seats[g.turn].name}: show my cards
          </Btn>
        </Panel>
      ) : (
        <section className="space-y-3" aria-label="Your hand">
          {botTurn ? (
            <p className="flex items-center gap-2 text-small font-semibold" role="status">
              <Bot className="size-4" aria-hidden /> {g.seats[g.turn].name} is thinking…
            </p>
          ) : (
            <p className="text-small font-semibold">Your turn.</p>
          )}
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {hand.map((c, i) => (
              <li key={c.uid}>
                <CardFace c={c} index={i} selected={sel === c.uid} disabled={botTurn} onTap={() => setSel(sel === c.uid ? null : c.uid)} />
              </li>
            ))}
          </ul>
          {!pass && !botTurn ? (
            <div>
              <HintBar
                status={hints}
                onStatus={setHints}
                used={hinted[g.moves] !== undefined}
                ask={() => askHint({ game: "comorbid", run: play.setup.seed, level: play.setup.level, moves: play.moves, ...(play.setup.prefer ? { prefer: play.setup.prefer } : {}) })}
                onGive={(h) => {
                  setHinted((x) => ({ ...x, [g.moves]: h.text }));
                  if (h.pick) setSel(h.pick);
                }}
              />
            </div>
          ) : null}
          <div className="grid gap-2 sm:grid-cols-2">
            <Btn variant="primary" size="lg" disabled={!selCard || botTurn} onClick={() => selCard && commit({ uid: selCard.uid, action: "play" })}>
              {selCard ? playLabel(selCard, g.seats[rival]) : "Pick a card to play"} <Kbd>Enter</Kbd>
            </Btn>
            <Btn size="lg" disabled={!selCard || botTurn} onClick={() => selCard && commit({ uid: selCard.uid, action: "swap" })}>
              <RefreshCw aria-hidden /> Swap it for a new card <Kbd>S</Kbd>
            </Btn>
          </div>
        </section>
      )}
    </div>
  );
}

function playLabel(c: Card, rival: Seat): string {
  if (c.kind === "sym") return "Add to my diagnosis";
  if (c.kind === "rule") return `Rule out their ${dxById(rival.dx)!.short}`;
  return "Clear my block";
}

const KIND: Record<Card["kind"], { word: string; Icon: typeof Check; cls: string }> = {
  sym: { word: "Symptom", Icon: Stethoscope, cls: "bg-card" },
  rule: { word: "Rule-out", Icon: Ban, cls: "bg-status-alert-bg text-status-alert-fg" },
  clear: { word: "Clear", Icon: FlaskConical, cls: "bg-status-success-bg text-status-success-fg" },
};

function cardText(c: Card): { title: string; line: string } {
  if (c.kind === "sym") {
    const s = symptomById(c.id)!;
    return { title: s.label, line: s.line };
  }
  if (c.kind === "rule") {
    const r = ruleById(c.id)!;
    return { title: r.label, line: r.line };
  }
  return { title: CLEAR.label, line: CLEAR.line };
}

function CardFace({ c, index, selected, disabled, onTap }: { c: Card; index: number; selected: boolean; disabled: boolean; onTap: () => void }) {
  const k = KIND[c.kind];
  const t = cardText(c);
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onTap}
      className={cn(
        "flex h-full min-h-32 w-full flex-col gap-1 rounded-xl border-2 border-foreground p-2.5 text-left transition-transform duration-150 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:opacity-60",
        k.cls,
        selected ? "-translate-y-2 hard-shadow-md ring-2 ring-foreground" : "hard-shadow-sm hover:-translate-y-0.5",
        m.deal,
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <span className="flex items-center gap-1 text-caption font-semibold uppercase">
        <k.Icon className="size-3.5" aria-hidden /> {k.word}
        <span className="ml-auto font-mono opacity-70">{index + 1}</span>
      </span>
      <span className="text-small font-semibold leading-snug">{t.title}</span>
      <span className="text-caption leading-snug opacity-80">{t.line}</span>
      {selected ? <span className="mt-auto text-caption font-semibold">Selected</span> : null}
    </button>
  );
}

function LastPlay({ ev, names, meSeat }: { ev: Event; names: [string, string]; meSeat: 0 | 1 }) {
  const t = cardText(ev.card);
  const k = KIND[ev.card.kind];
  const fromMe = ev.seat === meSeat;
  return (
    <div className="flex w-full flex-col items-center gap-2 text-center">
      <div className={cn("w-48 rounded-xl border-2 border-foreground p-2.5 hard-shadow-md", k.cls, ev.action === "swap" ? m.strike : fromMe ? m.playUp : m.playDown, !ev.ok && m.shake)}>
        <p className="flex items-center justify-center gap-1 text-caption font-semibold uppercase">
          <k.Icon className="size-3.5" aria-hidden /> {k.word}
        </p>
        <p className="text-small font-semibold">{ev.action === "swap" ? "A card swapped" : t.title}</p>
      </div>
      <p className={cn("flex items-center gap-1.5 text-small", m.rise)}>
        {ev.action === "swap" ? <RefreshCw className="size-4" aria-hidden /> : ev.ok ? <Check className="size-4" aria-hidden /> : <X className="size-4" aria-hidden />}
        <span>
          <span className="font-semibold">{names[ev.seat]}: </span>
          {ev.action === "swap" ? "swapped a card." : ev.ok ? ev.reason : `Bounced. ${ev.reason}`}
        </span>
      </p>
    </div>
  );
}

function DxPanel({ seat, label, rival }: { seat: Seat; label: string; rival?: boolean }) {
  const dx = dxById(seat.dx)!;
  const p = progress(seat);
  const blocked = seat.blocked ? ruleById(seat.blocked) : null;
  return (
    <Panel className={cn("relative space-y-2 p-3", rival && "bg-muted/40")}>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-caption font-semibold uppercase">{label}</p>
        {blocked ? (
          <Pill tone="bad" className={m.stamp}>
            Blocked
          </Pill>
        ) : (
          <span className="inline-flex items-center gap-1 text-caption text-muted-foreground">
            <Shield className="size-3.5" aria-hidden /> Not blocked
          </span>
        )}
      </div>
      <p className="text-h3">{dx.name}</p>
      <p className="text-small">{dx.rule}</p>
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-pix tabular-nums">
          {p.have}/{p.need}
        </span>
        <span className="inline-flex items-center gap-1 text-caption">
          {p.core ? <Check className="size-3.5" aria-hidden /> : <X className="size-3.5" aria-hidden />} Core card
        </span>
        {dx.must?.length ? (
          <span className="inline-flex items-center gap-1 text-caption">
            {p.must ? <Check className="size-3.5" aria-hidden /> : <X className="size-3.5" aria-hidden />} {symptomById(dx.must[0])!.label}
          </span>
        ) : null}
      </div>
      <div className="h-3 overflow-hidden rounded-full border-2 border-foreground bg-card" role="meter" aria-label={`${dx.short} progress`} aria-valuenow={p.have} aria-valuemin={0} aria-valuemax={p.need}>
        <div className="h-full origin-left bg-primary transition-transform duration-500" style={{ transform: `scaleX(${Math.min(1, p.have / p.need)})` }} />
      </div>
      {seat.built.length ? (
        <ul className="flex flex-wrap gap-1.5" aria-label="Symptoms played">
          {seat.built.map((id) => (
            <li key={id} className={cn("rounded-md border-2 border-foreground bg-card px-2 py-0.5 text-caption font-semibold", dx.core.includes(id) && "bg-primary text-primary-foreground", rival ? m.playDown : m.playUp)}>
              {dx.core.includes(id) ? "Core: " : ""}
              {symptomById(id)!.label}
            </li>
          ))}
        </ul>
      ) : null}
      {blocked ? (
        <p className={cn("flex items-start gap-1.5 rounded-md border-2 border-foreground bg-status-alert-bg p-2 text-small text-status-alert-fg", m.stamp)}>
          <ShieldOff className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            <span className="font-semibold">{blocked.label}.</span> {rival ? "They need a normal test to clear it." : "Play a Clear card to lift it."}
          </span>
        </p>
      ) : null}
    </Panel>
  );
}

/* ------------------------------------------------------------------- end */
function End({ play, xp, onAgain, onExit, board }: { play: Play; xp: number | null; onAgain: () => void; onExit: () => void; board: AccuracyBoardData }) {
  useHotkeys({ Enter: onAgain });
  const g = play.game;
  const pass = play.setup.mode === "pass";
  const mine = replayMine(play);
  const right = mine.filter((e) => e.ok).length;
  const title = g.winner === "draw" ? "A draw." : pass ? `${g.seats[g.winner as 0 | 1].name} wins.` : g.winner === 0 ? "You win." : `${g.seats[1].name} wins.`;
  return (
    <div className={cn("mx-auto max-w-3xl space-y-5", m.rise)}>
      <div className="flex flex-wrap items-end gap-3">
        <h1 className="text-h1">{title}</h1>
        <Pill tone={g.winner === 0 ? "good" : g.winner === "draw" ? "part" : "bad"} className={m.stamp}>
          {g.winner === "draw" ? "Even" : g.winner === 0 ? (pass ? "Player 1" : "Diagnosis complete") : pass ? "Player 2" : "Rival complete"}
        </Pill>
      </div>
      {pass ? (
        <EndReaction right={right} total={mine.length} seed={play.moves.length} />
      ) : (
        <EndReaction mood={g.winner === 0 ? "streak" : g.winner === "draw" ? "near" : "wrong"} seed={play.moves.length} />
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <DxPanel seat={g.seats[0]} label={g.seats[0].name} />
        <DxPanel seat={g.seats[1]} label={g.seats[1].name} rival />
      </div>
      <div className="flex flex-wrap gap-x-4">
        {[...new Set([g.seats[0].dx, g.seats[1].dx])].map((id) => {
          const dx = dxById(id);
          return dx ? <LearnLink key={id} topic={dx.name} show href={`/study/${dx.topic}`} /> : null;
        })}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Stat label="Cards that fit" value={`${right}/${mine.length}`} />
        <Stat label="XP earned" value={xp === null ? "…" : `+${xp}`} />
      </div>
      {mine.some((e) => !e.ok) ? (
        <section className="space-y-2">
          <h2 className="text-body-strong">{pass ? "Player 1's bounced cards" : "Your bounced cards"}, and why</h2>
          <ul className={cn("space-y-1.5", m.stagger)}>
            {mine
              .filter((e) => !e.ok)
              .map((e, i) => (
                <li key={i} className={cn("rounded-md border-2 border-foreground/25 bg-card p-2 text-small", m.rise)} style={{ "--i": i } as React.CSSProperties}>
                  <span className="font-semibold">{cardText(e.card).title}: </span>
                  {e.reason}
                </li>
              ))}
          </ul>
        </section>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-2">
        <Btn variant="primary" size="lg" onClick={onAgain}>
          Play again <Kbd>Enter</Kbd>
        </Btn>
        <Btn size="lg" onClick={onExit}>
          Change opponent
        </Btn>
      </div>
      <AccuracyBoard data={board} unit="cards" />
    </div>
  );
}

/** Player 1's graded plays in this game (the game log keeps only the recent ones, so replay from the moves). */
function replayMine(play: Play): Event[] {
  let g = runBots(newGame(play.setup));
  const out: Event[] = [];
  for (const mv of play.moves) {
    const t = g.turn;
    const next = apply(g, mv);
    if (next === g) break;
    const ev = next.log[next.log.length - 1];
    if (t === 0 && ev.action === "play") out.push(ev);
    g = runBots(next);
  }
  return out;
}
