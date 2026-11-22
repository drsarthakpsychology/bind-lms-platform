import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";

import { mock } from "@/api/mock/server";
import { routeReads } from "@/api/prefetch";
import { session } from "@/auth";
import { QuickBrowse, QuickNotesScreen } from "@/library/quick-browse";
import { QuickNoteScreen } from "@/library/quick-note";
import { isQuickId, libraryView, noteViewOf, pinnedQuick } from "@/library/quick-notes";
import { hrefFor } from "@/nav/targets";
import NoteRoute from "../app/notes/[id]";
import { render } from "./utils";

const params = useLocalSearchParams as jest.Mock;

beforeAll(async () => {
  await session.boot();
  await session.signIn("ananya@example.com", "pw");
  await session.choosePin("2580");
});
beforeEach(async () => {
  mock.reset();
  params.mockReturnValue({});
  (router.push as jest.Mock).mockClear?.();
  await AsyncStorage.clear();
});

describe("Quick Notes data on the phone", () => {
  it("reads the library and a note defensively", () => {
    expect(libraryView(null)).toEqual({ items: [], types: [], topics: [] });
    expect(libraryView({ items: [{ key: "x" }, { key: "a", title: "A", app: "/notes/a" }] }).items).toHaveLength(1);
    const v = noteViewOf({ id: "criteria-adhd", title: "ADHD", facts: [{ label: "Duration", value: "" }, { label: "Onset", value: "Before 12" }] });
    expect(v.facts).toEqual([{ label: "Onset", value: "Before 12" }]);
    expect(v.sections).toEqual([]);
  });
  it("tells typed notes from one-page summaries by their id", () => {
    expect(isQuickId("criteria-adhd")).toBe(true);
    expect(isQuickId("pharm-lithium")).toBe(true);
    expect(isQuickId("depression")).toBe(false);
    expect(isQuickId("dsm-anxiety")).toBe(false);
  });
  it("a typed note loads its own data ahead, a summary its old one", () => {
    expect(routeReads("/notes/criteria-adhd").map((q) => q.queryKey)).toEqual([["quick-note", "criteria-adhd"]]);
    expect(routeReads("/notes/depression").map((q) => q.queryKey)).toEqual([["note", "depression"]]);
    expect(routeReads("/notes").map((q) => q.queryKey)).toEqual([["quick-notes"]]);
    expect(hrefFor({ screen: "studyNote", noteId: "criteria-adhd", web: "/study/notes/criteria-adhd" })).toBe("/notes/criteria-adhd");
  });
});

describe("Quick Notes library", () => {
  it("opens on Criteria, by topic, and a chip changes the shelf", async () => {
    await render(<QuickBrowse />);
    expect(await screen.findByTestId("qn-shelf-criteria")).toBeTruthy();
    expect(screen.getByTestId("qn-row-criteria-adhd")).toBeTruthy();
    await fireEvent.press(screen.getByText("Medicines"));
    expect(await screen.findByTestId("qn-shelf-pharm")).toBeTruthy();
    expect(screen.getByTestId("qn-row-pharm-lithium")).toBeTruthy();
  });

  it("searches the text inside notes and shows the line that matched", async () => {
    await render(<QuickBrowse />);
    await fireEvent.changeText(await screen.findByTestId("qn-search"), "before age 12");
    expect(await screen.findByTestId("qn-results")).toBeTruthy();
    await waitFor(() => expect(screen.getByTestId("qn-row-criteria-adhd")).toBeTruthy());
    await fireEvent.changeText(screen.getByTestId("qn-search"), "zzzqqq");
    expect(await screen.findByTestId("qn-none")).toBeTruthy();
  });

  it("pinned notes come first", async () => {
    pinnedQuick.add("pharm-lithium");
    await render(<QuickBrowse />);
    expect(await screen.findByTestId("qn-pin-pharm-lithium")).toBeTruthy();
    pinnedQuick.remove("pharm-lithium");
  });

  it("the /notes screen takes a type from the address", async () => {
    params.mockReturnValue({ type: "therapy" });
    await render(<QuickNotesScreen />);
    expect(await screen.findByTestId("qn-shelf-therapy")).toBeTruthy();
  });
});

describe("one Quick Note", () => {
  it("ADHD: the facts strip, sections, tables without sideways scroll, links and the source line", async () => {
    params.mockReturnValue({ id: "criteria-adhd" });
    await render(<QuickNoteScreen />);
    const facts = await screen.findByTestId("qn-facts");
    expect(facts).toBeTruthy();
    expect(screen.getByText("Threshold")).toBeTruthy();
    expect(screen.getByText("Several symptoms before age 12")).toBeTruthy();
    expect(screen.getByTestId("qn-section-presentations")).toBeTruthy();
    expect(screen.getByTestId("qn-section-look-alikes")).toBeTruthy();
    expect(screen.getByTestId("qn-source").props.children).toMatch(/DSM-5-TR/);
    expect(screen.getByTestId("qn-deeper")).toBeTruthy();
    expect(screen.getByTestId("qn-practise")).toBeTruthy();
    // A look-alike with its own note opens it.
    await fireEvent.press(screen.getByText("Bipolar disorder"));
    expect(router.push).toHaveBeenCalledWith("/notes/compare-bipolar2-bpd-adhd");
  });

  it("a comparison draws its table as stacked rows", async () => {
    params.mockReturnValue({ id: "compare-psychosis-duration" });
    await render(<QuickNoteScreen />);
    expect(await screen.findByTestId("qn-table-0")).toBeTruthy();
    expect(screen.queryByTestId("qn-source")).toBeNull();
  });

  it("/notes/<id> opens a typed note or a one-page summary", async () => {
    params.mockReturnValue({ id: "pharm-lithium" });
    const a = await render(<NoteRoute />);
    expect(await screen.findByTestId("quick-note")).toBeTruthy();
    await a.unmount();
    params.mockReturnValue({ id: "zz-missing" });
    await render(<NoteRoute />);
    await waitFor(() => expect(screen.queryByTestId("quick-note")).toBeNull());
  });

  it("an unknown typed note says so and offers the library", async () => {
    params.mockReturnValue({ id: "criteria-nothing" });
    await render(<QuickNoteScreen />);
    expect(await screen.findByTestId("quick-note-missing")).toBeTruthy();
  });
});
