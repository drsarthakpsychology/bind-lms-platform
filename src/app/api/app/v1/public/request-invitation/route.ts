import { z } from "zod";
import { saveEnquiry } from "@/lib/enquiry";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { RequestInvitationResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().max(40).optional(),
  status: z.enum(["student", "early_career", "practitioner", "other"]),
  message: z.string().max(2000).optional(),
  // The visitor ticked the policy box; anything else is refused (the website's rule).
  policyAccepted: z.literal(true),
});

/** POST /api/app/v1/public/request-invitation: the website's waitlist form, from the app (source "app"). */
export const POST = appRoute({ auth: "public" }, async ({ body, ip, limitStrict }): Promise<RequestInvitationResult> => {
  const input = await body(schema, 8192);
  // Same counter as the website form: 5 a minute per network.
  await limitStrict(`waitlist:${ip}`, 5);
  const r = await saveEnquiry({ name: input.name, email: input.email, phone: input.phone || null, status: input.status, message: input.message || null }, "app");
  if (!r.ok) throw new ApiFail("server_error", "Something went wrong. Please try again.");
  return { received: true };
});
