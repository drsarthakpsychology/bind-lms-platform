"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UserPlus, X } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AddPeopleForm } from "@/components/admin/cohorts-ui";

const EVENT = "plms:add-people";
/** URL trigger (used by the ⌘K palette): `?add=people`, optionally `&addCohort=<id>`. */
export const ADD_PEOPLE_PARAM = "add";

/** Open the Add people panel from anywhere (optionally with a cohort preselected and people filled in). */
export function openAddPeople(cohortId?: string, text?: string) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { cohortId, text } }));
}

/**
 * The one Add people panel (DI §C-7), mounted once in the admin shell. It
 * wraps AddPeopleForm (same form and actions as Students → Add), so the flow
 * is identical everywhere: paste names or emails → pick a cohort → tick
 * "send login email" → done. Opens from openAddPeople() or `?add=people`.
 */
export function AddPeoplePanel({ cohorts, canWrite }: { cohorts: { id: string; name: string }[]; canWrite: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [byEvent, setByEvent] = React.useState<{ open: boolean; cohortId?: string; text?: string; n: number }>({ open: false, n: 0 });
  const byUrl = sp.get(ADD_PEOPLE_PARAM) === "people";
  const open = byUrl || byEvent.open;
  const cohortId = (byUrl ? sp.get("addCohort") : byEvent.cohortId) ?? undefined;

  React.useEffect(() => {
    function onOpen(e: Event) {
      const detail = (e as CustomEvent<{ cohortId?: string; text?: string }>).detail ?? {};
      setByEvent((s) => ({ open: true, cohortId: detail.cohortId, text: detail.text, n: s.n + 1 }));
    }
    window.addEventListener(EVENT, onOpen);
    return () => window.removeEventListener(EVENT, onOpen);
  }, []);

  function close() {
    setByEvent((s) => ({ ...s, open: false }));
    if (byUrl) {
      const next = new URLSearchParams(sp.toString());
      next.delete(ADD_PEOPLE_PARAM);
      next.delete("addCohort");
      const q = next.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    }
  }

  const known = cohortId && cohorts.some((c) => c.id === cohortId) ? cohortId : undefined;

  return (
    <Sheet open={open} onOpenChange={(o) => (o ? null : close())}>
      <SheetContent side="right" showCloseButton={false} className="w-full gap-0 overflow-y-auto border-l-2 border-foreground sm:max-w-md">
        <div className="flex items-start justify-between gap-3 border-b-2 border-foreground p-4">
          <div className="min-w-0">
            <SheetTitle className="flex items-center gap-2 text-h3">
              <UserPlus className="size-5 text-link" aria-hidden /> Add people
            </SheetTitle>
            <SheetDescription className="mt-1 text-small">Paste names or emails, pick a cohort, done.</SheetDescription>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={close} aria-label="Close" className="pointer-coarse:size-11">
            <X aria-hidden />
          </Button>
        </div>
        <div className="p-4">
          {!canWrite ? (
            <p className="text-sm">Only the Super Admin can add people.</p>
          ) : (
            <AddPeopleForm
              key={`${byEvent.n}-${known ?? "any"}`}
              cohorts={cohorts}
              defaultCohortId={known}
              initialText={byUrl ? "" : (byEvent.text ?? "")}
              pickCohort
              idPrefix="panel"
            />
          )}
          <p className="mt-6 text-caption text-muted-foreground">
            Have a spreadsheet?{" "}
            <Link href="/admin/students/add?way=file" onClick={close} className="font-bold text-link underline">
              Upload a file
            </Link>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** "Add people" button for page headers: opens the panel, with this page's cohort preselected. */
export function AddPeopleButton({
  cohortId,
  label = "Add people",
  variant = "default",
  size = "sm",
  className,
}: {
  cohortId?: string;
  label?: string;
  variant?: "default" | "outline";
  size?: "sm" | "default";
  className?: string;
}) {
  return (
    <Button type="button" variant={variant} size={size} className={className} onClick={() => openAddPeople(cohortId)}>
      <UserPlus aria-hidden /> {label}
    </Button>
  );
}
