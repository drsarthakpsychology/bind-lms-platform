"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, ChevronDown, Loader2, Upload, UserPlus } from "lucide-react";
import { previewRosterCsv, confirmBulkImport, type BulkImportResult } from "../students/bulk-import";
import type { RosterFailure, RosterRow } from "@/lib/auth/roster";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type Phase = "upload" | "preview" | "importing" | "done";

const emptyResult: BulkImportResult = {
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

/** Mailchimp-style import: parse first, show what will happen, then confirm. */
export function BulkImportForm() {
  const router = useRouter();
  const [phase, setPhase] = React.useState<Phase>("upload");
  const [scope, setScope] = React.useState("lectures_only");
  const [fileName, setFileName] = React.useState("");
  const [rows, setRows] = React.useState<RosterRow[]>([]);
  const [invalid, setInvalid] = React.useState<RosterFailure[]>([]);
  const [duplicates, setDuplicates] = React.useState<RosterFailure[]>([]);
  const [emptyNames, setEmptyNames] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<BulkImportResult>(emptyResult);
  const [showIssues, setShowIssues] = React.useState(false);

  async function onFile(file: File | null) {
    setError(null);
    if (!file) return;
    const text = await file.text();
    const res = await previewRosterCsv(text);
    if (res.error) {
      setError(res.error);
      return;
    }
    setFileName(file.name);
    setRows(res.rows ?? []);
    setInvalid(res.invalid ?? []);
    setDuplicates(res.duplicates ?? []);
    setEmptyNames(res.emptyNames ?? []);
    setShowIssues(false);
    setPhase("preview");
  }

  async function runImport() {
    setPhase("importing");
    setError(null);
    const res = await confirmBulkImport(rows, scope);
    if (res.error) {
      setError(res.error);
      setPhase("preview");
      return;
    }
    setResult(res);
    setPhase("done");
  }

  function reset() {
    setPhase("upload");
    setFileName("");
    setRows([]);
    setInvalid([]);
    setDuplicates([]);
    setEmptyNames([]);
    setResult(emptyResult);
    setError(null);
  }

  const validCount = rows.length;
  const issueCount = invalid.length + duplicates.length + emptyNames.length;

  return (
    <div className="space-y-5">
      {phase === "upload" && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="file">CSV file (name, email)</Label>
            <Input
              id="file"
              name="file"
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              required
            />
            <p className="text-caption text-muted-foreground">
              One row per person: <code>name,email</code>. We check every row before anything is created.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="scope">What can they see?</Label>
            <select
              id="scope"
              name="scope"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full rounded-lg border-2 border-border bg-card px-3 py-2 text-small text-foreground"
            >
              <option value="lectures_only">Lectures only (locked to the lecture list + player)</option>
              <option value="full">Full student access</option>
            </select>
          </div>

          {error && (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {phase === "preview" && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-small font-medium text-foreground">
              <span className="font-semibold">{fileName}</span> — {rows.length} ready to import
              {issueCount > 0 && `, ${issueCount} need attention`}
            </p>
            <Button type="button" variant="outline" size="xs" onClick={reset}>
              Choose a different file
            </Button>
          </div>

          {/* Count cards */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-md border-2 border-foreground bg-card p-3">
              <p className="text-numeric text-h3 font-bold">{validCount}</p>
              <p className="text-caption text-muted-foreground">Ready to import</p>
            </div>
            <div className="rounded-md border-2 border-border bg-card p-3">
              <p className="text-numeric text-h3 font-bold">{duplicates.length}</p>
              <p className="text-caption text-muted-foreground">Duplicate emails</p>
            </div>
            <div className="rounded-md border-2 border-border bg-card p-3">
              <p className="text-numeric text-h3 font-bold">{invalid.length}</p>
              <p className="text-caption text-muted-foreground">Invalid emails</p>
            </div>
            <div className="rounded-md border-2 border-border bg-card p-3">
              <p className="text-numeric text-h3 font-bold">{emptyNames.length}</p>
              <p className="text-caption text-muted-foreground">No name</p>
            </div>
          </div>

          {/* Issue details */}
          {(duplicates.length > 0 || invalid.length > 0 || emptyNames.length > 0) && (
            <button
              type="button"
              onClick={() => setShowIssues((v) => !v)}
              className="flex w-full items-center justify-between rounded-md border-2 border-border bg-card px-3 py-2 text-left text-small font-medium text-foreground"
            >
              <span className="inline-flex items-center gap-2">
                <AlertTriangle className="size-4 text-status-alert-fg" aria-hidden />
                Rows we&apos;ll skip ({issueCount})
              </span>
              <ChevronDown
                className={cn("size-4 text-muted-foreground transition-transform duration-fast ease-snappy", showIssues && "rotate-180")}
                aria-hidden
              />
            </button>
          )}
          {showIssues && (
            <div className="space-y-2 rounded-md border-2 border-border bg-muted/40 p-3 text-caption text-muted-foreground">
              {duplicates.map((d) => (
                <p key={d.email}>Row {d.row}: {d.email} — {d.reason}</p>
              ))}
              {invalid.map((d) => (
                <p key={`${d.row}-${d.email}`}>Row {d.row}: {d.email} — {d.reason}</p>
              ))}
              {emptyNames.map((email) => (
                <p key={`empty-${email}`}>{email} — has no name (we&apos;ll use their email address)</p>
              ))}
            </div>
          )}

          {/* The rows that WILL be created */}
          <div className="max-h-64 overflow-y-auto rounded-md border-2 border-border">
            <table className="w-full text-left text-small">
              <thead className="sticky top-0 bg-muted">
                <tr>
                  <th className="px-3 py-2 font-semibold text-foreground">Name</th>
                  <th className="px-3 py-2 font-semibold text-foreground">Email</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.email} className="border-t border-border">
                    <td className="px-3 py-1.5 text-foreground">{r.name}</td>
                    <td className="px-3 py-1.5 text-muted-foreground">{r.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="scope2">What can they see?</Label>
            <select
              id="scope2"
              name="scope"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full rounded-lg border-2 border-border bg-card px-3 py-2 text-small text-foreground"
            >
              <option value="lectures_only">Lectures only (locked to the lecture list + player)</option>
              <option value="full">Full student access</option>
            </select>
          </div>

          {error && (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" size="lg" onClick={runImport} disabled={validCount === 0}>
              <UserPlus className="size-4" aria-hidden />
              Import {validCount} student{validCount === 1 ? "" : "s"}
            </Button>
            <Button type="button" variant="outline" onClick={reset}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {phase === "importing" && (
        <div className="flex items-center gap-2 text-small text-muted-foreground">
          <Loader2 className="size-4 animate-spin text-link" aria-hidden />
          Creating {rows.length} accounts — each gets an 8-char password…
        </div>
      )}

      {phase === "done" && (
        <div className="space-y-4">
          <Alert variant={result.created > 0 ? "warning" : "destructive"}>
            <AlertDescription className="flex items-start gap-2">
              {result.created > 0 ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-status-success-fg" aria-hidden />
              ) : (
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-status-alert-fg" aria-hidden />
              )}
              <span>
                {result.created > 0 ? (
                  <>
                    Created <span className="font-semibold">{result.created}</span> account{result.created === 1 ? "" : "s"}.
                    {result.duplicatesSkipped > 0 && ` ${result.duplicatesSkipped} duplicate(s) skipped.`}
                    {result.invalidSkipped > 0 && ` ${result.invalidSkipped} invalid row(s) skipped.`}
                  </>
                ) : (
                  "Nothing was created — the file had no valid rows."
                )}
              </span>
            </AlertDescription>
          </Alert>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="lg" onClick={() => router.push("/admin/emails?tab=credentials")}>
              <Upload className="size-4" aria-hidden />
              Open the roster &amp; share passwords
            </Button>
            <Button type="button" variant="outline" onClick={reset}>
              Import another file
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
