import { describe, expect, it } from "vitest";
import { MEDS } from "./index";
import { studyModuleFor } from "./study-link";
import { moduleById } from "@/lib/study";

describe("every medicine links to the Study module that teaches it", () => {
  it("each medicine's module exists", () => {
    for (const m of MEDS) expect(moduleById(studyModuleFor(m)), `${m.id} -> ${studyModuleFor(m)}`).toBeTruthy();
  });

  it("by group, and the mixed group by medicine", () => {
    const of = (id: string) => studyModuleFor(MEDS.find((m) => m.id === id)!);
    expect(of("sertraline")).toBe("antidepressants");
    expect(of("clozapine")).toBe("antipsychotics");
    expect(of("lithium")).toBe("stabilisers");
    expect(of("lorazepam")).toBe("stabilisers");
    expect(of("naltrexone")).toBe("substance");
    expect(of("donepezil")).toBe("neurocognitive");
    expect(of("methylphenidate")).toBe("child");
  });
});
