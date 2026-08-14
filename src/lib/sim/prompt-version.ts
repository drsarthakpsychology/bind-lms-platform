/**
 * T173 — patient prompt/version traceability. Bump this whenever the Director
 * or Actor prompt changes; every call logs it (ai_usage_log.prompt_version),
 * so a behaviour change can be compared and rolled back by reverting to the
 * previous version's code + knowing exactly which prompts produced which runs.
 */
export const PATIENT_PROMPT_VERSION = "2026-08-14.1";
