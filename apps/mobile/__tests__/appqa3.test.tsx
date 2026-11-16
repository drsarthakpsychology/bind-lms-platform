/** Round 3 of the app bug hunt: real-shaped server data and release-only behaviour. */
import * as React from "react";
import { todoHref } from "@/admin/safe";
import { refEntryView } from "@/api/adapt-learn";
import { act, fireEvent, renderHook, screen, waitFor } from "@testing-library/react-native";

import { api } from "@/auth";
import { decodeSafe, queryOf } from "@/lib/query";
import { NotificationsScreen } from "@/screens/notifications/list";
import { render } from "./utils";

describe("addresses from the server never throw", () => {
  it("queryOf keeps '=' inside a value, takes a name without a value, and survives a stray %", () => {
    expect(queryOf("?a=1&b=x=y&c&d=50%&e=two+words&a=2")).toEqual({ a: "1", b: "x=y", c: "", d: "50%", e: "two words" });
    expect(queryOf(null)).toEqual({});
    expect(decodeSafe("%E0%A4")).toBe("%E0%A4");
    expect(decodeSafe("a%20b+c")).toBe("a b+c");
  });
  it("an admin Home to-do with a broken address still opens (React Native's URLSearchParams threw)", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const RN = require("react-native/Libraries/Blob/URLSearchParams").URLSearchParams;
    expect(() => new RN("view=50%").get("view")).toThrow();
    expect(todoHref("/admin/people?view=50%")).toEqual({ app: "/admin/people?view=50%25" });
    expect(todoHref("/admin/activity?view=behind")).toEqual({ app: "/admin/activity?view=behind" });
    expect(todoHref("/admin/emails?folder=inbox")).toEqual({ app: "/admin/messages" });
    expect(todoHref("/admin/new-thing")).toEqual({ web: "/admin/new-thing" });
  });
  it("a medicine entry whose link has a stray % still opens (decodeURIComponent threw inside the adapter)", () => {
    const e = refEntryView({ entry: { kind: "medicine", slug: "lithium", label: "Lithium", data: { fullHref: "/practice/medicines/li%thium?x=1" } } });
    expect(e && e.kind === "medicine" ? e.medId : null).toBe("li%thium");
  });
});

describe("paged lists reach their older rows", () => {
  const row = (i: number) => ({ id: `n${i}`, type: "message", title: `Note ${i}`, body: "", createdAt: "2026-11-01T10:00:00.000000+00:00", readAt: "2026-11-01T10:00:00Z", target: { screen: "notifications", web: "/notifications" } });
  it("notifications: Show older loads the next page once, then goes away", async () => {
    const get = jest.spyOn(api, "get").mockImplementation((async (_path: string, opts?: { query?: Record<string, unknown> }) =>
      opts?.query?.cursor === "p2" ? { items: [row(2), row(1)], nextCursor: null, unread: 0 } : { items: [row(4), row(3)], nextCursor: "p2", unread: 0 }) as never);
    await render(<NotificationsScreen />);
    await waitFor(() => expect(screen.getByTestId("notification-n4")).toBeTruthy());
    expect(screen.queryByTestId("notification-n1")).toBeNull();
    await fireEvent.press(screen.getByTestId("notifications-more"));
    await waitFor(() => expect(screen.getByTestId("notification-n1")).toBeTruthy());
    expect(screen.queryByTestId("notifications-more")).toBeNull();
    expect(get.mock.calls.filter((c) => (c[1] as { query?: { cursor?: string } })?.query?.cursor === "p2")).toHaveLength(1);
    get.mockRestore();
  });
});

describe("Show older on a double tap", () => {
  it("asks for the next page once", async () => {
    const { useMorePages } = jest.requireActual<typeof import("@/ds/more")>("@/ds/more");
    const fetchPage = jest.fn(async () => ({ items: [{ id: "b" }], nextCursor: null }));
    const first = { items: [{ id: "a" }], nextCursor: "p2" };
    const { result } = await renderHook(() => useMorePages(first, fetchPage));
    await act(async () => {
      await Promise.all([result.current.loadMore(), result.current.loadMore()]);
    });
    expect(fetchPage).toHaveBeenCalledTimes(1);
    expect(result.current.items.map((x) => x.id)).toEqual(["a", "b"]);
    expect(result.current.more).toBe(false);
  });
});

describe("admin lists read every page", () => {
  it("students past the server's page size are not lost, and a looping cursor stops", async () => {
    const { getAll } = jest.requireActual<typeof import("@/admin/api")>("@/admin/api");
    const get = jest.spyOn(api, "get").mockImplementation((async (_p: string, opts?: { query?: Record<string, unknown> }) => {
      const c = opts?.query?.cursor;
      if (!c) return { items: [{ id: "a" }], nextCursor: "1", total: 3 };
      if (c === "1") return { items: [{ id: "b" }], nextCursor: "2" };
      return { items: [{ id: "c" }], nextCursor: "2" };
    }) as never);
    const all = (await getAll("/admin/students", { limit: 200 })) as { items: { id: string }[]; total: number; nextCursor: null };
    expect(all.items.map((x) => x.id)).toEqual(["a", "b", "c"]);
    expect(all.total).toBe(3);
    expect(all.nextCursor).toBeNull();
    expect(get).toHaveBeenCalledTimes(3);
    get.mockRestore();
  });
});

describe("lecture player", () => {
  it("a lecture watched to the end opens at the top; part way it opens where it stopped", () => {
    const { resumeFrom, atEnd } = jest.requireActual<typeof import("@/lecture/player")>("@/lecture/player");
    expect(resumeFrom(3590, 3600)).toBe(0);
    expect(resumeFrom(1200, 3600)).toBe(1200);
    expect(resumeFrom(1200, null)).toBe(1200);
    expect(resumeFrom(3, 3600)).toBe(0);
    expect(resumeFrom(Number.NaN, 3600)).toBe(0);
    expect(atEnd(3600, 3600)).toBe(true);
    expect(atEnd(100, 3600)).toBe(false);
    expect(atEnd(0, 0)).toBe(false);
  });
});

describe("links to other apps", () => {
  it("says so when no app on the phone opens the link (the tap did nothing)", async () => {
    const { Linking } = jest.requireActual<typeof import("react-native")>("react-native");
    const { toast } = jest.requireActual<typeof import("@/ds/toast")>("@/ds/toast");
    const { openLink } = jest.requireActual<typeof import("@/lib/open")>("@/lib/open");
    const open = jest.spyOn(Linking, "openURL").mockRejectedValue(new Error("No Activity found to handle Intent"));
    const show = jest.spyOn(toast, "show").mockImplementation(() => undefined);
    await expect(openLink("mailto:a@b.c")).resolves.toBe(false);
    expect(show).toHaveBeenCalledWith("No email app on this phone opens this.");
    open.mockResolvedValue(undefined);
    await expect(openLink("https://wa.me/919999999999")).resolves.toBe(true);
    open.mockRestore();
    show.mockRestore();
  });
});

describe("assignments reach their older rows", () => {
  const row = (i: number) => ({ id: `a${i}`, lessonId: `l${i}`, courseId: "c1", title: `Task ${i}`, lessonTitle: `Lecture ${i}`, week: 1, dueAt: null, status: "not_started", score: null });
  it("Show older loads the next page into the same list, then goes away", async () => {
    const { AssignmentsScreen } = jest.requireActual<typeof import("@/screens/learn/assignments")>("@/screens/learn/assignments");
    const get = jest.spyOn(api, "get").mockImplementation((async (_path: string, opts?: { query?: Record<string, unknown> }) =>
      opts?.query?.cursor === "p2" ? { items: [row(1)], nextCursor: null } : { items: [row(3), row(2)], nextCursor: "p2" }) as never);
    await render(<AssignmentsScreen />);
    await waitFor(() => expect(screen.getByTestId("assignment-a3")).toBeTruthy());
    expect(screen.queryByTestId("assignment-a1")).toBeNull();
    await fireEvent.press(screen.getByTestId("assignments-more"));
    await waitFor(() => expect(screen.getByTestId("assignment-a1")).toBeTruthy());
    expect(screen.queryByTestId("assignments-more")).toBeNull();
    expect(get.mock.calls.filter((c) => (c[1] as { query?: { cursor?: string } })?.query?.cursor === "p2")).toHaveLength(1);
    get.mockRestore();
  });
});
