import * as React from "react";
import { View, type LayoutChangeEvent } from "react-native";

import { haptic } from "@/lib/haptics";
import { layout, useTheme } from "@/theme";

/**
 * A slider: drag or tap along the line. 48px tall touch area, a 6px line,
 * a 24px thumb. Steps give a light tick. Screen readers can step it up and down.
 */
export function Slider({ value, min, max, step = 1, onChange, label, format = String, disabled, testID }: { value: number; min: number; max: number; step?: number; onChange: (v: number) => void; label: string; format?: (v: number) => string; disabled?: boolean; testID?: string }) {
  const c = useTheme();
  const [w, setW] = React.useState(1);
  const pct = max > min ? (value - min) / (max - min) : 0;
  const snap = (x: number) => {
    const raw = min + Math.max(0, Math.min(1, x / w)) * (max - min);
    return Math.max(min, Math.min(max, Math.round(raw / step) * step));
  };
  const set = (v: number) => {
    if (v !== value) {
      haptic.select();
      onChange(v);
    }
  };
  return (
    <View
      testID={testID}
      onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width || 1)}
      onStartShouldSetResponder={() => !disabled}
      onMoveShouldSetResponder={() => !disabled}
      onResponderTerminationRequest={() => false}
      onResponderGrant={(e) => set(snap(e.nativeEvent.locationX))}
      onResponderMove={(e) => set(snap(e.nativeEvent.locationX))}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ min, max, now: value, text: format(value) }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(e) => set(Math.max(min, Math.min(max, value + (e.nativeEvent.actionName === "increment" ? step : -step))))}
      style={{ height: layout.target, justifyContent: "center", opacity: disabled ? 0.6 : 1 }}
    >
      <View pointerEvents="none" style={{ height: 6, borderRadius: 3, backgroundColor: c.hairline }}>
        <View style={{ width: `${pct * 100}%`, height: 6, borderRadius: 3, backgroundColor: c.dark ? c.primary : c.ink }} />
        <View style={{ position: "absolute", left: `${pct * 100}%`, top: -9, width: 24, height: 24, marginLeft: -12, borderRadius: 12, backgroundColor: c.card, borderWidth: 2, borderColor: c.dark ? c.primary : c.ink }} />
      </View>
    </View>
  );
}
