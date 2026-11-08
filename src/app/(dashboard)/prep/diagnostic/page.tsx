import { redirect } from "next/navigation";

/** The starting check is switched off (PREP_ONBOARDING_ENABLED in src/lib/prep/catalog.ts; its picking and scoring stay in src/lib/prep): every subject is open from the start. */
export default function OldDiagnosticPage() {
  redirect("/prep");
}
