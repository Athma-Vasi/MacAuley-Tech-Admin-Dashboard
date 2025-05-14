import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/login");
    const usernameInput = page.getByTestId("username-textInput");
    await expect(usernameInput).toBeVisible();
    const passwordInput = page.getByTestId("password-textInput");
    await expect(passwordInput).toBeVisible();
    const loginButton = page.getByTestId("login-button");
    await expect(loginButton).toBeVisible();
    await usernameInput.fill("manager");
    await passwordInput.fill("passwordQ1!");
    await loginButton.click();
    await page.waitForURL("http://localhost:5173/dashboard/financials");
});

test.afterEach(async ({ page }) => {
    const logoutButton = page.getByTestId("logout-button");
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();
    await page.waitForURL("http://localhost:5173/");
    const usernameInput = page.getByTestId("username-textInput");
    expect(await usernameInput.isVisible());
    const passwordInput = page.getByTestId("password-textInput");
    expect(await passwordInput.isVisible());
    const loginButton = page.getByTestId("login-button");
    expect(await loginButton.isVisible());
});

test.describe("Sidebar", () => {
    test.describe("Metrics Navlinks", () => {
        test("metrics navlinks should be visible", async ({ page }) => {
            const productsNavlink = page.getByTestId("products-navlink");
            expect(await productsNavlink.isVisible());
            const financialsNavlink = page.getByTestId("financials-navlink");
            expect(await financialsNavlink.isVisible());
            const customersNavlink = page.getByTestId("customers-navlink");
            expect(await customersNavlink.isVisible());
            const repairsNavlink = page.getByTestId("repairs-navlink");
            expect(await repairsNavlink.isVisible());
        });

        test("directory navlinks should be visible", async ({ page }) => {
            const directoryNavlink = page.getByTestId("directory-navlink");
            expect(await directoryNavlink.isVisible());
            const usersNavlink = page.getByTestId("users-navlink");
            expect(await usersNavlink.isVisible());
        });

        test("should take to financials dashboard when navlink is clicked", async ({ page }) => {
            const financialsNavlink = page.getByTestId("financials-navlink");
            await expect(financialsNavlink).toBeVisible();
            await financialsNavlink.click();
            await page.waitForURL("http://localhost:5173/dashboard/financials");
            const sectionTitle = page.getByTestId("dashboard-Daily-Financials");
            expect(await sectionTitle.isVisible());
        });

        test("should take to products dashboard when navlink is clicked", async ({ page }) => {
            const productsNavlink = page.getByTestId("products-navlink");
            await expect(productsNavlink).toBeVisible();
            await productsNavlink.click();
            await page.waitForURL("http://localhost:5173/dashboard/products");
            const sectionTitle = page.getByTestId("dashboard-Daily-Products");
            expect(await sectionTitle.isVisible());
        });

        test("should take to customers dashboard when navlink is clicked", async ({ page }) => {
            const customersNavlink = page.getByTestId("customers-navlink");
            await expect(customersNavlink).toBeVisible();
            await customersNavlink.click();
            await page.waitForURL("http://localhost:5173/dashboard/customers");
            const sectionTitle = page.getByTestId("dashboard-Daily-Customers");
            expect(await sectionTitle.isVisible());
        });

        test("should take to repairs dashboard when navlink is clicked", async ({ page }) => {
            const repairsNavlink = page.getByTestId("repairs-navlink");
            await expect(repairsNavlink).toBeVisible();
            await repairsNavlink.click();
            await page.waitForURL("http://localhost:5173/dashboard/repairs");
            const sectionTitle = page.getByTestId("dashboard-Daily-Repairs");
            expect(await sectionTitle.isVisible());
        });
    });

    test.describe("Directory Navlinks", () => {
        test("directory navlinks should be visible", async ({ page }) => {
            const directoryNavlink = page.getByTestId("directory-navlink");
            expect(await directoryNavlink.isVisible());
            const usersNavlink = page.getByTestId("users-navlink");
            expect(await usersNavlink.isVisible());
        });

        test("should take to directory when navlink is clicked", async ({ page }) => {
            const directoryNavlink = page.getByTestId("directory-navlink");
            await expect(directoryNavlink).toBeVisible();
            await directoryNavlink.click();
            await page.waitForURL("http://localhost:5173/dashboard/directory");
            const sectionTitle = page.getByTestId("directory-title");
            expect(await sectionTitle.isVisible());
        });

        test("should take to users when navlink is clicked", async ({ page }) => {
            const usersNavlink = page.getByTestId("users-navlink");
            await expect(usersNavlink).toBeVisible();
            await usersNavlink.click();
            await page.waitForURL("http://localhost:5173/dashboard/users");
            const sectionTitle = page.getByTestId("users-title");
            expect(await sectionTitle.isVisible());
        });
    });
});
