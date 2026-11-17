/**
 * A date you pick, never type: the field shows "16 Nov 2026"; a tap opens a
 * month in a sheet. Values stay yyyy-mm-dd for the server. Drawn in code (no
 * native picker library), so it looks the same on every phone and in dark.
 */
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import Animated from "react-native-reanimated";

import { Button, Sheet, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { usePressScale } from "@/motion";
import { layout, space, type as scale, useTheme } from "@/theme";
import { day, isoDay, monthGrid, MONTH_NAMES, todayIst } from "./format";

const WEEK = ["S", "M", "T", "W", "T", "F", "S"];
const WEEK_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function DateField({ label, value, onChange, hint, error, min, optional, testID }: { label: string; value: string; onChange: (v: string) => void; hint?: string; error?: string | null; /** Days before this (yyyy-mm-dd) cannot be picked. */ min?: string; /** Offers "No date" in the sheet. */ optional?: string; testID?: string }) {
  const c = useTheme();
  const [open, setOpen] = React.useState(false);
  const { style, handlers } = usePressScale(0.98);
  const shown = value ? day(value) : "";
  return (
    <View style={{ gap: space[2] }}>
      <T v="small">{label}</T>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${shown || "not set"}`}
        accessibilityHint={error ?? "Opens a calendar"}
        onPress={() => {
          setOpen(true);
        }}
        {...handlers}
      >
        <Animated.View style={[{ flexDirection: "row", alignItems: "center", gap: space[3], minHeight: layout.primary, borderRadius: layout.radius, borderWidth: 1.5, borderColor: error ? c.danger : c.cardLine, backgroundColor: c.card, paddingHorizontal: space[4] }, style]}>
          <T style={{ flex: 1, color: shown ? c.ink : c.muted }}>{shown || optional || "Pick a date"}</T>
          <CalendarDays size={20} color={c.muted} />
        </Animated.View>
      </Pressable>
      {error ? (
        <T v="small" tone="danger" accessibilityLiveRegion="polite">
          {error}
        </T>
      ) : hint ? (
        <T v="small" tone="muted">
          {hint}
        </T>
      ) : null}
      <DateSheet
        open={open}
        title={label}
        value={value}
        min={min}
        optional={optional}
        onClose={() => setOpen(false)}
        onPick={(v) => {
          onChange(v);
          setOpen(false);
        }}
        testID={testID ? `${testID}-sheet` : undefined}
      />
    </View>
  );
}

function DateSheet({ open, title, value, min, optional, onClose, onPick, testID }: { open: boolean; title: string; value: string; min?: string; optional?: string; onClose: () => void; onPick: (v: string) => void; testID?: string }) {
  const c = useTheme();
  const today = todayIst();
  // Only a real yyyy-mm-dd opens on its month: anything else (a time, an old
  // value from the server) made Array(NaN) in monthGrid, which throws.
  const day10 = (v?: string) => (v && /^\d{4}-\d{2}-\d{2}/.test(v) ? v.slice(0, 10) : "");
  const start = day10(value) || (day10(min) && day10(min) > today ? day10(min) : today);
  const [ym, setYm] = React.useState({ y: Number(start.slice(0, 4)), m: Number(start.slice(5, 7)) - 1 });
  // Opening again starts on the month of the current value.
  const [wasOpen, setWasOpen] = React.useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setYm({ y: Number(start.slice(0, 4)), m: Number(start.slice(5, 7)) - 1 });
  }
  const step = (d: number) => {
    setYm(({ y, m }) => {
      const n = m + d;
      return { y: y + Math.floor(n / 12), m: ((n % 12) + 12) % 12 };
    });
  };
  const cells = monthGrid(ym.y, ym.m);
  const nav = { width: layout.target, height: layout.target, alignItems: "center" as const, justifyContent: "center" as const, borderRadius: 22 };
  return (
    <Sheet open={open} onClose={onClose} title={title} testID={testID}>
      <View style={{ gap: space[3] }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable accessibilityRole="button" accessibilityLabel="Month before" onPress={() => step(-1)} style={({ pressed }) => [nav, { backgroundColor: pressed ? c.tint : "transparent" }]} testID="date-prev">
            <ChevronLeft size={22} color={c.ink} />
          </Pressable>
          <T v="bodyStrong" style={{ flex: 1, textAlign: "center" }} accessibilityLiveRegion="polite" testID="date-month">
            {`${MONTH_NAMES[ym.m]} ${ym.y}`}
          </T>
          <Pressable accessibilityRole="button" accessibilityLabel="Month after" onPress={() => step(1)} style={({ pressed }) => [nav, { backgroundColor: pressed ? c.tint : "transparent" }]} testID="date-next">
            <ChevronRight size={22} color={c.ink} />
          </Pressable>
        </View>
        <View style={{ flexDirection: "row" }} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
          {WEEK.map((w, i) => (
            <T key={i} v="caption" tone="muted" style={{ flex: 1, textAlign: "center" }}>
              {w}
            </T>
          ))}
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {cells.map((d, i) => {
            if (!d) return <View key={i} style={{ width: `${100 / 7}%`, height: layout.target }} />;
            const iso = isoDay(ym.y, ym.m, d);
            const on = iso === value.slice(0, 10);
            const isToday = iso === today;
            const off = !!min && iso < min;
            return (
              <View key={i} style={{ width: `${100 / 7}%`, height: layout.target + 4, alignItems: "center", justifyContent: "center" }}>
                <Pressable
                  testID={`date-${iso}`}
                  accessibilityRole="button"
                  accessibilityLabel={`${WEEK_FULL[i % 7]} ${day(iso)}${isToday ? ", today" : ""}`}
                  accessibilityState={{ selected: on, disabled: off }}
                  disabled={off}
                  onPress={() => {
                    haptic.select();
                    onPick(iso);
                  }}
                  style={({ pressed }) => ({ width: layout.target, height: layout.target, borderRadius: 22, alignItems: "center", justifyContent: "center", borderWidth: isToday && !on ? 1.5 : 0, borderColor: c.cardLine, backgroundColor: on ? c.ink : pressed ? c.tint : "transparent", opacity: off ? 0.35 : 1 })}
                >
                  <T num style={{ color: on ? c.bg : c.ink, fontFamily: on || isToday ? scale.bodyStrong.fontFamily : scale.body.fontFamily }}>
                    {String(d)}
                  </T>
                </Pressable>
              </View>
            );
          })}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          {(!min || today >= min) && value !== today ? <Button kind="text" label="Today" onPress={() => onPick(today)} testID="date-today" /> : <View />}
          {optional && value ? <Button kind="text" label={optional} onPress={() => onPick("")} testID="date-clear" /> : null}
        </View>
      </View>
    </Sheet>
  );
}
