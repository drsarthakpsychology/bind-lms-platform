import { describe, expect, it } from "vitest";
import { CFI_SCENARIOS, isDismissive, isEliciting, scoreCfiQuestion } from "./cfi";

describe("CFI practice", () => {
  it("covers the cultural attributions", () => {
    const ids = CFI_SCENARIOS.map((s) => s.id);
    expect(ids).toContain("cfi-nazar");
    expect(ids).toContain("cfi-possession");
    expect(ids).toContain("cfi-dhat");
  });

  it("detects the dismissive/correcting failure mode", () => {
    expect(isDismissive("That's not true, it's just stress.")).toBe(true);
    expect(isDismissive("There's no such thing as the evil eye.")).toBe(true);
    expect(isDismissive("Tell me more about what you believe.")).toBe(false);
  });

  it("detects eliciting questions", () => {
    expect(isEliciting("What do you think is causing this?")).toBe(true);
    expect(isEliciting("How has the temple helped?")).toBe(true);
    expect(isEliciting("You should stop seeing the baba.")).toBe(false);
  });

  it("scores a question correctly", () => {
    const eliciting = scoreCfiQuestion("What do you think is happening to your son?");
    expect(eliciting.eliciting).toBe(true);
    expect(eliciting.dismissive).toBe(false);
    const dismissive = scoreCfiQuestion("It's not possession, it's a medical condition.");
    expect(dismissive.dismissive).toBe(true);
  });
});
