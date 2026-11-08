import { describe, expect, it } from "vitest";
import { ANATOMY } from "./anatomy";
import { CHARTS } from "./charts";
import { FIGURES } from "./registry";

describe("figure registry", () => {
  it("every figure id is unique across the anatomy and charts libraries", () => {
    const ids = [...ANATOMY, ...CHARTS].map((f) => f.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    expect(Object.keys(FIGURES).length).toBe(ids.length);
  });
});
