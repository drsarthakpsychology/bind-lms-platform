// Vitest global setup. jest-dom matchers extend `expect` (they fail gracefully
// in the node environment, and component tests opt into jsdom per-file with a
// `// @vitest-environment jsdom` docblock — see the Button test).
import "@testing-library/jest-dom/vitest";
