import { router, Stack } from "expo-router";
import { Map as MapIcon } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import type { Achievements, BadgeProgress, Credential, Progress, TopicScore } from "@/api/contract";
import { useJourney } from "@/api/learn";
import { useAchievements, useMe, useProgress } from "@/api/queries";
import { EmptyState, Loaded, ProgressLine, Row, RowList, RowsSkeleton, Screen, Section, Sheet, Stat, T } from "@/ds";
import { openTarget } from "@/nav/targets";
import { useFill } from "@/motion";
import { space, useTheme } from "@/theme";
import { Badge, issued } from "./certificates";
import { JourneyBody } from "./journey";

/** One day's bar: grows up from the baseline, each a little after the one before. */
function DayBar({ h, i, color }: { h: number; i: number; color: string }) {
  const fill = useFill(100, 150 + i * 30);
  const grow = useAnimatedStyle(() => ({ transform: [{ scaleY: fill.value }] }));
  return <Animated.View style={[{ height: h, borderRadius: 2, backgroundColor: color, transformOrigin: "bottom" }, grow]} />;
}

function hours(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  return h ? (m ? `${h} h ${m} m` : `${h} h`) : `${m} m`;
}

function dayName(day: string, today: boolean): string {
  if (today) return "Today";
  const t = Date.parse(day);
  return Number.isFinite(t) ? new Date(t).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) : day;
}

/** Fourteen thin bars: points per day, oldest first, with a light average line. Tap a bar for that day's points. */
function Days({ days }: { days: Progress["days"] }) {
  const c = useTheme();
  const max = Math.max(1, ...days.map((d) => d.xp));
  const total = days.reduce((s, d) => s + d.xp, 0);
  const avg = days.length ? total / days.length : 0;
  const [pick, setPick] = React.useState(days.length - 1);
  const shown = days[Math.min(pick, days.length - 1)];
  const H = 72;
  return (
    <View style={{ gap: space[2] }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", gap: space[3] }}>
        <T v="small" testID="days-value" accessibilityLiveRegion="polite" style={{ flexShrink: 1 }}>
          {shown ? `${dayName(shown.day, pick === days.length - 1)}: ${shown.xp} points` : ""}
        </T>
        {avg > 0 ? (
          <T v="caption" tone="muted">
            {`Dashed: about ${Math.round(avg)} a day`}
          </T>
        ) : null}
      </View>
      <View accessible accessibilityLabel={`Points in the last 14 days: ${total}, about ${Math.round(avg)} a day`} style={{ height: H }}>
        <View style={{ flexDirection: "row", alignItems: "flex-end", height: H, gap: 4 }}>
          {days.map((d, i) => (
            <Pressable key={d.day} testID={`day-${i}`} onPress={() => setPick(i)} style={{ flex: 1, height: H, justifyContent: "flex-end" }} hitSlop={{ top: 12, bottom: 12 }}>
              <DayBar i={i} h={Math.max(3, (d.xp / max) * H)} color={i === pick ? (c.dark ? c.primary : c.ink) : c.cardLine} />
            </Pressable>
          ))}
        </View>
        {avg > 0 ? <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, bottom: (avg / max) * H, borderTopWidth: 1, borderStyle: "dashed", borderColor: c.muted, opacity: 0.6 }} /> : null}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <T v="caption" tone="muted">
          Two weeks ago
        </T>
        <T v="caption" tone="muted">
          Today
        </T>
      </View>
    </View>
  );
}

function Topics({ items }: { items: TopicScore[] }) {
  return (
    <RowList>
      {items.map((t) => (
        <Row key={t.id} title={t.title} meta={t.n === 1 ? "1 answer" : `${t.n} answers`} trailing={`${Math.round(t.p * 100)}%`} onPress={() => openTarget(t.studyTarget ?? t.practiceTarget)} />
      ))}
    </RowList>
  );
}

/** Overview: numbers in one row, each course's line, the last two weeks. */
export function ProgressOverview({ p }: { p: Progress }) {
  const lect = p.lectures.reduce((a, l) => ({ done: a.done + l.completed, total: a.total + l.total }), { done: 0, total: 0 });
  return (
    <>
      <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: space[6], rowGap: space[4] }}>
        <Stat value={`${lect.done}/${lect.total}`} label="Lectures" />
        {p.study ? <Stat value={`${p.study.modulesDone}/${p.study.modulesTotal}`} label="Modules" /> : null}
        {p.study ? p.study.streak > 0 ? <Stat value={String(p.study.streak)} label="Day streak" /> : <Stat value="Start today" label="Day streak" /> : null}
        {p.study && p.study.seconds > 0 ? <Stat value={hours(p.study.seconds)} label="Studied" /> : null}
      </View>
      {p.lectures.map((l) => {
        const pct = l.total ? Math.round((l.completed / l.total) * 100) : 0;
        return (
          <View key={l.courseId} style={{ gap: space[2] }}>
            <T v="small" tone="muted">
              {l.title} · {pct}%
            </T>
            <ProgressLine value={pct} label={`${l.title}: ${pct}%`} />
          </View>
        );
      })}
      {p.days.length ? (
        <Section title="Last two weeks" quiet>
          <Days days={p.days} />
        </Section>
      ) : null}
    </>
  );
}

/** Topics: what needs work and what is strongest. */
export function ProgressTopics({ p }: { p: Progress }) {
  if (p.strengths?.hasData)
    return (
      <>
        <Section title="Needs work" quiet>
          <Topics items={p.strengths.weakest} />
        </Section>
        <Section title="Strongest" quiet>
          <Topics items={p.strengths.strongest} />
        </Section>
      </>
    );
  return <EmptyState title="Your topics show up soon" body="Answer a few practice questions and we will show where you are strong and what needs work." />;
}

/** Badges earned as a quiet grid, then the badges still to earn. */
function BadgesPart({ a }: { a: Achievements }) {
  const [badge, setBadge] = React.useState<Credential | BadgeProgress | null>(null);
  const close = React.useCallback(() => setBadge(null), []);
  const badges = a.earned.filter((x) => x.type === "badge");
  const toEarn = a.progress.filter((x) => !x.earned && x.type === "badge");
  return (
    <>
      {badges.length ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap" }} testID="progress-badges">
          {badges.map((b, i) => (
            <Badge key={b.credentialId} b={b} i={i} onPress={() => setBadge(b)} />
          ))}
        </View>
      ) : (
        <T tone="muted" testID="badges-empty">
          Badges come from studying, practising and finishing lectures.
        </T>
      )}
      {toEarn.length ? (
        <Section title="Still to earn" quiet>
          <RowList>
            {toEarn.map((p) => (
              <Row key={p.id} title={p.title} meta={p.description ?? undefined} trailing={p.progress} onPress={() => setBadge(p)} chevron={false} />
            ))}
          </RowList>
        </Section>
      ) : null}
      <Sheet open={!!badge} onClose={close} title={badge?.title}>
        <View style={{ gap: space[3] }}>
          {badge?.description ? <T tone="muted">{badge.description}</T> : null}
          <T v="small" tone="muted">
            {badge && "credentialId" in badge ? `Earned ${issued(badge.issuedAt)}` : badge && "progress" in badge ? badge.progress : ""}
          </T>
        </View>
      </Sheet>
    </>
  );
}

/**
 * Progress: one screen for how you are doing, in sections. Overview, Topics,
 * Map, Journey (level and numbers) and Badges. My journey and Badges used to
 * be screens of their own; their links open here.
 */
export function ProgressScreen() {
  const c = useTheme();
  const me = useMe().data;
  const q = useProgress();
  const showJourney = !me?.access?.blocks?.includes("journey");
  const showBadges = me?.access?.can?.achievements !== false;
  const j = useJourney();
  const a = useAchievements();
  return (
    <Screen testID="progress" onRefresh={() => void Promise.all([q.refetch(), showJourney ? j.refetch() : null, showBadges ? a.refetch() : null])} refreshing={q.isRefetching}>
      <Stack.Screen options={{ title: "Progress" }} />
      <Section title="Overview">
        <Loaded q={q} what="your progress" skeleton={<RowsSkeleton rows={4} />}>
          {(p) => <ProgressOverview p={p} />}
        </Loaded>
      </Section>
      {q.data?.study ? (
        <>
          <Section title="Topics">
            <ProgressTopics p={q.data} />
          </Section>
          <Section title="Map">
            <RowList>
              <Row testID="progress-map" icon={<MapIcon size={20} color={c.ink} />} title="Your full map" meta="Every topic and how well you know it" onPress={() => router.push("/map")} />
            </RowList>
          </Section>
        </>
      ) : null}
      {showJourney ? (
        <Section title="Journey">
          <Loaded q={j} soon="/journey" what="your journey" skeleton={<RowsSkeleton rows={3} />}>
            {(d) => <JourneyBody j={d} />}
          </Loaded>
        </Section>
      ) : null}
      {showBadges ? (
        <Section title="Badges">
          <Loaded q={a} what="your badges" skeleton={<RowsSkeleton rows={2} />}>
            {(d) => <BadgesPart a={d} />}
          </Loaded>
        </Section>
      ) : null}
    </Screen>
  );
}
