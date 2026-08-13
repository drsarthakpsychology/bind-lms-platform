import type { NavItem } from "@/components/navigation/nav-items";

/**
 * Icons are referenced by string name (keys into NAV_ICONS in nav-items.tsx),
 * not by component reference — the config is imported into Server Components
 * and passed to a Client Component, and function values can't be serialized
 * across that boundary.
 */
export const STUDENT_ITEMS: NavItem[] = [
  { href: "/today", label: "Today", icon: "layoutDashboard", exact: true },
  { href: "/dashboard", label: "My Courses", icon: "bookOpen", exact: true },
  { href: "/tools/psychopharm", label: "Tools", icon: "pill", exact: true },
  { href: "/practice", label: "Practice", icon: "stethoscope", exact: true },
  { href: "/reflect", label: "Journal", icon: "notebook", exact: true },
  { href: "/wall", label: "Wall", icon: "wall", exact: true },
  { href: "/passport", label: "Passport", icon: "radar" },
  { href: "/record", label: "Record", icon: "clipboardList" },
];

export const ADMIN_ITEMS: NavItem[] = [
  { href: "/admin", label: "Overview", icon: "layoutDashboard", exact: true },
  { href: "/admin/students", label: "Students", icon: "users" },
  { href: "/admin/enquiries", label: "Enquiries", icon: "inbox" },
  { href: "/admin/courses", label: "Courses", icon: "bookOpen" },
  { href: "/admin/submissions", label: "Submissions", icon: "inbox" },
  { href: "/admin/tools", label: "Tools", icon: "wrench" },
  { href: "/admin/psychopharm-review", label: "Medication library", icon: "pill" },
  { href: "/admin/corpus/dictate", label: "Dictate case", icon: "mic" },
  { href: "/admin/sim-review", label: "Sim sessions", icon: "stethoscope" },
  { href: "/admin/triage", label: "Review triage", icon: "inbox" },
  { href: "/admin/checkins", label: "Check-ins", icon: "heartPulse" },
  { href: "/admin/supervision", label: "Sign-offs", icon: "clipboardCheck" },
  { href: "/admin/flags", label: "Feature flags", icon: "toggle" },
  { href: "/admin/calibration", label: "Calibration", icon: "target" },
  { href: "/admin/cards", label: "Cards", icon: "idCard" },
  { href: "/admin/rights", label: "Rights", icon: "shieldCheck" },
  { href: "/admin/wall-reports", label: "Wall reports", icon: "flag" },
  { href: "/admin/modules", label: "Modules", icon: "layers" },
  { href: "/admin/pulse", label: "Cohort pulse", icon: "heartPulse" },
  { href: "/admin/infra", label: "Infrastructure", icon: "gauge" },
];
