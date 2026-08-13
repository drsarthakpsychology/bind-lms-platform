// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress } from "./progress";

describe("Progress", () => {
  it("renders an accessible progressbar", () => {
    const { container } = render(<Progress value={42} />);
    const bar = container.querySelector('[data-slot="progress"]');
    expect(bar).toBeTruthy();
    expect(bar).toHaveAttribute("role", "progressbar");
  });

  it("renders the primary fill indicator", () => {
    const { container } = render(<Progress value={50} />);
    const indicator = container.querySelector('[data-slot="progress-indicator"]');
    expect(indicator).toBeTruthy();
    expect(indicator).toHaveClass("bg-primary");
  });

  it("renders with no value (treats it as zero, no crash)", () => {
    const { container } = render(<Progress />);
    expect(container.querySelector('[data-slot="progress"]')).toBeTruthy();
  });
});
