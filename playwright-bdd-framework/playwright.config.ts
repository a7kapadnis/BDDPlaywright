import { defineConfig } from "@playwright/test";
import { config } from "./config/config";

// This configuration documents Playwright browser defaults. Cucumber's hooks
// launch the browser, so the Playwright Test runner is not used for these tests.
export default defineConfig({
  timeout: config.timeout,
  use: {
    baseURL: config.baseUrl,
    headless: config.headless
  }
});
