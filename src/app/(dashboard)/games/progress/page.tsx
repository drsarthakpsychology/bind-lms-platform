import { redirect } from "next/navigation";

/** Old address: progress now lives on one Progress page. */
export default function GamesProgressPage() {
  redirect("/progress");
}
