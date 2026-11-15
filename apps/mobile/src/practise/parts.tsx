import * as React from "react";
import { Pressable, View } from "react-native";

import { OptionRow, T } from "@/ds";
import { Feel } from "./fx";
import { haptic } from "@/lib/haptics";
import { layout, space, useTheme } from "@/theme";
import type { CaseMark } from "./types";

/** A status tag: a small pill that says what something is (Done, New, This week, Carry on). Never a button. */
export function Tag({ tag, count, testID }: { tag: CaseMark; count?: number; testID?: string }) {
  const c = useTheme();
  const label = tag === "new" ? (count && count > 1 ? `${count} new` : "New") : tag === "week" ? "This week" : tag === "done" ? "Done" : "Carry on";
  const style =
    tag === "new"
      ? { backgroundColor: c.brand, borderColor: c.brand, color: c.onBrand }
      : tag === "done"
        ? { backgroundColor: c.successBg, borderColor: c.successBg, color: c.successFg }
        : tag === "started"
          ? { backgroundColor: "transparent", borderColor: c.ink, color: c.ink }
          : { backgroundColor: "transparent", borderColor: c.cardLine, color: c.ink };
  return (
    <View testID={testID} accessible accessibilityLabel={label} style={{ minHeight: 24, paddingHorizontal: space[2], borderRadius: 12, borderWidth: 1.5, borderColor: style.borderColor, backgroundColor: style.backgroundColor, justifyContent: "center", alignSelf: "center" }}>
      <T v="caption" style={{ color: style.color }} num>
        {label}
      </T>
    </View>
  );
}

/** An answer row (A, B, C...) that pops when it turns right and shakes when it turns wrong. */
export function AnswerRow(props: React.ComponentProps<typeof OptionRow>) {
  return (
    <Feel state={props.state ?? "idle"}>
      <OptionRow {...props} />
    </Feel>
  );
}

/** A big tappable answer tile (a word, a card, a door option) with on, right and wrong states. */
export function Tile({ text, onPress, state = "idle", disabled, testID, lines, children, accessibilityLabel }: { text?: string; onPress?: () => void; state?: "idle" | "on" | "right" | "wrong" | "dim" | "gone"; disabled?: boolean; testID?: string; lines?: number; children?: React.ReactNode; accessibilityLabel?: string }) {
  const c = useTheme();
  const border = state === "on" ? c.ink : state === "right" ? (c.dark ? c.primary : c.ink) : state === "wrong" ? c.danger : c.cardLine;
  const bg = state === "right" ? c.successBg : state === "wrong" ? c.alertBg : state === "on" ? c.tint : state === "gone" ? c.tint : "transparent";
  return (
    <Feel state={state}>
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? text}
      accessibilityState={{ selected: state === "on", disabled: !!disabled }}
      disabled={disabled}
      onPress={() => {
        haptic.select();
        onPress?.();
      }}
      style={({ pressed }) => ({ minHeight: layout.row, justifyContent: "center", paddingHorizontal: space[4], paddingVertical: space[3], borderRadius: layout.radius, borderWidth: state === "idle" || state === "dim" || state === "gone" ? 1.5 : 2, borderColor: border, backgroundColor: pressed && !disabled ? c.tint : bg, opacity: state === "dim" ? 0.55 : state === "gone" ? 0.45 : 1, transform: [{ scale: pressed && !disabled ? 0.98 : 1 }] })}
    >
      {children ?? (
        <T v="body" numberOfLines={lines}>
          {text}
        </T>
      )}
    </Pressable>
    </Feel>
  );
}

/** A quiet block of story text: the patient, the setting, the clue. No box; a thin rule on the left. */
export function Story({ kicker, children }: { kicker?: string; children: React.ReactNode }) {
  const c = useTheme();
  return (
    <View style={{ gap: space[2], borderLeftWidth: 3, borderColor: c.brand, paddingLeft: space[4] }}>
      {kicker ? (
        <T v="caption" tone="muted">
          {kicker.toUpperCase()}
        </T>
      ) : null}
      {children}
    </View>
  );
}

/** "A", "B", "C" for option n. */
export const letter = (n: number) => String.fromCharCode(65 + n);
