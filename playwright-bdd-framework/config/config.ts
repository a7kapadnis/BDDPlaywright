import dotenv from "dotenv";
import path from "path";

export type BrowserType = "chromium" | "firefox" | "webkit";

const environment = (process.env.TEST_ENV ?? "qa").toLowerCase();
const environmentFile = path.resolve(__dirname, `.env.${environment}`);
dotenv.config({ path: environmentFile, override: true });

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Create config/.env.${environment} and set ${name}.`
    );
  }
  return value;
}

function getBrowserType(): BrowserType {
  const value = (process.env.BROWSER ?? "chromium").toLowerCase();
  if (value === "chromium" || value === "firefox" || value === "webkit") {
    return value;
  }
  throw new Error(`Unsupported BROWSER value "${value}". Use chromium, firefox, or webkit.`);
}

export const config = {
  environment,
  baseUrl: getRequiredEnvironmentVariable("BASE_URL"),
  validUsername: getRequiredEnvironmentVariable("USERNAME"),
  validPassword: getRequiredEnvironmentVariable("PASSWORD"),
  invalidUsername: process.env.INVALID_USERNAME ?? "invalid_user",
  invalidPassword: process.env.INVALID_PASSWORD ?? "invalid_password",
  browserType: getBrowserType(),
  headless: (process.env.HEADLESS ?? "true").toLowerCase() !== "false",
  timeout: Number.parseInt(process.env.TIMEOUT ?? "30000", 10)
} as const;
