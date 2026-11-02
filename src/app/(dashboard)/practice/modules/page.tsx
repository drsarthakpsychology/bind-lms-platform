import { redirect } from "next/navigation";

/** Retired: course modules live on the Lectures page now. */
export default function ModulesRedirect() {
  redirect("/courses");
}
