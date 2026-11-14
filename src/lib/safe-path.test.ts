import { describe, expect, it } from "vitest";
import { safeInternalPath } from "./safe-path";

describe("safeInternalPath (open redirects)", () => {
  it("keeps same-site paths", () => {
    expect(safeInternalPath("/courses/a/lessons/b")).toBe("/courses/a/lessons/b");
    expect(safeInternalPath("/dashboard?x=1#y")).toBe("/dashboard?x=1#y");
  });
  it("refuses other sites and schemes", () => {
    for (const bad of ["https://evil.example", "//evil.example", "/\\evil.example", "\\\\evil.example", "javascript:alert(1)", "/\tjavascript", "", "courses", null, 5]) {
      expect(safeInternalPath(bad)).toBeNull();
    }
  });
});
