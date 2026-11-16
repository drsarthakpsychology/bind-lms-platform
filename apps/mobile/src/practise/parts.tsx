import { Check } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";

import { OptionRow, T } from "@/ds";
import { Feel } from "./fx";
import { haptic } from "@/lib/haptics";
import { layout, space, useTheme } from "@/theme";
import type { CaseMark } from "./types";

/** The word for a case mark, for the meta line and screen readers. */
export function markWord(tag: CaseMark, count?: number): string {
  return tag === "new" ? (count && count > 1 ? `${count} new` : "New") : tag === "week" ? "This week" : tag === "done" ? "Done" : "Half way";
}

/**
 * A case mark at the row's right edge, drawn small: a blue dot for new, a
 * tick for done, an open ring for half way, nothing for this week (its word
 * goes in the meta line). Never a pill, never a button.
 */
export function Tag({ tag, count, testID }: { tag: CaseMark; count?: number; testID?: string }) {
  const c = useTheme();
  const label = markWord(tag, count);
  const mark =
    tag === "new" ? (
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.dark ? c.sk.blue : c.brand }} />
    ) : tag === "done" ? (
      <Check size={18} color={c.successFg} strokeWidth={2.5} />
    ) : tag === "started" ? (
      <View style={{ width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: c.link }} />
    ) : null;
  if (!mark) return null;
  return (
    <View testID={testID} accessible accessibilityLabel={label} style={{ width: 20, alignItems: "center", justifyContent: "center", alignSelf: "center" }}>
      {mark}
    </View>
  );
}

/** An answer row (A, B, C...): the letter pops when it is chosen or marked, the tick draws on, a wrong one shakes (all in OptionRow). */
export function AnswerRow(props: React.ComponentProps<typeof OptionRow>) {
  return <OptionRow {...props} />;
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
