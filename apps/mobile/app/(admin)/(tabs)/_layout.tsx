import { BookOpenCheck, Ellipsis, House, Stethoscope, Users } from "lucide-react-native";

import { TabBar } from "@/nav/tabs";

/** Admins: Home, People, Clinic, Teaching, More. The day's work first, then who, where, what is taught, and the controls. */
export default function AdminTabs() {
  return (
    <TabBar
      tabs={[
        { name: "admin/home", title: "Home", icon: House },
        { name: "admin/students", title: "People", icon: Users },
        { name: "admin/clinic/index", title: "Clinic", icon: Stethoscope },
        { name: "admin/teaching/index", title: "Teaching", icon: BookOpenCheck },
        { name: "admin/more", title: "More", icon: Ellipsis },
      ]}
    />
  );
}
