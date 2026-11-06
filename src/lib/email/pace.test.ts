import { describe, expect, it } from "vitest";
import { createPacer, explainFailure, planRetry, type FailedRow } from "./pace";

describe("explainFailure", () => {
  it("names the real causes seen in production", () => {
    expect(explainFailure("You have reached your daily email sending quota.").kind).toBe("quota");
    expect(explainFailure("Too many requests. You can only make 10 requests per second.").kind).toBe("rate");
    expect(explainFailure("The vibhaschoolofpsychology.in domain is not verified. Please, add and verify your domain").kind).toBe("domain");
    expect(explainFailure("Invalid `to` field.").retryNow).toBe(false);
    expect(explainFailure(null).kind).toBe("other");
  });
});

const row = (id: string, recipient: string, subject: string, created_at: string, extra: Partial<FailedRow> = {}): FailedRow => ({
  id, recipient, subject, created_at, template_id: "custom", html: "<p>x</p>", error_reason: "Too many requests", ...extra,
});

describe("planRetry", () => {
  it("sends once per person + subject, newest copy", () => {
    const p = planRetry([row("a", "x@y.com", "Hi", "2026-11-01"), row("b", "X@y.com", "Hi", "2026-11-02")], []);
    expect(p.send.map((r) => r.id)).toEqual(["b"]);
    expect(p.duplicates.map((r) => r.id)).toEqual(["a"]);
  });
  it("skips people who already got it later", () => {
    const p = planRetry([row("a", "x@y.com", "Hi", "2026-11-01")], [{ recipient: "x@y.com", subject: "Hi", created_at: "2026-11-03" }]);
    expect(p.send).toEqual([]);
    expect(p.alreadyDelivered.map((r) => r.id)).toEqual(["a"]);
  });
  it("a good send BEFORE the failure doesn't count", () => {
    const p = planRetry([row("a", "x@y.com", "Hi", "2026-11-05")], [{ recipient: "x@y.com", subject: "Hi", created_at: "2026-11-01" }]);
    expect(p.send.map((r) => r.id)).toEqual(["a"]);
  });
  it("no stored copy = can't resend, except login emails (new link)", () => {
    const p = planRetry([row("a", "a@y.com", "S", "1", { html: null, body_text: null }), row("b", "b@y.com", "Login", "1", { html: null, template_id: "credential" })], []);
    expect(p.noCopy.map((r) => r.id)).toEqual(["a"]);
    expect(p.send.map((r) => r.id)).toEqual(["b"]);
  });
  it("bad addresses are not retried", () => {
    const p = planRetry([row("a", "a@y.com", "S", "1", { error_reason: "Invalid `to` field" })], []);
    expect(p.notRetryable.length).toBe(1);
  });
});

describe("createPacer", () => {
  it("spaces calls apart", async () => {
    let t = 0;
    const waits: number[] = [];
    const wait = createPacer(250, () => t, async (ms) => { waits.push(ms); t += ms; });
    await wait(); await wait(); await wait();
    expect(waits).toEqual([250, 250]);
  });
});
