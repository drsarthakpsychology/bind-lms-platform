# Module: Certificates
> Verified against `main` @ `b2a9698`. Flow: [CERTIFICATE_FLOW](../workflows/CERTIFICATE_FLOW.md).

- Issue: admin clicks on a student row → `issueCertificate` (`src/app/(dashboard)/admin/students/certificate-action.ts`, `requireAdmin`).
- PDF: `src/lib/certificate.ts` (`pdf-lib`, A4 landscape, QR via `qrcode` to `${NEXT_PUBLIC_SITE_URL|app-url}/verify/<id>`).
- Storage: `videos` bucket root (comment: "for now"), table `certificates` (`student_name, course_title, issued_at`, FK → profiles, courses).
- Public proof page: `/verify/[certificateId]` (no auth; `noindex`).
- **Known issues:** the printed name is `student.email` (profile name not used); documents live in the video bucket; no student-facing download/e-mail (comment: "future").
- Automatic completion-based issuing: **not implemented** (manual only) → class `G`.
