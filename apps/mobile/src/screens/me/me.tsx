import { router } from "expo-router";
import { ArrowRight, Award, Bell, CalendarCheck, CalendarDays, CalendarOff, CircleHelp, ClipboardList, MessageCircleQuestionMark, MessagesSquare, QrCode, Settings, ShoppingBag, Trophy } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type { Journey, Progress } from "@/api/contract";
import { useJourney } from "@/api/learn";
import { go } from "@/api/prefetch";
import { useAchievements, useMe, useProgress } from "@/api/queries";
import { FieldCard, Label, pebbleShape, ProgressLine, Row, Screen, Skeleton, Stone, T } from "@/ds";
import { Enter, Press, ProgressRing, RollingNumber } from "@/motion";
import { TabTop } from "@/nav/top";
import { space, useTheme } from "@/theme";
import { Avatar, Group, Tile } from "./parts";

/**
 * Me, in the Layers look (docs/DESIGN.md, "Hub or dashboard with numbers").
 * On the field: who you are, and your level as the one pill.
 * On the layer, top to bottom:
 *   1. How you are doing: one stone with a ring that draws in and three rolling
 *      numbers. It grows into Progress.
 *   2. The next certificate to earn.
 *   3. Clinic: five pebbles (the clinic screens belong to the clinic builder).
 *   4. Yours: a shelf of tiles (certificates, leaderboard, shop, wall, doubts, notifications).
 *   5. Account: settings and help.
 */

/** Lectures and sections done, as one share of everything there is. */
export function overallPct(p: Progress): number {
  const lect = p.lectures.reduce((a, l) => ({ done: a.done + l.completed, total: a.total + l.total }), { done: 0, total: 0 });
  const done = lect.done + (p.study?.sectionsDone ?? 0);
  const total = lect.total + (p.study?.sectionsTotal ?? 0);
  return total ? Math.round((done / total) * 100) : 0;
}

function Number3({ value, of, label }: { value: number; of?: number; label: string }) {
  return (
    <View accessible accessibilityLabel={of !== undefined ? `${label}: ${value} of ${of}` : `${label}: ${value}`} style={{ flex: 1, minWidth: 0 }}>
      <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
        <RollingNumber v="h2" value={value} />
        {of !== undefined ? (
          <T v="small" tone="muted" num style={{ paddingBottom: 2 }}>
            {` of ${of}`}
          </T>
        ) : null}
      </View>
      <T v="caption" tone="muted" numberOfLines={1}>
        {label}
      </T>
    </View>
  );
}

/** The one stone that says how you are doing. It grows into Progress. */
function Doing({ p, lecturesOnly }: { p: Progress; lecturesOnly: boolean }) {
  const c = useTheme();
  const lect = p.lectures.reduce((a, l) => ({ done: a.done + l.completed, total: a.total + l.total }), { done: 0, total: 0 });
  const pct = overallPct(p);
  return (
    <Stone grow={() => go("/progress")} testID="me-progress" accessibilityLabel={`How you are doing: ${pct} percent of the course done. Open your progress`} pad={space[5]}>
      <View style={{ gap: space[4] }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
          <ProgressRing pct={pct} size={76} stroke={7} delay={150} label={`${pct} percent of the course done`}>
            <RollingNumber v="h2" value={pct} suffix="%" />
          </ProgressRing>
          <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
            <T v="h2">{pct >= 100 ? "Course finished" : pct > 0 ? "You are on your way" : "Ready when you are"}</T>
            <T v="small" tone="muted">
              {pct > 0 ? "Of the whole course, lectures and reading together" : "Your first lecture starts the ring"}
            </T>
          </View>
          <ArrowRight size={20} color={c.muted} />
        </View>
        <View testID="me-summary" style={{ flexDirection: "row", gap: space[3] }}>
          {lect.total ? <Number3 value={lect.done} of={lect.total} label="Lectures" /> : null}
          {!lecturesOnly && p.study ? <Number3 value={p.study.modulesDone} of={p.study.modulesTotal} label="Modules" /> : null}
          {!lecturesOnly && p.study ? <Number3 value={p.study.streak} label={p.study.streak === 1 ? "Day in a row" : "Days in a row"} /> : null}
        </View>
      </View>
    </Stone>
  );
}

/** The next certificate to earn, with how far along it is. */
function NextCertificate() {
  const c = useTheme();
  const a = useAchievements().data;
  const next = a?.progress.find((x) => x.type === "certificate" && !x.earned);
  if (!next) return null;
  const m = /^(\d+)\s*(?:of|\/)\s*(\d+)/.exec(next.progress);
  const pct = m && Number(m[2]) > 0 ? (Number(m[1]) / Number(m[2])) * 100 : null;
  return (
    <Stone quiet grow={() => go("/certificates")} testID="me-next-cert" accessibilityLabel={`Next certificate: ${next.title}. ${next.progress}`}>
      <View style={{ gap: space[3] }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
          <Award size={22} color={c.areas.me.deep} strokeWidth={2} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <T v="caption" tone="muted">
              Next certificate
            </T>
            <T v="bodyStrong">{next.title}</T>
          </View>
          {next.progress ? (
            <T v="small" tone="muted" num>
              {next.progress}
            </T>
          ) : null}
        </View>
        {pct !== null ? <ProgressLine value={pct} label={`${next.title}: ${next.progress}`} /> : null}
      </View>
    </Stone>
  );
}

const CLINIC = [
  { id: "me-scan", label: "Scan", say: "Scan attendance", icon: QrCode, href: "/clinic/scan" },
  { id: "me-schedule", label: "Schedule", say: "Schedule", icon: CalendarDays, href: "/clinic/schedule" },
  { id: "me-leave", label: "Leave", say: "Leave", icon: CalendarOff, href: "/clinic/leave" },
  { id: "me-opd", label: "OPD", say: "OPD cases", icon: ClipboardList, href: "/clinic/opd" },
  { id: "me-attendance", label: "Attendance", say: "My attendance", icon: CalendarCheck, href: "/clinic/attendance" },
] as const;

/** Five pebbles in one row: the clinic, one tap away. */
function ClinicPebbles() {
  const c = useTheme();
  return (
    <View style={{ flexDirection: "row" }}>
      {CLINIC.map((it, i) => (
        <Press key={it.id} testID={it.id} accessibilityRole="button" accessibilityLabel={it.say} onPress={() => go(it.href)} scale={0.9} squish style={{ flex: 1 }} innerStyle={{ alignItems: "center", gap: 6, paddingVertical: 2 }}>
          <View style={[{ width: 54, height: 54, alignItems: "center", justifyContent: "center", backgroundColor: c.card }, pebbleShape(i)]}>
            <it.icon size={21} color={c.ink} strokeWidth={1.9} />
          </View>
          <T v="caption" numberOfLines={1} maxFontSizeMultiplier={1.15}>
            {it.label}
          </T>
        </Press>
      ))}
    </View>
  );
}

/** "Level 4 · Keen Observer", with how far to the next one. */
function levelCard(j: Journey | undefined): { title: string; meta: string } | null {
  if (!j) return null;
  const pct = Math.round(j.levelPct * 100);
  return { title: `Level ${j.level} · ${j.title || "Curious Mind"}`, meta: `${pct}% of the way to level ${j.level + 1}` };
}

export function MeScreen() {
  const c = useTheme();
  const q = useMe();
  const me = q.data;
  const can = me?.access?.can;
  const lecturesOnly = !!me?.access?.lecturesOnly;
  const showJourney = !!me && !lecturesOnly && !me.access?.blocks?.includes("journey") && can?.journey !== false;
  const p = useProgress();
  const j = useJourney();
  const a = useAchievements();
  const sub = me ? [me.rollNumber, (me.cohorts ?? []).map((x) => x.name).join(", "), lecturesOnly ? "Lectures" : null].filter(Boolean).join(" · ") : "";
  const level = showJourney ? levelCard(j.data) : null;
  const certs = a.data?.earned.filter((x) => x.type === "certificate" && x.status !== "draft").length ?? 0;
  const board = !lecturesOnly && can?.leaderboard !== false;
  const refresh = () => void Promise.all([q.refetch(), p.refetch(), a.refetch(), showJourney ? j.refetch() : null]);
  return (
    <Screen
      tab
      area="me"
      top={<TabTop />}
      testID="me"
      gap={space[5]}
      onRefresh={refresh}
      refreshing={q.isRefetching}
      field={
        <View style={{ gap: space[4] }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
            <Avatar name={me?.name ?? me?.email} onField />
            <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
              <T v={(me?.name ?? "").length > 18 ? "h1" : "display"} tone="onField" accessibilityRole="header" numberOfLines={2} testID="me-name">
                {me ? (me.name ?? me.email ?? "You") : " "}
              </T>
              {sub ? (
                <T v="small" tone="onFieldMuted" num>
                  {sub}
                </T>
              ) : null}
            </View>
          </View>
          {level ? <FieldCard testID="me-level" title={level.title} meta={level.meta} onPress={() => go("/progress")} /> : null}
        </View>
      }
    >
      {p.data ? (
        <Enter i={0}>
          <Doing p={p.data} lecturesOnly={lecturesOnly} />
        </Enter>
      ) : p.isError ? null : (
        <Skeleton h={168} r={26} />
      )}
      {me && can?.achievements !== false ? <NextCertificate /> : null}
      {!lecturesOnly ? (
        <Enter i={1} style={{ gap: space[3] }}>
          <Label>Clinic</Label>
          <ClinicPebbles />
        </Enter>
      ) : null}
      <Enter i={2} style={{ gap: space[3] }}>
        <Label>Yours</Label>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[3] }}>
          {can?.achievements !== false ? <Tile testID="me-certificates" title="Certificates" meta={certs ? `${certs} earned, and your badges` : "And your badges"} icon={Award} area="me" open={() => go("/certificates")} /> : null}
          {board ? <Tile testID="me-leaderboard" title="Leaderboard" meta={j.data?.rank ? `You are number ${j.data.rank}` : "Your league and the boards"} icon={Trophy} area="practise" open={() => router.push("/game/leaderboard")} /> : null}
          {board ? <Tile testID="me-shop" title="XP shop" meta="Name frames, titles, a streak repair" icon={ShoppingBag} area="home" open={() => router.push("/shop")} /> : null}
          {!lecturesOnly && !me?.access?.blocks?.includes("wall") ? <Tile testID="me-wall" title="Class wall" meta="Posts from your batch" icon={MessagesSquare} area="learn" open={() => router.push("/wall")} /> : null}
          {!lecturesOnly && can?.doubts !== false ? <Tile testID="me-doubts" title="Doubts" meta="Ask and see answers" icon={MessageCircleQuestionMark} area="library" open={() => go("/doubts")} /> : null}
          <Tile testID="me-notifications" title="Notifications" meta={me?.unreadNotifications ? `${me.unreadNotifications} new` : "Nothing new"} badge={me?.unreadNotifications || undefined} icon={Bell} area="me" open={() => go("/notifications")} />
        </View>
      </Enter>
      <Enter i={3}>
        <Group title="Account">
          <Row testID="me-settings" title="Settings" meta="Look, text size, PIN, notifications" icon={<Settings size={20} color={c.ink} />} onPress={() => go("/settings")} />
          <Row testID="me-help" title="Help and about" meta="Message us on WhatsApp" icon={<CircleHelp size={20} color={c.ink} />} onPress={() => router.push("/help")} />
        </Group>
      </Enter>
    </Screen>
  );
}

/** What the Progress screen holds for this account, in a few words. */
export function progressMeta(lecturesOnly: boolean, journey: boolean, badges: boolean): string {
  const parts = [lecturesOnly ? "Lectures watched" : "Topics, map", journey ? "your level" : null, badges ? "badges" : null].filter(Boolean) as string[];
  return parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}` : parts[0]!;
}
