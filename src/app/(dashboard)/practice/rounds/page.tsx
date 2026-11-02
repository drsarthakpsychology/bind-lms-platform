import { redirect } from "next/navigation";

/** Retired: Rounds' spaced-repetition cards were merged into Learn's Review. */
export default function RoundsRedirect() {
  redirect("/games");
}
