import * as React from "react";
import { View } from "react-native";
import Animated, { Easing, cancelAnimation, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from "react-native-reanimated";

import { Button, Screen, Section, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { fonts, space, useTheme } from "@/theme";

const STEPS = [
  { name: "Breathe in", to: 1 },
  { name: "Hold", to: 1 },
  { name: "Breathe out", to: 0.55 },
  { name: "Hold", to: 0.55 },
] as const;
const SECONDS = 4;

/**
 * Free tools: box breathing. A circle grows as you breathe in, rests, shrinks
 * as you breathe out, rests. Four seconds each. Nothing is stored.
 */
export function ToolsScreen() {
  const c = useTheme();
  const reduce = useReducedMotion();
  const [running, setRunning] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [count, setCount] = React.useState(SECONDS);
  const [rounds, setRounds] = React.useState(0);
  const size = useSharedValue(0.55);
  const ring = useAnimatedStyle(() => ({ transform: [{ scale: size.value }] }));

  React.useEffect(() => {
    if (!running) return;
    const s = STEPS[step]!;
    if (!reduce) size.set(withTiming(s.to, { duration: SECONDS * 1000, easing: Easing.inOut(Easing.quad) }));
    const id = setInterval(() => {
      setCount((n) => {
        if (n > 1) return n - 1;
        haptic.select();
        setStep((i) => {
          const next = (i + 1) % STEPS.length;
          if (next === 0) setRounds((r) => r + 1);
          return next;
        });
        return SECONDS;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, step, reduce, size]);

  const toggle = () => {
    if (running) {
      cancelAnimation(size);
      size.set(withTiming(0.55, { duration: 300 }));
      setRunning(false);
      setStep(0);
      setCount(SECONDS);
    } else {
      setRounds(0);
      setRunning(true);
    }
  };

  return (
    <Screen safeTop tab testID="tools" title="A minute to breathe" lead="Box breathing slows a racing body. Free for everyone. Nothing is stored." footer={<Button kind={running ? "quiet" : "primary"} label={running ? "Stop" : "Start"} onPress={toggle} testID="breathe-toggle" />}>
      <View style={{ alignItems: "center", justifyContent: "center", height: 280 }}>
        <Animated.View style={[{ position: "absolute", width: 240, height: 240, borderRadius: 120, backgroundColor: c.dark ? "rgba(205,242,75,0.16)" : "rgba(29,68,216,0.10)", borderWidth: 2, borderColor: c.link }, ring]} />
        <View accessible accessibilityLiveRegion="polite" accessibilityLabel={running ? `${STEPS[step]!.name}, ${count}` : "Ready"} style={{ alignItems: "center", gap: space[1] }}>
          <T v="h2" center>
            {running ? STEPS[step]!.name : "Ready when you are"}
          </T>
          {running ? (
            <T style={{ fontFamily: fonts.pixelDigits, fontSize: 28, lineHeight: 36 }} num maxFontSizeMultiplier={1.2}>
              {String(count)}
            </T>
          ) : null}
        </View>
      </View>
      <Section title="How it works">
        <T tone="muted">Breathe in for four, hold for four, out for four, hold for four. Four rounds is enough to feel a change.</T>
        {rounds > 0 ? (
          <T v="small" tone="muted" num>
            Rounds finished: {rounds}
          </T>
        ) : null}
      </Section>
    </Screen>
  );
}
