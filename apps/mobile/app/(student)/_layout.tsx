import { BookOpen, Dumbbell, House, Pill, User } from "lucide-react-native";

import { TabBar } from "@/nav/tabs";

/** Students: Home, Learn, Practise, Medicines, Me. */
export default function StudentTabs() {
  return (
    <TabBar
      tabs={[
        { name: "home", title: "Home", icon: House },
        { name: "learn", title: "Learn", icon: BookOpen },
        { name: "practise", title: "Practise", icon: Dumbbell },
        { name: "library", title: "Medicines", icon: Pill },
        { name: "me", title: "Me", icon: User },
      ]}
    />
  );
}
