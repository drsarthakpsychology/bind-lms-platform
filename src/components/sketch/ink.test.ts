import { describe, expect, it } from "vitest";
import { roundPath } from "./ink";

describe("roundPath", () => {
  it("gives the server and the browser the same path when their maths differ in the last digit", () => {
    // Real output for the same seeded ellipse: Node 22 vs Chromium.
    const node = "M3.1958802073378423 -8.366318392720968 C-6.5815646511146975 -4.933415019559907, 1e-16 2";
    const chrome = "M3.1958802073378423 -8.366318392720968 C-6.581564651114697 -4.933415019559906, 1e-16 2";
    expect(roundPath(node)).toBe(roundPath(chrome));
    expect(roundPath(node)).toBe("M3.2 -8.37 C-6.58 -4.93, 0 2");
  });
});
