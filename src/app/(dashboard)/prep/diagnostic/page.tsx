import { redirect } from "next/navigation";

/** The starting check is gone: every subject is open from the start. */
export default function OldDiagnosticPage() {
  redirect("/prep");
}
