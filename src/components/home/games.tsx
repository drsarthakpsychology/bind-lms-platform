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
const MATCH_PER_GAME = 6;
const BEST_KEY = "vibha-match-best";
/** First board's order is fixed (so server and browser render the same thing)
 *  but never lines a sign up with its own meaning. Later boards are random. */
const FIRST_ORDER = [3, 0, 4, 1, 5, 2];

type Pair = { id: number; term: string; meaning: string };

function shuffled<T>(list: readonly T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function dealBoard(random: boolean): { pairs: Pair[]; right: number[] } {
  const pool = (random ? shuffled(MEMORY_PAIRS) : MEMORY_PAIRS.slice()).slice(0, MATCH_PER_GAME);
  const pairs = pool.map((p, i) => ({ id: i, term: p.term, meaning: p.meaning }));
  let right = random ? shuffled(pairs.map((p) => p.id)) : FIRST_ORDER.slice();
  // Never leave a meaning directly beside its own sign.
  if (random && right.some((id, row) => id === row)) right = right.map((_, row) => right[(row + 1) % right.length]);
  return { pairs, right };
}

function readBest(): number | null {
  try {
    const v = window.localStorage.getItem(BEST_KEY);
    return v ? Number(v) : null;
  } catch {
    return null;
  }
}
function writeBest(mistakes: number) {
  try {
    window.localStorage.setItem(BEST_KEY, String(mistakes));
  } catch {
    /* private mode: best score just isn't kept */
  }
}

/**
 * Game 3: Match the sign. Everything is face up: signs on the left, what
 * they look like in the room on the right. Tap a sign, then its meaning
 * (or the other way round). Fewest mistakes wins.
 */
export function MemoryGame() {
  const calm = useCalm();
  const [board, setBoard] = React.useState(() => dealBoard(false));
  const [pick, setPick] = React.useState<{ side: "term" | "meaning"; id: number } | null>(null);
  const [miss, setMiss] = React.useState<{ term: number; meaning: number } | null>(null);
  const [matched, setMatched] = React.useState<number[]>([]);
  const [mistakes, setMistakes] = React.useState(0);
  const [best, setBest] = React.useState<number | null>(null);
  const [newBest, setNewBest] = React.useState(false);
  const [say, setSay] = React.useState("");
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const done = matched.length === MATCH_PER_GAME;

  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function choose(side: "term" | "meaning", id: number) {
    if (done || miss || matched.includes(id)) return;
    if (!pick || pick.side === side) {
      setPick(pick && pick.side === side && pick.id === id ? null : { side, id });
      return;
    }
    const term = side === "term" ? id : pick.id;
    const meaning = side === "meaning" ? id : pick.id;
    setPick(null);
    if (term === meaning) {
      const m = [...matched, term];
      setMatched(m);
      if (m.length === MATCH_PER_GAME) {
        const prev = readBest();
        const isBest = prev === null || mistakes < prev;
        if (isBest) writeBest(mistakes);
        setBest(isBest ? mistakes : prev);
        setNewBest(isBest);
        setSay(`All matched with ${mistakes} mistake${mistakes === 1 ? "" : "s"}.`);
      } else {
        setSay(`Right: ${board.pairs[term].term}.`);
      }
    } else {
      setMistakes((n) => n + 1);
      setMiss({ term, meaning });
      setSay("Not a match. Try again.");
      timer.current = setTimeout(() => setMiss(null), calm ? 900 : 700);
    }
  }

  function again() {
    if (timer.current) clearTimeout(timer.current);
    setBoard(dealBoard(true));
    setPick(null);
    setMiss(null);
    setMatched([]);
    setMistakes(0);
    setNewBest(false);
    setSay("New board.");
  }

  const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
  const state = (side: "term" | "meaning", id: number) =>
    matched.includes(id)
      ? "matched"
      : miss && miss[side] === id
        ? "miss"
        : pick && pick.side === side && pick.id === id
          ? "picked"
          : "idle";

  return (
    <div className={`${s.console} ${s.consoleWide}`}>
      <div className={s.gameTop}>
        <span>Match the sign</span>
        <span className={s.memHud}>
          <span>
            Matched {matched.length}/{MATCH_PER_GAME}
          </span>
          <span>Mistakes {mistakes}</span>
          {best !== null ? <span>Best {best}</span> : null}
        </span>
      </div>
      <div className={`${s.screen} ${s.memScreen}`}>
        <p className={s.memHow}>Tap a sign, then what it looks like in the room.</p>
        <div className={s.matchCols}>
          <div role="group" aria-label="Signs" className={s.matchCol}>
            <p className={s.matchColHead}>Sign</p>
            {board.pairs.map((p) => {
              const st = state("term", p.id);
              return (
                <button
                  key={`t${p.id}`}
                  type="button"
                  className={`${s.matchItem} ${s.matchTerm}`}
                  data-state={st}
                  aria-pressed={st === "picked"}
                  disabled={st === "matched"}
                  onClick={() => choose("term", p.id)}
                >
                  {st === "matched" ? <i className={s.matchTick} aria-hidden>✓</i> : null}
                  {p.term}
                </button>
              );
            })}
          </div>
          <div role="group" aria-label="What it looks like" className={s.matchCol}>
            <p className={s.matchColHead}>Looks like</p>
            {board.right.map((id) => {
              const p = board.pairs[id];
              const st = state("meaning", id);
              return (
                <button
                  key={`m${id}`}
                  type="button"
                  className={s.matchItem}
                  data-state={st}
                  aria-pressed={st === "picked"}
                  disabled={st === "matched"}
                  onClick={() => choose("meaning", id)}
                >
                  {st === "matched" ? (
                    <i className={s.matchTick} aria-hidden>
                      ✓
                    </i>
                  ) : null}
                  {p.meaning}
                </button>
              );
            })}
          </div>
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
              All 6 matched with {mistakes} mistake{mistakes === 1 ? "" : "s"}.{newBest ? " New best!" : ""}
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
