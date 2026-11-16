import { useLocalSearchParams } from "expo-router";

import { PractiseGroup } from "@/practise/hub";

export default function PractiseGroupRoute() {
  const { group = "cases" } = useLocalSearchParams<{ group: string }>();
  return <PractiseGroup group={String(group)} />;
}
