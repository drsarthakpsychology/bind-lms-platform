import { beforeEach, describe, expect, it, vi } from "vitest";

/** Every bell insert also queues the phone push (and a failed push never breaks the bell). */
const h = vi.hoisted(() => ({ push: vi.fn(), inserted: [] as unknown[] }));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/app-api/push", () => ({ queuePush: h.push }));
vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: () => ({
    from: (t: string) => ({
      insert: async (rows: unknown) => (h.inserted.push({ t, rows }), { error: null }),
      select: () => ({
        eq: () => ({ maybeSingle: async () => ({ data: t === "doubts" ? { user_id: "asker", title: "Why?" } : { name: "Ravi" } }), neq: async () => ({ data: [{ id: "admin-1" }] }) }),
      }),
    }),
  }),
}));

import { notifyAdminsOfDoubt, notifyAskerOfReply } from "./doubts";

beforeEach(() => {
  h.push.mockReset();
  h.inserted = [];
});

describe("bell notifications push to the phone", () => {
  it("a doubt reply goes to the asker as a doubt reply", async () => {
    await notifyAskerOfReply({ doubtId: "d1", replierId: "ravi", body: "Because." });
    expect(h.push).toHaveBeenCalledTimes(1);
    expect(h.push.mock.calls[0][1]).toBe("doubtReplies");
    expect(h.push.mock.calls[0][0][0]).toMatchObject({ user_id: "asker" });
  });

  it("a new doubt goes to the admins as a message", async () => {
    await notifyAdminsOfDoubt({ doubtId: "d1", title: "Why?", body: "x", kind: "doubt", askerId: "asker" });
    expect(h.push.mock.calls[0][1]).toBe("messages");
  });

  it("a push that throws does not break the post", async () => {
    h.push.mockImplementation(() => {
      throw new Error("x");
    });
    await expect(notifyAskerOfReply({ doubtId: "d1", replierId: "ravi", body: "Because." })).resolves.toBeUndefined();
  });
});
