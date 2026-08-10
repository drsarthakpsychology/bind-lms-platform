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
