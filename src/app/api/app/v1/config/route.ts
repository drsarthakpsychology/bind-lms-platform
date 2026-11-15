import { buildConfig } from "@/lib/app-api/config";
import { ok } from "@/lib/app-api/respond";

export const runtime = "nodejs";

/**
 * GET /api/app/v1/config: the minimum app version and the rules the app
 * enforces on the phone. Public, and never refused for an old version (an old
 * app must be able to learn that it is old).
 */
export async function GET() {
  return ok(buildConfig());
}
