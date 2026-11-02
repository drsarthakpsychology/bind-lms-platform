import { redirect } from "next/navigation";

/** Retired: Marking check (AI calibration) was removed from the admin. */
export default function Retired() {
  redirect("/admin/courses");
}
