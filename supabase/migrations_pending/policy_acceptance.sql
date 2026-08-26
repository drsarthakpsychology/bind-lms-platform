-- =============================================================================
-- Policy acceptance — the audit trail for the no-refund term.
-- =============================================================================
-- Where a learner (or waitlisted lead) accepted the Terms / Refund / Privacy
-- policies, and which policy version governed at that moment. This is what
-- makes the non-refundable-fees clause defensible if it is ever challenged:
-- the timestamp + version are recorded with the record itself.
--
--   * `enquiries`          — the public waitlist form (server action insert).
--   * `course_enrollments` — the actual enrolment record (admin-managed).
--
-- Additive + idempotent (safe to re-run via `npm run apply-migrations`).
-- =============================================================================

alter table public.enquiries
  add column if not exists policy_acceptance_at timestamptz,
  add column if not exists policy_version text;

alter table public.course_enrollments
  add column if not exists policy_acceptance_at timestamptz,
  add column if not exists policy_version text;
