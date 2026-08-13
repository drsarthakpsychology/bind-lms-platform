import { describe, expect, it } from "vitest";
import { stripMarkup } from "./sanitize";

describe("stripMarkup", () => {
  it("removes tag-like sequences", () => {
    expect(stripMarkup("<img src=x onerror=alert(1)>")).toBe("");
    expect(stripMarkup("hello <b>bold</b> world")).toBe("hello bold world");
    expect(stripMarkup("<script>alert(1)</script>")).toBe("alert(1)");
  });

  it("preserves prose and legitimate angle brackets", () => {
    expect(stripMarkup("The 5 < 6 condition holds")).toBe("The 5 < 6 condition holds");
    expect(stripMarkup("Tom & Jerry")).toBe("Tom & Jerry");
  });

  it("strips nested/event-handler payloads entirely", () => {
    expect(stripMarkup("<svg onload=alert(1)>")).toBe("");
  });
});
