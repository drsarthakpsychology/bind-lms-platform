/**
 * One labelling style for every question, whatever the author typed:
 * List I items are A to D, List II items are I to IV, statements are 1 to n,
 * and assertion-reason items carry no "A:" or "Assertion (A):" of their own
 * (the screen adds those). Authors wrote labels into the items ("A. ...",
 * "i. ...", "1. ...") and the options in matching styles ("A-2", "a-iii",
 * "A and C only", "I and II only"), so the labels are stripped from the items
 * and the options (and the explanation) are rewritten to the same style.
 * Pure.
 */
import type { PrepQuestion } from "./types";

export const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"] as const;
export const LETTERS = "ABCDEFGH";

const AR_LABEL = /^\s*(?:(?:Assertion|Reason)\s*\(\s*[AR]\s*\)|Assertion|Reason|\(?[AR]\)?)\s*[:.]\s*/i;

type Kind = "digit" | "letter" | "roman";
const SCHEMES: { kind: Kind; label: (i: number) => string }[] = [
  { kind: "digit", label: (i) => String(i + 1) },
  { kind: "letter", label: (i) => LETTERS[i] ?? "?" },
  { kind: "letter", label: (i) => (LETTERS[i] ?? "?").toLowerCase() },
  { kind: "roman", label: (i) => ROMAN[i] ?? "?" },
  { kind: "roman", label: (i) => (ROMAN[i] ?? "?").toLowerCase() },
];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const labelRe = (l: string) => new RegExp(`^\\s*\\(?${escape(l)}[.):]\\s+`);

/**
 * The author's label kind for a list, only when every item carries the next
 * label in one sequence (A, B, C or i, ii, iii or 1, 2, 3). Items that just
 * start with initials ("B. F. Skinner") are not labels.
 */
export function labelKind(items: readonly string[]): Kind | null {
  if (!items.length) return null;
  for (const s of SCHEMES) if (items.every((it, i) => labelRe(s.label(i)).test(it))) return s.kind;
  return null;
}

/** The list without its labels (only when the whole list is labelled in sequence). */
export function stripLabels(items: readonly string[]): string[] {
  for (const s of SCHEMES) if (items.length && items.every((it, i) => labelRe(s.label(i)).test(it))) return items.map((it, i) => it.replace(labelRe(s.label(i)), ""));
  return [...items];
}

function romanValue(r: string): number {
  return ROMAN.indexOf(r.toUpperCase() as (typeof ROMAN)[number]) + 1;
}

/** "A-2", "a - iii", "A, en dash, II" → "A-II". Values past VIII are left alone. */
export function romaniseCodes(s: string): string {
  return s.replace(/\b([A-Ha-h])\s*[-\u2013]\s*([1-8]|[IVXivx]{1,4})\b/g, (all, l: string, v: string) => {
    const n = /^[0-9]$/.test(v) ? Number(v) : romanValue(v);
    return n >= 1 && n <= ROMAN.length ? `${l.toUpperCase()}-${ROMAN[n - 1]}` : all;
  });
}

/** In a statement question's options, statement letters or roman numerals become 1 to n. */
export function numberStatementRefs(s: string, kind: "letter" | "roman", n: number): string {
  if (kind === "letter") {
    const letters = LETTERS.slice(0, n);
    return s.replace(new RegExp(`\\b([${letters}])\\b`, "g"), (_, l: string) => String(LETTERS.indexOf(l) + 1));
  }
  return s.replace(/\b(VIII|VII|VI|IV|V|III|II|I)\b/g, (all, r: string) => {
    const v = romanValue(r);
    return v >= 1 && v <= n ? String(v) : all;
  });
}

/**
 * Explanations quote the options and name statements ("Statement C is
 * wrong", "statements A and D"). Rewrite those, and only those, so an
 * article "A" in a sentence is never touched.
 */
function explainStatements(text: string, kind: "letter" | "roman", n: number, from: readonly string[], to: readonly string[]): string {
  let out = text;
  from.forEach((o, i) => {
    if (o !== to[i] && o.length > 2) out = out.split(o).join(to[i]);
  });
  const token = kind === "letter" ? `[${LETTERS.slice(0, n)}]` : "(?:VIII|VII|VI|IV|V|III|II|I)";
  const list = new RegExp(`\\b(Statements?|statements?)((?:\\s*(?:,|and|or)?\\s*\\(?${token}\\)?\\b)+)`, "g");
  return out.replace(list, (_, word: string, rest: string) => word + numberStatementRefs(rest, kind, n));
}

export type Labelled = Pick<PrepQuestion, "type" | "options" | "explanation" | "statements" | "lists">;

/** The question with one labelling style (items stripped, options and explanation rewritten to match). */
export function normaliseLabels<T extends Labelled>(q: T): T {
  const out: T = { ...q };
  if (q.statements?.length) {
    if (q.type === "assertion-reason") {
      out.statements = q.statements.map((s) => s.replace(AR_LABEL, ""));
    } else {
      const joined = q.options.join(" | ");
      const kind = labelKind(q.statements) ?? (/\b[A-H]\b\s*(?:,|and|only|\|)/.test(joined) ? "letter" : /\b(?:IV|III|II)\b/.test(joined) ? "roman" : null);
      out.statements = stripLabels(q.statements);
      if (kind === "letter" || kind === "roman") {
        const n = q.statements.length;
        const options = q.options.map((o) => numberStatementRefs(o, kind, n)) as T["options"];
        out.explanation = explainStatements(q.explanation, kind, n, q.options, options);
        out.options = options;
      }
    }
  }
  if (q.lists) {
    out.lists = { left: stripLabels(q.lists.left), right: stripLabels(q.lists.right) };
    const options = q.options.map(romaniseCodes) as T["options"];
    let explanation = romaniseCodes(out.explanation);
    q.options.forEach((o, i) => {
      if (o !== options[i]) explanation = explanation.split(o).join(options[i]);
    });
    out.options = options;
    out.explanation = explanation;
  }
  return out;
}
