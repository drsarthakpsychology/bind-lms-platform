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
