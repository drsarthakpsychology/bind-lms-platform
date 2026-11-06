import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin, isSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { PRACTICE_TOOLS } from "@/lib/practice/tools";
import { FlagToggle } from "./flag-toggle";

export const dynamic = "force-dynamic";

/** Retired tools: merged elsewhere, so they are not shown here any more. */
const RETIRED = new Set(["modules", "rounds", "learning_profile", "personalised_patients", "decoder", "knowledge_tutor"]);

const LABELS: Record<string, string> = {
  case_library: "Case Library",
  checkin: "Weekly Check-in",
  consulting_room: "Consulting Room",
  decoder: "Decoder",
  ethics: "Ethics, law & referral",
  formulation: "Formulation",
  journal: "Journal",
  learn: "Notes & Games",
  lab: "Psychology Lab",
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

const EXTRA: Record<string, string> = {
  learn: "Learn with Chai: lessons, Coach, games, notes, the quiz leaderboard.",
  lab: "Experiments in Games. Check the educator review notes before unlocking.",
  ethics: "Dilemmas on MHA 2017, POCSO and RCI scope (includes Out of Depth).",
  journal: "Private reflective journal.",
  checkin: "Weekly anonymous wellbeing check-in. You see only cohort trends.",
  supervision: "Students log supervised hours; you sign them off.",
  skills_passport: "Competencies with evidence, as a PDF.",
  weak_spots: "Where each student keeps slipping, from their answers.",
};

const GROUPS: { title: string; keys: string[] }[] = [
  { title: "Learning", keys: ["learn", "lab"] },
  { title: "Practice tools", keys: PRACTICE_TOOLS.map((t) => t.flag as string) },
  { title: "Reflection & records", keys: ["journal", "checkin", "supervision", "skills_passport", "weak_spots"] },
];

/**
 * What's live (2026-11 redesign): the same three-way switch per tool —
 * Hidden / Live (shown, locked) / Unlock — grouped by kind, each with a line
 * saying what it is, and a count at the top of what students can open now.
 */
export default async function AdminFlagsPage() {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const admin = createAdminClient();
  const { data: flags } = await admin.from("feature_flags").select("key, status, enabled").order("key");
  const rows = (flags ?? []).filter((f) => !RETIRED.has(String(f.key)));
  const statusOf = (f: { status?: string | null; enabled?: boolean | null }) => f.status ?? (f.enabled ? "unlocked" : "off");
  const counts = { unlocked: 0, live: 0, off: 0 } as Record<string, number>;
  for (const f of rows) counts[statusOf(f)] = (counts[statusOf(f)] ?? 0) + 1;
  const desc = new Map(PRACTICE_TOOLS.map((t) => [t.flag as string, t.description]));
  const placed = new Set(GROUPS.flatMap((g) => g.keys));
  const groups = [...GROUPS, { title: "Other", keys: rows.map((f) => String(f.key)).filter((k) => !placed.has(k)) }];
  const canWrite = isSuperAdmin(me);

  return (
    <div className="space-y-6">
      <PageHeader title="What's live" description="Choose what students see. Hidden = not shown. Live = shown but locked (“coming soon”). Unlock = open." />
      <div className="grid grid-cols-3 gap-3">
        {[
          ["unlocked", "open to students", "bg-status-success-bg text-status-success-fg"],
          ["live", "shown as coming soon", "bg-status-pending-bg text-status-pending-fg"],
          ["off", "hidden", "bg-status-info-bg text-status-info-fg"],
        ].map(([k, l, tone]) => (
          <div key={k} className={`rounded-2xl border-2 border-foreground p-4 ${tone}`}>
            <p className="text-3xl font-black tabular-nums">{counts[k] ?? 0}</p>
            <p className="text-caption font-semibold">{l}</p>
          </div>
        ))}
      </div>
      {!canWrite ? <p className="text-sm text-muted-foreground">View Admins can see these switches but not change them.</p> : null}
      {groups.map((g) => {
        const items = g.keys.map((k) => rows.find((f) => String(f.key) === k)).filter((f): f is NonNullable<typeof f> => Boolean(f));
        if (!items.length) return null;
        return (
          <section key={g.title} className="space-y-3">
            <h2 className="text-h3 font-bold">{g.title}</h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((f) => {
                const key = String(f.key);
                return <FlagToggle key={key} flagKey={key} label={LABELS[key] ?? key} description={EXTRA[key] ?? desc.get(key)} status={statusOf(f)} enabled={f.enabled as boolean} />;
              })}
            </div>
          </section>
        );
      })}
      <p className="text-caption text-muted-foreground">
        Rounds (flash cards) is retired, so its card review queue isn&apos;t in the menu any more. It&apos;s still at <Link href="/admin/cards" className="font-bold underline">Rounds cards</Link> if you need it.
      </p>
    </div>
  );
}
