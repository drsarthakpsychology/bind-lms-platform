import { CalendarDays, Upload } from "lucide-react";
import { PageHeader } from "@/components/design-system/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BulkImportForm } from "./bulk-import-form";
import { CohortCalendarForm } from "./cohort-calendar-form";

// Note: no <Link> here — the calendar card is a form now (cohort-calendar-form.tsx).

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
              Upload a CSV with headers <code>name,email</code>. Creates accounts —
              re-uploading skips existing emails — and sends a welcome email when
              email is set up.
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
          <CardContent className="space-y-3">
            <p className="text-small text-muted-foreground">
              Generate the whole session schedule from a start date and weekly
              pattern, instead of entering every date by hand.
            </p>
            <CohortCalendarForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
