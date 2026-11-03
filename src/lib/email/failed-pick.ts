import { isRobotEmail } from "@/lib/people/hidden";

export type FailRow = { id: string; recipient: string; created_at: string };
export type OkRow = { recipient: string; created_at: string };

/**
 * Failed sends that still need the admin: not to a test/robot address, and
 * not already fixed by a later successful send to the same person. Pure.
 */
export function openFailures<T extends FailRow>(failed: T[], okLater: OkRow[]): T[] {
  const lastOk = new Map<string, string>();
  for (const o of okLater) {
    const k = o.recipient.toLowerCase();
    if (!lastOk.has(k) || o.created_at > (lastOk.get(k) as string)) lastOk.set(k, o.created_at);
  }
  return failed.filter((f) => {
    if (isRobotEmail(f.recipient)) return false;
    const ok = lastOk.get(f.recipient.toLowerCase());
    return !ok || ok < f.created_at;
  });
}
