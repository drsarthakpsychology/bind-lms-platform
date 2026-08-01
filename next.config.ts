import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Every route gets enterprise-grade security headers.
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            // default-src 'self'; script needs the Next.js dev/eval paths,
            // style needs 'unsafe-inline' for the design system's runtime CSS.
            // media/img allow Supabase storage (signed video + submission URLs).
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: blob: *.supabase.co; " +
              "media-src 'self' blob: *.supabase.co; " +
              "connect-src 'self' *.supabase.co; " +
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
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
