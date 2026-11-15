import { HubLoading } from "@/components/ds/loading";
import { PREP_SHORT } from "@/lib/prep/catalog";

/** Exam Prep while it loads: its title and groups of rows. */
export default function Loading() {
  return <HubLoading title={PREP_SHORT} />;
}
