# Module: Certificates
> Verified against `main` @ `b2a9698`. Flow: [CERTIFICATE_FLOW](../workflows/CERTIFICATE_FLOW.md).

- Issue: admin clicks on a student row → `issueCertificate` (`src/app/(dashboard)/admin/students/certificate-action.ts`, `requireAdmin`).
- PDF: `src/lib/certificate.ts` (`pdf-lib`, A4 landscape, QR via `qrcode` to `${NEXT_PUBLIC_SITE_URL|app-url}/verify/<id>`).
- Storage: `videos` bucket root (comment: "for now"), table `certificates` (`student_name, course_title, issued_at`, FK → profiles, courses).
- Public proof page: `/verify/[certificateId]` (no auth; `noindex`).
- **Known issues:** the printed name is `student.email` (profile name not used); documents live in the video bucket; no student-facing download/e-mail (comment: "future").
- Automatic completion-based issuing: **not implemented** (manual only) → class `G`.

## Custom certificates for anyone (2026-11)
- Admin → Credentials → **For anyone**: name, email, phone (private), title and a paragraph about what the person did. Signed "Kavya Bothra, COO". Certificate only, no account.
- Action: `issueCertificateToAnyone` (`src/app/(dashboard)/admin/credentials/actions.ts`). If the email matches a profile, `user_id` is set too; students also see certificates sent to their email (`src/lib/achievements/owned.ts`).
- Email: `emailCustomCertificate` (`src/lib/achievements/notify.ts`) attaches the PDF and adds a LinkedIn "Add to profile" link (`src/lib/achievements/linkedin.ts`); sends through `sendResendEmail` (preview gate applies).
- `/verify/<id>` shows the paragraph for certificates (never email or phone).
- Needs `supabase/migrations_pending/2026_11_custom_credentials.sql` (nullable `user_id`, `recipient_*` columns). Until applied, the page says the database needs an update.
