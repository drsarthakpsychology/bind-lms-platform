import { router } from "expo-router";
import { Award, Bell, CalendarCheck, CalendarDays, CalendarOff, ChartLine, ClipboardList, CircleHelp, MessageCircleQuestionMark, Settings, ShoppingBag, Trophy } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { useAchievements, useMe, useProgress } from "@/api/queries";
import { IconDot, ProgressLine, Row, RowList, Screen, Section, Skeleton, Stat, T } from "@/ds";
import { Enter } from "@/motion";
import { TabTop } from "@/nav/top";
import { space } from "@/theme";

/** Three numbers under the name: lectures, modules and the streak. */
function Summary() {
  const p = useProgress().data;
  if (!p) return null;
  const lect = p.lectures.reduce((a, l) => ({ done: a.done + l.completed, total: a.total + l.total }), { done: 0, total: 0 });
  return (
    <View testID="me-summary" style={{ flexDirection: "row", flexWrap: "wrap", columnGap: space[6], rowGap: space[3] }}>
      {lect.total ? <Stat value={`${lect.done}/${lect.total}`} label="Lectures" /> : null}
      {p.study ? <Stat value={`${p.study.modulesDone}/${p.study.modulesTotal}`} label="Modules" /> : null}
      {p.study ? p.study.streak > 0 ? <Stat value={String(p.study.streak)} label="Day streak" /> : <Stat value="Start today" label="Day streak" /> : null}
    </View>
  );
}

/** The next certificate to earn, with how far along it is. */
function NextCertificate() {
  const a = useAchievements().data;
  const next = a?.progress.find((x) => x.type === "certificate" && !x.earned);
  if (!next) return null;
  const m = /^(\d+)\s*(?:of|\/)\s*(\d+)/.exec(next.progress);
  const pct = m && Number(m[2]) > 0 ? (Number(m[1]) / Number(m[2])) * 100 : null;
  return (
    <RowList>
      <Row testID="me-next-cert" title={`Next certificate: ${next.title}`} meta={next.progress || undefined} icon={<IconDot icon={Award} />} onPress={() => router.push("/certificates")} below={pct !== null ? <ProgressLine value={pct} label={`${next.title}: ${next.progress}`} /> : undefined} />
    </RowList>
  );
}

/** Me: who you are, three numbers, the next certificate, then grouped rows (the website's ME_GROUPS). */
export function MeScreen() {
  const q = useMe();
  const me = q.data;
  const can = me?.access?.can;
  const lecturesOnly = !!me?.access?.lecturesOnly;
  const sub = me ? [me.rollNumber, (me.cohorts ?? []).map((x) => x.name).join(", "), lecturesOnly ? "Lectures" : null].filter(Boolean).join(" · ") : "";
  return (
    <Screen tab area="me" top={<TabTop />} testID="me" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
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
      {me && !lecturesOnly ? <Summary /> : null}
      {me && can?.achievements !== false ? <NextCertificate /> : null}
      {!lecturesOnly ? (
        <Section title="Clinic">
          <RowList>
            <Row testID="me-schedule" title="Schedule" meta="Sessions and your OPD days" icon={<IconDot icon={CalendarDays} />} onPress={() => router.push("/clinic/schedule")} />
            <Row testID="me-leave" title="Leave" icon={<IconDot icon={CalendarOff} />} onPress={() => router.push("/clinic/leave")} />
            <Row testID="me-opd" title="OPD cases" icon={<IconDot icon={ClipboardList} />} onPress={() => router.push("/clinic/opd")} />
            <Row testID="me-attendance" title="My attendance" icon={<IconDot icon={CalendarCheck} />} onPress={() => router.push("/clinic/attendance")} />
          </RowList>
        </Section>
      ) : null}
      <Section title="Your work">
        <RowList>
          <Row testID="me-progress" title="Progress" meta="Topics, map, your level and badges" icon={<IconDot icon={ChartLine} />} onPress={() => router.push("/progress")} />
          {can?.achievements !== false ? <Row testID="me-certificates" title="Certificates" icon={<IconDot icon={Award} />} onPress={() => router.push("/certificates")} /> : null}
          {!lecturesOnly && can?.leaderboard !== false ? <Row testID="me-leaderboard" title="Leaderboard" meta="Your league and the boards" icon={<IconDot icon={Trophy} />} onPress={() => router.push("/game/leaderboard")} /> : null}
          {!lecturesOnly && can?.leaderboard !== false ? <Row testID="me-shop" title="XP shop" meta="Name frames, titles and a streak repair" icon={<IconDot icon={ShoppingBag} />} onPress={() => router.push("/shop")} /> : null}
        </RowList>
      </Section>
      <Section title="Account and help">
        <RowList>
          {!lecturesOnly && can?.doubts !== false ? <Row testID="me-doubts" title="Doubts" icon={<IconDot icon={MessageCircleQuestionMark} />} onPress={() => router.push("/doubts")} /> : null}
          <Row testID="me-notifications" title="Notifications" trailing={me?.unreadNotifications ? `${me.unreadNotifications} new` : undefined} icon={<IconDot icon={Bell} />} onPress={() => router.push("/notifications")} />
          <Row testID="me-settings" title="Settings" icon={<IconDot icon={Settings} />} onPress={() => router.push("/settings")} />
          <Row testID="me-help" title="Help" meta="Message us on WhatsApp" icon={<IconDot icon={CircleHelp} />} onPress={() => router.push("/help")} />
        </RowList>
      </Section>
    </Screen>
  );
}
