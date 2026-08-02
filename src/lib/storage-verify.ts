import "server-only";

import { createAdminClient } from "@/lib/supabase/server";

/**
 * Server-side verification that an object actually landed in storage.
 *
 * The old upload flow created the DB row in `prepare`, then a revalidate-only
 * `confirm` — a failed upload left a row pointing at a path with no bytes
 * ("Object not found" in the viewer). Now every confirm path verifies the
 * object exists and is non-zero BEFORE promoting a row to `ready`. This must
 * run server-side (service-role client); the client's success callback is never
 * trusted.
 *
 * Returns the object's size in bytes, or null if the object is missing/empty.
 */
export async function verifyObjectExists(
  bucket: string,
  path: string,
): Promise<number | null> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.storage.from(bucket).info(path);
    if (error || !data) return null;
    const size = data.metadata?.size ?? data.size;
    return typeof size === "number" && size > 0 ? size : null;
  } catch (e) {
    console.error("verifyObjectExists failed:", bucket, path, e);
    return null;
  }
}
