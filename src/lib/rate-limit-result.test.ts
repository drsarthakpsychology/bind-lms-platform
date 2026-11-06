import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const rpc = vi.fn();
vi.mock("@/lib/supabase/server", () => ({ createAdminClient: () => ({ rpc }) }));

import { rateLimitResult } from "./rate-limit";

describe("rateLimitResult", () => {
  it("allowed / limited come from the database counter", async () => {
    rpc.mockResolvedValueOnce({ data: true, error: null });
    expect(await rateLimitResult("k", 10)).toBe("allowed");
    rpc.mockResolvedValueOnce({ data: false, error: null });
    expect(await rateLimitResult("k", 10)).toBe("limited");
  });
  it("a missing counter is 'unavailable', not 'too many attempts'", async () => {
    rpc.mockResolvedValueOnce({ data: null, error: { message: "Could not find the function public.rate_limit_incr" } });
    expect(await rateLimitResult("k", 10)).toBe("unavailable");
    rpc.mockRejectedValueOnce(new Error("network"));
    expect(await rateLimitResult("k", 10)).toBe("unavailable");
  });
});
