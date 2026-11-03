/**
 * Test and robot accounts (the AI calibration account, "lumen" test logins,
 * end-to-end and health-check bots, anything flagged is_test) never show in
 * admin lists, review queues or leaderboards. Pure, so it is testable.
 */
const ROBOT_EMAIL = [
  /@([a-z0-9-]+\.)*(test|internal|local|invalid|example)$/i, // reserved test domains
  /@lumen\./i, // old AI test logins
  /^(nightverify|invite-e2e|simhealth|calibration|e2e|healthcheck)[^@]*@/i, // bots
];

export function isRobotEmail(email: string | null | undefined): boolean {
  const e = (email ?? "").trim();
  return e !== "" && ROBOT_EMAIL.some((re) => re.test(e));
}

/** Hidden from every admin list: flagged test accounts and robot emails. */
export function isHiddenAccount(p: { email?: string | null; is_test?: boolean | null }): boolean {
  return Boolean(p.is_test) || isRobotEmail(p.email);
}
