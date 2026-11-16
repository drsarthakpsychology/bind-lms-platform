import { failFrom } from "@/lib/app-api/admin-extras";
import type { NewSupportKey } from "@/lib/app-api/contract-practise-admin";

/** A support-key action's answer: the full key once, or the website's words as the error. */
export function newKey(r: { error: string | null; plain?: string; last4?: string }): NewSupportKey {
  if (r.error || !r.plain || !r.last4) failFrom(r.error ?? "Could not make the key.");
  return { plain: r.plain, last4: r.last4 };
}
