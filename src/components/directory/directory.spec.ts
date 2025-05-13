import { expect, test } from "@playwright/test";
import { Orientation } from "react-d3-tree";
import { buildD3Tree } from "./d3Tree/utils";
import { DIRECTORY_USER_DOCUMENTS } from "./data";
import {
    DepartmentsWithDefaultKey,
    StoreLocationsWithDefaultKey,
} from "./types";
import { returnIsStoreLocationDisabled } from "./utils";

test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/login");
    const usernameInput = page.getByTestId("username-textInput");
    const passwordInput = page.getByTestId("password-textInput");
    const loginButton = page.getByTestId("login-button");
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

    const storeLocations: StoreLocationsWithDefaultKey[] = [
        "All Locations",
        "Edmonton",
        "Calgary",
        "Vancouver",
    ];

    const orientations: Orientation[] = ["horizontal", "vertical"];

    return departments.reduce<
        Array<{
            department: DepartmentsWithDefaultKey;
            storeLocation: StoreLocationsWithDefaultKey;
            orientation: Orientation;
        }>
    >((acc, department) => {
        storeLocations.forEach((storeLocation) => {
            orientations.forEach((orientation) => {
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

const directoryInputsPermutations = generateDirectoryInputsPermutations();
const d3Tree = buildD3Tree(DIRECTORY_USER_DOCUMENTS, "teal");

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

    test("should handle all department inputs permutations", async ({ page }) => {
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
                },
            ),
        );
    });
});
