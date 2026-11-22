import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";

import * as L from "@/api/adapt-learn";
import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { hrefFor, pathFromLink } from "@/nav/targets";
import { AssignmentsBody } from "@/screens/learn/assignments";
import { LearnHub } from "@/screens/learn/hub";
import { SavedScreen } from "@/screens/learn/saved";
import { JourneyScreen } from "@/screens/me/journey";
import { NoteScreen, NotesScreen } from "@/screens/notes/notes";
import { findRef, ReferenceEntryScreen, ReferenceScreen, searchRefs } from "@/screens/reference/reference";
import { withNoteRead } from "@/study/state";
import { render } from "./utils";

beforeAll(async () => {
  await session.boot();
  await session.signIn("ananya@example.com", "pw");
  await session.choosePin("2580");
});
beforeEach(() => {
  mock.reset();
  (useLocalSearchParams as jest.Mock).mockReturnValue({});
});

describe("adapters never throw on half-filled answers", () => {
  const junk = [null, undefined, 3, "x", [], {}, { items: null, modules: [null, { id: "m1" }], notes: [{}], sections: null, earned: [{ credentialId: "c" }], stats: [{ label: "A" }] }];
  const all = [L.courseListView, L.courseDetailView, L.assignmentPageView, L.studyHomeView, L.moduleDetailView, L.sectionContentView, L.noteListView, L.noteView, L.refIndexView, L.refEntryView, L.marksView, L.progressView, L.achievementsView, L.journeyView, L.notificationListView, L.doubtListView, L.doubtThreadView];
  it.each(all.map((f) => [f.name, f] as const))("%s", (_name, f) => {
    for (const j of junk) expect(() => f(j as never)).not.toThrow();
  });

  it("fills every list and field the screens read", () => {
    const s = L.studyHomeView({ modules: [{ id: "m1", status: null }], next: null });
    expect(s.modules[0]).toMatchObject({ id: "m1", title: "Module", status: { readDone: 0, best: null, complete: false } });
    expect(s.next.kind).toBe("done");
    const m = L.moduleDetailView({ id: "m1", sections: [{ id: "s1", levelCheck: "beginner" }, { title: "no id" }], checkpoints: [{}] });
    expect(m.sections).toHaveLength(1);
    expect(m.sections[0]!.levelCheck).toBe("beginner");
    expect(m.checkpoints[0]).toMatchObject({ n: 1, status: "early", sectionIds: [] });
    const sec = L.sectionContentView({ mcq: [{ q: "Q", options: ["a"] }, { q: "Q2", options: ["a", "b"], answer: 9 }], test: null });
    expect(sec.mcq).toEqual([{ q: "Q2", options: ["a", "b"], answer: 1 }]);
    expect(sec.test).toBeNull();
    expect(L.journeyView({ level: 0, levelPct: 3 })).toMatchObject({ level: 1, levelPct: 1, points: null, stats: [] });
  });

  it("reads a Quick reference entry in the website's shape", () => {
    const e = L.refEntryView({ v: 1, entry: { kind: "medicine", slug: "sertraline", label: "Sertraline", summary: "An SSRI.", data: { cls: "SSRI", fullHref: "/tools/psychopharm/sertraline", uses: ["Depression", 4] } } });
    expect(e).toMatchObject({ kind: "medicine", medId: "sertraline", uses: ["Depression", "4"], sideEffects: [] });
    expect(L.refEntryView({ v: 1, entry: null })).toBeNull();
  });

  it("picks the line for the reading view", () => {
    expect(L.bulletText(["Sad", "Depressed mood"], "clinician")).toBe("Depressed mood");
    expect(L.bulletText("Same", "clinician")).toBe("Same");
  });
});

describe("Quick reference search", () => {
  const items = L.refIndexView({ items: [
    { slug: "anhedonia", label: "Anhedonia", kind: "term", summary: "Losing pleasure.", aliases: [] },
    { slug: "mdd", label: "Major depressive disorder", kind: "disorder", summary: "Low mood.", aliases: ["Depression", "MDD"] },
    { slug: "dep-term", label: "Depressed mood", kind: "term", summary: "Feeling low.", aliases: [] },
  ] }).items;
  it("puts a name it also goes by first", () => {
    expect(searchRefs(items, "depression")[0]!.slug).toBe("mdd");
    expect(searchRefs(items, "low").map((r) => r.slug)).toEqual(["dep-term", "mdd"]);
    expect(searchRefs(items, "", "term")).toHaveLength(2);
  });
  it("finds the entry a glossary word points at, or nothing", () => {
    expect(findRef(items, "anhedonia")?.slug).toBe("anhedonia");
    expect(findRef(items, "MDD")?.slug).toBe("mdd");
    expect(findRef(items, "zebra")).toBeNull();
  });
});

describe("links", () => {
  it("opens notes, the reference and My journey in the app", () => {
    expect(hrefFor({ screen: "studyNote", noteId: "depression", web: "/study/notes/depression" })).toBe("/notes/depression");
    expect(hrefFor({ screen: "unknown", web: "/journey" })).toBe("/journey");
    expect(hrefFor({ screen: "unknown", web: "/study/reference/anhedonia" })).toBe("/reference/anhedonia");
    expect(hrefFor({ screen: "unknown", web: "/wall" })).toBe("/wall");
    expect(pathFromLink("https://vibhapsychology.com/study/notes")).toBe("/notes");
  });
  it("marks a note read once", () => {
    const s = { notesRead: { a: "2026-11-01" } } as never;
    expect(withNoteRead(s, "a", "2026-11-16")).toBe(s);
    expect((withNoteRead(s, "b", "2026-11-16") as { notesRead: Record<string, string> }).notesRead.b).toBe("2026-11-16");
  });
});

describe("Learn screens", () => {
  it("the Learn hub lists Notes, Quick reference, Saved and Assignments", async () => {
    await render(<LearnHub />);
    expect(await screen.findByTestId("learn-notes")).toBeTruthy();
    expect(screen.getByTestId("learn-reference")).toBeTruthy();
    expect(screen.getByTestId("learn-saved")).toBeTruthy();
    expect(screen.getByTestId("learn-map")).toBeTruthy();
    expect(await screen.findByText("1 to hand in")).toBeTruthy();
  });

  it("notes: Carry on goes to the first unread note", async () => {
    await render(<NotesScreen />);
    // The part name is both a filter chip and the group label over its notes.
    expect((await screen.findAllByText("Weeks 1 to 2: Mood")).length).toBeGreaterThan(0);
    fireEvent.press(screen.getByTestId("notes-next"));
    expect(router.push).toHaveBeenLastCalledWith("/notes/bipolar");
  });

  it("a note follows the reading view and flips its say-it-clinically cards", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: "depression" });
    await render(<NoteScreen />);
    expect(await screen.findByText("Sad most of the day")).toBeTruthy();
    fireEvent.press(screen.getByText("Clinician"));
    expect(await screen.findByText("Depressed mood most of the day, nearly every day")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("flip-0"));
    await waitFor(() => expect(screen.getByLabelText("Anhedonia. Tap to see the everyday words.")).toBeTruthy());
    fireEvent.press(screen.getByText("Student"));
  });

  it("the Quick reference searches as you type", async () => {
    await render(<ReferenceScreen />);
    expect(await screen.findByTestId("ref-anhedonia")).toBeTruthy();
    await fireEvent.changeText(screen.getByTestId("reference-search"), "prozac");
    await waitFor(() => expect(screen.queryByTestId("ref-anhedonia")).toBeNull());
    expect(screen.getByTestId("ref-fluoxetine")).toBeTruthy();
    await fireEvent.changeText(screen.getByTestId("reference-search"), "qqqq");
    expect(await screen.findByTestId("reference-empty")).toBeTruthy();
  });

  it("a disorder entry has its look-alikes and a link to the note", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ slug: "major-depressive-disorder" });
    await render(<ReferenceEntryScreen />);
    expect(await screen.findByText("Look-alikes")).toBeTruthy();
    fireEvent.press(screen.getByTestId("ref-note"));
    expect(router.push).toHaveBeenLastCalledWith("/notes/depression");
  });

  it("saved lists bookmarks and notes with their section names", async () => {
    await render(<SavedScreen />);
    expect(await screen.findByText("Bookmarks")).toBeTruthy();
    expect(screen.getByText("Ask about sleep and appetite every time.")).toBeTruthy();
    await waitFor(() => expect(screen.getByText("2.2 How depression is diagnosed")).toBeTruthy());
  });

  it("assignments: to hand in first, marked ones with the score", async () => {
    await render(
      <AssignmentsBody
        now={Date.parse("2026-11-16T06:00:00Z")}
        items={[
          { id: "a", lessonId: "l5", courseId: "c", title: "Case summary", lessonTitle: "Depression", week: 3, dueAt: "2026-11-17T06:00:00Z", status: "not_started", score: null },
          { id: "b", lessonId: "l1", courseId: "c", title: "Intro", lessonTitle: "Intro", week: 1, dueAt: null, status: "graded", score: 90 },
        ]}
      />,
    );
    expect(screen.getByText("Week 3 · Depression · Due tomorrow")).toBeTruthy();
    expect(screen.getByText("90 of 100")).toBeTruthy();
    fireEvent.press(screen.getByTestId("assignment-a"));
    expect(router.push).toHaveBeenLastCalledWith("/lecture/l5?tab=assignment");
  });

  it("My journey shows the level and the six numbers", async () => {
    await render(<JourneyScreen />);
    expect(await screen.findByText("Keen Observer")).toBeTruthy();
    expect(screen.getByText("1240 points · #3 on the leaderboard")).toBeTruthy();
    expect(screen.getByTestId("journey-practice")).toBeTruthy();
    expect(screen.getByLabelText("Day streak: 6")).toBeTruthy();
  });
});
