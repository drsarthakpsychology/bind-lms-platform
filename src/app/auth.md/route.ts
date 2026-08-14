import { NextResponse } from "next/server";

/**
 * Auth.md — agent registration/auth discovery document. Served at /auth.md
 * as markdown. VIBHA's student-facing services are authenticated via Supabase
 * sessions (human login); there is no agent-provisioned credential flow, so
 * this document is self-contained and honest about what an agent can do.
 */
const AUTH_MD = `# auth.md

## Audience

This document is for AI agents and automated clients that want to interact
with VIBHA School of Psychology (https://vibhapsychology.com).

## What an agent can do without credentials

- Read the public marketing pages (/, /waitlist) — plain HTTP GET, no auth.
- Query the service health check: GET /api/health.
- Request the landing page as markdown by sending \`Accept: text/markdown\`.
- Discover the API surface via /openapi.json and /.well-known/api-catalog.

## What requires an account

The learning platform (lessons, simulated patients, the psychology tutor,
psychopharm reference, the wall) requires an authenticated Supabase session.
These areas are intended for enrolled students and are NOT provisioned for
automated agents. There is no agent-registration endpoint.

## The waitlist

The /waitlist form is for human applicants to Cohort One. It is rate-limited
and honeypot-guarded. Automated submissions are not accepted; agents should
not attempt to fill it (see robots.txt \`Content-Signal: ai-input=no\`).

## Credential use

If a valid Supabase session JWT is presented in the \`Authorization: Bearer\`
header, authenticated APIs accept it. Do not send credentials to the public
pages. No API keys are issued to agents.
`;

export function GET() {
  return new NextResponse(AUTH_MD, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
