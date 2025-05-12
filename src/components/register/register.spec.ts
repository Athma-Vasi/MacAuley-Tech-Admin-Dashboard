import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/register");
});

test.describe("Register", async () => {
    test.describe("Authentication", async () => {
        test("should take user to login when link is clicked", async ({ page }) => {
            const loginLink = page.getByTestId("login-link");
            await loginLink.click();
            await page.waitForURL("http://localhost:5173/login");
            const registerLink = page.getByTestId("register-link");
            await expect(registerLink).toBeVisible();
        });

        test.describe("Username", async () => {
            test("should display checkmark if username is valid", async ({ page }) => {
                const usernameInput = page.getByLabel("username");
                await usernameInput.fill("manager0");
                const validIcon = page.getByTestId("username-input-valid-icon");
                await expect(validIcon).toBeVisible();
            });

            test("should display error dropdown if username is invalid", async ({ page }) => {
                const usernameInput = page.getByLabel("username");
                await usernameInput.fill("manager!");
                const errorMessage = page.getByTestId(
                    "username-input-invalid-text",
                );
                await expect(errorMessage).toBeVisible();
            });

            test("should display exists message if username already exists", async ({ page }) => {
                const usernameInput = page.getByLabel("username");
                await usernameInput.fill("manager");
                await page.keyboard.press("Tab");
                const existsMessage = page.getByTestId("username-exists-text");
                await expect(existsMessage).toBeVisible();
            });
        });

        test.describe("Email", async () => {
            test("should display checkmark if email is valid", async ({ page }) => {
                const emailInput = page.getByLabel("email");
                await emailInput.fill("manager0@example.com");
                const validIcon = page.getByTestId("email-input-valid-icon");
                await expect(validIcon).toBeVisible();
            });

            test("should display error dropdown if email is invalid", async ({ page }) => {
                const emailInput = page.getByLabel("email");
                await emailInput.fill("manager0example.com");
                const errorMessage = page.getByTestId(
                    "email-input-invalid-text",
                );
                await expect(errorMessage).toBeVisible();
            });

            test("should display exists message if email already exists", async ({ page }) => {
                const emailInput = page.getByLabel("email");
                await emailInput.fill("manager@example.com");
                await page.keyboard.press("Tab");
                const existsMessage = page.getByTestId("email-exists-text");
                await expect(existsMessage).toBeVisible();
            });
        });

        test.describe("Password", async () => {
            test("should display checkmark if password is valid", async ({ page }) => {
                const passwordInput = page.getByTestId("password-input");
                await passwordInput.fill("passwordQ1!");
                await passwordInput.focus();
                const validIcon = page.getByTestId("password-input-valid-icon");
                await expect(validIcon).toBeVisible();
            });

            test("should display error dropdown if password is invalid", async ({ page }) => {
                const passwordInput = page.getByTestId("password-input");
                await passwordInput.fill("password");
                await passwordInput.focus();
                const errorMessage = page.getByTestId(
                    "password-input-invalid-text",
                );
                await expect(errorMessage).toBeVisible();
            });

            test("should display error message if password is different from confirm password", async ({ page }) => {
                const confirmPasswordInput = page.getByTestId(
                    "confirmPassword-input",
                );
                await confirmPasswordInput.fill("passwordQ1!");
                const passwordInput = page.getByTestId("password-input");
                await passwordInput.fill("passwordQ2!");
                await passwordInput.focus();
                const errorMessage = page.getByTestId(
                    "password-input-invalid-text",
                );
                await expect(errorMessage).toBeVisible();
            });
        });

        test.describe("Confirm Password", async () => {
            test("should display checkmark if confirm password is valid", async ({ page }) => {
                const passwordInput = page.getByTestId("confirmPassword-input");
                await passwordInput.fill("passwordQ1!");
                const confirmPasswordInput = page.getByTestId(
                    "confirmPassword-input",
                );
                await confirmPasswordInput.fill("passwordQ1!");
                await confirmPasswordInput.focus();
                const validIcon = page.getByTestId(
                    "confirmPassword-input-valid-icon",
                );
                await expect(validIcon).toBeVisible();
            });

            test("should display error dropdown if confirm password is invalid", async ({ page }) => {
                const passwordInput = page.getByTestId("confirmPassword-input");
                await passwordInput.fill("passwordQ1!");
                const confirmPasswordInput = page.getByTestId(
                    "confirmPassword-input",
                );
                await confirmPasswordInput.fill("password");
                await confirmPasswordInput.focus();
                const errorMessage = page.getByTestId(
                    "confirmPassword-input-invalid-text",
                );
                await expect(errorMessage).toBeVisible();
            });

            test("should display error message if password is different from confirm password", async ({ page }) => {
                const passwordInput = page.getByTestId("password-input");
                await passwordInput.fill("passwordQ1!");
                const confirmPasswordInput = page.getByTestId(
                    "confirmPassword-input",
                );
                await confirmPasswordInput.fill("passwordQ2!");
                await confirmPasswordInput.focus();
                const errorMessage = page.getByTestId(
                    "confirmPassword-input-invalid-text",
                );
                await expect(errorMessage).toBeVisible();
            });
        });
    });

    test.describe("Personal", () => {
        test.beforeEach(async ({ page }) => {
            const nextStepButton = page.getByTestId("next-step-button");
            await nextStepButton.click();
        });

        test.describe("First Name", () => {
            test("should display checkmark if first name is valid", async ({ page }) => {
                const firstNameInput = page.getByTestId("firstName-textInput");
                await firstNameInput.fill("John");
                const validIcon = page.getByTestId(
                    "firstName-input-valid-icon",
                );
                await expect(validIcon).toBeVisible();
            });

            test("should display x if first name is invalid", async ({ page }) => {
                const firstNameInput = page.getByTestId("firstName-textInput");
                await firstNameInput.fill("John!");
                const invalidIcon = page.getByTestId(
                    "firstName-input-invalid-icon",
                );
                await expect(invalidIcon).toBeVisible();
            });
        });

        test.describe("Last Name", () => {
            test("should display checkmark if last name is valid", async ({ page }) => {
                const lastNameInput = page.getByTestId("lastName-textInput");
                await lastNameInput.fill("Doe");
                await expect(page.getByTestId("lastName-input-valid-icon"))
                    .toBeVisible();
            });

            test("should display x if last name is invalid", async ({ page }) => {
                const lastNameInput = page.getByTestId("lastName-textInput");
                await lastNameInput.fill("Doe!");
                await expect(page.getByTestId("lastName-input-invalid-icon"))
                    .toBeVisible();
            });
        });
    });

    test.describe("Address", () => {
        test.beforeEach(async ({ page }) => {
            const nextStepButton = page.getByTestId("next-step-button");
            await nextStepButton.click();
            await nextStepButton.click();
        });

        test.describe("Address Line", () => {
            test("should display checkmark if address line is valid", async ({ page }) => {
                const addressLineInput = page.getByTestId(
                    "addressLine-textInput",
                );
                await addressLineInput.fill("123 Main St");
                const validIcon = page.getByTestId(
                    "addressLine-input-valid-icon",
                );
                await expect(validIcon).toBeVisible();
            });

            test("should display x if address line is invalid", async ({ page }) => {
                const addressLineInput = page.getByTestId(
                    "addressLine-textInput",
                );
                await addressLineInput.fill("123 Main St!");
                await expect(page.getByTestId("addressLine-input-invalid-icon"))
                    .toBeVisible();
            });
        });

        test.describe("City", () => {
            test("should display checkmark if city is valid", async ({ page }) => {
                const cityInput = page.getByTestId("city-textInput");
                await cityInput.fill("New York");
                const validIcon = page.getByTestId("city-input-valid-icon");
                await expect(validIcon).toBeVisible();
            });

            test("should display x if city is invalid", async ({ page }) => {
                const cityInput = page.getByTestId("city-textInput");
                await cityInput.fill("New York!");
                const invalidIcon = page.getByTestId(
                    "city-input-invalid-icon",
                );
                await expect(invalidIcon).toBeVisible();
            });
        });

        test.describe("Postal Code Canada", () => {
            test("should display checkmark if postal code is valid", async ({ page }) => {
                const postalCodeInput = page.getByTestId(
                    "postalCodeCanada-textInput",
                );
                await postalCodeInput.fill("A1B 2C3");
                const validIcon = page.getByTestId(
                    "postalCodeCanada-input-valid-icon",
                );
                await expect(validIcon).toBeVisible();
            });

            test("should display x if postal code is invalid", async ({ page }) => {
                const postalCodeInput = page.getByTestId(
                    "postalCodeCanada-textInput",
                );
                await postalCodeInput.fill("A1B2C3!");
                const invalidIcon = page.getByTestId(
                    "postalCodeCanada-input-invalid-icon",
                );
                await expect(invalidIcon).toBeVisible();
            });
        });

        test.describe("Postal Code US", () => {
            test.beforeEach(async ({ page }) => {
                const countrySelectInput = page.getByTestId(
                    "country-selectInput",
                );
                await countrySelectInput.selectOption("United States");
            });

            test("should display checkmark if postal code is valid", async ({ page }) => {
                const postalCodeInput = page.getByTestId(
                    "postalCodeUS-textInput",
                );
                await postalCodeInput.fill("12345");
                const validIcon = page.getByTestId(
                    "postalCodeUS-input-valid-icon",
                );
                await expect(validIcon).toBeVisible();
            });

            test("should display x if postal code is invalid", async ({ page }) => {
                const postalCodeInput = page.getByTestId(
                    "postalCodeUS-textInput",
                );
                await postalCodeInput.fill("12345-6789!");
                const invalidIcon = page.getByTestId(
                    "postalCodeUS-input-invalid-icon",
                );
                await expect(invalidIcon).toBeVisible();
            });
        });
    });

    test.describe("Profile Picture", () => {
        test.beforeEach(async ({ page }) => {
            const nextStepButton = page.getByTestId("next-step-button");
            await nextStepButton.click();
            await nextStepButton.click();
            await nextStepButton.click();
        });

        test.describe("Profile Picture Url", () => {
            test("should display checkmark if profile picture url is valid", async ({ page }) => {
                const profilePictureInput = page.getByTestId(
                    "profilePictureUrl-textInput",
                );
                await profilePictureInput.fill(
                    "https://example.com/picture.jpg",
                );
                const validIcon = page.getByTestId(
                    "profilePictureUrl-input-valid-icon",
                );
                await expect(validIcon).toBeVisible();
            });

            test("should display x if profile picture url is invalid", async ({ page }) => {
                const profilePictureInput = page.getByTestId(
                    "profilePictureUrl-textInput",
                );
                await profilePictureInput.fill("invalid-url");
                const invalidIcon = page.getByTestId(
                    "profilePictureUrl-input-invalid-icon",
                );
                await expect(invalidIcon).toBeVisible();
            });
        });
    });

    test("Valid Registration", async ({ page }) => {
        // authentication
        const usernameInput = page.getByLabel("username");
        await usernameInput.fill("0manager");
        const emailInput = page.getByLabel("email");
        await emailInput.fill("0manager@example.com");
        const passwordInput = page.getByTestId("password-input");
        await passwordInput.fill("passwordQ1!");
        const confirmPasswordInput = page.getByTestId(
            "confirmPassword-input",
        );
        await confirmPasswordInput.fill("passwordQ1!");
        const nextStepButton = page.getByTestId("next-step-button");
        await nextStepButton.click();
        // personal
        const firstNameInput = page.getByTestId("firstName-textInput");
        await firstNameInput.fill("John");
        const lastNameInput = page.getByTestId("lastName-textInput");
        await lastNameInput.fill("Doe");
        const jobPositionSelectInput = page.getByTestId(
            "jobPosition-selectInput",
        );
        await jobPositionSelectInput.selectOption("Accounting Manager");
        const departmentSelectInput = page.getByTestId(
            "department-selectInput",
        );
        await departmentSelectInput.selectOption("Accounting");
        const storeLocationSelectInput = page.getByTestId(
            "storeLocation-selectInput",
        );
        await storeLocationSelectInput.selectOption("All Locations");
        await nextStepButton.click();
        // address
        const addressLineInput = page.getByTestId("addressLine-textInput");
        await addressLineInput.fill("123 Main St");
        const cityInput = page.getByTestId("city-textInput");
        await cityInput.fill("Montreal");
        const countrySelectInput = page.getByTestId("country-selectInput");
        await countrySelectInput.selectOption("Canada");
        const provinceSelectInput = page.getByTestId(
            "province-selectInput",
        );
        await provinceSelectInput.selectOption("Quebec");
        const postalCodeCanadaInput = page.getByTestId(
            "postalCodeCanada-textInput",
        );
        await postalCodeCanadaInput.fill("Q1B 2C3");
        await nextStepButton.click();
        // profile picture
        const profilePictureInput = page.getByTestId(
            "profilePictureUrl-textInput",
        );
        await profilePictureInput.fill(
            "https://images.pexels.com/photos/133394/pexels-photo-133394.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        );
        await nextStepButton.click();
        // form review
        // all keys and values displayed should be valid
        // authentication
        const usernameFormReviewKey = page.getByTestId(
            "username-formReview-key-valid",
        );
        await expect(usernameFormReviewKey).toBeVisible();
        const usernameFormReviewValue = page.getByTestId(
            "username-formReview-value-valid",
        );
        await expect(usernameFormReviewValue).toBeVisible();
        const emailFormReviewKey = page.getByTestId(
            "email-formReview-key-valid",
        );
        await expect(emailFormReviewKey).toBeVisible();
        const emailFormReviewValue = page.getByTestId(
            "email-formReview-value-valid",
        );
        await expect(emailFormReviewValue).toBeVisible();
        const passwordFormReviewKey = page.getByTestId(
            "password-formReview-key-valid",
        );
        await expect(passwordFormReviewKey).toBeVisible();
        const passwordFormReviewValue = page.getByTestId(
            "password-formReview-value-valid",
        );
        await expect(passwordFormReviewValue).toBeVisible();
        const confirmPasswordFormReviewKey = page.getByTestId(
            "confirmPassword-formReview-key-valid",
        );
        await expect(confirmPasswordFormReviewKey).toBeVisible();
        const confirmPasswordFormReviewValue = page.getByTestId(
            "confirmPassword-formReview-value-valid",
        );
        await expect(confirmPasswordFormReviewValue).toBeVisible();
        // personal
        const firstNameFormReviewKey = page.getByTestId(
            "firstName-formReview-key-valid",
        );
        await expect(firstNameFormReviewKey).toBeVisible();
        const firstNameFormReviewValue = page.getByTestId(
            "firstName-formReview-value-valid",
        );
        await expect(firstNameFormReviewValue).toBeVisible();
        const lastNameFormReviewKey = page.getByTestId(
            "lastName-formReview-key-valid",
        );
        await expect(lastNameFormReviewKey).toBeVisible();
        const lastNameFormReviewValue = page.getByTestId(
            "lastName-formReview-value-valid",
        );
        await expect(lastNameFormReviewValue).toBeVisible();
        const jobPositionFormReviewKey = page.getByTestId(
            "jobPosition-formReview-key-valid",
        );
        await expect(jobPositionFormReviewKey).toBeVisible();
        const jobPositionFormReviewValue = page.getByTestId(
            "jobPosition-formReview-value-valid",
        );
        await expect(jobPositionFormReviewValue).toBeVisible();
        const departmentFormReviewKey = page.getByTestId(
            "department-formReview-key-valid",
        );
        await expect(departmentFormReviewKey).toBeVisible();
        const departmentFormReviewValue = page.getByTestId(
            "department-formReview-value-valid",
        );
        await expect(departmentFormReviewValue).toBeVisible();
        const storeLocationFormReviewKey = page.getByTestId(
            "storeLocation-formReview-key-valid",
        );
        await expect(storeLocationFormReviewKey).toBeVisible();
        const storeLocationFormReviewValue = page.getByTestId(
            "storeLocation-formReview-value-valid",
        );
        await expect(storeLocationFormReviewValue).toBeVisible();
        // address
        const addressLineFormReviewKey = page.getByTestId(
            "addressLine-formReview-key-valid",
        );
        await expect(addressLineFormReviewKey).toBeVisible();
        const addressLineFormReviewValue = page.getByTestId(
            "addressLine-formReview-value-valid",
        );
        await expect(addressLineFormReviewValue).toBeVisible();
        const cityFormReviewKey = page.getByTestId(
            "city-formReview-key-valid",
        );
        await expect(cityFormReviewKey).toBeVisible();
        const cityFormReviewValue = page.getByTestId(
            "city-formReview-value-valid",
        );
        await expect(cityFormReviewValue).toBeVisible();
        const countryFormReviewKey = page.getByTestId(
            "country-formReview-key-valid",
        );
        await expect(countryFormReviewKey).toBeVisible();
        const countryFormReviewValue = page.getByTestId(
            "country-formReview-value-valid",
        );
        await expect(countryFormReviewValue).toBeVisible();
        const provinceFormReviewKey = page.getByTestId(
            "province-formReview-key-valid",
        );
        await expect(provinceFormReviewKey).toBeVisible();
        const provinceFormReviewValue = page.getByTestId(
            "province-formReview-value-valid",
        );
        await expect(provinceFormReviewValue).toBeVisible();
        const postalCodeCanadaFormReviewKey = page.getByTestId(
            "postalCodeCanada-formReview-key-valid",
        );
        await expect(postalCodeCanadaFormReviewKey).toBeVisible();
        const postalCodeCanadaFormReviewValue = page.getByTestId(
            "postalCodeCanada-formReview-value-valid",
        );
        await expect(postalCodeCanadaFormReviewValue).toBeVisible();
        // profile picture
        const profilePictureFormReviewKey = page.getByTestId(
            "profilePictureUrl-formReview-key-valid",
        );
        await expect(profilePictureFormReviewKey).toBeVisible();
        const profilePictureFormReviewValue = page.getByTestId(
            "profilePictureUrl-formReview-value-valid",
        );
        await expect(profilePictureFormReviewValue).toBeVisible();
        // submit
        const submitButton = page.getByTestId("register-submit-button-enabled");
        await expect(submitButton).toBeVisible();
    });

    test("Invalid Registration", async ({ page }) => {
        // authentication
        const usernameInput = page.getByLabel("username");
        await usernameInput.fill("0manager!");
        const emailInput = page.getByLabel("email");
        await emailInput.fill("0managerexample.com");
        const passwordInput = page.getByTestId("password-input");
        await passwordInput.fill("password");
        const confirmPasswordInput = page.getByTestId(
            "confirmPassword-input",
        );
        await confirmPasswordInput.fill("password!");
        const nextStepButton = page.getByTestId("next-step-button");
        await nextStepButton.click();
        // personal
        const firstNameInput = page.getByTestId("firstName-textInput");
        await firstNameInput.fill("John!");
        const lastNameInput = page.getByTestId("lastName-textInput");
        await lastNameInput.fill("Doe!");
        const jobPositionSelectInput = page.getByTestId(
            "jobPosition-selectInput",
        );
        await jobPositionSelectInput.selectOption("Accounting Manager");
        const departmentSelectInput = page.getByTestId(
            "department-selectInput",
        );
        await departmentSelectInput.selectOption("Accounting");
        const storeLocationSelectInput = page.getByTestId(
            "storeLocation-selectInput",
        );
        await storeLocationSelectInput.selectOption("All Locations");
        await nextStepButton.click();
        // address
        const addressLineInput = page.getByTestId("addressLine-textInput");
        await addressLineInput.fill("123 Main St!");
        const cityInput = page.getByTestId("city-textInput");
        await cityInput.fill("Montreal!");
        const countrySelectInput = page.getByTestId("country-selectInput");
        await countrySelectInput.selectOption("Canada");
        const provinceSelectInput = page.getByTestId(
            "province-selectInput",
        );
        await provinceSelectInput.selectOption("Quebec");
        const postalCodeCanadaInput = page.getByTestId(
            "postalCodeCanada-textInput",
        );
        await postalCodeCanadaInput.fill("Q1B2C3!");
        await nextStepButton.click();
        // profile picture
        const profilePictureInput = page.getByTestId(
            "profilePictureUrl-textInput",
        );
        await profilePictureInput.fill(
            "invalid-url",
        );
        await nextStepButton.click();
        // form review
        // all keys and values displayed should be invalid
        // authentication
        const usernameFormReviewKey = page.getByTestId(
            "username-formReview-key-invalid",
        );
        await expect(usernameFormReviewKey).toBeVisible();
        const usernameFormReviewValue = page.getByTestId(
            "username-formReview-value-invalid",
        );
        await expect(usernameFormReviewValue).toBeVisible();
        const emailFormReviewKey = page.getByTestId(
            "email-formReview-key-invalid",
        );
        await expect(emailFormReviewKey).toBeVisible();
        const emailFormReviewValue = page.getByTestId(
            "email-formReview-value-invalid",
        );
        await expect(emailFormReviewValue).toBeVisible();
        const passwordFormReviewKey = page.getByTestId(
            "password-formReview-key-invalid",
        );
        await expect(passwordFormReviewKey).toBeVisible();
        const passwordFormReviewValue = page.getByTestId(
            "password-formReview-value-invalid",
        );
        await expect(passwordFormReviewValue).toBeVisible();
        const confirmPasswordFormReviewKey = page.getByTestId(
            "confirmPassword-formReview-key-invalid",
        );
        await expect(confirmPasswordFormReviewKey).toBeVisible();
        const confirmPasswordFormReviewValue = page.getByTestId(
            "confirmPassword-formReview-value-invalid",
        );
        await expect(confirmPasswordFormReviewValue).toBeVisible();
        // personal
        const firstNameFormReviewKey = page.getByTestId(
            "firstName-formReview-key-invalid",
        );
        await expect(firstNameFormReviewKey).toBeVisible();
        const firstNameFormReviewValue = page.getByTestId(
            "firstName-formReview-value-invalid",
        );
        await expect(firstNameFormReviewValue).toBeVisible();
        const lastNameFormReviewKey = page.getByTestId(
            "lastName-formReview-key-invalid",
        );
        await expect(lastNameFormReviewKey).toBeVisible();
        const lastNameFormReviewValue = page.getByTestId(
            "lastName-formReview-value-invalid",
        );
        await expect(lastNameFormReviewValue).toBeVisible();
        const jobPositionFormReviewKey = page.getByTestId(
            "jobPosition-formReview-key-valid",
        );
        await expect(jobPositionFormReviewKey).toBeVisible();
        const jobPositionFormReviewValue = page.getByTestId(
            "jobPosition-formReview-value-valid",
        );
        await expect(jobPositionFormReviewValue).toBeVisible();
        const departmentFormReviewKey = page.getByTestId(
            "department-formReview-key-valid",
        );
        await expect(departmentFormReviewKey).toBeVisible();
        const departmentFormReviewValue = page.getByTestId(
            "department-formReview-value-valid",
        );
        await expect(departmentFormReviewValue).toBeVisible();
        const storeLocationFormReviewKey = page.getByTestId(
            "storeLocation-formReview-key-valid",
        );
        await expect(storeLocationFormReviewKey).toBeVisible();
        const storeLocationFormReviewValue = page.getByTestId(
            "storeLocation-formReview-value-valid",
        );
        await expect(storeLocationFormReviewValue).toBeVisible();
        // address
        const addressLineFormReviewKey = page.getByTestId(
            "addressLine-formReview-key-invalid",
        );
        await expect(addressLineFormReviewKey).toBeVisible();
        const addressLineFormReviewValue = page.getByTestId(
            "addressLine-formReview-value-invalid",
        );
        await expect(addressLineFormReviewValue).toBeVisible();
        const cityFormReviewKey = page.getByTestId(
            "city-formReview-key-invalid",
        );
        await expect(cityFormReviewKey).toBeVisible();
        const cityFormReviewValue = page.getByTestId(
            "city-formReview-value-invalid",
        );
        await expect(cityFormReviewValue).toBeVisible();
        const countryFormReviewKey = page.getByTestId(
            "country-formReview-key-valid",
        );
        await expect(countryFormReviewKey).toBeVisible();
        const countryFormReviewValue = page.getByTestId(
            "country-formReview-value-valid",
        );
        await expect(countryFormReviewValue).toBeVisible();
        const provinceFormReviewKey = page.getByTestId(
            "province-formReview-key-valid",
        );
        await expect(provinceFormReviewKey).toBeVisible();
        const provinceFormReviewValue = page.getByTestId(
            "province-formReview-value-valid",
        );
        await expect(provinceFormReviewValue).toBeVisible();
        const postalCodeCanadaFormReviewKey = page.getByTestId(
            "postalCodeCanada-formReview-key-invalid",
        );
        await expect(postalCodeCanadaFormReviewKey).toBeVisible();
        const postalCodeCanadaFormReviewValue = page.getByTestId(
            "postalCodeCanada-formReview-value-invalid",
        );
        await expect(postalCodeCanadaFormReviewValue).toBeVisible();
        // profile picture
        const profilePictureFormReviewKey = page.getByTestId(
            "profilePictureUrl-formReview-key-invalid",
        );
        await expect(profilePictureFormReviewKey).toBeVisible();
        const profilePictureFormReviewValue = page.getByTestId(
            "profilePictureUrl-formReview-value-invalid",
        );
        await expect(profilePictureFormReviewValue).toBeVisible();
        // submit
        const submitButton = page.getByTestId(
            "register-submit-button-disabled",
        );
        await expect(submitButton).toBeVisible();
    });
});
