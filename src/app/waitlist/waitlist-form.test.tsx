// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./actions", () => ({ submitWaitlist: vi.fn(() => Promise.reject(new TypeError("Failed to fetch"))) }));
vi.mock("@/lib/analytics", () => ({ trackEvent: vi.fn() }));

import { WaitlistForm } from "./waitlist-form";

describe("WaitlistForm", () => {
  it("shows an error and frees the button when the request cannot be sent", async () => {
    const { container } = render(<WaitlistForm />);
    fireEvent.submit(container.querySelector("form")!);
    expect(await screen.findByRole("alert")).toHaveTextContent("Your request was not sent");
    await waitFor(() => expect(screen.getByRole("button", { name: /Send my request/ })).not.toBeDisabled());
  });
});
