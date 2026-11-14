/**
 * A short tag for whose saves these are. The browser outbox stamps every queued
 * save with it, and /api/save only accepts saves whose tag matches the signed-in
 * account, so a save queued by one student is never written to another
 * student's record on a shared computer. Pure (used on both sides).
 */
export function ownerTag(id: string): string {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return (h >>> 0).toString(36);
}
