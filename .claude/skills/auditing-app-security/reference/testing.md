# Testing Strategy

## What matters (more than raw line coverage)

- **Authorization tests** — can user A reach user B's data? (BOLA)
- **Negative tests** — unauthenticated / forbidden requests must fail.
- **Boundary tests** — edge inputs, large/empty/payload limits.
- **Cross-role tests** — anon, authenticated, admin, custom-claim roles.
- Property-based / fuzz where applicable (input validation, parsers, uploads).

The inverted-auth bugs that shipped in real incidents (blocked-logged-in,
anonymous-through) are exactly what negative + cross-role tests catch.

## Regression tests for every fix

Every security fix gets a test that reproduces the original vuln and asserts
it is now blocked. Example for the anon-replay class:

```ts
it("anon cannot list rows (RLS off regression)", async () => {
  const res = await anonClient.from("submissions").select("*");
  expect(res.error).not.toBeNull();         // 401 / permission denied
  expect(res.data).toHaveLength(0);
});
```

## RLS-specific testing

- Test from the **client SDK** (the SQL Editor bypasses RLS).
- Simulate anon / authenticated / custom-JWT roles.
- Test every CRUD on every RLS-enabled table.
- Wrap in transactions with ROLLBACK so nothing persists.

Tools:
- **pgTAP** — in-database tests with role impersonation
  (`SET ROLE`, `set_config('request.jwt.claims', ...)`).
- **SupaShield** — introspects schema, simulates roles, tests CRUD on every RLS
  table, generates diffable CI snapshots.

## CI gate

Make an RLS-disabled `public` table a merge blocker (fail the build if
`pg_tables WHERE NOT relrowsecurity` returns rows on tables that should be
protected).