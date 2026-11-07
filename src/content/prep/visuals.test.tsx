// @vitest-environment jsdom
/**
 * Every diagram attached to an Exam Prep question renders through the Study
 * widget without throwing, uses a real widget kind, names real brain parts,
 * and follows the student-text rules (no em or en dashes, no citations).
 */
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { Widget } from "@/components/study/widgets";
import type { PrepVisual } from "@/lib/prep/types";
import type { FlowData, WidgetData, WidgetKind } from "@/lib/study/types";
import { ALL_QUESTIONS } from "./index";
import { ASSIGNED } from "./visuals/assigned";
import { CONCEPTS } from "./visuals";

const KINDS = ["guess", "decide", "sort", "build", "moodline", "worked", "synapse", "reveal", "flow", "curve", "layers", "brainmap", "journey", "neuron", "pathways", "receptor", "conditioning", "memoryflow", "stress", "timeline", "compare", "attention", "dissonance", "conservation", "experiment", "release", "thoughtrecord", "hypnogram", "strange", "illusion", "nervoussystem", "brainexplorer", "actionpotential", "synapse3d", "genogram", "hpaloop", "brainslicer", "amesroom", "figure"] as const satisfies readonly WidgetKind[];
// Fails to compile if a WidgetKind is missing from the list above.
const allKinds: Exclude<WidgetKind, (typeof KINDS)[number]> extends never ? true : false = true;

const REGIONS = new Set(["frontal", "prefrontal", "motor", "sensory", "parietal", "occipital", "temporal", "broca", "wernicke", "cerebellum", "brainstem", "corpus-callosum", "thalamus", "hypothalamus", "basal-ganglia", "amygdala", "hippocampus"]);
const BANNED = [/\bet al\.?/, /https?:\/\//, /\bdoi\b/i, /\bpp?\.\s?\d+/, /\b(Kaplan|Sadock|Stahl'?s|Maudsley|Ahuja|Hilgard|Lancet|JAMA|NEJM|Cochrane|Prescriber'?s Guide)\b/, /\b\d+(st|nd|rd|th) (ed\.|edition)\b/i];

beforeAll(() => {
  window.matchMedia = window.matchMedia || ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }) as unknown as MediaQueryList);
});
afterEach(cleanup);

const attached = ALL_QUESTIONS.filter((q) => q.visual);
/** Each distinct visual once (shared concepts are the same object), plus every concept in the library. */
const unique = [...new Set<PrepVisual>([...attached.map((q) => q.visual!), ...CONCEPTS.map((c) => c.v)])];

describe("exam prep diagrams", () => {
  it("cover at least 1,500 questions across every subject", () => {
    expect(allKinds).toBe(true);
    expect(attached.length).toBeGreaterThanOrEqual(1500);
    const subjects = new Set(attached.map((q) => q.subject));
    expect(subjects.size).toBeGreaterThanOrEqual(20);
  });

  it("point at real questions and real concepts", () => {
    const ids = new Set(ALL_QUESTIONS.map((q) => q.id));
    const concepts = new Set(CONCEPTS.map((c) => c.id));
    expect(new Set(CONCEPTS.map((c) => c.id)).size).toBe(CONCEPTS.length);
    const bad = Object.entries(ASSIGNED).filter(([id, c]) => !ids.has(id) || !concepts.has(c));
    expect(bad).toEqual([]);
  });

  it("use real widget kinds and valid data", () => {
    const problems: string[] = [];
    for (const v of unique) {
      const d = v.data as Record<string, unknown>;
      const tag = `${v.kind}: ${String(d.title ?? d.prompt ?? d.caption ?? "").slice(0, 50)}`;
      if (!(KINDS as readonly string[]).includes(v.kind)) problems.push(`${tag} unknown kind`);
      if ((v.kind === "brainmap" || v.kind === "brainexplorer") && Array.isArray(d.focus)) {
        for (const r of d.focus as string[]) if (!REGIONS.has(r)) problems.push(`${tag} unknown region ${r}`);
        if (v.kind === "brainmap") for (const r of d.focus as string[]) if (!(d.notes as Record<string, string>)?.[r]) problems.push(`${tag} no note for ${r}`);
      }
      if (v.kind === "flow") {
        const f = v.data as FlowData;
        if (f.layout === "cycle" && f.nodes.length > 6) problems.push(`${tag} cycle too big`);
        if (f.layout === "tree" && f.nodes.filter((n) => !n.parent).length !== 1) problems.push(`${tag} tree needs one root`);
        if (f.layout === "tree") for (const n of f.nodes) if (n.parent && !f.nodes.some((m) => m.id === n.parent)) problems.push(`${tag} bad parent ${n.parent}`);
      }
      if (v.kind === "experiment") {
        const max = (d.max as number | undefined) ?? (d.unit === "%" ? 100 : Infinity);
        for (const c of d.conditions as { value: number }[]) if (c.value > max) problems.push(`${tag} value over max`);
      }
      if (v.kind === "timeline" && (d.events as unknown[]).length < 2) problems.push(`${tag} needs two events`);
      const text = JSON.stringify(v);
      if (/[–—]/.test(text)) problems.push(`${tag} has an em or en dash`);
      for (const re of BANNED) if (re.test(text)) problems.push(`${tag} cites ${re}`);
    }
    expect(problems).toEqual([]);
  });

  it("render through the Study widget without errors", () => {
    const broken: string[] = [];
    for (const v of unique) {
      try {
        const { unmount } = render(<Widget kind={v.kind} data={v.data as WidgetData} />);
        unmount();
      } catch (e) {
        broken.push(`${v.kind}: ${(e as Error).message.slice(0, 160)}`);
      }
    }
    expect(broken).toEqual([]);
    expect(unique.length).toBeGreaterThan(100);
  }, 120_000);
});
