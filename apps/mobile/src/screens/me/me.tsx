import { router } from "expo-router";
import { Award, Bell, ChartLine, CircleHelp, Medal, MessageCircleQuestionMark, Route, Settings, Trophy } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { useMe } from "@/api/queries";
import { Row, RowList, Screen, Section, Skeleton, T } from "@/ds";
import { Enter } from "@/motion";
import { TabTop } from "@/nav/top";
import { space, useTheme } from "@/theme";

/** Me: who you are in one line, then grouped rows (the website's ME_GROUPS). */
export function MeScreen() {
  const c = useTheme();
  const q = useMe();
  const me = q.data;
  const can = me?.access?.can;
  const lecturesOnly = !!me?.access?.lecturesOnly;
  const icon = { size: 20, color: c.muted };
  const sub = me ? [me.rollNumber, (me.cohorts ?? []).map((x) => x.name).join(", "), lecturesOnly ? "Lectures" : null].filter(Boolean).join(" · ") : "";
  return (
    <Screen tab top={<TabTop />} testID="me" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      {me ? (
        <Enter style={{ gap: space[1] }}>
          <T v="h1">{me.name ?? me.email ?? "You"}</T>
          {sub ? (
            <T v="small" tone="muted">
              {sub}
            </T>
          ) : null}
        </Enter>
      ) : (
        <View style={{ gap: space[2] }}>
          <Skeleton w="60%" h={28} />
          <Skeleton w="40%" h={14} />
        </View>
      )}
      <Section title="Your work">
        <RowList>
          <Row testID="me-progress" title="Progress" meta="Lectures, modules and your topics" icon={<ChartLine {...icon} />} onPress={() => router.push("/progress")} />
          {!me?.access?.blocks?.includes("journey") ? <Row testID="me-journey" title="My journey" meta="Your level, hours and streak" icon={<Route {...icon} />} onPress={() => router.push("/journey")} /> : null}
          {can?.achievements !== false ? <Row testID="me-certificates" title="Certificates" icon={<Award {...icon} />} onPress={() => router.push("/certificates")} /> : null}
          {can?.achievements !== false ? <Row testID="me-badges" title="Badges" icon={<Medal {...icon} />} onPress={() => router.push("/certificates?show=badges")} /> : null}
          {!lecturesOnly && can?.leaderboard !== false ? <Row testID="me-leaderboard" title="Leaderboard" meta="Your league, the boards and the XP shop" icon={<Trophy {...icon} />} onPress={() => router.push("/game/leaderboard")} /> : null}
        </RowList>
      </Section>
      <Section title="Help">
        <RowList>
          {!lecturesOnly && can?.doubts !== false ? <Row testID="me-doubts" title="Doubts" icon={<MessageCircleQuestionMark {...icon} />} onPress={() => router.push("/doubts")} /> : null}
          <Row testID="me-notifications" title="Notifications" trailing={me?.unreadNotifications ? `${me.unreadNotifications} new` : undefined} icon={<Bell {...icon} />} onPress={() => router.push("/notifications")} />
          <Row testID="me-settings" title="Settings" icon={<Settings {...icon} />} onPress={() => router.push("/settings")} />
          <Row testID="me-help" title="Help" meta="Message us on WhatsApp" icon={<CircleHelp {...icon} />} onPress={() => router.push("/help")} />
        </RowList>
      </Section>
    </Screen>
  );
}
