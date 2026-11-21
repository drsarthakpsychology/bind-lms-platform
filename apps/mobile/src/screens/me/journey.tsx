import * as React from "react";
import { View } from "react-native";

import type { Journey, JourneyStat } from "@/api/contract";
import { useJourney } from "@/api/learn";
import { RowsSkeleton, Screen, Stone, T } from "@/ds";
import { PixelStar } from "@/moments/parts";
import { Enter, PixelBurst, ProgressRing, RollingNumber, useNewWins } from "@/motion";
import { space, useTheme } from "@/theme";
import { ArrowRight } from "lucide-react-native";
import { Load, StatStone } from "./parts";

/**
 * Your level and your numbers (the website's /journey). The level sits on one
 * stone with a ring that draws in; the numbers are small stones in a shelf.
 * A new level, once: the number rolls up from the old one, a pixel star grows
 * behind the ring and a pixel burst pops from it. This is a part of Progress;
 * /journey opens Progress.
 */

/** Subs that only repeat the label ("Time on VIBHA, all your time here"). */
const SAYS_NOTHING = new Set(["all your time here", "days in a row"]);

function statValue(s: JourneyStat): string {
  const raw = s.value.replace(/\s*🔥$/, "");
  return s.key === "streak" && (raw === "None yet" || raw === "0") ? "Start today" : raw;
}

/** The level stone. With `onPress` it opens the leaderboard. */
export function LevelStone({ j, onPress }: { j: Journey; onPress?: () => void }) {
  const c = useTheme();
  const pct = Math.round(j.levelPct * 100);
  const levelUp = useNewWins("journey-level", j.level > 1 ? [`level-${j.level}`] : null);
  return (
    <Stone testID="journey-level" pad={space[5]} onPress={onPress} accessibilityLabel={`Level ${j.level}, ${j.title}. ${pct}% of the way to the next level.${j.rank ? ` Number ${j.rank} on the leaderboard.` : ""}`}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
        <View>
          <ProgressRing pct={pct} size={84} stroke={7} delay={150} label={`${pct}% to the next level`}>
            <View style={{ alignItems: "center" }}>
              <T v="caption" tone="muted">
                Level
              </T>
              <RollingNumber key={levelUp} value={j.level} from={levelUp ? j.level - 1 : undefined} v="h1" />
            </View>
          </ProgressRing>
          <PixelStar fire={levelUp} size={104} />
          <PixelBurst fire={levelUp} reach={58} />
        </View>
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <T v="h2">{j.title || "Curious Mind"}</T>
          <T v="small" tone="muted" num>
            {pct}% of the way to level {j.level + 1}
          </T>
          {j.points !== null ? (
            <T v="small" tone="muted" num>
              {j.points.toLocaleString("en-IN")} points{j.rank ? ` · number ${j.rank} in your batch` : ""}
            </T>
          ) : null}
        </View>
        {onPress ? <ArrowRight size={20} color={c.muted} /> : null}
      </View>
    </Stone>
  );
}

/** The six numbers as a shelf of small stones. */
export function JourneyStats({ stats }: { stats: JourneyStat[] }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[3] }}>
      {stats.map((s) => {
        const sub = s.sub && !SAYS_NOTHING.has(s.sub.trim().toLowerCase()) ? s.sub : null;
        return <StatStone key={s.key} testID={`journey-${s.key}`} value={statValue(s)} label={s.label} sub={sub} />;
      })}
    </View>
  );
}

export function JourneyBody({ j, onLevel }: { j: Journey; onLevel?: () => void }) {
  return (
    <View style={{ gap: space[3] }}>
      <Enter i={0}>
        <LevelStone j={j} onPress={onLevel} />
      </Enter>
      <Enter i={1}>
        <JourneyStats stats={j.stats} />
      </Enter>
      <T v="caption" tone="muted" style={{ paddingHorizontal: space[1] }}>
        Your numbers are private to you and your faculty.
      </T>
    </View>
  );
}

export function JourneyScreen() {
  const q = useJourney();
  return (
    <Screen testID="journey" title="My journey" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Load q={q} what="your journey" skeleton={<RowsSkeleton rows={4} />}>
        {(j) => <JourneyBody j={j} />}
      </Load>
    </Screen>
  );
}
