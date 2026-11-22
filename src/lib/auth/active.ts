import "server-only";
import { getSession } from "./session";
import { isLecturesOnly } from "./scope";

/**
 * The signed-in person's id for a server action, or null.
 *
 * Unlike reading the Supabase user directly, this applies every account rule:
 * paused, access ended, signed in on another device. `full: true` also refuses
 * a lectures-only account (for anything outside the lecture list and player).
 */
export async function activeUserId(opts: { full?: boolean } = {}): Promise<string | null> {
  try {
    const s = await getSession();
    if (s.status !== "ok") return null;
    if (opts.full && isLecturesOnly(s.profile)) return null;
    return s.profile.id;
  } catch {
    return null;
  }
}
