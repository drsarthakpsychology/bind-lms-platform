import { describe, expect, it } from "vitest";
import { splitForMiddle } from "./middle-truncate";

describe("splitForMiddle", () => {
  it("keeps the whole @domain of an email", () => {
    expect(splitForMiddle("priya.sharma.clinical@gmail.com")).toEqual(["priya.sharma.clinical", "@gmail.com"]);
  });
  it("leaves short text whole", () => {
    expect(splitForMiddle("Signed in")).toEqual(["Signed in", ""]);
  });
  it("keeps the last 8 characters of long text", () => {
    expect(splitForMiddle("Anandamayee Raghunathan-Iyer")).toEqual(["Anandamayee Raghunat", "han-Iyer"]);
  });
  it("does not split on a leading or trailing @", () => {
    expect(splitForMiddle("@handle")).toEqual(["@handle", ""]);
  });
});
