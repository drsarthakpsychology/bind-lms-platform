# Certificate studio: plan

Owner's ask (14 Nov 2026): "KEEP the certificate maker. I want an interface where I can manually generate certificates, temporary certificates, special recognition certificates, or any customised certificates and send them to students. Don't remove the existing code; build the interface around it."

This is a plan only. No app code, no migration file. Draft SQL is inline in section 4.

---

## 1. What exists today

### Two certificate systems, one of them dead

| | Old system | Current system |
|---|---|---|
| Table | `certificates` (`supabase/migrations_pending/certificates.sql`) | `credentials` + `achievements` (`2026_11_achievements.sql`, `2026_11_custom_credentials.sql`) |
| PDF maker | `src/lib/certificate.ts` (`generateCertificatePdf`) | `src/lib/achievements/pdf.ts` (`generateCredentialPdf`) |
| Issue action | `src/app/(dashboard)/admin/students/certificate-action.ts` | see below |
| Used by a screen | No. Nothing imports it. Prints the student's email as the name and stores in the `videos` bucket. | Yes |

The audit (`docs/AUDIT_2026_11.md` lines 40, 80, 113, admin-redesign branch) says "the PDF maker and an issue certificate action exist, but no screen calls the action". That is true of the **old** system only. The current system already has working screens. Both stay (owner: don't remove code). The studio builds on the current system.

### Current system, piece by piece

**Tables (live database, checked read-only today)**
- `achievements`: certificate "types" and badges. 0 certificate types, 0 saved signature images.
- `credentials`: every badge and certificate. 124 badges, **0 certificates ever issued**. Columns: `credential_id` (public id, 64 hex chars), `user_id` (nullable), `type` badge/certificate, `status` draft/approved/issued/revoked, `student_name`, `issued_at`, `issued_by`, `revoked_at`, `revoke_reason`, `revoked_by`, `reason` (the paragraph), `recipient_name`, `recipient_email`, `recipient_phone`, `pdf_storage_path`, `signature_asset_path`, `is_public`.
- `notifications`: type check allows `certificate`; has `credential_id`, `href`, `sent_by`, `batch_id`.
- `email_sends`: log of every email.
- `admin_audit_log`: actor id + email, action, target, details.
- `cohorts` (2) and `cohort_members` (largest cohort 82). 126 students.
- Risk found: `credentials.user_id` is `on delete cascade`. Deleting a student account deletes their certificates.

**Server actions**
- `src/app/(dashboard)/admin/credentials/actions.ts`
  - `issueCustomCertificate` (line 65): one student, custom title/heading/lead/description/date, optional saved signature, PDF to R2, notice + optional email. Super Admin only, audited.
  - `previewCustomCertificate` (129): renders the real PDF and returns it as a data URL.
  - `issueCertificateToAnyone` (185) and `previewCertificateToAnyone` (264): for people without an account (volunteers, speakers), PDF attached to the email.
- `src/app/(dashboard)/admin/achievements/actions.ts`
  - `createCertificateDraft` (206) and `issueCertificate` (236): rule-based course certificate, needs a saved signature image, re-checks eligibility (80 percent on every module test, `src/lib/achievements/certificate.ts`).
  - `revokeCredential` (313): Super Admin, reason required, audited, verify page then says Revoked.
  - `getCredentialDownload` (354): signed R2 link, any admin.
  - `saveSignatureAsset` (333).

**PDF maker**: `src/lib/achievements/pdf.ts`. pdf-lib with Helvetica only, centred text, a grey border, QR to `/verify/<id>`, one signatory (`CUSTOM_SIGNATORY` = Kavya Bothra, COO, in `src/lib/achievements/linkedin.ts`). A4 landscape. Plain; not the premium look the owner wants.

**Storage**: `src/lib/achievements/storage.ts` (R2, `certificates/<id>.pdf`, signed download links, `newCredentialId`).

**Notifications and email**
- `src/lib/achievements/notify.ts`: `notifyCredential` (bell row with href `/achievements`, plus email) and `emailCustomCertificate` (PDF attached). Neither respects a daily limit.
- `src/lib/notify/send.ts`: admin notifications; stops emailing when the provider says the quota is used up.
- `src/lib/auth/roster.ts` `sendResendEmail` (line 492): the only Resend sender, paced to 4 a second, preview sites only email `ALLOWED_TEST_RECIPIENT`.
- Daily limit: `RESEND_DAILY_LIMIT` (default 100) is only enforced in `admin/emails/actions.ts` line 109 (refuses a batch over the limit). `src/lib/email/pace.ts` recognises quota errors. **No queue exists anywhere.** Emails in the last 24 hours: 1.

**Admin screens**
- Menu: Teach group, **Credentials** (`src/components/navigation/nav-config.ts` line 181) with tabs "Find & issue" (`/admin/credentials`) and "Badges & certificate types" (`/admin/achievements`).
- `/admin/credentials`: search one student, list their credentials, PDF + revoke, design a certificate for that one student (form + PDF preview in an iframe), and a "For anyone" tab. View-only admins see lists, not the form.
- Student profile (`admin/students/[id]/page.tsx` lines 95, 122, 409) links to it.

**Student side**
- `/achievements` (`src/app/(dashboard)/achievements/*`): badges, certificates (Issued/Revoked/Pending, PDF button, LinkedIn share, copy post, verify link). Opening the page marks badge/certificate notices read.
- `/passport`: Skills Passport (competency evidence + its own PDF, `src/lib/passport-pdf.ts`). Behind the `skills_passport` flag, which is **off** in the live database. Not a certificate list.
- `/notifications`: lists certificate notices.

**Public /verify**: `src/app/verify/[certificateId]/page.tsx`. Reads by `credential_id`, shows Verified / Revoked / Not issued, name, title, paragraph, issue date, id. No email or phone. No expiry concept.

**Monthly cron**: `src/app/api/cron/monthly/route.ts` (1st of month) runs `runMonthlyJob` (`src/lib/leagues/jobs.ts`) which issues monthly merit certificates through `src/lib/achievements/merit.ts` (same `credentials` table, same PDF maker, `notifyCredential`). Must keep working.

### What is missing for the owner's ask
1. Kinds: no provisional (no expiry anywhere), no "special recognition" label, custom is one form.
2. Recipients: one student at a time; no several, no whole cohort.
3. Several signatories; course/module line.
4. A live preview that works on phones (a PDF in an iframe does not render on iPhone or Android Chrome).
5. Daily email limit and a queue.
6. A list of all issued certificates with filters by type, cohort and status; reissue (correct a name) and resend.
7. Student page per certificate (the bell link goes to the general page); /verify states for provisional and expired.
8. A protection against deleting certificates.
9. The premium certificate design.

---

## 2. The certificate design (and how preview = PDF)

**Problem**: pdf-lib can only use the 14 built-in fonts unless `@pdf-lib/fontkit` is added (not installed; adding a package changes the shared `node_modules`). Helvetica/Times do not carry the VIBHA brand.

**Solution (prototyped and working, see below)**: one layout engine.
- A script turns the brand fonts into vector outlines once: Archivo (heavy wide for the VIBHA wordmark, regular and bold), Silkscreen (pixel labels), and Source Serif 4 (OFL, the site's serif) for the name and the paragraph. Output: one generated data file (~470 KB, ~160 KB gzipped).
- `layoutCertificate(data)` turns a certificate into a list of drawing steps on an A4 landscape page (842 x 595 pt).
- The same list is drawn two ways: as SVG on screen (admin live preview, student page, /verify) and as a PDF with pdf-lib. Identical shapes, identical line breaks.
- Invisible text sits over the name, title, dates and id so the PDF can still be searched and copied.
- The preview loads the font data only on the studio page (lazy), so student pages pay nothing (they render the SVG on the server).

**Look**: a full height VIBHA blue spine on the left (white VIBHA wordmark, lime "SCHOOL OF PSYCHOLOGY" in the pixel face, a quiet large VIBHA mark, the kind, and at the bottom the QR code on a white tile, "vibhapsychology.com/verify" and the id). The white side carries one focal point: the recipient's name in Source Serif italic, closed by the brand rule (ink line ending in a lime square). Above it a small pixel heading ("CERTIFICATE OF COMPLETION"); below it the connector line, the title in Archivo bold, the course/module line, the citation paragraph (steps down in size so it always fits), then up to three signature lines with name and role, and the dates right aligned. Provisional certificates carry a lime "PROVISIONAL · VALID UNTIL 31 DECEMBER 2026" stamp at top right and "Provisional until" in the dates.

**Short verifiable id**: new studio ids look like `VIBHA-7K3M-9Q2P-XW4T` (60 random bits, letters that can't be misread), so the printed address is short enough to type. Old 64-character ids keep working.

Prototype renders (not in the repo):
- `/tmp/claude-0/-home-claude/1ec55112-adfe-5420-9ed7-32620d412cb4/scratchpad/certs-shots/completion-1.png` and `completion.pdf`
- `/tmp/claude-0/-home-claude/1ec55112-adfe-5420-9ed7-32620d412cb4/scratchpad/certs-shots/provisional-1.png` and `provisional.pdf` (long name shrinks to fit, three signatories)
- Prototype source kept at `/tmp/claude-0/-home-claude/1ec55112-adfe-5420-9ed7-32620d412cb4/scratchpad/certs-prototype/` (layout engine, SVG and PDF drawers, id, status rule, email plan, glyph script, draft SQL). It can be dropped in when building starts.

---

## 3. Screens to build

### Admin menu
Credentials section, tabs become:
1. **Certificate studio** `/admin/credentials/studio` (new, first tab)
2. **Issued certificates** `/admin/credentials/issued` (new)
3. Find & issue `/admin/credentials` (kept as is: per-student view and "For anyone")
4. Badges & certificate types `/admin/achievements` (kept)

Super Admin: everything. View-only admin: can open both new pages, sees the preview and the list, no Issue/Revoke/Reissue/Resend buttons (and the server actions refuse them). Students: no access (admin layout already blocks).

### A. Certificate studio (issue + preview + send)
Split screen on desktop: the form on the left (about 420 px), the live certificate on the right, sticky, at true A4 proportions. On phones the preview sits on top at full width with a zoom button that opens it full screen with pinch zoom; the form follows.

Form, in this order, without boxes around every group (headings and spacing do the grouping):
1. **Type**: four options in one row (Completion, Provisional, Special recognition, Custom). Choosing one fills the default wording; Custom opens the heading, lead line and connector line for editing.
2. **Recipients**: a search field (name, email, roll number) that adds students as chips, and a "Whole cohort" picker that adds everyone in it (shows the count once added). Each recipient has the printed name prefilled from the profile and editable in place. The preview shows the selected person (arrows to step through recipients).
3. **Wording**: title, description/citation (with a soft length guide), optional course (picked from courses) and module line.
4. **Dates**: issue date (today by default), expiry date (required and shown for Provisional, optional for the rest).
5. **Signatories**: 1 to 3 rows of name + role, each optionally using a saved signature image. Prefilled with Kavya Bothra, COO.
6. **Send**: in-app notice always (stated, not a choice); "Also email" switch, on by default, with today's remaining email count beside it ("62 emails left today"); if the batch is bigger, it says how many will wait in the queue.
7. One primary button: "Issue 24 certificates". A confirm step shows the count, the type, and the queue split.

After issuing: a result panel (not a toast) listing issued, emailed, queued (with names), failed, and no email on file; links to each certificate.

Server action `issueStudioCertificates`: Super Admin check, validate (title, names, dates, provisional needs a future expiry on or after the issue date, 1 to 3 signatories, at most 300 recipients), then per recipient: new id, credential row (`type` certificate, `status` issued, `kind`, wording, signatories, expiry, cohort, batch id, recipient email + name snapshot), PDF rendered and saved to R2 (if R2 fails the certificate is still valid; the download renders it on demand), audit row `certificate.studio_issued` with the admin's id, bell notice linking to `/achievements/<id>`. Then emails as below.

### B. Issued certificates (manage)
A table, not cards: name, title, type, status (Valid / Provisional until 31 Dec / Expired / Revoked), issued date, email status (sent / queued / failed / none), actions. Filters across the top: type, cohort, status, search. Phones: rows become two-line list items with an actions menu.

Row actions (Super Admin):
- **Download PDF** (any admin): `/api/certificates/<id>/pdf`, rendered from the record.
- **Revoke**: dialog with a required reason. Sets revoked, keeps the row. Audited.
- **Reissue / correct name**: opens the studio prefilled; issuing creates a new certificate (new id) and revokes the old one with reason "Replaced by VIBHA-...". Old /verify page says it was replaced and links to the new one. Records are never edited in place.
- **Resend**: bell notice again and email again (counts against the limit, queues if needed).
- Above the table, when emails are waiting: "14 emails waiting. Send now" (sends up to today's limit, oldest first). The daily cron (below) also sends them.

### C. Student side
- **New page `/achievements/<id>`**: the certificate itself (the SVG, server rendered), status line, Download PDF, Share on LinkedIn (existing add-to-profile link), copy link, open verify page. The bell notice links here; visiting it marks that notice read. Revoked: shows "Revoked" and no download. Expired provisional: shows "Expired on ..." and keeps download (the PDF is marked provisional).
- **My Achievements list**: each certificate links to its page and shows the live status (Provisional until, Expired, Revoked).
- **Passport**: the flag is off, and the passport is a competency record, not a certificate wall. Proposal: add a small "Certificates" list at the top of `/passport` linking to the same pages, shown only when the flag is on. Owner to confirm.

### D. /verify states
Same page, new states, all from one status rule:
- **Valid**: "Verified" + issue date.
- **Provisional**: "Provisional, valid until 31 December 2026" in a distinct style.
- **Expired**: after the end of the expiry date (23:59:59 India time) automatically shows "Expired on ..." (no job needed: computed when the page loads).
- **Revoked**: "Revoked on ..." (reason stays private), and "Replaced by VIBHA-..." with a link when it was reissued.
- **Not found**: as today.
- Typed ids are tidied (lower case, O for 0, spaces) so a hand-typed id still works. Shows the certificate image on wide screens.

### E. Background
- Monthly cron: unchanged. Merit certificates keep using `src/lib/achievements/pdf.ts`; later they can switch to the new design (one line change), owner's call.
- New daily cron `/api/cron/certificate-emails` (vercel.json, e.g. 04:00 UTC) sends queued emails up to the limit. Alternative if the owner prefers no new cron: only the "Send now" button.

---

## 4. Data changes (draft SQL)

All additive and idempotent. To paste once approved, as `supabase/migrations_pending/2026_11_14_certificate_studio.sql`.

```sql
-- New columns on credentials (the studio builds on the existing table)
alter table public.credentials add column if not exists kind text;            -- completion | provisional | recognition | custom
alter table public.credentials add column if not exists title text;           -- snapshot, so correcting one cert never changes others
alter table public.credentials add column if not exists wording jsonb not null default '{}'::jsonb;  -- heading, lead, connector
alter table public.credentials add column if not exists expires_at timestamptz;
alter table public.credentials add column if not exists signatories jsonb not null default '[]'::jsonb;
alter table public.credentials add column if not exists course_id uuid;
alter table public.credentials add column if not exists course_label text;
alter table public.credentials add column if not exists module_label text;
alter table public.credentials add column if not exists cohort_id uuid;
alter table public.credentials add column if not exists batch_id uuid;
alter table public.credentials add column if not exists replaces text;
alter table public.credentials add column if not exists replaced_by text;
alter table public.credentials add column if not exists email_status text;    -- sent | queued | failed | none

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'credentials_kind_check') then
    alter table public.credentials add constraint credentials_kind_check
      check (kind is null or kind in ('completion','provisional','recognition','custom'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'credentials_provisional_expires') then
    alter table public.credentials add constraint credentials_provisional_expires
      check (kind is distinct from 'provisional' or expires_at is not null);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'credentials_email_status_check') then
    alter table public.credentials add constraint credentials_email_status_check
      check (email_status is null or email_status in ('sent','queued','failed','none'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'credentials_course_id_fkey') then
    alter table public.credentials add constraint credentials_course_id_fkey
      foreign key (course_id) references public.courses (id) on delete set null;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'credentials_cohort_id_fkey') then
    alter table public.credentials add constraint credentials_cohort_id_fkey
      foreign key (cohort_id) references public.cohorts (id) on delete set null;
  end if;
end $$;

create index if not exists credentials_kind_idx on public.credentials (kind) where kind is not null;
create index if not exists credentials_cohort_idx on public.credentials (cohort_id) where cohort_id is not null;
create index if not exists credentials_created_idx on public.credentials (created_at desc);

-- Certificates are never deleted. Snapshot the owner on every certificate...
update public.credentials c set recipient_email = lower(p.email)
  from public.profiles p
 where c.type = 'certificate' and c.user_id = p.id and c.recipient_email is null and p.email is not null;
update public.credentials set recipient_name = student_name
 where type = 'certificate' and recipient_name is null;

-- ...detach (not delete) certificates when a student account is deleted...
create or replace function public.keep_certificates_on_profile_delete()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.credentials
     set recipient_email = coalesce(recipient_email, lower(old.email), 'deleted-account@invalid'),
         recipient_name  = coalesce(recipient_name, student_name),
         user_id = null
   where user_id = old.id and type = 'certificate';
  return old;
end $$;
drop trigger if exists keep_certificates_on_profile_delete on public.profiles;
create trigger keep_certificates_on_profile_delete before delete on public.profiles
  for each row execute function public.keep_certificates_on_profile_delete();

-- ...and refuse a direct delete.
create or replace function public.block_certificate_delete()
returns trigger language plpgsql as $$
begin
  if old.type = 'certificate' then raise exception 'Certificates are never deleted. Revoke it instead.'; end if;
  return old;
end $$;
drop trigger if exists block_certificate_delete on public.credentials;
create trigger block_certificate_delete before delete on public.credentials
  for each row execute function public.block_certificate_delete();

-- Emails over the daily limit wait here
create table if not exists public.certificate_email_queue (
  id uuid primary key default gen_random_uuid(),
  credential_id text not null references public.credentials (credential_id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  recipient text not null,
  name text,
  status text not null default 'queued' check (status in ('queued','sent','failed','cancelled')),
  attempts int not null default 0,
  last_error text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);
create index if not exists certificate_email_queue_status_idx on public.certificate_email_queue (status, created_at);
create unique index if not exists certificate_email_queue_one_open on public.certificate_email_queue (credential_id) where status = 'queued';
alter table public.certificate_email_queue enable row level security;
drop policy if exists "cert_email_queue_select_admin" on public.certificate_email_queue;
create policy "cert_email_queue_select_admin" on public.certificate_email_queue
  for select to authenticated using (public.is_admin());
drop policy if exists "cert_email_queue_write_super" on public.certificate_email_queue;
create policy "cert_email_queue_write_super" on public.certificate_email_queue
  for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

-- RLS on credentials stays as it is today (students read their own by account
-- or email, admins read all, Super Admin writes). Restated for clarity:
alter table public.credentials enable row level security;
drop policy if exists "credentials_select_own_or_admin" on public.credentials;
create policy "credentials_select_own_or_admin" on public.credentials for select to authenticated using (
  auth.uid() = user_id or public.is_admin()
  or (recipient_email is not null and lower(recipient_email) = lower(coalesce(auth.jwt() ->> 'email', '')))
);
drop policy if exists "credentials_write_super" on public.credentials;
create policy "credentials_write_super" on public.credentials for all to authenticated
  using (public.is_super_admin()) with check (public.is_super_admin());
```

No changes to `notifications` (type `certificate` is already allowed), `admin_audit_log` or `email_sends`.

**Before the SQL is pasted** the studio still opens: Completion, Recognition and Custom issue using the existing columns (title kept on the certificate type, default wording on re-render), Provisional is disabled with a one-line note, the list hides the cohort filter, and queued emails are reported by name so the admin can press Resend later.

---

## 5. Permissions

| Action | Super Admin | View-only admin | Student |
|---|---|---|---|
| Open studio, see preview | yes | yes | no |
| Issue, revoke, reissue, resend, send queue | yes | no (buttons hidden, server refuses) | no |
| Issued list, filters, download any PDF | yes | yes | no |
| Own certificate page, own PDF | n/a | n/a | yes (by account or email) |
| /verify | public | public | public |

Every server action checks with `requireSuperAdmin()` / `requireAdmin()` (`src/lib/auth/guards.ts`), never trusts the page. Every issue, revoke, reissue and resend writes `admin_audit_log` with the admin's id and email. The PDF route checks owner or admin, and refuses students for revoked certificates.

---

## 6. Tests (vitest)

Pure units:
- Status rule: valid; provisional before expiry; expired one second after 23:59:59 IST on the expiry date; revoked beats everything; draft is not issued.
- Input check: missing title, missing names, provisional without expiry, expiry before issue date, expiry already past, more than 3 signatories, more than 300 recipients, duplicate recipients collapse.
- Email plan: under the limit all send; over the limit the rest queue; limit already used means all queue; email off means in-app only; people without an email.
- Id: format, no ambiguous letters, typed id tidy-up, old ids untouched.
- Layout: long names shrink and stay on one line inside the page; long citations never cross the signature line; provisional stamp present only for provisional; QR present; nothing outside 842 x 595.

Server actions (Supabase client mocked, as existing tests do):
- Issue to 3 students creates 3 rows, 3 notifications linking to `/achievements/<id>`, 3 audit rows with the admin id.
- Student caller and view-only admin caller are refused; nothing written.
- Revoke sets status, reason, revoked_by; never deletes.
- Reissue creates a new id and revokes the old with "Replaced by".
- Emails over the limit go to the queue; a provider quota error mid-batch moves the rest to the queue.

Page tests: /verify renders each of the 5 states; student certificate page hides download when revoked.

Visual checks (Playwright against `next dev --webpack` with fixtures): studio at 390 and 1440, light and dark; sample PDF rendered to PNG; automatic overflow check.

---

## 7. Risks

1. **Email limit is shared** with every other email (setup links, campaigns). A cohort of 82 can use most of a 100-a-day plan. The queue and the "left today" count handle it; owner may want a paid Resend plan before issuing to a full cohort.
2. **Font data size** (~160 KB gzipped) on the studio page only; lazy-loaded. Student and /verify pages render on the server.
3. **Non-Latin names** (Devanagari, Gujarati) cannot be printed by the current fonts (same limit as today's PDF maker). Accented Latin letters work. A Devanagari font can be added later the same way.
4. **R2 not configured** on a preview site: PDFs then render on demand from the record, so nothing breaks.
5. **Deleting students**: today it deletes their certificates (cascade). The SQL above fixes this; until pasted, avoid deleting students who hold certificates.
6. **Preview sites** only email the test address (existing gate). Real sends only from the live site.
7. **Two designs side by side** until merit certificates and the old forms switch to the new renderer. Recommend switching them in a second small step.
8. **Server time**: issuing to 80 students (80 PDFs + R2 uploads + emails paced at 4 a second) takes about 30 to 60 seconds. Set the page's `maxDuration` to 300.

---

## 8. Effort

| Piece | Estimate |
|---|---|
| Layout engine, glyph data, SVG + PDF drawers (prototype exists) | 0.5 day |
| Studio page: form, recipients (search + cohort), live preview with phone zoom | 1.5 days |
| Issue action, notices, email plan + queue, PDF route | 1 day |
| Issued list: filters, revoke, reissue, resend, send queue, daily cron | 1 day |
| Student certificate page, achievements list status, passport link | 0.5 day |
| /verify states | 0.5 day |
| Migration + graceful fallback | 0.5 day |
| Tests, tsc, lint, screenshots at 390 / 1440, fixes | 1 day |
| **Total** | **about 6.5 working days** for one agent |

---

## 9. Decisions for the owner

1. Approve the design direction (blue spine, serif name, pixel labels): see the two prototype PNGs above.
2. Default signatories: Kavya Bothra, COO only, or also Dr Sarthak Dave with his role?
3. Email: link only (proposed) or also attach the PDF (as "For anyone" does today)?
4. New daily cron for queued emails, or only the "Send now" button?
5. Show certificates on `/passport` (flag currently off) or only on My Achievements?
6. Later: move monthly merit certificates and the existing "Find & issue" forms onto the new design?
