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
/**
 * Directives that are VALID when the reader is told NOT to do them, or when
 * they describe the prescriber's role, but INVALID when aimed at the reader as
 * an instruction. E.g. "do not prescribe" / "people who do not prescribe" are
 * the mandated framing; "prescribe X" is forbidden. If a match is immediately
 * preceded by "do not"/"not"/"never", it is the compliant form and passes.
 */
const NEGATION_TOKENS = ["do not", "don't", "not", "never", "must not", "should not", "does not", "shouldn't", "won't"];

/**
 * Modal / descriptive hedges that mark a verb as OBSERVATIONAL (about the drug
 * or its effects) rather than an instruction to a reader. "may increase",
 * "the dose increases", "can cause" describe what a medicine does; they are the
 * required register. Only a direct reader-addressed imperative is forbidden.
 */
const MODAL_TOKENS = ["may", "can", "could", "might", "the dose", "doses", "drug", "medicine"];

export function hasForbiddenPhrase(content: string): string | null {
  const lower = content.toLowerCase();
  for (const phrase of FORBIDDEN_PHRASES) {
    const re = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "ig");
    let match: RegExpExecArray | null;
    // Scan EVERY occurrence — a negated/modally-hedged first occurrence must not
    // mask a real directive later in the string (e.g. "Do not stop taking X
    // suddenly. Stop taking X over 3 weeks." — the second is an instruction).
    while ((match = re.exec(lower)) !== null) {
      const before = lower.slice(Math.max(0, match.index - 18), match.index);
      const trimmedBefore = before.trimEnd();
      const after = lower.slice(match.index + match[0].length, match.index + match[0].length + 34);
      const negated = NEGATION_TOKENS.some((t) => trimmedBefore.endsWith(t));
      if (negated) continue;
      // Compliant framing describing the prescriber's role passes — education,
      // not an instruction to the reader. "adjusted by your doctor" / "chosen
      // by the prescriber" either precede or follow the directive phrase.
      const byPrescriber =
        /(by your (doctor|prescriber|clinician)|by the (prescriber|doctor|clinician))/.test(trimmedBefore + " " + after);
      if (byPrescriber) continue;
      const modal = MODAL_TOKENS.some((t) => trimmedBefore.endsWith(t));
      if (modal) continue;
      return phrase;
    }
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
