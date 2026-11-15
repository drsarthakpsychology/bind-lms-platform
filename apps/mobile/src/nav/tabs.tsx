import { Tabs } from "expo-router";
import * as React from "react";
import { Platform } from "react-native";

import { haptic } from "@/lib/haptics";
import { fonts, useTheme } from "@/theme";

export type TabDef = { name: string; title: string; icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }> };

/**
 * The bottom tab bar, the same for every kind of account: icon and short
 * label, the current tab in blue (lime in dark), a hairline on top, no
 * shadow. Each tab keeps its own place when you switch away and back.
 */
export function TabBar({ tabs }: { tabs: TabDef[] }) {
  const c = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.link,
        tabBarInactiveTintColor: c.muted,
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16 },
        tabBarAllowFontScaling: false,
        tabBarStyle: { backgroundColor: c.card, borderTopColor: c.hairline, borderTopWidth: 1, elevation: 0, shadowOpacity: 0, ...(Platform.OS === "web" ? { height: 64 } : null) },
        tabBarItemStyle: { paddingTop: 4 },
        tabBarHideOnKeyboard: true,
        sceneStyle: { backgroundColor: c.bg },
      }}
      screenListeners={{ tabPress: () => void haptic.select() }}
    >
      {tabs.map((t) => (
        <Tabs.Screen key={t.name} name={t.name} options={{ title: t.title, tabBarAccessibilityLabel: t.title, tabBarIcon: ({ color, focused }) => <t.icon size={24} color={String(color)} strokeWidth={focused ? 2.4 : 2} /> }} />
      ))}
    </Tabs>
  );
}
