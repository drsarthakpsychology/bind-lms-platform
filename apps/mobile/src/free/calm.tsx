import * as React from "react";
import { View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from "react-native-reanimated";

import { Button, Chips, Screen, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { space, useTheme } from "@/theme";
import { CrisisLine } from "./screens";

/** The website's breathing patterns (src/components/free/calm-tools.tsx). */
export const PATTERNS = {
  box: { label: "Box breathing", note: "In 4 · hold 4 · out 4 · hold 4", phases: [["Breathe in", 4], ["Hold", 4], ["Breathe out", 4], ["Hold", 4]] },
  "478": { label: "4-7-8", note: "In 4 · hold 7 · out 8", phases: [["Breathe in", 4], ["Hold", 7], ["Breathe out", 8]] },
  slow: { label: "Slow breathing", note: "In 5 · out 5", phases: [["Breathe in", 5], ["Breathe out", 5]] },
} as const satisfies Record<string, { label: string; note: string; phases: readonly (readonly [string, number])[] }>;
export type PatternId = keyof typeof PATTERNS;

/** Where `t` seconds falls in a pattern: which phase and how many whole seconds are left in it. */
export function phaseAt(pattern: PatternId, t: number): { phase: number; left: number } {
  const phases = PATTERNS[pattern].phases;
  const cycle = phases.reduce((a, p) => a + p[1], 0);
  let within = ((t % cycle) + cycle) % cycle;
  let k = 0;
  while (k < phases.length - 1 && within >= phases[k]![1]) {
    within -= phases[k]![1];
    k++;
  }
  return { phase: k, left: Math.max(1, Math.ceil(phases[k]![1] - within)) };
}

/**
 * Guided breathing, as the website's /free/calm/breathing: follow the circle.
 * The circle grows on the in-breath and shrinks on the out-breath on the UI
 * thread; with Reduce Motion on it stays still and the words lead.
 */
export function BreathingScreen() {
  const c = useTheme();
  const reduce = useReducedMotion();
  const [pattern, setPattern] = React.useState<PatternId>("box");
  const [minutes, setMinutes] = React.useState(3);
  const [running, setRunning] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [tick, setTick] = React.useState({ phase: 0, left: 0, elapsed: 0 });
  const scale = useSharedValue(0.75);

  React.useEffect(() => {
    if (!running) return;
    const start = Date.now();
    const step = () => {
      const t = (Date.now() - start) / 1000;
      if (t >= minutes * 60) {
        setRunning(false);
        setDone(true);
        haptic.success();
        return;
      }
      setTick({ ...phaseAt(pattern, t), elapsed: Math.floor(t) });
    };
    step();
    const id = setInterval(step, 250);
    return () => clearInterval(id);
  }, [running, pattern, minutes]);

  const phases = PATTERNS[pattern].phases;
  const [label, secs] = phases[tick.phase] ?? phases[0];
  const big = label === "Breathe in" || (label === "Hold" && phases[tick.phase - 1]?.[0] === "Breathe in");

  React.useEffect(() => {
    if (reduce) return;
    const to = !running ? 0.75 : big ? 1.15 : 0.6;
    scale.value = withTiming(to, { duration: running && label !== "Hold" ? secs * 1000 : 600, easing: Easing.inOut(Easing.quad) });
  }, [running, big, label, secs, reduce, scale]);

  const orb = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const remaining = minutes * 60 - tick.elapsed;

  return (
    <Screen title="Guided breathing" lead="Follow the circle." testID="free-breathing" footer={<Button label={running ? "Stop" : done ? "Again" : "Start"} kind={running ? "quiet" : "primary"} onPress={() => { setDone(false); setTick({ phase: 0, left: 0, elapsed: 0 }); setRunning(!running); }} testID="breathing-go" />}>
      <View style={{ alignItems: "center", gap: space[4], paddingVertical: space[4] }} accessibilityLiveRegion="polite">
        <Animated.View style={[{ width: 200, height: 200, borderRadius: 100, backgroundColor: c.tint, borderWidth: 2, borderColor: c.link, alignItems: "center", justifyContent: "center" }, orb]}>
          <T v="display" num testID="breathing-count">
            {running ? String(tick.left) : done ? "Done" : "Ready"}
          </T>
        </Animated.View>
        <T v="h3" testID="breathing-phase">
          {running ? label : done ? "Well done." : PATTERNS[pattern].note}
        </T>
        {running ? (
          <T v="small" tone="muted">
            {`${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")} left`}
          </T>
        ) : done ? (
          <T v="small" tone="muted">
            Notice how your body feels now compared with when you started.
          </T>
        ) : null}
      </View>
      {!running ? (
        <View style={{ gap: space[3] }}>
          <Chips label="Pattern" options={(Object.keys(PATTERNS) as PatternId[]).map((p) => ({ id: p, name: PATTERNS[p].label }))} value={pattern} onChange={setPattern} />
          <Chips label="How long" options={[1, 3, 5].map((m) => ({ id: String(m), name: `${m} min` }))} value={String(minutes)} onChange={(v) => setMinutes(Number(v))} />
        </View>
      ) : null}
      <CrisisLine />
    </Screen>
  );
}
