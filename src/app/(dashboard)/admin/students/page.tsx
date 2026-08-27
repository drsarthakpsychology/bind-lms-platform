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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, role, expires_at, active_session_token, is_test, status, mobile_number")
    .eq("role", "student")
    .order("expires_at", { ascending: true, nullsFirst: false })
    .limit(200);

  const students = profiles ?? [];

  return (
    <div className="flex flex-col gap-8">
      <div className="order-1">
        <PageHeader
          title="Students"
          description="There's no sign-up page — this is the only way accounts get created."
        />
      </div>

      <Card variant="raised" className="order-3 lg:order-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="size-4 text-link" aria-hidden />
            Add a student
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CreateStudentForm />
        </CardContent>
      </Card>

      <Card variant="flat" className="order-2 lg:order-3">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2 text-h3">
            <Users className="size-4 text-muted-foreground" aria-hidden />
            All students
            <Badge variant="secondary" className="ml-1">
              {students.filter((s) => !s.is_test).length}
            </Badge>
            <span className="ml-auto">
              <BulkLockControls />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {students.length === 0 ? (
            <EmptyState
              compact
              icon={<Users className="size-6" aria-hidden />}
              title="No students yet"
              description="Create your first student above to get started."
            />
          ) : (
            <>
              {/* Mobile roster — stacked records below lg; the 4-col table is lg+.
                  Rendered as a div row (not MobileListItem) because the trailing
                  StudentActions holds its own buttons — nesting a <button> inside
                  MobileListItem's <button> would be invalid HTML. */}
              <div className="lg:hidden">
                <ul className="space-y-2">
                  {students.map((student) => (
                    <li
                      key={student.id}
                      className="flex min-h-[48px] items-center gap-3 rounded-lg border-2 border-border bg-card px-3 py-2"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-small font-semibold leading-snug text-foreground [overflow-wrap:anywhere]">
                          {student.email ?? student.id}
                        </span>
                        <span className="mt-0.5 block truncate text-caption text-muted-foreground">
                          {formatDate(student.expires_at)} · {student.active_session_token ? "Active session" : "Not signed in"}
                          {student.is_test ? " · Test" : ""}
                          {student.mobile_number ? ` · WhatsApp +91 ${student.mobile_number}` : " · No number"}
                        </span>
                      </span>
                      <LockToggle userId={student.id} status={(student.status === "blocked" ? "blocked" : "active") as "active" | "blocked"} />
                      <StudentActions userId={student.id} isTest={Boolean(student.is_test)} status={(student.status === "blocked" ? "blocked" : "active") as "active" | "blocked"} />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="hidden overflow-hidden rounded-md border-2 border-border lg:block">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile / WhatsApp</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Signed in</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium text-foreground">
                        <span className="flex items-center gap-2">
                          {student.email ?? student.id}
                          {student.is_test && <Badge variant="pending">Test</Badge>}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {student.mobile_number ? (
                          <a
                            href={`https://wa.me/91${student.mobile_number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-medium text-link underline-offset-2 hover:underline"
                          >
                            +91 {student.mobile_number.slice(0, 5)} {student.mobile_number.slice(5)}
                          </a>
                        ) : (
                          <Badge variant="outline">No number</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(student.expires_at)}
                      </TableCell>
                      <TableCell>
                        {student.active_session_token ? (
                          <Badge variant="published">Active session</Badge>
                        ) : (
                          <Badge variant="outline">Not signed in</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <LockToggle userId={student.id} status={(student.status === "blocked" ? "blocked" : "active") as "active" | "blocked"} />
                          <StudentActions userId={student.id} isTest={Boolean(student.is_test)} status={(student.status === "blocked" ? "blocked" : "active") as "active" | "blocked"} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
