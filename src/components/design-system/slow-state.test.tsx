// @vitest-environment jsdom
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoadingFrame, SlowState } from "./slow-state";

describe("SlowState", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("stays quiet, then says it's slow after 3 s, then offers Try again", () => {
    render(<SlowState />);
    expect(screen.queryByText(/slower than usual/)).toBeNull();
    act(() => vi.advanceTimersByTime(2999));
    expect(screen.queryByText(/slower than usual/)).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByText("Still loading — this is slower than usual")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Try again/ })).toBeNull();
    act(() => vi.advanceTimersByTime(12000));
    expect(screen.getByRole("button", { name: /Try again/ })).toBeInTheDocument();
  });

  it("wraps a skeleton without hiding it", () => {
    render(
      <LoadingFrame>
        <div data-testid="skel" />
      </LoadingFrame>,
    );
    expect(screen.getByTestId("skel")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByRole("status")).toHaveTextContent(/slower than usual/);
  });
});
