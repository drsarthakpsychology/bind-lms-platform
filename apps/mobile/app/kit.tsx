import { useLocalSearchParams } from "expo-router";

import { KitScreen } from "@/screens/kit";

export default function Kit() {
  const { state } = useLocalSearchParams<{ state?: string }>();
  return <KitScreen start={typeof state === "string" ? state : undefined} />;
}
