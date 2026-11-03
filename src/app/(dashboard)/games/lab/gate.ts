import "server-only";
import { getSession } from "@/lib/auth/session";
import { requireFeature } from "@/lib/flags";

/**
 * The Lab is behind its own switch ("lab" in Admin → What's live) so it can
 * be reviewed by an educator before students see it. Admins always get in,
 * so they can preview it while it is hidden.
 */
export async function requireLab(): Promise<{ isAdmin: boolean }> {
  const session = await getSession();
  const isAdmin = session.status === "ok" && session.profile.role === "admin";
  if (!isAdmin) await requireFeature("lab");
  return { isAdmin };
}
