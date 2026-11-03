"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Loader2, Mail, Minus, Plus, Settings2, UserMinus, X } from "lucide-react";
import {
  addPeopleToCohort,
  createCohort,
  reopenDetails,
  removeFromCohort,
  sendLoginLink,
  setCohortLessons,
  setPersonCohorts,
  setPersonLesson,
  setPersonScope,
  updateCohort,
  type AddRow,
} from "@/app/(dashboard)/admin/cohorts/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type CohortOpt = { id: string; name: string; status?: string };
type Lesson = { id: string; title: string; week: number | null; status: string | null; course_id: string; course_title: string };

const field = "h-11 w-full rounded-xl border-2 border-foreground bg-card px-3 text-sm font-medium";

/* -------------------------------------------------------- new cohort form */
export function NewCohortForm({ courses }: { courses: { id: string; title: string }[] }) {
  const router = useRouter();
  const [pending, start] = React.useTransition();
  const [name, setName] = React.useState("");
  const [startsOn, setStartsOn] = React.useState("");
  const [courseId, setCourseId] = React.useState(courses[0]?.id ?? "");
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = await createCohort({ name, startsOn, status: "upcoming", courseId });
          if (r.error) return void toast.error(r.error);
          toast.success(`${name} created`);
          setName("");
          router.push(`/admin/cohorts/${r.id}`);
        });
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="cohort-name">Name</Label>
        <Input id="cohort-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Cohort 2" required />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="cohort-start">Starts on</Label>
          <Input id="cohort-start" type="date" value={startsOn} onChange={(e) => setStartsOn(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cohort-course">Course</Label>
          <select id="cohort-course" className={field} value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
            <option value="">No course</option>
          </select>
        </div>
      </div>
      <Button type="submit" disabled={pending || !name.trim()}>
        {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Plus aria-hidden />} Create cohort
      </Button>
    </form>
  );
}

/* ------------------------------------------------------ add people by email */
const OUTCOME: Record<AddRow["outcome"], string> = {
  created: "New account",
  added: "Added",
  already: "Already in this cohort",
  failed: "Not added",
};

export function AddPeopleForm({ cohorts, defaultCohortId }: { cohorts: CohortOpt[]; defaultCohortId?: string }) {
  const router = useRouter();
  const [pending, start] = React.useTransition();
  const [text, setText] = React.useState("");
  const [cohortId, setCohortId] = React.useState(defaultCohortId ?? cohorts[cohorts.length - 1]?.id ?? "");
  const [scope, setScope] = React.useState<"full" | "lectures_only">("full");
  const [mail, setMail] = React.useState(true);
  const [rows, setRows] = React.useState<AddRow[] | null>(null);
  const [invalid, setInvalid] = React.useState<string[]>([]);
  const count = text.split(/[\s,;]+/).filter((x) => x.includes("@")).length;

  if (!cohorts.length) return <p className="text-sm text-muted-foreground">Create a cohort first.</p>;

  return (
    <div className="space-y-4">
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          start(async () => {
            const r = await addPeopleToCohort(cohortId, text, { sendEmail: mail, scope });
            if (r.error) return void toast.error(r.error);
            setRows(r.rows);
            setInvalid(r.invalid);
            const ok = r.rows.filter((x) => x.outcome !== "failed").length;
            toast.success(`${ok} ${ok === 1 ? "person" : "people"} in ${cohorts.find((c) => c.id === cohortId)?.name ?? "the cohort"}`);
            setText("");
            router.refresh();
          });
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="emails">Emails</Label>
          <Textarea
            id="emails"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"one@gmail.com\ntwo@gmail.com, three@outlook.com"}
            className="font-mono text-sm"
          />
          <p className="text-caption text-muted-foreground">Paste one or many. Commas, spaces or new lines all work.</p>
        </div>
        {!defaultCohortId ? (
          <div className="space-y-1.5">
            <Label htmlFor="add-cohort">Cohort</Label>
            <select id="add-cohort" className={field} value={cohortId} onChange={(e) => setCohortId(e.target.value)}>
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <fieldset className="space-y-1.5">
          <legend className="text-sm font-semibold">Access for new accounts</legend>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["lectures_only", "Lectures only"],
                ["full", "Full platform"],
              ] as const
            ).map(([v, l]) => (
              <button
                key={v}
                type="button"
                onClick={() => setScope(v)}
                aria-pressed={scope === v}
                className={cn("h-10 rounded-xl border-2 border-foreground text-sm font-semibold", scope === v ? "bg-foreground text-background" : "bg-card")}
              >
                {l}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" className="size-4 accent-[#1d44d8]" checked={mail} onChange={(e) => setMail(e.target.checked)} />
          Email them their login link now
        </label>
        <Button type="submit" disabled={pending || !count}>
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Plus aria-hidden />}
          {pending ? "Adding…" : count ? `Add ${count} ${count === 1 ? "person" : "people"}` : "Add people"}
        </Button>
      </form>

      {rows ? (
        <div className="rounded-2xl border-2 border-foreground bg-card p-3" role="status">
          <p className="text-sm font-bold">Done</p>
          <ul className="mt-2 max-h-72 space-y-1 overflow-y-auto text-sm">
            {rows.map((r) => (
              <li key={r.email} className="flex flex-wrap items-center gap-x-2 border-b border-foreground/10 py-1.5 last:border-0">
                {r.outcome === "failed" ? <X className="size-4 text-destructive" aria-hidden /> : <Check className="size-4 text-link" aria-hidden />}
                <span className="min-w-0 flex-1 truncate font-medium">{r.email}</span>
                <span className="text-caption text-muted-foreground">
                  {OUTCOME[r.outcome]}
                  {r.mailed ? " · login link sent" : ""}
                </span>
                {r.reason ? <span className="basis-full pl-6 text-caption text-destructive">{r.reason}</span> : null}
              </li>
            ))}
          </ul>
          {invalid.length ? <p className="mt-2 text-caption text-destructive">Skipped (not emails): {invalid.join(", ")}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

/* ---------------------------------------------------------- cohort settings */
export function CohortSettings({ cohort }: { cohort: { id: string; name: string; status: string; starts_on: string | null; ends_on: string | null } }) {
  const router = useRouter();
  const [pending, start] = React.useTransition();
  const [name, setName] = React.useState(cohort.name);
  const [status, setStatus] = React.useState(cohort.status);
  const [startsOn, setStartsOn] = React.useState(cohort.starts_on ?? "");
  const [endsOn, setEndsOn] = React.useState(cohort.ends_on ?? "");
  return (
    <form
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = await updateCohort(cohort.id, { name, status, startsOn, endsOn });
          if (r.error) return void toast.error(r.error);
          toast.success("Saved");
          router.refresh();
        });
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="c-name">Name</Label>
        <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="c-status">Status</Label>
        <select id="c-status" className={field} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="upcoming">Upcoming</option>
          <option value="active">Running</option>
          <option value="ended">Finished</option>
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="c-start">Starts</Label>
        <Input id="c-start" type="date" value={startsOn} onChange={(e) => setStartsOn(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="c-end">Ends</Label>
        <Input id="c-end" type="date" value={endsOn} onChange={(e) => setEndsOn(e.target.value)} />
      </div>
      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Check aria-hidden />} Save
      </Button>
    </form>
  );
}

/* -------------------------------------------------- which lectures it sees */
function groupLessons(lessons: Lesson[]) {
  const groups = new Map<string, { label: string; items: Lesson[] }>();
  for (const l of lessons) {
    const key = `${l.course_id}|${l.week ?? 0}`;
    if (!groups.has(key)) groups.set(key, { label: `${l.course_title}${l.week ? ` · Week ${l.week}` : ""}`, items: [] });
    groups.get(key)!.items.push(l);
  }
  return [...groups.values()];
}

export function LessonSharing({ cohortId, cohortName, lessons, sharedIds }: { cohortId: string; cohortName: string; lessons: Lesson[]; sharedIds: string[] }) {
  const [shared, setShared] = React.useState(() => new Set(sharedIds));
  const [pending, start] = React.useTransition();
  const apply = (ids: string[], on: boolean) => {
    const prev = new Set(shared);
    const next = new Set(shared);
    for (const id of ids) {
      if (on) next.add(id);
      else next.delete(id);
    }
    setShared(next);
    start(async () => {
      const r = await setCohortLessons(cohortId, ids, on);
      if (r.error) {
        setShared(prev);
        toast.error(r.error);
      }
    });
  };
  const all = lessons.map((l) => l.id);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="mr-auto text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{shared.size}</span> of {lessons.length} lectures shared with {cohortName}
          {pending ? <Loader2 className="ml-2 inline size-4 animate-spin" aria-hidden /> : null}
        </p>
        <Button type="button" size="sm" variant="outline" onClick={() => apply(all, true)}>
          <Plus aria-hidden /> Share all
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => apply(all, false)}>
          <Minus aria-hidden /> Share none
        </Button>
      </div>
      {groupLessons(lessons).map((g) => {
        const ids = g.items.map((l) => l.id);
        const allOn = ids.every((id) => shared.has(id));
        return (
          <section key={g.label} className="rounded-2xl border-2 border-foreground bg-card">
            <header className="flex items-center justify-between gap-2 border-b-2 border-foreground/15 px-4 py-2.5">
              <h3 className="text-sm font-bold">{g.label}</h3>
              <button type="button" className="text-caption font-semibold text-link" onClick={() => apply(ids, !allOn)}>
                {allOn ? "Unshare week" : "Share week"}
              </button>
            </header>
            <ul>
              {g.items.map((l) => {
                const on = shared.has(l.id);
                return (
                  <li key={l.id} className="border-b border-foreground/10 last:border-0">
                    <label className="flex cursor-pointer items-center gap-3 px-4 py-2.5">
                      <input type="checkbox" className="size-4 accent-[#1d44d8]" checked={on} onChange={(e) => apply([l.id], e.target.checked)} />
                      <span className="min-w-0 flex-1 text-sm font-medium">{l.title}</span>
                      {l.status && l.status !== "unlocked" ? <span className="text-caption text-muted-foreground">{l.status === "live" ? "Locked" : "Hidden"}</span> : null}
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------ member row */
export function MemberActions({ cohortId, userId, email, setUp }: { cohortId: string; userId: string; email: string; setUp: boolean }) {
  const router = useRouter();
  const [pending, start] = React.useTransition();
  return (
    <span className="flex items-center gap-1.5">
      <Link href={`/admin/cohorts/student/${userId}`} className="inline-flex h-8 items-center gap-1 rounded-full border-2 border-foreground px-2.5 text-xs font-semibold" aria-label={`Access for ${email}`}>
        <Settings2 className="size-3.5" aria-hidden /> Access
      </Link>
      {!setUp ? (
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const r = await sendLoginLink(email);
              if (r.error) toast.error(r.error);
              else toast.success(`Login link sent to ${email}`);
            })
          }
          className="inline-flex h-8 items-center gap-1 rounded-full border-2 border-foreground px-2.5 text-xs font-semibold"
        >
          <Mail className="size-3.5" aria-hidden /> Send link
        </button>
      ) : null}
      <button
        type="button"
        disabled={pending}
        aria-label={`Remove ${email} from this cohort`}
        onClick={() => {
          if (!window.confirm(`Remove ${email} from this cohort? Their account stays; they just lose this cohort's lectures.`)) return;
          start(async () => {
            const r = await removeFromCohort(cohortId, userId);
            if (r.error) toast.error(r.error);
            else router.refresh();
          });
        }}
        className="inline-grid size-8 place-items-center rounded-full border-2 border-destructive text-destructive"
      >
        <UserMinus className="size-3.5" aria-hidden />
      </button>
    </span>
  );
}

/* -------------------------------------------------- one person's access */
export function PersonAccess({
  userId,
  cohorts,
  cohortIds,
  scope,
  lessons,
  grantIds,
  cohortLessonIds,
  detailsConfirmed,
}: {
  userId: string;
  cohorts: CohortOpt[];
  cohortIds: string[];
  scope: string;
  lessons: Lesson[];
  grantIds: string[];
  cohortLessonIds: string[];
  detailsConfirmed: boolean;
}) {
  const router = useRouter();
  const [pending, start] = React.useTransition();
  const [mine, setMine] = React.useState(() => new Set(cohortIds));
  const [grants, setGrants] = React.useState(() => new Set(grantIds));
  const [sc, setSc] = React.useState(scope === "lectures_only" ? "lectures_only" : "full");
  const fromCohort = new Set(cohortLessonIds);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border-2 border-foreground bg-card p-4">
        <h2 className="text-base font-bold">Cohorts</h2>
        <p className="text-caption text-muted-foreground">They watch the lectures shared with any cohort ticked here.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {cohorts.map((c) => {
            const on = mine.has(c.id);
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  const next = new Set(mine);
                  if (on) next.delete(c.id);
                  else next.add(c.id);
                  setMine(next);
                  start(async () => {
                    const r = await setPersonCohorts(userId, [...next]);
                    if (r.error) toast.error(r.error);
                    else router.refresh();
                  });
                }}
                className={cn("inline-flex h-10 items-center gap-1.5 rounded-full border-2 border-foreground px-4 text-sm font-semibold", on ? "bg-brand text-brand-foreground" : "bg-card")}
              >
                {on ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />} {c.name}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border-2 border-foreground bg-card p-4">
        <h2 className="text-base font-bold">What they can open</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:max-w-md">
          {(
            [
              ["lectures_only", "Lectures only"],
              ["full", "Full platform"],
            ] as const
          ).map(([v, l]) => (
            <button
              key={v}
              type="button"
              aria-pressed={sc === v}
              onClick={() => {
                setSc(v);
                start(async () => {
                  const r = await setPersonScope(userId, v);
                  if (r.error) toast.error(r.error);
                  else toast.success(v === "full" ? "Full platform on" : "Lectures only");
                });
              }}
              className={cn("h-10 rounded-xl border-2 border-foreground text-sm font-semibold", sc === v ? "bg-foreground text-background" : "bg-card")}
            >
              {l}
            </button>
          ))}
        </div>
        <p className="mt-2 text-caption text-muted-foreground">Lectures only: Home, Lectures, Notes and Games. Full platform adds Practice, Journal, Wall and Medicines.</p>
      </section>

      <section className="rounded-2xl border-2 border-foreground bg-card p-4">
        <h2 className="text-base font-bold">Extra lectures</h2>
        <p className="text-caption text-muted-foreground">Give this one person a lecture their cohort doesn&apos;t have (for example a missed class from another batch).</p>
        <ul className="mt-3 max-h-96 overflow-y-auto">
          {lessons.map((l) => {
            const viaCohort = fromCohort.has(l.id);
            const on = viaCohort || grants.has(l.id);
            return (
              <li key={l.id} className="border-b border-foreground/10 last:border-0">
                <label className={cn("flex items-center gap-3 py-2", viaCohort ? "cursor-default" : "cursor-pointer")}>
                  <input
                    type="checkbox"
                    className="size-4 accent-[#1d44d8]"
                    checked={on}
                    disabled={viaCohort || pending}
                    onChange={(e) => {
                      const next = new Set(grants);
                      if (e.target.checked) next.add(l.id);
                      else next.delete(l.id);
                      setGrants(next);
                      start(async () => {
                        const r = await setPersonLesson(userId, l.id, e.target.checked);
                        if (r.error) toast.error(r.error);
                      });
                    }}
                  />
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="font-medium">{l.title}</span>
                    <span className="block text-caption text-muted-foreground">
                      {l.course_title}
                      {l.week ? ` · Week ${l.week}` : ""}
                      {viaCohort ? " · from their cohort" : grants.has(l.id) ? " · given to them" : ""}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      {detailsConfirmed ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const r = await reopenDetails(userId);
              if (r.error) toast.error(r.error);
              else {
                toast.success("They'll be asked to check their details next time they open VIBHA");
                router.refresh();
              }
            })
          }
        >
          Ask them to fill their details again
        </Button>
      ) : null}
    </div>
  );
}
