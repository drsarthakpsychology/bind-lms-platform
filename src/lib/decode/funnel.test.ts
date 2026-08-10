import { describe, expect, it } from "vitest";
import { classifyFunnelStep, scoreFunnelQuestion, funnelComplete, isClosedQuestion } from "./funnel";

describe("funnel", () => {
  it("classifies the six step types", () => {
    expect(classifyFunnelStep("Tell me more about that.")).toBe("open");
    expect(classifyFunnelStep("When you say fresh, what do you mean?")).toBe("specify");
    expect(classifyFunnelStep("Walk me through yesterday morning.")).toBe("instantiate");
    expect(classifyFunnelStep("How many days in the last two weeks?")).toBe("quantify");
    expect(classifyFunnelStep("What does it stop you doing?")).toBe("contextualise");
    expect(classifyFunnelStep("What do you think is causing it?")).toBe("attribute");
  });

  it("instantiate scores highest, closed questions lowest", () => {
    const instantiate = scoreFunnelQuestion("Walk me through yesterday morning.", new Set());
    const closed = scoreFunnelQuestion("Are you feeling sad?", new Set());
    expect(instantiate.value).toBeGreaterThan(closed.value);
    expect(closed.value).toBeLessThan(0.5);
  });

  it("repeating a used step earns less (efficiency)", () => {
    const first = scoreFunnelQuestion("Walk me through yesterday morning.", new Set());
    const again = scoreFunnelQuestion("Walk me through yesterday evening.", new Set(["instantiate"]));
    expect(again.value).toBeLessThan(first.value);
  });

  it("closed questions are detected", () => {
    expect(isClosedQuestion("Are you sad?")).toBe(true);
    expect(isClosedQuestion("Walk me through yesterday morning.")).toBe(false);
  });

  it("the funnel is complete at 4+ distinct steps", () => {
    const steps = ["open", "specify", "instantiate", "quantify"] as const;
    expect(funnelComplete([...steps]).complete).toBe(true);
    expect(funnelComplete(["open", "specify"]).complete).toBe(false);
  });
});
