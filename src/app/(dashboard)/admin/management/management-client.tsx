"use client";

import * as React from "react";
import { addAdmin, removeAdmin, resendAdminInvite, setAdminRole, type AdminRow } from "./actions";

type Role = "admin" | "view_admin";

const ROLE_LABEL: Record<Role, string> = {
  admin: "Super Admin / Owner",
  view_admin: "View Admin (read only)",
};

export function ManagementClient({ admins, me }: { admins: AdminRow[]; me: { id: string; email: string | null } }) {
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<Role>("view_admin");
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [setupUrl, setSetupUrl] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    setSetupUrl(null);
    const res = await addAdmin(email, role);
    setBusy(false);
    if (res.error) setMessage(res.error);
    else {
      setMessage("Added. Share the setup link below (it works once).");
      setSetupUrl(res.setupUrl ?? null);
      setEmail("");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border-2 border-foreground bg-card p-4">
        <h2 className="text-lg font-bold">Add an administrator</h2>
        <form onSubmit={submit} className="mt-3 space-y-3">
          <label className="block text-sm font-semibold">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 min-h-11 w-full rounded-md border-2 border-foreground bg-background px-2"
              placeholder="name@example.com"
            />
          </label>
          <label className="block text-sm font-semibold">
            Administrator type
            <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="mt-1 min-h-11 w-full rounded-md border-2 border-foreground bg-background px-2">
              <option value="view_admin">View Admin (read only)</option>
              <option value="admin">Super Admin (full access)</option>
            </select>
          </label>
          <button type="submit" disabled={busy} className="min-h-11 rounded-full border-2 border-foreground bg-foreground px-5 py-2 text-sm font-bold text-background disabled:opacity-50">
            {busy ? "Adding…" : "Add administrator"}
          </button>
        </form>
        {message && <p className="mt-3 text-sm font-semibold">{message}</p>}
        {setupUrl && (
          <p className="mt-2 break-all rounded-md border-2 border-dashed border-foreground bg-background p-2 text-xs">
            Setup link: <span className="font-mono">{setupUrl}</span>
          </p>
        )}
      </section>

      <section className="rounded-2xl border-2 border-foreground bg-card p-4">
        <h2 className="text-lg font-bold">Administrators</h2>
        <ul className="mt-3 divide-y divide-foreground/20">
          {admins.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{a.email}</p>
                <p className="text-xs text-muted-foreground">
                  {ROLE_LABEL[a.role]} · {a.status}
                  {a.id === me.id ? " · you" : ""}
                </p>
              </div>
              {a.id !== me.id && (
                <>
                  <select
                    value={a.role}
                    onChange={async (e) => {
                      const r = e.target.value as Role;
                      const res = await setAdminRole(a.id, r);
                      setMessage(res.error ?? `Role updated.`);
                    }}
                    className="min-h-9 rounded-md border-2 border-foreground bg-background px-2 text-sm"
                  >
                    <option value="view_admin">View Admin</option>
                    <option value="admin">Super Admin</option>
                  </select>
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await resendAdminInvite(a.email);
                      setMessage(res.error ?? `Setup link sent to ${a.email}.`);
                    }}
                    className="min-h-9 rounded-full border-2 border-foreground bg-card px-3 text-sm font-semibold"
                  >
                    Resend link
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!confirm(`Remove ${a.email}? This deletes their account.`)) return;
                      const res = await removeAdmin(a.id);
                      setMessage(res.error ?? "Removed.");
                    }}
                    className="min-h-9 rounded-full border-2 border-foreground bg-card px-3 text-sm font-semibold text-red-600"
                  >
                    Remove
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
