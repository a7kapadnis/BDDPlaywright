import { Locator, Page } from "playwright";
import { config } from "../config/config";

// A Page Object keeps locators and UI interactions in one reusable class.
export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly inventoryContainer: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async navigateToLoginPage(): Promise<void> {
    await this.page.goto(config.baseUrl, { waitUntil: "domcontentloaded", timeout: config.timeout });
    await this.usernameInput.waitFor({ state: "visible", timeout: config.timeout });
  }

  async enterUsername(username = config.validUsername): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password = config.validPassword): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async enterValidCredentials(): Promise<void> {
    await this.enterUsername();
    await this.enterPassword();
  }

  async enterInvalidCredentials(): Promise<void> {
    await this.enterUsername(config.invalidUsername);
    await this.enterPassword(config.invalidPassword);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async verifySuccessfulLogin(): Promise<void> {
    await this.inventoryContainer.waitFor({ state: "visible", timeout: config.timeout });
    await this.page.waitForURL("**/inventory.html", { timeout: config.timeout });
  }

  async verifyInvalidCredentialsError(): Promise<void> {
    await this.errorMessage.waitFor({ state: "visible", timeout: config.timeout });
    const message = await this.errorMessage.textContent();
    if (!message?.includes("Username and password do not match")) {
      throw new Error(`Unexpected login error message: ${message ?? "<empty>"}`);
    }
  }
}
