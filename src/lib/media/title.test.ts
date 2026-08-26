import { describe, expect, it } from "vitest";
import { cleanMaterialTitle } from "./title";

describe("cleanMaterialTitle", () => {
  it("strips the _Light theme suffix and underscores", () => {
    expect(cleanMaterialTitle("Curriculum_Overview_Light")).toBe("Curriculum overview");
  });

  it("strips a file extension", () => {
    expect(cleanMaterialTitle("ethics_lecture.pdf")).toBe("Ethics lecture");
  });

  it("sentence-cases the result", () => {
    expect(cleanMaterialTitle("mse_level_2")).toBe("Mse level 2");
  });

  it("handles hyphens", () => {
    expect(cleanMaterialTitle("two-minute-clinic")).toBe("Two minute clinic");
  });

  it("returns empty string unchanged", () => {
    expect(cleanMaterialTitle("")).toBe("");
  });
});
