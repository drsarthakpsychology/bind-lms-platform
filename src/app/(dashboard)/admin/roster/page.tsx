import { redirect } from "next/navigation";

/**
 * /admin/roster → /admin/students/logins: login links now live with
 * Students (one home for login state). This redirect keeps old links
 * (and the legacy revalidatePaths) working.
 */
export default function RosterRedirectPage() {
  redirect("/admin/students/logins");
}
