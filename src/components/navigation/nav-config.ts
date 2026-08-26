import type { NavItem } from "@/components/navigation/nav-items";

/**
 * Icons are referenced by string name (keys into NAV_ICONS in nav-items.tsx),
 * not by component reference — the config is imported into Server Components
 * and passed to a Client Component, and function values can't be serialized
 * across that boundary.
 */
export const STUDENT_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "My Courses", icon: "bookOpen", exact: true },
  { href: "/tools/psychopharm", label: "Tools", icon: "pill", exact: true },
  { href: "/practice", label: "Practice", icon: "stethoscope", exact: true },
  { href: "/reflect", label: "Journal", icon: "notebook", exact: true },
  { href: "/wall", label: "Wall", icon: "wall", exact: true },
  // Passport (skills_passport) and Record are not released for this cohort —
  // a nav link to an empty/placeholder surface is worse than no link. The
  // routes remain (no admin access is removed); students just aren't pointed at
  // them from the shell.
];

/**
 * Roster accounts: the lecture list plus the practice hub — everything the
 * programme has made live or unlocked. The practice hub itself only shows
 * live/unlocked tools, and each tool route is server-gated by its flag.
 */
export const LECTURE_ONLY_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Lectures", icon: "bookOpen", exact: true },
  { href: "/practice", label: "Practice", icon: "sparkles" },
];

/**
 * Admin nav is grouped into labelled chunks (Launch / Review / Content /
 * System) rather than one flat column — 20+ simultaneous options exceeds the
 * ~3–5 chunk working-memory ceiling, and grouping collapses the scan into a
 * few chunks. The launch-critical surfaces (build/upload courses, people,
 * emails, what's live) sit at the top so they're always one glance away —
 * not buried at the bottom of a long list. Each destination carries a unique
 * icon: no glyph is reused for two different places, so the icon→destination
 * mapping stays 1:1.
 */
export const ADMIN_ITEMS: NavItem[] = [
  { href: "/admin", label: "Overview", icon: "layoutDashboard", exact: true },

  // Launch — the go-live surfaces: upload content, manage people, send
  // credentials, switch what's live. Highest value when the programme is
  // first going out to students.
  { href: "/admin/courses", label: "Courses", icon: "bookOpen", section: "Launch" },
  { href: "/admin/students", label: "Students", icon: "users", section: "Launch" },
  { href: "/admin/roster", label: "Roster & emails", icon: "mail", section: "Launch" },
  { href: "/admin/flags", label: "What's live", icon: "toggle", section: "Launch" },

  // Review — the daily review workflow, highest-frequency first.
  { href: "/admin/triage", label: "Review triage", icon: "listFilter", section: "Review" },
  { href: "/admin/submissions", label: "Submissions", icon: "fileCheck", section: "Review" },
  { href: "/admin/sim-review", label: "Practice sessions", icon: "stethoscope", section: "Review" },
  { href: "/admin/supervision", label: "Sign-offs", icon: "clipboardCheck", section: "Review" },
  { href: "/admin/wall-reports", label: "Wall reports", icon: "flag", section: "Review" },
  { href: "/admin/enquiries", label: "Enquiries", icon: "inbox", section: "Review" },
  { href: "/admin/checkins", label: "Check-ins", icon: "heartPulse", section: "Review" },

  // Content — the rest of the knowledge base and authoring. "Modules" is
  // intentionally absent: it's an unimplemented access/scheduling skeleton
  // (no content editor, no rows) that confused admins with Courses. The route
  // still exists but isn't surfaced; Courses + lessons are the real content.
  { href: "/admin/cards", label: "Study cards", icon: "idCard", section: "Content" },
  { href: "/admin/idioms", label: "Idiom bank", icon: "languages", section: "Content" },
  { href: "/admin/psychopharm-review", label: "Medication library", icon: "pill", section: "Content" },
  { href: "/admin/corpus/dictate", label: "Record a case", icon: "mic", section: "Content" },
  { href: "/admin/calibration", label: "Marking check", icon: "target", section: "Content" },

  // System — platform health.
  { href: "/admin/pulse", label: "Cohort progress", icon: "activity", section: "System" },
  { href: "/admin/infra", label: "Usage & limits", icon: "gauge", section: "System" },
  { href: "/admin/tools", label: "Admin tools", icon: "wrench", section: "System" },
];
