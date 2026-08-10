import { describe, expect, it } from "vitest";
import { filterLibrary, type LibraryDoc } from "./library";

const DOCS: LibraryDoc[] = [
  {
    source: "pmc",
    source_url: "https://example.org/1",
    licence: "oa",
    title: "Catatonia in a young woman",
    content: "A 22-year-old woman presented with stupor and waxy flexibility. ECT was effective.",
    hash: "a",
    fetched_at: "2026-08-10",
  },
  {
    source: "pmc",
    source_url: "https://example.org/2",
    licence: "oa",
    title: "Bipolar disorder relapse",
    content: "Lithium monitoring during pregnancy is nuanced.",
    hash: "b",
    fetched_at: "2026-08-10",
  },
];

describe("case library", () => {
  it("empty query returns everything", () => {
    expect(filterLibrary(DOCS, "").length).toBe(2);
  });

  it("matches title case-insensitively", () => {
    expect(filterLibrary(DOCS, "BIPOLAR").map((d) => d.hash)).toEqual(["b"]);
  });

  it("matches content head too", () => {
    expect(filterLibrary(DOCS, "waxy").map((d) => d.hash)).toEqual(["a"]);
  });

  it("no match returns empty", () => {
    expect(filterLibrary(DOCS, "schizophrenia").length).toBe(0);
  });
});
