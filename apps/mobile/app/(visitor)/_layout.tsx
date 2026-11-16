import { Home, LogIn, Mail } from "lucide-react-native";

import { TabBar } from "@/nav/tabs";

/** Visitors see three things only: Welcome, Request an invitation, Sign in. */
export default function VisitorTabs() {
  return (
    <TabBar
      tabs={[
        { name: "welcome", title: "Welcome", icon: Home },
        { name: "request", title: "Request", icon: Mail },
        { name: "sign-in", title: "Sign in", icon: LogIn },
      ]}
    />
  );
}
