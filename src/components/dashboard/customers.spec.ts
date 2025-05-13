import { expect, test } from "@playwright/test";
import { shuffle } from "simple-statistics";
import {
    CustomerChurnRetentionCalendarChartsKey,
    CustomerMetricsNewReturningChartsKey,
} from "./customer/chartsData";
import {
    CUSTOMER_CHURN_RETENTION_YAXIS_KEY_TO_CARDS_KEY_MAP,
    CUSTOMER_NEW_YAXIS_KEY_TO_CARDS_KEY_MAP,
    CUSTOMER_RETURNING_YAXIS_KEY_TO_CARDS_KEY_MAP,
} from "./customer/constants";
import { CustomerMetricsCategory } from "./customer/types";
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
    const customersNavlink = page.getByTestId("customers-navlink");
    await customersNavlink.click();
    await page.waitForURL("http://localhost:5173/dashboard/customers");
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

function generateDashboardCustomersQueryParamsPermutations<
    YAxisKey extends string = string,
>(
    kind: "new" | "returning" | "churn",
) {
    const storeLocations: AllStoreLocations[] = [
        "All Locations",
        "Calgary",
        "Edmonton",
        "Vancouver",
    ];
    const shuffledStoreLocations = shuffle(storeLocations);

    const customerMetricCategories: CustomerMetricsCategory[] = [
        "new",
        "returning",
        "churn",
    ];
    const shuffledCustomerMetricCategories = shuffle(
        customerMetricCategories,
    );

    const calendarViews: DashboardCalendarView[] = [
        "Daily",
        "Monthly",
        "Yearly",
    ];
    const shuffledCalendarViews = shuffle(calendarViews);

    const yAxisNRKeys = [
        "total",
        "all",
        "overview",
        "repair",
        "sales",
        "inStore",
        "online",
    ];
    const shuffledYAxisNRKeys = shuffle(yAxisNRKeys);

    const yAxisChurnKeys = [
        "churnRate",
        "retentionRate",
    ];
    const shuffledYAxisChurnKeys = shuffle(yAxisChurnKeys);

    const shuffledYAxisKeys = kind === "new" || kind === "returning"
        ? shuffledYAxisNRKeys
        : shuffledYAxisChurnKeys;

    return shuffledStoreLocations.reduce<
        Array<{
            storeLocation: AllStoreLocations;
            customerMetricCategory: CustomerMetricsCategory;
            calendarView: DashboardCalendarView;
            yAxisKey: YAxisKey;
        }>
    >(
        (acc, storeLocation) => {
            shuffledCalendarViews.forEach((calendarView) => {
                shuffledCustomerMetricCategories.forEach(
                    (customerMetricCategory) => {
                        shuffledYAxisKeys.forEach((yAxisKey) => {
                            acc.push({
                                storeLocation,
                                customerMetricCategory,
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

const customersNewPermutations =
    generateDashboardCustomersQueryParamsPermutations<
        CustomerMetricsNewReturningChartsKey
    >("new");

const customersReturningPermutations =
    generateDashboardCustomersQueryParamsPermutations<
        CustomerMetricsNewReturningChartsKey
    >("returning");

const customersChurnPermutations =
    generateDashboardCustomersQueryParamsPermutations<
        CustomerChurnRetentionCalendarChartsKey
    >("churn");

test.describe("Dashboard", () => {
    test.describe("Customers", () => {
        test.describe("New", () => {
            test("should correctly handle a valid random permutation", async ({ page }) => {
                await Promise.all(
                    customersNewPermutations.slice(0, 1).map(
                        async (customersNewPermutation) => {
                            const {
                                calendarView,
                                customerMetricCategory,
                                storeLocation,
                                yAxisKey,
                            } = customersNewPermutation;

                            const storeLocationSelectInput = page.getByTestId(
                                "storeLocation-selectInput",
                            );
                            await expect(storeLocationSelectInput)
                                .toBeVisible();
                            storeLocationSelectInput.selectOption(
                                storeLocation,
                            );
                            await page.waitForURL(
                                "http://localhost:5173/dashboard/customers",
                            );

                            const titleHeadingTestId =
                                `dashboard-${calendarView}-Customers`;
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

                            // customer metric category
                            const customerMetricCategorySelectInput = page
                                .getByTestId(
                                    "customer metrics-selectInput",
                                );
                            await expect(customerMetricCategorySelectInput)
                                .toBeVisible();
                            customerMetricCategorySelectInput.selectOption(
                                customerMetricCategory,
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

                            const headings =
                                CUSTOMER_NEW_YAXIS_KEY_TO_CARDS_KEY_MAP
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

        test.describe("Returning", () => {
            test("should correctly handle a valid random permutation", async ({ page }) => {
                await Promise.all(
                    customersReturningPermutations.slice(0, 1).map(
                        async (customersReturningPermutation) => {
                            const {
                                calendarView,
                                customerMetricCategory,
                                storeLocation,
                                yAxisKey,
                            } = customersReturningPermutation;

                            const storeLocationSelectInput = page.getByTestId(
                                "storeLocation-selectInput",
                            );
                            await expect(storeLocationSelectInput)
                                .toBeVisible();
                            storeLocationSelectInput.selectOption(
                                storeLocation,
                            );
                            await page.waitForURL(
                                "http://localhost:5173/dashboard/customers",
                            );

                            const titleHeadingTestId =
                                `dashboard-${calendarView}-Customers`;
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

                            // customer metric category
                            const customerMetricCategorySelectInput = page
                                .getByTestId(
                                    "customer metrics-selectInput",
                                );
                            await expect(customerMetricCategorySelectInput)
                                .toBeVisible();
                            customerMetricCategorySelectInput.selectOption(
                                customerMetricCategory,
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

                            const headings =
                                CUSTOMER_RETURNING_YAXIS_KEY_TO_CARDS_KEY_MAP
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

                                            const statisticsButton = page
                                                .getByTestId(
                                                    `statistics-button-${heading}`,
                                                );
                                            await expect(statisticsButton)
                                                .toBeVisible();
                                            await statisticsButton.click();

                                            const statisticsModal = page
                                                .getByTestId(
                                                    `statistics-modal-${heading}`,
                                                );
                                            await expect(statisticsModal)
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

        test.describe("Churn", () => {
            test("should correctly handle a valid random permutation", async ({ page }) => {
                await Promise.all(
                    customersChurnPermutations.slice(0, 1).map(
                        async (customersChurnPermutation) => {
                            const {
                                calendarView,
                                customerMetricCategory,
                                storeLocation,
                                yAxisKey,
                            } = customersChurnPermutation;

                            const storeLocationSelectInput = page.getByTestId(
                                "storeLocation-selectInput",
                            );
                            await expect(storeLocationSelectInput)
                                .toBeVisible();
                            storeLocationSelectInput.selectOption(
                                storeLocation,
                            );
                            await page.waitForURL(
                                "http://localhost:5173/dashboard/customers",
                            );

                            const titleHeadingTestId =
                                `dashboard-${calendarView}-Customers`;
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

                            // customer metric category
                            const customerMetricCategorySelectInput = page
                                .getByTestId(
                                    "customer metrics-selectInput",
                                );
                            await expect(customerMetricCategorySelectInput)
                                .toBeVisible();
                            customerMetricCategorySelectInput.selectOption(
                                customerMetricCategory,
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

                            const headings =
                                CUSTOMER_CHURN_RETENTION_YAXIS_KEY_TO_CARDS_KEY_MAP
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

                                            const statisticsButton = page
                                                .getByTestId(
                                                    `statistics-button-${heading}`,
                                                );
                                            await expect(statisticsButton)
                                                .toBeVisible();
                                            await statisticsButton.click();

                                            const statisticsModal = page
                                                .getByTestId(
                                                    `statistics-modal-${heading}`,
                                                );
                                            await expect(statisticsModal)
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
});
