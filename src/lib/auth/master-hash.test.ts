import { describe, expect, it } from "vitest";
import { checkMaster, hashMaster, masterProblem } from "./master-hash";

describe("master password", () => {
  it("stores a hash, not the password, and checks it", () => {
    const s = hashMaster("correct horse 42 battery");
    expect(JSON.stringify(s)).not.toContain("correct horse");
    expect(checkMaster("correct horse 42 battery", s)).toBe(true);
    expect(checkMaster("correct horse 43 battery", s)).toBe(false);
    expect(checkMaster("correct horse 42 battery", { ...s, enabled: false })).toBe(false);
    expect(checkMaster("anything", null)).toBe(false);
  });
  it("rejects weak passwords", () => {
    expect(masterProblem("short1")).not.toBeNull();
    expect(masterProblem("onlylettersherexx")).not.toBeNull();
    expect(masterProblem("Vibha-master-2026")).toBeNull();
  });
});
