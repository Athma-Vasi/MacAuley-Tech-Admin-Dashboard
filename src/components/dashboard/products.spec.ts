import { expect, test } from "@playwright/test";
import { shuffle } from "simple-statistics";
import { ProductMetricsChartKey } from "./product/chartsData";
import { PRODUCT_BAR_LINE_YAXIS_KEY_TO_CARDS_KEY_MAP } from "./product/constants";
import { ProductMetricCategory, ProductSubMetric } from "./product/types";
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
    const productsNavlink = page.getByTestId("products-navlink");
    await productsNavlink.click();
    await page.waitForURL("http://localhost:5173/dashboard/products");
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

function generateDashboardProductsQueryParamsPermutations<
    YAxisKey extends string = string,
>() {
    const storeLocations: AllStoreLocations[] = [
        "All Locations",
        "Calgary",
        "Edmonton",
        "Vancouver",
    ];
    const shuffledStoreLocations = shuffle(storeLocations);

    const productMetricCategories: Array<ProductMetricCategory> = [
        "Accessory",
        "All Products",
        "Central Processing Unit (CPU)",
        "Computer Case",
        "Desktop Computer",
        "Display",
        "Graphics Processing Unit (GPU)",
        "Headphone",
        "Keyboard",
        "Memory (RAM)",
        "Microphone",
        "Motherboard",
        "Mouse",
        "Power Supply Unit (PSU)",
        "Speaker",
        "Storage",
        "Webcam",
    ];
    const shuffledProductMetricCategories = shuffle(productMetricCategories);

    const productSubMetricCategories: Array<ProductSubMetric> = [
        "unitsSold",
        "revenue",
    ];
    const shuffledProductSubMetricCategories = shuffle(
        productSubMetricCategories,
    );

    const calendarViews: DashboardCalendarView[] = [
        "Daily",
        "Monthly",
        "Yearly",
    ];
    const shuffledCalendarViews = shuffle(calendarViews);

    const yAxisKeys = [
        "total",
        "overview",
        "inStore",
        "online",
    ];
    const shuffledYAxisKeys = shuffle(yAxisKeys);

    return shuffledStoreLocations.reduce<
        Array<{
            calendarView: DashboardCalendarView;
            productMetricCategory: ProductMetricCategory;
            productSubMetricCategory: ProductSubMetric;
            storeLocation: AllStoreLocations;
            yAxisKey: YAxisKey;
        }>
    >(
        (acc, storeLocation) => {
            shuffledCalendarViews.forEach((calendarView) => {
                shuffledProductMetricCategories.forEach(
                    (productMetricCategory) => {
                        shuffledProductSubMetricCategories.forEach(
                            (productSubMetricCategory) => {
                                shuffledYAxisKeys.forEach((yAxisKey) => {
                                    acc.push({
                                        storeLocation,
                                        productMetricCategory,
                                        productSubMetricCategory,
                                        calendarView,
                                        yAxisKey: yAxisKey as YAxisKey,
                                    });
                                });
                            },
                        );
                    },
                );
            });

            return acc;
        },
        [],
    );
}

const productsPermutations = generateDashboardProductsQueryParamsPermutations<
    ProductMetricsChartKey
>();

test.describe("Dashboard", () => {
    test.describe("Products", () => {
        test("should correctly handle a valid random permutation", async ({ page }) => {
            await Promise.all(
                productsPermutations.slice(0, 1).map(
                    async (productsPermutation) => {
                        const {
                            calendarView,
                            productMetricCategory,
                            productSubMetricCategory,
                            storeLocation,
                            yAxisKey,
                        } = productsPermutation;

                        const storeLocationSelectInput = page.getByTestId(
                            "storeLocation-selectInput",
                        );
                        await expect(storeLocationSelectInput)
                            .toBeVisible();
                        storeLocationSelectInput.selectOption(
                            storeLocation,
                        );
                        await page.waitForURL(
                            "http://localhost:5173/dashboard/products",
                        );

                        const titleHeadingTestId =
                            `dashboard-${calendarView}-Products`;
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

                        // product metric category
                        const productMetricCategorySelectInput = page
                            .getByTestId(
                                "product metrics-selectInput",
                            );
                        await expect(productMetricCategorySelectInput)
                            .toBeVisible();
                        productMetricCategorySelectInput.selectOption(
                            productMetricCategory,
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

                        // product sub metric category
                        const productSubMetricCategorySelectInput = page
                            .getByTestId(
                                "product sub-metrics-selectInput",
                            );
                        await expect(
                            productSubMetricCategorySelectInput,
                        ).toBeVisible();
                        productSubMetricCategorySelectInput.selectOption(
                            productSubMetricCategory,
                        );
                        const titleHeadingFMSC = page.getByTestId(
                            titleHeadingTestId,
                        );
                        expect(await titleHeadingFMSC.isVisible());
                        const barChartFMSC = page.getByTestId(
                            "responsive-bar-chart",
                        );
                        expect(await barChartFMSC.isVisible());
                        const lineChartFMSC = page.getByTestId(
                            "responsive-line-chart",
                        );
                        expect(await lineChartFMSC.isVisible());
                        const radialChartFMSC = page.getByTestId(
                            "responsive-radial-bar-chart",
                        );
                        expect(await radialChartFMSC.isVisible());
                        const chartTitlesFMSC = page.getByTestId(
                            "chart-titles",
                        );
                        expect(await chartTitlesFMSC.isVisible());
                        const chartControlsCardFMSC = page.getByTestId(
                            "chart-controls-card",
                        );
                        expect(await chartControlsCardFMSC.isVisible());

                        const headings =
                            PRODUCT_BAR_LINE_YAXIS_KEY_TO_CARDS_KEY_MAP
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
