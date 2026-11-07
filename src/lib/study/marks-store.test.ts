// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./marks-actions", () => ({ pullMarks: vi.fn(), pushMarks: vi.fn() }));

import { emptyMarks, setBookmark, setNote, storageKey, type Marks } from "./marks";
import { __marksSyncForTests as S } from "./marks-store";

const OWNER = "student-1";
const A = "depression/1-2";
const B = "ocd/2-1";

type Push = (m: Marks) => Promise<{ ok: boolean; off?: boolean }>;
const okPush = () => vi.fn<Push>(async () => ({ ok: true }));

function stored(): Marks {
  return JSON.parse(window.localStorage.getItem(storageKey(OWNER)) ?? "null");
}

describe("study marks: browser and server stay in step", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
    S.reset();
  });
  afterEach(() => {
    S.reset();
    vi.useRealTimers();
  });

  it("merges the server copy into the browser copy and sends up what only the browser has", async () => {
    window.localStorage.setItem(
      storageKey(OWNER),
      JSON.stringify(setNote(emptyMarks(), A, "made offline", 50)),
    );
    const push = okPush();
    S.use({
      pull: async () => ({ ok: true, marks: setBookmark(emptyMarks(), B, true, 70) }),
      push,
    });

    await S.startSync(OWNER);
    expect(S.read(OWNER).bookmarks[B].on).toBe(true);
    expect(S.read(OWNER).notes[A].text).toBe("made offline");
    expect(stored().bookmarks[B].on).toBe(true);

    await vi.runAllTimersAsync();
    expect(push).toHaveBeenCalledTimes(1);
    expect(push.mock.calls[0][0]).toEqual({
      v: 1,
      bookmarks: {},
      notes: { [A]: { text: "made offline", at: 50 } },
    });
  });

  it("pulls once per page load", async () => {
    const pull = vi.fn(async () => ({ ok: true as const, marks: emptyMarks() }));
    S.use({ pull, push: okPush() });
    await S.startSync(OWNER);
    await S.startSync(OWNER);
    expect(pull).toHaveBeenCalledTimes(1);
  });

  it("sends a change a moment after it is made, in one batch", async () => {
    const push = okPush();
    S.use({ pull: async () => ({ ok: true, marks: emptyMarks() }), push });
    await S.startSync(OWNER);
    S.update(OWNER, (m) => setBookmark(m, A, true, 100));
    S.update(OWNER, (m) => setNote(m, A, "two edits", 101));
    expect(push).not.toHaveBeenCalled();
    await vi.runAllTimersAsync();
    expect(push).toHaveBeenCalledTimes(1);
    const sent = push.mock.calls[0][0];
    expect(sent.bookmarks[A].on).toBe(true);
    expect(sent.notes[A].text).toBe("two edits");
  });

  it("keeps a failed send and retries it with the next change", async () => {
    const push = vi.fn<Push>().mockResolvedValueOnce({ ok: false }).mockResolvedValue({ ok: true });
    S.use({ pull: async () => ({ ok: true, marks: emptyMarks() }), push });
    await S.startSync(OWNER);
    S.update(OWNER, (m) => setNote(m, A, "first", 10));
    await vi.runAllTimersAsync();
    expect(S.pending(OWNER)?.notes[A].text).toBe("first");
    S.update(OWNER, (m) => setNote(m, B, "second", 20));
    await vi.runAllTimersAsync();
    const sent = push.mock.calls[1][0];
    expect(Object.keys(sent.notes).sort()).toEqual([A, B]);
    expect(S.pending(OWNER)).toBeNull();
  });

  it("does not lose a change made while a send is in flight", async () => {
    let release: (v: { ok: boolean }) => void = () => {};
    const push = vi.fn<Push>(() => new Promise((r) => (release = r)));
    S.use({ pull: async () => ({ ok: true, marks: emptyMarks() }), push });
    await S.startSync(OWNER);
    S.update(OWNER, (m) => setNote(m, A, "one", 10));
    await vi.advanceTimersByTimeAsync(1000);
    expect(push).toHaveBeenCalledTimes(1);
    S.update(OWNER, (m) => setNote(m, B, "during", 20));
    await vi.advanceTimersByTimeAsync(1000);
    release({ ok: true });
    await vi.runAllTimersAsync();
    release({ ok: true });
    await vi.runAllTimersAsync();
    expect(push).toHaveBeenCalledTimes(2);
    expect(push.mock.calls[1][0].notes[B].text).toBe("during");
  });

  it("goes quiet when the table does not exist yet, and the browser copy still works", async () => {
    const push = okPush();
    S.use({ pull: async () => ({ ok: false, off: true }), push });
    await S.startSync(OWNER);
    S.update(OWNER, (m) => setBookmark(m, A, true, 5));
    await vi.runAllTimersAsync();
    expect(push).not.toHaveBeenCalled();
    expect(stored().bookmarks[A].on).toBe(true);
  });

  it("tries the pull again later after a network failure", async () => {
    const pull = vi
      .fn(async () => ({ ok: false as const, off: false }))
      .mockResolvedValueOnce({ ok: false, off: false });
    S.use({ pull, push: okPush() });
    await S.startSync(OWNER);
    await S.startSync(OWNER);
    expect(pull).toHaveBeenCalledTimes(2);
  });

  it("never syncs without a signed-in owner", async () => {
    const pull = vi.fn(async () => ({ ok: true as const, marks: emptyMarks() }));
    S.use({ pull, push: okPush() });
    await S.startSync("");
    expect(pull).not.toHaveBeenCalled();
  });
});
