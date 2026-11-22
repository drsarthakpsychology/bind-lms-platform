import { Redirect, useLocalSearchParams } from "expo-router";

import { designPages } from "@/lib/shown";
import { KitScreen } from "@/screens/kit";

/** The design gallery: only in the sample-data browser build and in development, never in a release build. */
export default function Kit() {
  const { state } = useLocalSearchParams<{ state?: string }>();
  if (!designPages) return <Redirect href="/" />;
  return <KitScreen start={typeof state === "string" ? state : undefined} />;
}
