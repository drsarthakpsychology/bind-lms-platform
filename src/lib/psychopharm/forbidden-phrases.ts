/**
 * Rule 5 — non-prescriber language, enforced by test.
 *
 * A student of this tool must never read a string that sounds like a
 * prescription, a dose instruction, or a reason to change a client's
 * medication. The tool's users do not prescribe and never may.
 *
 * The test (tests/psychopharm/forbidden-phrases.test.ts) scans every
 * student-visible content field and fails the build if any forbidden string
 * appears. This list is a seed — extend it as the data grows.
 */

export const FORBIDDEN_PHRASES: string[] = [
  // Dose / titration language
  "recommended dose",
  "recommended dosage",
  "start at",
  "start with",
  "titrate to",
  "titrate up",
  "titrate down",
  "increase the dose",
  "decrease the dose",
  "reduce the dose",
  "reduce the dosage",
  "lower the dose",
  "raise the dose",
  "adjust the dose",
  "dose adjustment",
  "dose should be",
  "dose should not",
  "dose must",
  "dose is too low",
  "dose is too high",
  "underdosed",
  "overdosed",
  "you may need more",
  "most people need",
  "if you miss a dose",
  "take one tablet",
  "take twice daily",
  "take once daily",
  "take at night",
  "take with food",
  // Prescription verbs
  "prescribe",
  "prescribed for you",
  "your doctor should",
  "ask your doctor for",
  "consider adding",
  "consider switching",
  "add on",
  "switch to",
  "replace with",
  "combine with",
  "try this",
  "you should take",
  "you can take",
  "give your client",
  "recommend",
  "indicated for",
  "contraindicated",
  "avoid in",
  "avoid with",
  // Directives that imply the reader acts
  "increase",
  "decrease",
  "stop taking",
  "start taking",
  "stop abruptly",
  "reduce gradually",
  "taper",
  "withdraw",
  "discontinue",
  "monitor the dose",
  "watch the dose",
];

/**
 * Whether a piece of student-visible content contains any forbidden phrase.
 * Case-insensitive, word-boundary-ish.
 */
export function hasForbiddenPhrase(content: string): string | null {
  const lower = content.toLowerCase();
  for (const phrase of FORBIDDEN_PHRASES) {
    // Word-boundary check for single verbs like "increase" to avoid
    // false-positives inside normal prose ("the dose increases the risk...").
    const re = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (re.test(lower)) return phrase;
  }
  return null;
}

/**
 * The mandatory caveat that must accompany any "typical / standard dose"
 * statement. Rendered by the UI; the test also requires its presence next to
 * any is_typical_starting / is_standard_maintenance band.
 */
export const DOSE_CAVEAT =
  "This is what the books describe. Your client's prescriber chose their dose for reasons specific to them, and that is the number that matters.";

/**
 * The standing notice shown on every screen of the tool.
 */
export const STANDING_NOTICE =
  "Educational reference from named textbooks, reviewed by a psychiatrist. For people who do not prescribe. Not advice about any individual — the prescriber and the label always take precedence.";

/**
 * The one-time acknowledgement text, recorded per user.
 */
export const ACKNOWLEDGEMENT_TEXT =
  "This is educational reference material from textbooks, reviewed by a psychiatrist, for people who do not prescribe. It is not advice about any individual. The prescriber and the label always take precedence.";
