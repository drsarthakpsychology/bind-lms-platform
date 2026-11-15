import { z } from "zod";
import { setStage } from "@/app/(dashboard)/admin/people/actions";
import { emailOfKey, failFrom } from "@/lib/app-api/admin-extras";
import { appRoute } from "@/lib/app-api/route";
import type { PersonSaved } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

const schema = z.object({ stage: z.string().max(30) });

/** POST /api/app/v1/admin/people/:key/stage: move to a pipeline stage (the website's setStage; super admin only). */
export const POST = appRoute<{ key: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }): Promise<PersonSaved> => {
  const email = emailOfKey(params.key);
  const { stage } = await body(schema, 512);
  await limitWrite(`app:people:${user.profile.id}`, 120);
  const r = await setStage(email, stage);
  if (r.error) failFrom(r.error);
  return { saved: true };
});
