"use client";

import * as React from "react";
import { BellRing, CalendarCheck, ClipboardList, LogOut, Timer } from "lucide-react";
import { SwitchRow } from "@/components/v2me/switch-row";
import type { ReminderPrefs } from "@/lib/app-api/contract";
import { saveReminders } from "@/app/(dashboard)/settings/reminder-actions";

const ROWS: { key: keyof ReminderPrefs; title: string; meta: string; icon: React.ReactNode }[] = [
  { key: "opdDay", title: "OPD day", meta: "In the morning of your OPD day", icon: <CalendarCheck /> },
  { key: "sessionSoon", title: "Before a class or OPD", meta: "30 minutes before it starts", icon: <Timer /> },
  { key: "scanOut", title: "Forgot to scan out", meta: "Just after a session ends", icon: <LogOut /> },
  { key: "caseLog", title: "Log your cases", meta: "The evening after OPD", icon: <ClipboardList /> },
  { key: "leaveLow", title: "Leaves running out", meta: "When only 1 leave is left", icon: <BellRing /> },
];

/** The clinic reminder switches (same as Me, Settings, Reminders in the app). Saved for the account, on every device. */
export function ReminderSwitches({ initial }: { initial: ReminderPrefs }) {
  const [prefs, setPrefs] = React.useState(initial);
  const [error, setError] = React.useState<string | null>(null);
  const flip = (key: keyof ReminderPrefs, on: boolean) => {
    const before = prefs;
    setPrefs({ ...prefs, [key]: on });
    setError(null);
    void saveReminders({ [key]: on })
      .then((r) => {
        if (r.ok) setPrefs(r.prefs);
        else {
          setPrefs(before);
          setError(r.error);
        }
      })
      .catch(() => {
        setPrefs(before);
        setError("That did not save. Try again.");
      });
  };
  return (
    <>
      <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
        {ROWS.map((r) => (
          <SwitchRow key={r.key} icon={r.icon} title={r.title} meta={r.meta} checked={prefs[r.key]} onChange={(on) => flip(r.key, on)} />
        ))}
      </ul>
      {error ? (
        <p role="alert" className="type-small text-destructive">
          {error}
        </p>
      ) : null}
    </>
  );
}
