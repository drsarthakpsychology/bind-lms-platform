import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";

import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { InterviewScreen, selfScore } from "@/practise/prep/interview";
import { PrepHome } from "@/practise/prep";
import { FreeHome, FreeTestScreen } from "@/free/screens";
import { INSTRUMENTS, scoreInstrument } from "@/free/tests";
import { BreathingScreen, phaseAt } from "@/free/calm";
import { guardTarget } from "@/nav/guard";
import { pathFromLink } from "@/nav/targets";
import { render } from "./utils";

const params = useLocalSearchParams as jest.Mock;

beforeAll(async () => {
  await session.boot();
  await session.signIn("ananya@example.com", "pw");
  await session.choosePin("2580");
});
beforeEach(() => {
  mock.reset();
  params.mockReturnValue({});
});

const press = async (id: string) => {
  await waitFor(() => expect(screen.getByTestId(id)).toBeTruthy(), { timeout: 4000 });
  await fireEvent.press(screen.getByTestId(id));
};
const posted = (path: string) => mock.log().filter((l) => l.method === "POST" && l.path.startsWith(path));

describe("mock interview in the app", () => {
  it("scores like the website", () => {
    expect(selfScore(3, 3, 0)).toEqual({ pct: 100, band: "strong" });
    expect(selfScore(3, 2, 1)).toEqual({ pct: 52, band: "okay" });
    expect(selfScore(3, 0, 2)).toEqual({ pct: 0, band: "weak" });
    expect(selfScore(0, 0, 0).pct).toBe(0);
  });

  it("Exam Prep opens it in the app, not the website, and shows each row once", async () => {
    await render(<PrepHome />);
    await waitFor(() => expect(screen.getByTestId("prep-more-interview")).toBeTruthy());
    expect(screen.getAllByText("Smart practice")).toHaveLength(1);
    expect(screen.getAllByText("Long answers")).toHaveLength(1);
    expect(screen.queryByText("Saved and wrong")).toBeNull();
    await press("prep-more-interview");
    expect(router.push).toHaveBeenCalledWith("/prep/interview");
  });

  it("answers, follows up, reveals the rubric only after, ticks, finishes and saves", async () => {
    await render(<InterviewScreen />);
    await press("interview-start");
    await waitFor(() => expect(screen.getByText("Why do you want to train in clinical psychology?")).toBeTruthy());
    expect(screen.queryByTestId("interview-rubric")).toBeNull();
    fireEvent.changeText(screen.getByTestId("interview-main"), "I sat with my aunt through her depression and learned to listen");
    await press("interview-answered");
    await waitFor(() => expect(screen.getByText("What would you do if you did not get a seat this year?")).toBeTruthy());
    expect(posted("/play/prep/interviewReveal")).toHaveLength(0);
    await press("interview-skip");
    await waitFor(() => expect(screen.getByTestId("interview-rubric")).toBeTruthy());
    expect(posted("/play/prep/interviewReveal")[0]!.body).toEqual({ args: ["iv-why"] });
    await press("interview-cover-0");
    await press("interview-cover-1");
    await press("interview-flag-0");
    expect(screen.getByTestId("interview-score").props.children).toBe("This one: 52%, getting there");
    await press("interview-ai");
    await waitFor(() => expect(screen.getByTestId("interview-feedback")).toBeTruthy());
    await press("interview-next");
    await waitFor(() => expect(screen.getByText("A client tells you they plan to hurt someone. What do you do?")).toBeTruthy());
    fireEvent.changeText(screen.getByTestId("interview-main"), "Keep them safe and call my supervisor");
    await press("interview-answered");
    await waitFor(() => expect(screen.getByTestId("interview-rubric")).toBeTruthy());
    await press("interview-next");
    await waitFor(() => expect(screen.getByTestId("interview-done")).toBeTruthy());
    await waitFor(() => expect(screen.getByTestId("interview-saved").props.children).toMatch(/^Saved/));
    const body = posted("/play/prep/interviewSave")[0]!.body as { args: [{ items: { id: string; covered: string[]; flags: string[] }[] }] };
    expect(body.args[0].items.map((i) => i.id)).toEqual(["iv-why", "iv-ethics"]);
    expect(body.args[0].items[0]!.covered).toHaveLength(2);
    expect(body.args[0].items[0]!.flags).toHaveLength(1);
    expect(JSON.stringify(body)).not.toMatch(/"pct"|"score"/);
  });
});

describe("free self-checks for visitors", () => {
  it("are open without signing in, and links reach them", () => {
    expect(guardTarget({ phase: "visitor", top: "free", me: null, notice: null, viewingAsStudent: false })).toBeNull();
    expect(pathFromLink("https://vibhapsychology.com/free/tests/phq-9")).toBe("/free/phq-9");
    expect(pathFromLink("https://vibhapsychology.com/free")).toBe("/free");
  });

  it("score like the website", () => {
    const phq = INSTRUMENTS.find((i) => i.id === "phq-9")!;
    const r = scoreInstrument(phq, phq.items.map(() => 0));
    expect(r).toMatchObject({ kind: "total", score: 0, max: 27, flags: [] });
    expect(scoreInstrument(phq, phq.items.map(() => 3))).toMatchObject({ score: 27, flags: ["self-harm"] });
  });

  it("lists every self-check", async () => {
    await render(<FreeHome />);
    for (const i of INSTRUMENTS) expect(screen.getByTestId(`free-${i.id}`)).toBeTruthy();
    expect(screen.getByTestId("crisis")).toBeTruthy();
  });

  it("runs one question at a time, asks how hard it made life, and shows help first after a risk answer", async () => {
    params.mockReturnValue({ id: "phq-9" });
    const phq = INSTRUMENTS.find((i) => i.id === "phq-9")!;
    await render(<FreeTestScreen />);
    for (let k = 0; k < phq.items.length; k++) {
      await waitFor(() => expect(screen.getByTestId("free-item").props.children).toBe(phq.items[k]!.text));
      fireEvent.press(screen.getByTestId(k === 8 ? "free-option-1" : "free-option-0"));
    }
    await press("free-extra-1");
    await waitFor(() => expect(screen.getByTestId("free-result")).toBeTruthy());
    expect(screen.getByTestId("free-score").props.children).toBe("1 / 27");
    expect(screen.getByTestId("free-band").props.children).toBe("Minimal");
    expect(screen.getByTestId("crisis-urgent")).toBeTruthy();
    await press("free-again");
    await waitFor(() => expect(screen.getByTestId("free-item").props.children).toBe(phq.items[0]!.text));
  });

  it("an unknown self-check says so", async () => {
    params.mockReturnValue({ id: "nope" });
    await render(<FreeTestScreen />);
    expect(screen.getByTestId("free-missing")).toBeTruthy();
  });
});

describe("guided breathing", () => {
  it("knows the phase at any second", () => {
    expect(phaseAt("box", 0)).toEqual({ phase: 0, left: 4 });
    expect(phaseAt("box", 4.2)).toEqual({ phase: 1, left: 4 });
    expect(phaseAt("478", 10)).toEqual({ phase: 1, left: 1 });
    expect(phaseAt("478", 11.5)).toEqual({ phase: 2, left: 8 });
    expect(phaseAt("slow", 21)).toEqual({ phase: 0, left: 4 });
  });

  it("starts and stops", async () => {
    await render(<BreathingScreen />);
    expect(String(screen.getByTestId("breathing-phase").props.children)).toMatch(/^In 4.+hold 4$/);
    fireEvent.press(screen.getByTestId("breathing-go"));
    await waitFor(() => expect(screen.getByTestId("breathing-phase").props.children).toBe("Breathe in"));
    fireEvent.press(screen.getByTestId("breathing-go"));
    await waitFor(() => expect(screen.getByTestId("breathing-count").props.children).toBe("Ready"));
  });
});
