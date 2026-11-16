import { BookOpen, Dumbbell, House, Pill, User } from "lucide-react-native";

import { MomentHost } from "@/moments/host";
import { TabBar } from "@/nav/tabs";

/** Students: Home, Learn, Practise, Medicines, Me. */
export default function StudentTabs() {
  return (
    <>
    <TabBar
      tabs={[
        { name: "home", area: "home", title: "Home", icon: House },
        { name: "learn", area: "learn", title: "Learn", icon: BookOpen },
        { name: "practise", area: "practise", title: "Practise", icon: Dumbbell },
        { name: "library", area: "library", title: "Medicines", icon: Pill },
        { name: "me", area: "me", title: "Me", icon: User },
      ]}
    />
    <MomentHost />
    </>
  );
}
