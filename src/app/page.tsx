import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LandingPage } from "@/components/landing/landing-page";

export default async function Home() {
  const session = await getSession();
  // Returning students never see the marketing page. Everyone else gets the
  // public front door. Auth guards live in the route-group layouts, not here,
  // so this redirect change structurally cannot weaken protection.
  if (session.status === "ok") redirect("/dashboard");
  return <LandingPage />;
}
