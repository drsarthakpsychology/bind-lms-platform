import { Redirect } from "expo-router";

import { STUDY_MODULES } from "@/nav/study";

/** The old Modules page now lives on the Study tab (Modules side). Old links land there. */
export default function StudyRedirect() {
  return <Redirect href={STUDY_MODULES} />;
}
