import Link from "next/link";
import { UserPlus, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CreateStudentForm } from "./create-student-form";
import { StudentActions } from "./student-actions";
import { BulkLockControls } from "./bulk-lock";
import { LockToggle } from "@/components/admin/lock-toggle";

import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { StudentDirectory, type DirectoryRow } from "./student-directory";

function formatDate(iso: string | null): string {
  if (!iso) return "No expiry set";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function StudentsPage() {
  const supabase = await createClient();

  // Bounded read with the exact total so a cap never silently hides students.
  // (The old .limit(200) truncated the list with no notice — past 200 students
  // the table just quietly ended.)
  const { data: profiles, count } = await supabase
    .from("profiles")
    .select("id, email, role, expires_at, active_session_token, is_test, status, mobile_number", { count: "exact", head: false })
    .eq("role", "student")
    .order("expires_at", { ascending: true, nullsFirst: false })
    .limit(1000);

  const students = profiles ?? [];
  const totalStudents = count ?? students.length;

  const rows: DirectoryRow[] = students.map((student) => {
    const status = (student.status === "blocked" ? "blocked" : "active") as "active" | "blocked";
    const tags = [
      student.active_session_token ? "signed-in" : "not-signed-in",
      ...(student.mobile_number ? [] : ["no-number"]),
      ...(status === "blocked" ? ["locked"] : []),
      ...(student.is_test ? ["test"] : []),
    ];
    const actions = (
      <>
        <Link href={`/admin/cohorts/student/${student.id}`} className="inline-flex h-8 items-center rounded-full border-2 border-foreground px-2.5 text-xs font-semibold">
          Access
        </Link>
        <LockToggle userId={student.id} status={status} />
        <StudentActions userId={student.id} isTest={Boolean(student.is_test)} status={status} />
      </>
    );
    return {
      id: student.id,
      search: `${student.email ?? ""} ${student.mobile_number ?? ""}`.toLowerCase(),
      tags,
      card: (
        <li className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border-2 border-foreground/15 bg-card px-3 py-2.5">
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-primary font-pix text-xs text-primary-foreground"
          >
            {(student.email?.[0] ?? "S").toUpperCase()}
          </span>
          <span className="min-w-0 flex-1 basis-[calc(100%-3.5rem)] sm:basis-0">
            <span className="block truncate text-small font-bold leading-snug text-foreground">
              {student.email ?? student.id}
            </span>
            <span className="mt-0.5 block truncate text-caption text-muted-foreground">
              {student.active_session_token ? "Signed in" : "Not signed in"}
              {student.mobile_number ? ` · +91 ${student.mobile_number}` : " · No number"}
              {student.is_test ? " · Test" : ""}
              {status === "blocked" ? " · Locked" : ""}
            </span>
          </span>
          <span className="ml-auto flex items-center gap-2 sm:ml-0">{actions}</span>
        </li>
      ),
      row: (
        <TableRow>
          <TableCell className="font-semibold text-foreground">
            <span className="flex items-center gap-2">
              {student.email ?? student.id}
              {student.is_test && <Badge variant="pending">Test</Badge>}
              {status === "blocked" && <Badge variant="destructive">Locked</Badge>}
            </span>
          </TableCell>
          <TableCell className="text-muted-foreground">
            {student.mobile_number ? (
              <a
                href={`https://wa.me/91${student.mobile_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-link underline-offset-2 hover:underline"
              >
                +91 {student.mobile_number.slice(0, 5)} {student.mobile_number.slice(5)}
              </a>
            ) : (
              <Badge variant="outline">No number</Badge>
            )}
          </TableCell>
          <TableCell className="text-muted-foreground">{formatDate(student.expires_at)}</TableCell>
          <TableCell>
            {student.active_session_token ? (
              <Badge variant="published">Signed in</Badge>
            ) : (
              <Badge variant="outline">Not signed in</Badge>
            )}
          </TableCell>
          <TableCell>
            <div className="flex items-center justify-end gap-2">{actions}</div>
          </TableCell>
        </TableRow>
      ),
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="People"
        title="Students"
        description="Accounts are only made here. There's no public sign-up."
        badge={<Badge variant="brand">{students.filter((s) => !s.is_test).length} enrolled</Badge>}
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-label="All students" className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-h2">
              <Users className="size-5" aria-hidden />
              All students
            </h2>
            <BulkLockControls />
          </div>
          {students.length < totalStudents ? (
            <p className="text-caption font-semibold text-status-pending-fg">
              Showing the first {students.length} of {totalStudents} students. This list is capped.
            </p>
          ) : null}
          {students.length === 0 ? (
            <EmptyState
              compact
              icon={<Users className="size-6" aria-hidden />}
              title="No students yet"
              description="Add your first student with the form."
            />
          ) : (
            <StudentDirectory rows={rows} />
          )}
        </section>

        <Card variant="raised" className="lg:sticky lg:top-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="size-5 text-link" aria-hidden />
              Add a student
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 rounded-xl border-2 border-foreground bg-primary px-3 py-2 text-sm text-primary-foreground">
              Faster: <Link href="/admin/cohorts" className="font-bold underline">paste many emails into a cohort</Link> and they get their login link straight away.
            </p>
            <CreateStudentForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
