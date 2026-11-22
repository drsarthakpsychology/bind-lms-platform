import { router, useLocalSearchParams } from "expo-router";
import { BookOpen, Map as MapIcon, NotebookText } from "lucide-react-native";
import * as React from "react";
import { Pressable, View, type LayoutChangeEvent } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from "react-native-reanimated";

import { go } from "@/api/prefetch";
import { useMe, useStudyHome } from "@/api/queries";
import { IconDot, Jyo, QuietEmpty, Screen, Stone, T } from "@/ds";
import { springs, Swap, useMotionTier } from "@/motion";
import { hasStudy, isSide, loadStudySide, saveStudySide, studySideNow, type StudySide } from "@/nav/study";
import { TabTop } from "@/nav/top";
import { QuickBrowse } from "@/library/quick-browse";
import { useQuickLibrary } from "@/library/quick-notes";
import { Fetched, TilesSkeleton } from "@/screens/learn/parts";
import { fonts, space, useTheme } from "@/theme";
import { StudyHomeBody } from "./home";

type IconType = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

const H = 64;
const INSET = 4;

/**
 * The two big switches on the field: Modules | Notes. One lime pill slides
 * under the side you are on (transform and width, UI thread, snappy spring);
 * Reduce Motion and low-end Android: it jumps. Each half is a 64px target with
 * its name and a short count.
 */
export function SideSwitch({ side, onChange, modulesMeta, notesMeta }: { side: StudySide; onChange: (s: StudySide) => void; modulesMeta?: string; notesMeta?: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const { low } = useMotionTier();
  const [w, setW] = React.useState(0);
  const x = useSharedValue(0);
  const placed = React.useRef(false);
  const half = w > 0 ? (w - INSET * 2) / 2 : 0;
  React.useEffect(() => {
    if (!half) return;
    const to = side === "notes" ? half : 0;
    if (!placed.current || reduce || low) {
      placed.current = true;
      x.set(to);
    } else x.set(withSpring(to, springs.snappy));
  }, [side, half, reduce, low, x]);
  const pill = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const item = (id: StudySide, name: string, meta: string | undefined, Icon: IconType) => {
    const on = side === id;
    return (
      <Pressable
        key={id}
        testID={`study-side-${id}`}
        accessibilityRole="tab"
        accessibilityState={{ selected: on }}
        accessibilityLabel={meta ? `${name}. ${meta}` : name}
        onPress={() => onChange(id)}
        style={{ flex: 1, height: H - INSET * 2, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space[2], paddingHorizontal: space[2] }}
      >
        <Icon size={20} color={on ? c.onLime : c.onField} strokeWidth={on ? 2.3 : 2} />
        <View style={{ minWidth: 0, flexShrink: 1 }}>
          <T numberOfLines={1} maxFontSizeMultiplier={1.3} style={{ fontFamily: fonts.bold, fontSize: 16, lineHeight: 20, color: on ? c.onLime : c.onField }}>
            {name}
          </T>
          {meta ? (
            <T numberOfLines={1} num maxFontSizeMultiplier={1.2} style={{ fontSize: 12, lineHeight: 15, color: on ? c.onLime : c.onFieldMuted, opacity: on ? 0.78 : 1 }}>
              {meta}
            </T>
          ) : null}
        </View>
      </Pressable>
    );
  };
  return (
    <View
      testID="study-switch"
      accessibilityRole="tablist"
      onLayout={(e: LayoutChangeEvent) => setW(Math.round(e.nativeEvent.layout.width))}
      style={{ height: H, borderRadius: H / 2, backgroundColor: c.fieldTint, flexDirection: "row", alignItems: "center", padding: INSET }}
    >
      {half ? <Animated.View pointerEvents="none" testID="study-switch-pill" style={[{ position: "absolute", left: INSET, top: INSET, width: half, height: H - INSET * 2, borderRadius: (H - INSET * 2) / 2, backgroundColor: c.lime }, pill]} /> : null}
      {item("modules", "Modules", modulesMeta, BookOpen)}
      {item("notes", "Notes", notesMeta, NotebookText)}
    </View>
  );
}

/** The side to open on: what a link asked for, else the one used last, else Modules. */
function useSide(): [StudySide, (s: StudySide) => void] {
  const { side: asked } = useLocalSearchParams<{ side?: string }>();
  const [side, setSide] = React.useState<StudySide>(() => (isSide(asked) ? asked : (studySideNow() ?? "modules")));
  const chosen = React.useRef(isSide(asked));
  React.useEffect(() => {
    if (chosen.current) return;
    let live = true;
    void loadStudySide().then((s) => {
      if (live && !chosen.current) setSide(s);
    });
    return () => {
      live = false;
    };
  }, []);
  // A link (Today's Notes, a notice) opened this tab on one side: show it, remember it, and clear the ask so the next link works too.
  const ask = isSide(asked) ? asked : null;
  const [seenAsk, setSeenAsk] = React.useState<StudySide | null>(ask);
  if (ask !== seenAsk) {
    setSeenAsk(ask);
    if (ask) setSide(ask);
  }
  React.useEffect(() => {
    if (!isSide(asked)) return;
    chosen.current = true;
    saveStudySide(asked);
    try {
      router.setParams?.({ side: undefined });
    } catch {
      // Not inside a navigator (tests): nothing to clear.
    }
  }, [asked]);
  const pick = React.useCallback((s: StudySide) => {
    chosen.current = true;
    setSide(s);
    saveStudySide(s);
  }, []);
  return [side, pick];
}

/**
 * Study, the tab: Modules and Notes side by side, one big switch on the field.
 * Modules: carry on reading, Your map, every module on three shelves.
 * Notes: Quick Notes, the one look-up library (criteria, comparisons,
 * medicines, therapies, summaries and words). The side you used
 * last comes back next time. Switching crossfades the layer's content.
 */
export function StudyTab() {
  const me = useMe();
  const on = hasStudy(me.data);
  const [side, setSide] = useSide();
  const study = useStudyHome(on);
  const notes = useQuickLibrary(on);
  const d = study.data;
  const done = d ? d.modules.filter((m) => m.status.complete).length : 0;
  const modulesMeta = d?.modules.length ? `${done} of ${d.modules.length} done` : undefined;
  const notesMeta = notes.data?.items.length ? "Look up anything" : undefined;
  const refresh = () => void Promise.all([study.refetch(), notes.refetch()]);

  if (!on) {
    return (
      <Screen tab area="library" top={<TabTop />} title="Study" testID="study-tab">
        <QuietEmpty testID="study-off" art={<Jyo pose="resting" size={64} />} title="Modules are not open for you" body="Your lectures are in Learn." action={{ label: "Open Learn", onPress: () => router.push("/learn") }} />
      </Screen>
    );
  }
  return (
    <Screen
      tab
      area="library"
      top={<TabTop />}
      title="Study"
      testID="study-tab"
      gap={space[5]}
      onRefresh={refresh}
      refreshing={study.isRefetching || notes.isRefetching}
      field={<SideSwitch side={side} onChange={setSide} modulesMeta={modulesMeta} notesMeta={notesMeta} />}
    >
      <Swap k={side} dir={side === "notes" ? 1 : -1} style={{ gap: space[5] }} testID={`study-${side}`}>
        {side === "modules" ? (
          <Fetched q={study} what="your modules" skeleton={<TilesSkeleton card rows={4} />}>
            {(x) => (
              <View testID="study" style={{ gap: space[5] }}>
                <StudyHomeBody
                  d={x}
                  after={
                    x.modules.length ? (
                      <Stone testID="study-map" accessibilityLabel="Your map. Every topic and how well you know it" onPress={() => go("/map")} pad={space[3] + 2}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
                          <IconDot icon={MapIcon} />
                          <View style={{ flex: 1, minWidth: 0, gap: 1 }}>
                            <T v="bodyStrong">Your map</T>
                            <T v="small" tone="muted">
                              Every topic and how well you know it
                            </T>
                          </View>
                        </View>
                      </Stone>
                    ) : null
                  }
                />
              </View>
            )}
          </Fetched>
        ) : (
          <View testID="notes-hub">
            <QuickBrowse />
          </View>
        )}
      </Swap>
    </Screen>
  );
}
