"use client";

import { usePathname } from "next/navigation";
import { isInnerStudentPath } from "./sidebar-gate";

/**
 * Round 9 drill-down on mobile: on inner student pages (course/lesson/material)
 * the app's mobile top bar is hidden so there's ONE header row — the page's own
 * back control. The top level (dashboard) keeps the bar. Mirrors the desktop
 * SidebarGate decision so both breakpoints share the drill-down model.
 */
export function MobileBarVisibility({
  role,
  mode,
  children,
}: {
  role: "student" | "admin";
  mode: "admin" | "student";
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const gateRole = role === "admin" && mode === "student" ? "admin-preview" : role;
  const hide = isInnerStudentPath(pathname ?? "", gateRole);
  return <>{hide ? null : children}</>;
}
