import { Stack } from "expo-router";
import { BookOpen, Clock, Flame, GraduationCap, CirclePlay, Target } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type { Journey, JourneyStat } from "@/api/contract";
import { useJourney } from "@/api/learn";
import { Loaded, RowsSkeleton, Screen, T } from "@/ds";
import { Burst, Enter, ProgressRing, RollingNumber, useNewWins } from "@/motion";
import { layout, space, useTheme } from "@/theme";

/**
 * My journey (the website's /journey): your level on a ring that fills, the
 * level title, points and rank, then six numbers that roll into place. A
 * new level gets a burst, once.
 */

const ICON: Record<JourneyStat["key"], typeof Clock> = { online: Clock, lectures: CirclePlay, finished: GraduationCap, streak: Flame, points: BookOpen, practice: Target };

/** "12 h" rolls as 12 with " h" after it; words stay words. */
function StatValue({ value }: { value: string }) {
  const m = /^(\d+)(\s*\D*)$/.exec(value.replace(/\s*🔥$/, ""));
  if (!m) return <T v="h2">{value}</T>;
  return <RollingNumber value={Number(m[1])} suffix={m[2] ?? ""} v="h2" />;
}

function StatTile({ s, i }: { s: JourneyStat; i: number }) {
  const c = useTheme();
  const Icon = ICON[s.key];
  return (
    <Enter i={i + 2} style={{ flexBasis: "47%", flexGrow: 1 }}>
      <View testID={`journey-${s.key}`} accessible accessibilityLabel={`${s.label}: ${s.value}${s.sub ? `, ${s.sub}` : ""}`} style={{ borderRadius: layout.radius, borderWidth: 1.5, borderColor: c.cardLine, backgroundColor: c.card, padding: space[4], gap: space[1], minHeight: 112 }}>
        <Icon size={20} color={c.muted} />
        <View style={{ paddingTop: space[2] }}>
          <StatValue value={s.key === "streak" && s.value === "None yet" ? "0" : s.value} />
        </View>
        <T v="bodyStrong">{s.label}</T>
        {s.sub ? (
          <T v="caption" tone="muted">
            {s.sub}
          </T>
        ) : null}
      </View>
    </Enter>
  );
}

export function JourneyBody({ j }: { j: Journey }) {
  const c = useTheme();
  const pct = Math.round(j.levelPct * 100);
  const levelUp = useNewWins("journey-level", j.level > 1 ? [`level-${j.level}`] : null);
  return (
    <>
      <Enter i={0}>
        <View testID="journey-level" accessible accessibilityLabel={`Level ${j.level}, ${j.title}. ${pct}% of the way to the next level.`} style={{ borderRadius: layout.radius + 4, backgroundColor: c.brand, padding: space[5], flexDirection: "row", alignItems: "center", gap: space[4] }}>
          <View>
            <ProgressRing pct={pct} size={84} stroke={7} color={c.primary} track="rgba(255,255,255,0.25)" label={`${pct}% to the next level`}>
              <View style={{ alignItems: "center" }}>
                <T v="caption" tone="onBrand">
                  LEVEL
                </T>
                <RollingNumber value={j.level} v="h1" tone="onBrand" />
              </View>
            </ProgressRing>
            <Burst fire={levelUp} reach={52} />
          </View>
          <View style={{ flex: 1, gap: space[1] }}>
            <T v="h3" tone="onBrand">
              {j.title || "Curious Mind"}
            </T>
            {j.points !== null ? (
              <T v="small" tone="onBrand">
                {j.points} points{j.rank ? ` · #${j.rank} on the leaderboard` : ""}
              </T>
            ) : null}
            <T v="caption" tone="onBrand" num>
              {pct}% to level {j.level + 1}
            </T>
          </View>
        </View>
      </Enter>
      <Enter i={1}>
        <T v="h2">How far you have come</T>
      </Enter>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[3] }}>
        {j.stats.map((s, i) => (
          <StatTile key={s.key} s={s} i={i} />
        ))}
      </View>
      <T v="caption" tone="muted">
        Your numbers are private to you and your faculty.
      </T>
    </>
  );
}

export function JourneyScreen() {
  const q = useJourney();
  return (
    <Screen testID="journey" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Stack.Screen options={{ title: "My journey" }} />
      <Loaded q={q} soon what="your journey" skeleton={<RowsSkeleton rows={4} />}>
        {(j) => <JourneyBody j={j} />}
      </Loaded>
    </Screen>
  );
}
