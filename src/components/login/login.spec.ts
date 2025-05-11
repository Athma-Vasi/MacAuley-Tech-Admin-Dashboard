import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
});

test.describe("Login", async () => {
    const validLogin = {
        username: "manager",
        password: "passwordQ1!",
    };
    const invalidLogin = {
        username: "0manager",
        password: "invalidPassword",
    };

    test("should allow login with valid credentials", async ({ page }) => {
        const usernameInput = page.getByLabel("username");
        await usernameInput.fill(validLogin.username);
        const passwordInput = page.getByLabel("password");
        await passwordInput.fill(validLogin.password);
        const loginButton = page.getByLabel("login");
        await loginButton.click();
        await page.waitForURL("http://localhost:5173/dashboard/financials");
        const logoutButton = page.getByLabel("logout");
        await expect(logoutButton).toBeVisible();
        await logoutButton.click();
        await page.waitForURL("http://localhost:5173/");
        await expect(usernameInput).toBeVisible();
        await expect(passwordInput).toBeVisible();
        await expect(loginButton).toBeVisible();
    });

    test("should take to register page when link is clicked", async ({ page }) => {
        const registerLink = page.getByTestId("register-link");
        await registerLink.click();
        await page.waitForURL("http://localhost:5173/register");
        const registerTitle = page.getByText("Register");
        await expect(registerTitle).toBeVisible();
    });

    // test("should show error message with invalid credentials", async ({ page }) => {
    //     const usernameInput = page.getByLabel("username");
    //     await usernameInput.fill(invalidLogin.username);
    //     const passwordInput = page.getByLabel("password");
    //     await passwordInput.fill(invalidLogin.password);
    //     const loginButton = page.getByLabel("login");
    //     await loginButton.click();
    //     await page.waitForTimeout(2000); // Wait for the error message to appear
    //     const errorMessage = page.getByTestId("login-error-message");
    //     console.log("errorMessage", errorMessage);
    //     await expect(errorMessage).toBeVisible();
    // });
});
