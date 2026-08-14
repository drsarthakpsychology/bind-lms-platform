import { NextResponse } from "next/server";

/**
 * Minimal OpenAPI 3.0 document — the machine-readable description that the
 * RFC 9727 API catalog's `service-desc` relation points at. Honest scope:
 * the site's public, unauthenticated surface (the health check) plus the
 * main authenticated API groups, documented at the group level. Full
 * per-endpoint schemas for the LMS are intentionally not exported (student
 * data stays behind auth).
 */
const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vibhapsychology.com";

const spec = {
  openapi: "3.0.3",
  info: {
    title: "VIBHA School of Psychology — API",
    description:
      "Public and authenticated APIs for the VIBHA School of Psychology platform. " +
      "Most endpoints require a Supabase session (Bearer JWT). Only the health check is public.",
    version: "1.0.0",
  },
  servers: [{ url: baseUrl }],
  paths: {
    "/api/health": {
      get: {
        summary: "Service health",
        description: "Public dependency health check (database, storage).",
        responses: {
          "200": { description: "Healthy" },
          "503": { description: "Degraded" },
        },
      },
    },
    "/api/practice/sim/turn": {
      post: {
        summary: "Simulated patient turn",
        description: "Authenticated. Sends a student turn and receives the patient reply.",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Patient reply" } },
      },
    },
    "/api/practice/wall/posts": {
      get: { summary: "Formulation wall posts", security: [{ bearerAuth: [] }], responses: { "200": { description: "Wall posts" } } },
    },
    "/api/knowledge/ask": {
      post: { summary: "Psychology tutor answer", security: [{ bearerAuth: [] }], responses: { "200": { description: "Grounded answer" } } },
    },
    "/api/psychopharm/search": {
      get: { summary: "Psychopharm knowledge search", security: [{ bearerAuth: [] }], responses: { "200": { description: "Matches" } } },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
};

export function GET() {
  return NextResponse.json(spec, {
    headers: { "Content-Type": "application/openapi+json; charset=utf-8" },
  });
}
