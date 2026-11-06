/**
 * The Add people box takes names OR emails, pasted any way people paste:
 * one per line, comma-separated, or "Priya Shah <priya@gmail.com>". Emails
 * pass straight through; names are matched to existing students (exact name,
 * case and spacing ignored) because a new account always needs an email.
 */

const EMAIL = /[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+/g;

export type PastedPeople = { emails: string[]; names: string[] };

export function splitPeople(text: string): PastedPeople {
  const emails: string[] = [];
  const names: string[] = [];
  const seenE = new Set<string>();
  const seenN = new Set<string>();
  for (const piece of text.split(/[\n\r;,]+/)) {
    const found = piece.match(EMAIL);
    if (found?.length) {
      for (const e of found) {
        const v = e.toLowerCase();
        if (!seenE.has(v)) {
          seenE.add(v);
          emails.push(v);
        }
      }
      continue;
    }
    const name = piece.replace(/\s+/g, " ").trim();
    const key = normName(name);
    if (name.length < 2 || name.length > 80 || !/\p{L}/u.test(name) || seenN.has(key)) continue;
    seenN.add(key);
    names.push(name);
  }
  return { emails, names };
}

export function normName(s: string): string {
  return s.normalize("NFKC").replace(/\s+/g, " ").trim().toLowerCase();
}

export type NameMatch = { name: string; email: string | null; reason?: "not-found" | "more-than-one" };

/** Match names to existing people. Two people with the same name → ask for the email instead. */
export function matchNames(names: string[], people: { name: string | null; email: string | null }[]): NameMatch[] {
  const by = new Map<string, string[]>();
  for (const p of people) {
    if (!p.name || !p.email) continue;
    const k = normName(p.name);
    by.set(k, [...(by.get(k) ?? []), p.email.toLowerCase()]);
  }
  return names.map((name) => {
    const hits = [...new Set(by.get(normName(name)) ?? [])];
    if (hits.length === 1) return { name, email: hits[0] };
    return { name, email: null, reason: hits.length ? "more-than-one" : "not-found" };
  });
}

/** How many people a paste will try to add (for the button label). */
export function pasteCount(text: string): number {
  const { emails, names } = splitPeople(text);
  return emails.length + names.length;
}
