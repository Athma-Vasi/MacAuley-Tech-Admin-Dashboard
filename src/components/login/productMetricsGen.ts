import { SafeResult, StoreLocation } from "../../types";
import { createSafeErrorResult, createSafeSuccessResult } from "../../utils";
import {
    BusinessMetric,
    DaysInMonthsInYears,
    LocationYearSpread,
    ProductCategory,
    ProductDailyMetric,
    ProductMetric,
    ProductMonthlyMetric,
    ProductYearlyMetric,
} from "../dashboard/types";
import {
    createProductCategoryUnitsRevenueTuple,
    createRandomNumber,
} from "../dashboard/utils";

/**
 *  productMetrics: {
    name: ProductCategory;

    yearlyMetrics: {
      year: string;
      unitsSold: {
        total: number;
        online: number;
        inStore: number;
      };
      revenue: {
        total: number;
        online: number;
        inStore: number;
      };

      monthlyMetrics: {
        month: string;
        unitsSold: {
          total: number;
          online: number;
          inStore: number;
        };
        revenue: {
          total: number;
          online: number;
          inStore: number;
        };

        dailyMetrics: {
          day: string;
          unitsSold: {
            total: number;
            online: number;
            inStore: number;
          };
          revenue: {
            total: number;
            online: number;
            inStore: number;
          };
        }[];
      }[];
    }[];
  }
 */

function createRandomProductMetrics({
    daysInMonthsInYears,
    productCategories,
    storeLocation,
}: {
    daysInMonthsInYears: DaysInMonthsInYears;
    productCategories: ProductCategory[];
    storeLocation: StoreLocation;
}): SafeResult<ProductMetric[]> {
    /**
     * ratio of online transactions to total transactions spread between [min, max] per year
     */
    const YEAR_ONLINE_TRANSACTIONS_SPREAD: LocationYearSpread = {
        Edmonton: {
            "2013": [0.15, 0.25],
            "2014": [0.2, 0.25],
            "2015": [0.25, 0.3],
            "2016": [0.3, 0.35],
            "2017": [0.35, 0.4],
            "2018": [0.4, 0.45],
            "2019": [0.45, 0.5],
            "2020": [0.65, 0.85],
            "2021": [0.65, 0.75],
            "2022": [0.65, 0.75],
            "2023": [0.6, 0.7],
            "2024": [0.55, 0.65],
            "2025": [0.5, 0.6],
        },
        Calgary: {
            "2017": [0.35, 0.4],
            "2018": [0.4, 0.45],
            "2019": [0.45, 0.5],
            "2020": [0.65, 0.85],
            "2021": [0.65, 0.75],
            "2022": [0.65, 0.75],
            "2023": [0.6, 0.7],
            "2024": [0.55, 0.65],
            "2025": [0.5, 0.6],
        },
        Vancouver: {
            "2019": [0.45, 0.5],
            "2020": [0.65, 0.85],
            "2021": [0.65, 0.75],
            "2022": [0.65, 0.75],
            "2023": [0.6, 0.7],
            "2024": [0.55, 0.65],
            "2025": [0.5, 0.6],
        },
    };

    /**
     * - random daily unitsSold spread between [min, max] per year
     */
    const YEAR_UNITS_SOLD_SPREAD: LocationYearSpread = {
        Edmonton: {
            "2013": [1, 2],
            "2014": [2, 3],
            "2015": [2, 5],
            "2016": [3, 7],
            "2017": [5, 9],
            "2018": [5, 11],
            "2019": [7, 13],
            "2020": [15, 17],
            "2021": [17, 19],
            "2022": [17, 19],
            "2023": [13, 15],
            "2024": [12, 14],
            "2025": [10, 12],
        },
        Calgary: {
            "2017": [1, 2],
            "2018": [2, 4],
            "2019": [3, 7],
            "2020": [7, 9],
            "2021": [9, 11],
            "2022": [9, 11],
            "2023": [5, 7],
            "2024": [4, 6],
            "2025": [3, 5],
        },
        Vancouver: {
            "2019": [1, 2],
            "2020": [3, 5],
            "2021": [5, 9],
            "2022": [5, 9],
            "2023": [2, 4],
            "2024": [1, 3],
            "2025": [1, 2],
        },
    };

    try {
        const randomProductMetrics = productCategories.map(
            (productCategory) => {
                const yearlyProductMetrics = Array.from(daysInMonthsInYears)
                    .map(
                        (yearTuple) => {
                            const [year, daysInMonthsMap] = yearTuple;

                            const monthlyProductMetrics = Array.from(
                                daysInMonthsMap,
                            ).map(
                                (monthTuple) => {
                                    const [month, daysRange] = monthTuple;

                                    const dailyProductMetrics = daysRange
                                        .map((day) => {
                                            const [
                                                dailyProductUnitsSold,
                                                dailyProductSalesRevenue,
                                            ] = createProductCategoryUnitsRevenueTuple(
                                                {
                                                    productCategory,
                                                    storeLocation,
                                                    year,
                                                    yearUnitsSoldSpread:
                                                        YEAR_UNITS_SOLD_SPREAD,
                                                },
                                            );

                                            const randomOnlineFraction =
                                                createRandomNumber({
                                                    storeLocation,
                                                    year,
                                                    yearUnitsSpread:
                                                        YEAR_ONLINE_TRANSACTIONS_SPREAD,
                                                    defaultMax: 0.3,
                                                    defaultMin: 0.1,
                                                    isFraction: true,
                                                });

                                            const dailyProductOnlineUnitsSold =
                                                Math
                                                    .round(
                                                        dailyProductUnitsSold *
                                                            randomOnlineFraction,
                                                    );

                                            const dailyProductInStoreUnitsSold =
                                                Math
                                                    .round(
                                                        dailyProductUnitsSold -
                                                            dailyProductOnlineUnitsSold,
                                                    );

                                            const dailyProductOnlineRevenue =
                                                Math
                                                    .round(
                                                        dailyProductSalesRevenue *
                                                            randomOnlineFraction,
                                                    );

                                            const dailyProductInStoreRevenue =
                                                Math
                                                    .round(
                                                        dailyProductSalesRevenue -
                                                            dailyProductOnlineRevenue,
                                                    );

                                            const dailyProductMetric:
                                                ProductDailyMetric = {
                                                    day,
                                                    unitsSold: {
                                                        inStore:
                                                            dailyProductInStoreUnitsSold,
                                                        online:
                                                            dailyProductOnlineUnitsSold,
                                                        total:
                                                            dailyProductUnitsSold,
                                                    },
                                                    revenue: {
                                                        inStore:
                                                            dailyProductInStoreRevenue,
                                                        online:
                                                            dailyProductOnlineRevenue,
                                                        total:
                                                            dailyProductSalesRevenue,
                                                    },
                                                };

                                            return dailyProductMetric;
                                        });

                                    const [
                                        monthlyProductTotalUnitsSold,
                                        monthlyProductOnlineUnitsSold,
                                        monthlyProductInStoreUnitsSold,
                                        monthlyProductTotalRevenue,
                                        monthlyProductOnlineRevenue,
                                        monthlyProductInStoreRevenue,
                                    ] = dailyProductMetrics.reduce(
                                        (
                                            monthlyProductMetricsAcc,
                                            dailyProductMetric,
                                        ) => {
                                            monthlyProductMetricsAcc[0] +=
                                                dailyProductMetric.unitsSold
                                                    .total;
                                            monthlyProductMetricsAcc[1] +=
                                                dailyProductMetric.unitsSold
                                                    .online;
                                            monthlyProductMetricsAcc[2] +=
                                                dailyProductMetric.unitsSold
                                                    .inStore;
                                            monthlyProductMetricsAcc[3] +=
                                                dailyProductMetric.revenue
                                                    .total;
                                            monthlyProductMetricsAcc[4] +=
                                                dailyProductMetric.revenue
                                                    .online;
                                            monthlyProductMetricsAcc[5] +=
                                                dailyProductMetric.revenue
                                                    .inStore;

                                            return monthlyProductMetricsAcc;
                                        },
                                        [0, 0, 0, 0, 0, 0],
                                    );

                                    const monthlyProductMetric:
                                        ProductMonthlyMetric = {
                                            month,
                                            unitsSold: {
                                                inStore:
                                                    monthlyProductInStoreUnitsSold,
                                                online:
                                                    monthlyProductOnlineUnitsSold,
                                                total:
                                                    monthlyProductTotalUnitsSold,
                                            },
                                            revenue: {
                                                inStore:
                                                    monthlyProductInStoreRevenue,
                                                online:
                                                    monthlyProductOnlineRevenue,
                                                total:
                                                    monthlyProductTotalRevenue,
                                            },
                                            dailyMetrics: dailyProductMetrics,
                                        };

                                    return monthlyProductMetric;
                                },
                            );

                            const [
                                yearlyProductTotalUnitsSold,
                                yearlyProductOnlineUnitsSold,
                                yearlyProductInStoreUnitsSold,
                                yearlyProductTotalRevenue,
                                yearlyProductOnlineRevenue,
                                yearlyProductInStoreRevenue,
                            ] = monthlyProductMetrics.reduce(
                                (
                                    yearlyProductMetricsAcc,
                                    monthlyProductMetric,
                                ) => {
                                    yearlyProductMetricsAcc[0] +=
                                        monthlyProductMetric.unitsSold
                                            .total;
                                    yearlyProductMetricsAcc[1] +=
                                        monthlyProductMetric.unitsSold
                                            .online;
                                    yearlyProductMetricsAcc[2] +=
                                        monthlyProductMetric.unitsSold
                                            .inStore;
                                    yearlyProductMetricsAcc[3] +=
                                        monthlyProductMetric.revenue.total;
                                    yearlyProductMetricsAcc[4] +=
                                        monthlyProductMetric.revenue.online;
                                    yearlyProductMetricsAcc[5] +=
                                        monthlyProductMetric.revenue
                                            .inStore;

                                    return yearlyProductMetricsAcc;
                                },
                                [0, 0, 0, 0, 0, 0],
                            );

                            const yearlyProductMetric: ProductYearlyMetric = {
                                year,
                                unitsSold: {
                                    inStore: yearlyProductInStoreUnitsSold,
                                    online: yearlyProductOnlineUnitsSold,
                                    total: yearlyProductTotalUnitsSold,
                                },
                                revenue: {
                                    inStore: yearlyProductInStoreRevenue,
                                    online: yearlyProductOnlineRevenue,
                                    total: yearlyProductTotalRevenue,
                                },
                                monthlyMetrics: monthlyProductMetrics,
                            };

                            return yearlyProductMetric;
                        },
                    );

                const randomProductMetrics: ProductMetric = {
                    name: productCategory,
                    yearlyMetrics: yearlyProductMetrics,
                };

                return randomProductMetrics;
            },
        );

        return createSafeSuccessResult(randomProductMetrics);
    } catch (error: unknown) {
        return createSafeErrorResult(error);
    }
}

/**
 * - aggregate product metrics for each store location into 'All Products' metrics
 */
function createAggregatedProductMetrics(
    productMetrics: Omit<ProductMetric[], "All Products">,
): SafeResult<ProductMetric> {
    const PRODUCT_METRIC_TEMPLATE: ProductMetric = {
        name: "All Products",
        yearlyMetrics: [],
    };

    try {
        const aggregatedProductMetrics = productMetrics.reduce<ProductMetric>(
            (productMetricsAcc, productMetric) => {
                const PRODUCT_METRIC_TEMPLATE_DAILY: ProductDailyMetric = {
                    day: "",
                    unitsSold: {
                        inStore: 0,
                        online: 0,
                        total: 0,
                    },
                    revenue: {
                        inStore: 0,
                        online: 0,
                        total: 0,
                    },
                };
                const PRODUCT_METRIC_TEMPLATE_MONTHLY: ProductMonthlyMetric = {
                    month: "January",
                    unitsSold: {
                        inStore: 0,
                        online: 0,
                        total: 0,
                    },
                    revenue: {
                        inStore: 0,
                        online: 0,
                        total: 0,
                    },
                    dailyMetrics: [],
                };

                const PRODUCT_METRIC_TEMPLATE_YEARLY: ProductYearlyMetric = {
                    year: "2021",
                    unitsSold: {
                        inStore: 0,
                        online: 0,
                        total: 0,
                    },
                    revenue: {
                        inStore: 0,
                        online: 0,
                        total: 0,
                    },
                    monthlyMetrics: [],
                };

                const { yearlyMetrics } = productMetric;

                const aggregatedYearlyProductMetrics = yearlyMetrics.map(
                    (productYearlyMetric) => {
                        const { year, revenue, unitsSold, monthlyMetrics } =
                            productYearlyMetric;

                        const existingYearlyMetric =
                            productMetricsAcc.yearlyMetrics.find(
                                (productYearlyMetricAcc) =>
                                    productYearlyMetricAcc.year === year,
                            ) ?? { ...PRODUCT_METRIC_TEMPLATE_YEARLY, year };

                        const aggregatedYearlyMetric = {
                            ...existingYearlyMetric,
                            revenue: {
                                ...existingYearlyMetric.revenue,
                                total: existingYearlyMetric.revenue.total +
                                    revenue.total,
                                online: existingYearlyMetric.revenue.online +
                                    revenue.online,
                                inStore: existingYearlyMetric.revenue.inStore +
                                    revenue.inStore,
                            },
                            unitsSold: {
                                ...existingYearlyMetric.unitsSold,
                                total: existingYearlyMetric.unitsSold.total +
                                    unitsSold.total,
                                online: existingYearlyMetric.unitsSold.online +
                                    unitsSold.online,
                                inStore:
                                    existingYearlyMetric.unitsSold.inStore +
                                    unitsSold.inStore,
                            },
                        };

                        const aggregatedMonthlyProductMetrics = monthlyMetrics
                            .map(
                                (productMonthlyMetric) => {
                                    const {
                                        month,
                                        dailyMetrics,
                                        revenue,
                                        unitsSold,
                                    } = productMonthlyMetric;

                                    const existingMonthlyMetric =
                                        aggregatedYearlyMetric.monthlyMetrics
                                            .find(
                                                (productMonthlyMetricAcc) =>
                                                    productMonthlyMetricAcc
                                                        .month === month,
                                            ) ??
                                            {
                                                ...PRODUCT_METRIC_TEMPLATE_MONTHLY,
                                                month,
                                            };

                                    const aggregatedDailyRepairMetrics =
                                        dailyMetrics
                                            .map(
                                                (productDailyMetric) => {
                                                    const {
                                                        day,
                                                        revenue,
                                                        unitsSold,
                                                    } = productDailyMetric;

                                                    const existingDailyMetric =
                                                        existingMonthlyMetric
                                                            .dailyMetrics
                                                            .find(
                                                                (
                                                                    productDailyMetricAcc,
                                                                ) => productDailyMetricAcc
                                                                    .day ===
                                                                    day,
                                                            ) ??
                                                            {
                                                                ...PRODUCT_METRIC_TEMPLATE_DAILY,
                                                                day,
                                                            };

                                                    const aggregatedDailyMetric =
                                                        {
                                                            ...existingDailyMetric,
                                                            revenue: {
                                                                ...existingDailyMetric
                                                                    .revenue,
                                                                total:
                                                                    existingDailyMetric
                                                                        .revenue
                                                                        .total +
                                                                    revenue
                                                                        .total,
                                                                online:
                                                                    existingDailyMetric
                                                                        .revenue
                                                                        .online +
                                                                    revenue
                                                                        .online,
                                                                inStore:
                                                                    existingDailyMetric
                                                                        .revenue
                                                                        .inStore +
                                                                    revenue
                                                                        .inStore,
                                                            },
                                                            unitsSold: {
                                                                ...existingDailyMetric
                                                                    .unitsSold,
                                                                total:
                                                                    existingDailyMetric
                                                                        .unitsSold
                                                                        .total +
                                                                    unitsSold
                                                                        .total,
                                                                online:
                                                                    existingDailyMetric
                                                                        .unitsSold
                                                                        .online +
                                                                    unitsSold
                                                                        .online,
                                                                inStore:
                                                                    existingDailyMetric
                                                                        .unitsSold
                                                                        .inStore +
                                                                    unitsSold
                                                                        .inStore,
                                                            },
                                                        };

                                                    return aggregatedDailyMetric;
                                                },
                                            );

                                    const aggregatedMonthlyMetric = {
                                        ...existingMonthlyMetric,
                                        revenue: {
                                            ...existingMonthlyMetric.revenue,
                                            total: existingMonthlyMetric.revenue
                                                .total +
                                                revenue.total,
                                            online:
                                                existingMonthlyMetric.revenue
                                                    .online +
                                                revenue.online,
                                            inStore:
                                                existingMonthlyMetric.revenue
                                                    .inStore +
                                                revenue.inStore,
                                        },
                                        unitsSold: {
                                            ...existingMonthlyMetric.unitsSold,
                                            total:
                                                existingMonthlyMetric.unitsSold
                                                    .total +
                                                unitsSold.total,
                                            online:
                                                existingMonthlyMetric.unitsSold
                                                    .online +
                                                unitsSold.online,
                                            inStore:
                                                existingMonthlyMetric.unitsSold
                                                    .inStore +
                                                unitsSold.inStore,
                                        },
                                        dailyMetrics:
                                            aggregatedDailyRepairMetrics,
                                    };

                                    return aggregatedMonthlyMetric;
                                },
                            );

                        aggregatedYearlyMetric.monthlyMetrics =
                            aggregatedMonthlyProductMetrics;

                        return aggregatedYearlyMetric;
                    },
                );

                productMetricsAcc.yearlyMetrics =
                    aggregatedYearlyProductMetrics;

                return productMetricsAcc;
            },
            PRODUCT_METRIC_TEMPLATE,
        );

        return createSafeSuccessResult(aggregatedProductMetrics);
    } catch (error: unknown) {
        return createSafeErrorResult(error);
    }
}

/**
 * - aggregate all store locations' product metrics into a separate 'All Locations' store
 */
function createAllLocationsAggregatedProductMetrics(
    businessMetrics: BusinessMetric[],
): SafeResult<ProductMetric[]> {
    // find all product metrics for each store location
    const initialProductMetrics: Record<string, ProductMetric[]> = {
        edmontonProductMetrics: [],
        calgaryProductMetrics: [],
        vancouverProductMetrics: [],
    };

    try {
        const {
            calgaryProductMetrics,
            edmontonProductMetrics,
            vancouverProductMetrics,
        } = businessMetrics.reduce((productMetricsAcc, businessMetric) => {
            const { storeLocation, productMetrics } = businessMetric;

            switch (storeLocation) {
                case "Calgary": {
                    productMetricsAcc.calgaryProductMetrics = productMetrics;
                    break;
                }
                case "Edmonton": {
                    productMetricsAcc.edmontonProductMetrics = structuredClone(
                        productMetrics,
                    );
                    break;
                }
                // case "Vancouver"
                default: {
                    productMetricsAcc.vancouverProductMetrics = productMetrics;
                    break;
                }
            }

            return productMetricsAcc;
        }, initialProductMetrics);

        // as edmonton metrics are a superset of all other stores' metrics, it is being used as
        // the base to which all other store locations' metrics are aggregated into

        const aggregatedBaseProductMetrics =
            aggregateStoresIntoBaseProductMetrics({
                baseProductMetrics: edmontonProductMetrics,
                storeProductMetrics: calgaryProductMetrics,
            });

        const aggregatedAllLocationsProductMetrics =
            aggregateStoresIntoBaseProductMetrics({
                baseProductMetrics: aggregatedBaseProductMetrics,
                storeProductMetrics: vancouverProductMetrics,
            });

        function aggregateStoresIntoBaseProductMetrics({
            baseProductMetrics,
            storeProductMetrics,
        }: {
            baseProductMetrics: ProductMetric[];
            storeProductMetrics: ProductMetric[];
        }) {
            return storeProductMetrics.reduce<ProductMetric[]>(
                (baseProductMetricsAcc, storeProductMetric) => {
                    const { name, yearlyMetrics } = storeProductMetric;

                    const baseProductMetric = baseProductMetricsAcc.find(
                        (baseProductMetric) => baseProductMetric.name === name,
                    );
                    if (!baseProductMetric) {
                        return baseProductMetricsAcc;
                    }

                    yearlyMetrics.forEach((storeYearlyMetric) => {
                        const {
                            year,
                            revenue: yearlyRevenue,
                            unitsSold: yearlyUnitsSold,
                            monthlyMetrics,
                        } = storeYearlyMetric;

                        const baseYearlyMetric = baseProductMetric
                            .yearlyMetrics.find(
                                (baseYearlyMetric) =>
                                    baseYearlyMetric.year === year,
                            );
                        if (!baseYearlyMetric) {
                            return baseProductMetricsAcc;
                        }

                        baseYearlyMetric.revenue.total += yearlyRevenue.total;
                        baseYearlyMetric.revenue.online += yearlyRevenue.online;
                        baseYearlyMetric.revenue.inStore +=
                            yearlyRevenue.inStore;

                        baseYearlyMetric.unitsSold.total +=
                            yearlyUnitsSold.total;
                        baseYearlyMetric.unitsSold.online +=
                            yearlyUnitsSold.online;
                        baseYearlyMetric.unitsSold.inStore +=
                            yearlyUnitsSold.inStore;

                        monthlyMetrics.forEach((storeMonthlyMetric) => {
                            const {
                                month,
                                revenue: monthlyRevenue,
                                unitsSold: monthlyUnitsSold,
                                dailyMetrics,
                            } = storeMonthlyMetric;

                            const baseMonthlyMetric = baseYearlyMetric
                                .monthlyMetrics.find(
                                    (baseMonthlyMetric) =>
                                        baseMonthlyMetric.month === month,
                                );
                            if (!baseMonthlyMetric) {
                                return baseProductMetricsAcc;
                            }

                            baseMonthlyMetric.revenue.total +=
                                monthlyRevenue.total;
                            baseMonthlyMetric.revenue.online +=
                                monthlyRevenue.online;
                            baseMonthlyMetric.revenue.inStore +=
                                monthlyRevenue.inStore;

                            baseMonthlyMetric.unitsSold.total +=
                                monthlyUnitsSold.total;
                            baseMonthlyMetric.unitsSold.online +=
                                monthlyUnitsSold.online;
                            baseMonthlyMetric.unitsSold.inStore +=
                                monthlyUnitsSold.inStore;

                            dailyMetrics.forEach((storeDailyMetric) => {
                                const { day, revenue, unitsSold } =
                                    storeDailyMetric;

                                const baseDailyMetric = baseMonthlyMetric
                                    .dailyMetrics.find(
                                        (baseDailyMetric) =>
                                            baseDailyMetric.day === day,
                                    );
                                if (!baseDailyMetric) {
                                    return baseProductMetricsAcc;
                                }

                                baseDailyMetric.revenue.total += revenue.total;
                                baseDailyMetric.revenue.online +=
                                    revenue.online;
                                baseDailyMetric.revenue.inStore +=
                                    revenue.inStore;

                                baseDailyMetric.unitsSold.total +=
                                    unitsSold.total;
                                baseDailyMetric.unitsSold.online +=
                                    unitsSold.online;
                                baseDailyMetric.unitsSold.inStore +=
                                    unitsSold.inStore;
                            });
                        });
                    });

                    return baseProductMetricsAcc;
                },
                baseProductMetrics,
            );
        }

        return createSafeSuccessResult(aggregatedAllLocationsProductMetrics);
    } catch (error: unknown) {
        return createSafeErrorResult(error);
    }
}

export {
    createAggregatedProductMetrics,
    createAllLocationsAggregatedProductMetrics,
    createRandomProductMetrics,
};
