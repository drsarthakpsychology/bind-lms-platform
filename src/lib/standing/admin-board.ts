/**
 * The admin view of a student leaderboard: every visible student in the
 * chosen cohort (or all cohorts), zero scores included, with search, sort and
 * pages. Students never get this view; their boards keep their own privacy
 * rules (own cohort only, top places plus the rows around them). Pure, so it
 * is testable.
 */

export type AdminBoardKey = "league" | "quiz" | "overall";

export type AdminSort = "rank" | "name" | "cohort";
export type AdminDir = "asc" | "desc";

export type AdminQuery = { q: string; cohort: string | null; sort: AdminSort; dir: AdminDir; page: number; size: number };

/** One student before ranking. `extra` holds the board's own small numbers. */
export type AdminInput = { id: string; name: string; cohortIds: readonly string[]; points: number; extra: Record<string, number | string | null> };

export type AdminRow = { key: string; rank: number; name: string; cohorts: string[]; points: number; extra: Record<string, number | string | null> };

export type AdminPage = {
  rows: AdminRow[];
  /** Students on the board for this cohort choice (before the search). */
  total: number;
  /** Students left after the search. */
  matched: number;
  page: number;
  pages: number;
  size: number;
  query: AdminQuery;
  cohorts: { id: string; name: string }[];
};

export const ADMIN_PAGE_SIZE = 50;
const MAX_SIZE = 200;

type Params = URLSearchParams | Record<string, string | string[] | undefined>;

function read(sp: Params, key: string): string {
  if (sp instanceof URLSearchParams) return sp.get(key) ?? "";
  const v = sp[key];
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

/** The admin board's query from a URL (?q=&cohort=&sort=&dir=&page=&size=). Bad values fall back to defaults. */
export function parseAdminQuery(sp: Params): AdminQuery {
  const q = read(sp, "q").trim().slice(0, 80);
  const cohort = read(sp, "cohort").trim() || null;
  const s = read(sp, "sort");
  const sort: AdminSort = s === "name" || s === "cohort" ? s : "rank";
  const d = read(sp, "dir");
  const dir: AdminDir = d === "desc" ? "desc" : "asc";
  const p = Number.parseInt(read(sp, "page"), 10);
  const z = Number.parseInt(read(sp, "size"), 10);
  return { q, cohort: cohort === "all" ? null : cohort, sort, dir, page: Number.isFinite(p) && p > 0 ? p : 1, size: Number.isFinite(z) && z > 0 ? Math.min(z, MAX_SIZE) : ADMIN_PAGE_SIZE };
}

/** The query back as URL params, leaving out defaults (for links and the pager). */
export function adminQueryString(q: AdminQuery, patch: Partial<AdminQuery> = {}): string {
  const v = { ...q, ...patch };
  const out = new URLSearchParams();
  if (v.q) out.set("q", v.q);
  if (v.cohort) out.set("cohort", v.cohort);
  if (v.sort !== "rank") out.set("sort", v.sort);
  if (v.dir !== "asc") out.set("dir", v.dir);
  if (v.page > 1) out.set("page", String(v.page));
  if (v.size !== ADMIN_PAGE_SIZE) out.set("size", String(v.size));
  const s = out.toString();
  return s ? `?${s}` : "";
}

/** Plain lower-case text for search: accents dropped, spaces squeezed. */
function fold(s: string): string {
  return s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Rank everyone on points, high to low; ties share a place (1, 2, 2, 4).
 * Ties are listed by name so the order is stable.
 */
export function rankAll(items: readonly AdminInput[], cohortName: (id: string) => string | null): AdminRow[] {
  const sorted = [...items].sort((a, b) => b.points - a.points || a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
  let rank = 0;
  let prev: number | null = null;
  return sorted.map((s, i) => {
    if (prev === null || s.points !== prev) rank = i + 1;
    prev = s.points;
    const cohorts = s.cohortIds.map(cohortName).filter((n): n is string => Boolean(n));
    return { key: `r${i}`, rank, name: s.name, cohorts, points: s.points, extra: s.extra };
  });
}

/**
 * The admin page: filter to the cohort, rank inside it, search by name (the
 * ranks stay the cohort's), sort, then cut the page.
 */
export function adminPage(items: readonly AdminInput[], cohorts: readonly { id: string; name: string }[], query: AdminQuery): AdminPage {
  const names = new Map(cohorts.map((c) => [c.id, c.name]));
  const cohort = query.cohort && names.has(query.cohort) ? query.cohort : null;
  const q = { ...query, cohort };
  const inCohort = cohort ? items.filter((s) => s.cohortIds.includes(cohort)) : items;
  const ranked = rankAll(inCohort, (id) => names.get(id) ?? null);
  const needle = fold(q.q);
  const found = needle ? ranked.filter((r) => fold(r.name).includes(needle)) : ranked;
  const sign = q.dir === "desc" ? -1 : 1;
  const byName = (a: AdminRow, b: AdminRow) => a.name.localeCompare(b.name);
  const sorted = [...found].sort((a, b) => {
    if (q.sort === "name") return sign * byName(a, b) || a.rank - b.rank;
    if (q.sort === "cohort") return sign * (a.cohorts.join(", ") || "￿").localeCompare(b.cohorts.join(", ") || "￿") || a.rank - b.rank || byName(a, b);
    return sign * (a.rank - b.rank) || byName(a, b);
  });
  const pages = Math.max(1, Math.ceil(sorted.length / q.size));
  const page = Math.min(q.page, pages);
  return {
    rows: sorted.slice((page - 1) * q.size, page * q.size),
    total: ranked.length,
    matched: sorted.length,
    page,
    pages,
    size: q.size,
    query: { ...q, page },
    cohorts: [...cohorts],
  };
}
