"use client";

/**
 * Scroll-driven scenes. Each pinned scene is a tall section with a sticky,
 * full-height stage; scroll progress drives transforms. Every scene has a
 * calm (reduced-motion) version that shows the same information, unpinned.
 */

import * as React from "react";
import {
  interpolate,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { CAST, characterSvg, iconSvg, type CastName } from "./art";
import {
  COLLEGE_VS,
  JOURNEY,
  JOURNEY_FOOT,
  MANIFESTO,
  PATIENT_FACTS,
  PATIENT_STEPS,
  SCENARIOS,
  WEEKS_TIMELINE,
} from "./content";
import { useCalm } from "./motion-kit";
import s from "./home.module.css";

/**
 * Scroll-linked value computed in JS (function transform). Holds the first and
 * last values outside the active window, so nothing snaps back to its initial
 * state once a scene is scrolled past (hardware-accelerated scroll timelines
 * revert to the inline start value outside their range).
 */
function useRange<T extends number | string>(p: MotionValue<number>, inp: number[], out: T[]): MotionValue<T> {
  // Ranges are constant per call site, so build the mapper once.
  const [map] = React.useState(() => interpolate(inp, out, { clamp: true }));
  return useTransform(p, (v: number) => map(v));
}

function Art({ html, className, style }: { html: string; className?: string; style?: React.CSSProperties }) {
  return <span aria-hidden className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />;
}

function Person({ who, className, flip }: { who: CastName; className?: string; flip?: boolean }) {
  return <Art className={className} html={characterSvg({ ...CAST[who], flip })} />;
}

/* ============================================ 2. College vs VIBHA rows */
function VsRow({ college, vibha, i }: { college: string; vibha: string; i: number }) {
  const ref = React.useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
  // Animation is pure CSS keyed off data-cv (strike draws, old line fades,
  // the VIBHA line slides in). Works across wrapped lines.
  return (
    <li ref={ref} className={s.cvRow} data-cv={inView ? "on" : "off"}>
      <span className={s.cvNum}>{String(i + 1).padStart(2, "0")}</span>
      <p className={s.cvCollege}>
        <span className={s.srOnly}>In most college courses: </span>
        <span className={s.cvCollegeText}>{college}</span>
      </p>
      <span className={s.cvArrow} aria-hidden>
        →
      </span>
      <p className={s.cvVibha}>
        <span className={s.srOnly}>At VIBHA: </span>
        <span className={s.cvVibhaText}>{vibha}</span>
      </p>
    </li>
  );
}

export function CollegeVs() {
  return (
    <>
      <div className={s.cvHead} aria-hidden>
        <span />
        <span>In most college courses</span>
        <span />
        <span className={s.cvHeadVibha}>At VIBHA</span>
      </div>
      <ol className={s.cvList}>
        {COLLEGE_VS.map((r, i) => (
          <VsRow key={r.college} college={r.college} vibha={r.vibha} i={i} />
        ))}
      </ol>
    </>
  );
}

/* ---------------------------------- Apple-style word-by-word paragraph */
function ScrubWord({ word, i, n, p }: { word: string; i: number; n: number; p: MotionValue<number> }) {
  const o = useRange(p, [i / n, (i + 1) / n], [0.14, 1]);
  return (
    <motion.span data-reveal style={{ opacity: o }}>
      {word}{" "}
    </motion.span>
  );
}

export function ScrubText({ text = MANIFESTO, className }: { text?: string; className?: string }) {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const calm = useCalm();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  if (calm) return <p className={className}>{text}</p>;
  return (
    <p ref={ref} className={className}>
      <span className={s.srOnly}>{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <ScrubWord key={i} word={w} i={i} n={words.length} p={scrollYProgress} />
        ))}
      </span>
    </p>
  );
}

/* ======================================== 3. One disorder, start to finish */
export function JourneyScene({ children }: { children?: React.ReactNode }) {
  const ref = React.useRef<HTMLElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const calm = useCalm();
  const [dist, setDist] = React.useState(0);
  const distRef = React.useRef(0);
  const [active, setActive] = React.useState(0);

  React.useLayoutEffect(() => {
    if (calm) return;
    const t = trackRef.current;
    if (!t) return;
    const measure = () => {
      const d = Math.max(0, t.scrollWidth - window.innerWidth);
      distRef.current = d;
      setDist(d);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [calm]);

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(p, (v: number) => -Math.min(1, Math.max(0, v)) * distRef.current);
  const bar = useSpring(p, { stiffness: 220, damping: 32 });
  const n = JOURNEY.steps.length;
  useMotionValueEvent(p, "change", (v) => {
    const idx = Math.min(n - 1, Math.max(0, Math.round(v * (n + 1)) - 1));
    setActive(idx);
  });

  const cards = (
    <>
      <div className={`${s.jCard} ${s.jIntro}`}>
        <span className={s.tag}>One disorder, start to finish</span>
        <h3 className={s.jTitle}>
          {JOURNEY.disorder}
          <span className={s.srOnly}>, </span>
          <span>the way a clinic handles it.</span>
        </h3>
        <div className={s.jPatient}>
          <Person who="patient" className={s.jPatientArt} />
          <p>{JOURNEY.patient}</p>
        </div>
        <p className={s.jHint} aria-hidden>
          Keep scrolling <span>→</span>
        </p>
      </div>
      {JOURNEY.steps.map((st, i) => (
        <article key={st.k} className={s.jCard} data-on={i <= active || calm ? "true" : "false"}>
          <div className={s.jTop}>
            <span className={s.jNum}>{String(i + 1).padStart(2, "0")}</span>
            <span className={s.jKey}>{st.k}</span>
            <Art className={s.jIcon} html={iconSvg(st.icon, i % 2 ? "#ffffff" : "#cdf24b")} />
          </div>
          <h4 className={s.jStepTitle}>{st.title}</h4>
          <p>{st.text}</p>
        </article>
      ))}
      <div className={`${s.jCard} ${s.jEnd}`}>
        <p className={s.jEndBig}>{JOURNEY_FOOT}</p>
        {children}
      </div>
    </>
  );

  if (calm) {
    return (
      <section className={`${s.section} ${s.ink} ${s.journeyCalm}`} id="journey">
        <div className={s.wrap}>
          <div className={s.jCalmTrack}>{cards}</div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      id="journey"
      className={`${s.journey} ${s.ink}`}
      style={{ height: `calc(100svh + ${dist}px)` }}
    >
      <div className={s.jSticky}>
        <motion.div ref={trackRef} className={s.jTrack} style={{ x }}>
          {cards}
        </motion.div>
        <div className={s.jProgress} aria-hidden>
          <div className={`${s.wrap} ${s.jProgressInner}`}>
            <ol className={s.jSteps}>
              {JOURNEY.steps.map((st, i) => (
                <li key={st.k} data-on={i <= active ? "true" : "false"}>
                  <span>{st.k}</span>
                </li>
              ))}
            </ol>
            <div className={s.jBar}>
              <motion.div className={s.jBarFill} style={{ scaleX: bar }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================== 4. 2 + 3 = 5 group scene */
const W = 12; // character width, % of stage
const toX = (left: number) => `${(left / W) * 100}%`;
const KEYS = [0, 0.22, 0.46, 0.7, 1];
const STUDENTS: { who: CastName; pos: number[] }[] = [
  { who: "long", pos: [6, 56, 46, 46, 46] },
  { who: "curly", pos: [20, 68, 58, 58, 58] },
  { who: "beanie", pos: [34, 4, 10, 10, 10] },
  { who: "scarf", pos: [48, 16, 22, 22, 22] },
  { who: "bun", pos: [62, 28, 34, 34, 34] },
];
const CAPTIONS = [
  { n: "1", t: "Join a group of five." },
  { n: "2", t: "2 of you take the patient." },
  { n: "3", t: "3 more join the discussion. All 5 make the plan." },
  { n: "4", t: "The psychiatrist corrects it, and tells you why." },
  { n: "5", t: "Swap and repeat. Everyone gets equal turns." },
];

function Mover({ who, pos, p }: { who: CastName; pos: number[]; p: MotionValue<number> }) {
  const x = useTransform(p, KEYS, pos.map(toX));
  const hop = useRange(p, [0.1, 0.16, 0.22, 0.34, 0.4, 0.46], [0, -8, 0, 0, -8, 0]);
  return (
    <motion.div className={s.gChar} style={{ x, y: hop }}>
      <Person who={who} />
    </motion.div>
  );
}

export function GroupScene() {
  const ref = React.useRef<HTMLElement>(null);
  const calm = useCalm();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const patientO = useRange(p, [0.12, 0.22, 0.46, 0.56], [0, 1, 1, 0]);
  const planO = useRange(p, [0.4, 0.5, 0.92, 1], [0, 1, 1, 1]);
  const planY = useRange(p, [0.4, 0.5], [20, 0]);
  const docO = useRange(p, [0.58, 0.7], [0, 1]);
  const docY = useRange(p, [0.58, 0.7], [40, 0]);
  const [cap, setCap] = React.useState(0);
  useMotionValueEvent(p, "change", (v) => setCap(v < 0.16 ? 0 : v < 0.4 ? 1 : v < 0.62 ? 2 : v < 0.84 ? 3 : 4));

  const facts = (
    <dl className={s.gFacts}>
      {PATIENT_FACTS.map((f) => (
        <div key={f.k}>
          <dt>{f.k}</dt>
          <dd>{f.v}</dd>
        </div>
      ))}
    </dl>
  );

  if (calm) {
    return (
      <div className={s.gCalm}>
        <ol className={s.steps}>
          {PATIENT_STEPS.map((st, i) => (
            <li key={st.title} className={s.step}>
              <span className={s.stepNum}>{i + 1}</span>
              <div>
                <h3 className={s.stepTitle}>{st.title}</h3>
                <p>{st.text}</p>
              </div>
            </li>
          ))}
        </ol>
        {facts}
      </div>
    );
  }

  return (
    <section ref={ref} className={s.group} aria-label="How patient groups work">
      <div className={s.gSticky}>
        <div className={`${s.wrap} ${s.gInner}`}>
          <p className={s.formula}>
            <b>2</b> interview <i>+</i> <b>3</b> discuss <i>=</i> <b>5</b> make the plan
          </p>
          <div className={s.gStage}>
            <div className={s.gFloor} />
            <motion.div className={s.gPlan} style={{ opacity: planO, y: planY }}>
              <span className={s.pixLabel}>Treatment plan</span>
              <span className={s.gPlanLines} />
            </motion.div>
            {STUDENTS.map((st) => (
              <Mover key={st.who} who={st.who} pos={st.pos} p={p} />
            ))}
            <motion.div className={s.gChar} style={{ x: toX(84), opacity: patientO }}>
              <Person who="patient" flip />
            </motion.div>
            <motion.div className={s.gChar} style={{ x: toX(80), opacity: docO, y: docY }}>
              <Person who="doctor" flip />
              <span className={s.gBubble}>Change this. Here&apos;s why.</span>
            </motion.div>
          </div>
          <div className={s.gCaptions} aria-live="polite">
            {CAPTIONS.map((c, i) => (
              <p key={c.n} className={s.gCaption} data-on={i === cap ? "true" : "false"}>
                <span className={s.gCapNum}>{c.n}</span>
                {c.t}
              </p>
            ))}
          </div>
          {facts}
        </div>
      </div>
    </section>
  );
}

/* ============================================ 5. Stacking scenario cards */
function StackCard({
  i,
  n,
  p,
  children,
}: {
  i: number;
  n: number;
  p: MotionValue<number>;
  children: React.ReactNode;
}) {
  const scale = useRange(p, [i / n, 1], [1, 1 - (n - 1 - i) * 0.035]);
  return (
    <li className={s.stackItem} style={{ top: `calc(88px + ${i * 14}px)` }}>
      <motion.div className={s.stackCard} style={{ scale }}>
        {children}
      </motion.div>
    </li>
  );
}

export function ScenarioStack() {
  const ref = React.useRef<HTMLOListElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start 30%", "end end"] });
  const n = SCENARIOS.length;
  return (
    <ol ref={ref} className={s.stack}>
      {SCENARIOS.map((sc, i) => (
        <StackCard key={sc.when} i={i} n={n} p={p}>
          <div className={`${s.scHead} ${sc.tone === "ink" ? s.scHeadInk : s.scHeadLime}`}>
            <Art className={s.scIcon} html={iconSvg(sc.icon, sc.tone === "ink" ? "#cdf24b" : "#ffffff")} />
            <div>
              <span className={s.pixLabel}>When</span>
              <h3 className={s.scTitle}>{sc.when}</h3>
            </div>
            <span className={s.scCount}>
              {i + 1}/{n}
            </span>
          </div>
          <div className={s.scBody}>
            <span className={s.pixLabel}>You learn to</span>
            <ul className={s.bullets}>
              {sc.learn.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        </StackCard>
      ))}
      <li aria-hidden className={s.stackRunway} />
    </ol>
  );
}

/* ============================================ 6. 16-week timeline (fills) */
function WeekNode({ w, t, i }: { w: string; t: string; i: number }) {
  const ref = React.useRef<HTMLLIElement>(null);
  const on = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const seen = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  return (
    <li ref={ref} className={s.tlItem} data-on={on || seen ? "true" : "false"} data-side={i % 2 ? "r" : "l"}>
      <span className={s.tlDot} aria-hidden />
      <div className={s.tlCard}>
        <span className={s.tlWeek}>{w}</span>
        <p>{t}</p>
      </div>
    </li>
  );
}

export function WeeksTimeline() {
  const ref = React.useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });
  return (
    <ol ref={ref} className={s.timeline2}>
      <span className={s.tlLine} aria-hidden>
        <motion.span className={s.tlLineFill} style={{ scaleY: fill }} />
      </span>
      {WEEKS_TIMELINE.map((x, i) => (
        <WeekNode key={x.w} w={x.w} t={x.t} i={i} />
      ))}
    </ol>
  );
}

/* ============================================ Draggable hero stickers */
export function Stickers({ items }: { items: readonly string[] }) {
  const calm = useCalm();
  return (
    <ul className={s.stickers} aria-label="What the programme covers">
      {items.map((t, i) => (
        <motion.li
          key={t}
          className={`${s.sticker} ${s[`stk${i % 3}`]}`}
          style={{ rotate: [-3, 2, -1.5][i % 3] }}
          drag={!calm}
          dragSnapToOrigin
          dragElastic={0.5}
          whileDrag={{ scale: 1.12, rotate: 0, zIndex: 5 }}
          whileHover={calm ? undefined : { scale: 1.06 }}
          data-cursor
        >
          {t}
        </motion.li>
      ))}
    </ul>
  );
}
