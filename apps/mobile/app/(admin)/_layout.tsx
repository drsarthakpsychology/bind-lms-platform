import { Stack } from "expo-router";
import * as React from "react";

import { useAdminHeader } from "@/admin/nav";
import { useStackMotion } from "@/motion";

/**
 * Admins: the five tabs, and the admin screens that open on top of them
 * (doubts, review, cohorts, people, forms, certificates, inbox threads).
 * Everything in this group is admin-only: the root guard sends anyone else home.
 */
export default function AdminStack() {
  const header = useAdminHeader();
  // The same push, overlay and fade rules as the rest of the app (src/motion/stack.ts).
  const m = useStackMotion();
  return (
    <Stack screenOptions={{ ...header, ...m.push }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="admin/certificates/new" options={{ title: "", gestureEnabled: false }} />
      <Stack.Screen name="admin/certificates/anyone" options={{ title: "" }} />
      <Stack.Screen name="admin/alerts" options={{ title: "Admin alerts" }} />
      <Stack.Screen name="admin/search" options={{ headerShown: false, ...m.overlay }} />
      <Stack.Screen name="admin/clinic/code/[id]" options={{ headerShown: false, ...m.overlay }} />
    </Stack>
  );
}
