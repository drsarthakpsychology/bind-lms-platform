"use client";

/**
 * Interactive pieces: two mini games, the therapy mixer, the disorder picker,
 * the weekday/weekend switch and the "in depth" tabs. All keyboard + touch
 * friendly; results are announced via aria-live.
 */

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { CAST, characterSvg, type CastName } from "./art";
import { CLINIC_CALL, DAY, DEFENCE_GAME, DISORDER_FIELDS, DISORDER_FOOT, DISORDERS, LINKS, MEMORY_PAIRS, MIXER, MIXER_NOTE, MODULES } from "./content";
import { useCalm } from "./motion-kit";
import s from "./home.module.css";

function Person({ who, className, flip }: { who: CastName; className?: string; flip?: boolean }) {
  return <span aria-hidden className={className} dangerouslySetInnerHTML={{ __html: characterSvg({ ...CAST[who], flip }) }} />;
}

/* ------------------------------------------------- shared game shell */
function useGame(total: number) {
  const [round, setRound] = React.useState(0);
  const [picked, setPicked] = React.useState<number | null>(null);
  const [score, setScore] = React.useState(0);
  const done = round >= total;
  return {
    round,
    picked,
    score,
    done,
    pick(i: number, correct: number) {
      if (picked !== null) return;
      setPicked(i);
      if (i === correct) setScore((v) => v + 1);
    },
    next() {
      setPicked(null);
      setRound((r) => r + 1);
    },
    reset() {
      setPicked(null);
      setScore(0);
      setRound(0);
    },
  };
}

function Burst({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.span
          key="burst"
          className={s.burst}
          initial={{ opacity: 0, y: 0, scale: 0.6 }}
          animate={{ opacity: [0, 1, 0], y: -36, scale: 1.2 }}
          transition={{ duration: 0.9 }}
          aria-hidden
        >
          +1
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}

function ScreenTop({ title, round, total, score }: { title: string; round: number; total: number; score: number }) {
  return (
    <div className={s.gameTop}>
      <span>{title}</span>
      <span>
        {Math.min(round + 1, total)}/{total} · Score {score}
      </span>
    </div>
  );
}

/* ---------------------------------------- Game 1: what would you do? */
export function ClinicCallGame() {
  const total = CLINIC_CALL.length;
  const g = useGame(total);
  const calm = useCalm();
  const item = CLINIC_CALL[Math.min(g.round, total - 1)];
  const verdict =
    g.score === total ? "Clinic ready. Come prove it with real patients." : g.score >= 4 ? "Nearly there. The clinic will sharpen the rest." : "This is exactly what we teach.";
  return (
    <div className={s.console}>
      <ScreenTop title="Clinic call" round={g.round} total={total} score={g.score} />
      <div className={s.screen}>
        <AnimatePresence mode="wait" initial={false}>
          {!g.done ? (
            <motion.div
              key={g.round}
              initial={calm ? false : { opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={calm ? undefined : { opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <p className={s.gameQ}>{item.q}</p>
              <p className={s.gameAsk}>What would you do?</p>
              <div className={s.gameOpts}>
                {item.options.map((o, i) => {
                  const state =
                    g.picked === null ? "idle" : i === item.a ? "right" : i === g.picked ? "wrong" : "dim";
                  return (
                    <button
                      key={o}
                      type="button"
                      className={s.gameOpt}
                      data-state={state}
                      onClick={() => g.pick(i, item.a)}
                      disabled={g.picked !== null}
                    >
                      <span className={s.optKey} aria-hidden>
                        {String.fromCharCode(65 + i)}
                      </span>
                      {o}
                    </button>
                  );
                })}
              </div>
              <div aria-live="polite" className={s.gameFeedback}>
                {g.picked !== null ? (
                  <motion.div
                    initial={calm ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={s.why}
                  >
                    <b>{g.picked === item.a ? "Right." : "Not quite."}</b> {item.why}
                    <button type="button" className={`${s.btn} ${s.btnLime} ${s.btnSm}`} onClick={g.next}>
                      {g.round + 1 < total ? "Next →" : "See score"}
                    </button>
                  </motion.div>
                ) : null}
              </div>
              <Burst show={g.picked !== null && g.picked === item.a} />
            </motion.div>
          ) : (
            <motion.div
              key="end"
              className={s.gameEnd}
              initial={calm ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              aria-live="polite"
            >
              <p className={s.bigScore}>
                {g.score}/{total}
              </p>
              <p className={s.gameVerdict}>{verdict}</p>
              <div className={s.gameEndBtns}>
                <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={g.reset}>
                  Play again
                </button>
                <Link href={LINKS.apply} className={`${s.btn} ${s.btnLime} ${s.btnSm}`}>
                  Request an invitation
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------------------------------- Game 2: spot the defence */
const DEF_WHY: Record<string, string> = {
  Denial: "Refusing to accept something that's clearly true.",
  Projection: "Putting your own feeling onto someone else.",
  Displacement: "Taking a feeling out on a safer target.",
  Rationalisation: "A comfortable reason that hides the real one.",
};

export function DefenceGame() {
  const total = DEFENCE_GAME.length;
  const g = useGame(total);
  const calm = useCalm();
  const item = DEFENCE_GAME[Math.min(g.round, total - 1)];
  return (
    <div className={`${s.console} ${s.consoleAlt}`}>
      <ScreenTop title="Spot the defence" round={g.round} total={total} score={g.score} />
      <div className={s.screen}>
        <AnimatePresence mode="wait" initial={false}>
          {!g.done ? (
            <motion.div
              key={g.round}
              initial={calm ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={calm ? undefined : { opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={s.quoteRow}>
                <Person who="patient" className={s.quoteArt} />
                <p className={s.quote}>&ldquo;{item.quote}&rdquo;</p>
              </div>
              <div className={`${s.gameOpts} ${s.gameOpts2}`}>
                {item.options.map((o, i) => {
                  const state =
                    g.picked === null ? "idle" : i === item.a ? "right" : i === g.picked ? "wrong" : "dim";
                  return (
                    <button
                      key={o}
                      type="button"
                      className={s.gameOpt}
                      data-state={state}
                      onClick={() => g.pick(i, item.a)}
                      disabled={g.picked !== null}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
              <div aria-live="polite" className={s.gameFeedback}>
                {g.picked !== null ? (
                  <motion.div initial={calm ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={s.why}>
                    <b>
                      {g.picked === item.a ? "Spotted." : "Missed it."} {item.options[item.a]}:
                    </b>{" "}
                    {DEF_WHY[item.options[item.a]]}
                    <button type="button" className={`${s.btn} ${s.btnLime} ${s.btnSm}`} onClick={g.next}>
                      {g.round + 1 < total ? "Next →" : "See score"}
                    </button>
                  </motion.div>
                ) : null}
              </div>
              <Burst show={g.picked !== null && g.picked === item.a} />
            </motion.div>
          ) : (
            <motion.div key="end" className={s.gameEnd} initial={calm ? false : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} aria-live="polite">
              <p className={s.bigScore}>
                {g.score}/{total}
              </p>
              <p className={s.gameVerdict}>In the programme you spot these live in session, and use them in the plan.</p>
              <div className={s.gameEndBtns}>
                <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={g.reset}>
                  Play again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------------------------------------- Tabs (accessible) */
function useTabs(count: number) {
  const [active, setActive] = React.useState(0);
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: React.KeyboardEvent) => {
    let next = active;
    if (e.key === "ArrowRight") next = (active + 1) % count;
    else if (e.key === "ArrowLeft") next = (active - 1 + count) % count;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };
  return { active, setActive, refs, onKeyDown };
}

/* ------------------------------------------------- Therapy mixer */
export function TherapyMixer() {
  const t = useTabs(MIXER.length);
  const calm = useCalm();
  const cur = MIXER[t.active];
  const who: CastName[] = ["long", "spiky", "scarf"];
  return (
    <div className={s.mixer}>
      <div role="tablist" aria-label="Choose a patient" className={s.mixTabs} onKeyDown={t.onKeyDown}>
        {MIXER.map((m, i) => (
          <button
            key={m.who}
            ref={(el) => {
              t.refs.current[i] = el;
            }}
            role="tab"
            id={`mix-tab-${i}`}
            aria-selected={t.active === i}
            aria-controls="mix-panel"
            tabIndex={t.active === i ? 0 : -1}
            className={s.mixTab}
            onClick={() => t.setActive(i)}
          >
            {t.active === i && !calm ? <motion.span layoutId="mixPill" className={s.mixPill} /> : null}
            <Person who={who[i]} className={s.mixAvatar} />
            <span className={s.mixTabText}>
              <b>{m.who}</b>
              <small>{m.age}</small>
            </span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id="mix-panel" aria-labelledby={`mix-tab-${t.active}`} className={s.mixPanel}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.ol key={t.active} className={s.mixRows} initial={calm ? false : "hide"} animate="show" exit={calm ? undefined : "hide"}>
            {cur.plan.map((r, i) => (
              <motion.li
                key={r.when}
                className={s.mixRow}
                variants={{ hide: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { delay: i * 0.09 } } }}
              >
                <span className={s.mixWhen}>{r.when}</span>
                <span className={`${s.mixBar} ${s[`mix_${r.tone}`]}`}>
                  <motion.span
                    className={s.mixFill}
                    variants={{ hide: { scaleX: 0 }, show: { scaleX: 1, transition: { delay: 0.1 + i * 0.09, duration: 0.6 } } }}
                  />
                  <span className={s.mixWhat}>{r.what}</span>
                </span>
              </motion.li>
            ))}
          </motion.ol>
        </AnimatePresence>
        <p className={s.mixNote}>{MIXER_NOTE}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------- Disorder picker */
/** Each disorder gets its own card: the patient's words, what is specific to
 *  it, and the red flag. Chips are a single-select group (aria-pressed). */
export function DisorderPicker() {
  const [active, setActive] = React.useState(0);
  const calm = useCalm();
  const d = DISORDERS[active];
  const mod = MODULES.find((m) => m.n === d.module);
  return (
    <div className={s.picker}>
      <p className={s.pickerAsk}>Pick a disorder:</p>
      <div className={s.pickerChips}>
        {DISORDERS.map((x, i) => (
          <button
            key={x.name}
            type="button"
            className={s.pickerChip}
            aria-pressed={active === i}
            onClick={() => setActive(i)}
          >
            {x.name}
          </button>
        ))}
      </div>
      <div className={s.pickerCard} aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={d.name}
            initial={calm ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={calm ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <div className={s.pickerTop}>
              <p className={s.pickerTitle}>
                {d.name}
                {mod ? <span className={s.srOnly}>, </span> : null}
                {mod ? <span className={s.pickerMod}>Module {mod.n}: {mod.title}</span> : null}
              </p>
              <div className={s.pickerSays}>
                <Person who="patient" className={s.pickerSaysArt} />
                <p className={s.pickerQuote}>
                  <span className={s.srOnly}>The patient says: </span>
                  {d.says}
                </p>
              </div>
            </div>
            <dl className={s.pickerGrid}>
              {DISORDER_FIELDS.map((f) => (
                <div key={f.key} className={s.pickerRow}>
                  <dt>{f.label}</dt>
                  <dd>{d[f.key]}</dd>
                </div>
              ))}
              <div className={`${s.pickerRow} ${s.pickerFlag}`}>
                <dt>Red flag: call the psychiatrist</dt>
                <dd>{d.redFlag}</dd>
              </div>
            </dl>
            <p className={s.pickerFoot}>{DISORDER_FOOT}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------- Weekday / weekend switch */
export function DaySwitch() {
  const t = useTabs(2);
  const calm = useCalm();
  const days = [DAY.weekday, DAY.weekend];
  const d = days[t.active];
  return (
    <div className={s.daySwitch}>
      <div role="tablist" aria-label="Choose a day" className={s.segment} onKeyDown={t.onKeyDown}>
        {days.map((x, i) => (
          <button
            key={x.title}
            ref={(el) => {
              t.refs.current[i] = el;
            }}
            role="tab"
            id={`day-tab-${i}`}
            aria-selected={t.active === i}
            aria-controls="day-panel"
            tabIndex={t.active === i ? 0 : -1}
            className={s.segBtn}
            onClick={() => t.setActive(i)}
          >
            {t.active === i && !calm ? <motion.span layoutId="dayPill" className={s.segPill} /> : null}
            <span className={s.segText}>{i === 0 ? "Weekday" : "Weekend"}</span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id="day-panel" aria-labelledby={`day-tab-${t.active}`} className={s.dayPanel}>
        <div className={s.dayPanelHead}>
          <span className={s.pixLabel}>{d.tag}</span>
          <h3>{d.title}</h3>
          <p>{d.sub}</p>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.ol key={t.active} className={`${s.dayList} ${t.active ? s.dayListLime : ""}`} initial={calm ? false : "hide"} animate="show" exit={calm ? undefined : "hide"}>
            {d.steps.map((st, i) => (
              <motion.li key={st} variants={{ hide: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { delay: i * 0.06 } } }}>
                <span className={s.dot}>{i + 1}</span>
                {st}
              </motion.li>
            ))}
          </motion.ol>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------ "In depth" tabs */
export function DepthTabs({ labels, children }: { labels: readonly string[]; children: React.ReactNode[] }) {
  const t = useTabs(labels.length);
  const calm = useCalm();
  return (
    <div className={s.depthTabs}>
      <div role="tablist" aria-label="Core skills" className={s.dtList} onKeyDown={t.onKeyDown}>
        {labels.map((l, i) => (
          <button
            key={l}
            ref={(el) => {
              t.refs.current[i] = el;
            }}
            role="tab"
            id={`depth-tab-${i}`}
            aria-selected={t.active === i}
            aria-controls={`depth-panel-${i}`}
            tabIndex={t.active === i ? 0 : -1}
            className={s.dtTab}
            onClick={() => t.setActive(i)}
          >
            <span className={s.dtNum}>{String(i + 1).padStart(2, "0")}</span>
            {l}
            {t.active === i && !calm ? <motion.span layoutId="dtLine" className={s.dtLine} /> : null}
          </button>
        ))}
      </div>
      {children.map((panel, i) => (
        <div
          key={i}
          role="tabpanel"
          id={`depth-panel-${i}`}
          aria-labelledby={`depth-tab-${i}`}
          hidden={t.active !== i}
          className={s.dtPanel}
        >
          {t.active === i ? (
            <motion.div initial={calm ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              {panel}
            </motion.div>
          ) : (
            panel
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------- Carousel (swipe, drag, buttons) */
export function Carousel({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = React.useRef<HTMLUListElement>(null);
  const drag = React.useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [edge, setEdge] = React.useState<"start" | "mid" | "end">("start");
  const update = () => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth - 2;
    setEdge(el.scrollLeft <= 2 ? "start" : el.scrollLeft >= max ? "end" : "mid");
  };
  const by = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 300) + 18), behavior: "smooth" });
  };
  return (
    <div className={s.carousel}>
      <ul
        ref={ref}
        className={s.carTrack}
        aria-label={label}
        onScroll={update}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !ref.current) return;
          drag.current = { x: e.clientX, left: ref.current.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          if (!drag.current || !ref.current) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 4) drag.current.moved = true;
          ref.current.scrollLeft = drag.current.left - dx;
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => (drag.current = null)}
        data-cursor
      >
        {children}
      </ul>
      <div className={s.carBtns}>
        <button type="button" className={s.carBtn} onClick={() => by(-1)} disabled={edge === "start"} aria-label="Previous">
          ←
        </button>
        <button type="button" className={s.carBtn} onClick={() => by(1)} disabled={edge === "end"} aria-label="Next">
          →
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------ Mini game 3: memory */
type MemCard = { id: string; pair: number; kind: "term" | "meaning"; text: string };
const MEM_PAIRS_PER_GAME = 6;
const BEST_KEY = "vibha-memory-best";

function shuffled<T>(list: readonly T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Deterministic deal for the first (server) render; a random deal happens on
 *  the first tap, while every card is still face down, so nothing visible
 *  changes and hydration always matches. */
function dealCards(random: boolean): MemCard[] {
  const pool = random ? shuffled(MEMORY_PAIRS).slice(0, MEM_PAIRS_PER_GAME) : MEMORY_PAIRS.slice(0, MEM_PAIRS_PER_GAME);
  const cards = pool.flatMap((p, i): MemCard[] => [
    { id: `t${i}`, pair: i, kind: "term", text: p.term },
    { id: `m${i}`, pair: i, kind: "meaning", text: p.meaning },
  ]);
  return random ? shuffled(cards) : cards;
}

/** Wall-clock read kept outside the component (only ever called from taps). */
function nowMs(): number {
  return Date.now();
}

function readBest(): number | null {
  try {
    const v = window.localStorage.getItem(BEST_KEY);
    return v ? Number(v) : null;
  } catch {
    return null;
  }
}
function writeBest(moves: number) {
  try {
    window.localStorage.setItem(BEST_KEY, String(moves));
  } catch {
    /* private mode: best score just isn't kept */
  }
}

export function MemoryGame() {
  const calm = useCalm();
  const [deck, setDeck] = React.useState<MemCard[]>(() => dealCards(false));
  const [dealt, setDealt] = React.useState(false);
  const [up, setUp] = React.useState<number[]>([]);
  const [miss, setMiss] = React.useState<number[]>([]);
  const [matched, setMatched] = React.useState<number[]>([]);
  const [moves, setMoves] = React.useState(0);
  const [startedAt, setStartedAt] = React.useState<number | null>(null);
  const [seconds, setSeconds] = React.useState(0);
  const [best, setBest] = React.useState<number | null>(null);
  const [newBest, setNewBest] = React.useState(false);
  const [say, setSay] = React.useState("");
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const done = matched.length === MEM_PAIRS_PER_GAME;

  React.useEffect(() => {
    if (startedAt === null || done) return;
    const id = setInterval(() => setSeconds(Math.floor((nowMs() - startedAt) / 1000)), 250);
    return () => clearInterval(id);
  }, [startedAt, done]);
  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function flip(i: number) {
    if (done || miss.length > 0 || up.includes(i)) return;
    let d = deck;
    if (!dealt) {
      d = dealCards(true);
      setDeck(d);
      setDealt(true);
      setStartedAt(nowMs());
      setBest(readBest());
    }
    if (matched.includes(d[i].pair)) return;
    const next = [...up, i];
    if (next.length < 2) {
      setUp(next);
      return;
    }
    const [a, b] = next;
    const nextMoves = moves + 1;
    setMoves(nextMoves);
    if (d[a].pair === d[b].pair) {
      const m = [...matched, d[a].pair];
      setMatched(m);
      setUp([]);
      const term = d[a].kind === "term" ? d[a].text : d[b].text;
      if (m.length === MEM_PAIRS_PER_GAME) {
        const prev = readBest();
        const isBest = prev === null || nextMoves < prev;
        if (isBest) writeBest(nextMoves);
        setBest(isBest ? nextMoves : prev);
        setNewBest(isBest);
        setSay(`Board cleared in ${nextMoves} moves.`);
      } else {
        setSay(`Match: ${term}.`);
      }
    } else {
      setUp(next);
      setMiss(next);
      setSay("Not a pair.");
      timer.current = setTimeout(() => {
        setUp([]);
        setMiss([]);
      }, calm ? 1200 : 950);
    }
  }

  function again() {
    if (timer.current) clearTimeout(timer.current);
    setDeck(dealCards(true));
    setDealt(true);
    setUp([]);
    setMiss([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setStartedAt(nowMs());
    setNewBest(false);
    setSay("New board dealt.");
  }

  const stars = moves <= 9 ? 3 : moves <= 13 ? 2 : 1;
  const time = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className={`${s.console} ${s.consoleWide}`}>
      <div className={s.gameTop}>
        <span>Match the sign</span>
        <span className={s.memHud}>
          <span>Pairs {matched.length}/{MEM_PAIRS_PER_GAME}</span>
          <span>Moves {moves}</span>
          <span>{time}</span>
          {best !== null ? <span>Best {best}</span> : null}
        </span>
      </div>
      <div className={`${s.screen} ${s.memScreen}`}>
        <p className={s.memHow}>
          Tap two cards. Match each sign to what it looks like in the room.
        </p>
        <div className={s.memBoard} role="group" aria-label="Memory cards">
          {deck.map((c, i) => {
            const isMatched = matched.includes(c.pair);
            const faceUp = isMatched || up.includes(i);
            const state = isMatched ? "matched" : miss.includes(i) ? "miss" : faceUp ? "up" : "down";
            return (
              <button
                key={`slot-${i}`}
                type="button"
                className={s.memCard}
                data-state={state}
                data-kind={c.kind}
                onClick={() => flip(i)}
                aria-label={faceUp ? `${c.kind === "term" ? "Sign" : "Looks like"}: ${c.text}` : `Card ${i + 1}, face down`}
                aria-pressed={faceUp}
              >
                <span className={s.memInner} aria-hidden>
                  <span className={s.memBack}>
                    <span>✶</span>
                  </span>
                  <span className={s.memFace}>
                    <small>{c.kind === "term" ? "Sign" : "Looks like"}</small>
                    <b>{c.text}</b>
                    {isMatched ? <i className={s.memTick}>✓</i> : null}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <p className={s.srOnly} aria-live="polite">
          {say}
        </p>
        {done ? (
          <motion.div
            className={s.memEnd}
            initial={calm ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className={s.memStars} aria-label={`${stars} out of 3 stars`}>
              {"★".repeat(stars)}
              <span>{"★".repeat(3 - stars)}</span>
            </p>
            <p className={s.gameVerdict}>
              Cleared in {moves} moves, {time}.{newBest ? " New best!" : ""}
            </p>
            <div className={s.gameEndBtns}>
              <button type="button" className={`${s.btn} ${s.btnLime}`} onClick={again}>
                Play again
              </button>
              <Link href={LINKS.apply} className={`${s.btn} ${s.btnWhite}`}>
                Learn this for real <span aria-hidden>→</span>
              </Link>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
