import { describe, expect, it } from "vitest";
import { cleanEmail, cleanPhone, linkedInAddToProfileUrl } from "./linkedin";

describe("linkedInAddToProfileUrl", () => {
  it("builds the add-certification link with every field encoded", () => {
    const url = linkedInAddToProfileUrl({
      title: "Volunteer & Helper",
      issuedOn: "2026-11-06",
      verifyUrl: "https://example.org/verify/abc123",
      credentialId: "abc123",
    });
    expect(url.startsWith("https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&")).toBe(true);
    const p = new URL(url).searchParams;
    expect(p.get("name")).toBe("Volunteer & Helper");
    expect(p.get("organizationName")).toBe("VIBHA School of Psychology");
    expect(p.get("issueYear")).toBe("2026");
    expect(p.get("issueMonth")).toBe("11");
    expect(p.get("certUrl")).toBe("https://example.org/verify/abc123");
    expect(p.get("certId")).toBe("abc123");
    expect(url).toContain("organizationName=VIBHA%20School%20of%20Psychology");
  });
});

describe("cleanEmail / cleanPhone", () => {
  it("normalises emails and rejects junk", () => {
    expect(cleanEmail("  Asha@Example.COM ")).toBe("asha@example.com");
    expect(cleanEmail("not an email")).toBeNull();
    expect(cleanEmail("a,b@x.com")).toBeNull();
  });
  it("keeps real phone numbers only", () => {
    expect(cleanPhone("+91 98765 43210")).toBe("+91 98765 43210");
    expect(cleanPhone("call me")).toBeNull();
  });
});
