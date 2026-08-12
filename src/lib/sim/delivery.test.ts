/**
 * BUG 1 REGRESSION — stage directions must be BEHAVIOUR, never text.
 */

import { describe, expect, it } from "vitest";
import { parseDelivery, deliveryLabel, type DeliveryCue } from "./delivery";

describe("parseDelivery — stage directions become cues, never words", () => {
  it("extracts (pauses) into a delivery cue and cleans the speech", () => {
    const raw = "No, nothing like this. Two years ago we… (pauses) No. It's just this.";
    const parsed = parseDelivery(raw);
    // Clean speech has NO literal "(pauses)".
    expect(parsed.content).not.toContain("(pauses)");
    expect(parsed.content).toContain("Two years ago");
    expect(parsed.content).toContain("No, nothing like this.");
    const pause = parsed.delivery.find((d) => d.kind === "pause");
    expect(pause).toBeDefined();
    expect(pause!.seconds).toBeGreaterThanOrEqual(1.5);
  });

  it("handles all marker forms across the Actor's closed set", () => {
    const raw = "(sighs) I'm fine. (long silence) *laughs* [hesitates] (voice breaks)";
    const parsed = parseDelivery(raw);
    const kinds = parsed.delivery.map((d) => d.kind);
    expect(kinds).toContain("sigh");
    expect(kinds).toContain("long_silence");
    expect(kinds).toContain("laughs");
    expect(kinds).toContain("hesitates");
    expect(kinds).toContain("voice_breaks");
    // The only words left are the actual speech.
    expect(parsed.content).toBe("I'm fine.");
  });

  it("records positions so the UI can pause at the right place", () => {
    const raw = "First. (pauses) Second.";
    const parsed = parseDelivery(raw);
    const pause = parsed.delivery.find((d) => d.kind === "pause")!;
    // The pause sits between the two sentences.
    expect(pause.position).toBeGreaterThanOrEqual(0);
    expect(parsed.content).toContain("First.");
    expect(parsed.content).toContain("Second.");
    // Both words survive — the pause is a cue, not a deletion.
    expect(parsed.content.split(" ").length).toBeGreaterThanOrEqual(2);
  });

  it("never deletes content it doesn't understand (fail-safe)", () => {
    const raw = "I have a (mystery-marker) in my sentence.";
    const parsed = parseDelivery(raw);
    // Unknown markers stay in the text — never lose the patient's words.
    expect(parsed.content).toContain("mystery-marker");
    expect(parsed.unparsed.length).toBeGreaterThanOrEqual(1);
  });

  it("deliveryLabel renders cues readably for logs", () => {
    const cues: DeliveryCue[] = [{ kind: "pause", position: 4, seconds: 2 }, { kind: "sigh", position: 20, seconds: 1 }];
    expect(deliveryLabel(cues)).toContain("pause@4");
    expect(deliveryLabel(cues)).toContain("sigh@20");
  });
});