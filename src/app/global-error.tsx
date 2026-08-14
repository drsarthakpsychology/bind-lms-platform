"use client";

import * as React from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

/**
 * Root-layout error boundary. `error.tsx` wraps pages but NOT the layout of
 * its own segment — so if the root layout throws (fonts, theme provider,
 * toaster), this file is the only thing between the user and the bare Next.js
 * fallback. It replaces the root layout entirely, so it must define its own
 * <html>/<body> and cannot rely on globals.css or the app theme: the palette
 * below is the design system's (cream paper, ink, peach primary), inlined.
 * Production error.message is generic by design; only the digest is surfaced.
 */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  React.useEffect(() => {
    // Root-layout failures are the rarest and most important to see — the
    // global boundary is the only code that runs when the layout itself threw.
    Sentry.captureException(error);
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#fff6ef",
          color: "#1e1e14",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
        }}
      >
        <style>{`a:focus-visible,button:focus-visible{outline:2px solid #f4a261;outline-offset:2px}`}</style>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div style={{ maxWidth: "28rem", width: "100%", textAlign: "center" }}>
            <div
              aria-hidden
              style={{
                margin: "0 auto",
                width: "3rem",
                height: "3rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #1e1e14",
                borderRadius: "0.375rem",
                background: "#ffe6d5",
                fontWeight: 700,
                fontSize: "1.25rem",
              }}
            >
              !
            </div>
            <h1
              style={{
                margin: "1.25rem 0 0.25rem",
                fontSize: "1.5rem",
                lineHeight: 1.15,
                letterSpacing: "-0.025em",
                fontWeight: 700,
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                margin: "0 auto",
                maxWidth: "22rem",
                fontSize: "0.875rem",
                lineHeight: 1.5,
                color: "#5c554a",
              }}
            >
              This page hit an unexpected snag. Nothing you&apos;ve done is lost
              — try again, and if it keeps happening we&apos;ll get it sorted.
            </p>
            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                justifyContent: "center",
              }}
            >
              <button
                type="button"
                onClick={() => unstable_retry()}
                style={{
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  border: "2px solid #1e1e14",
                  borderRadius: "0.375rem",
                  background: "#f4a261",
                  color: "#1e1e14",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  padding: "0.5rem 1rem",
                }}
              >
                Try again
              </button>
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: "2px solid #1e1e14",
                  borderRadius: "0.375rem",
                  background: "#fffdf9",
                  color: "#1e1e14",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  padding: "0.5rem 1rem",
                  textDecoration: "none",
                }}
              >
                Back to the home page
              </Link>
            </div>
            {error.digest ? (
              <p style={{ margin: "1.5rem 0 0", fontSize: "0.75rem", color: "#5c554a" }}>
                Reference <span style={{ fontFamily: "ui-monospace, monospace" }}>{error.digest}</span>
              </p>
            ) : null}
          </div>
        </div>
      </body>
    </html>
  );
}
