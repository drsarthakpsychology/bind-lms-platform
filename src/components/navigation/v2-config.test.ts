import { describe, expect, it } from "vitest";
import { activeNavHref } from "./sections";
import { LEARN_GROUPS, ME_GROUPS, PRACTISE_GROUPS, v2SidebarItems, v2Tabs, visibleGroups } from "./v2-config";

const full = { scope: "full" as const, showStudy: true, blocked: [], flags: { journal: "unlocked" } };

describe("v2 phone tabs", () => {
  it("five places for full accounts, no More", () => {
    expect(v2Tabs(full).map((t) => t.label)).toEqual(["Home", "Learn", "Practise", "Library", "Me"]);
  });
  it("lecture-only: Home, Lectures, Doubts, Me", () => {
    expect(v2Tabs({ scope: "lectures_only" }).map((t) => t.label)).toEqual(["Home", "Lectures", "Doubts", "Me"]);
  });
  it("Library steps aside when medicines are switched off for the student", () => {
    expect(v2Tabs({ ...full, blocked: ["medicines"] }).map((t) => t.label)).not.toContain("Library");
  });
  it.each([
    ["/dashboard", "/dashboard"],
    ["/courses/abc/lessons/x", "/learn"],
    ["/study/m1/s1", "/learn"],
    ["/practice/osce", "/practise"],
    ["/games/blitz", "/practise"],
    ["/prep/mock", "/practise"],
    ["/practice/medicines/lithium", "/practice/medicines"],
    ["/tools/psychopharm/lithium", "/practice/medicines"],
    ["/progress", "/me"],
    ["/study/map", "/me"],
    ["/journey", "/me"],
    ["/wall", "/me"],
    ["/practice/leaderboard", "/me"],
    ["/settings", "/me"],
    ["/me", "/me"],
  ])("%s lights %s", (path, tab) => {
    expect(activeNavHref(v2Tabs(full), path)).toBe(tab);
  });
});

describe("v2 hubs", () => {
  it("drop Study-only rows before Study opens", () => {
    const learn = visibleGroups(LEARN_GROUPS, { ...full, showStudy: false });
    expect(learn.flatMap((g) => g.rows.map((r) => r.href))).toEqual(["/courses"]);
    const practise = visibleGroups(PRACTISE_GROUPS, { ...full, showStudy: false });
    expect(practise.flatMap((g) => g.rows.map((r) => r.href))).toEqual(["/practice"]);
  });
  it("respect switches and per-student blocks", () => {
    const me = visibleGroups(ME_GROUPS, { ...full, flags: {}, blocked: ["doubts"] }).flatMap((g) => g.rows.map((r) => r.href));
    expect(me).not.toContain("/reflect");
    expect(me).not.toContain("/doubts");
    expect(me).toContain("/settings");
  });
  it("lecture-only Me has no full-access rows", () => {
    const me = visibleGroups(ME_GROUPS, { scope: "lectures_only" }).flatMap((g) => g.rows.map((r) => r.href));
    expect(me).toEqual(["/journey", "/achievements", "/achievements#badges", "/doubts", "/notifications"]);
  });
});

describe("v2 desktop sidebar", () => {
  it("groups under Learn, Practise, Library, Me", () => {
    const items = v2SidebarItems(full);
    expect(items[0].href).toBe("/dashboard");
    expect([...new Set(items.map((i) => i.section).filter(Boolean))]).toEqual(["Learn", "Practise", "Library", "Me"]);
  });
  it("the medicine pages light Medicines, a case lights All practice cases", () => {
    const items = v2SidebarItems(full);
    expect(activeNavHref(items, "/tools/psychopharm/compare")).toBe("/practice/medicines");
    expect(activeNavHref(items, "/practice/osce")).toBe("/practice");
    // Smart practice runs belong to Exam Prep (sections.ts OWNERS).
    expect(activeNavHref(items, "/prep/smart/play")).toBe("/prep");
  });
});
