import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";

import { lectureOnly, student } from "@/api/mock/fixtures";
import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { hasStudy, loadStudySide, resetStudySideForTests, STUDY_MODULES, STUDY_NOTES } from "@/nav/study";
import { hrefFor, pathFromLink } from "@/nav/targets";
import { routeReads } from "@/api/prefetch";
import { StudyTab } from "@/screens/study/tab";
import { TOUR_TABS } from "@/screens/auth/tour";
import { render } from "./utils";

const params = useLocalSearchParams as jest.Mock;
const setParams = jest.fn();
(router as unknown as { setParams: unknown }).setParams = setParams;

beforeAll(async () => {
  await session.boot();
  await session.signIn("ananya@example.com", "pw");
  await session.choosePin("2580");
});
beforeEach(async () => {
  mock.reset();
  params.mockReturnValue({});
  setParams.mockClear();
  await AsyncStorage.clear();
  resetStudySideForTests();
});

describe("the Study tab", () => {
  it("opens on Modules the first time, with the modules and Your map", async () => {
    await render(<StudyTab />);
    expect(await screen.findByTestId("study-switch")).toBeTruthy();
    expect(screen.getByTestId("study-side-modules").props.accessibilityState).toEqual({ selected: true });
    expect(await screen.findByTestId("study-map")).toBeTruthy();
    expect(await screen.findByTestId("study-continue")).toBeTruthy();
    expect(screen.queryByTestId("notes-hub")).toBeNull();
  });

  it("switches to Notes, shows Quick Notes, and remembers the side", async () => {
    const v = await render(<StudyTab />);
    await fireEvent.press(await screen.findByTestId("study-side-notes"));
    expect(await screen.findByTestId("notes-hub")).toBeTruthy();
    expect(screen.getByTestId("qn-search")).toBeTruthy();
    expect(await screen.findByTestId("qn-shelf-criteria")).toBeTruthy();
    expect(screen.getByTestId("hub-medicines")).toBeTruthy();
    expect(screen.getByTestId("study-side-notes").props.accessibilityState).toEqual({ selected: true });
    await waitFor(async () => expect(await AsyncStorage.getItem("vibha.study.side")).toBe("notes"));
    await v.unmount();

    // A later visit (after a restart too) opens on Notes.
    resetStudySideForTests();
    expect(await loadStudySide()).toBe("notes");
    await render(<StudyTab />);
    expect(await screen.findByTestId("notes-hub")).toBeTruthy();
  });

  it("a link can open either side, and clears its ask so the next link works", async () => {
    params.mockReturnValue({ side: "notes" });
    await render(<StudyTab />);
    expect(await screen.findByTestId("notes-hub")).toBeTruthy();
    expect(setParams).toHaveBeenCalledWith({ side: undefined });
    await act(async () => undefined);
    expect(await AsyncStorage.getItem("vibha.study.side")).toBe("notes");
  });

  it("is only for accounts with modules", () => {
    expect(hasStudy(student)).toBe(true);
    expect(hasStudy(lectureOnly)).toBe(false);
    expect(hasStudy({ ...student, access: { ...student.access, can: { ...student.access.can, study: false } } })).toBe(false);
  });

  it("the tour names it between Learn and Practise", () => {
    expect(TOUR_TABS.map((t) => t.name)).toEqual(["Today", "Learn", "Study", "Practise", "Me"]);
  });
});

describe("old addresses still land on Study", () => {
  it("the old Modules page and the old Notes tab", () => {
    expect(pathFromLink("https://vibhapsychology.com/study")).toBe(STUDY_MODULES);
    expect(pathFromLink("/library")).toBe(STUDY_NOTES);
    expect(pathFromLink("/library?side=modules")).toBe(STUDY_MODULES);
    expect(hrefFor({ screen: "study", web: "/study" })).toBe(STUDY_MODULES);
    // Deeper module pages keep their own screens.
    expect(pathFromLink("/study/m02")).toBe("/study/m02");
    expect(pathFromLink("https://vibhapsychology.com/study/notes")).toBe("/notes");
  });
  it("starts loading modules and notes when Study is opened", () => {
    expect(routeReads(STUDY_NOTES)).toHaveLength(2);
    expect(routeReads(STUDY_MODULES)).toHaveLength(2);
  });
});
