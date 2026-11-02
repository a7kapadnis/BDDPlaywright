import { Given, When, Then } from "@cucumber/cucumber";
import { CustomWorld } from "../hooks/hooks";
import { LoginPage } from "../pages/LoginPage";

function getLoginPage(world: CustomWorld): LoginPage {
  if (!world.page) {
    throw new Error("Playwright Page was not created by the Before hook.");
  }
  return new LoginPage(world.page);
}

Given("I navigate to the login page", async function (this: CustomWorld) {
  await getLoginPage(this).navigateToLoginPage();
});

When("I enter valid username and password", async function (this: CustomWorld) {
  await getLoginPage(this).enterValidCredentials();
});

When("I enter invalid username and password", async function (this: CustomWorld) {
  await getLoginPage(this).enterInvalidCredentials();
});

When("I click the login button", async function (this: CustomWorld) {
  await getLoginPage(this).clickLogin();
});

Then("I should be successfully logged in", async function (this: CustomWorld) {
  await getLoginPage(this).verifySuccessfulLogin();
});

Then("I should see an invalid credentials error", async function (this: CustomWorld) {
  await getLoginPage(this).verifyInvalidCredentialsError();
});
