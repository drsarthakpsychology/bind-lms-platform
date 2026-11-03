import { experimentById } from "./experiments";
import { caseById } from "@/content/casebook";

/**
 * Lab records hold both experiments ("stroop") and Casebook games ("cb-<id>").
 * Resolve either to a title and the link that re-checks it.
 */
export function labEntry(key: string): { title: string; href: string; recheckHref: string; kind: "experiment" | "case" } | null {
  if (key.startsWith("cb-")) {
    const c = caseById(key.slice(3));
    return c ? { title: c.title, href: `/games/lab/cases/${c.id}`, recheckHref: `/games/lab/cases/${c.id}`, kind: "case" } : null;
  }
  const e = experimentById(key);
  return e ? { title: e.title, href: `/games/lab/${e.id}`, recheckHref: `/games/lab/${e.id}?recheck=1`, kind: "experiment" } : null;
}
