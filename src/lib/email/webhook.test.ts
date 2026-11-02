import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyResendSignature } from "./webhook";

const secret = "whsec_" + Buffer.from("test-secret-key-123").toString("base64");
function sign(body: string, id: string, ts: string) {
  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  return "v1," + createHmac("sha256", key).update(`${id}.${ts}.${body}`).digest("base64");
}

describe("verifyResendSignature", () => {
  const body = JSON.stringify({ type: "email.opened", data: { email_id: "abc" } });
  const ts = String(Math.floor(Date.now() / 1000));
  it("accepts a correctly signed, fresh payload", () => {
    expect(verifyResendSignature(body, { id: "msg_1", timestamp: ts, signature: sign(body, "msg_1", ts) }, secret)).toBe(true);
  });
  it("rejects a tampered body", () => {
    expect(verifyResendSignature(body + " ", { id: "msg_1", timestamp: ts, signature: sign(body, "msg_1", ts) }, secret)).toBe(false);
  });
  it("rejects stale timestamps and missing secrets", () => {
    const old = String(Math.floor(Date.now() / 1000) - 3600);
    expect(verifyResendSignature(body, { id: "m", timestamp: old, signature: sign(body, "m", old) }, secret)).toBe(false);
    expect(verifyResendSignature(body, { id: "m", timestamp: ts, signature: sign(body, "m", ts) }, undefined)).toBe(false);
  });
});
