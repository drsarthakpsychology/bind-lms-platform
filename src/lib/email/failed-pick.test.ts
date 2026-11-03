import { describe, expect, it } from "vitest";
import { openFailures } from "./failed-pick";

describe("open failures", () => {
  const f = (id: string, recipient: string, created_at: string) => ({ id, recipient, created_at });
  it("drops failures fixed by a later good send, and robot addresses", () => {
    const out = openFailures(
      [f("1", "a@gmail.com", "2026-11-01T10:00:00Z"), f("2", "b@gmail.com", "2026-11-01T10:00:00Z"), f("3", "test@lumen.test", "2026-11-01T10:00:00Z")],
      [{ recipient: "A@gmail.com", created_at: "2026-11-01T11:00:00Z" }, { recipient: "b@gmail.com", created_at: "2026-10-30T11:00:00Z" }],
    );
    expect(out.map((r) => r.id)).toEqual(["2"]);
  });
});
