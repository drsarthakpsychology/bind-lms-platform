import { redirect } from "next/navigation";

/** Picking an exam is switched off (EXAM_TRACKS_ENABLED and PREP_ONBOARDING_ENABLED in src/lib/prep/catalog.ts): the bank is the same for every exam. */
export default function OldGoalPage() {
  redirect("/prep");
}
