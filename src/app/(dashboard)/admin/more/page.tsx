import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminMoreScreen } from "./more-screen";

export const metadata: Metadata = { title: "More" };

/**
 * Admin More (new design): the fifth phone tab. Every admin place that is not
 * on the four tabs, as grouped rows like the student Me screen, then display
 * and account. Replaces the old More drawer.
 */
export default async function AdminMorePage() {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  return <AdminMoreScreen email={me.email ?? null} viewOnly={me.role === "view_admin"} />;
}
