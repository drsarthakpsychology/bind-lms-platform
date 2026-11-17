import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileUp, Keyboard, UserPlus } from "lucide-react";
import { requireAdmin, isSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { readFlags } from "@/lib/flags";
import { uiV2For } from "@/lib/ui/v2";
import { AdminPage, ViewTabs } from "../../_v2/kit";
import { PageHeader } from "@/components/design-system/page-header";
import { AddPeopleForm } from "@/components/admin/cohorts-ui";
import { BulkImportForm } from "../../tools/bulk-import-form";
import { CreateStudentForm } from "../create-student-form";
import { cn } from "@/lib/utils";
import { isTestCohort } from "@/lib/test-mode/rules";

export const dynamic = "force-dynamic";

/**
 * The ONE place to add students (2026-11 redesign). Every "Add students"
 * button on Home, Cohorts and Pipeline opens this page. Two ways:
 *  - type or paste one or many emails, pick the cohort and access, and
 *    optionally email their login link straight away;
 *  - upload a spreadsheet file (CSV with name,email).
 * A full page, not a pop-up, so it is comfortable on a phone.
 */
export default async function AddStudentsPage({ searchParams }: { searchParams: Promise<{ cohort?: string; way?: string; email?: string }> }) {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const sp = await searchParams;
  const way = sp.way === "file" ? "file" : "type";
  const { data: cohorts } = await createAdminClient().from("cohorts").select("id, name, status").order("created_at", { ascending: true });
  const opts = (cohorts ?? []).filter((c) => !isTestCohort(c)).map((c) => ({ id: c.id as string, name: c.name as string }));

  const tab = (id: "type" | "file", label: string, Icon: typeof Keyboard) => (
    <Link
      href={`/admin/students/add?way=${id}${sp.cohort ? `&cohort=${sp.cohort}` : ""}`}
      aria-current={way === id ? "page" : undefined}
      className={cn(
        "flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold transition-colors",
        way === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      <Icon className="size-4" aria-hidden /> {label}
    </Link>
  );

  if (uiV2For(await readFlags(), me.role)) {
    return (
      <AdminPage
        width="default"
        title="Add students"
        back={{ href: "/admin/students", label: "Students" }}
        lead="One person or a whole batch. They get a one-time link to set their own password. Nobody's password is ever shown or sent."
      >
        {!isSuperAdmin(me) ? (
          <p className="border-y border-[var(--ds-hairline)] py-6 type-small text-muted-foreground">Only the Super Admin can add students.</p>
        ) : (
          <>
            <ViewTabs
              label="How to add"
              current={way}
              tabs={[
                { id: "type", label: "Type or paste emails", href: `/admin/students/add?way=type${sp.cohort ? `&cohort=${sp.cohort}` : ""}` },
                { id: "file", label: "Upload a file", href: `/admin/students/add?way=file${sp.cohort ? `&cohort=${sp.cohort}` : ""}` },
              ]}
            />
            <section className="min-w-0">
            {way === "file" ? (
              <>
                <h2 className="mb-1 type-h3">Upload a spreadsheet</h2>
                <p className="mb-4 type-small text-muted-foreground">A CSV file with the columns <code>name,email</code>. People already on VIBHA are skipped.</p>
                <BulkImportForm />
              </>
            ) : opts.length ? (
              <>
                <h2 className="mb-1 type-h3">Type or paste emails</h2>
                <p className="mb-4 type-small text-muted-foreground">One per line, or separated by commas. People who already have an account are just added to the cohort.</p>
                <AddPeopleForm cohorts={opts} defaultCohortId={sp.cohort} initialText={sp.email ?? ""} />
              </>
            ) : (
              <>
                <p className="mb-4 type-small">
                  There&apos;s no cohort yet. <Link href="/admin/cohorts" className="font-bold text-link underline">Make one</Link> to add people in bulk, or add one student here.
                </p>
                <CreateStudentForm />
              </>
            )}
            </section>
            <p className="type-small text-muted-foreground">
              Need to resend login links to many people? <Link href="/admin/students/logins" className="font-semibold text-link underline-offset-4 hover:underline">Login links</Link>.
            </p>
          </>
        )}
      </AdminPage>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/admin/students" className="inline-flex items-center gap-1.5 text-sm font-bold">
        <ArrowLeft className="size-4" aria-hidden /> Back to Students
      </Link>
      <PageHeader
        eyebrow="Students"
        title="Add students"
        description="One person or a whole batch. They get a one-time link to set their own password: nobody's password is ever shown or sent."
      />
      {!isSuperAdmin(me) ? (
        <p className="rounded-xl border-2 border-foreground/20 bg-card p-4 text-sm">Only the Super Admin can add students.</p>
      ) : (
        <>
          <nav aria-label="How to add" className="flex gap-1 rounded-2xl border-2 border-foreground bg-card p-1">
            {tab("type", "Type or paste emails", Keyboard)}
            {tab("file", "Upload a file", FileUp)}
          </nav>
          <section className="rounded-2xl border-2 border-foreground bg-card p-4 sm:p-6">
            {way === "file" ? (
              <>
                <h2 className="mb-1 flex items-center gap-2 text-h3 font-bold"><FileUp className="size-5 text-link" aria-hidden /> Upload a spreadsheet</h2>
                <p className="mb-4 text-small text-muted-foreground">A CSV file with the columns <code>name,email</code>. People already on VIBHA are skipped.</p>
                <BulkImportForm />
              </>
            ) : opts.length ? (
              <>
                <h2 className="mb-1 flex items-center gap-2 text-h3 font-bold"><UserPlus className="size-5 text-link" aria-hidden /> Type or paste emails</h2>
                <p className="mb-4 text-small text-muted-foreground">One per line, or separated by commas. People who already have an account are just added to the cohort.</p>
                <AddPeopleForm cohorts={opts} defaultCohortId={sp.cohort} initialText={sp.email ?? ""} />
              </>
            ) : (
              <>
                <p className="mb-4 rounded-xl border-2 border-foreground/20 p-3 text-sm">
                  There&apos;s no cohort yet. <Link href="/admin/cohorts" className="font-bold text-link underline">Make one</Link> to add people in bulk, or add one student here.
                </p>
                <CreateStudentForm />
              </>
            )}
          </section>
          <p className="text-caption text-muted-foreground">
            Need to resend login links to many people? <Link href="/admin/students/logins" className="font-bold text-link underline">Login links</Link>.
          </p>
        </>
      )}
    </div>
  );
}
