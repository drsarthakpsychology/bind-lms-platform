import { describe, expect, it } from "vitest";
import { cleanPart, hasContactDetails, scrub } from "./reflect-text";

describe("reflection text", () => {
  it("takes out phone numbers in the usual shapes", () => {
    for (const n of ["9876543210", "98765 43210", "+91 98765 43210", "+919876543210", "079-2656-1234", "(079) 26561234", "0 98765-43210"]) {
      const r = scrub(`call ${n} now`);
      expect(r, n).toEqual({ text: "call [number removed] now", removed: 1 });
    }
  });

  it("keeps dates, times, doses, scores and counts", () => {
    for (const t of ["16-11-2026", "2026-11-16", "BP 120/80", "8 to 10", "lithium 300 mg twice", "HAM-D 24, MMSE 28/30", "2 cases, 3 follow ups", "ICD 10 F31.1"]) {
      expect(scrub(t), t).toEqual({ text: t, removed: 0 });
    }
  });

  it("takes out emails", () => {
    expect(scrub("mail ravi.k@example.co.in please")).toEqual({ text: "mail [email removed] please", removed: 1 });
    expect(hasContactDetails("plain words")).toBe(false);
  });

  it("cleans a part: trims, empty becomes null, long text is cut", () => {
    expect(cleanPart("   ")).toEqual({ text: null, removed: 0 });
    expect(cleanPart(undefined)).toEqual({ text: null, removed: 0 });
    expect(cleanPart(" a\n\n\n\nb ").text).toBe("a\n\nb");
    expect(cleanPart("x".repeat(900)).text).toHaveLength(600);
  });
});
