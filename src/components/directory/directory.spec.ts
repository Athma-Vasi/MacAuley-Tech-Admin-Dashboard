import { expect, test } from "@playwright/test";
import { Orientation } from "react-d3-tree";
import { shuffle } from "simple-statistics";
import { UserDocument } from "../../types";
import { DIRECTORY_USER_DOCUMENTS } from "./data";
import {
    DepartmentsWithDefaultKey,
    StoreLocationsWithDefaultKey,
} from "./types";
import { returnIsStoreLocationDisabled } from "./utils";

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
    const directoryNavlink = page.getByTestId("directory-navlink");
    await directoryNavlink.click();
    await page.waitForURL("http://localhost:5173/dashboard/directory");
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

function generateDirectoryInputsPermutations() {
    const departments: DepartmentsWithDefaultKey[] = [
        "All Departments",
        "Executive Management",
        "Human Resources",
        "Store Administration",
        "Office Administration",
        "Accounting",
        "Sales",
        "Marketing",
        "Information Technology",
        "Repair Technicians",
        "Field Service Technicians",
        "Logistics and Inventory",
        "Customer Service",
        "Maintenance",
    ];
    const shuffledDepartments = shuffle(departments);

    const storeLocations: StoreLocationsWithDefaultKey[] = [
        "All Locations",
        "Edmonton",
        "Calgary",
        "Vancouver",
    ];
    const shuffledStoreLocations = shuffle(storeLocations);

    const orientations: Orientation[] = ["horizontal", "vertical"];
    const shuffledOrientations = shuffle(orientations);

    return shuffledDepartments.reduce<
        Array<{
            department: DepartmentsWithDefaultKey;
            storeLocation: StoreLocationsWithDefaultKey;
            orientation: Orientation;
        }>
    >((acc, department) => {
        shuffledStoreLocations.forEach((storeLocation) => {
            shuffledOrientations.forEach((orientation) => {
                const isStoreLocationDisabled = returnIsStoreLocationDisabled(
                    department,
                );
                const correctStoreLocation = isStoreLocationDisabled
                    ? "All Locations"
                    : storeLocation;

                acc.push({
                    department,
                    storeLocation: correctStoreLocation,
                    orientation,
                });
            });
        });

        return acc;
    }, []);
}

function findUsers(
    userDocuments: Array<Omit<UserDocument, "password">>,
    department: DepartmentsWithDefaultKey,
    storeLocation: StoreLocationsWithDefaultKey,
) {
    return userDocuments.reduce<Array<Omit<UserDocument, "password">>>(
        (acc, user) => {
            if (
                user.department === department &&
                user.storeLocation === storeLocation
            ) {
                acc.push(user);
            }

            return acc;
        },
        [],
    );
}

const directoryInputsPermutations = generateDirectoryInputsPermutations();

test.describe("Directory", () => {
    test("should render the ceo card", async ({ page }) => {
        const firstNameElement = page.getByTestId(
            "directory-card-firstName-Alex",
        );
        await expect(firstNameElement).toBeVisible();
        const usernameElement = page.getByTestId(
            "directory-card-username-ceo",
        );
        await expect(usernameElement).toBeVisible();
        const jobPositionElement = page.getByTestId(
            "directory-card-jobPosition-Chief Executive Officer",
        );
        await expect(jobPositionElement).toBeVisible();
        const locationElement = page.getByTestId(
            "directory-card-location-Truro-Canada",
        );
        await expect(locationElement).toBeVisible();
    });

    test("should handle a random inputs permutation", async ({ page }) => {
        await Promise.all(
            directoryInputsPermutations.slice(0, 1).map(
                async ({ department, storeLocation, orientation }) => {
                    const departmentSelectInput = page.getByTestId(
                        "department-selectInput",
                    );
                    await expect(departmentSelectInput).toBeVisible();
                    const storeLocationSelectInput = page.getByTestId(
                        "storeLocation-selectInput",
                    );
                    await expect(storeLocationSelectInput).toBeVisible();
                    const orientationSelectInput = page.getByTestId(
                        "orientation-selectInput",
                    );
                    await expect(orientationSelectInput).toBeVisible();
                    await departmentSelectInput.selectOption(department);

                    const isStoreLocationDisabled =
                        returnIsStoreLocationDisabled(
                            department,
                        );

                    if (!isStoreLocationDisabled) {
                        await storeLocationSelectInput.selectOption(
                            storeLocation,
                        );
                    }

                    await orientationSelectInput.selectOption(orientation);

                    const foundUsers = findUsers(
                        DIRECTORY_USER_DOCUMENTS,
                        department,
                        isStoreLocationDisabled
                            ? "All Locations"
                            : storeLocation,
                    );

                    console.log({ foundUsers });

                    await Promise.all(
                        foundUsers.map(async (user) => {
                            const usernameElement = page.getByTestId(
                                `directory-card-username-${user.username}`,
                            );
                            await expect(usernameElement).toBeVisible();
                        }),
                    );
                },
            ),
        );
    });
});
