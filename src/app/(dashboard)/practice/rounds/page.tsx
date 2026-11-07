import { redirect } from "next/navigation";

/** Retired: Rounds' review cards now live in Smart practice (Exam Prep). */
export default function RoundsRedirect() {
  redirect("/prep/smart");
}
