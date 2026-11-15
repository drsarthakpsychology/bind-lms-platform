import { redirect } from "next/navigation";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { requireAdmin, isSuperAdmin } from "@/lib/auth/guards";
import { loadRoster } from "@/lib/people/roster-data";
import { AddPeopleButton } from "@/components/admin/add-people-panel";
import { PageHeader } from "@/components/design-system/page-header";
import { Button } from "@/components/ui/button";
import { StudentTable } from "./student-table";
import { BulkLockControls } from "./bulk-lock";
import { readFlags } from "@/lib/flags";
import { uiV2For } from "@/lib/ui/v2";
import { StudentsTableV2 } from "../_v2/students-table";
import { AdminPage, btn } from "../_v2/kit";

export const dynamic = "force-dynamic";

/**
 * Students: the one place to see and manage every student (2026-11
 * redesign). One account status for everyone (lib/people/account-status),
 * roll numbers, cohorts, last active and lecture progress in one list with
 * no sideways scrolling. Each student opens a profile with tabs for access,
 * activity, credentials and messages.
 */
export default async function StudentsPage({ searchParams }: { searchParams: Promise<{ cohort?: string; filter?: string }> }) {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const sp = await searchParams;
  const { rows, cohorts } = await loadRoster();
  const canWrite = isSuperAdmin(me);
  const active = rows.filter((r) => r.account === "active").length;
  const onNow = rows.filter((r) => r.presence === "now").length;
  const attention = rows.filter((r) => r.flags.length).length;

  if (uiV2For(await readFlags(), me.role)) {
    return (
      <AdminPage
        title="Students"
        lead={`${active} have signed in · ${onNow} on VIBHA now · ${attention} need attention`}
        actions={
          canWrite ? (
            <>
              <Link href="/admin/students/logins" className={btn.quiet}>
                <KeyRound aria-hidden /> Login links
              </Link>
              <AddPeopleButton cohortId={sp.cohort} label="Add students" />
            </>
          ) : undefined
        }
      >
        <StudentsTableV2
          rows={rows.map((r) => ({
            id: r.id,
            name: r.name,
            email: r.email,
            roll: r.roll,
            mobile: r.mobile,
            account: r.account,
            presence: r.presence,
            lastSeen: r.lastSeen,
            cohorts: r.cohorts,
            min7: r.min7,
            lecturesDone: r.lecturesDone,
            lecturesAvailable: r.lecturesAvailable,
            scope: r.scope,
            expiresAt: r.expiresAt,
            flags: r.flags,
          }))}
          cohorts={cohorts.map((c) => ({ id: c.id, name: c.name }))}
          canWrite={canWrite}
          initialCohort={sp.cohort ?? ""}
          initialFilter={sp.filter ?? ""}
        />
        {canWrite ? (
          <details className="group min-w-0 border-t border-[var(--ds-hairline)] pt-3">
            <summary className="inline-flex min-h-11 cursor-pointer items-center type-small font-semibold text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">Lock or unlock everyone at once</summary>
            <div className="mt-2"><BulkLockControls /></div>
          </details>
        ) : null}
      </AdminPage>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="All students"
        description={`${rows.length} students · ${active} have signed in · ${onNow} on VIBHA right now · ${attention} need attention`}
        actions={
          canWrite ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/students/logins"><KeyRound aria-hidden /> Login links</Link>
              </Button>
              <AddPeopleButton cohortId={sp.cohort} label="Add students" />
            </>
          ) : undefined
        }
      />
      <StudentTable
        rows={rows.map((r) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          roll: r.roll,
          mobile: r.mobile,
          account: r.account,
          presence: r.presence,
          lastSeen: r.lastSeen,
          cohorts: r.cohorts,
          min7: r.min7,
          lecturesDone: r.lecturesDone,
          lecturesAvailable: r.lecturesAvailable,
          scope: r.scope,
          expiresAt: r.expiresAt,
          flags: r.flags,
        }))}
        cohorts={cohorts.map((c) => ({ id: c.id, name: c.name }))}
        canWrite={canWrite}
        initialCohort={sp.cohort ?? ""}
        initialFilter={sp.filter ?? ""}
      />
      {canWrite ? (
        <details className="rounded-2xl border-2 border-foreground/15 bg-card p-4">
          <summary className="cursor-pointer text-sm font-bold">Lock or unlock everyone at once</summary>
          <div className="mt-3"><BulkLockControls /></div>
        </details>
      ) : null}
    </div>
  );
}
