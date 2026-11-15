import { saveMobileNumber, skipMobileNumber } from "@/app/(dashboard)/dashboard/actions";
import { loadProfileRow } from "@/lib/app-api/guard";
import { buildMe } from "@/lib/app-api/me";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { updateMeSchema } from "@/lib/app-api/schemas";

export const runtime = "nodejs";

/** GET /api/app/v1/me: the account, what it may open, the watermark text. */
export const GET = appRoute({ auth: "bearer" }, async ({ user }) => buildMe(user.profile, user.name));

/** PATCH /api/app/v1/me: the WhatsApp number, or "Later". */
export const PATCH = appRoute({ auth: "bearer" }, async ({ user, body, limitWrite }) => {
  const input = await body(updateMeSchema);
  await limitWrite(`app:me:${user.profile.id}`, 20);
  if (input.mobileNumber !== undefined) {
    const r = await saveMobileNumber(input.mobileNumber);
    if (r.error) throw new ApiFail("bad_request", r.error, { fields: ["mobileNumber"] });
  } else if (input.skipMobilePrompt) {
    const r = await skipMobileNumber();
    if (r.error) throw new ApiFail("server_error", r.error);
  }
  const fresh = await loadProfileRow(user.profile.id);
  return buildMe(fresh?.profile ?? user.profile, fresh?.name ?? user.name);
});
