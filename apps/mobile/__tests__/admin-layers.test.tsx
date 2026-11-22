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
import { AdminLeaderboardScreen, InsightsScreen } from "@/admin/screens/insights";
import { AdminMoreScreen } from "@/admin/screens/more";
import { FailedEmailsScreen, WallReportsScreen } from "@/admin/screens/queues";
import { SwitchesScreen, TestModeScreen } from "@/admin/screens/switches";
import { AnswerKeyScreen, PracticeSetScreen, TeachingModuleScreen, TeachingScreen } from "@/admin/screens/teaching";
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

  it("Home has no blue field, no Jyo and no sticker, and leads with needs attention and the numbers", async () => {
    await render(<AdminHomeScreen />);
    expect(await screen.findByText("Fix logins")).toBeTruthy();
    expect(screen.getByText("Needs attention")).toBeTruthy();
    expect(screen.getByTestId("home-students")).toBeTruthy();
    expect(screen.getByTestId("role-pill")).toBeTruthy();
    expect(screen.queryByTestId("jyo")).toBeNull();
    expect(screen.queryByTestId("meme")).toBeNull();
    expect(screen.queryByTestId("view-only-note")).toBeNull();
  });

  it("More groups every admin place and opens the new ones", async () => {
    await render(<AdminMoreScreen />);
    for (const id of ["more-switches", "more-access", "more-test-mode", "more-wall", "more-failed", "more-insights", "more-leaderboards"]) expect(screen.getByTestId(id)).toBeTruthy();
    await fireEvent.press(screen.getByTestId("more-switches"));
    expect(router.push).toHaveBeenCalledWith("/admin/switches");
  });

  it("Teaching is a reviewer view: no Continue, opens class results", async () => {
    await render(<TeachingScreen />);
    expect(screen.queryByText("Continue")).toBeNull();
    await fireEvent.press(screen.getByTestId("teach-m02"));
    expect(router.push).toHaveBeenCalledWith("/admin/teaching/m02");
  });

  it("a module shows class results per section and opens the answer key", async () => {
    params.mockReturnValue({ module: "m02" });
    await render(<TeachingModuleScreen />);
    expect(screen.getByText("Class results by section")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("teach-m02.c1"));
    expect(router.push).toHaveBeenCalledWith("/admin/teaching/section/m02.c1");
  });

  it("the answer key shows the correct answer in words and can flag a question", async () => {
    params.mockReturnValue({ id: "m02.c1" });
    await render(<AnswerKeyScreen />);
    expect(screen.getAllByText("Correct answer").length).toBe(3);
    await fireEvent.press(screen.getByTestId("key-m02.c1.q1-flag"));
    await fireEvent.press(screen.getByTestId("flag-save"));
    expect(screen.getByText("Write one line about what is wrong.")).toBeTruthy();
    await fireEvent.changeText(screen.getByTestId("flag-note"), "Two options could both fit");
    await fireEvent.press(screen.getByTestId("flag-save"));
    expect(screen.getByText("Two options could both fit")).toBeTruthy();
  });

  it("a practice set has an answer key", async () => {
    params.mockReturnValue({ id: "p-case-day" });
    await render(<PracticeSetScreen />);
    expect(screen.getByText("Correct answer")).toBeTruthy();
  });

  it("What is live: hiding a feature asks first", async () => {
    await render(<SwitchesScreen />);
    await fireEvent.press(screen.getByTestId("feature-games"));
    await fireEvent.press(screen.getByTestId("feature-state-off"));
    await fireEvent.press(screen.getByTestId("feature-save"));
    expect(screen.getByText("Hide Games?")).toBeTruthy();
  });

  it("Test mode has the switch", async () => {
    await render(<TestModeScreen />);
    expect(screen.getByTestId("test-mode-switch")).toBeTruthy();
  });

  it("Add a student checks the fields before sending", async () => {
    await render(<AddStudentScreen />);
    await fireEvent.press(screen.getByTestId("add-student-go"));
    expect(screen.getByText("Write the student's name.")).toBeTruthy();
    expect(screen.getByText("Write a full email address.")).toBeTruthy();
  });

  it("Access for many says what will happen and asks before applying", async () => {
    await render(<BulkAccessScreen />);
    await fireEvent.press(screen.getByTestId("bulk-section-practice"));
    expect(screen.getByText(/Closed: Practice and games/)).toBeTruthy();
    await fireEvent.press(screen.getByTestId("bulk-apply"));
    expect(screen.getByTestId("bulk-confirm")).toBeTruthy();
  });

  it("queues, insights and the leaderboard draw and link to students", async () => {
    await render(<WallReportsScreen />);
    expect(screen.getByTestId("wall-wr1")).toBeTruthy();
    await render(<FailedEmailsScreen />);
    expect(screen.getByTestId("failed-fe1")).toBeTruthy();
    await render(<InsightsScreen />);
    expect(screen.getByText("Hardest topics")).toBeTruthy();
    await render(<AdminLeaderboardScreen />);
    await fireEvent.press(screen.getByTestId("board-u1"));
    expect(router.push).toHaveBeenCalledWith("/student/u1");
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
    params.mockReturnValue({ id: "m02.c1" });
    await render(<AnswerKeyScreen />);
    expect(screen.getAllByTestId("locked").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/view-only access/i).length).toBeGreaterThan(0);
    await render(<FailedEmailsScreen />);
    expect(screen.getAllByTestId("locked").length).toBeGreaterThan(0);
  });

  it("What is live: the sheet shows the state locked and has no Save", async () => {
    await render(<SwitchesScreen />);
    await fireEvent.press(screen.getByTestId("feature-games"));
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
