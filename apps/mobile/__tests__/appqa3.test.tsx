/** Round 3 of the app bug hunt: real-shaped server data and release-only behaviour. */
import * as React from "react";
import { todoHref } from "@/admin/safe";
import { refEntryView } from "@/api/adapt-learn";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";

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
    fireEvent.press(screen.getByTestId("notifications-more"));
    fireEvent.press(screen.getByTestId("notifications-more"));
    await waitFor(() => expect(screen.getByTestId("notification-n1")).toBeTruthy());
    expect(screen.queryByTestId("notifications-more")).toBeNull();
    expect(get.mock.calls.filter((c) => (c[1] as { query?: { cursor?: string } })?.query?.cursor === "p2")).toHaveLength(1);
    get.mockRestore();
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
