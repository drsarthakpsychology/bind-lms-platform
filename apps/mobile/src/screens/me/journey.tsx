import { Stack } from "expo-router";
import * as React from "react";
import { View } from "react-native";

import type { Journey, JourneyStat } from "@/api/contract";
import { useJourney } from "@/api/learn";
import { Loaded, RowsSkeleton, Screen, Stat, T } from "@/ds";
import { Burst, Enter, ProgressRing, RollingNumber, useNewWins } from "@/motion";
import { layout, space, useTheme } from "@/theme";

/**
 * My journey (the website's /journey): your level on a ring that fills, the
 * level title, points and rank, then six numbers inline (Stat). A new level
 * gets a burst, once. It is a section of Progress; /journey opens Progress.
 */

/** Subs that only repeat the label ("Time on VIBHA, all your time here"). */
const SAYS_NOTHING = new Set(["all your time here", "days in a row"]);

/** One number with its label, inline like every Stat (no boxes, no icons). */
function JourneyStatItem({ s }: { s: JourneyStat }) {
  const raw = s.value.replace(/\s*🔥$/, "");
  const value = s.key === "streak" && (raw === "None yet" || raw === "0") ? "Start today" : raw;
  const sub = s.sub && !SAYS_NOTHING.has(s.sub.trim().toLowerCase()) ? s.sub : null;
  return (
    <View testID={`journey-${s.key}`} accessible={!!sub} accessibilityLabel={sub ? `${s.label}: ${value}, ${sub}` : undefined} style={{ flexBasis: "40%", flexGrow: 1, gap: 2 }}>
      <Stat value={value} label={s.label} />
      {sub ? (
        <T v="caption" tone="muted">
          {sub}
        </T>
      ) : null}
    </View>
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
      <Enter i={1} style={{ flexDirection: "row", flexWrap: "wrap", columnGap: space[6], rowGap: space[4] }}>
        {j.stats.map((s) => (
          <JourneyStatItem key={s.key} s={s} />
        ))}
      </Enter>
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
      <Loaded q={q} soon="/journey" what="your journey" skeleton={<RowsSkeleton rows={4} />}>
        {(j) => <JourneyBody j={j} />}
      </Loaded>
    </Screen>
  );
}
