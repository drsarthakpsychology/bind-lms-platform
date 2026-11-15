import * as React from "react";
import { useColorScheme } from "react-native";

import { settingsStore } from "@/lib/settings";
import { dark, light, type Palette } from "./tokens";

export * from "./tokens";

const ThemeContext = React.createContext<Palette>(light);

/** Follows the phone's light or dark setting unless the student chose one in Settings. */
export function ThemeProvider({ children, force }: { children: React.ReactNode; force?: "light" | "dark" }) {
  const system = useColorScheme();
  const choice = settingsStore.use((s) => s.theme);
  const mode = force ?? (choice === "system" ? (system === "dark" ? "dark" : "light") : choice);
  return <ThemeContext.Provider value={mode === "dark" ? dark : light}>{children}</ThemeContext.Provider>;
}

/** The current colours. */
export function useTheme(): Palette {
  return React.useContext(ThemeContext);
}
