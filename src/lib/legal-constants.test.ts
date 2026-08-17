import { describe, expect, it } from "vitest";
import { LEGAL, hasUnresolvedPlaceholders, policyVersion } from "./legal-constants";

describe("legal constants — the single source of truth for policy pages", () => {
  it("holds the fixed identity values from the brief", () => {
    expect(LEGAL.operatingName).toBe("VIBHA School of Psychology");
    expect(LEGAL.entityType).toBe("sole proprietorship");
    expect(LEGAL.contactEmail).toBe("drsarthakpsychology@gmail.com");
    expect(LEGAL.phone).toBe("+91 78770 49920");
    expect(LEGAL.grievanceOfficer).toBe("Kavya Bothra, Program Manager & Head");
    expect(LEGAL.gstin).toBeNull();
    expect(LEGAL.courseDuration).toBe("three months");
    expect(LEGAL.liveAttendanceRequirement).toBe("50%");
  });

  it("keeps the outstanding values as literal TODO tokens (never invented)", () => {
    expect(LEGAL.registeredAddress).toBe("[REGISTERED_ADDRESS]");
    expect(LEGAL.effectiveDate).toBe("[EFFECTIVE_DATE]");
    expect(hasUnresolvedPlaceholders()).toBe(true);
  });

  it("reports a draft policy version while the effective date is unresolved", () => {
    expect(policyVersion()).toBe("draft");
  });
});
