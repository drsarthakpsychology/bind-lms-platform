import { BookOpen, House, LibraryBig, Target, User } from "lucide-react-native";
import * as React from "react";

import { useMe } from "@/api/queries";
import { MomentHost } from "@/moments/host";
import { hasStudy, loadStudySide } from "@/nav/study";
import { TabBar } from "@/nav/tabs";

/**
 * Students: Today, Learn, Study, Practise, Me. The route names stay `home` and
 * `library`, so every old link and deep link (the old Notes tab) still opens
 * the right tab. Study hides for accounts without modules.
 */
export default function StudentTabs() {
  const me = useMe();
  const study = hasStudy(me.data);
  // The side of Study used last is read now, so the tab opens on it with no flicker.
  React.useEffect(() => void loadStudySide(), []);
  return (
    <>
    <TabBar
      tabs={[
        { name: "home", area: "home", title: "Today", icon: House },
        { name: "learn", area: "learn", title: "Learn", icon: BookOpen },
        { name: "library", area: "library", title: "Study", icon: LibraryBig, hidden: !study },
        { name: "practise", area: "practise", title: "Practise", icon: Target },
        { name: "me", area: "me", title: "Me", icon: User },
      ]}
    />
    <MomentHost />
    </>
  );
}
