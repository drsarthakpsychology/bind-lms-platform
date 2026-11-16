import { screen } from "@testing-library/react-native";
import type { PersistedClient } from "@tanstack/react-query-persist-client";
import * as React from "react";

import { ApiFailure } from "@/api/errors";

const mockPost = jest.fn();
jest.mock("@/auth", () => ({
  api: { post: (...a: unknown[]) => mockPost(...a), put: (...a: unknown[]) => mockPost(...a), del: (...a: unknown[]) => mockPost(...a), get: async () => ({}), forgetHeld: () => undefined },
  session: { hasTokens: () => true, store: { get: () => ({ phase: "visitor", me: null }), subscribe: () => () => undefined } },
  onSignedOut: () => () => undefined,
  beforeSignOut: () => () => undefined,
}));

/* eslint-disable @typescript-eslint/no-require-imports */
const Q = require("@/api/queries") as typeof import("@/api/queries");
const W = require("@/api/queued") as typeof import("@/api/queued");
const O = require("@/api/online") as typeof import("@/api/online");
const P = require("@/api/prefetch") as typeof import("@/api/prefetch");
const { Loaded } = require("@/ds") as typeof import("@/ds");
const { render } = require("./utils") as typeof import("./utils");
/* eslint-enable @typescript-eslint/no-require-imports */

const flush = () => new Promise((r) => setTimeout(r, 0));

afterEach(() => {
  O.resetOnline();
  mockPost.mockReset();
  Q.queryClient.getMutationCache().clear();
});

describe("smart retry", () => {
  it("tries a lost connection again a few times, a timeout once, and never a real refusal", () => {
    const net = new ApiFailure("network", "x");
    const slow = new ApiFailure("network", "x", 0, { timeout: true });
    expect([0, 1, 2, 3].map((n) => Q.shouldRetry(n, net))).toEqual([true, true, true, false]);
    expect([0, 1].map((n) => Q.shouldRetry(n, slow))).toEqual([true, false]);
    expect(Q.shouldRetry(0, new ApiFailure("server_error", "x", 500))).toBe(true);
    expect(Q.shouldRetry(0, new ApiFailure("not_found", "x", 404))).toBe(false);
    expect(Q.shouldRetry(0, new ApiFailure("scope", "x", 403))).toBe(false);
  });

  it("waits longer each time, with a little spread, up to 30 seconds", () => {
    expect(Q.retryDelay(0)).toBeGreaterThanOrEqual(750);
    expect(Q.retryDelay(0)).toBeLessThanOrEqual(1250);
    expect(Q.retryDelay(3)).toBeGreaterThanOrEqual(6000);
    expect(Q.retryDelay(20)).toBeLessThanOrEqual(37_500);
  });
});

describe("the copy kept on the phone", () => {
  const q = (key: unknown[], at: number, size: number) => ({ queryKey: key, queryHash: JSON.stringify(key), state: { data: "x".repeat(size), dataUpdatedAt: at, status: "success" } });
  const client = (queries: ReturnType<typeof q>[]) => ({ timestamp: 1, buster: "b", clientState: { mutations: [], queries } }) as unknown as PersistedClient;

  it("fits under the size Android can read back: tab screens first, then the newest", () => {
    const c = client([q(["section", "m1", "s1"], 1, 400), q(["home"], 0, 400), q(["section", "m1", "s2"], 3, 400), q(["section", "m1", "s3"], 2, 400)]);
    const fit = Q.fitCache(c, 1500);
    expect(JSON.stringify(fit).length).toBeLessThanOrEqual(1500);
    const kept = fit.clientState.queries.map((x) => x.queryKey.join("/"));
    expect(kept).toContain("home");
    expect(kept).toContain("section/m1/s2");
    expect(kept).not.toContain("section/m1/s1");
  });

  it("leaves a copy that fits untouched", () => {
    const c = client([q(["home"], 0, 10)]);
    expect(Q.fitCache(c, 10_000)).toBe(c);
  });

  it("keeps queued writes that wait for the internet, and nothing else of the sends", () => {
    const keep = Q.persistOptions.dehydrateOptions.shouldDehydrateMutation;
    expect(keep({ options: { mutationKey: ["write"] }, state: { isPaused: true } })).toBe(true);
    expect(keep({ options: { mutationKey: ["write"] }, state: { isPaused: false } })).toBe(false);
    expect(keep({ options: {}, state: { isPaused: true } })).toBe(false);
  });

  it("lets go of the oldest unwatched answers when memory holds too many", () => {
    const cache = Q.queryClient.getQueryCache();
    for (let i = 0; i < 12; i++) Q.queryClient.setQueryData(["cap", i], i, { updatedAt: i + 1 });
    Q.capCache(cache, cache.getAll().length - 2);
    expect(Q.queryClient.getQueryData(["cap", 0])).toBeUndefined();
    expect(Q.queryClient.getQueryData(["cap", 11])).toBe(11);
    for (let i = 0; i < 12; i++) Q.queryClient.removeQueries({ queryKey: ["cap", i] });
  });
});

describe("queued writes", () => {
  it("go out at once when online", async () => {
    mockPost.mockResolvedValue({ ok: 1 });
    await expect(W.queueWrite({ method: "POST", path: "/practise/records/blitz", body: { a: 1 } })).resolves.toEqual({ ok: 1 });
    expect(mockPost).toHaveBeenCalledWith("/practise/records/blitz", { a: 1 });
  });

  it("wait while offline and are sent by themselves when the internet is back", async () => {
    const off = Q.queryClient.mount === undefined ? () => undefined : (Q.queryClient.mount(), () => Q.queryClient.unmount());
    try {
      O.markOffline();
      mockPost.mockResolvedValue({ done: true });
      const sent = W.queueWrite({ method: "POST", path: "/wall/reactions", body: { postId: "p1", reaction: "heart" }, scope: "wall-react" });
      await flush();
      expect(mockPost).not.toHaveBeenCalled();
      expect(W.waitingWrites()).toBe(1);
      O.markOnline();
      await expect(sent).resolves.toEqual({ done: true });
      expect(mockPost).toHaveBeenCalledWith("/wall/reactions", { postId: "p1", reaction: "heart" });
    } finally {
      off();
    }
  });

  it("are refused only by a real answer (the screen can undo)", async () => {
    mockPost.mockRejectedValue(new ApiFailure("bad_request", "no", 400));
    await expect(W.queueWrite({ method: "POST", path: "/x" })).rejects.toMatchObject({ code: "bad_request" });
    expect(mockPost).toHaveBeenCalledTimes(1);
  });
});

describe("loading ahead", () => {
  it("finds the next lecture, the next section, the next note and the first doubts on screen", () => {
    expect(P.nextReads(["course", "c1"], { weeks: [{ lessons: [{ id: "l1", state: "done", openable: true }, { id: "l2", state: "next", openable: true }] }] })).toEqual(["/lecture/l2"]);
    expect(P.nextReads(["lecture", "l2"], { next: { id: "l3", title: "x" } })).toEqual(["/lecture/l3"]);
    expect(P.nextReads(["section", "m02", "s1"], { next: { sectionId: "s2", title: "x" } })).toEqual(["/study/m02/s2"]);
    expect(P.nextReads(["notes"], { notes: [{ id: "n1", readOn: "2026-01-01" }, { id: "n2", readOn: null }] })).toEqual(["/notes/n2"]);
    expect(P.nextReads(["doubts", "all"], { items: [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }] })).toEqual(["/doubt/a", "/doubt/b", "/doubt/c"]);
    // Opening a notification marks it read, so the list never loads them ahead.
    expect(P.nextReads(["notifications"], { items: [{ id: "a" }] })).toEqual([]);
  });

  it("guesses only on a good connection", async () => {
    expect(P.canGuess()).toBe(true);
    O.markOffline();
    expect(P.canGuess()).toBe(false);
    O.markOnline();
    O.configureOnline({ probe: async () => ({}), onBack: () => undefined });
    O.noteUnreached(true);
    await flush();
    expect(P.canGuess()).toBe(false);
  });
});

describe("offline with nothing saved", () => {
  it("shows one calm line, not an error, while the read waits for the internet", async () => {
    const q = { data: undefined, isError: false, error: null, fetchStatus: "paused", refetch: jest.fn(), failureCount: 0 } as never;
    await render(<Loaded q={q}>{() => null}</Loaded>);
    expect(await screen.findByText("This opens when you are back online")).toBeTruthy();
    expect(screen.queryByTestId("load-error")).toBeNull();
  });

  it("shows the saved copy (no error) when a refresh failed", async () => {
    const T = require("@/ds").T as typeof import("@/ds").T; // eslint-disable-line @typescript-eslint/no-require-imports
    const q = { data: "saved", isError: true, error: new ApiFailure("network", "x"), fetchStatus: "idle", refetch: jest.fn(), failureCount: 2 } as never;
    await render(<Loaded q={q}>{(d: string) => <T>{d}</T>}</Loaded>);
    expect(await screen.findByText("saved")).toBeTruthy();
    expect(screen.queryByTestId("load-error")).toBeNull();
  });
});
