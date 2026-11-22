import { router, Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useStackMotion } from "@/motion";
import { layout, space, useTheme } from "@/theme";

import { RoundButton } from "./layers";

/** Back to where you came from; a fresh link with nothing behind it lands on `home`. */
export function leave(home = "/home"): void {
  if (router.canGoBack()) router.back();
  else router.replace(home);
}

/** Hides the stack header for a screen that draws its own. `play` rises from the bottom and has no edge swipe. */
export function OwnHeader({ kind = "push" }: { kind?: "push" | "play" | "overlay" | "sheet" }) {
  const m = useStackMotion();
  return <Stack.Screen options={{ headerShown: false, ...m[kind], ...(kind === "play" ? { gestureEnabled: false } : null) }} />;
}

/**
 * The small bar on the field: a round back button, and at most one thing on
 * the right. Pass it as `top` to a `Screen` with `safeTop`, so the field starts
 * right under the status bar with no empty band above the title.
 */
export function BackBar({ home, right, label = "Back", testID = "back" }: { home?: string; right?: React.ReactNode; label?: string; testID?: string }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ minHeight: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingLeft: Math.max(layout.gutter, insets.left), paddingRight: Math.max(layout.gutter, insets.right), paddingTop: space[1] }}>
      <RoundButton onField label={label} testID={testID} onPress={() => leave(home)}>
        <ArrowLeft size={20} color={c.onField} />
      </RoundButton>
      {right}
    </View>
  );
}
