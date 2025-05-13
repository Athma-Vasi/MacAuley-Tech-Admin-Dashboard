import { expect, test } from "@playwright/test";
import { shuffle } from "simple-statistics";
import {
    FinancialMetricsBarLineChartsKey,
    FinancialMetricsCalendarChartsKeyPERT,
    FinancialMetricsOtherMetricsChartsKey,
    FinancialMetricsPieChartsKey,
} from "./chartsData";
import { FINANCIAL_YAXIS_KEY_TO_CARDS_KEY_MAP } from "./constants";
import { FinancialMetricCategory } from "./types";
import { AllStoreLocations, DashboardCalendarView } from "../types";

test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/login");
    const usernameInput = page.getByTestId("username-textInput");
    const passwordInput = page.getByTestId("password-textInput");
    const loginButton = page.getByTestId("login-button");
    await usernameInput.fill("manager");
    await passwordInput.fill("passwordQ1!");
    await loginButton.click();
    await page.waitForURL("http://localhost:5173/dashboard/financials");
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

function generateDashboardFinancialsQueryParamsPermutations(
    kind: "pert" | "otherMetrics",
) {
    const storeLocations: AllStoreLocations[] = [
        "All Locations",
        "Calgary",
        "Edmonton",
        "Vancouver",
    ];
    const shuffledStoreLocations = shuffle(storeLocations);

    const financialMetricCategories: FinancialMetricCategory[] = kind === "pert"
        ? [
            "expenses",
            "profit",
            "revenue",
            "transactions",
        ]
        : [
            "otherMetrics",
        ];
    const shuffledFinancialMetricCategories = shuffle(
        financialMetricCategories,
    );

    const calendarViews: DashboardCalendarView[] = [
        "Daily",
        "Monthly",
        "Yearly",
    ];
    const shuffledCalendarViews = shuffle(calendarViews);

    const yAxisPERTKeys: Array<
        | FinancialMetricsPieChartsKey
        | FinancialMetricsBarLineChartsKey
        | FinancialMetricsCalendarChartsKeyPERT
    > = [
        "total",
        "all",
        "overview",
        "repair",
        "sales",
        "inStore",
        "online",
    ];
    const shuffledYAxisPERTKeys = shuffle(yAxisPERTKeys);

    const yAxisOtherMetricsKeys: Array<
        FinancialMetricsOtherMetricsChartsKey
    > = [
        "netProfitMargin",
        "averageOrderValue",
        "conversionRate",
    ];
    const shuffledYAxisOtherMetricsKeys = shuffle(yAxisOtherMetricsKeys);

    const shuffledYAxisKeys = kind === "pert"
        ? shuffledYAxisPERTKeys
        : shuffledYAxisOtherMetricsKeys;

    return shuffledStoreLocations.reduce<
        Array<{
            storeLocation: AllStoreLocations;
            financialMetricCategory: FinancialMetricCategory;
            calendarView: DashboardCalendarView;
            yAxisKey:
                | FinancialMetricsPieChartsKey
                | FinancialMetricsBarLineChartsKey
                | FinancialMetricsCalendarChartsKeyPERT
                | FinancialMetricsOtherMetricsChartsKey;
        }>
    >(
        (acc, storeLocation) => {
            shuffledCalendarViews.forEach((calendarView) => {
                shuffledFinancialMetricCategories.forEach(
                    (financialMetricCategory) => {
                        shuffledYAxisKeys.forEach((yAxisKey) => {
                            acc.push({
                                storeLocation,
                                financialMetricCategory,
                                calendarView,
                                yAxisKey,
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

const financialsPERTPermutations =
    generateDashboardFinancialsQueryParamsPermutations("pert");

const financialsOtherMetricsPermutations =
    generateDashboardFinancialsQueryParamsPermutations("otherMetrics");

test.describe("Dashboard", () => {
    test.describe("Financials", () => {
        test.describe("PERT", () => {
            test("should correctly handle a valid random permutation", async ({ page }) => {
                await Promise.all(
                    financialsPERTPermutations.slice(0, 1).map(
                        async (financialsPERTPermutation) => {
                            const {
                                calendarView,
                                financialMetricCategory,
                                storeLocation,
                                yAxisKey,
                            } = financialsPERTPermutation;

                            const storeLocationSelectInput = page.getByTestId(
                                "storeLocation-selectInput",
                            );
                            await expect(storeLocationSelectInput)
                                .toBeVisible();
                            storeLocationSelectInput.selectOption(
                                storeLocation,
                            );
                            await page.waitForURL(
                                "http://localhost:5173/dashboard/financials",
                            );

                            const titleHeadingTestId =
                                `dashboard-${calendarView}-Financials`;
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

                            const calendarViewSelectInput = page.getByTestId(
                                "calendar view-selectInput",
                            );
                            await expect(calendarViewSelectInput).toBeVisible();
                            calendarViewSelectInput.selectOption(
                                calendarView,
                            );

                            // const titleHeadingTestId =
                            //     `dashboard-${calendarView}-Financials`;
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

                            // financial metric category
                            const financialMetricCategorySelectInput = page
                                .getByTestId(
                                    "financial metrics-selectInput",
                                );
                            await expect(financialMetricCategorySelectInput)
                                .toBeVisible();
                            financialMetricCategorySelectInput.selectOption(
                                financialMetricCategory,
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
                                FINANCIAL_YAXIS_KEY_TO_CARDS_KEY_MAP
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

        test.describe("Other Metrics", () => {
            test("should correctly handle a valid random permutation", async ({ page }) => {
                await Promise.all(
                    financialsOtherMetricsPermutations.slice(0, 1).map(
                        async (financialsOtherMetricsPermutation) => {
                            const {
                                calendarView,
                                financialMetricCategory,
                                storeLocation,
                                yAxisKey,
                            } = financialsOtherMetricsPermutation;

                            const storeLocationSelectInput = page.getByTestId(
                                "storeLocation-selectInput",
                            );
                            await expect(storeLocationSelectInput)
                                .toBeVisible();
                            storeLocationSelectInput.selectOption(
                                storeLocation,
                            );
                            await page.waitForURL(
                                "http://localhost:5173/dashboard/financials",
                            );

                            const titleHeadingTestId =
                                `dashboard-${calendarView}-Financials`;
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

                            const calendarViewSelectInput = page.getByTestId(
                                "calendar view-selectInput",
                            );
                            await expect(calendarViewSelectInput).toBeVisible();
                            calendarViewSelectInput.selectOption(
                                calendarView,
                            );

                            // const titleHeadingTestId =
                            //     `dashboard-${calendarView}-Financials`;
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
                            // financial metric category
                            const financialMetricCategorySelectInput = page
                                .getByTestId(
                                    "financial metrics-selectInput",
                                );
                            await expect(financialMetricCategorySelectInput)
                                .toBeVisible();
                            financialMetricCategorySelectInput.selectOption(
                                financialMetricCategory,
                            );

                            const headings =
                                FINANCIAL_YAXIS_KEY_TO_CARDS_KEY_MAP
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
