import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * /practice/check-in → moved. The weekly check-in is admin-you-file, not a
 * drill; it lives on /record with the supervision log (casebook Finding 4).
 */
export default function CheckinRedirect() {
  redirect("/record");
}
