"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Plus, Search, UserMinus, UserPlus, Users, X } from "lucide-react";
import { addToCourse, changeCohortMembership, newCohortForCourse, removeFromCourse, type CoursePeople, type CoursePerson } from "./people-actions";
import { cn } from "@/lib/utils";

/**
 * Course builder → Students and cohorts. One place to: see this course's
 * cohorts and make the next one, and enrol or remove anyone from the list of
 * all students (search by name or email, tick many, pick their cohort).
 */
export function CoursePeoplePanel({ courseId, lectureCount, data }: { courseId: string; lectureCount: number; data: CoursePeople }) {
  const router = useRouter();
  const [tab, setTab] = React.useState<"in" | "out">("in");
  const [q, setQ] = React.useState("");
  const [picked, setPicked] = React.useState<Set<string>>(new Set());
  const [busy, setBusy] = React.useState<string | null>(null);
  const [msg, setMsg] = React.useState<{ ok: boolean; text: string } | null>(null);
  const [confirm, setConfirm] = React.useState<string | null>(null);
  const live = data.cohorts.filter((c) => c.status !== "ended");
  const [target, setTarget] = React.useState<string>(live.at(-1)?.id ?? "");

  const nameOf = React.useMemo(() => new Map(data.cohorts.map((c) => [c.id, c.name])), [data.cohorts]);
  const inside = data.people.filter((p) => p.enrolled);
  const outside = data.people.filter((p) => !p.enrolled);
  const needle = q.trim().toLowerCase();
  const list = (tab === "in" ? inside : outside).filter((p) => !needle || `${p.name ?? ""} ${p.email}`.toLowerCase().includes(needle));
  const allPicked = list.length > 0 && list.every((p) => picked.has(p.id));

  const run = async (key: string, fn: () => Promise<{ error: string | null }>, ok: string) => {
    setBusy(key);
    setMsg(null);
    const res = await fn();
    setBusy(null);
    setConfirm(null);
    setMsg(res.error ? { ok: false, text: res.error } : { ok: true, text: ok });
    if (!res.error) {
      setPicked(new Set());
      router.refresh();
    }
  };

  return (
    <section aria-labelledby="course-people" className="space-y-5 rounded-3xl border-2 border-foreground bg-card p-4 hard-shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="course-people" className="flex items-center gap-2 text-h3 font-bold">
          <Users className="size-5 text-link" aria-hidden /> Students and cohorts
        </h2>
        <p className="text-sm text-muted-foreground">
          {inside.length} in this course · {outside.length} not yet
        </p>
      </div>

      {data.cohortsReady ? <Cohorts courseId={courseId} data={data} lectureCount={lectureCount} /> : null}

      {/* Enrolled / add tabs */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-1 rounded-full border-2 border-foreground bg-background p-1 sm:inline-grid" role="tablist" aria-label="Students">
          {(
            [
              ["in", `In this course (${inside.length})`],
              ["out", `Add students (${outside.length})`],
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={tab === k}
              onClick={() => {
                setTab(k);
                setPicked(new Set());
                setConfirm(null);
              }}
              className={cn("h-10 rounded-full px-4 text-sm font-bold", tab === k ? "bg-foreground text-background" : "")}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or email"
            aria-label="Search students"
            className="h-11 w-full rounded-2xl border-2 border-foreground bg-background pr-10 pl-10 text-sm font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
          />
          {q ? (
            <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-full hover:bg-muted">
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
        </div>

        {tab === "out" ? (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border-2 border-foreground bg-primary p-2.5 text-primary-foreground">
            <label className="flex items-center gap-2 px-1 text-sm font-semibold">
              <input
                type="checkbox"
                checked={allPicked}
                onChange={() => setPicked(allPicked ? new Set() : new Set(list.map((p) => p.id)))}
                className="size-4 accent-[#111111]"
                aria-label="Tick everyone shown"
              />
              All shown
            </label>
            {data.cohortsReady ? (
              <label className="flex items-center gap-1.5 text-sm font-semibold">
                into
                <select value={target} onChange={(e) => setTarget(e.target.value)} className="h-9 rounded-full border-2 border-foreground bg-card px-2.5 text-sm font-bold text-foreground">
                  {live.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                  <option value="">No cohort</option>
                </select>
              </label>
            ) : null}
            <button
              type="button"
              disabled={!picked.size || busy !== null}
              onClick={() => run("add", () => addToCourse(courseId, [...picked], target || null), `Added ${picked.size}.`)}
              className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-full border-2 border-foreground bg-foreground px-4 text-sm font-bold text-background disabled:opacity-50"
            >
              {busy === "add" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <UserPlus className="size-4" aria-hidden />}
              Add {picked.size || ""}
            </button>
          </div>
        ) : null}

        {msg ? (
          <p role="status" className={cn("rounded-xl border-2 px-3 py-2 text-sm font-semibold", msg.ok ? "border-foreground bg-muted" : "border-destructive bg-status-alert-bg text-status-alert-fg")}>
            {msg.text}
          </p>
        ) : null}

        {list.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-foreground/30 p-5 text-center text-sm font-semibold text-muted-foreground">
            {needle ? `Nobody matches "${q}".` : tab === "in" ? "Nobody is in this course yet. Use Add students." : "Everyone is already in this course."}
          </p>
        ) : (
          <ul className="max-h-[28rem] divide-y-2 divide-foreground/10 overflow-y-auto rounded-2xl border-2 border-foreground bg-background">
            {list.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-2.5">
                {tab === "out" ? (
                  <input
                    type="checkbox"
                    checked={picked.has(p.id)}
                    onChange={() =>
                      setPicked((s) => {
                        const n = new Set(s);
                        if (n.has(p.id)) n.delete(p.id);
                        else n.add(p.id);
                        return n;
                      })
                    }
                    aria-label={`Tick ${p.email}`}
                    className="size-4 accent-[#1d44d8]"
                  />
                ) : null}
                <div className="min-w-0 flex-1 basis-44">
                  <p className="truncate text-sm font-bold">{p.name || p.email.split("@")[0]}</p>
                  <p className="truncate text-caption text-muted-foreground">{p.email}</p>
                </div>
                {tab === "in" ? (
                  <>
                    {data.cohortsReady ? (
                      <Memberships
                        person={p}
                        data={data}
                        busy={busy}
                        onChange={(cohortId, op) => {
                          const name = nameOf.get(cohortId) ?? "the cohort";
                          return run(`${p.id}:${cohortId}`, () => changeCohortMembership(courseId, p.id, cohortId, op), op === "add" ? `Added ${p.email} to ${name}.` : `Took ${p.email} out of ${name}.`);
                        }}
                      />
                    ) : null}
                    <button
                      type="button"
                      disabled={busy !== null}
                      onClick={() => (confirm === p.id ? run(p.id, () => removeFromCourse(courseId, p.id, p.cohortIds), `Removed ${p.email}.`) : setConfirm(p.id))}
                      className={cn(
                        "inline-flex h-8 items-center gap-1 rounded-full border-2 px-3 text-xs font-bold",
                        confirm === p.id ? "border-destructive bg-destructive text-white" : "border-foreground bg-card",
                      )}
                    >
                      {busy === p.id ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <UserMinus className="size-3.5" aria-hidden />}
                      {confirm === p.id ? "Yes, remove" : "Remove"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() => run(p.id, () => addToCourse(courseId, [p.id], target || null), `Added ${p.email}.`)}
                    className="inline-flex h-8 items-center gap-1 rounded-full border-2 border-foreground bg-card px-3 text-xs font-bold"
                  >
                    {busy === p.id ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <UserPlus className="size-3.5" aria-hidden />} Add
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        <p className="text-caption text-muted-foreground">
          New people? <Link href="/admin/cohorts" className="font-semibold text-link underline">Paste their emails into a cohort</Link> to make their accounts and send their login.
        </p>
      </div>
    </section>
  );
}

type Pending = { cohortId: string; op: "add" | "remove" };

/**
 * One student's cohorts in this course, as chips. Add them to one more
 * cohort, or take them out of one; each change names the cohort and asks
 * first. Their other cohorts are never touched.
 */
function Memberships({
  person,
  data,
  busy,
  onChange,
}: {
  person: CoursePerson;
  data: CoursePeople;
  busy: string | null;
  onChange: (cohortId: string, op: "add" | "remove") => Promise<void>;
}) {
  const [pending, setPending] = React.useState<Pending | null>(null);
  const mine = data.cohorts.filter((c) => person.cohortIds.includes(c.id));
  const canAdd = data.cohorts.filter((c) => c.status !== "ended" && !person.cohortIds.includes(c.id));
  const who = person.name || person.email.split("@")[0];
  const pendingName = pending ? (data.cohorts.find((c) => c.id === pending.cohortId)?.name ?? "the cohort") : "";
  const working = pending ? busy === `${person.id}:${pending.cohortId}` : false;

  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5">
        {mine.length === 0 ? <span className="text-caption font-semibold text-muted-foreground">No cohort</span> : null}
        {mine.map((c) => (
          <span key={c.id} className="inline-flex h-8 items-center gap-1 rounded-full border-2 border-foreground bg-brand pr-1 pl-3 text-xs font-bold text-brand-foreground">
            {c.name}
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => setPending({ cohortId: c.id, op: "remove" })}
              aria-label={`Take ${person.email} out of ${c.name}`}
              className="grid size-6 place-items-center rounded-full hover:bg-background/25 disabled:opacity-50"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          </span>
        ))}
        {canAdd.length ? (
          <select
            aria-label={`Add ${person.email} to a cohort`}
            value=""
            disabled={busy !== null}
            onChange={(e) => e.target.value && setPending({ cohortId: e.target.value, op: "add" })}
            className="h-8 max-w-40 rounded-full border-2 border-dashed border-foreground bg-card px-2 text-xs font-bold"
          >
            <option value="">+ Add to cohort</option>
            {canAdd.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        ) : null}
      </div>
      {pending ? (
        <div role="group" aria-label="Confirm cohort change" className="order-last flex basis-full flex-wrap items-center gap-2 rounded-xl border-2 border-foreground bg-muted px-3 py-2">
          <p className="min-w-0 flex-1 basis-56 text-sm font-semibold">
            {pending.op === "add"
              ? `Add ${who} to ${pendingName}? Their other cohorts stay.`
              : `Take ${who} out of ${pendingName}? They stop seeing ${pendingName}'s lectures. Their other cohorts stay.`}
          </p>
          <button
            type="button"
            disabled={busy !== null}
            onClick={async () => {
              await onChange(pending.cohortId, pending.op);
              setPending(null);
            }}
            className={cn(
              "inline-flex h-8 items-center gap-1 rounded-full border-2 px-3 text-xs font-bold disabled:opacity-60",
              pending.op === "remove" ? "border-destructive bg-destructive text-white" : "border-foreground bg-foreground text-background",
            )}
          >
            {working ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : null}
            {pending.op === "add" ? `Yes, add to ${pendingName}` : `Yes, take out of ${pendingName}`}
          </button>
          <button type="button" disabled={working} onClick={() => setPending(null)} className="h-8 rounded-full border-2 border-foreground bg-card px-3 text-xs font-semibold">
            Cancel
          </button>
        </div>
      ) : null}
    </>
  );
}

function Cohorts({ courseId, data, lectureCount }: { courseId: string; data: CoursePeople; lectureCount: number }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(`Cohort ${data.cohorts.length + 1}`);
  const [share, setShare] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const make = async () => {
    setBusy(true);
    setErr(null);
    const res = await newCohortForCourse(courseId, name, share);
    setBusy(false);
    if (res.error) setErr(res.error);
    else {
      setOpen(false);
      router.refresh();
    }
  };
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cohorts in this course</p>
      <div className="flex flex-wrap gap-2">
        {data.cohorts.map((c) => (
          <Link
            key={c.id}
            href={`/admin/cohorts/${c.id}`}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full border-2 border-foreground px-4 text-sm font-bold transition-transform hover:-translate-y-0.5",
              c.status === "ended" ? "bg-muted" : "bg-brand text-brand-foreground",
            )}
          >
            {c.name}
            <span className="font-pix text-[0.65rem] opacity-90">{c.members}</span>
            {c.status === "ended" ? <span className="text-xs font-semibold">· ended</span> : null}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        ))}
        <button
          type="button"
          onClick={() => {
            setName(`Cohort ${data.cohorts.length + 1}`);
            setOpen((o) => !o);
          }}
          aria-expanded={open}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border-2 border-dashed border-foreground bg-card px-4 text-sm font-bold"
        >
          <Plus className="size-4" aria-hidden /> New cohort
        </button>
      </div>
      {open ? (
        <div className="space-y-3 rounded-2xl border-2 border-foreground bg-background p-3">
          <label className="block text-sm font-semibold">
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 h-11 w-full rounded-xl border-2 border-foreground bg-card px-3 text-base outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60" />
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} className="mt-0.5 size-4 accent-[#1d44d8]" />
            <span>
              Also give them the {lectureCount} lectures already in this course.
              <span className="block text-caption text-muted-foreground">Leave it off for a fresh batch: they get only the lectures you add from now on.</span>
            </span>
          </label>
          {err ? <p className="text-sm font-semibold text-status-alert-fg">{err}</p> : null}
          <div className="flex gap-2">
            <button type="button" onClick={make} disabled={busy} className="inline-flex h-10 items-center gap-1.5 rounded-full border-2 border-foreground bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-60">
              {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Plus className="size-4" aria-hidden />} Make {name || "cohort"}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="h-10 rounded-full border-2 border-foreground px-4 text-sm font-semibold">
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
