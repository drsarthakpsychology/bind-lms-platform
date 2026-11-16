import { Stack } from "expo-router";
import * as React from "react";
import { Platform } from "react-native";

import { useAdminHeader } from "@/admin/nav";
import { fadeMotion } from "@/motion";

/**
 * Admins: the five tabs, and the admin screens that open on top of them
 * (doubts, review, cohorts, people, forms, certificates, inbox threads).
 * Everything in this group is admin-only: the root guard sends anyone else home.
 */
export default function AdminStack() {
  const header = useAdminHeader();
  return (
    <Stack screenOptions={{ ...header, animation: Platform.OS === "android" ? "default" : undefined }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="admin/certificates/new" options={{ title: "", gestureEnabled: false }} />
      <Stack.Screen name="admin/certificates/anyone" options={{ title: "" }} />
      <Stack.Screen name="admin/alerts" options={{ title: "Admin alerts" }} />
      <Stack.Screen name="admin/search" options={{ headerShown: false, ...fadeMotion }} />
    </Stack>
  );
}
