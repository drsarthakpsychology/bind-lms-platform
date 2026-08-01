import { createClient } from "@/lib/supabase/server";
import { CreateStudentForm } from "./create-student-form";

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
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
          Students
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          There&apos;s no sign-up page — this is the only way accounts get created.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <h2 className="text-sm font-medium text-foreground">Add a student</h2>
        <div className="mt-3">
          <CreateStudentForm />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Expires</th>
              <th className="px-4 py-2 font-medium">Signed in</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">
                  No students yet.
                </td>
              </tr>
            )}
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-4 py-3 text-foreground">{student.email ?? student.id}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(student.expires_at)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {student.active_session_token ? "Active session" : "Not signed in"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
