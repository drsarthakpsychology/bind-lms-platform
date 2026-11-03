import { describe, expect, it } from "vitest";
import { isOwnSubmissionPath } from "./submission-paths";

const a = "11111111-1111-1111-1111-111111111111";
const me = "22222222-2222-2222-2222-222222222222";
const other = "33333333-3333-3333-3333-333333333333";

describe("isOwnSubmissionPath", () => {
  it("accepts the path prepareSubmissionUpload builds", () => {
    expect(isOwnSubmissionPath(`${a}/${me}/1730000000000-essay.pdf`, a, me)).toBe(true);
  });
  it("rejects another student's path, another assignment, traversal and junk", () => {
    expect(isOwnSubmissionPath(`${a}/${other}/1-x.pdf`, a, me)).toBe(false);
    expect(isOwnSubmissionPath(`${other}/${me}/1-x.pdf`, a, me)).toBe(false);
    expect(isOwnSubmissionPath(`${a}/${me}/../${other}/1-x.pdf`, a, me)).toBe(false);
    expect(isOwnSubmissionPath(`${a}/${me}/sub/1-x.pdf`, a, me)).toBe(false);
    expect(isOwnSubmissionPath(`${a}/${me}/`, a, me)).toBe(false);
    expect(isOwnSubmissionPath(`${a}/${me}/a\\b`, a, me)).toBe(false);
    expect(isOwnSubmissionPath(`${a}/${me}/a\u0000b`, a, me)).toBe(false);
    expect(isOwnSubmissionPath(42, a, me)).toBe(false);
    expect(isOwnSubmissionPath(`${a}/${me}/x`, a, "")).toBe(false);
  });
});
