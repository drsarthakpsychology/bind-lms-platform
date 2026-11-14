import { describe, expect, it } from "vitest";
import { checkIssue, MAX_RECIPIENTS, type StudioIssueInput } from "./issue-input";

const base: StudioIssueInput = {
  kind: "completion",
  title: "Foundations of Clinical Psychology",
  issuedOn: "2026-11-14",
  signatories: [{ name: "Kavya Bothra", role: "COO" }],
  recipients: [{ userId: "u1", name: "Aanya Rao" }],
  email: true,
};
const today = "2026-11-14";
const err = (i: Partial<StudioIssueInput>) => {
  const r = checkIssue({ ...base, ...i }, today);
  return "error" in r ? r.error : null;
};

describe("checkIssue", () => {
  it("accepts a plain completion certificate and fills the default wording", () => {
    const r = checkIssue(base, today);
    expect("ok" in r && r.ok.heading).toBe("Certificate of Completion");
    expect("ok" in r && r.ok.connector).toBe("has successfully completed");
  });
  it("needs a title, a name for everyone, a signatory and a recipient", () => {
    expect(err({ title: "  " })).toMatch(/title/);
    expect(err({ recipients: [{ userId: "u1", name: " " }] })).toMatch(/name/);
    expect(err({ signatories: [{ name: "", role: "COO" }] })).toMatch(/signatory/);
    expect(err({ recipients: [] })).toMatch(/student/);
  });
  it("a provisional certificate needs an expiry on or after the issue date, not in the past", () => {
    expect(err({ kind: "provisional" })).toMatch(/runs out/);
    expect(err({ kind: "provisional", expiresOn: "2026-11-01" })).toMatch(/before the issue date/);
    expect(err({ kind: "provisional", issuedOn: "2026-10-01", expiresOn: "2026-10-20" })).toMatch(/already passed/);
    expect(err({ kind: "provisional", expiresOn: "2026-12-31" })).toBeNull();
    expect(err({ kind: "provisional", expiresOn: "31/12/2026" })).toMatch(/doesn't look right/);
  });
  it("limits signatories and recipients, and drops duplicate students", () => {
    const four = Array.from({ length: 4 }, (_, i) => ({ name: `S${i}`, role: "R" }));
    expect(err({ signatories: four })).toMatch(/Three/);
    const many = Array.from({ length: MAX_RECIPIENTS + 1 }, (_, i) => ({ userId: `u${i}`, name: `N${i}` }));
    expect(err({ recipients: many })).toMatch(/at a time/);
    const r = checkIssue({ ...base, recipients: [{ userId: "u1", name: "A" }, { userId: "u1", name: "A again" }] }, today);
    expect("ok" in r && r.ok.recipients).toHaveLength(1);
  });
  it("removes long dashes from the wording", () => {
    const r = checkIssue({ ...base, title: "Case work — part one", citation: "A – B" }, today);
    expect("ok" in r && r.ok.title).toBe("Case work - part one");
    expect("ok" in r && r.ok.citation).toBe("A - B");
  });
  it("rejects an unknown type", () => {
    expect(err({ kind: "diploma" as never })).toMatch(/type/);
  });
});
