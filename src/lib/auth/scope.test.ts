import { describe, expect, it } from "vitest";
import { gamesAllowed } from "./scope";

describe("gamesAllowed (games actions and the duel route)", () => {
  it("lets full-access students, alumni and admins play", () => {
    expect(gamesAllowed({ role: "student", scope: "full" })).toBe(true);
    expect(gamesAllowed({ role: "alumni", scope: "full" })).toBe(true);
    expect(gamesAllowed({ role: "admin", scope: "full" })).toBe(true);
  });
  it("refuses lectures-only accounts and no account", () => {
    expect(gamesAllowed({ role: "student", scope: "lectures_only" })).toBe(false);
    expect(gamesAllowed(null)).toBe(false);
  });
});

import { lectureOnlyAllowed } from "./scope";
describe("lectureOnlyAllowed and the Me tab", () => {
  it("lets lecture-only accounts open Me but not the Learn or Practise hubs", () => {
    expect(lectureOnlyAllowed("/me")).toBe(true);
    expect(lectureOnlyAllowed("/practise")).toBe(false);
    expect(lectureOnlyAllowed("/learn")).toBe(false);
  });
});
