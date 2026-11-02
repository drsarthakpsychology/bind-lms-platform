import { redirect } from "next/navigation";

/** Retired: Record a case was removed. */
export default function Retired() {
  redirect("/admin/courses");
}
