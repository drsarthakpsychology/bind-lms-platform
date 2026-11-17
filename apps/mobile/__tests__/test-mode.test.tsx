import { fireEvent, waitFor } from "@testing-library/react-native";
import * as React from "react";

import type { RawRequest, RawResponse } from "@/api/client";
import { mock, mockTransport } from "@/api/mock/server";
import { createSession } from "@/auth/session";
import { memoryStore } from "@/lib/storage";
import { render } from "./utils";

/**
 * Test mode on the phone: the admin switches into their hidden test student
 * and back with one tap, without a password, and nothing of one account
 * leaks into the other (tokens, waiting saves, cached screens).
 */

const testTokens = { accessToken: "test.student.access", refreshToken: "test.student.refresh", expiresIn: 3600, expiresAt: "2099-01-01T00:00:00.000Z" };
const testMe = { id: "test-student", email: "test-student-x@test.vibha.invalid", name: "Test student", role: "student", scope: "full", status: "active", testMode: { as: "student" } };

function make() {
  const secure = memoryStore();
  const prefs = memoryStore();
  const calls: RawRequest[] = [];
  const switched = jest.fn();
  const flushed = jest.fn(async () => {});
  let testAlive = true;
  const transport = async (r: RawRequest): Promise<RawResponse> => {
    calls.push(r);
    if (r.path.endsWith("/test-mode/session")) return { status: 200, json: { ok: true, data: { tokens: testTokens, me: testMe, device: { enforced: false, current: null, changesUsed: 0, limit: null, nextChangeAt: null } } } };
    if (r.headers.Authorization === `Bearer ${testTokens.accessToken}`) {
      if (!testAlive) return { status: 401, json: { ok: false, error: { code: "unauthenticated", message: "Sign in again." } } };
      if (r.path.endsWith("/me")) return { status: 200, json: { ok: true, data: testMe } };
      if (r.path.endsWith("/auth/sign-out")) return { status: 200, json: { ok: true, data: { signedOut: true } } };
    }
    return mockTransport(r);
  };
  let n = 0;
  const s = createSession({ secure, prefs, transport, hash: async (t) => `h(${t})`, randomId: () => `id-${String(++n).padStart(16, "0")}`, pinMaxTries: 5, lockAfterMs: 300_000, onAccountSwitched: switched, beforeSignOut: flushed });
  return { s, secure, calls, switched, flushed, kill: () => (testAlive = false) };
}

async function signedInAdmin(m: ReturnType<typeof make>) {
  await m.s.boot();
  await m.s.signIn("admin@example.com", "pw");
  await m.s.choosePin("2580");
  return JSON.parse((await m.secure.get("vibha.tokens.v1"))!).accessToken as string;
}

beforeEach(() => mock.reset());

describe("test mode switch", () => {
  it("opens the test student with no password and keeps the admin's sign-in for the way back", async () => {
    const m = make();
    const adminToken = await signedInAdmin(m);
    expect(m.s.store.get().me?.role).toBe("admin");

    await m.s.openTestStudent();
    expect(m.s.isTestStudent()).toBe(true);
    expect(m.s.store.get().me?.role).toBe("student");
    expect(m.s.store.get().me?.testMode?.as).toBe("student");
    expect(m.s.store.get().phase).toBe("ready");
    expect(JSON.parse((await m.secure.get("vibha.tokens.v1"))!).accessToken).toBe(testTokens.accessToken);
    expect(JSON.parse((await m.secure.get("vibha.test-return.v1"))!).tokens.accessToken).toBe(adminToken);
    // Waiting saves went out as the admin first; caches were cleared.
    expect(m.flushed).toHaveBeenCalledTimes(1);
    expect(m.switched).toHaveBeenCalledTimes(1);
    const sessionCall = m.calls.find((c) => c.path.endsWith("/test-mode/session"))!;
    expect(sessionCall.headers.Authorization).toBe(`Bearer ${adminToken}`);
    expect((sessionCall.body as { device: { id: string } }).device.id).toBe(m.s.deviceId());

    expect(await m.s.backToAdmin()).toBe(true);
    expect(m.s.isTestStudent()).toBe(false);
    expect(m.s.store.get().me?.role).toBe("admin");
    expect(JSON.parse((await m.secure.get("vibha.tokens.v1"))!).accessToken).toBe(adminToken);
    expect(await m.secure.get("vibha.test-return.v1")).toBeNull();
    expect(m.switched).toHaveBeenCalledTimes(2);
    // The test student's sign-in was ended on the server, with its own token.
    const out = m.calls.filter((c) => c.path.endsWith("/auth/sign-out"));
    expect(out.at(-1)?.headers.Authorization).toBe(`Bearer ${testTokens.accessToken}`);
  });

  it("can go back and forth while test mode stays on", async () => {
    const m = make();
    await signedInAdmin(m);
    for (let i = 0; i < 2; i++) {
      await m.s.openTestStudent();
      expect(m.s.store.get().me?.role).toBe("student");
      await m.s.backToAdmin();
      expect(m.s.store.get().me?.role).toBe("admin");
    }
  });

  it("a cold start remembers it is the test student and can still go back", async () => {
    const m = make();
    await signedInAdmin(m);
    await m.s.openTestStudent();
    const again = createSession({ secure: m.secure, prefs: memoryStore(), transport: mockTransport, hash: async (t) => `h(${t})`, randomId: () => "x".repeat(16), pinMaxTries: 5, lockAfterMs: 300_000 });
    await again.boot();
    expect(again.isTestStudent()).toBe(true);
    expect(await again.backToAdmin()).toBe(true);
    expect(again.isTestStudent()).toBe(false);
  });

  it("when the test student's sign-in ends (reset), the phone goes back to the admin instead of signing out", async () => {
    const m = make();
    await signedInAdmin(m);
    await m.s.openTestStudent();
    m.kill();
    await m.s.refreshMe();
    await waitFor(() => expect(m.s.isTestStudent()).toBe(false));
    expect(m.s.store.get().phase).toBe("ready");
    expect(m.s.store.get().me?.role).toBe("admin");
  });

  it("Sign out as the test student goes back to the admin", async () => {
    const m = make();
    await signedInAdmin(m);
    await m.s.openTestStudent();
    await m.s.signOut();
    expect(m.s.store.get().phase).toBe("ready");
    expect(m.s.store.get().me?.role).toBe("admin");
  });

  it("a real sign-out forgets the admin's kept sign-in too", async () => {
    const m = make();
    await signedInAdmin(m);
    await m.s.openTestStudent();
    await m.s.backToAdmin();
    await m.s.signOut();
    expect(await m.secure.get("vibha.test-return.v1")).toBeNull();
    expect(m.s.store.get().phase).toBe("visitor");
  });
});

describe("test mode bar", () => {
  it("shows on both sides and says where a tap goes", async () => {
    const { TestModeBar } = await import("@/admin/test-mode");
    const a = await render(<TestModeBar side="admin" />);
    expect(a.getByLabelText("Test mode. Open as test student")).toBeTruthy();
    a.unmount();
    const s = await render(<TestModeBar side="student" />);
    expect(s.getByLabelText("Test mode. Back to admin")).toBeTruthy();
    fireEvent.press(s.getByTestId("test-mode-bar"));
    s.unmount();
    const none = await render(<TestModeBar side={null} />);
    expect(none.queryByTestId("test-mode-bar")).toBeNull();
  });
});
