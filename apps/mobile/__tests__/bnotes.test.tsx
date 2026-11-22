import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";

import type { RefEntry } from "@/api/adapt-learn";
import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { CompareScreen } from "@/library/compare";
import { FactStrip, PairTable } from "@/library/kit";
import { LibraryScreen } from "@/library/list";
import { MedicineScreen, splitLine } from "@/library/medicine";
import { pinnedMeds } from "@/library/pins";
import { mechanismGroups } from "@/library/list";
import { medicineList, referenceHome } from "@/practise/mock";
import { NotesScreen, searchNotes } from "@/screens/notes/notes";
import { EntryBody } from "@/screens/reference/reference";
import { render } from "./utils";

const params = useLocalSearchParams as jest.Mock;
// The shared router mock has no setParams; compare uses it to fill its two sides.
const setParams = jest.fn();
(router as unknown as { setParams: unknown }).setParams = setParams;

beforeAll(async () => {
  await session.boot();
  await session.signIn("ananya@example.com", "pw");
  await session.choosePin("2580");
});
beforeEach(() => {
  mock.reset();
  params.mockReturnValue({});
});

describe("revision notes list", () => {
  it("searches titles first, then the one-line summary", () => {
    const notes = [
      { id: "a", block: 0, blockTitle: "Weeks 1 to 2", title: "Bipolar disorder", emoji: "", tagline: "Highs and lows", readOn: null },
      { id: "b", block: 0, blockTitle: "Weeks 1 to 2", title: "Depression", emoji: "", tagline: "Not bipolar: low mood only", readOn: null },
    ];
    expect(searchNotes(notes, "bipolar").map((n) => n.id)).toEqual(["a", "b"]);
    expect(searchNotes(notes, "")).toHaveLength(2);
    expect(searchNotes(notes, "zzz")).toHaveLength(0);
  });

  it("typing filters the list and an unknown word offers the Quick reference", async () => {
    await render(<NotesScreen />);
    expect(await screen.findByTestId("notes-next")).toBeTruthy();
    await fireEvent.changeText(screen.getByTestId("notes-search"), "bipolar");
    await waitFor(() => expect(screen.queryByTestId("notes-next")).toBeNull());
    expect(screen.getByTestId("note-bipolar")).toBeTruthy();
    await fireEvent.changeText(screen.getByTestId("notes-search"), "qqqq");
    expect(await screen.findByTestId("notes-none")).toBeTruthy();
    await fireEvent.press(screen.getByText("Search the Quick reference"));
    expect(router.push).toHaveBeenLastCalledWith("/reference?q=qqqq");
  });
});

describe("quick reference card", () => {
  const adhd: RefEntry = { kind: "disorder", slug: "adhd", label: "ADHD", summary: "", chapter: "Neurodevelopmental", aka: [], core: "Inattention, or hyperactivity and impulsivity, that gets in the way.", features: ["Two symptom groups"], criteria: ["Present in more than one place"], duration: "6 months or more", lookAlikes: [{ name: "Anxiety", tell: "Worry drives the poor focus", slug: "gad" }], firstLine: [], noteId: "child" };

  it("shows only the facts it has today", async () => {
    await render(<EntryBody e={adhd} labelOf={() => null} onOpen={() => undefined} />);
    expect(screen.getByLabelText("Duration: 6 months or more")).toBeTruthy();
    expect(screen.queryByText("Threshold")).toBeNull();
    expect(screen.queryByTestId("ref-presentations")).toBeNull();
    expect(screen.queryByTestId("ref-lesson")).toBeNull();
  });

  it("has a place for the extra slots: threshold, onset, settings, presentation types, the lesson and practice", async () => {
    const onOpen = jest.fn();
    await render(
      <EntryBody
        e={adhd}
        labelOf={() => null}
        onOpen={onOpen}
        extra={{
          threshold: "6 or more in either group (5 if aged 17 or older)",
          onset: "Several symptoms before 12",
          settings: "2 or more (home, school, work)",
          presentations: [{ name: "Combined", when: "Both groups reach the threshold" }],
          lesson: { title: "Module 9: Child and adolescent", href: "/study/m09" },
          practice: [{ title: "ADHD or anxiety?", href: "/game/duel" }],
        }}
      />,
    );
    for (const label of ["Threshold", "Duration", "Age of onset", "Settings"]) expect(screen.getByText(label)).toBeTruthy();
    expect(screen.getByTestId("ref-presentations")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("ref-lesson"));
    expect(onOpen).toHaveBeenLastCalledWith("/study/m09");
    await fireEvent.press(screen.getByText("ADHD or anxiety?"));
    expect(onOpen).toHaveBeenLastCalledWith("/game/duel");
    await fireEvent.press(screen.getByTestId("ref-like-gad"));
    expect(onOpen).toHaveBeenLastCalledWith("/reference/gad");
    await fireEvent.press(screen.getByTestId("ref-practise-detective"));
    expect(onOpen).toHaveBeenLastCalledWith("/case/detective");
  });

  it("the facts strip leaves out empty cells and the table opens a row", async () => {
    const open = jest.fn();
    await render(
      <>
        <FactStrip facts={[{ label: "Duration", value: "2 weeks" }, { label: "Onset", value: "" }, null]} />
        <PairTable rows={[{ label: "Grief", value: "Waves tied to the loss", testID: "row-grief", onPress: open }]} />
      </>,
    );
    expect(screen.getByText("2 weeks")).toBeTruthy();
    expect(screen.queryByText("Onset")).toBeNull();
    await fireEvent.press(screen.getByTestId("row-grief"));
    expect(open).toHaveBeenCalled();
  });
});

describe("medicines", () => {
  it("browses by class and by how they work, and searches", async () => {
    await render(<LibraryScreen />);
    await waitFor(() => expect(screen.getByTestId("class-Antidepressants")).toBeTruthy(), { timeout: 4000 });
    await fireEvent.press(screen.getByText("By how they work"));
    expect(await screen.findByTestId("how-note")).toBeTruthy();
    expect(screen.getByText(referenceHome().byMechanism[0]!.tag)).toBeTruthy();
    await fireEvent.press(screen.getByTestId("how-0-donepezil"));
    expect(router.push).toHaveBeenLastCalledWith("/medicine/donepezil");
    await fireEvent.changeText(screen.getByTestId("library-search"), "zolp");
    expect(await screen.findByTestId("med-zolpidem")).toBeTruthy();
    expect(screen.getByTestId("library-count")).toBeTruthy();
    await fireEvent.changeText(screen.getByTestId("library-search"), "qqqq");
    expect(await screen.findByTestId("library-empty")).toBeTruthy();
  });

  it("every mechanism group from the server is matched to the medicine list, and unknown medicines are left out", async () => {
    const rows = medicineList().rows;
    const home = referenceHome();
    const groups = mechanismGroups(home, rows);
    expect(groups).toHaveLength(home.byMechanism.length);
    for (const g of groups) for (const x of g.items) expect(rows).toContain(x.m);
    const odd = mechanismGroups({ ...home, byMechanism: [{ tag: "Something", drugs: [{ slug: "not-a-medicine", name: "Not a medicine", qualifier: null }] }] }, rows);
    expect(odd).toEqual([]);
    // Matched by name too, when the slug differs.
    const byName = mechanismGroups({ ...home, byMechanism: [{ tag: "T", drugs: [{ slug: "x", name: rows[0]!.name, qualifier: "q" }] }] }, rows);
    expect(byName[0]!.items[0]).toEqual({ m: rows[0], q: "q" });
  });

  it("an interaction line splits into what and why, and a plain line stays whole", () => {
    expect(splitLine("Serotonergic drugs: tramadol, triptans")).toEqual({ label: "Serotonergic drugs", value: "tramadol, triptans" });
    expect(splitLine("Omeprazole raises levels slightly")).toEqual({ label: "Omeprazole raises levels slightly", value: "" });
  });

  it("the medicine page lays interactions and special groups out as tables, and pins", async () => {
    params.mockReturnValue({ id: "escitalopram" });
    await render(<MedicineScreen />);
    await waitFor(() => expect(screen.getByTestId("med-section-interactions")).toBeTruthy(), { timeout: 4000 });
    expect(screen.getByTestId("med-interactions")).toBeTruthy();
    expect(screen.getByTestId("med-groups")).toBeTruthy();
    expect(screen.getByTestId("facts")).toBeTruthy();
    // The dose text changes at once: there is one copy, never an old one fading out.
    await fireEvent.press(screen.getByTestId("med-dose-0"));
    expect(screen.getAllByTestId("med-dose-text")).toHaveLength(1);
    await fireEvent.press(screen.getByTestId("med-related-sertraline"));
    expect(router.push).toHaveBeenLastCalledWith("/medicine/sertraline");
    // Pins are hidden while the website keeps none.
    expect(screen.queryByTestId("pin")).toBeNull();
    pinnedMeds.add("escitalopram");
    expect(pinnedMeds.use).toBeDefined();
  });

  it("compare opens empty, lets you choose, and then shows both side by side", async () => {
    await render(<CompareScreen />);
    expect(await screen.findByTestId("compare-empty")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("compare-slot-a"));
    await fireEvent.press(await screen.findByTestId("pick-lithium"));
    expect(setParams).toHaveBeenLastCalledWith({ a: "lithium", b: "" });
  });

  it("compare with both chosen lists interactions too", async () => {
    params.mockReturnValue({ a: "escitalopram", b: "sertraline" });
    await render(<CompareScreen />);
    expect(await screen.findByText("Interactions", {}, { timeout: 4000 })).toBeTruthy();
    expect(screen.getByText("Usual dose")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("compare-open-sertraline"));
    expect(router.push).toHaveBeenLastCalledWith("/medicine/sertraline");
  });
});
