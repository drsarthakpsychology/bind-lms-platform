import { router } from "expo-router";
import * as React from "react";

import { useMe } from "@/api/queries";
import { TopBar } from "@/ds";
import { fonts, useTheme } from "@/theme";

/** The same header look as the root stack: the canvas colour, no shadow, a back arrow with no words. */
export function useAdminHeader() {
  const c = useTheme();
  return {
    title: "",
    headerStyle: { backgroundColor: c.bg },
    headerTintColor: c.ink,
    headerTitleStyle: { fontFamily: fonts.h3, fontSize: 18, color: c.ink },
    headerShadowVisible: false,
    headerBackButtonDisplayMode: "minimal" as const,
    headerTitleAlign: "left" as const,
    contentStyle: { backgroundColor: c.bg },
  };
}

/** The bar on the admin tabs: the VIBHA mark with "Admin" under it, and the bell. */
export function AdminTop() {
  const me = useMe();
  return <TopBar sub={me.data?.role === "view_admin" ? "Admin · view only" : "Admin"} unread={me.data?.unreadNotifications ?? 0} onBell={() => router.push("/notifications")} />;
}

/** Open a student's page (it lives outside the admin group, at /student/:id). */
export const openStudent = (id: string, tab?: string) => router.push(`/student/${encodeURIComponent(id)}${tab ? `?tab=${tab}` : ""}`);

/** Open New message, optionally for some students, a cohort, or with a title. */
export function openCompose(p: { to?: string[]; cohort?: string; title?: string } = {}) {
  const q = [p.to?.length ? `to=${encodeURIComponent(p.to.join(","))}` : null, p.cohort ? `cohort=${encodeURIComponent(p.cohort)}` : null, p.title ? `title=${encodeURIComponent(p.title)}` : null].filter(Boolean).join("&");
  router.push(`/compose${q ? `?${q}` : ""}`);
}
