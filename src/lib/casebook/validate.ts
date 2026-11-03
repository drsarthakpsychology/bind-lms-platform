import type { CaseActivity } from "./types";

/**
 * Structural checks for Casebook content. Run by the unit tests over every
 * activity, so a broken item never reaches a student.
 * Returns a list of problems (empty = valid).
 */
export function validateActivity(a: CaseActivity, moduleIds: Set<string>): string[] {
  const p: string[] = [];
  const at = (m: string) => p.push(`${a.id}: ${m}`);
  if (!/^[a-z0-9-]{3,34}$/.test(a.id)) at("id must be lower-case letters, digits and dashes (3 to 34)");
  if (!moduleIds.has(a.module)) at(`unknown module "${a.module}"`);
  if (!a.bookRef?.book || !a.bookRef.chapter || !a.bookRef.pages) at("bookRef needs book, chapter and pages");
  if (!a.title || !a.hook || !a.objective) at("title, hook and objective are required");
  const uniq = (ids: string[], what: string) => {
    if (new Set(ids).size !== ids.length) at(`duplicate ${what} ids`);
  };

  switch (a.format) {
    case "spotter": {
      const cats = new Set(a.categories.map((c) => c.id));
      uniq(a.categories.map((c) => c.id), "category");
      uniq(a.items.map((i) => i.id), "item");
      if (a.items.length < 4) at("needs at least 4 items");
      for (const i of a.items) {
        if (!cats.has(i.answer)) at(`${i.id}: answer "${i.answer}" is not a category`);
        if (i.distractors.length < 1) at(`${i.id}: needs at least one distractor`);
        for (const d of i.distractors) {
          if (!cats.has(d)) at(`${i.id}: distractor "${d}" is not a category`);
          if (d === i.answer) at(`${i.id}: distractor equals answer`);
        }
        if (!i.quote.trim() || !i.explain.trim()) at(`${i.id}: quote and explain are required`);
      }
      break;
    }
    case "differential":
      uniq(a.items.map((i) => i.id), "item");
      for (const i of a.items) {
        if (i.options.length < 2) at(`${i.id}: needs 2+ options`);
        if (!Number.isInteger(i.answer) || i.answer < 0 || i.answer >= i.options.length) at(`${i.id}: answer out of range`);
        if (new Set(i.options).size !== i.options.length) at(`${i.id}: duplicate options`);
      }
      break;
    case "triage":
      uniq(a.items.map((i) => i.id), "item");
      for (const i of a.items) if (!["routine", "soon", "urgent"].includes(i.answer)) at(`${i.id}: bad urgency`);
      break;
    case "sort": {
      const cats = new Set(a.categories.map((c) => c.id));
      uniq(a.items.map((i) => i.id), "item");
      if (cats.size < 2) at("needs 2+ categories");
      for (const i of a.items) if (!cats.has(i.category)) at(`${i.id}: unknown category "${i.category}"`);
      break;
    }
    case "matching":
      uniq(a.pairs.map((x) => x.id), "pair");
      if (a.pairs.length < 3) at("needs 3+ pairs");
      if (new Set(a.pairs.map((x) => x.right)).size !== a.pairs.length) at("right-hand answers must be unique");
      break;
    case "skill":
      uniq(a.items.map((i) => i.id), "item");
      for (const i of a.items) if (i.responses.filter((r) => r.grade === "best").length !== 1) at(`${i.id}: needs exactly one best response`);
      break;
    case "branching": {
      const ids = new Set(a.nodes.map((n) => n.id));
      uniq(a.nodes.map((n) => n.id), "node");
      if (!ids.has(a.start)) at("start node missing");
      for (const n of a.nodes) {
        if (!n.choices.length) at(`${n.id}: needs choices`);
        for (const c of n.choices) if (c.next !== null && !ids.has(c.next)) at(`${n.id}: choice points to missing node "${c.next}"`);
      }
      // Every node reachable, and at least one ending.
      const seen = new Set<string>();
      const walk = (id: string) => {
        if (seen.has(id)) return;
        seen.add(id);
        a.nodes.find((n) => n.id === id)?.choices.forEach((c) => c.next && walk(c.next));
      };
      if (ids.has(a.start)) walk(a.start);
      for (const id of ids) if (!seen.has(id)) at(`node "${id}" is unreachable`);
      if (!a.nodes.some((n) => n.choices.some((c) => c.next === null))) at("no ending");
      break;
    }
    case "timeline":
      uniq(a.events.map((e) => e.id), "event");
      if (a.events.length < 3) at("needs 3+ events");
      break;
  }
  return p;
}

/** Score for an ordering: how many adjacent pairs are in the right order. */
export function orderScore(correct: readonly string[], given: readonly string[]): number {
  const pos = new Map(correct.map((id, i) => [id, i]));
  let right = 0;
  for (let i = 1; i < given.length; i++) if ((pos.get(given[i - 1]) ?? -1) < (pos.get(given[i]) ?? -1)) right++;
  return right;
}

/**
 * Students see the teaching, never the sourcing: no book names, page
 * references, "the book says" phrasing or review notes. Sourcing lives in
 * `bookRef`, `reviewFlags` and item `ref`, which only admins see.
 */
export const STUDENT_SOURCING = /Kaplan|Sadock|Fish's|Ahuja|Maudsley|Stahl|\bpp?\.\s?\d|the book|educator review/i;

/**
 * Every string a student can see for one activity. Student-visible fields:
 * all formats: title, hook, objective, debrief;
 * spotter: categories[].label, items[].quote, items[].explain;
 * differential: items[].vignette, .question, .options[], .explain;
 * triage: items[].vignette, .explain;
 * sort: categories[].label, items[].text, .explain;
 * matching: pairs[].left, .right;
 * skill: items[].prompt, responses[].text, .why;
 * branching: nodes[].text, choices[].text, .feedback;
 * timeline: events[].when, .text.
 * Not student-visible (admin or internal): id, module, level, format,
 * bookRef, reviewFlags, items[].ref, answer/category ids, distractors,
 * start, next.
 */
export function studentStrings(a: CaseActivity): string[] {
  const out: (string | undefined)[] = [a.title, a.hook, a.objective, a.debrief];
  switch (a.format) {
    case "spotter":
      out.push(...a.categories.map((c) => c.label), ...a.items.flatMap((i) => [i.quote, i.explain]));
      break;
    case "differential":
      out.push(...a.items.flatMap((i) => [i.vignette, i.question, ...i.options, i.explain]));
      break;
    case "triage":
      out.push(...a.items.flatMap((i) => [i.vignette, i.explain]));
      break;
    case "sort":
      out.push(...a.categories.map((c) => c.label), ...a.items.flatMap((i) => [i.text, i.explain]));
      break;
    case "matching":
      out.push(...a.pairs.flatMap((x) => [x.left, x.right]));
      break;
    case "skill":
      out.push(...a.items.flatMap((i) => [i.prompt, ...i.responses.flatMap((r) => [r.text, r.why])]));
      break;
    case "branching":
      out.push(...a.nodes.flatMap((n) => [n.text, ...n.choices.flatMap((c) => [c.text, c.feedback])]));
      break;
    case "timeline":
      out.push(...a.events.flatMap((e) => [e.when, e.text]));
      break;
  }
  return out.filter((x): x is string => typeof x === "string" && x.length > 0);
}
