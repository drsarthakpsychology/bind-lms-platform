import { Minus, Plus } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";

import { IconButton, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { layout, space, useTheme } from "@/theme";

/** A number with − and + (44px each), for seats, leaves and cases. Also adjustable with a screen reader. */
export function Stepper({ value, onChange, min = 0, max = 99, label, testID, small }: { value: number; onChange: (n: number) => void; min?: number; max?: number; label: string; testID?: string; small?: boolean }) {
  const c = useTheme();
  const set = (n: number) => {
    const v = Math.max(min, Math.min(max, n));
    if (v !== value) {
      haptic.select();
      onChange(v);
    }
  };
  return (
    <View
      testID={testID}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ min, max, now: value }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(e) => set(value + (e.nativeEvent.actionName === "increment" ? 1 : -1))}
      style={{ flexDirection: "row", alignItems: "center", gap: small ? 0 : space[1] }}
    >
      <IconButton label={`${label}: one less`} onPress={() => set(value - 1)} testID={testID ? `${testID}-minus` : undefined}>
        <Minus size={18} color={value <= min ? c.faint : c.ink} />
      </IconButton>
      <T v={small ? "bodyStrong" : "h3"} num center style={{ minWidth: small ? 24 : 36 }} testID={testID ? `${testID}-value` : undefined}>
        {value}
      </T>
      <IconButton label={`${label}: one more`} onPress={() => set(value + 1)} testID={testID ? `${testID}-plus` : undefined}>
        <Plus size={18} color={value >= max ? c.faint : c.ink} />
      </IconButton>
    </View>
  );
}

/** Pick one of a few words (a weekday, a kind, a batch): 44px chips that wrap. */
export function Pills<V extends string>({ options, value, onChange, label, testID }: { options: { id: V; name: string }[]; value: V | null; onChange: (v: V) => void; label: string; testID?: string }) {
  const c = useTheme();
  return (
    <View style={{ gap: space[2] }}>
      <T v="small">{label}</T>
      <View accessibilityRole="radiogroup" accessibilityLabel={label} style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
        {options.map((o) => {
          const on = o.id === value;
          return (
            <Pressable
              key={o.id}
              testID={testID ? `${testID}-${o.id}` : undefined}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              onPress={() => {
                haptic.select();
                onChange(o.id);
              }}
              style={({ pressed }) => ({ minHeight: 44, minWidth: 44, paddingHorizontal: space[3], borderRadius: 22, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: on ? c.link : c.cardLine, backgroundColor: on ? c.pill : pressed ? c.tint : "transparent" })}
            >
              <T v="small" style={{ color: on ? c.link : c.ink }}>
                {o.name}
              </T>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** Many of a few (cohorts): the same chips, each toggles. */
export function MultiPills({ options, value, onChange, label, testID }: { options: { id: string; name: string }[]; value: string[]; onChange: (v: string[]) => void; label: string; testID?: string }) {
  const c = useTheme();
  return (
    <View style={{ gap: space[2] }}>
      <T v="small">{label}</T>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
        {options.map((o) => {
          const on = value.includes(o.id);
          return (
            <Pressable
              key={o.id}
              testID={testID ? `${testID}-${o.id}` : undefined}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              onPress={() => {
                haptic.select();
                onChange(on ? value.filter((x) => x !== o.id) : [...value, o.id]);
              }}
              style={({ pressed }) => ({ minHeight: 44, paddingHorizontal: space[3], borderRadius: 22, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: on ? c.link : c.cardLine, backgroundColor: on ? c.pill : pressed ? c.tint : "transparent" })}
            >
              <T v="small" style={{ color: on ? c.link : c.ink }}>
                {o.name}
              </T>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** A label on the left and a part on the right, one line tall (a stepper, a switch). */
export function LineRow({ label, meta, children, testID }: { label: string; meta?: string; children: React.ReactNode; testID?: string }) {
  const c = useTheme();
  return (
    <View testID={testID} style={{ minHeight: layout.row, flexDirection: "row", alignItems: "center", gap: space[3], borderTopWidth: 1, borderColor: c.hairline, paddingVertical: space[1] }}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <T v="bodyStrong">{label}</T>
        {meta ? (
          <T v="small" tone="muted">
            {meta}
          </T>
        ) : null}
      </View>
      {children}
    </View>
  );
}
