"use client";

import * as React from "react";
import { Loader2, Search } from "lucide-react";
import { loadRecipientData, type RecipientData } from "./actions";
import { cn } from "@/lib/utils";

/**
 * Recipient selection for the compose tab — the same select-people idiom as
 * course enrollment (search + checkboxes + select-all), plus one-tap course
 * shortcuts so a cohort-wide email is a single checkbox. The recipient set is
 * lifted to the parent (compose tab) and shown as a live count.
 */
export function RecipientPicker({
  selected,
  onChange,
}: {
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
}) {
  const [data, setData] = React.useState<RecipientData | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    let alive = true;
    loadRecipientData().then((d) => {
      if (alive) setData(d);
    }).catch(() => alive && setError("Could not load the roster."));
    return () => {
      alive = false;
    };
  }, []);

  const courseEmails = React.useMemo(() => {
    const out: Record<string, string[]> = {};
    for (const c of data?.courses ?? []) {
      const ids = data?.enrolledByCourse[c.id] ?? [];
      const emails = ids.map((id) => data?.students.find((s) => s.id === id)?.email).filter((e): e is string => Boolean(e));
      out[c.id] = emails;
    }
    return out;
  }, [data]);

  const q = query.trim().toLowerCase();
  const filtered = q ? (data?.students ?? []).filter((s) => s.email.toLowerCase().includes(q)) : (data?.students ?? []);
  const allVisibleSelected = filtered.length > 0 && filtered.every((s) => selected.has(s.email));

  function toggle(email: string) {
    const next = new Set(selected);
    next.add(email);
    onChange(next);
  }
  function untoggle(email: string) {
    const next = new Set(selected);
    next.delete(email);
    onChange(next);
  }
  function toggleVisible() {
    const next = new Set(selected);
    if (allVisibleSelected) filtered.forEach((s) => next.delete(s.email));
    else filtered.forEach((s) => next.add(s.email));
    onChange(next);
  }
  function toggleCourse(courseId: string) {
    const emails = courseEmails[courseId] ?? [];
    if (emails.length === 0) return;
    const allIn = emails.every((e) => selected.has(e));
    const next = new Set(selected);
    if (allIn) emails.forEach((e) => next.delete(e));
    else emails.forEach((e) => next.add(e));
    onChange(next);
  }

  if (error) return <p role="alert" className="text-small text-status-alert-fg">{error}</p>;
  if (!data) {
    return (
      <p className="flex items-center gap-2 text-small text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden />
        Loading students…
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {/* Course shortcuts */}
      {data.courses.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {data.courses.map((c) => {
            const emails = courseEmails[c.id] ?? [];
            const on = emails.length > 0 && emails.every((e) => selected.has(e));
            const partial = emails.length > 0 && !on && emails.some((e) => selected.has(e));
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCourse(c.id)}
                disabled={emails.length === 0}
                className={cn(
                  "rounded-md border-2 border-border px-3 py-1.5 text-caption font-medium transition-colors",
                  on
                    ? "bg-primary text-primary-foreground"
                    : partial
                      ? "bg-accent text-foreground"
                      : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  emails.length === 0 && "pointer-events-none opacity-50",
                )}
              >
                {c.title} · {emails.length}
              </button>
            );
          })}
        </div>
      ) : null}

      {/* Search + select all */}
      <label className="sr-only" htmlFor="recipient-search">
        Search students
      </label>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          id="recipient-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${data.students.length} students…`}
          className="h-9 w-full rounded-md border-2 border-input bg-background pl-8 pr-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/60"
        />
      </div>

      <label className="flex cursor-pointer items-center gap-1.5 text-small text-foreground">
        <input
          type="checkbox"
          checked={allVisibleSelected}
          onChange={toggleVisible}
          disabled={filtered.length === 0}
          aria-label="Select all visible students"
          className="size-4 accent-primary"
        />
        Select all{query ? " visible" : ""} ({filtered.length})
      </label>

      <ul className="max-h-56 space-y-1 overflow-y-auto rounded-md border-2 border-border bg-background p-2">
        {filtered.length === 0 ? (
          <li className="px-1 py-1 text-caption text-muted-foreground">No students match “{query}”.</li>
        ) : (
          filtered.map((s) => {
            const isOn = selected.has(s.email);
            return (
              <li key={s.id} className="flex items-center gap-2 text-small text-foreground">
                <input
                  type="checkbox"
                  checked={isOn}
                  onChange={() => (isOn ? untoggle(s.email) : toggle(s.email))}
                  aria-label={`Select ${s.email}`}
                  className="size-4 shrink-0 accent-primary"
                />
                <span className="truncate">{s.email}</span>
              </li>
            );
          })
        )}
      </ul>

      <p className="text-caption text-muted-foreground">
        {selected.size} recipient{selected.size === 1 ? "" : "s"} selected
      </p>
    </div>
  );
}
