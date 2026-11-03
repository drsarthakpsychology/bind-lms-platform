import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { FlagToggle } from "./flag-toggle";

export const dynamic = "force-dynamic";

/** Retired tools: merged elsewhere, so they are not shown here any more. */
const RETIRED = new Set(["modules", "rounds", "learning_profile", "personalised_patients", "decoder", "knowledge_tutor"]);

const LABELS: Record<string, string> = {
  case_library: "Case Library",
  checkin: "Weekly Check-in",
  consulting_room: "Consulting Room",
  decoder: "Decoder",
  ethics: "Ethics, law & referral (includes Out of Depth)",
  formulation: "Formulation",
  journal: "Journal",
  learn: "Learn with Chai + Notes (lessons, Coach, games, notes, leaderboard)",
  lab: "Psychology Lab (experiments in Games; check the educator review notes before unlocking)",
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
  // Defence in depth: layouts don't re-render on every navigation, so the page
  // re-checks admin itself before reading data.
  if (!(await requireAdmin())) redirect("/dashboard");
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
        {(flags ?? []).filter((f) => !RETIRED.has(String(f.key))).map((f) => {
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
