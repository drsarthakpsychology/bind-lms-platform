import { describe, expect, it } from "vitest";
import {
  checkRemoval,
  confirmWord,
  DELETED_MARK,
  isRemovedAccount,
  nameMatches,
  REFUSE,
  removalNote,
  removalOf,
  removedReason,
  REMOVE_WORDS,
  REMOVED_MARK,
  tombstoneEmail,
  type Target,
} from "./removal-rules";

const SUPER = { id: "me", role: "admin" };
const VIEW = { id: "v", role: "view_admin" };
const student = (over: Partial<Target> = {}): Target => ({ id: "s1", role: "student", status: "active", block_reason: null, name: "Asha Rao", email: "asha@x.org", ...over });

describe("removalOf", () => {
  it("is null for an active or a plainly locked account", () => {
    expect(removalOf(student())).toBeNull();
    expect(removalOf(student({ status: "blocked", block_reason: "fee not paid" }))).toBeNull();
    expect(removalOf(null)).toBeNull();
  });
  it("reads the mark in block_reason (before the SQL runs)", () => {
    expect(removalOf(student({ status: "blocked", block_reason: "[removed] left the course" }))).toBe("removed");
    expect(removalOf(student({ status: "blocked", block_reason: DELETED_MARK }))).toBe("deleted");
  });
  it("reads the new columns (after the SQL runs)", () => {
    expect(removalOf(student({ status: "blocked", removed_at: "2026-11-22T00:00:00Z" }))).toBe("removed");
    expect(removalOf(student({ status: "blocked", deleted_at: "2026-11-22T00:00:00Z" }))).toBe("deleted");
  });
  it("a removed mark on an account that was unlocked by hand no longer counts as removed", () => {
    expect(removalOf(student({ status: "active", block_reason: "[removed]" }))).toBeNull();
  });
  it("deleted stays deleted whatever the status says", () => {
    expect(removalOf(student({ status: "active", block_reason: "[deleted]" }))).toBe("deleted");
  });
  it("isRemovedAccount hides both kinds from students' lists", () => {
    expect(isRemovedAccount(student({ status: "blocked", block_reason: "[removed]" }))).toBe(true);
    expect(isRemovedAccount(student({ status: "blocked", block_reason: "[deleted]" }))).toBe(true);
    expect(isRemovedAccount(student({ status: "blocked", block_reason: "pause" }))).toBe(false);
  });
});

describe("notes", () => {
  it("writes the mark with the admin's note, trimmed and capped", () => {
    expect(removedReason("  left   the course ")).toBe(`${REMOVED_MARK} left the course`);
    expect(removedReason()).toBe(REMOVED_MARK);
    expect(removedReason("x".repeat(500)).length).toBe(REMOVED_MARK.length + 1 + 200);
  });
  it("reads the note back without the mark", () => {
    expect(removalNote("[removed] left")).toBe("left");
    expect(removalNote("[removed]")).toBeNull();
    expect(removalNote(null)).toBeNull();
  });
});

describe("typed name", () => {
  it("uses the name, or the email when no name is set", () => {
    expect(confirmWord({ name: "Asha Rao", email: "a@x.org" })).toBe("Asha Rao");
    expect(confirmWord({ name: "  ", email: "a@x.org" })).toBe("a@x.org");
  });
  it("matches ignoring capitals and spaces, never an empty word", () => {
    expect(nameMatches("  asha   RAO ", { name: "Asha Rao" })).toBe(true);
    expect(nameMatches("Asha", { name: "Asha Rao" })).toBe(false);
    expect(nameMatches("", { name: "", email: "" })).toBe(false);
    expect(nameMatches(null, { name: "Asha Rao" })).toBe(false);
  });
});

describe("checkRemoval", () => {
  it("only a Super Admin may act", () => {
    expect(checkRemoval("remove", VIEW, student(), 1)).toBe(REFUSE.notAllowed);
    expect(checkRemoval("remove", null, student(), 1)).toBe(REFUSE.notAllowed);
    expect(checkRemoval("delete", { id: "s9", role: "student" }, student(), 1, "Asha Rao")).toBe(REFUSE.notAllowed);
  });
  it("needs a target", () => {
    expect(checkRemoval("remove", SUPER, null, 1)).toBe(REFUSE.notFound);
  });
  it("removes a student", () => {
    expect(checkRemoval("remove", SUPER, student(), 1)).toBeNull();
  });
  it("removes a locked student (a lock is not a removal)", () => {
    expect(checkRemoval("remove", SUPER, student({ status: "blocked", block_reason: "fee" }), 1)).toBeNull();
  });
  it("removes staff: a View Admin", () => {
    expect(checkRemoval("remove", SUPER, student({ role: "view_admin" }), 1)).toBeNull();
    expect(checkRemoval("delete", SUPER, student({ role: "view_admin" }), 1, "Asha Rao")).toBeNull();
  });
  it("never yourself, for remove or delete", () => {
    const me = student({ id: "me", role: "admin" });
    expect(checkRemoval("remove", SUPER, me, 2)).toBe(REFUSE.self);
    expect(checkRemoval("delete", SUPER, me, 2, "Asha Rao")).toBe(REFUSE.self);
  });
  it("never the last Super Admin", () => {
    expect(checkRemoval("remove", SUPER, student({ role: "admin" }), 1)).toBe(REFUSE.lastSuper);
    expect(checkRemoval("delete", SUPER, student({ role: "admin" }), 1, "Asha Rao")).toBe(REFUSE.lastSuper);
  });
  it("never another Super Admin either (the database refuses it): change them first", () => {
    expect(checkRemoval("remove", SUPER, student({ role: "admin" }), 2)).toBe(REFUSE.superAdmin);
    expect(checkRemoval("delete", SUPER, student({ role: "admin" }), 3, "Asha Rao")).toBe(REFUSE.superAdmin);
  });
  it("does not remove twice", () => {
    expect(checkRemoval("remove", SUPER, student({ status: "blocked", block_reason: "[removed]" }), 1)).toBe(REFUSE.alreadyRemoved);
  });
  it("can delete a removed person", () => {
    expect(checkRemoval("delete", SUPER, student({ status: "blocked", block_reason: "[removed]" }), 1, "asha rao")).toBeNull();
  });
  it("delete needs the typed name", () => {
    expect(checkRemoval("delete", SUPER, student(), 1, "Asha")).toBe(REFUSE.nameMismatch);
    expect(checkRemoval("delete", SUPER, student(), 1)).toBe(REFUSE.nameMismatch);
    expect(checkRemoval("delete", SUPER, student(), 1, "Asha Rao")).toBeNull();
  });
  it("a deleted account cannot be removed, deleted or restored", () => {
    const gone = student({ status: "blocked", block_reason: "[deleted]" });
    expect(checkRemoval("remove", SUPER, gone, 1)).toBe(REFUSE.alreadyDeleted);
    expect(checkRemoval("delete", SUPER, gone, 1, "Asha Rao")).toBe(REFUSE.alreadyDeleted);
    expect(checkRemoval("restore", SUPER, gone, 1)).toBe(REFUSE.deletedForGood);
  });
  it("restores only a removed person", () => {
    expect(checkRemoval("restore", SUPER, student({ status: "blocked", block_reason: "[removed]" }), 1)).toBeNull();
    expect(checkRemoval("restore", SUPER, student(), 1)).toBe(REFUSE.notRemoved);
    expect(checkRemoval("restore", SUPER, student({ status: "blocked", block_reason: "fee" }), 1)).toBe(REFUSE.notRemoved);
    expect(checkRemoval("restore", VIEW, student({ status: "blocked", block_reason: "[removed]" }), 1)).toBe(REFUSE.notAllowed);
  });
});

describe("tombstone and words", () => {
  it("the deleted sign-in address is unique, not real and not a hidden test address", () => {
    expect(tombstoneEmail("ABC-123")).toBe("deleted-abc-123@removed.vibhapsychology.com");
    // Not a robot address: certificates of deleted accounts must still check as real.
    expect(/(test|internal|local|invalid|example)$/.test(tombstoneEmail("x"))).toBe(false);
  });
  it("the sheet says what is kept, plainly, with no dashes", () => {
    const all = JSON.stringify(REMOVE_WORDS);
    expect(all).not.toMatch(/[–—]/);
    expect(REMOVE_WORDS.delete.keeps.join(" ")).toMatch(/Certificates/);
    expect(REMOVE_WORDS.remove.keeps.join(" ")).toMatch(/certificates/);
  });
});
