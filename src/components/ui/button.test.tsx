// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders a button with its label", () => {
    render(<Button>Join waitlist</Button>);
    expect(screen.getByRole("button", { name: "Join waitlist" })).toBeInTheDocument();
  });

  it("carries the tactile neobrutalist default variant classes", () => {
    const { container } = render(<Button>Go</Button>);
    const btn = container.querySelector("button");
    expect(btn).toHaveClass("border-foreground", "bg-primary");
    expect(btn).toHaveClass("cursor-pointer", "duration-fast", "ease-snappy");
  });

  it("renders an anchor when used with asChild", () => {
    render(
      <Button asChild>
        <a href="/waitlist">Join waitlist</a>
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Join waitlist" })).toHaveAttribute("href", "/waitlist");
  });
});
