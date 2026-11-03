import type { CaseActivity } from "@/lib/casebook/types";

/**
 * Casebook activities, built from the course textbooks (original wording;
 * see each activity's bookRef). Add an activity by creating a file in this
 * folder and listing it here. src/lib/casebook/casebook.test.ts validates
 * every entry.
 */
export const CASEBOOK: CaseActivity[] = [];

export function caseById(id: string): CaseActivity | undefined {
  return CASEBOOK.find((c) => c.id === id);
}

/** Key under which a Casebook activity is stored in the learn state's lab record. */
export const caseKey = (id: string) => `cb-${id}`;
