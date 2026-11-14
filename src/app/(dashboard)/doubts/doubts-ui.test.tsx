// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const reply = vi.fn(async () => ({ error: null as string | null }));
const solve = vi.fn(async () => ({ error: "Only the person who asked can mark it solved." as string | null }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }) }));
vi.mock("./actions", () => ({
  askDoubt: vi.fn(),
  replyToDoubt: (...a: unknown[]) => reply(...(a as [])),
  markSolved: (...a: unknown[]) => solve(...(a as [])),
  reclassifyMine: vi.fn(async () => ({ error: null })),
  voteReply: vi.fn(async () => ({ error: null })),
}));

import { DoubtsBoard, DoubtThreadView } from "./doubts-ui";
import type { DoubtListItem, DoubtThread } from "@/lib/doubts/data";

const item = (over: Partial<DoubtListItem>): DoubtListItem => ({ id: "d", title: "Mood vs affect", topic: null, kind: "doubt", status: "open", cohortId: null, author: "Asha", mine: false, replies: 0, createdAt: "2026-11-14T05:00:00Z", ...over });
const thread = (over: Partial<DoubtThread>): DoubtThread => ({ id: "t1", title: "Fee receipt missing", body: "", topic: null, kind: "complaint", status: "open", cohortId: null, author: "Asha", mine: true, createdAt: "2026-11-14T05:00:00Z", replies: [], ...over });

describe("Doubts board", () => {
  it("Unanswered lists only doubts nobody has answered", () => {
    render(<DoubtsBoard items={[item({ id: "a", title: "No answers yet" }), item({ id: "b", title: "Has two answers", replies: 2 })]} canAskCohort={null} />);
    fireEvent.click(screen.getByRole("button", { name: "Unanswered" }));
    expect(screen.getByText("No answers yet")).toBeInTheDocument();
    expect(screen.queryByText("Has two answers")).not.toBeInTheDocument();
  });

  it("an empty filter says what it is about", () => {
    render(<DoubtsBoard items={[]} canAskCohort={null} />);
    fireEvent.click(screen.getByRole("button", { name: "My concerns" }));
    expect(screen.getByText("You have not sent the VIBHA team a concern.")).toBeInTheDocument();
  });
});

describe("Doubt thread", () => {
  it("the writer of a private concern can answer the team back", async () => {
    render(<DoubtThreadView thread={thread({ replies: [{ id: "r1", author: "VIBHA team", mine: false, body: "Which month?", votes: 0, youVoted: false, isSolution: false, createdAt: "2026-11-14T06:00:00Z" }] })} cohortId={null} />);
    fireEvent.change(screen.getByLabelText("Add to your message"), { target: { value: "October" } });
    fireEvent.click(screen.getByRole("button", { name: /Send/ }));
    await waitFor(() => expect(reply).toHaveBeenCalledWith("t1", "October"));
  });

  it("someone else's concern has no reply box", () => {
    render(<DoubtThreadView thread={thread({ mine: false })} cohortId={null} />);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("a failed button shows its reason", async () => {
    render(<DoubtThreadView thread={thread({ kind: "doubt", replies: [{ id: "r1", author: "Ravi", mine: false, body: "Affect is observed.", votes: 0, youVoted: false, isSolution: false, createdAt: "2026-11-14T06:00:00Z" }] })} cohortId={null} />);
    fireEvent.click(screen.getByRole("button", { name: "Mark as solved" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Only the person who asked can mark it solved.");
  });
});
