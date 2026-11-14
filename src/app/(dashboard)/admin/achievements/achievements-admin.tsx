"use client";

import * as React from "react";
import { Download, ShieldX, Sparkles, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  awardAllBadges,
  createCertificateDraft,
  getCredentialDownload,
  issueCertificate,
  listCertificateEligible,
  listCredentials,
  revokeCredential,
  saveAchievement,
  saveSignatureAsset,
  setAchievementEnabled,
  type AchievementRow,
  type CredentialRow,
} from "./actions";
import type { AchievementRequirement } from "@/lib/achievements/rules";

type Facet = { id: string; title: string };
type Course = { id: string; title: string };

const TONE_OPTIONS = ["lime", "blue", "ink", "gold", "rose"] as const;
const KIND_LABEL: Record<AchievementRequirement["kind"], string> = {
  module_complete: "Complete a module",
  sections_read: "Read N sections",
  xp: "Earn N XP",
  watch_seconds: "Watch N minutes",
  course_complete: "Complete a course",
  module_tests_passed: "Course certificate: pass every module test at 80%",
};

function badgeTone(tone: string) {
  return {
    lime: "bg-lime-200 border-lime-800",
    blue: "bg-sky-200 border-sky-800",
    ink: "bg-slate-200 border-slate-800",
    gold: "bg-amber-200 border-amber-800",
    rose: "bg-rose-200 border-rose-800",
  }[tone] ?? "bg-lime-200 border-lime-800";
}

export function AchievementsAdmin({
  achievements,
  credentials,
  total,
  courses,
  modules,
}: {
  achievements: AchievementRow[];
  credentials: CredentialRow[];
  total: number;
  courses: Course[];
  modules: Facet[];
}) {
  const [tab, setTab] = React.useState<"achievements" | "credentials">("achievements");
  const [msg, setMsg] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  // Achievement form state
  const [editing, setEditing] = React.useState<AchievementRow | null>(null);
  const [type, setType] = React.useState<"badge" | "certificate">("badge");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [icon, setIcon] = React.useState("");
  const [tone, setTone] = React.useState<string>("lime");
  const [kind, setKind] = React.useState<AchievementRequirement["kind"]>("module_complete");
  const [module, setModule] = React.useState("");
  const [course, setCourse] = React.useState("");
  const [count, setCount] = React.useState(1);
  const [minXp, setMinXp] = React.useState(100);
  const [minMin, setMinMin] = React.useState(60);

  // Credentials filter state
  const [status, setStatus] = React.useState("all");
  const [ctype, setCtype] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [creds, setCreds] = React.useState(credentials);
  const [ctotal, setCtotal] = React.useState(total);

  // Certificate eligible
  const [eligibleFor, setEligibleFor] = React.useState<string | null>(null);

  async function refreshCreds() {
    const r = await listCredentials({ status, type: ctype, search });
    setCreds(r.rows);
    setCtotal(r.total);
  }

  function buildReq(): AchievementRequirement {
    switch (kind) {
      case "module_complete":
        return { kind, module };
      case "sections_read":
        return { kind, module, count };
      case "xp":
        return { kind, min: minXp };
      case "watch_seconds":
        return { kind, min: minMin * 60 };
      case "course_complete":
        return { kind, course_id: course };
      case "module_tests_passed":
        return { kind };
    }
  }

  function startEdit(a: AchievementRow) {
    setEditing(a);
    setType(a.type);
    setTitle(a.title);
    setDescription(a.description ?? "");
    setIcon(a.icon ?? "");
    setTone(a.tone);
    const r = (a.requirements ?? {}) as AchievementRequirement;
    setKind(r.kind ?? "module_complete");
    setModule("module" in r ? r.module : "");
    setCourse("course_id" in r ? r.course_id : "");
    setCount("count" in r ? r.count : 1);
    setMinXp("min" in r && r.kind === "xp" ? r.min : 100);
    setMinMin("min" in r && r.kind === "watch_seconds" ? Math.round(r.min / 60) : 60);
  }

  function resetForm() {
    setEditing(null);
    setType("badge");
    setTitle("");
    setDescription("");
    setIcon("");
    setTone("lime");
    setKind("module_complete");
    setModule("");
    setCourse("");
    setCount(1);
    setMinXp(100);
    setMinMin(60);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await saveAchievement({ id: editing?.id, type, title, description, module_id: module || null, course_id: course || null, icon: icon || null, tone, requirements: buildReq() });
    setBusy(false);
    if (res.error) setMsg(res.error);
    else {
      setMsg("Saved.");
      resetForm();
      window.location.reload();
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <header>
        <p className="text-eyebrow text-link">Super Admin only</p>
        <h1 className="text-h1">Achievements &amp; Credentials</h1>
      </header>

      <div className="flex gap-2" role="tablist">
        {(["achievements", "credentials"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={cn("min-h-10 rounded-full border-2 border-foreground px-4 text-sm font-bold", tab === t ? "bg-foreground text-background" : "bg-card")}>
            {t === "achievements" ? "Achievements" : "Credentials"}
          </button>
        ))}
      </div>

      {msg && <p className="text-sm font-semibold">{msg}</p>}

      {tab === "achievements" ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Achievement templates</h2>
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                const r = await awardAllBadges();
                setBusy(false);
                setMsg(`Awarded ${r.awarded}, skipped ${r.skipped}.`);
              }}
              className="inline-flex min-h-11 items-center gap-2 rounded-md border-2 border-foreground bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-50"
            >
              <Sparkles className="size-4" aria-hidden /> Award eligible badges
            </button>
          </div>

          <ul className="space-y-2">
            {achievements.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-foreground bg-card p-3">
                <span className={cn("grid size-10 place-items-center rounded-xl border-2 text-lg", badgeTone(a.tone))} aria-hidden>
                  {a.icon ?? "🎓"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold leading-tight">{a.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.type} · {KIND_LABEL[(a.requirements as AchievementRequirement).kind ?? "module_complete"]} · {a.issued_count} issued
                  </p>
                </div>
                {a.type === "certificate" && (
                  <button type="button" onClick={() => setEligibleFor(a.id)} className="min-h-9 rounded-md border-2 border-foreground bg-card px-3 text-xs font-semibold">
                    Eligible
                  </button>
                )}
                <button type="button" onClick={() => startEdit(a)} className="min-h-9 rounded-md border-2 border-foreground bg-card px-3 text-xs font-semibold">
                  Edit
                </button>
                <button type="button" onClick={async () => { await setAchievementEnabled(a.id, !a.enabled); window.location.reload(); }} className={cn("min-h-9 rounded-md border-2 px-3 text-xs font-semibold", a.enabled ? "border-foreground bg-card" : "border-foreground bg-foreground text-background")}>
                  {a.enabled ? "Disable" : "Enable"}
                </button>
              </li>
            ))}
          </ul>

          {eligibleFor && (
            <EligiblePanel achievementId={eligibleFor} onClose={() => setEligibleFor(null)} />
          )}

          {/* Create / edit form */}
          <section className="rounded-2xl border-2 border-foreground bg-card p-4">
            <h2 className="text-lg font-bold">{editing ? "Edit achievement" : "New achievement"}</h2>
            <form onSubmit={submit} className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                Type
                <select value={type} onChange={(e) => setType(e.target.value as "badge" | "certificate")} className="mt-1 min-h-11 w-full rounded-md border-2 border-foreground bg-background px-2">
                  <option value="badge">Module badge</option>
                  <option value="certificate">Official certificate</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                Title
                <input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 min-h-11 w-full rounded-md border-2 border-foreground bg-background px-2" />
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                Description
                <input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 min-h-11 w-full rounded-md border-2 border-foreground bg-background px-2" />
              </label>
              <label className="text-sm font-semibold">
                Icon (emoji)
                <input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="🎓" className="mt-1 min-h-11 w-full rounded-md border-2 border-foreground bg-background px-2" />
              </label>
              <label className="text-sm font-semibold">
                Tone
                <select value={tone} onChange={(e) => setTone(e.target.value)} className="mt-1 min-h-11 w-full rounded-md border-2 border-foreground bg-background px-2">
                  {TONE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold">
                Requirement
                <select value={kind} onChange={(e) => setKind(e.target.value as AchievementRequirement["kind"])} className="mt-1 min-h-11 w-full rounded-md border-2 border-foreground bg-background px-2">
                  {(Object.keys(KIND_LABEL) as AchievementRequirement["kind"][]).map((k) => (
                    <option key={k} value={k}>{KIND_LABEL[k]}</option>
                  ))}
                </select>
              </label>
              {(kind === "module_complete" || kind === "sections_read") && (
                <label className="text-sm font-semibold">
                  Module
                  <select value={module} onChange={(e) => setModule(e.target.value)} className="mt-1 min-h-11 w-full rounded-md border-2 border-foreground bg-background px-2">
                    <option value="">Choose…</option>
                    {modules.map((m) => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </label>
              )}
              {kind === "sections_read" && (
                <label className="text-sm font-semibold">
                  Sections
                  <input type="number" min={1} value={count} onChange={(e) => setCount(Number(e.target.value))} className="mt-1 min-h-11 w-full rounded-md border-2 border-foreground bg-background px-2" />
                </label>
              )}
              {kind === "xp" && (
                <label className="text-sm font-semibold">
                  XP
                  <input type="number" min={1} value={minXp} onChange={(e) => setMinXp(Number(e.target.value))} className="mt-1 min-h-11 w-full rounded-md border-2 border-foreground bg-background px-2" />
                </label>
              )}
              {kind === "watch_seconds" && (
                <label className="text-sm font-semibold">
                  Minutes
                  <input type="number" min={1} value={minMin} onChange={(e) => setMinMin(Number(e.target.value))} className="mt-1 min-h-11 w-full rounded-md border-2 border-foreground bg-background px-2" />
                </label>
              )}
              {kind === "course_complete" && (
                <label className="text-sm font-semibold">
                  Course
                  <select value={course} onChange={(e) => setCourse(e.target.value)} className="mt-1 min-h-11 w-full rounded-md border-2 border-foreground bg-background px-2">
                    <option value="">Choose…</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </label>
              )}
              {type === "certificate" && editing && (
                <SignatureUpload achievementId={editing.id} />
              )}
              <div className="flex gap-2 sm:col-span-2">
                <button type="submit" disabled={busy} className="min-h-11 rounded-md border-2 border-foreground bg-foreground px-5 py-2 text-sm font-bold text-background disabled:opacity-50">
                  {busy ? "Saving…" : editing ? "Save changes" : "Create"}
                </button>
                {editing && (
                  <button type="button" onClick={resetForm} className="min-h-11 rounded-md border-2 border-foreground bg-card px-5 py-2 text-sm font-bold">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>
      ) : (
        <CredentialsTab creds={creds} ctotal={ctotal} status={status} setStatus={setStatus} ctype={ctype} setCtype={setCtype} search={search} setSearch={setSearch} onRefresh={refreshCreds} setMsg={setMsg} />
      )}
    </div>
  );
}

function EligiblePanel({ achievementId, onClose }: { achievementId: string; onClose: () => void }) {
  const [rows, setRows] = React.useState<Array<{ id: string; name: string; reason: string }>>([]);
  const [loaded, setLoaded] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);
  React.useEffect(() => {
    listCertificateEligible(achievementId).then((r) => {
      setRows(r);
      setLoaded(true);
    });
  }, [achievementId]);
  return (
    <div className="rounded-2xl border-2 border-foreground bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Eligible students</h3>
        <button type="button" onClick={onClose} className="text-sm font-semibold underline underline-offset-4">Close</button>
      </div>
      {msg && <p className="text-sm font-semibold">{msg}</p>}
      {!loaded ? (
        <p className="text-sm text-muted-foreground">Checking…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No eligible students.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-2 rounded-xl border-2 border-foreground/30 p-2">
              <span className="min-w-0 flex-1">
                <span className="font-semibold">{r.name}</span>
                <span className="block text-xs text-muted-foreground">{r.reason}</span>
              </span>
              <button
                type="button"
                onClick={async () => {
                  const res = await createCertificateDraft(r.id, achievementId);
                  setMsg(res.error ?? `Draft created${res.credentialId ? ` (${res.credentialId.slice(0, 8)}…)` : ""}.`);
                }}
                className="min-h-9 rounded-md border-2 border-foreground bg-primary px-3 text-xs font-bold text-primary-foreground"
              >
                Create draft
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SignatureUpload({ achievementId }: { achievementId: string }) {
  const [msg, setMsg] = React.useState<string | null>(null);
  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const res = await saveSignatureAsset(achievementId, String(reader.result), f.name.replace(/\.[^.]+$/, ""));
      setMsg(res.error ?? "Signature saved.");
    };
    reader.readAsDataURL(f);
  }
  return (
    <div className="text-sm font-semibold sm:col-span-2">
      Authorised signature
      <label className="mt-1 flex min-h-11 cursor-pointer items-center gap-2 rounded-md border-2 border-dashed border-foreground bg-background px-3">
        <Upload className="size-4" aria-hidden /> Upload PNG (≤2 MB)
        <input type="file" accept="image/png,image/jpeg" onChange={onFile} className="hidden" />
      </label>
      {msg && <span className="text-xs font-semibold">{msg}</span>}
    </div>
  );
}

function CredentialsTab({
  creds, ctotal, status, setStatus, ctype, setCtype, search, setSearch, onRefresh, setMsg,
}: {
  creds: CredentialRow[];
  ctotal: number;
  status: string;
  setStatus: (s: string) => void;
  ctype: string;
  setCtype: (s: string) => void;
  search: string;
  setSearch: (s: string) => void;
  onRefresh: () => void;
  setMsg: (m: string | null) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select value={status} onChange={(e) => { setStatus(e.target.value); }} className="min-h-10 rounded-md border-2 border-foreground bg-background px-2 text-sm">
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="approved">Approved</option>
          <option value="issued">Issued</option>
          <option value="revoked">Revoked</option>
        </select>
        <select value={ctype} onChange={(e) => setCtype(e.target.value)} className="min-h-10 rounded-md border-2 border-foreground bg-background px-2 text-sm">
          <option value="all">All types</option>
          <option value="badge">Badges</option>
          <option value="certificate">Certificates</option>
        </select>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name…" className="min-h-10 min-w-0 flex-1 rounded-md border-2 border-foreground bg-background px-2 text-sm" />
        <button type="button" onClick={onRefresh} className="min-h-10 rounded-md border-2 border-foreground bg-card px-4 text-sm font-bold">Filter</button>
      </div>
      <p className="text-sm font-semibold">{ctotal} credentials</p>
      <ul className="space-y-2">
        {creds.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-foreground bg-card p-3">
            <span className="min-w-0 flex-1">
              <span className="block font-bold leading-tight">{c.student_name}</span>
              <span className="block text-xs text-muted-foreground">{c.title} · {c.type} · {c.status}{c.issued_at ? ` · ${new Date(c.issued_at).toLocaleDateString()}` : ""}</span>
              <span className="block break-all font-mono text-[0.65rem] text-muted-foreground">{c.credential_id}</span>
            </span>
            {c.type === "certificate" && (c.status === "draft" || c.status === "approved") && (
              <button type="button" onClick={async () => { const r = await issueCertificate(c.credential_id); setMsg(r.error ?? "Issued."); onRefresh(); }} className="min-h-9 rounded-md border-2 border-foreground bg-primary px-3 text-xs font-bold text-primary-foreground">
                Issue
              </button>
            )}
            {c.type === "certificate" && c.status === "issued" && (
              <button type="button" onClick={async () => { const r = await getCredentialDownload(c.credential_id); if (r.url) window.open(r.url, "_blank"); else setMsg(r.error ?? "No file."); }} className="min-h-9 rounded-md border-2 border-foreground bg-card px-3 text-xs font-semibold">
                <Download className="size-3.5" aria-hidden /> PDF
              </button>
            )}
            {c.status !== "revoked" && (
              <button type="button" onClick={async () => { const reason = prompt("Reason for revocation:"); if (reason) { const r = await revokeCredential(c.credential_id, reason); setMsg(r.error ?? "Revoked."); onRefresh(); } }} className="min-h-9 rounded-md border-2 border-foreground bg-card px-3 text-xs font-semibold text-red-600">
                <ShieldX className="size-3.5" aria-hidden /> Revoke
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
