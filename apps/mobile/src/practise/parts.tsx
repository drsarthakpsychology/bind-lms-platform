import { Check } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";

import Animated from "react-native-reanimated";

import { DrawMark, T } from "@/ds";
import { usePressScale } from "@/motion";
import { Rich } from "@/study/rich";
import { Feel } from "./fx";
import { haptic } from "@/lib/haptics";
import { fonts, layout, space, useTheme } from "@/theme";
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
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.accent }} />
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

type RowState = "idle" | "picked" | "right" | "wrong" | "dim";

/**
 * An answer row (A, B, C...) in the Layers look: a stone pill with its letter.
 * Picked turns ink; after checking the right one turns lime with the words
 * "Correct answer", a wrong pick turns warm with "Your answer", the rest dim.
 * It sinks under the thumb, pops when its state lands and a wrong one shakes
 * once. Colour is never the only sign.
 */
export function AnswerRow({ index, text, state = "idle", onPress, testID, disabled, note }: { index: number; text: string; state?: RowState; onPress?: () => void; testID?: string; disabled?: boolean; /** Under the text after checking: why this option is right or wrong. */ note?: string | null }) {
  const c = useTheme();
  const press = usePressScale(0.98);
  const word = state === "right" ? "Correct answer" : state === "wrong" ? "Your answer" : null;
  const bg = state === "right" ? c.lime : state === "wrong" ? c.missBg : state === "picked" ? c.ink : c.card;
  const fg = state === "right" ? c.onLime : state === "picked" ? c.bg : c.ink;
  const l = letter(index);
  return (
    <Feel state={state}>
      <Pressable
        testID={testID}
        accessibilityRole="radio"
        accessibilityState={{ selected: state === "picked" || state === "right" || state === "wrong", disabled: !!disabled }}
        accessibilityLabel={`${l}. ${text.replace(/[*`]/g, "")}${word ? `. ${word}` : ""}${note ? `. ${note}` : ""}`}
        disabled={disabled}
        {...press.handlers}
        onPress={() => {
          haptic.select();
          onPress?.();
        }}
      >
        <Animated.View style={[{ minHeight: layout.row, borderRadius: layout.radius, backgroundColor: bg, paddingVertical: space[3], paddingHorizontal: space[4], gap: space[1], opacity: state === "dim" ? 0.5 : 1 }, disabled ? null : press.style]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
            <T v="caption" style={{ width: 16, color: fg, opacity: state === "idle" || state === "dim" ? 0.6 : 0.8, fontFamily: fonts.bold }}>
              {l}
            </T>
            <Rich text={text} v="bodyStrong" style={{ flex: 1, color: fg }} />
            {state === "right" ? <DrawMark kind="tick" color={fg} size={18} /> : null}
          </View>
          {word ? (
            <T v="caption" style={{ color: fg, fontFamily: fonts.bold, paddingLeft: 16 + space[3] }}>
              {word}
            </T>
          ) : null}
          {note ? (
            <T v="small" style={{ color: fg, paddingLeft: 16 + space[3] }}>
              {note}
            </T>
          ) : null}
        </Animated.View>
      </Pressable>
    </Feel>
  );
}

/** A big tappable answer tile (a word, a card, a door option) with on, right and wrong states. A stone; ink when on. */
export function Tile({ text, onPress, state = "idle", disabled, testID, lines, children, accessibilityLabel }: { text?: string; onPress?: () => void; state?: "idle" | "on" | "right" | "wrong" | "dim" | "gone"; disabled?: boolean; testID?: string; lines?: number; children?: React.ReactNode; accessibilityLabel?: string }) {
  const c = useTheme();
  const press = usePressScale(0.98);
  const bg = state === "right" ? c.lime : state === "wrong" ? c.missBg : state === "on" ? c.ink : c.card;
  const fg = state === "right" ? c.onLime : state === "on" ? c.bg : c.ink;
  return (
    <Feel state={state}>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={`${accessibilityLabel ?? text ?? ""}${state === "right" ? ". Right" : state === "wrong" ? ". Not this one" : ""}`}
        accessibilityState={{ selected: state === "on", disabled: !!disabled }}
        disabled={disabled}
        {...press.handlers}
        onPress={() => {
          haptic.select();
          onPress?.();
        }}
      >
        <Animated.View style={[{ minHeight: layout.row, justifyContent: "center", paddingHorizontal: space[4], paddingVertical: space[3], borderRadius: layout.radius, backgroundColor: bg, opacity: state === "dim" ? 0.5 : state === "gone" ? 0.4 : 1 }, disabled ? null : press.style]}>
          <TileInk.Provider value={fg}>
            {children ?? (
              <T v="bodyStrong" numberOfLines={lines} style={{ color: fg }}>
                {text}
              </T>
            )}
          </TileInk.Provider>
        </Animated.View>
      </Pressable>
    </Feel>
  );
}

/** The text colour inside the nearest Tile (it changes when the tile turns ink or lime). */
const TileInk = React.createContext<string | null>(null);
export const useTileInk = () => React.useContext(TileInk);

/**
 * A block of story text: the patient, the setting, the clue. A stone that
 * rests on the layer, with a small quiet label. No motion inside it.
 */
export function Story({ kicker, children }: { kicker?: string; children: React.ReactNode }) {
  const c = useTheme();
  return (
    <View style={{ gap: space[2], backgroundColor: c.card, borderRadius: layout.radiusLg, padding: space[4] }}>
      {kicker ? (
        <T v="label" tone="muted">
          {kicker}
        </T>
      ) : null}
      {children}
    </View>
  );
}

/** "A", "B", "C" for option n. */
export const letter = (n: number) => String.fromCharCode(65 + n);
