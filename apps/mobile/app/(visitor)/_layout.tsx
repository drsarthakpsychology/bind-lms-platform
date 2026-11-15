import { Home, LogIn, Mail, Wind } from "lucide-react-native";

import { TabBar } from "@/nav/tabs";

/** Visitors: Welcome, Request an invitation, Free tools, Sign in. */
export default function VisitorTabs() {
  return (
    <TabBar
      tabs={[
        { name: "welcome", title: "Welcome", icon: Home },
        { name: "request", title: "Request", icon: Mail },
        { name: "tools", title: "Free tools", icon: Wind },
        { name: "sign-in", title: "Sign in", icon: LogIn },
      ]}
    />
  );
}
