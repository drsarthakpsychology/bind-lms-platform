// @vitest-environment jsdom
/**
 * A checkpoint sitting asks only what is not yet right, and the saved score
 * is how many of ALL the checkpoint's questions are right now.
 */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { emptyState } from "@/lib/learn/engine";
import { getLearnState } from "@/lib/learn/store";
import { noteAnswers, resetHistoryCache, setHistoryTransport } from "@/lib/history/client";
import type { Mcq } from "@/lib/study/types";
import { CheckpointView } from "./checkpoint";
import { mcqKey } from "./interactive";

beforeAll(() => {
  window.matchMedia = ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} })) as unknown as typeof window.matchMedia;
  Element.prototype.scrollIntoView = () => {};
  setHistoryTransport({ load: async () => ({ owner: null, rows: [] }), record: async () => ({}) });
});
afterEach(() => {
  cleanup();
  window.localStorage.clear();
  resetHistoryCache();
});

const mcq: Mcq[] = ["Alpha", "Bravo", "Charlie"].map((q) => ({ q: `${q} question?`, options: ["right", "wrong", "other"], answer: 0 }));
const KEY = "mod~cp1";

function view() {
  return <CheckpointView moduleId="mod" moduleNum={1} moduleTitle="Mod" n={1} cpKey={KEY} covers={["1.1 One"]} mcq={mcq} recall={[]} then="/study/mod" serverState={{ ...emptyState(), owner: "u1" } as never} save={async () => ({ ok: true })} />;
}

function answerAll(pick: (q: string) => string) {
  for (;;) {
    const q = screen.getByText(/question\?$/).textContent ?? "";
    fireEvent.click(screen.getByRole("radio", { name: new RegExp(pick(q)) }));
    const submit = screen.queryByRole("button", { name: "Submit" });
    if (submit) return submit;
    fireEvent.click(screen.getByRole("button", { name: /Next/ }));
  }
}

describe("checkpoint retake", () => {
  it("skips the question already right and scores the whole checkpoint", () => {
    noteAnswers("study-check", [{ item: mcqKey(KEY, mcq[0]), correct: true }], { server: false });
    render(view());
    fireEvent.click(screen.getByRole("button", { name: /Start/ }));
    expect(screen.getByText("1 of 2")).toBeInTheDocument();
    expect(screen.queryByText("Alpha question?")).toBeNull();
    const submit = answerAll((q) => (q.startsWith("Bravo") ? "right" : "wrong"));
    // A double tap saves once.
    fireEvent.click(submit);
    fireEvent.click(submit);
    const t = getLearnState()?.study.tests[KEY];
    expect(t).toMatchObject({ best: 2, total: 3, tries: 1 });
    // Try again asks only the one still missed.
    fireEvent.click(screen.getByRole("button", { name: /missed ones again/ }));
    expect(screen.getByText("1 of 1")).toBeInTheDocument();
    expect(screen.getByText("Charlie question?")).toBeInTheDocument();
    fireEvent.click(answerAll(() => "right"));
    expect(getLearnState()?.study.tests[KEY]).toMatchObject({ best: 3, total: 3, tries: 2 });
    fireEvent.click(screen.getByRole("button", { name: /missed ones again/ }));
    expect(screen.getByText("Every question here is right now.")).toBeInTheDocument();
  });
});
