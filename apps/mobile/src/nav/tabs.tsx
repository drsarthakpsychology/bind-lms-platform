import { Tabs } from "expo-router";
import * as React from "react";
import { useReducedMotion } from "react-native-reanimated";

import { MotionTabBar, tabSceneOptions, useMotionTier, type TabIcon } from "@/motion";
import { useTheme, type Area } from "@/theme";

export type TabDef = { name: string; title: string; icon: TabIcon; /** The area the tab's screen wears: the bar's pill washes into its colour. */ area?: Area; /** Not shown in the bar (an account without this part); its address still opens it. */ hidden?: boolean };

/**
 * The bottom tab bar, the same for every kind of account: a dark pill
 * floating over the layer, an icon per tab, the current tab a lime pill with
 * its name. Tabs switch at once. Each tab keeps its own place when you switch
 * away and back. See src/motion/tabbar.tsx and docs/DESIGN.md.
 */
export function TabBar({ tabs }: { tabs: TabDef[] }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const { low } = useMotionTier();
  const icons = React.useMemo(() => Object.fromEntries(tabs.map((t) => [t.name, t.icon])), [tabs]);
  const areas = React.useMemo(() => Object.fromEntries(tabs.map((t) => [t.name, t.area])), [tabs]);
  // Warm up the other tabs once the first one has settled, so a first visit never shows an empty frame.
  const [warm, setWarm] = React.useState(false);
  React.useEffect(() => {
    // About when Home's entry has played out (its blocks are in by ~600ms).
    const t = setTimeout(() => setWarm(true), 1200);
    return () => clearTimeout(t);
  }, []);
  return (
    <Tabs
      tabBar={(props) => <MotionTabBar {...props} icons={icons} areas={areas} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        lazy: !warm,
        sceneStyle: { backgroundColor: c.bg },
        ...tabSceneOptions(!!reduce, low),
      }}
    >
      {tabs.map((t) => (
        <Tabs.Screen key={t.name} name={t.name} options={{ title: t.title, tabBarAccessibilityLabel: t.title, ...(t.hidden ? { tabBarItemStyle: { display: "none" } } : null) }} />
      ))}
    </Tabs>
  );
}
