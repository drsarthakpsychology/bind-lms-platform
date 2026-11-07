import { redirect } from "next/navigation";

/**
 * /today ("Today's practice") folded into Smart practice in Exam Prep
 * (plan section 8). Old bookmarks and links land there instead of a 404.
 */
export default function TodayRedirectPage() {
  redirect("/prep/smart");
}
