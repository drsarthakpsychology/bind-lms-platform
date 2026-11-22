import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { mock } from "@/api/mock/server";
import { api, session } from "@/auth";
import { play } from "@/practise/api";
import type * as C from "@/practise/contract";
import { buildDefs, grade, scoreSct, simulatedPanel } from "@/practise/tools/engine";
import { CaseLibrary } from "@/practise/cases/library";
import { DailyCase } from "@/practise/cases/daily";
import { DetectiveCase } from "@/practise/cases/detective";
import { ToolCaseScreen } from "@/practise/cases/tool";
import { BlitzGame } from "@/practise/games/blitz";
import { ComorbidGame } from "@/practise/games/comorbid";
import { DuelGame } from "@/practise/games/duel";
import { EscapeGame } from "@/practise/games/escape";
import { MseGame, segments } from "@/practise/games/mse";
import { RxGame } from "@/practise/games/rx";
import { SortGame } from "@/practise/games/sort";
import { WardGame } from "@/practise/games/ward";
import { levelOf, PractiseGroup, PractiseHub } from "@/practise/hub";
import { PrepHome } from "@/practise/prep";
import { LongScreen } from "@/practise/prep/long";
import { PrepSetScreen } from "@/practise/prep/set";
import type * as P from "@/practise/types";
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
  await waitFor(() => expect(screen.getByTestId(id)).toBeTruthy());
  await fireEvent.press(screen.getByTestId(id));
};
const playFrom = async () => press("start-play");
/** The keys that would give an answer away. */
const LEAKS = /"(answer|correct|right|why|whyNot|verdict|bucket|outcome)":/;

describe("answers never reach the phone before the student answers", () => {
  it("deals carry options, never the answer", async () => {
    const deals = [
      await play("blitz", "start"),
      await play("rx", "deal", "mixed"),
      await play("mse", "deal", 1),
      await play("detective", "deal", "mixed", []),
      (await api.get<C.PrepSet>("/prep/subjects/statistics/topics/descriptives?set=1")).questions,
      (await api.get<C.PrepSet>("/prep/smart")).questions,
      await play<P.SortLoad>("sort", "load", { mode: "daily", tier: "basic" }),
      await play("escape", "start", "kolkata"),
    ];
    for (const d of deals) expect(JSON.stringify(d)).not.toMatch(LEAKS);
  });
  it("the right option arrives only in the reply to an answer", async () => {
    const s = await play<P.BlitzStart>("blitz", "start");
    const a = await play<P.BlitzAnswer>("blitz", "answer", s.token, 0, 0);
    expect(typeof a.answer).toBe("number");
    expect(a.why.length).toBeGreaterThan(0);
  });
});

describe("Practise hub", () => {
  it("one hub: today's patient on the field, what is half way, then five levels with every live tool", async () => {
    await render(<PractiseHub />);
    await waitFor(() => expect(screen.getByText("Today's patient")).toBeTruthy());
    expect(screen.getByTestId("hub-daily")).toBeTruthy();
    expect(screen.getByTestId("hub-pick-wwyd")).toBeTruthy();
    for (const t of ["Basics", "Apply", "Cases", "Decisions", "Advanced", "Exam prep", "Boards", "League"]) expect(screen.getAllByText(t).length).toBeGreaterThan(0);
    // Every live case and game is on the path, once, on its level.
    for (const id of ["blitz", "sort", "terms", "mse-lab", "duel", "rx", "detective", "two-minute", "formulation", "escape", "ward", "osce", "judgment"]) expect(screen.getAllByTestId(`practise-${id}`).length).toBe(1);
    // Ethics moves to "Read and reason" with the Casebook, the Lab and the interview; Calm and the self-checks close the tab.
    expect(screen.queryByTestId("practise-ethics")).toBeNull();
    for (const id of ["practise-extras", "entry-casebook", "entry-lab", "entry-ethics", "entry-interview", "wellbeing-extras", "entry-calm", "entry-selfcheck"]) expect(screen.getByTestId(id)).toBeTruthy();
    expect(screen.queryByTestId("practise-daily")).toBeNull();
    expect(screen.queryByText("120+ new cases")).toBeNull();
    expect(screen.getByTestId("hub-all-prep")).toBeTruthy();
    expect(screen.getByTestId("hub-prep-mock")).toBeTruthy();
  });
  it("puts each tool on its level", () => {
    expect(levelOf("terms")).toBe("basics");
    expect(levelOf("duel")).toBe("apply");
    expect(levelOf("daily")).toBe("cases");
    expect(levelOf("ward")).toBe("decisions");
    expect(levelOf("osce")).toBe("advanced");
    expect(levelOf("something-new")).toBe("advanced");
  });
  it("See all lists the whole group", async () => {
    await render(<PractiseGroup group="games" />);
    await waitFor(() => expect(screen.getByText("Comorbid")).toBeTruthy());
    for (const t of ["Blitz", "Criteria sort", "MSE Lab", "Ward Week", "Rx Detective", "Differential duel", "Team Escape Room"]) expect(screen.getByText(t)).toBeTruthy();
  });
  it("a level has its own page", async () => {
    await render(<PractiseGroup group="decisions" />);
    await waitFor(() => expect(screen.getByText("Ward Week")).toBeTruthy());
    expect(screen.getByText("What would you do?")).toBeTruthy();
    expect(screen.queryByText("Blitz")).toBeNull();
  });
});

describe("tool engine: the website's checks, on the phone", () => {
  it("Judgment calls score against the panel, with part marks next to it", () => {
    const panel = simulatedPanel("sct-1");
    const best = Math.max(...[-2, -1, 0, 1, 2].map((r) => scoreSct(r, panel)));
    expect(best).toBe(1);
    expect([-2, -1, 0, 1, 2].some((r) => scoreSct(r, panel) > 0 && scoreSct(r, panel) < 1)).toBe(true);
  });
  it("every tool builds cases from its server data, and no step's public part carries the answer", async () => {
    const tools: [import("@/practise/types").ToolId, string][] = [["wwyd", "wwyd"], ["say-it", "terms"], ["judgment", "judgment"], ["ethics", "ethics"], ["out-of-depth", "out-of-depth"], ["landmark", "landmark"], ["osce", "osce"], ["two-minute", "two-minute"], ["formulation", "formulation"], ["weak-spots", "weak-spots"], ["mse-trainer", "mse"]];
    for (const [id, api_] of tools) {
      const t = await api.get<C.PractiseTool>(`/practise/tools/${api_}`);
      const defs = buildDefs(id, t.data, "t");
      expect(defs.length).toBeGreaterThan(0);
      for (const d of defs) for (const k of d.steps) expect(JSON.stringify(k.pub)).not.toMatch(LEAKS);
    }
  });
  it("a pick is graded best, ok or harm as the website does", async () => {
    const t = await api.get<C.PractiseTool>("/practise/tools/wwyd");
    const k = buildDefs("wwyd", t.data)[0]!.steps[0]!;
    expect(grade(k, k.right[0]).score).toBe(1);
    const harm = k.verdicts!.indexOf("harm");
    expect(grade(k, harm).verdict).toBe("harm");
  });
});

describe("Blitz", () => {
  it("deals, answers and finishes", async () => {
    jest.useFakeTimers();
    try {
      await render(<BlitzGame />);
      await waitFor(() => expect(screen.getByTestId("start-rules")).toBeTruthy());
      await playFrom();
      await act(async () => {
        jest.advanceTimersByTime(3000);
      });
      await press("blitz-option-0");
      await waitFor(() => expect(screen.getByTestId("game-score")).toBeTruthy());
      await act(async () => {
        jest.advanceTimersByTime(61_000);
      });
      await waitFor(() => expect(screen.getByTestId("game-over")).toBeTruthy());
      expect(screen.getByText(/Right/)).toBeTruthy();
    } finally {
      jest.useRealTimers();
    }
  });
});

describe("Criteria sort", () => {
  it("places sixteen cards by tapping, checks and loses a try", async () => {
    await render(
      <GestureHandlerRootView>
        <SortGame />
      </GestureHandlerRootView>,
    );
    await playFrom();
    for (let i = 0; i < 16; i++) {
      await waitFor(() => expect(screen.getAllByTestId(/^sort-tile-/).length).toBe(1));
      await fireEvent.press(screen.getAllByTestId(/^sort-tile-/)[0]!);
      await fireEvent.press(screen.getByTestId(`sort-bin-${Math.floor(i / 4)}`));
    }
    await press("sort-check");
    await waitFor(() => expect(screen.getByText(/of 4 right|Board solved|Out of checks/)).toBeTruthy());
  });
});

describe("Rx Detective", () => {
  it("deals, picks every step and links a miss to How it works", async () => {
    await render(<RxGame />);
    await playFrom();
    for (let k = 0; k < 4; k++) {
      await press("rx-option-0");
      if (screen.queryByTestId("rx-next")) break;
    }
    await waitFor(() => expect(screen.getByTestId("rx-next")).toBeTruthy());
    expect(screen.getByTestId("verdict")).toBeTruthy();
    expect(screen.getByTestId("verdict-learn")).toBeTruthy();
  });
});

describe("MSE Lab", () => {
  it("marks the quote, tags a part and a word, and reveals", async () => {
    expect(segments("He sits slumped, hardly moving.", "sits slumped")).toEqual([
      { text: "He ", on: false },
      { text: "sits slumped", on: true },
      { text: ", hardly moving.", on: false },
    ]);
    await render(<MseGame />);
    await playFrom();
    await press("mse-domain-appearance");
    await press("mse-term-0");
    await waitFor(() => expect(screen.getByTestId("verdict")).toBeTruthy());
    expect(screen.getByTestId("mse-next")).toBeTruthy();
  });
});

describe("Ward Week", () => {
  it("starts a patient, makes a call and shows the dials move", async () => {
    await render(<WardGame />);
    await playFrom();
    await press("ward-option-0");
    await waitFor(() => expect(screen.getByTestId("verdict")).toBeTruthy());
    await press("ward-next");
    await waitFor(() => expect(screen.getByTestId("ward-option-0")).toBeTruthy());
  });
});

describe("Escape Room", () => {
  it("opens a door or adds time for a wrong try", async () => {
    await render(<EscapeGame />);
    await playFrom();
    await waitFor(() => expect(screen.getByTestId("escape-tick-0")).toBeTruthy());
    for (const j of [0, 1, 2]) await fireEvent.press(screen.getByTestId(`escape-tick-${j}`));
    await press("escape-submit");
    await waitFor(() => expect(screen.getByText(/The door opens|Still locked/)).toBeTruthy());
  });
});

describe("Differential duel", () => {
  it("plays a round against the bot", async () => {
    await render(<DuelGame />);
    await playFrom();
    await press("duel-dx-0");
    await press("duel-feature-0");
    await waitFor(() => expect(screen.getByTestId("duel-next")).toBeTruthy());
    expect(screen.getByTestId("duel-score")).toBeTruthy();
  });
});

describe("Comorbid", () => {
  it("deals a hand and plays a move", async () => {
    await render(<ComorbidGame />);
    await playFrom();
    await waitFor(() => expect(screen.getByText("Your hand")).toBeTruthy());
    const first = screen.getAllByTestId(/^co-card-/)[0]!;
    await fireEvent.press(first);
    await press("co-swap");
    await waitFor(() => expect(screen.getByText("Last moves")).toBeTruthy());
  });
});

describe("Case tools", () => {
  it("Daily case: a guess, then the answer on giving up", async () => {
    await render(<DailyCase />);
    await press("daily-guess");
    await waitFor(() => expect(screen.getByTestId("guess-input")).toBeTruthy());
    await fireEvent.changeText(screen.getByTestId("guess-input"), "panic");
    await press("guess-panic");
    await waitFor(() => expect(screen.getByText(/Your guesses/i)).toBeTruthy());
    await press("daily-giveup");
    await waitFor(() => expect(screen.getByTestId("game-over")).toBeTruthy());
    expect(screen.getByText("Why not the look-alikes")).toBeTruthy();
  });

  it("Clinic detective: a wrong guess opens the next clue", async () => {
    await render(<DetectiveCase />);
    await playFrom();
    await press("detective-option-0");
    await waitFor(() => expect(screen.getByText(/clue 2 of 4|on clue 1/)).toBeTruthy());
  });

  it("What would you do: opens on the next case, All cases lists them with marks, finish", async () => {
    await render(<ToolCaseScreen tool="wwyd" />);
    await press("tool-all-cases");
    await waitFor(() => expect(screen.getAllByLabelText("Done").length).toBeGreaterThan(0));
    await fireEvent.press(screen.getAllByTestId(/^tool-item-/)[0]!);
    await press("tool-option-0");
    await press("player-check");
    await waitFor(() => expect(screen.getByTestId("verdict")).toBeTruthy());
    while (screen.queryByTestId("tool-next")) {
      await press("tool-next");
      if (screen.queryByTestId("player-check")) {
        await press("tool-option-0");
        await press("player-check");
      }
    }
    await waitFor(() => expect(screen.getByText(/case done/i)).toBeTruthy());
  });

  it("Formulation: sorts every factor and checks", async () => {
    await render(<ToolCaseScreen tool="formulation" />);
    await waitFor(() => expect(screen.getByTestId("tool-bucket-0-0")).toBeTruthy());
    for (let i = 0; screen.queryByTestId(`tool-bucket-${i}-0`); i++) await fireEvent.press(screen.getByTestId(`tool-bucket-${i}-1`));
    await press("tool-submit");
    await waitFor(() => expect(screen.getByTestId("verdict")).toBeTruthy());
  });

  it("Judgment calls: one tap on the scale", async () => {
    await render(<ToolCaseScreen tool="judgment" />);
    await press("tool-scale-2");
    await waitFor(() => expect(screen.getAllByText(/panel/).length).toBeGreaterThan(0));
  });

  it("the case library lists every tool's cases with one tag each", async () => {
    await render(<CaseLibrary />);
    await waitFor(() => expect(screen.getByText("Landmark cases")).toBeTruthy());
    expect(screen.getAllByLabelText("New").length).toBeGreaterThan(0);
  });

  it("Two-minute clinic: write, then compare with the expert", async () => {
    await render(<ToolCaseScreen tool="two-minute" />);
    await waitFor(() => expect(screen.getByTestId("tool-write-0")).toBeTruthy());
    await fireEvent.changeText(screen.getByTestId("tool-write-0"), "Depression, adjustment disorder");
    await press("tool-submit");
    await waitFor(() => expect(screen.getByTestId("tool-compare")).toBeTruthy());
  });

  it("Say it clinically: a round of phrases", async () => {
    await render(<ToolCaseScreen tool="say-it" />);
    await press("tool-option-0");
    await press("player-check");
    await waitFor(() => expect(screen.getByTestId("verdict")).toBeTruthy());
  });
});

describe("Exam Prep", () => {
  it("lists subjects", async () => {
    await render(<PrepHome />);
    await waitFor(() => expect(screen.getByTestId("prep-statistics")).toBeTruthy());
    expect(screen.getByTestId("prep-long")).toBeTruthy();
    expect(screen.getByTestId("prep-more-mock")).toBeTruthy();
  });
  it("one question per screen, checked on the server, to the end", async () => {
    params.mockReturnValue({ subject: "statistics", topic: "descriptives", set: "1" });
    await render(<PrepSetScreen />);
    for (let k = 0; k < 10; k++) {
      if (screen.queryByTestId("game-over")) break;
      await press("prep-option-1");
      await press("player-check");
      await press("prep-next");
    }
    await waitFor(() => expect(screen.getByText(/set done/i)).toBeTruthy());
  });
  it("long answers: the model answer only on Show answer", async () => {
    const home = await api.get<C.PrepLong>("/prep/long");
    const subject = (home.data.subjects as { subject: string }[])[0]!.subject;
    const sub = await api.get<C.PrepLong>(`/prep/long/${subject}`);
    const topic = (sub.data.topics as { id: string }[])[0]!.id;
    const top = await api.get<C.PrepLong>(`/prep/long/${subject}/${topic}`);
    params.mockReturnValue({ subject, topic, id: (top.data.items as { id: string }[])[0]!.id });
    await render(<LongScreen />);
    await waitFor(() => expect(screen.getByTestId("long-show")).toBeTruthy());
    expect(screen.queryByTestId("long-answer")).toBeNull();
    await press("long-show");
    await waitFor(() => expect(screen.getByTestId("long-answer")).toBeTruthy());
  });
});
