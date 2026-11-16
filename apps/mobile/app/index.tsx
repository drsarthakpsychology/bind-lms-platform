import { Redirect } from "expo-router";

import { useSession } from "@/auth";
import { homeHref } from "@/nav/targets";

/** The front door: visitors go to Welcome, everyone else to their Home tab. */
export default function Index() {
  const phase = useSession((s) => s.phase);
  const me = useSession((s) => s.me);
  if (phase === "loading") return null;
  if (phase === "visitor") return <Redirect href="/welcome" />;
  return <Redirect href={homeHref(me)} />;
}
