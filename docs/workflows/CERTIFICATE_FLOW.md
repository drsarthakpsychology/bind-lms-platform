# Workflow: Certificate issuing & verification
> Verified against `main` @ `b2a9698`.
```mermaid
sequenceDiagram
  participant Ad as Admin (/admin/students)
  participant A as issueCertificate (server action)
  participant G as generateCertificatePdf
  participant S as Supabase (storage + certificates)
  participant V as Public /verify/[id]
  Ad->>A: userId + courseId
  A->>A: requireAdmin, load student email + course title
  A->>G: PDF with QR -> /verify/<uuid>
  A->>S: store PDF (videos bucket), insert certificates row
  V->>S: select id, student_name, course_title, issued_at
  V-->>V: show proof (noindex, no auth)
```
Manual trigger only; no auto-issue on completion; no email to the student; printed name = email (see [CERTIFICATES](../modules/CERTIFICATES.md)). Details of the insert/upload error handling are in the action file (`UNVERIFIED` beyond line 45).
