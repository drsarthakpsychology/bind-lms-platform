import { describe, expect, it } from "vitest";
import { badgeText, groupReplies, threadNeedsReply, type ThreadRow } from "./logic";

const admins = new Set(["admin-1"]);
const t = (over: Partial<ThreadRow> = {}): ThreadRow => ({ id: "d1", user_id: "stu", kind: "doubt", status: "open", created_at: "2026-11-01T10:00:00Z", ...over });
const r = (user_id: string, at: string, hidden = false) => ({ doubt_id: "d1", user_id, created_at: at, hidden });

describe("threadNeedsReply", () => {
  it("counts a doubt nobody answered", () => {
    expect(threadNeedsReply(t(), [], admins)?.reason).toBe("unanswered");
  });
  it("ignores solved and hidden threads", () => {
    expect(threadNeedsReply(t({ status: "solved" }), [], admins)).toBeNull();
    expect(threadNeedsReply(t({ status: "hidden" }), [], admins)).toBeNull();
  });
  it("clears once an admin answers", () => {
    expect(threadNeedsReply(t(), [r("admin-1", "2026-11-01T11:00:00Z")], admins)).toBeNull();
  });
  it("comes back when the student replies after the answer", () => {
    const res = threadNeedsReply(t(), [r("admin-1", "2026-11-01T11:00:00Z"), r("stu", "2026-11-01T12:00:00Z")], admins);
    expect(res).toEqual({ reason: "student-replied", lastAt: "2026-11-01T12:00:00Z" });
  });
  it("does not count a doubt other students answered", () => {
    expect(threadNeedsReply(t(), [r("peer", "2026-11-01T11:00:00Z")], admins)).toBeNull();
  });
  it("keeps a private concern until an admin answers", () => {
    expect(threadNeedsReply(t({ kind: "complaint" }), [r("peer", "2026-11-01T11:00:00Z")], admins)?.reason).toBe("concern");
  });
  it("skips hidden replies", () => {
    expect(threadNeedsReply(t(), [r("admin-1", "2026-11-01T11:00:00Z", true)], admins)?.reason).toBe("unanswered");
  });
  it("orders replies by time, not by input order", () => {
    const res = threadNeedsReply(t(), [r("stu", "2026-11-01T12:00:00Z"), r("admin-1", "2026-11-01T13:00:00Z")], admins);
    expect(res).toBeNull();
  });
});

describe("groupReplies / badgeText", () => {
  it("groups by doubt", () => {
    const g = groupReplies([{ ...r("a", "1"), doubt_id: "x" }, { ...r("b", "2"), doubt_id: "x" }, { ...r("c", "3"), doubt_id: "y" }]);
    expect(g.get("x")?.length).toBe(2);
    expect(g.get("y")?.length).toBe(1);
  });
  it("formats the badge", () => {
    expect(badgeText(0)).toBeNull();
    expect(badgeText(7)).toBe("7");
    expect(badgeText(140)).toBe("99+");
  });
});
