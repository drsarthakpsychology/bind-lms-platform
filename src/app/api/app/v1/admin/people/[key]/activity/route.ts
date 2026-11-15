import { z } from "zod";
import { logActivity } from "@/app/(dashboard)/admin/people/actions";
import { emailOfKey, failFrom } from "@/lib/app-api/admin-extras";
import { appRoute } from "@/lib/app-api/route";
import type { PersonSaved } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

const schema = z.object({ kind: z.enum(["note", "call", "whatsapp", "email", "meeting"]), text: z.string().max(4000) });

/** POST /api/app/v1/admin/people/:key/activity: a note, call, WhatsApp, email or meeting on the timeline (the website's logActivity; super admin only). */
export const POST = appRoute<{ key: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }): Promise<PersonSaved> => {
  const email = emailOfKey(params.key);
  const { kind, text } = await body(schema, 16 * 1024);
  await limitWrite(`app:people:${user.profile.id}`, 120);
  const r = await logActivity(email, kind, text);
  if (r.error) failFrom(r.error);
  return { saved: true };
});
