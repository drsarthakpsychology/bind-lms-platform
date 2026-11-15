import { router } from "expo-router";
import { Award, Bell, ChartLine, CircleHelp, MessageCircleQuestionMark, Settings } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { useMe } from "@/api/queries";
import { Row, RowList, Screen, Section, Skeleton, T } from "@/ds";
import { TabTop } from "@/nav/top";
import { space, useTheme } from "@/theme";

/** Me: who you are in one line, then grouped rows (the website's ME_GROUPS). */
export function MeScreen() {
  const c = useTheme();
  const q = useMe();
  const me = q.data;
  const can = me?.access.can;
  const lecturesOnly = !!me?.access.lecturesOnly;
  const icon = { size: 20, color: c.muted };
  const sub = me ? [me.rollNumber, me.cohorts.map((x) => x.name).join(", "), lecturesOnly ? "Lectures" : null].filter(Boolean).join(" · ") : "";
  return (
    <Screen tab top={<TabTop />} testID="me" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      {me ? (
        <View style={{ gap: space[1] }}>
          <T v="h1">{me.name ?? me.email ?? "You"}</T>
          {sub ? (
            <T v="small" tone="muted">
              {sub}
            </T>
          ) : null}
        </View>
      ) : (
        <View style={{ gap: space[2] }}>
          <Skeleton w="60%" h={28} />
          <Skeleton w="40%" h={14} />
        </View>
      )}
      <Section title="Your work">
        <RowList>
          <Row testID="me-progress" title="Progress" meta="Lectures, modules and your topics" icon={<ChartLine {...icon} />} onPress={() => router.push("/progress")} />
          {can?.achievements !== false ? <Row testID="me-certificates" title="Certificates and badges" icon={<Award {...icon} />} onPress={() => router.push("/certificates")} /> : null}
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
