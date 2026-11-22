import { BookOpenCheck, Ellipsis, House, Stethoscope, Users } from "lucide-react-native";

import { TabBar } from "@/nav/tabs";

/** Admins: Home, People, Clinic, Learning, More. The day's work first, then who, where, how students are studying, and the controls. */
export default function AdminTabs() {
  return (
    <TabBar
      tabs={[
        { name: "admin/home", title: "Home", icon: House },
        { name: "admin/students", title: "People", icon: Users },
        { name: "admin/clinic/index", title: "Clinic", icon: Stethoscope },
        { name: "admin/teaching/index", title: "Learning", icon: BookOpenCheck },
        { name: "admin/more", title: "More", icon: Ellipsis },
      ]}
    />
  );
}
