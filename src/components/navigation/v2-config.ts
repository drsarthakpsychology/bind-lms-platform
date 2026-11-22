import { blockedBy } from "@/lib/access/features";
import type { NavItem } from "@/components/navigation/nav-items";

/**
 * Navigation for the new design (ui_v2). Five places: Home, Learn, Practise,
 * Library, Me. Learn, Practise and Me are hub screens: short grouped row lists
 * that link to the pages that already exist, so every old address keeps
 * working. Pure data (no React), shared by the phone tabs, the desktop
 * sidebar and the hub screens, so they always agree.
 */

export type HubRow = {
  href: string;
  label: string;
  /** Key into NAV_ICONS. */
  icon: string;
  /** Feature switch that must be "unlocked". */
  flag?: string;
  /** Needs Study (the course) unlocked. */
  study?: boolean;
  /** Not for lecture-only accounts. */
  full?: boolean;
  external?: boolean;
};
export type HubGroup = { title: string; rows: HubRow[] };

export const LEARN_GROUPS: HubGroup[] = [
  {
    title: "Classes",
    rows: [{ href: "/courses", label: "Lectures", icon: "play" }],
  },
  {
    title: "Study",
    rows: [
      { href: "/study", label: "Modules", icon: "bookOpen", study: true, full: true },
      { href: "/study/notes", label: "Notes", icon: "notebook", study: true, full: true },
      { href: "/study/reference", label: "Quick reference", icon: "layers", study: true, full: true },
    ],
  },
];

export const PRACTISE_GROUPS: HubGroup[] = [
  {
    title: "Cases",
    rows: [
      { href: "/practice/daily", label: "Case of the day", icon: "sun", study: true, full: true },
      { href: "/practice", label: "All practice cases", icon: "stethoscope", full: true },
    ],
  },
  {
    title: "Games",
    rows: [{ href: "/games", label: "Games", icon: "gamepad", study: true, full: true }],
  },
  {
    title: "Exam Prep",
    rows: [
      { href: "/prep", label: "Question bank", icon: "target", study: true, full: true },
      { href: "/prep/smart", label: "Smart practice", icon: "sparkles", study: true, full: true },
      { href: "/prep/mock", label: "Mock tests", icon: "clipboardCheck", study: true, full: true },
    ],
  },
];

export const ME_GROUPS: HubGroup[] = [
  {
    title: "Clinic",
    rows: [
      { href: "/clinic", label: "Clinic", icon: "calendar", full: true },
      { href: "/attendance/scan", label: "Scan attendance", icon: "scan", full: true },
    ],
  },
  {
    title: "Your work",
    rows: [
      { href: "/progress", label: "Progress", icon: "chart", study: true, full: true },
      { href: "/journey", label: "My journey", icon: "route" },
      { href: "/achievements", label: "Certificates", icon: "award" },
      { href: "/achievements#badges", label: "Badges", icon: "medal" },
      { href: "/leaderboard", label: "Leaderboard", icon: "trophy", full: true },
      { href: "/reflect", label: "Journal", icon: "notebook", flag: "journal", full: true },
    ],
  },
  {
    title: "Help",
    rows: [
      { href: "/doubts", label: "Doubts", icon: "doubt" },
      { href: "/notifications", label: "Notifications", icon: "bell" },
      { href: "/settings", label: "Settings", icon: "settings", full: true },
    ],
  },
];

export type Access = { scope?: "full" | "lectures_only"; showStudy?: boolean; blocked?: string[]; flags?: Record<string, string> };

/** The rows this account may open: switches, Study, scope and per-student blocks. */
export function visibleRows(rows: HubRow[], { scope = "full", showStudy = false, blocked = [], flags = {} }: Access): HubRow[] {
  return rows.filter(
    (r) =>
      (!r.flag || flags[r.flag] === "unlocked") &&
      (!r.study || showStudy) &&
      (!r.full || scope !== "lectures_only") &&
      !blockedBy(r.href, blocked),
  );
}

/** Groups with their visible rows; empty groups dropped. */
export function visibleGroups(groups: HubGroup[], access: Access): HubGroup[] {
  return groups.map((g) => ({ ...g, rows: visibleRows(g.rows, access) })).filter((g) => g.rows.length);
}

/** Paths each of the five places owns (for the active tab and sidebar item). */
export const LEARN_MATCH = ["/learn", "/courses", "/study"];
export const PRACTISE_MATCH = ["/practise", "/practice", "/games", "/prep"];
export const LIBRARY_MATCH = ["/practice/medicines", "/tools/psychopharm"];
export const ME_MATCH = [
  "/me",
  "/clinic",
  "/schedule",
  "/attendance",
  "/leave",
  "/opd",
  "/progress",
  "/journey",
  "/study/map",
  "/achievements",
  "/passport",
  "/record",
  "/leaderboard",
  "/practice/leaderboard",
  "/games/leaderboard",
  "/reflect",
  "/doubts",
  "/wall",
  "/notifications",
  "/settings",
];

/** The five phone tabs (full accounts). */
export const V2_TABS: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: "home", exact: true },
  { href: "/learn", label: "Learn", icon: "bookOpen", match: LEARN_MATCH },
  { href: "/practise", label: "Practise", icon: "stethoscope", match: PRACTISE_MATCH },
  { href: "/practice/medicines", label: "Library", icon: "pill", match: LIBRARY_MATCH },
  { href: "/me", label: "Me", icon: "user", match: ME_MATCH },
];

/** Lecture-only accounts: Home, Lectures, Doubts, Me. */
export const V2_LECTURE_TABS: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: "home", exact: true },
  { href: "/courses", label: "Lectures", icon: "play" },
  { href: "/doubts", label: "Doubts", icon: "doubt" },
  { href: "/me", label: "Me", icon: "user", match: ME_MATCH.filter((p) => p !== "/doubts") },
];

/** Phone tabs for this account. Library steps aside when medicines are switched off. */
export function v2Tabs(access: Access): NavItem[] {
  if (access.scope === "lectures_only") return V2_LECTURE_TABS.filter((t) => !blockedBy(t.href, access.blocked ?? []));
  return V2_TABS.filter((t) => !blockedBy(t.href, access.blocked ?? []));
}

/**
 * Desktop sidebar: Home, then the same five groups with their screens under
 * each heading, so a wide screen never needs the hub pages.
 */
export function v2SidebarItems(access: Access): NavItem[] {
  if (access.scope === "lectures_only") {
    return [
      { href: "/dashboard", label: "Home", icon: "home", exact: true },
      { href: "/courses", label: "Lectures", icon: "play" },
      { href: "/doubts", label: "Doubts", icon: "doubt" },
      ...visibleRows(ME_GROUPS.flatMap((g) => g.rows).filter((r) => r.href !== "/doubts"), access).map((r) => ({ href: r.href, label: r.label, icon: r.icon, section: "Me" })),
    ];
  }
  const flat = (groups: HubGroup[], section: string): NavItem[] =>
    visibleGroups(groups, access).flatMap((g) => g.rows.map((r) => ({ href: r.href, label: r.label, icon: r.icon, section })));
  const library: NavItem[] = blockedBy("/practice/medicines", access.blocked ?? []) ? [] : [{ href: "/practice/medicines", label: "Medicines", icon: "pill", section: "Library", match: ["/tools/psychopharm"] }];
  return [
    { href: "/dashboard", label: "Home", icon: "home", exact: true },
    ...flat(LEARN_GROUPS, "Learn"),
    ...flat(PRACTISE_GROUPS, "Practise"),
    ...library,
    ...flat(ME_GROUPS, "Me").filter((i) => i.href !== "/notifications"),
  ];
}

/* ---------------------------------------------------------------- */
/* Admin (ui_v2)                                                     */
/* ---------------------------------------------------------------- */

/** Paths that belong to the admin More tab (everything not on the four tabs). */
export const ADMIN_MORE_MATCH = [
  "/admin/more",
  "/admin/inbox",
  "/admin/cohorts",
  "/admin/clinic",
  "/admin/people",
  "/admin/enquiries",
  "/admin/triage",
  "/admin/submissions",
  "/admin/doubts",
  "/admin/supervision",
  "/admin/sim-review",
  "/admin/wall-reports",
  "/admin/calibration",
  "/admin/courses",
  "/admin/flags",
  "/admin/psychopharm",
  "/admin/psychopharm-review",
  "/admin/ai-cases",
  "/admin/cards",
  "/admin/idioms",
  "/admin/corpus",
  "/admin/modules",
  "/admin/forms",
  "/admin/credentials",
  "/admin/achievements",
  "/admin/infra",
  "/admin/management",
  "/admin/tools",
];

/** Admin phone tabs (ui_v2): Home, Students, Activity, Messages, More (a screen, not a drawer). */
export const ADMIN_V2_TABS: NavItem[] = [
  { href: "/admin", label: "Home", icon: "home", exact: true },
  { href: "/admin/students", label: "Students", icon: "users", match: ["/admin/access", "/admin/roster"] },
  { href: "/admin/activity", label: "Activity", icon: "activity", match: ["/admin/pulse", "/admin/learning", "/admin/checkins"] },
  { href: "/admin/emails", label: "Messages", icon: "mail" },
  { href: "/admin/more", label: "More", icon: "more", match: ADMIN_MORE_MATCH },
];

/** The admin More screen (ui_v2): every other place, grouped like the student Me screen. */
export const ADMIN_MORE_GROUPS: HubGroup[] = [
  {
    title: "People",
    rows: [
      { href: "/admin/inbox", label: "Inbox", icon: "inbox" },
      { href: "/admin/cohorts", label: "Cohorts", icon: "users" },
      { href: "/admin/clinic", label: "Clinic", icon: "calendar" },
      { href: "/admin/people", label: "People", icon: "radar" },
      { href: "/admin/remove", label: "Remove people", icon: "userX" },
    ],
  },
  {
    title: "Teach",
    rows: [
      { href: "/admin/triage", label: "Review", icon: "fileCheck" },
      { href: "/admin/courses", label: "Content", icon: "bookOpen" },
      { href: "/admin/forms", label: "Forms", icon: "clipboardCheck" },
    ],
  },
  {
    title: "Credentials",
    rows: [
      { href: "/admin/credentials", label: "Certificates", icon: "award" },
      { href: "/admin/credentials/types", label: "Badges and types", icon: "medal" },
    ],
  },
  {
    title: "Settings",
    rows: [
      { href: "/admin/infra", label: "System", icon: "gauge" },
      { href: "/settings", label: "Settings", icon: "settings" },
    ],
  },
];

/**
 * Admin desktop sidebar (ui_v2): Home, then four quiet groups. Each item keeps
 * the pages of its place (match) so it stays lit on every tab of that place.
 */
export function adminV2SidebarItems(sections: { key: string; label: string; icon: string; href: string; tabs: { href: string }[] }[]): NavItem[] {
  const GROUPS: { title: string; keys: string[] }[] = [
    { title: "People", keys: ["students", "cohorts", "clinic", "activity", "pipeline"] },
    { title: "Messages", keys: ["inbox", "mail", "forms"] },
    { title: "Teach", keys: ["review", "content", "credentials"] },
    { title: "Settings", keys: ["system"] },
  ];
  const by = new Map(sections.map((s) => [s.key, s]));
  const home = by.get("home");
  const out: NavItem[] = home ? [{ href: home.href, label: home.label, icon: home.icon, exact: true }] : [];
  for (const g of GROUPS) {
    for (const k of g.keys) {
      const s = by.get(k);
      if (s) out.push({ href: s.href, label: k === "pipeline" ? "People" : s.label, icon: s.icon, section: g.title, match: s.tabs.map((t) => t.href) });
    }
  }
  return out;
}
