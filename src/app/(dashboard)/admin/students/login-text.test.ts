import { describe, expect, it } from "vitest";
import { loginDetailsText } from "./login-text";

describe("loginDetailsText", () => {
  it("says who to sign in as, gives the link and where to sign in, with no dashes", () => {
    const t = loginDetailsText("Asha Rao", "asha@example.com", "https://x.test/setup?t=abc", "https://x.test/");
    expect(t).toContain("Hi Asha,");
    expect(t).toContain("Email: asha@example.com");
    expect(t).toContain("https://x.test/setup?t=abc");
    expect(t).toContain("sign in at https://x.test/login");
    expect(t).not.toMatch(/[\u2013\u2014]/);
  });
  it("copes with an empty name", () => {
    expect(loginDetailsText("  ", "a@b.c", "u", "o")).toContain("Hi there,");
  });
});
