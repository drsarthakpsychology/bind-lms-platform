---
paths:
  - "supabase/**/*"
---

# Database

- Never write to the live database and never run `supabase db push` or `psql`
  against it.
- New or changed SQL goes in `supabase/migrations_pending/<YYYY_MM_DD>_<name>.sql`
  with a one-line plain-English header saying what it does. The owner pastes it.
- Make migrations safe to run twice (`if not exists`, `create or replace`).
