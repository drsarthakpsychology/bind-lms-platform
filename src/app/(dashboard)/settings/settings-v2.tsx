import { Bell, MessageCircle } from "lucide-react";
import { PageFrame, Row, RowList, Section } from "@/components/ds";
import { MiddleTruncate } from "@/components/ui/middle-truncate";
import { logout } from "@/lib/auth/actions";
import { ReminderSwitches } from "@/components/settings/reminder-switches";
import type { ReminderPrefs } from "@/lib/app-api/contract";
import { DisplaySwitches, LearningSwitches, LogOutRow } from "./settings-controls";

/**
 * Settings (new design): grouped rows, like a phone's settings app. Who is
 * signed in, how the app looks, how it behaves while you learn, where your
 * notifications are, help, and log out last.
 */
export function SettingsV2({
  email,
  roleLabel,
  rollNumber,
  student,
  whatsappHref,
  reminders,
}: {
  email: string | null;
  roleLabel: string;
  rollNumber: string | null;
  student: boolean;
  whatsappHref: string;
  reminders: ReminderPrefs | null;
}) {
  return (
    <PageFrame title="Settings" width="reading">
      <Section id="account" title="Account">
        <dl className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
          <div className="flex min-h-14 min-w-0 items-center justify-between gap-4 py-2">
            <dt className="shrink-0 type-body font-semibold">Email</dt>
            <dd className="min-w-0 text-right type-small text-muted-foreground">
              <MiddleTruncate text={email ?? "Signed in"} />
            </dd>
          </div>
          <div className="flex min-h-14 min-w-0 items-center justify-between gap-4 py-2">
            <dt className="shrink-0 type-body font-semibold">Account</dt>
            <dd className="min-w-0 text-right type-small text-muted-foreground">{roleLabel}</dd>
          </div>
          {rollNumber ? (
            <div className="flex min-h-14 min-w-0 items-center justify-between gap-4 py-2">
              <dt className="shrink-0 type-body font-semibold">Roll number</dt>
              <dd className="min-w-0 text-right type-small text-muted-foreground type-num [overflow-wrap:anywhere]">{rollNumber}</dd>
            </div>
          ) : null}
        </dl>
      </Section>

      <Section id="display" title="Display">
        <DisplaySwitches />
        <p className="type-caption text-muted-foreground">Kept on this device.</p>
      </Section>

      {student ? (
        <Section id="learning" title="Learning">
          <LearningSwitches />
        </Section>
      ) : null}

      {student && reminders ? (
        <Section id="reminders" title="Clinic reminders">
          <ReminderSwitches initial={reminders} />
        </Section>
      ) : null}

      <Section id="updates" title="Updates and help">
        <RowList>
          <Row href="/notifications" icon={<Bell />} title="Notifications" />
          <Row href={whatsappHref} external icon={<MessageCircle />} title="Message us on WhatsApp" meta="Login, video or payment trouble" />
        </RowList>
      </Section>

      <Section id="session">
        <div className="border-y border-[var(--ds-hairline)]">
          <form action={logout}>
            <LogOutRow />
          </form>
        </div>
        <p className="type-caption text-muted-foreground">Your progress stays saved.</p>
      </Section>
    </PageFrame>
  );
}
