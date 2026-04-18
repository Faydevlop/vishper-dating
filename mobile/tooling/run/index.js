#!/usr/bin/env node

const { spawnSync } = require("child_process");

const args = process.argv.slice(2);
const first = args[0];

const printHelp = () => {
  console.log("Usage: npx run <android|ios> [args]");
  console.log("Examples:");
  console.log("  npx run android --device");
  console.log("  npx run android --device Pixel_8");
  console.log("  npx run ios --device");
};

if (!first || first === "--help" || first === "-h") {
  printHelp();
  process.exit(0);
}

if (first !== "android" && first !== "ios") {
  console.error(`Unknown target: ${first}`);
  printHelp();
  process.exit(1);
}

const expoArgs = ["expo", `run:${first}`, ...args.slice(1)];
const result = spawnSync("npx", expoArgs, {
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
