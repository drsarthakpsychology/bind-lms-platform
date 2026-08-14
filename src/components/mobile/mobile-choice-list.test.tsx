// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MobileChoiceList } from "./mobile-choice-list";

/**
 * MobileChoiceList — the shared option-row interaction. Tests cover the radio
 * role + aria-checked contract, the reveal states (correct check / wrong x),
 * and the disabled-after-reveal behavior shared by every drill.
 */
describe("MobileChoiceList", () => {
  const options = ["Ink", "Peach", "Cream"];

  it("renders a radiogroup with one radio per option", () => {
    render(
      <MobileChoiceList
        options={options}
        correct={[0]}
        picked={[]}
        revealed={false}
        onPick={() => {}}
        label="Which is primary?"
      />,
    );
    expect(screen.getByRole("radiogroup", { name: "Which is primary?" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("fires onPick with the option index", () => {
    const onPick = vi.fn();
    render(
      <MobileChoiceList
        options={options}
        correct={[0]}
        picked={[]}
        revealed={false}
        onPick={onPick}
        label="Pick"
      />,
    );
    fireEvent.click(screen.getByRole("radio", { name: "Peach" }));
    expect(onPick).toHaveBeenCalledWith(1);
  });

  it("shows a correct check on the right answer when revealed", () => {
    render(
      <MobileChoiceList
        options={options}
        correct={[0]}
        picked={[0]}
        revealed={true}
        onPick={() => {}}
        label="Pick"
      />,
    );
    expect(screen.getByLabelText("Correct")).toBeInTheDocument();
  });

  it("disables options after reveal so the answer is locked in", () => {
    render(
      <MobileChoiceList
        options={options}
        correct={[0]}
        picked={[1]}
        revealed={true}
        onPick={() => {}}
        label="Pick"
      />,
    );
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toBeDisabled();
    }
  });

  it("renders checkboxes (aria-checked, no radiogroup) in multi mode", () => {
    render(
      <MobileChoiceList
        options={options}
        correct={[0, 2]}
        picked={[0]}
        revealed={false}
        onPick={() => {}}
        label="Select all"
        multi
      />,
    );
    expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
    const checks = screen.getAllByRole("checkbox");
    expect(checks).toHaveLength(3);
    expect(checks[0]).toHaveAttribute("aria-checked", "true");
  });
});
