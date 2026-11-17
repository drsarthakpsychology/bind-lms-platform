import { describe, expect, it } from "vitest";
import { ADMIN_PAGE_SIZE, adminPage, adminQueryString, parseAdminQuery, rankAll, type AdminInput } from "./admin-board";

const cohorts = [
  { id: "c1", name: "Cohort One" },
  { id: "c2", name: "Cohort Two" },
];
const s = (id: string, name: string, points: number, cohortIds: string[] = ["c1"]): AdminInput => ({ id, name, cohortIds, points, extra: {} });

describe("admin leaderboard", () => {
  it("lists every student, zero scores included, ties sharing a place", () => {
    const rows = rankAll([s("a", "Asha", 10), s("b", "Bina", 0), s("c", "Chirag", 10), s("d", "Dev", 0), s("e", "Esha", 5)], () => "Cohort One");
    expect(rows.map((r) => [r.name, r.rank])).toEqual([
      ["Asha", 1],
      ["Chirag", 1],
      ["Esha", 3],
      ["Bina", 4],
      ["Dev", 4],
    ]);
    expect(rows.every((r) => !("id" in r))).toBe(true);
  });

  it("filters to a cohort and ranks inside it; an unknown cohort means all", () => {
    const items = [s("a", "Asha", 9, ["c1"]), s("b", "Bina", 7, ["c2"]), s("c", "Chirag", 0, ["c2"]), s("d", "Dev", 3, [])];
    const two = adminPage(items, cohorts, parseAdminQuery(new URLSearchParams("cohort=c2")));
    expect(two.rows.map((r) => [r.name, r.rank, r.cohorts])).toEqual([
      ["Bina", 1, ["Cohort Two"]],
      ["Chirag", 2, ["Cohort Two"]],
    ]);
    expect(two.total).toBe(2);
    const all = adminPage(items, cohorts, parseAdminQuery(new URLSearchParams("cohort=nope")));
    expect(all.total).toBe(4);
    expect(all.query.cohort).toBeNull();
  });

  it("search keeps the cohort rank and ignores case and accents", () => {
    const items = [s("a", "Asha Rao", 9), s("b", "Bina Shah", 7), s("c", "Rohit Ráo", 1)];
    const p = adminPage(items, cohorts, parseAdminQuery({ q: "  rao " }));
    expect(p.rows.map((r) => [r.name, r.rank])).toEqual([
      ["Asha Rao", 1],
      ["Rohit Ráo", 3],
    ]);
    expect(p.total).toBe(3);
    expect(p.matched).toBe(2);
  });

  it("sorts by name or cohort, either way", () => {
    const items = [s("a", "Chirag", 1, ["c2"]), s("b", "Asha", 2, ["c1"]), s("c", "Bina", 3, [])];
    expect(adminPage(items, cohorts, parseAdminQuery({ sort: "name" })).rows.map((r) => r.name)).toEqual(["Asha", "Bina", "Chirag"]);
    expect(adminPage(items, cohorts, parseAdminQuery({ sort: "name", dir: "desc" })).rows.map((r) => r.name)).toEqual(["Chirag", "Bina", "Asha"]);
    // No cohort goes last.
    expect(adminPage(items, cohorts, parseAdminQuery({ sort: "cohort" })).rows.map((r) => r.name)).toEqual(["Asha", "Chirag", "Bina"]);
    expect(adminPage(items, cohorts, parseAdminQuery({ sort: "rank", dir: "desc" })).rows.map((r) => r.name)).toEqual(["Chirag", "Asha", "Bina"]);
  });

  it("cuts pages of 50 and clamps a page past the end", () => {
    const items = Array.from({ length: 122 }, (_, i) => s(`u${i}`, `Student ${String(i).padStart(3, "0")}`, i % 4 ? 0 : 200 - i));
    const one = adminPage(items, cohorts, parseAdminQuery({}));
    expect(one.rows).toHaveLength(ADMIN_PAGE_SIZE);
    expect(one.pages).toBe(3);
    const three = adminPage(items, cohorts, parseAdminQuery({ page: "3" }));
    expect(three.rows).toHaveLength(22);
    const past = adminPage(items, cohorts, parseAdminQuery({ page: "99" }));
    expect(past.page).toBe(3);
    // Every student shows across the pages, once.
    const seen = [1, 2, 3].flatMap((page) => adminPage(items, cohorts, parseAdminQuery({ page: String(page) })).rows.map((r) => r.name));
    expect(new Set(seen).size).toBe(122);
  });

  it("reads bad query values as defaults and writes back only what differs", () => {
    const q = parseAdminQuery({ sort: "drop table", dir: "sideways", page: "-4", size: "100000", q: "x".repeat(200) });
    expect(q).toMatchObject({ sort: "rank", dir: "asc", page: 1, size: 200 });
    expect(q.q).toHaveLength(80);
    expect(adminQueryString(parseAdminQuery({}))).toBe("");
    expect(adminQueryString(parseAdminQuery({ q: "asha", cohort: "c1", sort: "name" }), { page: 2 })).toBe("?q=asha&cohort=c1&sort=name&page=2");
    expect(parseAdminQuery({ cohort: "all" }).cohort).toBeNull();
  });
});
