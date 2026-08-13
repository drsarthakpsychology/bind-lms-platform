import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * /practice/supervision → moved. Supervision hours are admin-you-file, not a
 * drill; they live on /record with the weekly check-in (casebook Finding 4).
 */
export default function SupervisionRedirect() {
  redirect("/record");
}
