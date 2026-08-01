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
  created: 0,
  skipped: 0,
  emailsSent: 0,
  failures: [],
};

export function BulkImportForm() {
  const [state, formAction, pending] = useActionState(bulkImportStudents, initial);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="file">CSV file</Label>
        <Input
          id="file"
          name="file"
          type="file"
          accept=".csv,text/csv"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Default password (min 8 chars)</Label>
        <Input
          id="password"
          name="password"
          type="text"
          placeholder="Set a default for new students"
          required
        />
      </div>

      {state.error && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      {state.success && (
        <Alert variant="warning">
          <AlertDescription>
            Created {state.created}, skipped {state.skipped} (existing),
            welcome emails sent: {state.emailsSent}.
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
