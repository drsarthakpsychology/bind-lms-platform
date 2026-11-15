import { ArrowRight, BookOpen, Check, ChevronRight, Circle, Dumbbell, Flame, Play, Stethoscope } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";

import { outbox } from "@/api/outbox";
import { useHome, type HomeData } from "@/api/queries";
import type { QuestCard } from "@/api/contract";
import { EmptyState, Hero, LoadError, Row, RowList, Screen, Section, Sheet, Skeleton, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { Burst, Enter, ProgressRing, RollingNumber, SkeletonIn, Stamp } from "@/motion";
import { openTarget } from "@/nav/targets";
import { TabTop } from "@/nav/top";
import { layout, space, useTheme } from "@/theme";

/**
 * Home. One purpose: carry on. Top to bottom:
 *   1. a quiet greeting with the date
 *   2. Continue, the only hero (large title, thin progress line, one button)
 *   3. Today: one line (goal ring and streak); the quests open in a sheet
 *   4. Up next: at most three rows
 * Mirrors the website's v2 Home (src/app/(dashboard)/dashboard/home-v2.tsx).
 */

const UP_ICON = { lecture: Play, study: BookOpen, weak: Dumbbell, daily: Stethoscope } as const;

/** A 28px ring: today's points against the goal. Fills from empty on arrival. */
export function GoalRing({ pct, size = 28 }: { pct: number; size?: number }) {
  return <ProgressRing pct={pct} size={size} stroke={4} delay={200} />;
}

/** The goal-met burst plays once per day per app session, not on every visit to Home. */
const celebrated = new Set<string>();

function Today({ goal, quests }: { goal: NonNullable<HomeData["goal"]>; quests: QuestCard | null | undefined }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const pct = Math.min(100, Math.round((goal.points / Math.max(1, goal.goal)) * 100));
  const hit = goal.points >= goal.goal;
  const doneCount = quests?.quests.filter((q) => q.done).length ?? 0;
  const questLine = quests ? (quests.done ? " · quests done" : ` · ${doneCount} of ${quests.quests.length} quests`) : "";
  const title = hit ? "Today's goal met" : `${Math.min(goal.points, goal.goal)} of ${goal.goal} points today`;
  const streak = `${goal.streak} day${goal.streak === 1 ? "" : "s"} in a row`;
  // A win: once the ring has filled, sparks fly from it with a success haptic.
  const [fire, setFire] = React.useState(0);
  React.useEffect(() => {
    const day = new Date().toDateString();
    if (!hit || celebrated.has(day)) return;
    const id = setTimeout(() => {
      celebrated.add(day);
      setFire((n) => n + 1);
      haptic.success();
    }, 900);
    return () => clearTimeout(id);
  }, [hit]);
  const line = (
    <>
      <View>
        <GoalRing pct={pct} />
        <Burst fire={fire} reach={30} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        {reduce ? (
          <T v="bodyStrong" num>
            {title}
          </T>
        ) : hit ? (
          <Stamp fire={fire}>
            <T v="bodyStrong">{title}</T>
          </Stamp>
        ) : (
          <View accessible accessibilityLabel={title} style={{ flexDirection: "row", alignItems: "flex-end", flexWrap: "wrap" }}>
            <RollingNumber v="bodyStrong" value={Math.min(goal.points, goal.goal)} />
            <T v="bodyStrong" num>
              {` of ${goal.goal} points today`}
            </T>
          </View>
        )}
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[1], flexWrap: "wrap" }}>
          <Flame size={16} color={c.muted} />
          <T v="small" tone="muted" num style={{ flexShrink: 1 }}>
            {streak}
            {questLine}
          </T>
        </View>
      </View>
    </>
  );
  const close = React.useCallback(() => setOpen(false), []);
  return (
    <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.hairline }}>
      {quests ? (
        <Pressable
          testID="home-today"
          accessibilityRole="button"
          accessibilityLabel={`Today: ${title}, ${streak}. Open today's quests`}
          onPress={() => {
            haptic.select();
            setOpen(true);
          }}
          style={({ pressed }) => ({
            minHeight: layout.row,
            paddingVertical: space[2],
            flexDirection: "row",
            alignItems: "center",
            gap: space[3],
            backgroundColor: pressed ? c.tint : "transparent",
          })}
        >
          {line}
          <ChevronRight size={20} color={c.muted} />
        </Pressable>
      ) : (
        <View
          testID="home-today"
          style={{
            minHeight: layout.row,
            paddingVertical: space[2],
            flexDirection: "row",
            alignItems: "center",
            gap: space[3],
          }}
        >
          {line}
        </View>
      )}
      {quests ? (
        <Sheet open={open} onClose={close} title="Today's quests" testID="quests-sheet">
          <RowList bare>
            {quests.quests.map((q) => (
              <Row
                key={q.id}
                title={q.label}
                icon={q.done ? <Check size={20} color={c.ink} /> : <Circle size={20} color={c.muted} />}
                trailing={q.progress ?? (q.done ? "Done" : undefined)}
                onPress={
                  q.done
                    ? undefined
                    : () => {
                        setOpen(false);
                        openTarget(q.target);
                      }
                }
              />
            ))}
          </RowList>
          <T v="small" tone="muted" style={{ paddingTop: space[4] }}>
            {quests.xpEach} XP each. All three: {quests.xpBonus} XP more and {quests.spareBonus} spare hints.
          </T>
        </Sheet>
      ) : null}
    </View>
  );
}

/** "Couldn't save, retrying": shown only while the outbox cannot reach the server. */
function SaveLine() {
  const retrying = outbox.state.use((s) => s.retrying);
  if (!retrying) return null;
  return (
    <T v="small" tone="muted" accessibilityLiveRegion="polite" testID="home-save-line">
      Couldn't save, retrying. Your progress is kept on this phone.
    </T>
  );
}

/** The skeleton in the real shape of Home: a greeting, the hero, three rows. */
export function HomeSkeleton() {
  return (
    <SkeletonIn>
      <View testID="home-skeleton" accessibilityRole="progressbar" accessibilityLabel="Loading" style={{ gap: layout.section }}>
        <Skeleton w="46%" h={14} />
        <View style={{ gap: space[4] }}>
          <Skeleton w="30%" h={14} />
          <Skeleton w="92%" h={34} />
          <Skeleton w="64%" h={34} />
          <Skeleton w="54%" h={16} />
          <Skeleton h={6} r={3} />
          <Skeleton h={52} r={12} />
        </View>
        <View style={{ gap: space[3] }}>
          <Skeleton w="22%" h={18} />
          {[0, 1, 2].map((i) => (
            <View key={i} style={{ minHeight: layout.row, justifyContent: "center", gap: space[2] }}>
              <Skeleton w={i === 1 ? "60%" : "74%"} h={16} />
              <Skeleton w="40%" h={12} />
            </View>
          ))}
        </View>
      </View>
    </SkeletonIn>
  );
}

export function HomeView({ data }: { data: HomeData }) {
  const c = useTheme();
  const { step, allDone, progress, goal, upNext, welcomeBack } = data;
  const hero = allDone
    ? {
        context: "All caught up",
        title: "Nothing left to do today.",
        meta: "Revise a weak topic or try a case while you wait for the next lecture.",
        cta: "Practise",
      }
    : {
        context: !welcomeBack && step.kind === "lecture" ? "Start your first lecture" : step.eyebrow,
        title: step.title,
        meta: step.meta ?? undefined,
        cta: step.cta,
      };
  return (
    <>
      <Enter i={0}>
        <T v="small" tone="muted" accessibilityRole="header" testID="home-greeting">
          {welcomeBack ? "Welcome back" : "Welcome to VIBHA"} ·{" "}
          <T v="small" tone="muted" num>
            {data.dateLine}
          </T>
        </T>
      </Enter>
      <Enter i={1}>
        <Hero
          context={hero.context}
          title={hero.title}
          meta={hero.meta}
          progress={!allDone && progress && progress.pct > 0 ? progress.pct : undefined}
          progressLabel={progress?.label}
          action={{
            label: hero.cta,
            onPress: () => openTarget(step.target),
            icon: <ArrowRight size={20} color={c.onPrimary} />,
            testID: "home-continue",
          }}
          below={<SaveLine />}
        />
      </Enter>
      {goal ? (
        <Enter i={3}>
          <Section title="Today">
            <Today goal={goal} quests={data.quests} />
          </Section>
        </Enter>
      ) : null}
      {upNext.length ? (
        <Enter i={4}>
          <Section title="Up next">
            <RowList>
              {upNext.slice(0, 3).map((r, i) => {
                const Icon = UP_ICON[r.kind];
                return <Row key={i} testID={`up-next-${i}`} title={r.title} meta={r.meta ?? undefined} icon={<Icon size={20} color={c.muted} />} onPress={() => openTarget(r.target)} />;
              })}
            </RowList>
          </Section>
        </Enter>
      ) : null}
    </>
  );
}

export function HomeScreen() {
  const q = useHome();
  return (
    <Screen tab top={<TabTop />} testID="home" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      {q.data ? <HomeView data={q.data} /> : q.isError ? <LoadError what="your home screen" onRetry={() => void q.refetch()} /> : <HomeSkeleton />}
      {q.data && !q.data.step && !q.data.upNext.length ? <EmptyState title="Nothing here yet" body="Your first lecture appears here as soon as it opens." /> : null}
    </Screen>
  );
}
