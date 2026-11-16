"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { REQUIREMENT_KINDS, type AchievementRequirement } from "@/lib/achievements/rules";
import { isEditableRule, MADE_FOR_YOU as MADE_FOR_YOU_RE, RULE_LABEL as RULE_WORDS, ruleText as ruleWords, TYPE_TONES } from "@/lib/achievements/type-words";
import { createCertificateDraft, listCertificateEligible, saveAchievement, saveSignatureAsset, setAchievementEnabled, type AchievementRow } from "../../achievements/actions";
import { Block, btn, Empty, More, nameLink, Notice, RowItem, Rows, Status, table } from "../../_v2/kit";
import { field, label } from "../_ui/parts";

type Facet = { id: string; title: string };
type Kind = AchievementRequirement["kind"];

const RULE_LABEL = RULE_WORDS;
const TONES = TYPE_TONES;
const MADE_FOR_YOU = MADE_FOR_YOU_RE;
const editable = (a: AchievementRow) => isEditableRule(a);
const ruleText = (a: AchievementRow, modules: Facet[], courses: Facet[]) => ruleWords(a, modules, courses);

/**
 * The badge and certificate types. A table from 768px, rows on phones. New
 * and Edit open the same form in a dialog; the course certificate's eligible
 * list opens in a dialog too, where drafts are made (issued from Issued).
 */
export function TypesAdmin({ types, courses, modules }: { types: AchievementRow[]; courses: Facet[]; modules: Facet[] }) {
  const router = useRouter();
  const [editing, setEditing] = React.useState<AchievementRow | "new" | null>(null);
  const [eligibleFor, setEligibleFor] = React.useState<AchievementRow | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);
  const [note, setNote] = React.useState<{ tone: "ok" | "alert"; text: string } | null>(null);

  const mine = types.filter((t) => !MADE_FOR_YOU.test(t.slug));
  const auto = types.filter((t) => MADE_FOR_YOU.test(t.slug));
  const badges = mine.filter((t) => t.type === "badge");
  const certs = mine.filter((t) => t.type === "certificate");

  async function toggle(a: AchievementRow) {
    setBusy(a.id);
    const r = await setAchievementEnabled(a.id, !a.enabled).catch(() => ({ error: "Couldn't reach the server." }));
    setBusy(null);
    setNote(r.error ? { tone: "alert", text: r.error } : { tone: "ok", text: `${a.title} is ${a.enabled ? "off" : "on"}.` });
    router.refresh();
  }

  const list = (rows: AchievementRow[], name: string) =>
    rows.length ? (
      <>
        <table className={cn(table.root, "hidden md:table")}>
          <thead>
            <tr>
              <th scope="col" className={cn(table.th, "w-[34%]")}>Name</th>
              <th scope="col" className={table.th}>Rule</th>
              <th scope="col" className={cn(table.th, "text-right")}>Given</th>
              <th scope="col" className={table.th}>Rule is</th>
              <th scope="col" className={table.th}><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className={table.tr}>
                <td className={table.td}>
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-md bg-[var(--ds-tint)]">{a.icon || "★"}</span>
                    <span className="min-w-0 font-semibold [overflow-wrap:anywhere]">{a.title}</span>
                  </span>
                </td>
                <td className={cn(table.td, "text-muted-foreground")}>{ruleText(a, modules, courses)}</td>
                <td className={cn(table.td, table.num)}>{a.issued_count}</td>
                <td className={cn(table.td, "whitespace-nowrap")}>
                  <Status tone={a.enabled ? "ok" : "quiet"}>{a.enabled ? "On" : "Off"}</Status>
                </td>
                <td className={cn(table.td, "w-px")}>
                  <Actions a={a} busy={busy === a.id} onEdit={() => setEditing(a)} onToggle={() => void toggle(a)} onEligible={() => setEligibleFor(a)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Rows className="md:hidden" label={name}>
          {rows.map((a) => (
            <RowItem key={a.id}>
              <div className="flex min-w-0 items-start gap-3">
                <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-md bg-[var(--ds-tint)]">{a.icon || "★"}</span>
                <span className="min-w-0 flex-1">
                  <span className="block type-body font-semibold [overflow-wrap:anywhere]">{a.title}</span>
                  <span className="block type-small text-muted-foreground [overflow-wrap:anywhere]">
                    {ruleText(a, modules, courses)} · {a.issued_count} given · {a.enabled ? "on" : "off"}
                  </span>
                </span>
              </div>
              <Actions a={a} busy={busy === a.id} onEdit={() => setEditing(a)} onToggle={() => void toggle(a)} onEligible={() => setEligibleFor(a)} />
            </RowItem>
          ))}
        </Rows>
      </>
    ) : (
      <Empty>None yet.</Empty>
    );

  return (
    <div className="flex min-w-0 flex-col gap-[var(--ds-7)]">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <button type="button" className={btn.primary} onClick={() => setEditing("new")}>
          <Plus aria-hidden /> New type
        </button>
        {note ? (
          <span role="status" className={cn("type-small", note.tone === "alert" ? "font-semibold text-status-alert-fg" : "text-muted-foreground")}>
            {note.text}
          </span>
        ) : null}
      </div>

      <Block title="Certificate types" count={certs.length}>{list(certs, "Certificate types")}</Block>
      <Block title="Badges" count={badges.length} action={<Link href="/admin/credentials/studio?what=badge">Give a badge</Link>}>
        {list(badges, "Badges")}
      </Block>
      {auto.length ? (
        <More summary={`Made by the studio and the monthly merit (${auto.length})`}>
          <Rows label="Made by the studio">
            {auto.map((a) => (
              <RowItem key={a.id} className="gap-0.5 py-2.5">
                <span className="type-small font-semibold [overflow-wrap:anywhere]">{a.title}</span>
                <span className="type-caption text-muted-foreground">{a.issued_count} given</span>
              </RowItem>
            ))}
          </Rows>
        </More>
      ) : null}

      <TypeForm
        key={editing === "new" ? "new" : editing?.id ?? "none"}
        open={editing !== null}
        editing={editing === "new" ? null : editing}
        courses={courses}
        modules={modules}
        onClose={() => setEditing(null)}
        onSaved={(t) => {
          setEditing(null);
          setNote({ tone: "ok", text: t });
          router.refresh();
        }}
      />
      {eligibleFor ? <Eligible key={eligibleFor.id} a={eligibleFor} onClose={() => setEligibleFor(null)} /> : null}
    </div>
  );
}

function Actions({ a, busy, onEdit, onToggle, onEligible }: { a: AchievementRow; busy: boolean; onEdit: () => void; onToggle: () => void; onEligible: () => void }) {
  return (
    <span className="flex min-w-0 flex-wrap items-center justify-end gap-1 md:flex-nowrap">
      {a.type === "certificate" && editable(a) ? (
        <button type="button" className={btn.ghost} onClick={onEligible}>Who is eligible</button>
      ) : null}
      {a.type === "badge" ? (
        <Link href={`/admin/credentials/studio?what=badge&badge=${a.id}`} className={btn.ghost}>Give</Link>
      ) : null}
      {editable(a) ? (
        <button type="button" className={btn.ghost} onClick={onEdit}>Edit</button>
      ) : null}
      <button type="button" className={btn.quiet} disabled={busy} onClick={onToggle} aria-label={`${a.enabled ? "Turn off" : "Turn on"} ${a.title}`}>
        {busy ? <Loader2 className="animate-spin" aria-hidden /> : null}
        {a.enabled ? "Turn off" : "Turn on"}
      </button>
    </span>
  );
}

function TypeForm({ open, editing, courses, modules, onClose, onSaved }: { open: boolean; editing: AchievementRow | null; courses: Facet[]; modules: Facet[]; onClose: () => void; onSaved: (note: string) => void }) {
  const r = (editing?.requirements ?? {}) as Partial<AchievementRequirement> & { module?: string; course_id?: string; count?: number; min?: number };
  const [type, setType] = React.useState<"badge" | "certificate">(editing?.type ?? "badge");
  const [title, setTitle] = React.useState(editing?.title ?? "");
  const [description, setDescription] = React.useState(editing?.description ?? "");
  const [icon, setIcon] = React.useState(editing?.icon ?? "");
  const [tone, setTone] = React.useState(editing?.tone ?? "lime");
  const [kind, setKind] = React.useState<Kind>((r.kind as Kind) ?? "module_complete");
  const [module, setModule] = React.useState(r.module ?? "");
  const [course, setCourse] = React.useState(r.course_id ?? "");
  const [count, setCount] = React.useState(r.count ?? 1);
  const [minXp, setMinXp] = React.useState(r.kind === "xp" ? (r.min ?? 100) : 100);
  const [minMin, setMinMin] = React.useState(r.kind === "watch_seconds" ? Math.round((r.min ?? 3600) / 60) : 60);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const req = (): AchievementRequirement => {
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
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await saveAchievement({ id: editing?.id, type, title, description, module_id: module || null, course_id: course || null, icon: icon || null, tone, requirements: req() }).catch(() => ({ error: "Couldn't reach the server." }));
    setBusy(false);
    if (res.error) return setError(res.error);
    onSaved(editing ? "Saved." : `${title} made.`);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !busy && onClose()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit ${editing.title}` : "New type"}</DialogTitle>
          <DialogDescription>What it is called and what earns it.</DialogDescription>
        </DialogHeader>
        <form onSubmit={save} className="grid min-w-0 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="ty-type" className={label}>Kind</label>
            <select id="ty-type" className={field} value={type} onChange={(e) => setType(e.target.value as "badge" | "certificate")} disabled={Boolean(editing)}>
              <option value="badge">Badge</option>
              <option value="certificate">Certificate with a rule</option>
            </select>
          </div>
          <div>
            <label htmlFor="ty-title" className={label}>Name</label>
            <input id="ty-title" className={field} value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={120} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="ty-desc" className={label}>Description</label>
            <input id="ty-desc" className={field} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={300} />
          </div>
          <div>
            <label htmlFor="ty-icon" className={label}>Icon (an emoji)</label>
            <input id="ty-icon" className={field} value={icon} onChange={(e) => setIcon(e.target.value)} maxLength={8} />
          </div>
          <div>
            <label htmlFor="ty-tone" className={label}>Colour</label>
            <select id="ty-tone" className={field} value={tone} onChange={(e) => setTone(e.target.value)}>
              {TONES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="ty-rule" className={label}>Earned by</label>
            <select id="ty-rule" className={field} value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
              {REQUIREMENT_KINDS.map((k) => (
                <option key={k} value={k}>{RULE_LABEL[k]}</option>
              ))}
            </select>
          </div>
          {kind === "module_complete" || kind === "sections_read" ? (
            <div>
              <label htmlFor="ty-module" className={label}>Module</label>
              <select id="ty-module" className={field} value={module} onChange={(e) => setModule(e.target.value)}>
                <option value="">Choose a module</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>
          ) : null}
          {kind === "sections_read" ? (
            <div>
              <label htmlFor="ty-count" className={label}>Sections</label>
              <input id="ty-count" type="number" min={1} className={field} value={count} onChange={(e) => setCount(Number(e.target.value))} />
            </div>
          ) : null}
          {kind === "xp" ? (
            <div>
              <label htmlFor="ty-xp" className={label}>XP</label>
              <input id="ty-xp" type="number" min={1} className={field} value={minXp} onChange={(e) => setMinXp(Number(e.target.value))} />
            </div>
          ) : null}
          {kind === "watch_seconds" ? (
            <div>
              <label htmlFor="ty-min" className={label}>Minutes</label>
              <input id="ty-min" type="number" min={1} className={field} value={minMin} onChange={(e) => setMinMin(Number(e.target.value))} />
            </div>
          ) : null}
          {kind === "course_complete" ? (
            <div>
              <label htmlFor="ty-course" className={label}>Course</label>
              <select id="ty-course" className={field} value={course} onChange={(e) => setCourse(e.target.value)}>
                <option value="">Choose a course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          ) : null}
          {type === "certificate" && editing ? <SignatureUpload achievementId={editing.id} has={Boolean(editing.signature_asset_path)} /> : null}
          {error ? <Notice tone="alert" className="sm:col-span-2">{error}</Notice> : null}
          <DialogFooter className="sm:col-span-2">
            <button type="button" className={btn.quiet} disabled={busy} onClick={onClose}>Cancel</button>
            <button type="submit" className={btn.primary} disabled={busy || !title.trim()}>
              {busy ? <Loader2 className="animate-spin" aria-hidden /> : null} {editing ? "Save" : "Make it"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SignatureUpload({ achievementId, has }: { achievementId: string; has: boolean }) {
  const [msg, setMsg] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = async () => {
      setBusy(true);
      const res = await saveSignatureAsset(achievementId, String(reader.result), f.name.replace(/\.[^.]+$/, "")).catch(() => ({ error: "Couldn't reach the server." }));
      setBusy(false);
      setMsg(res.error ?? "Signature saved.");
    };
    reader.readAsDataURL(f);
  }
  return (
    <div className="sm:col-span-2">
      <p className={label}>Signature image {has ? <span className="font-normal text-muted-foreground">(one is saved)</span> : null}</p>
      <label className={cn(btn.quiet, "cursor-pointer")}>
        {busy ? <Loader2 className="animate-spin" aria-hidden /> : <Upload aria-hidden />} Upload a PNG or JPEG (2 MB at most)
        <input type="file" accept="image/png,image/jpeg" onChange={onFile} className="sr-only" />
      </label>
      {msg ? <span role="status" className="ml-2 type-small">{msg}</span> : null}
    </div>
  );
}

function Eligible({ a, onClose }: { a: AchievementRow; onClose: () => void }) {
  const [rows, setRows] = React.useState<Array<{ id: string; name: string; reason: string }> | null>(null);
  const [made, setMade] = React.useState<Record<string, string>>({});
  React.useEffect(() => {
    let live = true;
    listCertificateEligible(a.id).then(
      (r) => live && setRows(r ?? []),
      () => live && setRows([]),
    );
    return () => {
      live = false;
    };
  }, [a.id]);
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Who is eligible</DialogTitle>
          <DialogDescription>{a.title}. A draft waits in Issued until you issue it.</DialogDescription>
        </DialogHeader>
        {rows === null ? (
          <p className="type-small text-muted-foreground" role="status">Checking every student</p>
        ) : rows.length === 0 ? (
          <Empty>Nobody is eligible right now.</Empty>
        ) : (
          <Rows label="Eligible students">
            {rows.map((r) => (
              <RowItem key={r.id} className="flex-row items-center gap-3 py-2.5">
                <span className="min-w-0 flex-1">
                  <Link href={`/admin/students/${r.id}`} className={cn(nameLink, "type-small")}>{r.name}</Link>
                  <span className="block type-caption text-muted-foreground [overflow-wrap:anywhere]">{r.reason}</span>
                </span>
                {made[r.id] ? (
                  <span className="type-small text-muted-foreground" role="status">{made[r.id]}</span>
                ) : (
                  <button
                    type="button"
                    className={btn.quiet}
                    onClick={async () => {
                      const res = await createCertificateDraft(r.id, a.id).catch(() => ({ error: "Couldn't reach the server." }));
                      setMade((m) => ({ ...m, [r.id]: res.error ?? "Draft made" }));
                    }}
                  >
                    Make a draft
                  </button>
                )}
              </RowItem>
            ))}
          </Rows>
        )}
        <DialogFooter>
          <Link href="/admin/credentials/issued?status=draft" className={btn.quiet}>See drafts</Link>
          <button type="button" className={btn.quiet} onClick={onClose}>Close</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
