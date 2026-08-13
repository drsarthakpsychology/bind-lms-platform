import Link from "next/link";
import { CalendarDays, Upload } from "lucide-react";
import { PageHeader } from "@/components/design-system/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BulkImportForm } from "./bulk-import-form";

export default function AdminToolsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin tools"
        description="Automations that save you the weekend work."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="size-4 text-link" aria-hidden />
              Bulk student import
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-small text-muted-foreground">
              Upload a CSV with headers <code>name,email</code>. Creates accounts
              (idempotent — re-uploading skips existing emails) and sends a welcome
              email if Resend is configured.
            </p>
            <BulkImportForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="size-4 text-link" aria-hidden />
              Cohort calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-small text-muted-foreground">
            <p>
              Generate the whole session schedule from a start date + weekly
              pattern, instead of entering every date by hand.
            </p>
            <p>
              <Link
                href="/api/cohort-calendar?startDate=2026-08-20&startTime=09:00&weekdays=6,0&weeks=12&title=Cohort+One"
                className="inline-flex items-center gap-1 font-medium text-link hover:underline"
              >
                Download sample .ics →
              </Link>
            </p>
            <p className="text-caption">
              Adjust the URL params (startDate, startTime, weekdays 0-6, weeks,
              title) to match your cohort, then add the .ics to your calendar.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
