import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * /practice/passport → moved. The Skills Passport is its own route now
 * (casebook Finding 4): it's a dashboard you check, not a practice drill.
 */
export default function PassportRedirect() {
  redirect("/passport");
}
