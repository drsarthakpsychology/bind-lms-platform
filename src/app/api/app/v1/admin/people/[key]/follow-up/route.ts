import { z } from "zod";
import { setFollowUp } from "@/app/(dashboard)/admin/people/actions";
import { emailOfKey, failFrom } from "@/lib/app-api/admin-extras";
import { appRoute } from "@/lib/app-api/route";
import type { PersonSaved } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

const schema = z.object({ date: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]) });

/** POST /api/app/v1/admin/people/:key/follow-up { date }: set or clear the next follow-up (the website's setFollowUp; super admin only). */
export const POST = appRoute<{ key: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }): Promise<PersonSaved> => {
  const email = emailOfKey(params.key);
  const { date } = await body(schema, 512);
  await limitWrite(`app:people:${user.profile.id}`, 120);
  const r = await setFollowUp(email, date);
  if (r.error) failFrom(r.error);
  return { saved: true };
});
