import { router, Stack } from "expo-router";
import { ArrowRight, Map as MapIcon } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";

import type { Achievements, BadgeProgress, Credential, Progress, TopicScore } from "@/api/contract";
import { useJourney } from "@/api/learn";
import { go } from "@/api/prefetch";
import { useAchievements, useMe, useProgress } from "@/api/queries";
import { Button, FieldCard, Label, ProgressLine, Row, Screen, Sheet, Stone, T } from "@/ds";
import { Enter, ProgressRing } from "@/motion";
import { openTarget } from "@/nav/targets";
import { layout, space, useTheme } from "@/theme";
import { Badge, issued } from "./certificates";
import { JourneyStats, LevelStone } from "./journey";
import { Group, HubSkeleton, IconPatch, Load, QuietNote, Rise, StatStone } from "./parts";

/**
 * Progress: the one place for "how am I doing" (docs/DESIGN.md, "Hub or
 * dashboard with numbers"). One scroll, top to bottom:
 *   field   the streak, as the one pill
 *   1. Your level, on a ring (opens the leaderboard)
 *   2. Your numbers, as small stones
 *   3. Your courses, each with a line that fills
 *   4. The last two weeks, as bars you can tap
 *   5. Topics: what needs work, what is strongest, and the full map
 *   6. Badges, and what is still to earn
 * My journey and Badges used to be screens of their own; their links open here.
 */

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

/** Fourteen bars: points per day, oldest first, with a light average line. Tap a bar for that day's points. */
function Days({ days }: { days: Progress["days"] }) {
  const c = useTheme();
  const max = Math.max(1, ...days.map((d) => d.xp));
  const total = days.reduce((s, d) => s + d.xp, 0);
  const avg = days.length ? total / days.length : 0;
  const [pick, setPick] = React.useState(days.length - 1);
  const shown = days[Math.min(pick, days.length - 1)];
  const H = 84;
  return (
    <View style={{ gap: space[3] }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", gap: space[3] }}>
        <T v="bodyStrong" num testID="days-value" accessibilityLiveRegion="polite" style={{ flexShrink: 1 }}>
          {shown ? `${dayName(shown.day, pick === days.length - 1)}: ${shown.xp} points` : ""}
        </T>
        {avg > 0 ? (
          <T v="caption" tone="muted" num>
            {`About ${Math.round(avg)} a day`}
          </T>
        ) : null}
      </View>
      <View accessibilityLabel={`Points in the last 14 days: ${total}, about ${Math.round(avg)} a day`} style={{ height: H }}>
        <View style={{ flexDirection: "row", alignItems: "flex-end", height: H, gap: 5 }}>
          {days.map((d, i) => (
            <Pressable key={d.day} testID={`day-${i}`} accessibilityRole="button" accessibilityState={{ selected: i === pick }} accessibilityLabel={`${dayName(d.day, i === days.length - 1)}: ${d.xp} points`} onPress={() => setPick(i)} style={{ flex: 1, height: H, justifyContent: "flex-end" }} hitSlop={{ top: 12, bottom: 12 }}>
              <Rise i={i} h={Math.max(6, (d.xp / max) * H)} radius={5} color={i === pick ? (c.dark ? c.lime : c.ink) : c.cardLine} />
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

/** One topic: a small ring with how often you get it right, and where a tap takes you. */
function TopicRow({ t }: { t: TopicScore }) {
  const pct = Math.round(t.p * 100);
  return <Row title={t.title} meta={`Right about ${pct} times in 100`} icon={<ProgressRing pct={pct} size={30} stroke={4} delay={200} />} onPress={() => openTarget(t.studyTarget ?? t.practiceTarget)} accessibilityLabel={`${t.title}. Right about ${pct} times in 100. Open it`} />;
}

/** The numbers when there is no journey to show (a lectures account): from Progress alone. */
function BasicStats({ p }: { p: Progress }) {
  const lect = p.lectures.reduce((a, l) => ({ done: a.done + l.completed, total: a.total + l.total }), { done: 0, total: 0 });
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[3] }}>
      <StatStone value={`${lect.done}/${lect.total}`} label="Lectures" />
      {p.study ? <StatStone value={`${p.study.modulesDone}/${p.study.modulesTotal}`} label="Modules" /> : null}
      {p.study && p.study.seconds > 0 ? <StatStone value={hours(p.study.seconds)} label="Studied" /> : null}
    </View>
  );
}

function Courses({ p }: { p: Progress }) {
  return (
    <Stone>
      <View style={{ gap: space[4] }}>
        {p.lectures.map((l) => {
          const pct = l.total ? Math.round((l.completed / l.total) * 100) : 0;
          return (
            <View key={l.courseId} style={{ gap: space[2] }}>
              <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: space[3] }}>
                <T v="bodyStrong" style={{ flex: 1 }}>
                  {l.title}
                </T>
                <T v="small" tone="muted" num>
                  {l.completed} of {l.total}
                </T>
              </View>
              <ProgressLine value={pct} height={8} label={`${l.title}: ${l.completed} of ${l.total} lectures`} />
            </View>
          );
        })}
        {p.study ? (
          <View style={{ gap: space[2] }}>
            <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: space[3] }}>
              <T v="bodyStrong" style={{ flex: 1 }}>
                Reading
              </T>
              <T v="small" tone="muted" num>
                {p.study.sectionsDone} of {p.study.sectionsTotal} sections
              </T>
            </View>
            <ProgressLine value={p.study.sectionsTotal ? (p.study.sectionsDone / p.study.sectionsTotal) * 100 : 0} height={8} label={`Reading: ${p.study.sectionsDone} of ${p.study.sectionsTotal} sections`} />
          </View>
        ) : null}
      </View>
    </Stone>
  );
}

/** Badges earned as a grid on one stone, then the badges still to earn. */
function BadgesPart({ a }: { a: Achievements }) {
  const [badge, setBadge] = React.useState<Credential | BadgeProgress | null>(null);
  const close = React.useCallback(() => setBadge(null), []);
  const badges = a.earned.filter((x) => x.type === "badge");
  const toEarn = a.progress.filter((x) => !x.earned && x.type === "badge");
  return (
    <>
      {badges.length ? (
        <Stone pad={space[2]}>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }} testID="progress-badges">
            {badges.map((b, i) => (
              <Badge key={b.credentialId} b={b} i={i} onPress={() => setBadge(b)} />
            ))}
          </View>
        </Stone>
      ) : (
        <QuietNote testID="badges-empty" title="No badges yet" body="Badges come from studying, practising and finishing lectures." />
      )}
      {toEarn.length ? (
        <Group title="Still to earn">
          {toEarn.map((p) => (
            <Row key={p.id} title={p.title} meta={p.description ?? undefined} trailing={p.progress} onPress={() => setBadge(p)} chevron={false} />
          ))}
        </Group>
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

function streakTitle(days: number): string {
  return days > 0 ? `${days} day${days === 1 ? "" : "s"} in a row` : "No streak yet";
}

export function ProgressScreen() {
  const c = useTheme();
  const me = useMe().data;
  const q = useProgress();
  // Lecture-only accounts have no journey (can.journey false).
  const showJourney = !me?.access?.blocks?.includes("journey") && me?.access?.can?.journey !== false;
  const showBadges = me?.access?.can?.achievements !== false;
  const showBoard = !me?.access?.lecturesOnly && me?.access?.can?.leaderboard !== false;
  const j = useJourney();
  const a = useAchievements();
  const study = q.data?.study;
  return (
    <Screen
      testID="progress"
      title="Progress"
      lead="How you are doing, in one place."
      gap={space[5]}
      onRefresh={() => void Promise.all([q.refetch(), showJourney ? j.refetch() : null, showBadges ? a.refetch() : null])}
      refreshing={q.isRefetching}
      field={study ? <FieldCard testID="progress-streak" live={study.streak > 0} title={streakTitle(study.streak)} meta={study.streak > 0 ? `Your best so far is ${Math.max(study.bestStreak, study.streak)}` : "Study or practise today to start one"} /> : undefined}
    >
      <Stack.Screen options={{ title: "" }} />
      <Load q={q} what="your progress" skeleton={<HubSkeleton />}>
        {(p) => (
          <View style={{ gap: space[5] }}>
            <View style={{ gap: space[3] }}>
              {showJourney && j.data ? (
                <>
                  <Enter i={0}>
                    <LevelStone j={j.data} onPress={showBoard ? () => router.push("/game/leaderboard") : undefined} />
                  </Enter>
                  <Enter i={1}>
                    <JourneyStats stats={j.data.stats} />
                  </Enter>
                </>
              ) : (
                <Enter i={0}>
                  <BasicStats p={p} />
                </Enter>
              )}
            </View>

            {p.lectures.length ? (
              <Enter i={2} style={{ gap: space[2] }}>
                <Label>Your courses</Label>
                <Courses p={p} />
              </Enter>
            ) : null}

            {p.days.length ? (
              <Enter i={3} style={{ gap: space[2] }}>
                <Label>Last two weeks</Label>
                <Stone>
                  <Days days={p.days} />
                </Stone>
              </Enter>
            ) : null}

            {p.study ? (
              <View style={{ gap: space[3] }}>
                {p.strengths?.hasData ? (
                  <>
                    <Group title="Needs work">
                      {p.strengths.weakest.map((t) => (
                        <TopicRow key={t.id} t={t} />
                      ))}
                    </Group>
                    <Group title="Strongest">
                      {p.strengths.strongest.map((t) => (
                        <TopicRow key={t.id} t={t} />
                      ))}
                    </Group>
                  </>
                ) : (
                  <>
                    <Label>Topics</Label>
                    <QuietNote testID="topics-empty" title="Your topics show up soon" body="Answer a few practice questions and we will show where you are strong and what needs work." action={{ label: "Practise now", onPress: () => go("/practise") }} />
                  </>
                )}
                <Stone grow={() => router.push("/map")} testID="progress-map" accessibilityLabel="Your full map. Every topic and how well you know it">
                  <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
                    <IconPatch icon={MapIcon} area="learn" />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <T v="bodyStrong">Your full map</T>
                      <T v="small" tone="muted">
                        Every topic and how well you know it
                      </T>
                    </View>
                    <ArrowRight size={20} color={c.muted} />
                  </View>
                </Stone>
              </View>
            ) : null}

            {showBadges ? (
              <View style={{ gap: space[3] }}>
                <Label action={<Button kind="text" small full={false} label="Certificates" onPress={() => go("/certificates")} testID="progress-certificates" />}>Badges</Label>
                <Load q={a} what="your badges" skeleton={<View style={{ height: 120, borderRadius: layout.radiusLg, backgroundColor: c.skeleton }} />}>
                  {(d) => <BadgesPart a={d} />}
                </Load>
              </View>
            ) : null}

            {showJourney && j.data ? (
              <T v="caption" tone="muted" style={{ paddingHorizontal: space[1] }}>
                Your numbers are private to you and your faculty.
              </T>
            ) : null}
          </View>
        )}
      </Load>
    </Screen>
  );
}
