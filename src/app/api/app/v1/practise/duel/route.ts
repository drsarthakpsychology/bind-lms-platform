import { z } from "zod";
import { evaluate } from "@/lib/auth/api-guard";
import { POST as duelLive } from "@/app/(dashboard)/games/duel/live/route";
import { forwardJson } from "@/lib/app-api/forward";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";

export const runtime = "nodejs";

const body = z.object({ op: z.enum(["join", "queue", "leave", "bot", "poll", "answer", "quit"]) }).passthrough();

/**
 * POST /api/app/v1/practise/duel { op, ... }: the duel's one door (the
 * website's /games/duel/live, polled about once a second). Every decision
 * (round clock, score, winner, rating) is made there from server time.
 */
export const POST = appRoute({ auth: "bearer" }, async ({ user, body: read }) => {
  const gate = await evaluate(user.profile, [{ path: "/games/duel", flag: "learn" }]);
  if (!gate.ok) throw new ApiFail(gate.reason === "account_blocked" ? "account_blocked" : gate.reason);
  return forwardJson(duelLive, "/games/duel/live", await read(body, 4096));
});
