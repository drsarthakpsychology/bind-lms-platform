import { describe, expect, it } from "vitest";
import { deriveName, parseRosterCsv, EMAIL_RE, inviteEmailBody } from "./roster";

describe("roster deriveName", () => {
  it("turns a local-part into a display name", () => {
    expect(deriveName("jane.doe@x.com")).toBe("Jane Doe");
    expect(deriveName("rinku_chauhan@x.com")).toBe("Rinku Chauhan");
  });
  it("falls back to the email when the local-part is empty", () => {
    expect(deriveName("@x.com")).toBe("@x.com");
  });
});

describe("roster parseRosterCsv", () => {
  it("extracts name + email, trims, lowercases email", () => {
    const { rows } = parseRosterCsv("name,email\n  Jane Doe , JANE@X.COM\n");
    expect(rows).toEqual([{ name: "Jane Doe", email: "jane@x.com" }]);
  });

  it("skips invalid and blank emails, logs the row number + reason", () => {
    const csv = "name,email\nA,good@x.com\nB,not-an-email\nC,\nD,dup@x.com\nE,dup@x.com\n";
    const { rows, invalid, duplicates } = parseRosterCsv(csv);
    expect(rows.map((r) => r.email)).toEqual(["good@x.com", "dup@x.com"]);
    expect(invalid.map((f) => f.row)).toEqual([3, 4]);
    expect(duplicates.map((f) => f.email)).toEqual(["dup@x.com"]);
  });

  it("derives a name for empty-name rows and records them", () => {
    const { rows, emptyNames } = parseRosterCsv("name,email\n,onlyemail@x.com\n");
    expect(rows[0].name).toBe("Onlyemail");
    expect(emptyNames).toEqual(["onlyemail@x.com"]);
  });
});

describe("roster inviteEmailBody", () => {
  it("never contains a plaintext password and includes the link", () => {
    const body = inviteEmailBody("Jane", "jane@x.com", "https://app/set-password?token=abc");
    expect(body).toContain("jane@x.com");
    expect(body).toContain("https://app/set-password?token=abc");
    expect(body).not.toContain("password:");
    expect(body).not.toMatch(/[a-zA-Z0-9]{8,}pass/);
  });
});

describe("roster EMAIL_RE", () => {
  it("accepts normal emails, rejects blanks and malformed", () => {
    expect(EMAIL_RE.test("a@b.co")).toBe(true);
    expect(EMAIL_RE.test("a.b+c@sub.domain.org")).toBe(true);
    expect(EMAIL_RE.test("")).toBe(false);
    expect(EMAIL_RE.test("not-an-email")).toBe(false);
    expect(EMAIL_RE.test("a@b")).toBe(false);
  });
});
