/**
 * Typed record shapes for the casebook A1 extractors — shared by the
 * dialogue extractor, the move-transition table and the case-report
 * extractor.
 *
 * Every extracted record carries a `layer` tag. The firewall
 * (src/lib/corpus/layers.ts) stays intact: clinical content can never voice
 * a patient, style can never supply a clinical fact. `layer` is applied at
 * record level here; the in-code firewall functions enforce the separation.
 */

/** A1 Extractor 2 — one counsellor–client exchange. */
export interface ExchangeRecord {
  /** Exchange id: <source>-<n>. */
  id: string;
  /** "clinical" (dialogue is clinical interaction data). */
  layer: "clinical";
  /** source document, e.g. "samhsa/tip35", "mhgap", "gutenberg/84". */
  source: string;
  /** dialogue context: what the session is about (from surrounding text). */
  context: string;
  /** one or more consecutive utterances (odd = counsellor, even = client). */
  exchange: ExchangeTurn[];
  /** what the counsellor noticed, if inferable; else null. */
  what_the_counsellor_noticed: string | null;
  /** optional editorial commentary. */
  commentary: string | null;
}

/** One utterance inside an exchange. */
export interface ExchangeTurn {
  /** "counsellor" | "client" | "unknown". */
  speaker: "counsellor" | "client" | "unknown";
  /** the utterance text (verbatim, lightly trimmed). */
  text: string;
  /** classified move — see MOVE_CLASSIFICATION. */
  move: CounsellorMove | ClientResponse | "unknown";
  /** heuristic confidence: manual when the label was explicit. */
  quality: "manual" | "heuristic";
}

/** A1 Extractor 1 — one case report. */
export interface CaseReportRecord {
  /** Case id: <source>-<n>. */
  id: string;
  /** "clinical". */
  layer: "clinical";
  /** source document, e.g. "pmc/PMC12345678". */
  source: string;
  presentation: string;
  demographics: string;
  timeline: string;
  prior_contacts: string;
  examination: string;
  differential_considered: string;
  final_picture: string;
  what_was_missed_initially: string;
  why_it_was_missed: string;
  discriminating_feature: string;
  management: string;
  outcome_at_followup: string;
  /** the published discussion/learning-points section (what experts said). */
  discussion?: string;
}

/** Classified counsellor moves. */
export const COUNSELLOR_MOVES = [
  "open_question",
  "closed_question",
  "reflection",
  "validation",
  "summary",
  "interpretation",
  "psychoeducation",
  "premature_advice",
  "confrontation",
] as const;
export type CounsellorMove = (typeof COUNSELLOR_MOVES)[number];

/** Classified client responses. */
export const CLIENT_RESPONSES = [
  "full_disclose",
  "partial_disclose",
  "one_word",
  "deflect",
  "question",
  "emotional_release",
] as const;
export type ClientResponse = (typeof CLIENT_RESPONSES)[number];

export const isCounsellorMove = (m: string): m is CounsellorMove =>
  (COUNSELLOR_MOVES as readonly string[]).includes(m);
export const isClientResponse = (m: string): m is ClientResponse =>
  (CLIENT_RESPONSES as readonly string[]).includes(m);

/** Move-transition table row (counsellor-move → client-response). */
export interface MoveTransitionRow {
  counsellor_move: CounsellorMove;
  client_response: ClientResponse;
  count: number;
  disclosed_new_pct: number;
}

/** One extracted exchange, as it lands on the JSONL line. */
export type ExchangeJSONLine = ExchangeRecord;
