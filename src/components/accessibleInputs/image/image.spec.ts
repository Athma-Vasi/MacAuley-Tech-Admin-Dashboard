import test, { expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/register");
    const nextStepButton = page.getByTestId("next-step-button");
    await expect(nextStepButton).toBeVisible();
    await nextStepButton.click();
    await nextStepButton.click();
    await nextStepButton.click();
});

test.describe("Image Input", () => {
    test("should select valid image and display it", async ({ page }) => {
        const fileInput = page.locator('input[type="file"][name="image"]');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const filePath = path.resolve(
            __dirname,
            "macauley-tech-logo.png",
        );
        await fileInput.setInputFiles(filePath);
        const imagePreview = page.getByTestId("image-preview");
        await expect(imagePreview).toBeVisible();
        const imageName = page.getByTestId("image-name");
        await expect(imageName).toBeVisible();
        await expect(imageName).toHaveText("macauley-tech-logo.png");
        const imageValid = page.getByTestId("image-valid-text");
        await expect(imageValid).toBeVisible();
        await expect(imageValid).toHaveText("Image is valid");
        const removeButton = page.getByTestId("remove-image-button");
        await expect(removeButton).toBeVisible();
        await removeButton.click();
    });

    test("should select invalid image and display error", async ({ page }) => {
        const fileInput = page.locator('input[type="file"][name="image"]');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const filePath = path.resolve(
            __dirname,
            "macauley-tech-logo.txt",
        );
        await fileInput.setInputFiles(filePath);
        const imagePreview = page.getByTestId("image-preview");
        await expect(imagePreview).toBeVisible();
        const imageName = page.getByTestId("image-name");
        await expect(imageName).toBeVisible();
        await expect(imageName).toHaveText("macauley-tech-logo.txt");
        const imageInvalid = page.getByTestId("image-invalid-text");
        await expect(imageInvalid).toBeVisible();
        const removeButton = page.getByTestId("remove-image-button");
        await expect(removeButton).toBeVisible();
        await removeButton.click();
    });

    test("should remove image", async ({ page }) => {
        const fileInput = page.locator('input[type="file"][name="image"]');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const filePath = path.resolve(
            __dirname,
            "macauley-tech-logo.png",
        );
        await fileInput.setInputFiles(filePath);
        const removeButton = page.getByTestId("remove-image-button");
        await expect(removeButton).toBeVisible();
        await removeButton.click();
        const imagePreview = page.getByTestId("image-preview");
        await expect(imagePreview).not.toBeVisible();
        const imageName = page.getByTestId("image-name");
        await expect(imageName).not.toBeVisible();
        const imageValid = page.getByTestId("image-valid-text");
        await expect(imageValid).not.toBeVisible();
        const imageInvalid = page.getByTestId("image-invalid-text");
        await expect(imageInvalid).not.toBeVisible();
    });
});
