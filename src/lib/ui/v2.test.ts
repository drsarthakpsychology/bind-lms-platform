import { describe, expect, it } from "vitest";
import { uiV2For } from "./v2";

describe("uiV2For", () => {
  it("no row: admins only (also when they view as a student)", () => {
    expect(uiV2For({}, "admin")).toBe(true);
    expect(uiV2For({}, "view_admin")).toBe(true);
    expect(uiV2For({}, "student")).toBe(false);
    expect(uiV2For(null, "alumni")).toBe(false);
  });
  it("on: everyone", () => {
    expect(uiV2For({ ui_v2: "unlocked" }, "student")).toBe(true);
    expect(uiV2For({ ui_v2: "on" }, "alumni")).toBe(true);
  });
  it("off: nobody, admins included", () => {
    expect(uiV2For({ ui_v2: "off" }, "admin")).toBe(false);
    expect(uiV2For({ ui_v2: "off" }, "student")).toBe(false);
  });
  it("live behaves like no row", () => {
    expect(uiV2For({ ui_v2: "live" }, "admin")).toBe(true);
    expect(uiV2For({ ui_v2: "live" }, "student")).toBe(false);
  });
});
