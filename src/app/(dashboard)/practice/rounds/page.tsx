import { redirect } from "next/navigation";

/** Retired: Rounds was a Practice tool, so its old address stays in Practice. */
export default function RoundsRedirect() {
  redirect("/practice");
}
