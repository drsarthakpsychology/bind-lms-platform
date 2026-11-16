import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());

import { G, resetGuard } from "./test-guard";
import { adminsWanting, cleanAdminPushPrefs } from "./admin-push";
import { buildMessages } from "./push";
import { createAdminClient } from "@/lib/supabase/server";

describe("admin push preferences", () => {
  it("fills defaults and ignores junk", () => {
    expect(cleanAdminPushPrefs(null)).toEqual({ newDoubt: true, newEnquiry: true, fallingBehind: false });
    expect(cleanAdminPushPrefs({ newDoubt: false, newEnquiry: "no" })).toEqual({ newDoubt: false, newEnquiry: true, fallingBehind: false });
  });

  it("only admins who want a notice get it", async () => {
    resetGuard({ admin_settings: [{ key: "admin_push_prefs:a2", value: { newDoubt: false } }] });
    expect(G.db.tables.admin_settings).toHaveLength(1);
    const want = await adminsWanting(createAdminClient() as never, ["a1", "a2"], "new_doubt");
    expect([...want]).toEqual(["a1"]);
    expect([...(await adminsWanting(createAdminClient() as never, ["a1", "a2"], "falling_behind"))]).toEqual([]);
  });

  it("admin notices carry their kind and id to the phone", () => {
    const m = buildMessages([{ user_id: "a1", title: "New doubt: Why?", href: "/notifications/n1", id: "n1" }], "messages", [{ userId: "a1", token: "t" }], new Map(), { admin: "new_doubt", id: "d1" });
    expect(m[0].data).toMatchObject({ notificationId: "n1", admin: "new_doubt", id: "d1" });
  });
});
