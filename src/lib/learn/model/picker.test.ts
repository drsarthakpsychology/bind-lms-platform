import { describe, expect, it } from "vitest";
import { bucketOf, interleave, makeRng, pickSession, quotas, type Candidate } from "./picker";

function pool(): Candidate[] {
  const out: Candidate[] = [];
  const topics = [
    ["depression", "mood"],
    ["bipolar", "mood"],
    ["anxiety", "fear"],
    ["ocd", "fear"],
  ];
  let k = 0;
  for (const [topic, family] of topics) {
    for (const p of [0.55, 0.6, 0.72, 0.75, 0.78, 0.8, 0.83, 0.95, 0.97, 0.3]) {
      out.push({ id: `q${k++}`, topic, family, p, due: false });
    }
  }
  out[2].due = true;
  out[13].due = true;
  out[24].due = true;
  return out;
}

describe("quotas", () => {
  it("splits 60/20/10/10", () => {
    expect(quotas(10)).toEqual({ review: 2, stretch: 1, confidence: 1, core: 6 });
    expect(quotas(20)).toEqual({ review: 4, stretch: 2, confidence: 2, core: 12 });
  });
});

describe("bucketOf", () => {
  it("bands by predicted chance", () => {
    expect(bucketOf(0.75)).toBe("core");
    expect(bucketOf(0.6)).toBe("stretch");
    expect(bucketOf(0.95)).toBe("confidence");
    expect(bucketOf(0.3)).toBeNull();
    expect(bucketOf(0.88)).toBeNull();
  });
});

describe("pickSession", () => {
  it("fills the Goldilocks mix", () => {
    const s = pickSession(pool(), 10, makeRng(1));
    expect(s).toHaveLength(10);
    expect(new Set(s.map((x) => x.id)).size).toBe(10);
    const count = (b: string) => s.filter((x) => x.bucket === b).length;
    expect(count("review")).toBe(2);
    expect(count("stretch")).toBe(1);
    expect(count("confidence")).toBe(1);
    expect(count("core")).toBe(6);
    for (const x of s.filter((y) => y.bucket === "core")) expect(x.p).toBeGreaterThanOrEqual(0.7);
  });
  it("opens with an easy win", () => {
    expect(pickSession(pool(), 10, makeRng(7))[0].bucket).toBe("confidence");
  });
  it("fills short buckets with near-core items", () => {
    const only = pool().filter((c) => c.p === 0.3 || c.p === 0.95);
    const s = pickSession(only, 6, makeRng(3));
    expect(s).toHaveLength(6);
    expect(s.some((x) => x.bucket === "fill")).toBe(true);
  });
  it("is reproducible with the same seed and handles empty pools", () => {
    expect(pickSession(pool(), 10, makeRng(5)).map((x) => x.id)).toEqual(pickSession(pool(), 10, makeRng(5)).map((x) => x.id));
    expect(pickSession([], 10, makeRng(1))).toEqual([]);
  });
});

describe("interleave", () => {
  it("alternates look-alike topics instead of blocking", () => {
    const items = [
      { id: 1, topic: "depression", family: "mood" },
      { id: 2, topic: "depression", family: "mood" },
      { id: 3, topic: "bipolar", family: "mood" },
      { id: 4, topic: "bipolar", family: "mood" },
    ];
    const out = interleave(items).map((x) => x.topic);
    for (let i = 1; i < out.length; i++) expect(out[i]).not.toBe(out[i - 1]);
  });
  it("puts same-family topics next to each other", () => {
    const items = [
      { topic: "ocd", family: "fear" },
      { topic: "depression", family: "mood" },
      { topic: "anxiety", family: "fear" },
      { topic: "bipolar", family: "mood" },
    ];
    const out = interleave(items).map((x) => x.family);
    expect(out).toEqual(["fear", "fear", "mood", "mood"]);
  });
});
