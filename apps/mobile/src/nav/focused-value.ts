import { useIsFocused } from "expo-router";
import * as React from "react";

/**
 * The value as it was while this screen was last in front. A screen under
 * another one keeps showing the old value, so a progress line fills in view
 * when the student comes back, not out of sight behind the lecture.
 */
export function useFocusedValue<T>(value: T): T {
  const focused = useIsFocused();
  const [shown, setShown] = React.useState(value);
  if (focused && !Object.is(shown, value)) setShown(value);
  return focused ? value : shown;
}
