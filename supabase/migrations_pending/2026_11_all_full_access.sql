-- Give every current student Full access (not "Lectures only"), as asked.
-- Changes data, not structure. Admins and alumni are not touched.
-- To undo for one person later: People → Access → Lectures only.
update public.profiles
set scope = 'full'
where role = 'student'
  and coalesce(scope, '') <> 'full';

-- Full accounts reach lectures through enrolment (or their cohort), so make
-- sure nobody loses a lecture they can see today: enrol every student in
-- every published course. Cohort members still see only their cohort's
-- lectures (the cohort rule comes first). Safe to run twice.
insert into public.course_enrollments (user_id, course_id)
select p.id, c.id
from public.profiles p
cross join public.courses c
where p.role = 'student'
  and c.is_published = true
on conflict (user_id, course_id) do nothing;
