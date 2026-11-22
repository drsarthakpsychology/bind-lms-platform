import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";

import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { dueLine } from "@/lecture/assignment";
import { AssignmentScreen } from "@/screens/learn/assignment";
import { dueWord } from "@/screens/learn/assignments";
import { LearnHub, weekNow } from "@/screens/learn/hub";
import { chapterAt, LectureScreen } from "@/screens/lecture/lecture";
import { plainText } from "@/study/rich";
import { render } from "./utils";

/** The Learn area in the Layers look (builder blearn). */

beforeAll(async () => {
  await session.boot();
  await session.signIn("ananya@example.com", "pw");
  await session.choosePin("2580");
});
beforeEach(() => {
  mock.reset();
  (useLocalSearchParams as jest.Mock).mockReturnValue({});
});

describe("small rules", () => {
  it("says when an assignment is due in words", () => {
    const now = Date.parse("2026-11-16T06:00:00Z");
    expect(dueWord("2026-11-16T09:00:00Z", now)).toBe("Due today");
    expect(dueWord("2026-11-17T06:00:00Z", now)).toBe("Due tomorrow");
    expect(dueWord("2026-11-10T06:00:00Z", now)).toMatch(/^Was due /);
    expect(dueWord(null, now)).toBeNull();
    expect(dueLine({ dueAt: "2026-11-20T06:00:00Z", allowLate: false })).toMatch(/Nothing can be handed in after that/);
  });

  it("finds the chapter the video is in", () => {
    const ch = [0, 120, 340, 580, 800, 930].map((at, i) => ({ at, title: `Part ${i + 1}` }));
    expect(ch[0]!.at).toBe(0);
    expect(chapterAt(ch, 0)).toBe(0);
    expect(chapterAt(ch, ch[2]!.at + 1)).toBe(2);
    expect(chapterAt(ch, 99999)).toBe(ch.length - 1);
  });

  it("picks this week, or the first week with lectures left", () => {
    const w = (num: number, o: object) => ({ num, status: "in-progress", isCurrent: false, isFuture: false, done: 0, total: 2, lessons: [], materials: [], assignments: [], ...o }) as never;
    expect(weekNow([w(1, { done: 2 }), w(2, { isCurrent: true })])!.num).toBe(2);
    expect(weekNow([w(1, { done: 2 }), w(2, {})])!.num).toBe(2);
    expect(weekNow([w(1, { done: 2 })])).toBeNull();
  });

  it("drops the bold and term marks for plain text", () => {
    expect(plainText("A **bold** and *soft* word")).not.toMatch(/\*/);
  });
});

describe("Learn home", () => {
  it("shows where to pick up, this week, and the quick pebbles", async () => {
    await render(<LearnHub />);
    expect(await screen.findByTestId("learn-resume")).toBeTruthy();
    expect(screen.getByTestId("learn-lectures")).toBeTruthy();
    expect(screen.getByTestId("learn-doubts")).toBeTruthy();
    expect(await screen.findByTestId("learn-week-all")).toBeTruthy();
  });
});

describe("the assignment page", () => {
  it("shows the assignment of a lecture and links back to the lecture", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ lessonId: "l5" });
    await render(<AssignmentScreen />);
    expect(await screen.findByTestId("handin-files")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("assignment-lecture"));
    // The card grows into the lecture, so the push comes a moment after the tap.
    await waitFor(() => expect(router.push).toHaveBeenLastCalledWith("/lecture/l5"));
  });

  it("a recording assignment shows the recorder", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ lessonId: "l6" });
    await render(<AssignmentScreen />);
    expect(await screen.findByTestId("handin-recording")).toBeTruthy();
  });
});

describe("the lecture page", () => {
  it("shows the player and up next on About, and no Chapters or Notes tab until the website has them", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ lessonId: "l5" });
    await render(<LectureScreen />);
    expect(await screen.findByTestId("player")).toBeTruthy();
    expect(await screen.findByTestId("lecture-upnext")).toBeTruthy();
    expect(screen.queryByText("Chapters")).toBeNull();
    expect(screen.queryByText("Notes")).toBeNull();
    expect(screen.queryByText("Sample")).toBeNull();
  });
});
