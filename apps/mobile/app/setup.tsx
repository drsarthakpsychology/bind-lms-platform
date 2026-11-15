import { useLocalSearchParams } from "expo-router";

import { SetupScreen } from "@/screens/auth/setup";

/** The setup link from the welcome email: https://vibhapsychology.com/setup?token=... */
export default function Setup() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  return <SetupScreen token={typeof token === "string" ? token : ""} />;
}
