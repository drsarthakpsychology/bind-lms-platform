import { z } from "zod";
import { markPaid } from "@/app/(dashboard)/admin/people/actions";
import { emailOfKey, failFrom } from "@/lib/app-api/admin-extras";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { MarkPaidResult } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

const schema = z.object({ paid: z.boolean(), amount: z.number().min(0).max(10_000_000).nullable().optional(), note: z.string().max(300).nullable().optional() });

/** POST /api/app/v1/admin/people/:key/paid: mark paid or not paid (the website's markPaid; super admin only). */
export const POST = appRoute<{ key: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }): Promise<MarkPaidResult> => {
  const email = emailOfKey(params.key);
  const b = await body(schema, 2048);
  await limitWrite(`app:people:${user.profile.id}`, 120);
  const r = await markPaid(email, b.paid, b.amount ?? null, b.note ?? null);
  if (r.missingStep) throw new ApiFail("unavailable", r.error ?? undefined, { missingStep: true });
  if (r.error) failFrom(r.error);
  return { paid: b.paid };
});
