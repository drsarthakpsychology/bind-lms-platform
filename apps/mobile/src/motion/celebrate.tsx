import * as React from "react";
import { useReducedMotion } from "react-native-reanimated";

import { haptic } from "@/lib/haptics";
import { beats } from "./tokens";

/** One beat of a celebration: run `run` `at` ms after the start. */
export type Beat = { at: number; run: () => void; /** Movement only (particles): skipped with Reduce Motion. */ motion?: boolean };

/**
 * What a moment has to show. Give only the parts it uses; `win` decides the
 * haptic and whether particles may play at all (a loss never gets success
 * haptics or particles, budget rule 5).
 */
export type Moment = {
  win: boolean;
  /** The score or badge lands (start a RollingNumber, a Stamp). */
  result?: () => void;
  /** Particles: bump a PixelBurst `fire` counter, show Confetti. Wins only. */
  particles?: () => void;
  /** The reaction sticker slaps in. */
  sticker?: () => void;
  /** The stats rise in. */
  stats?: () => void;
  /** Override the haptic (default: success on a win, warn on a loss). Pass null for none. */
  haptic?: (() => void) | null;
};

/** The beats of a moment, in the one order every win uses (see `beats`). */
export function momentBeats(m: Moment): Beat[] {
  const out: Beat[] = [];
  if (m.result) out.push({ at: beats.result, run: m.result });
  const h = m.haptic === undefined ? (m.win ? haptic.success : haptic.warn) : m.haptic;
  if (h) out.push({ at: beats.haptic, run: h });
  if (m.win && m.particles) out.push({ at: beats.particles, run: m.particles, motion: true });
  if (m.sticker) out.push({ at: beats.sticker, run: m.sticker });
  if (m.stats) out.push({ at: beats.stats, run: m.stats });
  return out;
}

/**
 * A small sequencer so every celebration has one cause and one order: the
 * result lands, then the haptic, then particles, then the sticker, then the
 * stats. Timers are JS (each step changes React state or fires a haptic,
 * which happens on the JS thread anyway); all of them are cancelled on
 * unmount or when a new moment starts. Reduce Motion: same order and
 * haptic, no particles, the rest 0ms apart.
 *
 *   const celebrate = useCelebrate();
 *   React.useEffect(() => { if (done) celebrate({ win: allRight, result: () => setShown(true), particles: () => setFire((n) => n + 1), stats: () => setStats(true) }); }, [done]);
 *
 * Returns the function; it takes a `Moment` or a raw list of `Beat`s.
 */
export function useCelebrate(): (m: Moment | Beat[]) => void {
  const reduce = useReducedMotion();
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  const clear = React.useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  React.useEffect(() => clear, [clear]);
  return React.useCallback(
    (m: Moment | Beat[]) => {
      clear();
      const list = Array.isArray(m) ? m : momentBeats(m);
      for (const b of [...list].sort((a, z) => a.at - z.at)) {
        if (reduce && b.motion) continue;
        const go = () => {
          try {
            b.run();
          } catch {
            // A failing step never stops the rest of the moment.
          }
        };
        if (reduce || b.at <= 0) go();
        else timers.current.push(setTimeout(go, b.at));
      }
    },
    [reduce, clear],
  );
}
