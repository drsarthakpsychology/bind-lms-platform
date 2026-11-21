import { router } from "expo-router";
import { ArrowRight, BookOpen, CalendarOff, Check, ChevronRight, Circle, Dumbbell, Flame, NotebookText, Pill, Play, QrCode, Stethoscope } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";

import { outbox } from "@/api/outbox";
import { TodayBlock } from "@/clinic/today";
import { go } from "@/api/prefetch";
import { useHome, useMe, type HomeData } from "@/api/queries";
import { useClinicToday } from "@/clinic/api";
import { opdLine, sessionMeta, sessionTitle } from "@/clinic/logic";
import type { QuestCard } from "@/api/contract";
import { FieldCard, IconDot, Jyo, Label, LoadError, Pebbles, QuietEmpty, Row, RowList, Screen, Sheet, Skeleton, StillTrying, Stone, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { Enter, growFrom, useCardRef, PixelBurst, ProgressRing, RollingNumber, SkeletonIn, Stamp } from "@/motion";
import { openTarget } from "@/nav/targets";
import { TabTop } from "@/nav/top";
import { layout, space, useAccent, useTheme } from "@/theme";

/**
 * Today, the reference screen for the Layers look (docs/DESIGN.md).
 * On the field: the greeting, the date, and the one "now" pill.
 * On the layer, top to bottom:
 *   1. Keep going: the one thing to pick up (it grows into the screen it opens)
 *   2. Quick: four pebbles (Scan, Medicines, Notes, Leave)
 *   3. Your day: the clinic's sessions for today
 *   4. Today: the goal ring and streak; the quests open in a sheet
 *   5. After that: what comes next
 */

const UP_ICON = { lecture: Play, study: BookOpen, weak: Dumbbell, daily: Stethoscope } as const;

/**
 * A 28px ring: today's points against the goal. Fills from empty on arrival.
 * Once the goal is met the ring also carries a tick, so it reads as done even
 * before (or without) the fill animation.
 */
export function GoalRing({ pct, size = 28 }: { pct: number; size?: number }) {
  const c = useTheme();
  const a = useAccent();
  const done = pct >= 100;
  // On Home the ring is the area's deep colour on its wash.
  return (
    <ProgressRing pct={pct} size={size} stroke={4} delay={200} color={a.on ? a.deep : undefined} track={a.on ? a.wash : undefined}>
      {done ? (
        <View testID="goal-ring-done">
          <Check size={Math.round(size * 0.55)} color={c.ink} strokeWidth={3} />
        </View>
      ) : null}
    </ProgressRing>
  );
}

/** The goal-met burst plays once per day per app session, not on every visit to Home. */
const celebrated = new Set<string>();

function Today({ goal, quests, fresh }: { goal: NonNullable<HomeData["goal"]>; quests: QuestCard | null | undefined; /** A new student with no points yet. */ fresh: boolean }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const pct = Math.min(100, Math.round((goal.points / Math.max(1, goal.goal)) * 100));
  const hit = goal.points >= goal.goal;
  const doneCount = quests?.quests.filter((q) => q.done).length ?? 0;
  const questLine = quests ? (quests.done ? " · quests done" : ` · ${doneCount} of ${quests.quests.length} quests`) : "";
  const title = hit ? "Today's goal met" : `${Math.min(goal.points, goal.goal)} of ${goal.goal} points today`;
  const streak = streakLine(goal.streak, fresh);
  // A win (storyboard 4, goal met): once the ring has filled, a pixel burst pops from it with a success haptic and the title stamps.
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
        <PixelBurst fire={fire} reach={30} />
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
        {streak || questLine ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: space[1], flexWrap: "wrap" }}>
            {goal.streak > 0 ? <Flame size={16} color={c.areas.practise.deep} fill={c.areas.practise.wash} /> : null}
            <T v="small" tone="muted" num style={{ flexShrink: 1 }} testID="home-streak">
              {streak}
              {streak ? questLine : questLine.replace(/^ · /, "")}
            </T>
          </View>
        ) : null}
      </View>
    </>
  );
  const close = React.useCallback(() => setOpen(false), []);
  return (
    <View style={{ backgroundColor: c.card, borderRadius: layout.radiusLg, paddingHorizontal: space[4], overflow: "hidden" }}>
      {quests ? (
        <Pressable
          testID="home-today"
          accessibilityRole="button"
          accessibilityLabel={`Today: ${title}${streak ? `, ${streak}` : ""}. Open today's quests`}
          onPress={() => {
            setOpen(true);
          }}
          style={({ pressed }) => ({
            minHeight: 64,
            paddingVertical: space[3],
            flexDirection: "row",
            alignItems: "center",
            gap: space[3],
            opacity: pressed ? 0.7 : 1,
          })}
        >
          {line}
          <ChevronRight size={20} color={c.muted} />
        </Pressable>
      ) : (
        <View
          testID="home-today"
          style={{
            minHeight: 64,
            paddingVertical: space[3],
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

/**
 * "6 days in a row". No "0 days in a row": a new student is told where points
 * come from, anyone else with no streak sees nothing.
 */
export function streakLine(days: number, fresh = false): string {
  if (days > 0) return `${days} day${days === 1 ? "" : "s"} in a row`;
  return fresh ? "Your first points come from the first lecture" : "";
}

/** "Morning", "Afternoon" or "Evening", by the phone's clock. */
export function dayPart(now = new Date()): string {
  const h = now.getHours();
  return h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening";
}

/** On the blue field: the greeting, the date, and what is on now or next at the clinic. */
function TodayField({ data }: { data: HomeData | undefined }) {
  const me = useMe();
  const first = (me.data?.name ?? "").trim().split(/\s+/)[0];
  const hello = first ? `${dayPart()}, ${first}` : data && !data.welcomeBack ? "Welcome to VIBHA" : `Good ${dayPart().toLowerCase()}`;
  return (
    <View style={{ gap: space[4] }}>
      <View style={{ gap: 2 }}>
        <T v="display" tone="onField" accessibilityRole="header" testID="home-greeting">
          {hello}
        </T>
        {data ? (
          <T v="small" tone="onFieldMuted" num>
            {data.dateLine}
          </T>
        ) : null}
      </View>
      <NowCard />
    </View>
  );
}

/**
 * The one "now" pill: a session that is open for scanning (with Scan in or
 * Scan out), else the next session today, else today's OPD line. Nothing when
 * the day is empty. The scan itself lives in the clinic screens.
 */
function NowCard() {
  const q = useClinicToday();
  const d = q.data;
  if (!d) return null;
  const live = d.sessions.find((s) => s.status !== "cancelled" && s.mine && (s.mine.state === "open" || s.mine.state === "in"));
  if (live) {
    const out = live.mine?.state === "in";
    return <FieldCard testID="home-now" live title={out ? `You are in: ${sessionTitle(live)}` : `${sessionTitle(live)} is open`} meta={sessionMeta(live)} action={{ label: out ? "Scan out" : "Scan in", onPress: () => go("/clinic/scan"), testID: "home-scan" }} />;
  }
  const next = d.sessions.find((s) => s.status !== "cancelled" && s.mine?.state === "upcoming");
  if (next) return <FieldCard testID="home-now" title={`Next: ${sessionTitle(next)}`} meta={sessionMeta(next)} onPress={() => go("/clinic/schedule")} />;
  if (d.opd) return <FieldCard testID="home-now" title={opdLine(d.opd)} meta={d.opd.place ?? undefined} onPress={() => go("/clinic/schedule")} />;
  return null;
}

/**
 * "Keep going": the one thing to pick up, on a stone card with a ring showing
 * how far along it is and the lime play button. Tapping it grows the card
 * into the screen it opens.
 */
function KeepGoing({ data }: { data: HomeData }) {
  const c = useTheme();
  const ref = useCardRef();
  const { step, allDone, progress, welcomeBack } = data;
  if (!allDone && !step) return null;
  const title = allDone ? "Nothing left to do today" : step?.title || "Carry on";
  const meta = allDone ? "Revise a weak topic or try a case." : [!welcomeBack && step?.kind === "lecture" ? "Start your first lecture" : step?.eyebrow, step?.meta].filter(Boolean).join(" · ");
  const pct = !allDone && progress ? progress.pct : allDone ? 100 : 0;
  const open = () => growFrom(ref, () => (step && !allDone ? openTarget(step.target) : router.push("/practise")));
  return (
    <View style={{ gap: space[2] }}>
      <Label>{allDone ? "All caught up" : "Keep going"}</Label>
      <Stone ref={ref} testID="home-continue" accessibilityLabel={`${allDone ? "Practise" : step?.cta || "Open"}: ${title}${meta ? `. ${meta}` : ""}`} onPress={open}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
          <ProgressRing pct={pct} size={58} stroke={5} delay={200} color={c.dark ? c.lime : c.brand} track={c.hairline} label={progress?.label}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.lime, alignItems: "center", justifyContent: "center" }}>{allDone ? <ArrowRight size={18} color={c.onLime} strokeWidth={2.6} /> : <Play size={15} color={c.onLime} fill={c.onLime} />}</View>
          </ProgressRing>
          <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
            <T v="h2">{title}</T>
            {meta ? (
              <T v="small" tone="muted">
                {meta}
              </T>
            ) : null}
          </View>
        </View>
      </Stone>
      <SaveLine />
    </View>
  );
}

export function HomeView({ data }: { data: HomeData }) {
  const c = useTheme();
  const { goal, upNext, welcomeBack } = data;
  const next = upNext[0];
  const NextIcon = next ? (UP_ICON[next.kind as keyof typeof UP_ICON] ?? Play) : Play;
  return (
    <>
      <Enter i={0}>
        <KeepGoing data={data} />
      </Enter>
      <Enter i={1}>
        <View style={{ gap: space[2] }}>
          <Label>Quick</Label>
          <Pebbles
            items={[
              { label: "Scan", icon: QrCode, live: true, onPress: () => go("/clinic/scan"), testID: "quick-scan" },
              { label: "Medicines", icon: Pill, onPress: () => go("/medicines"), testID: "quick-medicines" },
              { label: "Notes", icon: NotebookText, onPress: () => router.push("/library"), testID: "quick-notes" },
              { label: "Leave", icon: CalendarOff, onPress: () => go("/clinic/leave"), testID: "quick-leave" },
            ]}
          />
        </View>
      </Enter>
      <TodayBlock />
      {goal ? (
        <Enter i={3}>
          <View style={{ gap: space[2] }}>
            <Label>Today</Label>
            <Today goal={goal} quests={data.quests} fresh={!welcomeBack && goal.points <= 0} />
          </View>
        </Enter>
      ) : null}
      {next ? (
        <Enter i={4}>
          <View style={{ gap: space[2] }}>
            <Label>After that</Label>
            <Stone quiet testID="up-next-0" accessibilityLabel={`${next.title}${next.meta ? `. ${next.meta}` : ""}`} onPress={() => openTarget(next.target)}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
                <IconDot icon={NextIcon} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <T v="bodyStrong">{next.title}</T>
                  {next.meta ? (
                    <T v="small" tone="muted">
                      {next.meta}
                    </T>
                  ) : null}
                </View>
                <ArrowRight size={18} color={c.muted} />
              </View>
            </Stone>
            {upNext.length > 1 ? (
              <RowList bare>
                {upNext.slice(1, 3).map((r, i) => {
                  const Icon = UP_ICON[r.kind as keyof typeof UP_ICON] ?? Play;
                  return <Row key={i} testID={`up-next-${i + 1}`} title={r.title} meta={r.meta ?? undefined} icon={<IconDot icon={Icon} />} onPress={() => openTarget(r.target)} />;
                })}
              </RowList>
            ) : null}
          </View>
        </Enter>
      ) : null}
    </>
  );
}

/**
 * Today (the student's first screen). On the blue field: the greeting and
 * what is on now at the clinic, with Scan in. On the layer: the one thing to
 * pick up, four quick actions, the day's sessions, today's goal, what comes
 * after. Jyo shows only when there is nothing at all to do.
 */
export function HomeScreen() {
  const q = useHome();
  const empty = !!q.data && !q.data.step && !q.data.upNext.length && !q.data.allDone;
  return (
    <Screen tab area="home" top={<TabTop />} testID="home" field={<TodayField data={q.data} />} gap={space[5]} onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      {q.data ? <HomeView data={q.data} /> : q.isError ? <LoadError what="your home screen" error={q.error} onRetry={() => void q.refetch()} /> : (
        <>
          <HomeSkeleton />
          <StillTrying failed={q.failureCount > 0} />
        </>
      )}
      {empty ? <QuietEmpty testID="home-empty" art={<Jyo pose="resting" size={64} />} title="Nothing here yet" body="Your first lecture appears here as soon as it opens." /> : null}
    </Screen>
  );
}
