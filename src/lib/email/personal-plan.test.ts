import { describe, expect, it } from "vitest";
import { checkCompose, firstName, mergeVars, planPersonal, renderMerge, unknownFields } from "./personal-plan";
import { foldEmailed } from "@/lib/forms/emailed";

describe("merge fields", () => {
  it("fills first name, name and email, any case and spacing", () => {
    const v = mergeVars({ email: " Aanya@Example.com ", name: "aanya  rao", vars: { form: "Cohort 2 interest" } });
    expect(renderMerge("Hi {first_name}, { Name } ({EMAIL}) re {form}", v)).toBe("Hi Aanya, aanya rao (aanya@example.com) re Cohort 2 interest");
  });
  it("falls back to the email, then to 'there'", () => {
    expect(firstName("", "dev.shah42@x.co")).toBe("Dev");
    expect(firstName(null, null)).toBe("there");
  });
  it("leaves unknown fields as typed and lists them", () => {
    expect(renderMerge("Hi {nickname}", mergeVars({ email: "a@b.co", name: "A" }))).toBe("Hi {nickname}");
    expect(unknownFields("{first_name} {nickname} {Nickname} {form}", ["first_name", "name", "email", "form"])).toEqual(["nickname", "Nickname"]);
  });
});

describe("who gets an email now", () => {
  const people = [
    { email: "a@x.co", name: "A" },
    { email: "A@X.co ", name: "A again" },
    { email: "", name: "No mail" },
    { email: "not-an-email", name: "Bad" },
    { email: "b@x.co", name: "B" },
    { email: "c@x.co", name: "C" },
  ];
  it("sends one per address, skips no address, queues over the allowance", () => {
    const p = planPersonal(people, { limit: 100, sentToday: 98 });
    expect(p.remaining).toBe(2);
    expect(p.send.map((t) => t.email)).toEqual(["a@x.co", "b@x.co"]);
    expect(p.queue.map((t) => t.email)).toEqual(["c@x.co"]);
    expect(p.noEmail.map((t) => t.name)).toEqual(["No mail", "Bad"]);
    expect(p.duplicates).toBe(1);
  });
  it("queues everyone when today is used up", () => {
    const p = planPersonal(people, { limit: 100, sentToday: 140 });
    expect(p.send).toHaveLength(0);
    expect(p.queue).toHaveLength(3);
  });
  it("checks the subject and body", () => {
    expect(checkCompose("", "x")).toBe("Add a subject line.");
    expect(checkCompose("Hi", "  ")).toBe("Write the email first.");
    expect(checkCompose("Hi", "Body")).toBeNull();
  });
});

describe("who was emailed from a form", () => {
  it("folds the log per address", () => {
    const m = foldEmailed([
      { recipient: "A@x.co", status: "sent", sent_at: "2026-11-10T10:00:00Z", created_at: "2026-11-10T10:00:00Z" },
      { recipient: "a@x.co", status: "delivered", sent_at: "2026-11-12T10:00:00Z", created_at: "2026-11-12T10:00:00Z" },
      { recipient: "b@x.co", status: "pending", sent_at: null, created_at: "2026-11-12T10:00:00Z" },
      { recipient: "c@x.co", status: "failed", sent_at: null, created_at: "2026-11-12T10:00:00Z" },
    ]);
    expect(m["a@x.co"]).toEqual({ lastSentAt: "2026-11-12T10:00:00Z", sent: 2, waiting: 0, failed: 0 });
    expect(m["b@x.co"].waiting).toBe(1);
    expect(m["c@x.co"].failed).toBe(1);
  });
});
