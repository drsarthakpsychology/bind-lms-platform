import { describe, expect, it } from "vitest";
import { medicinePaletteEntries, modulePaletteEntries, searchPalette, startEntries, STATIC_ENTRIES, scoreEntry, visibleEntries } from "./palette";
import { MODULES } from "@/lib/study";
import { lectureOnlyAllowed } from "@/lib/auth/scope";
import { MEDS } from "@/lib/meds";

describe("command palette search", () => {
  it("exact label match ranks highest", () => {
    const hits = searchPalette(STATIC_ENTRIES, "ethics");
    expect(hits[0].id).toBe("ethics");
  });

  it("keyword match finds a tool by its alias", () => {
    const hits = searchPalette(STATIC_ENTRIES, "sim");
    expect(hits.map((h) => h.id)).toContain("cr");
  });

  it("finds both leaderboards, each by its own name", () => {
    const hits = searchPalette(STATIC_ENTRIES, "leaderboard").map((h) => h.id);
    expect(hits).toEqual(expect.arrayContaining(["board-quiz", "board-overall"]));
    expect(searchPalette(STATIC_ENTRIES, "quiz leaderboard")[0].id).toBe("board-quiz");
    expect(searchPalette(STATIC_ENTRIES, "overall leaderboard")[0].id).toBe("board-overall");
    expect(searchPalette(STATIC_ENTRIES, "rankings")[0].id).toBe("board-overall");
  });

  it("admin jobs: reply to doubts, message, add people", () => {
    expect(searchPalette(STATIC_ENTRIES, "reply to doubts")[0].id).toBe("ad-inbox");
    expect(searchPalette(STATIC_ENTRIES, "message")[0].id).toBe("ad-message");
    expect(searchPalette(STATIC_ENTRIES, "add people")[0].href).toBe("?add=people");
  });

  it("Practice tools open in Practice, games open in Games", () => {
    const href = (id: string) => STATIC_ENTRIES.find((e) => e.id === id)?.href;
    for (const id of ["daily", "cr", "mse", "formulation", "detective", "scenarios", "terms", "judgment", "clinic", "osce", "ethics", "landmark"]) {
      expect(href(id), id).toMatch(/^\/practice\//);
    }
    expect(STATIC_ENTRIES.filter((e) => e.group === "Tools" && e.href.startsWith("/games/")).map((e) => e.id)).toEqual([]);
  });

  it("hides tools whose switch is off, admin screens from students, and blocked sections", () => {
    const ids = (flags: Record<string, string>, isAdmin = false, blocked: string[] = []) =>
      visibleEntries(STATIC_ENTRIES, { flags, isAdmin, blocked: (h) => blocked.some((b) => h === b || h.startsWith(`${b}/`)) }).map((e) => e.id);
    const off = ids({ learn: "unlocked" });
    expect(off).not.toContain("reflect");
    expect(off).not.toContain("cr");
    expect(off).not.toContain("ad-students");
    expect(off).toContain("daily");
    expect(ids({ learn: "unlocked", journal: "unlocked" })).toContain("reflect");
    expect(ids({ learn: "live" })).not.toContain("study");
    expect(ids({ supervision: "unlocked" })).toContain("record");
    expect(ids({}, true)).toContain("ad-students");
    expect(ids({ learn: "unlocked" }, false, ["/practice"])).not.toContain("daily");
  });

  it("empty query returns nothing", () => {
    expect(searchPalette(STATIC_ENTRIES, "")).toEqual([]);
  });

  it("case-insensitive", () => {
    const hits = searchPalette(STATIC_ENTRIES, "OSCE");
    expect(hits[0].id).toBe("osce");
  });

  it("partial word matches", () => {
    const hits = searchPalette(STATIC_ENTRIES, "consult");
    expect(hits[0].id).toBe("cr");
  });

  it("score is higher for label than hint", () => {
    const ethics = STATIC_ENTRIES.find((e) => e.id === "ethics")!;
    expect(scoreEntry(ethics, "ethics")).toBeGreaterThan(scoreEntry(ethics, "pocso"));
  });

  it("has no Case library entry (it stays off; Landmark cases is the cases library)", () => {
    expect(STATIC_ENTRIES.some((e) => e.href.startsWith("/practice/library"))).toBe(false);
    expect(STATIC_ENTRIES.find((e) => e.id === "clinic")?.href).toBe("/practice/detective?mode=clinic");
  });
});

describe("search keeps the top bar's promise: lectures, topics, medicines", () => {
  const all = [...STATIC_ENTRIES, ...modulePaletteEntries(MODULES), ...medicinePaletteEntries(MEDS)];
  const open = visibleEntries(all, { flags: { learn: "unlocked" } });

  it("finds a Study module by its name and by a section inside it", () => {
    expect(searchPalette(open, "antipsychotics").some((h) => h.href === "/study/antipsychotics")).toBe(true);
    expect(searchPalette(open, "clozapine").some((h) => h.href === "/study/antipsychotics")).toBe(true);
  });

  it("finds a medicine by name and by brand", () => {
    expect(searchPalette(open, "lithium").some((h) => h.href === "/practice/medicines/lithium")).toBe(true);
    const brand = MEDS.find((m) => m.brands.length)!;
    expect(searchPalette(open, brand.brands[0]).some((h) => h.href === `/practice/medicines/${brand.id}`)).toBe(true);
  });

  it("finds Lectures, saved questions and bookmarks again", () => {
    expect(searchPalette(open, "lectures")[0].href).toBe("/courses");
    expect(searchPalette(open, "bookmarks")[0].href).toBe("/study#marks");
    expect(searchPalette(open, "saved questions")[0].href).toBe("/prep/saved");
  });

  it("Study modules hide with Study switched off or blocked", () => {
    expect(visibleEntries(all, { flags: {} }).some((e) => e.group === "Study")).toBe(false);
    expect(visibleEntries(all, { flags: { learn: "unlocked" }, blocked: (h) => h === "/study" || h.startsWith("/study/") }).some((e) => e.href.startsWith("/study"))).toBe(false);
  });

  it("before typing, it offers the menu's places in menu order", () => {
    const first = startEntries(open).map((e) => e.label);
    expect(first.slice(0, 7)).toEqual(["Home", "Study", "Lectures", "Medicines", "Exam Prep", "Practice", "Games"]);
  });

  it("labels match the Practice hub, with no small counts", () => {
    const label = (id: string) => STATIC_ENTRIES.find((e) => e.id === id)?.label;
    expect(label("cr")).toBe("AI patient interview");
    expect(label("ethics")).toBe("Ethics, law & referral");
    expect(label("osce")).toBe("OSCE stations");
    for (const e of STATIC_ENTRIES) expect(`${e.label} ${e.hint ?? ""}`, e.id).not.toMatch(/\b\d{1,2} (questions|seconds|minutes|cards)\b/);
  });

  it("no fixed course link (each student sees their own courses in Lectures)", () => {
    expect(STATIC_ENTRIES.some((e) => e.href.startsWith("/courses/"))).toBe(false);
  });

  it("a keyword inside a longer word is not a match", () => {
    // "xp" (Games) is not in "experience", "net" (Exam Prep) is not in "internet".
    expect(searchPalette(STATIC_ENTRIES, "experience").map((h) => h.id)).not.toContain("games");
    expect(searchPalette(STATIC_ENTRIES, "internet").map((h) => h.id)).not.toContain("prep");
    expect(searchPalette(STATIC_ENTRIES, "earn xp fast").map((h) => h.id)).toContain("games");
  });

  it("a lecture-only account is offered only what it can open", () => {
    const ids = visibleEntries(STATIC_ENTRIES, { flags: { learn: "unlocked" }, allowed: lectureOnlyAllowed }).map((e) => e.id);
    expect(ids).toEqual(expect.arrayContaining(["home", "lectures", "doubts"]));
    for (const id of ["practice", "medicines", "study", "wall", "daily", "leaderboard"]) expect(ids, id).not.toContain(id);
  });
});
