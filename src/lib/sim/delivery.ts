/**
 * STAGE-DIRECTION PARSER (Bug 1 — "stage directions leaking as text").
 *
 * The Actor's output may contain behaviour markers inside the spoken line:
 *   (pauses) (sighs) (long silence) (looks away) (voice breaks) *laughs* [hesitates]
 * These are NOT words the patient says — they are delivery. This module
 * extracts them from the text into a structured `delivery[]` array, leaving
 * a CLEAN spoken `content`. The UI renders delivery as BEHAVIOUR:
 *   - a real typing-pause of 1.5-3s at the marker's position,
 *   - an em-dash / ellipsis in the transcript,
 *   - a genuine silence in TTS.
 *
 * The ALLOWED markers are the closed set the Actor prompt specifies; anything
 * outside it is left in the text (fail-safe, never silent-loses-content).
 */

export type DeliveryKind =
  | "pause"
  | "long_silence"
  | "sigh"
  | "looks_away"
  | "voice_breaks"
  | "laughs"
  | "hesitates";

export interface DeliveryCue {
  kind: DeliveryKind;
  /** Character offset in the ORIGINAL text (for position mapping). */
  position: number;
  /** Approx seconds this cue should hold in the UI/TTS render. */
  seconds: number;
}

export interface ParsedTurn {
  /** The clean spoken words — no markers, no parens. */
  content: string;
  /** Behaviour cues, in order, with positions. */
  delivery: DeliveryCue[];
  /** Markers the parser did NOT recognise and left in content. */
  unparsed: string[];
}

const MARKERS: Array<{ re: RegExp; kind: DeliveryKind; seconds: number }> = [
  { re: /\(long silence\)/g, kind: "long_silence", seconds: 3 },
  { re: /\(pauses\)/g, kind: "pause", seconds: 2 },
  { re: /\(pause\)/g, kind: "pause", seconds: 1.5 },
  { re: /\(sighs\)/g, kind: "sigh", seconds: 1 },
  { re: /\(sigh\)/g, kind: "sigh", seconds: 1 },
  { re: /\(looks away\)/g, kind: "looks_away", seconds: 1.5 },
  { re: /\(voice breaks\)/g, kind: "voice_breaks", seconds: 1.5 },
  { re: /\(voice cracking\)/g, kind: "voice_breaks", seconds: 1.5 },
  { re: /\(crying\)/g, kind: "voice_breaks", seconds: 1.5 },
  { re: /\(laughs\)/g, kind: "laughs", seconds: 1 },
  { re: /\(laughs? (wet|dry|softly|quietly)\)/g, kind: "laughs", seconds: 1.5 },
  { re: /\*laughs\*/g, kind: "laughs", seconds: 1 },
  { re: /\[hesitates\]/g, kind: "hesitates", seconds: 1.5 },
  { re: /\[long pause\]/g, kind: "long_silence", seconds: 3 },
  { re: /\(stops\)/g, kind: "pause", seconds: 1.5 },
  { re: /\(long pause\)/g, kind: "long_silence", seconds: 3 },
  { re: /\(\.\.\.\)/g, kind: "pause", seconds: 1.5 },
];

/**
 * Parse a raw Actor reply into clean content + delivery cues.
 * Markers are removed from the text; their positions recorded against the
 * ORIGINAL string so rendering maps them onto the clean text accurately
 * (offset = where the pause sits relative to the words that remain).
 */
export function parseDelivery(raw: string): ParsedTurn {
  let content = raw;
  const delivery: DeliveryCue[] = [];
  const unparsed: string[] = findUnparsedMarkers(raw);

  for (const m of MARKERS) {
    // Find-and-remove loop for this marker type.
    let match: RegExpExecArray | null;
    m.re.lastIndex = 0;
    while ((match = m.re.exec(content)) !== null) {
      const position = match.index;
      delivery.push({ kind: m.kind, position, seconds: m.seconds });
      // Remove the marker from the text (single occurrence).
      content = content.slice(0, position) + content.slice(position + match[0].length);
      // Reset the regex so positions stay correct for subsequent matches.
      m.re.lastIndex = position;
    }
  }

  // Clean up leftover artifacts: stray brackets not matching our set stay as
  // unparsed (never delete content we don't understand).
  const contentFinal = content
    .replace(/\(\.\.\.\)/g, "…")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.!?])/g, "$1")
    .replace(/\s*…\s*/g, " … ")
    .replace(/\s*—\s*/g, " — ")
    .trim();

  return { content: contentFinal, delivery, unparsed };
}

/** Detect marker-LIKE tokens the closed set didn't cover (fail-safe audit). */
export function findUnparsedMarkers(raw: string): string[] {
  const out = new Set<string>();
  const re = /\(([^)]{1,40})\)|\*([^*]{1,40})\*|\[([^\]]{1,40})\]/g;
  const KNOWN = new Set(MARKERS.map((m) => m.kind));
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    const inner = (m[1] ?? m[2] ?? m[3] ?? "").toLowerCase().trim();
    // Record ANY bracketed token the closed set doesn't cover — the fail-safe
    // is: never silently lose content, and surface unparsed markers for the
    // audit trail.
    if (inner && !KNOWN.has(inner as DeliveryKind)) out.add(inner);
  }
  return [...out];
}

/** Serialise delivery cues back into a readable form (used in logs/audit). */
export function deliveryLabel(d: DeliveryCue[]): string {
  return d.map((c) => `${c.kind}@${c.position}(${c.seconds}s)`).join(", ");
}