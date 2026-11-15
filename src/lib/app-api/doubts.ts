import "server-only";
import type { Profile } from "@/lib/auth/session";
import { loadMyCohorts } from "@/lib/cohorts/access";
import { loadDoubt } from "@/lib/doubts/data";
import type { DoubtThread } from "./contract";
import { ApiFail } from "./respond";

/** The doubt thread as the website's thread page loads it (same visibility rule). */
export async function doubtThread(profile: Profile, id: string): Promise<DoubtThread> {
  const isAdmin = profile.role === "admin";
  const cohortIds = isAdmin ? [] : (await loadMyCohorts(profile.id)).map((c) => c.id);
  const t = await loadDoubt(id, { userId: profile.id, isAdmin, cohortIds });
  if (!t) throw new ApiFail("not_found");
  return t;
}

/** The doubts actions answer `{ error }` in plain words: map them to codes. */
export function doubtError(error: string): ApiFail {
  if (/sign in/i.test(error)) return new ApiFail("unauthenticated", error);
  if (/slow down/i.test(error)) return new ApiFail("rate_limited", error);
  if (/isn't open to you|is gone|isn't on this doubt/i.test(error)) return new ApiFail("not_found", error);
  if (/only the person who asked/i.test(error)) return new ApiFail("forbidden", error);
  if (/isn't set up yet/i.test(error)) return new ApiFail("unavailable", error);
  if (/^Couldn't/i.test(error)) return new ApiFail("server_error", error);
  return new ApiFail("bad_request", error);
}
