import { redirect } from "next/navigation";

/**
 * /admin/roster → /admin/emails?tab=credentials — the roster is now the
 * Credentials tab of the email control center. This redirect keeps old links
 * (and the legacy revalidatePaths) working.
 */
export default function RosterRedirectPage() {
  redirect("/admin/emails?tab=credentials");
}
