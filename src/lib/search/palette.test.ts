import { describe, expect, it } from "vitest";
import { searchPalette, STATIC_ENTRIES, scoreEntry, type PaletteEntry } from "./palette";

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
    for (const id of ["daily", "cr", "mse", "formulation", "detective", "scenarios", "terms", "judgment", "clinic", "osce", "ethics", "library"]) {
      expect(href(id), id).toMatch(/^\/practice\//);
    }
    expect(STATIC_ENTRIES.filter((e) => e.group === "Tools" && e.href.startsWith("/games/")).map((e) => e.id)).toEqual([]);
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

  it("merges case-library docs when provided", () => {
    const caseDoc: PaletteEntry = {
      id: "case-x",
      label: "Catatonia in a young woman",
      hint: "PMC case report",
      href: "/practice/library?q=catatonia",
      group: "Cases",
      keywords: ["catatonia"],
    };
    const hits = searchPalette([...STATIC_ENTRIES, caseDoc], "catatonia");
    expect(hits[0].id).toBe("case-x");
  });
});
