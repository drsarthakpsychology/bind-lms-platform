import { describe, expect, it } from "vitest";
import { embed, EMBED_DIM, l2Normalise, toEmbedding } from "./embed";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("embedding discipline (v3 Part 3.1)", () => {
  it("produces exactly EMBED_DIM (384) values", async () => {
    const v = await embed("a test document about somatic depression");
    expect(v).toHaveLength(EMBED_DIM);
  });

  it("the embedding is unit-norm", async () => {
    const v = await embed("the heaviness, broken sleep, weight loss");
    const norm = Math.sqrt(v.reduce((a, x) => a + x * x, 0));
    expect(norm).toBeCloseTo(1, 5);
  });

  it("empty input throws", async () => {
    await expect(embed("   ")).rejects.toThrow(/empty/i);
  });

  it("truncation + renormalise keeps unit norm", () => {
    const long = Array.from({ length: 1536 }, (_, i) => Math.sin(i * 0.1));
    const out = toEmbedding(long);
    expect(out).toHaveLength(EMBED_DIM);
    const norm = Math.sqrt(out.reduce((a, x) => a + x * x, 0));
    expect(norm).toBeCloseTo(1, 5);
  });

  it("l2Normalise of a zero vector returns a valid (non-NaN) unit vector", () => {
    const z = l2Normalise([0, 0, 0]);
    expect(z.every((x) => !Number.isNaN(x))).toBe(true);
    const norm = Math.sqrt(z.reduce((a, x) => a + x * x, 0));
    expect(norm).toBeCloseTo(1, 5);
  });

  it("NO vector(1536) column exists anywhere in the schema", () => {
    // Assert the migrations never declare a 1536-dim vector.
    const dir = join(process.cwd(), "src/migrations_pending");
    const sql = readFileSync(join(dir, "practice_layer_rest.sql"), "utf8");
    expect(sql).not.toMatch(/vector\(\s*1536\s*\)/i);
    expect(sql).toMatch(/halfvec\(\s*384\s*\)/i);
  });
});
