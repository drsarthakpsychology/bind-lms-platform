import { BookOpen, House, LibraryBig, Target, User } from "lucide-react-native";
import * as React from "react";
import { BackHandler, View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from "react-native-reanimated";

import { Button, T } from "@/ds";
import { prefs } from "@/lib/storage";
import { Enter, Press, springs, Swap, useMotionTier } from "@/motion";
import { Gate } from "@/screens/auth/gates";
import { layout, space, useTheme, type Area } from "@/theme";
import { JyoOnField } from "@/visitor/jyo-field";

type IconType = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

/** The five tabs, in the order of the tab bar (app/(student)/_layout.tsx). */
export const TOUR_TABS: { id: string; area: Area; name: string; icon: IconType; line: string; points: [string, string, string] }[] = [
  { id: "today", area: "home", name: "Today", icon: House, line: "What matters right now.", points: ["Your next class or clinic session, with Scan in", "The lecture you stopped, ready to pick up", "Quick ways to Medicines, Notes and Leave"] },
  { id: "learn", area: "learn", name: "Learn", icon: BookOpen, line: "Lectures, hand-ins and doubts.", points: ["Watch lectures and keep your place", "Hand in your assignments", "Ask a doubt and see the answer"] },
  { id: "study", area: "library", name: "Study", icon: LibraryBig, line: "Modules and notes, one switch apart.", points: ["Modules: read, take the checkpoints, see your map", "Notes: revision notes and quick reference", "Medicines, with a way to compare two"] },
  { id: "practise", area: "practise", name: "Practise", icon: Target, line: "Cases and games for your clinical eye.", points: ["A case of the day in about five minutes", "Games that train what you notice", "Practice sets and full mocks"] },
  { id: "me", area: "me", name: "Me", icon: User, line: "Your clinic, your progress, your settings.", points: ["Attendance, leave and your schedule", "Progress and certificates", "Text size, vibration, PIN and fingerprint"] },
];

/* Shown once on this phone, after the first sign-in. */
const TOUR_KEY = "vibha.tour.tabs.v1";
let tourDone: boolean | null = null;

export async function tourSeen(): Promise<boolean> {
  if (tourDone !== null) return tourDone;
  try {
    tourDone = (await prefs.get(TOUR_KEY)) === "1";
  } catch {
    tourDone = false;
  }
  return tourDone;
}

export function markTourSeen(): void {
  tourDone = true;
  void prefs.set(TOUR_KEY, "1").catch(() => undefined);
}

/** Tests only: forget the in-memory flag. */
export function resetTourForTests(): void {
  tourDone = null;
}

const BAR_H = 60;
const PILL_H = 46;

/**
 * The first-run tour: Jyo says hello, then one short page per tab while the
 * lime pill of a small copy of the tab bar slides to it. Five taps at most,
 * and "Skip" is there from the first page. Shown once (the caller remembers).
 * Back steps back a page, and skips from the first one.
 */
export function TabTour({ name, onDone }: { /** First name, for the hello. */ name?: string; onDone: () => void }) {
  const [page, setPage] = React.useState(0); // 0 is the hello; 1 to 5 are the tabs.
  const [dir, setDir] = React.useState<1 | -1>(1);
  const last = TOUR_TABS.length;
  const go = React.useCallback((to: number) => {
    setPage((p) => {
      setDir(to >= p ? 1 : -1);
      return Math.max(0, Math.min(TOUR_TABS.length, to));
    });
  }, []);

  React.useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (page === 0) onDone();
      else go(page - 1);
      return true;
    });
    return () => sub.remove();
  }, [page, go, onDone]);

  const tab = page > 0 ? TOUR_TABS[page - 1]! : null;
  return (
    <Gate
      testID="tab-tour"
      titleKey={`p${page}`}
      title={tab ? tab.name : name ? `Hello, ${name}` : "Hello"}
      lead={tab ? `${page} of ${last}` : "I am Jyo, your study lamp."}
      side={<JyoOnField size={68} label="Jyo, a small clay lamp, says hello" />}
      top={page < last ? <Button kind="text" label="Skip" onPress={onDone} testID="tour-skip" accessibilityHint="Closes the tour and opens the app" style={{ alignSelf: "center" }} /> : null}
      footer={
        <>
          <MiniBar current={page - 1} onPick={(i) => go(i + 1)} />
          <Button label={page === 0 ? "Show me around" : page === last ? "Start" : "Next"} onPress={() => (page === last ? onDone() : go(page + 1))} testID="tour-next" />
        </>
      }
    >
      <Swap k={page} dir={dir} accessibilityLiveRegion="polite">
        {tab ? <TabPage tab={tab} /> : <Hello />}
      </Swap>
    </Gate>
  );
}

function Hello() {
  const c = useTheme();
  return (
    <View testID="tour-hello" style={{ gap: space[5] }}>
      <View style={{ gap: space[2] }}>
        <T v="h1">Five tabs. Everything has a place.</T>
        <T tone="muted">A quick look, then you are in. It takes about twenty seconds.</T>
      </View>
      <View style={{ gap: space[1] }}>
        {TOUR_TABS.map((t, i) => {
          const a = c.areas[t.area];
          return (
            <Enter key={t.id} i={i} style={{ flexDirection: "row", alignItems: "center", gap: space[3], minHeight: 44 }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: a.wash, alignItems: "center", justifyContent: "center" }}>
                <t.icon size={18} color={a.deep} strokeWidth={2} />
              </View>
              <T v="bodyStrong" style={{ width: 76 }}>
                {t.name}
              </T>
              <T v="small" tone="muted" style={{ flex: 1 }}>
                {t.line}
              </T>
            </Enter>
          );
        })}
      </View>
    </View>
  );
}

function TabPage({ tab }: { tab: (typeof TOUR_TABS)[number] }) {
  const c = useTheme();
  const a = c.areas[tab.area];
  return (
    <View testID={`tour-page-${tab.id}`} style={{ gap: space[5] }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: a.wash, alignItems: "center", justifyContent: "center" }}>
          <tab.icon size={32} color={a.deep} strokeWidth={2} />
        </View>
        <T v="h1" style={{ flex: 1 }}>
          {tab.line}
        </T>
      </View>
      <View style={{ backgroundColor: c.card, borderRadius: layout.radiusLg, padding: space[4], gap: space[3] }}>
        {tab.points.map((p, i) => (
          <Enter key={p} i={i + 1} style={{ flexDirection: "row", alignItems: "flex-start", gap: space[3] }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: a.deep, marginTop: 8 }} />
            <T style={{ flex: 1 }}>{p}</T>
          </Enter>
        ))}
      </View>
    </View>
  );
}

/**
 * A small copy of the tab bar: the lime pill slides to the tab being shown
 * (transform only, UI thread, the snappy spring). Tapping an icon jumps there.
 */
function MiniBar({ current, onPick }: { /** -1 on the hello page: no pill yet. */ current: number; onPick: (i: number) => void }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const { low } = useMotionTier();
  const [w, setW] = React.useState(0);
  const cell = w / TOUR_TABS.length;
  const x = useSharedValue(0);
  const on = useSharedValue(0);
  React.useEffect(() => {
    const to = Math.max(0, current) * cell;
    const still = reduce || low || current < 0;
    x.set(still ? to : withSpring(to, springs.snappy));
    on.set(current < 0 ? 0 : reduce || low ? 1 : withSpring(1, springs.snappy));
  }, [current, cell, reduce, low, x, on]);
  const pill = useAnimatedStyle(() => ({ opacity: on.value, transform: [{ translateX: x.value }, { scale: 0.9 + on.value * 0.1 }] }));
  return (
    <View accessibilityRole="tablist" testID="tour-bar" style={{ alignSelf: "center", width: "100%", maxWidth: 340, height: BAR_H, borderRadius: BAR_H / 2, backgroundColor: c.dark ? c.raised : c.ink, paddingHorizontal: 7, marginBottom: space[2] }}>
      <View onLayout={(e) => setW(e.nativeEvent.layout.width)} style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        {w > 0 ? <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: (BAR_H - PILL_H) / 2, width: cell, height: PILL_H, borderRadius: PILL_H / 2, backgroundColor: c.lime }, pill]} /> : null}
        {TOUR_TABS.map((t, i) => {
          const focused = i === current;
          return (
            <Press key={t.id} squish scale={0.9} onPress={() => onPick(i)} accessibilityRole="tab" accessibilityState={{ selected: focused }} accessibilityLabel={`Show ${t.name}`} testID={`tour-tab-${t.id}`} style={{ flex: 1 }} innerStyle={{ height: BAR_H, alignItems: "center", justifyContent: "center" }}>
              <t.icon size={22} color={focused ? c.onLime : c.dark ? c.ink : c.bg} strokeWidth={2} />
            </Press>
          );
        })}
      </View>
    </View>
  );
}
