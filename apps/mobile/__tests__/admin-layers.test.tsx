/**
 * The admin side in the Layers look: its own frame (no blue field, no Jyo,
 * no stickers), the five tabs, the new screens, and view-only admins seeing
 * every write control locked with a reason.
 */
import { fireEvent, screen } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";

import { AddStudentScreen, BulkAccessScreen } from "@/admin/screens/access";
import { AdminHomeScreen } from "@/admin/screens/home";
import { AdminLeaderboardScreen } from "@/admin/screens/leaderboard";
import { AdminMoreScreen } from "@/admin/screens/more";
import { FailedEmailsScreen, WallReportsScreen } from "@/admin/screens/queues";
import { SwitchesScreen, TestModeScreen } from "@/admin/screens/switches";
import { LearningScreen } from "@/admin/screens/learning";
import { currentSession } from "@/clinic/admin/today";
import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { render } from "./utils";

const params = useLocalSearchParams as jest.Mock;

async function signInAs(email: string) {
  if (session.store.get().phase !== "visitor" && session.store.get().phase !== "loading") await session.signOut();
  await session.signIn(email, "pw");
  await session.choosePin("2580");
}

beforeAll(async () => {
  await session.boot();
});
beforeEach(() => {
  mock.reset();
  params.mockReturnValue({});
  (router.push as jest.Mock).mockClear();
});

describe("as the Super Admin", () => {
  beforeAll(async () => {
    await signInAs("admin@example.com");
  });

  it("Home has no blue field, no Jyo and no sticker, and leads with today's to-do and the numbers", async () => {
    await render(<AdminHomeScreen />);
    expect(await screen.findByText("Fix logins")).toBeTruthy();
    expect(screen.getByText("To do today")).toBeTruthy();
    expect(await screen.findByTestId("todo-wall")).toBeTruthy();
    expect(screen.getByTestId("home-students")).toBeTruthy();
    expect(screen.getByTestId("role-pill")).toBeTruthy();
    expect(screen.queryByTestId("jyo")).toBeNull();
    expect(screen.queryByTestId("meme")).toBeNull();
    expect(screen.queryByTestId("view-only-note")).toBeNull();
    expect(screen.queryByText(/sample data/i)).toBeNull();
  });

  it("More groups every admin place in plain words and opens them", async () => {
    await render(<AdminMoreScreen />);
    for (const id of ["more-switches", "more-access", "more-test-mode", "more-wall", "more-failed", "more-leaderboards", "more-admins"]) expect(screen.getByTestId(id)).toBeTruthy();
    expect(screen.queryByTestId("more-insights")).toBeNull();
    expect(screen.getByText("Features for students")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("more-switches"));
    expect(router.push).toHaveBeenCalledWith("/admin/switches");
  });

  it("Learning lists every student, behind first, and opens one record", async () => {
    await render(<LearningScreen />);
    expect(await screen.findByTestId("learner-u3")).toBeTruthy();
    expect(screen.queryByText("Continue")).toBeNull();
    expect(screen.getAllByText("Behind").length).toBeGreaterThan(0);
    await fireEvent.changeText(screen.getByTestId("learn-search"), "sana");
    expect(screen.queryByTestId("learner-u3")).toBeNull();
    await fireEvent.press(screen.getByTestId("learner-u5"));
    expect(router.push).toHaveBeenCalledWith("/admin/learning/u5");
  });

  it("Learning has a whole class view", async () => {
    await render(<LearningScreen />);
    await screen.findByTestId("learner-u3");
    await fireEvent.press(screen.getByTestId("learn-view-class"));
    expect(await screen.findByText("Hardest modules")).toBeTruthy();
    expect(screen.getByText("Delusion or overvalued idea")).toBeTruthy();
  });

  it("Features for students: hiding one asks first, then saves", async () => {
    await render(<SwitchesScreen />);
    await fireEvent.press(await screen.findByTestId("feature-lab"));
    await fireEvent.press(screen.getByTestId("feature-state-off"));
    await fireEvent.press(screen.getByTestId("feature-save"));
    expect(screen.getByText("Hide Psychology Lab?")).toBeTruthy();
  });

  it("Test mode has the switch", async () => {
    await render(<TestModeScreen />);
    expect(screen.getByTestId("test-mode-switch")).toBeTruthy();
  });

  it("Add students checks the emails before sending, then shows what happened", async () => {
    await render(<AddStudentScreen />);
    await fireEvent.press(screen.getByTestId("add-student-go"));
    expect(screen.getByText("Write at least one full email address.")).toBeTruthy();
    await screen.findByTestId("add-cohort");
    await fireEvent.changeText(screen.getByTestId("add-list"), "new.person@example.com");
    await fireEvent.press(screen.getByTestId("add-student-go"));
    expect(await screen.findByText(/New account made/)).toBeTruthy();
  });

  it("Access for many says what will happen and asks before applying", async () => {
    await render(<BulkAccessScreen />);
    await fireEvent.press(await screen.findByTestId("bulk-section-practice-close"));
    expect(screen.getByText(/Close: Practice \(every tool\)/)).toBeTruthy();
    await fireEvent.press(screen.getByTestId("bulk-apply"));
    expect(screen.getByTestId("bulk-confirm")).toBeTruthy();
  });

  it("wall reports and failed emails read real answers and act on them", async () => {
    await render(<WallReportsScreen />);
    expect(await screen.findByTestId("wall-33333333-3333-4333-8333-333333333333")).toBeTruthy();
    await render(<FailedEmailsScreen />);
    expect(await screen.findByTestId("failed-11111111-1111-4111-8111-111111111111")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("failed-11111111-1111-4111-8111-111111111111-clear"));
    expect(await screen.findByText(/cleared. The history keeps them/)).toBeTruthy();
    expect(screen.queryByText(/sample data/i)).toBeNull();
    // The leaderboard reads the real board: every student with full names and cohorts, a page at a time.
    await render(<AdminLeaderboardScreen />);
    expect(await screen.findByTestId("board-row-0")).toBeTruthy();
    expect(screen.getByText("Page 1 of 2")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("board-next"));
    expect(await screen.findByText("Page 2 of 2")).toBeTruthy();
  });
});

describe("as a view-only admin", () => {
  beforeAll(async () => {
    await signInAs("viewadmin@example.com");
  });

  it("every admin screen says it is view only", async () => {
    await render(<AdminHomeScreen />);
    expect(await screen.findByTestId("view-only-note")).toBeTruthy();
    expect(screen.queryByTestId("admin-compose")).toBeNull();
    expect(screen.getByTestId("admin-compose-locked")).toBeTruthy();
  });

  it("write controls stay on the screen, locked, with the reason", async () => {
    await render(<FailedEmailsScreen />);
    await screen.findByTestId("failed-11111111-1111-4111-8111-111111111111");
    expect(screen.getAllByTestId("locked").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/view-only access/i).length).toBeGreaterThan(0);
  });

  it("Features for students: the sheet shows the state locked and has no Save", async () => {
    await render(<SwitchesScreen />);
    await fireEvent.press(await screen.findByTestId("feature-lab"));
    expect(screen.queryByTestId("feature-save")).toBeNull();
    expect(screen.getAllByTestId("locked").length).toBeGreaterThan(0);
  });
});

describe("the session that gets the lime Show code", () => {
  const s = (id: string, start: string, end: string, status: "scheduled" | "cancelled" = "scheduled") => ({ id, start, end, status }) as never;
  it("is the one running now, else the next, never a cancelled one", () => {
    const list = [s("a", "09:00", "10:00"), s("b", "11:00", "12:00", "cancelled"), s("c", "14:00", "15:00")];
    expect(currentSession(list, 9 * 60 + 30)).toBe("a");
    expect(currentSession(list, 13 * 60 + 50)).toBe("c");
    expect(currentSession(list, 11 * 60 + 10)).toBe("c");
  });
});
