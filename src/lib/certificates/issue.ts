import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { putCredentialAsset } from "@/lib/achievements/storage";
import { newCertificateId } from "./id";
import { checkIssue, type CleanIssue, type StudioIssueInput } from "./issue-input";
import { expiryInstant, istDay } from "./kinds";
import { layoutCertificate } from "./layout";
import { renderCertificatePdf } from "./pdf";
import type { EmailTarget } from "./email-plan";
import {
  deliverEmails,
  loadCredential,
  notifyCertificate,
  recordKind,
  recordTitle,
  signatureBytes,
  STUDIO_DB_STEP,
  studioReady,
  verifyUrlFor,
  type DeliveryReport,
} from "./server";

/**
 * The certificate studio's writes: issue, revoke, reissue and resend. Every
 * function takes the admin (service role) client and the acting Super Admin,
 * so the permission check stays in the server action and this stays testable.
 * Certificates are never deleted or edited in place: a correction is a new
 * certificate that replaces the old one.
 */

export type Actor = { id: string; email: string | null };

export type IssuedOne = { credentialId: string; userId: string; name: string };

export type IssueReport = {
  error: string | null;
  issued: IssuedOne[];
  skipped: Array<{ name: string; reason: string }>;
  delivery: DeliveryReport | null;
  batchId: string | null;
  /** The certificate this one replaced (reissue). */
  replaced?: string | null;
};

const fail = (error: string): IssueReport => ({ error, issued: [], skipped: [], delivery: null, batchId: null });
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);

/** One certificate type per batch: holds the title, and the wording as a fallback copy. */
async function batchAchievement(admin: SupabaseClient, c: CleanIssue, batchId: string): Promise<{ id: string } | { error: string }> {
  const ins = await admin
    .from("achievements")
    .insert({
      slug: `studio-${batchId.slice(0, 8)}-${slug(c.title)}`,
      type: "certificate",
      title: c.title,
      description: c.citation || null,
      // Never matched by the badge rules (no top-level `kind`); kept off the automatic lists.
      requirements: { studio: { kind: c.kind, wording: { heading: c.heading, lead: c.lead, connector: c.connector }, signatories: c.signatories, course_label: c.courseLabel, module_label: c.moduleLabel } },
      enabled: false,
      tone: "blue",
    })
    .select("id")
    .single();
  if (ins.error || !ins.data) return { error: /relation|does not exist/i.test(ins.error?.message ?? "") ? "Certificates aren't set up in the database yet." : (ins.error?.message ?? "Couldn't save the certificate type.") };
  return { id: ins.data.id as string };
}

async function inChunks<T, R>(items: T[], size: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += size) out.push(...(await Promise.all(items.slice(i, i + size).map(fn))));
  return out;
}

/**
 * Issue certificates to one student, several, or a cohort. For each person:
 * a record with a unique ID, the PDF, an audit line with the admin's ID and a
 * bell notice linking to the certificate. Then the emails, within today's
 * limit; the rest wait in the queue.
 */
export async function issueCertificates(admin: SupabaseClient, actor: Actor, input: StudioIssueInput, opts: { replaces?: string | null } = {}): Promise<IssueReport> {
  const checked = checkIssue(input, istDay(new Date()));
  if ("error" in checked) return fail(checked.error);
  const c = checked.ok;
  const ready = await studioReady(admin);
  if (!ready && c.kind === "provisional") return fail(`Provisional certificates need the database step first. ${STUDIO_DB_STEP}`);
  if (!ready && c.expiresOn) return fail(`An expiry date needs the database step first. ${STUDIO_DB_STEP}`);

  let replacesRow: Awaited<ReturnType<typeof loadCredential>> = null;
  if (opts.replaces) {
    if (c.recipients.length !== 1) return fail("A correction replaces one certificate at a time.");
    replacesRow = await loadCredential(admin, opts.replaces);
    if (!replacesRow || replacesRow.type !== "certificate") return fail("The certificate to replace was not found.");
    if (replacesRow.status === "revoked" || replacesRow.revoked_at) return fail("That certificate is already revoked.");
    if (replacesRow.user_id !== c.recipients[0].userId) return fail("A correction must go to the same student.");
  }

  const { data: people, error: peopleErr } = await admin.from("profiles").select("id, email, name, status").in("id", c.recipients.map((r) => r.userId));
  if (peopleErr) return fail(peopleErr.message);
  const byId = new Map((people ?? []).map((p) => [p.id as string, p]));
  const skipped: IssueReport["skipped"] = [];
  const targets = c.recipients.filter((r) => {
    if (byId.has(r.userId)) return true;
    skipped.push({ name: r.name, reason: "No account found." });
    return false;
  });
  if (!targets.length) return { ...fail("None of these students were found."), skipped };

  const batchId = crypto.randomUUID();
  const ach = await batchAchievement(admin, c, batchId);
  if ("error" in ach) return fail(ach.error);
  const images = await signatureBytes(admin, c.signatories).catch(() => ({}));
  const now = new Date().toISOString();
  const issuedAt = new Date(`${c.issuedOn}T12:00:00+05:30`).toISOString();

  const done = await inChunks(targets, 6, async (r): Promise<IssuedOne | null> => {
    const person = byId.get(r.userId)!;
    const email = person.email ? String(person.email).trim().toLowerCase() : null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const credentialId = newCertificateId();
      const base = {
        credential_id: credentialId,
        user_id: r.userId,
        achievement_id: ach.id,
        type: "certificate",
        status: "issued",
        student_name: r.name,
        recipient_name: r.name,
        recipient_email: email,
        reason: c.citation || null,
        issued_at: issuedAt,
        approved_at: now,
        approved_by: actor.id,
        issued_by: actor.id,
      };
      const studio = ready
        ? {
            kind: c.kind,
            title: c.title,
            wording: { heading: c.heading, lead: c.lead, connector: c.connector },
            expires_at: c.expiresOn ? new Date(expiryInstant(c.expiresOn)).toISOString() : null,
            signatories: c.signatories,
            course_id: c.courseId ?? null,
            course_label: c.courseLabel || null,
            module_label: c.moduleLabel || null,
            cohort_id: c.cohortId ?? null,
            batch_id: batchId,
            replaces: opts.replaces ?? null,
            email_status: "none",
          }
        : {};
      const { error } = await admin.from("credentials").insert({ ...base, ...studio });
      if (error) {
        // A one-in-a-billion ID clash: draw a new ID and try again.
        if (/duplicate|unique/i.test(error.message) && attempt < 2) continue;
        skipped.push({ name: r.name, reason: error.message });
        return null;
      }
      // The PDF is a saved copy; the certificate is valid without it (it is redrawn from the record).
      try {
        const layout = layoutCertificate({
          kind: c.kind,
          heading: c.heading,
          lead: c.lead,
          connector: c.connector,
          recipientName: r.name,
          title: c.title,
          citation: c.citation,
          course: c.courseLabel,
          module: c.moduleLabel,
          issuedOn: c.issuedOn,
          expiresOn: c.expiresOn,
          signatories: c.signatories.map((s, i) => ({ name: s.name, role: s.role, signature: s.signatureFrom ? `sig${i}` : null })),
          credentialId,
          verifyUrl: verifyUrlFor(credentialId),
        });
        const pdf = await renderCertificatePdf(layout, images);
        const key = await putCredentialAsset(`certificates/${credentialId}.pdf`, pdf, "application/pdf");
        await admin.from("credentials").update({ pdf_storage_path: key }).eq("credential_id", credentialId);
      } catch (e) {
        console.warn("certificate PDF copy skipped:", e instanceof Error ? e.message : e);
      }
      return { credentialId, userId: r.userId, name: r.name };
    }
    return null;
  });
  const issued = done.filter((x): x is IssuedOne => Boolean(x));
  if (!issued.length) return { error: skipped[0]?.reason ?? "Nothing was issued.", issued, skipped, delivery: null, batchId };

  // Every issue is logged with the admin's ID.
  await admin.from("admin_audit_log").insert(
    issued.map((i) => ({
      actor_id: actor.id,
      actor_email: actor.email,
      action: opts.replaces ? "certificate.reissued" : "certificate.studio_issued",
      target_type: "credential",
      target_id: i.credentialId,
      details: { user_id: i.userId, kind: c.kind, title: c.title, batch_id: batchId, expires_on: c.expiresOn, cohort_id: c.cohortId ?? null, replaces: opts.replaces ?? null },
    })),
  );

  for (const i of issued) await notifyCertificate(admin, { userId: i.userId, credentialId: i.credentialId, title: c.title, kind: c.kind, sentBy: actor.id, batchId });

  let delivery: DeliveryReport | null = null;
  if (c.email) {
    const mail: EmailTarget[] = issued.map((i) => ({ credentialId: i.credentialId, userId: i.userId, name: i.name, email: byId.get(i.userId)?.email ? String(byId.get(i.userId)!.email) : null }));
    const info = new Map(issued.map((i) => [i.credentialId, { title: c.title, kind: c.kind, expiresOn: c.expiresOn }]));
    delivery = await deliverEmails(admin, mail, info, actor.id);
  }

  let replaced: string | null = null;
  if (opts.replaces && replacesRow) {
    const r = await revokeCertificate(admin, actor, opts.replaces, `Replaced by ${issued[0].credentialId}`, issued[0].credentialId);
    if (!r.error) replaced = opts.replaces;
  }
  return { error: null, issued, skipped, delivery, batchId, replaced };
}

/** Revoke (never delete). The reason is required and the admin's ID is logged. */
export async function revokeCertificate(admin: SupabaseClient, actor: Actor, credentialId: string, reason: string, replacedBy: string | null = null): Promise<{ error: string | null }> {
  const text = reason.trim().slice(0, 300);
  if (!text) return { error: "Give a reason." };
  const row = await loadCredential(admin, credentialId);
  if (!row) return { error: "Certificate not found." };
  if (row.status === "revoked" || row.revoked_at) return { error: "Already revoked." };
  const now = new Date().toISOString();
  const { error } = await admin.from("credentials").update({ status: "revoked", revoked_at: now, revoke_reason: text, revoked_by: actor.id, updated_at: now }).eq("credential_id", credentialId);
  if (error) return { error: error.message };
  // Columns from the database step: fine if they are not there yet.
  if (replacedBy) await admin.from("credentials").update({ replaced_by: replacedBy }).eq("credential_id", credentialId);
  await admin.from("certificate_email_queue").update({ status: "cancelled" }).eq("credential_id", credentialId).eq("status", "queued");
  await admin.from("admin_audit_log").insert({
    actor_id: actor.id,
    actor_email: actor.email,
    action: "credential.revoked",
    target_type: "credential",
    target_id: credentialId,
    details: { reason: text, replaced_by: replacedBy },
  });
  return { error: null };
}

/** Send the bell notice again, and the email again when asked (within the daily limit). */
export async function resendCertificate(admin: SupabaseClient, actor: Actor, credentialId: string, opts: { email: boolean }): Promise<{ error: string | null; notified: boolean; delivery: DeliveryReport | null }> {
  const row = await loadCredential(admin, credentialId);
  if (!row || row.type !== "certificate") return { error: "Certificate not found.", notified: false, delivery: null };
  if (row.status !== "issued" || row.revoked_at) return { error: "Only an issued certificate can be sent again.", notified: false, delivery: null };
  const kind = recordKind(row);
  const title = recordTitle(row);
  let notified = false;
  let email = row.recipient_email;
  if (row.user_id) {
    notified = await notifyCertificate(admin, { userId: row.user_id, credentialId, title, kind, sentBy: actor.id, again: true });
    const { data: p } = await admin.from("profiles").select("email").eq("id", row.user_id).maybeSingle();
    if (p?.email) email = String(p.email);
  }
  let delivery: DeliveryReport | null = null;
  if (opts.email) {
    delivery = await deliverEmails(
      admin,
      [{ credentialId, userId: row.user_id, name: row.student_name, email: email ?? null }],
      new Map([[credentialId, { title, kind, expiresOn: row.expires_at ? istDay(row.expires_at) : null }]]),
      actor.id,
    );
  }
  await admin.from("admin_audit_log").insert({
    actor_id: actor.id,
    actor_email: actor.email,
    action: "certificate.resent",
    target_type: "credential",
    target_id: credentialId,
    details: { notified, emailed: delivery?.emailed.length ?? 0, queued: delivery?.queued.length ?? 0 },
  });
  return { error: null, notified, delivery };
}
