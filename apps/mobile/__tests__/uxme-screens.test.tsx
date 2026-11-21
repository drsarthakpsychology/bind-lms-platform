import { fireEvent, screen } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";

import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { AskScreen } from "@/screens/doubts/ask";
import { MeScreen } from "@/screens/me/me";
import { ProgressScreen } from "@/screens/me/progress";
import { dayGroup } from "@/screens/notifications/list";
import { SearchScreen } from "@/screens/search/search";
import { render } from "./utils";

beforeAll(async () => {
  await session.boot();
  await session.signIn("ananya@example.com", "pw");
  await session.choosePin("2580");
});
beforeEach(() => {
  mock.reset();
  (useLocalSearchParams as jest.Mock).mockReturnValue({});
  (router.push as jest.Mock).mockClear();
});

describe("Me", () => {
  it("shows who you are, the ring with three numbers, the next certificate and the shelf", async () => {
    await render(<MeScreen />);
    expect(await screen.findByTestId("me-summary")).toBeTruthy();
    expect(screen.getByTestId("me-name").props.children).toBe("Ananya Mehta");
    expect(await screen.findByLabelText("Next certificate: Module 2: Mood disorders. 1 of 4 sections read")).toBeTruthy();
    expect(await screen.findByTestId("me-level")).toBeTruthy();
    expect(screen.queryByTestId("me-journey")).toBeNull();
    expect(screen.queryByTestId("me-badges")).toBeNull();
    expect(screen.getByText("Account")).toBeTruthy();
    // The clinic links stay (their screens belong to the clinic area).
    for (const id of ["me-scan", "me-schedule", "me-leave", "me-opd", "me-attendance"]) expect(screen.getByTestId(id)).toBeTruthy();
    await fireEvent.press(screen.getByTestId("me-shop"));
    expect(router.push).toHaveBeenLastCalledWith("/shop");
    await fireEvent.press(screen.getByTestId("me-wall"));
    expect(router.push).toHaveBeenLastCalledWith("/wall");
  });
});

describe("Progress", () => {
  it("is one screen: level, numbers, courses, two weeks, topics, the map and badges", async () => {
    await render(<ProgressScreen />);
    expect(await screen.findByText("Keen Observer")).toBeTruthy();
    for (const t of ["Your courses", "Last two weeks", "Needs work", "Strongest", "Badges"]) expect(screen.getByText(t)).toBeTruthy();
    expect(screen.getByTestId("progress-map")).toBeTruthy();
    expect(screen.getByTestId("progress-streak")).toBeTruthy();
    expect(screen.queryByText("all your time here")).toBeNull();
  });

  it("tells the points of the day you tap", async () => {
    await render(<ProgressScreen />);
    const first = await screen.findByTestId("day-0");
    expect(screen.getByTestId("days-value").props.children).toMatch(/^Today: \d+ points$/);
    await fireEvent.press(first);
    expect(screen.getByTestId("days-value").props.children).not.toMatch(/^Today/);
  });
});

describe("Notifications", () => {
  it("groups by Today, This week and Earlier", () => {
    const now = Date.parse("2026-11-16T12:00:00+05:30");
    expect(dayGroup("2026-11-16T08:00:00+05:30", now)).toBe("Today");
    expect(dayGroup("2026-11-12T08:00:00+05:30", now)).toBe("This week");
    expect(dayGroup("2026-11-01T08:00:00+05:30", now)).toBe("Earlier");
    expect(dayGroup(null, now)).toBe("Earlier");
  });
});

describe("Search", () => {
  it("reads ?q=, finds games and cases, and remembers the search", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ q: "blitz" });
    await render(<SearchScreen />);
    const hit = await screen.findByTestId("hit-g-blitz");
    await fireEvent.press(hit);
    expect(router.push).toHaveBeenLastCalledWith("/game/blitz");
    await fireEvent.press(screen.getByTestId("search-clear"));
    expect(await screen.findByTestId("recent-blitz")).toBeTruthy();
    expect(screen.getByTestId("shortcut-lectures")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("recent-remove-blitz"));
    expect(screen.queryByTestId("recent-blitz")).toBeNull();
  });
});

describe("Ask a doubt", () => {
  it("offers the modules you are on as topic chips", async () => {
    await render(<AskScreen />);
    const chip = await screen.findByRole("radio", { name: "Mood disorders" });
    await fireEvent.press(chip);
    expect(screen.getByDisplayValue("Mood disorders")).toBeTruthy();
  });
});
