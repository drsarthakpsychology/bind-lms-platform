import { router } from "expo-router";
import { Trophy } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { Hero, Row, RowList, Screen, Section, Skeleton, T } from "@/ds";
import { TabTop } from "@/nav/top";
import { space, useTheme } from "@/theme";
import { usePlayQuery } from "./api";
import { CASE_TOOLS, entryById, GAMES_RIVAL, GAMES_SOLO, PREP, type Entry } from "./catalog";
import { EntryIcon } from "./icons";
import { Tag } from "./parts";
import type { HubState } from "./types";

/**
 * Practise: one thing to start (carry on a half-finished case, or today's
 * case), then everything else as quiet rows in the website's groups. A row
 * carries at most one tag: New, This week, Done or Carry on.
 */
export function PractiseHub() {
  const c = useTheme();
  const q = usePlayQuery<HubState>([], "hub", "state");
  const s = q.data;
  const rows = (entries: Entry[]) => (
    <RowList>
      {entries.map((e) => {
        const t = s?.tags[e.id];
        return <Row key={e.id} testID={`practise-${e.id}`} title={e.title} meta={e.line} icon={<EntryIcon icon={e.icon} color={c.muted} />} trailing={t ? <Tag tag={t.tag} count={t.count} /> : undefined} onPress={() => router.push(e.href)} />;
      })}
    </RowList>
  );

  const carry = s?.carryOn ? entryById(s.carryOn.entry) : null;
  const hero = s?.carryOn && carry ? (
    <Hero context={`Carry on · ${carry.title}`} title={s.carryOn.title} meta={s.carryOn.step} action={{ label: "Carry on", onPress: () => router.push(`${carry.href}?item=${encodeURIComponent(s.carryOn!.item)}`), testID: "hub-carry-on" }} />
  ) : s?.daily?.done ? (
    <Hero context={`Daily case #${s.daily.number} · done`} title="Today's patient is solved" meta={s.daily.streak > 1 ? `${s.daily.streak} days in a row. A new one comes at midnight.` : "A new one comes at midnight."} action={{ label: "Play a practice case", onPress: () => router.push("/case/daily?mode=practice"), testID: "hub-daily" }} />
  ) : (
    <Hero context={s?.daily ? `Daily case #${s.daily.number}` : "Daily case"} title="Today's patient" meta="Name the diagnosis in as few clues as you can." action={{ label: "Open today's case", onPress: () => router.push("/case/daily"), testID: "hub-daily" }} />
  );

  return (
    <Screen tab top={<TabTop />} title="Practise" testID="practise" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      {q.isLoading ? (
        <View style={{ gap: space[3] }}>
          <Skeleton w="40%" h={14} />
          <Skeleton w="80%" h={34} />
          <Skeleton h={52} r={12} />
        </View>
      ) : (
        hero
      )}
      <Section title="Games">{rows(GAMES_SOLO)}</Section>
      <Section title="Against a rival">{rows(GAMES_RIVAL)}</Section>
      <Section
        title="Cases"
        action={
          <T v="small" tone="link" onPress={() => router.push("/case/library")} accessibilityRole="link" testID="hub-library" suppressHighlighting>
            All cases
          </T>
        }
      >
        {rows(CASE_TOOLS.filter((t) => t.id !== "daily"))}
      </Section>
      <Section title="Exam Prep">{rows(PREP)}</Section>
      <RowList>
        <Row testID="practise-board" title="This week's board" meta="Points from every game, Monday to Sunday" icon={<Trophy size={20} color={c.muted} />} onPress={() => router.push("/game/leaderboard")} />
      </RowList>
    </Screen>
  );
}
