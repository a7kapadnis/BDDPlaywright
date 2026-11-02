import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

// The runner starts the Cucumber CLI and adds TypeScript loading, hooks, and
// reporting options. Playwright remains the browser library; Cucumber runs tests.
const projectDirectory = path.resolve(__dirname, "..");
const reportsDirectory = path.join(projectDirectory, "reports");
fs.mkdirSync(reportsDirectory, { recursive: true });

const cucumberEntrypoint = path.join(
  projectDirectory,
  "node_modules",
  "@cucumber",
  "cucumber",
  "bin",
  "cucumber.js"
);
const forwardedArguments = process.argv.slice(2);
const argumentsIncludeFeature = forwardedArguments.some((argument) =>
  argument.endsWith(".feature")
);

const cucumberArguments = [
  cucumberEntrypoint,
  ...(argumentsIncludeFeature ? [] : ["features/**/*.feature"]),
  "--require-module",
  "ts-node/register",
  "--require",
  "hooks/hooks.ts",
  "--require",
  "step-definitions/*.ts",
  "--format",
  "progress",
  "--format",
  "html:reports/cucumber-report.html",
  ...forwardedArguments
];

const result = spawnSync(process.execPath, cucumberArguments, {
  cwd: projectDirectory,
  env: { ...process.env, TS_NODE_PROJECT: path.join(projectDirectory, "tsconfig.json") },
  stdio: "inherit"
});

if (result.error) {
  throw result.error;
}
process.exit(result.status ?? 1);
