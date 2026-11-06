// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const draft = vi.fn(async () => ({ error: null, text: "Mania lasts at least a week." }));
const reply = vi.fn(async () => ({ error: null }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock("@/app/(dashboard)/admin/inbox/actions", () => ({
  draftDoubtAnswer: (...a: unknown[]) => draft(...(a as [])),
  replyFromInbox: (...a: unknown[]) => reply(...(a as [])),
  replyEmailFromInbox: vi.fn(async () => ({ error: null })),
}));

import { InlineReply } from "./inbox-reply";

describe("InlineReply", () => {
  it("shows nothing to a view-only admin", () => {
    const { container } = render(<InlineReply target="doubt" id="d1" label="Reply to Priya" canWrite={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("opens to a reply box; AI only fills the box and never sends", async () => {
    render(<InlineReply target="doubt" id="d1" label="Reply to Priya" canWrite />);
    fireEvent.click(screen.getByRole("button", { name: "Reply" }));
    const box = screen.getByLabelText("Reply to Priya");
    fireEvent.click(screen.getByRole("button", { name: /Draft with AI/ }));
    await waitFor(() => expect(box).toHaveValue("Mania lasts at least a week."));
    expect(screen.getByText(/AI draft\. Check the facts/)).toBeInTheDocument();
    expect(reply).not.toHaveBeenCalled();
  });

  it("has no AI button for email replies", () => {
    render(<InlineReply target="email" id="e1" label="Reply to a@b.c" canWrite />);
    fireEvent.click(screen.getByRole("button", { name: "Reply" }));
    expect(screen.queryByRole("button", { name: /Draft with AI/ })).toBeNull();
  });
});
