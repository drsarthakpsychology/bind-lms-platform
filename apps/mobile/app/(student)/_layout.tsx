import { BookOpen, House, NotebookText, Target, User } from "lucide-react-native";

import { MomentHost } from "@/moments/host";
import { TabBar } from "@/nav/tabs";

/**
 * Students: Today, Learn, Practise, Notes, Me. The route names stay `home` and
 * `library`, so every old link and deep link still opens the right tab.
 */
export default function StudentTabs() {
  return (
    <>
    <TabBar
      tabs={[
        { name: "home", area: "home", title: "Today", icon: House },
        { name: "learn", area: "learn", title: "Learn", icon: BookOpen },
        { name: "practise", area: "practise", title: "Practise", icon: Target },
        { name: "library", area: "library", title: "Notes", icon: NotebookText },
        { name: "me", area: "me", title: "Me", icon: User },
      ]}
    />
    <MomentHost />
    </>
  );
}
