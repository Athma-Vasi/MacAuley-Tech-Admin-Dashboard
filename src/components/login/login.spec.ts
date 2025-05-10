import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
});

test.describe("Login Page", () => {
    // test("should display an error message for invalid credentials", async ({ page }) => {
    //     await page.goto("/login");
    //     await page.focus('input[name="username"]');
    //     await page.fill('input[name="username"]', "invalidUser");
    //     const errorMessage = page.locator(".username-invalid");
    //     await expect(errorMessage).toBeVisible();
    // });
    test("should allow entering valid username and password", async ({ page }) => {
        await page.goto("/login");
        await page.focus('input[name="username"]');
        await page.fill('input[name="username"]', "manager");
        await page.focus('input[name="password"]');
        await page.fill('input[name="password"]', "passwordQ1!");
        const successMessage = page.locator(".username-valid");
        await expect(successMessage).toBeVisible();
    });
});
