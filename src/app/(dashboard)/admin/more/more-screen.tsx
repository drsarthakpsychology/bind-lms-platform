import { Activity, Award, BookOpen, CalendarDays, ClipboardCheck, FileCheck, Gauge, Inbox, Medal, Radar, Settings, UserX, Users, type LucideIcon } from "lucide-react";
import { ADMIN_MORE_GROUPS } from "@/components/navigation/v2-config";
import { PageFrame, Row, RowList, Section } from "@/components/ds";
import { MeDisplayRows } from "../../me/me-controls";
import { MoreAccountRows } from "./more-controls";

const ICONS: Record<string, LucideIcon> = { inbox: Inbox, users: Users, radar: Radar, fileCheck: FileCheck, bookOpen: BookOpen, clipboardCheck: ClipboardCheck, award: Award, medal: Medal, gauge: Gauge, settings: Settings, calendar: CalendarDays, userX: UserX, activity: Activity };

/** The More screen itself (plain props, so it renders in tests and the fixture harness). */
export function AdminMoreScreen({ email, viewOnly }: { email: string | null; viewOnly: boolean }) {
  const initial = ((email ?? "A").trim()[0] ?? "A").toUpperCase();
  return (
    <PageFrame>
      <header className="flex min-w-0 items-center gap-4">
        <span aria-hidden className="grid size-14 shrink-0 place-items-center rounded-full bg-brand type-h2 text-brand-foreground">
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="type-h2">More</h1>
          {email ? <p className="type-small text-muted-foreground [overflow-wrap:anywhere]">{email}</p> : null}
          <p className="type-caption text-muted-foreground">{viewOnly ? "View Admin" : "Admin"}</p>
        </div>
      </header>
      {ADMIN_MORE_GROUPS.map((g) => (
        <Section key={g.title} id={g.title.toLowerCase()} title={g.title}>
          <RowList>
            {g.rows.map((r) => {
              const Icon = ICONS[r.icon] ?? BookOpen;
              return <Row key={r.href} href={r.href} icon={<Icon />} title={r.label} />;
            })}
          </RowList>
        </Section>
      ))}

      <Section id="display" title="Display">
        <MeDisplayRows student={false} />
      </Section>

      <Section id="account" title="Account">
        <MoreAccountRows />
      </Section>
    </PageFrame>
  );
}
