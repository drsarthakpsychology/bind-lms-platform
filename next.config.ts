import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // A handful of routes read repo JSON at request time via readFileSync
  // (not import) — the psychopharm knowledge base and the case-library
  // corpus. @vercel/nft's static trace usually resolves
  // `readFileSync(join(process.cwd(), "literal/path"))`, but the docs are
  // explicit that this isn't guaranteed. Named explicitly so a build
  // never silently ships a route that 500s or empties on first request.
  outputFileTracingIncludes: {
    "/practice/library": ["scripts/corpus/normalised/**/*"],
    "/tools/psychopharm/*": ["docs/psychopharm/**/*"],
    "/admin/psychopharm/editor/*": ["docs/psychopharm/**/*"],
    "/api/psychopharm/*": ["docs/psychopharm/**/*"],
  },
  // Tree-shake these to their used exports (lucide icons, motion, radix all
  // export far more than any page imports). Shrinks the shared client chunk.
  experimental: {
    optimizePackageImports: ["lucide-react", "motion", "radix-ui"],
  },
  async redirects() {
    return [
      {
        // The primary CTA was renamed Enquire → Join waitlist, so the route
        // moved to /waitlist. Any shared /enquire link keeps working.
        source: "/enquire",
        destination: "/waitlist",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        // Hashed build assets (JS/CSS/font chunks) are immutable — a year-long
        // cache makes repeat visits avoid the revalidation round-trip. Next's
        // asset URLs include the content hash, so this can never serve stale.
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Every route gets enterprise-grade security headers.
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            // default-src 'self'; script needs the Next.js dev/eval paths,
            // style needs 'unsafe-inline' for the design system's runtime CSS.
            // media/img allow Supabase storage (signed video + submission URLs),
            // and the R2/Cloudflare stream hosts for future segmented delivery.
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: blob: *.supabase.co *.r2.cloudflarestorage.com *.cloudflarestream.com; " +
              "media-src 'self' blob: *.supabase.co *.r2.cloudflarestorage.com *.cloudflarestream.com; " +
              "connect-src 'self' *.supabase.co *.r2.cloudflarestorage.com *.cloudflarestream.com; " +
              "frame-src 'self'; " +
              "object-src 'none'; " +
              "base-uri 'self'; " +
              "form-action 'self'; " +
              "frame-ancestors 'self'; " +
              "upgrade-insecure-requests",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

// Sentry build-time wiring (source-map upload + release tagging) is ONLY
// active once a DSN is configured. Without keys this stays a plain config, so
// a key-less build is byte-identical to before. The runtime error capture
// (instrumentation.ts + sentry.*.config.ts) is independent of this wrapper.
const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

export default dsn
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: true,
      telemetry: false,
      sourcemaps: { disable: false },
      reactComponentAnnotation: { enabled: true },
    })
  : nextConfig;
