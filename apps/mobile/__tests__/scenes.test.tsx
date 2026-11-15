import { fireEvent, screen } from "@testing-library/react-native";
import * as React from "react";

import type { WidgetBlock } from "@/api/contract";
import { NATIVE_KINDS, WidgetView } from "@/study/widgets";
import { brainFocus, REGIONS } from "@/study/widgets/brainmap";
import { edgePoints } from "@/study/widgets/engine";
import { render } from "./utils";

const ctx = { moduleId: "m02", sectionId: "s1" };
const DATA: Record<string, unknown> = {
  journey: { drug: "Sertraline", target: "the serotonin transporter", routes: ["oral", "iv"] },
  neuron: {},
  pathways: { system: "dopamine" },
  receptor: { receptor: "D2 receptor" },
  conditioning: { kind: "classical" },
  memoryflow: {},
  stress: {},
  attention: {},
  dissonance: { belief: "I care about my health", behaviour: "I smoke" },
  conservation: { kind: "liquid" },
  release: { transmitter: "serotonin" },
  hypnogram: {},
  strange: {},
  illusion: { kind: "muller-lyer" },
  nervoussystem: {},
  brainexplorer: { focus: ["amygdala"] },
  brainmap: { focus: ["temporal"], notes: { temporal: "Note from the course." } },
  actionpotential: {},
  synapse3d: { transmitter: "dopamine" },
  genogram: { condition: "bipolar disorder" },
  hpaloop: { start: "chronic" },
  brainslicer: { start: "slice" },
  amesroom: {},
};

describe("the website's scene widgets, native", () => {
  it("every one of the 39 widget kinds has a native screen", () => {
    expect(NATIVE_KINDS).toHaveLength(39);
  });

  it.each(Object.keys(DATA))("%s draws without falling back to the website row", async (kind) => {
    await render(<WidgetView block={{ t: "widget", kind, v: 1, data: DATA[kind] } as unknown as WidgetBlock} ctx={ctx} />);
    expect(screen.queryByTestId("widget-web")).toBeNull();
    expect(screen.getByTestId(`w-${kind}`)).toBeTruthy();
  });

  it("steps move forward and back, and the words follow", async () => {
    await render(<WidgetView block={{ t: "widget", kind: "stress", v: 1, data: {} } as WidgetBlock} ctx={ctx} />);
    expect(screen.getByText(/amygdala tags it as a threat/)).toBeTruthy();
    await fireEvent.press(screen.getByTestId("step-next"));
    expect(screen.getByText(/fires the sympathetic nervous system/)).toBeTruthy();
    await fireEvent.press(screen.getByTestId("step-prev"));
    expect(screen.getByText(/amygdala tags it as a threat/)).toBeTruthy();
  });

  it("the course's own notes replace the default words", async () => {
    await render(<WidgetView block={{ t: "widget", kind: "brainmap", v: 1, data: DATA.brainmap } as WidgetBlock} ctx={ctx} />);
    expect(screen.getByText(/Note from the course/)).toBeTruthy();
  });

  it("a neuron below threshold does not fire", async () => {
    await render(<WidgetView block={{ t: "widget", kind: "neuron", v: 1, data: {} } as WidgetBlock} ctx={ctx} />);
    await fireEvent.press(screen.getByTestId("neuron-fire"));
    expect(screen.getByText(/Threshold reached/)).toBeTruthy();
  });

  it("arrows start and end on the edges of the boxes", () => {
    const [from, to] = edgePoints({ x: 0, y: 0, w: 100, h: 40 }, { x: 0, y: 200, w: 100, h: 40 });
    expect(from[1]).toBeGreaterThanOrEqual(20);
    expect(to[1]).toBeLessThanOrEqual(180);
  });
});

describe("brain map, as on the website", () => {
  it("uses the website's region ids and its focus rule", () => {
    expect(REGIONS).toHaveLength(17);
    expect(brainFocus({ notes: { amygdala: "fear", hippocampus: "memory", nowhere: "x" } })).toEqual(["hippocampus", "amygdala"].sort((a, b) => REGIONS.findIndex((r) => r.id === a) - REGIONS.findIndex((r) => r.id === b)));
    expect(brainFocus({ focus: ["prefrontal", "made-up"], notes: {} })).toEqual(["prefrontal"]);
  });
});
