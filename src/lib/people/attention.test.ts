import { describe, expect, it } from "vitest";
import { attentionFlags, isBehind, type AttentionInput } from "./attention";

const base: AttentionInput = {
  account: "active", needsAction: false, mobile: "9876543210", presence: "today",
  lecturesDone: 5, lecturesAvailable: 6, emailFailing: false, detailsDone: true,
};

describe("attention flags", () => {
  it("a healthy student has none", () => expect(attentionFlags(base)).toEqual([]));
  it("behind = under half of available", () => {
    expect(isBehind(2, 6)).toBe(true);
    expect(isBehind(3, 6)).toBe(false);
    expect(isBehind(0, 1)).toBe(false);
  });
  it("quiet, behind, no mobile, no details", () => {
    expect(attentionFlags({ ...base, presence: "quiet", lecturesDone: 0, mobile: null, detailsDone: false })).toEqual(["quiet", "behind", "no-details", "no-mobile"]);
  });
  it("login problems and failing email come first", () => {
    expect(attentionFlags({ ...base, account: "link-expired", needsAction: true, presence: "never", emailFailing: true })).toEqual(["login", "email-failing"]);
  });
  it("locked accounts aren't nagged about learning", () => {
    expect(attentionFlags({ ...base, account: "locked", presence: "quiet", lecturesDone: 0 })).toEqual([]);
  });
});
