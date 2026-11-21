import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";

import { adminMatch } from "@/admin/screens/search";
import { mock } from "@/api/mock/server";
import { markOffline, markOnline } from "@/api/online";
import { session } from "@/auth";
import { searchDocs } from "@/lib/search-engine";
import { mergeHits, SearchScreen } from "@/screens/search/search";
import type { SearchAnswer } from "@/screens/search/contract";
import { render } from "./utils";

beforeAll(async () => {
  await session.boot();
  await session.signIn("ananya@example.com", "pw");
  await session.choosePin("2580");
});
beforeEach(() => {
  mock.reset();
  markOnline();
  (router.push as jest.Mock).mockClear();
});
afterEach(() => (useLocalSearchParams as jest.Mock).mockReturnValue({}));

describe("search everything (app)", () => {
  it("finds a lecture spelt wrong, from what is on the phone", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ q: "depresion clinic" });
    await render(<SearchScreen />);
    const hit = await screen.findByTestId("hit-l-l5");
    await fireEvent.press(hit);
    expect(router.push).toHaveBeenLastCalledWith("/lecture/l5");
  });

  it("finds course files", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ q: "phq scoring" });
    await render(<SearchScreen />);
    expect(await screen.findByTestId("hit-f-m1")).toBeTruthy();
    expect(screen.getByText("Course files")).toBeTruthy();
  });

  it("adds the server's results once typing stops, and asks it once", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ q: "anhedona" });
    await render(<SearchScreen />);
    const row = await screen.findByText("Anhedonia", {}, { timeout: 2000 });
    await fireEvent.press(row);
    expect(router.push).toHaveBeenLastCalledWith("/reference/anhedonia");
    expect(mock.log().filter((l) => l.path.startsWith("/search")).length).toBe(1);
  });

  it("offline: says nothing on the phone matches, and does not ask the server", async () => {
    markOffline();
    (useLocalSearchParams as jest.Mock).mockReturnValue({ q: "zzqxv" });
    await render(<SearchScreen />);
    await waitFor(() => expect(screen.getByTestId("search-empty")).toBeTruthy());
    expect(screen.getByText(/Search again when you are back online/)).toBeTruthy();
    expect(mock.log().some((l) => l.path.startsWith("/search"))).toBe(false);
  });
});

describe("mergeHits", () => {
  const answer = (results: SearchAnswer["results"]): SearchAnswer => ({ v: 1, q: "x", results, types: [] });
  it("keeps one row per screen, drops students, caps each group", () => {
    const local = [{ key: "l-1", title: "Lithium", kind: "medicine" as const, href: "/medicine/lithium" }];
    const server = answer([
      { id: "medicine:lithium", type: "medicine", title: "Lithium", meta: "", href: "/practice/medicines/lithium", app: "/medicine/lithium" },
      { id: "student:s1", type: "student", title: "Riya", meta: "", href: "/admin/students/s1", app: "/student/s1" },
      ...Array.from({ length: 9 }, (_, i) => ({ id: `section:m:${i}`, type: "section" as const, title: `Topic ${i}`, meta: "", href: `/study/m/${i}`, app: `/study/m/${i}` })),
    ]);
    const out = mergeHits(local, server);
    expect(out.filter((h) => h.href === "/medicine/lithium")).toHaveLength(1);
    expect(out.some((h) => h.href.startsWith("/student"))).toBe(false);
    expect(out.filter((h) => h.kind === "section")).toHaveLength(6);
  });

  it("the shared engine forgives a slip", () => {
    expect(searchDocs([{ id: "a", type: "t", title: "Sertraline" }], "sertaline")).toHaveLength(1);
  });
});

describe("admin search", () => {
  it("finds a student by a name spelt a letter off", () => {
    expect(adminMatch("Aditi Verma aditi@example.com VSP-014", "adity")).toBe(true);
    expect(adminMatch("Aditi Verma aditi@example.com VSP-014", "vsp-014")).toBe(true);
    expect(adminMatch("Aditi Verma", "rahul")).toBe(false);
  });
});
