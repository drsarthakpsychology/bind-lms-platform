// Vitest global setup. jest-dom matchers extend `expect` (they fail gracefully
// in the node environment, and component tests opt into jsdom per-file with a
// `// @vitest-environment jsdom` docblock — see the Button test).
import "@testing-library/jest-dom/vitest";

// vitest runs without `globals: true`, so @testing-library/react's automatic
// afterEach cleanup (which depends on a global `afterEach`) never fires. Without
// it, every render in a multi-test jsdom file leaks into the next test and
// `screen.getByRole` finds stale duplicates. Import the hook explicitly.
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});
