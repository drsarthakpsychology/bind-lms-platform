"use server";

import { requireStudentApi } from "@/lib/auth/api-guard";
import { SEED_OSCE_STATIONS, type OsceStation } from "@/lib/practice/osce";

/**
 * One OSCE station, in full, for the student who opens it. The station list
 * on the page carries only titles and tasks, so the whole bank with its
 * checklists and model points never reaches the browser.
 */
export async function loadOsceStation(id: string): Promise<OsceStation | null> {
  const access = await requireStudentApi({ path: "/practice/osce", flag: "osce" });
  if (!access.ok) return null;
  if (typeof id !== "string" || id.length > 50) return null;
  return SEED_OSCE_STATIONS.find((s) => s.id === id) ?? null;
}
