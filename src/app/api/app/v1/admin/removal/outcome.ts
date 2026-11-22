import "server-only";
import { ApiFail } from "@/lib/app-api/respond";
import { REFUSE } from "@/lib/people/removal-rules";
import type { Outcome } from "@/lib/people/removal";

/** A refused rule answers 409 (or 403 / 404) with the plain words; a write that failed answers 500. */
export function answer(r: Outcome, done: Record<string, unknown>): Record<string, unknown> {
  if (!r.error) return done;
  if (r.error === REFUSE.notAllowed) throw new ApiFail("forbidden", r.error);
  if (r.error === REFUSE.notFound || /could not be found/.test(r.error)) throw new ApiFail("not_found", r.error);
  if ((Object.values(REFUSE) as string[]).includes(r.error) || /already handled|not set up yet/.test(r.error)) throw new ApiFail("conflict", r.error);
  throw new ApiFail("server_error", r.error);
}
