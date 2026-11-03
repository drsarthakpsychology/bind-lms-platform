import "server-only";
import { getSession } from "@/lib/auth/session";
import { getFeatureStatus } from "@/lib/flags";

/**
 * Who is reading. Bookmarks and notes are kept in the browser under this id,
 * so two students on one computer never see each other's notes.
 */
export async function studyOwner(): Promise<{ owner: string; isAdmin: boolean }> {
  const session = await getSession();
  if (session.status !== "ok") return { owner: "", isAdmin: false };
  return { owner: session.profile.id, isAdmin: session.profile.role === "admin" };
}

/** Is the Psychology Lab open to this person? Admins can always preview it. */
export async function labOpen(isAdmin: boolean): Promise<boolean> {
  return isAdmin || (await getFeatureStatus("lab")) === "unlocked";
}
