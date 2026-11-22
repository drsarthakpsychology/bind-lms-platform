import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";

import { DrawMark, Label, T } from "@/ds";
import { useHome } from "@/api/queries";
import type { Quest } from "@/api/contract";
import { haptic } from "@/lib/haptics";
import { Burst, dur, presets, RollingNumber, springs } from "@/motion";
import { fonts, layout, space, useTheme } from "@/theme";

/**
 * Today's quests on a result: the practise quests, as they stand after this
 * round. The screen asks Home again once the round is over; a quest that has
 * just turned done gets its moment (the ring fills lime, the tick draws on,
 * a few sparks, the XP rolls up, one success haptic). A quest that has not
 * moved shows where it stands, with no fuss. Nothing here decides whether a
 * quest is done: that is the server's answer, shown as it comes.
 */
export function QuestMoment() {
  const q = useHome();
  const qc = useQueryClient();
  const card = q.data?.quests ?? null;
  // What was done before this round ended (the first answer we saw).
  const [seen, setSeen] = React.useState<Set<string> | null>(null);
  const first = seen ?? (card ? new Set(card.quests.filter((x) => x.done).map((x) => x.id)) : null);
  if (first && seen === null) setSeen(first);
  React.useEffect(() => {
    // The round's save is on its way: ask Home again shortly, and once more for a slow save.
    const a = setTimeout(() => void qc.invalidateQueries({ queryKey: ["home"] }), 700);
    const b = setTimeout(() => void qc.invalidateQueries({ queryKey: ["home"] }), 3500);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [qc]);
  if (!card) return null;
  const rows = card.quests.filter((x) => x.target.screen === "practice" || (x.done && !first?.has(x.id)));
  if (!rows.length) return null;
  const allNow = card.done && card.quests.some((x) => !first?.has(x.id));
  return (
    <View style={{ gap: space[2] }} testID="quest-moment">
      <Label>Today's quests</Label>
      <View style={{ gap: space[2] }}>
        {rows.map((x) => (
          <QuestRow key={x.id} quest={x} fresh={x.done && !first?.has(x.id)} xp={card.xpEach} />
        ))}
      </View>
      {allNow ? (
        <T v="small" tone="muted">
          All of today's quests are done: {card.xpBonus} XP more and {card.spareBonus} spare hints.
        </T>
      ) : null}
    </View>
  );
}

function QuestRow({ quest, fresh, xp }: { quest: Quest; fresh: boolean; xp: number }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const pop = useSharedValue(1);
  const [fire, setFire] = React.useState(0);
  const was = React.useRef(quest.done);
  React.useEffect(() => {
    if (!quest.done || !fresh || was.current) return;
    was.current = true;
    haptic.success();
    if (reduce) return;
    pop.set(withSequence(withTiming(1.04, { duration: dur.micro }), withSpring(1, springs.bouncy)));
    const id = setTimeout(() => setFire((n) => n + 1), 160);
    return () => clearTimeout(id);
  }, [quest.done, fresh, reduce, pop]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));
  const lime = quest.done;
  return (
    <Animated.View style={[{ flexDirection: "row", alignItems: "center", gap: space[3], minHeight: layout.row, borderRadius: layout.radius, paddingVertical: space[3], paddingHorizontal: space[4], backgroundColor: fresh ? c.lime : c.card }, style]} accessible accessibilityLiveRegion="polite" accessibilityLabel={`${quest.label}. ${quest.done ? `Done${fresh ? `, plus ${xp} XP` : ""}` : (quest.progress ?? "Not done yet")}`} testID={`quest-${quest.id}`}>
      <View style={{ width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: lime ? (fresh ? c.onLime : c.lime) : "transparent", borderWidth: lime ? 0 : 2, borderColor: c.fieldLine }}>
        {lime ? <DrawMark key={fresh ? "new" : "old"} kind="tick" color={fresh ? c.lime : c.onLime} size={16} /> : null}
        {fresh ? <Burst fire={fire} reach={34} /> : null}
      </View>
      <T v="bodyStrong" style={{ flex: 1, color: fresh ? c.onLime : c.ink }}>
        {quest.label}
      </T>
      {fresh ? (
        <Animated.View entering={reduce ? undefined : presets.pop(220)}>
          <RollingNumber value={xp} prefix="+" suffix=" XP" v="small" style={{ color: c.onLime, fontFamily: fonts.bold }} />
        </Animated.View>
      ) : (
        <T v="caption" tone="muted" num>
          {quest.done ? "Done" : (quest.progress ?? "To do")}
        </T>
      )}
    </Animated.View>
  );
}
