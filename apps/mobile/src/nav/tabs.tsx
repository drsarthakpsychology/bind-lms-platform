import { Tabs } from "expo-router";
import * as React from "react";
import { useReducedMotion } from "react-native-reanimated";

import { MotionTabBar, tabSceneOptions, type TabIcon } from "@/motion";
import { useTheme } from "@/theme";

export type TabDef = { name: string; title: string; icon: TabIcon };

/**
 * The bottom tab bar, the same for every kind of account: icon and short
 * label, the current tab in blue (lime in dark) with a soft pill that
 * springs between tabs, a hairline on top, no shadow. Screens trade places
 * with a short fade and shift. Each tab keeps its own place when you switch
 * away and back. See src/motion/tabbar.tsx and docs/MOTION.md.
 */
export function TabBar({ tabs }: { tabs: TabDef[] }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const icons = React.useMemo(() => Object.fromEntries(tabs.map((t) => [t.name, t.icon])), [tabs]);
  // Warm up the other tabs once the first one has settled, so a first visit never shows an empty frame.
  const [warm, setWarm] = React.useState(false);
  React.useEffect(() => {
    // About when Home's entry has played out (its blocks are in by ~600ms).
    const t = setTimeout(() => setWarm(true), 1200);
    return () => clearTimeout(t);
  }, []);
  return (
    <Tabs
      tabBar={(props) => <MotionTabBar {...props} icons={icons} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        lazy: !warm,
        sceneStyle: { backgroundColor: c.bg },
        ...tabSceneOptions(!!reduce),
      }}
    >
      {tabs.map((t) => (
        <Tabs.Screen key={t.name} name={t.name} options={{ title: t.title, tabBarAccessibilityLabel: t.title }} />
      ))}
    </Tabs>
  );
}
