import { UserPlus, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CreateStudentForm } from "./create-student-form";

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
    .select("id, email, role, expires_at, active_session_token")
    .eq("role", "student")
    .order("expires_at", { ascending: true, nullsFirst: false });

  const students = profiles ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Students"
        description="There's no sign-up page — this is the only way accounts get created."
      />

      <Card variant="raised">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="size-4 text-primary" aria-hidden />
            Add a student
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CreateStudentForm />
        </CardContent>
      </Card>

      <Card variant="flat">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h3">
            <Users className="size-4 text-muted-foreground" aria-hidden />
            All students
            <Badge variant="secondary" className="ml-1">
              {students.length}
            </Badge>
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
            <div className="overflow-hidden rounded-md border-2 border-border">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Signed in</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium text-foreground">
                        {student.email ?? student.id}
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
