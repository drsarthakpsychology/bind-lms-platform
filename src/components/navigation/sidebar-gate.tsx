"use client";

import { usePathname } from "next/navigation";

/**
 * Decides whether the persistent desktop sidebar shows.
 *
 * Student drill-down (Round 5, refined Round 10): on the DEEPEST pages —
 * a lesson or a material — we show ONE navigation surface at a time (the
 * page's own back header) and hide the app sidebar, so there's never two
 * columns of navigation. The course OVERVIEW page (`/courses/[id]`) keeps the
 * sidebar: it's a top-level navigation destination (like the dashboard), and
 * losing the sidebar there orphaned it as a floating fragment with no way
 * back to the course list except an inline text link.
 *
 * Admin view is unchanged (always shows the sidebar).
 */
export function isInnerStudentPath(pathname: string, role: string): boolean {
  if (role !== "student" && role !== "admin-preview") return false;
  // A lesson or material page, but NOT the course overview itself.
  // /courses/<id>/lessons/<lessonId>  ✓ hide sidebar
  // /courses/<id>/materials/<materialId> ✓ hide sidebar
  // /courses/<id>                     ✗ keep sidebar
  return /^\/courses\/[^/]+\/(?:lessons|materials)\//.test(pathname);
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
