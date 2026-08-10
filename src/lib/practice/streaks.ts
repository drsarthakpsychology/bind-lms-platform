/**
 * Streaks (Part 6.6) — count SHOWING UP, not scoring.
 * IST rollover: everything is India time. Getting this wrong breaks streaks
 * at 5:30am. Tested.
 *
 * Rules: 2 auto-freezes/month + 1 manual grace day. No guilt notifications.
 */

/** Asia/Kolkata is fixed UTC+5:30 (no DST), so we compute it deterministically. */
export function istNow(utc = new Date()): Date {
  return new Date(utc.getTime() + 5.5 * 60 * 60 * 1000);
}

export function istToday(utc = new Date()): string {
  return istNow(utc).toISOString().slice(0, 10);
}

export interface StreakState {
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  freezes_used_this_month: number;
  manual_grace_used: number;
}

export const MAX_FREEZES_PER_MONTH = 2;
export const MAX_GRACE_DAYS = 1;

/**
 * Update the streak after a day of activity. `activityDate` is the IST date
 * (YYYY-MM-DD) the student did something.
 *
 * Returns the new streak state. Idempotent: re-recording the same day does
 * not double-count.
 */
export function recordActivity(state: StreakState, activityDate: string): StreakState {
  // Normalise to a comparable date (dates are YYYY-MM-DD).
  const last = state.last_active_date;

  if (last === activityDate) {
    // Same-day duplicate — no change.
    return state;
  }

  const lastDay = last ? new Date(`${last}T00:00:00Z`) : null;
  const actDay = new Date(`${activityDate}T00:00:00Z`);

  // How many IST days between the last activity and this one?
  const gapDays = lastDay ? Math.round((actDay.getTime() - lastDay.getTime()) / 86400000) : 0;

  let current = state.current_streak;
  if (!lastDay) {
    // First activity ever.
    current = 1;
  } else if (gapDays === 1) {
    // Consecutive day — streak continues.
    current += 1;
  } else if (gapDays === 2) {
    // Exactly one missed day. Freeze covers it; else manual grace; else reset.
    if (state.freezes_used_this_month < MAX_FREEZES_PER_MONTH) {
      current += 1;
      state.freezes_used_this_month += 1;
    } else if (state.manual_grace_used < MAX_GRACE_DAYS) {
      current += 1;
      state.manual_grace_used += 1;
    } else {
      current = 1;
    }
  } else if (gapDays > 2) {
    // More than one missed day — the streak breaks (no single freeze covers it).
    current = 1;
  }

  const longest = Math.max(state.longest_streak, current);
  return {
    current_streak: current,
    longest_streak: longest,
    last_active_date: activityDate,
    freezes_used_this_month: state.freezes_used_this_month,
    manual_grace_used: state.manual_grace_used,
  };
}

/**
 * Whether the streak is still alive (no activity today yet, but a freeze
 * would cover it). Never sends "your streak is about to die" guilt — this is
 * for the internal display only.
 */
export function streakAlive(state: StreakState): boolean {
  const today = istToday();
  if (state.last_active_date === today) return true;
  // If the last active day is yesterday, the streak survives until IST midnight.
  const last = state.last_active_date ? new Date(`${state.last_active_date}T00:00:00Z`) : null;
  if (!last) return false;
  const todayDay = new Date(`${today}T00:00:00Z`);
  const gap = Math.round((todayDay.getTime() - last.getTime()) / 86400000);
  return gap <= 1;
}
