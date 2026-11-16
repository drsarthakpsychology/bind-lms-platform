import { z } from "zod";
import { logWhatsApp } from "@/app/(dashboard)/admin/people/actions";
import { createAdminClient } from "@/lib/supabase/server";
import { emailFromKey, loadPipeline } from "@/lib/crm/people";
import { waLink, waMessage } from "@/lib/crm/views";
import { failFrom } from "@/lib/app-api/admin-extras";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { PeopleWhatsAppResult } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({ keys: z.array(z.string().max(400)).min(1).max(500), text: z.string().max(1000) });

/**
 * POST /api/app/v1/admin/people/whatsapp: each picked person's wa.me link with
 * {first_name} filled (waMessage, waLink), and the contact logged (logWhatsApp).
 * Only people in the pipeline; super admin only.
 */
export const POST = appRoute({ auth: "superAdmin" }, async ({ user, body, limitWrite }): Promise<PeopleWhatsAppResult> => {
  const b = await body(schema, 256 * 1024);
  const want = new Set(b.keys.map((k) => emailFromKey(k)?.toLowerCase()).filter((e): e is string => Boolean(e)));
  if (!want.size) throw new ApiFail("bad_request", "Pick at least one person.");
  await limitWrite(`app:people:${user.profile.id}`, 30);
  const people = (await loadPipeline(createAdminClient())).people.filter((p) => want.has(p.email.toLowerCase()));
  if (!people.length) throw new ApiFail("not_found", "None of these people are in the pipeline.");
  const r = await logWhatsApp(people.map((p) => p.email), b.text);
  if (r.error) failFrom(r.error);
  return { links: people.map((p) => ({ key: p.key, name: p.name ?? "", url: waLink(p.phone, b.text.trim() ? waMessage(b.text, p) : undefined) })) };
});
