import { createAdminClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { RetryFailedCredentials } from "./retry-failed";

export const dynamic = "force-dynamic";

type SentRow = {
  id: string;
  recipient: string;
  name: string | null;
  subject: string;
  template_id: string | null;
  status: "pending" | "sent" | "failed";
  error_reason: string | null;
  sent_at: string | null;
  created_at: string;
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const TEMPLATE_LABELS: Record<string, string> = {
  credential: "Credential",
  welcome: "Welcome",
  announcement: "Announcement",
  custom: "Custom",
};

/**
 * Sent — the unified send history (credentials + campaigns) from email_sends.
 * Read-only except for retrying failed CREDENTIAL sends (campaign bodies aren't
 * stored, so a failed campaign is re-composed, not retried here).
 */
export async function SentTab() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("email_sends")
    .select("id, recipient, name, subject, template_id, status, error_reason, sent_at, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = (data ?? []) as SentRow[];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-small text-muted-foreground">
          Every send — credentials and campaigns — appears here.
        </p>
        <RetryFailedCredentials />
      </div>

      {rows.length === 0 ? (
        <div className="rounded-md border-2 border-border bg-card p-6 text-center">
          <p className="text-base font-medium">No emails sent yet</p>
          <p className="mt-1 text-small text-muted-foreground">
            Send credentials from the Credentials tab, or compose a campaign from the Compose tab.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-3 rounded-md border-2 border-border bg-card px-4 py-3">
              <div className="min-w-0 flex-1 basis-56">
                <p className="truncate text-small font-medium [overflow-wrap:anywhere]">
                  {r.subject}
                </p>
                <p className="truncate text-caption text-muted-foreground">
                  {r.recipient}
                  {r.name ? ` · ${r.name}` : ""}
                </p>
              </div>
              <span className="text-caption text-muted-foreground">
                {TEMPLATE_LABELS[r.template_id ?? ""] ?? r.template_id ?? "—"}
              </span>
              <Badge
                variant={r.status === "sent" ? "published" : r.status === "failed" ? "destructive" : "pending"}
              >
                {r.status}
              </Badge>
              <span className="text-caption text-muted-foreground">{fmtDate(r.sent_at ?? r.created_at)}</span>
              {r.status === "failed" && r.error_reason ? (
                <span className="max-w-48 truncate text-caption text-status-alert-fg" title={r.error_reason}>
                  {r.error_reason}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
