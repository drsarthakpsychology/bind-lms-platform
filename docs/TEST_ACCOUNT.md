# Test account

A throwaway student account is seeded for local and staging checks.

| | |
|---|---|
| **Username** | `Test@vibha.test` |
| **Password** | `K#test` |
| **Role** | student (enrolled in the existing course) |
| **Flag** | `profiles.is_test = true` (shows a `Test` badge in the admin student list) |

## Why it exists

It lets you exercise the full student experience (dashboard, lesson player,
materials viewer, assignment submit/grade) without needing to create an account
by hand every time.

## ⚠ MUST REMOVE BEFORE COHORT LAUNCH (20 August)

- The password is **weak and known**. It exists only for local/staging checks.
- **Do not seed it into a production environment that is separated from
  staging.** The seed script writes to whatever Supabase project the service
  role key points at — run it only against local/staging.
- Before the first real student signs in, delete the account:
  `/admin/students` → find `Test` → delete. Or:

  ```bash
  npx tsx -e "
    const { createClient } = require('@supabase/supabase-js');
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    admin.auth.admin.listUsers().then(async ({ data }) => {
      const t = data.users.find(u => u.email?.toLowerCase() === 'test@vibha.test');
      if (t) await admin.auth.admin.deleteUser(t.id);
      console.log('deleted', t?.id);
    });
  "
  ```

## Re-seeding / resetting

- Re-run the seed (idempotent): `npm run seed-test -- <courseId>`
- Reset the password to `K#test`: `/admin/students` → the test row → **Reset**
- Delete the account: `/admin/students` → the test row → trash icon
