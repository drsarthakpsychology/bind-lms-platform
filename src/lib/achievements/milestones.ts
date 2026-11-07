import { MODULES } from "@/lib/study";
import type { BadgeTone, MilestoneRequirement } from "./rules";

/**
 * VIBHA milestones (owner decision 39: about 30 to 40, each hard-earned,
 * "challenging but earnable, never thousands"). Four groups:
 *   - mastery     : modules finished with a strong test score
 *   - skill       : the daily case, ranked duels and league climbing
 *   - consistency : streaks, total XP, repeated promotions
 *   - rare        : secret; the progress line stays hidden until earned
 *
 * These are definitions only. ensureMilestones() (server.ts) adds any that
 * are missing to the achievements table, and awardEligibleBadges() awards
 * them idempotently like every other badge. Recognition, not pressure:
 * descriptions say what was done (DESIGN_INTELLIGENCE A14).
 */

export type MilestoneGroup = "mastery" | "skill" | "consistency" | "rare";

export type Milestone = {
  slug: string;
  group: MilestoneGroup;
  title: string;
  description: string;
  icon: string;
  tone: BadgeTone;
  requirements: MilestoneRequirement;
};

export const GROUP_LABEL: Record<MilestoneGroup, string> = {
  mastery: "Mastery",
  skill: "Skill",
  consistency: "Consistency",
  rare: "Rare",
};

const ALL_MODULES = MODULES.length;

export const MILESTONES: Milestone[] = [
  // Mastery ---------------------------------------------------------------
  { slug: "ms-mastery-1", group: "mastery", title: "First mastery", description: "Finished a module and scored 80%+ on its test.", icon: "◆", tone: "lime", requirements: { kind: "module_mastered", count: 1 } },
  { slug: "ms-mastery-3", group: "mastery", title: "Three deep", description: "Mastered 3 modules.", icon: "◆", tone: "lime", requirements: { kind: "module_mastered", count: 3 } },
  { slug: "ms-mastery-6", group: "mastery", title: "Six on the shelf", description: "Mastered 6 modules.", icon: "◆", tone: "blue", requirements: { kind: "module_mastered", count: 6 } },
  { slug: "ms-mastery-10", group: "mastery", title: "Ten modules", description: "Mastered 10 modules.", icon: "◆", tone: "blue", requirements: { kind: "module_mastered", count: 10 } },
  { slug: "ms-mastery-15", group: "mastery", title: "Fifteen modules", description: "Mastered 15 modules.", icon: "◆", tone: "ink", requirements: { kind: "module_mastered", count: 15 } },
  { slug: "ms-mastery-all", group: "mastery", title: "The whole course", description: `Mastered all ${ALL_MODULES} modules.`, icon: "♛", tone: "gold", requirements: { kind: "module_mastered", count: ALL_MODULES } },
  { slug: "ms-mood-depression", group: "mastery", title: "Depression, mastered", description: "Finished the Depression module with 80%+ on the test.", icon: "☁", tone: "blue", requirements: { kind: "module_mastered", module: "depression" } },
  { slug: "ms-mood-bipolar", group: "mastery", title: "Bipolar, mastered", description: "Finished the Bipolar module with 80%+ on the test.", icon: "☾", tone: "blue", requirements: { kind: "module_mastered", module: "bipolar" } },

  // Skill -----------------------------------------------------------------
  { slug: "ms-case-10", group: "skill", title: "Case reader", description: "Solved 10 daily cases.", icon: "⌕", tone: "lime", requirements: { kind: "daily_cases_solved", min: 10 } },
  { slug: "ms-case-50", group: "skill", title: "Case regular", description: "Solved 50 daily cases.", icon: "⌕", tone: "blue", requirements: { kind: "daily_cases_solved", min: 50 } },
  { slug: "ms-case-150", group: "skill", title: "Case veteran", description: "Solved 150 daily cases.", icon: "⌕", tone: "ink", requirements: { kind: "daily_cases_solved", min: 150 } },
  { slug: "ms-duel-5", group: "skill", title: "First blood", description: "Won 5 ranked duels.", icon: "⚔", tone: "lime", requirements: { kind: "duels_won", min: 5 } },
  { slug: "ms-duel-25", group: "skill", title: "Duellist", description: "Won 25 ranked duels.", icon: "⚔", tone: "blue", requirements: { kind: "duels_won", min: 25 } },
  { slug: "ms-duel-100", group: "skill", title: "Hundred wins", description: "Won 100 ranked duels.", icon: "⚔", tone: "ink", requirements: { kind: "duels_won", min: 100 } },
  { slug: "ms-league-up", group: "skill", title: "Moving up", description: "Promoted out of a weekly league.", icon: "▲", tone: "lime", requirements: { kind: "league_promoted", count: 1 } },
  { slug: "ms-league-circuit", group: "skill", title: "Circuit", description: "Reached the Circuit league.", icon: "▲", tone: "blue", requirements: { kind: "league_promoted", tier: 3 } },
  { slug: "ms-league-cortex", group: "skill", title: "Cortex", description: "Reached the Cortex league.", icon: "▲", tone: "ink", requirements: { kind: "league_promoted", tier: 4 } },
  { slug: "ms-league-mind", group: "skill", title: "Mind", description: "Reached Mind, the top league.", icon: "✦", tone: "gold", requirements: { kind: "league_promoted", tier: 5 } },

  // Consistency -----------------------------------------------------------
  { slug: "ms-streak-7", group: "consistency", title: "A full week", description: "Studied 7 days in a row.", icon: "⑦", tone: "lime", requirements: { kind: "streak_days", min: 7 } },
  { slug: "ms-streak-30", group: "consistency", title: "A full month", description: "Studied 30 days in a row.", icon: "★", tone: "blue", requirements: { kind: "streak_days", min: 30 } },
  { slug: "ms-streak-60", group: "consistency", title: "Sixty days", description: "Studied 60 days in a row.", icon: "★", tone: "ink", requirements: { kind: "streak_days", min: 60 } },
  { slug: "ms-streak-100", group: "consistency", title: "Hundred days", description: "Studied 100 days in a row.", icon: "★", tone: "gold", requirements: { kind: "streak_days", min: 100 } },
  { slug: "ms-xp-2500", group: "consistency", title: "Steady hands", description: "Earned 2,500 XP.", icon: "✚", tone: "lime", requirements: { kind: "xp_total", min: 2500 } },
  { slug: "ms-xp-10000", group: "consistency", title: "Ten thousand", description: "Earned 10,000 XP.", icon: "✚", tone: "blue", requirements: { kind: "xp_total", min: 10000 } },
  { slug: "ms-xp-25000", group: "consistency", title: "Deep reserves", description: "Earned 25,000 XP.", icon: "✚", tone: "ink", requirements: { kind: "xp_total", min: 25000 } },
  { slug: "ms-climb-5", group: "consistency", title: "Climber", description: "Promoted 5 times.", icon: "⇡", tone: "blue", requirements: { kind: "league_promoted", count: 5 } },
  { slug: "ms-climb-15", group: "consistency", title: "Relentless", description: "Promoted 15 times.", icon: "⇡", tone: "ink", requirements: { kind: "league_promoted", count: 15 } },

  // Rare (secret) ----------------------------------------------------------
  { slug: "ms-rare-streak-200", group: "rare", title: "Unbroken", description: "Studied 200 days in a row.", icon: "∞", tone: "rose", requirements: { kind: "streak_days", min: 200, secret: true } },
  { slug: "ms-rare-streak-365", group: "rare", title: "Every day for a year", description: "Studied 365 days in a row.", icon: "∞", tone: "gold", requirements: { kind: "streak_days", min: 365, secret: true } },
  { slug: "ms-rare-duel-300", group: "rare", title: "Duel legend", description: "Won 300 ranked duels.", icon: "⚔", tone: "rose", requirements: { kind: "duels_won", min: 300, secret: true } },
  { slug: "ms-rare-case-300", group: "rare", title: "Case hunter", description: "Solved 300 daily cases.", icon: "⌕", tone: "rose", requirements: { kind: "daily_cases_solved", min: 300, secret: true } },
  { slug: "ms-rare-xp-75000", group: "rare", title: "Living library", description: "Earned 75,000 XP.", icon: "❖", tone: "rose", requirements: { kind: "xp_total", min: 75000, secret: true } },
  { slug: "ms-rare-mind-20", group: "rare", title: "Mind, again and again", description: "Reached Mind and earned 20 promotions.", icon: "✦", tone: "gold", requirements: { kind: "league_promoted", count: 20, tier: 5, secret: true } },
];

/** What a locked secret milestone shows instead of its real description. */
export const SECRET_TEXT = "A secret milestone.";
