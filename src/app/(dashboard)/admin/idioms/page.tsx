import { redirect } from "next/navigation";

/** Retired: the Idiom bank was removed. */
export default function Retired() {
  redirect("/admin/courses");
}
