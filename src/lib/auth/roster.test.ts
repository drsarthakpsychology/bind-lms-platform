import { describe, expect, it } from "vitest";
import { deriveName, parseRosterCsv, EMAIL_RE, credentialsEmailBody, generateCredential, hashSetupToken } from "./roster";

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

describe("roster parseRosterCsv — column-shift / header regression", () => {
  // The bug this guards: the source sheet had the name in a shifted column for
  // part of the rows (and extra columns). A positional reader misread 50 of 64
  // names as empty. Header-based lookup must find name+email wherever they are
  // and ignore every other column.
  it("ignores extra columns and finds name+email by header, not position", () => {
    const csv =
      "Timestamp,Full Name,Email Address,WhatsApp / Phone Number,City of Residence,Mode of Attendance\n" +
      "123,Rinku Ravi Chauhan,rinku@x.com,9999,Mumbai,Online\n" +
      "124,Khushi Jain,khushi@x.com,8888,Nadiad,Online\n";
    const { rows, emptyNames } = parseRosterCsv(csv);
    expect(rows).toEqual([
      { name: "Rinku Ravi Chauhan", email: "rinku@x.com" },
      { name: "Khushi Jain", email: "khushi@x.com" },
    ]);
    expect(emptyNames).toEqual([]);
  });

  it("finds name + email when the header is capitalised differently", () => {
    const csv = "Full name,Email address\nJane Doe,jane@x.com\n";
    const { rows } = parseRosterCsv(csv);
    expect(rows[0]).toEqual({ name: "Jane Doe", email: "jane@x.com" });
  });

  it("strips a UTF-8 BOM so the first header maps correctly", () => {
    const csv = "﻿name,email\nJane Doe,jane@x.com\n";
    const { rows, emptyNames } = parseRosterCsv(csv);
    expect(rows[0]).toEqual({ name: "Jane Doe", email: "jane@x.com" });
    expect(emptyNames).toEqual([]);
  });

  it("finds name + email when they are not the first two columns", () => {
    const csv = "Phone,City,name,email,Paid\n9999,Mumbai,Jane Doe,jane@x.com,15000\n";
    const { rows } = parseRosterCsv(csv);
    expect(rows[0]).toEqual({ name: "Jane Doe", email: "jane@x.com" });
  });
});

describe("roster credentialsEmailBody", () => {
  it("carries the one-time setup link and never a password", () => {
    const link = "https://vibhapsychology.com/setup?t=abc123";
    const body = credentialsEmailBody("Jane", "jane@x.com", link, "https://vibhapsychology.com");
    expect(body).toContain("jane@x.com");
    expect(body).toContain(link);
    expect(body).toContain("vibhapsychology.com/login");
    expect(body.toLowerCase()).not.toContain("password:");
  });
});

describe("roster generateCredential", () => {
  it("returns a long, unguessable throwaway secret (never shown to anyone)", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const p = generateCredential();
      expect(p.length).toBeGreaterThanOrEqual(40);
      seen.add(p);
    }
    expect(seen.size).toBe(50);
  });
});

describe("roster hashSetupToken", () => {
  it("is a stable sha256 hex digest, never the token itself", () => {
    const h = hashSetupToken("token-1");
    expect(h).toMatch(/^[0-9a-f]{64}$/);
    expect(h).toBe(hashSetupToken("token-1"));
    expect(h).not.toBe(hashSetupToken("token-2"));
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
