"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { haptic } from "@/lib/haptics";

interface SessionRow {
  id: string;
  peerEmail: string;
  role: string;
  status: string;
  createdAt: string;
}

/**
 * The role-play lobby — start a new session with a classmate (by email) or
 * rejoin an existing one.
 */
export function RolePlayLobby({
  sessions,
  recommendedPeer,
}: {
  sessions: SessionRow[];
  recommendedPeer?: { email: string; reason: string } | null;
}) {
  const router = useRouter();
  const [peerEmail, setPeerEmail] = React.useState("");
  const [role, setRole] = React.useState<"patient" | "clinician">("clinician");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !peerEmail.trim()) return;
    setBusy(true);
    setError(null);
    haptic("tap");
    try {
      const res = await fetch("/api/practice/roleplay/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ peerEmail: peerEmail.trim(), myRole: role }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(j?.error ?? "Could not create the session.");
        return;
      }
      const j = (await res.json()) as { sessionId: string };
      haptic("success");
      router.push(`/practice/role-play?session=${j.sessionId}`);
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Skill-matched partner suggestion */}
      {recommendedPeer ? (
        <div className="rounded-md border-2 border-primary bg-primary/5 p-4">
          <p className="text-base font-semibold">A partner matched to your gaps</p>
          <p className="mt-1 text-small text-muted-foreground">{recommendedPeer.reason}</p>
          <button
            type="button"
            onClick={() => {
              setPeerEmail(recommendedPeer.email);
              haptic("tap");
            }}
            className="mt-3 rounded-md border-2 border-primary bg-primary px-3 py-1.5 text-caption font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
          >
            Invite {recommendedPeer.email} →
          </button>
        </div>
      ) : null}

      <form onSubmit={create} className="space-y-3 rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
        <p className="text-base font-semibold">Start a session</p>
        <div>
          <label htmlFor="peer-email" className="text-caption font-medium text-muted-foreground">
            Your classmate&apos;s email
          </label>
          <input
            id="peer-email"
            type="email"
            value={peerEmail}
            onChange={(e) => setPeerEmail(e.target.value)}
            placeholder="classmate@lumen.test"
            className="mt-1 w-full rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-2">
          {(["clinician", "patient"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => { setRole(r); haptic("tap"); }}
              aria-pressed={role === r}
              className={`flex-1 rounded-md border-2 border-border px-3 py-2 text-small font-medium transition-transform active:translate-y-px ${
                role === r ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
              }`}
            >
              I&apos;ll play the {r}
            </button>
          ))}
        </div>
        {error ? <p className="text-small text-red-600" role="alert">{error}</p> : null}
        <button
          type="submit"
          disabled={busy || !peerEmail.trim()}
          className="w-full rounded-md border-2 border-border bg-primary px-4 py-2.5 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
        >
          {busy ? "Starting…" : "Start role-play"}
        </button>
      </form>

      {sessions.length > 0 ? (
        <div>
          <h2 className="text-base font-semibold">Your sessions</h2>
          <ul className="mt-3 space-y-2">
            {sessions.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/practice/role-play?session=${s.id}`}
                  className="flex items-center justify-between rounded-md border-2 border-border bg-card px-4 py-3 transition-transform hover:-translate-y-px active:translate-y-px"
                >
                  <div>
                    <p className="text-small font-medium">{s.peerEmail}</p>
                    <p className="text-caption text-muted-foreground">
                      You play {s.role} · {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-caption font-medium ${s.status === "active" ? "bg-green-100 text-green-800" : "bg-secondary text-muted-foreground"}`}>
                    {s.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
