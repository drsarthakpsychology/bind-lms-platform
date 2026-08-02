"use client";

import { usePathname } from "next/navigation";

/**
 * Decides whether the persistent desktop sidebar shows.
 *
 * Student drill-down (Round 5): on inner pages (course, lesson, material) we
 * show ONE navigation surface at a time — the page's own back header — and
 * hide the app sidebar entirely, so there's never two columns of navigation.
 * The top level (dashboard) keeps the sidebar.
 *
 * Admin view is unchanged (always shows the sidebar).
 */
export function isInnerStudentPath(pathname: string, role: string): boolean {
  if (role !== "student" && role !== "admin-preview") return false;
  return /^\/(courses\/[^/]+)/.test(pathname);
}

export function SidebarGate({
  role,
  children,
  fallback,
}: {
  role: string;
  children: React.ReactNode;
  fallback: React.ReactNode;
}) {
  const pathname = usePathname();
  const hide = isInnerStudentPath(pathname ?? "", role);
  return <>{hide ? fallback : children}</>;
}
