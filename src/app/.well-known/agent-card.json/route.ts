import { NextResponse } from "next/server";

/**
 * A2A agent card (a2a-protocol.org) — how an AI agent discovers what this
 * service offers. Honest scope: VIBHA is a website, not an autonomous agent;
 * the card describes its informational surface so a coordinating agent can
 * decide how to interact with it (visit the public pages, query the tutor).
 */
const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vibhapsychology.com";

const card = {
  name: "VIBHA School of Psychology",
  version: "1.0.0",
  description:
    "A clinical psychology training programme. Public site: programme information, " +
    "the waitlist, and an authenticated learning platform (lessons, simulated patients, " +
    "the psychology tutor, psychopharm reference). Agents may read the public pages and " +
    "health check; student areas require an authenticated session.",
  url: baseUrl,
  documentationUrl: `${baseUrl}/openapi.json`,
  capabilities: {
    // The site is informational — it can answer about the programme and report health.
    actions: ["read.public_pages", "query.health"],
  },
  skills: [
    {
      id: "markdown-negotiation",
      name: "Markdown Negotiation",
      description:
        "Requesting the landing page with `Accept: text/markdown` returns a clean markdown representation for agents.",
    },
  ],
  supportedInterfaces: [
    {
      service: `${baseUrl}/`,
      transport: "http",
    },
  ],
};

export function GET() {
  return NextResponse.json(card, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
