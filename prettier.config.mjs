/**
 * Prettier — formatting + Tailwind v4 class ordering.
 *
 * prettier-plugin-tailwindcss sorts utility classes into the canonical order
 * (works with the CSS-first @theme config in globals.css). Import the tailwind
 * classes first so the class-sorting plugin applies to the outermost layer.
 */
const prettierConfig = {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/app/globals.css",
  printWidth: 100,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
};

export default prettierConfig;
