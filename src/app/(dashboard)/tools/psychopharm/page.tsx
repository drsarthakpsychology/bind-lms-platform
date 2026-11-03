import { redirect } from "next/navigation";

/**
 * The old medicine search moved to Practice → Medicines (instant search,
 * dose chips). Drug detail, compare and mechanism pages stay here as the
 * full reference.
 */
export default function PsychSearchPage() {
  redirect("/practice/medicines");
}
