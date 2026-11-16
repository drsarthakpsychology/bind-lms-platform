import { fail } from "@/lib/app-api/respond";

/**
 * Any /api/app/v1 path no route answers: a JSON not_found, never the website's
 * HTML 404 page. The app reads `not_found` as "not on the server yet" (its
 * fallbacks and "Coming in the next update" states depend on it). Every real
 * route is more specific than this one, so Next.js always picks it first.
 */
const missing = () => fail("not_found", "This part of the app is not on the server yet. Update the app, or try again later.");

export const GET = missing;
export const POST = missing;
export const PUT = missing;
export const PATCH = missing;
export const DELETE = missing;
