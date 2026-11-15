import { beforeEach, describe, expect, it, vi } from "vitest";

const { notify } = vi.hoisted(() => ({ notify: vi.fn(async () => {}) }));
vi.mock("server-only", () => ({}));
vi.mock("./notify", () => ({ notifyCredential: notify }));
vi.mock("./storage", () => ({ newCredentialId: () => `id-${Math.random().toString(16).slice(2)}` }));

import { fakeDb } from "@/lib/certificates/fake-db";
import { awardBadgeManually } from "./manual-award";

const actor = { id: "admin-1", email: "owner@example.com" };
const db = () =>
  fakeDb({
    achievements: [
      { id: "b1", title: "Helper of the week", type: "badge" },
      { id: "c1", title: "Course certificate", type: "certificate" },
    ],
    profiles: [
      { id: "u1", name: "Aanya Rao", email: "aanya@example.com" },
      { id: "u2", name: "Dev Shah", email: "dev@example.com" },
      { id: "u3", name: "Had It", email: "had@example.com" },
    ],
    credentials: [{ id: "x", credential_id: "old", user_id: "u3", achievement_id: "b1", type: "badge", status: "issued" }],
  });

beforeEach(() => notify.mockClear());

describe("Give a badge by hand", () => {
  it("gives it to each new person once, skips who has it, notifies and audits", async () => {
    const d = db();
    const r = await awardBadgeManually(d as never, actor, "b1", ["u1", "u2", "u3", "u1"]);
    expect(r.error).toBeNull();
    expect(r.awarded.map((a) => a.name)).toEqual(["Aanya R.", "Dev S."]);
    expect(r.skipped).toEqual([{ name: "Had I.", reason: "Already has it" }]);
    const rows = d.tables.credentials.filter((c) => c.achievement_id === "b1" && c.status === "issued");
    expect(rows).toHaveLength(3);
    expect(rows.every((c) => c.type === "badge")).toBe(true);
    expect(notify).toHaveBeenCalledTimes(2);
    expect(d.tables.admin_audit_log.map((a) => [a.action, a.actor_id])).toEqual([
      ["badge.manual_awarded", "admin-1"],
      ["badge.manual_awarded", "admin-1"],
    ]);
  });

  it("refuses a certificate type, an empty list and too many people", async () => {
    expect((await awardBadgeManually(db() as never, actor, "c1", ["u1"])).error).toBe("Pick a badge.");
    expect((await awardBadgeManually(db() as never, actor, "b1", [])).error).toBe("Pick at least one student.");
    expect((await awardBadgeManually(db() as never, actor, "b1", Array.from({ length: 301 }, (_, i) => `u${i}`))).error).toMatch(/300/);
  });

  it("a revoked copy does not count as having it", async () => {
    const d = db();
    d.tables.credentials[0].status = "revoked";
    const r = await awardBadgeManually(d as never, actor, "b1", ["u3"]);
    expect(r.awarded.map((a) => a.userId)).toEqual(["u3"]);
  });
});
