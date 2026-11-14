import { describe, expect, it } from "vitest";
import { canResetToTestPassword } from "./test-account";

describe("canResetToTestPassword (published default password)", () => {
  it("allows only marked test student accounts", () => {
    expect(canResetToTestPassword({ is_test: true, role: "student" })).toBe(true);
  });
  it("refuses real students, admins and unknown accounts", () => {
    expect(canResetToTestPassword({ is_test: false, role: "student" })).toBe(false);
    expect(canResetToTestPassword({ is_test: null, role: "student" })).toBe(false);
    expect(canResetToTestPassword({ is_test: true, role: "admin" })).toBe(false);
    expect(canResetToTestPassword(null)).toBe(false);
  });
});
