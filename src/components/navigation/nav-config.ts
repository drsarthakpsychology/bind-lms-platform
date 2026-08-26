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

/** Lecture-only roster: a single nav destination — the lecture list. */
export const LECTURE_ONLY_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Lectures", icon: "bookOpen", exact: true },
];

/**
 * Admin nav is grouped into three labelled chunks (Review / Content / System)
 * rather than one flat 21-item column — 21 simultaneous options exceeds the
 * ~3–5 chunk working-memory ceiling, and grouping collapses the scan into
 * ~4 chunks. Each destination also carries a unique icon: no glyph is reused
 * for two different places, so the icon→destination mapping stays 1:1.
 */
export const ADMIN_ITEMS: NavItem[] = [
  { href: "/admin", label: "Overview", icon: "layoutDashboard", exact: true },

  // Review — the daily review workflow, highest-frequency first.
  { href: "/admin/triage", label: "Review triage", icon: "listFilter", section: "Review" },
  { href: "/admin/submissions", label: "Submissions", icon: "fileCheck", section: "Review" },
  { href: "/admin/sim-review", label: "Practice sessions", icon: "stethoscope", section: "Review" },
  { href: "/admin/supervision", label: "Sign-offs", icon: "clipboardCheck", section: "Review" },
  { href: "/admin/wall-reports", label: "Wall reports", icon: "flag", section: "Review" },
  { href: "/admin/enquiries", label: "Enquiries", icon: "inbox", section: "Review" },
  { href: "/admin/checkins", label: "Check-ins", icon: "heartPulse", section: "Review" },

  // Content — authoring and the knowledge base.
  { href: "/admin/courses", label: "Courses", icon: "bookOpen", section: "Content" },
  { href: "/admin/modules", label: "Modules", icon: "layers", section: "Content" },
  { href: "/admin/cards", label: "Study cards", icon: "idCard", section: "Content" },
  { href: "/admin/idioms", label: "Idiom bank", icon: "languages", section: "Content" },
  { href: "/admin/psychopharm-review", label: "Medication library", icon: "pill", section: "Content" },
  { href: "/admin/corpus/dictate", label: "Record a case", icon: "mic", section: "Content" },
  { href: "/admin/calibration", label: "Marking check", icon: "target", section: "Content" },

  // System — people, access, and platform.
  { href: "/admin/students", label: "Students", icon: "users", section: "System" },
  { href: "/admin/roster", label: "Roster & emails", icon: "mail", section: "System" },
  { href: "/admin/flags", label: "What's live", icon: "toggle", section: "System" },
  { href: "/admin/pulse", label: "Cohort progress", icon: "activity", section: "System" },
  { href: "/admin/infra", label: "Usage & limits", icon: "gauge", section: "System" },
  { href: "/admin/tools", label: "Admin tools", icon: "wrench", section: "System" },
];
