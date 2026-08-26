import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { FlagToggle } from "./flag-toggle";

export const dynamic = "force-dynamic";

const LABELS: Record<string, string> = {
  case_library: "Case Library",
  checkin: "Weekly Check-in",
  consulting_room: "Consulting Room",
  decoder: "Decoder",
  ethics: "Ethics",
  formulation: "Formulation",
  journal: "Journal",
  judgment: "Judgment",
  knowledge_tutor: "Psychology Tutor",
  landmark: "Landmark Cases",
  modules: "Modules",
  mse: "MSE",
  osce: "OSCE",
  peer_roleplay: "Role-Play",
  rounds: "Rounds",
  skills_passport: "Skills Passport",
  supervision: "Supervision",
  two_minute_clinic: "Two-Minute Clinic",
  weak_spots: "Weak Spots",
};

/**
 * /admin/flags — which practice tools are visible to students. Each tool has a
 * three-state status: off (hidden), live (shown but locked), or unlocked
 * (full access).
 */
export default async function AdminFlagsPage() {
  const admin = createAdminClient();
  const { data: flags } = await admin
    .from("feature_flags")
    .select("key, status, enabled")
    .order("key");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <PageHeader
        title="What's live"
        description="Choose how much students see: Hidden (not shown), Live (shown but locked — 'yet to be live'), or Unlock (full access)."
      />
      <div className="mt-6 space-y-2">
        {(flags ?? []).map((f) => {
          const key = String(f.key);
          return (
            <FlagToggle
              key={key}
              flagKey={key}
              label={LABELS[key] ?? key}
              status={f.status ?? (f.enabled ? "unlocked" : "off")}
              enabled={f.enabled as boolean}
            />
          );
        })}
      </div>
    </div>
  );
}
