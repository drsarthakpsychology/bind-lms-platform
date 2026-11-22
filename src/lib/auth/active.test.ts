import { beforeEach, describe, expect, it, vi } from "vitest";

const session = vi.hoisted(() => ({ value: { status: "ok", profile: { id: "u1", scope: "full" } } as unknown }));
vi.mock("server-only", () => ({}));
vi.mock("./session", () => ({ getSession: async () => session.value }));

import { activeUserId } from "./active";

describe("activeUserId", () => {
  beforeEach(() => {
    session.value = { status: "ok", profile: { id: "u1", scope: "full" } };
  });
  it("gives the id of an active account", async () => {
    expect(await activeUserId()).toBe("u1");
    expect(await activeUserId({ full: true })).toBe("u1");
  });
  it("refuses paused, ended and replaced sessions", async () => {
    for (const status of ["blocked", "expired", "session_replaced", "unauthenticated"]) {
      session.value = { status, profile: { id: "u1", scope: "full" } };
      expect(await activeUserId()).toBeNull();
    }
  });
  it("refuses lectures-only accounts where Full access is needed", async () => {
    session.value = { status: "ok", profile: { id: "u1", scope: "lectures_only" } };
    expect(await activeUserId()).toBe("u1");
    expect(await activeUserId({ full: true })).toBeNull();
  });
});
