const { defineConfig } = require("eslint/config");
const expo = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expo,
  { ignores: ["dist/*", "android/*", "ios/*", ".expo/*", "coverage/*"] },
  { rules: { "react/no-unescaped-entities": "off" } },
]);
