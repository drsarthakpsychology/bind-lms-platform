import { redirect } from "next/navigation";
import { requireFeature } from "@/lib/flags";

export const dynamic = "force-dynamic";

/**
 * /practice/two-minute-clinic → moved. The Two-minute clinic is now a mode of
 * Clinic detective (one Practice place for reasoning from a presentation).
 * Old links keep working; the switch `two_minute_clinic` still decides.
 */
export default async function TwoMinuteClinicPage() {
  await requireFeature("two_minute_clinic");
  redirect("/practice/detective?mode=clinic");
}
