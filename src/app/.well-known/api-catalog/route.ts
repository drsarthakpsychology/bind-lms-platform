import { NextResponse } from "next/server";

/**
 * RFC 9727 API catalog — machine-readable discovery of the site's APIs.
 * Served with `application/linkset+json`; the homepage Link header points
 * here. Each entry anchors a real API and links its OpenAPI description
 * (service-desc), documentation (service-doc), and health check (status).
 */
const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vibhapsychology.com";

const catalog = {
  linkset: [
    {
      anchor: `${baseUrl}/api/health`,
      "service-desc": [{ href: `${baseUrl}/openapi.json`, type: "application/openapi+json" }],
      "service-doc": [{ href: `${baseUrl}/api/health`, type: "application/json" }],
      status: [{ href: `${baseUrl}/api/health`, type: "application/json" }],
    },
    {
      anchor: `${baseUrl}/api/practice`,
      "service-desc": [{ href: `${baseUrl}/openapi.json`, type: "application/openapi+json" }],
      "service-doc": [{ href: `${baseUrl}/openapi.json`, type: "application/openapi+json" }],
    },
    {
      anchor: `${baseUrl}/api/knowledge`,
      "service-desc": [{ href: `${baseUrl}/openapi.json`, type: "application/openapi+json" }],
      "service-doc": [{ href: `${baseUrl}/openapi.json`, type: "application/openapi+json" }],
    },
    {
      anchor: `${baseUrl}/api/psychopharm`,
      "service-desc": [{ href: `${baseUrl}/openapi.json`, type: "application/openapi+json" }],
      "service-doc": [{ href: `${baseUrl}/openapi.json`, type: "application/openapi+json" }],
    },
    {
      anchor: `${baseUrl}/api/media`,
      "service-desc": [{ href: `${baseUrl}/openapi.json`, type: "application/openapi+json" }],
      "service-doc": [{ href: `${baseUrl}/openapi.json`, type: "application/openapi+json" }],
    },
  ],
};

export function GET() {
  return NextResponse.json(catalog, {
    headers: { "Content-Type": "application/linkset+json; charset=utf-8" },
  });
}
