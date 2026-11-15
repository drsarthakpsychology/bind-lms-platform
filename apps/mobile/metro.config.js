const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

/** The app is self-contained: never resolve packages from the website's node_modules two folders up. */
const config = getDefaultConfig(__dirname);
config.resolver.nodeModulesPaths = [path.resolve(__dirname, "node_modules")];
config.resolver.disableHierarchicalLookup = true;
module.exports = config;
