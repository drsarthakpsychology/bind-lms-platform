import { appUrl } from "@/lib/app-url";

/** The public address of a form. */
export const formUrl = (slug: string) => `${appUrl()}/f/${slug}`;

/** "16 Oct 2026" in India time. */
export const dayIst = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric" });
