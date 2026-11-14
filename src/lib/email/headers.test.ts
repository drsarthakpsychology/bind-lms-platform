import { describe, expect, it } from "vitest";
import { isSingleAddress, oneLineSubject } from "./headers";

describe("email header injection", () => {
  it("folds a subject to one line", () => {
    expect(oneLineSubject("Re: hello\r\nBcc: victim@example.com")).toBe("Re: hello Bcc: victim@example.com");
    expect(oneLineSubject("Plain subject")).toBe("Plain subject");
  });
  it("accepts one plain address only", () => {
    expect(isSingleAddress("student@example.com")).toBe(true);
    for (const bad of ["a@example.com\r\nBcc: b@example.com", "a@example.com, b@example.com", "Name <a@example.com>", "nope", ""]) {
      expect(isSingleAddress(bad)).toBe(false);
    }
  });
});
