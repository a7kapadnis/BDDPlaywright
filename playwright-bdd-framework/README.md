# Playwright BDD Framework

A beginner-friendly SauceDemo automation framework using Playwright, TypeScript, and Cucumber. Cucumber is the BDD test runner; Playwright provides browser automation.

## Project architecture

```text
playwright-bdd-framework/
├── features/login.feature       # Gherkin behavior and tags
├── step-definitions/            # Maps Gherkin steps to page-object calls
├── pages/LoginPage.ts           # SauceDemo selectors and interactions
├── hooks/hooks.ts               # Browser lifecycle and failure screenshots
├── config/config.ts             # Environment and runtime configuration
├── test-runner/runner.ts        # Starts Cucumber through its CLI
├── utils/                       # Shared future utilities
├── reports/                     # Generated HTML/JSON reports
├── screenshots/                 # Failure screenshots
├── playwright.config.ts         # Playwright defaults for reference
├── tsconfig.json                # TypeScript settings
├── package.json                 # Dependencies and test scripts
└── README.md                    # Setup and execution documentation
```

### Key concepts

- **Feature file:** describes user behavior in plain-language Gherkin.
- **Step definition:** connects each Gherkin step to TypeScript code.
- **Page Object Model:** keeps locators and page operations inside a reusable class.
- **Hooks:** run setup and cleanup around every scenario; a browser, context, and page are created and closed through the shared Cucumber world.
- **Browser:** launches Chrome, Firefox, or WebKit.
- **BrowserContext:** an isolated browser session, similar to a new incognito profile.
- **Page:** the Playwright object used to navigate and interact with a web page.
- **Report:** contains feature/scenario/step status, duration, failures, and attached PNG screenshots.

## Installation

```powershell
cd playwright-bdd-framework
npm install
npx playwright install
```

On Linux or CI, install system dependencies if prompted:

```powershell
npx playwright install --with-deps
```

## Environment configuration

The framework uses `config/.env.qa` by default. Choose another environment with `TEST_ENV=uat`.

PowerShell:

```powershell
$env:TEST_ENV="uat"
npm run test:bdd
```

Settings include:

```env
BASE_URL=https://www.saucedemo.com/
USERNAME=standard_user
PASSWORD=secret_sauce
BROWSER=chromium
HEADLESS=true
TIMEOUT=30000
```

SauceDemo credentials are intentionally stored in environment files rather than duplicated in page code.

## Running tests

All features:

```powershell
npm run test:bdd
```

One feature:

```powershell
npx ts-node test-runner/runner.ts features/login.feature
```

One or more scenarios by tag:

```powershell
npx ts-node test-runner/runner.ts --tags "@smoke"
npx ts-node test-runner/runner.ts --tags "@regression"
```

Specific scenario text can also be selected with Cucumber's name filter:

```powershell
npx ts-node test-runner/runner.ts features/login.feature --name "Successful login"
```

Headed mode:

```powershell
npm run test:bdd:headed
```

Alternatively:

```powershell
$env:HEADLESS="false"
npm run test:bdd
```

Choose another browser:

```powershell
$env:BROWSER="firefox"
npm run test:bdd
```

## HTML report

Generate an HTML report and JSON output:

```powershell
npm run test:bdd:html
```

Open `reports/cucumber-report.html`. A failure screenshot is saved under `screenshots/` and attached to the failed scenario in Cucumber's HTML report.

## How failure screenshots work

The `After` hook checks the scenario result. When the scenario fails, Playwright captures the full page, saves it in `screenshots/`, and attaches the PNG as binary data and any exception as text. Attached screenshots are included by Cucumber's HTML formatter.

## End-to-end execution flow

```text
Feature File
     ↓
Cucumber
     ↓
Step Definition
     ↓
Page Object
     ↓
Playwright
     ↓
Browser
     ↓
Application
     ↓
Cucumber Report
```
