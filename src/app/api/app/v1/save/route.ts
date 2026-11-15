import { z } from "zod";
import { MAX_SAVE_BYTES, applySaves, saveItemsSchema } from "@/lib/save/apply";
import { appRoute } from "@/lib/app-api/route";
import type { SaveResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

const schema = z.object({ items: saveItemsSchema });

/**
 * POST /api/app/v1/save: the app's offline queue. The same function as the
 * website's /api/save (applySaves). The owner check of the website is not
 * needed: the bearer token names the account.
 */
export const POST = appRoute({ auth: "bearer" }, async ({ user, body, limitFast }): Promise<SaveResult> => {
  const input = await body(schema, MAX_SAVE_BYTES);
  limitFast(`save:${user.profile.id}`, 240);
  return { results: (await applySaves(user.profile, input.items)) as SaveResult["results"] };
});
