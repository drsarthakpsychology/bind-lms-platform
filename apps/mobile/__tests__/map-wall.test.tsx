import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";

import * as L from "@/api/adapt-learn";
import type { WallFeed } from "@/api/contract";
import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { pathFromLink } from "@/nav/targets";
import { MapScreen } from "@/screens/map/map";
import { MapPracticeScreen, seededOrder } from "@/screens/map/practice";
import { flipReaction, WallScreen } from "@/screens/wall/wall";
import { DoubtsScreen } from "@/screens/doubts/list";
import { render } from "./utils";

/** Press a button once it is enabled (state updates land a tick later in this test setup). */
async function pressWhenReady(id: string) {
  await waitFor(() => expect(screen.getByTestId(id).props.accessibilityState?.disabled).not.toBe(true));
  fireEvent.press(screen.getByTestId(id));
}

beforeAll(async () => {
  await session.boot();
  await session.signIn("ananya@example.com", "pw");
  await session.choosePin("2580");
});
beforeEach(() => {
  mock.reset();
  (useLocalSearchParams as jest.Mock).mockReturnValue({});
  (router.push as jest.Mock).mockClear?.();
});

describe("map and wall answers are read safely", () => {
  it.each([L.studyMapView, L.mapPracticeView, L.wallFeedView].map((f) => [f.name, f] as const))("%s never throws", (_n, f) => {
    for (const j of [null, undefined, 3, "x", [], {}, { topics: [null, { id: "t" }], questions: [{ id: "q", kind: "mcq", text: "T", options: ["a"], answer: 4 }], posts: [{ id: "p", reactions: { heart: "x" }, mine: ["nope"] }] }]) expect(() => f(j as never)).not.toThrow();
  });

  it("drops questions it cannot show and keeps the states complete", () => {
    const r = L.mapPracticeView({ questions: [{ id: "a", kind: "mcq", text: "T", options: ["x", "y"], answer: 1 }, { id: "b", kind: "mcq", text: "T", options: ["x"], answer: 0 }, { id: "c", kind: "tf", text: "T", answer: "yes" }] });
    expect(r.questions.map((q) => q.id)).toEqual(["a"]);
    expect(L.studyMapView({}).states).toHaveLength(5);
  });

  it("orders options the same way every time for one question", () => {
    expect(seededOrder(4, "q1")).toEqual(seededOrder(4, "q1"));
    expect([...seededOrder(4, "q1")].sort()).toEqual([0, 1, 2, 3]);
  });

  it("opens website links to the map and the wall in the app", () => {
    expect(pathFromLink("https://vibhapsychology.com/study/map")).toBe("/map");
    expect(pathFromLink("https://vibhapsychology.com/study/map/practice?topic=m01")).toBe("/map/practice?topic=m01");
    expect(pathFromLink("https://vibhapsychology.com/wall")).toBe("/wall");
  });
});

describe("Your map", () => {
  it("shows practice, weak spots, mix-ups and every topic, and opens a topic's skills", async () => {
    await render(<MapScreen />);
    expect(await screen.findByTestId("map-practise")).toBeTruthy();
    expect(screen.getByText("Anxiety disorders · Criteria")).toBeTruthy();
    expect(screen.getByText("Mania and Hypomania")).toBeTruthy();
    fireEvent.press(screen.getByTestId("map-topic-m01"));
    expect(await screen.findByText("Practise this topic")).toBeTruthy();
    expect(screen.getByText("88%")).toBeTruthy();
  });

  it("says what to do when there is nothing to fix", async () => {
    mock.setScenario("new");
    await render(<MapScreen />);
    expect(await screen.findByTestId("map-weak-empty")).toBeTruthy();
  });
});

describe("Map practice", () => {
  it("checks each answer at once, explains it, and ends with the score", async () => {
    await render(<MapPracticeScreen />);
    await screen.findByTestId("map-q-0");
    // Q1: pick the right answer (Hypomania, wherever it is in the order).
    fireEvent.press(screen.getByLabelText(/Hypomania/));
    await pressWhenReady("map-check");
    expect(await screen.findByTestId("verdict")).toBeTruthy();
    await pressWhenReady("verdict-next");
    // Q2 is true or false: a tap checks it.
    fireEvent.press(await screen.findByLabelText(/True/));
    await screen.findByTestId("verdict-next");
    await pressWhenReady("verdict-next");
    fireEvent.press(await screen.findByLabelText(/Liver enzymes/));
    await pressWhenReady("map-check");
    await screen.findByTestId("verdict-next");
    await pressWhenReady("verdict-next");
    expect(await screen.findByTestId("map-round-done")).toBeTruthy();
    expect(screen.getByLabelText("2 of 3 right")).toBeTruthy();
    await waitFor(() => expect(mock.log().filter((l) => l.path === "/study/map/practice/answers")).toHaveLength(3));
  });

  it("shows the real reason when the round cannot load", async () => {
    mock.setScenario("error");
    await render(<MapPracticeScreen />);
    expect(await screen.findByTestId("load-error")).toBeTruthy();
    expect(screen.queryByText(/Check your internet/)).toBeNull();
  });
});

describe("Class wall", () => {
  it("flips a reaction and its count, and back", () => {
    const feed: WallFeed = { posts: [{ id: "p", content: "x", isAnonymous: false, isFaculty: false, isPinned: false, createdAt: "", reactions: { heart: 1 }, mine: [], replies: [{ id: "r", content: "y", isAnonymous: false, isFaculty: false, createdAt: "", reactions: {}, mine: ["worry"] }] }] };
    const on = flipReaction(feed, { postId: "p" }, "heart");
    expect(on.posts[0]).toMatchObject({ reactions: { heart: 2 }, mine: ["heart"] });
    expect(flipReaction(on, { postId: "p" }, "heart").posts[0]).toMatchObject({ reactions: { heart: 1 }, mine: [] });
    expect(flipReaction(feed, { replyId: "r" }, "worry").posts[0]!.replies[0]).toMatchObject({ reactions: { worry: 0 }, mine: [] });
  });

  it("shows posts without names, reacts, replies and posts", async () => {
    await render(<WallScreen />);
    expect(await screen.findByTestId("post-p1")).toBeTruthy();
    expect(screen.getByText("Case of the week")).toBeTruthy();
    expect(screen.getAllByText("Anonymous").length).toBeGreaterThan(0);
    fireEvent.press(screen.getAllByTestId("react-heart")[1]!);
    await waitFor(() => expect(mock.log().some((l) => l.path === "/wall/reactions")).toBe(true));
    fireEvent.press(screen.getByTestId("post-replies-p2"));
    fireEvent.changeText(await screen.findByTestId("reply-field-p2"), "Count me in");
    await pressWhenReady("reply-send-p2");
    expect(await screen.findByText("Count me in")).toBeTruthy();
    fireEvent.press(screen.getByTestId("wall-write"));
    fireEvent.changeText(await screen.findByTestId("wall-text"), "Hello batch");
    await pressWhenReady("wall-send");
    expect(await screen.findByText("Hello batch")).toBeTruthy();
  });

  it("has a quiet empty state", async () => {
    mock.setScenario("empty");
    await render(<WallScreen />);
    expect(await screen.findByTestId("wall-empty")).toBeTruthy();
  });

  it("is linked from Doubts when it is open for you", async () => {
    await render(<DoubtsScreen />);
    fireEvent.press(await screen.findByTestId("doubts-wall"));
    expect(router.push).toHaveBeenCalledWith("/wall");
  });
});
