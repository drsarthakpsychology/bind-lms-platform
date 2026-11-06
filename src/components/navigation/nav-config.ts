import { blockedBy } from "@/lib/access/features";
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
  { href: "/study", label: "Notes", icon: "bookOpen" },
  { href: "/games", label: "Games", icon: "gamepad" },
  { href: "/practice", label: "Practice", icon: "stethoscope" },
  { href: "/doubts", label: "Doubts", icon: "doubt", section: "More" },
  { href: "/leaderboard", label: "Leaderboard", icon: "trophy", section: "More" },
  { href: "/achievements", label: "Achievements", icon: "award", section: "More" },
  { href: "/journey", label: "My journey", icon: "route", section: "More" },
  { href: "/practice/medicines", label: "Medicines", icon: "pill", section: "More" },
  { href: "/reflect", label: "Journal", icon: "notebook", section: "More" },
  { href: "/wall", label: "Wall", icon: "wall", section: "More" },
];

/**
 * Lectures-only accounts: lectures, their doubts board and their journey.
 * (Full accounts get everything above.)
 */
export const LECTURE_ONLY_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: "home", exact: true },
  { href: "/courses", label: "Lectures", icon: "play" },
  { href: "/doubts", label: "Doubts", icon: "doubt" },
  { href: "/journey", label: "My journey", icon: "route" },
];

/** Drop menu items for sections switched off for this student. */
export function withoutBlocked(items: NavItem[], blocked: string[] = []): NavItem[] {
  return blocked.length ? items.filter((i) => !blockedBy(i.href, blocked)) : items;
}

/**
 * Admin navigation (2026-11 redesign, docs/plans/ADMIN_REDESIGN_PLAN.md).
 * One place per job: every admin task has exactly one home, other screens
 * only link to it. Sidebar places are grouped (People / Communicate / Teach /
 * Settings) so ten places still scan as four chunks; each place shows its
 * other pages as tabs (ADMIN_SECTIONS). Old addresses keep working: hidden
 * tabs still mark a page as belonging to a place, and moved pages redirect.
 */
export type AdminSection = {
  key: string;
  label: string;
  icon: string;
  href: string;
  /** Sidebar group header. */
  group?: string;
  /** `hidden` tabs only mark a page as belonging here (not shown as a tab). */
  tabs: { href: string; label: string; hidden?: boolean }[];
};

export const ADMIN_SECTIONS: AdminSection[] = [
  { key: "home", label: "Home", icon: "home", href: "/admin", tabs: [] },
  {
    key: "students",
    label: "Students",
    icon: "clipboardList",
    href: "/admin/students",
    group: "People",
    tabs: [
      { href: "/admin/students", label: "All students" },
      { href: "/admin/access", label: "Access for many" },
      { href: "/admin/roster", label: "Logins", hidden: true },
    ],
  },
  {
    key: "cohorts",
    label: "Cohorts",
    icon: "users",
    href: "/admin/cohorts",
    group: "People",
    tabs: [{ href: "/admin/cohorts", label: "Cohorts", hidden: true }],
  },
  {
    key: "activity",
    label: "Activity",
    icon: "activity",
    href: "/admin/activity",
    group: "People",
    tabs: [
      { href: "/admin/activity", label: "Live & students" },
      { href: "/admin/pulse", label: "Who needs a nudge" },
      { href: "/admin/learning", label: "Learning insights" },
      { href: "/admin/checkins", label: "Wellbeing (anonymous)" },
    ],
  },
  {
    key: "pipeline",
    label: "Pipeline",
    icon: "radar",
    href: "/admin/people",
    group: "People",
    tabs: [
      { href: "/admin/people", label: "Pipeline" },
      { href: "/admin/enquiries", label: "Enquiry forms" },
    ],
  },
  {
    key: "mail",
    label: "Messages",
    icon: "mail",
    href: "/admin/emails",
    group: "Communicate",
    // Messages has its own folder rail (Inbox / Compose / Notifications / Sent / Failed).
    tabs: [{ href: "/admin/emails", label: "Messages", hidden: true }],
  },
  {
    key: "content",
    label: "Content",
    icon: "bookOpen",
    href: "/admin/courses",
    group: "Teach",
    tabs: [
      { href: "/admin/courses", label: "Courses & lectures" },
      { href: "/admin/flags", label: "What's live" },
      { href: "/admin/psychopharm-review", label: "Medicines" },
      { href: "/admin/psychopharm", label: "Medicine editor", hidden: true },
      // Study cards = the review queue for the students' Rounds flash cards.
      // Not an admin job day to day: reachable from What's live → Rounds.
      { href: "/admin/cards", label: "Rounds cards", hidden: true },
      { href: "/admin/idioms", label: "Idioms", hidden: true },
      { href: "/admin/corpus", label: "Corpus", hidden: true },
      { href: "/admin/modules", label: "Modules", hidden: true },
    ],
  },
  {
    key: "review",
    label: "Review",
    icon: "inbox",
    href: "/admin/triage",
    group: "Teach",
    tabs: [
      { href: "/admin/triage", label: "Needs a look" },
      { href: "/admin/submissions", label: "Submissions" },
      { href: "/admin/doubts", label: "Doubts & concerns" },
      { href: "/admin/supervision", label: "Sign-offs" },
      { href: "/admin/sim-review", label: "Practice sessions", hidden: true },
      { href: "/admin/wall-reports", label: "Wall reports", hidden: true },
      { href: "/admin/calibration", label: "Calibration", hidden: true },
    ],
  },
  {
    key: "credentials",
    label: "Credentials",
    icon: "award",
    href: "/admin/credentials",
    group: "Teach",
    tabs: [
      { href: "/admin/credentials", label: "Find & issue" },
      { href: "/admin/achievements", label: "Badges & certificate types" },
    ],
  },
  {
    key: "system",
    label: "System",
    icon: "gauge",
    href: "/admin/infra",
    group: "Settings",
    tabs: [
      { href: "/admin/infra", label: "Usage & AI providers" },
      { href: "/admin/management", label: "Admins" },
      { href: "/admin/tools", label: "Support key" },
    ],
  },
];

/** Flat list for the mobile drawer / older shells (same places, same order). */
export const ADMIN_ITEMS: NavItem[] = ADMIN_SECTIONS.map((s) => ({
  href: s.href,
  label: s.label,
  icon: s.icon,
  exact: s.key === "home",
  section: s.group,
  match: s.tabs.map((t) => t.href),
}));

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
export const ADMIN_SIDEBAR: NavItem[] = ADMIN_ITEMS;

/** Notes and Games only appear in the nav once Learn is unlocked (no links to locked screens). */
export function withStudy(items: NavItem[], showStudy: boolean): NavItem[] {
  return showStudy ? items : items.filter((i) => i.href !== "/study" && i.href !== "/games");
}
