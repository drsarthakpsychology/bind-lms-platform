-- Attendance: the two step IN / OUT screens (21 Nov 2026).
-- Safe to run more than once. Adds only; changes no existing row.
-- The app and the website work before and after this runs. After it, a
-- retry of the same Confirm press is recognised exactly (it gets the same
-- "Marked IN" answer instead of "Already marked IN").

-- 1. Which Confirm press made each mark (a random id from the phone or browser).
alter table public.clinic_attendance add column if not exists in_attempt text;
alter table public.clinic_attendance add column if not exists out_attempt text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'clinic_attendance_attempt_len') then
    alter table public.clinic_attendance
      add constraint clinic_attendance_attempt_len
      check ((in_attempt is null or char_length(in_attempt) between 8 and 64) and (out_attempt is null or char_length(out_attempt) between 8 and 64));
  end if;

  -- 2. An OUT time can never be saved without an IN time.
  --    "not valid": old rows are left as they are; every new write is checked.
  if not exists (select 1 from pg_constraint where conname = 'clinic_attendance_out_needs_in') then
    alter table public.clinic_attendance
      add constraint clinic_attendance_out_needs_in
      check (out_at is null or in_at is not null) not valid;
  end if;
end $$;

-- One row per student per session is already a rule of this table (unique session_id, user_id
-- in 2026_11_16_clinic.sql), so two phones can never make two rows. Nothing to add for it.

notify pgrst, 'reload schema';
