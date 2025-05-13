import { expect, test } from "@playwright/test";
import { shuffle } from "simple-statistics";
import { REPAIR_YAXIS_KEY_TO_CARDS_KEY_MAP } from "./repair/constants";
import { RepairMetricCategory, RepairSubMetric } from "./repair/types";
import { AllStoreLocations, DashboardCalendarView } from "./types";

test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/login");
    const usernameInput = page.getByTestId("username-textInput");
    const passwordInput = page.getByTestId("password-textInput");
    const loginButton = page.getByTestId("login-button");
    await usernameInput.fill("manager");
    await passwordInput.fill("passwordQ1!");
    await loginButton.click();
    await page.waitForURL("http://localhost:5173/dashboard/financials");
    const repairsNavlink = page.getByTestId("repairs-navlink");
    await repairsNavlink.click();
    await page.waitForURL("http://localhost:5173/dashboard/repairs");
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

function generateDashboardRepairsQueryParamsPermutations<
    YAxisKey extends string = string,
>() {
    const storeLocations: AllStoreLocations[] = [
        "All Locations",
        "Calgary",
        "Edmonton",
        "Vancouver",
    ];
    const shuffledStoreLocations = shuffle(storeLocations);

    const repairMetricCategories: Array<RepairMetricCategory> = [
        "Accessory",
        "All Repairs",
        "Audio/Video",
        "Computer Component",
        "Electronic Device",
        "Mobile Device",
        "Peripheral",
    ];
    const shuffledRepairMetricCategories = shuffle(repairMetricCategories);

    const calendarViews: DashboardCalendarView[] = [
        "Daily",
        "Monthly",
        "Yearly",
    ];
    const shuffledCalendarViews = shuffle(calendarViews);

    const yAxisKeys = [
        "revenue",
        "unitsRepaired",
    ];
    const shuffledYAxisKeys = shuffle(yAxisKeys);

    return shuffledStoreLocations.reduce<
        Array<{
            calendarView: DashboardCalendarView;
            repairMetricCategory: RepairMetricCategory;
            storeLocation: AllStoreLocations;
            yAxisKey: YAxisKey;
        }>
    >(
        (acc, storeLocation) => {
            shuffledCalendarViews.forEach((calendarView) => {
                shuffledRepairMetricCategories.forEach(
                    (repairMetricCategory) => {
                        shuffledYAxisKeys.forEach((yAxisKey) => {
                            acc.push({
                                storeLocation,
                                repairMetricCategory,
                                calendarView,
                                yAxisKey: yAxisKey as YAxisKey,
                            });
                        });
                    },
                );
            });

            return acc;
        },
        [],
    );
}

const repairsPermutations = generateDashboardRepairsQueryParamsPermutations<
    RepairSubMetric
>();

test.describe("Dashboard", () => {
    test.describe("Repairs", () => {
        test("should correctly handle a valid random permutation", async ({ page }) => {
            await Promise.all(
                repairsPermutations.slice(0, 1).map(
                    async (repairsPermutation) => {
                        const {
                            calendarView,
                            repairMetricCategory,
                            storeLocation,
                            yAxisKey,
                        } = repairsPermutation;

                        const storeLocationSelectInput = page.getByTestId(
                            "storeLocation-selectInput",
                        );
                        await expect(storeLocationSelectInput)
                            .toBeVisible();
                        storeLocationSelectInput.selectOption(
                            storeLocation,
                        );
                        await page.waitForURL(
                            "http://localhost:5173/dashboard/repairs",
                        );

                        const titleHeadingTestId =
                            `dashboard-${calendarView}-Repairs`;
                        const titleHeadingSL = page.getByTestId(
                            titleHeadingTestId,
                        );
                        expect(await titleHeadingSL.isVisible());

                        const yAxisSelectInput = page.getByTestId(
                            "Y-Axis-selectInput",
                        );
                        await expect(yAxisSelectInput).toBeVisible();
                        yAxisSelectInput.selectOption(yAxisKey);

                        const barChartSL = page.getByTestId(
                            "responsive-bar-chart",
                        );
                        await expect(barChartSL).toBeVisible();

                        const lineChartSL = page.getByTestId(
                            "responsive-line-chart",
                        );
                        await expect(lineChartSL).toBeVisible();

                        const radialChartSL = page.getByTestId(
                            "responsive-radial-bar-chart",
                        );
                        await expect(radialChartSL).toBeVisible();

                        const chartTitlesSL = page.getByTestId(
                            "chart-titles",
                        );
                        await expect(chartTitlesSL).toBeVisible();

                        const chartControlsCardSL = page.getByTestId(
                            "chart-controls-card",
                        );
                        await expect(chartControlsCardSL).toBeVisible();

                        // calendar view
                        const calendarViewSelectInput = page.getByTestId(
                            "calendar view-selectInput",
                        );
                        await expect(calendarViewSelectInput).toBeVisible();
                        calendarViewSelectInput.selectOption(
                            calendarView,
                        );

                        const titleHeadingCV = page.getByTestId(
                            titleHeadingTestId,
                        );
                        expect(await titleHeadingCV.isVisible());

                        const barChartCV = page.getByTestId(
                            "responsive-bar-chart",
                        );
                        expect(await barChartCV.isVisible());

                        const lineChartCV = page.getByTestId(
                            "responsive-line-chart",
                        );
                        expect(await lineChartCV.isVisible());

                        const radialChartCV = page.getByTestId(
                            "responsive-radial-bar-chart",
                        );
                        expect(await radialChartCV.isVisible());

                        const chartTitlesCV = page.getByTestId(
                            "chart-titles",
                        );
                        expect(await chartTitlesCV.isVisible());

                        const chartControlsCardCV = page.getByTestId(
                            "chart-controls-card",
                        );
                        expect(await chartControlsCardCV.isVisible());

                        // repair metric category
                        const repairMetricCategorySelectInput = page
                            .getByTestId(
                                "repairs-selectInput",
                            );
                        await expect(repairMetricCategorySelectInput)
                            .toBeVisible();
                        repairMetricCategorySelectInput.selectOption(
                            repairMetricCategory,
                        );

                        const titleHeadingFMC = page.getByTestId(
                            titleHeadingTestId,
                        );
                        expect(await titleHeadingFMC.isVisible());

                        const barChartFMC = page.getByTestId(
                            "responsive-bar-chart",
                        );
                        expect(await barChartFMC.isVisible());

                        const lineChartFMC = page.getByTestId(
                            "responsive-line-chart",
                        );
                        expect(await lineChartFMC.isVisible());

                        const radialChartFMC = page.getByTestId(
                            "responsive-radial-bar-chart",
                        );
                        expect(await radialChartFMC.isVisible());

                        const chartTitlesFMC = page.getByTestId(
                            "chart-titles",
                        );
                        expect(await chartTitlesFMC.isVisible());

                        const chartControlsCardFMC = page.getByTestId(
                            "chart-controls-card",
                        );
                        expect(await chartControlsCardFMC.isVisible());

                        const headings = REPAIR_YAXIS_KEY_TO_CARDS_KEY_MAP
                            .get(
                                yAxisKey,
                            );
                        if (headings) {
                            await Promise.all(
                                Array.from(headings).map(
                                    async (heading) => {
                                        const statisticsCard = page
                                            .getByTestId(
                                                `statistics-card-${heading}`,
                                            );
                                        await expect(statisticsCard)
                                            .toBeVisible();
                                    },
                                ),
                            );
                        }
                    },
                ),
            );
        });
    });
});
