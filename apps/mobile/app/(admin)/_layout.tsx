import { Stack } from "expo-router";
import * as React from "react";

import { useStackMotion } from "@/motion";
import { useTheme } from "@/theme";

/**
 * Admins: the five tabs (Home, People, Clinic, Teaching, More) and the admin
 * screens that open on top of them. Every screen draws its own bar
 * (src/admin/ui.tsx), so the stack has no header. Everything in this group is
 * admin-only: the root guard sends anyone else home.
 */
export default function AdminStack() {
  const c = useTheme();
  // The same push, overlay and sheet rules as the rest of the app (src/motion/stack.ts).
  const m = useStackMotion();
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg }, ...m.push }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="admin/certificates/new" options={{ gestureEnabled: false }} />
      <Stack.Screen name="admin/search" options={{ ...m.overlay }} />
      <Stack.Screen name="admin/clinic/code/[id]" options={{ ...m.overlay }} />
      <Stack.Screen name="admin/students/new" options={{ ...m.sheet }} />
      <Stack.Screen name="admin/access" options={{ ...m.sheet }} />
    </Stack>
  );
}
