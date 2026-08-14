/**
 * Product analytics — a thin, fully-guarded wrapper around PostHog (EU cloud
 * by default). Everything here is a no-op until `NEXT_PUBLIC_POSTHOG_KEY` is
 * set, so shipping it changes nothing for local dev or a key-less deploy.
 *
 * WHY PostHog (and why EU): the school handles student enquiries and activity,
 * so the analytics must be privacy-clean. PostHog EU cloud stores in the EU
 * (GDPR) and does not train models on event data. Distinct IDs are anonymous
 * (cookie uuid) — we never attach PII (name/email/phone) to events; enquiry
 * events carry only non-identifying shape (stage, submitted).
 *
 * The Vercel Web Analytics + Speed Insights layer (see app/layout.tsx) already
 * gives traffic + real-user Core Web Vitals with zero config; this layer adds
 * the event-level funnel (pageviews, enquiry submission, login) that makes the
 * "improve stats and tracking" ask measurable.
 */
import posthog, { type PostHog } from "posthog-js";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

let client: PostHog | null = null;

function init() {
  if (client || !KEY || typeof window === "undefined") return;
  client = posthog.init(KEY, {
    api_host: HOST,
    // EU cloud by default; a self-hosted instance can be pointed at by
    // setting NEXT_PUBLIC_POSTHOG_HOST.
    person_profiles: "identified_only",
    capture_pageview: false, // we fire $pageview manually on route change
    autocapture: false, // explicit events only — no surprise PII grabs
    capture_pageleave: false,
    disable_session_recording: true,
  });
}

/** Track an event. No-op unless PostHog is configured. */
export function trackEvent(name: string, properties?: Record<string, unknown>) {
  init();
  if (!client) return;
  client.capture(name, properties);
}

/** Associate the anonymous visitor with a stable id (never PII). */
export function identifyUser(id: string, traits?: Record<string, unknown>) {
  init();
  if (!client) return;
  client.identify(id, traits);
}

/** Reset to anonymous (e.g. after logout). */
export function resetAnalytics() {
  init();
  if (!client) return;
  client.reset();
}
