/**
 * AI guards — rate limits, daily/session caps, kill switch, and the
 * data-policy split. `assertProviderAllowed` throws BEFORE any request
 * leaves the server.
 */

import type { Provider } from "./router";
import { canServe } from "./router";

export type Workload =
  | "content_generation" // drafting cases, cards, items — NO student data
  | "corpus_processing" // summarising scraped literature — NO student data
  | "embeddings" // course content embeddings — NO student data
  | "sim_patient_turn" // live simulated patient — STUDENT DATA
  | "debrief_scoring" // scoring a student transcript — STUDENT DATA
  | "journal_support"; // journal "help me think" — STUDENT DATA, most sensitive

/** Whether a workload may ever touch a provider that trains on data. */
export function workloadHasStudentData(workload: Workload): boolean {
  switch (workload) {
    case "content_generation":
    case "corpus_processing":
    case "embeddings":
      return false;
    case "sim_patient_turn":
    case "debrief_scoring":
    case "journal_support":
      return true;
  }
}

/**
 * THE data-policy guard. Throws if a provider is asked to serve a workload it
 * is not allowed to see. Called from the router before any request leaves the
 * server. Non-negotiable; covered by a unit test.
 */
export function assertProviderAllowed(workload: Workload, provider: Provider): void {
  const studentData = workloadHasStudentData(workload);
  if (studentData && provider.trainsOnData) {
    throw new Error(
      `data-policy violation: workload "${workload}" contains student data ` +
        `but provider "${provider.id}" trains on data. Refusing to send.`,
    );
  }
}

export interface AiGuardOptions {
  /** daily cap in requests for the user */
  dailyCap?: number;
  /** per-session cap in requests */
  sessionCap?: number;
  /** kill switch */
  enabled?: boolean;
}

export class AiGuardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiGuardError";
  }
}

/**
 * High-level guard for a student-facing call. When no no-train provider is
 * available for a sensitive workload, this throws so the feature can show an
 * honest message (never a silent downgrade to a training provider).
 */
export function guardStudentCall(workload: Workload, opts: AiGuardOptions = {}): void {
  if (opts.enabled === false) throw new AiGuardError("AI features are disabled");
  if (opts.dailyCap === undefined || opts.sessionCap === undefined) return;
  if (opts.dailyCap <= 0) throw new AiGuardError("daily AI budget exceeded");
  if (opts.sessionCap <= 0) throw new AiGuardError("session AI budget exceeded");
  const studentData = workloadHasStudentData(workload);
  if (studentData && !canServe("chat", true)) {
    throw new AiGuardError(
      "no no-train AI provider is configured; this feature needs a paid key",
    );
  }
}
