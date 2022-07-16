// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// eslint-disable-next-line import/no-extraneous-dependencies,@typescript-eslint/no-var-requires
const { getDefaultConfig } = require("@expo/metro-config");

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const defaultConfig = getDefaultConfig(__dirname);

// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
defaultConfig.resolver.assetExts.push("cjs");

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
module.exports = defaultConfig;
