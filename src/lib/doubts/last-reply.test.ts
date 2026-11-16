import { describe, expect, it } from "vitest";

import { lastReplyBy } from "./last-reply";

const roles: Record<string, string> = { t: "admin", v: "view_admin", s: "student", a: "alumni" };
const roleOf = (id: string) => roles[id];

describe("lastReplyBy", () => {
  it("names who wrote the newest answer on each doubt", () => {
    const m = lastReplyBy(
      [
        { doubt_id: "d1", user_id: "s", created_at: "2026-11-16T09:00:00Z" },
        { doubt_id: "d1", user_id: "t", created_at: "2026-11-16T10:00:00Z" },
        { doubt_id: "d2", user_id: "v", created_at: "2026-11-16T08:00:00Z" },
        { doubt_id: "d2", user_id: "s", created_at: "2026-11-16T11:00:00Z" },
        { doubt_id: "d3", user_id: "v", created_at: "2026-11-16T08:00:00Z" },
        { doubt_id: "d4", user_id: "gone", created_at: "2026-11-16T08:00:00Z" },
      ],
      roleOf,
    );
    expect(Object.fromEntries(m)).toEqual({ d1: "faculty", d2: "student", d3: "faculty", d4: "student" });
  });

  it("leaves out hidden answers, so a hidden team reply still leaves the doubt waiting", () => {
    const m = lastReplyBy(
      [
        { doubt_id: "d1", user_id: "s", created_at: "2026-11-16T09:00:00Z" },
        { doubt_id: "d1", user_id: "t", created_at: "2026-11-16T10:00:00Z", hidden: true },
        { doubt_id: "d2", user_id: "t", created_at: "2026-11-16T10:00:00Z", hidden: true },
      ],
      roleOf,
    );
    expect(m.get("d1")).toBe("student");
    expect(m.has("d2")).toBe(false);
  });
});
