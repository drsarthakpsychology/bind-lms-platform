import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { FlagToggle } from "./flag-toggle";

export const dynamic = "force-dynamic";

const LABELS: Record<string, string> = {
  consulting_room: "Consulting Room",
  decoder: "Presenting Complaint Decoder",
  mse: "MSE Trainer",
  judgment: "5 Judgment Calls",
  rounds: "Rounds",
  journal: "Journal",
  formulation: "Formulation Forge",
  osce: "OSCE Stations",
  ethics: "Ethics & Law",
  case_library: "Case Library",
  landmark: "Landmark Cases",
  peer_roleplay: "Peer Role-Play",
  two_minute_clinic: "Two-Minute Clinic",
  supervision: "Supervision Log",
  skills_passport: "Skills Passport",
  weak_spots: "Weak Spots",
  modules: "Modules",
  checkin: "Weekly Check-in",
  knowledge_tutor: "Psychology Tutor",
};

/** The six live for Cohort One (v5.1 A2); the rest built-but-off. */
const LIVE_FOR_COHORT_ONE = ["consulting_room", "decoder", "mse", "judgment", "rounds", "journal"];

/**
 * /admin/flags — the scope cut. Build everything, ship six. Flip any feature
 * on in one click for the staged reveal.
 */
export default async function AdminFlagsPage() {
  const admin = createAdminClient();
  const { data: flags } = await admin.from("feature_flags").select("key, enabled").order("key");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Feature flags"
        description="Build everything, ship six. Flip a feature on for the whole cohort in one click."
      />
      <div className="mt-6 space-y-2">
        {(flags ?? []).map((f) => {
          const key = String(f.key);
          return (
            <FlagToggle
              key={key}
              flagKey={key}
              label={LABELS[key] ?? key}
              enabled={f.enabled as boolean}
              liveForCohortOne={LIVE_FOR_COHORT_ONE.includes(key)}
            />
          );
        })}
      </div>
    </div>
  );
}
