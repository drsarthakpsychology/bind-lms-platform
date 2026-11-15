import { router } from "expo-router";
import * as React from "react";

import { useMe } from "@/api/queries";
import { TopBar } from "@/ds";

/** The bar on every tab screen: the VIBHA mark, search, and the bell with an unread dot. */
export function TabTop({ sub }: { sub?: string }) {
  const me = useMe();
  return <TopBar sub={sub} unread={me.data?.unreadNotifications ?? 0} onSearch={() => router.push("/search")} onBell={() => router.push("/notifications")} />;
}
