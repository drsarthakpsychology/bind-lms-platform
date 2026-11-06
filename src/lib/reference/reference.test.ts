import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { referenceHref, referenceSlug } from "./href";
import { DISORDERS } from "./disorders";

describe("referenceHref", () => {
  it("makes a clean link for any topic or diagnosis", () => {
    expect(referenceHref("Bipolar II disorder")).toBe("/study/reference/bipolar-ii-disorder");
    expect(referenceHref("Alzheimer's disease")).toBe("/study/reference/alzheimers-disease");
    expect(referenceHref("  ")).toBe("/study/reference");
    expect(referenceSlug("Methylphenidate (D,L)")).toBe("methylphenidate-d-l");
  });
});

describe("disorders data", () => {
  it("every disorder has the five quick-read parts and unique slugs", () => {
    const slugs = new Set<string>();
    for (const x of DISORDERS) {
      expect(x.slug).toBe(referenceSlug(x.slug));
      expect(slugs.has(x.slug)).toBe(false);
      slugs.add(x.slug);
      expect(x.features.length).toBeGreaterThan(0);
      expect(x.criteria.length).toBeGreaterThan(0);
      expect(x.duration.length).toBeGreaterThan(0);
      expect(x.lookAlikes.length).toBeGreaterThan(0);
      expect(x.firstLine.length).toBeGreaterThan(0);
    }
  });
  it("look-alike links point at real entries", () => {
    const slugs = new Set(DISORDERS.map((x) => x.slug));
    for (const x of DISORDERS) for (const l of x.lookAlikes) if (l.slug) expect(slugs.has(l.slug), `${x.slug} → ${l.slug}`).toBe(true);
  });
});

describe("library", () => {
  it("resolves names, aliases and abbreviations to one entry", async () => {
    const { resolveReference, referenceIndex } = await import("./data");
    expect(resolveReference("ocd")?.slug).toBe("obsessive-compulsive-disorder");
    expect(resolveReference("Generalized anxiety disorder")?.slug).toBe("generalised-anxiety-disorder");
    expect(resolveReference("sertraline")?.kind).toBe("medicine");
    expect(resolveReference("anhedonia")?.kind).toBe("term");
    expect(resolveReference("zzzz-not-a-thing")).toBeUndefined();
    const idx = referenceIndex();
    expect(new Set(idx.map((i) => i.slug)).size).toBe(idx.length);
    expect(idx.filter((i) => i.kind === "medicine").length).toBeGreaterThan(100);
    expect(idx.filter((i) => i.kind === "term").length).toBeGreaterThan(150);
  });
});
