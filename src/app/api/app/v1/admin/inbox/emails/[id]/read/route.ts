import { markRead } from "@/app/(dashboard)/admin/emails/mail-actions";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";

export const runtime = "nodejs";

/** POST /api/app/v1/admin/inbox/emails/:id/read: mark an emailed reply read (the website's markRead; super admin only). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ params }) => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  await markRead(params.id);
  return { read: true };
});
