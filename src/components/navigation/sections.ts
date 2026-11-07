/**
 * Which menu section a student page belongs to, and where "Back" goes from it.
 * One table for the sidebar, the phone bottom bar, the More drawer and every
 * activity's Back button, so Practice stays in Practice and Games stays in
 * Games (plan section 8).
 *
 * Pure functions (no React), so the rules are unit-tested in one place.
 */

type Owner = { prefix: string; section: string; back: string };

/**
 * Pages whose address sits under one section but whose job belongs to another.
 * Longest prefix wins. Everything not listed belongs to its first path segment
 * (/practice/... is Practice, /games/... is Games).
 */
const OWNERS: Owner[] = [
  // Smart practice tools (Exam Prep): Back returns to Smart practice.
  { prefix: "/prep/smart/coach", section: "/prep", back: "/prep/smart" },
  { prefix: "/prep/smart/quizzes", section: "/prep", back: "/prep/smart" },
  { prefix: "/prep/smart/revise", section: "/prep", back: "/prep/smart" },
  { prefix: "/prep/smart/play", section: "/prep", back: "/prep/smart" },
  // Medicines has its own menu item, next to Exam Prep.
  { prefix: "/practice/medicines", section: "/practice/medicines", back: "/practice/medicines" },
  { prefix: "/tools/psychopharm", section: "/practice/medicines", back: "/practice/medicines" },
  { prefix: "/practice/leaderboard", section: "/leaderboard", back: "/leaderboard" },
];

const under = (path: string, prefix: string) => path === prefix || path.startsWith(`${prefix}/`);

function ownerFor(path: string): Owner | null {
  let best: Owner | null = null;
  for (const o of OWNERS) if (under(path, o.prefix) && (!best || o.prefix.length > best.prefix.length)) best = o;
  return best;
}

/** The top of the section a path belongs to: "/practice", "/games", "/prep", "/study"... */
export function sectionOf(path: string): string {
  const owner = ownerFor(path);
  if (owner) return owner.section;
  const first = path.split("/")[1] ?? "";
  return first ? `/${first}` : "/";
}

/** Sections a `?from=` may send the student back to. */
const FROM_ROOTS = ["dashboard", "study", "courses", "practice", "games", "prep", "progress"];

/**
 * A safe `?from=` value: an internal student path (letters, digits, dashes),
 * never another site and never the page itself. Anything else is ignored.
 */
export function safeFrom(from: string | null | undefined, pathname?: string): string | null {
  if (!from) return null;
  const m = /^\/([a-z]+)(?:\/[a-z0-9-]+){0,3}$/.exec(from);
  if (!m || !FROM_ROOTS.includes(m[1])) return null;
  if (pathname && from === pathname) return null;
  return from;
}

export type NavMatchItem = { href: string; exact?: boolean; match?: string[] };

/**
 * The one menu item that lights up for this page. A valid `?from=` wins (the
 * student is still in the section they came from); otherwise the section that
 * owns the page; otherwise the longest matching item.
 */
export function activeNavHref(items: NavMatchItem[], pathname: string, from?: string | null): string | null {
  const path = safeFrom(from, pathname) ?? pathname;
  const owner = ownerFor(path);
  if (owner && items.some((i) => i.href === owner.section)) return owner.section;
  let best: { href: string; len: number } | null = null;
  for (const item of items) {
    const prefixes = item.exact ? [] : [item.href, ...(item.match ?? [])];
    const len = item.exact
      ? path === item.href
        ? item.href.length
        : -1
      : Math.max(-1, ...prefixes.filter((p) => under(path, p)).map((p) => p.length));
    if (len >= 0 && (!best || len > best.len)) best = { href: item.href, len };
  }
  return best?.href ?? null;
}

/** Plain names for Back, by destination. */
function backLabel(href: string): string {
  if (href === "/dashboard") return "Back to Home";
  if (href === "/study") return "Back to Study";
  if (href === "/study/notes") return "Back to notes";
  if (href === "/study/reference") return "Back to Quick Reference";
  if (/^\/study\/notes\/[^/]+$/.test(href)) return "Back to the note";
  if (/^\/study\/[^/]+$/.test(href)) return "Back to the module";
  if (href.startsWith("/study/")) return "Back to Study";
  if (href === "/prep/smart/quizzes") return "Back to the quiz path";
  if (href === "/prep/smart/revise") return "Back to Revise today";
  if (href === "/prep/smart") return "Back to Smart practice";
  if (href.startsWith("/prep")) return "Back to Exam Prep";
  if (href.startsWith("/practice/medicines")) return "Back to Medicines";
  if (href === "/practice") return "Back to Practice";
  if (href.startsWith("/practice/")) return "Back to the practice tool";
  if (href.startsWith("/games")) return "Back to Games";
  if (href.startsWith("/courses")) return "Back to Lectures";
  if (href.startsWith("/progress")) return "Back to Progress";
  return "Back";
}

/** Where an activity's own Back goes when nothing says where the student came from. */
export function defaultBack(pathname: string): string {
  const owner = ownerFor(pathname);
  if (owner) return owner.back;
  const s = sectionOf(pathname);
  return s === "/" ? "/dashboard" : s;
}

/**
 * Back from an activity: to `?from=` when it is safe (a Study module, a note,
 * Home, another tool), otherwise to the page's explicit fallback, otherwise to
 * the top of the section that owns the page.
 */
export function backTarget(pathname: string, from?: string | null, fallback?: string): { href: string; label: string } {
  const href = safeFrom(from, pathname) ?? fallback ?? defaultBack(pathname);
  return { href, label: backLabel(href) };
}

/** Practice pages that are lists or settings, not a tool in use. */
const PRACTICE_NOT_TOOLS = ["medicines", "leaderboard", "not-available", "passport", "supervision", "check-in", "rounds", "modules"];
const practiceTool = new RegExp(`^/practice/(?!(?:${PRACTICE_NOT_TOOLS.join("|")})(?:/|$))[^/]+(?:/.*)?$`);
/** Practice tools with their own Back row, so the bottom bar can step aside. */
const PRACTICE_RUNS = /^\/practice\/(?:daily|detective|scenarios|terms|mse|judgment|role-play|weak-spots|consulting-room)(?:\/.*)?$/;

/**
 * A run: the student is answering, reading one text or playing. The phone
 * bottom bar steps aside (the page's own Back row is the way out) and the
 * desktop sidebar folds to icons (UX audit, Nov 2026, section 4).
 * - Exam Prep: a topic set, a subject's practice set, Smart practice and its
 *   tools, Saved, Wrong, review, the diagnostic, interview, a mock in progress.
 * - Study: a section, a checkpoint, one note, one Quick Reference entry, weak
 *   topic practice.
 * - Every game (not the hubs) and the Practice tools that have their own
 *   Back row (the others keep the bottom bar, so there is always a way out).
 */
export function isRunPath(pathname: string): boolean {
  if (/^\/prep\/smart\/(?:quizzes|revise)$/.test(pathname)) return false;
  return (
    /^\/prep\/(?:smart|saved|wrong|review|diagnostic|interview)(?:\/.*)?$/.test(pathname) ||
    /^\/prep\/practice\/[^/]+$/.test(pathname) ||
    /^\/prep\/mock\/(?!result$)[^/]+$/.test(pathname) ||
    /^\/prep\/(?!practice\/|mock\/)[^/]+\/[^/]+$/.test(pathname) ||
    /^\/study\/(?!map\/|notes\/|reference\/)[^/]+\/.+/.test(pathname) ||
    /^\/study\/(?:notes|reference)\/[^/]+$/.test(pathname) ||
    pathname === "/study/map/practice" ||
    /^\/games\/(?!leaderboard$|progress$|lab$|lab\/cases$)[^/]+(?:\/.*)?$/.test(pathname) ||
    PRACTICE_RUNS.test(pathname)
  );
}

/**
 * Focus pages fold the desktop sidebar to icons (the student can open it and
 * that choice is remembered, sidebar-state.ts): every run, plus the places
 * where the student reads or picks questions: the Question Bank (a subject's
 * topics), Notes, Quick Reference, the Smart practice quiz path and revise
 * lists, and every Practice tool.
 */
export function isFocusPath(pathname: string): boolean {
  return (
    isRunPath(pathname) ||
    practiceTool.test(pathname) ||
    /^\/prep\/(?!goal$|mock$)[^/]+$/.test(pathname) ||
    /^\/prep\/smart\/(?:quizzes|revise)$/.test(pathname) ||
    /^\/study\/(?:notes|reference)$/.test(pathname)
  );
}
