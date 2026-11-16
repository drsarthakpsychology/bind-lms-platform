import { evaluate } from "@/lib/auth/api-guard";
import { isAdminLike } from "@/lib/auth/guards";
import { adminLeaderboard, BOARD_GATES, leaderboard } from "@/lib/app-api/boards";
import { parseAdminQuery } from "@/lib/standing/admin-board";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { Leaderboard } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/leaderboards/:board (league, quiz, overall): the website's boards, the student's own cohort only. Admins get every student, with ?q=&cohort=&sort=&dir=&page=. */
export const GET = appRoute<{ board: string }>({ auth: "bearer" }, async ({ user, params, query }): Promise<Leaderboard> => {
  const board = params.board;
  if (board !== "league" && board !== "quiz" && board !== "overall") throw new ApiFail("not_found");
  const gate = await evaluate(user.profile, [BOARD_GATES[board]]);
  if (!gate.ok) throw new ApiFail(gate.reason === "account_blocked" ? "account_blocked" : gate.reason);
  if (isAdminLike(user.profile)) return adminLeaderboard(board, parseAdminQuery(query));
  return leaderboard(board, user.profile.id);
});
