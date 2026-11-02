import type { NavItem } from "@/components/navigation/nav-items";

/**
 * Icons are referenced by string name (keys into NAV_ICONS in nav-items.tsx),
 * not by component reference — the config is imported into Server Components
 * and passed to a Client Component, and function values can't be serialized
 * across that boundary.
 */
export const STUDENT_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: "home", exact: true },
  { href: "/courses", label: "Lectures", icon: "play" },
  { href: "/practice", label: "Practice", icon: "stethoscope" },
  { href: "/reflect", label: "Journal", icon: "notebook", section: "More" },
  { href: "/wall", label: "Wall", icon: "wall", section: "More" },
  { href: "/tools/psychopharm", label: "Medicines", icon: "pill", section: "More" },
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
  { href: "/dashboard", label: "Home", icon: "home", exact: true },
  { href: "/courses", label: "Lectures", icon: "play" },
  { href: "/practice", label: "Practice", icon: "stethoscope" },
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
  { href: "/admin", label: "Home", icon: "home", exact: true },

  // Launch — the go-live surfaces: upload content, manage people, send
  // credentials, switch what's live. Highest value when the programme is
  // first going out to students.
  { href: "/admin/courses", label: "Courses", icon: "bookOpen", section: "Launch" },
  { href: "/admin/emails", label: "Mail", icon: "mail", section: "Launch" },
  { href: "/admin/people", label: "People pipeline", icon: "users", section: "Launch" },
  { href: "/admin/students", label: "Students", icon: "clipboardList", section: "Launch" },
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
  { href: "/admin/psychopharm-review", label: "Medication library", icon: "pill", section: "Content" },

  // System — platform health.
  { href: "/admin/pulse", label: "Cohort progress", icon: "activity", section: "System" },
  { href: "/admin/infra", label: "Usage & limits", icon: "gauge", section: "System" },
  { href: "/admin/tools", label: "Admin tools", icon: "wrench", section: "System" },
];

/**
 * Admin sidebar: five places, grouped by job (the Shopify / Google Classroom
 * pattern) instead of 20 loose links. Each place opens on its most-used page
 * and shows its other pages as tabs along the top (see ADMIN_SECTIONS).
 */
export type AdminSection = {
  key: string;
  label: string;
  icon: string;
  href: string;
  /** `hidden` tabs only mark a page as belonging here (not shown as a tab). */
  tabs: { href: string; label: string; hidden?: boolean }[];
};

export const ADMIN_SECTIONS: AdminSection[] = [
  { key: "home", label: "Home", icon: "home", href: "/admin", tabs: [] },
  // Mail has its own folder rail (Inbox / Sent / Logins / Failed), like Gmail,
  // so it needs no tab row.
  { key: "mail", label: "Mail", icon: "mail", href: "/admin/emails", tabs: [{ href: "/admin/emails", label: "Mail", hidden: true }] },
  {
    key: "content",
    label: "Content",
    icon: "bookOpen",
    href: "/admin/courses",
    tabs: [
      { href: "/admin/courses", label: "Courses & lectures" },
      { href: "/admin/flags", label: "What's live" },
      { href: "/admin/cards", label: "Study cards" },
      { href: "/admin/psychopharm-review", label: "Medicines" },
      { href: "/admin/psychopharm", label: "Medicine editor", hidden: true },
      { href: "/admin/modules", label: "Modules", hidden: true },
    ],
  },
  {
    key: "people",
    label: "People",
    icon: "users",
    href: "/admin/people",
    tabs: [
      { href: "/admin/people", label: "Pipeline" },
      { href: "/admin/students", label: "Students" },
      { href: "/admin/activity", label: "Activity" },
      { href: "/admin/roster", label: "Roster", hidden: true },
      { href: "/admin/enquiries", label: "Enquiries" },
      { href: "/admin/pulse", label: "Progress" },
      { href: "/admin/checkins", label: "Check-ins" },
    ],
  },
  {
    key: "review",
    label: "Review",
    icon: "inbox",
    href: "/admin/triage",
    tabs: [
      { href: "/admin/triage", label: "Needs a look" },
      { href: "/admin/submissions", label: "Submissions" },
      { href: "/admin/sim-review", label: "Practice sessions" },
      { href: "/admin/supervision", label: "Sign-offs" },
      { href: "/admin/wall-reports", label: "Wall reports" },
    ],
  },
  {
    key: "system",
    label: "System",
    icon: "gauge",
    href: "/admin/infra",
    tabs: [
      { href: "/admin/infra", label: "Usage & limits" },
      { href: "/admin/tools", label: "Admin tools" },
    ],
  },
];

/** Which admin section a path belongs to (longest matching tab wins). */
export function adminSectionFor(pathname: string): AdminSection | null {
  if (pathname === "/admin") return ADMIN_SECTIONS[0];
  let best: { s: AdminSection; len: number } | null = null;
  for (const s of ADMIN_SECTIONS) {
    for (const tab of s.tabs) {
      if (pathname === tab.href || pathname.startsWith(tab.href + "/")) {
        if (!best || tab.href.length > best.len) best = { s, len: tab.href.length };
      }
    }
  }
  return best?.s ?? null;
}

/** Sidebar items for admin: one per section; active across all its tabs. */
export const ADMIN_SIDEBAR: NavItem[] = ADMIN_SECTIONS.map((s) => ({
  href: s.href,
  label: s.label,
  icon: s.icon,
  exact: s.key === "home",
  match: s.tabs.map((t) => t.href),
}));
