"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { bulkImportStudents, type BulkImportResult } from "../students/bulk-import";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const initial: BulkImportResult = {
  error: null,
  success: false,
  rowsRead: 0,
  created: 0,
  duplicatesSkipped: 0,
  invalidSkipped: 0,
  emailsSent: 0,
  emailsFailed: 0,
  failures: [],
  createdAccounts: [],
  emptyNames: [],
};

export function BulkImportForm() {
  const [state, formAction, pending] = useActionState(bulkImportStudents, initial);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="file">CSV file (name, email)</Label>
        <Input
          id="file"
          name="file"
          type="file"
          accept=".csv,text/csv"
          required
        />
        <p className="text-caption text-muted-foreground">
          One row per person: <code>name,email</code>. Nothing else is read.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="scope">What can they see?</Label>
        <select
          id="scope"
          name="scope"
          className="w-full rounded-lg border-2 border-border bg-card px-3 py-2 text-small text-foreground"
          defaultValue="full"
        >
          <option value="full">Full student access</option>
          <option value="lectures_only">Lectures only (locked to the lecture list + player)</option>
        </select>
      </div>

      {state.error && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      {state.success && (
        <Alert variant="warning">
          <AlertDescription>
            Created {state.created}, duplicates skipped {state.duplicatesSkipped},
            invalid skipped {state.invalidSkipped}, emails sent {state.emailsSent}
            {state.emailsFailed > 0 && `, emails failed ${state.emailsFailed}`}.
            {state.failures.length > 0 && ` ${state.failures.length} row(s) failed.`}
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {pending ? "Importing…" : "Import students"}
      </Button>
    </form>
  );
}
