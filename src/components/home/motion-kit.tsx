"use client";

/**
 * Small, reusable motion primitives for the homepage. All transform/opacity
 * only. Reduced-motion users get the final state immediately (see the
 * `.home [data-reveal]` override in home.module.css and the `calm` checks here).
 */

import * as React from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import s from "./home.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * True when the user asked for less motion. Hydration-safe: the server
 * snapshot (and the first client render) is always "false", so the markup
 * matches; React then re-renders with the real preference.
 */
const RM_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia(RM_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
export function useCalm(): boolean {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(RM_QUERY).matches,
    () => false,
  );
}

/** True only on devices with a precise pointer (mouse / trackpad). */
export function useFinePointer(): boolean {
  const [fine, setFine] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const set = () => setFine(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return fine;
}

/* ------------------------------------------------------------- Reveal */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "p";
}) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      data-reveal
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

/* --------------------------------------------- Words rise into place */
export function SplitWords({
  text,
  className,
  delay = 0,
  stagger = 0.045,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const words = text.split(" ");
  return (
    <span ref={ref} className={className}>
      <span className={s.srOnly}>{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <React.Fragment key={i}>
            <span className={s.wordMask}>
              <motion.span
                data-reveal
                className={s.word}
                initial={{ y: "110%" }}
                animate={inView ? { y: "0%" } : undefined}
                transition={{ duration: 0.75, delay: delay + i * stagger, ease: EASE }}
              >
                {w}
              </motion.span>
            </span>
            {i < words.length - 1 ? " " : null}
          </React.Fragment>
        ))}
      </span>
    </span>
  );
}

/* ----------------------------------------------------- Section heading */
export function SectionHead({
  tag,
  title,
  accent,
  sub,
  tone = "ink",
  className,
}: {
  tag: string;
  title: string;
  accent: string;
  sub?: string;
  tone?: "ink" | "lime";
  className?: string;
}) {
  return (
    <div className={`${s.sectionHead} ${className ?? ""}`}>
      <Reveal y={12}>
        <span className={`${s.tag} ${tone === "lime" ? s.tagLime : ""}`}>{tag}</span>
      </Reveal>
      <h2 className={s.h2}>
        <SplitWords text={title} />{" "}
        <SplitWords text={accent} className={s.accent} delay={0.12} />
      </h2>
      {sub ? (
        <Reveal delay={0.2} y={16}>
          <p className={s.lede}>{sub}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------- Count up */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const calm = useCalm();
  const target = parseInt(value, 10);
  const suffix = value.replace(/^\d+/, "");
  const [shown, setShown] = React.useState(value);
  React.useEffect(() => {
    if (!inView || calm || Number.isNaN(target)) return;
    const controls = animate(0, target, {
      duration: Math.min(1.6, 0.6 + target / 300),
      ease: EASE,
      onUpdate: (v) => setShown(`${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, calm, target, suffix]);
  return (
    <span ref={ref} className={className} aria-label={value}>
      <span aria-hidden>{shown}</span>
    </span>
  );
}

/* ------------------------------------------- Marquee (scroll-reactive) */
export function Marquee({
  items,
  reverse = false,
  className,
}: {
  items: readonly string[];
  reverse?: boolean;
  className?: string;
}) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 40, stiffness: 300 });
  const skew = useTransform(smooth, [-2500, 0, 2500], [8, 0, -8], { clamp: true });
  const row = [...items, ...items];
  return (
    <div className={className} aria-hidden>
      <motion.div className={s.marqueeSkew} style={{ skewX: skew }}>
        <div className={`${s.marqueeTrack} ${reverse ? s.marqueeReverse : ""}`}>
          {[0, 1].map((k) => (
            <span key={k} className={s.marqueeGroup}>
              {row.map((t, i) => (
                <span key={`${k}-${i}`} className={s.marqueeItem}>
                  {t}
                  <span className={s.marqueeStar}>✶</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* --------------------------------------------- Magnetic (fine pointer) */
export function Magnetic({ children, strength = 0.28 }: { children: React.ReactNode; strength?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const fine = useFinePointer();
  const calm = useCalm();
  const x = useSpring(0, { stiffness: 260, damping: 18 });
  const y = useSpring(0, { stiffness: 260, damping: 18 });
  const on = fine && !calm;
  return (
    <motion.span
      ref={ref}
      className={s.magnetic}
      style={on ? { x, y } : undefined}
      onPointerMove={(e) => {
        if (!on || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/* ------------------------------------------------ Tilt (fine pointer) */
export function Tilt({
  children,
  className,
  max = 8,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  as?: "div" | "li";
}) {
  const fine = useFinePointer();
  const calm = useCalm();
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  const on = fine && !calm;
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      style={on ? { rotateX: rx, rotateY: ry, transformPerspective: 900 } : undefined}
      onPointerMove={(e) => {
        if (!on) return;
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry.set(px * max * 2);
        rx.set(-py * max * 2);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </M>
  );
}

/* ---------------------------------------------- Parallax decoration */
export function Parallax({
  children,
  speed = 0.2,
  className,
  rotate = 0,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  rotate?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const calm = useCalm();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 100}%`, `${-speed * 100}%`]);
  const r = useTransform(scrollYProgress, [0, 1], [-rotate, rotate]);
  return (
    <motion.div ref={ref} className={className} style={calm ? undefined : { y, rotate: r }} aria-hidden>
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------- Page scroll progress */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  return <motion.div className={s.progress} style={{ scaleX }} aria-hidden />;
}

/* ---------------------------------------------- Cursor + eye tracking */
export function Cursor() {
  const fine = useFinePointer();
  const calm = useCalm();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [mode, setMode] = React.useState<"idle" | "link" | "hidden">("hidden");

  // Eyes follow the pointer on every device (touch included): pupils read
  // --ex/--ey from the document root.
  React.useEffect(() => {
    if (calm) return;
    const root = document.documentElement;
    let raf = 0;
    const move = (cx: number, cy: number) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        root.style.setProperty("--ex", ((cx / window.innerWidth) * 2 - 1).toFixed(3));
        root.style.setProperty("--ey", ((cy / window.innerHeight) * 2 - 1).toFixed(3));
      });
    };
    const onPointer = (e: PointerEvent) => move(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) move(t.clientX, t.clientY);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchstart", onTouch);
      root.style.removeProperty("--ex");
      root.style.removeProperty("--ey");
    };
  }, [calm]);

  React.useEffect(() => {
    if (!fine || calm) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as Element | null;
      setMode(t?.closest("a,button,summary,[role=tab],[data-cursor]") ? "link" : "idle");
    };
    const onLeave = () => setMode("hidden");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [fine, calm, x, y]);

  if (!fine || calm) return null;
  return (
    <>
      <motion.div className={s.cursorDot} style={{ x, y }} data-mode={mode} aria-hidden />
      <motion.div className={s.cursorRing} style={{ x: sx, y: sy }} data-mode={mode} aria-hidden />
    </>
  );
}
