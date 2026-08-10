import type { NavItem } from "@/components/navigation/nav-items";

/**
 * Icons are referenced by string name (keys into NAV_ICONS in nav-items.tsx),
 * not by component reference — the config is imported into Server Components
 * and passed to a Client Component, and function values can't be serialized
 * across that boundary.
 */
export const STUDENT_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "My Courses", icon: "layoutDashboard", exact: true },
  { href: "/tools/psychopharm", label: "Tools", icon: "pill", exact: true },
  { href: "/practice", label: "Practice", icon: "stethoscope", exact: true },
  { href: "/reflect", label: "Journal", icon: "notebook", exact: true },
  { href: "/wall", label: "Wall", icon: "wall", exact: true },
];

export const ADMIN_ITEMS: NavItem[] = [
  { href: "/admin", label: "Overview", icon: "layoutDashboard", exact: true },
  { href: "/admin/students", label: "Students", icon: "users" },
  { href: "/admin/courses", label: "Courses", icon: "bookOpen" },
  { href: "/admin/submissions", label: "Submissions", icon: "inbox" },
  { href: "/admin/tools", label: "Tools", icon: "wrench" },
  { href: "/admin/psychopharm-review", label: "Medication library", icon: "pill" },
  { href: "/admin/corpus/dictate", label: "Dictate case", icon: "mic" },
];
