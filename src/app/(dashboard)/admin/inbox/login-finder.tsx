"use client";

import * as React from "react";
import Link from "next/link";
import { KeyRound, Search } from "lucide-react";
import { LoginQuick } from "../students/login-quick";
import type { LoginPerson } from "./data";

/**
 * Inbox: find a student by name, email or roll number and copy or email
 * their login details in one tap (the old Mail → Logins shortcut, back where
 * the admin already is).
 */
export function LoginFinder({ people }: { people: LoginPerson[] }) {
  const [q, setQ] = React.useState("");
  const needle = q.trim().toLowerCase();
  const hits = needle ? people.filter((p) => `${p.name} ${p.email} ${p.roll ?? ""}`.toLowerCase().includes(needle)).slice(0, 5) : [];
  return (
    <section aria-labelledby="inbox-logins" className="space-y-3 rounded-xl border-2 border-foreground bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="inbox-logins" className="flex items-center gap-2 text-h3 font-semibold">
          <KeyRound className="size-5 text-link" aria-hidden /> Login details
        </h2>
        <Link href="/admin/roster" className="text-sm font-bold text-link hover:underline">
          All logins
        </Link>
      </div>
      <label className="relative block">
        <span className="sr-only">Find a student</span>
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Find a student by name, email or roll number"
          autoComplete="off"
          className="h-11 w-full rounded-md border-2 border-foreground bg-background pr-3 pl-10 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
        />
      </label>
      {needle ? (
        hits.length ? (
          <ul className="divide-y-2 divide-foreground/10">
            {hits.map((p) => (
              <li key={p.email} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-2">
                <div className="min-w-0 flex-1 basis-48">
                  <p className="truncate text-sm font-bold">{p.name}</p>
                  <p className="truncate text-caption text-muted-foreground">
                    {p.roll ? `${p.roll} · ` : ""}
                    {p.email}
                  </p>
                </div>
                <LoginQuick email={p.email} name={p.name} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No student matches.</p>
        )
      ) : null}
    </section>
  );
}
