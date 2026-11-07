import { describe, expect, it } from "vitest";
import {
  FUTURE_SLACK_MS,
  emptyMarks,
  marksToRows,
  mergeMarks,
  newerThan,
  rowsToMarks,
  rowsToWrite,
  setBookmark,
  setNote,
  type Marks,
} from "./marks";

const A = "depression/1-2";
const B = "ocd/2-1";
const NOW = 1_800_000_000_000;

function marks(fn: (m: Marks) => Marks): Marks {
  return fn(emptyMarks());
}

describe("study marks: server rows", () => {
  it("round-trips marks through rows, keeping removals", () => {
    const m = marks((x) =>
      setNote(setBookmark(setBookmark(x, A, true, 10), B, false, 20), A, "remember SIGECAPS", 30),
    );
    const rows = marksToRows(m);
    expect(rows).toEqual([
      { key: A, bookmark_on: true, bookmark_at: 10, note: "remember SIGECAPS", note_at: 30 },
      { key: B, bookmark_on: false, bookmark_at: 20, note: null, note_at: null },
    ]);
    expect(rowsToMarks(rows)).toEqual(m);
  });

  it("reads bigint times sent as strings and drops junk rows", () => {
    const m = rowsToMarks([
      { key: A, bookmark_on: true, bookmark_at: "1700000000000", note: null, note_at: null },
      { key: "nokey", bookmark_on: true, bookmark_at: 1 },
      { key: B, bookmark_on: "yes", bookmark_at: 5, note: "x", note_at: -1 },
      null,
    ]);
    expect(m.bookmarks[A]).toEqual({ on: true, at: 1_700_000_000_000 });
    expect(Object.keys(m.bookmarks)).toEqual([A]);
    expect(m.notes).toEqual({});
  });

  it("finds what one side has that the other lacks or has older", () => {
    const local = marks((x) => setNote(setBookmark(x, A, true, 50), B, "new", 60));
    const server = marks((x) => setNote(setBookmark(x, A, true, 90), B, "old", 10));
    const up = newerThan(local, server);
    expect(up.bookmarks).toEqual({});
    expect(up.notes[B].text).toBe("new");
    expect(newerThan(server, local).bookmarks[A].at).toBe(90);
  });

  it("merging both ways loses nothing: newest change per field wins", () => {
    const phone = marks((x) => setNote(setBookmark(x, A, false, 100), B, "phone note", 40));
    const laptop = marks((x) => setNote(setBookmark(x, A, true, 70), A, "laptop note", 80));
    const one = mergeMarks(phone, laptop);
    const two = mergeMarks(laptop, phone);
    expect(one).toEqual(two);
    expect(one.bookmarks[A].on).toBe(false);
    expect(one.notes[A].text).toBe("laptop note");
    expect(one.notes[B].text).toBe("phone note");
  });
});

describe("study marks: what the server writes", () => {
  it("writes only rows that change, keeping the stored half of a row", () => {
    const stored = marks((x) => setNote(setBookmark(x, A, true, 100), B, "kept", 100));
    const incoming = marks((x) => setNote(setBookmark(x, A, true, 50), A, "fresh", 200));
    const rows = rowsToWrite(stored, incoming, NOW);
    expect(rows).toEqual([
      { key: A, bookmark_on: true, bookmark_at: 100, note: "fresh", note_at: 200 },
    ]);
  });

  it("an older device never overwrites a newer note", () => {
    const stored = marks((x) => setNote(x, A, "newer", 500));
    expect(
      rowsToWrite(
        stored,
        marks((x) => setNote(x, A, "older", 100)),
        NOW,
      ),
    ).toEqual([]);
  });

  it("cleans junk and clamps times from a clock that runs ahead", () => {
    const rows = rowsToWrite(
      emptyMarks(),
      {
        bookmarks: { [A]: { on: true, at: NOW * 2 }, bad: { on: true, at: 1 } },
        notes: { [B]: { text: "x".repeat(9000), at: 3 } },
      },
      NOW,
    );
    expect(rows.find((r) => r.key === A)?.bookmark_at).toBe(NOW + FUTURE_SLACK_MS);
    expect(rows.find((r) => r.key === B)?.note?.length).toBe(4000);
    expect(rows.some((r) => r.key === "bad")).toBe(false);
    // A second save of the same clamped change writes nothing.
    expect(
      rowsToWrite(
        rowsToMarks(rows),
        { bookmarks: { [A]: { on: true, at: NOW * 2 } }, notes: {} },
        NOW,
      ),
    ).toEqual([]);
  });

  it("ignores anything that is not marks", () => {
    for (const junk of [null, 5, "x", [], { bookmarks: 3 }])
      expect(rowsToWrite(emptyMarks(), junk, NOW)).toEqual([]);
  });
});
