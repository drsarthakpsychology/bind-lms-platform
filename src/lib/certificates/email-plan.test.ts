import { describe, expect, it } from "vitest";
import { dailyEmailLimit, planEmails, startOfEmailDay, type EmailTarget } from "./email-plan";

const people = (n: number, withEmail = true): EmailTarget[] => Array.from({ length: n }, (_, i) => ({ credentialId: `c${i}`, userId: `u${i}`, name: `Student ${i}`, email: withEmail ? `s${i}@example.com` : null }));

describe("planEmails", () => {
  it("sends everyone when under the limit", () => {
    const p = planEmails(people(5), { configured: true, limit: 100, sentToday: 10 });
    expect(p.send).toHaveLength(5);
    expect(p.queue).toHaveLength(0);
    expect(p.remaining).toBe(90);
  });
  it("queues the rest over the limit, in order", () => {
    const p = planEmails(people(82), { configured: true, limit: 100, sentToday: 40 });
    expect(p.send).toHaveLength(60);
    expect(p.queue).toHaveLength(22);
    expect(p.queue[0].credentialId).toBe("c60");
  });
  it("queues everyone when the day is used up", () => {
    const p = planEmails(people(3), { configured: true, limit: 100, sentToday: 250 });
    expect(p.send).toHaveLength(0);
    expect(p.queue).toHaveLength(3);
    expect(p.remaining).toBe(0);
  });
  it("is in-app only when email is not set up", () => {
    const p = planEmails(people(3), { configured: false, limit: 100, sentToday: 0 });
    expect(p.send).toHaveLength(0);
    expect(p.queue).toHaveLength(0);
    expect(p.noEmail).toHaveLength(3);
  });
  it("sets aside people without an address", () => {
    const p = planEmails([...people(2), ...people(1, false)], { configured: true, limit: 100, sentToday: 0 });
    expect(p.send).toHaveLength(2);
    expect(p.noEmail).toHaveLength(1);
  });
});

describe("limit and day", () => {
  it("reads RESEND_DAILY_LIMIT, default 100", () => {
    expect(dailyEmailLimit({})).toBe(100);
    expect(dailyEmailLimit({ RESEND_DAILY_LIMIT: "3000" })).toBe(3000);
    expect(dailyEmailLimit({ RESEND_DAILY_LIMIT: "nope" })).toBe(100);
  });
  it("starts the day at midnight UTC", () => {
    expect(startOfEmailDay(new Date("2026-11-14T18:45:00Z"))).toBe("2026-11-14T00:00:00.000Z");
  });
});
