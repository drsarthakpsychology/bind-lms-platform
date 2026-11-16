import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { addRecent, allowedEdits, createIndex, editDistance, groupHits, normalize, scoreDoc, searchDocs, type SearchDoc } from "./engine";

const docs: SearchDoc[] = [
  { id: "m1", type: "medicine", title: "Sertraline", meta: "SSRI", keywords: ["Zoloft", "Serta"] },
  { id: "m2", type: "medicine", title: "Lithium", meta: "Mood stabiliser", keywords: ["Licab"] },
  { id: "m3", type: "medicine", title: "Escitalopram", meta: "SSRI", keywords: ["Nexito"] },
  { id: "s1", type: "module", title: "Schizophrenia and psychosis", meta: "Module 12" },
  { id: "s2", type: "module", title: "Depression", meta: "Module 8", keywords: ["low mood"] },
  { id: "l1", type: "lecture", title: "Mental state examination", meta: "Lecture 3 · Week 1", keywords: ["MSE"] },
  { id: "g1", type: "glossary", title: "Anhedonia", meta: "Word · Loss of pleasure" },
];

const ids = (q: string, opts = {}) => searchDocs(docs, q, opts).map((h) => h.doc.id);

describe("search engine", () => {
  it("normalizes case, accents and punctuation", () => {
    expect(normalize("  Café-Au_Lait!  ")).toBe("cafe au lait");
  });

  it("counts edits with swaps as one and gives up early", () => {
    expect(editDistance("lithum", "lithium", 2)).toBe(1);
    expect(editDistance("sertarline", "sertraline", 2)).toBe(1);
    expect(editDistance("abc", "xyzxyz", 1)).toBe(2);
    expect(allowedEdits(3)).toBe(0);
    expect(allowedEdits(5)).toBe(1);
    expect(allowedEdits(9)).toBe(2);
  });

  it("finds exact, prefix and inner words", () => {
    expect(ids("sertraline")[0]).toBe("m1");
    expect(ids("sert")[0]).toBe("m1");
    expect(ids("phrenia")).toContain("s1");
  });

  it("tolerates typos", () => {
    expect(ids("lithum")[0]).toBe("m2");
    expect(ids("sertaline")[0]).toBe("m1");
    expect(ids("skizophrenia")[0]).toBe("s1");
    expect(ids("shizo")).toContain("s1");
    expect(ids("schizophrina")[0]).toBe("s1");
    expect(ids("depresion")[0]).toBe("s2");
  });

  it("does not guess on short words", () => {
    expect(ids("mxe")).toEqual([]);
  });

  it("needs every typed word", () => {
    expect(ids("mental state")).toEqual(["l1"]);
    expect(ids("mental lithium")).toEqual([]);
  });

  it("searches keywords and meta (brands, aliases)", () => {
    expect(ids("zoloft")).toEqual(["m1"]);
    expect(ids("mse")[0]).toBe("l1");
    expect(ids("ssri").sort()).toEqual(["m1", "m3"]);
    expect(ids("pleasure")).toEqual(["g1"]);
  });

  it("ranks title hits above keyword and meta hits", () => {
    expect(scoreDoc(docs[0]!, "sertraline")).toBeGreaterThan(scoreDoc(docs[0]!, "zoloft"));
    expect(scoreDoc(docs[0]!, "zoloft")).toBeGreaterThan(scoreDoc(docs[0]!, "ssri"));
  });

  it("limits per type and filters types", () => {
    expect(ids("ssri", { perType: 1 })).toHaveLength(1);
    expect(ids("s", { types: ["module"] }).every((id) => id.startsWith("s"))).toBe(true);
  });

  it("groups in the order asked", () => {
    const g = groupHits(searchDocs(docs, "m"), ["lecture", "module", "medicine"]);
    expect(g.map((x) => x.type).slice(0, 2)).toEqual(["lecture", "module"]);
  });

  it("an index answers like a one-off search, fast", () => {
    const many: SearchDoc[] = Array.from({ length: 3000 }, (_, i) => ({ id: `x${i}`, type: "t", title: `Item number ${i} about psychology`, keywords: ["alpha", "beta"] }));
    const index = createIndex([...docs, ...many]);
    expect(index.search("lithum")[0]!.doc.id).toBe("m2");
    const t0 = performance.now();
    for (let i = 0; i < 10; i++) index.search("psycholgy item");
    expect((performance.now() - t0) / 10).toBeLessThan(150);
  });

  it("keeps recent searches newest first, without repeats", () => {
    expect(addRecent(["mse", "Lithium"], "lithium")).toEqual(["lithium", "mse"]);
    expect(addRecent(["a1", "b2"], "x", 2)).toEqual(["a1", "b2"]);
    expect(addRecent(["a1", "b2"], "c3", 2)).toEqual(["c3", "a1"]);
  });

  it("the phone app's copy is the same file", () => {
    const web = readFileSync(path.join(import.meta.dirname, "engine.ts"), "utf8");
    const app = readFileSync(path.join(import.meta.dirname, "../../../apps/mobile/src/lib/search-engine.ts"), "utf8");
    expect(app).toBe(web);
  });
});
