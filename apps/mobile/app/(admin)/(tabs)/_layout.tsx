import { Activity, Ellipsis, House, MessagesSquare, Users } from "lucide-react-native";

import { TabBar } from "@/nav/tabs";

/** Admins: Home, Students, Activity, Messages, More. */
export default function AdminTabs() {
  return (
    <TabBar
      tabs={[
        { name: "admin/home", title: "Home", icon: House },
        { name: "admin/students", title: "Students", icon: Users },
        { name: "admin/activity", title: "Activity", icon: Activity },
        { name: "admin/messages", title: "Messages", icon: MessagesSquare },
        { name: "admin/more", title: "More", icon: Ellipsis },
      ]}
    />
  );
}
