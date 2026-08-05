# Next.js + React — authz, server actions, data exposure

## CVE-2025-29927 — middleware authorization bypass (P0 if vulnerable)

Next.js middleware can be skipped entirely by sending
`x-middleware-subrequest: middleware:middleware:middleware:middleware:middleware`,
bypassing auth/authz. Affected: `<12.3.5, <13.5.9, <14.2.25, <15.2.3`.

- **Check the version first** (`package.json`). If below → P0.
- **Never rely on middleware alone for authorization** — re-verify in the Data
  Access Layer. Mitigate pending upgrade: strip `x-middleware-subrequest` at the
  proxy/edge.
- Nuclei has a detection template.

## Server Actions

- A Server Action inherits the hosting page's access control — but Next's own
  guidance is to treat **every action as a public endpoint**: do auth + authz +
  input validation **inside** the action.
- A Server Action that closes over a server variable **serializes that variable
  to the client** as hidden form data — leaks secrets.
- You can ban POST on a page to limit action access.

## Secrets in the client

- Any `NEXT_PUBLIC_`-prefixed var is **inlined into the client bundle at build
  time**. The Vercel "Sensitive" flag does NOT stop inlining — only the prefix
  matters. Secrets must never use this prefix.
- Use `import "server-only"` to fence server modules (build error if imported
  client-side). The experimental Taint API flags sensitive data reaching the client.

## RSC / Server → Client data exposure

- Passing objects with sensitive fields from Server to Client Components
  serializes them to the browser.
- Audit `"use client"` prop types (overly broad?) and `"use server"` argument
  validation.
- Prefer an isolated Data Access Layer; verify DB packages/env vars are not
  imported outside it.

## Caching authenticated responses

- Vercel's CDN caches a response only if: no `Authorization` header, no
  `Set-Cookie`, and no `private`/`no-cache`/`no-store` in `Cache-Control`.
- The trap: a personalized route setting `s-maxage` **without `private`** gets
  cached and served to other users (SvelteSpill class).
- Fix: `Cache-Control: private, no-store` on all authenticated routes; never ISR
  auth routes; `export const dynamic = "force-dynamic"`; check `x-vercel-cache`.