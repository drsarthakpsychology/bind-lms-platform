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
import { CLINIC_CALL, DAY, DEFENCE_GAME, DISORDER_TABS, EVERY_DISORDER, LINKS, MIXER, MIXER_NOTE, MODULES } from "./content";
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
export function DisorderPicker() {
  const [active, setActive] = React.useState(0);
  const calm = useCalm();
  const d = DISORDER_TABS[active];
  const mod = MODULES.find((m) => m.n === d.module);
  return (
    <div className={s.picker}>
      <p className={s.pickerAsk}>Pick a disorder:</p>
      <div className={s.pickerChips}>
        {DISORDER_TABS.map((x, i) => (
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
            <p className={s.pickerTitle}>
              {d.name}
              {mod ? <span className={s.srOnly}>, </span> : null}
              {mod ? <span className={s.pickerMod}>Module {mod.n}: {mod.title}</span> : null}
            </p>
            <ul className={s.ticks}>
              {EVERY_DISORDER.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
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
