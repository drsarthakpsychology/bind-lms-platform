import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { Pressable, View } from "react-native";

import { LoadError, RowsSkeleton, Screen, T } from "@/ds";
import { layout, space, useTheme } from "@/theme";
import { useMedicinePage } from "./list";
import { ClassMark } from "./marks";
import type { HalfLife, Mechanism, Med } from "./meds";

type Side = { med: Med; mech: Mechanism | null; half: HalfLife | null };

/** The facts that matter when choosing between two medicines, in the page's order. */
function rowsOf(s: Side): [string, string[]][] {
  const m = s.med;
  const usual = m.doses[m.defaultDose] ?? m.doses[0];
  return [
    ["Used for", m.uses],
    ["Usual dose", usual ? [`${usual.amount}: ${usual.label}`] : []],
    ["Common side effects", m.common],
    ["What to check", m.checks],
    ["Serious", m.serious],
    ["Half-life", s.half ? [s.half.hl] : []],
    ["How it works", s.mech ? [s.mech.plain] : []],
  ];
}

/**
 * Two medicines side by side, fact by fact. On a phone each fact is a row
 * with the two medicines one under the other, each with its class mark, so
 * nothing is squeezed into half a screen.
 */
export function CompareScreen() {
  const c = useTheme();
  const p = useLocalSearchParams<{ a?: string; b?: string }>();
  const qa = useMedicinePage(String(p.a ?? ""));
  const qb = useMedicinePage(String(p.b ?? ""));
  if (qa.isError || qb.isError) return <Screen title="Compare"><LoadError what="these medicines" onRetry={() => { void qa.refetch(); void qb.refetch(); }} /></Screen>;
  if (!qa.data || !qb.data) return <Screen title="Compare"><RowsSkeleton rows={8} /></Screen>;
  const sides: Side[] = [qa.data, qb.data].map((d) => ({ med: d.med as unknown as Med, mech: d.mechanism as Mechanism | null, half: d.halfLife as HalfLife | null }));
  const rows = sides.map(rowsOf);
  return (
    <Screen testID="compare" title={`${sides[0]!.med.name} and ${sides[1]!.med.name}`} gap={space[6]}>
      <View style={{ flexDirection: "row", gap: space[3] }}>
        {sides.map((s) => (
          <Pressable key={s.med.id} accessibilityRole="button" accessibilityLabel={`Open ${s.med.name}`} onPress={() => router.push(`/medicine/${encodeURIComponent(s.med.id)}`)} style={({ pressed }) => ({ flex: 1, minHeight: layout.row, padding: space[3], gap: space[1], borderRadius: layout.radius, borderWidth: 1.5, borderColor: c.cardLine, backgroundColor: pressed ? c.tint : c.card })}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
              <ClassMark group={s.med.group} />
              <T v="caption" tone="muted" style={{ flex: 1 }} numberOfLines={2}>
                {s.med.cls}
              </T>
            </View>
            <T v="bodyStrong">{s.med.name}</T>
          </Pressable>
        ))}
      </View>
      {rows[0]!.map(([label], i) => (
        <View key={label} style={{ gap: space[3] }} testID={`compare-${i}`}>
          <T v="h3">{label}</T>
          {sides.map((s, k) => {
            const items = rows[k]![i]![1];
            return (
              <View key={s.med.id} style={{ flexDirection: "row", gap: space[3] }}>
                <View style={{ paddingTop: 6 }}>
                  <ClassMark group={s.med.group} size={10} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <T v="caption" tone="muted">
                    {s.med.name.toUpperCase()}
                  </T>
                  {items.length ? items.map((t, j) => <T key={j}>{t}</T>) : <T tone="muted">Not listed</T>}
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </Screen>
  );
}
