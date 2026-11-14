/**
 * Which Medicines page explains each Rx Detective medicine, so a wrong answer
 * can offer "How olanzapine works" (the page's How it works part). Rx
 * Detective's medicines are built from the Medicines reference, so every drug
 * id has a page; cases also name things that are not in the reference
 * (tramadol, alcohol, the contraceptive pill), and those get no link.
 */
import { MEDS } from "@/lib/meds";
import { DRUGS, MYSTERIES, PUZZLES, reviewById } from "./content";
import type { Kind } from "./game";

const PAGE_IDS = new Set(MEDS.map((m) => m.id));
const NAME = new Map(MEDS.map((m) => [m.id, m.name]));

/** Every Rx drug id and the Medicines page id that explains it (null: no page). */
export const RX_MED_PAGE: Record<string, string | null> = Object.fromEntries(DRUGS.map((d) => [d.id, PAGE_IDS.has(d.id) ? d.id : null]));

/** Names used in cases that differ from the page id. */
const ALIAS: Record<string, string> = { "sodium valproate": "valproate", "diazepam dependence": "diazepam" };

/** The Medicines page for a drug id or a name used in a case, or null when there is none. */
export function medPageFor(key: string): { id: string; name: string } | null {
  const k = key.trim().toLowerCase();
  const id = RX_MED_PAGE[k] ?? (ALIAS[k] && PAGE_IDS.has(ALIAS[k]) ? ALIAS[k] : null) ?? DRUGS.find((d) => d.name.toLowerCase() === k)?.id ?? null;
  return id && PAGE_IDS.has(id) ? { id, name: NAME.get(id) ?? key } : null;
}

/** Every drug id or name a case is about, as written in the content. */
export function rxItemKeys(kind: Kind, id: string): string[] {
  if (kind === "chain") return [id];
  if (kind === "mystery") return [MYSTERIES.find((m) => m.id === id)?.drug ?? ""].filter(Boolean);
  if (kind === "review") return reviewById(id)?.drugs ?? [];
  const p = PUZZLES.find((x) => x.id === id);
  return p ? [p.a, p.b] : [];
}

/** The Medicines pages for a case: one per medicine, in order, skipping anything without a page. */
export function rxItemPages(kind: Kind, id: string): { id: string; name: string }[] {
  const out: { id: string; name: string }[] = [];
  for (const k of rxItemKeys(kind, id)) {
    const page = medPageFor(k);
    if (page && !out.some((x) => x.id === page.id)) out.push(page);
  }
  return out;
}
