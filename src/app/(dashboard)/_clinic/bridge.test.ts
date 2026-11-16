import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/clinic/actions", () => ({
  clinicToday: async () => ({ ok: false, code: "unavailable", error: "This isn't set up yet." }),
  clinicMove: async () => ({ ok: false, code: "conflict", error: "That day is full." }),
  clinicScan: async (b: unknown) => ({ ok: true, data: b }),
  clinicGenerate: async (b: unknown) => ({ ok: true, data: b }),
}));

import { generatePlan, loadToday, movePlan, scan } from "./bridge";

describe("clinic bridge", () => {
  it("before the SQL runs, says so calmly", async () => {
    expect(await loadToday()).toEqual({ ok: false, code: "unavailable", error: "Not switched on yet." });
  });
  it("keeps the server's code and words for other failures", async () => {
    expect(await movePlan({ assignmentId: "a", date: "2026-11-18", batch: "morning" })).toEqual({ ok: false, code: "conflict", error: "That day is full." });
  });
  it("passes bodies through unchanged", async () => {
    expect(await scan({ code: "AB2XY9" })).toEqual({ ok: true, data: { code: "AB2XY9" } });
    expect(await generatePlan("c1")).toEqual({ ok: true, data: { cohortId: "c1" } });
  });
});
