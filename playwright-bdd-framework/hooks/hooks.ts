import fs from "fs";
import path from "path";
import {
  After,
  Before,
  IWorldOptions,
  Status,
  setWorldConstructor,
  setDefaultTimeout,
  World
} from "@cucumber/cucumber";
import { Browser, BrowserContext, chromium, firefox, Page, webkit } from "playwright";
import { config } from "../config/config";

const browserLaunchers = {
  chromium: (headless: boolean) => chromium.launch({ headless }),
  firefox: (headless: boolean) => firefox.launch({ headless }),
  webkit: (headless: boolean) => webkit.launch({ headless })
};

export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
setDefaultTimeout(config.timeout);

// Before runs before every scenario and initializes all Playwright resources.
Before({ timeout: config.timeout }, async function (this: CustomWorld) {
  this.browser = await browserLaunchers[config.browserType](config.headless);
  this.context = await this.browser.newContext({ baseURL: config.baseUrl });
  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(config.timeout);
});

// After always closes resources and captures a screenshot for failed scenarios.
After({ timeout: config.timeout }, async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED && this.page && !this.page.isClosed()) {
    const screenshotsDirectory = path.resolve(process.cwd(), "screenshots");
    fs.mkdirSync(screenshotsDirectory, { recursive: true });
    const safeScenarioName = scenario.pickle.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const screenshotPath = path.join(screenshotsDirectory, `${safeScenarioName}-${Date.now()}.png`);

    try {
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      const screenshot = fs.readFileSync(screenshotPath);
      this.attach(screenshot, "image/png");
      if (scenario.result.exception) {
        this.attach(String(scenario.result.exception), "text/plain");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.attach(`Screenshot capture failed: ${message}`, "text/plain");
    }
  }

  await this.context?.close().catch(() => undefined);
  await this.browser?.close().catch(() => undefined);
});
