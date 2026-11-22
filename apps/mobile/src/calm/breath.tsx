import * as React from "react";
import { useWindowDimensions, View } from "react-native";
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming, type SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, Chips, Label, Layer, SwitchRow, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { BackBar, OwnHeader } from "@/lab/shell";
import { curves, GrowIn } from "@/motion";
import { fonts, layout, space, useLightStatusBar, useTheme } from "@/theme";
import { PATTERNS, phaseAt, type PatternId } from "./data";

const REST = 0.3;

/**
 * The breathing pebble: a hand-shaped stone on the field that grows as you
 * breathe in, stays while you hold, and settles as you breathe out. Two soft
 * halos follow it. One shared value, transform and opacity only, on the UI
 * thread. With Reduce Motion it stays still and the words and the count carry
 * the exercise.
 */
export function BreathPebble({ p, live, word, count, size = 232 }: { p: SharedValue<number>; live: boolean; word: string; count?: number | null; size?: number }) {
  const c = useTheme();
  const core = useAnimatedStyle(() => ({ transform: [{ scale: 0.6 + 0.4 * p.value }] }));
  const halo1 = useAnimatedStyle(() => ({ opacity: 0.16 + 0.2 * p.value, transform: [{ scale: 0.7 + 0.42 * p.value }] }));
  const halo2 = useAnimatedStyle(() => ({ opacity: 0.08 + 0.14 * p.value, transform: [{ scale: 0.8 + 0.5 * p.value }] }));
  const shape = { borderTopLeftRadius: size * 0.46, borderTopRightRadius: size * 0.54, borderBottomRightRadius: size * 0.47, borderBottomLeftRadius: size * 0.52 };
  const fg = live ? c.onLime : c.onField;
  return (
    <View testID="breath-pebble" accessible accessibilityRole="timer" accessibilityLiveRegion="polite" accessibilityLabel={count ? `${word}, ${count}` : word} style={{ width: size * 1.3, height: size * 1.3, alignItems: "center", justifyContent: "center" }}>
      <Animated.View pointerEvents="none" style={[{ position: "absolute", width: size, height: size, backgroundColor: c.onField }, shape, halo2]} />
      <Animated.View pointerEvents="none" style={[{ position: "absolute", width: size, height: size, backgroundColor: c.onField }, shape, halo1]} />
      <Animated.View style={[{ position: "absolute", width: size, height: size, backgroundColor: live ? c.lime : c.fieldTint }, shape, core]} />
      {/* The words do not scale with the pebble: reading text stays still. */}
      <View style={{ alignItems: "center", gap: 2 }}>
        <T maxFontSizeMultiplier={1.2} style={{ fontFamily: fonts.h1, fontSize: 21, lineHeight: 25, color: fg }}>
          {word}
        </T>
        {count ? (
          <T num maxFontSizeMultiplier={1.2} style={{ fontFamily: fonts.big, fontSize: 34, lineHeight: 38, color: fg }}>
            {count}
          </T>
        ) : null}
      </View>
    </View>
  );
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.max(0, s % 60)).padStart(2, "0")}`;

/** Guided breathing: choose a pattern and a length, then follow the pebble. */
export function BreathingScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const reduce = !!useReducedMotion();
  const { height } = useWindowDimensions();
  useLightStatusBar(true);
  const [pattern, setPattern] = React.useState<PatternId>("box");
  const [minutes, setMinutes] = React.useState<"1" | "2" | "3" | "5">("2");
  const [ticks, setTicks] = React.useState(false);
  const [state, setState] = React.useState<"ready" | "running" | "done">("ready");
  const [now, setNow] = React.useState({ index: 0, left: 0, elapsed: 0 });
  const p = useSharedValue(REST);
  const total = Number(minutes) * 60;
  const phases = PATTERNS[pattern].phases;

  // The clock: a light timer that only tells React when the second or the phase changes.
  React.useEffect(() => {
    if (state !== "running") return;
    const start = Date.now();
    const id = setInterval(() => {
      const t = (Date.now() - start) / 1000;
      if (t >= total) {
        setState("done");
        return;
      }
      const at = phaseAt(pattern, t);
      const elapsed = Math.floor(t);
      setNow((n) => (n.index === at.index && n.left === at.left && n.elapsed === elapsed ? n : { ...at, elapsed }));
    }, 200);
    return () => clearInterval(id);
  }, [state, pattern, total]);

  // The pebble: one long, soft move per phase, handed to the UI thread once.
  const phase = phases[now.index] ?? phases[0]!;
  React.useEffect(() => {
    if (state !== "running") {
      cancelAnimation(p);
      p.set(reduce ? REST : withTiming(REST, { duration: 900, easing: curves.out }));
      return;
    }
    if (ticks && !reduce) haptic.select();
    if (reduce || phase.label === "Hold") return;
    p.set(withTiming(phase.to, { duration: phase.secs * 1000, easing: Easing.inOut(Easing.sin) }));
    // One run per phase change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, now.index, pattern]);

  const start = () => {
    setNow({ index: 0, left: phases[0]!.secs, elapsed: 0 });
    setState("running");
  };
  const word = state === "running" ? phase.label : state === "done" ? "Well done" : "Ready";

  return (
    <GrowIn style={{ backgroundColor: c.field }}>
      <OwnHeader />
      <View testID="calm-breathing" style={{ flex: 1, paddingTop: insets.top }}>
        <BackBar home="/calm" />
        <View style={{ flex: 1, minHeight: 260, alignItems: "center", justifyContent: "center", gap: space[3], paddingBottom: space[5] }}>
          <BreathPebble p={p} live={state === "running"} word={word} count={state === "running" ? now.left : null} size={Math.max(150, Math.min(232, Math.round(height * 0.27)))} />
          <T v="small" tone="onFieldMuted" center style={{ paddingHorizontal: layout.gutter }}>
            {state === "running" ? `${clock(total - now.elapsed)} left` : state === "done" ? "Notice how your body feels now." : PATTERNS[pattern].note}
          </T>
        </View>
        <Layer style={{ flexGrow: 0, flexShrink: 0, flexBasis: "auto", marginTop: 0, paddingBottom: insets.bottom + space[4], gap: space[4] }}>
          {state === "running" ? (
            <Button kind="quiet" label="Stop" testID="breath-stop" onPress={() => setState("ready")} />
          ) : (
            <>
              <View style={{ gap: space[2] }}>
                <Label>Pattern</Label>
                <Chips label="Breathing pattern" value={pattern} onChange={setPattern} options={(["box", "478", "slow"] as PatternId[]).map((id) => ({ id, name: PATTERNS[id].label }))} />
              </View>
              <View style={{ gap: space[2] }}>
                <Label>How long</Label>
                <Chips label="Minutes" value={minutes} onChange={setMinutes} options={(["1", "2", "3", "5"] as const).map((id) => ({ id, name: `${id} min` }))} />
              </View>
              {reduce ? null : <SwitchRow testID="breath-ticks" title="A gentle tick at each change" value={ticks} onChange={setTicks} />}
              <Button label={state === "done" ? "Go again" : "Start"} testID="breath-start" onPress={start} />
            </>
          )}
        </Layer>
      </View>
    </GrowIn>
  );
}
