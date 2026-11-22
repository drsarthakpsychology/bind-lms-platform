import { Redirect } from "expo-router";

/** Learning insights now live in the Learning tab, Whole class view. Old links land there. */
export default function InsightsRedirect() {
  return <Redirect href="/admin/teaching?view=class" />;
}
