import { sourceOf } from "./views";
import type { Person } from "./people";

/**
 * The facts on a person's record (the website's person page and the app's
 * GET /admin/people/:key), in India time. Pure.
 */
export const personWhen = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export function personFacts(p: Person, paymentReady: boolean): { label: string; value: string }[] {
  const rows: [string, string][] = [
    ["Email", p.email],
    ["Phone", p.phone ?? "Not set"],
    ["Source", sourceOf(p)],
    ["Enquired", p.enquiredAt ? personWhen(p.enquiredAt) : "No enquiry"],
    ["Paid", p.paidAt ? `${personWhen(p.paidAt)}${p.paidAmount != null ? ` · ₹${p.paidAmount.toLocaleString("en-IN")}` : ""}` : paymentReady ? "Not yet" : "Not recorded yet"],
    ...(p.cohorts.length ? ([["Cohort", p.cohorts.map((c) => c.name).join(", ")]] as [string, string][]) : []),
    ...(p.college ? ([["College", p.college]] as [string, string][]) : []),
    ["Emails sent", `${p.emailsSent}${p.opened ? " · opened" : ""}${p.replied ? " · replied" : ""}`],
    ...(p.isStudent
      ? ([
          ["Login", p.setupDone ? "Set up" : p.inviteSentAt ? "Link sent, not set up" : "Not sent yet"],
          ["Signed in", p.signedIn ? "Yes" : "No"],
        ] as [string, string][])
      : []),
  ];
  return rows.map(([label, value]) => ({ label, value }));
}
