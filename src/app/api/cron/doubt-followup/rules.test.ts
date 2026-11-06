import { describe, expect, it } from "vitest";
import { EMAIL_AFTER_MS, answerPreview, answersNeedingNotice, emailDecision, esc, makeThrottle, type FollowupRow } from "./rules";

const admins = new Set(["adm"]);
const doubts = new Map([
  ["d1", { id: "d1", user_id: "stu", status: "open" }],
  ["d2", { id: "d2", user_id: "stu2", status: "hidden" }],
  ["d3", { id: "d3", user_id: "adm", status: "open" }],
]);
const a = (id: string, doubt_id: string, user_id: string, at = "2026-11-05T10:00:00Z", hidden = false) => ({ id, doubt_id, user_id, created_at: at, hidden });

describe("answersNeedingNotice", () => {
  it("notifies the asker for an admin answer", () => {
    const r = answersNeedingNotice([a("r1", "d1", "adm")], doubts, admins, new Set(), new Set());
    expect(r.notify.map((x) => x.id)).toEqual(["r1"]);
  });
  it("skips peers, hidden answers, hidden doubts, own doubts and recorded answers", () => {
    const r = answersNeedingNotice(
      [a("p", "d1", "peer"), a("h", "d1", "adm", undefined, true), a("x", "d2", "adm"), a("own", "d3", "adm"), a("done", "d1", "adm")],
      doubts,
      admins,
      new Set(["done"]),
      new Set(),
    );
    expect(r.notify).toEqual([]);
    expect(r.merge).toEqual([]);
  });
  it("folds a second quick answer into the first notice", () => {
    const r = answersNeedingNotice([a("r2", "d1", "adm", "2026-11-05T11:00:00Z"), a("r1", "d1", "adm", "2026-11-05T10:00:00Z")], doubts, admins, new Set(), new Set());
    expect(r.notify.map((x) => x.id)).toEqual(["r1"]);
    expect(r.merge.map((x) => x.id)).toEqual(["r2"]);
  });
  it("folds into an existing unopened notice", () => {
    const r = answersNeedingNotice([a("r3", "d1", "adm")], doubts, admins, new Set(), new Set(["d1"]));
    expect(r.notify).toEqual([]);
    expect(r.merge.map((x) => x.id)).toEqual(["r3"]);
  });
});

describe("emailDecision", () => {
  const sent = "2026-11-01T00:00:00Z";
  const base: FollowupRow = { reply_id: "r", doubt_id: "d", user_id: "u", notification_id: "n", notified_at: sent, email_claimed_at: null, emailed_at: null, email_status: null };
  const t0 = new Date(sent).getTime();
  it("waits for 48 hours", () => {
    expect(emailDecision(base, null, t0 + EMAIL_AFTER_MS - 1)).toBe("wait");
  });
  it("emails once 48 hours pass unopened", () => {
    expect(emailDecision(base, null, t0 + EMAIL_AFTER_MS)).toBe("email");
  });
  it("never emails an opened notice", () => {
    expect(emailDecision(base, "2026-11-01T05:00:00Z", t0 + EMAIL_AFTER_MS * 2)).toBe("opened");
  });
  it("never emails twice", () => {
    expect(emailDecision({ ...base, emailed_at: "2026-11-03T00:00:00Z" }, null, t0 + EMAIL_AFTER_MS * 3)).toBe("done");
    expect(emailDecision({ ...base, email_claimed_at: "2026-11-03T00:00:00Z" }, null, t0 + EMAIL_AFTER_MS * 3)).toBe("done");
    expect(emailDecision({ ...base, email_status: "failed" }, null, t0 + EMAIL_AFTER_MS * 3)).toBe("done");
  });
  it("leaves merged answers to the first notice", () => {
    expect(emailDecision({ ...base, notification_id: null }, null, t0 + EMAIL_AFTER_MS * 3)).toBe("done");
  });
});

describe("helpers", () => {
  it("previews and escapes", () => {
    expect(answerPreview("a   b\n c")).toBe("a b c");
    expect(answerPreview("x".repeat(300), 10)).toHaveLength(10);
    expect(esc('<b>"&"</b>')).toBe("&lt;b&gt;&quot;&amp;&quot;&lt;/b&gt;");
  });
  it("throttles", () => {
    const ok = makeThrottle(1000);
    expect(ok(5000)).toBe(true);
    expect(ok(5500)).toBe(false);
    expect(ok(6000)).toBe(true);
  });
});
