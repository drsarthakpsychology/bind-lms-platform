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
  // Smart practice (Exam Prep) kept these older /games addresses.
  { prefix: "/games/coach", section: "/prep", back: "/prep/smart" },
  { prefix: "/games/quizzes", section: "/prep", back: "/prep/smart" },
  { prefix: "/games/revise", section: "/prep", back: "/prep/smart" },
  { prefix: "/games/play", section: "/prep", back: "/prep/smart" },
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
  if (/^\/study\/notes\/[^/]+$/.test(href)) return "Back to the note";
  if (/^\/study\/[^/]+$/.test(href)) return "Back to the module";
  if (href.startsWith("/study/")) return "Back to Study";
  if (href === "/games/quizzes") return "Back to the quiz path";
  if (href === "/games/revise") return "Back to Revise today";
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
