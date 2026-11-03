import { describe, expect, it } from "vitest";
import { checkDetails } from "./fields";

const good = { full_name: "Aanya Shah", phone: "+91 98765 43210", city: "Ahmedabad", state: "Gujarat", qualification: "Bachelor's degree", institution: "Gujarat University", occupation: "Student" };

describe("first-login details", () => {
  it("accepts a complete form and cleans the mobile number", () => {
    const r = checkDetails(good);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.phone).toBe("9876543210");
  });
  it("asks for a full name, a real mobile and every choice", () => {
    const r = checkDetails({ ...good, full_name: "Aanya", phone: "12345", state: "Gujrat", occupation: "" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["full_name", "occupation", "phone", "state"]);
  });
  it("needs a country and an international number when outside India", () => {
    const r = checkDetails({ ...good, state: "Outside India", country: "India", phone: "+44 7700 900123" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors)).toEqual(["country"]);
  });
});
