import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "tests/**/*.test.ts"],
    // jest-dom matchers (toBeInTheDocument, …) for component tests. Component
    // tests opt into a DOM with a `// @vitest-environment jsdom` docblock.
    setupFiles: ["vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
});
