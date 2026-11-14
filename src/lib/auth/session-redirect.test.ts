import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  redirect: (to: string) => {
    throw new Error(`redirect:${to}`);
  },
}));
import { leaveWithoutSession } from "./session-redirect";
import type { Profile } from "./session";

describe("leaveWithoutSession", () => {
  it("sends each lost session to its own page", () => {
    expect(() => leaveWithoutSession({ status: "unauthenticated" })).toThrow("redirect:/login");
    expect(() => leaveWithoutSession({ status: "expired" })).toThrow("redirect:/expired");
    expect(() => leaveWithoutSession({ status: "session_replaced" })).toThrow("redirect:/login?why=elsewhere");
    expect(() => leaveWithoutSession({ status: "blocked", profile: {} as Profile })).toThrow("redirect:/paused");
  });
});
