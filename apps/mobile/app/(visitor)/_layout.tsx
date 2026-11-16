import { Stack } from "expo-router";
import { useReducedMotion } from "react-native-reanimated";

import { stackMotion } from "@/motion";
import { useTheme } from "@/theme";

/**
 * Visitors see three things only: Welcome, then Sign in or Request an
 * invitation from its dock. No tab bar: one way to sign in, and the keyboard
 * gets the whole screen. Sign in and Request slide in over Welcome; back (or
 * the edge swipe) returns to it.
 */
/** Opened straight on Sign in (a link, "Sign in again"): Welcome still sits under it, so back works. */
export const unstable_settings = { initialRouteName: "welcome" };

export default function VisitorStack() {
  const c = useTheme();
  const reduce = !!useReducedMotion();
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg }, ...stackMotion(reduce) }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen
        name="request"
        options={{
          headerShown: true,
          title: "",
          headerStyle: { backgroundColor: c.bg },
          headerTintColor: c.ink,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    </Stack>
  );
}
